// File: frontend/src/components/AnimatedLogo.vue
/**
 * @file AnimatedLogo.vue
 * @description Animated application logo and title, themed for Ephemeral Harmony.
 * Responds to screen size for compact display.
 * @version 2.2.0 - Responsive text display.
 */
<script lang="ts" setup>
import { computed } from 'vue';
import { useWindowSize } from '@vueuse/core'; // For responsive text

const props = defineProps({
  appNameMain: { type: String, default: 'VCA' },
  appNameSubtitle: { type: String, default: 'Assistant' },
  isMobileContext: { type: Boolean, default: false } // Hint for extremely compact views like mobile nav header
});

const { width } = useWindowSize();
const isSmallScreen = computed(() => width.value < 768); // md breakpoint

const mainLetters = computed(() => props.appNameMain.split(''));
const subtitleText = computed(() => {
  if (props.isMobileContext) return ''; // No subtitle in very compact contexts
  return isSmallScreen.value ? '' : props.appNameSubtitle; // Hide subtitle on small screens by default
});
const subtitleLetters = computed(() => subtitleText.value.split(''));
const totalMainLetters = computed(() => mainLetters.value.length);

const appDisplayName = computed(() => {
    if (props.isMobileContext) return props.appNameMain;
    return isSmallScreen.value ? props.appNameMain : `${props.appNameMain} ${props.appNameSubtitle}`;
});

</script>

<template>
  <div
    class="animated-logo-ephemeral"
    :aria-label="`${appNameMain} ${appNameSubtitle} Logo`"
  >
    <img
      src="@/assets/logo.svg"
      alt=""
      class="logo-img-animated"
      :class="{'compact': isSmallScreen || isMobileContext}"
    />
    <span class="sr-only">{{ appDisplayName }}</span>
    <h1 class="title-text-animated" aria-hidden="true">
      <span class="app-name-main">
        <span
          v-for="(char, idx) in mainLetters"
          :key="`main-${idx}`"
          class="title-letter main-letter"
          :style="{ animationDelay: `${idx * 0.075}s` }"
        >
          {{ char }}
        </span>
      </span>
      <span class="app-name-subtitle" v-if="subtitleText">
        <span class="space-placeholder" v-if="!isSmallScreen && !isMobileContext">&nbsp;</span>
        <span
          v-for="(char, idx) in subtitleLetters"
          :key="`sub-${idx}`"
          :class="['title-letter', 'subtitle-letter', char === ' ' && 'space-letter']"
          :style="{ animationDelay: `${(totalMainLetters * 0.075) + (idx * 0.05) + 0.15}s` }"
        >
          {{ char === ' ' ? '\u00A0' : char }}
        </span>
      </span>
    </h1>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/abstracts/variables' as var;

.animated-logo-ephemeral {
  display: inline-flex;
  align-items: center;
  gap: calc(var.$spacing-sm * 0.75); // Reduced gap
  user-select: none;
  padding: var.$spacing-xs 0;
}

.logo-img-animated {
  width: 28px; // Default smaller size
  height: 28px;
  animation: subtle-spin-logo 25s linear infinite,
             logo-pulse-ephemeral 4s ease-in-out infinite alternate;
  filter: drop-shadow(0 0 6px hsla(var(--color-logo-primary-h, var.$default-color-accent-primary-h), 
                                   var(--color-logo-primary-s, var.$default-color-accent-primary-s), 
                                   var(--color-logo-primary-l, var.$default-color-accent-primary-l), 0.6));
  html[data-theme*="dark"] & {
     filter: drop-shadow(0 0 8px hsla(var(--color-logo-primary-h, var.$default-color-accent-primary-h), 
                                      var(--color-logo-primary-s, var.$default-color-accent-primary-s), 
                                      var(--color-logo-primary-l, var.$default-color-accent-primary-l), 0.75));
  }
  transition: width 0.3s, height 0.3s;

  &.compact { // Used in very small contexts like mobile nav header
    width: 24px; 
    height: 24px;
  }
  @media (min-width: var.$breakpoint-sm) {
    width: 32px;
    height: 32px;
  }
   @media (min-width: var.$breakpoint-md) { // Standard desktop size
    width: 36px;
    height: 36px;
  }
}

.title-text-animated {
  font-family: var(--font-family-display, #{var.$font-family-display});
  font-size: clamp(1rem, 0.7rem + 0.8vw, 1.2rem); // Smaller base, still responsive
  line-height: 1; // Tight line height for stacked look
  color: hsl(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l));
  display: flex;
  align-items: baseline; // Align main and subtitle along their baseline

  @media (min-width: var.$breakpoint-sm) {
    font-size: clamp(1.1rem, 0.85rem + 0.7vw, 1.35rem);
  }
   @media (min-width: var.$breakpoint-md) {
    gap: var.$spacing-xs * 0.5; // Small gap between VCA and Assistant on desktop
  }
}

.app-name-main {
  display: inline-block;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: hsl(var(--color-logo-main-text-h, var(--color-accent-primary-h)), 
             var(--color-logo-main-text-s, var(--color-accent-primary-s)), 
             var(--color-logo-main-text-l, var(--color-accent-primary-l)));
  // VCA Part: Pinkish/Reddish driven by --color-logo-main-text (from magenta-mystic theme)
  // For Magenta Mystic theme, set --color-logo-main-text-h to ~320-340 (pink/magenta), S ~90-100%, L ~65-75%
  // Example: text-shadow: 0 0 4px hsla(var(--color-logo-main-text-h), var(--color-logo-main-text-s), var(--color-logo-main-text-l), 0.4);
}

.app-name-subtitle {
  display: inline-block;
  font-weight: 400;
  opacity: 0.75;
  font-size: 0.85em;
  letter-spacing: 0.01em;
  color: hsl(var(--color-logo-subtitle-text-h, var(--color-text-secondary-h)), 
             var(--color-logo-subtitle-text-s, var(--color-text-secondary-s)), 
             var(--color-logo-subtitle-text-l, var(--color-text-secondary-l)));
  // Assistant Part: Uses --color-logo-subtitle-text or falls back to text-secondary
  // For Magenta Mystic, this could be a lighter, desaturated pink or a soft cyan/teal
  // Example: text-shadow: 0 0 2px hsla(var(--color-logo-subtitle-text-h), var(--color-logo-subtitle-text-s), var(--color-logo-subtitle-text-l), 0.2);
}
.space-placeholder { opacity: 0; width: 0.25em; display: inline-block; } // For space before subtitle on desktop

.title-letter {
  display: inline-block;
  opacity: 0;
  transform: translateY(6px) scale(0.95); // More subtle entrance
  animation: letter-entrance-ephemeral 0.55s forwards var.$ease-out-expo,
             letter-wave-ephemeral 3s ease-in-out infinite alternate;
  animation-play-state: running; // Ensure it plays

  .app-name-main & { // Different wave for main title letters
    animation-name: letter-entrance-ephemeral, letter-wave-main-ephemeral;
  }
}

.space-letter {
  width: 0.3em;
  animation: none !important;
  opacity: 1 !important;
  transform: none !important;
}

@keyframes letter-entrance-ephemeral {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes letter-wave-ephemeral { // General subtle wave
  0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
  50% { transform: translateY(-1px) scale(1.02) rotate(0.5deg); }
}
@keyframes letter-wave-main-ephemeral { // Slightly more pronounced for main title
  0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
  50% { transform: translateY(-1.5px) scale(1.03) rotate(-0.5deg); }
}
</style>