-- =========================================================================
-- مخطط قاعدة بيانات متجر آيس رويال (ICE ROYAL) على SUPABASE
-- تشمل: الجداول، العلاقات، القيود، الفهارس، سياسات الأمان RLS، والبيانات الأولية
-- =========================================================================

-- تفعيل ملحق UUID لتوليد معرفات فريدة آمنة
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. جدول التصنيفات (Categories)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) DEFAULT 'IceCream',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 2. جدول المنتجات والنكهات (Products)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10, 2) CHECK (original_price IS NULL OR original_price > price),
    rating NUMERIC(3, 2) DEFAULT 5.0 CHECK (rating BETWEEN 0 AND 5),
    reviews_count INT DEFAULT 0,
    image_url TEXT NOT NULL,
    badge VARCHAR(50),
    short_desc TEXT,
    description TEXT,
    calories VARCHAR(50),
    weight VARCHAR(50),
    prep_time VARCHAR(50) DEFAULT 'جاهز فوراً',
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 3. جدول أحجام وتقديم المنتجات (Product Sizes)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_sizes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price_delta NUMERIC(10, 2) DEFAULT 0 CHECK (price_delta >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 4. جدول الإضافات والتوبينغ (Product Toppings)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_toppings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) DEFAULT 0 CHECK (price >= 0),
    is_active BOOLEAN DEFAULT TRUE
);

-- -------------------------------------------------------------------------
-- 5. جدول الطلبات (Orders)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(30) UNIQUE NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    delivery_address TEXT NOT NULL,
    notes TEXT,
    payment_method VARCHAR(50) DEFAULT 'Apple Pay',
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    discount NUMERIC(10, 2) DEFAULT 0 CHECK (discount >= 0),
    delivery_fee NUMERIC(10, 2) DEFAULT 0 CHECK (delivery_fee >= 0),
    total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
    status VARCHAR(30) DEFAULT 'preparing' CHECK (status IN ('preparing', 'delivering', 'delivered', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 6. جدول عناصر الطلب التفصيلية (Order Items)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL,
    size_name VARCHAR(100) NOT NULL,
    toppings JSONB DEFAULT '[]'::jsonb,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0)
);

-- -------------------------------------------------------------------------
-- 7. جدول كوبونات الخصم (Coupons)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percentage INT NOT NULL CHECK (discount_percentage BETWEEN 1 AND 100),
    min_spend NUMERIC(10, 2) DEFAULT 0,
    description TEXT,
    usage_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 8. جدول إعدادات المتجر (Store Settings)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.store_settings (
    id INT PRIMARY KEY DEFAULT 1,
    store_name VARCHAR(100) DEFAULT 'آيس رويال | ICE ROYAL',
    phone VARCHAR(50) DEFAULT '+966 50 123 4567',
    email VARCHAR(100) DEFAULT 'support@iceroyal.com',
    work_hours VARCHAR(100) DEFAULT '1:00 م - 2:00 ص',
    delivery_fee NUMERIC(10, 2) DEFAULT 12.00,
    free_shipping_threshold NUMERIC(10, 2) DEFAULT 80.00,
    store_status VARCHAR(50) DEFAULT 'مفتوح لاستقبال الطلبات',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- الفهارس لتحسين وسرعة الاستعلامات (Performance Indexes)
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON public.products(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);

-- =========================================================================
-- سياسات الأمان على مستوى الصفوف (Row Level Security - RLS)
-- =========================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_toppings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- 1. القراءة العامة للمنتجات والتصنيفات والكوبونات النشطة
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public can view available products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public can view product sizes" ON public.product_sizes FOR SELECT USING (true);
CREATE POLICY "Public can view toppings" ON public.product_toppings FOR SELECT USING (true);
CREATE POLICY "Public can view active coupons" ON public.coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view store settings" ON public.store_settings FOR SELECT USING (true);

-- 2. السماح للزوار بإنشاء طلبات في المتجر
CREATE POLICY "Public can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view their orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public can insert order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view order items" ON public.order_items FOR SELECT USING (true);

-- 3. صلاحيات التعديل والإدارة للوحة التحكم (Full Admin Access)
CREATE POLICY "Admin manage products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage orders" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage coupons" ON public.coupons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage settings" ON public.store_settings FOR ALL USING (true) WITH CHECK (true);

-- =========================================================================
-- إدراج البيانات الأولية المطابقة للمتجر (Seed Initial Data)
-- =========================================================================
INSERT INTO public.store_settings (id, store_name, phone, email, work_hours, delivery_fee, free_shipping_threshold)
VALUES (1, 'آيس رويال | ICE ROYAL', '+966 50 123 4567', 'support@iceroyal.com', '1:00 م - 2:00 ص', 12.00, 80.00)
ON CONFLICT (id) DO NOTHING;

-- إدراج التصنيفات
INSERT INTO public.categories (slug, name, icon, sort_order) VALUES
('berries', 'توت وفواكه حمراء', 'Cherry', 1),
('gelato', 'جيلاتو إيطالي كلاسيك', 'Sparkles', 2),
('oriental', 'بوظة عربية ومستكة', 'Flame', 3),
('boxes', 'بوكسات الجمعات', 'Package', 4)
ON CONFLICT (slug) DO NOTHING;

-- إدراج الكوبونات
INSERT INTO public.coupons (code, discount_percentage, min_spend, description) VALUES
('BERRY20', 20, 50.00, 'خصم 20% على طلبات التوت والبوكسات'),
('SWEET10', 10, 30.00, 'خصم ترحيبي 10% لجميع العملاء'),
('SUMMER15', 15, 60.00, 'خصم 15% لعروض الصيف')
ON CONFLICT (code) DO NOTHING;

-- إدراج المنتجات الأساسية
DO $$
DECLARE
    cat_berries UUID;
    cat_gelato UUID;
    cat_oriental UUID;
    cat_boxes UUID;
    prod_id UUID;
BEGIN
    SELECT id INTO cat_berries FROM public.categories WHERE slug = 'berries' LIMIT 1;
    SELECT id INTO cat_gelato FROM public.categories WHERE slug = 'gelato' LIMIT 1;
    SELECT id INTO cat_oriental FROM public.categories WHERE slug = 'oriental' LIMIT 1;
    SELECT id INTO cat_boxes FROM public.categories WHERE slug = 'boxes' LIMIT 1;

    -- المنتج 1
    INSERT INTO public.products (category_id, name, price, original_price, rating, reviews_count, image_url, badge, short_desc, description, calories, weight)
    VALUES (
        cat_berries,
        'آيسكريم التوت البري الملكي',
        24.00, 30.00, 4.90, 128,
        'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
        'الأكثر مبيعاً',
        'مزيج فاخر من التوت البري الطازج وكريمة الفانيليا الإيطالية الغنية بنكهة منعشة.',
        'تجربة استثنائية تأخذ حواسك في رحلة منعشة. محضر يومياً من أجود حبات التوت البري الأحمر والأسود.',
        '210 سعرة', '250 مل'
    ) RETURNING id INTO prod_id;

    INSERT INTO public.product_sizes (product_id, name, price_delta) VALUES
    (prod_id, 'كوب مفرد (سكوب واحد)', 0.00),
    (prod_id, 'كوب مزدوج (سكوبين)', 8.00),
    (prod_id, 'عبوة عائلية (نصف لتر)', 22.00);

    -- المنتج 2
    INSERT INTO public.products (category_id, name, price, rating, reviews_count, image_url, badge, short_desc, description, calories, weight)
    VALUES (
        cat_berries,
        'جيلاتو الفراولة المخملية',
        22.00, 4.80, 94,
        'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80',
        'جديد',
        'جيلاتو طبيعي مصنوع من فراولة مزارع الهدا بنكهة طبيعية وقوام فائق النعومة.',
        'جيلاتو إيطالي أصيل مصنوع بحرفية عالية وقوام كريمي ناعم.',
        '185 سعرة', '220 مل'
    );

    -- المنتج 3 (بوكس الجمعات)
    INSERT INTO public.products (category_id, name, price, original_price, rating, reviews_count, image_url, badge, short_desc, description, calories, weight)
    VALUES (
        cat_boxes,
        'بوكس الجمعات الفاخر (8 نكهات مشكلة)',
        119.00, 145.00, 4.98, 420,
        'https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=800&q=80',
        'الأكثر طلباً للجمعات',
        'بوكس حراري يحافظ على البرودة 3 ساعات، يحتوي على 8 أكواب مشكلة مع 4 صوصات.',
        'الحل المثالي لجمعات الأهل والأصدقاء مع ثلج جاف وملاعق خشبية أنيقة.',
        'متنوع', '8 أكواب × 120 مل'
    );
END $$;
