import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { supabaseAdmin } from '@/lib/supabaseServer';

/**
 * Fetch the Supabase session associated with the current cookies.
 * Throws when the user is unauthenticated.
 */
async function requireSession() {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error('unauthenticated');
  return session;
}

export async function GET() {
  try {
    const session = await requireSession();
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('id, name, slug, created_at')
      .eq('owner_id', session.user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ projects: data });
  } catch (err: any) {
    const status = err.message === 'unauthenticated' ? 401 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}

/**
 * Create a new project owned by the authenticated user.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = (await req.json()) as { name: string; slug: string };
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: 'name and slug required' }, { status: 400 });
    }
    const { error } = await supabaseAdmin.from('projects').insert({
      name: body.name,
      slug: body.slug,
      owner_id: session.user.id,
    });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const status = err.message === 'unauthenticated' ? 401 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
