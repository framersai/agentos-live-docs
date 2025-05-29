// File: frontend/src/components/header/VoiceControlsDropdown.vue
/**
 * @file VoiceControlsDropdown.vue
 * @description Dropdown component for managing voice input/output settings,
 * including audio input mode, STT preference, global TTS mute, and future selection of specific TTS voices.
 * It adheres to the "Ephemeral Harmony" design system, utilizing shared dropdown styles.
 *
 * @component VoiceControlsDropdown
 * @props None. Reads and updates settings directly via `voiceSettingsManager`.
 * @emits None.
 *
 * @example
 * <VoiceControlsDropdown />
 * @version 1.1.1 - Corrected TypeScript errors, removed unused imports based on template usage.
 */
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, type Ref, type Component as VueComponentType } from 'vue';
import {
  voiceSettingsManager,
  type AudioInputMode,
  type VoiceApplicationSettings,
  type STTPreference
  // TTSProvider is not directly used as a type annotation here after corrections.
} from '@/services/voice.settings.service';

// Icons - Only importing icons actively used in the template.
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  MicrophoneIcon as PTTModeIcon,
  SpeakerWaveIcon as ContinuousModeIcon,
  CpuChipIcon as VADModeIcon,
  SpeakerWaveIcon as TTSUnmutedIcon,
  SpeakerXMarkIcon as TTSMutedIcon,
  CloudIcon as WhisperIcon,
  ComputerDesktopIcon as BrowserSTTIcon,
  ChatBubbleLeftRightIcon as OpenAIVoicesIcon,
  ServerStackIcon as BrowserVoicesIcon,
  CheckIcon as SelectedOptionIcon, // Outline CheckIcon is used for selected options
} from '@heroicons/vue/24/outline';

/** @interface AudioModeOption - Defines structure for audio input mode selection options. */
interface AudioModeOption {
  label: string;
  value: AudioInputMode;
  icon: VueComponentType;
  description: string;
}

/** @interface STTOption - Defines structure for STT preference selection options. */
interface STTOption {
  label: string;
  value: STTPreference;
  icon: VueComponentType;
  description: string;
}

/** @type {VoiceApplicationSettings} settings - Reactive global voice settings object. */
const settings: VoiceApplicationSettings = voiceSettingsManager.settings;

/** @ref {Ref<boolean>} isOpen - Controls dropdown visibility. */
const isOpen: Ref<boolean> = ref(false);
/** @ref {Ref<HTMLElement | null>} dropdownRef - Template ref for click-outside detection. */
const dropdownRef: Ref<HTMLElement | null> = ref(null);

const toggleDropdown = (): void => { isOpen.value = !isOpen.value; };
const closeDropdown = (): void => { isOpen.value = false; };

const handleClickOutside = (event: MouseEvent): void => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

onMounted(() => { document.addEventListener('mousedown', handleClickOutside, true); });
onUnmounted(() => { document.removeEventListener('mousedown', handleClickOutside, true); });

const audioModeOptions = computed<AudioModeOption[]>(() => [
  { label: 'Push-to-Talk', value: 'push-to-talk', icon: PTTModeIcon, description: "Hold microphone button to speak." },
  { label: 'Continuous', value: 'continuous', icon: ContinuousModeIcon, description: "Microphone stays on, actively listening." },
  { label: 'Voice Activate ("V")', value: 'voice-activation', icon: VADModeIcon, description: "Say 'V' to activate, then speak command." },
]);

const selectedAudioMode = computed<AudioInputMode>({
  get: () => settings.audioInputMode,
  set: (val: AudioInputMode) => voiceSettingsManager.updateSetting('audioInputMode', val),
});

const sttOptions = computed<STTOption[]>(() => [
  { label: 'Browser STT', value: 'browser_webspeech_api', icon: BrowserSTTIcon, description: "Fast, uses browser's built-in engine. Quality varies." },
  { label: 'Whisper API', value: 'whisper_api', icon: WhisperIcon, description: "High accuracy, uses OpenAI. May incur costs." },
]);

const selectedSTTPreference = computed<STTPreference>({
  get: () => settings.sttPreference,
  set: (val: STTPreference) => voiceSettingsManager.updateSetting('sttPreference', val),
});

const isGlobalMuteActive = computed<boolean>({
  get: () => !settings.autoPlayTts,
  set: (isMuted: boolean) => voiceSettingsManager.updateSetting('autoPlayTts', !isMuted),
});

const toggleGlobalMute = (): void => { isGlobalMuteActive.value = !isGlobalMuteActive.value; };

// Placeholders for voice lists - these are used in the template for UI structure
const placeholderOpenAIVoices = ref([
  { id: 'openai_alloy', name: 'Alloy (OpenAI)', providerVoiceId: 'alloy' },
  { id: 'openai_echo', name: 'Echo (OpenAI)', providerVoiceId: 'echo' },
]);
const placeholderBrowserVoices = ref([
  { id: 'browser_sys_eng', name: 'System English (Browser)', providerVoiceId: 'uri:default-en' },
  { id: 'browser_sys_esp', name: 'System Spanish (Browser)', providerVoiceId: 'uri:default-es' },
]);

// These selected voice refs are for UI binding if we implement selection within this dropdown
const selectedOpenAIVoice = ref<string | null>(
    settings.ttsProvider === 'openai_tts' ? settings.selectedTtsVoiceId : null
);
const selectedBrowserVoice = ref<string | null>(
    settings.ttsProvider === 'browser_tts' ? settings.selectedTtsVoiceId : null
);

watch(() => settings.audioInputMode, (newVal) => {
  if (selectedAudioMode.value !== newVal) selectedAudioMode.value = newVal;
});
watch(() => settings.sttPreference, (newVal) => {
  if (selectedSTTPreference.value !== newVal) selectedSTTPreference.value = newVal;
});
watch(() => settings.autoPlayTts, (newVal) => {
  if (isGlobalMuteActive.value === newVal) isGlobalMuteActive.value = !newVal;
});
watch(() => settings.selectedTtsVoiceId, (newVal) => {
    if (settings.ttsProvider === 'openai_tts' && selectedOpenAIVoice.value !== newVal) {
        selectedOpenAIVoice.value = newVal;
    } else if (settings.ttsProvider === 'browser_tts' && selectedBrowserVoice.value !== newVal) {
        selectedBrowserVoice.value = newVal;
    }
});

const selectVoice = (voiceId: string | null) => {
    voiceSettingsManager.updateSetting('selectedTtsVoiceId', voiceId);
};

</script>

<template>
  <div class="relative header-control-item" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      id="voice-controls-trigger-button"
      class="btn btn-ghost-ephemeral btn-icon-ephemeral direct-header-button"
      aria-label="Open Voice and Audio Controls"
      :aria-expanded="isOpen"
      aria-controls="voice-controls-panel"
      title="Voice & Audio Settings"
    >
      <AdjustmentsHorizontalIcon class="icon-base icon-trigger" />
      <ChevronDownIcon class="icon-xs chevron-indicator ml-0.5 transition-transform duration-200" :class="{'rotate-180': isOpen}"/>
    </button>

    <Transition name="dropdown-float-enhanced">
      <div
        v-if="isOpen"
        id="voice-controls-panel"
        class="dropdown-panel-ephemeral absolute right-0 mt-2 w-72 md:w-80 origin-top-right"
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
            :aria-checked="!isGlobalMuteActive"
            title="Toggle Text-to-Speech playback"
          >
            <component :is="isGlobalMuteActive ? TTSMutedIcon : TTSUnmutedIcon" class="dropdown-item-icon" aria-hidden="true"/>
            <span>{{ isGlobalMuteActive ? 'Unmute Speech Output' : 'Mute Speech Output' }}</span>
            <span class="status-dot-indicator ml-auto w-2.5 h-2.5 rounded-full transition-colors"
                  :class="isGlobalMuteActive ? 'bg-[hsl(var(--color-error-h),var(--color-error-s),var(--color-error-l))]' : 'bg-[hsl(var(--color-success-h),var(--color-success-s),var(--color-success-l))]'"
                  :title="isGlobalMuteActive ? 'Speech Output Muted' : 'Speech Output Active'">
            </span>
          </button>

          <div class="dropdown-divider-ephemeral"></div>

          <div class="setting-group-in-dropdown px-1.5 py-1">
            <label class="dropdown-section-title-ephemeral !mb-1.5 !mt-0">Audio Input Mode</label>
            <div class="options-grid-dropdown grid grid-cols-3 gap-1.5">
              <button
                v-for="mode in audioModeOptions" :key="mode.value"
                @click="selectedAudioMode = mode.value"
                class="option-button-dropdown group"
                :class="{'active': selectedAudioMode === mode.value}"
                :title="mode.description"
                role="menuitemradio"
                :aria-checked="selectedAudioMode === mode.value"
              >
                <component :is="mode.icon" class="option-icon-dropdown" aria-hidden="true"/>
                <span class="option-label-dropdown">{{ mode.label }}</span>
              </button>
            </div>
          </div>

          <div class="dropdown-divider-ephemeral"></div>

          <div class="setting-group-in-dropdown px-1.5 py-1">
            <label class="dropdown-section-title-ephemeral !mb-1.5 !mt-0">Speech Recognition (STT)</label>
            <div class="options-grid-dropdown grid grid-cols-2 gap-1.5">
              <button
                v-for="stt in sttOptions" :key="stt.value"
                @click="selectedSTTPreference = stt.value"
                class="option-button-dropdown group"
                :class="{'active': selectedSTTPreference === stt.value}"
                :title="stt.description"
                role="menuitemradio"
                :aria-checked="selectedSTTPreference === stt.value"
              >
                <component :is="stt.icon" class="option-icon-dropdown" aria-hidden="true"/>
                <span class="option-label-dropdown">{{ stt.label }}</span>
              </button>
            </div>
          </div>

          <div v-if="settings.ttsProvider === 'openai_tts'">
            <div class="dropdown-divider-ephemeral"></div>
            <div class="setting-group-in-dropdown px-1.5 py-1">
              <label class="dropdown-section-title-ephemeral !mb-1.5 !mt-0 flex items-center">
                <OpenAIVoicesIcon class="section-title-icon-ephemeral" aria-hidden="true" /> OpenAI Voices
              </label>
              <div class="voice-list-placeholder">
                <button
                  v-for="voice in placeholderOpenAIVoices" :key="voice.id"
                  @click="selectVoice(voice.id)"
                  class="dropdown-item-ephemeral !text-xs !py-1.5 !px-2"
                  :class="{'active font-semibold': selectedOpenAIVoice === voice.id}"
                  role="menuitemradio" :aria-checked="selectedOpenAIVoice === voice.id"
                >
                  {{ voice.name }}
                  <SelectedOptionIcon v-if="selectedOpenAIVoice === voice.id" class="dropdown-item-icon icon-xs !ml-auto !mr-0" />
                </button>
                <p v-if="!placeholderOpenAIVoices.length" class="text-xs text-center py-2 text-[hsl(var(--color-text-muted-h),var(--color-text-muted-s),var(--color-text-muted-l))] italic opacity-75">(OpenAI voices N/A)</p>
              </div>
            </div>
          </div>

           <div v-if="settings.ttsProvider === 'browser_tts'">
            <div class="dropdown-divider-ephemeral"></div>
            <div class="setting-group-in-dropdown px-1.5 py-1">
              <label class="dropdown-section-title-ephemeral !mb-1.5 !mt-0 flex items-center">
                <BrowserVoicesIcon class="section-title-icon-ephemeral" aria-hidden="true" /> Browser Voices
              </label>
              <div class="voice-list-placeholder">
                 <button
                  v-for="voice in placeholderBrowserVoices" :key="voice.id"
                  @click="selectVoice(voice.id)"
                  class="dropdown-item-ephemeral !text-xs !py-1.5 !px-2"
                  :class="{'active font-semibold': selectedBrowserVoice === voice.id}"
                  role="menuitemradio" :aria-checked="selectedBrowserVoice === voice.id"
                >
                  {{ voice.name }}
                  <SelectedOptionIcon v-if="selectedBrowserVoice === voice.id" class="dropdown-item-icon icon-xs !ml-auto !mr-0" />
                </button>
                <p v-if="!placeholderBrowserVoices.length" class="text-xs text-center py-2 text-[hsl(var(--color-text-muted-h),var(--color-text-muted-s),var(--color-text-muted-l))] italic opacity-75">(Browser voices N/A or see Settings)</p>
              </div>
            </div>
          </div>
            <div class="dropdown-divider-ephemeral"></div>
             <RouterLink :to="{ name: 'Settings', hash: '#audio-voice-settings' }" @click="closeDropdown" role="menuitem" class="dropdown-item-ephemeral group">
                <AdjustmentsHorizontalIcon class="dropdown-item-icon" aria-hidden="true"/>
                <span>All Voice Settings</span>
            </RouterLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/abstracts/variables' as var;

.header-control-item {
  position: relative;
}

.chevron-indicator {
  opacity: 0.7;
}

.setting-group-in-dropdown {
  padding: var.$spacing-xs var.$spacing-xs;
}

.options-grid-dropdown {
  gap: calc(var.$spacing-xs * 0.75);
}

.option-button-dropdown {
  display: flex; // Ensure flex properties apply for alignment
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var.$spacing-xs;
  border-radius: var.$radius-lg;
  text-align: center;
  background-color: hsla(var(--color-bg-tertiary-h), var(--color-bg-tertiary-s), var(--color-bg-tertiary-l), 0.4);
  border: 1px solid hsla(var(--color-border-secondary-h), var(--color-border-secondary-s), var(--color-border-secondary-l), 0.25);
  color: hsl(var(--color-text-secondary-h), var(--color-text-secondary-s), var(--color-text-secondary-l));
  transition: all var.$duration-quick var.$ease-out-quad;
  min-height: 60px;
  cursor: pointer;

  .option-icon-dropdown {
    width: 1.4rem;
    height: 1.4rem;
    margin-bottom: calc(var.$spacing-xs * 0.3);
    opacity: 0.75;
  }
  .option-label-dropdown {
    font-weight: 500;
    font-size: calc(var.$font-size-xs * 0.9);
    line-height: 1.2;
    margin-top: auto;
  }

  &:hover {
    background-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.12);
    border-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.4);
    color: hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l));
    transform: translateY(-2px);
    box-shadow: var(--shadow-depth-sm);
    .option-icon-dropdown { opacity: 1; }
  }

  &.active {
    background-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.25) !important;
    border-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.65) !important;
    color: hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l)) !important;
    font-weight: 600;
    box-shadow: inset 0 1px 3px hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), calc(var(--color-accent-interactive-l) - 10%), 0.3),
                var(--shadow-depth-xs);
    .option-icon-dropdown { opacity: 1; transform: scale(1.05); }
  }
}
.voice-list-placeholder .dropdown-item-ephemeral {
  padding-top: calc(var.$spacing-xs / 2) !important;
  padding-bottom: calc(var.$spacing-xs / 2) !important;
  font-size: var.$font-size-xs !important;
  font-weight: 400 !important;

  &.active {
    font-weight: 600 !important; // Ensure active voice is distinct
    background-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.2) !important;
  }
}
.section-title-icon-ephemeral {
    width: 0.9em;
    height: 0.9em;
    opacity: 0.7;
    margin-right: calc(var.$spacing-xs * 0.5);
}
// Removed empty .status-dot-indicator rule as it's styled via Tailwind in template
</style>