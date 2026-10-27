import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import initialData from '../data/iceCreamData.json';
import { Search, SlidersHorizontal, Star, ShoppingCart, ArrowUpDown, Sparkles, Cherry, IceCream, Flame, Package, Check } from 'lucide-react';

const ProductsPage = () => {
  const { navigate, addToCart, products } = useCart();
  const { categories } = initialData;

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price-asc', 'price-desc', 'rating'

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        // Category filter
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }
        // Search filter
        if (searchQuery.trim()) {
          const query = searchQuery.trim().toLowerCase();
          const matchesName = item.name.toLowerCase().includes(query);
          const matchesDesc = item.shortDesc.toLowerCase().includes(query);
          const matchesIng = item.ingredients.some(ing => ing.toLowerCase().includes(query));
          return matchesName || matchesDesc || matchesIng;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const getCategoryIcon = (id) => {
    switch (id) {
      case 'berries': return <Cherry className="w-4 h-4" />;
      case 'gelato': return <IceCream className="w-4 h-4" />;
      case 'oriental': return <Flame className="w-4 h-4" />;
      case 'boxes': return <Package className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F24F44] bg-[#FAF0EE] px-3.5 py-1.5 rounded-full border border-[#C94238]/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>قائمة النكهات والبوكسات الملكية</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#4F1A16]">
          تذوق الأصالة والابتكار في كل قضمة
        </h1>
        <p className="text-sm text-[#782722]">
          جميع منتجاتنا محضرة يدوياً بنكهات التوت الطازج والجيلاتو الإيطالي، نصلك في سيارات مبردة لضمان أعلى درجات الجودة.
        </p>
      </div>

      {/* Control Bar: Search, Category Tabs, Sorting */}
      <div className="bg-white rounded-3xl p-5 border border-[#C94238]/20 shadow-xs space-y-5">
        
        {/* Top bar: Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-[#782722]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن نكهة، مكون (توت، فستق، شوكولاتة)..."
              className="w-full bg-[#FAF0EE] border border-[#C94238]/20 rounded-2xl pr-11 pl-4 py-3 text-sm text-[#4F1A16] placeholder:text-[#782722]/50 focus:outline-hidden focus:border-[#9C322B] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#782722] hover:text-[#F24F44]"
              >
                مسح
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-2 bg-[#FAF0EE] border border-[#C94238]/20 rounded-2xl px-3 py-2 text-xs">
              <ArrowUpDown className="w-4 h-4 text-[#9C322B]" />
              <span className="text-[#782722] font-semibold">الترتيب:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-bold text-[#4F1A16] focus:outline-hidden cursor-pointer"
              >
                <option value="default">الافتراضي (الموصى به)</option>
                <option value="price-asc">السعر: من الأقل للأعلى</option>
                <option value="price-desc">السعر: من الأعلى للأقل</option>
                <option value="rating">الأعلى تقييماً ★</option>
              </select>
            </div>
          </div>

        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isSelected
                    ? 'bg-[#9C322B] text-white shadow-md shadow-[#9C322B]/25'
                    : 'bg-[#FAF0EE] text-[#4F1A16] hover:bg-white border border-[#C94238]/20 hover:border-[#9C322B]'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-white text-[#782722]'
                }`}>
                  {cat.id === 'all' ? products.length : cat.count}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-[#C94238]/20 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-[#FAF0EE] text-[#C94238] rounded-full flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#4F1A16]">لم نعثر على نتائج مطابقة</h3>
          <p className="text-xs text-[#782722]">
            جرّب تغيير كلمات البحث أو استعراض جميع التصنيفات
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="bg-[#9C322B] text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-[#782722] transition-colors"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#C94238]/20 shadow-xs hover:shadow-xl hover:border-[#9C322B] transition-all duration-300 flex flex-col group"
            >
              {/* Product Image */}
              <div
                onClick={() => navigate('product-detail', product.id)}
                className="relative h-60 overflow-hidden cursor-pointer bg-[#FAF0EE]"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />

                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-3 right-3 bg-[#9C322B] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                    {product.badge}
                  </span>
                )}

                {/* Calories or prep tag */}
                <span className="absolute top-3 left-3 bg-[#4F1A16]/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-lg backdrop-blur-xs">
                  {product.calories}
                </span>

                {/* Rating */}
                <div className="absolute bottom-3 left-3 bg-[#4F1A16]/85 text-white text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 backdrop-blur-xs">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span>{product.rating}</span>
                  <span className="text-white/60 text-[10px]">({product.reviewsCount})</span>
                </div>
              </div>

              {/* Product Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3
                    onClick={() => navigate('product-detail', product.id)}
                    className="font-bold text-base text-[#4F1A16] hover:text-[#9C322B] transition-colors cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#782722] mt-1.5 line-clamp-2 leading-relaxed">
                    {product.shortDesc}
                  </p>
                </div>

                {/* Price & Action */}
                <div className="pt-3 border-t border-[#FAF0EE] flex items-center justify-between">
                  <div>
                    <div className="text-xl font-black text-[#9C322B]">
                      {product.price} <span className="text-xs font-semibold text-[#782722]">ر.س</span>
                    </div>
                    {product.originalPrice && (
                      <span className="text-xs text-[#782722]/50 line-through">
                        {product.originalPrice} ر.س
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate('product-detail', product.id)}
                      className="bg-[#FAF0EE] hover:bg-[#F3D8D6] text-[#4F1A16] px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors"
                    >
                      تخصيص
                    </button>
                    <button
                      onClick={() => addToCart(product, product.sizes[0], [])}
                      className="bg-[#9C322B] hover:bg-[#782722] text-white p-2.5 rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95"
                      title="إضافة سريعة إلى عربة التسوق"
                    >
                      <ShoppingCart className="w-4 h-4" />
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

export default ProductsPage;
