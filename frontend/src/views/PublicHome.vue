// File: frontend/src/views/PublicHome.vue
/**
 * @file PublicHome.vue
 * @description Public-facing home page with rate-limited access to selected AI agents.
 * @version 1.1.2 - Corrected activeAgentId access, typed params, and cleaned up unused variables/CSS.
 */

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject, watch, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import { api, chatAPI, type ChatMessagePayload } from '@/utils/api';
import { agentService, type IAgentDefinition, type AgentId } from '@/services/agent.service';
import { useAgentStore } from '@/store/agent.store'; // Import agentStore
import { useChatStore, type ChatMessage, type MainContent } from '@/store/chat.store';
import { voiceSettingsManager } from '@/services/voice.settings.service';
import type { ToastService } from '@/services/services';

import VoiceInput from '@/components/VoiceInput.vue';
import Footer from '@/components/Footer.vue';
import AnimatedLogo from '@/components/ui/AnimatedLogo.vue';
import MainContentView from '@/components/agents/common/MainContentView.vue';
import AgentChatLog from '@/components/agents/common/AgentChatLog.vue';
import CompactMessageRenderer from '@/components/CompactMessageRenderer.vue';

import {
  ExclamationTriangleIcon, // Now used for rate limit warning in template
  SparklesIcon,
  KeyIcon,
  ChevronDownIcon,
} from '@heroicons/vue/24/outline';

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
const agentStore = useAgentStore(); // Instantiate agentStore
const chatStore = useChatStore();

const availablePublicAgents = shallowRef<IAgentDefinition[]>([]);
const currentPublicAgent = ref<IAgentDefinition | null>(null);
const showPublicAgentSelector = ref(false);
const publicAgentSelectorDropdownRef = ref<HTMLElement | null>(null);

const isLoadingResponse = ref(false);
const isVoiceInputProcessing = ref(false);
const currentSystemPrompt = ref('');

const rateLimitInfo = ref<RateLimitInfo | null>(null);

const mainContentToDisplay = computed<MainContent | null>(() => {
    if (!currentPublicAgent.value) return null;
    return chatStore.getMainContentForAgent(currentPublicAgent.value.id);
});

const fetchRateLimitInfo = async () => {
  try {
    const response = await api.get('/api/rate-limit/status');
    if (response.data.tier === 'authenticated') {
      router.push({ name: 'PrivateHome' });
      return;
    }
    rateLimitInfo.value = {
      ...response.data,
      resetAt: response.data.resetAt ? new Date(response.data.resetAt) : new Date(Date.now() + 24 * 60 * 60 * 1000)
    };
  } catch (error) {
    console.error('PublicHome: Failed to fetch rate limit info:', error);
    toast?.add({ type: 'error', title: 'Network Error', message: 'Could not fetch usage details.' });
  }
};

const loadPublicAgents = () => {
  const allPublic = agentService.getPublicAgents();
  availablePublicAgents.value = allPublic.filter(agent => 
    agent.id !== 'codingAssistant' && agent.id !== 'codingInterviewer'
  );
  
  if (availablePublicAgents.value.length > 0) {
    const defaultPublicAgent = availablePublicAgents.value.find(a => a.id === 'general') || availablePublicAgents.value[0];
    currentPublicAgent.value = defaultPublicAgent; 
    // For PublicHome, we might not always want to force the global agentStore to this public agent
    // if an authenticated user (with a different active agent in their private session) happens to visit PublicHome.
    // However, if no agent is set or the current one isn't public, setting a sensible default is good.
    if (!agentStore.activeAgent || !agentStore.activeAgent.isPubliclyAvailable || 
        agentStore.activeAgent.id === 'codingAssistant' || agentStore.activeAgent.id === 'codingInterviewer') {
      agentStore.setActiveAgent(defaultPublicAgent.id);
    } else if(agentStore.activeAgentId !== defaultPublicAgent.id && availablePublicAgents.value.find(a => a.id === agentStore.activeAgentId)) {
      // If the current global agent is public and available here, use it
      currentPublicAgent.value = agentStore.activeAgent;
    }


  } else {
    console.warn("PublicHome: No publicly available agents configured (excluding coding agents).");
    currentPublicAgent.value = null;
  }
  loadAgentSystemPrompt();
};

const selectPublicAgent = (agentId: AgentId) => {
  const agent = availablePublicAgents.value.find(a => a.id === agentId);
  if (agent) {
    currentPublicAgent.value = agent;
    agentStore.setActiveAgent(agentId); 
    showPublicAgentSelector.value = false;
    chatStore.clearAgentData(agentId);
     chatStore.updateMainContent({
        agentId: agent.id,
        type: 'markdown',
        data: `### Welcome to ${agent.label}!\n${agent.description}\n\n${agent.inputPlaceholder || 'How can I assist you today?'}`,
        title: `${agent.label} Ready`,
        timestamp: Date.now(),
    });
    loadAgentSystemPrompt();
    toast?.add({ type: 'info', title: 'Assistant Changed', message: `Now chatting with ${agent.label}.`, duration: 2000 });
  }
};

const loadAgentSystemPrompt = async () => {
  if (currentPublicAgent.value?.systemPromptKey) {
    try {
      const module = await import(/* @vite-ignore */ `../../../../prompts/${currentPublicAgent.value.systemPromptKey}.md?raw`);
      currentSystemPrompt.value = module.default;
    } catch (e) {
      console.error(`[PublicHome] Failed to load system prompt: ${currentPublicAgent.value.systemPromptKey}.md`, e);
      currentSystemPrompt.value = "You are a helpful AI assistant for public users. Keep responses brief.";
    }
  } else {
    currentSystemPrompt.value = "You are a helpful AI assistant for public users. Keep responses brief.";
  }
};

watch(currentPublicAgent, loadAgentSystemPrompt);

const onTranscriptionReceived = async (transcription: string) => {
  if (!transcription.trim() || isLoadingResponse.value || !currentPublicAgent.value) return;
  
  if (rateLimitInfo.value && rateLimitInfo.value.tier === 'public' && rateLimitInfo.value.remaining !== undefined && rateLimitInfo.value.remaining <= 0) {
    toast?.add({
      type: 'error',
      title: 'Daily Limit Reached',
      message: 'Please try again tomorrow or log in for unlimited access.'
    });
    return;
  }

  const agentId = currentPublicAgent.value.id;
  const userMessage: ChatMessage = {
    id: `user-public-${Date.now()}-${Math.random().toString(36).substring(2,7)}`,
    role: 'user',
    content: transcription,
    timestamp: Date.now(),
    agentId: agentId,
  };
  chatStore.addMessage(userMessage);
  isLoadingResponse.value = true;
  chatStore.setMainContentStreaming(true, `Processing your request for "${transcription.substring(0,30)}..."`);

  try {
    const historyForApi = chatStore.getHistoryForApi(agentId, currentPublicAgent.value.capabilities?.maxChatHistory || 5);

    let finalSystemPrompt = currentSystemPrompt.value
        .replace(/{{LANGUAGE}}/g, voiceSettingsManager.settings.preferredCodingLanguage)
        .replace(/{{MODE}}/g, currentPublicAgent.value.id)
        .replace(/{{GENERATE_DIAGRAM}}/g, (currentPublicAgent.value.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams).toString())
        .replace(/{{ADDITIONAL_INSTRUCTIONS}}/g, 'Your public persona is helpful but slightly more concise. You cannot assist with detailed coding interview preparations.');

    const payload: ChatMessagePayload = {
      messages: [{ role: 'system', content: finalSystemPrompt }, ...historyForApi],
      mode: currentPublicAgent.value.systemPromptKey,
      language: voiceSettingsManager.settings.preferredCodingLanguage,
      generateDiagram: currentPublicAgent.value.canGenerateDiagrams && voiceSettingsManager.settings.generateDiagrams,
      userId: rateLimitInfo.value?.ip || 'public_user',
      conversationId: chatStore.getCurrentConversationId(agentId),
    };

    const response = await chatAPI.sendMessage(payload);
    const assistantMessageContent = response.data.content || "I'm not sure how to respond to that right now.";
    chatStore.addMessage({
      id: `assistant-public-${Date.now()}-${Math.random().toString(36).substring(2,7)}`,
      role: 'assistant',
      content: assistantMessageContent,
      timestamp: Date.now(),
      agentId: agentId,
      model: response.data.model,
      usage: response.data.usage,
    });
    chatStore.updateMainContent({
        agentId: agentId,
        type: currentPublicAgent.value.capabilities?.usesCompactRenderer ? 'compact-message-renderer-data' : 'markdown',
        data: assistantMessageContent,
        title: `Response`,
        timestamp: Date.now()
    });
    await fetchRateLimitInfo();
  } catch (error: any) {
    console.error('PublicHome: Chat API error:', error);
    const errorMsg = error.response?.data?.message || error.message || 'An error occurred processing your request.';
    chatStore.addMessage({
      id: `error-public-${Date.now()}-${Math.random().toString(36).substring(2,7)}`,
      role: 'assistant',
      content: `Sorry, an error occurred: ${errorMsg}`,
      timestamp: Date.now(),
      agentId: agentId,
      isError: true,
    });
    chatStore.updateMainContent({
        agentId: agentId,
        type: 'markdown',
        data: `### Error\n${errorMsg}`,
        title: `Error`,
        timestamp: Date.now()
    });
    if (error.response?.status === 429) {
      await fetchRateLimitInfo();
    }
  } finally {
    isLoadingResponse.value = false;
    chatStore.setMainContentStreaming(false);
  }
};

const formatResetTime = (dateValue?: string | Date): string => {
  if (!dateValue) return 'later';
  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
  if (isNaN(date.getTime())) return 'soon';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const handleClickOutsidePublicAgentSelector = (event: MouseEvent) => {
  if (publicAgentSelectorDropdownRef.value && !publicAgentSelectorDropdownRef.value.contains(event.target as Node)) {
    showPublicAgentSelector.value = false;
  }
};

let rateLimitInterval: number | undefined;

onMounted(async () => {
  await fetchRateLimitInfo();
  loadPublicAgents();
  document.addEventListener('click', handleClickOutsidePublicAgentSelector, true);
  rateLimitInterval = window.setInterval(fetchRateLimitInfo, 60000);
});

onUnmounted(() => {
  if (rateLimitInterval) clearInterval(rateLimitInterval);
  document.removeEventListener('click', handleClickOutsidePublicAgentSelector, true);
});
</script>

<template>
  <div class="public-home-container min-h-screen flex flex-col">
    <header class="sticky top-0 z-30 glass-pane-header shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <AnimatedLogo class="w-10 h-10 sm:w-12 sm:h-12" />
            <div>
              <h1 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
                Voice Chat Assistant
              </h1>
              <p class="text-xs text-gray-600 dark:text-gray-400">Public Preview</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div v-if="rateLimitInfo && rateLimitInfo.tier === 'public' && rateLimitInfo.limit !== undefined && rateLimitInfo.used !== undefined" class="hidden sm:flex items-center gap-2 text-sm">
              <span class="text-gray-600 dark:text-gray-400">Daily Usage:</span>
              <div class="flex items-center gap-1.5">
                <div class="w-28 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                  <div 
                    class="h-full bg-gradient-to-r from-sky-400 to-blue-500 dark:from-sky-500 dark:to-blue-600 transition-all duration-300 ease-out"
                    :style="{ width: `${(rateLimitInfo.used / rateLimitInfo.limit) * 100}%` }"
                  ></div>
                </div>
                <span class="text-xs font-mono text-gray-500 dark:text-gray-400">{{ rateLimitInfo.remaining ?? 'N/A' }}/{{ rateLimitInfo.limit ?? 'N/A' }}</span>
              </div>
            </div>
            <router-link to="/login" class="btn-primary btn-sm">
              <KeyIcon class="w-4 h-4 mr-1.5" />
              Pro Access
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <div class="flex-grow flex flex-col overflow-hidden">
        <div v-if="currentPublicAgent" class="flex-grow flex flex-col lg:flex-row agent-content-layout-public overflow-hidden">
            <div v-if="availablePublicAgents.length > 1" class="p-3 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700/50 public-agent-selector-area">
                <div class="relative">
                    <button @click="showPublicAgentSelector = !showPublicAgentSelector" class="w-full btn btn-secondary btn-sm flex items-center justify-between gap-1.5">
                        <div class="flex items-center gap-2">
                            <component :is="currentPublicAgent.icon" class="w-4 h-4" :class="currentPublicAgent.iconClass" />
                            <span>{{ currentPublicAgent.label }}</span>
                        </div>
                        <ChevronDownIcon class="w-4 h-4 transition-transform duration-200" :class="{'rotate-180': showPublicAgentSelector}" />
                    </button>
                    <transition name="dropdown-fade">
                        <div v-if="showPublicAgentSelector" class="dropdown-menu-public absolute top-full left-0 mt-1 w-full origin-top-right z-50" ref="publicAgentSelectorDropdownRef">
                            <div class="p-1">
                                <button
                                v-for="agentDef in availablePublicAgents" :key="agentDef.id"
                                @click="selectPublicAgent(agentDef.id)"
                                class="dropdown-item-public w-full"
                                :class="{ 'active': currentPublicAgent.id === agentDef.id }"
                                >
                                <component :is="agentDef.icon" class="w-5 h-5 mr-2 shrink-0" :class="agentDef.iconClass" />
                                <span class="text-sm font-medium">{{ agentDef.label }}</span>
                                </button>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>

            <MainContentView :agent="currentPublicAgent" class="main-content-panel-public">
                <template v-if="mainContentToDisplay">
                    <CompactMessageRenderer
                        v-if="currentPublicAgent.capabilities?.usesCompactRenderer && mainContentToDisplay.type === 'compact-message-renderer-data'"
                        :content="mainContentToDisplay.data"
                        :mode="currentPublicAgent.id"
                        class="flex-grow overflow-y-auto p-1"
                    />
                    <div v-else-if="mainContentToDisplay.type === 'markdown'"
                        class="prose prose-sm sm:prose-base dark:prose-invert max-w-none p-4 md:p-6 flex-grow overflow-y-auto"
                        v-html="chatStore.isMainContentStreaming && agentStore.activeAgentId === currentPublicAgent.id ? chatStore.streamingMainContentText + '▋' : mainContentToDisplay.data"
                    ></div>
                     <div v-else class="p-4 text-slate-400 italic">
                        Content type: {{ mainContentToDisplay.type }}.
                    </div>
                </template>
                <div v-else-if="!isLoadingResponse" class="flex-grow flex items-center justify-center p-6">
                    <div class="text-center text-gray-500 dark:text-gray-400">
                        <SparklesIcon class="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p class="text-lg">{{ currentPublicAgent.inputPlaceholder || 'Ask me anything!' }}</p>
                        <div v-if="rateLimitInfo && rateLimitInfo.tier === 'public' && rateLimitInfo.remaining !== undefined && rateLimitInfo.remaining < 20 && rateLimitInfo.remaining > 0" class="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 rounded-lg text-xs">
                            <ExclamationTriangleIcon class="w-4 h-4" />
                            <span>Low daily requests remaining: {{ rateLimitInfo.remaining }}</span>
                        </div>
                    </div>
                </div>
                 <div v-if="isLoadingResponse && chatStore.isMainContentStreaming && agentStore.activeAgentId === currentPublicAgent.id" 
                     class="absolute inset-0 bg-gray-500/10 backdrop-blur-sm flex items-center justify-center text-gray-600 dark:text-gray-300 p-4">
                     <div class="prose prose-sm dark:prose-invert max-w-full" v-html="chatStore.streamingMainContentText + '▋'"></div>
                 </div>
            </MainContentView>

            <AgentChatLog :agent-id="currentPublicAgent.id" class="chat-log-panel-public" />
        </div>
         <div v-else class="flex-grow flex items-center justify-center p-8 text-center">
            <SparklesIcon class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4 animate-pulse"/>
            <p class="text-xl text-gray-700 dark:text-gray-300">Assistant is currently unavailable.</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">No public agents are configured or available at this time.</p>
        </div>
    </div>

    <div v-if="currentPublicAgent" class="sticky bottom-0 z-20 p-3 sm:p-4 bg-white/70 dark:bg-gray-950/70 backdrop-blur-md border-t border-gray-200 dark:border-gray-700/50 voice-input-section-public">
        <div v-if="rateLimitInfo && rateLimitInfo.tier === 'public' && rateLimitInfo.remaining !== undefined && rateLimitInfo.remaining <= 0" class="text-center py-3">
            <p class="text-red-600 dark:text-red-400 font-semibold mb-1">Daily Limit Reached</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Resets around {{ formatResetTime(rateLimitInfo.resetAt) }}.</p>
            <router-link to="/login" class="btn-primary btn-sm">Unlock Pro Access</router-link>
        </div>
        <VoiceInput
            v-else
            :is-processing="isVoiceInputProcessing"
            :audio-mode="voiceSettingsManager.settings.audioInputMode"
            :input-placeholder="currentPublicAgent.inputPlaceholder || 'Ask a question (public access)...'"
            @transcription="onTranscriptionReceived"
            @update:audio-mode="(newMode: 'push-to-talk' | 'continuous' | 'voice-activation') => voiceSettingsManager.updateSetting('audioInputMode', newMode)"
            @processing="(status: boolean) => isVoiceInputProcessing = status"
        />
    </div>
    <Footer class="app-footer-public"/>
  </div>
</template>

<style scoped>
.glass-pane-header {
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(1rem);
  border-bottom-width: 1px;
  border-color: rgba(229, 231, 235, 0.5);
}
.dark .glass-pane-header {
  background-color: rgba(3, 7, 18, 0.7);
  border-color: rgba(55, 65, 81, 0.5);
}
.animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

.agent-content-layout-public { display: flex; flex-direction: column; }
@media (min-width: 1024px) { .agent-content-layout-public { flex-direction: row; } }

.public-agent-selector-area { /* No empty rules */ }

.dropdown-menu-public {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(1rem);
  border-width: 1px;
  border-color: rgb(229 231 235);
  border-radius: 0.5rem;
  box-shadow: theme('boxShadow.xl');
  z-index: 50;
}
.dark .dropdown-menu-public {
  background-color: rgba(30, 41, 59, 0.9);
  border-color: rgb(55 65 81);
}
.dropdown-item-public {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem; /* Equivalent to px-3 py-2 */
  text-align: left;
  color: theme('colors.gray.700');
  border-radius: 0.375rem; /* rounded-md */
  transition-property: background-color, color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.dark .dropdown-item-public { color: theme('colors.gray.200'); }
.dropdown-item-public:hover { background-color: theme('colors.gray.100'); }
.dark .dropdown-item-public:hover { background-color: theme('colors.slate.700'); }
.dropdown-item-public.active {
  background-color: theme('colors.blue.50');
  color: theme('colors.blue.600');
  font-weight: 600;
}
.dark .dropdown-item-public.active {
  background-color: rgba(59, 130, 246, 0.2);
  color: theme('colors.blue.300');
}

.main-content-panel-public { flex: 3 1 0%; min-height: 300px; overflow-y: auto; position: relative; }
.chat-log-panel-public {
  flex: 2 1 0%;
  min-height: 200px;
  max-height: 40vh;
  overflow-y: auto;
  background-color: rgba(240, 245, 255, 0.3);
  border-top-width: 1px;
  border-color: rgba(229, 231, 235, 0.5);
}
@media (min-width: 1024px) {
    .chat-log-panel-public {
        max-height: none;
        border-top-width: 0px;
        border-left-width: 1px;
        border-color: rgba(229, 231, 235, 0.5);
    }
    .dark .chat-log-panel-public { border-left-color: rgba(55, 65, 81, 0.5); }
}
.dark .chat-log-panel-public {
    background-color: rgba(10, 5, 20, 0.2);
    border-top-color: rgba(55, 65, 81, 0.5);
}

.voice-input-section-public { /* Basic structure only */ }
.app-footer-public {
    background-color: rgba(249, 250, 251, 0.7);
    border-top-width: 1px;
    border-color: rgba(229, 231, 235, 0.7);
}
.dark .app-footer-public {
    background-color: rgba(15, 23, 42, 0.7);
    border-color: rgba(30, 41, 59, 0.7);
}

.btn-primary { /* Copied from previous version for consistency */ }
.dark .btn-primary { /* Copied */ }
.btn-secondary { /* Copied */ }
.dark .btn-secondary { /* Copied */ }
.btn-sm { /* Copied */ }
</style>