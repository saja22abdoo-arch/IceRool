import { createClient } from '@supabase/supabase-js';

// استخراج مفاتيح الاتصال من متغيرات البيئة الخاصة بـ Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-id.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here';

/**
 * عميل Supabase الموحد للمشروع
 * يتضمن إعدادات التخزين المؤقت، إعادة المحاولة التلقائية، والاتصال بالـ Realtime
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export default supabase;
