// File: frontend/src/components/common/AppButton.vue
<template>
  <button
    :is="tag"
    :type="buttonType"
    :class="buttonClasses"
    :disabled="disabled || loading"
    :aria-pressed="role === 'switch' || role === 'checkbox' ? (isActive || undefined) : undefined"
    :aria-disabled="disabled || loading"
    :aria-label="ariaLabel || accessibleLabel"
    :data-voice-target="voiceTarget || generatedVoiceTargetId"
    v-bind="$attrs"
    @click="handleClick"
  >
    <span v-if="loading" class="button-loader" aria-hidden="true">
      <LoadingSpinner :size="loaderSize" :variant="spinnerVariant" />
    </span>
    <span v-if="iconPosition === 'left' && !loading && (icon || $slots.icon)" class="button-icon-wrapper icon-left" aria-hidden="true">
      <slot name="icon">
        <component :is="icon" v-if="typeof icon === 'object'" class="button-icon" />
        <i v-else-if="typeof icon === 'string'" :class="['button-icon', icon]"></i>
      </slot>
    </span>
    <span class="button-text">
      <slot>{{ label }}</slot>
    </span>
    <span v-if="iconPosition === 'right' && !loading && (icon || $slots.icon)" class="button-icon-wrapper icon-right" aria-hidden="true">
      <slot name="icon">
        <component :is="icon" v-if="typeof icon === 'object'" class="button-icon" />
        <i v-else-if="typeof icon === 'string'" :class="['button-icon', icon]"></i>
      </slot>
    </span>
  </button>
</template>

<script setup lang="ts">
/**
 * @file AppButton.vue
 * @description A versatile and accessible button component with support for various styles,
 * states (loading, disabled), icons, theming, and voice navigation targeting.
 * It can also render as a link (`<a>`) tag if `href` is provided.
 */
import { computed, useSlots, PropType, shallowRef, onMounted } from 'vue';
import type { Component } from 'vue';
import LoadingSpinner from './LoadingSpinner.vue'; // Assuming a simple spinner

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' | 'warning' | 'link' | 'custom';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type IconPosition = 'left' | 'right';
type ButtonHtmlType = 'button' | 'submit' | 'reset';

const props = defineProps({
  /** The text label for the button if no default slot is used. */
  label: { type: String, default: '' },
  /**
   * The visual style variant of the button.
   * Affects background, text color, borders.
   * @type {ButtonVariant}
   */
  variant: { type: String as PropType<ButtonVariant>, default: 'primary' },
  /**
   * The size of the button.
   * Affects padding, font size.
   * @type {ButtonSize}
   */
  size: { type: String as PropType<ButtonSize>, default: 'md' },
  /** Whether the button should take the full width of its container. */
  block: { type: Boolean, default: false },
  /** Whether the button is disabled. */
  disabled: { type: Boolean, default: false },
  /** Whether the button is in a loading state (shows spinner). */
  loading: { type: Boolean, default: false },
  /**
   * Optional: Vue component definition or CSS class string for an icon.
   * @type {Component | string}
   */
  icon: { type: [Object, String] as PropType<Component | string>, default: null },
  /**
   * Position of the icon relative to the button text.
   * @type {IconPosition}
   */
  iconPosition: { type: String as PropType<IconPosition>, default: 'left' },
  /** Makes the button appear rounded. */
  rounded: { type: Boolean, default: false },
  /** Makes the button appear as a circle (icon-only typically). */
  pill: { type: Boolean, default: false }, // Renamed from circle to pill for clarity with rounded
  /**
   * If provided, the button renders as an `<a>` tag with this href.
   * @type {string}
   */
  href: { type: String, default: null },
  /**
   * Target attribute for links (e.g., '_blank'). Only used if `href` is set.
   * @type {string}
   */
  target: { type: String, default: null },
  /**
   * The HTML `type` attribute for the button (e.g., 'button', 'submit', 'reset').
   * Only applies if not rendering as a link.
   * @type {ButtonHtmlType}
   */
  htmlType: { type: String as PropType<ButtonHtmlType>, default: 'button' },
  /**
   * Explicit ARIA label for accessibility. Overrides label/slot content for screen readers.
   * @type {string}
   */
  ariaLabel: { type: String, default: '' },
  /**
   * Unique identifier for voice navigation targeting (`data-voice-target`).
   * If not provided, a unique ID will be generated.
   * @type {string}
   */
  voiceTarget: { type: String, default: '' },
  /**
   * ARIA role for the button, useful for toggle buttons ('switch', 'checkbox') or menu buttons.
   * @type {string}
   */
  role: { type: String, default: 'button' },
  /**
   * For toggle buttons (role='switch' or 'checkbox'), indicates the active/pressed state.
   * @type {boolean}
   */
  isActive: { type: Boolean, default: false },
});

const emit = defineEmits<{
  /**
   * Emitted when the button is clicked.
   * @param {MouseEvent} event - The native click event.
   */
  (e: 'click', event: MouseEvent): void;
}>();

const slots = useSlots();
const generatedVoiceTargetId = shallowRef('');

onMounted(() => {
  if (!props.voiceTarget && (props.label || slots.default)) {
    const textContent = props.label || (slots.default && (slots.default()[0]?.children as string)?.trim());
    if (textContent) {
      generatedVoiceTargetId.value = `btn-${textContent.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2,7)}`;
    } else {
      generatedVoiceTargetId.value = `btn-icon-${Math.random().toString(36).substring(2,7)}`;
    }
  }
});

/** The HTML tag to use for the button ('a' if href is provided, otherwise 'button'). */
const tag = computed(() => (props.href ? 'a' : 'button'));

/** The HTML button type, not applicable if it's a link. */
const buttonType = computed(() => (tag.value === 'button' ? props.htmlType : undefined));

/** Computes the CSS classes for the button based on its props. */
const buttonClasses = computed(() => [
  'app-button',
  `variant-${props.variant}`,
  `size-${props.size}`,
  {
    'is-block': props.block,
    'is-loading': props.loading,
    'is-disabled': props.disabled || props.loading, // Loading implies disabled
    'is-rounded': props.rounded && !props.pill,
    'is-pill': props.pill,
    'has-icon': !!(props.icon || slots.icon),
    'icon-only': !!(props.icon || slots.icon) && !(props.label || slots.default),
  },
]);

/** Text for accessibility, derived from ariaLabel, label, or slot content. */
const accessibleLabel = computed(() => {
  if (props.ariaLabel) return props.ariaLabel;
  if (props.label) return props.label;
  if (slots.default) {
    const slotContent = slots.default()[0]?.children;
    if (typeof slotContent === 'string') return slotContent.trim();
  }
  if (props.icon && typeof props.icon === 'string' && (props.icon.includes('delete') || props.icon.includes('close'))) return 'Close'; // Fallback for common icon-only
  return 'Button'; // Generic fallback
});

const loaderSize = computed(() => {
  switch(props.size) {
    case 'xs':
    case 'sm': return 'sm';
    case 'lg':
    case 'xl': return 'lg';
    default: return 'md';
  }
});
const spinnerVariant = computed(() => {
    // Match spinner color to button text color for contrast
    if (props.variant === 'primary' || props.variant === 'danger' || props.variant === 'success') return 'light';
    return 'primary';
});


const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) {
    event.preventDefault();
    return;
  }
  emit('click', event);
  // If it's a link and not disabled, default browser navigation will occur.
};
</script>

<style scoped>
/* Styles will heavily rely on CSS Custom Properties defined in _variables.css and theme files. */
/* All colors, borders, shadows, fonts should come from these variables. */
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--app-font-family, sans-serif);
  font-weight: var(--app-button-font-weight, 500);
  border: 1px solid transparent;
  cursor: pointer;
  text-decoration: none; /* For <a> tag rendering */
  transition: background-color 0.2s ease-out, border-color 0.2s ease-out, box-shadow 0.2s ease-out, opacity 0.2s ease-out;
  white-space: nowrap;
  user-select: none;
  position: relative; /* For loader positioning */
  padding: var(--app-button-padding-y) var(--app-button-padding-x); /* Default, overridden by size */
  border-radius: var(--app-button-border-radius, 0.375rem); /* Default, overridden by rounded/pill */
}

.app-button:focus-visible {
  outline: 2px solid var(--app-focus-ring-color, var(--app-primary-color));
  outline-offset: 2px;
}

/* Variants - Background, Text Color, Border */
.variant-primary {
  background-color: var(--app-button-primary-bg, var(--app-primary-color, #2563eb));
  color: var(--app-button-primary-text, white);
  border-color: var(--app-button-primary-border, var(--app-primary-color, #2563eb));
}
.variant-primary:hover:not(.is-disabled) {
  background-color: var(--app-button-primary-hover-bg, var(--app-primary-color-dark, #1d4ed8));
  border-color: var(--app-button-primary-hover-border, var(--app-primary-color-dark, #1d4ed8));
}

.variant-secondary {
  background-color: var(--app-button-secondary-bg, var(--app-border-color, #e5e7eb));
  color: var(--app-button-secondary-text, var(--app-text-color, #1f2937));
  border-color: var(--app-button-secondary-border, var(--app-border-color, #e5e7eb));
}
.variant-secondary:hover:not(.is-disabled) {
  background-color: var(--app-button-secondary-hover-bg, #d1d5db); /* Tailwind gray-300 */
  border-color: var(--app-button-secondary-hover-border, #d1d5db);
}

.variant-tertiary { /* Ghost or Outline style */
  background-color: transparent;
  color: var(--app-button-tertiary-text, var(--app-primary-color, #2563eb));
  border-color: var(--app-button-tertiary-border, var(--app-primary-color, #2563eb));
}
.variant-tertiary:hover:not(.is-disabled) {
  background-color: var(--app-button-tertiary-hover-bg, rgba(37, 99, 235, 0.1));
}

.variant-link {
  background-color: transparent;
  color: var(--app-button-link-text, var(--app-primary-color, #2563eb));
  border-color: transparent;
  padding-left: 0.25em; padding-right: 0.25em; /* Less padding for link-like */
}
.variant-link:hover:not(.is-disabled) {
  text-decoration: underline;
  color: var(--app-button-link-hover-text, var(--app-primary-color-dark, #1d4ed8));
}


/* Sizes - Padding, Font Size */
.size-xs { padding: 0.25rem 0.5rem; font-size: var(--app-font-size-xs, 0.75rem); }
.size-sm { padding: 0.375rem 0.75rem; font-size: var(--app-font-size-sm, 0.875rem); }
.size-md { padding: 0.5rem 1rem; font-size: var(--app-font-size-base, 1rem); } /* Default */
.size-lg { padding: 0.625rem 1.25rem; font-size: var(--app-font-size-lg, 1.125rem); }
.size-xl { padding: 0.75rem 1.5rem; font-size: var(--app-font-size-xl, 1.25rem); }

/* Modifiers */
.is-block { width: 100%; }
.is-rounded { border-radius: var(--app-button-rounded-radius, 0.5rem); }
.is-pill { border-radius: var(--app-button-pill-radius, 9999px); }

.is-disabled {
  opacity: var(--app-button-disabled-opacity, 0.6);
  cursor: not-allowed;
}

/* Icon Styling */
.button-icon-wrapper { display: inline-flex; align-items: center; justify-content: center; }
.button-icon { /* Assuming SVGs or font icons adjust to current color and size */
  width: 1em; /* Scale with font-size */
  height: 1em;
  /* fill: currentColor; For SVGs */
}
.icon-left { margin-right: 0.5em; }
.icon-right { margin-left: 0.5em; }

.icon-only { padding: 0.5em; /* Adjust for square-ish look */ }
.icon-only.size-xs { padding: 0.375em; }
.icon-only.size-sm { padding: 0.4375em; }
.icon-only.size-lg { padding: 0.5625em; }
.icon-only.size-xl { padding: 0.625em; }


/* Loading State */
.button-loader {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background-color: rgba(255,255,255,0.3); Optional overlay */
}
.is-loading .button-text,
.is-loading .button-icon-wrapper {
  visibility: hidden; /* Hide text/icon when loading */
}

/* Holographic Theme Specifics (Example - in a theme file or conditional class) */
.theme-holographic .app-button.variant-primary {
  background: linear-gradient(145deg, var(--holographic-accent, #00f2ff), color-mix(in srgb, var(--holographic-accent, #00f2ff) 80%, black));
  color: var(--holographic-bg-start, #0a0f1f);
  border: 1px solid color-mix(in srgb, var(--holographic-accent, #00f2ff) 50%, transparent);
  box-shadow: 0 0 8px color-mix(in srgb, var(--holographic-accent, #00f2ff) 70%, transparent),
              inset 0 0 5px color-mix(in srgb, var(--holographic-accent, #00f2ff) 30%, transparent);
  text-shadow: 0 0 3px color-mix(in srgb, var(--holographic-accent, #00f2ff) 20%, transparent);
}
.theme-holographic .app-button.variant-primary:hover:not(.is-disabled) {
  box-shadow: 0 0 15px var(--holographic-accent, #00f2ff),
              inset 0 0 10px color-mix(in srgb, var(--holographic-accent, #00f2ff) 50%, transparent);
  transform: translateY(-1px);
}
/* Add more holographic variants */
</style>