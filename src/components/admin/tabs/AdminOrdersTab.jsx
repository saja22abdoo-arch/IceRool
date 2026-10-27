import React, { useState } from 'react';
import { useCart } from '../../../context/CartContext';
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  FileText, 
  X, 
  Printer 
} from 'lucide-react';

const AdminOrdersTab = () => {
  const { orders, updateOrderStatus } = useCart();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeInvoice, setActiveInvoice] = useState(null);

  const filteredOrders = orders.filter(o => {
    if (selectedStatus === 'all') return true;
    return o.status === selectedStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="bg-[#4F1A16] text-[#FAF0EE] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#F24F44]" />
            <span>تم التوصيل</span>
          </span>
        );
      case 'delivering':
        return (
          <span className="bg-[#F24F44] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            <span>في الطريق</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-gray-500" />
            <span>ملغي</span>
          </span>
        );
      case 'preparing':
      default:
        return (
          <span className="bg-[#9C322B] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>قيد التجهيز</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Filter Tabs */}
      <div className="bg-white rounded-3xl p-4 border border-[#C94238]/20 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedStatus === 'all'
                ? 'bg-[#9C322B] text-white'
                : 'bg-[#FAF0EE] text-[#4F1A16] hover:bg-white'
            }`}
          >
            جميع الطلبات ({orders.length})
          </button>
          <button
            onClick={() => setSelectedStatus('preparing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedStatus === 'preparing'
                ? 'bg-[#9C322B] text-white'
                : 'bg-[#FAF0EE] text-[#4F1A16] hover:bg-white'
            }`}
          >
            قيد التجهيز ({orders.filter(o => o.status === 'preparing').length})
          </button>
          <button
            onClick={() => setSelectedStatus('delivering')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedStatus === 'delivering'
                ? 'bg-[#9C322B] text-white'
                : 'bg-[#FAF0EE] text-[#4F1A16] hover:bg-white'
            }`}
          >
            جاري التوصيل ({orders.filter(o => o.status === 'delivering').length})
          </button>
          <button
            onClick={() => setSelectedStatus('delivered')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedStatus === 'delivered'
                ? 'bg-[#9C322B] text-white'
                : 'bg-[#FAF0EE] text-[#4F1A16] hover:bg-white'
            }`}
          >
            المكتملة ({orders.filter(o => o.status === 'delivered').length})
          </button>
        </div>

        <div className="text-xs text-[#782722] font-semibold">
          يتم التحديث المباشر لحالة الطلب عند اختيار حالة جديدة
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#C94238]/20 text-xs text-[#782722]">
            لا توجد طلبات تطابق الفلتر المحدد حالياً.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-[#C94238]/20 shadow-xs p-5 sm:p-6 space-y-4 hover:border-[#9C322B]/60 transition-all"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#FAF0EE] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF0EE] text-[#9C322B] flex items-center justify-center font-bold">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-[#4F1A16]">{order.id}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <span className="text-[11px] text-[#782722] mt-0.5 block">{order.date}</span>
                  </div>
                </div>

                {/* Status Switcher & Invoice Button */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center gap-2 bg-[#FAF0EE] px-3 py-1.5 rounded-xl border border-[#C94238]/20">
                    <span className="text-xs font-bold text-[#782722]">تغيير الحالة:</span>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="bg-transparent text-xs font-black text-[#4F1A16] focus:outline-hidden cursor-pointer"
                    >
                      <option value="preparing">قيد التجهيز في المطبخ</option>
                      <option value="delivering">في الطريق مع السائق</option>
                      <option value="delivered">تم التوصيل بنجاح</option>
                      <option value="cancelled">ملغي</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setActiveInvoice(order)}
                    className="p-2 rounded-xl bg-[#FAF0EE] hover:bg-[#9C322B] text-[#4F1A16] hover:text-white transition-colors"
                    title="معاينة الفاتورة"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Customer */}
                <div className="bg-[#fdf8f7] p-3.5 rounded-2xl border border-[#C94238]/10 space-y-1.5">
                  <span className="font-bold text-[#4F1A16] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#9C322B]" />
                    <span>بيانات العميل:</span>
                  </span>
                  <div className="text-[#782722]">{order.customerName || 'عميل مسجل'}</div>
                  <div className="text-[#782722] font-mono">{order.customerPhone || '0551234567'}</div>
                </div>

                {/* Address */}
                <div className="bg-[#fdf8f7] p-3.5 rounded-2xl border border-[#C94238]/10 space-y-1.5">
                  <span className="font-bold text-[#4F1A16] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C94238]" />
                    <span>عنوان التوصيل:</span>
                  </span>
                  <p className="text-[#782722] line-clamp-2">{order.deliveryAddress}</p>
                </div>

                {/* Payment & Total */}
                <div className="bg-[#fdf8f7] p-3.5 rounded-2xl border border-[#C94238]/10 space-y-1.5">
                  <span className="font-bold text-[#4F1A16] flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#F24F44]" />
                    <span>الدفع والإجمالي:</span>
                  </span>
                  <div className="flex justify-between items-center text-[#782722]">
                    <span>{order.paymentMethod}</span>
                    <span className="font-black text-sm text-[#9C322B]">{order.total} ر.س</span>
                  </div>
                </div>
              </div>

              {/* Items Breakdown Strip */}
              <div className="pt-2 flex flex-wrap gap-2">
                {order.items.map((it, idx) => (
                  <span
                    key={idx}
                    className="bg-[#FAF0EE] text-[#4F1A16] text-[11px] font-semibold px-3 py-1 rounded-xl border border-[#C94238]/15"
                  >
                    {it.quantity}× {it.name} ({it.sizeName})
                  </span>
                ))}
              </div>

            </div>
          ))
        )}
      </div>

      {/* Invoice Modal */}
      {activeInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            onClick={() => setActiveInvoice(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#C94238]/20 overflow-hidden animate-in fade-in zoom-in-95">
              
              {/* Header */}
              <div className="bg-[#4F1A16] text-white p-5 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-sm">فاتورة الطلب: {activeInvoice.id}</h3>
                  <span className="text-[11px] text-[#FAF0EE]/70">{activeInvoice.date}</span>
                </div>
                <button
                  onClick={() => setActiveInvoice(null)}
                  className="text-white/80 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Invoice Body */}
              <div className="p-6 space-y-4 text-xs">
                
                {/* Store & Customer details */}
                <div className="border-b border-[#FAF0EE] pb-3 space-y-1">
                  <div className="font-bold text-[#4F1A16]">متجر آيس رويال (ICE ROYAL)</div>
                  <div className="text-[#782722]">العميل: {activeInvoice.customerName || 'عميل المتجر'}</div>
                  <div className="text-[#782722]">العنوان: {activeInvoice.deliveryAddress}</div>
                  <div className="text-[#782722]">طريقة الدفع: {activeInvoice.paymentMethod}</div>
                </div>

                {/* Items */}
                <div className="space-y-2 border-b border-[#FAF0EE] pb-3">
                  <div className="font-bold text-[#4F1A16]">أصناف الطلب:</div>
                  {activeInvoice.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-[#782722]">
                      <div>
                        <span>{item.quantity} × {item.name}</span>
                        <span className="text-[10px] text-[#9C322B] block">({item.sizeName})</span>
                      </div>
                      <span className="font-bold text-[#4F1A16]">{item.totalPrice || item.price} ر.س</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[#782722]">
                    <span>رسوم التوصيل المبرد:</span>
                    <span>{activeInvoice.deliveryFee === 0 ? 'مجاناً' : `${activeInvoice.deliveryFee || 0} ر.س`}</span>
                  </div>
                  {activeInvoice.discount > 0 && (
                    <div className="flex justify-between text-[#F24F44]">
                      <span>الخصم المطبق:</span>
                      <span>- {activeInvoice.discount} ر.س</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-[#9C322B] pt-2 border-t border-[#FAF0EE]">
                    <span>الإجمالي المستحق:</span>
                    <span>{activeInvoice.total} ر.س</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-3">
                  <button
                    onClick={() => setActiveInvoice(null)}
                    className="w-full bg-[#9C322B] hover:bg-[#782722] text-white py-2.5 rounded-xl font-bold transition-colors"
                  >
                    إغلاق الفاتورة
                  </button>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOrdersTab;
