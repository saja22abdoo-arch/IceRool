import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, IceCream, Menu, X, Clock, MapPin, User, LogIn, ShieldCheck, LogOut } from 'lucide-react';

const Header = () => {
  const { 
    currentView, 
    navigate, 
    cartCount, 
    setIsCartOpen, 
    orders, 
    user, 
    isAdmin, 
    setIsAuthModalOpen,
    signOut 
  } = useCart();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'products', label: 'قائمة الآيسكريم' },
    { id: 'orders', label: 'طلباتي', badge: orders.length > 0 ? orders.length : null },
  ];

  const handleNav = (viewId) => {
    navigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#C94238]/15 shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-[#4F1A16] text-[#FFFDF9] text-xs py-2 px-4 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#F24F44] text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
              عرض اليوم
            </span>
            <span>توصيل فائق السرعة لجميع الطلبات | كود خصم 20%: <strong className="text-[#F24F44] tracking-wider">BERRY20</strong></span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px] text-[#FFFDF9]/80">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#F24F44]" /> التوصيل بثلج جاف خلال 30 دقيقة
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#F24F44]" /> متواجدون في كافة الأحياء
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => handleNav('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#9C322B] via-[#782722] to-[#4F1A16] flex items-center justify-center text-white shadow-md shadow-[#9C322B]/25 group-hover:scale-105 transition-all duration-300">
              <IceCream className="w-7 h-7 text-[#F24F44] group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-[#4F1A16]">آيس رويال</span>
                <span className="w-2 h-2 rounded-full bg-[#F24F44]"></span>
              </div>
              <span className="text-[11px] font-medium text-[#782722] tracking-widest block -mt-1">
                ROYAL GELATO & BERRY
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 bg-[#FAF0EE] px-3 py-1.5 rounded-full border border-[#C94238]/15">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`relative px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#9C322B] text-white shadow-sm shadow-[#9C322B]/30'
                      : 'text-[#4F1A16] hover:text-[#C94238] hover:bg-white/60'
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-[#F24F44] text-white' : 'bg-[#782722] text-white'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            
            {/* Login / User Profile Button (Replaces Admin Dashboard Button) */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 bg-[#FAF0EE] hover:bg-[#F3D8D6] text-[#4F1A16] border border-[#C94238]/25 px-3.5 py-2 rounded-xl font-bold text-xs transition-all shadow-2xs"
                >
                  {isAdmin ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <User className="w-4 h-4 text-[#9C322B]" />
                  )}
                  <span className="hidden sm:inline">
                    {isAdmin ? 'مدير المتجر' : (user.user_metadata?.name || 'حسابي')}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#C94238]/15 py-2 z-50 text-right animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-bold text-[#4F1A16] truncate">
                        {user.user_metadata?.name || 'المستخدم'}
                      </p>
                      <p className="text-[10px] text-[#782722]/70 truncate">{user.email}</p>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleNav('admin');
                        }}
                        className="w-full text-right px-4 py-2.5 text-xs font-bold text-[#4F1A16] hover:bg-[#FAF0EE] flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>لوحة التحكم الإدارية</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleNav('orders');
                      }}
                      className="w-full text-right px-4 py-2.5 text-xs font-bold text-[#4F1A16] hover:bg-[#FAF0EE] flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4 text-[#9C322B]" />
                      <span>سجل طلباتي</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full text-right px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 bg-[#FAF0EE] hover:bg-[#9C322B] text-[#4F1A16] hover:text-white border border-[#C94238]/25 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-2xs group"
                title="تسجيل الدخول"
              >
                <LogIn className="w-4 h-4 text-[#9C322B] group-hover:text-white transition-colors" />
                <span className="hidden sm:inline">تسجيل الدخول</span>
              </button>
            )}

            {/* Shopping Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 bg-gradient-to-r from-[#C94238] to-[#9C322B] hover:from-[#F24F44] hover:to-[#C94238] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-[#C94238]/25 hover:shadow-lg hover:shadow-[#C94238]/35 transition-all duration-300 active:scale-95"
              aria-label="عربة التسوق"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-[#4F1A16] border-2 border-white text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">عربة التسوق</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#4F1A16] hover:bg-[#FAF0EE] border border-[#C94238]/20 transition-colors"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#9C322B]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFFDF9] border-b border-[#C94238]/20 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm text-right transition-colors ${
                currentView === link.id
                  ? 'bg-[#9C322B] text-white'
                  : 'bg-white text-[#4F1A16] border border-[#C94238]/15 hover:bg-[#FAF0EE]'
              }`}
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="bg-[#F24F44] text-white text-xs px-2 py-0.5 rounded-full">
                  {link.badge}
                </span>
              )}
            </button>
          ))}

          {/* Mobile Login / Admin Controls */}
          {user ? (
            <div className="pt-2 border-t border-[#C94238]/15 space-y-2">
              <div className="px-4 py-2 bg-[#FAF0EE] rounded-xl flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-[#4F1A16]">
                    {user.user_metadata?.name || user.email}
                  </span>
                  <span className="text-[10px] text-[#782722]">
                    {isAdmin ? 'مدير المتجر (Admin)' : 'عميل'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-red-600 font-bold p-1 hover:underline"
                >
                  خروج
                </button>
              </div>

              {isAdmin && (
                <button
                  onClick={() => handleNav('admin')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm text-right bg-[#4F1A16] text-white shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#F24F44]" />
                    <span>لوحة التحكم الإدارية</span>
                  </div>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md">إدارة</span>
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAuthModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm bg-[#4F1A16] hover:bg-[#782722] text-white shadow-xs"
            >
              <LogIn className="w-4 h-4 text-[#F24F44]" />
              <span>تسجيل الدخول</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
