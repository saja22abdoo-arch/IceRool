import { supabase } from '../lib/supabaseClient';

/**
 * خدمة إدارة الطلبات وعمليات الدفع (Orders CRUD & Realtime Service)
 */
export const orderService = {
  /**
   * 1. READ: جلب جميع الطلبات مع عناصرها
   * @param {Object} [filter] - فلتر اختياري حسب الحالة
   */
  async getOrders({ status = 'all' } = {}) {
    try {
      let query = supabase
        .from('orders')
        .select(`
          id,
          order_number,
          customer_name,
          customer_phone,
          delivery_address,
          notes,
          payment_method,
          subtotal,
          discount,
          delivery_fee,
          total,
          status,
          created_at,
          items:order_items(
            id,
            product_id,
            product_name,
            size_name,
            toppings,
            quantity,
            unit_price,
            total_price,
            product:products(image_url)
          )
        `)
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`فشل جلب الطلبات: ${error.message}`);
      }

      return { success: true, data: data || [] };
    } catch (err) {
      return { success: false, error: err.message, data: [] };
    }
  },

  /**
   * 2. CREATE: إنشاء طلب جديد مع إدراج عناصره في order_items
   * @param {Object} orderData - بيانات الطلب وعناصره
   */
  async createOrder({
    customerName,
    customerPhone,
    deliveryAddress,
    notes = '',
    paymentMethod = 'Apple Pay',
    items = [],
    subtotal,
    discount = 0,
    deliveryFee = 0,
    total
  }) {
    try {
      // التحقق من صحة المدخلات
      if (!customerName || customerName.trim().length < 2) {
        throw new Error('يرجى إدخال اسم العميل بشكل صحيح');
      }
      if (!customerPhone || customerPhone.trim().length < 8) {
        throw new Error('يرجى إدخال رقم هاتف صحيح للتوصيل');
      }
      if (!deliveryAddress || deliveryAddress.trim().length < 5) {
        throw new Error('يرجى إدخال عنوان التوصيل بالتفصيل');
      }
      if (!items || items.length === 0) {
        throw new Error('لا يمكن إتمام طلب بسلة فارغة');
      }

      // توليد رقم طلب مرجعي فريد
      const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

      // 1. إدراج رأس الطلب في جدول orders
      const orderPayload = {
        order_number: orderNumber,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        delivery_address: deliveryAddress.trim(),
        notes: notes.trim(),
        payment_method: paymentMethod,
        subtotal: Number(subtotal),
        discount: Number(discount),
        delivery_fee: Number(deliveryFee),
        total: Number(total),
        status: 'preparing' // الحالة الأولية
      };

      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert([orderPayload])
        .select()
        .single();

      if (orderError) {
        throw new Error(`فشل إنشاء رأس الطلب: ${orderError.message}`);
      }

      // 2. إعداد وإدراج عناصر الطلب في جدول order_items
      const orderItemsPayload = items.map(item => ({
        order_id: newOrder.id,
        product_id: item.productId || null,
        product_name: item.name,
        size_name: item.sizeName || 'كوب مفرد',
        toppings: item.toppings || [],
        quantity: item.quantity,
        unit_price: Number(item.unitPrice),
        total_price: Number(item.totalPrice)
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsPayload);

      if (itemsError) {
        console.error('[orderService] Failed to insert items:', itemsError.message);
        // في الأنظمة الحساسة يمكن استدعاء Rollback عبر RPC
      }

      return {
        success: true,
        orderId: newOrder.id,
        orderNumber: newOrder.order_number,
        data: newOrder
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * 3. UPDATE: تحديث حالة الطلب (لوحة التحكم)
   * @param {string} orderId - معرف الطلب
   * @param {string} newStatus - الحالة الجديدة ('preparing' | 'delivering' | 'delivered' | 'cancelled')
   */
  async updateOrderStatus(orderId, newStatus) {
    try {
      const allowedStatuses = ['preparing', 'delivering', 'delivered', 'cancelled'];
      if (!allowedStatuses.includes(newStatus)) {
        throw new Error('حالة الطلب المحددة غير صالحة');
      }

      const { data, error } = await supabase
        .from('orders')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        throw new Error(`فشل تحديث حالة الطلب: ${error.message}`);
      }

      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * 4. REALTIME: الاشتراك اللحظي في تحديثات الطلبات
   * مفيد للوحة التحكم لتلقي أي طلب جديد فور وصوله من الزبون دون الحاجة لتحديث الصفحة!
   * @param {Function} onNewOrder - دالة تُستدعى عند إضافة طلب جديد
   * @param {Function} onStatusChange - دالة تُستدعى عند تغيير حالة طلب
   */
  subscribeToOrders(onNewOrder, onStatusChange) {
    const channel = supabase
      .channel('orders-live-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          if (onNewOrder) onNewOrder(payload.new);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          if (onStatusChange) onStatusChange(payload.new);
        }
      )
      .subscribe();

    // إرجاع دالة إلغاء الاشتراك (Cleanup function)
    return () => {
      supabase.removeChannel(channel);
    };
  }
};

export default orderService;
