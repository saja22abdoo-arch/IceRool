import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import initialData from '../data/iceCreamData.json';
import { supabase } from '../lib/supabaseClient';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Navigation State
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'products' | 'product-detail' | 'orders' | 'admin'
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [adminActiveTab, setAdminActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders' | 'coupons' | 'settings'

  // Supabase Auth & Connection State
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [supabaseConnected, setSupabaseConnected] = useState(true);

  // Check if a user is admin
  const checkIsAdmin = (userObj) => {
    if (!userObj) return false;
    const role = userObj.user_metadata?.role;
    const email = userObj.email;
    return role === 'admin' || email === 'admin@iceroyal.com';
  };

  // Toast Notification State (defined early so functions can use it)
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  }, []);

  // Listen to Supabase Auth state changes
  useEffect(() => {
    // 1. Initial session check
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (error) {
        console.warn('Supabase getSession error:', error);
      }
      if (initialSession) {
        setSession(initialSession);
        setUser(initialSession.user);
        setIsAdmin(checkIsAdmin(initialSession.user));
      }
    });

    // 2. Auth State Change Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      const currentUser = currentSession?.user || null;
      setUser(currentUser);
      setIsAdmin(checkIsAdmin(currentUser));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signInWithEmail = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) throw error;

      if (data?.user) {
        setUser(data.user);
        setSession(data.session);
        const adminStatus = checkIsAdmin(data.user);
        setIsAdmin(adminStatus);
        return { user: data.user, session: data.session, error: null };
      }
      return { user: null, session: null, error: new Error('لم يتم استرجاع بيانات المستخدم') };
    } catch (err) {
      console.error('Sign in error:', err);
      return { user: null, error: err };
    }
  };

  // Sign up new user
  const signUpWithEmail = async (email, password, fullName) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: fullName.trim(),
            role: 'customer'
          }
        }
      });

      if (error) throw error;

      if (data?.user) {
        setUser(data.user);
        setSession(data.session);
        setIsAdmin(checkIsAdmin(data.user));
        return { user: data.user, error: null };
      }
      return { user: null, error: null };
    } catch (err) {
      console.error('Sign up error:', err);
      return { user: null, error: err };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      showToast('تم تسجيل الخروج بنجاح', 'info');
      if (currentView === 'admin') {
        setCurrentView('home');
      }
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  // Products State (Persisted in localStorage with initial fallback + Supabase sync)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('berry_products');
      return saved ? JSON.parse(saved) : initialData.products;
    } catch {
      return initialData.products;
    }
  });

  // Fetch live products from Supabase on load
  useEffect(() => {
    const fetchLiveProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            id,
            name,
            price,
            original_price,
            rating,
            reviews_count,
            image_url,
            badge,
            short_desc,
            description,
            calories,
            weight,
            prep_time,
            category:categories(slug)
          `)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setSupabaseConnected(true);
          // Merge or normalize with product structures
          const formatted = data.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category?.slug || 'berries',
            price: Number(p.price),
            originalPrice: p.original_price ? Number(p.original_price) : null,
            rating: Number(p.rating) || 5.0,
            reviewsCount: p.reviews_count || 120,
            image: p.image_url,
            badge: p.badge,
            shortDesc: p.short_desc,
            description: p.description,
            calories: p.calories || '210 سعرة',
            weight: p.weight || '250 مل',
            prepTime: p.prep_time || 'جاهز فوراً',
            sizes: [
              { id: 'single', name: 'كوب مفرد (سكوب واحد)', priceDelta: 0 },
              { id: 'double', name: 'كوب مزدوج (سكوبين)', priceDelta: 8 },
              { id: 'waffle', name: 'بسكويت وافل مقرمش', priceDelta: 5 },
              { id: 'pint', name: 'عبوة عائلية (نصف لتر)', priceDelta: 22 }
            ],
            toppings: [
              { id: 'sauce', name: 'صوص الشوكولاتة الذائبة', price: 4 },
              { id: 'berries', name: 'توت بري طازج مفروم', price: 5 },
              { id: 'pistachio', name: 'فستق حلبي مفروم', price: 5 }
            ]
          }));
          setProducts(formatted);
        }
      } catch (err) {
        console.warn('Could not load products from Supabase, using local fallback:', err);
      }
    };

    fetchLiveProducts();
  }, []);

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('berry_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders State (Persisted in localStorage with initial fallback)
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('berry_orders');
      return saved ? JSON.parse(saved) : initialData.initialOrders;
    } catch {
      return initialData.initialOrders;
    }
  });

  // Coupons State (Fixed / Editable in Admin)
  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem('berry_coupons');
      return saved ? JSON.parse(saved) : [
        { code: 'BERRY20', discount: 20, minSpend: 50, usageCount: 42, active: true, desc: 'خصم 20% على طلبات التوت والبوكسات' },
        { code: 'SWEET10', discount: 10, minSpend: 30, usageCount: 28, active: true, desc: 'خصم 10% ترحيبي لجميع العملاء' },
        { code: 'SUMMER15', discount: 15, minSpend: 60, usageCount: 19, active: true, desc: 'خصم صيفي منعش لجميع النكهات' }
      ];
    } catch {
      return [
        { code: 'BERRY20', discount: 20, minSpend: 50, usageCount: 42, active: true, desc: 'خصم 20% على طلبات التوت والبوكسات' },
        { code: 'SWEET10', discount: 10, minSpend: 30, usageCount: 28, active: true, desc: 'خصم 10% ترحيبي لجميع العملاء' }
      ];
    }
  });

  // Store Settings (Editable in Admin)
  const [storeSettings, setStoreSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('berry_settings');
      return saved ? JSON.parse(saved) : {
        storeName: 'آيس رويال | ICE ROYAL',
        phone: '+966 50 123 4567',
        email: 'support@iceroyal.com',
        workHours: '1:00 م - 2:00 ص',
        deliveryFee: 12,
        freeShippingThreshold: 80,
        storeStatus: 'مفتوح لاستقبال الطلبات'
      };
    } catch {
      return {
        storeName: 'آيس رويال | ICE ROYAL',
        phone: '+966 50 123 4567',
        email: 'support@iceroyal.com',
        workHours: '1:00 م - 2:00 ص',
        deliveryFee: 12,
        freeShippingThreshold: 80,
        storeStatus: 'مفتوح لاستقبال الطلبات'
      };
    }
  });

  // UI Drawers & Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState(null);

  // Promo Code Applied State
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscountRate, setPromoDiscountRate] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('berry_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('berry_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('berry_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('berry_coupons', JSON.stringify(coupons));
    } catch (e) {
      console.error(e);
    }
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem('berry_settings', JSON.stringify(storeSettings));
    } catch (e) {
      console.error(e);
    }
  }, [storeSettings]);

  // Protected Navigation helper: Guard Admin Route
  const navigate = (view, productId = null) => {
    if (view === 'admin') {
      if (!isAdmin) {
        showToast('عذراً! لوحة التحكم مخصصة لمدير المتجر فقط. يرجى تسجيل الدخول بحساب مسؤول (Admin) 🛡️', 'error');
        setIsAuthModalOpen(true);
        return;
      }
    }

    setCurrentView(view);
    if (productId !== null) {
      setSelectedProductId(productId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add Item to Cart
  const addToCart = (product, size, selectedToppings = [], quantity = 1) => {
    const sizeExtra = size ? size.priceDelta : 0;
    const toppingsExtra = selectedToppings.reduce((sum, top) => sum + top.price, 0);
    const unitPrice = product.price + sizeExtra + toppingsExtra;

    const toppingsKey = selectedToppings.map(t => t.id).sort().join('-');
    const cartItemId = `${product.id}_${size ? size.id : 'default'}_${toppingsKey}`;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        updated[existingIndex].totalPrice = updated[existingIndex].quantity * unitPrice;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: cartItemId,
            productId: product.id,
            name: product.name,
            image: product.image,
            sizeName: size ? size.name : 'كوب مفرد',
            toppings: selectedToppings.map(t => t.name),
            unitPrice,
            quantity,
            totalPrice: unitPrice * quantity
          }
        ];
      }
    });

    showToast(`تمت إضافة "${product.name}" إلى عربة التسوق! 🛒`, 'success');
  };

  // Update Item Quantity
  const updateQuantity = (cartItemId, delta) => {
    setCart(prevCart => {
      return prevCart
        .map(item => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: newQty * item.unitPrice
            };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  // Remove Item
  const removeFromCart = (cartItemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== cartItemId));
    showToast('تم حذف المنتج من عربة التسوق', 'info');
  };

  // Clear Cart
  const clearCart = () => {
    setCart([]);
  };

  // Promo Code Validation
  const applyPromoCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    const foundCoupon = coupons.find(c => c.code.toUpperCase() === cleanCode && c.active);

    if (foundCoupon) {
      const rate = foundCoupon.discount / 100;
      setPromoDiscountRate(rate);
      setPromoSuccess(`تم تفعيل كود الخصم (${foundCoupon.code})! حصلت على خصم ${foundCoupon.discount}% 🎉`);
      setPromoError('');
      showToast(`تم تطبيق كود الخصم ${foundCoupon.discount}%!`, 'success');
      return true;
    } else {
      setPromoError('كود الخصم غير صالح أو غير مفعل حالياً');
      setPromoSuccess('');
      return false;
    }
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const discountAmount = Math.round(cartSubtotal * promoDiscountRate);
  const deliveryFee = cartSubtotal > 0 ? (cartSubtotal >= storeSettings.freeShippingThreshold ? 0 : storeSettings.deliveryFee) : 0;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + deliveryFee);

  // Create Order from Checkout & sync to Supabase
  const createOrder = async (customerDetails) => {
    const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder = {
      id: newOrderId,
      date: formattedDate,
      status: 'preparing',
      statusArabic: 'قيد التجهيز في المطبخ',
      total: cartTotal,
      subtotal: cartSubtotal,
      discount: discountAmount,
      deliveryFee,
      paymentMethod: customerDetails.paymentMethod,
      customerName: customerDetails.name,
      customerPhone: customerDetails.phone,
      deliveryAddress: customerDetails.address,
      notes: customerDetails.notes || '',
      deliveryTime: 'التوصيل المتوقع خلال 30 دقيقة',
      items: [...cart]
    };

    setOrders(prev => [newOrder, ...prev]);

    // Save order in Supabase
    try {
      await supabase.from('orders').insert({
        order_number: newOrderId,
        customer_name: customerDetails.name,
        customer_phone: customerDetails.phone,
        delivery_address: customerDetails.address,
        notes: customerDetails.notes || '',
        payment_method: customerDetails.paymentMethod,
        subtotal: cartSubtotal,
        discount: discountAmount,
        delivery_fee: deliveryFee,
        total: cartTotal,
        status: 'preparing'
      });
    } catch (err) {
      console.warn('Could not sync order to Supabase:', err);
    }

    clearCart();
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    showToast(`تم تأكيد طلبك بنجاح! رقم الطلب: ${newOrderId} 🍨`, 'success');
    navigate('orders');
    return newOrderId;
  };

  // Re-order feature
  const reorder = (order) => {
    order.items.forEach(item => {
      const product = products.find(p => p.id === item.productId) || {
        id: item.productId,
        name: item.name,
        price: item.price || item.unitPrice,
        image: item.image
      };
      addToCart(product, { id: 'reorder', name: item.sizeName, priceDelta: 0 }, [], item.quantity);
    });
    setIsCartOpen(true);
    showToast('تمت إعادة إضافة مكونات الطلب إلى عربة التسوق!', 'success');
  };

  // --- ADMIN ACTIONS ---

  // Add Product
  const addProduct = async (newProd) => {
    const id = `ic-${Date.now().toString().slice(-4)}`;
    const createdProduct = {
      ...newProd,
      id,
      rating: 5.0,
      reviewsCount: 1,
      sizes: newProd.sizes || [
        { id: 'single', name: 'كوب مفرد (سكوب واحد)', priceDelta: 0 },
        { id: 'double', name: 'كوب مزدوج (سكوبين)', priceDelta: 8 },
        { id: 'pint', name: 'عبوة نصف لتر', priceDelta: 22 }
      ],
      toppings: newProd.toppings || [
        { id: 'sauce', name: 'صوص الشوكولاتة الذائبة', price: 4 },
        { id: 'pistachio', name: 'فستق حلبي مفروم', price: 5 }
      ]
    };
    setProducts(prev => [createdProduct, ...prev]);

    // Sync to Supabase
    try {
      await supabase.from('products').insert({
        name: createdProduct.name,
        price: createdProduct.price,
        original_price: createdProduct.originalPrice || null,
        rating: 5.0,
        reviews_count: 1,
        image_url: createdProduct.image,
        badge: createdProduct.badge || null,
        short_desc: createdProduct.shortDesc || '',
        description: createdProduct.description || '',
        calories: createdProduct.calories || '',
        weight: createdProduct.weight || '',
        prep_time: createdProduct.prepTime || 'جاهز فوراً',
        is_available: true
      });
    } catch (e) {
      console.warn('Could not insert product into Supabase:', e);
    }

    showToast(`تمت إضافة منتج "${createdProduct.name}" بنجاح! ✨`, 'success');
  };

  // Update Product
  const updateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    showToast('تم تحديث بيانات المنتج بنجاح', 'success');
  };

  // Delete Product
  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('تم حذف المنتج بنجاح', 'info');
  };

  // Update Order Status
  const updateOrderStatus = (orderId, newStatus) => {
    const statusMap = {
      preparing: 'قيد التجهيز في المطبخ',
      delivering: 'في الطريق مع السائق',
      delivered: 'تم التوصيل بنجاح',
      cancelled: 'تم الإلغاء'
    };

    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: newStatus,
          statusArabic: statusMap[newStatus] || order.statusArabic
        };
      }
      return order;
    }));
    showToast(`تم تحديث حالة الطلب ${orderId} إلى: ${statusMap[newStatus]}`, 'success');
  };

  // Toggle Coupon Status
  const toggleCouponStatus = (code) => {
    setCoupons(prev => prev.map(c => c.code === code ? { ...c, active: !c.active } : c));
    showToast('تم تعديل حالة كود الخصم', 'info');
  };

  // Add Coupon
  const addCoupon = (newCoupon) => {
    setCoupons(prev => [newCoupon, ...prev]);
    showToast(`تمت إضافة كود الخصم ${newCoupon.code} بنجاح!`, 'success');
  };

  // Delete Coupon
  const deleteCoupon = (code) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
    showToast('تم حذف كود الخصم', 'info');
  };

  // Update Store Settings
  const updateSettings = (newSettings) => {
    setStoreSettings(prev => ({ ...prev, ...newSettings }));
    showToast('تم حفظ إعدادات المتجر بنجاح', 'success');
  };

  return (
    <CartContext.Provider
      value={{
        currentView,
        selectedProductId,
        adminActiveTab,
        setAdminActiveTab,
        navigate,
        user,
        session,
        isAdmin,
        isAuthModalOpen,
        setIsAuthModalOpen,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        supabaseConnected,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        cartCount,
        cartSubtotal,
        discountAmount,
        deliveryFee,
        cartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        promoCode,
        setPromoCode,
        promoDiscountRate,
        promoError,
        promoSuccess,
        applyPromoCode,
        orders,
        createOrder,
        reorder,
        trackingOrder,
        setTrackingOrder,
        updateOrderStatus,
        coupons,
        toggleCouponStatus,
        addCoupon,
        deleteCoupon,
        storeSettings,
        updateSettings,
        toast,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
