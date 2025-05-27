// File: frontend/src/views/PrivateHome.vue
/**
 * @file PrivateHome.vue
 * @description Authenticated home view that hosts the AI agent framework.
 * This view serves as the main application interface for logged-in users,
 * allowing them to interact with various AI agents, manage settings, and view chat logs.
 * Style updated for a visually stunning, elegant, minimal, analog holographic, and futuristic retro theme.
 * @version 1.4.0
 * @author Voice Coding Assistant Team
 *
 * @notes
 * - Version 1.4.0: Major style overhaul for new theme. Replaced default Tailwind colors with theme variables.
 * Leverages global styles from main.css for buttons and other components. Enhanced background effects.
 * - Version 1.3.1: Corrected dynamic style types to CSSProperties.
 * Explicitly typed newMode parameter in @update:audio-mode event.
 */

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject, watch, shallowRef, type Component, type CSSProperties } from 'vue';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
import { AUTH_TOKEN_KEY } from '@/utils/constants';
import type { ToastService } from '@/services/services';
import { agentService, type AgentId, type IAgentDefinition } from '@/services/agent.service';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore } from '@/store/chat.store';
import { voiceSettingsManager, type AudioInputMode } from '@/services/voice.settings.service';

import MainContentView from '@/components/agents/common/MainContentView.vue';
import AgentChatLog from '@/components/agents/common/AgentChatLog.vue';
import Footer from '@/components/Footer.vue';
import VoiceInput from '@/components/VoiceInput.vue';

import {
  ShieldCheckIcon as ShieldCheckIconOutline,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  SparklesIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from '@heroicons/vue/24/outline';
// For a more "tech" feel, consider solid icons for some actions
import { Cog6ToothIcon as Cog6ToothIconSolid } from '@heroicons/vue/24/solid';


const toast = inject<ToastService>('toast');
const router = useRouter();
const agentStore = useAgentStore();
const chatStore = useChatStore();

const currentAllAgentDefinitions = shallowRef<Readonly<IAgentDefinition[]>>(agentService.getAllAgents());
const activeAgentId = computed<AgentId>(() => agentStore.activeAgentId);
const activeAgent = computed<Readonly<IAgentDefinition> | undefined>(() => agentStore.activeAgent);
const currentAgentUiComponent = computed<Component | undefined>(() => activeAgent.value?.uiComponent);

const showAgentSelector = ref(false);
const agentSelectorDropdownRef = ref<HTMLElement | null>(null);
const agentViewRef = ref<any>(null); // Ref to the dynamic agent component instance

const selectAgent = (agentId: AgentId): void => {
  if (agentStore.activeAgentId !== agentId) {
    agentStore.setActiveAgent(agentId);
    toast?.add({type: 'info', title: 'Agent Switched', message: `Switched to ${activeAgent.value?.label || agentId}`, duration: 2500});
  }
  showAgentSelector.value = false;
};

const handleAgentEvent = (eventData: any): void => {
  console.log('[PrivateHome] Event from agent view received:', eventData);
  // Potentially handle events like 'requestGlobalUiChange', 'showModal', etc.
};

watch(() => voiceSettingsManager.settings.currentAppMode, (newMode: string | null) => {
    if (newMode && newMode as AgentId !== activeAgentId.value) {
        const newAgentDef = agentService.getAgentById(newMode as AgentId);
        if (newAgentDef) {
            agentStore.setActiveAgent(newAgentDef.id);
        } else {
            console.warn(`[PrivateHome] Attempted to switch to an unknown agent mode: ${newMode}.`);
        }
    }
}, { deep: true });

const isGloballyMuted = useStorage<boolean>('vca-global-mute', false);

const toggleGlobalMuteHandler = (): void => {
  isGloballyMuted.value = !isGloballyMuted.value;
  voiceSettingsManager.updateSetting('autoPlayTts', !isGloballyMuted.value);
  toast?.add({
    type: 'info',
    title: isGloballyMuted.value ? 'Audio Output Muted' : 'Audio Output Unmuted',
    message: isGloballyMuted.value ? 'TTS will not play automatically.' : 'TTS will play responses.',
    duration: 2500
  });
};

const handleLogoutHandler = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  voiceSettingsManager.resetToDefaults();
  chatStore.clearAllAgentData(); // Clears all agent data
  const defaultPublicAgent = agentService.getDefaultPublicAgent(); // Should ideally be configurable
  if (defaultPublicAgent) {
      agentStore.setActiveAgent(defaultPublicAgent.id);
  }
  toast?.add({ type: 'success', title: 'Logged Out', message: 'You have been successfully logged out.'});
  router.push({ name: 'PublicHome' }); // Redirect to PublicHome after logout
};

// Enhanced background effect functions
const orbitStyleProvider = (index: number): CSSProperties => ({
  animationDuration: `${25 + Math.random() * 40}s`, // Slower, more majestic
  animationDelay: `-${Math.random() * 60}s`,
  // Make orbits more varied and appear further away
  transform: `rotate(${Math.random() * 360}deg) translateX(${20 + Math.random() * 35}vmax) translateY(${Math.random() * 15 - 7.5}vmax) rotate(-${Math.random() * 270}deg)`,
  opacity: 0.02 + Math.random() * 0.05, // More subtle
  zIndex: index % 2 === 0 ? -1 : -2, // Create depth layers for orbits
});

const shapeStyleProvider = (index: number): CSSProperties => ({
  width: `${40 + Math.random() * 120}px`, // Slightly larger shapes
  height: `${40 + Math.random() * 120}px`,
  // Use theme's primary and accent hues for holographic feel
  backgroundColor: `hsla(${Math.random() > 0.5 ? 'var(--primary-hue)' : 'var(--accent-hue)'}, ${60 + Math.random() * 20}%, ${55 + Math.random() * 15}%, ${0.3 + Math.random() * 0.3})`,
  animationDuration: `${20 + Math.random() * 30}s`,
  borderRadius: Math.random() > 0.4 ? '50%' : `${Math.random()*30 + 20}% ${Math.random()*30 + 20}%`, // More varied shapes
  filter: `blur(${1 + Math.random() * 3}px) saturate(1.2)`, // Subtle blur and saturation
  boxShadow: `0 0 ${10 + Math.random() * 20}px hsla(${Math.random() > 0.5 ? 'var(--primary-hue)' : 'var(--accent-hue)'}, 70%, 60%, 0.3)`, // Soft glow
});


const handleClickOutsideAgentSelector = (event: MouseEvent): void => {
  if (agentSelectorDropdownRef.value && !agentSelectorDropdownRef.value.contains(event.target as Node)) {
    showAgentSelector.value = false;
  }
};

const isVoiceInputProcessing = ref(false); // For UI feedback

const onTranscriptionReceived = (transcription: string): void => {
  if (transcription.trim() && agentViewRef.value && typeof agentViewRef.value.handleNewUserInput === 'function') {
    agentViewRef.value.handleNewUserInput(transcription);
  } else if (transcription.trim()) {
    console.warn(`[PrivateHome] Active agent view (ref: ${agentViewRef.value ? 'exists' : 'null'}) or its 'handleNewUserInput' method is not available. Transcription: "${transcription}"`);
    toast?.add({type: 'warning', title: 'Input Not Processed', message: 'The current agent may not be configured to handle this input type right now.'});
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutsideAgentSelector, true);
  const initialModeFromSettings = voiceSettingsManager.settings.currentAppMode as AgentId;
  const agentToSet = agentService.getAgentById(initialModeFromSettings)
                      ? initialModeFromSettings
                      : agentService.getDefaultAgent().id;

  if (!agentStore.activeAgent || agentStore.activeAgentId !== agentToSet) {
    agentStore.setActiveAgent(agentToSet);
  }
  isGloballyMuted.value = !voiceSettingsManager.settings.autoPlayTts; // Sync with persisted setting
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutsideAgentSelector, true);
});

</script>

<template>
  <div class="private-home-wrapper min-h-screen flex flex-col bg-neutral-bg text-neutral-text analog-scanlines">
    <div class="fixed inset-0 overflow-hidden -z-10" aria-hidden="true">
      <div class="orbit-container" v-for="i in 12" :key="`orbit-${i}`" :style="orbitStyleProvider(i)">
        <div class="orbiting-shape" :style="shapeStyleProvider(i)"></div>
      </div>
       <div class="fixed inset-0 bg-holo-grid bg-holo-grid-size opacity-[0.03] dark:opacity-[0.05] animation-holo-grid"></div>
    </div>

    <main class="flex-grow relative z-10 flex flex-col p-2 sm:p-4 overflow-hidden">
      <div v-if="activeAgent" class="flex-grow flex flex-col agent-view-container glass-pane rounded-[var(--radius-2xl)]">
        <div class="flex-grow flex flex-col lg:flex-row overflow-hidden agent-content-layout">
          <MainContentView
            :agent="activeAgent"
            class="main-content-panel lg:border-r border-neutral-border-dark/30 custom-scrollbar-private"
            aria-labelledby="main-content-title"
            role="region"
          >
              <h2 id="main-content-title" class="sr-only">{{ activeAgent.label }} Main Content</h2>
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
            class="chat-log-panel flex flex-col custom-scrollbar-private"
            role="log"
            :aria-label="`Chat history with ${activeAgent.label}`"
          />
        </div>
      </div>
      <div v-else class="flex-grow flex items-center justify-center">
        <div class="text-center p-8 glass-pane rounded-[var(--radius-xl)] shadow-holo-md">
            <SparklesIcon class="w-16 h-16 mx-auto text-accent-light/70 mb-4 animate-holo-pulse" aria-hidden="true"/>
            <p class="text-xl text-accent-light font-display">Select an Agent to Begin</p>
            <p class="text-sm text-neutral-text-secondary mt-2">Choose an assistant from the dropdown in the header.</p>
        </div>
      </div>
    </main>

    <div v-if="activeAgent"
         class="sticky bottom-0 z-20 p-3 sm:p-4 voice-input-section-private"
         role="complementary" aria-label="Voice and text input controls">
      <VoiceInput
        :is-processing="isVoiceInputProcessing"
        :audio-mode="voiceSettingsManager.settings.audioInputMode"
        :input-placeholder="activeAgent.inputPlaceholder || 'Speak or type your message...'"
        @transcription="onTranscriptionReceived"
        @update:audio-mode="(newMode: AudioInputMode) => voiceSettingsManager.updateSetting('audioInputMode', newMode)"
        @processing="(status: boolean) => isVoiceInputProcessing = status"
        :class="[
            'transition-all duration-300 ease-out',
            isVoiceInputProcessing ? 'shadow-holo-lg border-accent-focus' : 'shadow-interactive hover:shadow-holo-md',
        ]"
      />
    </div>

    <!-- <Footer class="app-footer-private"/> -->
  </div>
</template>

<style scoped>
.private-home-wrapper {
  overflow-x: hidden; /* Prevent horizontal scroll from background elements */
  /* background-color is set by Tailwind theme 'bg-neutral-bg' which uses CSS vars */
  /* .analog-scanlines is a global utility from main.css */
}

/* .header-glass is global from main.css */

.private-logo-filter {
  filter: drop-shadow(0 0 10px hsl(var(--primary-focus-hsl)/ 0.6)) drop-shadow(0 0 20px hsl(var(--accent-focus-hsl)/ 0.4)) saturate(1.2) brightness(1.1);
  animation: spin_private_home 25s linear infinite;
}
@keyframes spin_private_home { to { transform: rotate(360deg); } }

.private-title-text {
  /* Using text-glow-primary from main.css utility layer */
  @apply text-glow-primary font-display; /* Ensure display font is used */
  color: hsl(var(--primary-light-hsl)); /* Base color for the glow */
}
.private-badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wider
         border border-holo-cyan/50 text-holo-cyan
         bg-holo-cyan/10 shadow-holo-sm animate-holo-pulse;
  animation-duration: 3s;
}

.header-icon-button {
  @apply p-2 rounded-full text-neutral-text-muted hover:text-accent-light
         focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-bg
         transition-all duration-[var(--duration-quick)] ease-[var(--ease-out-quad)] hover:bg-accent-dark/20 hover:shadow-holo-sm;
}


.dropdown-menu-private {
  /* .glass-pane and .rounded-[var(--radius-lg)] .shadow-holo-lg applied in template */
  /* Additional specific dropdown styling if needed beyond glass-pane */
   @apply border-none; /* glass-pane already has border */
}

.dropdown-item-private {
  @apply flex items-start px-3 py-2.5 text-left text-neutral-text-secondary rounded-[var(--radius-md)]
         transition-all duration-[var(--duration-quick)] ease-[var(--ease-out-quad)]
         hover:bg-primary-700/50 hover:text-primary-light; /* Darker primary for hover */
}
.dropdown-item-private.active {
  @apply bg-primary-600/70 text-white font-semibold shadow-inner shadow-primary-900/50;
}
.dropdown-item-private .icon-base {
   @apply text-accent-focus group-hover:text-accent-light transition-colors; /* CORRECTED: text-accent-400 to text-accent-focus */
}
.dropdown-item-private.active .icon-base {
   @apply text-accent-light;
}

.orbit-container { /* Styles are applied via :style binding in template for variability */
  position: absolute;
  left: 50%;
  top: 50%;
  width: 1px;
  height: 1px;
  animation-name: orbit_private_home;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.orbiting-shape { /* Styles are applied via :style binding in template for variability */
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: center center;
  animation-name: shapeTransform_private_home;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
@keyframes orbit_private_home {
  from { transform: rotate(0deg) translateX(35vmax) rotate(0deg); }
  to { transform: rotate(360deg) translateX(35vmax) rotate(-360deg); }
}
@keyframes shapeTransform_private_home { /* More subtle and flowing */
  from { transform: scale(0.7) rotate(-30deg); opacity: 0.6; }
  to { transform: scale(1.3) rotate(60deg); opacity: 1; }
}

.agent-view-container {
  /* .glass-pane and .rounded-[var(--radius-2xl)] are applied in template */
  min-height: 0; /* For flex child to shrink properly */
  @apply flex flex-col border-none; /* glass-pane provides border/bg */
}
.agent-content-layout {
  min-height: 0; /* For flex child to shrink properly */
  @apply flex-grow;
}
.main-content-panel {
  flex: 3 1 0%; /* Give more space to main content */
  min-width: 0; /* Prevent flex item overflow */
  @apply relative overflow-y-auto; /* Ensure custom-scrollbar-private utility applies */
}
.chat-log-panel {
  flex: 2 1 0%; /* Slightly less space for chat log */
  min-width: 0; /* Prevent flex item overflow */
  @apply bg-neutral-bg-elevated/20 backdrop-blur-sm overflow-y-auto p-2 sm:p-3; /* Slightly different bg for chat */
}

/* Layout adjustments for larger screens if needed */
@media (min-width: 1024px) {
  .main-content-panel, .chat-log-panel {
     max-height: calc(100vh - var(--header-height) - var(--footer-height) - 5rem); /* Adjust 5rem for voice input & padding */
  }
}


.voice-input-section-private {
  @apply bg-neutral-bg-elevated/50 backdrop-blur-xl border-t border-primary-dark/30 shadow-2xl shadow-black/50;
}
.app-footer-private {
  @apply bg-neutral-bg-elevated/30 backdrop-blur-md border-t border-primary-dark/20 text-neutral-text-muted;
}

.agent-ui-fade-enter-active,
.agent-ui-fade-leave-active {
  transition: opacity var(--duration-smooth) var(--ease-out-quad);
}
.agent-ui-fade-enter-from,
.agent-ui-fade-leave-to {
  opacity: 0;
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

/* Ensure agent-specific UI root takes full height/width within its container */
:deep(.agent-specific-ui-root) {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Let the component manage its own internal scrolling if needed */
}

/* Custom scrollbar for private home theme, can also rely on global from main.css if preferred */
.custom-scrollbar-private::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.custom-scrollbar-private::-webkit-scrollbar-track {
  background-color: hsl(var(--primary-dark-hsl) / 0.1);
  border-radius: var(--radius-sm);
}
.custom-scrollbar-private::-webkit-scrollbar-thumb {
  background-color: hsl(var(--accent-dark-hsl) / 0.5);
  border-radius: var(--radius-full);
  border: 2px solid transparent;
  background-clip: content-box;
  transition: background-color var(--duration-quick) ease;
}
.custom-scrollbar-private::-webkit-scrollbar-thumb:hover {
  background-color: hsl(var(--accent-color-hsl) / 0.7);
}

/* Removing locally scoped .btn-primary, .btn-secondary as main.css provides these */
</style>