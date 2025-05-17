import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'dummy_key';

if (!supabaseUrl || supabaseUrl === 'https://example.supabase.co' || 
    !supabaseAnonKey || supabaseAnonKey === 'dummy_key') {
  console.warn('Supabase credentials missing or using defaults. Some functionality may not work properly.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
