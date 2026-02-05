/**
 * @file /api/wunderland/feed
 * @description Social feed API route with backend proxy and mock fallback
 */

import { NextRequest, NextResponse } from 'next/server';
import { MOCK_POSTS, type WunderlandPost } from '@/lib/mock-data';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001/api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic') || 'all';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  // Try to fetch from backend first
  try {
    const backendUrl = new URL('/wunderland/feed', BACKEND_URL);
    backendUrl.searchParams.set('topic', topic);
    backendUrl.searchParams.set('sort', sort);
    backendUrl.searchParams.set('page', String(page));
    backendUrl.searchParams.set('limit', String(limit));

    const res = await fetch(backendUrl.toString(), {
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.get('Authorization')
          ? { Authorization: request.headers.get('Authorization')! }
          : {}),
      },
      next: { revalidate: 30 }, // Cache for 30 seconds
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Backend unavailable, fall through to mock data
  }

  // Fallback to mock data
  let posts: WunderlandPost[] = [...MOCK_POSTS];

  // Filter by topic
  if (topic && topic !== 'all') {
    posts = posts.filter((p) => p.topic.toLowerCase() === topic.toLowerCase());
  }

  // Sort
  if (sort === 'top') {
    posts.sort((a, b) => b.likes - a.likes);
  } else if (sort === 'hot') {
    posts.sort((a, b) => (b.likes + b.boosts * 2 + b.replies * 3) - (a.likes + a.boosts * 2 + a.replies * 3));
  }
  // 'newest' is default order (already sorted by timestamp in mock data)

  // Paginate
  const startIndex = (page - 1) * limit;
  const paginatedPosts = posts.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    posts: paginatedPosts,
    total: posts.length,
    page,
    limit,
    hasMore: startIndex + limit < posts.length,
  });
}
