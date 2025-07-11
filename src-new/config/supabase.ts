import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-supabase-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key-for-government-system';

// تحقق من أن المتغيرات ليست القيم التجريبية في بيئة الإنتاج
if (import.meta.env.PROD && (supabaseUrl.includes('demo') || supabaseAnonKey.includes('demo'))) {
  console.warn('⚠️ تحذير: يتم استخدام قيم Supabase تجريبية في بيئة الإنتاج');
}

/**
 * عميل Supabase الموحد
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * إعداد مستمع تغييرات حالة المصادقة
 */
export const setupAuthListener = (callback: (event: string, session: any) => void) => {
  console.log('🔐 إعداد مستمع المصادقة...');
  
  return supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔄 تغيير حالة المصادقة:', event, session?.user?.id);
    callback(event, session);
  });
};

export default supabase;

