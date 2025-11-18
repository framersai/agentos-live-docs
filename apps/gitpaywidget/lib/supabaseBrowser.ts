import { createBrowserClient } from '@supabase/auth-helpers-nextjs';

/**
 * Client-side helper for components/hooks that need Supabase (uses anon key).
 */
export const supabaseBrowser = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
