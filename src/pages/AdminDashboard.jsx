import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import AdminOverviewTab from '../components/admin/tabs/AdminOverviewTab';
import AdminProductsTab from '../components/admin/tabs/AdminProductsTab';
import AdminOrdersTab from '../components/admin/tabs/AdminOrdersTab';
import AdminCouponsTab from '../components/admin/tabs/AdminCouponsTab';
import AdminSettingsTab from '../components/admin/tabs/AdminSettingsTab';

const AdminDashboard = () => {
  const { adminActiveTab } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderActiveTab = () => {
    switch (adminActiveTab) {
      case 'products':
        return <AdminProductsTab />;
      case 'orders':
        return <AdminOrdersTab />;
      case 'coupons':
        return <AdminCouponsTab />;
      case 'settings':
        return <AdminSettingsTab />;
      case 'overview':
      default:
        return <AdminOverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf8f7] text-[#4F1A16] flex">
      {/* Sidebar */}
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader setMobileOpen={setMobileOpen} />

        <main className="flex-1 p-5 sm:p-8 overflow-y-auto">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
