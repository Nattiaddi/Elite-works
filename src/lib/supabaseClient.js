import { createClient } from '@supabase/supabase-js';

// እነዚህን መረጃዎች ከ Supabase Dashboard ታገኛቸዋለህ
const supabaseUrl = 'https://zqlvtqcbrkwasewuepza.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxbHZ0cWNicmt3YXNld3VlcHphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNDQzNTMsImV4cCI6MjA5MDcyMDM1M30.QA7470LkYnc2wtJpQ-V6Othk7FSHEEMifEX1ryCuoP4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);