// File: frontend/src/components/agents/catalog/NerfAgent/Nerf/NerfAgentTypes.ts
/**
 * @file NerfAgentTypes.ts
 * @description Type definitions for "Nerf" - the General AI Assistant.
 * @version 1.0.0
 */

import type { Ref, ComputedRef } from 'vue';
import type { IAgentDefinition } from '@/services/agent.service';
import type { MainContent } from '@/store/chat.store';
import type { AdvancedHistoryConfig as StoreAdvancedHistoryConfig, HistoryStrategyPreset } from '@/services/advancedConversation.manager';

// Re-export or define AdvancedHistoryConfig if it's commonly used by agents
export interface AdvancedHistoryConfig extends StoreAdvancedHistoryConfig {}

export const DEFAULT_NERF_HISTORY_CONFIG: AdvancedHistoryConfig = {
  numRecentMessagesToPrioritize: 8,
  simpleRecencyMessageCount: 8,
  // Cast to string if HistoryStrategyPreset is an enum and its values are strings.
  // Or directly use the enum member: HistoryStrategyPreset.CONCISE_RECENT
  strategyPreset: 'CONCISE_RECENT' as HistoryStrategyPreset, // Default for Nerf
  maxContextTokens: 3000, // Nerf is concise
  relevancyThreshold: 0.35,
  numRelevantOlderMessagesToInclude: 2,
  filterHistoricalSystemMessages: true,
  charsPerTokenEstimate: 3.8,
};

export interface NerfAgentState {
  isLoadingResponse: Ref<boolean>;
  currentSystemPrompt: Ref<string>;
}

export interface NerfAgentComputeds {
  agentDisplayName: ComputedRef<string>;
  mainContentToDisplay: ComputedRef<MainContent | null>;
}

export interface NerfAgentActions {
  initialize(agentDef: IAgentDefinition): Promise<void>;
  cleanup(): void; // Basic cleanup placeholder
  handleNewUserInput(text: string): Promise<void>;
  renderMarkdown(content: string | null): string; // If view needs direct markdown rendering
}

export interface NerfAgentComposable extends NerfAgentState, NerfAgentComputeds, NerfAgentActions {}