import { supabase } from '../lib/supabaseClient';

/**
 * خدمة إدارة الكوبونات والعروض (Coupons CRUD Service)
 */
export const couponService = {
  /**
   * 1. READ: التحقق من كود الخصم وتطبيقه
   * @param {string} code - كود الخصم المدخل
   * @param {number} subtotal - المجموع الفرعي للطلب
   */
  async validateCoupon(code, subtotal = 0) {
    try {
      if (!code || code.trim() === '') {
        throw new Error('يرجى إدخال رمز كود الخصم');
      }

      const cleanCode = code.trim().toUpperCase();

      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', cleanCode)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        throw new Error('كود الخصم غير صحيح أو منتهي الصلاحية');
      }

      if (data.min_spend && subtotal < data.min_spend) {
        throw new Error(`الحد الأدنى لتفعيل هذا الكود هو ${data.min_spend} ر.س`);
      }

      const discountRate = data.discount_percentage / 100;
      const discountAmount = Math.round(subtotal * discountRate);

      return {
        success: true,
        coupon: data,
        discountPercentage: data.discount_percentage,
        discountAmount,
        message: `تم تفعيل كود الخصم بنجاح (${data.discount_percentage}%)`
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * 2. READ: جلب جميع الكوبونات للوحة التحكم
   */
  async getCoupons() {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);

      return { success: true, data: data || [] };
    } catch (err) {
      return { success: false, error: err.message, data: [] };
    }
  },

  /**
   * 3. CREATE: إنشاء كود خصم جديد
   */
  async createCoupon({ code, discountPercentage, minSpend = 0, description = '' }) {
    try {
      if (!code || !discountPercentage) {
        throw new Error('الرمز ونسبة الخصم حقول إلزامية');
      }

      const payload = {
        code: code.trim().toUpperCase(),
        discount_percentage: Number(discountPercentage),
        min_spend: Number(minSpend || 0),
        description: description.trim(),
        is_active: true,
        usage_count: 0
      };

      const { data, error } = await supabase
        .from('coupons')
        .insert([payload])
        .select()
        .single();

      if (error) throw new Error(error.message);

      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * 4. UPDATE: تفعيل / تعطيل كود الخصم
   */
  async toggleCoupon(id, currentStatus) {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .update({ is_active: !currentStatus })
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * 5. DELETE: حذف كود خصم
   */
  async deleteCoupon(id) {
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};

export default couponService;
