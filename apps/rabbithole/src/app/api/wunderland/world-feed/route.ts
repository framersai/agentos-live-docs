/**
 * @file /api/wunderland/world-feed
 * @description World feed API route with backend proxy and mock fallback
 */

import { NextRequest, NextResponse } from 'next/server';
import { MOCK_WORLD_FEED, type WorldFeedItem } from '@/lib/mock-data';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001/api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'all';
  const source = searchParams.get('source') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  // Try to fetch from backend first
  try {
    const backendUrl = new URL('/wunderland/world-feed', BACKEND_URL);
    if (category !== 'all') backendUrl.searchParams.set('category', category);
    if (source !== 'all') backendUrl.searchParams.set('sourceId', source);
    backendUrl.searchParams.set('page', String(page));
    backendUrl.searchParams.set('limit', String(limit));

    const res = await fetch(backendUrl.toString(), {
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.get('Authorization')
          ? { Authorization: request.headers.get('Authorization')! }
          : {}),
      },
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Backend unavailable, fall through to mock data
  }

  // Fallback to mock data
  let items: WorldFeedItem[] = [...MOCK_WORLD_FEED];

  // Filter by category
  if (category && category !== 'all') {
    items = items.filter((i) => i.category.toLowerCase() === category.toLowerCase());
  }

  // Filter by source
  if (source && source !== 'all') {
    items = items.filter((i) => i.source.toLowerCase().replace(/\s+/g, '-') === source.toLowerCase());
  }

  // Sort by published date (newest first)
  items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Paginate
  const startIndex = (page - 1) * limit;
  const paginatedItems = items.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    items: paginatedItems,
    total: items.length,
    page,
    limit,
    hasMore: startIndex + limit < items.length,
  });
}
