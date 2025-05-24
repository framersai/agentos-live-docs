<template>
  <div class="app-input-wrapper" :class="[wrapperClasses, { 'has-error': !!errorMessage }]">
    <label
      v-if="label && !floatingLabel"
      :for="effectiveId"
      class="app-input-label"
      :data-voice-target="voiceTargetIdPrefix + 'label'"
    >
      {{ label }}
      <span v-if="required" class="text-danger-500" aria-hidden="true">*</span>
    </label>
    <div class="relative" :class="{ 'floating-label-group': floatingLabel }">
      <div v-if="$slots.prepend || prependIcon" class="input-adornment prepend">
        <slot name="prepend">
          <component :is="prependIcon" v-if="prependIcon" class="adornment-icon" aria-hidden="true" />
        </slot>
      </div>
      <input
        :id="effectiveId"
        ref="inputRef"
        :type="effectiveType"
        :value="modelValue"
        :name="name"
        :placeholder="floatingLabel ? (isFocused || modelValue ? placeholder : label) : placeholder || label"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :aria-required="required"
        :aria-invalid="!!errorMessage"
        :aria-describedby="describedBy"
        :class="['app-input-field', inputFieldClasses, { 'has-prepend': $slots.prepend || prependIcon, 'has-append': $slots.append || appendIcon || type === 'password' }]"
        :data-voice-target="voiceTarget"
        v-bind="$attrs"
        @input="onInput"
        @blur="onBlur"
        @focus="onFocus"
        @keydown="onKeydown"
      />
      <label
        v-if="label && floatingLabel"
        :for="effectiveId"
        class="app-input-label-floating"
        :class="{ 'is-active': isFocused || modelValue }"
        :data-voice-target="voiceTargetIdPrefix + 'label-floating'"
      >
        {{ label }}
        <span v-if="required" class="text-danger-500" aria-hidden="true">*</span>
      </label>
      <div v-if="$slots.append || appendIcon || type === 'password'" class="input-adornment append">
        <slot name="append">
          <button
            v-if="type === 'password'"
            type="button"
            class="password-toggle-button"
            :aria-label="isPasswordVisible ? t('forms.hidePassword') : t('forms.showPassword')"
            :data-voice-target="voiceTargetIdPrefix + 'password-toggle'"
            @click="togglePasswordVisibility"
          >
            <EyeIcon v-if="!isPasswordVisible" class="adornment-icon" />
            <EyeSlashIcon v-else class="adornment-icon" />
          </button>
          <component :is="appendIcon" v-else-if="appendIcon" class="adornment-icon" aria-hidden="true" />
        </slot>
      </div>
    </div>
    <p v-if="hintMessage && !errorMessage" class="app-input-hint" :id="hintId">
      {{ hintMessage }}
    </p>
    <p v-if="errorMessage" class="app-input-error" :id="errorId" role="alert">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
/**
 * @file AppInput.vue
 * @description A highly configurable, accessible, themeable, and voice-navigable input component.
 * Supports various types, adornments, floating labels, validation states, and more.
 */
import { ref, computed, watch, onMounted, PropType, shallowRef, Component as VueComponent } from 'vue';
import { useI18n } from '../../composables/useI18n';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'; // Or solid, based on preference

type InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local';
type InputSize = 'sm' | 'md' | 'lg';
type InputVariant = 'filled' | 'outlined' | 'standard'; // Material-like variants

const props = defineProps({
  /** The current value of the input. Used with v-model. */
  modelValue: { type: [String, Number], default: '' },
  /** The visible label for the input. */
  label: { type: String, default: '' },
  /** Placeholder text for the input. */
  placeholder: { type: String, default: '' },
  /** The type of the input field. */
  type: { type: String as PropType<InputType>, default: 'text' },
  /** Unique ID for the input. If not provided, one is generated. */
  id: { type: String, default: undefined },
  /** Name attribute for the input. */
  name: { type: String, default: undefined },
  /** Disables the input field. */
  disabled: { type: Boolean, default: false },
  /** Makes the input field read-only. */
  readonly: { type: Boolean, default: false },
  /** Marks the input field as required. */
  required: { type: Boolean, default: false },
  /** Autocomplete attribute for the input. */
  autocomplete: { type: String, default: 'off' },
  /** Error message to display below the input. Activates error styling. */
  errorMessage: { type: String, default: '' },
  /** Hint message to display below the input when not in error state. */
  hintMessage: { type: String, default: '' },
  /** Visual variant of the input field. */
  variant: { type: String as PropType<InputVariant>, default: 'outlined' },
  /** Size of the input field. */
  size: { type: String as PropType<InputSize>, default: 'md' },
  /** Whether to use a floating label animation. */
  floatingLabel: { type: Boolean, default: false },
  /** Vue component or CSS class for an icon to prepend. */
  prependIcon: { type: [Object, String] as PropType<VueComponent | string>, default: null },
  /** Vue component or CSS class for an icon to append. */
  appendIcon: { type: [Object, String] as PropType<VueComponent | string>, default: null },
  /** Unique identifier for voice navigation targeting. */
  voiceTarget: { type: String, required: true },
  /** Prefix for internally generated voice target IDs (e.g., for label). */
  voiceTargetIdPrefix: { type: String, default: '' },
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'keydown', event: KeyboardEvent): void;
  (e: 'input', event: Event): void; // Emitting raw input event
}>();

const { t } = useI18n();
const inputRef = ref<HTMLInputElement | null>(null);
const isFocused = ref(false);
const isPasswordVisible = ref(false);
const internalId = shallowRef(`app-input-${Math.random().toString(36).substring(2, 9)}`);

/** The effective ID used for the input and label association. */
const effectiveId = computed(() => props.id || internalId.value);
const errorId = computed(() => `${effectiveId.value}-error`);
const hintId = computed(() => `${effectiveId.value}-hint`);

/** ARIA describedby attribute value, linking to error or hint messages. */
const describedBy = computed(() => {
  if (props.errorMessage) return errorId.value;
  if (props.hintMessage) return hintId.value;
  return undefined;
});

/** Effective input type, respects password visibility toggle. */
const effectiveType = computed(() => {
  if (props.type === 'password') {
    return isPasswordVisible.value ? 'text' : 'password';
  }
  return props.type;
});

/** Toggles password visibility. */
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

/** Handles the input event and emits update:modelValue. */
const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', props.type === 'number' ? parseFloat(target.value) || 0 : target.value);
  emit('input', event);
};
/** Handles the focus event. */
const onFocus = (event: FocusEvent) => {
  isFocused.value = true;
  emit('focus', event);
};
/** Handles the blur event. */
const onBlur = (event: FocusEvent) => {
  isFocused.value = false;
  emit('blur', event);
};
/** Handles keydown events. */
const onKeydown = (event: KeyboardEvent) => {
  emit('keydown', event);
};

/** Computes wrapper CSS classes based on props. */
const wrapperClasses = computed(() => [
  `variant-${props.variant}`,
  `size-${props.size}`,
  { 'is-disabled': props.disabled, 'is-readonly': props.readonly }
]);

/** Computes input field specific CSS classes. */
const inputFieldClasses = computed(() => [
  // Add specific styling per variant and size here or in CSS
]);

// Expose focus method for programmatic focusing
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
});
</script>

<style scoped>
/* Using CSS Custom Properties for full themeability */
.app-input-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative; /* For floating label */
}

.app-input-label {
  display: block;
  font-size: var(--app-input-label-font-size, var(--app-font-size-sm));
  font-weight: var(--app-input-label-font-weight, 500);
  color: var(--app-input-label-color, var(--app-text-secondary-color));
  margin-bottom: var(--app-input-label-margin-bottom, 0.375rem); /* Tailwind mb-1.5 */
  transition: color 0.2s ease;
}
.app-input-wrapper.has-error .app-input-label {
  color: var(--app-danger-color);
}

.relative { position: relative; } /* Utility class */

.input-adornment {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  color: var(--app-input-adornment-color, var(--app-text-muted-color));
}
.input-adornment.prepend { left: var(--app-input-padding-x, 0.75rem); }
.input-adornment.append { right: var(--app-input-padding-x, 0.75rem); }
.adornment-icon {
  width: var(--app-input-icon-size, 1.25rem); /* Tailwind h-5 w-5 */
  height: var(--app-input-icon-size, 1.25rem);
}

.app-input-field {
  display: block;
  width: 100%;
  background-color: var(--app-input-bg, var(--app-surface-color));
  color: var(--app-input-text-color, var(--app-text-color));
  border: 1px solid var(--app-input-border-color, var(--app-border-color));
  border-radius: var(--app-input-border-radius, var(--app-border-radius-md));
  padding: var(--app-input-padding-y) var(--app-input-padding-x);
  font-size: var(--app-input-font-size, var(--app-font-size-base));
  line-height: var(--app-input-line-height, 1.5);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.app-input-field::placeholder {
  color: var(--app-input-placeholder-color, var(--app-text-muted-color));
  opacity: 1;
}
.app-input-field:focus {
  outline: none;
  border-color: var(--app-input-focus-border-color, var(--app-primary-color));
  box-shadow: 0 0 0 2px var(--app-input-focus-ring-color, rgba(var(--app-primary-rgb), 0.2));
}
.app-input-wrapper.has-error .app-input-field {
  border-color: var(--app-input-error-border-color, var(--app-danger-color));
}
.app-input-wrapper.has-error .app-input-field:focus {
  box-shadow: 0 0 0 2px var(--app-input-error-ring-color, rgba(var(--app-danger-rgb), 0.2));
}
.app-input-field.is-disabled {
  background-color: var(--app-input-disabled-bg, var(--app-disabled-bg-color));
  color: var(--app-input-disabled-text-color, var(--app-disabled-text-color));
  cursor: not-allowed;
}
.app-input-field.has-prepend { padding-left: calc(var(--app-input-padding-x) + var(--app-input-icon-size, 1.25rem) + 0.5rem); }
.app-input-field.has-append { padding-right: calc(var(--app-input-padding-x) + var(--app-input-icon-size, 1.25rem) + 0.5rem); }

/* Floating Label Styles */
.floating-label-group { margin-top: 0.5rem; } /* Add space for label to float up */
.app-input-label-floating {
  position: absolute;
  left: var(--app-input-padding-x);
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--app-input-font-size); /* Match input font size initially */
  color: var(--app-input-placeholder-color);
  pointer-events: none;
  transition: top 0.2s ease, transform 0.2s ease, font-size 0.2s ease, color 0.2s ease;
  background-color: var(--app-input-bg); /* To cover the input border when floated */
  padding: 0 0.25rem; /* Small horizontal padding to break the border line */
}
.app-input-field:focus + .app-input-label-floating,
.app-input-label-floating.is-active {
  top: 0;
  transform: translateY(-50%) scale(0.85);
  font-size: var(--app-input-label-font-size-sm, 0.75rem); /* Smaller font when floated */
  color: var(--app-input-label-floating-active-color, var(--app-primary-color));
}
.app-input-wrapper.has-error .app-input-label-floating.is-active {
  color: var(--app-danger-color);
}


.password-toggle-button {
  background: none; border: none; padding: 0; cursor: pointer;
  color: inherit; /* Inherits color from .input-adornment */
}
.password-toggle-button:focus-visible {
  outline: 1px solid var(--app-focus-ring-color);
  border-radius: var(--app-border-radius-sm);
}


.app-input-hint, .app-input-error {
  font-size: var(--app-input-meta-font-size, var(--app-font-size-xs));
  margin-top: var(--app-input-meta-margin-top, 0.375rem); /* Tailwind mt-1.5 */
  line-height: 1.4;
}
.app-input-hint { color: var(--app-input-hint-color, var(--app-text-muted-color)); }
.app-input-error { color: var(--app-input-error-text-color, var(--app-danger-color)); }

/* Size Variants */
.app-input-wrapper.size-sm .app-input-field {
  padding: var(--app-input-padding-y-sm) var(--app-input-padding-x-sm);
  font-size: var(--app-input-font-size-sm, var(--app-font-size-sm));
}
.app-input-wrapper.size-lg .app-input-field {
  padding: var(--app-input-padding-y-lg) var(--app-input-padding-x-lg);
  font-size: var(--app-input-font-size-lg, var(--app-font-size-lg));
}
/* Adjust floating label initial position and floated size for different input sizes if needed */

/* Variant: Outlined (default) */
/* Styles are mostly covered by base .app-input-field */

/* Variant: Filled */
.app-input-wrapper.variant-filled .app-input-field {
  background-color: var(--app-input-filled-bg, var(--app-surface-inset-color));
  border-color: transparent; /* Often borderless or bottom-border only until focus */
  border-bottom: 2px solid var(--app-input-filled-border-inactive, var(--app-border-color-light));
  border-radius: var(--app-input-filled-border-radius-top, 0.25rem) var(--app-input-filled-border-radius-top, 0.25rem) 0 0;
}
.app-input-wrapper.variant-filled .app-input-field:focus {
  background-color: var(--app-input-filled-bg-focus, var(--app-surface-inset-color));
  border-bottom-color: var(--app-input-focus-border-color, var(--app-primary-color));
  box-shadow: none;
}
.app-input-wrapper.variant-filled.has-error .app-input-field {
    border-bottom-color: var(--app-input-error-border-color, var(--app-danger-color));
}

/* Variant: Standard (Material-like baseline only) */
.app-input-wrapper.variant-standard .app-input-field {
  background-color: transparent;
  border-width: 0 0 1px 0;
  border-radius: 0;
  padding-left: 0; padding-right: 0; /* No horizontal padding for standard */
}
.app-input-wrapper.variant-standard .app-input-field:focus {
  box-shadow: none; /* No ring for standard */
  border-bottom-width: 2px; /* Thicker line on focus */
}
.app-input-wrapper.variant-standard.has-prepend .app-input-field { padding-left: calc(var(--app-input-icon-size, 1.25rem) + 0.5rem); }
.app-input-wrapper.variant-standard.has-append .app-input-field { padding-right: calc(var(--app-input-icon-size, 1.25rem) + 0.5rem); }
.app-input-wrapper.variant-standard .input-adornment.prepend { left: 0; }
.app-input-wrapper.variant-standard .input-adornment.append { right: 0; }
.app-input-wrapper.variant-standard .app-input-label-floating { padding-left: 0; padding-right: 0; }
.app-input-wrapper.variant-standard .app-input-label-floating.is-active {
  /* Specific adjustment if standard label needs different background */
  background-color: var(--app-bg-color); /* Ensure it covers the main page background */
}


/* Holographic Theme Adjustments */
.theme-holographic .app-input-field {
  background-color: var(--holographic-input-bg, rgba(var(--holographic-panel-rgb), 0.3));
  border-color: var(--holographic-input-border, var(--holographic-border-translucent));
  color: var(--holographic-input-text, var(--holographic-text-primary));
  box-shadow: var(--holographic-input-shadow-inset);
}
.theme-holographic .app-input-field::placeholder {
  color: var(--holographic-input-placeholder, var(--holographic-text-secondary));
}
.theme-holographic .app-input-field:focus {
  border-color: var(--holographic-input-focus-border, var(--holographic-accent));
  box-shadow: 0 0 0 2px var(--holographic-input-focus-ring, rgba(var(--holographic-accent-rgb), 0.3)),
              var(--holographic-input-shadow-inset-focus);
}
.theme-holographic .app-input-label { color: var(--holographic-label-color, var(--holographic-text-secondary)); }
.theme-holographic .app-input-label-floating.is-active {
    color: var(--holographic-label-active-color, var(--holographic-accent));
    background-color: var(--holographic-input-bg); /* Match input background */
}
.theme-holographic .input-adornment { color: var(--holographic-adornment-color, var(--holographic-text-secondary));}
.theme-holographic .app-input-hint { color: var(--holographic-hint-color, var(--holographic-text-muted));}
.theme-holographic .app-input-error, .theme-holographic .app-input-wrapper.has-error .app-input-label {
    color: var(--holographic-danger-color, #ff4d80);
}
.theme-holographic .app-input-wrapper.has-error .app-input-field {
    border-color: var(--holographic-danger-color);
}
.theme-holographic .app-input-wrapper.has-error .app-input-field:focus {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--holographic-danger-color) 30%, transparent);
}

/* Filled variant under Holographic theme */
.theme-holographic .app-input-wrapper.variant-filled .app-input-field {
  background-color: var(--holographic-input-filled-bg, rgba(var(--holographic-panel-rgb), 0.5));
  border-color: transparent;
  border-bottom: 2px solid var(--holographic-input-filled-border-inactive, rgba(var(--holographic-accent-rgb), 0.3));
}
.theme-holographic .app-input-wrapper.variant-filled .app-input-field:focus {
  border-bottom-color: var(--holographic-accent);
}
</style>