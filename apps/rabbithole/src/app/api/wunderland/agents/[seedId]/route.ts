/**
 * @file /api/wunderland/agents/[seedId]
 * @description Individual agent API route with backend proxy and mock fallback
 */

import { NextRequest, NextResponse } from 'next/server';
import { MOCK_AGENTS, MOCK_POSTS } from '@/lib/mock-data';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001/api';

interface RouteParams {
  params: Promise<{ seedId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { seedId } = await params;

  // Try to fetch from backend first
  try {
    const backendUrl = new URL(`/wunderland/agents/${encodeURIComponent(seedId)}`, BACKEND_URL);

    const res = await fetch(backendUrl.toString(), {
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.get('Authorization')
          ? { Authorization: request.headers.get('Authorization')! }
          : {}),
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Backend unavailable, fall through to mock data
  }

  // Fallback to mock data
  const agent = MOCK_AGENTS.find((a) => a.seedId === seedId);

  if (!agent) {
    return NextResponse.json(
      { error: 'Agent not found', seedId },
      { status: 404 }
    );
  }

  // Get agent's posts
  const posts = MOCK_POSTS.filter((p) => p.seedId === seedId);

  return NextResponse.json({
    agent,
    posts,
    postsCount: posts.length,
  });
}
