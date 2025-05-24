// File: frontend/src/features/agents/store/agent.store.ts
/**
 * @fileoverview Pinia store for managing AI agent (Persona) data.
 * Fetches available personas from the backend and provides state for persona selection.
 * @module features/agents/store/agent
 */
import { defineStore } from 'pinia';
import { apiService } from '../../../services/apiService';
import type { AppError } from '../../../types/api.types';
import { useUiStore } from '../../../store/ui.store';

/**
 * Represents the client-friendly structure of an AI Persona definition.
 * @interface PersonaDefinitionClient
 */
export interface PersonaDefinitionClient {
  id: string;
  displayName: string;
  description?: string;
  iconUrl?: string; // URL or path to an icon asset
  defaultGreeting?: string;
  // Add other relevant fields for display or selection logic
  // e.g., category: string; capabilitiesSummary: string[];
}

/**
 * @interface AgentState
 * @description Represents the state managed by the agent store.
 */
export interface AgentState {
  /** Array of available persona definitions fetched from the backend. */
  availablePersonas: PersonaDefinitionClient[];
  /** The currently selected or active persona ID. Can be null if no specific persona is active. */
  activePersonaId: string | null;
  /** Indicates if persona data is currently being fetched. */
  isLoading: boolean;
  /** Stores any error related to fetching persona data. */
  error: AppError | null;
}

/**
 * `useAgentStore` Pinia store definition.
 */
export const useAgentStore = defineStore('agent', {
  state: (): AgentState => ({
    availablePersonas: [],
    activePersonaId: null, // Could default to a general-purpose persona ID from config
    isLoading: false,
    error: null,
  }),

  getters: {
    /**
     * Gets the currently selected persona definition object.
     * @param state - The current store state.
     * @returns {PersonaDefinitionClient | undefined} The active persona or undefined.
     */
    activePersona(state): PersonaDefinitionClient | undefined {
      if (!state.activePersonaId) return undefined;
      return state.availablePersonas.find(p => p.id === state.activePersonaId);
    },

    /**
     * Gets a persona by its ID.
     * @param state - The current store state.
     * @returns (personaId: string) => PersonaDefinitionClient | undefined
     */
    getPersonaById: (state) => (personaId: string): PersonaDefinitionClient | undefined => {
      return state.availablePersonas.find(p => p.id === personaId);
    },
  },

  actions: {
    /**
     * Fetches the list of available AI assistant personas from the backend.
     * @param {boolean} [forceRefresh=false] - If true, fetches even if data already exists.
     */
    async fetchAvailablePersonas(forceRefresh: boolean = false) {
      if (this.availablePersonas.length > 0 && !forceRefresh) {
        return; // Data already loaded
      }

      this.isLoading = true;
      this.error = null;
      const uiStore = useUiStore();

      try {
        uiStore.setGlobalLoading(true, 'Loading AI Assistants...'); // Optional global loading
        // Endpoint defined conceptually in backend step
        const personas = await apiService.get<PersonaDefinitionClient[]>('/gmi/personas');
        this.availablePersonas = personas;

        // If no active persona is set, and personas are available, set a default one
        if (!this.activePersonaId && this.availablePersonas.length > 0) {
          // Prioritize a persona with 'general' or 'default' in its ID or name, or just the first one
          const defaultPersona =
            this.availablePersonas.find(p => p.id.toLowerCase().includes('general') || p.displayName.toLowerCase().includes('general')) ||
            this.availablePersonas[0];
          if (defaultPersona) {
            this.setActivePersonaId(defaultPersona.id);
          }
        }
      } catch (error) {
        const appError = error instanceof AppError ? error : new AppError('FETCH_PERSONAS_FAILED', (error as Error).message || 'Failed to load AI assistant personas.', error);
        this.error = appError;
        console.error('[AgentStore] Fetching personas failed:', appError);
        uiStore.addNotification({ type: 'error', title: 'Load Error', message: appError.message });
      } finally {
        this.isLoading = false;
        uiStore.setGlobalLoading(false);
      }
    },

    /**
     * Sets the currently active persona ID.
     * @param {string | null} personaId - The ID of the persona to activate, or null.
     */
    setActivePersonaId(personaId: string | null) {
      const personaExists = personaId ? this.availablePersonas.some(p => p.id === personaId) : true; // Null is valid
      if (personaExists) {
        this.activePersonaId = personaId;
        console.log(`[AgentStore] Active persona set to: ${personaId || 'None'}`);
        // Persist this choice if needed, e.g., using storageService
        // storageService.set(StorageType.Local, 'active-persona-id', personaId);
        // Potentially emit an event or trigger other actions when persona changes
        // (e.g., clear chat, load persona-specific settings via chatSettingsStore).
        const chatSettingsStore = useChatSettingsStore(); // Get instance here
        if(personaId){
            const selectedPersona = this.getPersonaById(personaId);
            // Example: map persona to a default mode (if applicable)
            // This mapping logic can be more sophisticated.
            if (selectedPersona?.id.includes('coding')) chatSettingsStore.setMode(AssistantMode.CODING);
            else if (selectedPersona?.id.includes('system_design')) chatSettingsStore.setMode(AssistantMode.SYSTEM_DESIGN);
            // else chatSettingsStore.setMode(AssistantMode.GENERAL_CHAT);
        }


      } else {
        console.warn(`[AgentStore] Attempted to set unknown active persona ID: ${personaId}`);
      }
    },
  },
});