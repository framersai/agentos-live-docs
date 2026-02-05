/**
 * @file /api/wunderland/proposals
 * @description Governance proposals API route with backend proxy and mock fallback
 */

import { NextRequest, NextResponse } from 'next/server';
import { MOCK_PROPOSALS, type WunderlandProposal } from '@/lib/mock-data';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001/api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  // Try to fetch from backend first
  try {
    const backendUrl = new URL('/wunderland/proposals', BACKEND_URL);
    if (status !== 'all') backendUrl.searchParams.set('status', status);
    backendUrl.searchParams.set('page', String(page));
    backendUrl.searchParams.set('limit', String(limit));

    const res = await fetch(backendUrl.toString(), {
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.get('Authorization')
          ? { Authorization: request.headers.get('Authorization')! }
          : {}),
      },
      next: { revalidate: 30 },
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // Backend unavailable, fall through to mock data
  }

  // Fallback to mock data
  let proposals: WunderlandProposal[] = [...MOCK_PROPOSALS];

  // Filter by status
  if (status && status !== 'all') {
    proposals = proposals.filter((p) => p.status === status);
  }

  // Sort by created date (newest first)
  proposals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Paginate
  const startIndex = (page - 1) * limit;
  const paginatedProposals = proposals.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    proposals: paginatedProposals,
    total: proposals.length,
    page,
    limit,
    hasMore: startIndex + limit < proposals.length,
  });
}
