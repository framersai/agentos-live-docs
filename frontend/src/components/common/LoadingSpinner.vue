// File: frontend/src/components/common/LoadingSpinner.vue
<template>
  <div
    role="status"
    :aria-label="effectiveLabel"
    class="loading-spinner-wrapper"
    :data-voice-target="voiceTarget || 'loading-indicator'"
  >
    <svg
      class="spinner-svg"
      :width="sizeInPixels"
      :height="sizeInPixels"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      :style="{ '--spinner-color': resolvedColor, '--spinner-trail-color': resolvedTrailColor }"
    >
      <circle
        class="trail-circle"
        cx="50"
        cy="50"
        r="45"
        stroke-width="10"
        fill="none"
      />
      <circle
        class="moving-circle"
        cx="50"
        cy="50"
        r="45"
        stroke-width="10"
        fill="none"
        stroke-linecap="round"
        pathLength="100"
      />
    </svg>
    <p v-if="message" class="spinner-message" :style="{ color: resolvedColor }">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
/**
 * @file LoadingSpinner.vue
 * @description A customizable, themeable, and accessible SVG loading spinner component.
 * Features CSS animations for smooth performance.
 */
import { computed, PropType } from 'vue';
import { useI18n } from '../../composables/useI18n';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
type SpinnerVariant = 'primary' | 'accent' | 'light' | 'dark' | 'custom';

const props = defineProps({
  /**
   * The size of the spinner. 'custom' allows `customSize` prop.
   * @type {SpinnerSize}
   */
  size: {
    type: String as PropType<SpinnerSize>,
    default: 'md',
  },
  /**
   * Custom size in pixels, used if `size` is 'custom'.
   * @type {number}
   */
  customSize: {
    type: Number,
    default: 48,
  },
  /**
   * Color variant of the spinner. 'custom' allows `customColor` prop.
   * @type {SpinnerVariant}
   */
  variant: {
    type: String as PropType<SpinnerVariant>,
    default: 'primary',
  },
  /**
   * Custom color for the spinner, used if `variant` is 'custom'.
   * Can be any valid CSS color string (e.g., hex, rgb, CSS variable).
   * @type {string}
   */
  customColor: {
    type: String,
    default: 'var(--app-primary-color)', // Default to primary theme color
  },
  /**
   * Custom color for the spinner's trail, used if `variant` is 'custom'.
   * @type {string}
   */
  customTrailColor: {
      type: String,
      default: 'var(--app-spinner-trail-color, rgba(128, 128, 128, 0.2))'
  },
  /**
   * Optional message to display below the spinner.
   * @type {string}
   */
  message: {
    type: String,
    default: '',
  },
  /**
   * ARIA label for accessibility. Defaults to "Loading".
   * @type {string}
   */
  ariaLabel: {
    type: String,
    default: '',
  },
  /**
   * Unique identifier for voice navigation targeting.
   * @type {string}
   */
  voiceTarget: {
    type: String,
    default: 'loading-spinner',
  },
});

const { t } = useI18n();

/** The effective ARIA label, using provided prop or a default translated string. */
const effectiveLabel = computed(() => props.ariaLabel || t('common.loading'));

/** Maps size prop to pixel dimensions. */
const sizeInPixels = computed(() => {
  if (props.size === 'custom') return props.customSize;
  const sizeMap: Record<Exclude<SpinnerSize, 'custom'>, number> = {
    xs: 16,
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64,
  };
  return sizeMap[props.size] || sizeMap.md;
});

/** Resolves the spinner's active color based on variant or custom prop. */
const resolvedColor = computed(() => {
  if (props.variant === 'custom') return props.customColor;
  const variantColorMap: Record<Exclude<SpinnerVariant, 'custom'>, string> = {
    primary: 'var(--app-primary-color)',
    accent: 'var(--app-accent-color)',
    light: 'var(--app-spinner-light-color, #ffffff)', // For dark backgrounds
    dark: 'var(--app-spinner-dark-color, var(--app-text-color))',   // For light backgrounds
  };
  return variantColorMap[props.variant] || variantColorMap.primary;
});

/** Resolves the spinner's trail color. */
const resolvedTrailColor = computed(() => {
    if (props.variant === 'custom' && props.customTrailColor) return props.customTrailColor;
    // For predefined variants, you might want different trail colors,
    // e.g., a lighter version of the primary color, or a standard light gray.
    // For simplicity, using a general trail color variable, or a slightly opaque version of the main color.
    // return `color-mix(in srgb, ${resolvedColor.value} 20%, transparent)`; // Example for a lighter trail
    return 'var(--app-spinner-trail-color, rgba(128, 128, 128, 0.2))';
});

</script>

<style scoped>
.loading-spinner-wrapper {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem; /* Space between spinner and message */
  color: var(--spinner-color); /* Fallback for message color if not explicitly set */
}

.spinner-svg {
  animation: rotate 2s linear infinite;
  transform-origin: center center;
}

.trail-circle {
  stroke: var(--spinner-trail-color);
  opacity: 0.4; /* Make trail slightly more subtle */
}

.moving-circle {
  stroke: var(--spinner-color);
  stroke-dasharray: 25, 100; /* Start with a small dash */
  stroke-dashoffset: 0;
  animation: dash 1.5s ease-in-out infinite;
}

.spinner-message {
  font-size: var(--app-font-size-sm, 0.875rem);
  font-weight: var(--app-font-weight-medium, 500);
  color: var(--spinner-color); /* Ensures message matches spinner color */
  text-align: center;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 100; /* Smallest dash */
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 100; /* Longest dash */
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 100;
    stroke-dashoffset: -124; /* Completes the circle + a bit more */
  }
}

/* Holographic theme specific styling for the spinner */
.theme-holographic .loading-spinner-wrapper {
  /* --spinner-color: var(--holographic-accent, #00f2ff); */
  /* --spinner-trail-color: color-mix(in srgb, var(--holographic-accent, #00f2ff) 20%, transparent); */
}
/* You can override --spinner-color and --spinner-trail-color using theme classes if needed,
   but the component's `variant` prop is often more direct for this specific element. */
</style>