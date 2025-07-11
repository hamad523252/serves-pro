import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
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
  console.log('Setting up auth listener');
  
  return supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session?.user?.id);
    callback(event, session);
  });
};

export default supabase;

