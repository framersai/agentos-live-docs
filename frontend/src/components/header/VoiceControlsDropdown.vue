// File: frontend/src/components/header/VoiceControlsDropdown.vue
/**
 * @file VoiceControlsDropdown.vue
 * @description Dropdown for voice input and output controls (STT, TTS, Audio Mode, Global Mute).
 * @version 2.1.0 - Added Global Mute button.
 */
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { voiceSettingsManager, type AudioInputMode, type VoiceApplicationSettings } from '@/services/voice.settings.service';
import { useUiStore } from '@/store/ui.store';
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  MicrophoneIcon as PTTModeIcon, // Push-to-talk
  SpeakerWaveIcon as ContinuousModeIcon, // Continuous listening / TTS On
  SpeakerWaveIcon, // For TTS unmuted icon
  SpeakerXMarkIcon as TTSMutedIcon, // TTS Muted
  CpuChipIcon as VADModeIcon, // Voice Activation
  CheckIcon,
  CloudIcon as WhisperIcon,
  ComputerDesktopIcon as BrowserSTTIcon,
  MoonIcon, SunIcon // For theme toggle example if moved here
} from '@heroicons/vue/24/outline';
import type { Component as VueComponentType } from 'vue'; // Correct type import

const settings = voiceSettingsManager.settings; // Reactive settings object
const uiStore = useUiStore();

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

// Audio Input Modes
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

// STT Preference
interface STTOption { label: string; value: VoiceApplicationSettings['sttPreference']; icon: VueComponentType; description: string; }
const sttOptions = computed<STTOption[]>(() => [
  { label: 'Browser STT', value: 'browser_webspeech_api', icon: BrowserSTTIcon, description: "Fast, uses browser's engine." },
  { label: 'Whisper API', value: 'whisper_api', icon: WhisperIcon, description: "High accuracy, uses OpenAI." },
]);
const selectedSTTPreference = computed({
  get: () => settings.sttPreference,
  set: (val) => voiceSettingsManager.updateSetting('sttPreference', val),
});

// Global TTS Mute
const isGlobalMuteActive = computed({
    get: () => !settings.autoPlayTts, // Muted if autoPlayTts is false
    set: (isMuted) => voiceSettingsManager.updateSetting('autoPlayTts', !isMuted)
});
const toggleGlobalMute = () => {
    isGlobalMuteActive.value = !isGlobalMuteActive.value;
};


// Watch for settings changes to ensure UI consistency if modified elsewhere (e.g. Settings page)
watch(() => settings.audioInputMode, (newVal) => {
  if (selectedAudioMode.value !== newVal) selectedAudioMode.value = newVal;
});
watch(() => settings.sttPreference, (newVal) => {
  if (selectedSTTPreference.value !== newVal) selectedSTTPreference.value = newVal;
});
watch(() => settings.autoPlayTts, (newVal) => {
    if (isGlobalMuteActive.value === newVal) { // isGlobalMuteActive is inverse of autoPlayTts
        isGlobalMuteActive.value = !newVal;
    }
});

</script>

<template>
  <div class="voice-controls-dropdown-container relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="voice-controls-trigger-button btn btn-ghost-ephemeral btn-icon-ephemeral"
      aria-label="Open Voice Controls"
      :aria-expanded="isOpen"
      title="Voice Settings"
    >
      <AdjustmentsHorizontalIcon class="icon-base" />
    </button>

    <Transition name="dropdown-float-neomorphic">
      <div
        v-if="isOpen"
        class="dropdown-panel-ephemeral absolute right-0 mt-2 w-72 origin-top-right"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="voice-controls-trigger-button"
      >
        <div class="dropdown-header-ephemeral">
          <h3 class="dropdown-title">Voice & Audio Controls</h3>
        </div>
        <div class="dropdown-content-ephemeral custom-scrollbar-thin">
          <button
            @click="toggleGlobalMute"
            class="dropdown-item-ephemeral group w-full"
            role="menuitemcheckbox"
            :aria-checked="isGlobalMuteActive"
            title="Toggle Text-to-Speech Mute"
            >
            <component :is="isGlobalMuteActive ? TTSMutedIcon : SpeakerWaveIcon" class="dropdown-item-icon" aria-hidden="true"/>
            <span>{{ isGlobalMuteActive ? 'Unmute TTS' : 'Mute TTS' }}</span>
            <span class="status-dot-indicator ml-auto" :class="{'active-dot': !isGlobalMuteActive, 'inactive-dot': isGlobalMuteActive}"></span>
          </button>

          <div class="dropdown-divider-ephemeral my-1.5"></div>

          <div class="setting-group-in-dropdown px-2 py-1">
            <label class="setting-group-label-dropdown">Input Mode</label>
            <div class="options-grid-dropdown">
              <button
                v-for="mode in audioModeOptions"
                :key="mode.value"
                @click="selectedAudioMode = mode.value; closeDropdown();"
                class="option-button-dropdown group"
                :class="{'active': selectedAudioMode === mode.value}"
                :title="mode.description"
              >
                <component :is="mode.icon" class="option-icon-dropdown" />
                <span class="option-label-dropdown">{{ mode.label }}</span>
              </button>
            </div>
          </div>

          <div class="dropdown-divider-ephemeral my-1.5"></div>

          <div class="setting-group-in-dropdown px-2 py-1">
            <label class="setting-group-label-dropdown">Speech Recognition (STT)</label>
             <div class="options-grid-dropdown">
                <button
                    v-for="stt in sttOptions"
                    :key="stt.value"
                    @click="selectedSTTPreference = stt.value; closeDropdown();"
                    class="option-button-dropdown group"
                    :class="{'active': selectedSTTPreference === stt.value}"
                    :title="stt.description"
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
/* Styles for this component will be in _voice-controls-dropdown.scss */
/* This scoped block is for very specific, one-off overrides or adjustments */

/* The dropdown panel and items will use shared styles from _dropdowns.scss */
/* by applying classes like .dropdown-panel-ephemeral, .dropdown-item-ephemeral etc. */

.setting-group-in-dropdown {
  margin-bottom: var.$spacing-sm;
}
.setting-group-label-dropdown {
  display: block;
  font-size: var.$font-size-xs;
  font-weight: 500;
  color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
  margin-bottom: var.$spacing-xs;
  padding-left: var.$spacing-xs; // Align with items
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.options-grid-dropdown {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); // Responsive grid for options
  gap: var.$spacing-xs;
}

.option-button-dropdown {
  @apply flex flex-col items-center justify-center p-2 rounded-md text-xs;
  background-color: hsla(var(--color-bg-tertiary-h), var(--color-bg-tertiary-s), var(--color-bg-tertiary-l), 0.4);
  border: 1px solid hsla(var(--color-border-secondary-h), var(--color-border-secondary-s), var(--color-border-secondary-l), 0.3);
  color: hsl(var(--color-text-secondary-h), var(--color-text-secondary-s), var(--color-text-secondary-l));
  transition: all var.$duration-quick;
  min-height: 60px; // Ensure consistent height

  .option-icon-dropdown {
    width: 1.5rem; // 24px
    height: 1.5rem;
    margin-bottom: var.$spacing-xs * 0.5;
    opacity: 0.7;
  }
  .option-label-dropdown {
    font-weight: 500;
  }

  &:hover {
    background-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.1);
    border-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.4);
    color: hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l));
    .option-icon-dropdown { opacity: 1; }
  }

  &.active {
    background-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.2);
    border-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.6);
    color: hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l));
    font-weight: 600;
    box-shadow: inset 0 1px 3px hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.2);
    .option-icon-dropdown { opacity: 1; }
  }
}

.status-dot-indicator {
    width: 8px;
    height: 8px;
    border-radius: var.$radius-full;
    background-color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l), 0.5);
    transition: background-color var.$duration-quick;
    &.active-dot {
        background-color: hsl(var(--color-success-h), var(--color-success-s), var(--color-success-l));
        box-shadow: 0 0 5px 1px hsla(var(--color-success-h), var(--color-success-s), var(--color-success-l), 0.7);
    }
    &.inactive-dot {
         background-color: hsl(var(--color-error-h), var(--color-error-s), var(--color-error-l), 0.7);
    }
}

.dropdown-float-neomorphic-enter-active,
.dropdown-float-neomorphic-leave-active {
  transition: opacity var.$duration-quick var.$ease-out-quad, transform var.$duration-quick var.$ease-out-quad;
}
.dropdown-float-neomorphic-enter-from,
.dropdown-float-neomorphic-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.92);
}
</style>