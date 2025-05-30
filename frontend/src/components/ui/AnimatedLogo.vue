// File: frontend/src/components/ui/AnimatedLogo.vue
/**
 * @file AnimatedLogo.vue
 * @description A component that displays an animated application logo and name.
 * The app name ("Voice Chat") animates on component mount if specified.
 * Includes states for user listening and AI speaking/processing for visual feedback.
 *
 * @component AnimatedLogo
 * @props {string} [appNameMain="VCA"] - The main part of the application name.
 * @props {string} [appNameSubtitle=""] - The subtitle part of the application name (e.g., "Voice Chat").
 * @props {boolean} [isMobileContext=false] - Adjusts styling for mobile contexts.
 * @props {boolean} [animateTitleOnLoad=false] - If true, the appNameSubtitle will animate on load.
 * @props {boolean} [isUserListening=false] - Indicates if the user is currently speaking or STT is active.
 * @props {boolean} [isAiSpeakingOrProcessing=false] - Indicates if AI is speaking (TTS) or processing a request.
 *
 * @version 1.1.0 - Added title animation on load functionality.
 */
<script setup lang="ts">
import { ref, computed, onMounted, type PropType } from 'vue';
import { useUiStore } from '@/store/ui.store';

const props = defineProps({
  appNameMain: {
    type: String as PropType<string>,
    default: 'VCA',
  },
  appNameSubtitle: {
    type: String as PropType<string>,
    default: '',
  },
  isMobileContext: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  animateTitleOnLoad: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  isUserListening: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  isAiSpeakingOrProcessing: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
});

const uiStore = useUiStore();
const titleReady = ref(!props.animateTitleOnLoad);

/**
 * @computed logoContainerClasses
 * @description Computes dynamic CSS classes for the logo container based on its state.
 * @returns {object} An object of CSS classes.
 */
const logoContainerClasses = computed(() => ({
  'animated-logo-container-ephemeral': true,
  'is-mobile': props.isMobileContext,
  'user-listening': props.isUserListening,
  'ai-active': props.isAiSpeakingOrProcessing,
  'reduced-motion': uiStore.isReducedMotionPreferred,
}));

/**
 * @computed titleSpanStyles
 * @description Computes styles for each character span in the animated title for staggered animation.
 * @param {number} index - The index of the character.
 * @returns {object} CSS style object.
 */
const titleSpanStyles = (index: number) => ({
  animationDelay: props.animateTitleOnLoad && !uiStore.isReducedMotionPreferred ? `${index * 0.07}s` : '0s',
});

onMounted(() => {
  if (props.animateTitleOnLoad) {
    // Trigger animation by setting titleReady after a short delay to ensure CSS is applied.
    setTimeout(() => {
      titleReady.value = true;
    }, 100);
  }
});
</script>

<template>
  <div :class="logoContainerClasses">
    <svg
      class="logo-svg-ephemeral"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter id="logo-glow-ephemeral" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="logo-core-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="var(--logo-gradient-start, hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), calc(var(--color-accent-primary-l) + 10%)))" />
          <stop offset="100%" stop-color="var(--logo-gradient-end, hsl(var(--color-accent-secondary-h), var(--color-accent-secondary-s), var(--color-accent-secondary-l)))" />
        </radialGradient>
      </defs>

      <circle class="logo-orbit logo-orbit-1" cx="50" cy="50" r="45" />
      <circle class="logo-orbit logo-orbit-2" cx="50" cy="50" r="40" />

      <circle class="logo-core-ephemeral" cx="50" cy="50" r="28" fill="url(#logo-core-gradient)" />

      <path class="logo-accent logo-accent-1" d="M50 25 Q65 40 60 50 Q65 60 50 75" />
      <path class="logo-accent logo-accent-2" d="M50 25 Q35 40 40 50 Q35 60 50 75" />
      <circle class="logo-sparkle logo-sparkle-1" cx="30" cy="35" r="3" />
      <circle class="logo-sparkle logo-sparkle-2" cx="70" cy="65" r="2.5" />
    </svg>

    <div class="app-name-ephemeral">
      <span class="app-name-main">{{ props.appNameMain }}</span>
      <div v-if="props.appNameSubtitle" class="app-name-subtitle-wrapper">
        <span
          v-for="(char, index) in props.appNameSubtitle.split('')"
          :key="`${char}-${index}`"
          class="subtitle-char"
          :class="{ 'animate-char-in': titleReady && animateTitleOnLoad && !uiStore.isReducedMotionPreferred }"
          :style="titleSpanStyles(index)"
        >
          {{ char === ' ' ? '&nbsp;' : char }}
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/abstracts/variables' as var;
@use '@/styles/abstracts/mixins' as mixins;

.animated-logo-container-ephemeral {
  display: flex;
  align-items: center;
  gap: var.$spacing-sm;
  min-width: 0; // Prevent flexbox blowout

  // Base Colors from Theme
  --logo-core-color: hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l));
  --logo-accent-color: hsl(var(--color-accent-secondary-h), var(--color-accent-secondary-s), var(--color-accent-secondary-l));
  --logo-orbit-color: hsla(var(--color-border-primary-h), var(--color-border-primary-s), var(--color-border-primary-l), 0.2);
  --logo-sparkle-color: hsl(var(--color-accent-glow-h), var(--color-accent-glow-s), var(--color-accent-glow-l));
  --logo-gradient-start: hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), calc(var(--color-accent-primary-l) + 10%));
  --logo-gradient-end: hsl(var(--color-accent-secondary-h), var(--color-accent-secondary-s), var(--color-accent-secondary-l));

  .logo-svg-ephemeral {
    width: calc(var.$header-height-mobile * 0.65); // Scaled with header height
    height: calc(var.$header-height-mobile * 0.65);
    filter: drop-shadow(0 1px 3px hsla(var(--shadow-color-h), var(--shadow-color-s), var(--shadow-color-l), 0.1));
    transition: transform var.$duration-smooth var.$ease-out-quad;
    flex-shrink: 0;

    @media (min-width: var.$breakpoint-md) {
      width: calc(var.$header-height-desktop * 0.55);
      height: calc(var.$header-height-desktop * 0.55);
    }
  }

  .logo-core-ephemeral {
    filter: url(#logo-glow-ephemeral);
    transition: r var.$duration-smooth var.$ease-elastic;
  }

  .logo-orbit {
    fill: none;
    stroke: var(--logo-orbit-color);
    stroke-width: 1.5;
    transform-origin: center;
    opacity: 0.7;
  }

  .logo-orbit-1 { animation: logo-spin 20s linear infinite; }
  .logo-orbit-2 { animation: logo-spin 28s linear infinite reverse; }

  .logo-accent {
    fill: none;
    stroke: var(--logo-accent-color);
    stroke-width: 3;
    stroke-linecap: round;
    opacity: 0; // Initially hidden for active states
    transition: opacity var.$duration-quick;
  }

  .logo-sparkle {
    fill: var(--logo-sparkle-color);
    opacity: 0;
    animation: logo-sparkle-pulse 3s var.$ease-in-out-sine infinite alternate;
    transition: opacity var.$duration-quick;
  }
  .logo-sparkle-1 { animation-delay: 0s; }
  .logo-sparkle-2 { animation-delay: 0.5s; }


  // Active States
  &.user-listening {
    .logo-core-ephemeral { r: 30; } // Core expands slightly
    .logo-accent { opacity: 0.7; }
    .logo-sparkle { opacity: 1; }
  }

  &.ai-active {
    .logo-core-ephemeral { r: 32; } // Core expands more
    .logo-orbit-1 { animation-duration: 8s; } // Orbits speed up
    .logo-orbit-2 { animation-duration: 12s; }
    .logo-accent { opacity: 0.85; stroke-width: 3.5; }
    .logo-sparkle { opacity: 1; animation-duration: 1.5s; }
  }

  // Reduced motion preferences
  &.reduced-motion {
    .logo-orbit-1, .logo-orbit-2, .logo-sparkle { animation: none !important; }
    .logo-accent { opacity: 0.6; } // Static accent for reduced motion
    .logo-sparkle { opacity: 0.8; }
  }

  .app-name-ephemeral {
    display: flex;
    flex-direction: column;
    line-height: 1.1;
    white-space: nowrap;
    overflow: hidden;
    color: hsl(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l));
  }

  .app-name-main {
    font-family: var.$font-family-display;
    font-weight: 700;
    font-size: var.$font-size-lg; // Adjusted for better fit
    letter-spacing: 0.01em; // Slightly tighter for display feel

    @media (min-width: var.$breakpoint-md) {
      font-size: var.$font-size-xl;
    }
  }

  .app-name-subtitle-wrapper {
    font-family: var.$font-family-sans;
    font-weight: 500;
    font-size: var.$font-size-xs;
    color: hsl(var(--color-text-secondary-h), var(--color-text-secondary-s), var(--color-text-secondary-l));
    letter-spacing: 0.03em;
    opacity: 0.9;
    display: flex; // For char animation
  }

  .subtitle-char {
    display: inline-block; // Required for transform
    opacity: 0;
    transform: translateY(8px) scale(0.9); // Initial state for animation
    will-change: opacity, transform;

    &.animate-char-in {
      animation-name: char-slide-fade-in;
      animation-duration: 0.5s;
      animation-timing-function: var.$ease-out-quint;
      animation-fill-mode: forwards;
    }
  }
}

// Keyframes used by this component specifically
@keyframes logo-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes logo-sparkle-pulse {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 0.9; transform: scale(1.1); }
}

@keyframes char-slide-fade-in {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>