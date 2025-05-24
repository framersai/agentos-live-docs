// File: frontend/src/components/voice/VoiceInput.vue
<template>
  <div
    class="voice-input-container"
    :class="[uiStore.currentTheme, `status-${voiceStore.status.toLowerCase()}`]"
    :data-voice-target-region="voiceTargetIdPrefix + 'region'"
  >
    <div class="text-input-wrapper" v-if="showTextInput">
      <AppInput
        v-model="textInputValue"
        :placeholder="textInputPlaceholder"
        :disabled="voiceStore.isListening || isProcessing"
        :voice-target="voiceTargetIdPrefix + 'text-input'"
        @keydown.enter="handleTextSubmit"
        @focus="isTextInputFocused = true"
        @blur="isTextInputFocused = false"
        size="lg"
        class="flex-grow"
      >
        <template #append>
          <AppButton
            variant="primary"
            size="md"
            :icon="PaperAirplaneIcon"
            :aria-label="t('common.send')"
            :disabled="!textInputValue.trim() || isProcessing"
            :data-voice-target="voiceTargetIdPrefix + 'text-send-button'"
            @click="handleTextSubmit"
            class="text-submit-button"
          />
        </template>
      </AppInput>
    </div>

    <div class="voice-button-wrapper">
      <AppButton
        variant="custom"
        :class="voiceButtonClasses"
        :aria-label="voiceButtonAriaLabel"
        :title="voiceButtonAriaLabel"
        :disabled="isProcessing || !voiceStore.isVoiceFeatureAvailable"
        :data-voice-target="voiceTargetIdPrefix + 'toggle-listening-button'"
        @click="handleToggleListening"
      >
        <div class="button-icon-container">
          <transition name="fade" mode="out-in">
            <component :is="voiceButtonIcon" class="voice-icon" />
          </transition>
        </div>
        <div v-if="voiceStore.isListening || isProcessing" class="rings-animation-container">
          <div class="ring ring-1"></div>
          <div class="ring ring-2"></div>
          <div class="ring ring-3"></div>
        </div>
      </AppButton>
    </div>

    <div class="status-transcript-area" v-if="showStatusArea">
      <p
        v-if="voiceStore.feedbackMessage"
        class="feedback-message"
        :class="`feedback-${voiceStore.status}`"
        :data-voice-target="voiceTargetIdPrefix + 'feedback-message'"
        role="status"
      >
        {{ voiceStore.feedbackMessage }}
      </p>
      <p
        v-if="voiceStore.isListening && voiceStore.interimTranscript"
        class="interim-transcript-display"
        :data-voice-target="voiceTargetIdPrefix + 'interim-transcript'"
        aria-live="polite"
      >
        {{ voiceStore.interimTranscript }}<span class="blinking-cursor">▋</span>
      </p>
      <p
        v-if="!voiceStore.isListening && voiceStore.finalTranscript && voiceStore.status !== SpeechRecognitionStatus.PROCESSING"
        class="final-transcript-display"
        :data-voice-target="voiceTargetIdPrefix + 'final-transcript'"
      >
        <strong>{{ t('voiceInput.finalTranscriptLabel') }}:</strong> {{ voiceStore.finalTranscript }}
      </p>
      <p v-if="voiceStore.lastError && voiceStore.status === SpeechRecognitionStatus.ERROR" class="error-message" role="alert">
        {{ voiceStore.lastError }}
      </p>
    </div>

     <div v-if="showAdvancedControls && voiceStore.isVoiceFeatureAvailable" class="advanced-controls">
        <AppSelect
            :model-value="chatSettingsStore.currentAudioInputMode"
            @update:model-value="handleAudioModeChange"
            :options="audioModeOptions"
            :label="t('voiceInput.audioModeLabel')"
            :voice-target="voiceTargetIdPrefix + 'audio-mode-select'"
            size="sm" variant="filled" class="control-select"
        />
        <AppSelect
            :model-value="chatSettingsStore.currentTranscriptionMethod"
            @update:model-value="handleTranscriptionMethodChange"
            :options="transcriptionMethodOptions"
            :label="t('voiceInput.transcriptionMethodLabel')"
            :voice-target="voiceTargetIdPrefix + 'transcription-method-select'"
            size="sm" variant="filled" class="control-select"
        />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file VoiceInput.vue
 * @description SOTA component for handling voice input. Integrates with VoiceCommandService,
 * VoiceStore, and ChatSettingsStore. Supports Web Speech API and a conceptual path for
 * advanced client-side audio processing (your AudioProcessor) for backend Whisper STT.
 * Provides rich visual feedback, is themeable, accessible, and voice-navigable.
 *
 * @property {boolean} [isProcessing=false] - Indicates if a parent component (e.g., chat) is busy. Disables input.
 * @property {string} [voiceTargetIdPrefix='voice-input-'] - Prefix for voice target IDs.
 * @property {boolean} [showTextInput=true] - Whether to show the text input field as a fallback.
 * @property {string} [textInputPlaceholder] - Placeholder for the text input.
 * @property {boolean} [showAdvancedControls=false] - Whether to show selectors for audio mode and transcription method.
 * @emits transcription - Emits the final transcribed text.
 * @emits text-submitted - Emits the text input value when submitted via Enter or send button.
 * @emits intent-detected - (Future) If client-side NLU is added, emits detected intent.
 * @emits voice-command-trigger - Emits a specific command string when a direct voice action (not full STT/NLU) is triggered.
 */
import { ref, computed, watch, onMounted, PropType } from 'vue';
import { useI18n } from '../../composables/useI18n';
import { useUiStore } from '../../store/ui.store';
import { useVoiceStore, SpeechRecognitionStatus } from '../../store/voice.store';
import { useChatSettingsStore, AudioInputMode, TranscriptionMethod } from '../../features/chat/store/chatSettings.store';
import { voiceCommandService, IVoiceCommandService } from '../../services/voiceCommandService';

import AppInput from '../common/AppInput.vue';
import AppButton from '../common/AppButton.vue';
import AppSelect from '../common/AppSelect.vue';
import LoadingSpinner from '../common/LoadingSpinner.vue'; // Used internally by AppButton if loading prop
import {
  MicrophoneIcon,
  StopCircleIcon, // For stopping
  PaperAirplaneIcon, // For text send
  CogIcon, // Placeholder for settings/options
  SpeakerWaveIcon, // Continuous
  BellAlertIcon, // VAD
  AdjustmentsHorizontalIcon, // Advanced Controls
} from '@heroicons/vue/24/solid';
import type { SelectOption } from '../../types';

const props = defineProps({
  /** Indicates if a parent component is busy, disabling voice/text input. */
  isProcessing: { type: Boolean, default: false },
  /** Prefix for voice target IDs. */
  voiceTargetIdPrefix: { type: String, default: 'voice-input-' },
  /** Whether to show the text input field. */
  showTextInput: { type: Boolean, default: true },
  /** Placeholder for the text input field. */
  textInputPlaceholder: { type: String, default: '' }, // Will use i18n default if empty
  /** Whether to show advanced controls like audio mode and STT method selectors. */
  showAdvancedControls: { type: Boolean, default: false },
});

const emit = defineEmits<{
  (e: 'transcription', value: string): void;
  (e: 'text-submitted', value: string): void;
  (e: 'voice-command-trigger', command: string, payload?: any): void; // For direct, non-NLU commands
}>();

const { t } = useI18n();
const uiStore = useUiStore();
const voiceStore = useVoiceStore();
const chatSettingsStore = useChatSettingsStore();
// const vcs: IVoiceCommandService = voiceCommandService; // Direct use

const textInputValue = ref('');
const isTextInputFocused = ref(false);

/** Placeholder computed property for text input. */
const effectivePlaceholder = computed(() => props.textInputPlaceholder || t('voiceInput.textPlaceholder'));

/** Determines the appropriate icon for the main voice button based on state. */
const voiceButtonIcon = computed(() => {
  if (props.isProcessing) return CogIcon; // Using CogIcon as a generic "busy" indicator
  if (voiceStore.isListening) return StopCircleIcon;
  return MicrophoneIcon;
});

/** Computes dynamic CSS classes for the main voice button. */
const voiceButtonClasses = computed(() => [
  'voice-action-button',
  `status-${voiceStore.status.toLowerCase()}`,
  {
    'is-active-listening': voiceStore.isListening,
    'is-disabled': props.isProcessing || !voiceStore.isVoiceFeatureAvailable,
  }
]);

/** Computes the ARIA label for the main voice button. */
const voiceButtonAriaLabel = computed(() => {
  if (props.isProcessing) return t('common.processing');
  if (voiceStore.isListening) return t('voiceInput.stopListening');
  return t('voiceInput.startListening');
});

/** Determines if the status/transcript area should be visible. */
const showStatusArea = computed(() => {
  return voiceStore.feedbackMessage ||
         (voiceStore.isListening && voiceStore.interimTranscript) ||
         (!voiceStore.isListening && voiceStore.finalTranscript && voiceStore.status !== SpeechRecognitionStatus.PROCESSING) ||
         (voiceStore.lastError && voiceStore.status === SpeechRecognitionStatus.ERROR);
});

/** Options for the Audio Input Mode selector. */
const audioModeOptions = computed<SelectOption<AudioInputMode>[]>(() =>
  chatSettingsStore.availableAudioModes.map(m => ({
    value: m.value,
    label: t(`audioModes.${m.value}.label`), // Ensure i18n keys exist
  }))
);

/** Options for the Transcription Method selector. */
const transcriptionMethodOptions = computed<SelectOption<TranscriptionMethod>[]>(() =>
  chatSettingsStore.availableTranscriptionMethods.map(m => ({ // Assuming this getter exists
    value: m.value,
    label: t(`transcriptionMethods.${m.value}.label`), // Ensure i18n keys exist
    disabled: !voiceCommandService.isEngineAvailable(m.value)
  }))
);

/** Handles toggling the voice listening state via VoiceCommandService. */
const handleToggleListening = async () => {
  if (!voiceStore.isVoiceFeatureAvailable) {
    uiStore.addNotification({type: 'warning', message: t('voiceInput.voiceNotAvailable')});
    return;
  }
  await voiceCommandService.toggleListening();
};

/** Handles text input submission. */
const handleTextSubmit = () => {
  if (textInputValue.value.trim() && !props.isProcessing) {
    emit('text-submitted', textInputValue.value.trim());
    textInputValue.value = '';
  }
};

/** Handles changes to the audio input mode selection. */
const handleAudioModeChange = (newMode: AudioInputMode) => {
  voiceCommandService.setAudioInputMode(newMode);
};

/** Handles changes to the transcription method selection. */
const handleTranscriptionMethodChange = (newMethod: TranscriptionMethod) => {
  voiceCommandService.setTranscriptionMethod(newMethod);
};

// Watch for final transcripts from the store to emit them upwards
watch(() => voiceStore.finalTranscriptForEmit, (newFinalTranscript) => {
    if (newFinalTranscript) {
        emit('transcription', newFinalTranscript);
        voiceStore.clearEmittedFinalTranscript(); // Action in store to clear it after emit
    }
});

onMounted(async () => {
  // VoiceCommandService should be initialized globally, e.g., in App.vue or main.ts
  // await voiceCommandService.initialize(); // Ensure initialized if not done globally
  if (!voiceStore.isVoiceFeatureAvailable && voiceCommandService.isEngineAvailable(TranscriptionMethod.WEB_SPEECH)) {
    // Attempt to initialize if browser supports it but store says unavailable (e.g. first load)
     await voiceCommandService.initialize();
  }
});

</script>

<style scoped>
.voice-input-container {
  @apply p-2 sm:p-3 rounded-t-xl w-full;
  background-color: var(--app-input-area-bg, var(--app-surface-color));
  border-top: 1px solid var(--app-input-area-border-color, var(--app-border-color));
  /* Add subtle shadow or separation from content above */
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
}
.theme-dark .voice-input-container, .theme-holographic .voice-input-container {
    box-shadow: 0 -2px 15px rgba(0,0,0,0.1);
}
.theme-holographic .voice-input-container {
    background: var(--holographic-input-area-bg, linear-gradient(to top, rgba(var(--holographic-panel-rgb),0.7), transparent));
    border-top-color: var(--holographic-border-subtle);
}


.text-input-wrapper {
  @apply flex items-center gap-2 mb-2; /* Space between input and potential button */
}
.text-input-wrapper .app-input { /* Target AppInput specifically */
  /* AppInput handles its own theming and variants */
}
.text-submit-button {
    /* AppButton styling will apply; this is for specific positioning if needed */
    flex-shrink: 0;
}


.voice-button-wrapper {
  @apply flex justify-center items-center my-2; /* Centered voice button */
}
.voice-action-button { /* Targets AppButton */
  @apply w-16 h-16 sm:w-20 sm:h-20; /* Large, easily tappable button */
  border-radius: var(--app-border-radius-full);
  /* Custom variant in AppButton should handle specific backgrounds and icons */
  /* For this component, we control it via :class and CSS variables */
  background-color: var(--app-voice-button-idle-bg, var(--app-primary-color));
  color: var(--app-voice-button-idle-icon-color, white);
  box-shadow: var(--app-shadow-lg);
  position: relative; /* For rings */
  overflow: visible; /* Allow rings to expand outside */
}
.voice-action-button.is-active-listening {
  background-color: var(--app-voice-button-active-bg, var(--app-danger-color));
  color: var(--app-voice-button-active-icon-color, white);
}
.voice-action-button.status-processing {
  background-color: var(--app-voice-button-processing-bg, var(--app-accent-color));
  color: var(--app-voice-button-processing-icon-color, white);
  cursor: default;
}
.voice-action-button.is-disabled {
  background-color: var(--app-disabled-bg-strong);
  color: var(--app-disabled-text-color);
  box-shadow: none;
}
.voice-icon {
  width: 1.75rem; height: 1.75rem; /* Tailwind w-7 h-7 */
}
@media (min-width: 640px) { /* sm */
  .voice-icon { width: 2.25rem; height: 2.25rem; } /* Tailwind w-9 h-9 */
}

.rings-animation-container {
  @apply absolute inset-0 pointer-events-none;
}
.ring {
  @apply absolute block w-full h-full rounded-full border-2;
  border-color: var(--app-voice-ring-color, currentColor); /* Use button's current color */
  opacity: 0.8;
  animation: sonar-ping 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
}
.ring.ring-1 { animation-delay: 0s; }
.ring.ring-2 { animation-delay: 0.3s; }
.ring.ring-3 { animation-delay: 0.6s; }

@keyframes sonar-ping {
  0% { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(1.6); opacity: 0; }
}


.status-transcript-area {
  @apply text-center mt-2 space-y-1 min-h-[1.5em]; /* Reserve space to prevent layout shift */
  font-size: var(--app-font-size-sm);
}
.feedback-message {
  color: var(--app-text-muted-color);
  font-style: italic;
}
.feedback-message.feedback-listening { color: var(--app-primary-color); }
.feedback-message.feedback-processing { color: var(--app-accent-color); }
.feedback-message.feedback-error { color: var(--app-danger-color); }


.interim-transcript-display {
  color: var(--app-text-secondary-color);
  min-height: 1.5em; /* Prevent jump when text appears */
}
.final-transcript-display {
  color: var(--app-text-color);
  font-weight: var(--app-font-weight-medium);
}
.error-message {
  color: var(--app-danger-text-strong);
  font-weight: var(--app-font-weight-medium);
}
.blinking-cursor {
  animation: blink 1s step-end infinite;
  color: var(--app-cursor-color, var(--app-primary-color));
  font-weight: bold; /* Make cursor more visible */
}
@keyframes blink { 50% { opacity: 0; } }

.advanced-controls {
    @apply flex flex-wrap justify-center gap-2 sm:gap-4 mt-3 pt-3 border-t border-dashed;
    border-top-color: var(--app-border-color-extralight);
}
.control-select { /* Targets AppSelect */
    min-width: 160px;
}
.control-select :deep(.app-select-label) { /* Target label within AppSelect */
    @apply sr-only; /* Visually hide label for compact controls, but keep for ARIA */
}

/* Holographic theme specifics */
.theme-holographic .voice-action-button {
    background: var(--holographic-voice-button-idle-bg, radial-gradient(circle, rgba(var(--holographic-accent-rgb),0.6) 0%, rgba(var(--holographic-accent-rgb),0.3) 70%));
    color: var(--holographic-voice-button-icon-color, var(--holographic-text-on-accent));
    border: 1px solid rgba(var(--holographic-accent-rgb), 0.5);
    box-shadow: var(--holographic-glow-md-accent), 0 0 0 3px rgba(var(--holographic-accent-rgb),0.1);
}
.theme-holographic .voice-action-button.is-active-listening {
    background: var(--holographic-voice-button-active-bg, radial-gradient(circle, rgba(var(--holographic-danger-accent-rgb),0.7) 0%, rgba(var(--holographic-danger-accent-rgb),0.4) 70%));
    color: var(--holographic-voice-button-icon-color); /* Assuming same contrast color */
    border-color: rgba(var(--holographic-danger-accent-rgb), 0.6);
    box-shadow: var(--holographic-glow-md-danger), 0 0 0 3px rgba(var(--holographic-danger-accent-rgb),0.15);
}
.theme-holographic .ring {
    border-color: var(--holographic-voice-ring-color, rgba(var(--holographic-accent-rgb), 0.7));
}
.theme-holographic .feedback-message { color: var(--holographic-text-muted); }
.theme-holographic .interim-transcript-display { color: var(--holographic-text-secondary); }
.theme-holographic .final-transcript-display { color: var(--holographic-text-primary); }
.theme-holographic .error-message { color: var(--holographic-danger-color); }
.theme-holographic .blinking-cursor { color: var(--holographic-accent); }
.theme-holographic .advanced-controls { border-top-color: var(--holographic-border-very-subtle); }
</style>