import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, CheckCircle, CreditCard, Banknote, Smartphone, MapPin, User, Phone, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';

const CheckoutModal = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, cart, cartTotal, deliveryFee, discountAmount, createOrder } = useCart();
  
  const [formData, setFormData] = useState({
    name: 'سلطان القحطاني',
    phone: '0551234567',
    city: 'الرياض',
    district: 'حي الصحافة',
    street: 'شارع العليا العام - مبنى 42',
    notes: 'يرجى وضع الثلج الجاف الإضافي والتوصيل عند الباب الخارجي',
    paymentMethod: 'apple_pay'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const fullAddress = `${formData.city} - ${formData.district}، ${formData.street}`;
      const paymentLabels = {
        apple_pay: 'Apple Pay',
        card: 'بطاقة مدى / ائتمانية',
        cash: 'الدفع نقداً عند الاستلام'
      };

      createOrder({
        name: formData.name,
        phone: formData.phone,
        address: fullAddress,
        notes: formData.notes,
        paymentMethod: paymentLabels[formData.paymentMethod] || 'Apple Pay'
      });

      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={() => !isSubmitting && setIsCheckoutOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-[#fdf8f7] rounded-3xl shadow-2xl border border-[#C94238]/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#4F1A16] via-[#782722] to-[#9C322B] text-white p-6 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F24F44]" />
                <h3 className="text-xl font-black">إتمام الطلب والتوصيل</h3>
              </div>
              <p className="text-xs text-[#FAF0EE]/75 mt-1">تجهيز سريع وتغليف بالثلج الجاف لضمان البرودة</p>
            </div>
            <button
              onClick={() => setIsCheckoutOpen(false)}
              disabled={isSubmitting}
              className="text-[#FAF0EE]/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Customer Details */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#4F1A16] flex items-center gap-2 border-b border-[#C94238]/15 pb-2">
                <User className="w-4 h-4 text-[#9C322B]" />
                <span>بيانات المستلم</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#782722] mb-1">الاسم الكريم</label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#C94238]/20 rounded-xl px-3 py-2 text-sm text-[#4F1A16] focus:outline-hidden focus:border-[#9C322B]"
                    placeholder="محمد عبدالله"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#782722] mb-1">رقم الجوال</label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#C94238]/20 rounded-xl px-3 py-2 text-sm text-[#4F1A16] focus:outline-hidden focus:border-[#9C322B]"
                    placeholder="05XXXXXXXX"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#4F1A16] flex items-center gap-2 border-b border-[#C94238]/15 pb-2">
                <MapPin className="w-4 h-4 text-[#9C322B]" />
                <span>عنوان التوصيل</span>
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#782722] mb-1">المدينة</label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#C94238]/20 rounded-xl px-3 py-2 text-sm text-[#4F1A16] focus:outline-hidden focus:border-[#9C322B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#782722] mb-1">الحي</label>
                  <input
                    type="text"
                    required
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#C94238]/20 rounded-xl px-3 py-2 text-sm text-[#4F1A16] focus:outline-hidden focus:border-[#9C322B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#782722] mb-1">الشارع وتفاصيل الموقع</label>
                <input
                  type="text"
                  required
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="اسم الشارع ورقم الفيلا أو الشقة"
                  className="w-full bg-white border border-[#C94238]/20 rounded-xl px-3 py-2 text-sm text-[#4F1A16] focus:outline-hidden focus:border-[#9C322B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#782722] mb-1">ملاحظات للمندوب (اختياري)</label>
                <textarea
                  name="notes"
                  rows="2"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="مثال: يرجى عدم الاتصال بالهاتف، وترك الطلب عند الباب"
                  className="w-full bg-white border border-[#C94238]/20 rounded-xl px-3 py-2 text-xs text-[#4F1A16] focus:outline-hidden focus:border-[#9C322B]"
                />
              </div>
            </div>

            {/* Payment Options */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#4F1A16] flex items-center gap-2 border-b border-[#C94238]/15 pb-2">
                <CreditCard className="w-4 h-4 text-[#9C322B]" />
                <span>طريقة الدفع</span>
              </h4>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'apple_pay' })}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    formData.paymentMethod === 'apple_pay'
                      ? 'bg-[#4F1A16] text-white border-[#4F1A16] shadow-sm'
                      : 'bg-white text-[#4F1A16] border-[#C94238]/20 hover:border-[#9C322B]'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-[#F24F44]" />
                  <span className="text-xs font-bold">Apple Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    formData.paymentMethod === 'card'
                      ? 'bg-[#4F1A16] text-white border-[#4F1A16] shadow-sm'
                      : 'bg-white text-[#4F1A16] border-[#C94238]/20 hover:border-[#9C322B]'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#C94238]" />
                  <span className="text-xs font-bold">بطاقة مدى</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'cash' })}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    formData.paymentMethod === 'cash'
                      ? 'bg-[#4F1A16] text-white border-[#4F1A16] shadow-sm'
                      : 'bg-white text-[#4F1A16] border-[#C94238]/20 hover:border-[#9C322B]'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-[#9C322B]" />
                  <span className="text-xs font-bold">عند الاستلام</span>
                </button>
              </div>
            </div>

            {/* Total Summary */}
            <div className="bg-[#FAF0EE] rounded-2xl p-4 border border-[#C94238]/20 flex justify-between items-center">
              <div>
                <span className="text-xs text-[#782722] block">المبلغ الإجمالي للدفع</span>
                <span className="text-xl font-black text-[#9C322B]">{cartTotal} ر.س</span>
              </div>
              <div className="text-right text-xs text-[#782722]">
                <span>{cart.length} أصناف في الطلب</span>
                <div className="flex items-center gap-1 text-[11px] text-[#4F1A16] mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F24F44]" /> دفع آمن ومضمون
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#9C322B] via-[#C94238] to-[#F24F44] hover:opacity-95 text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-[#9C322B]/25 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري تسجيل طلبك...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>تأكيد الطلب الآن ({cartTotal} ر.س)</span>
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
