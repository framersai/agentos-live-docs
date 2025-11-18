import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { encryptSecret } from '@/lib/crypto';

type RouteParams = { params: { slug: string } };

/**
 * GET/POST/DELETE handler for provider credentials scoped to a given project slug.
 * Expects Supabase authentication via middleware.
 */

export async function GET(_: NextRequest, { params }: RouteParams) {
  const { data: project, error } = await supabaseAdmin
    .from('projects')
    .select('id, slug, provider_keys(provider, updated_at, metadata)')
    .eq('slug', params.slug)
    .maybeSingle();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!project) {
    return NextResponse.json({ error: 'project not found' }, { status: 404 });
  }
  const data =
    project.provider_keys?.map(key => ({
      provider: key.provider,
      updatedAt: key.updated_at,
      metadata: key.metadata,
    })) ?? [];
  return NextResponse.json({ project: project.slug, keys: data });
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const body = (await req.json()) as {
    provider: string;
    secret: string;
    metadata?: Record<string, string>;
  };
  if (!body.provider || !body.secret) {
    return NextResponse.json({ error: 'provider and secret required' }, { status: 400 });
  }
  const { data: project, error: projectError } = await supabaseAdmin
    .from('projects')
    .select('id')
    .eq('slug', params.slug)
    .maybeSingle();
  if (projectError) return NextResponse.json({ error: projectError.message }, { status: 500 });
  if (!project) return NextResponse.json({ error: 'project not found' }, { status: 404 });

  const encrypted = encryptSecret(body.secret);
  const { error } = await supabaseAdmin.from('provider_keys').upsert({
    project_id: project.id,
    provider: body.provider,
    key: encrypted,
    metadata: body.metadata || {},
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const body = (await req.json()) as { provider: string };
  if (!body.provider) {
    return NextResponse.json({ error: 'provider required' }, { status: 400 });
  }
  const { data: project, error: projectError } = await supabaseAdmin
    .from('projects')
    .select('id')
    .eq('slug', params.slug)
    .maybeSingle();
  if (projectError) return NextResponse.json({ error: projectError.message }, { status: 500 });
  if (!project) return NextResponse.json({ error: 'project not found' }, { status: 404 });
  const { error } = await supabaseAdmin
    .from('provider_keys')
    .delete()
    .eq('project_id', project.id)
    .eq('provider', body.provider);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
