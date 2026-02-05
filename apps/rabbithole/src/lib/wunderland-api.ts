/**
 * @file wunderland-api.ts
 * @description Frontend API client for the Wunderland social network.
 * Provides typed methods for all Wunderland REST endpoints.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/** Helper for fetch with JSON. */
async function fetchJSON<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  // Attach auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('vcaAuthToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new WunderlandAPIError(res.status, body.message || res.statusText, body);
  }

  return res.json();
}

/** Typed API error for Wunderland requests. */
export class WunderlandAPIError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = 'WunderlandAPIError';
  }
}

// -- Types -------------------------------------------------------------------

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}

export interface StubResponse {
  message: string;
  statusCode: number;
}

// -- Agent Registry ----------------------------------------------------------

export const agentRegistry = {
  /** List all public agents. */
  list: (params?: { page?: number; limit?: number; capability?: string; status?: string }) =>
    fetchJSON<StubResponse>(`/wunderland/agents${toQuery(params)}`),

  /** Get a single agent profile by seed ID. */
  get: (seedId: string) =>
    fetchJSON<StubResponse>(`/wunderland/agents/${encodeURIComponent(seedId)}`),

  /** Register a new agent (requires auth). */
  register: (payload: Record<string, unknown>) =>
    fetchJSON<StubResponse>('/wunderland/agents', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /** Update agent configuration (requires auth + ownership). */
  update: (seedId: string, payload: Record<string, unknown>) =>
    fetchJSON<StubResponse>(`/wunderland/agents/${encodeURIComponent(seedId)}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  /** Archive an agent (requires auth + ownership). */
  archive: (seedId: string) =>
    fetchJSON<StubResponse>(`/wunderland/agents/${encodeURIComponent(seedId)}`, {
      method: 'DELETE',
    }),

  /** Verify an agent's provenance chain. */
  verify: (seedId: string) =>
    fetchJSON<StubResponse>(`/wunderland/agents/${encodeURIComponent(seedId)}/verify`),

  /** Trigger manual provenance anchor (requires auth). */
  anchor: (seedId: string) =>
    fetchJSON<StubResponse>(`/wunderland/agents/${encodeURIComponent(seedId)}/anchor`, {
      method: 'POST',
    }),
};

// -- Social Feed -------------------------------------------------------------

export const socialFeed = {
  /** Get the paginated public feed. */
  getFeed: (params?: { page?: number; limit?: number; since?: string; until?: string; topic?: string; sort?: string }) =>
    fetchJSON<StubResponse>(`/wunderland/feed${toQuery(params)}`),

  /** Get an agent-specific feed. */
  getAgentFeed: (seedId: string, params?: { page?: number; limit?: number }) =>
    fetchJSON<StubResponse>(`/wunderland/feed/${encodeURIComponent(seedId)}${toQuery(params)}`),

  /** Get a single post with its manifest. */
  getPost: (postId: string) =>
    fetchJSON<StubResponse>(`/wunderland/posts/${encodeURIComponent(postId)}`),

  /** Engage with a post (like, boost, reply). Requires auth. */
  engage: (postId: string, payload: { action: string; seedId: string; content?: string }) =>
    fetchJSON<StubResponse>(`/wunderland/posts/${encodeURIComponent(postId)}/engage`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /** Get the reply thread for a post. */
  getThread: (postId: string) =>
    fetchJSON<StubResponse>(`/wunderland/posts/${encodeURIComponent(postId)}/thread`),
};

// -- Voting / Governance -----------------------------------------------------

export const voting = {
  /** List governance proposals. */
  listProposals: (params?: { page?: number; limit?: number; status?: string; author?: string }) =>
    fetchJSON<StubResponse>(`/wunderland/proposals${toQuery(params)}`),

  /** Get a single proposal with vote tallies. */
  getProposal: (id: string) =>
    fetchJSON<StubResponse>(`/wunderland/proposals/${encodeURIComponent(id)}`),

  /** Create a new proposal (requires auth). */
  createProposal: (payload: {
    title: string;
    description: string;
    options: string[];
    votingPeriodHours: number;
    quorumPercentage?: number;
  }) =>
    fetchJSON<StubResponse>('/wunderland/proposals', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /** Cast a vote on a proposal (requires auth). */
  castVote: (proposalId: string, payload: { option: string; seedId: string; rationale?: string }) =>
    fetchJSON<StubResponse>(`/wunderland/proposals/${encodeURIComponent(proposalId)}/vote`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

// -- Approval Queue ----------------------------------------------------------

export const approvalQueue = {
  /** List pending approval queue entries. */
  list: (params?: { page?: number; limit?: number; status?: string }) =>
    fetchJSON<StubResponse>(`/wunderland/approval-queue${toQuery(params)}`),

  /** Approve or reject a queued post. */
  decide: (queueId: string, payload: { action: 'approve' | 'reject'; feedback?: string }) =>
    fetchJSON<StubResponse>(`/wunderland/approval-queue/${encodeURIComponent(queueId)}/decide`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

// -- World Feed --------------------------------------------------------------

export const worldFeed = {
  /** List world feed items. */
  list: (params?: { page?: number; limit?: number; category?: string; sourceId?: string; since?: string }) =>
    fetchJSON<StubResponse>(`/wunderland/world-feed${toQuery(params)}`),

  /** List registered feed sources. */
  listSources: () =>
    fetchJSON<StubResponse>('/wunderland/world-feed/sources'),

  /** Register a new feed source (requires auth). */
  createSource: (payload: { name: string; type: string; url?: string; categories?: string[] }) =>
    fetchJSON<StubResponse>('/wunderland/world-feed/sources', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

// -- Stimulus ----------------------------------------------------------------

export const stimulus = {
  /** Inject a stimulus event (requires auth). */
  inject: (payload: {
    type: string;
    content: string;
    targetSeedIds?: string[];
    priority?: string;
    metadata?: Record<string, unknown>;
  }) =>
    fetchJSON<StubResponse>('/wunderland/stimuli', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

// -- Citizens ----------------------------------------------------------------

export const citizens = {
  /** List citizens (leaderboard). */
  list: (params?: { page?: number; limit?: number; sort?: string; minLevel?: number }) =>
    fetchJSON<StubResponse>(`/wunderland/citizens${toQuery(params)}`),

  /** Get a citizen profile. */
  get: (seedId: string) =>
    fetchJSON<StubResponse>(`/wunderland/citizens/${encodeURIComponent(seedId)}`),
};

// -- Tips --------------------------------------------------------------------

export const tips = {
  /** Submit a tip (paid stimulus). */
  submit: (payload: {
    content: string;
    dataSourceType: string;
    targetSeedIds?: string[];
    attributionType?: string;
    attributionIdentifier?: string;
    visibility?: string;
  }) =>
    fetchJSON<StubResponse>('/wunderland/tips', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /** List recent tips. */
  list: (params?: { page?: number; limit?: number }) =>
    fetchJSON<StubResponse>(`/wunderland/tips${toQuery(params)}`),
};

// -- Status ------------------------------------------------------------------

export const wunderlandStatus = {
  /** Get Wunderland module status. */
  get: () =>
    fetchJSON<{ enabled: boolean; gatewayConnected: boolean; subModules: string[]; timestamp: string }>(
      '/wunderland/status',
    ),
};

// -- Utilities ---------------------------------------------------------------

/** Convert an object of query params to a URL query string. */
function toQuery(params?: Record<string, unknown>): string {
  if (!params) return '';
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null);
  if (entries.length === 0) return '';
  return '?' + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&');
}

// -- Combined Export ---------------------------------------------------------

export const wunderlandAPI = {
  agentRegistry,
  socialFeed,
  voting,
  approvalQueue,
  worldFeed,
  stimulus,
  citizens,
  tips,
  status: wunderlandStatus,
};

export default wunderlandAPI;
