// File: frontend/src/features/chat/store/chat.store.ts
/**
 * @fileoverview Pinia store for managing chat session state, including messages,
 * API interactions, content analysis, suggestions, and session costs.
 * @module features/chat/store/chat
 */
import { defineStore } from 'pinia';
import { apiService } from '../../../services/apiService'; // Centralized API service
import { useUiStore } from '../../../store/ui.store';
import { useChatSettingsStore, AssistantMode } from './chatSettings.store'; // Settings like mode, language
import { ContentAnalyzer, ContentAnalysis } from '../../../utils/ContentAnalyzer'; // Assuming this utility exists and is SOTA
import type { AppError } from '../../../types/api.types';
import type { SelectOption } from '../../../types'; // Global SelectOption

/**
 * Represents a single message in the chat.
 * @interface ChatMessage
 */
export interface ChatMessage {
  /** Unique identifier for the message. */
  id: string;
  /** Role of the message sender ('user' or 'assistant'). */
  role: 'user' | 'assistant' | 'system' | 'error'; // Added system and error roles
  /** Text content of the message. */
  content: string;
  /** Timestamp of when the message was created (ms since epoch). */
  timestamp: number;
  /** Optional: Analysis object if the content has been analyzed. */
  analysis?: ContentAnalysis | null;
  /** Optional: Detected intent from user input, if applicable. */
  detectedIntent?: string;
  /** Optional: Voice target ID for this specific message, if needed for direct voice interaction. */
  voiceTargetId?: string;
  /** Optional: Metadata like model used for assistant message, or source of user message. */
  metadata?: Record<string, any>;
}

/**
 * Represents a smart suggestion for user input.
 * @interface ChatSuggestion
 */
export interface ChatSuggestion extends SelectOption<string> {
  /** Type category of the suggestion (e.g., 'clarification', 'follow-up', 'tool_activation'). */
  type: string;
  /** Optional: Vue component or name for an icon. */
  icon?: any;
  /** Optional: Action string or prompt to execute when clicked/selected. */
  action?: string; // Could be a predefined action key or a full prompt
}

/**
 * Represents contextual data related to the current chat topic (e.g., LeetCode problem, System Design query).
 * @interface ChatContextData
 */
export interface ChatContextData {
  /** Type of the problem or context (e.g., 'ArrayManipulation', 'MicroserviceArchitecture'). */
  type?: string;
  /** Relevant data structures or components. */
  elements?: string[];
  /** Suggested approach or key concepts. */
  summary?: string;
  /** Link to external resource if applicable. */
  sourceLink?: string;
}

/**
 * Represents statistics for the current chat session.
 * @interface ChatSessionStats
 */
export interface ChatSessionStats {
  problemsSolved: number;
  avgResponseTimeMs: number; // Average assistant response time in milliseconds
  topLanguageUsed: string | null; // Most frequently used programming language in the session
  totalInteractions: number; // User messages sent
  // Add more relevant stats as needed
}


/**
 * @interface ChatState
 * @description Represents the state managed by the chat store.
 */
export interface ChatState {
  /** Array of all messages in the current chat session. */
  messages: ChatMessage[];
  /** The currently displayed message pair (user & assistant) if in 'autoClear' single-view mode. */
  currentMessagePair: { user: ChatMessage | null; assistant: ChatMessage | null } | null;
  /** Indicates if the application is currently processing a chat request to the backend. */
  isLoading: boolean;
  /** Describes the current step of an ongoing loading/processing (e.g., "Analyzing input...", "Generating response..."). */
  loadingStep: string | null;
  /** Numeric progress (0-100) of the current loading process, if applicable. */
  loadingProgress: number;
  /** Tracks the estimated API cost of the current chat session. */
  currentSessionCost: number;
  /** Controls visibility of a cost warning (e.g., if threshold is neared/exceeded). */
  isCostWarningActive: boolean;
  /** Predicted content type or intent based on the latest user input or assistant response. */
  predictedContentType: string | null;
  /** Array of currently available smart input suggestions for the user. */
  inputSuggestions: ChatSuggestion[];
  /** Controls the visibility of the contextual information panel. */
  isContextPanelVisible: boolean;
  /** Data displayed in the contextual information panel. */
  contextPanelData: ChatContextData | null;
  /** Statistics for the current user session. */
  sessionStats: ChatSessionStats;
  /** Stores any error related to chat operations. */
  chatError: AppError | null;
  /** Internal counter for message IDs */
  _messageIdCounter: number;
}

const contentAnalyzer = new ContentAnalyzer(); // Instantiate analyzer

/**
 * `useChatStore` Pinia store definition.
 */
export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    messages: [],
    currentMessagePair: null,
    isLoading: false,
    loadingStep: null,
    loadingProgress: 0,
    currentSessionCost: 0,
    isCostWarningActive: false,
    predictedContentType: null,
    inputSuggestions: [],
    isContextPanelVisible: false,
    contextPanelData: null,
    sessionStats: {
      problemsSolved: 0,
      avgResponseTimeMs: 0,
      totalInteractions: 0,
      topLanguageUsed: null,
    },
    chatError: null,
    _messageIdCounter: 0,
  }),

  getters: {
    /** Gets the total number of messages in the history. */
    messageCount: (state): number => state.messages.length,
    /** Gets the latest message in the history, if any. */
    latestMessage: (state): ChatMessage | undefined => state.messages.length > 0 ? state.messages[state.messages.length - 1] : undefined,
    /** Gets messages to display, considering autoClear mode. */
    displayMessages(state): ChatMessage[] {
        const chatSettingsStore = useChatSettingsStore();
        if (chatSettingsStore.shouldAutoClearInput && state.currentMessagePair) {
            const pair: ChatMessage[] = [];
            if (state.currentMessagePair.user) pair.push(state.currentMessagePair.user);
            if (state.currentMessagePair.assistant) pair.push(state.currentMessagePair.assistant);
            return pair;
        }
        return state.messages;
    }
  },

  actions: {
    /**
     * Generates a unique ID for a new message.
     * @returns {string} A unique message ID.
     */
    _generateMessageId(): string {
      this._messageIdCounter++;
      return `msg-${Date.now()}-${this._messageIdCounter}`;
    },

    /**
     * Adds a new message to the chat history.
     * @param {Omit<ChatMessage, 'id' | 'timestamp' | 'voiceTargetId'>} messageData - Data for the new message.
     * @param {boolean} [isUserMessage=false] - If true, potentially clears old messages if autoClear is on.
     */
    addMessage(messageData: Omit<ChatMessage, 'id' | 'timestamp' | 'voiceTargetId'>, isUserMessage: boolean = false) {
      const chatSettingsStore = useChatSettingsStore();
      const newMessage: ChatMessage = {
        ...messageData,
        id: this._generateMessageId(),
        timestamp: Date.now(),
        voiceTargetId: `message-${this._generateMessageId()}`, // Auto-generate voice target
      };

      if (chatSettingsStore.shouldAutoClearInput) {
        if (isUserMessage) {
            this.currentMessagePair = { user: newMessage, assistant: null };
            // When auto-clear, messages array still holds the current pair for display consistency
            this.messages = [newMessage];
        } else if (this.currentMessagePair?.user && newMessage.role === 'assistant') {
            this.currentMessagePair.assistant = newMessage;
            this.messages = [this.currentMessagePair.user, newMessage];
        } else { // Error or system message in auto-clear, just append
            this.messages = [newMessage]; // Or handle system/error differently
            this.currentMessagePair = { user: null, assistant: newMessage.role === 'assistant' ? newMessage : null };
        }
      } else {
        this.messages.push(newMessage);
        this.currentMessagePair = null; // Not in single-pair view mode
      }
      this.chatError = null; // Clear previous errors on new message
    },

    /**
     * Processes user input (text or transcribed voice), sends it to the backend,
     * and handles the AI assistant's response.
     * @param {string} inputText - The user's input text.
     */
    async sendUserMessage(inputText: string) {
      if (!inputText.trim()) return;
      this.isLoading = true;
      this.loadingStep = 'Analyzing your input...';
      this.loadingProgress = 10;
      this.chatError = null;
      const uiStore = useUiStore();
      const chatSettingsStore = useChatSettingsStore();

      // 1. Analyze user input locally (optional, can also be done by backend agent)
      const userInputAnalysis = contentAnalyzer.analyzeContent(inputText, chatSettingsStore.currentMode);
      this.predictedContentType = userInputAnalysis.type;
      this.addMessage({
        role: 'user',
        content: inputText,
        analysis: userInputAnalysis,
        detectedIntent: userInputAnalysis.type !== 'general' ? userInputAnalysis.type : undefined,
      }, true); // true indicates it's a user message for autoClear logic

      // 2. Generate smart suggestions based on input (can be async)
      this.generateSuggestions(userInputAnalysis);

      // 3. Prepare and send request to backend
      try {
        // const baseSystemPrompt = this._buildBaseSystemPrompt();
        // const enhancedSystemPrompt = contentAnalyzer.generateEnhancedPrompt(userInputAnalysis, baseSystemPrompt, chatSettingsStore.currentLanguage);
        // The backend GMI should now handle most of the prompt engineering based on persona and context.
        // We just send the core messages and settings.

        const requestMessages = this.messages.map(m => ({ role: m.role, content: m.content }));
        // If autoClear, the requestMessages might only have the latest user message.
        // Consider sending more history if backend GMI needs it.
        // For now, let GMI decide based on its persona's memory settings.

        this.loadingStep = 'Waiting for AI assistant...';
        this.loadingProgress = 40;

        // This is a conceptual API call. The actual endpoint and payload might differ
        // based on how AgentOS interaction is exposed.
        const response = await apiService.post<{ message: ChatMessage, costData?: any }>('/chat/interact', { // Example endpoint
          // personaId: chatSettingsStore.currentPersonaId, // If personas are selectable
          messages: requestMessages, // Send relevant message history
          settings: {
            mode: chatSettingsStore.currentMode,
            language: chatSettingsStore.currentLanguage,
            generateDiagrams: chatSettingsStore.shouldGenerateDiagrams,
            // userId: useAuthStore().currentUser?.id || 'guest', // Send user ID for context/logging
          }
        });

        this.loadingStep = 'Processing response...';
        this.loadingProgress = 80;

        const assistantMessageData = response.message; // Assuming backend returns a ChatMessage structure
        this.addMessage({
            role: assistantMessageData.role || 'assistant',
            content: assistantMessageData.content,
            analysis: assistantMessageData.analysis || contentAnalyzer.analyzeContent(assistantMessageData.content, chatSettingsStore.currentMode),
            metadata: assistantMessageData.metadata,
        });

        if (response.costData) {
          this.updateSessionCost(response.costData.newCostDelta, response.costData.totalSessionCost);
        }
        this.updateSessionStats(userInputAnalysis, assistantMessageData.analysis || null);
        this.generateSuggestions(assistantMessageData.analysis || null); // Update suggestions based on AI response

      } catch (error) {
        const appError = error instanceof AppError ? error : new AppError('CHAT_SEND_FAILED', (error as Error).message || 'Failed to get response from assistant.', error);
        this.chatError = appError;
        this.addMessage({ role: 'error', content: `Error: ${appError.message}` });
        uiStore.addNotification({ type: 'error', title: 'Chat Error', message: appError.message });
        console.error('[ChatStore] Send message failed:', appError);
      } finally {
        this.isLoading = false;
        this.loadingStep = null;
        this.loadingProgress = 0;
      }
    },

    /**
     * Clears the entire chat history and resets related state.
     */
    async clearChatSession() {
      this.messages = [];
      this.currentMessagePair = null;
      this.isLoading = false;
      this.loadingStep = null;
      this.chatError = null;
      this.currentSessionCost = 0;
      this.isCostWarningActive = false;
      this.predictedContentType = null;
      this.inputSuggestions = [];
      this.isContextPanelVisible = false;
      this.contextPanelData = null;
      this.sessionStats = { problemsSolved: 0, avgResponseTimeMs: 0, totalInteractions: 0, topLanguageUsed: null };
      // Optionally call backend to clear server-side session/cost data
      try {
        await apiService.post('/chat/reset-session', { userId: useAuthStore().currentUser?.id || 'guest' });
      } catch (error) {
        console.warn('[ChatStore] Failed to reset session on backend:', error);
      }
      useUiStore().addNotification({ type: 'info', message: 'Chat session cleared.' });
    },

    /**
     * Updates the session cost and checks against thresholds.
     * @param {number} costDelta - The cost of the last interaction.
     * @param {number} totalSessionCost - The new total session cost from backend.
     */
    updateSessionCost(costDelta: number, totalSessionCost: number) {
      this.currentSessionCost = totalSessionCost;
      const costThreshold = useAuthStore().currentSubscription?.monthlyCostLimitUsd || 20; // Example: get from user's subscription tier
      // This is a simplified threshold check; a more robust one would involve daily/monthly limits from user's subscription.
      if (this.currentSessionCost > costThreshold * 0.9 && !this.isCostWarningActive) {
        this.isCostWarningActive = true;
        useUiStore().addNotification({
          type: 'warning',
          title: 'Cost Alert',
          message: `Session cost is approaching your limit ($${costThreshold.toFixed(2)}). Current: $${this.currentSessionCost.toFixed(2)}`,
          duration: 10000,
        });
      } else if (this.currentSessionCost <= costThreshold * 0.9 && this.isCostWarningActive) {
        this.isCostWarningActive = false; // Reset warning if cost goes down or limit increases
      }
      // Actual enforcement of hard limits would be on the backend.
    },

    /**
     * Generates smart suggestions based on content analysis.
     * @param {ContentAnalysis | null} analysis - The content analysis object.
     */
    generateSuggestions(analysis: ContentAnalysis | null) {
      const newSuggestions: ChatSuggestion[] = [];
      if (!analysis) {
          this.inputSuggestions = [];
          return;
      }

      // Example: Transform analysis.suggestions (if they exist) or create new ones
      if (analysis.suggestions && analysis.suggestions.length > 0) {
        analysis.suggestions.slice(0, 3).forEach(s => { // Max 3 suggestions
          newSuggestions.push({
            value: s.implementation || s.message, // Value for selection
            label: s.message,
            type: s.type || 'general',
            action: s.implementation,
            // icon: mapSuggestionTypeToIcon(s.type) // Helper to map type to an icon component
          });
        });
      } else if (analysis.type === 'leetcode') {
        newSuggestions.push({ value: 'Explain time complexity', label: 'Time Complexity?', type: 'analysis' });
        newSuggestions.push({ value: 'Show optimal solution', label: 'Optimal Solution?', type: 'solution' });
      }
      // Add more logic for different analysis types

      this.inputSuggestions = newSuggestions;
    },

    /**
     * Updates session statistics.
     * @param {ContentAnalysis | null} userInputAnalysis - Analysis of user's input.
     * @param {ContentAnalysis | null} assistantResponseAnalysis - Analysis of assistant's response.
     */
    updateSessionStats(userInputAnalysis: ContentAnalysis | null, assistantResponseAnalysis: ContentAnalysis | null) {
      this.sessionStats.totalInteractions++;
      if (userInputAnalysis?.type === 'leetcode' && assistantResponseAnalysis?.problemMetadata?.solved) { // Assuming analysis can mark a problem as 'solved'
        this.sessionStats.problemsSolved++;
      }
      if (assistantResponseAnalysis?.language) {
        this.sessionStats.topLanguageUsed = assistantResponseAnalysis.language; // Simplistic, could count occurrences
      }
      // Avg response time would need to be calculated by tracking request/response timings
    },

    /**
     * Toggles the visibility of the context panel and updates its data.
     * @param {ChatContextData | null} data - Data for the context panel. Pass null to hide.
     */
    setContextPanel(data: ChatContextData | null) {
      this.contextPanelData = data;
      this.isContextPanelVisible = !!data;
    },

    // TODO: Add actions for specific UI interactions like "toggle-fullscreen-from-message"
    // which might be emitted by CompactMessageRenderer
  },
});