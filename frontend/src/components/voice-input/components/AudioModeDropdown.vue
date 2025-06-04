// File: frontend/src/components/voice-input/components/AudioModeDropdown.vue
/**
 * @file AudioModeDropdown.vue
 * @description A dropdown component for selecting the audio input mode.
 * It displays the current mode and allows switching between available modes.
 *
 * Revisions:
 * - Aligned internal AudioModeOption interface's `description` to be optional, matching `types.ts`.
 * - Changed the emitted event name from `@select` to `@select-mode` for consistency with VoiceInput.vue.
 * - Ensured all props are correctly typed and used.
 * - Added comprehensive JSDoc comments.
 * - Imported VoiceInputMode from types.ts for prop typing.
 */
<template>
  <div class="audio-mode-dropdown-wrapper" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="audio-mode-button"
      :disabled="disabled"
      aria-haspopup="true"
      :aria-expanded="isOpen"
      :title="`Current mode: ${currentModeLabel}. Click to change.`"
    >
      <component :is="currentModeIcon" class="icon-sm" aria-hidden="true" />
      <span class="mode-label">{{ currentModeLabel }}</span>
      <ChevronDownIcon
        class="chevron-icon"
        :class="{ 'rotate-180': isOpen }"
        aria-hidden="true"
      />
    </button>

    <Transition name="dropdown-transition">
      <div v-if="isOpen" class="dropdown-menu" role="listbox" aria-label="Audio input modes">
        <div class="dropdown-header">Select Audio Mode</div>
        <button
          v-for="option in options"
          :key="option.value"
          @click="selectModeHandler(option.value)"
          class="dropdown-item"
          :class="{ active: currentMode === option.value }"
          role="option"
          :aria-selected="currentMode === option.value"
        >
          <component :is="getModeIcon(option.value)" class="icon-sm" aria-hidden="true" />
          <div class="option-content">
            <span class="option-label">{{ option.label }}</span>
            <span v-if="option.description" class="option-description">{{ option.description }}</span>
          </div>
          <CheckIcon v-if="currentMode === option.value" class="check-icon" aria-hidden="true" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
/**
 * @script AudioModeDropdown
 * @description Logic for the AudioModeDropdown component.
 */
import { ref, computed, onMounted, onUnmounted, type Component } from 'vue';
import {
  ChevronDownIcon,
  MicrophoneIcon as SolidMicrophoneIcon,
  SpeakerWaveIcon,
  CpuChipIcon,
  CheckIcon,
} from '@heroicons/vue/20/solid';

// Import VoiceInputMode for stronger typing of props and emits
import type { VoiceInputMode } from '../types';

/**
 * @interface AudioModeOptionLocal
 * @description Defines the structure for an audio mode option displayed in the dropdown.
 * Note: `description` is now optional to align with potential shared types.
 */
interface AudioModeOptionLocal {
  value: VoiceInputMode; // Use the imported type
  label: string;
  description?: string; // Made optional
  // 'icon' prop was in types.ts AudioModeOption, but not used here directly for rendering
  // The getModeIcon function handles icon selection based on 'value'.
}

/**
 * @interface Props
 * @description Props for the AudioModeDropdown component.
 */
const props = defineProps<{
  /** The currently selected audio input mode value. */
  currentMode: VoiceInputMode;
  /** Array of available audio mode options. */
  options: AudioModeOptionLocal[]; // Uses the local (now aligned) interface
  /** Whether the dropdown is disabled. */
  disabled?: boolean;
}>();

/**
 * @emits Emits
 * @description Events emitted by the AudioModeDropdown component.
 */
const emit = defineEmits<{
  /**
   * Emitted when an audio mode is selected.
   * @param {VoiceInputMode} mode - The value of the selected audio mode.
   */
  (e: 'select-mode', mode: VoiceInputMode): void; // Changed from 'select'
}>();

const dropdownRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);

/**
 * @computed currentModeLabel
 * @description Gets the label of the currently selected audio mode.
 */
const currentModeLabel = computed<string>(() => {
  const option = props.options.find(o => o.value === props.currentMode);
  return option?.label || 'Mode';
});

/**
 * @computed currentModeIcon
 * @description Gets the icon component for the currently selected audio mode.
 */
const currentModeIcon = computed<Component>(() => getModeIcon(props.currentMode));

/**
 * @function getModeIcon
 * @description Returns the appropriate icon component based on the mode value.
 * @param {VoiceInputMode | string} mode - The audio mode value.
 */
function getModeIcon(mode: VoiceInputMode | string): Component {
  switch (mode) {
    case 'push-to-talk': return SolidMicrophoneIcon;
    case 'continuous': return SpeakerWaveIcon;
    case 'voice-activation': return CpuChipIcon;
    default: return SolidMicrophoneIcon;
  }
}

/**
 * @function toggleDropdown
 * @description Toggles the visibility of the dropdown menu.
 */
function toggleDropdown(): void {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
}

/**
 * @function selectModeHandler
 * @description Handles the selection of an audio mode. Emits event and closes dropdown.
 * @param {VoiceInputMode} mode - The value of the selected audio mode.
 */
function selectModeHandler(mode: VoiceInputMode): void {
  emit('select-mode', mode); // Emitting 'select-mode'
  isOpen.value = false;
}

/**
 * @function handleClickOutside
 * @description Closes the dropdown if a click occurs outside of it.
 */
function handleClickOutside(event: MouseEvent): void {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true);
});
</script>

<style scoped lang="scss">
/* Styles are from your provided file. Transition name changed for consistency if needed. */
.audio-mode-dropdown-wrapper {
  position: relative;
}

.audio-mode-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: hsla(var(--color-bg-tertiary-h), var(--color-bg-tertiary-s), var(--color-bg-tertiary-l), 0.6);
  border: 1px solid hsla(var(--color-border-secondary-h), var(--color-border-secondary-s), var(--color-border-secondary-l), 0.5);
  border-radius: 0.5rem;
  color: hsl(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l));
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: hsla(var(--color-bg-tertiary-h), var(--color-bg-tertiary-s), calc(var(--color-bg-tertiary-l) * 1.1), 0.8);
    border-color: hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l));
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.icon-sm { /* Ensure this class is defined if used or use direct icon components */
  width: 1.25rem; /* 20px */
  height: 1.25rem; /* 20px */
}

.chevron-icon {
  width: 1rem;
  height: 1rem;
  transition: transform 0.2s ease;

  &.rotate-180 {
    transform: rotate(180deg);
  }
}

.dropdown-menu {
  position: absolute;
  bottom: calc(100% + 0.5rem);
  right: 0;
  min-width: 250px;
  background: hsl(var(--color-bg-primary-h), var(--color-bg-primary-s), var(--color-bg-primary-l));
  border: 1px solid hsl(var(--color-border-primary-h), var(--color-border-primary-s), var(--color-border-primary-l));
  border-radius: 0.75rem;
  box-shadow: 0 10px 50px hsla(var(--color-shadow-h), var(--color-shadow-s), var(--color-shadow-l), 0.2);
  overflow: hidden;
  z-index: 100;
}

.dropdown-header {
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
  border-bottom: 1px solid hsla(var(--color-border-primary-h), var(--color-border-primary-s), var(--color-border-primary-l), 0.5);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: hsl(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l));
  text-align: left;
  transition: all 0.15s ease;
  cursor: pointer;

  &:hover {
    background: hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.1);
  }

  &.active {
    background: hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.15);
    color: hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l));
  }
}

.option-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.option-label {
  font-weight: 500;
  font-size: 0.875rem;
}

.option-description {
  font-size: 0.75rem;
  color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
}

.check-icon {
  width: 1rem;
  height: 1rem;
  color: hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l));
}

/* Renamed transition for consistency */
.dropdown-transition-enter-active,
.dropdown-transition-leave-active {
  transition: all 0.2s ease;
}

.dropdown-transition-enter-from,
.dropdown-transition-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
</style>