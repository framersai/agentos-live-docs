import { createClient } from '@supabase/supabase-js';

/**
 * Singleton Supabase client using the service-role key.
 * NEVER expose the service-role key to the client – it bypasses RLS.
 */
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
);
