import { getAppDatabase } from '../../core/database/appDatabase.js';
import type { StorageAdapter } from '@framers/sql-storage-adapter';
import { listAgentOSPersonas } from '../../integrations/agentos/agentos.persona-registry.js';

type MarketplaceAgentRecord = {
  id: string;
  persona_id: string;
  label: string;
  tagline: string | null;
  description: string | null;
  category: string | null;
  access_level: string | null;
  pricing_model: string | null;
  price_cents: number | null;
  currency: string | null;
  featured: number;
  hero_image: string | null;
  stats: string | null;
  metadata: string | null;
  created_at: number;
  updated_at: number;
};

export interface MarketplaceAgent {
  id: string;
  personaId: string;
  label: string;
  tagline: string | null;
  description: string | null;
  category: string | null;
  accessLevel: string | null;
  pricing: {
    model: string | null;
    priceCents: number | null;
    currency: string | null;
  };
  featured: boolean;
  heroImage: string | null;
  metrics: {
    downloads?: number;
    rating?: number;
    revenueMonthlyUsd?: number;
    customers?: number;
  };
  metadata: Record<string, unknown> | null;
}

const INITIALISED_ADAPTERS = new WeakSet<StorageAdapter>();

async function ensureSchema(adapter: StorageAdapter): Promise<void> {
  if (INITIALISED_ADAPTERS.has(adapter)) {
    return;
  }

  await adapter.exec(`
    CREATE TABLE IF NOT EXISTS agentos_marketplace_agents (
      id TEXT PRIMARY KEY,
      persona_id TEXT NOT NULL,
      label TEXT NOT NULL,
      tagline TEXT,
      description TEXT,
      category TEXT,
      access_level TEXT,
      pricing_model TEXT,
      price_cents INTEGER,
      currency TEXT,
      featured INTEGER DEFAULT 0,
      hero_image TEXT,
      stats TEXT,
      metadata TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_agentos_marketplace_persona ON agentos_marketplace_agents(persona_id);
    CREATE INDEX IF NOT EXISTS idx_agentos_marketplace_featured ON agentos_marketplace_agents(featured);
  `);

  INITIALISED_ADAPTERS.add(adapter);
}

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn('[Marketplace] Failed to parse JSON payload.', { value, error });
    return fallback;
  }
}

function hydrateRecord(record: MarketplaceAgentRecord): MarketplaceAgent {
  const stats = parseJson<Record<string, unknown>>(record.stats, {});
  return {
    id: record.id,
    personaId: record.persona_id,
    label: record.label,
    tagline: record.tagline,
    description: record.description,
    category: record.category,
    accessLevel: record.access_level,
    pricing: {
      model: record.pricing_model,
      priceCents: record.price_cents,
      currency: record.currency,
    },
    featured: record.featured === 1,
    heroImage: record.hero_image,
    metrics: {
      downloads: typeof stats.downloads === 'number' ? stats.downloads : undefined,
      rating: typeof stats.rating === 'number' ? stats.rating : undefined,
      revenueMonthlyUsd:
        typeof stats.revenueMonthlyUsd === 'number' ? stats.revenueMonthlyUsd : undefined,
      customers: typeof stats.customers === 'number' ? stats.customers : undefined,
    },
    metadata: parseJson<Record<string, unknown> | null>(record.metadata, null),
  };
}

const SEED_AGENTS: Array<{
  id: string;
  personaId: string;
  tagline: string;
  description: string;
  category: string;
  accessLevel: string;
  pricingModel: 'free' | 'freemium' | 'paid';
  priceCents?: number;
  currency?: string;
  featured?: boolean;
  stats?: {
    downloads?: number;
    rating?: number;
    revenueMonthlyUsd?: number;
    customers?: number;
  };
}> = [
  {
    id: 'codepilot',
    personaId: 'code_pilot',
    tagline: 'Ship production-ready code faster with an expert pair-programmer.',
    description: 'Generate tests, refactor codebases, and reason about complex stack traces with a persona trained on pragmatic engineering workflows.',
    category: 'coding',
    accessLevel: 'metered',
    pricingModel: 'paid',
    priceCents: 4900,
    currency: 'USD',
    featured: true,
    stats: { downloads: 2100, rating: 4.8, revenueMonthlyUsd: 2450 },
  },
  {
    id: 'systems-architect',
    personaId: 'systems_architect',
    tagline: 'Blueprint service meshes, event streams, and infra plans in minutes.',
    description: 'Translate requirements into architecture diagrams, risk registers, and RFC scaffolds with a persona tuned for staff-level systems design.',
    category: 'coding',
    accessLevel: 'metered',
    pricingModel: 'paid',
    priceCents: 7900,
    currency: 'USD',
    featured: true,
    stats: { downloads: 850, rating: 4.9, revenueMonthlyUsd: 4200 },
  },
  {
    id: 'meeting-maestro',
    personaId: 'meeting_maestro',
    tagline: 'Drop into meetings and ship action-packed summaries automatically.',
    description: 'Capture transcripts, decisions, and owner-follow-ups with structured summaries that sync back to your workspace tools.',
    category: 'productivity',
    accessLevel: 'public',
    pricingModel: 'freemium',
    stats: { downloads: 5400, rating: 4.6, customers: 1200 },
  },
  {
    id: 'echo-diary',
    personaId: 'echo_diary',
    tagline: 'Reflect, organise, and score sentiment across your personal journal.',
    description: 'Automatically scaffold entries, surface recurring themes, and generate wellness nudges for long-term journaling practice.',
    category: 'productivity',
    accessLevel: 'public',
    pricingModel: 'free',
    stats: { downloads: 8900, rating: 4.8 },
  },
  {
    id: 'professor-astra',
    personaId: 'professor_astra',
    tagline: 'Adaptive tutor with spaced repetition and Socratic practice.',
    description: 'Build flashcards, concept maps, and graded quizzes that adapt to learner confidence in real time.',
    category: 'learning',
    accessLevel: 'public',
    pricingModel: 'freemium',
    stats: { downloads: 3400, rating: 4.7, customers: 925 },
  },
  {
    id: 'lc-audit',
    personaId: 'lc_audit',
    tagline: 'Audit LeetCode sessions with annotated breakdowns and pacing tips.',
    description: 'Replay coding interviews with automatic rubric scoring, annotated timelines, and growth plans for the next sprint.',
    category: 'auditing',
    accessLevel: 'metered',
    pricingModel: 'paid',
    priceCents: 9900,
    currency: 'USD',
    stats: { downloads: 320, rating: 4.6, revenueMonthlyUsd: 890 },
  },
  {
    id: 'nerf-generalist',
    personaId: 'nerf_generalist',
    tagline: 'Trusty generalist for everyday Q&A.',
    description: 'Concise, fast, and safe responses across broad knowledge domains. Perfect default companion for inbox triage and research snippets.',
    category: 'general',
    accessLevel: 'public',
    pricingModel: 'free',
    stats: { downloads: 15600, rating: 4.5 },
  },
  {
    id: 'v-researcher',
    personaId: 'v_researcher',
    tagline: 'Polymathic researcher for horizon scanning and synthesis.',
    description: 'Deconstruct academic papers, benchmark emerging tooling, and generate polished briefs for stakeholders.',
    category: 'general',
    accessLevel: 'global',
    pricingModel: 'freemium',
    stats: { downloads: 2450, rating: 4.9, revenueMonthlyUsd: 1240 },
  },
];

class MarketplaceService {
  private adapter: StorageAdapter | null = null;

  private async getAdapter(): Promise<StorageAdapter> {
    if (!this.adapter) {
      let adapter: StorageAdapter;
      try {
        adapter = getAppDatabase();
      } catch (error) {
        throw new Error('[Marketplace] App database is not initialised. Ensure initializeAppDatabase() runs before marketplace access.');
      }
      await ensureSchema(adapter);
      this.adapter = adapter;
      await this.seedIfNecessary(adapter);
    }
    return this.adapter;
  }

  private async seedIfNecessary(adapter: StorageAdapter): Promise<void> {
    const count = await adapter.get<{ total: number }>(
      'SELECT COUNT(1) as total FROM agentos_marketplace_agents',
    );
    if (count && count.total > 0) {
      return;
    }

    const personaMap = new Map(listAgentOSPersonas().map((persona) => [persona.personaId, persona]));
    const now = Date.now();

    for (const agent of SEED_AGENTS) {
      if (!personaMap.has(agent.personaId)) {
        console.warn('[Marketplace] Skipping seed agent because persona is missing.', agent);
        continue;
      }

      await adapter.run(
        `
          INSERT INTO agentos_marketplace_agents (
            id,
            persona_id,
            label,
            tagline,
            description,
            category,
            access_level,
            pricing_model,
            price_cents,
            currency,
            featured,
            hero_image,
            stats,
            metadata,
            created_at,
            updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          agent.id,
          agent.personaId,
          personaMap.get(agent.personaId)?.label ?? agent.personaId,
          agent.tagline,
          agent.description,
          agent.category,
          agent.accessLevel,
          agent.pricingModel,
          agent.priceCents ?? null,
          agent.currency ?? 'USD',
          agent.featured ? 1 : 0,
          null,
          JSON.stringify(agent.stats ?? {}),
          null,
          now,
          now,
        ],
      );
    }
  }

  public async listAgents(): Promise<MarketplaceAgent[]> {
    const adapter = await this.getAdapter();
    const rows = await adapter.all<MarketplaceAgentRecord>('SELECT * FROM agentos_marketplace_agents ORDER BY featured DESC, label ASC');
    return rows.map(hydrateRecord);
  }

  public async getAgentById(id: string): Promise<MarketplaceAgent | null> {
    const adapter = await this.getAdapter();
    const row = await adapter.get<MarketplaceAgentRecord>(
      'SELECT * FROM agentos_marketplace_agents WHERE id = ? OR persona_id = ?',
      [id, id],
    );
    return row ? hydrateRecord(row) : null;
  }
}

export const marketplaceService = new MarketplaceService();
