import React from 'react';
import { useCart } from '../../context/CartContext';
import { Menu, Eye, Bell, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';

const AdminHeader = ({ setMobileOpen }) => {
  const { adminActiveTab, navigate, storeSettings, orders } = useCart();

  const getTabTitle = () => {
    switch (adminActiveTab) {
      case 'products':
        return { title: 'إدارة النكهات والمنتجات', desc: 'إضافة وتعديل وحذف أصناف الآيسكريم والأسعار' };
      case 'orders':
        return { title: 'إدارة ومتابعة الطلبات', desc: 'متابعة مراحل تحضير وتوصيل طلبات الزبائن وتحديث الحالات' };
      case 'coupons':
        return { title: 'أكواد وكوبونات الخصم', desc: 'إنشاء عروض ترويجية وضبط نسب التخفيض للعملاء' };
      case 'settings':
        return { title: 'إعدادات وتشغيل المتجر', desc: 'ساعات العمل، تسعيرة التوصيل، والتنبيهات' };
      case 'overview':
      default:
        return { title: 'لوحة التحكم | نظرة عامة', desc: 'مؤشرات الأداء، المبيعات اللحظية، والطلبات الواردة' };
    }
  };

  const { title, desc } = getTabTitle();
  const pendingOrders = orders.filter(o => o.status === 'preparing' || o.status === 'delivering').length;

  return (
    <header className="bg-white border-b border-[#C94238]/15 sticky top-0 z-30 px-5 sm:px-8 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Title & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl text-[#4F1A16] hover:bg-[#FAF0EE] border border-[#C94238]/20 transition-colors"
            aria-label="فتح القائمة الجانبية"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#4F1A16]">
              {title}
            </h1>
            <p className="text-xs text-[#782722] mt-0.5 hidden sm:block">
              {desc}
            </p>
          </div>
        </div>

        {/* Action Badges & Store Preview */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          
          {/* Store status pill */}
          <div className="hidden md:flex items-center gap-2 bg-[#FAF0EE] border border-[#C94238]/20 px-3 py-1.5 rounded-full text-xs font-bold text-[#4F1A16]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{storeSettings.storeStatus || 'مفتوح لاستقبال الطلبات'}</span>
          </div>

          {/* Pending notification pill */}
          {pendingOrders > 0 && (
            <div className="flex items-center gap-1.5 bg-[#FAF0EE] text-[#F24F44] border border-[#F24F44]/30 px-3 py-1.5 rounded-full text-xs font-bold">
              <Bell className="w-3.5 h-3.5" />
              <span>{pendingOrders} طلب جديد</span>
            </div>
          )}

          {/* Preview storefront button */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2 bg-[#FAF0EE] hover:bg-[#9C322B] text-[#4F1A16] hover:text-white border border-[#C94238]/25 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs group"
          >
            <Eye className="w-4 h-4 text-[#9C322B] group-hover:text-white transition-colors" />
            <span>معاينة المتجر</span>
          </button>

        </div>

      </div>
    </header>
  );
};

export default AdminHeader;
