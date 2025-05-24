<template>
  <div class="app-select-wrapper" :class="[wrapperClasses, { 'has-error': !!errorMessage }]">
    <label
      v-if="label"
      :for="effectiveId"
      class="app-select-label"
      :data-voice-target="voiceTargetIdPrefix + 'label'"
    >
      {{ label }}
      <span v-if="required" class="text-danger-500" aria-hidden="true">*</span>
    </label>
    <div class="relative">
      <select
        :id="effectiveId"
        ref="selectRef"
        :value="modelValue"
        :name="name"
        :disabled="disabled"
        :required="required"
        :aria-required="required"
        :aria-invalid="!!errorMessage"
        :aria-describedby="describedBy"
        :class="['app-select-field', { 'has-placeholder': !modelValue && placeholder }]"
        :data-voice-target="voiceTarget"
        v-bind="$attrs"
        @change="onChange"
        @blur="onBlur"
        @focus="onFocus"
      >
        <option v-if="placeholder" value="" disabled :selected="!modelValue">
          {{ placeholder }}
        </option>
        <template v-for="(option, index) in options" :key="option.value + '-' + index">
          <optgroup v-if="isOptGroup(option)" :label="option.label" :disabled="option.disabled">
            <option
              v-for="(subOption, subIndex) in option.options"
              :key="subOption.value + '-' + subIndex"
              :value="subOption.value"
              :disabled="subOption.disabled"
            >
              {{ subOption.label }}
            </option>
          </optgroup>
          <option
            v-else
            :value="option.value"
            :disabled="option.disabled"
          >
            {{ option.label }}
          </option>
        </template>
      </select>
      <div class="select-chevron-icon-wrapper">
        <ChevronDownIcon class="select-chevron-icon" aria-hidden="true" />
      </div>
    </div>
    <p v-if="hintMessage && !errorMessage" class="app-select-hint" :id="hintId">
      {{ hintMessage }}
    </p>
    <p v-if="errorMessage" class="app-select-error" :id="errorId" role="alert">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
/**
 * @file AppSelect.vue
 * @description A themeable, accessible, and voice-navigable select dropdown component.
 * Supports grouped options and validation states.
 */
import { computed, ref, PropType, shallowRef } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/24/solid';
import type { SelectOption } from '../../types'; // Assuming SelectOption is like { value: any, label: string, disabled?: boolean }

/**
 * Represents an option group for the select component.
 * @interface SelectOptionGroup
 */
export interface SelectOptionGroup<T = string | number> {
  /** The label for the option group. */
  label: string;
  /** An array of `SelectOption`s within this group. */
  options: SelectOption<T>[];
  /** Optional: If the entire group is disabled. */
  disabled?: boolean;
}

type InputSize = 'sm' | 'md' | 'lg';
type InputVariant = 'filled' | 'outlined' | 'standard'; // Matching AppInput variants

const props = defineProps({
  /** The current value of the select. Used with v-model. */
  modelValue: { type: [String, Number, Boolean], default: '' },
  /** Array of options or option groups to display. */
  options: { type: Array as PropType<(SelectOption | SelectOptionGroup)[]>, required: true },
  /** The visible label for the select. */
  label: { type: String, default: '' },
  /** Placeholder text for the select when no value is selected. */
  placeholder: { type: String, default: '' },
  /** Unique ID for the select. If not provided, one is generated. */
  id: { type: String, default: undefined },
  /** Name attribute for the select. */
  name: { type: String, default: undefined },
  /** Disables the select field. */
  disabled: { type: Boolean, default: false },
  /** Marks the select field as required. */
  required: { type: Boolean, default: false },
  /** Error message to display below the select. Activates error styling. */
  errorMessage: { type: String, default: '' },
  /** Hint message to display below the select when not in error state. */
  hintMessage: { type: String, default: '' },
  /** Visual variant of the select field. */
  variant: { type: String as PropType<InputVariant>, default: 'outlined' },
  /** Size of the select field. */
  size: { type: String as PropType<InputSize>, default: 'md' },
  /** Unique identifier for voice navigation targeting. */
  voiceTarget: { type: String, required: true },
  /** Prefix for internally generated voice target IDs (e.g., for label). */
  voiceTargetIdPrefix: { type: String, default: '' },
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | boolean): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'change', event: Event): void; // Emitting raw change event
}>();

const selectRef = ref<HTMLSelectElement | null>(null);
const isFocused = ref(false);
const internalId = shallowRef(`app-select-${Math.random().toString(36).substring(2, 9)}`);

const effectiveId = computed(() => props.id || internalId.value);
const errorId = computed(() => `${effectiveId.value}-error`);
const hintId = computed(() => `${effectiveId.value}-hint`);

const describedBy = computed(() => {
  if (props.errorMessage) return errorId.value;
  if (props.hintMessage) return hintId.value;
  return undefined;
});

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  // Handle boolean values correctly if that's a use case
  const value = target.value;
  if (typeof props.modelValue === 'boolean') {
    emit('update:modelValue', value === 'true');
  } else if (typeof props.modelValue === 'number') {
    emit('update:modelValue', parseFloat(value));
  } else {
    emit('update:modelValue', value);
  }
  emit('change', event);
};
const onFocus = (event: FocusEvent) => { isFocused.value = true; emit('focus', event); };
const onBlur = (event: FocusEvent) => { isFocused.value = false; emit('blur', event); };

const isOptGroup = (option: SelectOption | SelectOptionGroup): option is SelectOptionGroup => {
  return 'options' in option && Array.isArray((option as SelectOptionGroup).options);
};

const wrapperClasses = computed(() => [
  `variant-${props.variant}`,
  `size-${props.size}`,
  { 'is-disabled': props.disabled }
]);

defineExpose({
  focus: () => selectRef.value?.focus(),
  blur: () => selectRef.value?.blur(),
});
</script>

<style scoped>
/* Styles are very similar to AppInput, with select-specific adjustments */
.app-select-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
}

.app-select-label { /* Same as AppInput label */
  display: block;
  font-size: var(--app-input-label-font-size, var(--app-font-size-sm));
  font-weight: var(--app-input-label-font-weight, 500);
  color: var(--app-input-label-color, var(--app-text-secondary-color));
  margin-bottom: var(--app-input-label-margin-bottom, 0.375rem);
}
.app-select-wrapper.has-error .app-select-label {
  color: var(--app-danger-color);
}

.app-select-field {
  appearance: none; /* Remove default system appearance */
  display: block;
  width: 100%;
  background-color: var(--app-input-bg, var(--app-surface-color));
  color: var(--app-input-text-color, var(--app-text-color));
  border: 1px solid var(--app-input-border-color, var(--app-border-color));
  border-radius: var(--app-input-border-radius, var(--app-border-radius-md));
  padding: var(--app-input-padding-y) calc(var(--app-input-padding-x) + 1.5rem) var(--app-input-padding-y) var(--app-input-padding-x); /* Space for chevron */
  font-size: var(--app-input-font-size, var(--app-font-size-base));
  line-height: var(--app-input-line-height, 1.5);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}
.app-select-field.has-placeholder {
  color: var(--app-input-placeholder-color, var(--app-text-muted-color));
}
.app-select-field:focus { /* Same as AppInput focus */
  outline: none;
  border-color: var(--app-input-focus-border-color, var(--app-primary-color));
  box-shadow: 0 0 0 2px var(--app-input-focus-ring-color, rgba(var(--app-primary-rgb), 0.2));
}
.app-select-wrapper.has-error .app-select-field { /* Same as AppInput error */
  border-color: var(--app-input-error-border-color, var(--app-danger-color));
}
.app-select-wrapper.has-error .app-select-field:focus {
  box-shadow: 0 0 0 2px var(--app-input-error-ring-color, rgba(var(--app-danger-rgb), 0.2));
}
.app-select-field:disabled { /* Same as AppInput disabled */
  background-color: var(--app-input-disabled-bg, var(--app-disabled-bg-color));
  color: var(--app-input-disabled-text-color, var(--app-disabled-text-color));
  cursor: not-allowed;
}
.app-select-field:disabled ~ .select-chevron-icon-wrapper {
    opacity: 0.5;
}


.select-chevron-icon-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  right: var(--app-input-padding-x, 0.75rem);
  display: flex;
  align-items: center;
  pointer-events: none; /* Chevron doesn't capture clicks */
  color: var(--app-input-adornment-color, var(--app-text-muted-color));
}
.select-chevron-icon {
  width: var(--app-input-icon-size, 1.25rem);
  height: var(--app-input-icon-size, 1.25rem);
}

.app-select-hint, .app-select-error { /* Same as AppInput meta */
  font-size: var(--app-input-meta-font-size, var(--app-font-size-xs));
  margin-top: var(--app-input-meta-margin-top, 0.375rem);
  line-height: 1.4;
}
.app-select-hint { color: var(--app-input-hint-color, var(--app-text-muted-color)); }
.app-select-error { color: var(--app-input-error-text-color, var(--app-danger-color)); }


/* Size variants (padding and font-size adjustments) */
.app-select-wrapper.size-sm .app-select-field {
  padding-top: var(--app-input-padding-y-sm); padding-bottom: var(--app-input-padding-y-sm);
  padding-left: var(--app-input-padding-x-sm); padding-right: calc(var(--app-input-padding-x-sm) + 1.5rem);
  font-size: var(--app-input-font-size-sm, var(--app-font-size-sm));
}
.app-select-wrapper.size-lg .app-select-field {
  padding-top: var(--app-input-padding-y-lg); padding-bottom: var(--app-input-padding-y-lg);
  padding-left: var(--app-input-padding-x-lg); padding-right: calc(var(--app-input-padding-x-lg) + 1.5rem);
  font-size: var(--app-input-font-size-lg, var(--app-font-size-lg));
}

/* Variant: Filled */
.app-select-wrapper.variant-filled .app-select-field {
  background-color: var(--app-input-filled-bg, var(--app-surface-inset-color));
  border-color: transparent;
  border-bottom: 2px solid var(--app-input-filled-border-inactive, var(--app-border-color-light));
  border-radius: var(--app-input-filled-border-radius-top, 0.25rem) var(--app-input-filled-border-radius-top, 0.25rem) 0 0;
}
.app-select-wrapper.variant-filled .app-select-field:focus {
  background-color: var(--app-input-filled-bg-focus, var(--app-surface-inset-color));
  border-bottom-color: var(--app-input-focus-border-color, var(--app-primary-color));
  box-shadow: none;
}

/* Variant: Standard */
.app-select-wrapper.variant-standard .app-select-field {
  background-color: transparent;
  border-width: 0 0 1px 0;
  border-radius: 0;
  padding-left: 0; padding-right: 1.5rem; /* Chevron space, no horizontal padding for select text */
}
.app-select-wrapper.variant-standard .app-select-field:focus {
  box-shadow: none;
  border-bottom-width: 2px;
}
.app-select-wrapper.variant-standard .select-chevron-icon-wrapper { right: 0; }


/* Holographic Theme */
.theme-holographic .app-select-field {
  background-color: var(--holographic-input-bg, rgba(var(--holographic-panel-rgb), 0.3));
  border-color: var(--holographic-input-border, var(--holographic-border-translucent));
  color: var(--holographic-input-text, var(--holographic-text-primary));
  box-shadow: var(--holographic-input-shadow-inset);
}
.theme-holographic .app-select-field option { /* Style options for better theme consistency */
    background-color: var(--holographic-dropdown-bg, var(--holographic-bg-start));
    color: var(--holographic-dropdown-text-color, var(--holographic-text-primary));
}
.theme-holographic .app-select-field:focus {
  border-color: var(--holographic-input-focus-border, var(--holographic-accent));
  box-shadow: 0 0 0 2px var(--holographic-input-focus-ring, rgba(var(--holographic-accent-rgb), 0.3)),
              var(--holographic-input-shadow-inset-focus);
}
.theme-holographic .app-select-label { color: var(--holographic-label-color, var(--holographic-text-secondary)); }
.theme-holographic .select-chevron-icon-wrapper { color: var(--holographic-adornment-color, var(--holographic-text-secondary)); }
/* ... other holographic states and variants similar to AppInput ... */
</style>