import type {
  ILongTermMemoryRetriever,
  LongTermMemoryRetrievalInput,
  LongTermMemoryRetrievalResult,
} from '@framers/agentos';
import { ragService } from './agentos.rag.service.js';
import { getOrganizationSettings } from '../../features/organization/organization.repository.js';
import { resolveOrganizationMemorySettings } from '../../features/organization/organization.settings.js';

type MemoryScope = 'user' | 'persona' | 'organization';

const COLLECTION_BY_SCOPE: Record<MemoryScope, string> = {
  user: 'agentos-user-memory',
  persona: 'agentos-persona-memory',
  organization: 'agentos-org-memory',
};

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function clampText(value: string, maxChars: number): string {
  if (maxChars <= 0) return value;
  if (value.length <= maxChars) return value;
  return value.slice(0, Math.max(0, maxChars - 1)).trimEnd() + '…';
}

function uniqBy<T>(items: T[], keyFn: (item: T) => string): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    const key = keyFn(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

type RetrievedItem = {
  text: string;
  category: string | null;
  score: number;
  hash?: string;
};

function formatScopeTitle(scope: MemoryScope, input: LongTermMemoryRetrievalInput): string {
  switch (scope) {
    case 'user':
      return 'User Memory';
    case 'persona':
      return `Persona Memory (${input.personaId})`;
    case 'organization':
      return input.organizationId
        ? `Organization Memory (${input.organizationId})`
        : 'Organization Memory';
    default:
      return scope;
  }
}

export function createLongTermMemoryRetriever(): ILongTermMemoryRetriever {
  return {
    async retrieveLongTermMemory(
      input: LongTermMemoryRetrievalInput
    ): Promise<LongTermMemoryRetrievalResult | null> {
      const startedAt = Date.now();
      const query = normalizeString(input.queryText);
      if (!query) return null;
      if (!input.memoryPolicy?.enabled) return null;

      const allowedCategories = Array.isArray(input.memoryPolicy.allowedCategories)
        ? new Set(input.memoryPolicy.allowedCategories)
        : null;

      const orgId = normalizeString(input.organizationId);
      const orgMemorySettings =
        input.memoryPolicy.scopes.organization && orgId
          ? resolveOrganizationMemorySettings(await getOrganizationSettings(orgId))
          : null;
      const orgAllowedCategories = orgMemorySettings?.allowedCategories
        ? new Set(orgMemorySettings.allowedCategories)
        : null;

      const topKByScope: Record<MemoryScope, number> = {
        user: Math.max(1, Number(input.topKByScope?.user ?? 6)),
        persona: Math.max(1, Number(input.topKByScope?.persona ?? 6)),
        organization: Math.max(1, Number(input.topKByScope?.organization ?? 6)),
      };

      const scopedResults: Record<MemoryScope, RetrievedItem[]> = {
        user: [],
        persona: [],
        organization: [],
      };

      const queryScope = async (scope: MemoryScope): Promise<void> => {
        const topK = topKByScope[scope];
        const collectionId = COLLECTION_BY_SCOPE[scope];

        // Pull a few extra to allow post-filtering (score==0, wrong tenant, duplicates, etc.)
        const raw = await ragService.query({
          query,
          collectionIds: [collectionId],
          topK: Math.min(50, topK * 4),
          includeMetadata: true,
        });

        const filtered = (raw.chunks ?? [])
          .filter((chunk) => typeof chunk?.score === 'number' && chunk.score > 0)
          .map((chunk) => ({
            score: chunk.score,
            metadata: (chunk.metadata ?? {}) as Record<string, unknown>,
          }))
          .filter(({ metadata }) => {
            if (metadata.kind !== 'rolling_memory_item') return false;
            if (
              allowedCategories &&
              typeof metadata.category === 'string' &&
              !allowedCategories.has(metadata.category as any)
            ) {
              return false;
            }
            if (
              scope === 'organization' &&
              orgAllowedCategories &&
              typeof metadata.category === 'string' &&
              !orgAllowedCategories.has(String(metadata.category).toLowerCase())
            ) {
              return false;
            }

            if (scope === 'user') {
              return metadata.userId === input.userId && metadata.scope === 'user';
            }
            if (scope === 'persona') {
              return (
                metadata.userId === input.userId &&
                metadata.scope === 'persona' &&
                metadata.personaId === input.personaId
              );
            }
            if (scope === 'organization') {
              return (
                metadata.scope === 'organization' &&
                Boolean(input.organizationId) &&
                metadata.organizationId === input.organizationId
              );
            }
            return false;
          })
          .map(
            ({ score, metadata }): RetrievedItem => ({
              score,
              text: normalizeString(metadata.text),
              category: typeof metadata.category === 'string' ? metadata.category : null,
              hash: typeof metadata.hash === 'string' ? metadata.hash : undefined,
            })
          )
          .filter((item) => item.text.length > 0)
          .sort((a, b) => b.score - a.score);

        const deduped = uniqBy(
          filtered,
          (item) => item.hash ?? `${item.category ?? 'uncat'}:${item.text.toLowerCase()}`
        );
        scopedResults[scope] = deduped.slice(0, topK);
      };

      const scopePromises: Array<Promise<void>> = [];
      if (input.memoryPolicy.scopes.user) scopePromises.push(queryScope('user'));
      if (input.memoryPolicy.scopes.persona) scopePromises.push(queryScope('persona'));
      if (input.memoryPolicy.scopes.organization && orgId && (orgMemorySettings?.enabled ?? true)) {
        scopePromises.push(queryScope('organization'));
      }

      await Promise.all(scopePromises);

      const sections: string[] = [];
      const pushSection = (scope: MemoryScope) => {
        const items = scopedResults[scope];
        if (!items || items.length === 0) return;

        const lines: string[] = [];
        lines.push(`## ${formatScopeTitle(scope, input)}`);
        for (const item of items) {
          const prefix = item.category ? `[${item.category}] ` : '';
          lines.push(`- ${prefix}${item.text}`);
        }
        sections.push(lines.join('\n'));
      };

      pushSection('user');
      pushSection('persona');
      pushSection('organization');

      const rawContext = sections.join('\n\n').trim();
      if (!rawContext) return null;

      const maxChars = Number(input.maxContextChars ?? 2800);
      const contextText = clampText(rawContext, Number.isFinite(maxChars) ? maxChars : 2800);

      return {
        contextText,
        diagnostics: {
          tookMs: Date.now() - startedAt,
          hits: {
            user: scopedResults.user.length,
            persona: scopedResults.persona.length,
            organization: scopedResults.organization.length,
          },
          queryPreview: query.slice(0, 120),
        },
      };
    },
  };
}
