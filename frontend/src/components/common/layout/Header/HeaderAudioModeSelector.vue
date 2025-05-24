<template>
  <div class="header-audio-mode-selector relative" ref="dropdownContainerRef" v-if="voiceStore.isVoiceFeatureAvailable">
    <AppButton
      variant="tertiary"
      size="sm"
      :aria-label="t('header.selectAudioMode')"
      :aria-expanded="isDropdownOpen"
      aria-haspopup="true"
      :data-voice-target="voiceTargetIdPrefix + 'toggle-button'"
      @click="toggleDropdown"
      class="audio-mode-selector-button"
    >
      <span class="audio-mode-icon-wrapper">
        <component :is="currentAudioModeDetails?.icon" class="w-4 h-4" aria-hidden="true" />
      </span>
      <span class="font-medium hidden xl:inline">{{ currentAudioModeDetails?.label }}</span>
      <span class="font-medium xl:hidden">{{ currentAudioModeDetails?.shortLabel || currentAudioModeDetails?.label }}</span>
      <ChevronDownIcon class="w-4 h-4 ml-1 transition-transform duration-200" :class="{ 'rotate-180': isDropdownOpen }" />
    </AppButton>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isDropdownOpen"
        class="dropdown-menu origin-top-right"
        role="menu"
        aria-orientation="vertical"
        :aria-labelledby="voiceTargetIdPrefix + 'toggle-button'"
      >
        <div class="dropdown-header">
          <h3 class="header-title-sm">{{ t('header.selectAudioModeTitle') }}</h3>
        </div>
        <div class="dropdown-content py-1" role="none">
          <button
            v-for="mode in availableAudioModesWithOptions"
            :key="mode.value"
            :class="['dropdown-item', { 'is-active': chatSettingsStore.currentAudioMode === mode.value }]"
            role="menuitem"
            :data-voice-target="voiceTargetIdPrefix + 'audio-mode-option-' + mode.value"
            @click="selectAudioMode(mode.value)"
          >
            <span class="audio-mode-icon-wrapper is-item-icon" :class="mode.iconClass">
              <component :is="mode.icon" class="w-5 h-5" aria-hidden="true" />
            </span>
            <div class="flex-1 text-left">
              <div class="font-medium item-label">{{ mode.label }}</div>
              <div v-if="mode.description" class="text-xs item-description">{{ mode.description }}</div>
            </div>
            <CheckIcon v-if="chatSettingsStore.currentAudioMode === mode.value" class="w-5 h-5 text-primary-color ml-auto" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
/**
 * @file HeaderAudioModeSelector.vue
 * @description Dropdown component for selecting the audio input mode (Push-to-Talk, Continuous, etc.).
 * Integrates with ChatSettingsStore, is themeable, and voice-navigable.
 */
import { ref, computed, onMounted, onBeforeUnmount, PropType } from 'vue';
import { useI18n } from '../../composables/useI18n';
import { useChatSettingsStore, AudioInputMode } from '../../features/chat/store/chatSettings.store';
import { useVoiceStore } from '../../store/voice.store'; // To check if voice features are available
import AppButton from '../common/AppButton.vue';
import {
  ChevronDownIcon,
  CheckIcon,
  MicrophoneIcon, // Push to Talk
  SpeakerWaveIcon, // Continuous
  BellAlertIcon, // Voice Activation (could be better icon)
} from '@heroicons/vue/24/solid';
import type { Component } from 'vue';

interface AudioModeOption {
  value: AudioInputMode;
  label: string;
  shortLabel?: string;
  description?: string;
  icon: Component;
  iconClass?: string;
}

const props = defineProps({
  /** Prefix for voice target IDs. */
  voiceTargetIdPrefix: { type: String, required: true },
  /** Indicates if rendered in a mobile context. */
  isMobile: { type: Boolean, default: false },
});

const emit = defineEmits<{
  /** Emitted when an audio mode is selected. */
  (e: 'audio-mode-selected', mode: AudioInputMode): void;
}>();

const { t } = useI18n();
const chatSettingsStore = useChatSettingsStore();
const voiceStore = useVoiceStore(); // To conditionally render if voice is available

const isDropdownOpen = ref(false);
const dropdownContainerRef = ref<HTMLElement | null>(null);

const availableAudioModesWithOptions = computed<AudioModeOption[]>(() => [
  {
    value: AudioInputMode.PUSH_TO_TALK,
    label: t('audioModes.pushToTalk.label'),
    shortLabel: t('audioModes.pushToTalk.shortLabel'),
    description: t('audioModes.pushToTalk.description'),
    icon: MicrophoneIcon,
    iconClass: 'audio-mode-icon-ptt',
  },
  {
    value: AudioInputMode.CONTINUOUS_LISTENING,
    label: t('audioModes.continuous.label'),
    shortLabel: t('audioModes.continuous.shortLabel'),
    description: t('audioModes.continuous.description'),
    icon: SpeakerWaveIcon,
    iconClass: 'audio-mode-icon-continuous',
  },
  {
    value: AudioInputMode.VOICE_ACTIVATION,
    label: t('audioModes.voiceActivation.label'),
    shortLabel: t('audioModes.voiceActivation.shortLabel'),
    description: t('audioModes.voiceActivation.description'),
    icon: BellAlertIcon, // Consider a better icon for VAD
    iconClass: 'audio-mode-icon-vad',
  },
]);

const currentAudioModeDetails = computed(() =>
  availableAudioModesWithOptions.value.find(m => m.value === chatSettingsStore.currentAudioMode)
);

const toggleDropdown = () => isDropdownOpen.value = !isDropdownOpen.value;
const closeDropdown = () => isDropdownOpen.value = false;

const selectAudioMode = (mode: AudioInputMode) => {
  chatSettingsStore.setAudioMode(mode);
  closeDropdown();
  emit('audio-mode-selected', mode);
  // Potentially trigger voiceCommandService to adapt to new mode
  // voiceCommandService.updateAudioInputMode(mode);
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownContainerRef.value && !dropdownContainerRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside, true));
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside, true));
</script>

<style scoped>
/* Styles are very similar to HeaderModeSelector and HeaderLanguageSelector */
.audio-mode-selector-button {
  min-width: var(--app-header-dropdown-button-min-width-md, 180px); /* Slightly wider for longer labels */
  justify-content: space-between;
}

.audio-mode-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem; /* Tailwind w-7 */
  height: 1.75rem; /* Tailwind h-7 */
  border-radius: var(--app-border-radius-sm, 0.25rem);
  /* background-color: var(--app-audio-mode-icon-bg, var(--app-surface-inset-color)); */
  /* color: var(--app-audio-mode-icon-text, var(--app-text-secondary-color)); */
  margin-right: 0.5rem;
}
.audio-mode-icon-wrapper.is-item-icon {
    width: 2rem; height: 2rem;
}

/* Specific icon colors if needed, or rely on text color */
.audio-mode-icon-ptt { color: var(--app-blue-text-strong); }
.audio-mode-icon-continuous { color: var(--app-green-text-strong); }
.audio-mode-icon-vad { color: var(--app-orange-text-strong); }


/* Re-use dropdown styles from a common stylesheet or HeaderModeSelector */
.dropdown-menu { /* ... same as HeaderModeSelector ... */
  position: absolute;
  right: 0;
  margin-top: 0.5rem;
  width: var(--app-header-dropdown-width-md, 20rem);
  background-color: var(--app-dropdown-bg, var(--app-surface-color));
  border: 1px solid var(--app-dropdown-border-color, var(--app-border-color));
  border-radius: var(--app-border-radius-lg, 0.5rem);
  box-shadow: var(--app-shadow-lg);
  z-index: var(--z-index-dropdown, 50);
}
.dropdown-header { padding: 0.75rem 1rem; border-bottom: 1px solid var(--app-dropdown-divider-color); }
.header-title-sm { font-size: var(--app-font-size-base); font-weight: var(--app-font-weight-semibold); color: var(--app-dropdown-header-text-color); }
.dropdown-content { max-height: 60vh; overflow-y: auto; }
.dropdown-item { display: flex; align-items: center; width: 100%; padding: 0.75rem 1rem; text-align: left; font-size: var(--app-font-size-sm); color: var(--app-dropdown-item-text-color); cursor: pointer; gap: 0.75rem; }
.dropdown-item:hover { background-color: var(--app-dropdown-item-hover-bg); }
.dropdown-item.is-active { background-color: var(--app-dropdown-item-active-bg); color: var(--app-dropdown-item-active-text); font-weight: var(--app-font-weight-medium); }
.dropdown-item.is-active .item-label { color: var(--app-dropdown-item-active-text); }
.item-label { color: var(--app-dropdown-item-text-color); }
.item-description { color: var(--app-dropdown-item-description-text-color); }

/* Holographic theme adjustments */
/* ... similar to HeaderModeSelector ... */
</style>