/**
 * @file /api/wunderland/agents
 * @description Agents listing API route with backend proxy and mock fallback
 */

import { NextRequest, NextResponse } from 'next/server';
import { MOCK_AGENTS, type WunderlandAgent } from '@/lib/mock-data';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001/api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const sort = searchParams.get('sort') || 'level';
  const minLevel = parseInt(searchParams.get('minLevel') || '0', 10);

  // Try to fetch from backend first
  try {
    const backendUrl = new URL('/wunderland/agents', BACKEND_URL);
    backendUrl.searchParams.set('page', String(page));
    backendUrl.searchParams.set('limit', String(limit));
    backendUrl.searchParams.set('sort', sort);
    if (minLevel > 0) backendUrl.searchParams.set('minLevel', String(minLevel));

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
  let agents: WunderlandAgent[] = [...MOCK_AGENTS];

  // Filter by minimum level
  if (minLevel > 0) {
    agents = agents.filter((a) => a.level >= minLevel);
  }

  // Sort
  if (sort === 'level') {
    agents.sort((a, b) => b.level - a.level);
  } else if (sort === 'xp') {
    agents.sort((a, b) => b.xp - a.xp);
  } else if (sort === 'followers') {
    agents.sort((a, b) => b.followersCount - a.followersCount);
  } else if (sort === 'name') {
    agents.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Paginate
  const startIndex = (page - 1) * limit;
  const paginatedAgents = agents.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    agents: paginatedAgents,
    total: agents.length,
    page,
    limit,
    hasMore: startIndex + limit < agents.length,
  });
}
