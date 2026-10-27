import React from 'react';
import { CartProvider, useCart } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderTrackingModal from './components/OrderTrackingModal';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import OrdersPage from './pages/OrdersPage';
import AdminDashboard from './pages/AdminDashboard';
import { ShieldAlert, ArrowRight, Lock } from 'lucide-react';

const AppContent = () => {
  const { currentView, isAdmin, navigate, setIsAuthModalOpen } = useCart();

  // If in Admin Dashboard mode, verify admin privilege
  if (currentView === 'admin') {
    if (!isAdmin) {
      return (
        <div className="min-h-screen bg-[#FFFDF9] text-[#4F1A16] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border-2 border-red-200 shadow-xl text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#4F1A16]">منطقة مخصصة للإدارة فقط</h2>
              <p className="text-xs text-[#782722] mt-2 leading-relaxed">
                عذراً، لا تمتلك صلاحيات الوصول إلى لوحة تحكم متجر آيس رويال. يجب تسجيل الدخول بحساب مسؤول (Admin) معتمد.
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full bg-[#4F1A16] hover:bg-[#782722] text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-[#F24F44]" />
                <span>تسجيل الدخول كمسؤول</span>
              </button>
              <button
                onClick={() => navigate('home')}
                className="w-full bg-[#FAF0EE] hover:bg-[#F3D8D6] text-[#4F1A16] py-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>العودة إلى المتجر الرئيسي</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <AuthModal />
          <Toast />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#fdf8f7] text-[#4F1A16] selection:bg-[#F24F44] selection:text-white">
        <AdminDashboard />
        <AuthModal />
        <Toast />
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'products':
        return <ProductsPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'orders':
        return <OrdersPage />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9] text-[#4F1A16] selection:bg-[#F24F44] selection:text-white">
      {/* Sticky Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Overlays, Drawers & Modals */}
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <AuthModal />
      <Toast />

      {/* Footer */}
      <Footer />
    </div>
  );
};

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
