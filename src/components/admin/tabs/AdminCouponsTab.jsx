import React, { useState } from 'react';
import { useCart } from '../../../context/CartContext';
import { Tag, Plus, Trash2, Check, X, Percent, AlertCircle } from 'lucide-react';

const AdminCouponsTab = () => {
  const { coupons, toggleCouponStatus, addCoupon, deleteCoupon } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: '',
    minSpend: '',
    desc: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discount) return;

    addCoupon({
      code: newCoupon.code.toUpperCase().trim(),
      discount: Number(newCoupon.discount),
      minSpend: Number(newCoupon.minSpend || 0),
      usageCount: 0,
      active: true,
      desc: newCoupon.desc || `خصم ${newCoupon.discount}%`
    });

    setNewCoupon({ code: '', discount: '', minSpend: '', desc: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Add Button */}
      <div className="bg-white rounded-3xl p-5 border border-[#C94238]/20 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-[#4F1A16]">كوبونات وأكواد الخصم النشطة</h3>
          <p className="text-xs text-[#782722]">إدارة العروض الترويجية ورموز التخفيض في سلة الشراء</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#9C322B] to-[#C94238] hover:from-[#F24F44] hover:to-[#9C322B] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-[#9C322B]/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء كود خصم جديد</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {coupons.map((coupon) => (
          <div
            key={coupon.code}
            className={`bg-white rounded-3xl p-5 border shadow-xs transition-all flex flex-col justify-between space-y-4 ${
              coupon.active ? 'border-[#C94238]/30 hover:border-[#9C322B]' : 'border-gray-200 opacity-60'
            }`}
          >
            <div>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF0EE] text-[#9C322B] flex items-center justify-center font-bold">
                    <Tag className="w-4 h-4 text-[#F24F44]" />
                  </div>
                  <div>
                    <h4 className="font-mono font-black text-base text-[#4F1A16] tracking-wider">
                      {coupon.code}
                    </h4>
                    <span className="text-[10px] text-[#782722]">{coupon.desc}</span>
                  </div>
                </div>

                {/* Status Toggle */}
                <button
                  onClick={() => toggleCouponStatus(coupon.code)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
                    coupon.active
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}
                >
                  {coupon.active ? 'مفعل' : 'معطل'}
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#FAF0EE] text-xs">
                <div className="bg-[#FAF0EE] p-2.5 rounded-xl text-center">
                  <span className="block text-[10px] text-[#782722]">نسبة الخصم</span>
                  <span className="font-black text-[#9C322B] text-sm">{coupon.discount}%</span>
                </div>
                <div className="bg-[#FAF0EE] p-2.5 rounded-xl text-center">
                  <span className="block text-[10px] text-[#782722]">مرات الاستخدام</span>
                  <span className="font-black text-[#4F1A16] text-sm">{coupon.usageCount} مرة</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-[11px] text-[#782722]">
                الحد الأدنى: {coupon.minSpend ? `${coupon.minSpend} ر.س` : 'بدون حد'}
              </span>

              <button
                onClick={() => deleteCoupon(coupon.code)}
                className="text-gray-400 hover:text-[#F24F44] transition-colors p-1"
                title="حذف الكوبون"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-[#C94238]/20 overflow-hidden animate-in fade-in zoom-in-95">
              
              <div className="bg-[#4F1A16] text-white p-5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#F24F44]" />
                  <h3 className="font-bold text-sm">إنشاء كود خصم جديد</h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-[#4F1A16] mb-1">رمز الكود (باللغة الإنجليزية)</label>
                  <input
                    type="text"
                    required
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                    placeholder="مثال: SUMMER25"
                    className="w-full bg-[#FAF0EE] border border-[#C94238]/20 rounded-xl px-3 py-2 font-mono uppercase text-[#4F1A16] focus:outline-hidden focus:border-[#9C322B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#4F1A16] mb-1">نسبة الخصم (%)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="90"
                      value={newCoupon.discount}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                      placeholder="15"
                      className="w-full bg-[#FAF0EE] border border-[#C94238]/20 rounded-xl px-3 py-2 text-[#4F1A16] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#4F1A16] mb-1">الحد الأدنى للطلب (ر.س)</label>
                    <input
                      type="number"
                      min="0"
                      value={newCoupon.minSpend}
                      onChange={(e) => setNewCoupon({ ...newCoupon, minSpend: e.target.value })}
                      placeholder="50"
                      className="w-full bg-[#FAF0EE] border border-[#C94238]/20 rounded-xl px-3 py-2 text-[#4F1A16] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#4F1A16] mb-1">وصف العرض</label>
                  <input
                    type="text"
                    value={newCoupon.desc}
                    onChange={(e) => setNewCoupon({ ...newCoupon, desc: e.target.value })}
                    placeholder="مثال: خصم خاص لطلبات نهاية الأسبوع"
                    className="w-full bg-[#FAF0EE] border border-[#C94238]/20 rounded-xl px-3 py-2 text-[#4F1A16] focus:outline-hidden"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="bg-[#9C322B] hover:bg-[#782722] text-white px-5 py-2 rounded-xl font-bold shadow-md"
                  >
                    حفظ وتفعيل الكود
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCouponsTab;
