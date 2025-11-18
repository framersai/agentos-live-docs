import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';

/**
 * Returns aggregate metrics for a given project.
 * For now this returns stubbed data; hook into your analytics warehouse later.
 */
export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const { data: project, error } = await supabaseAdmin
    .from('projects')
    .select('id')
    .eq('slug', params.slug)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!project) return NextResponse.json({ error: 'project not found' }, { status: 404 });

  const now = new Date();
  return NextResponse.json({
    mrr: 1999, // cents
    checkoutsToday: 42,
    conversionRate: 0.18,
    updatedAt: now.toISOString(),
  });
}
