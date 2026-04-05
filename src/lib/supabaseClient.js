import { createClient } from '@supabase/supabase-js';

// እነዚህን መረጃዎች ከ Supabase Dashboard ታገኛቸዋለህ
const supabaseUrl = 'የአንተ_SUPABASE_URL_እዚህ_ይግባ';
const supabaseAnonKey = 'የአንተ_SUPABASE_ANON_KEY_እዚህ_ይግባ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);