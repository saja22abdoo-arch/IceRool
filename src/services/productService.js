import { supabase } from '../lib/supabaseClient';

/**
 * خدمة إدارة المنتجات والنكهات (Products CRUD Service)
 * تدعم العمليات الكاملة مع التحقق من صحة المدخلات ومعالجة الأخطاء
 */
export const productService = {
  /**
   * 1. READ: جلب المنتجات مع الفلترة والترتيب والبحث
   * @param {Object} options - خيارات البحث والفلترة
   * @param {string} [options.categoryId] - معرف التصنيف
   * @param {string} [options.search] - نص البحث
   * @param {string} [options.sortBy] - نوع الترتيب ('price-asc', 'price-desc', 'rating')
   */
  async getProducts({ categoryId = 'all', search = '', sortBy = 'default' } = {}) {
    try {
      let query = supabase
        .from('products')
        .select(`
          id,
          name,
          category_id,
          price,
          original_price,
          rating,
          reviews_count,
          image_url,
          badge,
          short_desc,
          description,
          calories,
          weight,
          prep_time,
          is_available,
          created_at,
          category:categories(id, name, slug),
          sizes:product_sizes(id, name, price_delta),
          toppings:product_toppings(id, name, price)
        `);

      // تصفية حسب التصنيف
      if (categoryId && categoryId !== 'all') {
        query = query.eq('category_id', categoryId);
      }

      // البحث في الاسم أو الوصف
      if (search && search.trim() !== '') {
        const cleanSearch = search.trim();
        query = query.or(`name.ilike.%${cleanSearch}%,short_desc.ilike.%${cleanSearch}%`);
      }

      // ترتيب النتائج
      if (sortBy === 'price-asc') {
        query = query.order('price', { ascending: true });
      } else if (sortBy === 'price-desc') {
        query = query.order('price', { ascending: false });
      } else if (sortBy === 'rating') {
        query = query.order('rating', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error('[productService.getProducts] Database Error:', error.message);
        throw new Error(`فشل جلب المنتجات: ${error.message}`);
      }

      return { success: true, data: data || [] };
    } catch (err) {
      return { success: false, error: err.message, data: [] };
    }
  },

  /**
   * 2. READ: جلب منتج محدد بواسطة المعرف
   * @param {string} id - معرف المنتج
   */
  async getProductById(id) {
    try {
      if (!id) throw new Error('معرف المنتج مطلوب');

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, slug),
          sizes:product_sizes(*),
          toppings:product_toppings(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(`تعذر العثور على المنتج: ${error.message}`);
      }

      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message, data: null };
    }
  },

  /**
   * 3. CREATE: إضافة منتج جديد
   * @param {Object} product - بيانات المنتج
   */
  async createProduct(product) {
    try {
      // التحقق من صحة المدخلات (Input Validation)
      if (!product.name || product.name.trim().length < 3) {
        throw new Error('اسم المنتج يجب أن يحتوي على 3 أحرف على الأقل');
      }
      if (!product.price || Number(product.price) <= 0) {
        throw new Error('السعر يجب أن يكون رقماً أكبر من صفر');
      }
      if (!product.category_id) {
        throw new Error('يرجى تحديد تصنيف المنتج');
      }

      const payload = {
        name: product.name.trim(),
        category_id: product.category_id,
        price: Number(product.price),
        original_price: product.original_price ? Number(product.original_price) : null,
        image_url: product.image_url || 'https://images.unsplash.com/photo-1563805042-7684c019e1cb',
        badge: product.badge || null,
        short_desc: product.short_desc || '',
        description: product.description || '',
        calories: product.calories || '210 سعرة',
        weight: product.weight || '250 مل',
        prep_time: product.prep_time || 'جاهز فوراً',
        is_available: product.is_available ?? true,
      };

      const { data, error } = await supabase
        .from('products')
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error('[productService.createProduct] Error:', error.message);
        throw new Error(`فشل إضافة المنتج: ${error.message}`);
      }

      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * 4. UPDATE: تحديث بيانات منتج
   * @param {string} id - معرف المنتج
   * @param {Object} updates - الحقول المراد تحديثها
   */
  async updateProduct(id, updates) {
    try {
      if (!id) throw new Error('معرف المنتج مطلوب للتحديث');

      // حماية الحقول والتحقق
      const payload = { ...updates };
      if (payload.price !== undefined) {
        payload.price = Number(payload.price);
        if (payload.price <= 0) throw new Error('السعر غير صالح');
      }
      if (payload.original_price !== undefined && payload.original_price !== null) {
        payload.original_price = Number(payload.original_price);
      }

      payload.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`فشل تحديث المنتج: ${error.message}`);
      }

      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * 5. DELETE: حذف منتج نهائياً
   * @param {string} id - معرف المنتج
   */
  async deleteProduct(id) {
    try {
      if (!id) throw new Error('معرف المنتج مطلوب للحذف');

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`فشل حذف المنتج: ${error.message}`);
      }

      return { success: true, message: 'تم حذف المنتج بنجاح' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
};

export default productService;
