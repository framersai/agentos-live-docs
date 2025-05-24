// File: frontend/src/components/voice/VoiceCommandFeedbackOverlay.vue
<template>
  <Teleport to="body">
    <Transition name="feedback-slide-up">
      <div
        v-if="voiceStore.feedbackMessage || (voiceStore.isListening && !voiceStore.feedbackMessage)"
        class="voice-feedback-overlay"
        :class="[uiStore.currentTheme, overlayThemeClass, `status-${voiceStore.status.toLowerCase()}`]"
        role="status"
        aria-live="assertive"
        :data-voice-target-region="'voice-feedback-overlay-region'"
      >
        <div class="feedback-content">
          <div class="feedback-icon-wrapper">
            <LoadingSpinner v-if="voiceStore.isProcessingIntent || (voiceStore.isListening && voiceStore.status === SpeechRecognitionStatus.PROCESSING)" size="sm" :variant="spinnerVariant" />
            <component v-else :is="statusIcon" class="status-icon" aria-hidden="true" />
          </div>
          <p class="feedback-text" :data-voice-target="'voice-feedback-text'">
            {{ voiceStore.feedbackMessage || (voiceStore.isListening ? t('voiceInput.listeningStatus') : '') }}
          </p>
        </div>
         <div v-if="voiceStore.interimTranscript && voiceStore.isListening" class="interim-transcript-preview" :data-voice-target="'voice-feedback-interim-transcript'">
            {{ voiceStore.interimTranscript }}<span class="blinking-cursor-overlay">▋</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * @file VoiceCommandFeedbackOverlay.vue
 * @description Displays global, non-intrusive feedback for voice command status
 * (e.g., "Listening...", "Processing...", error messages).
 * Uses Teleport to render at the bottom of the body. Themeable and accessible.
 */
import { computed } from 'vue';
import { Teleport, Transition } from 'vue';
import { useUiStore } from '../../store/ui.store';
import { useVoiceStore, SpeechRecognitionStatus } from '../../store/voice.store';
import { useI18n } from '../../composables/useI18n';
import LoadingSpinner from '../common/LoadingSpinner.vue';
import {
  MicrophoneIcon,
  CogIcon, // For processing
  CheckCircleIcon, // For success (e.g., command understood)
  ExclamationTriangleIcon, // For errors
  SpeakerWaveIcon, // For continuous listening indication
} from '@heroicons/vue/24/solid';

const uiStore = useUiStore();
const voiceStore = useVoiceStore();
const { t } = useI18n();

/** Computes the appropriate icon based on the current voice store status. */
const statusIcon = computed(() => {
  switch (voiceStore.status) {
    case SpeechRecognitionStatus.LISTENING:
      return voiceStore.currentAudioInputMode === AudioInputMode.CONTINUOUS_LISTENING ? SpeakerWaveIcon : MicrophoneIcon;
    case SpeechRecognitionStatus.PROCESSING:
      return CogIcon; // Or LoadingSpinner, but spinner is separate for clarity
    case SpeechRecognitionStatus.ERROR:
      return ExclamationTriangleIcon;
    case SpeechRecognitionStatus.AWAITING_CONFIRMATION:
      return InformationCircleIcon; // Using Info for confirmation prompt
    case SpeechRecognitionStatus.IDLE: // Fallback if feedback message exists while idle
         if (voiceStore.lastParsedIntent) return CheckCircleIcon; // Success after processing
         return InformationCircleIcon; // Generic info if idle with feedback
    default:
      return MicrophoneIcon;
  }
});

/** CSS classes for theming the overlay based on UI store theme. */
const overlayThemeClass = computed(() => `theme-${uiStore.currentTheme}-overlay`);

/** Spinner variant based on theme for better contrast. */
const spinnerVariant = computed(() => {
  return uiStore.currentTheme === 'theme-dark' || uiStore.currentTheme === 'theme-holographic' ? 'light' : 'primary';
});
</script>

<style scoped>
.voice-feedback-overlay {
  position: fixed;
  bottom: var(--space-3, 0.75rem);
  left: 50%;
  transform: translateX(-50%);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--app-border-radius-pill);
  background-color: var(--app-voice-feedback-bg, var(--app-surface-raised-color));
  color: var(--app-voice-feedback-text, var(--app-text-color));
  box-shadow: var(--app-shadow-lg);
  z-index: var(--z-index-voice-feedback, 4500);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  min-width: 200px;
  max-width: 90vw;
  text-align: center;
  border: 1px solid var(--app-voice-feedback-border, var(--app-border-color));
  backdrop-filter: var(--app-blur-xs);
}

.feedback-content {
    display: flex;
    align-items: center;
    gap: var(--space-2);
}

.feedback-icon-wrapper {
  flex-shrink: 0;
}
.status-icon {
  width: 1.125rem; /* text-lg equivalent height */
  height: 1.125rem;
  /* Color inherited from .voice-feedback-overlay text color */
}
.feedback-text {
  font-size: var(--app-font-size-sm);
  font-weight: var(--app-font-weight-medium);
}

.interim-transcript-preview {
    font-size: var(--app-font-size-xs);
    color: var(--app-text-muted-color);
    margin-top: var(--space-1);
    font-style: italic;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.blinking-cursor-overlay {
  animation: blink 1s step-end infinite;
  color: var(--app-cursor-color, var(--app-primary-color));
}
@keyframes blink { 50% { opacity: 0; } }


/* Status specific styling */
.voice-feedback-overlay.status-error {
  background-color: var(--app-danger-bg-subtle);
  color: var(--app-danger-text-strong);
  border-color: var(--app-danger-border-color);
}
.voice-feedback-overlay.status-error .status-icon {
  color: var(--app-danger-color);
}

/* Transitions */
.feedback-slide-up-enter-active,
.feedback-slide-up-leave-active {
  transition: opacity 0.3s var(--app-ease-out), transform 0.3s var(--app-ease-out);
}
.feedback-slide-up-enter-from,
.feedback-slide-up-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

/* Holographic Theme */
.theme-holographic-overlay { /* Applied via :class binding */
  background-color: var(--holographic-feedback-overlay-bg, rgba(var(--holographic-panel-rgb), 0.85));
  color: var(--holographic-feedback-overlay-text, var(--holographic-text-primary));
  border-color: var(--holographic-border-translucent);
  box-shadow: var(--holographic-glow-md-accent);
  backdrop-filter: var(--holographic-blur-sm);
}
.theme-holographic-overlay .status-icon {
  color: var(--holographic-accent);
}
.theme-holographic-overlay.status-error {
    background-color: rgba(var(--holographic-danger-accent-rgb), 0.3);
    color: var(--holographic-danger-accent);
    border-color: rgba(var(--holographic-danger-accent-rgb), 0.5);
}
.theme-holographic-overlay.status-error .status-icon {
  color: var(--holographic-danger-accent);
}
.theme-holographic .interim-transcript-preview {
    color: var(--holographic-text-muted);
}
.theme-holographic .blinking-cursor-overlay {
    color: var(--holographic-accent);
}
</style>