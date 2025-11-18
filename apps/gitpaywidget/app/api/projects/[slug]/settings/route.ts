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

export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await requireSession();
    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .select('id, project_settings(accent_hex, cta_label, custom_css)')
      .eq('slug', params.slug)
      .eq('owner_id', session.user.id)
      .maybeSingle();
    if (error) throw error;
    if (!project) return NextResponse.json({ error: 'project not found' }, { status: 404 });
    return NextResponse.json(project.project_settings ?? {});
  } catch (err: any) {
    const status = err.message === 'unauthenticated' ? 401 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await requireSession();
    const body = (await req.json()) as {
      accent_hex?: string;
      cta_label?: string;
      custom_css?: string;
    };
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('id')
      .eq('slug', params.slug)
      .eq('owner_id', session.user.id)
      .maybeSingle();
    if (projectError) throw projectError;
    if (!project) return NextResponse.json({ error: 'project not found' }, { status: 404 });

    const payload = {
      project_id: project.id,
      accent_hex: body.accent_hex,
      cta_label: body.cta_label,
      custom_css: body.custom_css,
    };

    const { error } = await supabaseAdmin.from('project_settings').upsert(payload);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const status = err.message === 'unauthenticated' ? 401 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
