import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';

/**
 * Public endpoint exposing theme data for embedded widgets.
 */
export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('project_settings(accent_hex, cta_label, custom_css)')
    .eq('slug', params.slug)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'project not found' }, { status: 404 });
  return NextResponse.json(data.project_settings ?? {});
}
