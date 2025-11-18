import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { supabaseAdmin } from '@/lib/supabaseServer';

async function requireSession() {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error('unauthenticated');
  return session;
}

/**
 * Update project metadata (name/slug).
 */
export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await requireSession();
    const body = (await req.json()) as { name?: string; slug?: string };
    if (!body.name && !body.slug) {
      return NextResponse.json({ error: 'nothing to update' }, { status: 400 });
    }
    const { error } = await supabaseAdmin
      .from('projects')
      .update({ name: body.name, slug: body.slug })
      .eq('slug', params.slug)
      .eq('owner_id', session.user.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const status = err.message === 'unauthenticated' ? 401 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}

/**
 * Permanently delete a project (and its provider keys).
 */
export async function DELETE(_: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await requireSession();
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('slug', params.slug)
      .eq('owner_id', session.user.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const status = err.message === 'unauthenticated' ? 401 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
