// File: frontend/src/views/PrivateHome.vue
/**
 * @file PrivateHome.vue
 * @description Main private view for authenticated users. Orchestrates agent views,
 * handles central LLM calls for agents that don't manage their own input,
 * and manages the global LLM processing state (`isLoadingResponse`).
 * This state is critical for coordinating UI elements like VoiceInput.
 *
 * @component PrivateHome
 * @version 2.3.0 - ABSOLUTE RIGOR on isLoadingResponse management.
 * It is ONLY true during an actual LLM API call initiated by PrivateHome's
 * standardLlmCallPrivate OR when an agent view explicitly signals its own LLM activity
 * via the 'setProcessingState' event. Completely decoupled from STT activity state.
 */
<script setup lang="ts">
import { ref, computed, onMounted, watch, type Component as VueComponentType, defineAsyncComponent, inject } from 'vue';
import { useRouter } from 'vue-router';
import type { ToastService } from '@/services/services';
import { agentService, type AgentId, type IAgentDefinition } from '@/services/agent.service';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore, type MainContent } from '@/store/chat.store';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import { useAuth } from '@/composables/useAuth';
import {
  chatAPI,
  promptAPI,
  type ChatMessagePayloadFE,
  type ProcessedHistoryMessageFE,
  type ChatMessageFE,
} from '@/utils/api';
import type { AdvancedHistoryConfig } from '@/services/advancedConversation.manager';
import { createScopedSttLogger } from '@/utils/debug';

import UnifiedChatLayout from '@/components/layouts/UnifiedChatLayout.vue';
import MainContentView from '@/components/agents/common/MainContentView.vue';
import CompactMessageRenderer from '@/components/layouts/CompactMessageRenderer/CompactMessageRenderer.vue';

import { ShieldCheckIcon, CogIcon, UserGroupIcon, XMarkIcon } from '@heroicons/vue/24/solid';


const toast = inject<ToastService>('toast');
const router = useRouter();
const agentStore = useAgentStore();
const chatStore = useChatStore();
const auth = useAuth();
const debugLog = createScopedSttLogger('PrivateHome');

const activeAgent = computed<IAgentDefinition | undefined>(() => agentStore.activeAgent);
const currentSystemPromptText = ref('');

const isPersonaModalOpen = ref(false);
const personaDraft = ref('');
const activePersona = computed(() => activeAgent.value ? chatStore.getPersonaForAgent(activeAgent.value.id) : null);
const personaHasCustom = computed(() => !!activePersona.value?.trim());
const personaButtonLabel = computed(() => personaHasCustom.value ? 'Persona: Custom' : 'Persona: Default');
const personaTooltipText = computed(() => {
  const agentName = activeAgent.value?.label || 'this assistant';
  return personaHasCustom.value
    ? `${agentName} is using your custom persona settings. Click to adjust or clear them.`
    : `Add a persona overlay to tune tone or personality. ${agentName}'s core role stays the same.`;
});
const personaSummaryText = computed(() => {
  const personaValue = activePersona.value?.trim();
  if (personaValue && personaValue.length > 0) {
    if (personaValue.length <= 160) return personaValue;
    return personaValue.slice(0, 160) + '...';
  }
  return '';
});
const personaDraftHasContent = computed(() => personaDraft.value.trim().length > 0);

type PersonaModalView = 'editor' | 'library';

interface PersonaPreset {
  id: string;
  label: string;
  summary: string;
  persona: string;
}

const personaModalView = ref<PersonaModalView>('editor');
const personaPresetPage = ref(1);
const PERSONA_PRESETS_PER_PAGE = 3;

const personaPresets: PersonaPreset[] = [
  {
    id: 'mentor_clarity',
    label: 'Clarity Mentor',
    summary: 'Persona overlay: warm, structured explanations with numbered steps and short recaps.',
    persona: `You are a calm senior mentor. Speak warmly, break solutions into numbered steps, explain trade-offs, and end with a concise recap plus the next step the user should take.`,
  },
  {
    id: 'pair_partner',
    label: 'Pair Partner',
    summary: 'Persona overlay: collaborative pairing that thinks out loud and checks for understanding.',
    persona: `You act as an enthusiastic pair-programming partner. Think out loud, ask brief confirmation questions, highlight alternative approaches, and keep the conversation collaborative.`,
  },
  {
    id: 'system_architect',
    label: 'System Architect',
    summary: 'Persona overlay: high-level architecture focus with diagrams and scalability notes.',
    persona: `You are a pragmatic system architect. Start with assumptions, outline architecture layers, mention scaling considerations, and suggest diagrams or models when helpful.`,
  },
  {
    id: 'debug_detective',
    label: 'Debug Detective',
    summary: 'Persona overlay: diagnostic voice that forms hypotheses and proposes targeted experiments.',
    persona: `You are a methodical debugging partner. Form hypotheses, list likely root causes, suggest focused experiments, and interpret possible outcomes to converge on a fix.`,
  },
  {
    id: 'product_storyteller',
    label: 'Product Storyteller',
    summary: 'Persona overlay: user-centered voice translating tech choices into product impact.',
    persona: `You translate technical decisions into product impact. Use plain language, emphasize user outcomes, note risks, and propose lightweight validation ideas.`,
  },
  {
    id: 'exam_coach',
    label: 'Exam Coach',
    summary: 'Persona overlay: encouraging coach with study tips and spaced-repetition prompts.',
    persona: `You are an encouraging exam coach. Provide concise explanations, suggest memory aids, recommend spaced-repetition prompts, and motivate the user with positive reinforcement.`,
  },
];

const personaPresetTotalPages = computed(() => Math.max(1, Math.ceil(personaPresets.length / PERSONA_PRESETS_PER_PAGE)));
const personaPresetsForCurrentPage = computed(() => {
  const startIndex = (personaPresetPage.value - 1) * PERSONA_PRESETS_PER_PAGE;
  return personaPresets.slice(startIndex, startIndex + PERSONA_PRESETS_PER_PAGE);
});

const isPersonaPresetActive = (preset: PersonaPreset): boolean => personaDraft.value.trim() === preset.persona.trim();

function goToPersonaPresetPage(direction: 'next' | 'prev'): void {
  if (personaPresetTotalPages.value <= 1) return;
  if (direction === 'next') {
    personaPresetPage.value = personaPresetPage.value >= personaPresetTotalPages.value ? 1 : personaPresetPage.value + 1;
  } else {
    personaPresetPage.value = personaPresetPage.value <= 1 ? personaPresetTotalPages.value : personaPresetPage.value - 1;
  }
}

function applyPersonaPreset(preset: PersonaPreset): void {
  personaDraft.value = preset.persona;
  personaModalView.value = 'editor';
}

watch(isPersonaModalOpen, (isOpen) => {
  if (isOpen) {
    personaModalView.value = 'editor';
    personaPresetPage.value = 1;
    personaDraft.value = activePersona.value ?? '';
  }
});

watch(activePersona, (newPersona) => {
  if (isPersonaModalOpen.value) return;
  personaDraft.value = newPersona ?? '';
});

watch(() => activeAgent.value?.id, (newAgentId, oldAgentId) => {
  if (newAgentId === oldAgentId) return;
  personaModalView.value = 'editor';
  personaPresetPage.value = 1;
  personaDraft.value = newAgentId ? chatStore.getPersonaForAgent(newAgentId) ?? '' : '';
});

function openPersonaModal(): void {
  if (!activeAgent.value) {
    toast?.add({ type: 'warning', title: 'No Agent Selected', message: 'Pick an assistant before adjusting personas.' });
    return;
  }
  personaDraft.value = activePersona.value ?? '';
  personaModalView.value = 'editor';
  personaPresetPage.value = 1;
  isPersonaModalOpen.value = true;
}

function closePersonaModal(): void {
  isPersonaModalOpen.value = false;
}

async function savePersonaFromModal(): Promise<void> {
  if (!activeAgent.value) {
    toast?.add({ type: 'warning', title: 'No Agent Selected', message: 'Pick an assistant before adjusting personas.' });
    return;
  }

  const agentId = activeAgent.value.id;
  const conversationId = chatStore.getCurrentConversationId(agentId);
  const trimmedDraft = personaDraft.value.trim();
  const personaToSave = trimmedDraft.length > 0 ? trimmedDraft : null;
  const previousPersona = chatStore.getPersonaForAgent(agentId);

  chatStore.setPersonaForAgent(agentId, personaToSave);
  try {
    const response = await chatAPI.updatePersona({
      agentId,
      conversationId,
      persona: personaToSave,
    });
    chatStore.setPersonaForAgent(agentId, response.data?.persona ?? null);
    isPersonaModalOpen.value = false;
    toast?.add({
      type: 'success',
      title: personaToSave ? 'Persona overlay saved' : 'Persona overlay cleared',
      message: personaToSave
        ? `${activeAgent.value.label} will respond with your custom persona style.`
        : `${activeAgent.value.label} is back to the default persona.`,
    });
  } catch (error: any) {
    chatStore.setPersonaForAgent(agentId, previousPersona ?? null);
    const message = error?.response?.data?.message || 'Could not update the persona overlay. Please try again.';
    toast?.add({ type: 'error', title: 'Persona update failed', message });
  }
}

async function resetPersonaToDefault(): Promise<void> {
  personaDraft.value = '';
  await savePersonaFromModal();
}


const currentAgentViewComponent = computed<VueComponentType | null>(() => {
  const agent = activeAgent.value;
  if (agent && agent.component && typeof agent.component === 'function') {
    const agentLabel = agent.label || 'Current Agent';
    try {
      return defineAsyncComponent(agent.component);
    } catch (e) {
      console.error(`[PrivateHome] Error setting up dynamic import for agent view: ${agentLabel}`, e);
      toast?.add({ type: 'error', title: 'UI Setup Error', message: `Error preparing interface for ${agentLabel}.` });
      return null;
    }
  }
  return null;
});

/**
 * @ref isLoadingResponse
 * @description CRITICAL STATE: True ONLY when an LLM API call is actively being awaited.
 * - Set to true by `standardLlmCallPrivate` before its API call.
 * - Set to true by `handleAgentViewEventFromSlot` if an agent view emits `setProcessingState: true`.
 * - Set to false reliably in `finally` blocks or by `setProcessingState: false` events.
 * This state is passed as `isLlmProcessing` to UnifiedChatLayout, which passes it as `isProcessing` to VoiceInput.
 */
const isLoadingResponse = ref(false);

/**
 * @ref isVoiceInputCurrentlyProcessingAudio
 * @description True when VoiceInput.vue's STT is active. THIS MUST NOT AFFECT `isLoadingResponse`.
 * Updated by the '@voice-input-processing' event from UnifiedChatLayout.
 */
const isVoiceInputCurrentlyProcessingAudio = ref(false);
const agentViewRef = ref<any>(null);

async function loadCurrentAgentSystemPrompt(): Promise<void> {
  const agent = activeAgent.value;
  if (!agent) {
    currentSystemPromptText.value = "No agent is active.";
    return;
  }
  if (agent.capabilities?.handlesOwnInput && currentAgentViewComponent.value) {
    currentSystemPromptText.value = '';
    return;
  }

  const systemPromptKey = agent.systemPromptKey;
  const agentLabel = agent.label || 'Assistant';
  let defaultPromptText = `You are ${agentLabel}. ${agent.description || 'Provide helpful assistance.'}`;

  if (systemPromptKey) {
    try {
      const response = await promptAPI.getPrompt(`${systemPromptKey}.md`);
      currentSystemPromptText.value = (response.data?.content as string) || defaultPromptText;
    } catch (e: any) {
      console.error(`[PrivateHome] Failed to load prompt "${systemPromptKey}.md" for agent "${agentLabel}" (standard call):`, e.response?.data || e.message || e);
      currentSystemPromptText.value = defaultPromptText;
      toast?.add({ type: 'warning', title: 'Prompt Load Failed', message: `Could not load instructions for ${agentLabel}. Using default.`});
    }
  } else {
    currentSystemPromptText.value = defaultPromptText;
  }
}

const mainContentData = computed<MainContent | null>(() => {
  if (!activeAgent.value) {
    return {
      agentId: 'private-dashboard-placeholder' as AgentId, type: 'custom-component',
      data: 'PrivateDashboardPlaceholder', title: 'Welcome Back!', timestamp: Date.now(),
    };
  }
  if (currentAgentViewComponent.value && activeAgent.value?.capabilities?.handlesOwnInput) {
    return null;
  }
  return chatStore.getCurrentMainContentDataForAgent(activeAgent.value.id) || {
    agentId: activeAgent.value.id, type: 'welcome',
    data: `<div class="prose dark:prose-invert max-w-none mx-auto text-center py-8">
             <h2 class="text-3xl font-bold mb-4 text-[var(--color-text-primary)]">${activeAgent.value.label} is Ready</h2>
             <p class="text-lg text-[var(--color-text-secondary)]">${activeAgent.value.description}</p>
             <p class="mt-6 text-base text-[var(--color-text-muted)]">${activeAgent.value.inputPlaceholder || 'Use the input below to start.'}</p>
           </div>`,
    title: `${activeAgent.value.label} Ready`, timestamp: Date.now()
  };
});

const shouldUseDefaultMainContentView = computed(() => {
  return activeAgent.value &&
         (!currentAgentViewComponent.value || !activeAgent.value.capabilities?.handlesOwnInput) &&
         mainContentData.value?.type !== 'custom-component';
});

const showEphemeralLogForCurrentAgent = computed(() => {
  return activeAgent.value?.capabilities?.showEphemeralChatLog ?? true;
});

async function handleTranscriptionFromLayout(transcription: string): Promise<void> {
  if (!transcription.trim()) return;
  if (!activeAgent.value) {
    toast?.add({ type: 'warning', title: 'No Agent Selected', message: 'Please select an agent.' });
    return;
  }

  const currentAgentInstance = activeAgent.value;
  const agentLabel = currentAgentInstance.label || 'Assistant';

  // Log entry point for transcription handling
  debugLog(`[PrivateHome] handleTranscriptionFromLayout for agent: ${agentLabel}. Current isLoadingResponse: ${isLoadingResponse.value}`);

  if (currentAgentInstance.capabilities?.handlesOwnInput && currentAgentViewComponent.value && agentViewRef.value) {
    debugLog(`[PrivateHome] Delegating input to dedicated handler for agent: ${agentLabel}`);
    try {
      if (typeof agentViewRef.value.handleNewUserInput === 'function') {
        // The agent view's handleNewUserInput is responsible for its own isLoadingResponse management
        // and emitting 'setProcessingState'
        await agentViewRef.value.handleNewUserInput(transcription);
      } else if (typeof agentViewRef.value.processProblemContext === 'function') {
        await agentViewRef.value.processProblemContext(transcription);
      } else {
        console.warn(`[PrivateHome] Agent "${agentLabel}" to handle own input, but no handler found. Fallback to standard.`);
        await standardLlmCallPrivate(transcription, currentAgentInstance);
      }
    } catch (error: any) {
      console.error(`[PrivateHome] Error in agent's (${agentLabel}) custom input handler:`, error);
      toast?.add({type: 'error', title: 'Agent Error', message: error.message || `Agent ${agentLabel} failed.`});
      // Agent view is responsible for emitting setProcessingState: false on its own error.
      // If PrivateHome's isLoadingResponse was true because of this agent, the agent *must* signal it's done.
    }
  } else {
    debugLog(`[PrivateHome] Using standard LLM call for agent: ${agentLabel}`);
    await standardLlmCallPrivate(transcription, currentAgentInstance);
  }
  debugLog(`[PrivateHome] handleTranscriptionFromLayout finished for agent ${agentLabel}. Final isLoadingResponse: ${isLoadingResponse.value}`);
}

async function standardLlmCallPrivate(transcriptionText: string, agentInstance: IAgentDefinition) {
  const agentId = agentInstance.id;
  const agentLabel = agentInstance.label || 'Assistant';
  const userMessageTimestamp = Date.now();

  // **CRITICAL: Set isLoadingResponse = true ONLY here for this specific LLM call path**
  if (isLoadingResponse.value) {
      console.warn(`[PrivateHome - standardLlmCallPrivate] Called for ${agentLabel} but isLoadingResponse is already true. This might indicate a problem if not expected.`);
      // Potentially block or queue, but for now, proceed and rely on finally block.
      // This path should ideally not be hit if an agent is already processing.
  }
  debugLog(`[PrivateHome - standardLlmCallPrivate] Initiating LLM call for ${agentLabel}. Setting isLoadingResponse = true.`);
  isLoadingResponse.value = true;

  chatStore.addMessage({ role: 'user', content: transcriptionText, agentId: agentId, timestamp: userMessageTimestamp });
  const streamingPlaceholder = `Consulting ${agentLabel}...`;
  if (agentStore.activeAgentId === agentId) {
      chatStore.setMainContentStreaming(true, streamingPlaceholder);
      chatStore.updateMainContent({ agentId, type: 'loading', data: streamingPlaceholder, title: `Processing with ${agentLabel}...`, timestamp: Date.now() });
  }

  try {
    if (!currentSystemPromptText.value || currentSystemPromptText.value.startsWith(`You are ${agentLabel}`)) {
      await loadCurrentAgentSystemPrompt();
      if (!currentSystemPromptText.value) {
        toast?.add({type: 'error', title: 'System Error', message: `Critical: No system prompt for ${agentLabel}.`});
        throw new Error(`No system prompt for ${agentLabel}.`);
      }
    }
    let finalSystemPrompt = currentSystemPromptText.value.replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage || 'not specified').replace(/{{MODE}}/g, agentId).replace(/{{GENERATE_DIAGRAM}}/g, ((agentInstance.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams) ?? false).toString()).replace(/{{USER_QUERY}}/g, transcriptionText).replace(/{{AGENT_CONTEXT_JSON}}/g, JSON.stringify(agentStore.getAgentContext(agentId) || {})).replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, '');
    const historyConfig: Partial<AdvancedHistoryConfig> = { numRecentMessagesToPrioritize: agentInstance.capabilities?.maxChatHistory || 10, maxContextTokens: voiceSettingsManager.settings.useAdvancedMemory ? 8000 : (agentInstance.capabilities?.maxChatHistory || 10) * 200, };
    const historyForApi: ProcessedHistoryMessageFE[] = await chatStore.getHistoryForApi(agentId, transcriptionText, finalSystemPrompt, historyConfig);
    let messagesForPayload: ChatMessageFE[] = [ { role: 'system', content: finalSystemPrompt, agentId: agentId, timestamp: userMessageTimestamp -10 }, ...historyForApi.map(hMsg => ({ role: hMsg.role, content: hMsg.content, timestamp: hMsg.timestamp, agentId: hMsg.agentId, name: (hMsg as any).name, tool_calls: (hMsg as any).tool_calls, tool_call_id: (hMsg as any).tool_call_id, })) ];
    if (!messagesForPayload.some(m => m.role === 'user' && m.content === transcriptionText && m.timestamp === userMessageTimestamp)) { messagesForPayload.push({ role: 'user', content: transcriptionText, timestamp: userMessageTimestamp, agentId }); }
    const payload: ChatMessagePayloadFE = { messages: messagesForPayload, mode: agentInstance.systemPromptKey || agentId, language: voiceSettingsManager.settings.preferredCodingLanguage, generateDiagram: agentInstance.capabilities?.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams, userId: auth.sessionUserId.value || `authenticated_user_session_${Date.now().toString(36)}`, conversationId: chatStore.getCurrentConversationId(agentId), stream: true, };

    let accumulatedResponse = "";
    await chatAPI.sendMessageStream( payload,
      (chunk: string) => { accumulatedResponse += chunk; if (agentStore.activeAgentId === agentId) { chatStore.updateMainContent({ agentId: agentId, type: agentInstance.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown', data: accumulatedResponse + "â–‹", title: `${agentLabel} Responding...`, timestamp: Date.now() }); } },
      () => { chatStore.setMainContentStreaming(false); if (agentStore.activeAgentId === agentId) { const finalContent = accumulatedResponse.trim(); chatStore.addMessage({ role: 'assistant', content: finalContent, agentId: agentId, model: "StreamedModel (PrivateHome)", timestamp: Date.now() }); chatStore.updateMainContent({ agentId: agentId, type: agentInstance.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown', data: finalContent, title: `${agentLabel} Response`, timestamp: Date.now() }); } },
      (error: Error | any) => { const errorMsg = error.message || "A streaming error occurred."; if (agentStore.activeAgentId === agentId) { chatStore.addMessage({ role: 'error', content: `Stream Error: ${errorMsg}`, agentId, timestamp: Date.now() }); chatStore.updateMainContent({ agentId, type: 'error', data: `### ${agentLabel} Stream Error\n${errorMsg}`, title: `Error with ${agentLabel}`, timestamp: Date.now() }); } chatStore.setMainContentStreaming(false); }
    );
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || "An unexpected error occurred.";
    if (agentStore.activeAgentId === agentId) { chatStore.addMessage({ role: 'error', content: `Interaction Error: ${errorMsg}`, agentId, timestamp: Date.now() }); chatStore.updateMainContent({ agentId, type: 'error', data: `### ${agentLabel} Interaction Error\n${errorMsg}`, title: `Error with ${agentLabel}`, timestamp: Date.now() }); }
    chatStore.setMainContentStreaming(false);
  } finally {
    // **CRITICAL: Reset isLoadingResponse = false here for this specific LLM call path**
    debugLog(`[PrivateHome - standardLlmCallPrivate] LLM call finished for ${agentLabel}. Setting isLoadingResponse = false.`);
    isLoadingResponse.value = false;
    if (chatStore.isMainContentStreaming && agentStore.activeAgentId === agentId) {
        chatStore.setMainContentStreaming(false);
    }
  }
}

const handleAgentViewEventFromSlot = (eventData: any): void => {
  if (!activeAgent.value) return;
  // debugLog(`[PrivateHome] AgentEvent: type='${eventData.type}', agentId='${eventData.agentId}' (active: ${activeAgent.value.id})`);

  if (eventData.agentId && eventData.agentId !== activeAgent.value.id) {
    // console.warn(`[PrivateHome] Ignored stale agent-event from '${eventData.agentId}'.`);
    return;
  }

  switch (eventData.type) {
    case 'updateMainContent': 
      chatStore.updateMainContent({ agentId: activeAgent.value.id, type: eventData.payload.type || (activeAgent.value.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown'), data: eventData.payload.data, title: eventData.payload.title || `${activeAgent.value.label} Update`, timestamp: Date.now(), });
      // DO NOT set isLoadingResponse here based on updateMainContent's payload.
      // Only 'setProcessingState' should control this from agent views.
      break;
    case 'addChatMessage': 
      chatStore.addMessage({ agentId: activeAgent.value.id, timestamp: Date.now(), role: eventData.payload.role || 'assistant', content: eventData.payload.content, ...(eventData.payload.extra || {}) });
      break;
    case 'setProcessingState':
      // This is the SOLE event from agent views that should control PrivateHome's isLoadingResponse.
      const newProcessingState = !!eventData.payload.isProcessing;
      if (isLoadingResponse.value !== newProcessingState) {
        debugLog(`[PrivateHome] Event 'setProcessingState' from agent view ${activeAgent.value.label}: payload.isProcessing = ${newProcessingState}. Updating PrivateHome.isLoadingResponse from ${isLoadingResponse.value} to ${newProcessingState}.`);
        isLoadingResponse.value = newProcessingState;
      } else {
        // debugLog(`[PrivateHome] Event 'setProcessingState' from agent view ${activeAgent.value.label}: payload.isProcessing = ${newProcessingState}. PrivateHome.isLoadingResponse already ${isLoadingResponse.value}. No change.`);
      }
      if (!newProcessingState && chatStore.isMainContentStreaming) {
        chatStore.setMainContentStreaming(false);
      }
      break;
    case 'requestGlobalAction': 
      if (eventData.action === 'navigateTo' && eventData.payload?.route) { router.push(eventData.payload.route); } 
      break;
    case 'view_mounted': 
      if (agentViewRef.value && typeof agentViewRef.value.onParentAcknowledgedMount === 'function') { agentViewRef.value.onParentAcknowledgedMount(); } 
      break;
    default: 
      console.warn(`[PrivateHome] Unhandled agent-event type: ${eventData.type}`);
  }
};

onMounted(async () => {
  debugLog("[PrivateHome] Mounted. Initial isLoadingResponse:", isLoadingResponse.value);
  if (!auth.isAuthenticated.value) {
    router.replace({ name: 'Login', query: { sessionExpired: 'true', reason: 'unauthenticated_access_pro_mount' }});
    return;
  }
  if (!agentStore.activeAgentId || !agentService.getAgentById(agentStore.activeAgentId)) {
    const defaultPrivateAgent = agentService.getDefaultAgent();
    if (defaultPrivateAgent) {
      await agentStore.setActiveAgent(defaultPrivateAgent.id);
    } else {
      console.error("[PrivateHome] CRITICAL: No default private agent.");
      chatStore.updateMainContent({ agentId: 'system-error' as AgentId, type: 'error', data: "### System Error\nNo default assistant.", title: "Init Error", timestamp: Date.now() });
      isLoadingResponse.value = false; return;
    }
  }
  if (activeAgent.value) {
    await loadCurrentAgentSystemPrompt();
    chatStore.ensureMainContentForAgent(activeAgent.value.id);
  }
  // Explicitly ensure isLoadingResponse is false after initial setup, unless an agent immediately signals processing.
  // This handles cases where it might have been true from a previous state if the component was kept-alive.
  if (isLoadingResponse.value && !activeAgent.value?.capabilities?.handlesOwnInput) {
      debugLog("[PrivateHome] onMounted: isLoadingResponse was true, but current agent does not handle own input. Resetting to false.");
      isLoadingResponse.value = false;
  } else if (isLoadingResponse.value && activeAgent.value?.capabilities?.handlesOwnInput) {
      debugLog("[PrivateHome] onMounted: isLoadingResponse is true, and agent handles own input. Agent view is responsible for this state.");
  } else {
      isLoadingResponse.value = false; // Default ensure it's false.
  }
  debugLog("[PrivateHome] onMounted finished. Final isLoadingResponse:", isLoadingResponse.value);
});

watch(() => agentStore.activeAgentId, async (newAgentId, oldAgentId) => {
  debugLog(`[PrivateHome] activeAgentId changed from ${oldAgentId || 'N/A'} to ${newAgentId || 'N/A'}. Current isLoadingResponse: ${isLoadingResponse.value}`);
  if (newAgentId && newAgentId !== oldAgentId) {
    // Reset LLM loading state when agent changes, unless the new agent immediately sets it via event.
    // Standard agents won't emit 'setProcessingState' immediately, so this reset is safe for them.
    // Agents handling own input might emit quickly, and handleAgentViewEventFromSlot will update.
    if (isLoadingResponse.value) {
        debugLog(`[PrivateHome] Agent changed. Resetting isLoadingResponse from true to false.`);
        isLoadingResponse.value = false;
    }
    isVoiceInputCurrentlyProcessingAudio.value = false;
    if(chatStore.isMainContentStreaming) chatStore.setMainContentStreaming(false);
    await loadCurrentAgentSystemPrompt();
    chatStore.ensureMainContentForAgent(newAgentId);
  } else if (!newAgentId && oldAgentId !== null) {
    chatStore.updateMainContent({ agentId: 'private-dashboard-placeholder' as AgentId, type: 'custom-component', data: 'PrivateDashboardPlaceholder', title: 'Welcome Back!', timestamp: Date.now(), });
    currentSystemPromptText.value = '';
    if (isLoadingResponse.value) {
        debugLog(`[PrivateHome] Agent cleared. Resetting isLoadingResponse from true to false.`);
        isLoadingResponse.value = false;
    }
  } else if (newAgentId && newAgentId === oldAgentId) { // Agent re-selected or initial load
    const agent = agentService.getAgentById(newAgentId);
    if (agent && (!currentAgentViewComponent.value || !agent.capabilities?.handlesOwnInput)) {
      await loadCurrentAgentSystemPrompt();
    }
    chatStore.ensureMainContentForAgent(newAgentId);
    // Do not change isLoadingResponse here; it should persist if already true for this agent.
  }
  debugLog(`[PrivateHome] Watch activeAgentId finished for ${newAgentId}. Final isLoadingResponse: ${isLoadingResponse.value}`);
}, { immediate: true });

// Watch for STT activity changes. THIS IS FOR LOGGING/DEBUGGING ONLY.
// IT MUST NOT CHANGE isLoadingResponse.
watch(isVoiceInputCurrentlyProcessingAudio, (isSttActive) => {
    debugLog(`[PrivateHome - DEBUG] isVoiceInputCurrentlyProcessingAudio (STT active) changed to: ${isSttActive}. Current isLoadingResponse (LLM active): ${isLoadingResponse.value}`);
    // NO CHANGE TO isLoadingResponse.value HERE
});

</script>
<template>
  <div class="private-home-view-ephemeral">
    <UnifiedChatLayout
      :is-llm-processing="isLoadingResponse"
      :is-voice-input-processing="isVoiceInputCurrentlyProcessingAudio"
      :current-agent-input-placeholder="activeAgent?.inputPlaceholder || 'Type your message or use voice...'"
      :show-ephemeral-log="showEphemeralLogForCurrentAgent"
      @transcription="handleTranscriptionFromLayout"
      @voice-input-processing="(status: boolean) => { isVoiceInputCurrentlyProcessingAudio = status; }"
    >
      <template #main-content>
        <component
            :is="currentAgentViewComponent"
            v-if="activeAgent && currentAgentViewComponent && typeof currentAgentViewComponent !== 'string' && activeAgent.capabilities?.handlesOwnInput"
            :key="activeAgent.id + '-dedicated-ui'"
            ref="agentViewRef"
            :agent-id="activeAgent.id"
            :agent-config="activeAgent"
            @agent-event="handleAgentViewEventFromSlot"
            class="dedicated-agent-view"
          />

        <MainContentView
            :agent="activeAgent"
            class="main-content-view-wrapper-ephemeral default-agent-mcv"
            :class="{'has-framed-content': shouldUseDefaultMainContentView}"
            v-else-if="activeAgent && mainContentData"
        >
          <div v-if="mainContentData.type === 'custom-component' && mainContentData.data === 'PrivateDashboardPlaceholder'"
               class="private-dashboard-placeholder-ephemeral">
            <ShieldCheckIcon class="dashboard-icon-ephemeral" />
            <h2 class="dashboard-title-ephemeral">Secure AI Workspace</h2>
            <p class="dashboard-subtitle-ephemeral">
              Welcome back!
              Select an assistant from the header menu to begin, or manage your preferences.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 mt-8">
              <button @click="router.push('/settings')" class="btn btn-secondary-ephemeral btn-lg-ephemeral">
                  <CogIcon class="icon-sm"/> Configure Agents & Settings
              </button>
            </div>
          </div>
          <div v-else class="content-renderer-container-ephemeral">
            <CompactMessageRenderer
              v-if="activeAgent?.capabilities?.usesCompactRenderer && (mainContentData.type === 'compact-message-renderer-data' || (mainContentData.type === 'markdown' && !chatStore.isMainContentStreaming))"
              :content="mainContentData.data"
              :mode="activeAgent.id"
              class="content-renderer-ephemeral"
            />
            <div v-else-if="mainContentData.type === 'markdown' || mainContentData.type === 'welcome'"
                 class="prose-ephemeral content-renderer-ephemeral"
                 v-html="chatStore.isMainContentStreaming && chatStore.getCurrentMainContentDataForAgent(activeAgent.id)?.agentId === activeAgent.id && chatStore.getCurrentMainContentDataForAgent(activeAgent.id)?.type === 'markdown' ?
                           chatStore.streamingMainContentText + '<span class=\'streaming-cursor-ephemeral\'>â–‹</span>' :
                           mainContentData.data"
                 aria-atomic="true">
            </div>
             <div v-else-if="mainContentData.type === 'error'"
                 class="prose-ephemeral prose-error content-renderer-ephemeral"
                 v-html="mainContentData.data"
                 aria-atomic="true">
            </div>
            <div v-else-if="mainContentData.type === 'loading'"
                 class="loading-placeholder-ephemeral content-renderer-ephemeral">
              <div class="loading-animation-content">
                  <div class="loading-spinner-ephemeral !w-10 !h-10"><div v-for="i in 8" :key="`blade-${i}-loading`" class="spinner-blade-ephemeral !w-1 !h-3.5"></div></div>
                  <p class="loading-text-ephemeral !text-base mt-2.5" v-html="mainContentData.data + (chatStore.isMainContentStreaming ? '<span class=\'streaming-cursor-ephemeral\'>â–‹</span>' : '')"></p>
              </div>
            </div>
            <div v-else class="content-renderer-ephemeral text-[var(--color-text-muted)] italic p-6 text-center">
                <UserGroupIcon class="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p class="text-lg">Ready to assist with {{ activeAgent.label }}.</p>
                <p class="text-sm mt-2">(Content type: {{ mainContentData.type }})</p>
            </div>
          </div>
        </MainContentView>
        <div v-else class="loading-placeholder-ephemeral">
            <div class="loading-animation-content">
                <div class="loading-spinner-ephemeral !w-16 !h-16"><div v-for="i in 8" :key="`blade-${i}-init`" class="spinner-blade-ephemeral !w-2 !h-5"></div></div>
                <p class="loading-text-ephemeral !text-lg mt-4">Initializing Workspace...</p>
            </div>
        </div>
      </template>
      <template #voice-toolbar>
        <div v-if="activeAgent" class="persona-voice-toolbar">
          <button
            type="button"
            class="persona-voice-toolbar__button"
            :title="personaTooltipText"
            @click="openPersonaModal"
          >
            {{ personaButtonLabel }}
          </button>
          <span
            v-if="personaHasCustom && personaSummaryText"
            class="persona-voice-toolbar__summary"
            :title="personaSummaryText"
          >
            {{ personaSummaryText }}
          </span>
          <button
            v-if="personaHasCustom"
            type="button"
            class="persona-voice-toolbar__clear"
            @click="resetPersonaToDefault"
          >
            Clear
          </button>
        </div>
      </template>
    </UnifiedChatLayout>

    <transition name="fade">
      <div v-if="isPersonaModalOpen" class="persona-modal" role="dialog" aria-modal="true">
        <div class="persona-modal__backdrop" @click="closePersonaModal"></div>
        <div class="persona-modal__content">
          <div class="persona-modal__header">
            <h3>Adjust Persona Overlay</h3>
            <button class="persona-modal__close" type="button" @click="closePersonaModal">
              <XMarkIcon class="persona-modal__close-icon" />
            </button>
          </div>

          <p class="persona-modal__note">Persona overlays tweak tone and personality only; the agent's role and capabilities never change.</p>

          <div class="persona-modal__switcher" role="tablist" aria-label="Tone editor mode">
            <button
              type="button"
              class="persona-modal__tab"
              :class="{ 'persona-modal__tab--active': personaModalView === 'editor' }"
              @click="personaModalView = 'editor'"
            >
              Persona Editor
            </button>
            <button
              type="button"
              class="persona-modal__tab"
              :class="{ 'persona-modal__tab--active': personaModalView === 'library' }"
              @click="personaModalView = 'library'"
            >
              Persona Presets
            </button>
          </div>

          <div v-if="personaModalView === 'editor'" class="persona-modal__editor">
            <p class="persona-modal__hint">Describe the persona tone or emphasis you want layered on top of this agent's role.</p>
            <textarea
              v-model="personaDraft"
              class="persona-modal__textarea"
              rows="6"
              placeholder="e.g. Calm, concise explanations with short follow-up questions."
            ></textarea>
          </div>
          <div v-else class="persona-library">
            <p class="persona-library__intro">Pick a persona preset to populate the editor instantly.</p>
            <div class="persona-library__grid">
              <article
                v-for="preset in personaPresetsForCurrentPage"
                :key="preset.id"
                class="persona-preset-card"
                :class="{ 'persona-preset-card--active': isPersonaPresetActive(preset) }"
              >
                <header class="persona-preset-card__header">
                  <span class="persona-preset-card__title">{{ preset.label }}</span>
                  <span v-if="isPersonaPresetActive(preset)" class="persona-preset-card__status">In draft</span>
                </header>
                <p class="persona-preset-card__summary">{{ preset.summary }}</p>
                <button type="button" class="persona-preset-card__apply" @click="applyPersonaPreset(preset)">
                  {{ isPersonaPresetActive(preset) ? 'Edit this persona' : 'Apply persona' }}
                </button>
              </article>
            </div>
            <div v-if="personaPresetTotalPages > 1" class="persona-library__pagination">
              <button type="button" class="persona-library__page-btn" @click="goToPersonaPresetPage('prev')">Previous</button>
              <span class="persona-library__page-indicator">{{ personaPresetPage }} / {{ personaPresetTotalPages }}</span>
              <button type="button" class="persona-library__page-btn" @click="goToPersonaPresetPage('next')">Next</button>
            </div>
          </div>

          <div class="persona-modal__actions">
            <button
              type="button"
              class="persona-modal__button persona-modal__button--ghost"
              :disabled="!personaHasCustom"
              @click="resetPersonaToDefault"
            >
              Use default persona
            </button>
            <div class="persona-modal__actions-right">
              <button type="button" class="persona-modal__button" @click="closePersonaModal">Cancel</button>
              <button
                type="button"
                class="persona-modal__button persona-modal__button--primary"
                :disabled="personaModalView === 'editor' && !personaDraftHasContent"
                @click="savePersonaFromModal"
              >
                Save Persona
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss">
/* Persona overlay controls */
.dedicated-agent-view { height: 100%; width: 100%; overflow: auto; }
.default-agent-mcv { height: 100%; width: 100%; display: flex; flex-direction: column; }
.content-renderer-container-ephemeral { flex-grow: 1; overflow-y: auto; padding: 1rem; }
.has-framed-content .content-renderer-container-ephemeral{}
.private-dashboard-placeholder-ephemeral { @apply flex flex-col items-center justify-center h-full text-center p-8; .dashboard-icon-ephemeral { @apply w-20 h-20 mb-6 text-[var(--color-accent-primary)]; filter: drop-shadow(0 4px 10px hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.3)); } .dashboard-title-ephemeral { @apply text-4xl font-bold text-[var(--color-text-primary)] mb-3; } .dashboard-subtitle-ephemeral { @apply text-lg text-[var(--color-text-secondary)] max-w-lg; } }
.loading-placeholder-ephemeral { @apply flex-grow flex items-center justify-center h-full p-4 text-center; .loading-animation-content { @apply flex flex-col items-center; } }
.prose-ephemeral {}
.streaming-cursor-ephemeral { animation: blink 1s step-end infinite; font-weight: bold; color: hsl(var(--color-text-accent-h), var(--color-text-accent-s), var(--color-text-accent-l)); }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }



.persona-voice-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-end;
  padding: 0 0 12px;
}

.persona-voice-toolbar__button {
  border: 1px solid hsla(var(--color-border-glass-h), var(--color-border-glass-s), var(--color-border-glass-l), 0.35);
  background: hsla(var(--color-bg-secondary-h), var(--color-bg-secondary-s), var(--color-bg-secondary-l), 0.65);
  color: var(--color-text-secondary);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.persona-voice-toolbar__button:hover {
  background: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.25);
  border-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.45);
  color: var(--color-text-primary);
}

.persona-voice-toolbar__summary {
  color: var(--color-text-muted);
  font-size: 0.76rem;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.persona-voice-toolbar__clear {
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 0.75rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.persona-voice-toolbar__clear:hover {
  color: var(--color-text-primary);
}

.persona-modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
  z-index: 70;
}

.persona-modal__backdrop {
  position: absolute;
  inset: 0;
  background: hsla(var(--color-bg-backdrop-h, 220), var(--color-bg-backdrop-s, 26%), var(--color-bg-backdrop-l, 5%), 0.55);
  backdrop-filter: blur(6px);
}

.persona-modal__content {
  position: relative;
  width: min(560px, 100%);
  max-height: min(85vh, 640px);
  background: hsla(var(--color-bg-primary-h), var(--color-bg-primary-s), var(--color-bg-primary-l), 0.96);
  border: 1px solid hsla(var(--color-border-secondary-h), var(--color-border-secondary-s), var(--color-border-secondary-l), 0.25);
  border-radius: 18px;
  box-shadow: 0 20px 45px hsla(var(--color-shadow-h), var(--color-shadow-s), var(--color-shadow-l), 0.28);
  padding: 1.75rem 1.75rem 1.5rem;
  overflow: hidden auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.persona-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.persona-modal__header h3 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.persona-modal__close {
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  padding: 0.4rem;
  border-radius: 999px;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease;
}

.persona-modal__close:hover {
  color: var(--color-text-primary);
  background: hsla(var(--color-border-glass-h), var(--color-border-glass-s), var(--color-border-glass-l), 0.25);
}

.persona-modal__close-icon {
  width: 1.15rem;
  height: 1.15rem;
}

.persona-modal__switcher {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem;
  border-radius: 999px;
  background: hsla(var(--color-bg-secondary-h), var(--color-bg-secondary-s), var(--color-bg-secondary-l), 0.6);
}

.persona-modal__tab {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.persona-modal__tab--active {
  background: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.22);
  color: var(--color-text-primary);
}

.persona-modal__editor {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.persona-modal__hint {
  margin: 0;
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

.persona-modal__textarea {
  width: 100%;
  resize: vertical;
  min-height: 130px;
  border-radius: 12px;
  border: 1px solid hsla(var(--color-border-secondary-h), var(--color-border-secondary-s), var(--color-border-secondary-l), 0.35);
  padding: 0.85rem 1rem;
  font-size: 0.88rem;
  color: var(--color-text-primary);
  background: hsla(var(--color-bg-secondary-h), var(--color-bg-secondary-s), var(--color-bg-secondary-l), 0.55);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.persona-modal__textarea:focus {
  outline: none;
  border-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.6);
  box-shadow: 0 0 0 3px hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.25);
}

.persona-library {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.persona-library__intro {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.persona-library__grid {
  display: grid;
  gap: 0.9rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.persona-preset-card {
  border: 1px solid hsla(var(--color-border-secondary-h), var(--color-border-secondary-s), var(--color-border-secondary-l), 0.3);
  border-radius: 16px;
  padding: 1rem;
  background: hsla(var(--color-bg-secondary-h), var(--color-bg-secondary-s), var(--color-bg-secondary-l), 0.6);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.persona-preset-card:hover {
  transform: translateY(-2px);
  border-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.45);
}

.persona-preset-card--active {
  border-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.65);
  box-shadow: 0 0 0 2px hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.22);
}

.persona-preset-card__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
}

.persona-preset-card__title {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.persona-preset-card__status {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-accent-interactive);
}

.persona-preset-card__summary {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.persona-preset-card__apply {
  align-self: flex-start;
  border: none;
  background: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.2);
  color: var(--color-text-primary);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.persona-preset-card__apply:hover {
  background: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.32);
}

.persona-library__pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

.persona-library__page-btn {
  border: 1px solid hsla(var(--color-border-secondary-h), var(--color-border-secondary-s), var(--color-border-secondary-l), 0.35);
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 0.75rem;
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.persona-library__page-btn:hover {
  border-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.45);
  color: var(--color-text-primary);
}

.persona-library__page-indicator {
  min-width: 3.5rem;
  text-align: center;
}

.persona-modal__actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.persona-modal__button {
  border: 1px solid hsla(var(--color-border-secondary-h), var(--color-border-secondary-s), var(--color-border-secondary-l), 0.35);
  background: hsla(var(--color-bg-secondary-h), var(--color-bg-secondary-s), var(--color-bg-secondary-l), 0.55);
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.55rem 1.15rem;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.persona-modal__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.persona-modal__button--ghost {
  background: transparent;
}

.persona-modal__button--ghost:hover:not(:disabled) {
  color: var(--color-text-primary);
  border-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.4);
}

.persona-modal__button--primary {
  background: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.8);
  color: var(--color-text-on-accent, #0c1116);
  border: none;
}

.persona-modal__button--primary:hover:not(:disabled) {
  background: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 1);
  color: var(--color-text-primary);
}

.persona-modal__actions-right {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.persona-modal__note {
  margin: 0 0 8px;
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

.persona-modal__content::-webkit-scrollbar {
  width: 6px;
}

.persona-modal__content::-webkit-scrollbar-thumb {
  background: hsla(var(--color-border-secondary-h), var(--color-border-secondary-s), var(--color-border-secondary-l), 0.4);
  border-radius: 999px;
}

.persona-modal__content::-webkit-scrollbar-track {
  background: transparent;
}

@media (max-width: 600px) {
  .persona-modal {
    padding: 1.5rem 0.75rem;
    align-items: flex-end;
  }

  .persona-modal__content {
    width: 100%;
    border-radius: 16px 16px 0 0;
    max-height: 90vh;
  }

  .persona-modal__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .persona-modal__actions-right {
    width: 100%;
    justify-content: space-between;
  }
}

</style>











