import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Lightweight loader for the AgentOS Guardrails registry stored in the monorepo.
 * Serves `/api/agentos/guardrails*` endpoints without mock data.
 * @internal
 */

/** @public */
export type GuardrailDescriptor = {
	id: string;
	package: string;
	version: string;
	displayName: string;
	description?: string;
	category?: 'safety' | 'privacy' | 'budget' | 'compliance' | 'quality' | 'custom';
	verified?: boolean;
	capabilities?: string[];
	repository?: string;
};

type GuardrailsRegistry = {
	version: string;
	updated: string;
	guardrails: {
		curated: GuardrailDescriptor[];
		community: GuardrailDescriptor[];
	};
	stats: Record<string, unknown>;
};

let cachedRegistry: GuardrailsRegistry | null = null;

/**
 * Resolve absolute path to the guardrails registry JSON in the monorepo.
 * @returns Absolute filesystem path to the guardrails registry JSON.
 */
function getRegistryPath(): string {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	return path.resolve(__dirname, '../../../../packages/agentos-guardrails/registry.json');
}

/**
 * Load and cache the guardrails registry from disk.
 * @returns Parsed {@link GuardrailsRegistry}.
 */
export async function loadGuardrailsRegistry(): Promise<GuardrailsRegistry> {
	if (cachedRegistry) {
		return cachedRegistry;
	}
	const registryPath = getRegistryPath();
	const raw = await readFile(registryPath, 'utf-8');
	const parsed = JSON.parse(raw) as GuardrailsRegistry;
	cachedRegistry = parsed;
	return parsed;
}

/**
 * Flatten curated and community guardrails into a single list for clients.
 * @returns Array of {@link GuardrailDescriptor}.
 * @public
 */
export async function listGuardrails(): Promise<GuardrailDescriptor[]> {
	const registry = await loadGuardrailsRegistry();
	return [
		...(registry.guardrails.curated ?? []),
		...(registry.guardrails.community ?? []),
	];
}

/**
 * Clear cached guardrails registry.
 * @public
 */
export function invalidateGuardrailsCache(): void {
	cachedRegistry = null;
}


