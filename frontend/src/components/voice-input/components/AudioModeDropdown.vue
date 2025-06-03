// File: frontend/src/components/voice-input/components/AudioModeDropdown.vue
<template>
  <div class="audio-mode-dropdown-wrapper" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="audio-mode-button"
      :disabled="disabled"
      aria-haspopup="true"
      :aria-expanded="isOpen"
    >
      <component :is="currentModeIcon" class="icon-sm" />
      <span class="mode-label">{{ currentModeLabel }}</span>
      <ChevronDownIcon 
        class="chevron-icon" 
        :class="{ 'rotate-180': isOpen }"
      />
    </button>
    
    <Transition name="dropdown">
      <div v-if="isOpen" class="dropdown-menu">
        <div class="dropdown-header">Audio Input Mode</div>
        <button
          v-for="option in options"
          :key="option.value"
          @click="selectMode(option.value)"
          class="dropdown-item"
          :class="{ active: currentMode === option.value }"
        >
          <component :is="getModeIcon(option.value)" class="icon-sm" />
          <div class="option-content">
            <span class="option-label">{{ option.label }}</span>
            <span class="option-description">{{ option.description }}</span>
          </div>
          <CheckIcon v-if="currentMode === option.value" class="check-icon" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  ChevronDownIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  CpuChipIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline';

interface AudioModeOption {
  value: string;
  label: string;
  description: string;
}

const props = defineProps<{
  currentMode: string;
  options: AudioModeOption[];
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', mode: string): void;
}>();

const dropdownRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);

const currentModeLabel = computed(() => {
  const option = props.options.find(o => o.value === props.currentMode);
  return option?.label || 'Mode';
});

const currentModeIcon = computed(() => getModeIcon(props.currentMode));

function getModeIcon(mode: string) {
  switch (mode) {
    case 'push-to-talk': return MicrophoneIcon;
    case 'continuous': return SpeakerWaveIcon;
    case 'voice-activation': return CpuChipIcon;
    default: return MicrophoneIcon;
  }
}

function toggleDropdown() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
}

function selectMode(mode: string) {
  emit('select', mode);
  isOpen.value = false;
}

function handleClickOutside(event: MouseEvent) {
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

.icon-sm {
 width: 1.25rem;
 height: 1.25rem;
}

// Transition
.dropdown-enter-active,
.dropdown-leave-active {
 transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
 opacity: 0;
 transform: translateY(10px) scale(0.95);
}
</style>