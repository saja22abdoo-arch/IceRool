import React, { useState } from 'react';
import { useCart } from '../../../context/CartContext';
import initialData from '../../../data/iceCreamData.json';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Star, 
  X, 
  Check, 
  IceCream, 
  Image as ImageIcon, 
  AlertCircle 
} from 'lucide-react';

const AdminProductsTab = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useCart();
  const { categories } = initialData;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'berries',
    price: '',
    originalPrice: '',
    shortDesc: '',
    description: '',
    calories: '200 سعرة',
    weight: '250 مل',
    prepTime: 'جاهز فوراً',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
    badge: 'جديد'
  });

  const filteredProducts = products.filter(p => {
    if (selectedCat !== 'all' && p.category !== selectedCat) return false;
    if (searchQuery.trim()) {
      return p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
             p.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'berries',
      price: '',
      originalPrice: '',
      shortDesc: '',
      description: '',
      calories: '200 سعرة',
      weight: '250 مل',
      prepTime: 'جاهز فوراً',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
      badge: 'جديد'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || '',
      shortDesc: product.shortDesc,
      description: product.description || product.shortDesc,
      calories: product.calories,
      weight: product.weight,
      prepTime: product.prepTime || 'جاهز فوراً',
      image: product.image,
      badge: product.badge || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productPayload = {
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      ingredients: ['مكونات طبيعية طازجة', 'حليب مزارع مبستر', 'سكر قصب نقي']
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`هل أنت متأكد من حذف المنتج: "${name}"؟`)) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls */}
      <div className="bg-white rounded-3xl p-5 border border-[#C94238]/20 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#782722]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في المنتجات..."
              className="w-full bg-[#FAF0EE] border border-[#C94238]/20 rounded-xl pr-10 pl-3 py-2 text-xs text-[#4F1A16] focus:outline-hidden focus:border-[#9C322B]"
            />
          </div>

          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full sm:w-auto bg-[#FAF0EE] border border-[#C94238]/20 rounded-xl px-3 py-2 text-xs font-bold text-[#4F1A16] focus:outline-hidden"
          >
            <option value="all">جميع التصنيفات ({products.length})</option>
            {categories.filter(c => c.id !== 'all').map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Add Product Button */}
        <button
          onClick={openAddModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#9C322B] to-[#C94238] hover:from-[#F24F44] hover:to-[#9C322B] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-[#9C322B]/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة نكهة / منتج جديد</span>
        </button>

      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#C94238]/20 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#FAF0EE] text-[#782722] border-b border-[#C94238]/15 font-bold">
              <tr>
                <th className="py-4 px-6">المنتج والنكهة</th>
                <th className="py-4 px-4">التصنيف</th>
                <th className="py-4 px-4">السعر</th>
                <th className="py-4 px-4">الحجم والسعرات</th>
                <th className="py-4 px-4">التقييم</th>
                <th className="py-4 px-6 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF0EE]">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#fdf8f7] transition-colors">
                  {/* Product Info */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#FAF0EE] shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#4F1A16]">{p.name}</span>
                          {p.badge && (
                            <span className="bg-[#FAF0EE] text-[#9C322B] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#C94238]/20">
                              {p.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#782722] line-clamp-1 max-w-xs">{p.shortDesc}</span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4 font-semibold text-[#782722]">
                    {p.category === 'berries' && 'توت وفواكه'}
                    {p.category === 'gelato' && 'جيلاتو كلاسيك'}
                    {p.category === 'oriental' && 'بوظة عربية'}
                    {p.category === 'boxes' && 'بوكسات الجمعات'}
                  </td>

                  {/* Price */}
                  <td className="py-4 px-4">
                    <span className="font-black text-sm text-[#9C322B]">{p.price} ر.س</span>
                    {p.originalPrice && (
                      <span className="text-[11px] text-[#782722]/50 line-through block">
                        {p.originalPrice} ر.س
                      </span>
                    )}
                  </td>

                  {/* Size & Calories */}
                  <td className="py-4 px-4 text-[#782722]">
                    <div>{p.weight || '250 مل'}</div>
                    <div className="text-[10px] text-[#9C322B] font-semibold">{p.calories || '210 سعرة'}</div>
                  </td>

                  {/* Rating */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 font-bold text-[#4F1A16]">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      <span>{p.rating}</span>
                      <span className="text-[10px] text-[#782722]">({p.reviewsCount})</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-2 rounded-xl bg-[#FAF0EE] hover:bg-[#9C322B] text-[#4F1A16] hover:text-white transition-colors"
                        title="تعديل المنتج"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-2 rounded-xl bg-[#FAF0EE] hover:bg-[#F24F44] text-[#4F1A16] hover:text-white transition-colors"
                        title="حذف المنتج"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-[#fdf8f7] rounded-3xl shadow-2xl border border-[#C94238]/20 overflow-hidden animate-in fade-in zoom-in-95">
              
              {/* Header */}
              <div className="bg-[#4F1A16] text-white p-5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <IceCream className="w-5 h-5 text-[#F24F44]" />
                  <h3 className="font-bold text-base">
                    {editingProduct ? 'تعديل بيانات المنتج' : 'إضافة نكهة آيسكريم جديدة'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/80 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#4F1A16] mb-1">اسم الصنف / النكهة</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مثال: جيلاتو التوت الأزرق المركز"
                    className="w-full bg-white border border-[#C94238]/20 rounded-xl px-3 py-2 text-xs text-[#4F1A16] focus:outline-hidden focus:border-[#9C322B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#4F1A16] mb-1">التصنيف</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-white border border-[#C94238]/20 rounded-xl px-3 py-2 text-xs font-bold text-[#4F1A16] focus:outline-hidden"
                    >
                      <option value="berries">توت وفواكه حمراء</option>
                      <option value="gelato">جيلاتو إيطالي كلاسيك</option>
                      <option value="oriental">بوظة عربية ومستكة</option>
                      <option value="boxes">بوكسات الجمعات</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4F1A16] mb-1">الشارة الترويجية</label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="مثال: الأكثر طلباً، جديد"
                      className="w-full bg-white border border-[#C94238]/20 rounded-xl px-3 py-2 text-xs text-[#4F1A16] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#4F1A16] mb-1">السعر (ر.س)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="26"
                      className="w-full bg-white border border-[#C94238]/20 rounded-xl px-3 py-2 text-xs text-[#4F1A16] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4F1A16] mb-1">السعر قبل الخصم (اختياري)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      placeholder="32"
                      className="w-full bg-white border border-[#C94238]/20 rounded-xl px-3 py-2 text-xs text-[#4F1A16] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#4F1A16] mb-1">السعرات الحرارية</label>
                    <input
                      type="text"
                      value={formData.calories}
                      onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                      className="w-full bg-white border border-[#C94238]/20 rounded-xl px-3 py-2 text-xs text-[#4F1A16] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4F1A16] mb-1">الحجم أو الوزن</label>
                    <input
                      type="text"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full bg-white border border-[#C94238]/20 rounded-xl px-3 py-2 text-xs text-[#4F1A16] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4F1A16] mb-1">رابط صورة المنتج (URL)</label>
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-white border border-[#C94238]/20 rounded-xl px-3 py-2 text-xs text-[#4F1A16] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4F1A16] mb-1">وصف مختصر</label>
                  <textarea
                    rows="2"
                    required
                    value={formData.shortDesc}
                    onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                    placeholder="وصف مشوق للمذاق والمكونات الرئيسية..."
                    className="w-full bg-white border border-[#C94238]/20 rounded-xl px-3 py-2 text-xs text-[#4F1A16] focus:outline-hidden"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#782722] hover:bg-[#FAF0EE] transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="bg-[#9C322B] hover:bg-[#782722] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-colors"
                  >
                    {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج فوراً'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProductsTab;
