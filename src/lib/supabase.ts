import { createClient } from '@supabase/supabase-js';

const supabaseUrl =process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or Key is missing');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
