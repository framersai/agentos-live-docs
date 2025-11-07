/**
 * Default extension configuration for AgentOS
 * Automatically loads curated extensions by default
 */

import { ExtensionLoader, ExtensionLoaderConfig } from '../extensions/ExtensionLoader';
import { ExtensionManager } from '../extensions/ExtensionManager';
import { ExtensionRegistry } from '../extensions/ExtensionRegistry';

/**
 * Default extension configuration
 */
export const DEFAULT_EXTENSION_CONFIG: ExtensionLoaderConfig = {
  loadCurated: true,      // Load official extensions by default
  loadCommunity: false,   // Don't load community by default (opt-in)
  autoInstall: true,      // Auto-install missing extensions
  npmRegistry: 'https://registry.npmjs.org',
  extensionScope: '@framers',
  whitelist: [],          // Load all by default
  blacklist: []           // No blacklist by default
};

/**
 * Initialize AgentOS with default extensions
 */
export async function initializeWithDefaultExtensions(
  manager: ExtensionManager,
  config?: Partial<ExtensionLoaderConfig>
): Promise<ExtensionLoader> {
  const loader = new ExtensionLoader(manager, {
    ...DEFAULT_EXTENSION_CONFIG,
    ...config
  });
  
  await loader.initialize();
  return loader;
}

/**
 * Get default curated extensions list
 */
export function getDefaultCuratedExtensions(): string[] {
  return [
    '@framers/agentos-research-web-search',
    '@framers/agentos-integrations-telegram'
  ];
}

/**
 * Extension capability requirements for common personas
 */
export const PERSONA_EXTENSION_REQUIREMENTS = {
  researcher: [
    'webSearch',
    'researchAggregator',
    'factCheck'
  ],
  communicator: [
    'telegramSendMessage',
    'telegramSendPhoto',
    'telegramSendDocument'
  ],
  developer: [
    'codeSearch',
    'testRunner',
    'linter'
  ],
  analyst: [
    'dataQuery',
    'visualization',
    'reporting'
  ]
};

/**
 * Check if required extensions are loaded for a persona
 */
export function checkPersonaRequirements(
  personaId: string,
  availableTools: string[]
): { satisfied: boolean; missing: string[] } {
  const required = PERSONA_EXTENSION_REQUIREMENTS[personaId as keyof typeof PERSONA_EXTENSION_REQUIREMENTS] || [];
  const missing = required.filter(tool => !availableTools.includes(tool));
  
  return {
    satisfied: missing.length === 0,
    missing
  };
}
