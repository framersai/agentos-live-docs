// File: frontend/src/components/Header.vue
<script setup lang="ts">
/* ────────────────── imports ────────────────── */
import {
  ref, computed, watch, onMounted, onUnmounted,
  defineAsyncComponent, type Ref, type PropType,
} from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { useUiStore }     from '@/store/ui.store';
import { useAuth }        from '@/composables/useAuth';
import { useChatStore }  from '@/store/chat.store';
import { useAgentStore } from '@/store/agent.store';
import type { IAgentDefinition } from '@/services/agent.service';

import AnimatedLogoIcon   from '@/components/ui/AnimatedLogoIcon.vue';
import AnimatedTextLogo   from '@/components/ui/AnimatedTextLogo.vue';

/* 100 % ASYNC  (wrapped with defineAsyncComponent) */
const ThemeDropdown    = defineAsyncComponent(() => import('./header/ThemeSelectionDropdown.vue'));
const UserDropdown     = defineAsyncComponent(() => import('./header/UserSettingsDropdown.vue'));
const VoiceDropdown    = defineAsyncComponent(() => import('./header/VoiceControlsDropdown.vue'));
const SiteMenuDropdown = defineAsyncComponent(() => import('./header/SiteMenuDropdown.vue'));
const AgentHubTrigger  = defineAsyncComponent(() => import('./header/AgentHubTrigger.vue'));
const AgentHub         = defineAsyncComponent(() => import('@/components/agents/AgentHub.vue'));
const MobileNavPanel   = defineAsyncComponent(() => import('./header/MobileNavPanel.vue'));


import {
  Bars3Icon, XMarkIcon,
  ArrowsPointingOutIcon, ArrowsPointingInIcon,
  SpeakerWaveIcon, SpeakerXMarkIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/vue/24/outline';

/* ────────────────── props / emits ────────────────── */
const props = defineProps({
  /** STT: user microphone live */
  isUserListening:       { type: Boolean as PropType<boolean>, default: false },
  /** AI is streaming text or TTS speaking */
  isAssistantSpeaking: { type: Boolean as PropType<boolean>, default: false },
  /** VoiceInput.vue isActive (STT processing audio, not just wake word listening) */
  isSttActiveProcessing: { type: Boolean as PropType<boolean>, default: false },
  /** VoiceInput.vue isListeningForWakeWord (VAD mode) */
  isVadListeningWakeWord: { type: Boolean as PropType<boolean>, default: false },
});

const emit = defineEmits<{
  (e:'toggle-fullscreen'): void;
  (e:'logout'): void;
  (e:'clear-chat-and-session'): void;
  (e:'show-prior-chat-log'): void;
}>();

/* ────────────────── stores / state ────────────────── */
const uiStore    = useUiStore();
const auth       = useAuth();
const chatStore  = useChatStore();
const agentStore = useAgentStore();

const router = useRouter();
const route  = useRoute();

const activeAgent = computed<IAgentDefinition|undefined>(() => agentStore.activeAgent);

// Combined AI active state (TTS or LLM text streaming)
const isAiOutputActive   = computed(() => props.isAssistantSpeaking || chatStore.isMainContentStreaming);

// User is providing input (mic active for STT, or VAD listening for wake word)
// isUserListening prop already covers general STT activity.
// isVadListeningWakeWord indicates a more passive "listening" state.
const isUserProvidingInput = computed(() => props.isUserListening || props.isVadListeningWakeWord);


const isFullscreen = computed(() => uiStore.isBrowserFullscreenActive);
const isMuted : Ref<boolean> = ref(false); // TODO: Connect this to actual TTS mute in voiceSettingsManager

const isMobileMenu   = ref(false);
const isAgentHubOpen = ref(false);

/* --- Hearing SVG State --- */
const hearingSvgStateClasses = computed(() => {
  // State priority: AI Speaking (TTS) > User Listening > AI Responding (Text) > Idle
  if (props.isAssistantSpeaking) { // TTS is active
    return 'hearing-ai-speaking';
  }
  if (props.isUserListening) { // User's mic is actively capturing/processing for STT
    return 'hearing-user-listening-stt';
  }
  if (props.isVadListeningWakeWord) { // VAD listening for wake word (more passive)
    return 'hearing-user-listening-vad-wake';
  }
  if (chatStore.isMainContentStreaming) { // AI is streaming text
    return 'hearing-ai-streaming-text';
  }
  return 'hearing-idle'; // Default idle state
});


/* --- intro animation: wait until page fully rendered --- */
const introFlagKey = 'vca-hdr-played';
const playIntroNow = ref(false);

function startIntroIfFirstVisit(){
  if (sessionStorage.getItem(introFlagKey)) return;
  sessionStorage.setItem(introFlagKey,'1');
  requestAnimationFrame(() => requestAnimationFrame(() => { playIntroNow.value = true; }));
}

onMounted(() => {
  if (document.readyState === 'complete') {
    startIntroIfFirstVisit();
  } else {
    window.addEventListener('load', startIntroIfFirstVisit, { once:true });
  }
});

/* ────────────────── navigation helpers ────────────────── */
function gotoHome(){
  isMobileMenu.value = false;
  route.path === '/' ? window.location.reload() : router.push('/');
}
function keyHome(e:KeyboardEvent){ if(e.key==='Enter') gotoHome(); }

function openAgentHub(){ isMobileMenu.value=false; isAgentHubOpen.value=true; }
function closeAgentHub(){ isAgentHubOpen.value=false; }

/* disable body scroll when overlay open */
watch([isMobileMenu,isAgentHubOpen],([m,h])=>{
  document.body.classList.toggle('overflow-hidden-by-app-overlay', m||h);
});
onUnmounted(()=>document.body.classList.remove('overflow-hidden-by-app-overlay'));
</script>

<template>
  <header class="vca-header"
          :class="{
            'intro-play' : playIntroNow,
            'ai-output-active'  : isAiOutputActive, // General AI output glow for header
            'user-input-active': isUserProvidingInput, // General User input glow for header
            'fullscreen' : isFullscreen,
            'hub-open'   : isAgentHubOpen
          }">
    <div class="hdr-wrap">
      <div class="logo-block" role="button" tabindex="0"
           aria-label="Voice Chat Assistant — Home"
           @click="gotoHome" @keydown="keyHome">

        <AnimatedLogoIcon
          :is-user-listening="isUserProvidingInput"
          :is-ai-speaking-or-processing="isAiOutputActive"
          :is-mobile-context="uiStore.isSmallScreen"/>

        <AnimatedTextLogo :play="playIntroNow"/>
      </div>

      <div class="hear-wrap" :class="hearingSvgStateClasses"
           :title="
             props.isAssistantSpeaking ? 'AI Speaking…' :
             props.isUserListening ? 'User Listening (STT)...' :
             props.isVadListeningWakeWord ? 'Listening for Wake Word...' :
             chatStore.isMainContentStreaming ? 'AI Responding…' : 'Idle'
           ">
        <svg
          class="hear-icon-svg"
          width="100%"
          height="100%"
          viewBox="0 0 800 600"
          xmlns="http://www.w3.org/2000/svg"
          style="background-color: transparent;"
        >
          <defs>
            <radialGradient id="corePulseGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stop-color="#FF8C00">
                <animate attributeName="stop-color" values="#FF8C00;#FF7F50;#FF69B4;#DA70D6;#87CEEB;#AFEEEE;#FF8C00" dur="60s" repeatCount="indefinite" />
              </stop>
              <stop offset="30%" stop-color="#FF4500">
                <animate attributeName="stop-color" values="#FF7F50;#FF69B4;#DA70D6;#87CEEB;#AFEEEE;#FF8C00;#FF7F50" dur="60s" begin="-10s" repeatCount="indefinite" />
              </stop>
              <stop offset="70%" stop-color="#FF69B4" stop-opacity="0.8">
                <animate attributeName="stop-color" values="#FF69B4;#DA70D6;#87CEEB;#AFEEEE;#FF8C00;#FF7F50;#FF69B4" dur="60s" begin="-20s" repeatCount="indefinite" />
                <animate attributeName="stop-opacity" values="0.8;0.3;0.7;0.4;0.8" dur="20s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stop-color="#1A1A2E" stop-opacity="0">
                <animate attributeName="stop-color" values="#DA70D6;#87CEEB;#AFEEEE;#FF8C00;#FF7F50;#FF69B4;#DA70D6" dur="60s" begin="-30s" repeatCount="indefinite" />
              </stop>
            </radialGradient>

            <linearGradient id="rippleWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#00BFFF">
                <animate attributeName="stop-color" values="#00BFFF;#4682B4;#32CD32;#ADFF2F;#FFD700;#FFA500;#FF6347;#DC143C;#00BFFF" dur="18s" repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stop-color="#32CD32">
                <animate attributeName="stop-color" values="#32CD32;#ADFF2F;#FFD700;#FFA500;#FF6347;#DC143C;#00BFFF;#4682B4;#32CD32" dur="18s" begin="-4.5s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stop-color="#FFD700">
                <animate attributeName="stop-color" values="#FFD700;#FFA500;#FF6347;#DC143C;#00BFFF;#4682B4;#32CD32;#ADFF2F;#FFD700" dur="18s" begin="-9s" repeatCount="indefinite" />
              </stop>
            </linearGradient>

            <radialGradient id="sparkleGradient" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stop-color="rgba(220, 220, 255, 0.7)">
                <animate attributeName="stop-color" values="rgba(220, 220, 255, 0.7);rgba(200, 255, 200, 0.6);rgba(255, 200, 200, 0.7);rgba(200,200,255,0.5);rgba(220, 220, 255, 0.7)" dur="14s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stop-color="rgba(100, 100, 150, 0)">
                <animate attributeName="stop-color" values="rgba(100,100,150,0);rgba(80,150,80,0);rgba(150,80,80,0);rgba(100,80,120,0);rgba(100,100,150,0)" dur="14s" repeatCount="indefinite" />
              </stop>
            </radialGradient>

            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="rippleGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="rippleBlur"/>
              <feMerge>
                <feMergeNode in="rippleBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <g transform="translate(400, 300)" class="hearing-svg-main-group">
            <g id="centralHerElement" filter="url(#softGlow)">
              <circle class="core-orb" cx="0" cy="0" r="40" fill="url(#corePulseGradient)" opacity="0.9">
                <animate attributeName="r" values="39;41;39" dur="15s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.42 0 0.58 1;0.42 0 0.58 1"/>
                <animateTransform attributeName="transform" type="scale" values="1;1.03;1" dur="15s" repeatCount="indefinite" additive="sum" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.42 0 0.58 1;0.42 0 0.58 1"/>
              </circle>
              <g id="petalPaths" class="petal-paths-group">
                <path d="M0,-35 Q18,-50 35,-35 T70,-35 Q50,-18 35,0 T0,0 Q-18,-18 -35,0 T-70,-35 Q-50,-50 -35,-35 T0,-35Z" fill="#87CEEB" opacity="0">
                    <animateTransform attributeName="transform" type="scale" values="0.9;1.05;0.95;1.02;0.9" dur="25s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"/>
                    <animate attributeName="opacity" values="0;0;0.5;0.5;0;0" dur="25s" begin="0s" repeatCount="indefinite" keyTimes="0;0.35;0.45;0.55;0.65;1"/>
                    <animate attributeName="fill" values="#87CEEB;#ADD8E6;#B0E0E6;#87CEEB" dur="70s" repeatCount="indefinite" />
                </path>
                <path d="M0,-35 Q18,-50 35,-35 T70,-35 Q50,-18 35,0 T0,0 Q-18,-18 -35,0 T-70,-35 Q-50,-50 -35,-35 T0,-35Z" fill="#DA70D6" opacity="0" transform="rotate(120)">
                    <animateTransform attributeName="transform" type="scale" values="0.95;1.03;0.9;1.05;0.95" dur="25s" begin="8s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"/>
                    <animate attributeName="opacity" values="0;0;0.45;0.45;0;0" dur="25s" begin="8s" repeatCount="indefinite" keyTimes="0;0.35;0.45;0.55;0.65;1"/>
                    <animate attributeName="fill" values="#DA70D6;#D8BFD8;#C8A2C8;#DA70D6" dur="70s" begin="-15s" repeatCount="indefinite" />
                </path>
                <path d="M0,-35 Q18,-50 35,-35 T70,-35 Q50,-18 35,0 T0,0 Q-18,-18 -35,0 T-70,-35 Q-50,-50 -35,-35 T0,-35Z" fill="#FFB6C1" opacity="0" transform="rotate(240)">
                    <animateTransform attributeName="transform" type="scale" values="1.02;0.92;1.05;0.95;1.02" dur="25s" begin="16s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"/>
                    <animate attributeName="opacity" values="0;0;0.5;0.5;0;0" dur="25s" begin="16s" repeatCount="indefinite" keyTimes="0;0.35;0.45;0.55;0.65;1"/>
                    <animate attributeName="fill" values="#FFB6C1;#FFC0CB;#FFDAB9;#FFB6C1" dur="70s" begin="-30s" repeatCount="indefinite" />
                </path>
              </g>
            </g>

            <g id="rippleContainer" filter="url(#rippleGlow)" class="ripple-container-group">
              <circle cx="0" cy="0" r="10" stroke="url(#rippleWaveGradient)" stroke-width="1.2" fill="none" opacity="0.6">
                <animate attributeName="r" values="30;150" dur="7s" begin="0s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.1 0.7 0.9 1"/>
                <animate attributeName="opacity" values="0.6;0;0;0.6;0" dur="7s" begin="0s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.7;0.8;0.9;1" keySplines="0.5 0 1 0.5;0.5 0 1 0.5;0.5 0 1 0.5;0.5 0 1 0.5"/>
                <animate attributeName="stroke-width" values="1.2;0.3" dur="7s" begin="0s" repeatCount="indefinite"/>
              </circle>
              <circle cx="0" cy="0" r="10" stroke="url(#rippleWaveGradient)" stroke-width="1.2" fill="none" opacity="0.6">
                <animate attributeName="r" values="30;150" dur="7s" begin="1.8s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.1 0.7 0.9 1"/>
                <animate attributeName="opacity" values="0.6;0;0;0.6;0" dur="7s" begin="1.8s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.7;0.8;0.9;1" keySplines="0.5 0 1 0.5;0.5 0 1 0.5;0.5 0 1 0.5;0.5 0 1 0.5"/>
                <animate attributeName="stroke-width" values="1.2;0.3" dur="7s" begin="1.8s" repeatCount="indefinite"/>
              </circle>
              <circle cx="0" cy="0" r="10" stroke="url(#rippleWaveGradient)" stroke-width="1.0" fill="none" opacity="0.5">
                <animate attributeName="r" values="30;130" dur="8s" begin="3.5s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.1 0.7 0.9 1"/>
                <animate attributeName="opacity" values="0.5;0;0;0;0.5;0" dur="8s" begin="3.5s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.6;0.7;0.8;0.9;1" keySplines="0.5 0 1 0.5;0.5 0 1 0.5;0.5 0 1 0.5;0.5 0 1 0.5;0.5 0 1 0.5"/>
                <animate attributeName="stroke-width" values="1.0;0.2" dur="8s" begin="3.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="0" cy="0" r="10" stroke="url(#rippleWaveGradient)" stroke-width="1.2" fill="none" opacity="0.6">
                <animate attributeName="r" values="30;150" dur="7s" begin="5.0s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.1 0.7 0.9 1"/>
                <animate attributeName="opacity" values="0.6;0;0;0.6;0" dur="7s" begin="5.0s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.7;0.8;0.9;1" keySplines="0.5 0 1 0.5;0.5 0 1 0.5;0.5 0 1 0.5;0.5 0 1 0.5"/>
                <animate attributeName="stroke-width" values="1.2;0.3" dur="7s" begin="5.0s" repeatCount="indefinite"/>
              </circle>
              <circle cx="0" cy="0" r="10" stroke="url(#rippleWaveGradient)" stroke-width="1.0" fill="none" opacity="0.5">
                <animate attributeName="r" values="30;140" dur="7.5s" begin="6.8s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.1 0.7 0.9 1"/>
                <animate attributeName="opacity" values="0.5;0;0;0;0.5;0" dur="7.5s" begin="6.8s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.6;0.7;0.8;0.9;1" keySplines="0.5 0 1 0.5;0.5 0 1 0.5;0.5 0 1 0.5;0.5 0 1 0.5;0.5 0 1 0.5"/>
                <animate attributeName="stroke-width" values="1.0;0.2" dur="7.5s" begin="6.8s" repeatCount="indefinite"/>
              </circle>
              <circle cx="0" cy="0" r="10" stroke="url(#rippleWaveGradient)" stroke-width="1.2" fill="none" opacity="0.6">
                <animate attributeName="r" values="30;150" dur="7s" begin="8.2s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.1 0.7 0.9 1"/>
                <animate attributeName="opacity" values="0.6;0;0;0.6;0" dur="7s" begin="8.2s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.7;0.8;0.9;1" keySplines="0.5 0 1 0.5;0.5 0 1 0.5;0.5 0 1 0.5;0.5 0 1 0.5"/>
                <animate attributeName="stroke-width" values="1.2;0.3" dur="7s" begin="8.2s" repeatCount="indefinite"/>
              </circle>
              <circle class="core-ripple core-ripple-1" cx="0" cy="0" r="20" stroke="url(#corePulseGradient)" stroke-width="3.5" fill="none" opacity="0.75">
                <animate attributeName="r" values="40;280" dur="7.5s" begin="0s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.2 0.6 0.8 1"/>
                <animate attributeName="opacity" values="0.75;0" dur="7.5s" begin="0s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 1 0.6"/>
                <animate attributeName="stroke-width" values="3.5;12;1.5" dur="7.5s" begin="0s" repeatCount="indefinite"/>
              </circle>
               <circle class="core-ripple core-ripple-2" cx="0" cy="0" r="20" stroke="url(#corePulseGradient)" stroke-width="3.5" fill="none" opacity="0.75">
                <animate attributeName="r" values="40;280" dur="7.5s" begin="1.5s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.2 0.6 0.8 1"/>
                <animate attributeName="opacity" values="0.75;0" dur="7.5s" begin="1.5s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 1 0.6"/>
                <animate attributeName="stroke-width" values="3.5;12;1.5" dur="7.5s" begin="1.5s" repeatCount="indefinite"/>
              </circle>
              <circle class="core-ripple core-ripple-3" cx="0" cy="0" r="20" stroke="url(#corePulseGradient)" stroke-width="3.5" fill="none" opacity="0.75">
                <animate attributeName="r" values="40;280" dur="7.5s" begin="3.0s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.2 0.6 0.8 1"/>
                <animate attributeName="opacity" values="0.75;0" dur="7.5s" begin="3.0s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 1 0.6"/>
                <animate attributeName="stroke-width" values="3.5;12;1.5" dur="7.5s" begin="3.0s" repeatCount="indefinite"/>
              </circle>
              <circle class="core-ripple core-ripple-4" cx="0" cy="0" r="20" stroke="url(#corePulseGradient)" stroke-width="3.5" fill="none" opacity="0.75">
                <animate attributeName="r" values="40;280" dur="7.5s" begin="4.5s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.2 0.6 0.8 1"/>
                <animate attributeName="opacity" values="0.75;0" dur="7.5s" begin="4.5s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 1 0.6"/>
                <animate attributeName="stroke-width" values="3.5;12;1.5" dur="7.5s" begin="4.5s" repeatCount="indefinite"/>
              </circle>
              <circle class="core-ripple core-ripple-5" cx="0" cy="0" r="20" stroke="url(#corePulseGradient)" stroke-width="3.5" fill="none" opacity="0.75">
                <animate attributeName="r" values="40;280" dur="7.5s" begin="6.0s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.2 0.6 0.8 1"/>
                <animate attributeName="opacity" values="0.75;0" dur="7.5s" begin="6.0s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 1 0.6"/>
                <animate attributeName="stroke-width" values="3.5;12;1.5" dur="7.5s" begin="6.0s" repeatCount="indefinite"/>
              </circle>
            </g>

            <g id="sparkleContainer" class="sparkle-container-group">
              <circle cx="0" cy="0" r="50" fill="url(#sparkleGradient)" opacity="0.45">
                <animate attributeName="r" values="50;380" dur="11s" begin="0s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.3 0.5 0.7 1"/>
                <animate attributeName="opacity" values="0.45;0;0;0.45;0" dur="11s" begin="0s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.7;0.8;0.9;1" keySplines="0.6 0 1 0.4;0.6 0 1 0.4;0.6 0 1 0.4;0.6 0 1 0.4"/>
              </circle>
              <circle cx="0" cy="0" r="50" fill="url(#sparkleGradient)" opacity="0.45">
                <animate attributeName="r" values="50;380" dur="11s" begin="2.8s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.3 0.5 0.7 1"/>
                <animate attributeName="opacity" values="0.45;0;0;0.45;0" dur="11s" begin="2.8s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.7;0.8;0.9;1" keySplines="0.6 0 1 0.4;0.6 0 1 0.4;0.6 0 1 0.4;0.6 0 1 0.4"/>
              </circle>
              <circle cx="0" cy="0" r="50" fill="url(#sparkleGradient)" opacity="0.40">
                <animate attributeName="r" values="50;360" dur="12s" begin="5.5s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.3 0.5 0.7 1"/>
                <animate attributeName="opacity" values="0.40;0;0;0;0.40;0" dur="12s" begin="5.5s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.6;0.7;0.8;0.9;1" keySplines="0.6 0 1 0.4;0.6 0 1 0.4;0.6 0 1 0.4;0.6 0 1 0.4;0.6 0 1 0.4"/>
              </circle>
              <circle cx="0" cy="0" r="50" fill="url(#sparkleGradient)" opacity="0.45">
                <animate attributeName="r" values="50;380" dur="11s" begin="8.0s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.3 0.5 0.7 1"/>
                <animate attributeName="opacity" values="0.45;0;0;0.45;0" dur="11s" begin="8.0s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.7;0.8;0.9;1" keySplines="0.6 0 1 0.4;0.6 0 1 0.4;0.6 0 1 0.4;0.6 0 1 0.4"/>
              </circle>
            </g>

            <g id="backgroundEnergy" class="background-energy-group">
              <circle cx="-50" cy="-80" r="2" fill="url(#sparkleGradient)" opacity="0">
                <animate attributeName="cx" values="-50;100;250;400;550;700;850" dur="35s" repeatCount="indefinite" begin="0s"/>
                <animate attributeName="cy" values="-80;-40;-100;-30;-120;-20;-90" dur="35s" repeatCount="indefinite" begin="0s"/>
                <animate attributeName="r" values="1;3;1.5;2.5;1;3;1.5" dur="22s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;0;0.5;0.5;0;0;0;0;0.6;0.6;0;0" dur="35s" repeatCount="indefinite" begin="0s"/>
              </circle>
                <circle cx="850" cy="580" r="1.5" fill="url(#sparkleGradient)" opacity="0">
                <animate attributeName="cx" values="850;700;550;400;250;100;-50" dur="38s" repeatCount="indefinite" begin="-5s"/>
                <animate attributeName="cy" values="580;540;600;530;610;520;590" dur="38s" repeatCount="indefinite" begin="-5s"/>
                <animate attributeName="r" values="2;1;2.5;1.5;3;1;2" dur="25s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;0;0;0.6;0.6;0;0;0;0;0.5;0.5;0;0" dur="38s" repeatCount="indefinite" begin="-5s"/>
              </circle>
              <path d="M0,0 L2,1 L1,3 Z" fill="rgba(200,220,255,0.4)">
                <animateMotion path="M100,50 C150,0 250,100 300,50 S450,0 500,50 S650,100 700,50 C750,0 850,100 900,50" dur="30s" rotate="auto" repeatCount="indefinite" begin="-2s"/>
                <animate attributeName="opacity" values="0;0;0.4;0;0;0.5;0;0" dur="8s" repeatCount="indefinite" begin="-2s" />
                <animateTransform attributeName="transform" type="scale" values="1;1.6;1;1.4;1" additive="sum" dur="8s" repeatCount="indefinite" />
              </path>
              <path d="M0,0 L2,1 L1,3 Z" fill="rgba(220,200,255,0.4)" transform="translate(0, 450)">
                <animateMotion path="M700,50 C650,100 550,0 500,50 S350,100 300,50 S150,0 100,50 C50,100 -50,0 -100,50" dur="33s" rotate="auto" repeatCount="indefinite" begin="-8s"/>
                <animate attributeName="opacity" values="0;0;0;0.5;0;0;0.4;0" dur="7s" repeatCount="indefinite" begin="-8s" />
                <animateTransform attributeName="transform" type="scale" values="1;1.4;1;1.5;1" additive="sum" dur="7s" repeatCount="indefinite" />
              </path>
            </g>
          </g>
        </svg>
      </div>

      <nav class="desk-ctrls" aria-label="Desktop navigation">
        <Suspense><AgentHubTrigger @open-agent-hub="openAgentHub" class="ctrl-btn"/></Suspense>
        <Suspense><ThemeDropdown  class="ctrl-btn"/></Suspense>

        <button class="ctrl-btn" @click="emit('toggle-fullscreen')"
                :title="isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'">
          <component :is="isFullscreen ? ArrowsPointingInIcon : ArrowsPointingOutIcon"/>
        </button>

        <button class="ctrl-btn" @click="isMuted = !isMuted"
                :title="isMuted ? 'Unmute Speech' : 'Mute Speech'">
          <component :is="isMuted ? SpeakerXMarkIcon : SpeakerWaveIcon"/>
        </button>

        <Suspense><VoiceDropdown class="ctrl-btn"/></Suspense>

        <template v-if="auth.isAuthenticated.value">
          <Suspense>
            <UserDropdown class="ctrl-btn"
              @logout="emit('logout')"
              @clear-chat-and-session="emit('clear-chat-and-session')"
              @show-prior-chat-log="emit('show-prior-chat-log')"/>
          </Suspense>
        </template>
        <template v-else>
          <RouterLink to="/login" class="ctrl-btn">
            <ArrowLeftOnRectangleIcon/> Login
          </RouterLink>
        </template>

        <Suspense><SiteMenuDropdown class="ctrl-btn"/></Suspense>
      </nav>

      <div class="m-burger">
        <button class="burger-btn" @click="isMobileMenu = !isMobileMenu"
                :aria-expanded="isMobileMenu">
          <component :is="isMobileMenu ? XMarkIcon : Bars3Icon"/>
        </button>
      </div>
    </div>

    <Suspense>
      <MobileNavPanel
        :is-open="isMobileMenu"
        :is-user-listening="isUserProvidingInput"
        :is-ai-state-active="isAiOutputActive"
        :is-authenticated="auth.isAuthenticated.value"
        @close-panel="isMobileMenu=false"
        @open-agent-hub="openAgentHub"
        @logout="emit('logout'); isMobileMenu=false"/>
    </Suspense>
    <Suspense><AgentHub :is-open="isAgentHubOpen" @close="closeAgentHub"/></Suspense>
  </header>
</template>

<style lang="scss" scoped>
@use '@/styles/abstracts/variables' as v;
@use '@/styles/abstracts/mixins'   as m;

/* Keyframes for overall header glow (already existed) */
@keyframes glow-user-input{ // Renamed for clarity
  0%,100%{box-shadow:0 0 8px hsla(var(--color-voice-user-h),
    var(--color-voice-user-s), var(--color-voice-user-l),.55);}
  50%{box-shadow:0 0 12px 4px hsla(var(--color-voice-user-h),
    var(--color-voice-user-s), var(--color-voice-user-l),.9);}
}
@keyframes glow-ai-output{ // Renamed for clarity
  0%,100%{box-shadow:0 0 8px hsla(var(--color-voice-ai-speaking-h),
    var(--color-voice-ai-speaking-s), var(--color-voice-ai-speaking-l),.55);}
  50%{box-shadow:0 0 12px 4px hsla(var(--color-voice-ai-speaking-h),
    var(--color-voice-ai-speaking-s), var(--color-voice-ai-speaking-l),.9);}
}

/* header shell */
.vca-header{
  position:sticky; top:0; inset-inline:0; z-index:calc(v.$z-index-sticky + 20);
  height:var(--header-height-mobile,60px); padding-inline:v.$spacing-sm;
  display:flex; align-items:center; justify-content:center;
  backdrop-filter:blur(9px);
  background-color:hsla(var(--color-bg-primary-h),
                        var(--color-bg-primary-s),
                        var(--color-bg-primary-l),.85);
  border-bottom:1px solid hsla(var(--color-border-primary-h),
                              var(--color-border-primary-s),
                              var(--color-border-primary-l),.3);
  transition:background-color .35s, border-color .35s;

  @media (min-width:v.$breakpoint-md){
    height:var(--header-height-desktop,72px); padding-inline:v.$spacing-lg;
  }

  &.intro-play{ animation:intro-slide .7s cubic-bezier(.64,-.58,.34,1.56) both; }
  // Apply overall header glow based on general input/output activity
  &.user-input-active { animation:glow-user-input 3.5s ease-in-out infinite alternate; }
  &.ai-output-active  { animation:glow-ai-output  2.6s ease-in-out infinite alternate; }
}

/* layout wrapper */
.hdr-wrap{ display:flex; width:100%; max-width:v.$site-max-width;
            align-items:center; justify-content:space-between; }

/* logo block */
.logo-block{
  display:inline-flex; gap:.55rem; align-items:center; cursor:pointer;
  height:calc(var(--header-height-mobile,60px) * .65);

  @media (min-width:v.$breakpoint-md){
    height:calc(var(--header-height-desktop,72px) * .55);
  }

  &:hover .logo-word, // Assuming AnimatedTextLogo might have this class internally
  &:focus-visible .logo-word{ text-decoration:underline; }
  &:focus-visible{ @include m.focus-ring(); }
}

/* hearing icon wrapper */
.hear-wrap{
  flex:1; display:flex; justify-content:center; align-items:center;
  // Controls size of the SVG viewport
  .hear-icon-svg {
    width: 30px; // Base size
    height: 30px;
    transition: transform 0.3s ease-out;
    overflow: visible; // Important for glows/effects that might exceed viewBox

    @media(min-width:v.$breakpoint-md){
      width:38px;
      height:38px;
    }

    // Default (Idle) state for SVG elements: SMIL animations play as defined
    // We will override/enhance these based on parent .hear-wrap classes

    // Shared transition for elements we might change
    #centralHerElement .core-orb,
    #petalPaths path,
    #rippleContainer circle,
    #sparkleContainer circle,
    #backgroundEnergy circle,
    #backgroundEnergy path {
      transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
    }
  }
}

// State-specific CSS for hearing.svg internals
.hear-wrap {
  // --- State: User Listening (STT Active) ---
  &.hearing-user-listening-stt {
    .hear-icon-svg {
      transform: scale(1.05); // Slightly larger overall
      #centralHerElement .core-orb {
        // Example: make core pulse more prominently if we add a CSS pulse
        // For SMIL, we might change opacity or rely on its own slow pulse
      }
      #petalPaths path { // Make petals more visible
        opacity: 0.6 !important; // Try to override SMIL opacity
        // To speed up SMIL, JS interaction would be needed, or alternative SMIL anims
      }
      #rippleContainer circle { // Enhance ripples
         // For SMIL, overriding `dur` is hard. We can try to make them more opaque
         // or scale the whole container.
        opacity: 0.8 !important;
      }
      #sparkleContainer { display: none; } // Hide sparkles to focus on listening
      #backgroundEnergy { opacity: 0.3; }
    }
  }

  // --- State: User Listening (VAD Wake Word) ---
  &.hearing-user-listening-vad-wake {
    .hear-icon-svg {
      transform: scale(1.0);
      #centralHerElement .core-orb {
        // More subtle pulsing or a specific "breathing" animation for core
        // If core has <animate attributeName="r" id="coreIdlePulseR"...> and another
        // <animate attributeName="r" id="coreVadWakePulseR" begin="indefinite"...>
        // JS would be needed: document.getElementById('coreVadWakePulseR').beginElement();
        // With CSS, we can try a subtle scale animation on the orb itself:
         animation: gentlePulse 2.5s infinite ease-in-out;
      }
      #petalPaths { opacity: 0.3; } // Petals softly visible
      #rippleContainer { // Softer, slower ripples
        opacity: 0.5;
        circle {
           // SMIL will play, CSS can only make it fainter or slightly change stroke
        }
      }
      #sparkleContainer { display: none; }
      #backgroundEnergy { opacity: 0.1; }
    }
  }

  // --- State: AI Responding (Streaming Text) ---
  &.hearing-ai-streaming-text {
    .hear-icon-svg {
      transform: scale(1.08);
      #centralHerElement .core-orb {
        // Faster pulse or brighter colors (hard with SMIL gradients via CSS)
        // Could add a CSS glow via filter to the #centralHerElement
        filter: drop-shadow(0 0 5px var(--color-accent-primary));
      }
      #rippleContainer { // Ripples could be more expansive but fewer
        opacity: 0.6;
      }
      #petalPaths { display: none; } // Hide petals
      #backgroundEnergy { opacity: 0.6; } // More background activity
      #sparkleContainer { opacity: 0.5; }
    }
  }

  // --- State: AI Speaking (TTS - "Insane circular effects") ---
  &.hearing-ai-speaking {
    .hear-icon-svg {
      transform: scale(1.15); // Even larger
      // CORE - Fast, bright pulse
      #centralHerElement .core-orb {
        // To override SMIL `dur`, JS is needed.
        // CSS can try to add a fast pulsing overlay or a strong glow
        animation: intensePulse 0.8s infinite ease-out;
        filter: brightness(1.3) saturate(1.5);
      }
      // RIPPLES - Very active and expansive
      #rippleContainer {
        opacity: 1;
        // Again, SMIL `dur` override is hard.
        // We could have a separate group of "intense ripples" in the SVG,
        // hidden by default, and shown only in this state.
        // e.g., #intenseRippleContainer { display: block !important; }
        // #rippleContainer { display: none !important; } // Hide normal ripples
        // For now, just make existing ones more prominent.
        circle {
          stroke-width: 2.0 !important; // Make lines thicker
          opacity: 0.9 !important;
        }
        // Specific "core-ripple" elements (closer to center)
        .core-ripple {
            // Example: make core ripples pulse faster if they were CSS animations
            // If SMIL, JS is needed or pre-define faster SMIL and show/hide groups
        }
      }
      // PETALS - Fast spinning or bright flashes
      #petalPaths {
        opacity: 0.8 !important;
        // animation: fastSpin 2s linear infinite; // If petals group was suitable for CSS anim
      }
      // SPARKLES - More intense
      #sparkleContainer {
        opacity: 0.9;
        // animation: superSparkle 0.5s infinite; // if sparkles were CSS anim
      }
      // BACKGROUND ENERGY - Very high activity
      #backgroundEnergy {
        opacity: 0.9;
        // path { animation-duration: 3s !important; } // Example, if it were CSS anim
      }
    }
  }

  // --- State: Idle ---
  &.hearing-idle {
    // Most elements will revert to their default SMIL behavior.
    // We might want to ensure any CSS overrides are reset.
    .hear-icon-svg {
      transform: scale(1);
      #centralHerElement .core-orb { animation: none; filter: none; } // Reset CSS anims/filters
      #petalPaths path { /* Reset opacity if changed */ }
      // etc. for other elements if CSS directly altered them.
    }
  }
}

// Example CSS Keyframes for state-specific overrides (if not using SMIL for everything)
@keyframes gentlePulse {
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.03); opacity: 1; }
}
@keyframes intensePulse {
  0%, 100% { transform: scale(1); filter: brightness(1.2) drop-shadow(0 0 3px var(--color-accent-secondary)); }
  50% { transform: scale(1.08); filter: brightness(1.5) drop-shadow(0 0 8px var(--color-accent-secondary)); }
}
// Add more keyframes as needed for petal spins, sparkle effects etc. if you
// decide to implement parts with CSS animations instead of or in addition to SMIL.


/* desktop control cluster */
.desk-ctrls{ display:none; gap:v.$spacing-xs; align-items:center;
  @media(min-width:v.$breakpoint-lg){ display:flex; }

  .ctrl-btn{
    @include m.button-base; @include m.button-ghost();
    padding:.45rem; border-radius:v.$radius-lg;
    svg{ width:1.35rem;height:1.35rem; }
  }
}

/* mobile burger */
.m-burger{ display:flex; align-items:center;
  @media(min-width:v.$breakpoint-lg){ display:none; }
  .burger-btn{ @include m.button-base; padding:.55rem;
    svg{ width:1.5rem;height:1.5rem; }
  }
}

/* For intro slide, if still used */
@keyframes intro-slide{
  0%{opacity:0;transform:translateY(-60%) scale(.92);}
  60%{opacity:1;transform:translateY(6%) scale(1.03);}
  100%{opacity:1;transform:translateY(0) scale(1);}
}

</style>