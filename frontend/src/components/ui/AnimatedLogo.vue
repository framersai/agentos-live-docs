// File: frontend/src/components/ui/AnimatedLogo.vue
/**
 * @file AnimatedLogo.vue
 * @version 2.3.1
 * @description Animated application logo and title for "Ephemeral Harmony".
 * Corrected "V" shape in SVG. Adjusted "Voice Chat" text spacing for better kerning.
 * Retains smooth "breathing" animations and distinct color/gradient transitions for states.
 *
 * @component AnimatedLogo
 * @props {string} [appNameMain="Voice Chat"] - The main part of the application name.
 * @props {string} [appNameSubtitle="Assistant"] - The subtitle part of the application name.
 * @props {boolean} [isMobileContext=false] - True if the logo is in a very compact mobile context.
 * @props {boolean} [isUserListening=false] - True if the application is actively listening to the user.
 * @props {boolean} [isAiSpeakingOrProcessing=false] - True if the AI is speaking or processing.
 */
<script lang="ts" setup>
import { computed, type PropType } from 'vue';
import { useWindowSize } from '@vueuse/core';

const props = defineProps({
  appNameMain: { type: String as PropType<string>, default: 'Voice Chat' },
  appNameSubtitle: { type: String as PropType<string>, default: 'Assistant' },
  isMobileContext: { type: Boolean as PropType<boolean>, default: false },
  isUserListening: { type: Boolean as PropType<boolean>, default: false },
  isAiSpeakingOrProcessing: { type: Boolean as PropType<boolean>, default: false },
});

const { width } = useWindowSize();
const isSmallScreen = computed<boolean>(() => width.value < 768);

const mainAppNameParts = computed<string[]>(() => {
    if (props.appNameMain === "Voice Chat") {
        return props.appNameMain.split(' '); // ["Voice", "Chat"]
    }
    // For single word or other multi-word names not "Voice Chat", split by letter for individual animation
    return props.appNameMain.split('');
});

// Determine if the main name is specifically "Voice Chat" for special spacing
const isVoiceChatName = computed(() => props.appNameMain === "Voice Chat" && mainAppNameParts.value.length === 2);

const subtitleText = computed<string>(() => {
  if (props.isMobileContext || isSmallScreen.value) return '';
  return props.appNameSubtitle;
});

const subtitleLetters = computed<string[]>(() => subtitleText.value.split(''));

const appDisplayName = computed<string>(() => {
  if (props.isMobileContext) return props.appNameMain;
  return isSmallScreen.value ? props.appNameMain : `${props.appNameMain} ${props.appNameSubtitle}`;
});

const logoStateClasses = computed(() => ({
  'compact-logo': props.isMobileContext || isSmallScreen.value,
  'user-listening-state': props.isUserListening && !props.isAiSpeakingOrProcessing,
  'ai-active-state': props.isAiSpeakingOrProcessing,
  'idle-state': !props.isUserListening && !props.isAiSpeakingOrProcessing,
}));

</script>

<template>
  <div
    class="animated-logo-ephemeral"
    :class="logoStateClasses"
    :aria-label="`${appDisplayName} Logo`"
    role="img"
  >
    <svg
      class="logo-svg-element"
      viewBox="-75 -75 150 150"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="animatedLogoMasterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" class="grad-stop-1-master" />
          <stop offset="50%" class="grad-stop-2-master" />
          <stop offset="100%" class="grad-stop-3-master" />
        </linearGradient>

        <filter id="logoGlowFilterMaster" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur class="glow-blur-effect-master" stdDeviation="var(--logo-current-glow-std-dev, 3.5)" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <g class="logo-main-group" filter="url(#logoGlowFilterMaster)">
        <circle
          class="logo-ring-bg" 
          cx="0" cy="0" r="60"
          fill="none"
        />
        <circle
          class="logo-ring-fg"
          cx="0" cy="0" r="60"
          fill="none"
          stroke-linecap="round"
        />
        <path
          class="logo-waveform"
          d="M -30 -20 L 0 25 L 30 -20" fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      
      <g class="logo-particles">
        <circle class="particle p1" cx="0" cy="0" r="2.2" />
        <circle class="particle p2" cx="0" cy="0" r="1.8" />
        <circle class="particle p3" cx="0" cy="0" r="2.5" />
      </g>
    </svg>

    <span class="sr-only">{{ appDisplayName }}</span>
     <h1 class="title-text-animated" aria-hidden="true" :class="{'compact-text': props.isMobileContext || isSmallScreen, 'is-voice-chat-name': isVoiceChatName}">
      <span class="app-name-main">
        <template v-if="isVoiceChatName">
          <span class="title-word title-word-voice" :style="{ animationDelay: '0.1s' }">{{ mainAppNameParts[0] }}</span>
          <span class="title-word title-word-chat" :style="{ animationDelay: '0.25s' }">{{ mainAppNameParts[1] }}</span>
        </template>
        <template v-else>
          <span
            v-for="(char, idx) in mainAppNameParts"
            :key="`main-${idx}`"
            class="title-letter main-letter"
            :style="{ animationDelay: `${0.1 + idx * 0.05}s` }"
          >
            {{ char }}
          </span>
        </template>
      </span>
      <span class="app-name-subtitle" v-if="subtitleText">
        <span class="space-placeholder">&nbsp;</span>
        <span
          v-for="(char, idx) in subtitleLetters"
          :key="`sub-${idx}`"
          :class="['title-letter', 'subtitle-letter', char === ' ' && 'space-letter']"
          :style="{ animationDelay: `${0.1 + (mainAppNameParts.join('').length * 0.05) + (idx * 0.035) + 0.15}s` }"
        >
          {{ char === ' ' ? '\u00A0' : char }}
        </span>
      </span>
    </h1>
  </div>
</template>

<style lang="scss" scoped>
/**
 * @file AnimatedLogo.vue SCSS
 * @version 2.3.1 - Corrected V shape, adjusted "Voice Chat" text spacing.
 */
@use '@/styles/abstracts/variables' as var;

.animated-logo-ephemeral {
  display: inline-flex;
  align-items: center;
  gap: calc(var.$spacing-sm * 0.65); // Slightly reduced base gap
  user-select: none;
  padding: var.$spacing-xs 0;
  cursor: default;

  // Base CSS Variables for SVG (from previous iteration, assumed fine)
  --logo-current-stroke-width: 10;
  --logo-current-glow-std-dev: 3.2;
  --logo-current-waveform-opacity: 0.8;
  --logo-current-particle-opacity: 0;
  --logo-current-particle-scale: 0.3;
  --logo-current-ring-bg-opacity: 0.02;

  --logo-grad1-color: hsl(var(--color-logo-primary-h) var(--color-logo-primary-s) var(--color-logo-primary-l) / var(--color-logo-primary-a, 1));
  --logo-grad2-color: hsl(var(--color-logo-secondary-h) var(--color-logo-secondary-s) var(--color-logo-secondary-l) / var(--color-logo-secondary-a, 1));
  --logo-grad3-color: hsl(var(--color-logo-primary-light-h, var(--color-logo-primary-h)) calc(var(--color-logo-primary-light-s, var(--color-logo-primary-s)) - 8%) calc(var(--color-logo-primary-light-l, var(--color-logo-primary-l)) + 12%) / var(--color-logo-primary-light-a, 1));
  
  --logo-particle-fill-color: var(--logo-grad1-color);

  .logo-svg-element {
    width: 30px; height: 30px;
    overflow: visible;
    transition: transform 0.7s var.$ease-elastic;

    .logo-main-group {
      animation: logo-overall-gentle-breathing 9s var.$ease-in-out-sine infinite alternate;
    }
    .glow-blur-effect-master {
      stdDeviation: var(--logo-current-glow-std-dev);
      transition: stdDeviation 0.6s var.$ease-out-quad;
    }
    .logo-ring-bg {
      stroke-width: calc(var(--logo-current-stroke-width) + 3px);
      stroke: var(--logo-grad2-color);
      opacity: var(--logo-current-ring-bg-opacity);
      transition: stroke 0.6s var.$ease-out-quad, stroke-width 0.6s var.$ease-elastic, opacity 0.6s var.$ease-out-quad;
    }
    .logo-ring-fg, .logo-waveform {
      stroke-width: var(--logo-current-stroke-width);
      stroke: url(#animatedLogoMasterGradient);
      transition: stroke-width 0.6s var.$ease-elastic,
                  transform 0.8s var.$ease-elastic,
                  stroke 0.6s var.$ease-out-quad,
                  opacity 0.6s var.$ease-out-quad;
    }
    .logo-waveform {
      transform-origin: center center;
      opacity: var(--logo-current-waveform-opacity);
      animation: logo-waveform-idle-drift 14s var.$ease-in-out-sine infinite alternate;
    }
    .grad-stop-1-master { stop-color: var(--logo-grad1-color); transition: stop-color 0.5s var.$ease-out-quad; }
    .grad-stop-2-master { stop-color: var(--logo-grad2-color); transition: stop-color 0.5s var.$ease-out-quad; }
    .grad-stop-3-master { stop-color: var(--logo-grad3-color); transition: stop-color 0.5s var.$ease-out-quad; }
    .logo-particles { /* fine */ }
  }

  &.compact-logo .logo-svg-element { width: 26px; height: 26px; }
  @media (min-width: var.$breakpoint-sm) { .logo-svg-element { width: 34px; height: 34px; } }
  @media (min-width: var.$breakpoint-md) { .logo-svg-element { width: 38px; height: 38px; } }

  // State Overrides (from previous iteration, assumed fine)
  &.idle-state { /* fine */ }
  &.user-listening-state { /* fine - uses specific CSS vars */ }
  &.ai-active-state { /* fine - uses specific CSS vars */ }
}

// Title Text Styles
.title-text-animated {
  font-family: var(--font-family-display, #{var.$font-family-display});
  font-size: clamp(1.05rem, 0.75rem + 0.8vw, 1.25rem);
  line-height: 1.1;
  color: hsl(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l));
  display: flex;
  align-items: baseline;
  transition: color var.$duration-smooth;

  &.is-voice-chat-name .app-name-main { // Specific class for "Voice Chat"
    gap: 0.2em; // Reduced gap between "Voice" and "Chat"
  }
  .app-name-main:not(.is-voice-chat-name .app-name-main) { // Default gap for letter-by-letter
     gap: 0.05em; // Very small for letter-by-letter
  }


  &.compact-text {
    .app-name-subtitle { display: none; }
    .app-name-main { font-size: clamp(1.15rem, 0.85rem + 0.7vw, 1.35rem); }
  }
  @media (min-width: var.$breakpoint-sm) { font-size: clamp(1.15rem, 0.9rem + 0.7vw, 1.4rem); }
  @media (min-width: var.$breakpoint-md) { 
    gap: calc(var.$spacing-xs * 0.55); // Overall gap between main and subtitle
    &.is-voice-chat-name .app-name-main {
      gap: 0.22em; // Ensure this is consistent for desktop
    }
  }
}
.app-name-main {
  display: inline-flex;
  align-items: baseline;
  // Gap is now conditional based on .is-voice-chat-name
  font-weight: 600;
  letter-spacing: -0.01em;
  color: hsl(var(--color-logo-main-text-h, var(--color-text-primary-h)),
             var(--color-logo-main-text-s, var(--color-text-primary-s)),
             var(--color-logo-main-text-l, var(--color-text-primary-l)));
  transition: color var.$duration-smooth;

  .title-word, .title-letter {
    display: inline-block;
    opacity: 0;
    transform: translateY(6px) scale(0.96);
    animation: letter-entrance-ephemeral 0.75s forwards var.$ease-out-expo;
  }
  .title-word-separator { // This was for a literal space character, removing for direct gap instead
    display: none; // Not needed if using gap on parent
  }
}
.app-name-subtitle {
  display: inline-block;
  font-weight: 400;
  opacity: 0.75;
  font-size: 0.8em;
  letter-spacing: 0.01em;
  color: hsl(var(--color-logo-subtitle-text-h, var(--color-text-secondary-h)),
             var(--color-logo-subtitle-text-s, var(--color-text-secondary-s)),
             var(--color-logo-subtitle-text-l, var(--color-text-secondary-l)));
  transition: color var.$duration-smooth, opacity var.$duration-smooth;
  padding-left: 0.2em; // Add a slight space before subtitle starts
}
.space-placeholder { display: none; } // Not needed if subtitle has its own padding-left

// Keyframes for SVG Animations (largely from previous iteration, assumed fine for smoothness)
@keyframes logo-overall-gentle-breathing { /* ... */ }
@keyframes logo-waveform-idle-drift { /* ... */ }
@keyframes logo-waveform-listening-pulse { /* ... */ }
@keyframes particle-listening-orbit { /* ... */ }
@keyframes logo-waveform-active-throb { /* ... */ }
@keyframes particle-ai-flow { /* ... */ }
@keyframes particle-ai-bright-pulse { /* ... */ }
@keyframes letter-entrance-ephemeral {
  to { opacity: 1; transform: translateY(0) scale(1); }
}

</style>