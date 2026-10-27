import React from 'react';
import { useCart } from '../../context/CartContext';
import { 
  LayoutDashboard, 
  IceCream, 
  ShoppingBag, 
  Tag, 
  Settings, 
  Store, 
  X, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck 
} from 'lucide-react';

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const { adminActiveTab, setAdminActiveTab, navigate, orders, products, coupons } = useCart();

  const activeOrdersCount = orders.filter(o => o.status === 'preparing' || o.status === 'delivering').length;

  const menuItems = [
    {
      id: 'overview',
      label: 'نظرة عامة والإحصائيات',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'products',
      label: 'إدارة النكهات والمنتجات',
      icon: IceCream,
      badge: products.length
    },
    {
      id: 'orders',
      label: 'إدارة وتتبع الطلبات',
      icon: ShoppingBag,
      badge: activeOrdersCount > 0 ? `${activeOrdersCount} نشط` : null,
      badgeColor: 'bg-[#F24F44]'
    },
    {
      id: 'coupons',
      label: 'كوبونات الخصم',
      icon: Tag,
      badge: coupons.filter(c => c.active).length
    },
    {
      id: 'settings',
      label: 'إعدادات المتجر',
      icon: Settings,
      badge: null
    }
  ];

  const handleSelectTab = (tabId) => {
    setAdminActiveTab(tabId);
    if (setMobileOpen) setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-5 bg-[#4F1A16] text-[#FAF0EE] select-none">
      
      {/* Top Brand & Title */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F24F44] to-[#9C322B] flex items-center justify-center text-white shadow-md shadow-[#F24F44]/20">
              <IceCream className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-white">آيس رويال</span>
                <span className="w-2 h-2 rounded-full bg-[#F24F44]"></span>
              </div>
              <span className="text-[10px] font-bold text-[#F24F44] uppercase tracking-wider block">
                لوحة التحكم الإدارية
              </span>
            </div>
          </div>

          {/* Close for mobile */}
          {setMobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Store Preview Quick Button */}
        <button
          onClick={() => navigate('home')}
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-[#782722]/80 hover:bg-[#9C322B] border border-[#9C322B]/40 text-xs font-bold text-white transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <Store className="w-4 h-4 text-[#F24F44] group-hover:scale-110 transition-transform" />
            <span>معاينة متجر الزبائن</span>
          </div>
          <span className="text-[10px] bg-[#4F1A16] px-2 py-0.5 rounded-lg text-[#FAF0EE]/80">
            خروج
          </span>
        </button>

        {/* Navigation Menu */}
        <div className="space-y-1.5 pt-2">
          <div className="text-[11px] font-bold text-[#FAF0EE]/50 px-3 pb-1">
            القائمة الرئيسية
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = adminActiveTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all text-right ${
                  isActive
                    ? 'bg-gradient-to-r from-[#9C322B] to-[#C94238] text-white shadow-lg shadow-[#9C322B]/30 font-black'
                    : 'text-[#FAF0EE]/80 hover:bg-[#782722]/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#F24F44]'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== null && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    item.badgeColor || (isActive ? 'bg-[#4F1A16] text-white' : 'bg-white/10 text-white')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Profile & Status */}
      <div className="pt-6 border-t border-[#782722] space-y-3">
        <div className="flex items-center gap-3 bg-[#782722]/40 p-3 rounded-2xl border border-[#9C322B]/30">
          <div className="w-10 h-10 rounded-xl bg-[#C94238] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            س.ق
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate">سلطان القحطاني</h4>
            <div className="flex items-center gap-1.5 text-[10px] text-[#FAF0EE]/70 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>مدير المتجر (متصل)</span>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-center text-[#FAF0EE]/40">
          نسخة الإدارة v2.4 | بيانات JSON ثابتة
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 border-l border-[#782722] shadow-xl sticky top-0 h-screen overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Sliding Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
          />
          <div className="fixed inset-y-0 right-0 w-80 bg-[#4F1A16] shadow-2xl animate-in slide-in-from-right duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
