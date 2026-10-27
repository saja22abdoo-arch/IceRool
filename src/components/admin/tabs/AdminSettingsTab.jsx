import React, { useState } from 'react';
import { useCart } from '../../../context/CartContext';
import { Settings, Save, ShieldCheck, Store, Clock, Truck, Phone, Mail } from 'lucide-react';

const AdminSettingsTab = () => {
  const { storeSettings, updateSettings } = useCart();
  const [formData, setFormData] = useState({ ...storeSettings });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings({
      ...formData,
      deliveryFee: Number(formData.deliveryFee),
      freeShippingThreshold: Number(formData.freeShippingThreshold)
    });
  };

  return (
    <div className="max-w-4xl space-y-6">
      
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C94238]/20 shadow-xs space-y-6">
        <div>
          <h3 className="font-bold text-lg text-[#4F1A16] flex items-center gap-2">
            <Store className="w-5 h-5 text-[#9C322B]" />
            <span>بيانات ومعلومات المتجر الأساسية</span>
          </h3>
          <p className="text-xs text-[#782722] mt-1">تعديل بيانات التواصل المعروضة للزبائن في واجهة المتجر وتفاصيل الفاتورة</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4F1A16] mb-1">اسم المتجر التجاري</label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                className="w-full bg-[#FAF0EE] border border-[#C94238]/20 rounded-xl px-3.5 py-2.5 text-xs text-[#4F1A16] focus:outline-hidden focus:border-[#9C322B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4F1A16] mb-1">حالة استقبال الطلبات</label>
              <select
                name="storeStatus"
                value={formData.storeStatus}
                onChange={handleChange}
                className="w-full bg-[#FAF0EE] border border-[#C94238]/20 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#4F1A16] focus:outline-hidden"
              >
                <option value="مفتوح لاستقبال الطلبات">مفتوح لاستقبال الطلبات (نشط)</option>
                <option value="مغلق مؤقتاً للتطوير">مغلق مؤقتاً للتطوير</option>
                <option value="خارج أوقات العمل">خارج أوقات العمل الرسمية</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4F1A16] mb-1">رقم هاتف خدمة العملاء</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#782722]" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-[#FAF0EE] border border-[#C94238]/20 rounded-xl pr-9 pl-3.5 py-2.5 text-xs text-[#4F1A16] focus:outline-hidden focus:border-[#9C322B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4F1A16] mb-1">البريد الإلكتروني للدعم</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#782722]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#FAF0EE] border border-[#C94238]/20 rounded-xl pr-9 pl-3.5 py-2.5 text-xs text-[#4F1A16] focus:outline-hidden focus:border-[#9C322B]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#FAF0EE]">
            <h4 className="font-bold text-sm text-[#4F1A16] mb-4 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#C94238]" />
              <span>إعدادات الشحن والتوصيل المبرد</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#4F1A16] mb-1">رسوم التوصيل الافتراضية (ر.س)</label>
                <input
                  type="number"
                  min="0"
                  name="deliveryFee"
                  value={formData.deliveryFee}
                  onChange={handleChange}
                  className="w-full bg-[#FAF0EE] border border-[#C94238]/20 rounded-xl px-3.5 py-2.5 text-xs text-[#4F1A16] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4F1A16] mb-1">الحد الأدنى للشحن المجاني (ر.س)</label>
                <input
                  type="number"
                  min="0"
                  name="freeShippingThreshold"
                  value={formData.freeShippingThreshold}
                  onChange={handleChange}
                  className="w-full bg-[#FAF0EE] border border-[#C94238]/20 rounded-xl px-3.5 py-2.5 text-xs text-[#4F1A16] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4F1A16] mb-1">ساعات العمل اليومية</label>
                <input
                  type="text"
                  name="workHours"
                  value={formData.workHours}
                  onChange={handleChange}
                  className="w-full bg-[#FAF0EE] border border-[#C94238]/20 rounded-xl px-3.5 py-2.5 text-xs text-[#4F1A16] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#9C322B] hover:bg-[#782722] text-white px-8 py-3 rounded-2xl font-bold text-xs shadow-md shadow-[#9C322B]/20 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>حفظ جميع الإعدادات</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default AdminSettingsTab;
