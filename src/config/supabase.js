import { createClient } from '@supabase/supabase-js';

// Vite ውስጥ Environment Variables የሚጠሩት በ import.meta.env ነው
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ለጥንቃቄ፡ ቫሪያብሎቹ ካልተገኙ በ Console ላይ ማስጠንቀቂያ እንዲሰጠን
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "⚠️ Supabase Error: URL ወይም Anon Key አልተገኘም! \n" +
    "1. በ Vercel Settings ላይ VITE_ በመጀመር መመዝገባቸውን አረጋግጥ። \n" +
    "2. በኮምፒውተርህ .env ፋይል ውስጥ መኖራቸውን አረጋግጥ።"
  );
}

// ክሊየንቱን መፍጠር
export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);