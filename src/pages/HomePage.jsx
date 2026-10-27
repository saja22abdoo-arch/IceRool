import React from 'react';
import { useCart } from '../context/CartContext';
import initialData from '../data/iceCreamData.json';
import { IceCream, Sparkles, ArrowLeft, Star, Clock, Snowflake, ShieldCheck, Heart, Package, ShoppingCart, Flame, Cherry } from 'lucide-react';

const HomePage = () => {
  const { navigate, addToCart, products } = useCart();
  const { categories, testimonials, features } = initialData;

  // Best sellers: take top 4 products
  const bestSellers = products.slice(0, 4);

  // Signature item
  const signatureProduct = products[0] || initialData.products[0];

  return (
    <div className="space-y-20 pb-16">

      {/* Hero Section with Creamy Ice Cream Background */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF8] via-[#FFF5EB] to-[#FCEEE1] pt-10 md:pt-16 pb-12 md:pb-16">

        {/* Soft atmospheric custard & berry glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#F24F44]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#FFE3C7]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 left-1/3 w-80 h-80 bg-[#FFF0E0] rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Right Text Column (RTL) */}
            <div className="lg:col-span-7 space-y-6 text-right">

              {/* Catchy Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#4F1A16] leading-[1.25] tracking-tight">
                لذة الآيسكريم الحقيقي.. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#9C322B] via-[#C94238] to-[#F24F44]">
                  انتعاش يسيل مع كل قطرة شوكولاتة وتوت فاخر
                </span>
              </h1>

              {/* Engaging Story & Product Description */}
              <p className="text-base sm:text-lg text-[#782722] leading-relaxed max-w-2xl font-medium">
                نصنع الآيسكريم يومياً بأعلى معايير الحرفية من حليب المزارع العضوي وألذ أصناف التوت البري، مغطى بطبقات سخية من الشوكولاتة البلجيكية الذائبة التي تسيل لتروي عطشك وتأخذك إلى عالم من الانتعاش الخالص، وتصلك مثلجة مع ثلج جاف خلال 30 دقيقة.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate('products')}
                  className="bg-gradient-to-r from-[#9C322B] via-[#C94238] to-[#F24F44] hover:opacity-95 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-xl shadow-[#9C322B]/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>اطلب الآن واستمتع باللذة</span>
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={() => navigate('product-detail', 'ic-10')}
                  className="bg-white hover:bg-[#FAF0EE] text-[#4F1A16] border-2 border-[#C94238]/30 hover:border-[#9C322B] px-6 py-4 rounded-2xl font-bold text-base transition-all flex items-center gap-2"
                >
                  <Package className="w-5 h-5 text-[#9C322B]" />
                  <span>بوكس الجمعات الفاخر</span>
                </button>
              </div>

            </div>

            {/* Left Featured Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-5 border-2 border-[#C94238]/25 shadow-2xl shadow-[#9C322B]/20 group">

                {/* Image Container with Badges */}
                <div className="relative h-80 rounded-2xl overflow-hidden bg-[#FAF0EE]">
                  <img
                    src={signatureProduct.image}
                    alt={signatureProduct.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  <div className="absolute top-4 right-4 bg-gradient-to-r from-[#9C322B] to-[#F24F44] text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                    <span>الأكثر طلباً هذا الأسبوع </span>
                  </div>

                  <div className="absolute bottom-4 left-4 bg-[#4F1A16]/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span>{signatureProduct.rating}</span>
                    <span className="text-white/60 text-[10px]">({signatureProduct.reviewsCount})</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="pt-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-bold text-[#C94238] uppercase tracking-wider">
                        النكهة الملكية الخاصة
                      </span>
                      <h3 className="text-xl font-bold text-[#4F1A16]">
                        {signatureProduct.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-[#9C322B]">
                        {signatureProduct.price} <span className="text-xs font-semibold text-[#782722]">ر.س</span>
                      </div>
                      {signatureProduct.originalPrice && (
                        <span className="text-xs text-[#782722]/60 line-through">
                          {signatureProduct.originalPrice} ر.س
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#782722] line-clamp-2">
                    {signatureProduct.shortDesc}
                  </p>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => navigate('product-detail', signatureProduct.id)}
                      className="w-full bg-[#FAF0EE] hover:bg-[#F3D8D6] text-[#4F1A16] py-3 rounded-xl font-bold text-xs transition-colors"
                    >
                      تفاصيل المكونات
                    </button>
                    <button
                      onClick={() => addToCart(signatureProduct, signatureProduct.sizes[0], [])}
                      className="w-full bg-[#9C322B] hover:bg-[#782722] text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>إضافة للعربة</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </section>

      {/* Categories Showcase Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#C94238] uppercase tracking-widest block mb-2">
            تشكيلاتنا المتنوعة
          </span>
          <h2 className="text-3xl font-black text-[#4F1A16]">
            اختر تجربتك المفضلة
          </h2>
          <p className="text-sm text-[#782722] mt-2">
            نكهات التوت الحامضة والمنعشة، الجيلاتو الغني، والبوظة التراثية الأصلية
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.filter(c => c.id !== 'all').map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate('products')}
              className="bg-white rounded-2xl p-5 border border-[#C94238]/20 shadow-2xs hover:shadow-lg hover:border-[#9C322B] transition-all cursor-pointer group text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FAF0EE] group-hover:bg-[#9C322B] text-[#9C322B] group-hover:text-white flex items-center justify-center transition-all mb-4">
                {cat.id === 'berries' && <Cherry className="w-7 h-7" />}
                {cat.id === 'gelato' && <Sparkles className="w-7 h-7" />}
                {cat.id === 'oriental' && <Flame className="w-7 h-7" />}
                {cat.id === 'boxes' && <Package className="w-7 h-7" />}
              </div>
              <h3 className="font-bold text-base text-[#4F1A16] group-hover:text-[#9C322B] transition-colors">
                {cat.name}
              </h3>
              <span className="text-xs text-[#782722] mt-1 block">
                {cat.count} أصناف متوفرة
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#C94238] uppercase tracking-widest mb-1">
              <Flame className="w-4 h-4 text-[#F24F44]" />
              <span>الأعلى طلباً ومحبة</span>
            </div>
            <h2 className="text-3xl font-black text-[#4F1A16]">
              نكهات أجمع عليها الجميع
            </h2>
          </div>

          <button
            onClick={() => navigate('products')}
            className="text-xs font-bold text-[#9C322B] hover:text-[#4F1A16] flex items-center gap-1.5 self-start sm:self-auto hover:underline"
          >
            <span>عرض كل القائمة ({products.length})</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#C94238]/20 shadow-2xs hover:shadow-xl hover:border-[#9C322B] transition-all duration-300 flex flex-col group"
            >
              {/* Product Image */}
              <div
                onClick={() => navigate('product-detail', item.id)}
                className="relative h-56 bg-[#FAF0EE] overflow-hidden cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {item.badge && (
                  <span className="absolute top-3 right-3 bg-[#F24F44] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
                    {item.badge}
                  </span>
                )}

                <div className="absolute bottom-3 left-3 bg-[#4F1A16]/85 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span>{item.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3
                    onClick={() => navigate('product-detail', item.id)}
                    className="font-bold text-base text-[#4F1A16] hover:text-[#9C322B] transition-colors cursor-pointer line-clamp-1"
                  >
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#782722] mt-1 line-clamp-2 leading-relaxed">
                    {item.shortDesc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#C94238]/10">
                  <div>
                    <div className="text-lg font-black text-[#9C322B]">
                      {item.price} <span className="text-[11px] font-semibold text-[#782722]">ر.س</span>
                    </div>
                    {item.originalPrice && (
                      <span className="text-[11px] text-[#782722]/60 line-through block">
                        {item.originalPrice} ر.س
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate('product-detail', item.id)}
                      className="bg-[#FAF0EE] hover:bg-[#F3D8D6] text-[#4F1A16] px-3 py-2 rounded-xl text-xs font-bold transition-colors"
                    >
                      تخصيص
                    </button>
                    <button
                      onClick={() => addToCart(item, item.sizes[0], [])}
                      className="bg-[#9C322B] hover:bg-[#782722] text-white p-2.5 rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95"
                      title="إضافة سريعة إلى عربة التسوق"
                      aria-label="إضافة سريعة إلى عربة التسوق"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Special Deals Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#4F1A16] via-[#782722] to-[#9C322B] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-[#C94238]/30">
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#F24F44]/20 rounded-full blur-2xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="bg-[#F24F44] text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                عرض الجمعات الخاص 🍦
              </span>
              <h3 className="text-3xl sm:text-4xl font-black leading-tight">
                بوكس الجمعات الفاخر (8 نكهات مشكلة) <br />
                مع 4 صوصات وبسكويت وافل مجاناً!
              </h3>
              <p className="text-sm text-[#FAF0EE]/80 max-w-xl leading-relaxed">
                وفر 26 ريال فوراً. عبوة حرارية تحفظ البرودة 3 ساعات في أشد درجات الحرارة مع ثلج جاف غذائي، تكفي من 6 إلى 8 أشخاص مع ملاعق خشبية فاخرة.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate('product-detail', 'ic-10')}
                  className="bg-white hover:bg-[#FAF0EE] text-[#4F1A16] px-8 py-3.5 rounded-2xl font-black text-sm shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4 text-[#9C322B]" />
                  <span>اطلب البوكس الآن بـ 119 ر.س فقط</span>
                </button>
                <div className="text-xs text-[#FAF0EE]/70 font-semibold">
                  * يشمل التوصيل المبرد السريع
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                <img
                  src="https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=800&q=80"
                  alt="Party Box"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-[#C94238]/15 shadow-2xs hover:border-[#9C322B] transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FAF0EE] text-[#9C322B] flex items-center justify-center mb-4">
                {idx === 0 && <Snowflake className="w-6 h-6 text-[#F24F44]" />}
                {idx === 1 && <Sparkles className="w-6 h-6 text-[#C94238]" />}
                {idx === 2 && <Clock className="w-6 h-6 text-[#9C322B]" />}
                {idx === 3 && <ShieldCheck className="w-6 h-6 text-[#782722]" />}
              </div>
              <h4 className="font-bold text-base text-[#4F1A16] mb-1.5">
                {feat.title}
              </h4>
              <p className="text-xs text-[#782722] leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#C94238] uppercase tracking-widest block mb-1">
            تجارب حقيقية
          </span>
          <h2 className="text-3xl font-black text-[#4F1A16]">
            ماذا يقول عملاء آيس رويال؟
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-3xl p-6 border border-[#C94238]/20 shadow-2xs relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-yellow-400 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-[#4F1A16] leading-relaxed italic mb-6">
                  "{review.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#FAF0EE]">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#C94238]/20"
                />
                <div>
                  <h4 className="font-bold text-xs text-[#4F1A16]">{review.name}</h4>
                  <span className="text-[11px] text-[#782722]">{review.city}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default HomePage;
