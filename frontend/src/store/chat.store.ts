// File: frontend/src/store/chat.store.ts
/**
 * @fileoverview Fixed chat store with proper AgentOS API integration
 * @module store/chat
 */
import { defineStore } from 'pinia';
import { chatApiService, type AgentOSChatInput } from '../services/chatApiService';
import { useAuthStore } from './auth.store';
import { useUiStore } from './ui.store';

/**
 * Represents a single message in the chat.
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

/**
 * Chat store state interface
 */
export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  loadingStep: string | null;
  loadingProgress: number;
  currentSessionCost: number;
  sessionId: string;
  chatError: Error | null;
  _messageIdCounter: number;
}

/**
 * Chat store implementation
 */
export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    messages: [],
    isLoading: false,
    loadingStep: null,
    loadingProgress: 0,
    currentSessionCost: 0,
    sessionId: `session-${Date.now()}`,
    chatError: null,
    _messageIdCounter: 0,
  }),

  getters: {
    messageCount: (state): number => state.messages.length,
    latestMessage: (state): ChatMessage | undefined => 
      state.messages.length > 0 ? state.messages[state.messages.length - 1] : undefined,
  },

  actions: {
    /**
     * Generates a unique ID for a new message
     */
    _generateMessageId(): string {
      this._messageIdCounter++;
      return `msg-${Date.now()}-${this._messageIdCounter}`;
    },

    /**
     * Adds a new message to the chat history
     */
    addMessage(messageData: Omit<ChatMessage, 'id' | 'timestamp'>) {
      const newMessage: ChatMessage = {
        ...messageData,
        id: this._generateMessageId(),
        timestamp: Date.now(),
      };

      this.messages.push(newMessage);
      this.chatError = null;
    },

    /**
     * Sends a user message and handles the streaming response
     */
    async sendUserMessage(inputText: string) {
      if (!inputText.trim()) return;

      const authStore = useAuthStore();
      const uiStore = useUiStore();

      // Check if user is authenticated
      if (!authStore.isAuthenticated) {
        uiStore.addNotification({
          type: 'error',
          title: 'Authentication Required',
          message: 'Please log in to use the chat feature.',
        });
        return;
      }

      this.isLoading = true;
      this.loadingStep = 'Sending message...';
      this.loadingProgress = 10;
      this.chatError = null;

      // Add user message
      this.addMessage({
        role: 'user',
        content: inputText,
      });

      try {
        // Prepare AgentOS input
        const agentOSInput: AgentOSChatInput = {
          userId: authStore.currentUser!.id,
          sessionId: this.sessionId,
          textInput: inputText,
          selectedPersonaId: 'default_assistant_persona', // Could be made configurable
        };

        this.loadingStep = 'Waiting for AI response...';
        this.loadingProgress = 30;

        // Get response from AgentOS
        const response = await chatApiService.sendMessageAndCollect(agentOSInput);

        this.loadingStep = 'Processing response...';
        this.loadingProgress = 80;

        // Add assistant response
        this.addMessage({
          role: 'assistant',
          content: response.content,
          metadata: response.metadata,
        });

        // Update session cost if provided
        if (response.cost) {
          this.currentSessionCost += response.cost;
        }

        this.loadingProgress = 100;

      } catch (error) {
        console.error('[ChatStore] Send message failed:', error);
        this.chatError = error as Error;
        
        this.addMessage({
          role: 'error',
          content: `Error: ${(error as Error).message || 'Failed to get response from assistant.'}`,
        });

        uiStore.addNotification({
          type: 'error',
          title: 'Chat Error',
          message: (error as Error).message || 'Failed to send message',
        });
      } finally {
        this.isLoading = false;
        this.loadingStep = null;
        this.loadingProgress = 0;
      }
    },

    /**
     * Clears the chat session
     */
    async clearChatSession() {
      this.messages = [];
      this.isLoading = false;
      this.loadingStep = null;
      this.chatError = null;
      this.currentSessionCost = 0;
      this.sessionId = `session-${Date.now()}`;
      
      const uiStore = useUiStore();
      uiStore.addNotification({
        type: 'info',
        message: 'Chat session cleared.',
      });
    },
  },
});