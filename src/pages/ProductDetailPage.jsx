import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import initialData from '../data/iceCreamData.json';
import { ArrowRight, Star, ShoppingCart, Plus, Minus, Check, Snowflake, Sparkles, ShieldCheck, Heart, Share2 } from 'lucide-react';

const ProductDetailPage = () => {
  const { selectedProductId, navigate, addToCart, products, showToast } = useCart();

  // Find product with solid fallbacks
  const product = products.find(p => p.id === selectedProductId) || products[0] || initialData.products[0];

  // Fallback defaults for sizes, toppings, and ingredients
  const defaultSizes = [
    { id: 'single', name: 'كوب مفرد (سكوب واحد)', priceDelta: 0 },
    { id: 'double', name: 'كوب مزدوج (سكوبين)', priceDelta: 8 },
    { id: 'waffle', name: 'بسكويت وافل مقرمش', priceDelta: 5 },
    { id: 'pint', name: 'عبوة عائلية (نصف لتر)', priceDelta: 22 }
  ];

  const defaultToppings = [
    { id: 'choco-sauce', name: 'صوص الشوكولاتة الذائبة', price: 4 },
    { id: 'berries-fresh', name: 'توت بري طازج مفروم', price: 5 },
    { id: 'pistachio-nuts', name: 'فستق حلبي مفروم', price: 5 }
  ];

  const defaultIngredients = [
    'حليب مزارع عضوي 100%',
    'قشطة طبيعية طازجة',
    'سكر قصب نقي',
    'فواكه وتوت طازج',
    'خلاصة الفانيليا الطبيعية'
  ];

  const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : defaultSizes;
  const availableToppings = product.toppings && product.toppings.length > 0 ? product.toppings : defaultToppings;
  const availableIngredients = product.ingredients && product.ingredients.length > 0 ? product.ingredients : defaultIngredients;

  // Customization state
  const [selectedSize, setSelectedSize] = useState(availableSizes[0]);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fallback to active size if current selection is not part of available sizes
  const currentSize = (selectedSize && availableSizes.some(s => s.id === selectedSize.id)) 
    ? selectedSize 
    : availableSizes[0];

  // Toggle topping
  const toggleTopping = (topping) => {
    setSelectedToppings(prev => {
      const exists = prev.some(t => t.id === topping.id);
      if (exists) {
        return prev.filter(t => t.id !== topping.id);
      } else {
        return [...prev, topping];
      }
    });
  };

  // Calculate dynamic unit price and total
  const sizeDelta = currentSize ? (currentSize.priceDelta || 0) : 0;
  const toppingsTotal = selectedToppings.reduce((sum, t) => sum + (t.price || 0), 0);
  const basePrice = Number(product.price) || 20;
  const unitPrice = basePrice + sizeDelta + toppingsTotal;
  const totalPrice = unitPrice * quantity;

  // Related products
  const relatedProducts = products
    .filter(p => p.id !== product.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, currentSize, selectedToppings, quantity);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `جرب آيسكريم ${product.name} اللذيذ من متجر آيس رويال! 🍦`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('تم نسخ رابط المنتج بنجاح! 📋', 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Back Button & Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('products')}
          className="inline-flex items-center gap-2 bg-white hover:bg-[#FAF0EE] text-[#4F1A16] px-4 py-2.5 rounded-2xl border border-[#C94238]/20 font-bold text-xs shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <ArrowRight className="w-4 h-4 text-[#9C322B]" />
          <span>الرجوع إلى قائمة الآيسكريم</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsFavorite(!isFavorite);
              showToast(isFavorite ? 'تمت الإزالة من المفضلة' : 'تمت الإضافة إلى المفضلة ❤️', 'info');
            }}
            className={`p-2.5 rounded-2xl border transition-all ${
              isFavorite 
                ? 'bg-red-50 border-red-200 text-red-500' 
                : 'bg-white border-[#C94238]/20 text-[#782722] hover:bg-[#FAF0EE]'
            }`}
            aria-label="إضافة للمفضلة"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
          </button>
          
          <button
            onClick={handleShare}
            className="p-2.5 rounded-2xl bg-white border border-[#C94238]/20 text-[#782722] hover:bg-[#FAF0EE] transition-all"
            aria-label="مشاركة المنتج"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

        {/* Gallery / Image Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative h-96 sm:h-[460px] rounded-3xl overflow-hidden bg-white border border-[#C94238]/20 shadow-xl shadow-[#9C322B]/10">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 right-4 bg-gradient-to-r from-[#9C322B] to-[#F24F44] text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-md">
                {product.badge}
              </span>
            )}
            <div className="absolute bottom-4 left-4 bg-[#4F1A16]/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-2">
              <Snowflake className="w-4 h-4 text-[#F24F44]" />
              <span>تغليف حراري مثلج بـ -18°C</span>
            </div>
          </div>

          {/* Quick Quality Strip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-2xl border border-[#C94238]/15 text-center shadow-2xs">
              <span className="block text-[11px] text-[#782722]">السعرات</span>
              <span className="font-bold text-xs text-[#4F1A16]">{product.calories || '210 سعرة'}</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-[#C94238]/15 text-center shadow-2xs">
              <span className="block text-[11px] text-[#782722]">الحجم</span>
              <span className="font-bold text-xs text-[#4F1A16]">{product.weight || '250 مل'}</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-[#C94238]/15 text-center shadow-2xs">
              <span className="block text-[11px] text-[#782722]">التجهيز</span>
              <span className="font-bold text-xs text-[#4F1A16]">{product.prepTime || 'جاهز فوراً'}</span>
            </div>
          </div>
        </div>

        {/* Customization & Order Column (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#C94238]/20 shadow-xs space-y-6">

          {/* Header Info */}
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-[#C94238] uppercase tracking-wider">
                  نكهة حصرية وطبيعية 100%
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-[#4F1A16] mt-1">
                  {product.name}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1.5 bg-[#FAF0EE] px-3 py-1.5 rounded-xl border border-[#C94238]/20 text-xs font-bold text-[#4F1A16]">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>{product.rating || '5.0'}</span>
                <span className="text-[#782722] text-[11px]">({product.reviewsCount || 120} تقييم)</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-3xl font-black text-[#9C322B]">
                {unitPrice} <span className="text-sm font-semibold text-[#782722]">ر.س</span>
              </span>
              {product.originalPrice && (
                <span className="text-sm text-[#782722]/60 line-through">
                  {product.originalPrice} ر.س
                </span>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs bg-[#FAF0EE] text-[#F24F44] font-bold px-2.5 py-0.5 rounded-lg border border-[#F24F44]/30">
                  وفر {product.originalPrice - product.price} ر.س
                </span>
              )}
            </div>

            <p className="text-sm text-[#782722] leading-relaxed pt-2">
              {product.description || product.shortDesc}
            </p>
          </div>

          {/* Natural Ingredients */}
          <div className="space-y-2 pt-2 border-t border-[#FAF0EE]">
            <h4 className="text-xs font-bold text-[#4F1A16] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F24F44]" />
              <span>المكونات الطبيعية:</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {availableIngredients.map((ing, i) => (
                <span
                  key={i}
                  className="bg-[#FAF0EE] text-[#782722] text-xs font-semibold px-3 py-1 rounded-xl border border-[#C94238]/15"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Sizes Selection */}
          <div className="space-y-2.5 pt-2 border-t border-[#FAF0EE]">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-[#4F1A16]">اختر الحجم / طريقة التقديم:</h4>
              <span className="text-[11px] text-[#782722]">إلزامي</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {availableSizes.map((size) => {
                const isSelected = currentSize?.id === size.id;
                return (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`p-3 rounded-2xl border text-right transition-all flex justify-between items-center ${
                      isSelected
                        ? 'bg-[#9C322B] text-white border-[#9C322B] shadow-md shadow-[#9C322B]/20'
                        : 'bg-[#FAF0EE] text-[#4F1A16] border-[#C94238]/15 hover:border-[#9C322B]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{size.name}</div>
                      <div className={`text-[11px] ${isSelected ? 'text-white/80' : 'text-[#782722]'}`}>
                        {size.priceDelta === 0 ? 'السعر الأساسي' : `+ ${size.priceDelta} ر.س`}
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Extra Toppings */}
          {availableToppings.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-[#FAF0EE]">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-[#4F1A16]">إضافات وتوبينغ اختياري:</h4>
                <span className="text-[11px] text-[#782722]">اختياري</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {availableToppings.map((topping) => {
                  const isChecked = selectedToppings.some(t => t.id === topping.id);
                  return (
                    <button
                      key={topping.id}
                      onClick={() => toggleTopping(topping)}
                      className={`p-3 rounded-2xl border text-right transition-all flex justify-between items-center ${
                        isChecked
                          ? 'bg-[#FAF0EE] border-[#9C322B] text-[#4F1A16] font-bold shadow-xs'
                          : 'bg-white border-[#C94238]/15 text-[#782722] hover:border-[#9C322B]'
                      }`}
                    >
                      <div>
                        <div className="text-xs">{topping.name}</div>
                        <div className="text-[11px] text-[#9C322B]">
                          {topping.price === 0 ? 'مشمول مجاناً' : `+ ${topping.price} ر.س`}
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                        isChecked ? 'bg-[#9C322B] border-[#9C322B] text-white' : 'border-[#C94238]/30'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart Section */}
          <div className="pt-4 border-t border-[#FAF0EE] space-y-4">
            <div className="flex items-center justify-between gap-4">

              {/* Counter */}
              <div className="flex items-center gap-3 bg-[#FAF0EE] p-2 rounded-2xl border border-[#C94238]/20">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-xl bg-white text-[#4F1A16] hover:bg-[#9C322B] hover:text-white flex items-center justify-center transition-colors shadow-2xs"
                  aria-label="تقليل الكمية"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-base text-[#4F1A16] min-w-6 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-xl bg-white text-[#4F1A16] hover:bg-[#9C322B] hover:text-white flex items-center justify-center transition-colors shadow-2xs"
                  aria-label="زيادة الكمية"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-[#9C322B] via-[#C94238] to-[#F24F44] hover:opacity-95 text-white py-4 rounded-2xl font-bold text-sm sm:text-base shadow-xl shadow-[#9C322B]/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>إضافة إلى عربة التسوق ({totalPrice} ر.س)</span>
              </button>

            </div>

            {/* Guarantee note */}
            <div className="flex items-center justify-center gap-2 text-xs text-[#782722]">
              <ShieldCheck className="w-4 h-4 text-[#F24F44]" />
              <span>ضمان استرجاع أو استبدال فوري في حال ذوبان المنتج أثناء التوصيل</span>
            </div>
          </div>

        </div>

      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-[#C94238]/20">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black text-[#4F1A16]">
              نكهات أخرى قد تنال إعجابك
            </h3>
            <button
              onClick={() => navigate('products')}
              className="text-xs font-bold text-[#9C322B] hover:underline"
            >
              مشاهدة الكل
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate('product-detail', rel.id)}
                className="bg-white rounded-3xl p-4 border border-[#C94238]/15 shadow-2xs hover:shadow-lg hover:border-[#9C322B] transition-all cursor-pointer group flex items-center gap-4"
              >
                <img
                  src={rel.image}
                  alt={rel.name}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-[#4F1A16] group-hover:text-[#9C322B] transition-colors line-clamp-1">
                    {rel.name}
                  </h4>
                  <p className="text-xs text-[#782722] mt-0.5 line-clamp-1">{rel.shortDesc}</p>
                  <div className="text-sm font-black text-[#9C322B] mt-1.5">{rel.price} ر.س</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetailPage;
