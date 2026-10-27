import React from 'react';
import { useCart } from '../../../context/CartContext';
import { 
  TrendingUp, 
  ShoppingBag, 
  IceCream, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle, 
  ArrowUpRight, 
  Sparkles, 
  Snowflake, 
  Star 
} from 'lucide-react';

const AdminOverviewTab = () => {
  const { orders, products, setAdminActiveTab, updateOrderStatus } = useCart();

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0) + 12450; // include historic benchmark
  const totalOrdersCount = orders.length + 84;
  const activeOrders = orders.filter(o => o.status === 'preparing' || o.status === 'delivering');
  const avgOrderValue = Math.round(totalRevenue / totalOrdersCount);

  // Weekly Revenue Mock Bar Data
  const weeklyData = [
    { day: 'السبت', amount: 1840, height: '65%' },
    { day: 'الأحد', amount: 2150, height: '75%' },
    { day: 'الإثنين', amount: 1620, height: '55%' },
    { day: 'الثلاثاء', amount: 2380, height: '85%' },
    { day: 'الأربعاء', amount: 2950, height: '100%', highlight: true },
    { day: 'الخميس', amount: 2710, height: '92%' },
    { day: 'الجمعة', amount: 2540, height: '88%' }
  ];

  const topProducts = products.slice(0, 4);

  return (
    <div className="space-y-8">
      
      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Sales */}
        <div className="bg-white rounded-3xl p-5 border border-[#C94238]/20 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-[#782722]">إجمالي المبيعات</span>
              <div className="text-2xl font-black text-[#4F1A16] mt-1">
                {totalRevenue.toLocaleString()} <span className="text-xs font-semibold text-[#782722]">ر.س</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#FAF0EE] text-[#9C322B] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#F24F44]" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-emerald-600 font-bold">
            <ArrowUpRight className="w-4 h-4" />
            <span>+18.4% نمو مقارنة بالأسبوع الماضي</span>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="bg-white rounded-3xl p-5 border border-[#C94238]/20 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-[#782722]">إجمالي الطلبات</span>
              <div className="text-2xl font-black text-[#4F1A16] mt-1">
                {totalOrdersCount} <span className="text-xs font-semibold text-[#782722]">طلب</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#FAF0EE] text-[#9C322B] flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-[#9C322B]" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-[#F24F44] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#F24F44] animate-ping"></span>
            <span>{activeOrders.length} طلبات قيد التنفيذ حالياً</span>
          </div>
        </div>

        {/* Card 3: Active Flavors */}
        <div className="bg-white rounded-3xl p-5 border border-[#C94238]/20 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-[#782722]">النكهات المعروضة</span>
              <div className="text-2xl font-black text-[#4F1A16] mt-1">
                {products.length} <span className="text-xs font-semibold text-[#782722]">صنف</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#FAF0EE] text-[#9C322B] flex items-center justify-center">
              <IceCream className="w-6 h-6 text-[#C94238]" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-[#782722] font-semibold">
            <span>جميعها متوفرة وجاهزة للتقديم</span>
          </div>
        </div>

        {/* Card 4: Avg Order Value */}
        <div className="bg-white rounded-3xl p-5 border border-[#C94238]/20 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-[#782722]">متوسط قيمة الطلب</span>
              <div className="text-2xl font-black text-[#4F1A16] mt-1">
                {avgOrderValue} <span className="text-xs font-semibold text-[#782722]">ر.س</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#FAF0EE] text-[#9C322B] flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[#782722]" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-emerald-600 font-bold">
            <ArrowUpRight className="w-4 h-4" />
            <span>+9.2% بفضل بوكسات الجمعات</span>
          </div>
        </div>

      </div>

      {/* Middle Row: Revenue Chart & Quality Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Revenue Bar Visual (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#C94238]/20 shadow-xs space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base text-[#4F1A16]">
                نشاط المبيعات الأسبوعية (ر.س)
              </h3>
              <p className="text-xs text-[#782722]">تحليل حجم الطلبات والمبيعات خلال الأيام السبعة الماضية</p>
            </div>
            <div className="bg-[#FAF0EE] px-3 py-1.5 rounded-xl text-xs font-bold text-[#9C322B] border border-[#C94238]/20">
              مجموع الأسبوع: 16,160 ر.س
            </div>
          </div>

          {/* Bar Diagram */}
          <div className="h-60 pt-6 flex items-end justify-between gap-3 sm:gap-6 border-b border-[#FAF0EE] pb-2">
            {weeklyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                {/* Value on hover */}
                <span className="text-[10px] font-bold text-[#9C322B] opacity-0 group-hover:opacity-100 transition-opacity">
                  {d.amount}
                </span>

                {/* The Bar */}
                <div
                  className={`w-full rounded-t-xl transition-all duration-500 cursor-pointer ${
                    d.highlight
                      ? 'bg-gradient-to-t from-[#9C322B] to-[#F24F44] shadow-md shadow-[#9C322B]/30'
                      : 'bg-[#FAF0EE] group-hover:bg-[#C94238]'
                  }`}
                  style={{ height: d.height }}
                  title={`${d.day}: ${d.amount} ر.س`}
                />

                {/* Day label */}
                <span className="text-xs font-bold text-[#782722] mt-1">{d.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-[#782722] pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-[#F24F44]"></span>
              <span>أعلى مبيعات: يوم الأربعاء (2,950 ر.س)</span>
            </span>
            <span className="text-[11px] text-[#782722]/70">تحديث فوري للبيانات</span>
          </div>
        </div>

        {/* Cold Storage & Telemetry Widget (4 Cols) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#4F1A16] to-[#782722] text-white rounded-3xl p-6 shadow-md flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Snowflake className="w-5 h-5 text-[#F24F44]" />
                <h3 className="font-bold text-base text-white">مراقبة الجودة والبرودة</h3>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                سليم 100%
              </span>
            </div>

            <p className="text-xs text-[#FAF0EE]/75 leading-relaxed">
              بيانات حية من مستشعرات التجميد وأسطول السيارات لضمان وصول الآيسكريم في درجة حرارة مثالية.
            </p>

            <div className="space-y-3 pt-2">
              <div className="bg-white/10 p-3 rounded-2xl flex justify-between items-center">
                <span className="text-xs text-[#FAF0EE]/80">حرارة الفريزر المركزي</span>
                <span className="font-black text-sm text-white">-19.2°C</span>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl flex justify-between items-center">
                <span className="text-xs text-[#FAF0EE]/80">رصيد الثلج الجاف</span>
                <span className="font-black text-sm text-[#F24F44]">45 كجم (يكفي 60 طلب)</span>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl flex justify-between items-center">
                <span className="text-xs text-[#FAF0EE]/80">متوسط وقت التوصيل</span>
                <span className="font-black text-sm text-white">26 دقيقة</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 text-[11px] text-[#FAF0EE]/70 flex items-center justify-between">
            <span>نظام الحفظ المبرد النشط</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

      </div>

      {/* Bottom Row: Recent Orders & Top Flavors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Orders (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#C94238]/20 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base text-[#4F1A16]">أحدث الطلبات المستلمة</h3>
              <p className="text-xs text-[#782722]">قائمة بالطلبات الأخيرة مع إمكانية التحديث المباشر</p>
            </div>
            <button
              onClick={() => setAdminActiveTab('orders')}
              className="text-xs font-bold text-[#9C322B] hover:underline"
            >
              عرض جميع الطلبات ({orders.length})
            </button>
          </div>

          <div className="space-y-3 overflow-x-auto">
            {orders.slice(0, 4).map((order) => (
              <div
                key={order.id}
                className="bg-[#fdf8f7] rounded-2xl p-4 border border-[#C94238]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#4F1A16]">{order.id}</span>
                    <span className="text-[11px] text-[#782722]">{order.date}</span>
                  </div>
                  <div className="text-xs text-[#782722] mt-1">
                    {order.customerName ? `العميل: ${order.customerName}` : `${order.items.length} أصناف في الطلب`}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="font-black text-sm text-[#9C322B]">
                    {order.total} ر.س
                  </div>

                  {/* Quick status selector */}
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="bg-white border border-[#C94238]/30 rounded-xl px-2.5 py-1 text-xs font-bold text-[#4F1A16] focus:outline-hidden cursor-pointer"
                  >
                    <option value="preparing">قيد التجهيز</option>
                    <option value="delivering">في الطريق</option>
                    <option value="delivered">تم التوصيل</option>
                    <option value="cancelled">إلغاء</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Flavors (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#C94238]/20 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base text-[#4F1A16]">النكهات الأكثر مبيعاً</h3>
              <p className="text-xs text-[#782722]">الأصناف التي تحقق أعلى عوائد</p>
            </div>
            <button
              onClick={() => setAdminActiveTab('products')}
              className="text-xs font-bold text-[#9C322B] hover:underline"
            >
              إدارة المنتجات
            </button>
          </div>

          <div className="space-y-3">
            {topProducts.map((p, index) => (
              <div
                key={p.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-[#fdf8f7] border border-[#C94238]/10"
              >
                <span className="w-6 h-6 rounded-lg bg-[#FAF0EE] text-[#9C322B] font-black text-xs flex items-center justify-center shrink-0">
                  #{index + 1}
                </span>
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-[#4F1A16] truncate">{p.name}</h4>
                  <div className="flex items-center gap-1 text-[11px] text-[#782722] mt-0.5">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span>{p.rating}</span>
                    <span className="text-[#782722]/60">({p.reviewsCount} تقييم)</span>
                  </div>
                </div>
                <div className="text-xs font-black text-[#9C322B]">
                  {p.price} ر.س
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminOverviewTab;
