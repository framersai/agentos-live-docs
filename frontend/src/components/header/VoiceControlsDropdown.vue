// File: frontend/src/components/header/VoiceControlsDropdown.vue
/**
 * @file VoiceControlsDropdown.vue
 * @description Dropdown for voice input/output controls. Uses shared "Ephemeral Harmony" dropdown styles.
 * @version 2.2.0 - Adopted shared dropdown styles.
 */
<script setup lang="ts">
// ... (script content remains the same as provided in "Header Revamp Batch 1")
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { voiceSettingsManager, type AudioInputMode, type VoiceApplicationSettings } from '@/services/voice.settings.service';
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  MicrophoneIcon as PTTModeIcon,
  SpeakerWaveIcon as ContinuousModeIcon,
  SpeakerWaveIcon, // Unmuted
  SpeakerXMarkIcon as TTSMutedIcon,
  CpuChipIcon as VADModeIcon,
  CheckIcon,
  CloudIcon as WhisperIcon,
  ComputerDesktopIcon as BrowserSTTIcon,
} from '@heroicons/vue/24/outline';
import type { Component as VueComponentType } from 'vue';

const settings = voiceSettingsManager.settings;
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const toggleDropdown = () => isOpen.value = !isOpen.value;
const closeDropdown = () => isOpen.value = false;

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};
onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));

interface AudioModeOption { label: string; value: AudioInputMode; icon: VueComponentType; description: string; }
const audioModeOptions = computed<AudioModeOption[]>(() => [
  { label: 'Push-to-Talk', value: 'push-to-talk', icon: PTTModeIcon, description: "Hold mic to speak." },
  { label: 'Continuous', value: 'continuous', icon: ContinuousModeIcon, description: "Mic stays on." },
  { label: 'Voice Activate', value: 'voice-activation', icon: VADModeIcon, description: "Mic activates on speech." },
]);
const selectedAudioMode = computed({
  get: () => settings.audioInputMode,
  set: (val) => voiceSettingsManager.updateSetting('audioInputMode', val),
});

interface STTOption { label: string; value: VoiceApplicationSettings['sttPreference']; icon: VueComponentType; description: string; }
const sttOptions = computed<STTOption[]>(() => [
  { label: 'Browser STT', value: 'browser_webspeech_api', icon: BrowserSTTIcon, description: "Fast, uses browser's engine." },
  { label: 'Whisper API', value: 'whisper_api', icon: WhisperIcon, description: "High accuracy, uses OpenAI." },
]);
const selectedSTTPreference = computed({
  get: () => settings.sttPreference,
  set: (val) => voiceSettingsManager.updateSetting('sttPreference', val),
});

const isGlobalMuteActive = computed({
    get: () => !settings.autoPlayTts,
    set: (isMuted) => voiceSettingsManager.updateSetting('autoPlayTts', !isMuted)
});
const toggleGlobalMute = () => {
    isGlobalMuteActive.value = !isGlobalMuteActive.value;
};

watch(() => settings.audioInputMode, (newVal) => { if (selectedAudioMode.value !== newVal) selectedAudioMode.value = newVal; });
watch(() => settings.sttPreference, (newVal) => { if (selectedSTTPreference.value !== newVal) selectedSTTPreference.value = newVal; });
watch(() => settings.autoPlayTts, (newVal) => { if (isGlobalMuteActive.value === newVal) isGlobalMuteActive.value = !newVal; });
</script>

<template>
  <div class="relative" ref="dropdownRef"> 
    <button
      @click="toggleDropdown"
      class="btn btn-ghost-ephemeral btn-icon-ephemeral voice-controls-trigger-button"
      aria-label="Open Voice Controls"
      :aria-expanded="isOpen"
      title="Voice Settings"
    >
      <AdjustmentsHorizontalIcon class="icon-base icon-trigger" />
       <ChevronDownIcon class="icon-xs chevron-indicator" :class="{'open': isOpen}"/>
    </button>

    <Transition name="dropdown-float-enhanced">
      <div
        v-if="isOpen"
        class="dropdown-panel-ephemeral absolute right-0 mt-2 w-72 origin-top-right"
        role="menu"
        aria-orientation="vertical"
      >
        <div class="dropdown-header-ephemeral">
          <h3 class="dropdown-title">Voice & Audio</h3>
        </div>
        <div class="dropdown-content-ephemeral custom-scrollbar-thin">
          <button
            @click="toggleGlobalMute"
            class="dropdown-item-ephemeral group w-full"
            role="menuitemcheckbox"
            :aria-checked="isGlobalMuteActive"
          >
            <component :is="isGlobalMuteActive ? TTSMutedIcon : SpeakerWaveIcon" class="dropdown-item-icon" aria-hidden="true"/>
            <span>{{ isGlobalMuteActive ? 'Unmute Speech' : 'Mute Speech' }}</span>
            <span class="status-dot-indicator ml-auto" :class="{'active-dot': !isGlobalMuteActive, 'inactive-dot': isGlobalMuteActive}"></span>
          </button>

          <div class="dropdown-divider-ephemeral my-1.5"></div>

          <div class="setting-group-in-dropdown">
            <label class="setting-group-label-dropdown">Input Mode</label>
            <div class="options-grid-dropdown">
              <button
                v-for="mode in audioModeOptions" :key="mode.value"
                @click="selectedAudioMode = mode.value; closeDropdown();"
                class="option-button-dropdown group"
                :class="{'active': selectedAudioMode === mode.value}" :title="mode.description"
              >
                <component :is="mode.icon" class="option-icon-dropdown" />
                <span class="option-label-dropdown">{{ mode.label }}</span>
              </button>
            </div>
          </div>

          <div class="dropdown-divider-ephemeral my-1.5"></div>

           <div class="setting-group-in-dropdown">
            <label class="setting-group-label-dropdown">Speech Recognition</label>
             <div class="options-grid-dropdown">
                <button
                    v-for="stt in sttOptions" :key="stt.value"
                    @click="selectedSTTPreference = stt.value; closeDropdown();"
                    class="option-button-dropdown group"
                    :class="{'active': selectedSTTPreference === stt.value}" :title="stt.description"
                >
                    <component :is="stt.icon" class="option-icon-dropdown" />
                    <span class="option-label-dropdown">{{ stt.label }}</span>
                </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/abstracts/variables' as var;
// Shared dropdown styles are applied via classes like .dropdown-panel-ephemeral etc.

.voice-controls-trigger-button {
  // Inherits from .btn-ghost-ephemeral.btn-icon-ephemeral from _header.scss
  display: inline-flex;
  align-items: center;
  gap: var.$spacing-xs * 0.3;
  .icon-trigger { /* size from .icon-base */ }
  .chevron-indicator {
    transition: transform 0.2s var.$ease-out-quad;
    opacity: 0.6;
    width: 0.8rem; height: 0.8rem;
    &.open { transform: rotate(180deg); }
  }
   &:hover .chevron-indicator, &[aria-expanded="true"] .chevron-indicator {
    opacity: 0.9;
  }
}

// Styles for the unique grid layout within this specific dropdown
.setting-group-in-dropdown {
  padding: var.$spacing-xs var.$spacing-xs; // Inner padding for groups
}
.setting-group-label-dropdown {
  display: block;
  font-size: calc(var.$font-size-xs * 0.9); // Smaller group labels
  font-weight: 500;
  color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
  margin-bottom: var.$spacing-xs;
  padding-left: var.$spacing-xs;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  opacity: 0.8;
}

.options-grid-dropdown {
  display: grid;
  // Fit 2 or 3 items per row depending on dropdown width (w-72 -> approx 288px)
  grid-template-columns: repeat(auto-fit, minmax(85px, 1fr)); 
  gap: var.$spacing-xs;
}

.option-button-dropdown {
  @apply flex flex-col items-center justify-center p-2 rounded-lg text-xs; // Using Tailwind for flex utils
  background-color: hsla(var(--color-bg-secondary-h), var(--color-bg-secondary-s), var(--color-bg-secondary-l), 0.3);
  border: 1px solid hsla(var(--color-border-secondary-h), var(--color-border-secondary-s), var(--color-border-secondary-l), 0.2);
  color: hsl(var(--color-text-secondary-h), var(--color-text-secondary-s), var(--color-text-secondary-l));
  transition: all var.$duration-quick;
  min-height: 56px;
  cursor: pointer;

  .option-icon-dropdown {
    width: 1.35rem; 
    height: 1.35rem;
    margin-bottom: calc(var.$spacing-xs * 0.4);
    opacity: 0.65;
  }
  .option-label-dropdown {
    font-weight: 500;
    font-size: calc(var.$font-size-xs * 0.9); // Tiny labels for these buttons
    line-height: 1.2;
  }

  &:hover {
    background-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.08);
    border-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.3);
    color: hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l));
    transform: translateY(-1px);
    .option-icon-dropdown { opacity: 0.9; }
  }

  &.active {
    background-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.15);
    border-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.5);
    color: hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l));
    font-weight: 600;
    box-shadow: inset 0 1px 2px hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.15);
    .option-icon-dropdown { opacity: 1; }
  }
}

.status-dot-indicator { /* Styles from previous version for mute button */ }

.dropdown-float-enhanced-enter-active, /* Using same transition as UserSettingsDropdown */
.dropdown-float-enhanced-leave-active {
  transition: opacity 0.25s var.$ease-out-quint, transform 0.3s var.$ease-elastic;
}
.dropdown-float-enhanced-enter-from,
.dropdown-float-enhanced-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.92);
}
</style>