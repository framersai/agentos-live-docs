/**
 * @file useWunderlandData.ts
 * @description React hooks for fetching Wunderland data from API routes
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  WunderlandPost,
  WunderlandAgent,
  WunderlandProposal,
  WorldFeedItem,
} from '@/lib/mock-data';

// --- Types ---

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  reload: () => void;
}

interface FeedResponse {
  posts: WunderlandPost[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

interface AgentsResponse {
  agents: WunderlandAgent[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

interface AgentResponse {
  agent: WunderlandAgent;
  posts: WunderlandPost[];
  postsCount: number;
}

interface ProposalsResponse {
  proposals: WunderlandProposal[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

interface WorldFeedResponse {
  items: WorldFeedItem[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// --- Generic Fetch Hook ---

function useApi<T>(url: string | null): ApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err);
        setLoading(false);
      });

    return () => controller.abort();
  }, [url, reloadKey]);

  return { data, loading, error, reload };
}

// --- Domain-Specific Hooks ---

export interface UseFeedOptions {
  topic?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export function useWunderlandFeed(options: UseFeedOptions = {}): ApiState<FeedResponse> {
  const { topic = 'all', sort = 'newest', page = 1, limit = 10 } = options;

  const params = new URLSearchParams();
  params.set('topic', topic);
  params.set('sort', sort);
  params.set('page', String(page));
  params.set('limit', String(limit));

  return useApi<FeedResponse>(`/api/wunderland/feed?${params.toString()}`);
}

export interface UseAgentsOptions {
  sort?: string;
  minLevel?: number;
  page?: number;
  limit?: number;
}

export function useWunderlandAgents(options: UseAgentsOptions = {}): ApiState<AgentsResponse> {
  const { sort = 'level', minLevel = 0, page = 1, limit = 20 } = options;

  const params = new URLSearchParams();
  params.set('sort', sort);
  params.set('page', String(page));
  params.set('limit', String(limit));
  if (minLevel > 0) params.set('minLevel', String(minLevel));

  return useApi<AgentsResponse>(`/api/wunderland/agents?${params.toString()}`);
}

export function useWunderlandAgent(seedId: string | null): ApiState<AgentResponse> {
  const url = seedId ? `/api/wunderland/agents/${encodeURIComponent(seedId)}` : null;
  return useApi<AgentResponse>(url);
}

export interface UseProposalsOptions {
  status?: string;
  page?: number;
  limit?: number;
}

export function useWunderlandProposals(options: UseProposalsOptions = {}): ApiState<ProposalsResponse> {
  const { status = 'all', page = 1, limit = 10 } = options;

  const params = new URLSearchParams();
  if (status !== 'all') params.set('status', status);
  params.set('page', String(page));
  params.set('limit', String(limit));

  return useApi<ProposalsResponse>(`/api/wunderland/proposals?${params.toString()}`);
}

export interface UseWorldFeedOptions {
  category?: string;
  source?: string;
  page?: number;
  limit?: number;
}

export function useWorldFeed(options: UseWorldFeedOptions = {}): ApiState<WorldFeedResponse> {
  const { category = 'all', source = 'all', page = 1, limit = 20 } = options;

  const params = new URLSearchParams();
  if (category !== 'all') params.set('category', category);
  if (source !== 'all') params.set('source', source);
  params.set('page', String(page));
  params.set('limit', String(limit));

  return useApi<WorldFeedResponse>(`/api/wunderland/world-feed?${params.toString()}`);
}

// --- Re-export types ---

export type {
  WunderlandPost,
  WunderlandAgent,
  WunderlandProposal,
  WorldFeedItem,
} from '@/lib/mock-data';
