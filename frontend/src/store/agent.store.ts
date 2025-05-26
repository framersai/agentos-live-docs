// File: frontend/src/store/agent.store.ts
/**
 * @file agent.store.ts
 * @description Pinia store for managing the currently active AI agent and its related state.
 * @version 1.0.2 - Imported readonly from vue. Removed unused Ref and VoiceApplicationSettings.
 */
import { defineStore } from 'pinia';
import { ref, computed, watch, readonly } from 'vue'; // Import readonly
import { agentService, type AgentId, type IAgentDefinition } from '@/services/agent.service';
import { voiceSettingsManager } from '@/services/voice.settings.service';
// Unused AgentState interface removed

export const useAgentStore = defineStore('agent', () => {
    const _activeAgentId = ref<AgentId>(
        (voiceSettingsManager.settings.currentAppMode as AgentId) || agentService.getDefaultAgent().id
    );
    const isLoadingAgent = ref<boolean>(false);
    const agentError = ref<string | null>(null);
    const currentAgentContext = ref<Record<string, any>>({});

    const activeAgent = computed<Readonly<IAgentDefinition> | undefined>(() => {
        return agentService.getAgentById(_activeAgentId.value);
    });

    const activeAgentSystemPromptKey = computed<string>(() => {
        return activeAgent.value?.systemPromptKey || agentService.getDefaultAgent().systemPromptKey;
    });

    const activeAgentInputPlaceholder = computed<string>(() => {
        return activeAgent.value?.inputPlaceholder || 'Ask or tell me anything...';
    });

    const activeAgentAvatar = computed<string>(() => { // Return type changed to string for guaranteed fallback
        const agent = activeAgent.value;
        if (agent?.avatar) {
            if (agent.avatar.startsWith('/')) return agent.avatar;
            return `/src/assets/avatars/${agent.avatar}`;
        }
        return `/src/assets/avatars/default_avatar.svg`; // Ensure this default exists
    });

    async function setActiveAgent(agentId: AgentId): Promise<void> {
        isLoadingAgent.value = true;
        agentError.value = null;
        const newAgent = agentService.getAgentById(agentId);

        if (newAgent) {
            _activeAgentId.value = newAgent.id;
            currentAgentContext.value = {};
            if (voiceSettingsManager.settings.currentAppMode !== newAgent.id) {
                 voiceSettingsManager.updateSetting('currentAppMode', newAgent.id as string);
            }

            if (newAgent.defaultVoicePersona) {
                if (typeof newAgent.defaultVoicePersona === 'string') {
                    console.log(`[AgentStore] Applying voice persona name: ${newAgent.defaultVoicePersona}`);
                } else if (typeof newAgent.defaultVoicePersona === 'object') {
                    const persona = newAgent.defaultVoicePersona;
                    console.log(`[AgentStore] Applying voice persona settings: ${persona.name}`);
                    if (persona.voiceId && voiceSettingsManager.settings.ttsProvider === 'browser_tts') {
                        voiceSettingsManager.updateSetting('selectedTtsVoiceId', persona.voiceId);
                    }
                    if (persona.lang) {
                         voiceSettingsManager.updateSetting('speechLanguage', persona.lang);
                    }
                }
            }
            console.log(`[AgentStore] Active agent set to: ${newAgent.label}`);
        } else {
            agentError.value = `Agent with ID "${agentId}" not found.`;
            console.error(agentError.value);
        }
        isLoadingAgent.value = false;
    }

    function updateAgentContext(contextData: Record<string, any>): void {
        currentAgentContext.value = { ...currentAgentContext.value, ...contextData };
    }

    function clearAgentContext(): void {
        currentAgentContext.value = {};
    }

    watch(() => voiceSettingsManager.settings.currentAppMode, (newMode) => {
        if (newMode !== _activeAgentId.value) {
            const agentExists = agentService.getAgentById(newMode as AgentId);
            if (agentExists) {
                setActiveAgent(newMode as AgentId);
            } else {
                console.warn(`[AgentStore] Mode "${newMode}" from voiceSettingsManager does not match a known agent. Reverting to default.`);
                setActiveAgent(agentService.getDefaultAgent().id);
            }
        }
    });

    // Initial sync with voiceSettingsManager or default
    const initialMode = voiceSettingsManager.settings.currentAppMode as AgentId;
    const initialAgent = agentService.getAgentById(initialMode);
    if (initialAgent) {
        _activeAgentId.value = initialAgent.id;
    } else {
        const defaultAgent = agentService.getDefaultAgent();
        _activeAgentId.value = defaultAgent.id;
        if (voiceSettingsManager.settings.currentAppMode !== defaultAgent.id) {
             voiceSettingsManager.updateSetting('currentAppMode', defaultAgent.id);
        }
    }

    return {
        activeAgentId: _activeAgentId, // Expose ref for potential v-model, or use readonly(_activeAgentId)
        isLoadingAgent: readonly(isLoadingAgent),
        agentError: readonly(agentError),
        currentAgentContext: readonly(currentAgentContext),
        activeAgent,
        activeAgentSystemPromptKey,
        activeAgentInputPlaceholder,
        activeAgentAvatar,
        setActiveAgent,
        updateAgentContext,
        clearAgentContext,
    };
});