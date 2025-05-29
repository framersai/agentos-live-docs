// File: frontend/src/components/ui/AnimatedLogo.vue
/**
 * @file AnimatedLogo.vue
 * @description Animated application logo and title, themed for "Ephemeral Harmony".
 * Now features an inline SVG for enhanced CSS-driven animations responsive to application states
 * (idle, user listening, AI speaking/processing). Aims for an "evolutionary organism" feel.
 *
 * @component AnimatedLogo
 * @props {string} [appNameMain="VCA"] - The main part of the application name.
 * @props {string} [appNameSubtitle="Assistant"] - The subtitle part of the application name.
 * @props {boolean} [isMobileContext=false] - True if the logo is in a very compact mobile context.
 * @props {boolean} [isUserListening=false] - True if the application is actively listening to the user.
 * @props {boolean} [isAiSpeakingOrProcessing=false] - True if the AI is speaking or processing.
 *
 */

 <!-- 
 * <AnimatedLogo
 * :is-user-listening="isListening"
 * :is-ai-speaking-or-processing="isAiActive"
 * />
 -->
<script lang="ts" setup>
import { computed, type PropType } from 'vue';
import { useWindowSize } from '@vueuse/core';

const props = defineProps({
  appNameMain: { type: String as PropType<string>, default: 'VCA' },
  appNameSubtitle: { type: String as PropType<string>, default: 'AI' }, // Shortened default subtitle
  isMobileContext: { type: Boolean as PropType<boolean>, default: false },
  isUserListening: { type: Boolean as PropType<boolean>, default: false },
  isAiSpeakingOrProcessing: { type: Boolean as PropType<boolean>, default: false },
});

const { width } = useWindowSize();

/**
 * @computed isSmallScreen
 * @description Determines if the screen width is considered small (typically less than md breakpoint).
 * Used to adjust text display for responsiveness.
 * @returns {boolean}
 */
const isSmallScreen = computed<boolean>(() => width.value < 768); // md breakpoint is 768px

/**
 * @computed mainLetters
 * @description Splits the main application name into an array of characters for potential letter-by-letter animation.
 * @returns {string[]}
 */
const mainLetters = computed<string[]>(() => props.appNameMain.split(''));

/**
 * @computed subtitleText
 * @description Determines the subtitle text based on screen size and mobile context.
 * Subtitle is hidden in very compact contexts or on small screens by default.
 * @returns {string}
 */
const subtitleText = computed<string>(() => {
  if (props.isMobileContext) return '';
  return isSmallScreen.value ? '' : props.appNameSubtitle;
});

/**
 * @computed subtitleLetters
 * @description Splits the subtitle text into an array of characters.
 * @returns {string[]}
 */
const subtitleLetters = computed<string[]>(() => subtitleText.value.split(''));

/**
 * @computed totalMainLetters
 * @description Calculates the number of letters in the main application name.
 * @returns {number}
 */
const totalMainLetters = computed<number>(() => mainLetters.value.length);

/**
 * @computed appDisplayName
 * @description Constructs the full display name for accessibility (sr-only text).
 * @returns {string}
 */
const appDisplayName = computed<string>(() => {
  if (props.isMobileContext) return props.appNameMain;
  return isSmallScreen.value ? props.appNameMain : `${props.appNameMain} ${props.appNameSubtitle}`;
});

/**
 * @computed logoStateClasses
 * @description Computes dynamic CSS classes for the logo based on application state props.
 * These classes will trigger different animations and styles.
 * @returns {object} Object of class names and their boolean active state.
 */
const logoStateClasses = computed(() => ({
  'compact-logo': props.isMobileContext || isSmallScreen.value,
  'user-listening': props.isUserListening && !props.isAiSpeakingOrProcessing,
  'ai-active': props.isAiSpeakingOrProcessing,
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
      viewBox="-75 -75 150 150" xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" class="grad-stop-1" />
          <stop offset="50%" class="grad-stop-2" />
          <stop offset="100%" class="grad-stop-3" />
        </linearGradient>

        <filter id="logoGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur class="glow-blur" stdDeviation="3.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <circle
        class="logo-ring"
        cx="0" cy="0" r="60"
        fill="none"
        stroke="url(#logoGradient)"
        stroke-width="10"
        stroke-linecap="round"
      />

      <path
        class="logo-waveform"
        d="M -30 -20 L 0 30 L 30 -20"
        fill="none"
        stroke="url(#logoGradient)"
        stroke-width="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <g class="logo-particles-ai-active">
        <circle class="particle p1" cx="0" cy="0" r="1.5" />
        <circle class="particle p2" cx="0" cy="0" r="2" />
        <circle class="particle p3" cx="0" cy="0" r="1" />
      </g>
    </svg>

    <span class="sr-only">{{ appDisplayName }}</span>
    <h1 class="title-text-animated" aria-hidden="true" :class="{'compact-text': props.isMobileContext || isSmallScreen}">
      <span class="app-name-main">
        <span
          v-for="(char, idx) in mainLetters"
          :key="`main-${idx}`"
          class="title-letter main-letter"
          :style="{ animationDelay: `${idx * 0.065}s` }"
        >
          {{ char }}
        </span>
      </span>
      <span class="app-name-subtitle" v-if="subtitleText">
        <span class="space-placeholder">&nbsp;</span>
        <span
          v-for="(char, idx) in subtitleLetters"
          :key="`sub-${idx}`"
          :class="['title-letter', 'subtitle-letter', char === ' ' && 'space-letter']"
          :style="{ animationDelay: `${(totalMainLetters * 0.065) + (idx * 0.045) + 0.15}s` }"
        >
          {{ char === ' ' ? '\u00A0' : char }}
        </span>
      </span>
    </h1>
  </div>
</template>

<style lang="scss" scoped>
/**
 * Scoped SCSS for AnimatedLogo.vue.
 * Defines idle, listening, and AI active state animations for the inline SVG logo.
 * Uses CSS custom properties for theme-awareness.
 */
@use '@/styles/abstracts/variables' as var;
@use '@/styles/abstracts/mixins' as mixins;

.animated-logo-ephemeral {
  display: inline-flex;
  align-items: center;
  gap: calc(var.$spacing-sm * 0.7); // Slightly reduced gap
  user-select: none;
  padding: var.$spacing-xs 0; // Base padding

  // Default Themeable Colors for SVG (CSS variables to be set by parent or theme)
  --logo-grad-stop1-color: hsl(var(--color-logo-primary-h, var.$default-color-accent-primary-h), var(--color-logo-primary-s, var.$default-color-accent-primary-s), var(--color-logo-primary-l, var.$default-color-accent-primary-l));
  --logo-grad-stop2-color: hsl(var(--color-logo-secondary-h, var.$default-color-accent-secondary-h), var(--color-logo-secondary-s, var.$default-color-accent-secondary-s), var(--color-logo-secondary-l, var.$default-color-accent-secondary-l));
  --logo-grad-stop3-color: hsl(var(--color-logo-primary-h, var.$default-color-accent-primary-h), calc(var(--color-logo-primary-s, var.$default-color-accent-primary-s) - 10%), calc(var(--color-logo-primary-l, var.$default-color-accent-primary-l) + 10%));
  --logo-glow-color: hsla(var(--color-logo-primary-h, var.$default-color-accent-primary-h), var(--color-logo-primary-s, var.$default-color-accent-primary-s), var(--color-logo-primary-l, var.$default-color-accent-primary-l), 0.5);
  --logo-glow-std-deviation: 3.5;
  --logo-waveform-thrum-intensity: 0px; // For listening state

  .logo-svg-element {
    width: 28px; height: 28px; // Default mobile/small size
    filter: url(#logoGlowFilter);
    animation: logo-idle-breath 6s var.$ease-in-out-sine infinite alternate; // Base idle animation

    .grad-stop-1 { stop-color: var(--logo-grad-stop1-color); transition: stop-color var.$duration-smooth; }
    .grad-stop-2 { stop-color: var(--logo-grad-stop2-color); transition: stop-color var.$duration-smooth; }
    .grad-stop-3 { stop-color: var(--logo-grad-stop3-color); transition: stop-color var.$duration-smooth; }
    .glow-blur { // Target class for feGaussianBlur
        transition: stdDeviation var.$duration-smooth;
        &.stdDeviation { stdDeviation: var(--logo-glow-std-deviation); } // Allows dynamic update via CSS var if needed, though direct animation is better
    }


    .logo-ring, .logo-waveform {
      transition: stroke-width var.$duration-smooth var.$ease-elastic, transform var.$duration-smooth var.$ease-elastic;
    }
    .logo-waveform {
      animation: logo-waveform-thrum var.$duration-pulse-medium var.$ease-in-out-sine infinite alternate;
      animation-play-state: paused; // Paused by default
    }

    .logo-particles-ai-active {
      opacity: 0;
      transition: opacity var.$duration-smooth;
      .particle {
        fill: var(--logo-grad-stop1-color);
        animation-play-state: paused;
        opacity: 0;
      }
      .p1 { animation: logo-particle-orbit1 3s linear infinite; }
      .p2 { animation: logo-particle-orbit2 3.5s linear infinite reverse; }
      .p3 { animation: logo-particle-orbit3 2.5s linear infinite; }
    }
  }

  &.compact-logo .logo-svg-element { width: 24px; height: 24px; } // Size in compact mode
  @media (min-width: var.$breakpoint-sm) { .logo-svg-element { width: 32px; height: 32px; } }
  @media (min-width: var.$breakpoint-md) { .logo-svg-element { width: 36px; height: 36px; } }


  // --- User Listening State ---
  &.user-listening {
    --logo-glow-std-deviation: 4.5; // More intense glow
    --logo-glow-color: hsla(var(--color-voice-user-h), var(--color-voice-user-s), var(--color-voice-user-l), 0.7);
    .logo-svg-element {
      animation: logo-listening-pulse 1.5s var.$ease-elastic infinite alternate; // Faster, more responsive pulse
      .logo-waveform {
        stroke-width: 11; // Slightly thicker waveform
        animation-play-state: running; // Activate thrumming
      }
      .glow-blur { stdDeviation: var(--logo-glow-std-deviation); } // Apply glow change via filter
    }
  }

  // --- AI Active (Speaking/Processing) State ---
  &.ai-active {
    --logo-grad-stop1-color: hsl(var(--color-voice-ai-speaking-h), var(--color-voice-ai-speaking-s), var(--color-voice-ai-speaking-l));
    --logo-grad-stop2-color: hsl(var(--color-voice-ai-thinking-h), var(--color-voice-ai-thinking-s), var(--color-voice-ai-thinking-l));
    --logo-grad-stop3-color: hsl(var(--color-voice-ai-speaking-h), calc(var(--color-voice-ai-speaking-s) - 10%), calc(var(--color-voice-ai-speaking-l) + 10%));
    --logo-glow-std-deviation: 5; // Brightest glow
    --logo-glow-color: hsla(var(--color-voice-ai-speaking-h), var(--color-voice-ai-speaking-s), var(--color-voice-ai-speaking-l), 0.8);

    .logo-svg-element {
      animation: logo-ai-active-pulse 1s var.$ease-in-out-sine infinite alternate; // Energetic pulse
      .logo-ring {
        // Example: make ring appear to spin or have energy flow
        // This could be a stroke-dasharray animation if we change it to a path
      }
      .logo-particles-ai-active {
        opacity: 1;
        .particle { animation-play-state: running; opacity: 0.7; }
      }
      .glow-blur { stdDeviation: var(--logo-glow-std-deviation); }
    }
  }
}

// Title Text Styles
.title-text-animated {
  font-family: var(--font-family-display, var.$font-family-display); // Use CSS var from theme
  font-size: clamp(1rem, 0.7rem + 0.8vw, 1.2rem);
  line-height: 1;
  color: hsl(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l));
  display: flex;
  align-items: baseline;
  transition: color var.$duration-smooth;

  &.compact-text {
    .app-name-subtitle { display: none; }
    .app-name-main { font-size: clamp(1.1rem, 0.8rem + 0.7vw, 1.3rem); } // Slightly larger main name if subtitle hidden
  }
  @media (min-width: var.$breakpoint-sm) { font-size: clamp(1.1rem, 0.85rem + 0.7vw, 1.35rem); }
  @media (min-width: var.$breakpoint-md) { gap: calc(var.$spacing-xs * 0.4); }
}
.app-name-main {
  display: inline-block;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: hsl(var(--color-logo-main-text-h, var(--color-accent-primary-h)),
             var(--color-logo-main-text-s, var(--color-accent-primary-s)),
             var(--color-logo-main-text-l, var(--color-accent-primary-l)));
  transition: color var.$duration-smooth;
}
.app-name-subtitle {
  display: inline-block;
  font-weight: 400;
  opacity: 0.8;
  font-size: 0.82em;
  letter-spacing: 0.01em;
  color: hsl(var(--color-logo-subtitle-text-h, var(--color-text-secondary-h)),
             var(--color-logo-subtitle-text-s, var(--color-text-secondary-s)),
             var(--color-logo-subtitle-text-l, var(--color-text-secondary-l)));
  transition: color var.$duration-smooth, opacity var.$duration-smooth;
}
.space-placeholder { opacity: 0; width: 0.2em; display: inline-block; }

.title-letter {
  display: inline-block;
  opacity: 0;
  transform: translateY(5px) scale(0.96);
  animation: letter-entrance-ephemeral 0.6s forwards var.$ease-out-expo;
  // Removed individual letter wave for performance and subtlety; overall logo animations provide dynamism
}

// Keyframes
@keyframes logo-idle-breath {
  0% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.03); opacity: 1; }
  100% { transform: scale(1); opacity: 0.9; }
}
@keyframes logo-listening-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); } // More noticeable pulse
  100% { transform: scale(1); }
}
@keyframes logo-ai-active-pulse {
  0% { transform: scale(1); }
  30% { transform: scale(1.12); } // Quick, energetic expansion
  60% { transform: scale(1.05); }
  100% { transform: scale(1.1); }
}
@keyframes logo-waveform-thrum { // For subtle vibration of the V shape
  0%, 100% { transform: translateY(0) translateX(0) rotate(0); }
  25% { transform: translateY(var(--logo-waveform-thrum-intensity, -0.5px)) translateX(0.25px) rotate(0.5deg); }
  75% { transform: translateY(var(--logo-waveform-thrum-intensity, 0.5px)) translateX(-0.25px) rotate(-0.5deg); }
}

@keyframes letter-entrance-ephemeral {
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes logo-particle-orbit1 {
  0% { transform: rotate(0deg) translateX(45px) scale(0.5); opacity: 0; }
  50% { opacity: 0.8; transform: rotate(180deg) translateX(50px) scale(1); }
  100% { transform: rotate(360deg) translateX(45px) scale(0.5); opacity: 0; }
}
@keyframes logo-particle-orbit2 {
  0% { transform: rotate(60deg) translateX(50px) scale(0.6); opacity: 0; }
  50% { opacity: 0.7; transform: rotate(240deg) translateX(55px) scale(1); }
  100% { transform: rotate(420deg) translateX(50px) scale(0.6); opacity: 0; }
}
@keyframes logo-particle-orbit3 {
  0% { transform: rotate(-30deg) translateX(40px) scale(0.4); opacity: 0; }
  50% { opacity: 0.6; transform: rotate(150deg) translateX(45px) scale(0.8); }
  100% { transform: rotate(330deg) translateX(40px) scale(0.4); opacity: 0; }
}
</style>