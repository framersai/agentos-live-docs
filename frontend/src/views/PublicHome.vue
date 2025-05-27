// File: frontend/src/views/PublicHome.vue
/**
 * @file PublicHome.vue
 * @description Public-facing home page with rate-limited access to selected AI agents.
 * Uses Vite's import.meta.glob for robust dynamic loading of prompt files.
 * Style updated for a visually stunning, elegant, minimal, analog holographic, and futuristic retro theme.
 * @version 1.3.0
 * @author Voice Coding Assistant Team
 *
 * @notes
 * - v1.3.0: Major style overhaul for new theme. Replaced default Tailwind colors with theme variables.
 * Leverages global styles from main.css for buttons and other components.
 * - v1.2.5: Switched to import.meta.glob for loading prompts to improve Vite compatibility.
 * Ensured correct relative path for prompts.
 */

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject, watch, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import {
  api,
  chatAPI,
  type ChatMessagePayloadFE,
  type ProcessedHistoryMessageFE,
  type ChatMessageFE,
  type ChatResponseDataFE,
  type TextResponseDataFE,
  type FunctionCallResponseDataFE,
} from '@/utils/api';
import { agentService, type IAgentDefinition, type AgentId } from '@/services/agent.service';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore, type ChatMessage as StoreChatMessage, type MainContent } from '@/store/chat.store';
import { voiceSettingsManager, type AudioInputMode } from '@/services/voice.settings.service';
import type { ToastService } from '@/services/services';

// Import UI Components
import VoiceInput from '@/components/VoiceInput.vue';
import Footer from '@/components/Footer.vue';
import AnimatedLogo from '@/components/ui/AnimatedLogo.vue';
import MainContentView from '@/components/agents/common/MainContentView.vue';
import AgentChatLog from '@/components/agents/common/AgentChatLog.vue';
import CompactMessageRenderer from '@/components/CompactMessageRenderer.vue';

import {
  SparklesIcon,
  KeyIcon,
  ChevronDownIcon,
  InformationCircleIcon, // For rate limit info
} from '@heroicons/vue/24/outline';
import { Cog6ToothIcon as Cog6ToothIconSolid } from '@heroicons/vue/24/solid'; // Example for a filled icon if needed

// --- Dynamic Prompt Loading using import.meta.glob ---
const promptModules: Record<string, string> = import.meta.glob('../../../../prompts/*.md', { as: 'raw', eager: true });

/**
 * @interface RateLimitInfo
 * @description Defines the structure for public user rate limit information.
 */
interface RateLimitInfo {
  tier: 'public' | 'authenticated';
  ip?: string;
  used?: number;
  limit?: number;
  remaining?: number;
  resetAt?: string | Date;
  message?: string;
}

const router = useRouter();
const toast = inject<ToastService>('toast');
const agentStore = useAgentStore();
const chatStore = useChatStore();

const availablePublicAgents = shallowRef<IAgentDefinition[]>([]);
const currentPublicAgent = ref<IAgentDefinition | null>(null);
const showPublicAgentSelector = ref(false);
const publicAgentSelectorDropdownRef = ref<HTMLElement | null>(null);

const isLoadingResponse = ref(false);
const isVoiceInputProcessing = ref(false); // This will drive voice input UI state
const currentSystemPrompt = ref('');
const rateLimitInfo = ref<RateLimitInfo | null>(null);

const mainContentToDisplay = computed<MainContent | null>(() => {
  if (!currentPublicAgent.value) return null;
  return chatStore.getMainContentForAgent(currentPublicAgent.value.id);
});

const fetchRateLimitInfo = async (): Promise<void> => {
  try {
    const response = await api.get('/api/rate-limit/status');
    if (response.data.tier === 'authenticated') {
      router.push({ name: 'PrivateHome' }); // Redirect to PrivateHome if authenticated
      return;
    }
    rateLimitInfo.value = {
      ...response.data,
      resetAt: response.data.resetAt ? new Date(response.data.resetAt) : new Date(Date.now() + 24 * 60 * 60 * 1000)
    };
  } catch (error: any) {
    console.error('PublicHome: Failed to fetch rate limit info:', error.response?.data || error.message);
    toast?.add({ type: 'error', title: 'Network Error', message: 'Could not fetch usage details. Please try refreshing.' });
  }
};

const loadPublicAgents = (): void => {
  const allPublic = agentService.getPublicAgents();
  availablePublicAgents.value = allPublic.filter(agent =>
    agent.id !== 'codingAssistant' && agent.id !== 'codingInterviewer'
  );
  if (availablePublicAgents.value.length > 0) {
    const defaultPublicAgent = availablePublicAgents.value.find(a => a.id === 'general') || availablePublicAgents.value[0];
    currentPublicAgent.value = defaultPublicAgent;
    if (agentStore.activeAgentId !== defaultPublicAgent.id) {
        agentStore.setActiveAgent(defaultPublicAgent.id);
    }
    chatStore.ensureMainContentForAgent(defaultPublicAgent.id);
  } else {
    console.warn("PublicHome: No publicly available agents configured (excluding coding/interview agents).");
    currentPublicAgent.value = null;
      chatStore.updateMainContent({
        agentId: 'system-notice' as AgentId,
        type: 'markdown',
        data: `### No Public Agents Available\n\nWe're sorry, but there are currently no public agents available for preview. Please check back later or log in for full access.`,
        title: `Agents Unavailable`,
        timestamp: Date.now(),
    });
  }
};

const selectPublicAgent = (agentId: AgentId): void => {
  const agent = availablePublicAgents.value.find(a => a.id === agentId);
  if (agent && currentPublicAgent.value?.id !== agentId) {
    currentPublicAgent.value = agent;
    agentStore.setActiveAgent(agentId);
    showPublicAgentSelector.value = false;
    chatStore.clearAgentData(agentId); // Clear previous agent's transient data
    chatStore.ensureMainContentForAgent(agentId); // Setup welcome/default content
    toast?.add({ type: 'info', title: 'Assistant Changed', message: `Now chatting with ${agent.label}.`, duration: 2000 });
  } else if (agent && currentPublicAgent.value?.id === agentId) {
    showPublicAgentSelector.value = false;
  }
};

const loadAgentSystemPrompt = (): void => {
  if (currentPublicAgent.value?.systemPromptKey) {
    const promptFileName = `${currentPublicAgent.value.systemPromptKey}.md`;
    const globKey = `../../../../prompts/${promptFileName}`;
    if (promptModules[globKey]) {
      currentSystemPrompt.value = promptModules[globKey];
    } else {
      console.error(`[PublicHome] Prompt not found in glob for key: ${globKey}. Available keys:`, Object.keys(promptModules));
      currentSystemPrompt.value = "You are a helpful AI assistant for public users. Keep responses brief and friendly.";
    }
  } else {
    currentSystemPrompt.value = "You are a helpful AI assistant for public users. Keep responses brief and friendly.";
  }
};

watch(currentPublicAgent, loadAgentSystemPrompt, { immediate: true });

const onTranscriptionReceived = async (transcription: string): Promise<void> => {
  if (!transcription.trim() || isLoadingResponse.value || !currentPublicAgent.value) return;

  if (rateLimitInfo.value && rateLimitInfo.value.tier === 'public' && rateLimitInfo.value.remaining !== undefined && rateLimitInfo.value.remaining <= 0) {
    toast?.add({ type: 'error', title: 'Daily Limit Reached', message: 'Please try again tomorrow or log in for unlimited access.'});
    return;
  }

  const agentId = currentPublicAgent.value.id;
  const userMessageForStore: Omit<StoreChatMessage, 'id' | 'timestamp'> = {
    role: 'user', content: transcription, agentId: agentId,
  };
  const userMessageInStore = chatStore.addMessage(userMessageForStore);

  isLoadingResponse.value = true;
  chatStore.setMainContentStreaming(true, `Processing your request for "${transcription.substring(0, 30)}..."`);

  try {
    const historyFromStore: ProcessedHistoryMessageFE[] = await chatStore.getHistoryForApi(
      agentId, transcription, currentSystemPrompt.value,
      {
        maxContextTokens: voiceSettingsManager.settings.useAdvancedMemory ? 2000 : (currentPublicAgent.value.capabilities?.maxChatHistory || 5) * 150,
        numRecentMessagesToPrioritize: currentPublicAgent.value.capabilities?.maxChatHistory || 5,
      }
    );

    const messagesForApiPayload: ChatMessageFE[] = historyFromStore.map(hMsg => ({
        role: hMsg.role, content: hMsg.content, timestamp: hMsg.timestamp,
        tool_call_id: hMsg.tool_call_id, tool_calls: hMsg.tool_calls, name: hMsg.name,
    }));

    const isCurrentUserMessageInPayload = messagesForApiPayload.some(
        msg => msg.role === 'user' && msg.content === transcription && msg.timestamp === userMessageInStore.timestamp
    );
    if (!isCurrentUserMessageInPayload) {
        messagesForApiPayload.push({
            role: 'user',
            content: transcription,
            timestamp: userMessageInStore.timestamp,
        });
    }
    messagesForApiPayload.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    let finalSystemPrompt = currentSystemPrompt.value
        .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage)
        .replace(/{{MODE}}/g, currentPublicAgent.value.id)
        .replace(/{{GENERATE_DIAGRAM}}/g, (currentPublicAgent.value.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams).toString())
        .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, 'Your public persona is helpful but slightly more concise. You cannot assist with detailed coding interview preparations.');

    const payload: ChatMessagePayloadFE = {
      messages: [
        { role: 'system', content: finalSystemPrompt },
        ...messagesForApiPayload
      ],
      mode: currentPublicAgent.value.systemPromptKey,
      language: voiceSettingsManager.settings.preferredCodingLanguage,
      generateDiagram: currentPublicAgent.value.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams,
      userId: rateLimitInfo.value?.ip || `public_user_${Date.now().toString(36)}`,
      conversationId: chatStore.getCurrentConversationId(agentId),
    };

    const response = await chatAPI.sendMessage(payload);
    const responseData = response.data as ChatResponseDataFE;

    let assistantMessageContent: string | null = "I'm not sure how to respond to that right now.";
    let toolCallsForStore: StoreChatMessage['tool_calls'] | undefined = undefined;

    if (responseData.type === 'function_call_data') {
        const funcCallData = responseData as FunctionCallResponseDataFE;
        assistantMessageContent = funcCallData.assistantMessageText || `Okay, I need to use the ${funcCallData.toolName} tool.`;
        toolCallsForStore = [{
            id: funcCallData.toolCallId, type: 'function',
            function: { name: funcCallData.toolName, arguments: JSON.stringify(funcCallData.toolArguments) }
        }];
        toast?.add({type: 'info', title: 'Tool Call Requested', message: `Assistant wants to use ${funcCallData.toolName}. Public preview does not execute tools.`});
    } else {
        const textData = responseData as TextResponseDataFE;
        assistantMessageContent = textData.content;
    }

    chatStore.addMessage({
      role: 'assistant', content: assistantMessageContent, agentId: agentId,
      model: responseData.model, usage: responseData.usage, tool_calls: toolCallsForStore,
    });

    chatStore.updateMainContent({
        agentId: agentId,
        type: currentPublicAgent.value.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
        data: assistantMessageContent, title: `Response`, timestamp: Date.now()
    });

    await fetchRateLimitInfo();

  } catch (error: any) {
    console.error('PublicHome: Chat API error:', error.response?.data || error.message);
    const errorMsg = error.response?.data?.message || error.message || 'An error occurred processing your request.';
    chatStore.addMessage({
      role: 'assistant', content: `Sorry, an error occurred: ${errorMsg}`,
      agentId: agentId, isError: true,
    });
    chatStore.updateMainContent({
        agentId: agentId, type: 'markdown', data: `### Error\n${errorMsg}`,
        title: `Error Processing Request`, timestamp: Date.now()
    });
    if (error.response?.status === 429) await fetchRateLimitInfo();
  } finally {
    isLoadingResponse.value = false;
    chatStore.setMainContentStreaming(false);
  }
};

const formatResetTime = (dateValue?: string | Date): string => {
  if (!dateValue) return 'in the next 24 hours';
  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
  if (isNaN(date.getTime())) return 'soon';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const handleClickOutsidePublicAgentSelector = (event: MouseEvent): void => {
  if (publicAgentSelectorDropdownRef.value && !publicAgentSelectorDropdownRef.value.contains(event.target as Node)) {
    showPublicAgentSelector.value = false;
  }
};

let rateLimitInterval: number | undefined;

onMounted(async () => {
  await fetchRateLimitInfo();
  loadPublicAgents();
  document.addEventListener('click', handleClickOutsidePublicAgentSelector, true);
  rateLimitInterval = window.setInterval(fetchRateLimitInfo, 60000); // Check rate limit every minute
});

onUnmounted(() => {
  if (rateLimitInterval) clearInterval(rateLimitInterval);
  document.removeEventListener('click', handleClickOutsidePublicAgentSelector, true);
});
</script>

<template>
  <div class="public-home-container min-h-screen flex flex-col bg-neutral-bg text-neutral-text">
    

    <div class="flex-grow flex flex-col overflow-hidden">
        <div v-if="currentPublicAgent" class="flex-grow flex flex-col lg:flex-row agent-content-layout-public overflow-hidden">
            <div v-if="availablePublicAgents.length > 1" class="p-3 border-b lg:border-b-0 lg:border-r border-neutral-border public-agent-selector-area">
                <div class="relative">
                    <button @click="showPublicAgentSelector = !showPublicAgentSelector" class="btn btn-secondary btn-sm w-full flex items-center justify-between gap-1.5" aria-haspopup="true" :aria-expanded="showPublicAgentSelector.toString()">
                        <div class="flex items-center gap-2">
                            <component :is="currentPublicAgent.icon || SparklesIcon" class="icon-sm" :class="currentPublicAgent.iconClass || 'text-primary-500'" aria-hidden="true" />
                            <span>{{ currentPublicAgent.label }}</span>
                        </div>
                        <ChevronDownIcon class="icon-sm transition-transform duration-200" :class="{'rotate-180': showPublicAgentSelector}" aria-hidden="true" />
                    </button>
                    <transition name="dropdown-fade">
                        <div v-if="showPublicAgentSelector" class="dropdown-menu-public absolute top-full left-0 mt-1 w-full origin-top-right z-50 glass-pane rounded-[var(--radius-md)] shadow-holo-lg" ref="publicAgentSelectorDropdownRef" role="menu">
                            <div class="p-1 space-y-1">
                                <button
                                v-for="agentDef in availablePublicAgents" :key="agentDef.id"
                                @click="selectPublicAgent(agentDef.id)"
                                class="dropdown-item-public w-full"
                                :class="{ 'active': currentPublicAgent.id === agentDef.id }"
                                role="menuitem"
                                >
                                <component :is="agentDef.icon || SparklesIcon" class="icon-base mr-2.5 shrink-0" :class="agentDef.iconClass || 'text-primary-500'" aria-hidden="true" />
                                <span class="text-sm font-medium">{{ agentDef.label }}</span>
                                </button>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>

            <MainContentView :agent="currentPublicAgent" class="main-content-panel-public" aria-live="polite">
                <template v-if="mainContentToDisplay">
                    <CompactMessageRenderer
                        v-if="currentPublicAgent.capabilities?.usesCompactRenderer && mainContentToDisplay.type === 'compact-message-renderer-data'"
                        :content="mainContentToDisplay.data"
                        :mode="currentPublicAgent.id"
                        class="flex-grow overflow-y-auto p-1 custom-scrollbar"
                    />
                    <div v-else-if="mainContentToDisplay.type === 'markdown' || mainContentToDisplay.type === 'welcome'"
                        class="prose prose-sm sm:prose-base dark:prose-invert max-w-none p-4 md:p-6 flex-grow overflow-y-auto custom-scrollbar"
                        v-html="chatStore.isMainContentStreaming && agentStore.activeAgentId === currentPublicAgent.id ? chatStore.streamingMainContentText + '<span class=\'streaming-cursor\'>▋</span>' : mainContentToDisplay.data"
                        aria-atomic="true"
                    ></div>
                     <div v-else class="p-4 text-neutral-text-muted italic custom-scrollbar">
                        <p>Displaying content of type: {{ mainContentToDisplay.type }}.</p>
                        <pre v-if="typeof mainContentToDisplay.data === 'object'">{{ JSON.stringify(mainContentToDisplay.data, null, 2) }}</pre>
                        <p v-else>{{ mainContentToDisplay.data }}</p>
                    </div>
                </template>
                <div v-else-if="!isLoadingResponse" class="flex-grow flex items-center justify-center p-6">
                    <div class="text-center text-neutral-text-muted">
                        <SparklesIcon class="w-12 h-12 mx-auto mb-3 opacity-50 text-primary-300 animate-pulse-subtle" aria-hidden="true" />
                        <p class="text-lg">{{ currentPublicAgent.inputPlaceholder || 'Ask me anything!' }}</p>
                    </div>
                </div>
                 <div v-if="isLoadingResponse && chatStore.isMainContentStreaming && agentStore.activeAgentId === currentPublicAgent.id"
                      class="absolute inset-0 bg-neutral-bg/50 dark:bg-neutral-bg-dark/50 backdrop-blur-sm flex items-center justify-center text-neutral-text p-4"
                      aria-label="Assistant is typing"
                  >
                    <div class="loading-animation text-center">
                        <div class="loading-spinner"> <div class="spinner-blade"></div><div class="spinner-blade"></div><div class="spinner-blade"></div><div class="spinner-blade"></div>
                            <div class="spinner-blade"></div><div class="spinner-blade"></div><div class="spinner-blade"></div><div class="spinner-blade"></div>
                        </div>
                        <p class="loading-text mt-4" v-html="chatStore.streamingMainContentText + '<span class=\'streaming-cursor\'>▋</span>'" aria-atomic="true"></p>
                    </div>
                </div>
            </MainContentView>

            <AgentChatLog :agent-id="currentPublicAgent.id" class="chat-log-panel-public custom-scrollbar" />
        </div>
         <div v-else class="flex-grow flex items-center justify-center p-8 text-center">
            <Cog6ToothIconSolid class="w-16 h-16 mx-auto text-neutral-border mb-4 animate-spin animation-duration-3s" aria-hidden="true"/>
            <p class="text-xl text-neutral-text">Assistant is currently unavailable.</p>
            <p class="text-sm text-neutral-text-secondary mt-2">Please check back later or try logging in for full access.</p>
        </div>
    </div>

    <div v-if="currentPublicAgent" class="sticky bottom-0 z-20 p-3 sm:p-4 voice-input-section-public">
        <div v-if="rateLimitInfo && rateLimitInfo.tier === 'public' && rateLimitInfo.remaining !== undefined && rateLimitInfo.remaining <= 0" class="text-center py-3 card-base p-4">
            <p class="text-error-DEFAULT font-semibold mb-1 text-lg">Daily Limit Reached</p>
            <p class="text-xs text-neutral-text-muted mb-2">Resets around {{ formatResetTime(rateLimitInfo.resetAt) }}.</p>
            <router-link to="/login" class="btn btn-primary btn-sm">Unlock Pro Access</router-link>
        </div>
        <VoiceInput
            v-else
            :is-processing="isVoiceInputProcessing"
            :audio-mode="voiceSettingsManager.settings.audioInputMode"
            :input-placeholder="currentPublicAgent.inputPlaceholder || 'Ask a question (public access)...'"
            @transcription="onTranscriptionReceived"
            @update:audio-mode="(newMode: AudioInputMode) => voiceSettingsManager.updateSetting('audioInputMode', newMode)"
            @processing="(status: boolean) => isVoiceInputProcessing = status"
            :class="[
                'transition-all duration-300 ease-out',
                isVoiceInputProcessing ? 'shadow-holo-md border-accent-focus' : 'shadow-interactive',
            ]"
        />
    </div>
    <!-- <Footer class="app-footer-public"/> -->
  </div>
</template>

<style scoped>
/* Using global styles from main.css mostly. Scoped styles are for layout specifics or overrides. */

.public-home-container {
  /* Backgrounds and base text colors are set by Tailwind utilities using CSS vars from main.css */
}

/* The .header-glass class is already defined in main.css, ensure it's applied to header tag or a div inside it */

.agent-content-layout-public {
  /* Handled by Tailwind flex classes */
}
.public-agent-selector-area {
  @apply lg:max-w-xs xl:max-w-sm; /* Constrain width on larger screens */
}

.dropdown-menu-public {
  /* .glass-pane and .rounded-[var(--radius-md)] .shadow-holo-lg are applied directly in template */
  /* Additional specific dropdown styling if needed beyond glass-pane */
  @apply border-none; /* glass-pane already has border */
}

.dropdown-item-public {
  @apply flex items-center px-3 py-2.5 text-left text-neutral-text rounded-[var(--radius-sm)]
         transition-all duration-[var(--duration-quick)] ease-[var(--ease-out-quad)]
         hover:bg-primary-500/10 hover:text-primary-500 dark:hover:bg-primary-500/20 dark:hover:text-primary-light;
}
.dropdown-item-public.active {
  @apply bg-primary-500/20 text-primary-600 dark:bg-primary-light/20 dark:text-primary-light font-semibold;
}
.dropdown-item-public .icon-base {
   @apply text-primary-400 dark:text-primary-light group-hover:text-primary-500 dark:group-hover:text-primary-focus;
}
.dropdown-item-public.active .icon-base {
   @apply text-primary-600 dark:text-primary-light;
}


.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity var(--duration-quick) var(--ease-out-quad), transform var(--duration-quick) var(--ease-out-quad);
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.main-content-panel-public {
  flex: 3 1 0%;
  min-height: 300px; /* Ensure content area has some base height */
  @apply relative overflow-y-auto; /* Ensure custom-scrollbar utility applies if needed */
}

.chat-log-panel-public {
  flex: 2 1 0%;
  min-height: 200px; /* Ensure content area has some base height */
  @apply bg-neutral-bg-subtle/50 dark:bg-neutral-bg-elevated/30
         border-t lg:border-t-0 lg:border-l border-neutral-border/70
         overflow-y-auto p-2 sm:p-3;
}
/* Responsive layout adjustments for chat and main content panels */
@media (min-width: 1024px) {
  .main-content-panel-public {
    max-height: calc(100vh - var(--header-height) - var(--footer-height) - 4rem); /* Adjust 4rem for voice input section */
  }
  .chat-log-panel-public {
    max-height: calc(100vh - var(--header-height) - var(--footer-height) - 4rem);
  }
}


.voice-input-section-public {
  @apply bg-neutral-bg/80 dark:bg-neutral-bg-elevated/80 backdrop-blur-md
         border-t border-neutral-border/70 shadow-lg;
}

.app-footer-public {
  /* Uses global styles or can be themed here if specific override is needed */
   @apply bg-neutral-bg-subtle/50 border-t border-neutral-border/50 text-neutral-text-muted;
}

.streaming-cursor {
  animation: blink 1s step-end infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Custom scrollbar for specific panels if needed, or rely on global from main.css */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background-color: hsl(var(--bg-subtle-hsl) / 0.5);
  border-radius: var(--radius-sm);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: hsl(var(--primary-color-hsl) / 0.5);
  border-radius: var(--radius-full);
  border: 2px solid transparent;
  background-clip: content-box;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: hsl(var(--primary-focus-hsl) / 0.7);
}
.dark .custom-scrollbar::-webkit-scrollbar-track {
  background-color: hsl(var(--bg-elevated-hsl-dark) / 0.5);
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: hsl(var(--primary-light-hsl) / 0.4);
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: hsl(var(--primary-light-hsl) / 0.6);
}

/* Removing locally scoped .btn-primary, .btn-secondary as main.css provides these */
</style>