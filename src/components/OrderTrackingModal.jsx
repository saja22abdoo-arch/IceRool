import React from 'react';
import { useCart } from '../context/CartContext';
import { X, CheckCircle, Clock, Truck, Snowflake, MapPin, Phone, Package } from 'lucide-react';

const OrderTrackingModal = () => {
  const { trackingOrder, setTrackingOrder } = useCart();

  if (!trackingOrder) return null;

  const steps = [
    {
      id: 'received',
      title: 'تم استلام وتأكيد الطلب',
      desc: 'تم تسجيل طلبك وإرساله فوراً للمطبخ',
      icon: Package,
      isDone: true
    },
    {
      id: 'preparing',
      title: 'التحضير والتغليف بالثلج الجاف',
      desc: 'يتم تجهيز الآيسكريم في عبوات عازلة للحرارة',
      icon: Snowflake,
      isDone: trackingOrder.status === 'preparing' || trackingOrder.status === 'delivering' || trackingOrder.status === 'delivered',
      isCurrent: trackingOrder.status === 'preparing'
    },
    {
      id: 'delivering',
      title: 'في الطريق مع السائق المبرد',
      desc: 'السيارة مجهزة بفريزر تبريد لضمان القوام المثالي',
      icon: Truck,
      isDone: trackingOrder.status === 'delivering' || trackingOrder.status === 'delivered',
      isCurrent: trackingOrder.status === 'delivering'
    },
    {
      id: 'delivered',
      title: 'تم التوصيل بنجاح',
      desc: 'بالعافية عليك، نتمنى لك تجربة تذوق ممتعة!',
      icon: CheckCircle,
      isDone: trackingOrder.status === 'delivered',
      isCurrent: trackingOrder.status === 'delivered'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setTrackingOrder(null)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-[#fdf8f7] rounded-3xl shadow-2xl border border-[#C94238]/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#4F1A16] to-[#782722] text-white p-6 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#F24F44]" />
                <h3 className="text-xl font-black">تتبع الطلب: {trackingOrder.id}</h3>
              </div>
              <p className="text-xs text-[#FAF0EE]/75 mt-1">{trackingOrder.deliveryTime || 'التوصيل خلال 25-35 دقيقة'}</p>
            </div>
            <button
              onClick={() => setTrackingOrder(null)}
              className="text-[#FAF0EE]/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Live Steps Timeline */}
            <div className="space-y-6 relative before:absolute before:right-6 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#C94238]/20">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={step.id} className="relative flex items-start gap-4">
                    {/* Step Icon */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 transition-all ${
                        step.isDone
                          ? step.isCurrent
                            ? 'bg-[#F24F44] text-white shadow-md shadow-[#F24F44]/40 ring-4 ring-[#FAF0EE]'
                            : 'bg-[#9C322B] text-white'
                          : 'bg-[#FAF0EE] text-[#782722]/50 border border-[#C94238]/20'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Step Info */}
                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-bold ${step.isDone ? 'text-[#4F1A16]' : 'text-[#782722]/60'}`}>
                          {step.title}
                        </h4>
                        {step.isCurrent && (
                          <span className="text-[10px] font-bold bg-[#FAF0EE] text-[#F24F44] px-2 py-0.5 rounded-full border border-[#C94238]/30 animate-pulse">
                            الحالة الحالية
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#782722] mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Courier / Delivery Details */}
            <div className="bg-white rounded-2xl p-4 border border-[#C94238]/15 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#782722]">مندوب التوصيل:</span>
                <span className="font-bold text-[#4F1A16]">أحمد المنصور (مركبة مجهزة بتبريد)</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#782722]">العنوان المسجل:</span>
                <span className="font-semibold text-[#4F1A16] max-w-xs text-left truncate">{trackingOrder.deliveryAddress}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#782722]">طريقة الدفع:</span>
                <span className="font-bold text-[#9C322B]">{trackingOrder.paymentMethod}</span>
              </div>
            </div>

            {/* Items Summary */}
            <div className="bg-[#FAF0EE] rounded-2xl p-4 border border-[#C94238]/20">
              <div className="text-xs font-bold text-[#4F1A16] mb-2 flex items-center justify-between">
                <span>محتويات هذا الطلب ({trackingOrder.items.length} أصناف)</span>
                <span className="text-[#9C322B] font-black">{trackingOrder.total} ر.س</span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto text-xs text-[#782722]">
                {trackingOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white/70 px-2.5 py-1.5 rounded-lg">
                    <span>{it.quantity}x {it.name} ({it.sizeName})</span>
                    <span className="font-semibold text-[#4F1A16]">{it.price || it.totalPrice} ر.س</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setTrackingOrder(null)}
              className="w-full bg-[#4F1A16] hover:bg-[#782722] text-white py-3 rounded-xl font-bold text-sm transition-colors"
            >
              إغلاق نافذة التتبع
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;
