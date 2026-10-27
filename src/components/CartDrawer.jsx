import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingCart, ArrowLeft, Tag, Check, Sparkles, AlertCircle } from 'lucide-react';

const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartCount,
    cartSubtotal,
    discountAmount,
    deliveryFee,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
    setIsCheckoutOpen,
    navigate,
    promoCode,
    setPromoCode,
    applyPromoCode,
    promoSuccess,
    promoError
  } = useCart();

  const [inputCode, setInputCode] = useState(promoCode);

  if (!isCartOpen) return null;

  const handleApplyCode = (e) => {
    e.preventDefault();
    if (inputCode) {
      applyPromoCode(inputCode);
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Free shipping threshold is 80 SAR
  const freeShippingThreshold = 80;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#fdf8f7] shadow-2xl flex flex-col border-l border-[#C94238]/20 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 bg-white border-b border-[#C94238]/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF0EE] text-[#9C322B] flex items-center justify-center font-bold">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#4F1A16]">عربة التسوق</h3>
                <p className="text-xs text-[#782722]">{cartCount} منتج في العربة</p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-[#4F1A16] hover:bg-[#FAF0EE] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          {cart.length > 0 && (
            <div className="bg-[#FAF0EE] px-5 py-3 border-b border-[#C94238]/15">
              <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                <span className="text-[#4F1A16]">
                  {remainingForFreeShipping === 0 ? (
                    <span className="text-[#9C322B] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#F24F44]" /> تهانينا! حصلت على توصيل مجاني 🎉
                    </span>
                  ) : (
                    <span>أضف بقيمة <strong className="text-[#C94238] font-bold">{remainingForFreeShipping} ر.س</strong> للتوصيل المجاني</span>
                  )}
                </span>
                <span className="text-[#782722] text-[11px]">{progressPercent}%</span>
              </div>
              <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#C94238]/20">
                <div
                  className="h-full bg-gradient-to-r from-[#C94238] to-[#F24F44] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-20 h-20 bg-[#FAF0EE] text-[#C94238] rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-10 h-10 stroke-[1.5]" />
                </div>
                <h4 className="text-lg font-bold text-[#4F1A16] mb-1">عربة التسوق فارغة حالياً</h4>
                <p className="text-xs text-[#782722] mb-6 max-w-xs mx-auto">
                  اختر ما تشتهيه من أصناف الجيلاتو الطبيعي وبوكسات الجمعات المنعشة!
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('products');
                  }}
                  className="bg-[#9C322B] hover:bg-[#782722] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors"
                >
                  استكشف قائمة الآيسكريم
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3.5 border border-[#C94238]/15 shadow-2xs hover:border-[#C94238]/40 transition-all flex gap-3.5"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl border border-[#FAF0EE] shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-[#4F1A16] leading-snug line-clamp-1">
                          {item.name}
                        </h4>
                        <div className="text-[11px] text-[#782722] mt-0.5">
                          الحجم: <span className="font-semibold">{item.sizeName}</span>
                        </div>
                        {item.toppings && item.toppings.length > 0 && (
                          <div className="text-[10px] text-[#9C322B] mt-0.5 line-clamp-1">
                            + {item.toppings.join('، ')}
                          </div>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#782722]/50 hover:text-[#F24F44] transition-colors p-1"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#FAF0EE]">
                      <div className="font-bold text-sm text-[#9C322B]">
                        {item.totalPrice} <span className="text-[10px] font-normal text-[#782722]">ر.س</span>
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex items-center gap-2 bg-[#FAF0EE] rounded-lg px-2 py-1 border border-[#C94238]/15">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-5 h-5 flex items-center justify-center text-[#4F1A16] hover:text-[#F24F44]"
                          aria-label="تقليل الكمية"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-[#4F1A16] min-w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-5 h-5 flex items-center justify-center text-[#4F1A16] hover:text-[#9C322B]"
                          aria-label="زيادة الكمية"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-[#C94238]/15 space-y-4">
              {/* Promo Code Form */}
              <form onSubmit={handleApplyCode} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#782722]" />
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="كود الخصم (مثال: BERRY20)"
                    className="w-full bg-[#FAF0EE] border border-[#C94238]/20 rounded-xl pr-9 pl-3 py-2 text-xs text-[#4F1A16] placeholder:text-[#782722]/50 focus:outline-hidden focus:border-[#9C322B]"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#782722] hover:bg-[#4F1A16] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                >
                  تطبيق
                </button>
              </form>

              {promoSuccess && (
                <div className="flex items-center gap-1.5 text-[11px] text-[#9C322B] bg-[#FAF0EE] px-2.5 py-1.5 rounded-lg border border-[#C94238]/20">
                  <Check className="w-3.5 h-3.5 text-[#F24F44]" />
                  <span>{promoSuccess}</span>
                </div>
              )}
              {promoError && (
                <div className="flex items-center gap-1.5 text-[11px] text-[#F24F44] bg-[#FAF0EE] px-2.5 py-1.5 rounded-lg border border-[#F24F44]/20">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{promoError}</span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#782722] pt-2 border-t border-[#FAF0EE]">
                <div className="flex justify-between">
                  <span>المجموع الفرعي</span>
                  <span className="font-semibold text-[#4F1A16]">{cartSubtotal} ر.س</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#F24F44] font-medium">
                    <span>خصم الكوبون</span>
                    <span>- {discountAmount} ر.س</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>رسوم التوصيل المبرد</span>
                  <span className="font-semibold text-[#4F1A16]">
                    {deliveryFee === 0 ? <strong className="text-[#9C322B]">مجاناً</strong> : `${deliveryFee} ر.س`}
                  </span>
                </div>

                <div className="flex justify-between text-base font-black text-[#4F1A16] pt-2 border-t border-[#FAF0EE]">
                  <span>المجموع النهائي</span>
                  <span className="text-[#9C322B]">{cartTotal} ر.س</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#9C322B] via-[#C94238] to-[#F24F44] hover:opacity-95 text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-[#9C322B]/20 transition-all active:scale-[0.98]"
                >
                  <span>متابعة إتمام الطلب ({cartTotal} ر.س)</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div className="flex justify-between items-center px-1">
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-[#782722]/70 hover:text-[#F24F44] transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>تفريغ السلة بالكامل</span>
                  </button>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-[11px] text-[#782722] hover:underline"
                  >
                    متابعة التسوق
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
