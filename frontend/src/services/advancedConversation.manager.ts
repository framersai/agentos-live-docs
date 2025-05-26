// File: frontend/src/services/AdvancedConversationManager.ts
/**
 * @file AdvancedConversationManager.ts
 * @version 2.5.3 
 * @description
 * This module provides an enterprise-grade, highly intricate, and configurable system for managing
 * and selecting conversation history to be sent to Large Language Models (LLMs). It moves beyond
 * simple recency-based truncation by incorporating NLP-driven relevance scoring, an ensemble of 
 * selectable history strategies, and user-friendly presets for configuration.
 * All logic is consolidated into this single file.
 * Stopwords are loaded from an external stopwords.txt file.
 *
 * Core Responsibilities:
 * 1.  Define and manage configurations for history selection.
 * 2.  Preprocess messages for NLP analysis (including custom stopword filtering).
 * 3.  Score historical messages for relevance.
 * 4.  Employ various strategies to select an optimal set of messages.
 * 5.  Ensure the selected history adheres to token limits.
 * 6.  Provide a clean API for preparing history and managing settings.
 */

import { watch, type Ref } from 'vue';
import { useStorage } from '@vueuse/core';
import {
  TfIdf, // Retained for potential future use or different scoring, though Dice is primary.
  PorterStemmer,
  DiceCoefficient,
} from 'natural';

// Import raw text content from stopwords.txt
// Ensure your bundler (Vite, Webpack with raw-loader) is configured for .txt imports
// and you have a custom.d.ts file declaring the '*.txt' module.
import stopwordsListRaw from './stopwords.txt';

// Function to parse the raw stopwords text into an array
const parseStopwords = (rawText: string): string[] => {
  return rawText
    .split(/\r?\n/) // Split by new line
    .map(word => word.trim()) // Trim whitespace
    .filter(word => word.length > 0); // Remove empty lines
};

// Initialize COMMON_ENGLISH_STOPWORDS from the imported file
const COMMON_ENGLISH_STOPWORDS: string[] = parseStopwords(stopwordsListRaw);
if (COMMON_ENGLISH_STOPWORDS.length < 50) { // Basic check
    console.warn("AdvancedConversationManager: Stopwords list appears to be very short or empty after loading. Check stopwords.txt and its import.", COMMON_ENGLISH_STOPWORDS.slice(0,10));
}


const isNaturalMethodAvailable = (method: any): boolean => typeof method === 'function';

// #region CORE INTERFACES, ENUMS, AND TYPES
export interface ProcessedConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  id?: string;
  timestamp?: number;
  estimatedTokenCount?: number;
  processedTokens?: string[];
  relevanceScore?: number;
}

export enum HistoryStrategyPreset {
  BALANCED_HYBRID = 'balancedHybrid',
  RELEVANCE_FOCUSED = 'relevanceFocused',
  RECENT_CONVERSATION = 'recentConversation',
  MAX_CONTEXT_HYBRID = 'maxContextHybrid',
  CONCISE_RECENT = 'conciseRecent',
  SIMPLE_RECENCY = 'simpleRecency',
}

export interface AdvancedHistoryConfig {
  strategyPreset: HistoryStrategyPreset;
  maxContextTokens: number;
  relevancyThreshold: number;
  numRecentMessagesToPrioritize: number;
  numRelevantOlderMessagesToInclude: number;
  simpleRecencyMessageCount: number;
  filterHistoricalSystemMessages: boolean;
  charsPerTokenEstimate: number;
}

export const DEFAULT_ADVANCED_HISTORY_CONFIG: AdvancedHistoryConfig = {
  strategyPreset: HistoryStrategyPreset.BALANCED_HYBRID,
  maxContextTokens: 4000,
  relevancyThreshold: 0.25,
  numRecentMessagesToPrioritize: 10,
  numRelevantOlderMessagesToInclude: 5,
  simpleRecencyMessageCount: 20,
  filterHistoricalSystemMessages: true,
  charsPerTokenEstimate: 3.8,
};

export interface PrepareHistoryParams {
  allMessages: ProcessedConversationMessage[];
  currentQueryText: string;
  systemPrompt?: string;
  configOverride?: Partial<AdvancedHistoryConfig>;
}
// #endregion

// #region NLP UTILITIES & RELEVANCE SCORER
interface IRelevanceScorer {
  preprocessMessages(messages: ProcessedConversationMessage[]): Promise<void>;
  scoreMessages(queryText: string, messagesToScore: ProcessedConversationMessage[]): Promise<ProcessedConversationMessage[]>;
}

class TfidfRelevanceScorer implements IRelevanceScorer {
  // PorterStemmer is an instance, not a class with static methods in 'natural'
  private stemmer: any; // Type for PorterStemmer instance
  private tokenizer: { tokenize: (text: string) => string[] }; // Type for WordTokenizer

  constructor() {
    if (isNaturalMethodAvailable(PorterStemmer.tokenizeAndStem)) {
        this.stemmer = PorterStemmer; // Can use its static methods directly
    } else if (isNaturalMethodAvailable((PorterStemmer as any).stem)){ // Fallback if only stem is available on an instance
        this.stemmer = new (PorterStemmer as any)();
    } else {
        console.warn("TfidfRelevanceScorer: PorterStemmer not fully available from 'natural'. Stemming might be basic or off.");
        // Provide a very basic stemmer-like function (identity) and rely on tokenizer
        this.stemmer = { stem: (token: string) => token };
    }
    
    // Standard tokenizer from 'natural' (e.g., WordTokenizer)
    // If 'natural' provides a good tokenizer, use it. Otherwise, fallback.
    let TempTokenizer;
    try {
        TempTokenizer = new (require('natural').WordTokenizer)();
    } catch(e) {
        console.warn("TfidfRelevanceScorer: 'natural.WordTokenizer' not available. Using basic regex tokenization.");
    }
    this.tokenizer = TempTokenizer && isNaturalMethodAvailable(TempTokenizer.tokenize)
      ? TempTokenizer
      : { tokenize: (text: string): string[] => text.toLowerCase().replace(/[^\w\s']|_/g, "").replace(/\s+/g, " ").trim().split(/\s+/) };


    if (!isNaturalMethodAvailable(DiceCoefficient)) {
        console.warn("TfidfRelevanceScorer: DiceCoefficient not available from 'natural'. Relevance scoring will be impaired (using fallback).");
    }
    console.info("TfidfRelevanceScorer: Initialized. Primary similarity via Dice Coefficient. Custom stopwords active.");
  }

  private tokenizeAndStemText(text: string): string[] {
    let tokens: string[];

    // 1. Tokenize
    tokens = this.tokenizer.tokenize(text.toLowerCase());

    // 2. Stem (if stemmer is available and functional)
    // and 3. Filter stopwords using the custom COMMON_ENGLISH_STOPWORDS list
    const processedTokens: string[] = [];
    for (const token of tokens) {
        if (!COMMON_ENGLISH_STOPWORDS.includes(token)) {
            let stemmedToken = token;
            if (this.stemmer && isNaturalMethodAvailable(this.stemmer.stem)) { // PorterStemmer instance method
                stemmedToken = this.stemmer.stem(token);
            } else if (this.stemmer && isNaturalMethodAvailable((this.stemmer as any).stemWord)) { // Some stemmers use stemWord
                stemmedToken = (this.stemmer as any).stemWord(token);
            } else if (this.stemmer === PorterStemmer && isNaturalMethodAvailable(PorterStemmer.stem)) { // Static PorterStemmer.stem
                 stemmedToken = PorterStemmer.stem(token);
            }
            // Basic check for meaningful token after potential stemming
            if (stemmedToken.length > 1 && !COMMON_ENGLISH_STOPWORDS.includes(stemmedToken)) {
                 processedTokens.push(stemmedToken);
            } else if (stemmedToken.length === 1 && !COMMON_ENGLISH_STOPWORDS.includes(stemmedToken) && !/^[0-9]$/.test(stemmedToken)) { // Keep single chars if not numbers and not stopwords
                 processedTokens.push(stemmedToken);
            }
        }
    }
    return processedTokens;
  }


  public async preprocessMessages(messages: ProcessedConversationMessage[]): Promise<void> {
    for (const message of messages) {
      if (message.content && (!message.processedTokens || message.processedTokens.length === 0)) {
        message.processedTokens = this.tokenizeAndStemText(message.content);
      }
      if (typeof message.relevanceScore === 'undefined') {
        message.relevanceScore = 0;
      }
    }
  }

  public async scoreMessages(queryText: string, messagesToScore: ProcessedConversationMessage[]): Promise<ProcessedConversationMessage[]> {
    const queryTokens = this.tokenizeAndStemText(queryText);

    if (queryTokens.length === 0) {
      for (const message of messagesToScore) { message.relevanceScore = 0; }
      return messagesToScore;
    }
    
    for (const message of messagesToScore) {
      if (message.processedTokens && message.processedTokens.length > 0) {
        if (isNaturalMethodAvailable(DiceCoefficient)) {
            message.relevanceScore = DiceCoefficient(queryTokens.join(' '), message.processedTokens.join(' '));
        } else {
            // Fallback Dice Coefficient logic
            const intersection = queryTokens.filter(token => message.processedTokens!.includes(token));
            message.relevanceScore = (2 * intersection.length) / (queryTokens.length + message.processedTokens.length) || 0;
        }
      } else {
        message.relevanceScore = 0;
      }
    }
    return messagesToScore;
  }
}

function estimateTokensRoughly(text: string, charsPerToken: number): number {
  if (!text) return 0;
  return Math.ceil(text.length / charsPerToken);
}
// #endregion

// #region HISTORY SELECTION STRATEGIES
interface IHistorySelectionStrategy {
  selectMessages(params: {
    allMessages: ProcessedConversationMessage[];
    config: AdvancedHistoryConfig;
    currentQueryText?: string;
    relevanceScorer?: IRelevanceScorer;
    systemPromptForTokenCount?: string;
  }): Promise<ProcessedConversationMessage[]>;
}

abstract class BaseHistoryStrategy implements IHistorySelectionStrategy {
  public abstract selectMessages(params: {
    allMessages: ProcessedConversationMessage[];
    config: AdvancedHistoryConfig;
    currentQueryText?: string;
    relevanceScorer?: IRelevanceScorer;
    systemPromptForTokenCount?: string;
  }): Promise<ProcessedConversationMessage[]>;

  protected filterSystemMessages(
    messages: ProcessedConversationMessage[],
    config: AdvancedHistoryConfig
  ): ProcessedConversationMessage[] {
    if (config.filterHistoricalSystemMessages) {
      return messages.filter(msg => msg.role !== 'system');
    }
    return messages;
  }

  protected truncateToTokenLimit(
    selectedMessages: ProcessedConversationMessage[],
    config: AdvancedHistoryConfig,
    systemPromptForTokenCount?: string
  ): ProcessedConversationMessage[] {
    let currentTokens = systemPromptForTokenCount ? estimateTokensRoughly(systemPromptForTokenCount, config.charsPerTokenEstimate) : 0;
    const result: ProcessedConversationMessage[] = [];

    for (let i = selectedMessages.length - 1; i >= 0; i--) {
      const message = selectedMessages[i];
      const messageTokens = message.estimatedTokenCount || estimateTokensRoughly(message.content, config.charsPerTokenEstimate);
      if (currentTokens + messageTokens <= config.maxContextTokens) {
        result.unshift(message);
        currentTokens += messageTokens;
      } else {
        break;
      }
    }
    return result;
  }
}

class SimpleRecencyStrategy extends BaseHistoryStrategy {
  async selectMessages(params: {
    allMessages: ProcessedConversationMessage[];
    config: AdvancedHistoryConfig;
    systemPromptForTokenCount?: string;
  }): Promise<ProcessedConversationMessage[]> {
    const { allMessages, config, systemPromptForTokenCount } = params;
    const nonSystemMessages = this.filterSystemMessages(allMessages, config);
    const numMessagesToTake = Math.max(0, config.simpleRecencyMessageCount);
    let selected = nonSystemMessages.slice(-numMessagesToTake);
    selected = this.truncateToTokenLimit(selected, config, systemPromptForTokenCount);
    return selected;
  }
}

class RecencyStrategy extends BaseHistoryStrategy {
  async selectMessages(params: {
    allMessages: ProcessedConversationMessage[];
    config: AdvancedHistoryConfig;
    systemPromptForTokenCount?: string;
  }): Promise<ProcessedConversationMessage[]> {
    const { allMessages, config, systemPromptForTokenCount } = params;
    const nonSystemMessages = this.filterSystemMessages(allMessages, config);
    const numMessagesToTake = Math.max(0, config.numRecentMessagesToPrioritize);
    let selected = nonSystemMessages.slice(-numMessagesToTake);
    selected = this.truncateToTokenLimit(selected, config, systemPromptForTokenCount);
    return selected;
  }
}

class RelevanceStrategy extends BaseHistoryStrategy {
  async selectMessages(params: {
    allMessages: ProcessedConversationMessage[];
    config: AdvancedHistoryConfig;
    currentQueryText: string;
    relevanceScorer: IRelevanceScorer;
    systemPromptForTokenCount?: string;
  }): Promise<ProcessedConversationMessage[]> {
    const { allMessages, config, currentQueryText, relevanceScorer, systemPromptForTokenCount } = params;

    if (!currentQueryText || !relevanceScorer) {
      console.warn("RelevanceStrategy: Missing query or scorer. Falling back to RecencyStrategy.");
      return new RecencyStrategy().selectMessages({allMessages, config, systemPromptForTokenCount});
    }

    let historicalMessages = this.filterSystemMessages(allMessages, config);
    await relevanceScorer.preprocessMessages(historicalMessages);
    historicalMessages = await relevanceScorer.scoreMessages(currentQueryText, historicalMessages);

    const relevantMessages = historicalMessages
      .filter(msg => (msg.relevanceScore ?? 0) >= config.relevancyThreshold)
      .sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0) || (b.timestamp ?? 0) - (a.timestamp ?? 0));
    
    let selected = relevantMessages.slice(0, config.numRelevantOlderMessagesToInclude + config.numRecentMessagesToPrioritize);
    selected.sort((a,b) => (a.timestamp ?? 0) - (b.timestamp ?? 0)); // sort back by time
    selected = this.truncateToTokenLimit(selected, config, systemPromptForTokenCount);
    return selected;
  }
}

class HybridStrategy extends BaseHistoryStrategy {
  async selectMessages(params: {
    allMessages: ProcessedConversationMessage[];
    config: AdvancedHistoryConfig;
    currentQueryText: string;
    relevanceScorer: IRelevanceScorer;
    systemPromptForTokenCount?: string;
  }): Promise<ProcessedConversationMessage[]> {
    const { allMessages, config, currentQueryText, relevanceScorer, systemPromptForTokenCount } = params;

    if (!currentQueryText || !relevanceScorer) {
      console.warn("HybridStrategy: Missing query or scorer. Falling back to RecencyStrategy.");
      return new RecencyStrategy().selectMessages({allMessages, config, systemPromptForTokenCount});
    }

    const historicalMessages = this.filterSystemMessages(allMessages, config);
    if (historicalMessages.length === 0) return [];

    const numRecent = Math.max(0, config.numRecentMessagesToPrioritize);
    const recentMessages = historicalMessages.slice(-numRecent);
    const olderMessagesToScore = historicalMessages.slice(0, -numRecent);

    let relevantOlderMessages: ProcessedConversationMessage[] = [];
    if (olderMessagesToScore.length > 0) {
      await relevanceScorer.preprocessMessages(olderMessagesToScore); // Preprocess only the older messages portion
      const scoredOlderMessages = await relevanceScorer.scoreMessages(currentQueryText, olderMessagesToScore);
      relevantOlderMessages = scoredOlderMessages
        .filter(msg => (msg.relevanceScore ?? 0) >= config.relevancyThreshold)
        .sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0) || (b.timestamp ?? 0) - (a.timestamp ?? 0))
        .slice(0, Math.max(0, config.numRelevantOlderMessagesToInclude));
    }
    
    // Ensure recent messages also get their tokens processed if they haven't been
    // This is important if they weren't part of olderMessagesToScore
    await relevanceScorer.preprocessMessages(recentMessages);


    const combinedMessagesMap = new Map<string, ProcessedConversationMessage>();
    // Add relevant older messages first, then recent. If recent were also relevant, they'd be in relevantOlderMessages.
    // The Map ensures uniqueness. Order by timestamp at the end.
    [...relevantOlderMessages, ...recentMessages].forEach(msg => {
        const key = msg.id || `${msg.role}-${msg.timestamp}-${msg.content.slice(0,20)}`; // Slightly longer slice for key uniqueness
        if (!combinedMessagesMap.has(key)) { // Ensure recent messages don't overwrite an already selected more relevant older one if IDs are missing
            combinedMessagesMap.set(key, msg);
        }
    });
    
    const uniqueCombined = Array.from(combinedMessagesMap.values());
    uniqueCombined.sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0));

    const selected = this.truncateToTokenLimit(uniqueCombined, config, systemPromptForTokenCount);
    return selected;
  }
}
// #endregion

// #region ADVANCED CONVERSATION MANAGER
export class AdvancedConversationManager {
  public readonly config: Ref<AdvancedHistoryConfig>;
  private relevanceScorer: IRelevanceScorer;
  // private strategyCache: Map<HistoryStrategyPreset, IHistorySelectionStrategy>; // Removed as per discussion

  constructor(
    initialConfigOverride?: Partial<AdvancedHistoryConfig>,
    customRelevanceScorer?: IRelevanceScorer
  ) {
    const storageKey = 'vcaAdvancedHistoryConfig_v2.5.3'; // Incremented version

    let fullyFormedInitialConfig = { ...DEFAULT_ADVANCED_HISTORY_CONFIG, ...initialConfigOverride };
    
    const storedConfigStr = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    if (storedConfigStr) {
        try {
            const parsedStoredConfig = JSON.parse(storedConfigStr) as Partial<AdvancedHistoryConfig>;
            fullyFormedInitialConfig = { ...fullyFormedInitialConfig, ...parsedStoredConfig };
        } catch (e) {
            console.error(`AdvancedConversationManager: Error parsing stored config from key '${storageKey}'. Using defaults. Error:`, e);
        }
    }

    this.config = useStorage<AdvancedHistoryConfig>(
      storageKey,
      fullyFormedInitialConfig,
      typeof window !== 'undefined' ? localStorage : undefined,
      { mergeDefaults: false } 
    );

    this.relevanceScorer = customRelevanceScorer || new TfidfRelevanceScorer();
    // this.strategyCache = new Map(); // Removed

    watch(
      this.config,
      (newConfig) => {
        console.log('AdvancedConversationManager: History config updated', JSON.parse(JSON.stringify(newConfig)));
      },
      { deep: true }
    );
    console.log('AdvancedConversationManager: Initialized with config:', JSON.parse(JSON.stringify(this.config.value)));
  }

  public updateConfig(configUpdate: Partial<AdvancedHistoryConfig>): void {
    this.config.value = { ...this.config.value, ...configUpdate };
  }

  public setHistoryStrategyPreset(preset: HistoryStrategyPreset): void {
    let newConfigPartial: Partial<AdvancedHistoryConfig> = { 
        ...DEFAULT_ADVANCED_HISTORY_CONFIG, 
        strategyPreset: preset 
    };

    switch (preset) {
      case HistoryStrategyPreset.BALANCED_HYBRID:
        // Default values are already good
        break;
      case HistoryStrategyPreset.RELEVANCE_FOCUSED:
        newConfigPartial = {
          ...newConfigPartial,
          relevancyThreshold: 0.35,
          numRecentMessagesToPrioritize: 4, 
          numRelevantOlderMessagesToInclude: 10,
        };
        break;
      case HistoryStrategyPreset.RECENT_CONVERSATION:
        newConfigPartial = {
          ...newConfigPartial,
          relevancyThreshold: 0.1, 
          numRecentMessagesToPrioritize: 20, 
          numRelevantOlderMessagesToInclude: 0,
        };
        break;
      case HistoryStrategyPreset.MAX_CONTEXT_HYBRID:
        newConfigPartial = {
          ...newConfigPartial,
          maxContextTokens: 7500, 
          relevancyThreshold: 0.20,
          numRecentMessagesToPrioritize: 12, 
          numRelevantOlderMessagesToInclude: 8,
        };
        break;
      case HistoryStrategyPreset.CONCISE_RECENT:
        newConfigPartial = {
          ...newConfigPartial,
          maxContextTokens: 1500, 
          numRecentMessagesToPrioritize: 6, 
          numRelevantOlderMessagesToInclude: 0,
        };
        break;
      case HistoryStrategyPreset.SIMPLE_RECENCY:
        newConfigPartial = {
          ...newConfigPartial,
          simpleRecencyMessageCount: this.config.value.simpleRecencyMessageCount || DEFAULT_ADVANCED_HISTORY_CONFIG.simpleRecencyMessageCount,
        };
        break;
      default:
        console.warn(`AdvancedConversationManager: Unknown preset "${preset as string}". Applying BALANCED_HYBRID defaults.`);
        // Avoid recursion if BALANCED_HYBRID is somehow the unknown preset
        if (preset !== HistoryStrategyPreset.BALANCED_HYBRID) {
            this.updateConfig({ ...DEFAULT_ADVANCED_HISTORY_CONFIG, strategyPreset: HistoryStrategyPreset.BALANCED_HYBRID });
        } else {
            // If BALANCED_HYBRID is unknown, just apply defaults without changing preset
             this.updateConfig({ ...DEFAULT_ADVANCED_HISTORY_CONFIG });
        }
        return;
    }
    this.updateConfig(newConfigPartial);
  }

  private getActiveStrategy(): IHistorySelectionStrategy {
    const preset = this.config.value.strategyPreset;
    // Re-create strategy to use the latest config snapshot.
    
    let strategy: IHistorySelectionStrategy;
    switch (preset) {
      case HistoryStrategyPreset.RELEVANCE_FOCUSED:
        strategy = new RelevanceStrategy();
        break;
      case HistoryStrategyPreset.RECENT_CONVERSATION:
      case HistoryStrategyPreset.CONCISE_RECENT: // RecencyStrategy handles count via numRecentMessagesToPrioritize
        strategy = new RecencyStrategy();
        break;
      case HistoryStrategyPreset.SIMPLE_RECENCY:
        strategy = new SimpleRecencyStrategy();
        break;
      case HistoryStrategyPreset.BALANCED_HYBRID:
      case HistoryStrategyPreset.MAX_CONTEXT_HYBRID:
      // Fallthrough for default
      default:
        strategy = new HybridStrategy();
        break;
    }
    return strategy;
  }

  private async ensureMessagesAreProcessed(messages: ProcessedConversationMessage[]): Promise<void> {
    // Estimate tokens first
    for (const message of messages) {
      if (typeof message.estimatedTokenCount !== 'number' || isNaN(message.estimatedTokenCount)) {
        message.estimatedTokenCount = estimateTokensRoughly(message.content, this.config.value.charsPerTokenEstimate);
      }
    }
    // Then preprocess for relevance scoring if needed by current strategy type
    const currentPreset = this.config.value.strategyPreset;
    if (
      currentPreset === HistoryStrategyPreset.RELEVANCE_FOCUSED ||
      currentPreset === HistoryStrategyPreset.BALANCED_HYBRID ||
      currentPreset === HistoryStrategyPreset.MAX_CONTEXT_HYBRID
    ) {
      // This will process tokens for all messages if not already done.
      await this.relevanceScorer.preprocessMessages(messages);
    }
  }

  public async prepareHistoryForApi(
    allSessionMessages: ProcessedConversationMessage[],
    currentQueryText: string,
    systemPromptText?: string
  ): Promise<ProcessedConversationMessage[]> {
    const currentConfig = { ...this.config.value }; 

    // Deep clone messages to avoid mutating the original session messages array
    const workingMessages = JSON.parse(JSON.stringify(allSessionMessages)) as ProcessedConversationMessage[];
    
    // Ensure all messages have token estimates and are processed for relevance if needed
    await this.ensureMessagesAreProcessed(workingMessages);

    const activeStrategy = this.getActiveStrategy();
    
    let selectedContextMessages = await activeStrategy.selectMessages({
      allMessages: workingMessages,
      config: currentConfig,
      currentQueryText: currentQueryText,
      relevanceScorer: this.relevanceScorer,
      systemPromptForTokenCount: systemPromptText,
    });
    
    console.log(`AdvancedConversationManager: Selected ${selectedContextMessages.length} messages for LLM context using preset '${currentConfig.strategyPreset}'.`);
    return selectedContextMessages;
  }

  public getHistoryConfig(): Readonly<AdvancedHistoryConfig> {
    return JSON.parse(JSON.stringify(this.config.value));
  }

  public getAvailablePresets(): HistoryStrategyPreset[] {
    return Object.values(HistoryStrategyPreset);
  }

  public clearHistory(actualClearanceCallback?: () => void): void {
    console.log('AdvancedConversationManager: clearHistory() called.');
    if (actualClearanceCallback && typeof actualClearanceCallback === 'function') {
      actualClearanceCallback();
      console.log('AdvancedConversationManager: actualClearanceCallback executed.');
    } else {
      console.warn('AdvancedConversationManager: No actualClearanceCallback provided to clearHistory(). Implement message store clearance in your application state logic.');
    }
  }

  public getDefaultConfig(): Readonly<AdvancedHistoryConfig> {
    return JSON.parse(JSON.stringify(DEFAULT_ADVANCED_HISTORY_CONFIG));
  }
}
// #endregion

// Export a singleton instance
export const advancedConversationManager = new AdvancedConversationManager();