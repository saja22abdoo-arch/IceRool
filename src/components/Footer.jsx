import React from 'react';
import { useCart } from '../context/CartContext';
import { IceCream, Phone, Mail, MapPin, Heart, ShieldCheck, Truck, Snowflake } from 'lucide-react';

const Footer = () => {
  const { navigate } = useCart();

  return (
    <footer className="bg-[#4F1A16] text-[#FAF0EE] mt-24 border-t-4 border-[#C94238]">
      {/* Guarantees Strip */}
      <div className="border-b border-[#782722]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-right">
            <div className="flex items-center gap-4 bg-[#782722]/40 p-4 rounded-2xl border border-[#9C322B]/30">
              <div className="w-12 h-12 rounded-xl bg-[#F24F44] flex items-center justify-center text-white shrink-0 shadow-md">
                <Snowflake className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">برودة مضمونة 100%</h4>
                <p className="text-xs text-[#FAF0EE]/70 mt-1">تغليف عازل مع ثلج جاف يصلك كأنه مأخوذ من الماكينة</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#782722]/40 p-4 rounded-2xl border border-[#9C322B]/30">
              <div className="w-12 h-12 rounded-xl bg-[#C94238] flex items-center justify-center text-white shrink-0 shadow-md">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">أسطول مبرد سريع</h4>
                <p className="text-xs text-[#FAF0EE]/70 mt-1">توصيل في أقل من 35 دقيقة لجميع مناطق العاصمة</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#782722]/40 p-4 rounded-2xl border border-[#9C322B]/30">
              <div className="w-12 h-12 rounded-xl bg-[#9C322B] flex items-center justify-center text-white shrink-0 shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">مكونات عضوية فاخرة</h4>
                <p className="text-xs text-[#FAF0EE]/70 mt-1">فواكه طازجة وحليب بلدي مبستر بدون أي ملونات صناعية</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F24F44] flex items-center justify-center text-white shadow-sm">
                <IceCream className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-white">آيس رويال</span>
            </div>
            <p className="text-sm text-[#FAF0EE]/75 leading-relaxed">
              وجهتكم الأولى للآيسكريم الحرفي والجيلاتو الإيطالي الفاخر، مع باقات بوكسات مخصصة لجمعات الأهل والأصدقاء ونكهات التوت البري الاستثنائية.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#F24F44] font-semibold bg-[#782722]/60 px-3 py-2 rounded-lg inline-flex">
              <span>ساعات العمل: 1:00 ظهراً - 2:00 بعد منتصف الليل</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base border-r-4 border-[#F24F44] pr-2.5">
              روابط سريعة
            </h4>
            <ul className="space-y-2 text-sm text-[#FAF0EE]/80">
              <li>
                <button onClick={() => navigate('home')} className="hover:text-[#F24F44] transition-colors">
                  الصفحة الرئيسية
                </button>
              </li>
              <li>
                <button onClick={() => navigate('products')} className="hover:text-[#F24F44] transition-colors">
                  قائمة النكهات والمنتجات
                </button>
              </li>
              <li>
                <button onClick={() => navigate('orders')} className="hover:text-[#F24F44] transition-colors">
                  متابعة الطلبات السابقة
                </button>
              </li>
              <li>
                <button onClick={() => navigate('products')} className="hover:text-[#F24F44] transition-colors">
                  عروض بوكسات الجمعات
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base border-r-4 border-[#C94238] pr-2.5">
              نكهاتنا المختارة
            </h4>
            <ul className="space-y-2 text-sm text-[#FAF0EE]/80">
              <li>
                <button onClick={() => navigate('products')} className="hover:text-[#F24F44] transition-colors">
                  آيسكريم التوت البري الملكي
                </button>
              </li>
              <li>
                <button onClick={() => navigate('products')} className="hover:text-[#F24F44] transition-colors">
                  جيلاتو الفراولة المخملية
                </button>
              </li>
              <li>
                <button onClick={() => navigate('products')} className="hover:text-[#F24F44] transition-colors">
                  بوظة عربية بالمستكة والفستق
                </button>
              </li>
              <li>
                <button onClick={() => navigate('products')} className="hover:text-[#F24F44] transition-colors">
                  شوكولاتة بلجيكية داكنة
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base border-r-4 border-[#9C322B] pr-2.5">
              خدمة العملاء
            </h4>
            <div className="space-y-2.5 text-sm text-[#FAF0EE]/80">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#F24F44]" />
                <span>+966 50 123 4567</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#F24F44]" />
                <span>support@iceroyal.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#F24F44]" />
                <span>المملكة العربية السعودية، الرياض</span>
              </div>
            </div>
            
            {/* Payment badges */}
            <div className="pt-2">
              <div className="text-xs text-[#FAF0EE]/60 mb-2">طرق الدفع المدعومة:</div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white/10 px-2.5 py-1 rounded text-xs font-semibold text-white">Apple Pay</span>
                <span className="bg-white/10 px-2.5 py-1 rounded text-xs font-semibold text-white">مدى Mada</span>
                <span className="bg-white/10 px-2.5 py-1 rounded text-xs font-semibold text-white">Visa / MasterCard</span>
                <span className="bg-white/10 px-2.5 py-1 rounded text-xs font-semibold text-white">كاش عند الاستلام</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#782722] flex flex-col sm:flex-row items-center justify-between text-xs text-[#FAF0EE]/60 gap-4">
          <p>© {new Date().getFullYear()} آيس رويال (ICE ROYAL). جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-1">
            <span>صُنع بحب وشغف للمذاق البارد والفاخر</span>
            <Heart className="w-3.5 h-3.5 text-[#F24F44] fill-[#F24F44]" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
