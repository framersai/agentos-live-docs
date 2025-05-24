// File: frontend/src/components/common/AppToggleSwitch.vue
<template>
  <label
    class="app-toggle-switch relative inline-flex items-center cursor-pointer"
    :class="[`size-${size}`, { 'is-disabled': disabled }]"
    :data-voice-target="voiceTarget || generatedVoiceTargetId"
    :aria-label="ariaLabel || label"
    role="switch"
    :aria-checked="modelValue"
    @click.prevent="toggle"
    @keydown.space.prevent="toggle"
    tabindex="0"
  >
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      class="sr-only peer"
      :id="id"
      :name="name"
    />
    <div class="switch-track peer-focus-visible:focus-ring"></div>
    <div class="switch-thumb peer-checked:translate-x-full"></div>
    <span v-if="label && showLabel" class="ml-2 switch-label">{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
import { computed, PropType, shallowRef, onMounted } from 'vue';

type ToggleSize = 'sm' | 'md' | 'lg';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  id: { type: String, default: () => `toggle-${Math.random().toString(36).substring(2,9)}` },
  name: { type: String, default: undefined },
  disabled: { type: Boolean, default: false },
  label: { type: String, default: '' },
  showLabel: { type: Boolean, default: false }, // Whether to display the text label next to switch
  ariaLabel: { type: String, default: '' },
  voiceTarget: { type: String, default: '' },
  size: { type: String as PropType<ToggleSize>, default: 'md' },
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const generatedVoiceTargetId = shallowRef('');
onMounted(() => {
  if (!props.voiceTarget && props.label) {
    generatedVoiceTargetId.value = `toggle-${props.label.toLowerCase().replace(/\s+/g, '-')}`;
  } else if (!props.voiceTarget) {
    generatedVoiceTargetId.value = props.id + '-voice-target';
  }
});

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue);
  }
};
</script>

<style scoped>
.app-toggle-switch {
  /* Base dimensions - these will be scaled by size variants */
  --switch-width: 2.25rem; /* 36px for md */
  --switch-height: 1.25rem; /* 20px for md */
  --thumb-size: calc(var(--switch-height) - 0.25rem); /* 16px for md, 4px padding */
  --thumb-translate: calc(var(--switch-width) - var(--switch-height) + 0.125rem); /* Adjust for padding */
}
.app-toggle-switch.size-sm {
  --switch-width: 1.75rem; /* 28px */
  --switch-height: 1rem;    /* 16px */
}
.app-toggle-switch.size-lg {
  --switch-width: 3rem; /* 48px */
  --switch-height: 1.5rem; /* 24px */
}

.switch-track {
  width: var(--switch-width);
  height: var(--switch-height);
  background-color: var(--app-toggle-bg-inactive, var(--app-neutral-bg-strong));
  border-radius: var(--app-border-radius-pill, 9999px);
  transition: background-color 0.2s ease-in-out;
}
.peer:checked + .switch-track {
  background-color: var(--app-toggle-bg-active, var(--app-primary-color));
}
.app-toggle-switch.is-disabled .switch-track {
    opacity: 0.5;
    cursor: not-allowed;
}

.switch-thumb {
  position: absolute;
  left: 0.125rem; /* 2px */
  top: 0.125rem; /* 2px */
  width: var(--thumb-size);
  height: var(--thumb-size);
  background-color: var(--app-toggle-thumb-color, white);
  border-radius: var(--app-border-radius-pill, 9999px);
  box-shadow: var(--app-shadow-sm);
  transition: transform 0.2s ease-in-out;
}
.peer:checked ~ .switch-thumb { /* Changed from + to ~ to allow label in between */
  transform: translateX(var(--thumb-translate));
}
.app-toggle-switch.is-disabled .switch-thumb {
    cursor: not-allowed;
}


.peer-focus-visible ~ .switch-track, /* Using ~ to select sibling after peer */
.app-toggle-switch:focus-visible .switch-track { /* Fallback if only label is focused */
  outline: 2px solid var(--app-focus-ring-color, var(--app-primary-color));
  outline-offset: 2px;
}

.switch-label {
  font-size: var(--app-font-size-sm);
  color: var(--app-text-color);
  user-select: none;
}
.app-toggle-switch.is-disabled .switch-label {
    opacity: 0.7;
    cursor: not-allowed;
}

/* Holographic theme adjustments */
.theme-holographic .switch-track {
  background-color: var(--holographic-surface-inset-translucent);
  border: 1px solid var(--holographic-border-very-subtle);
}
.theme-holographic .peer:checked + .switch-track {
  background-color: var(--holographic-accent);
  border-color: var(--holographic-accent);
  box-shadow: 0 0 5px var(--holographic-accent);
}
.theme-holographic .switch-thumb {
  background-color: var(--holographic-thumb-color, #e0e0ff);
  box-shadow: 0 0 3px rgba(0,0,0,0.5);
}
.theme-holographic .peer:checked ~ .switch-thumb {
    background-color: var(--holographic-thumb-active-color, #fff);
}
.theme-holographic .switch-label {
    color: var(--holographic-text-secondary);
}
</style>