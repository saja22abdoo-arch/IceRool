import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

const Toast = () => {
  const { toast } = useCart();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-[#4F1A16] text-white px-5 py-3.5 rounded-2xl shadow-xl border border-[#C94238]/30 flex items-center gap-3 max-w-md">
        <div className="w-8 h-8 rounded-xl bg-[#F24F44] text-white flex items-center justify-center shrink-0">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : toast.type === 'error' ? (
            <AlertTriangle className="w-5 h-5" />
          ) : (
            <Info className="w-5 h-5" />
          )}
        </div>
        <div>
          <p className="text-xs sm:text-sm font-bold text-white leading-tight">
            {toast.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Toast;
