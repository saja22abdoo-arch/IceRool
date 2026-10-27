import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Package, Truck, CheckCircle2, Clock, MapPin, CreditCard, RotateCcw, ChevronLeft, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';

const OrdersPage = () => {
  const { orders, navigate, reorder, setTrackingOrder } = useCart();
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'delivered'

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return order.status === 'preparing' || order.status === 'delivering';
    if (filterStatus === 'delivered') return order.status === 'delivered';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="bg-[#4F1A16] text-[#FAF0EE] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#F24F44]" />
            <span>تم التوصيل بنجاح</span>
          </span>
        );
      case 'delivering':
        return (
          <span className="bg-[#F24F44] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 animate-pulse">
            <Truck className="w-3.5 h-3.5" />
            <span>في الطريق إليك مع السائق</span>
          </span>
        );
      case 'preparing':
      default:
        return (
          <span className="bg-[#9C322B] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>قيد التجهيز في المطبخ</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#C94238]/20 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F24F44] bg-[#FAF0EE] px-3 py-1 rounded-full border border-[#C94238]/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>سجل الطلبات والتتبع الفوري</span>
          </div>
          <h1 className="text-3xl font-black text-[#4F1A16]">
            طلباتي ({orders.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#782722] mt-1">
            تابع حالة توصيل آيسكريمك المبرد أو أعد طلب نكهاتك المفضلة بنقرة واحدة
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-[#C94238]/20 shadow-2xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'all'
                ? 'bg-[#9C322B] text-white shadow-xs'
                : 'text-[#4F1A16] hover:bg-[#FAF0EE]'
            }`}
          >
            الكل ({orders.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'active'
                ? 'bg-[#9C322B] text-white shadow-xs'
                : 'text-[#4F1A16] hover:bg-[#FAF0EE]'
            }`}
          >
            النشطة
          </button>
          <button
            onClick={() => setFilterStatus('delivered')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'delivered'
                ? 'bg-[#9C322B] text-white shadow-xs'
                : 'text-[#4F1A16] hover:bg-[#FAF0EE]'
            }`}
          >
            المكتملة
          </button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-[#C94238]/20 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-[#FAF0EE] text-[#C94238] rounded-full flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#4F1A16]">لا توجد طلبات في هذا القسم</h3>
          <p className="text-xs text-[#782722]">
            تصفح قائمتنا الفاخرة وجرب أشهى أصناف الجيلاتو والتوت الطبيعي
          </p>
          <button
            onClick={() => navigate('products')}
            className="bg-[#9C322B] hover:bg-[#782722] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-colors"
          >
            ابدأ التسوق الآن
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-[#C94238]/20 shadow-xs hover:border-[#9C322B]/60 transition-all overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-[#FAF0EE] p-5 sm:px-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#C94238]/15">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-black text-[#4F1A16]">
                      {order.id}
                    </span>
                  </div>
                  <div className="text-xs text-[#782722] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{order.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 space-y-6">
                
                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#fdf8f7] border border-[#C94238]/10"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white shadow-2xs"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-[#4F1A16] truncate">
                          {item.name}
                        </h4>
                        <div className="text-xs text-[#782722] mt-0.5">
                          {item.quantity} × <span className="font-medium">{item.sizeName}</span>
                        </div>
                        {item.toppings && item.toppings.length > 0 && (
                          <div className="text-[10px] text-[#9C322B] truncate mt-0.5">
                            + {item.toppings.join('، ')}
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-black text-[#9C322B]">
                        {item.totalPrice || item.price} ر.س
                      </div>
                    </div>
                  ))}
                </div>

                {/* Logistics & Address Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#FAF0EE] text-xs">
                  <div className="flex items-start gap-2 text-[#782722]">
                    <MapPin className="w-4 h-4 text-[#C94238] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#4F1A16] block">عنوان التوصيل:</span>
                      <span className="line-clamp-2">{order.deliveryAddress}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-[#782722]">
                    <CreditCard className="w-4 h-4 text-[#9C322B] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#4F1A16] block">وسيلة الدفع:</span>
                      <span>{order.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-[#782722]">
                    <Truck className="w-4 h-4 text-[#F24F44] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#4F1A16] block">موعد الوصول:</span>
                      <span>{order.deliveryTime || 'خلال 30 دقيقة'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions & Price Footer */}
                <div className="pt-4 border-t border-[#FAF0EE] flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-[#782722]">إجمالي قيمة الطلب:</span>
                    <span className="text-2xl font-black text-[#9C322B]">
                      {order.total} <span className="text-xs font-bold text-[#782722]">ر.س</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Live Tracking Button */}
                    <button
                      onClick={() => setTrackingOrder(order)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#FAF0EE] hover:bg-[#F3D8D6] text-[#4F1A16] px-5 py-2.5 rounded-xl font-bold text-xs transition-colors"
                    >
                      <Truck className="w-4 h-4 text-[#F24F44]" />
                      <span>تتبع حالة الطلب</span>
                    </button>

                    {/* Re-order Button */}
                    <button
                      onClick={() => reorder(order)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#9C322B] hover:bg-[#782722] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>إعادة الطلب</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default OrdersPage;
