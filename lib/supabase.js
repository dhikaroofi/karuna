import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Create client even if env vars are missing (for build time)
// The actual functionality will only work when proper env vars are set
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
