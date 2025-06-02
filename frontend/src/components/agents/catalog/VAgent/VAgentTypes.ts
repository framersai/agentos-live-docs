// File: frontend/src/components/agents/catalog/VAgent/V/VAgentTypes.ts
/**
 * @file VAgentTypes.ts
 * @description Type definitions for "V" - the Advanced General AI Assistant.
 * @version 1.0.0
 */

import type { Ref, ComputedRef } from 'vue';
import type { IAgentDefinition } from '@/services/agent.service';
import type { MainContent } from '@/store/chat.store';
import type { AdvancedHistoryConfig as StoreAdvancedHistoryConfig, HistoryStrategyPreset } from '@/services/advancedConversation.manager';

export interface AdvancedHistoryConfig extends StoreAdvancedHistoryConfig {}

// V might benefit from a more comprehensive history
export const DEFAULT_V_HISTORY_CONFIG: AdvancedHistoryConfig = {
  numRecentMessagesToPrioritize: 10,
  simpleRecencyMessageCount: 12,
  strategyPreset: 'BALANCED_HYBRID' as HistoryStrategyPreset, // More context for V
  maxContextTokens: 5000, // V can handle more context
  relevancyThreshold: 0.45,
  numRelevantOlderMessagesToInclude: 4,
  filterHistoricalSystemMessages: false, // V's system prompt might be important
  charsPerTokenEstimate: 3.8,
};

export interface VAgentState {
  isLoadingResponse: Ref<boolean>;
  currentSystemPrompt: Ref<string>;
}

export interface VAgentComputeds {
  agentDisplayName: ComputedRef<string>;
  mainContentToDisplay: ComputedRef<MainContent | null>;
}

export interface VAgentActions {
  initialize(agentDef: IAgentDefinition): Promise<void>;
  cleanup(): void;
  handleNewUserInput(text: string): Promise<void>;
  renderMarkdown(content: string | null): string;
}

export interface VAgentComposable extends VAgentState, VAgentComputeds, VAgentActions {}