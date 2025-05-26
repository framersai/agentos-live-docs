// File: frontend/src/views/PrivateHome.vue
/**
 * @file Private Home View
 * @description Password-protected route with unlimited API usage, special UI styling,
 * and serves as a container for various specialized AI agent interfaces.
 * @version 1.0.0 - Initial structure for private access and agent selection.
 */

<template>
  <div class="private-home-wrapper min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 text-gray-100">
    <div class="fixed inset-0 overflow-hidden -z-10">
      <div class="orbit-container" v-for="i in 15" :key="`orbit-${i}`" :style="orbitStyle(i)">
        <div class="orbiting-shape" :style="shapeStyle(i)"></div>
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
                  <ShieldCheckIcon class="w-3.5 h-3.5 mr-1 text-purple-300" />PRIVATE
                </span>
              </h1>
              <p class="text-xs text-purple-300/80">Unlimited Access Mode Activated</p>
            </div>
          </div>
          
          <div class="flex items-center gap-2 md:gap-3">
            <button @click="toggleGlobalMute" :title="isGloballyMuted ? 'Unmute Audio' : 'Mute Audio'"
                    class="header-icon-button">
              <SpeakerXMarkIcon v-if="isGloballyMuted" class="w-5 h-5" />
              <SpeakerWaveIcon v-else class="w-5 h-5" />
            </button>
            
            <div class="relative">
              <button @click="showAgentSelector = !showAgentSelector" class="btn btn-secondary btn-sm flex items-center gap-1.5">
                <component :is="currentAgentIcon" class="w-4 h-4 text-purple-300" />
                {{ selectedAgentDetails.label }}
                <ChevronDownIcon class="w-4 h-4 transition-transform duration-200" :class="{'rotate-180': showAgentSelector}" />
              </button>
              <transition name="dropdown-fade">
                <div v-if="showAgentSelector" class="dropdown-menu-private absolute top-full right-0 mt-2 w-64 origin-top-right" ref="agentSelectorDropdownRef">
                  <div class="p-1">
                    <button
                      v-for="agent in availableAgents"
                      :key="agent.id"
                      @click="selectAgent(agent.id)"
                      class="dropdown-item-private w-full"
                      :class="{ 'active': selectedAgent === agent.id }"
                    >
                      <component :is="agent.icon" class="w-5 h-5 mr-2" :class="agent.iconClass" />
                      <span class="text-sm font-medium">{{ agent.label }}</span>
                    </button>
                  </div>
                </div>
              </transition>
            </div>

            <router-link to="/settings" class="header-icon-button" title="Settings">
              <Cog6ToothIcon class="w-5 h-5" />
            </router-link>
            <button @click="handleLogout" class="header-icon-button text-red-400 hover:text-red-300" title="Logout">
              <ArrowRightOnRectangleIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-grow relative z-10 container mx-auto px-4 py-8">
       <transition name="agent-view-transition" mode="out-in">
        <component
          :is="currentAgentComponent"
          :key="selectedAgent"
          v-bind="agentProps"
          @agent-event="handleAgentEvent"
        />
      </transition>
    </main>
    
    <footer class="py-4 text-center text-xs text-purple-400/60 border-t border-purple-500/10">
      Voice Chat Assistant - Private Session &copy; {{ new Date().getFullYear() }}
    </footer>
  </div>
</template>

<script setup lang="ts">
/**
 * @module PrivateHomeView
 * @description Script setup for the private home page.
 */
import { ref, computed, onMounted, onUnmounted, defineAsyncComponent, shallowRef, watch, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
import { AUTH_TOKEN_KEY } from '@/main'; // Assuming AUTH_TOKEN_KEY is exported from main.ts
import type { ToastService } from '@/types/services';
import {
  ShieldCheckIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, ChatBubbleLeftEllipsisIcon,
  UserCircleIcon, AcademicCapIcon, BriefcaseIcon, BookOpenIcon, SparklesIcon, ChevronDownIcon,
  SpeakerWaveIcon, SpeakerXMarkIcon,
} from '@heroicons/vue/24/outline';

// Define types for agents
type AgentId = 'general' | 'diary' | 'tutor' | 'coding_interviewer' | 'business_meeting';

interface AgentDefinition {
  id: AgentId;
  label: string;
  icon: any; // Vue component type
  iconClass: string;
  component: any; // Async Vue component for the agent's UI
  description: string; // Short description for selector
  promptMode: string; // Backend mode for chatAPI
}

const toast = inject<ToastService>('toast');
const router = useRouter();

// --- Agent Configuration & Management ---
const availableAgents = shallowRef<AgentDefinition[]>([
  {
    id: 'general',
    label: 'General Assistant',
    icon: ChatBubbleLeftEllipsisIcon,
    iconClass: 'text-sky-400',
    component: defineAsyncComponent(() => import('@/components/agents/GeneralAgentView.vue')),
    description: 'Versatile AI for various queries.',
    promptMode: 'general',
  },
  {
    id: 'diary',
    label: 'Interactive Diary',
    icon: BookOpenIcon,
    iconClass: 'text-emerald-400',
    component: defineAsyncComponent(() => import('@/components/agents/DiaryAgentView.vue')),
    description: 'Reflect and capture your thoughts.',
    promptMode: 'diary',
  },
  {
    id: 'tutor',
    label: 'AI Tutor',
    icon: AcademicCapIcon,
    iconClass: 'text-amber-400',
    component: defineAsyncComponent(() => import('@/components/agents/TutorAgentView.vue')),
    description: 'Learn and understand complex topics.',
    promptMode: 'tutor',
  },
  {
    id: 'coding_interviewer',
    label: 'Coding Interviewer',
    icon: UserCircleIcon, // Or CodeBracketSquareIcon
    iconClass: 'text-rose-400',
    component: defineAsyncComponent(() => import('@/components/agents/CodingInterviewerAgentView.vue')),
    description: 'Practice for technical interviews.',
    promptMode: 'coding_interviewer', // or 'coding' with interviewMode=true in payload
  },
  {
    id: 'business_meeting',
    label: 'Meeting Assistant',
    icon: BriefcaseIcon,
    iconClass: 'text-cyan-400',
    component: defineAsyncComponent(() => import('@/components/agents/BusinessMeetingAgentView.vue')),
    description: 'Summarize and analyze meeting notes.',
    promptMode: 'meeting', // or 'business_meeting'
  },
  // Add more agents here
]);

const selectedAgent = useStorage<AgentId>('vca-selected-agent', 'general'); // Persist selection

const selectedAgentDetails = computed(() => {
  return availableAgents.value.find(agent => agent.id === selectedAgent.value) || availableAgents.value[0];
});

const currentAgentComponent = computed(() => selectedAgentDetails.value.component);
const currentAgentIcon = computed(() => selectedAgentDetails.value.icon || SparklesIcon);

// Props to pass to the dynamic agent component
const agentProps = computed(() => ({
  agentId: selectedAgent.value,
  agentConfig: selectedAgentDetails.value,
  // other common props like conversation history, user settings can be added here
}));

const showAgentSelector = ref(false);
const agentSelectorDropdownRef = ref<HTMLElement | null>(null);


/**
 * Handles agent selection from the dropdown.
 * @param {AgentId} agentId - The ID of the selected agent.
 */
const selectAgent = (agentId: AgentId) => {
  selectedAgent.value = agentId;
  showAgentSelector.value = false;
  toast?.add({type: 'info', title: 'Agent Switched', message: `Switched to ${selectedAgentDetails.value.label}`, duration: 2000});
  // Potentially clear conversation history or handle context switching here
};

/**
 * Handles events emitted from the active agent component.
 * @param {any} eventData - Data associated with the agent event.
 */
const handleAgentEvent = (eventData: any) => {
  console.log('PrivateHome: Event from agent received:', eventData);
  // Process agent-specific events if needed
};

// --- UI State & Actions ---
const isGloballyMuted = useStorage<boolean>('vca-global-mute', false);

/**
 * Toggles the global mute state for application audio output.
 */
const toggleGlobalMute = () => {
  isGloballyMuted.value = !isGloballyMuted.value;
  // This should trigger an event or update a global service that audio-producing components listen to.
  // For now, it's a reactive state that components can consume.
  toast?.add({
    type: 'info',
    title: isGloballyMuted.value ? 'Audio Muted' : 'Audio Unmuted',
    duration: 1500
  });
};

/**
 * Handles user logout.
 */
const handleLogout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  // Reset any other persisted user state if necessary
  toast?.add({ type: 'success', title: 'Logged Out', message: 'You have been successfully logged out.'});
  router.push({ name: 'Login' });
};

// --- Background Animation Styling ---
/**
 * Generates random styles for orbiting background shapes.
 * @param {number} i - Index for varying styles.
 * @returns {object} CSS style object.
 */
const orbitStyle = (i: number) => ({
  animationDuration: `${20 + Math.random() * 30}s`,
  animationDelay: `-${Math.random() * 50}s`,
  transform: `rotate(${Math.random() * 360}deg) translateX(${20 + Math.random() * 30}vw) rotate(-${Math.random() * 360}deg)`,
  opacity: 0.05 + Math.random() * 0.1,
});

const shapeStyle = (i: number) => ({
  width: `${20 + Math.random() * 80}px`,
  height: `${20 + Math.random() * 80}px`,
  backgroundColor: `hsl(${180 + Math.random() * 120}, 70%, 60%)`,
  animationDuration: `${10 + Math.random() * 20}s`,
  borderRadius: Math.random() > 0.5 ? '50%' : `${Math.random()*50}% ${Math.random()*50}%`,
});

// Close dropdown when clicking outside
const handleClickOutsideAgentSelector = (event: MouseEvent) => {
  if (agentSelectorDropdownRef.value && !agentSelectorDropdownRef.value.contains(event.target as Node)) {
    showAgentSelector.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutsideAgentSelector, true);
});
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutsideAgentSelector, true);
});

</script>

<style scoped>
.private-home-wrapper {
  /* Ensure text is generally light against the dark background */
  color: theme('colors.gray.200');
}

/* Header Styling */
.private-header-style {
  background-color: rgba(12, 5, 28, 0.6); /* Deep purple-ish dark */
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-bottom: 1px solid rgba(167, 139, 250, 0.2); /* theme('colors.purple.400 / 20%') */
  box-shadow: 0 4px 30px rgba(0,0,0, 0.2);
}

.private-logo-filter {
  filter: hue-rotate(45deg) brightness(1.1) saturate(1.2) drop-shadow(0 0 8px theme('colors.purple.500'));
}

.animate-slow-spin {
  animation: spin 20s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.private-title-text {
  background-image: linear-gradient(to right, theme('colors.purple.300'), theme('colors.indigo.300'), theme('colors.pink.300'));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 10px rgba(192, 132, 252, 0.3); /* purple-400 with opacity */
}

.private-badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wider
         bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-700 text-white
         border border-purple-400/50 shadow-lg shadow-purple-500/30;
  animation: pulseBadge 2.5s infinite ease-in-out;
}
@keyframes pulseBadge {
  0%, 100% { transform: scale(1); box-shadow: 0 0 5px rgba(192, 132, 252, 0.2); }
  50% { transform: scale(1.05); box-shadow: 0 0 15px rgba(192, 132, 252, 0.5); }
}

.header-icon-button {
  @apply p-2 rounded-full text-purple-300 hover:text-white hover:bg-purple-500/20 transition-all duration-200
         focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50;
}

/* Agent Selector Dropdown */
.dropdown-menu-private {
  @apply bg-slate-800/90 backdrop-blur-md border border-purple-600/50 rounded-lg shadow-2xl;
}
.dropdown-item-private {
  @apply flex items-center px-3 py-2.5 text-left text-gray-200 hover:bg-purple-700/40 rounded-md transition-colors duration-150;
}
.dropdown-item-private.active {
  @apply bg-purple-600/50 text-white font-semibold;
}

/* Background Animation */
.orbit-container {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 2px; /* Line for orbit path, not visible */
  height: 2px; /* Line for orbit path, not visible */
  animation: orbit ease-in-out infinite;
  transform-origin: center center;
}

.orbiting-shape {
  position: absolute;
  left: 50%; /* Center of the container */
  top: 50%; /* Center of the container */
  transform: translate(-50%, -50%); /* Adjust to truly center the shape itself */
  border-radius: 50%;
  animation: shapeTransform ease-in-out infinite alternate; /* Optional inner animation */
  box-shadow: 0 0 15px currentColor, 0 0 25px currentColor;
}

@keyframes orbit {
  from { transform: rotate(0deg) translateX(35vw) rotate(0deg); } /* translateX for orbit radius */
  to { transform: rotate(360deg) translateX(35vw) rotate(-360deg); }
}

@keyframes shapeTransform { /* Example inner animation for shapes */
  from { transform: scale(0.8) rotate(0deg); opacity: 0.7; }
  to { transform: scale(1.2) rotate(180deg); opacity: 1; }
}

/* Page Transitions for Agent Views */
.agent-view-transition-enter-active,
.agent-view-transition-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.agent-view-transition-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}
.agent-view-transition-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
}

/* Dropdown transition (reusable) */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.15s ease-out, transform 0.15s ease-out;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>