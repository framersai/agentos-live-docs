// File: frontend/src/views/PrivateHome.vue
/**
 * @file PrivateHome.vue
 * @description Authenticated home view that hosts the AI agent framework.
 * @version 1.2.2 - Corrected unused variables, AUTH_TOKEN_KEY import, typed params, CSS, and icon usage.
 */

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject, watch, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
import { AUTH_TOKEN_KEY } from '@/router'; // Corrected import path
import type { ToastService } from '@/services/services';
import { agentService, type AgentId, type IAgentDefinition } from '@/services/agent.service';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore } from '@/store/chat.store';
import { voiceSettingsManager } from '@/services/voice.settings.service';

// Import common agent UI components
import MainContentView from '@/components/agents/common/MainContentView.vue';
import AgentChatLog from '@/components/agents/common/AgentChatLog.vue';
// import AgentHeaderControls from '@/components/agents/common/AgentHeaderControls.vue';

import Footer from '@/components/Footer.vue';
import VoiceInput from '@/components/VoiceInput.vue';

import {
  ShieldCheckIcon as ShieldCheckIconOutline,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  SparklesIcon, // Used as fallback icon
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  // ChatBubbleBottomCenterTextIcon, // Was unused, removed
} from '@heroicons/vue/24/outline';

const toast = inject<ToastService>('toast');
const router = useRouter();
const agentStore = useAgentStore();
const chatStore = useChatStore();

// --- Agent Management ---
const currentAllAgentDefinitions = shallowRef<Readonly<IAgentDefinition[]>>(agentService.getAllAgents());
const activeAgentId = computed(() => agentStore.activeAgentId);
const activeAgent = computed(() => agentStore.activeAgent);
const currentAgentUiComponent = computed(() => activeAgent.value?.uiComponent);

const showAgentSelector = ref(false);
const agentSelectorDropdownRef = ref<HTMLElement | null>(null);
const agentViewRef = ref<any>(null);

const selectAgent = (agentId: AgentId) => {
  agentStore.setActiveAgent(agentId);
  // chatStore.clearAgentData(agentId); // Decided to keep agent data on switch for now, can be changed
  showAgentSelector.value = false;
  toast?.add({type: 'info', title: 'Agent Switched', message: `Switched to ${activeAgent.value?.label || agentId}`, duration: 2500});
};

const handleAgentEvent = (eventData: any) => {
  console.log('[PrivateHome] Event from agent view received:', eventData);
};

watch(() => voiceSettingsManager.settings.currentAppMode, (newMode: string) => {
    if (newMode as AgentId !== activeAgentId.value) {
        const newAgentDef = agentService.getAgentById(newMode as AgentId);
        if (newAgentDef) {
            agentStore.setActiveAgent(newAgentDef.id);
        }
    }
}, { deep: true });

// --- UI State & Actions ---
const isGloballyMuted = useStorage<boolean>('vca-global-mute', false);
// const showChatInputArea = ref(true); // This was declared but not used in template, removing for now.

const toggleGlobalMuteHandler = () => {
  isGloballyMuted.value = !isGloballyMuted.value;
  voiceSettingsManager.updateSetting('autoPlayTts', !isGloballyMuted.value);
  toast?.add({
    type: 'info',
    title: isGloballyMuted.value ? 'Audio Output Muted' : 'Audio Output Unmuted',
    message: isGloballyMuted.value ? 'TTS will not play automatically.' : 'TTS will play responses.',
    duration: 2500
  });
};

const handleLogoutHandler = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  voiceSettingsManager.resetToDefaults();
  agentStore.setActiveAgent(agentService.getDefaultAgent().id);
  chatStore.clearAgentData();
  toast?.add({ type: 'success', title: 'Logged Out', message: 'You have been successfully logged out.'});
  router.push({ name: 'Login' });
};

// --- Background Animation Styling ---
const orbitStyleProvider = (_index: number) => ({
  animationDuration: `${20 + Math.random() * 30}s`,
  animationDelay: `-${Math.random() * 50}s`,
  transform: `rotate(${Math.random() * 360}deg) translateX(${15 + Math.random() * 25}vmax) translateY(${Math.random() * 10 - 5}vmax) rotate(-${Math.random() * 180}deg)`,
  opacity: 0.03 + Math.random() * 0.07,
});

const shapeStyleProvider = (_index: number) => ({
  width: `${30 + Math.random() * 100}px`,
  height: `${30 + Math.random() * 100}px`,
  backgroundColor: `hsla(${180 + Math.random() * 120}, 70%, 60%, 0.5)`,
  animationDuration: `${15 + Math.random() * 25}s`,
  borderRadius: Math.random() > 0.3 ? '50%' : `${Math.random()*40 + 10}% ${Math.random()*40 + 10}%`,
  filter: 'blur(2px)',
});

const handleClickOutsideAgentSelector = (event: MouseEvent) => {
  if (agentSelectorDropdownRef.value && !agentSelectorDropdownRef.value.contains(event.target as Node)) {
    showAgentSelector.value = false;
  }
};

// --- Voice Input Handling ---
// const currentTranscription = ref(''); // Not directly used in this component's template logic after passing down
const isVoiceInputProcessing = ref(false);

const onTranscriptionReceived = (transcription: string) => {
  // currentTranscription.value = transcription; // No longer needed here, directly pass
  if (transcription.trim() && agentViewRef.value && typeof agentViewRef.value.handleNewUserInput === 'function') {
    agentViewRef.value.handleNewUserInput(transcription);
  } else if (transcription.trim()) {
    console.warn(`[PrivateHome] Active agent view (or ref) is not ready or does not have handleNewUserInput. Transcription: ${transcription}`);
    toast?.add({type: 'warning', title: 'Input Not Processed', message: 'The current agent may not be configured to handle this input right now.'});
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutsideAgentSelector, true);
  const initialModeFromSettings = voiceSettingsManager.settings.currentAppMode as AgentId;
  const agentToSet = agentService.getAgentById(initialModeFromSettings) 
                      ? initialModeFromSettings 
                      : agentService.getDefaultAgent().id;
  if (agentStore.activeAgentId !== agentToSet) {
    agentStore.setActiveAgent(agentToSet);
  } else if (!agentStore.activeAgent) {
     agentStore.setActiveAgent(agentToSet);
  }
  isGloballyMuted.value = !voiceSettingsManager.settings.autoPlayTts;
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutsideAgentSelector, true);
});

</script>

<template>
  <div class="private-home-wrapper min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 text-gray-100">
    <div class="fixed inset-0 overflow-hidden -z-10">
      <div class="orbit-container" v-for="i in 15" :key="`orbit-${i}`" :style="orbitStyleProvider(i)">
        <div class="orbiting-shape" :style="shapeStyleProvider(i)"></div>
      </div>
    </div>

    <header class="sticky top-0 z-40 private-header-style">
      <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <img src="/src/assets/logo.svg" alt="VCA Logo" class="w-10 h-10 private-logo-filter animate-slow-spin" />
            <div>
              <h1 class="text-xl sm:text-2xl font-bold flex items-center gap-2.5">
                <span class="private-title-text">Voice Chat Assistant</span>
                <span class="private-badge">
                  <ShieldCheckIconOutline class="w-3.5 h-3.5 mr-1 text-purple-300" />PRIVATE
                </span>
              </h1>
              <p class="text-xs text-purple-300/80">Unlimited Access Mode</p>
            </div>
          </div>
          
          <div class="flex items-center gap-2 md:gap-3">
            <button @click="toggleGlobalMuteHandler" :title="isGloballyMuted ? 'Unmute Audio' : 'Mute Audio'"
                    class="header-icon-button">
              <SpeakerXMarkIcon v-if="isGloballyMuted" class="w-5 h-5" />
              <SpeakerWaveIcon v-else class="w-5 h-5" />
            </button>
            
            <div class="relative">
              <button @click="showAgentSelector = !showAgentSelector" class="btn btn-secondary btn-sm flex items-center gap-1.5">
                <component :is="activeAgent?.icon || SparklesIcon" class="w-4 h-4" :class="activeAgent?.iconClass || 'text-purple-300'" />
                {{ activeAgent?.label || 'Select Agent' }}
                <ChevronDownIcon class="w-4 h-4 transition-transform duration-200" :class="{'rotate-180': showAgentSelector}" />
              </button>
              <transition name="dropdown-fade">
                <div v-if="showAgentSelector" class="dropdown-menu-private absolute top-full right-0 mt-2 w-72 origin-top-right" ref="agentSelectorDropdownRef">
                  <div class="p-1">
                    <button
                      v-for="agentDef in currentAllAgentDefinitions"
                      :key="agentDef.id"
                      @click="selectAgent(agentDef.id)"
                      class="dropdown-item-private w-full"
                      :class="{ 'active': activeAgentId === agentDef.id }"
                    >
                      <component :is="agentDef.icon" class="w-5 h-5 mr-2 shrink-0" :class="agentDef.iconClass" />
                      <div class="text-left">
                        <span class="text-sm font-medium">{{ agentDef.label }}</span>
                        <p class="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">{{ agentDef.description }}</p>
                      </div>
                    </button>
                  </div>
                </div>
              </transition>
            </div>

            <router-link to="/settings" class="header-icon-button" title="Settings">
              <Cog6ToothIcon class="w-5 h-5" />
            </router-link>
            <button @click="handleLogoutHandler" class="header-icon-button text-red-400 hover:text-red-300" title="Logout">
              <ArrowRightOnRectangleIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-grow relative z-10 flex flex-col p-2 sm:p-4 overflow-hidden">
      <div v-if="activeAgent" class="flex-grow flex flex-col agent-view-container">
        <div class="flex-grow flex flex-col lg:flex-row overflow-hidden agent-content-layout">
          <MainContentView 
            :agent="activeAgent" 
            class="main-content-panel lg:border-r border-purple-500/20 dark:border-slate-700/50"
            aria-labelledby="main-content-title"
          >
            <transition name="agent-ui-fade" mode="out-in">
                <component
                  :is="currentAgentUiComponent"
                  :key="activeAgent.id" 
                  ref="agentViewRef"
                  :agent-id="activeAgent.id"
                  :agent-config="activeAgent"
                  @agent-event="handleAgentEvent"
                  class="w-full h-full agent-specific-ui-root"
                />
            </transition>
          </MainContentView>

          <AgentChatLog
            :agent-id="activeAgent.id"
            class="chat-log-panel flex flex-col"
          />
        </div>
      </div>
      <div v-else class="flex-grow flex items-center justify-center">
        <div class="text-center p-8">
            <SparklesIcon class="w-16 h-16 mx-auto text-purple-400/70 mb-4 animate-pulse"/>
            <p class="text-xl text-purple-300">Select an Agent to Begin</p>
            <p class="text-sm text-purple-400/80 mt-2">Choose an assistant from the dropdown in the header.</p>
        </div>
      </div>
    </main>
    
    <div v-if="activeAgent" 
         class="sticky bottom-0 z-20 p-3 sm:p-4 bg-slate-900/70 dark:bg-black/50 backdrop-blur-lg border-t border-purple-500/30 dark:border-slate-700/50 voice-input-section">
      <VoiceInput
        :is-processing="isVoiceInputProcessing" 
        :audio-mode="voiceSettingsManager.settings.audioInputMode"
        :input-placeholder="activeAgent.inputPlaceholder || 'Speak or type your message...'"
        @transcription="onTranscriptionReceived"
        @update:audio-mode="(newMode: 'push-to-talk' | 'continuous' | 'voice-activation') => voiceSettingsManager.updateSetting('audioInputMode', newMode)"
        @processing="(status: boolean) => isVoiceInputProcessing = status"
      />
    </div>
    
    <Footer class="app-footer-private"/>
  </div>
</template>

<style scoped>
.private-home-wrapper {
  overflow-x: hidden;
}
.private-header-style {
  background-color: rgba(12, 5, 28, 0.6);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-bottom: 1px solid rgba(167, 139, 250, 0.2);
  box-shadow: 0 4px 30px rgba(0,0,0, 0.2);
}
.private-logo-filter {
  filter: hue-rotate(45deg) brightness(1.1) saturate(1.2) drop-shadow(0 0 8px theme('colors.purple.500'));
}
.animate-slow-spin { animation: spin_private_home 20s linear infinite; } /* Renamed animation */
@keyframes spin_private_home { to { transform: rotate(360deg); } }

.private-title-text {
  background-image: linear-gradient(to right, theme('colors.purple.300'), theme('colors.indigo.300'), theme('colors.pink.300'));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 10px rgba(192, 132, 252, 0.3);
}
.private-badge {
  display: inline-flex;
  align-items: center;
  padding-left: 0.625rem; padding-right: 0.625rem; 
  padding-top: 0.125rem; padding-bottom: 0.125rem;
  border-radius: 9999px;
  font-size: 0.75rem; line-height: 1rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  background-image: linear-gradient(to right, theme('colors.purple.600'), theme('colors.pink.600'), theme('colors.fuchsia.700'));
  color: theme('colors.white');
  border-width: 1px;
  border-color: rgba(167, 139, 250, 0.5); /* purple-400/50 */
  box-shadow: theme('boxShadow.lg'), 0 0 10px rgba(192, 132, 252, 0.3); /* shadow-purple-500/30 */
  animation: pulseBadge_private_home 2.5s infinite ease-in-out; /* Renamed animation */
}
@keyframes pulseBadge_private_home {
  0%, 100% { transform: scale(1); box-shadow: 0 0 5px rgba(192, 132, 252, 0.2); }
  50% { transform: scale(1.05); box-shadow: 0 0 15px rgba(192, 132, 252, 0.5); }
}
.header-icon-button {
  padding: 0.5rem;
  border-radius: 9999px;
  color: theme('colors.purple.300');
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
.header-icon-button:hover {
  color: theme('colors.white');
  background-color: rgba(126, 34, 206, 0.2); /* bg-purple-500/20 */
}
.header-icon-button:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px theme('colors.purple.400'), 0 0 0 2px rgba(126, 34, 206, 0.5); /* ring-purple-400 focus:ring-opacity-50 */
}
.dropdown-menu-private {
  background-color: rgba(30, 41, 59, 0.9); /* bg-slate-800/90 */
  backdrop-filter: blur(1rem); /* backdrop-blur-md */
  border-width: 1px;
  border-color: rgba(107, 33, 168, 0.5); /* border-purple-600/50 */
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: theme('boxShadow.2xl');
}
.dropdown-item-private {
  display: flex;
  align-items: center;
  padding-left: 0.75rem; padding-right: 0.75rem;
  padding-top: 0.625rem; padding-bottom: 0.625rem;
  text-align: left;
  color: theme('colors.gray.200');
  border-radius: 0.375rem; /* rounded-md */
  transition-property: background-color, color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.dropdown-item-private:hover {
  background-color: rgba(107, 33, 168, 0.4); /* hover:bg-purple-700/40 */
}
.dropdown-item-private.active {
  background-color: rgba(126, 34, 206, 0.5); /* bg-purple-600/50 */
  color: theme('colors.white');
  font-weight: 600;
}

.orbit-container { /* Copied from original */ }
.orbiting-shape { /* Copied from original */ }
@keyframes orbit_private_home { /* Renamed animation */
  from { transform: rotate(0deg) translateX(35vw) rotate(0deg); }
  to { transform: rotate(360deg) translateX(35vw) rotate(-360deg); }
}
@keyframes shapeTransform_private_home { /* Renamed animation */
  from { transform: scale(0.8) rotate(0deg); opacity: 0.7; }
  to { transform: scale(1.2) rotate(180deg); opacity: 1; }
}

.agent-view-container {
  background-color: rgba(18, 12, 38, 0.4);
  backdrop-filter: blur(8px) saturate(150%);
  min-height: 0;
}
.agent-content-layout { min-height: 0; }
.main-content-panel { flex: 3; min-width: 0; overflow-y: auto; }
.chat-log-panel { flex: 2; min-width: 0; background-color: rgba(10, 5, 20, 0.3); }
.voice-input-section { /* Basic structure, specific styles for VoiceInput.vue itself */ }
.app-footer-private {
  background-color: rgba(12, 5, 28, 0.7);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(167, 139, 250, 0.15);
}
.agent-ui-fade-enter-active, .agent-ui-fade-leave-active { transition: opacity 0.25s ease-in-out; }
.agent-ui-fade-enter-from, .agent-ui-fade-leave-to { opacity: 0; }
.dropdown-fade-enter-active, .dropdown-fade-leave-active { /* Copied from original */ }
.dropdown-fade-enter-from, .dropdown-fade-leave-to { /* Copied from original */ }

:deep(.agent-specific-ui-root) { height: 100%; width: 100%; display: flex; flex-direction: column; }

.main-content-panel::-webkit-scrollbar,
.chat-log-panel::-webkit-scrollbar { width: 8px; height: 8px; }
.main-content-panel::-webkit-scrollbar-track,
.chat-log-panel::-webkit-scrollbar-track {
    background-color: rgba(71, 85, 105, 0.2); /* slate-700/20 */
    border-radius: 0.375rem; /* rounded-md */
}
.main-content-panel::-webkit-scrollbar-thumb {
    background-color: rgba(167, 139, 250, 0.4); /* purple-400/40 */
    border-radius: 0.375rem; /* rounded-md */
}
.main-content-panel::-webkit-scrollbar-thumb:hover {
    background-color: rgba(167, 139, 250, 0.6); /* hover:bg-purple-400/60 */
}
.chat-log-panel::-webkit-scrollbar-thumb {
    background-color: rgba(56, 189, 248, 0.4); /* sky-400/40 */
    border-radius: 0.375rem; /* rounded-md */
}
.chat-log-panel::-webkit-scrollbar-thumb:hover {
    background-color: rgba(56, 189, 248, 0.6); /* hover:bg-sky-400/60 */
}
</style>