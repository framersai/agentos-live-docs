// File: frontend/src/store/agent.store.ts
/**
 * @file agent.store.ts
 * @description Pinia store for managing the currently active AI agent, its context,
 * and related UI state such as loading status and errors.
 * @version 1.1.1 - Corrected TTS voice setting keys, removed unused AgentState interface.
 * Added JSDoc for all members.
 */
import { defineStore } from 'pinia';
import { ref, computed, watch, readonly, type Ref } from 'vue';
import { agentService, type AgentId, type IAgentDefinition } from '@/services/agent.service'; // Assumes agent.service.ts is v1.1.0+
import { voiceSettingsManager, type VoiceApplicationSettings } from '@/services/voice.settings.service';
import { useChatStore } from './chat.store';

export const useAgentStore = defineStore('agent', () => {
  /** The ID of the currently active agent. @private */
  const _activeAgentId = ref<AgentId>(
    (voiceSettingsManager.settings.currentAppMode as AgentId) || agentService.getDefaultPublicAgent().id
  );
  /** Loading state during agent switching or initialization. @public @readonly */
  const isLoadingAgent = ref<boolean>(false);
  /** Error message if agent operations fail. @public @readonly */
  const agentError = ref<string | null>(null);
  /**
   * Reactive store for agent-specific contextual data (e.g., interview stage, tutor topic).
   * Cleared on agent switch. Modified via `updateAgentContext`.
   * @public
   * @readonly
   */
  const currentAgentContext = ref<Record<string, any>>({});

  /**
   * @computed activeAgent
   * @description Retrieves the full definition of the currently active agent.
   * @returns {Readonly<IAgentDefinition> | undefined} The active agent's definition.
   */
  const activeAgent = computed<Readonly<IAgentDefinition> | undefined>(() => {
    return agentService.getAgentById(_activeAgentId.value);
  });

  /**
   * @computed activeAgentSystemPromptKey
   * @description Gets the system prompt key for the active agent.
   * @returns {string} The system prompt key.
   */
  const activeAgentSystemPromptKey = computed<string>(() => {
    return activeAgent.value?.systemPromptKey || agentService.getDefaultAgent().systemPromptKey;
  });

  /**
   * @computed activeAgentInputPlaceholder
   * @description Gets the input placeholder for the active agent.
   * @returns {string} The placeholder text.
   */
  const activeAgentInputPlaceholder = computed<string>(() => {
    return activeAgent.value?.inputPlaceholder || 'Ask or tell me anything...';
  });

  /**
   * @computed activeAgentAvatar
   * @description Gets the avatar URL for the active agent.
   * @returns {string} Path to the avatar image.
   */
  const activeAgentAvatar = computed<string>(() => {
    const agent = activeAgent.value;
    // Assuming avatars are in public/assets/avatars/ for direct linking
    const avatarFilename = agent?.avatar || 'default_avatar.svg';
    return `/assets/avatars/${avatarFilename}`;
  });

  /**
   * @computed activeAgentThemeColor
   * @description Gets the theme color hint for the active agent.
   * @returns {string} A CSS color value or CSS variable.
   */
  const activeAgentThemeColor = computed<string>(() => {
    return activeAgent.value?.themeColor || 'var(--primary-500)';
  });

  /**
   * @computed activeAgentHolographicElement
   * @description Gets an identifier for a holographic UI element for the active agent.
   * @returns {string | undefined} Identifier string or undefined.
   */
  const activeAgentHolographicElement = computed<string | undefined>(() => {
    return activeAgent.value?.holographicElement;
  });

  /**
   * @function setActiveAgent
   * @description Sets the active agent, updates related voice settings, and clears context.
   * @param {AgentId} agentId - The ID of the agent to activate.
   * @async
   * @returns {Promise<void>}
   */
  async function setActiveAgent(agentId: AgentId): Promise<void> {
    if (_activeAgentId.value === agentId && activeAgent.value) {
      isLoadingAgent.value = false;
      return;
    }

    isLoadingAgent.value = true;
    agentError.value = null;
    const chatStore = useChatStore();
    const previousAgentId = _activeAgentId.value;

    if (activeAgent.value) { // If there was a previously active agent
        chatStore.clearMainContentForAgent(previousAgentId);
    }

    const newAgent = agentService.getAgentById(agentId);

    if (newAgent) {
      _activeAgentId.value = newAgent.id;
      currentAgentContext.value = {}; // Reset context for the new agent

      if (voiceSettingsManager.settings.currentAppMode !== newAgent.id) {
        voiceSettingsManager.updateSetting('currentAppMode', newAgent.id as string);
      }

      if (newAgent.defaultVoicePersona) {
        const persona = newAgent.defaultVoicePersona;
        if (typeof persona === 'string') {
          console.log(`[AgentStore] Applying voice persona name: ${persona}`);
          // If your TTS service can select voice by name across providers, you might have a generic setting.
          // Otherwise, this string name might be for display or a convention.
        } else if (typeof persona === 'object' && persona.name) {
          console.log(`[AgentStore] Applying voice persona: Name='${persona.name}', VoiceID='${persona.voiceId}', Lang='${persona.lang}'`);
          if (persona.voiceId) {
            // This single key should store the ID/URI of the voice.
            // The TTS service itself will know how to use this ID based on the current TTS provider.
            voiceSettingsManager.updateSetting('selectedTtsVoiceId', persona.voiceId);
          }
          if (persona.lang && voiceSettingsManager.settings.speechLanguage !== persona.lang) {
            voiceSettingsManager.updateSetting('speechLanguage', persona.lang);
          }
        }
      }
      console.log(`[AgentStore] Active agent set to: ${newAgent.label} (ID: ${newAgent.id})`);
    } else {
      agentError.value = `Agent with ID "${agentId}" not found. Reverting to default public agent.`;
      console.error(agentError.value);
      const defaultAgent = agentService.getDefaultPublicAgent();
      _activeAgentId.value = defaultAgent.id;
      if (voiceSettingsManager.settings.currentAppMode !== defaultAgent.id) {
        voiceSettingsManager.updateSetting('currentAppMode', defaultAgent.id as string);
      }
    }
    chatStore.ensureMainContentForAgent(_activeAgentId.value); // Load welcome/existing content for new agent
    isLoadingAgent.value = false;
  }

  /**
   * @function updateAgentContext
   * @description Merges new data into `currentAgentContext` for the active agent.
   * @param {Record<string, any>} contextData - Data to merge.
   */
  function updateAgentContext(contextData: Record<string, any>): void {
    currentAgentContext.value = { ...currentAgentContext.value, ...contextData };
  }

  /**
   * @function clearAgentContext
   * @description Clears `currentAgentContext` for the active agent.
   */
  function clearAgentContext(): void {
    currentAgentContext.value = {};
  }

  // Watch for external changes to currentAppMode from voiceSettingsManager
  watch(() => voiceSettingsManager.settings.currentAppMode, (newMode) => {
    if (newMode && newMode !== _activeAgentId.value) {
      const agentExists = agentService.getAgentById(newMode as AgentId);
      if (agentExists) {
        setActiveAgent(newMode as AgentId);
      } else {
        console.warn(`[AgentStore] Watched 'currentAppMode' ("${newMode}") does not match known agent. Reverting.`);
        setActiveAgent(agentService.getDefaultPublicAgent().id);
      }
    }
  }, { immediate: false }); // Run only on changes, not immediately (initial sync is separate)

  // Initial synchronization of _activeAgentId with voiceSettingsManager or default
  const initialModeFromSettings = voiceSettingsManager.settings.currentAppMode as AgentId;
  const initialAgentDef = agentService.getAgentById(initialModeFromSettings);
  if (initialAgentDef) {
    _activeAgentId.value = initialAgentDef.id;
  } else {
    const defaultPublicAgent = agentService.getDefaultPublicAgent();
    _activeAgentId.value = defaultPublicAgent.id;
    if (voiceSettingsManager.settings.currentAppMode !== defaultPublicAgent.id) {
      voiceSettingsManager.updateSetting('currentAppMode', defaultPublicAgent.id);
    }
  }
  // Call ensureMainContentForAgent after the store is fully setup
  // This needs to be deferred or called carefully to avoid circular dependency issues with chatStore
  // One way is to call it from App.vue onMounted, or via a setTimeout if really needed here.
  // For now, let's assume agent views or App.vue will trigger initial content load.

  return {
    activeAgentId: readonly(_activeAgentId),
    isLoadingAgent: readonly(isLoadingAgent),
    agentError: readonly(agentError),
    currentAgentContext: readonly(currentAgentContext),
    activeAgent,
    activeAgentSystemPromptKey,
    activeAgentInputPlaceholder,
    activeAgentAvatar,
    activeAgentThemeColor,
    activeAgentHolographicElement,
    setActiveAgent,
    updateAgentContext,
    clearAgentContext,
  };
});