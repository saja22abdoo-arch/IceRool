import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, LogIn, UserPlus, Eye, EyeOff, AlertCircle } from 'lucide-react';

const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    signInWithEmail, 
    signUpWithEmail, 
    user, 
    isAdmin, 
    signOut,
    navigate,
    showToast
  } = useCart();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const { user: loggedInUser, error } = await signInWithEmail(email, password);
        if (error) {
          setErrorMessage(error.message === 'Invalid login credentials' 
            ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' 
            : (error.message || 'فشل تسجيل الدخول، يرجى المحاولة مرة أخرى'));
        } else {
          setIsAuthModalOpen(false);
          const isUserAdmin = loggedInUser?.user_metadata?.role === 'admin' || loggedInUser?.email === 'admin@iceroyal.com';
          if (isUserAdmin) {
            showToast('تم تسجيل الدخول بنجاح بصلاحية مدير المتجر! 🛡️', 'success');
            navigate('admin');
          } else {
            showToast(`أهلاً بك مجدداً ${loggedInUser?.user_metadata?.name || ''}! 🍦`, 'success');
          }
        }
      } else {
        if (!fullName.trim()) {
          setErrorMessage('يرجى إدخال الاسم الكريم');
          setLoading(false);
          return;
        }
        const { error } = await signUpWithEmail(email, password, fullName);
        if (error) {
          setErrorMessage(error.message || 'تعذر إنشاء الحساب');
        } else {
          setIsAuthModalOpen(false);
          showToast('تم إنشاء الحساب بنجاح وتسجيل الدخول! 🎉', 'success');
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdminLogin = async () => {
    setEmail('admin@iceroyal.com');
    setPassword('admin123456');
    setLoading(true);
    setErrorMessage('');
    const { error } = await signInWithEmail('admin@iceroyal.com', 'admin123456');
    setLoading(false);
    if (!error) {
      setIsAuthModalOpen(false);
      showToast('مرحباً بك يا مدير المتجر! تم منحك صلاحيات لوحة التحكم الكاملة 🛡️', 'success');
      navigate('admin');
    } else {
      setErrorMessage(error.message || 'فشل تسجيل الدخول التجريبي');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#4F1A16]/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsAuthModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#FFFDF9] rounded-3xl max-w-md w-full shadow-2xl border-2 border-[#C94238]/20 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Decor */}
        <div className="bg-gradient-to-r from-[#4F1A16] via-[#782722] to-[#9C322B] text-white p-6 relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 left-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-3">
            <Lock className="w-6 h-6 text-[#F24F44]" />
          </div>

          <h2 className="text-2xl font-black">
            {user ? 'حسابك في آيس رويال' : (mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد')}
          </h2>
          <p className="text-xs text-white/80 mt-1">
            {user 
              ? 'مرحباً بك، يمكنك إدارة حسابك أو تسجيل الخروج' 
              : 'سجل دخولك لمتابعة طلباتك أو إدارة المتجر بصلاحيات الإدارة'}
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {user ? (
            /* Logged In View */
            <div className="space-y-4 text-center py-2">
              <div className="w-16 h-16 rounded-full bg-[#FAF0EE] border-2 border-[#C94238]/30 flex items-center justify-center mx-auto text-[#9C322B]">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-black text-lg text-[#4F1A16]">
                  {user.user_metadata?.name || 'مستخدم مسجل'}
                </h3>
                <p className="text-xs text-[#782722] mt-0.5">{user.email}</p>
                {isAdmin ? (
                  <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-300">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    حساب مسؤول (Admin) مفعّل
                  </span>
                ) : (
                  <span className="inline-block mt-2 px-3 py-1 bg-[#FAF0EE] text-[#9C322B] text-xs font-bold rounded-full">
                    عميل في المتجر
                  </span>
                )}
              </div>

              <div className="pt-4 flex flex-col gap-2">
                {isAdmin && (
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(false);
                      navigate('admin');
                    }}
                    className="w-full bg-[#4F1A16] hover:bg-[#782722] text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#F24F44]" />
                    <span>الدخول إلى لوحة التحكم الإدارية</span>
                  </button>
                )}
                
                <button
                  onClick={() => {
                    signOut();
                    setIsAuthModalOpen(false);
                  }}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-700 py-3 rounded-xl font-bold text-sm transition-colors border border-red-200"
                >
                  تسجيل الخروج
                </button>
              </div>
            </div>
          ) : (
            /* Auth Form */
            <div>
              {/* Tab Switcher */}
              <div className="flex bg-[#FAF0EE] p-1 rounded-xl mb-5 border border-[#C94238]/15">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMessage(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    mode === 'login'
                      ? 'bg-white text-[#4F1A16] shadow-xs'
                      : 'text-[#782722] hover:text-[#4F1A16]'
                  }`}
                >
                  تسجيل الدخول
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setErrorMessage(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    mode === 'signup'
                      ? 'bg-white text-[#4F1A16] shadow-xs'
                      : 'text-[#782722] hover:text-[#4F1A16]'
                  }`}
                >
                  حساب جديد
                </button>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-bold animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-[#4F1A16] mb-1.5 text-right">
                      الاسم الكامل
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="محمد عبدالله"
                        className="w-full bg-white border border-[#C94238]/25 rounded-xl px-4 py-3 pl-10 text-xs font-medium text-[#4F1A16] placeholder:text-[#782722]/40 focus:outline-hidden focus:border-[#9C322B] focus:ring-2 focus:ring-[#9C322B]/20 transition-all text-right"
                      />
                      <User className="w-4 h-4 text-[#782722]/50 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#4F1A16] mb-1.5 text-right">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-white border border-[#C94238]/25 rounded-xl px-4 py-3 pl-10 text-xs font-medium text-[#4F1A16] placeholder:text-[#782722]/40 focus:outline-hidden focus:border-[#9C322B] focus:ring-2 focus:ring-[#9C322B]/20 transition-all text-right"
                    />
                    <Mail className="w-4 h-4 text-[#782722]/50 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4F1A16] mb-1.5 text-right">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-[#C94238]/25 rounded-xl px-4 py-3 pl-10 text-xs font-medium text-[#4F1A16] placeholder:text-[#782722]/40 focus:outline-hidden focus:border-[#9C322B] focus:ring-2 focus:ring-[#9C322B]/20 transition-all text-right"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#782722]/60 hover:text-[#4F1A16] absolute left-3 top-1/2 -translate-y-1/2"
                      aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#9C322B] via-[#C94238] to-[#F24F44] hover:opacity-95 text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-[#9C322B]/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                      <span>{mode === 'login' ? 'دخول' : 'تسجيل حساب جديد'}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Quick Admin Demo Box */}
              <div className="mt-5 pt-4 border-t border-[#C94238]/15 bg-[#FAF0EE]/60 rounded-2xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#4F1A16]">
                    <ShieldCheck className="w-4 h-4 text-[#F24F44]" />
                    <span>حساب مدير المتجر المعتمد (Admin)</span>
                  </div>
                  <span className="text-[10px] bg-[#9C322B]/10 text-[#9C322B] font-bold px-2 py-0.5 rounded-md">
                    Supabase
                  </span>
                </div>
                <p className="text-[11px] text-[#782722] mb-3 leading-relaxed">
                  للتحقق من صلاحية الوصول الحصرية للوحة التحكم الإدارية، يمكنك الدخول بنقرة واحدة بحساب المدير:
                </p>
                <button
                  type="button"
                  onClick={handleQuickAdminLogin}
                  disabled={loading}
                  className="w-full bg-[#4F1A16] hover:bg-[#782722] text-white py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F24F44] group-hover:rotate-12 transition-transform" />
                  <span>دخول تجريبي سريع كمسؤول (admin@iceroyal.com)</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AuthModal;
