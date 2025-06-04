// File: frontend/src/components/voice-input/VoiceInput.vue
/**
 * @file VoiceInput.vue
 * @description This is the main orchestrator component for all voice input functionalities
 * within the application. It integrates various composables for state management, microphone
 * access, STT mode management, audio feedback, and visual effects. It also dynamically
 * renders the appropriate STT handler (Browser Web Speech or Whisper) based on user settings.
 *
 * This component serves as the primary user interface for voice interactions, including
 * microphone control, mode selection, text input fallback, and status display.
 *
 * Key Responsibilities:
 * Initialize and manage core voice input services and composables.
 * Handle user interactions (mic button clicks, text input, mode changes).
 * Coordinate STT (Speech-to-Text) operations through useSttModeManager.
 * Display live transcriptions, status messages, and error feedback.
 * Manage microphone permissions and provide feedback to the user.
 * Integrate voice visualization.
 * Dynamically switch between different STT engine handlers.
 *
 * @component VoiceInput
 * @version 2.0.0
 * @updated 2025-06-04 - Extensively rewritten to address type errors, prop/event mismatches,
 * and to align with the refined architecture. Corrected settings access, event payloads,
 * handler API expectations, and composable integrations.
 */
<template>
  <div
    ref="voiceInputPanelRef"
    class="voice-input-panel"
    :class="[
      isWideScreen ? 'vi-widescreen' : '',
      effects.panelStateClass.value, // From useVoiceInputEffects
    ]"
    :style="effects.cssVariables.value"
    aria-labelledby="voice-input-heading"
  >
    <h2 id="voice-input-heading" class="vi-sr-only">Voice Input Controls</h2>

    <svg
      v-if="!uiStore.isReducedMotionPreferred && effects.geometricPatternSvg.value.length > 0"
      class="vi-background-effects-svg"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <defs />
      <g v-for="pattern in effects.geometricPatternSvg.value" :key="pattern.id" :opacity="pattern.opacity">
        <path :d="pattern.path" fill="currentColor" />
      </g>
    </svg>
    <div class="vi-dynamic-background" :style="{ background: effects.backgroundGradient.value }" aria-hidden="true" />

    <div class="vi-controls-area">
      <button
        @click="handleMicButtonClick"
        :disabled="micButtonDisabled"
        class="vi-mic-button"
        :class="{
          'vi-mic-active': modeManager.isActive.value,
          'vi-mic-vad-listening': isVoiceActivationMode && modeManager.activeHandlerApi.value?.isListeningForWakeWord.value,
        }"
        :aria-label="micButtonLabel"
        :title="micButtonLabel"
        type="button"
      >
        <component :is="micButtonIcon" class="icon-md" aria-hidden="true" />
      </button>

      <AudioModeDropdown
        :current-mode="currentAudioMode"
        :options="audioModeOptions"
        :disabled="modeManager.isActive.value || props.isProcessingLLM"
        @select-mode="handleAudioModeChange"
        class="vi-audio-mode-dropdown"
      />

      <div class="vi-status-indicator-wrapper">
        <div class="vi-status-indicator" :class="modeIndicatorClass" aria-live="polite" aria-atomic="true">
          <span class="vi-status-text" v-html="modeManager.statusText.value" />
        </div>
        <div
          v-if="sharedState.currentRecordingStatusHtml.value"
          class="vi-recording-status-html"
          v-html="sharedState.currentRecordingStatusHtml.value"
          aria-live="polite"
          aria-atomic="true"
        />
      </div>
    </div>

    <div class="vi-toolbar-area">
      <button
        @click="toggleInputToolbar"
        class="vi-toolbar-toggle-button"
        :aria-label="sharedState.showInputToolbar.value ? 'Hide input options' : 'Show input options'"
        :aria-expanded="sharedState.showInputToolbar.value"
        :title="sharedState.showInputToolbar.value ? 'Hide options' : 'Show options'"
        type="button"
      >
        <component :is="sharedState.showInputToolbar.value ? XMarkIcon : Cog6ToothIcon" class="icon-sm" aria-hidden="true"/>
      </button>
      <Transition name="toolbar-transition">
        <InputToolbar
          v-if="sharedState.showInputToolbar.value"
          :stt-engine-options="sttEngineOptions"
          :current-stt-engine-prop="settings.sttPreference"
          :live-transcription-enabled-prop="settings.showLiveTranscription ?? false"
          :features="{ textUpload: true, imageUpload: false }"
          @file-upload="handleFileUpload"
          @stt-engine-change="handleSttEngineChange"
          @toggle-live-transcription="handleToggleLiveTranscriptionSetting"
          @close-toolbar="closeInputToolbar"
          class="vi-input-toolbar"
        />
      </Transition>
    </div>

    <div
      class="vi-input-area"
      :class="{
        'vi-input-area-prominent-viz': isProminentVizActive,
        'vi-input-disabled': isInputEffectivelyDisabled,
      }"
    >
      <textarea
        v-if="!isProminentVizActive"
        ref="textareaRef"
        v-model="sharedState.textInput.value"
        @input="handleTextareaInput"
        @keydown.enter.exact.prevent="handleTextSubmit"
        @keydown.enter.shift.prevent="insertNewline"
        :placeholder="modeManager.placeholderText.value"
        :disabled="isInputEffectivelyDisabled"
        class="vi-textarea"
        aria-label="Text input for chat message"
        rows="1"
      />

      <canvas
        v-if="isVisualizationVisible"
        ref="visualizationCanvasRef"
        class="vi-visualization-canvas"
        :class="{ 'vi-visualization-prominent': isProminentVizActive }"
        aria-hidden="true"
        width="300" height="50" />

      <button
        v-if="!isProminentVizActive"
        @click="handleTextSubmit"
        :disabled="!sharedState.textInput.value.trim() || props.isProcessingLLM || isInputEffectivelyDisabled"
        class="vi-send-button"
        aria-label="Send text message"
        title="Send message (Enter)"
        type="submit"
      >
        <PaperAirplaneIcon class="icon-sm" aria-hidden="true" />
      </button>
    </div>

    <BrowserSpeechHandler
      v-if="settings.sttPreference === 'browser_webspeech_api'"
      :settings="settings"
      :audio-input-mode="currentAudioMode"
      :parent-is-processing-l-l-m="props.isProcessingLLM"
      :current-mic-permission="micPermissionStatus"
      @handler-api-ready="onBrowserHandlerReady"
      @unmounted="onBrowserHandlerUnmounted"
      @transcription="onTranscriptionHandlerEvent"
      @wake-word-detected="modeManager.handleWakeWordDetectedFromHandler"
      @is-listening-for-wake-word="(val: boolean) => sharedState.isListeningForWakeWord.value = val"
      @processing-audio="(val: boolean) => sharedState.isProcessingAudio.value = val"
      @error="onErrorHandlerEvent"
    />
    <WhisperSpeechHandler
      v-if="settings.sttPreference === 'whisper_api'"
      :settings="settings"
      :audio-input-mode="currentAudioMode"
      :parent-is-processing-l-l-m="props.isProcessingLLM"
      :current-mic-permission="micPermissionStatus"
      :active-stream="microphoneManager.activeStream.value"
      :analyser="microphoneManager.analyser.value"
      @handler-api-ready="onWhisperHandlerReady"
      @unmounted="onWhisperHandlerUnmounted"
      @transcription="onTranscriptionHandlerEvent"
      @processing-audio="(val: boolean) => sharedState.isProcessingAudio.value = val"
      @error="onErrorHandlerEvent"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, inject, watch, nextTick, type Ref, type Component as VueComponent, shallowRef } from 'vue';
import { voiceSettingsManager, type VoiceApplicationSettings, type AudioInputMode } from '@/services/voice.settings.service';
import type { ToastService } from '@/services/services'; // Assuming services are structured this way
import { useUiStore } from '@/store/ui.store'; // Assuming a Pinia store for UI settings

// Core VoiceInput module types
import type {
  SttHandlerInstance, SttEngineType, AudioModeOption, SttEngineOption,
  MicPermissionStatusType, TranscriptionData, SttHandlerErrorPayload
} from './types';

// Composables
import { useVoiceInputState, resetVoiceInputState } from './composables/shared/useVoiceInputState';
import { useTranscriptionDisplay } from './composables/shared/useTranscriptionDisplay';
import { useAudioFeedback, type AudioFeedbackInstance } from './composables/shared/useAudioFeedback';
import { useMicrophone, type UseMicrophoneReturn } from './composables/useMicrophone'; // Assuming user-provided path
import { useSttModeManager, type SttModeManagerInstance } from './composables/useSttModeManager';
import { useVoiceInputEffects, type UseVoiceInputEffectsOptions } from './composables/useVoiceInputEffects'; // Assuming user-provided path
import { useVoiceVisualization } from '@/composables/useVoiceVisualization'; // Corrected path as per user prompt for this specific composable

// Child Components
import BrowserSpeechHandler from './handlers/BrowserSpeechHandler.vue';
import WhisperSpeechHandler from './handlers/WhisperSpeechHandler.vue';
import AudioModeDropdown from './components/AudioModeDropdown.vue';
import InputToolbar from './components/InputToolbar.vue';

// Icons
import {
  PaperAirplaneIcon, Cog6ToothIcon, XMarkIcon,
  MicrophoneIcon as MicIconOutline,
  StopCircleIcon as StopIconSolid,
  UserCircleIcon as HearingIconSolid, // Placeholder for VAD listening icon
  NoSymbolIcon as MicOffIconSolid,
} from '@heroicons/vue/24/outline';
import { MicrophoneIcon as MicIconSolid } from '@heroicons/vue/24/solid';

/**
 * Props for the VoiceInput component.
 */
const props = defineProps<{
  /** Indicates if the main application (LLM) is currently processing a request. */
  isProcessingLLM: boolean;
}>();

/**
 * Emits for the VoiceInput component.
 */
const emit = defineEmits<{
  /** Emitted when a final transcription is ready to be sent. */
  (e: 'transcription-ready', value: string): void;
  /** Emitted when microphone permission status changes. */
  (e: 'permission-update', status: MicPermissionStatusType): void;
  /** Emitted when the STT handler's audio processing state changes. */
  (e: 'stt-processing-audio', isProcessing: boolean): void;
  /** Emitted when an error occurs within the voice input system. */
  (e: 'voice-input-error', errorPayload: SttHandlerErrorPayload): void;
}>();

// Injected services and stores
const toast = inject<ToastService>('toast');
const uiStore = useUiStore();

// Template Refs
const voiceInputPanelRef = ref<HTMLElement | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const visualizationCanvasRef = ref<HTMLCanvasElement | null>(null);

// Settings and Modes
const settings = computed<VoiceApplicationSettings>(() => voiceSettingsManager.settings);
const currentAudioMode = computed<AudioInputMode>(() => settings.value.audioInputMode);

// Microphone and Permissions
const micPermissionStatus = ref<MicPermissionStatusType>(''); // Initialize as empty string

// Shared State initialization (must be after reactive refs it depends on are defined)
const sharedState = useVoiceInputState(
  currentAudioMode,
  computed(() => props.isProcessingLLM), // Pass as a ComputedRef
  micPermissionStatus // Pass the ref directly
);

// Microphone Manager
const microphoneManager: UseMicrophoneReturn = useMicrophone({
  settings,
  toast,
  onPermissionUpdateGlobally: (status: MicPermissionStatusType) => {
    micPermissionStatus.value = status;
    emit('permission-update', status);
  },
});

// Audio Feedback
const audioFeedback: AudioFeedbackInstance = useAudioFeedback({ volume: 0.6 }); // Default volume

// Transcription Display Logic
const transcriptionDisplay = useTranscriptionDisplay({ sharedState });

// STT Mode Manager
const modeManager: SttModeManagerInstance = useSttModeManager({
  audioMode: currentAudioMode,
  settings,
  sharedState,
  micPermissionStatus: micPermissionStatus, // Pass the ref
  isProcessingLLM: computed(() => props.isProcessingLLM),
  audioFeedback,
  transcriptionDisplay,
  emit: (event: string, ...args: any[]) => {
    if (event === 'transcription') {
      emit('transcription-ready', args[0] as string);
    } else if (event === 'error') {
      const errorPayload = args[0] as SttHandlerErrorPayload;
      toast?.add({ type: 'error', title: `Voice Error: ${errorPayload.type}`, message: errorPayload.message, duration: 5000 });
      emit('voice-input-error', errorPayload);
    }
  },
  toast,
});

// Visual Effects
const effectsOptions: UseVoiceInputEffectsOptions = {
  isProcessingAudio: sharedState.isProcessingAudio,
  isListeningForWakeWord: sharedState.isListeningForWakeWord,
  isProcessingLLM: computed(() => props.isProcessingLLM),
  audioMode: currentAudioMode,
};
const effects = useVoiceInputEffects(effectsOptions);

// Voice Visualization (type using ReturnType)
let voiceViz: ReturnType<typeof useVoiceVisualization> | null = null;

// Component State
const isWideScreen = ref(false);

// Computed Properties for UI logic
const isContinuousMode = computed<boolean>(() => currentAudioMode.value === 'continuous');
const isVoiceActivationMode = computed<boolean>(() => currentAudioMode.value === 'voice-activation');

const isInputEffectivelyDisabled = computed<boolean>(() =>
  props.isProcessingLLM || sharedState.isInputEffectivelyDisabled.value
);

const isVisualizationVisible = computed<boolean>(() =>
  settings.value.alwaysShowVoiceVisualization ||
  (modeManager.isActive.value && (isContinuousMode.value || isVoiceActivationMode.value))
);

const isProminentVizActive = computed<boolean>(() =>
  isContinuousMode.value && modeManager.isActive.value && !sharedState.textInput.value.trim()
);

const micButtonIcon = computed<VueComponent>(() => {
  if (micPermissionStatus.value === 'denied' || micPermissionStatus.value === 'error') return MicOffIconSolid;
  if (modeManager.isActive.value) {
    return currentAudioMode.value === 'push-to-talk' ? MicIconSolid : StopIconSolid;
  }
  if (isVoiceActivationMode.value && modeManager.activeHandlerApi.value?.isListeningForWakeWord.value) {
    return HearingIconSolid; // Icon for VAD listening for wake word
  }
  return MicIconOutline;
});

const micButtonDisabled = computed<boolean>(() => {
  if (micPermissionStatus.value === 'denied' || micPermissionStatus.value === 'error') return true;
  // If LLM is processing, generally disable mic interactions
  // Exception: VAD wake word listening should still be toggleable if it's currently off
  if (props.isProcessingLLM) {
    if (isVoiceActivationMode.value && modeManager.activeHandlerApi.value?.isListeningForWakeWord.value) {
      return false; // Allow stopping VAD wake listening even if LLM is busy
    }
    if (modeManager.isActive.value) { // If any mode is active (PTT, Cont, VAD command)
      return true; // Disable stopping it if LLM is busy (let it finish its current segment if any)
    }
    // If mode is not active and trying to start VAD wake listening
    if (isVoiceActivationMode.value && !modeManager.isActive.value && !modeManager.activeHandlerApi.value?.isListeningForWakeWord.value) {
      return false; // Allow starting VAD wake word listening
    }
    return true; // Otherwise, LLM processing blocks new STT actions
  }
  // If not LLM processing, disable based on mode's ability to start or if it's not active to be stopped
  return !modeManager.canStart.value && !modeManager.isActive.value;
});

const micButtonLabel = computed<string>(() => {
  if (micPermissionStatus.value === 'denied' || micPermissionStatus.value === 'error') return "Microphone unavailable";
  if (modeManager.isActive.value) {
    return currentAudioMode.value === 'push-to-talk' ? 'Release to Send Transcript' : 'Stop Listening';
  }
  if (isVoiceActivationMode.value && modeManager.activeHandlerApi.value?.isListeningForWakeWord.value) {
    const wakeWords = settings.value.vadWakeWordsBrowserSTT || [];
    const displayWakeWord = wakeWords.length > 0 ? wakeWords[0] : 'wake word';
    return `Listening for "${displayWakeWord}"`;
  }
  return currentAudioMode.value === 'push-to-talk' ? 'Hold to Talk' : 'Start Listening';
});

const modeIndicatorClass = computed<string>(() => {
  let baseClass = 'vi-mode-' + currentAudioMode.value.replace(/-/g, '');
  if (modeManager.isActive.value) baseClass += ' vi-mode-active';
  if (isVoiceActivationMode.value && modeManager.activeHandlerApi.value?.isListeningForWakeWord.value) {
    baseClass += ' vi-mode-vad-wake';
  }
  return baseClass;
});

const audioModeOptions = computed<AudioModeOption[]>(() => [
  { label: 'Push-to-Talk', value: 'push-to-talk', description: 'Hold mic to speak, release to send.' },
  { label: 'Continuous', value: 'continuous', description: 'Listens continuously until stopped.' },
  { label: 'Voice Activate', value: 'voice-activation', description: 'Listens after detecting a wake word.' },
]);

const sttEngineOptions = computed<SttEngineOption[]>(() => [
  { label: 'Browser STT', value: 'browser_webspeech_api', description: 'Uses your browser\'s built-in speech recognition.' },
  { label: 'Whisper API', value: 'whisper_api', description: 'Uses a remote Whisper API for transcription.' },
]);

// --- Methods ---
/** Handles text submission from the textarea. */
function handleTextSubmit(): void {
  const textToSubmit = sharedState.textInput.value.trim();
  if (!textToSubmit || props.isProcessingLLM || isInputEffectivelyDisabled.value) return;

  emit('transcription-ready', textToSubmit);
  sharedState.textInput.value = '';
  if (textareaRef.value) { // Auto-resize textarea after submit
    textareaRef.value.style.height = 'auto';
  }
  transcriptionDisplay.clearTranscription(); // Clear any interim STT feedback
}

/** Handles microphone button clicks, delegating to the SttModeManager. */
async function handleMicButtonClick(): Promise<void> {
  const hasPermission = await microphoneManager.ensureMicrophoneAccessAndStream();
  if (!hasPermission) {
    toast?.add({ type: 'error', title: 'Microphone Access', message: microphoneManager.permissionMessage.value || 'Microphone access is required.', duration: 5000});
    return;
  }
  // If AudioContext was suspended, ensureMicrophoneAccessAndStream might try to resume it.
  // Give a brief moment for this.
  if (microphoneManager.audioContext.value?.state === 'suspended') {
    await microphoneManager.audioContext.value.resume().catch(console.warn);
  }
  modeManager.handleMicButtonClick();
}

/** Adjusts textarea height dynamically based on content. */
function handleTextareaInput(event: Event): void {
  const target = event.target as HTMLTextAreaElement;
  // sharedState.textInput.value is already updated by v-model
  target.style.height = 'auto'; // Reset height to shrink if text is deleted
  target.style.height = `${Math.min(target.scrollHeight, 120)}px`; // Max height 120px
}

/** Inserts a newline character in the textarea (Shift+Enter). */
function insertNewline(): void {
  if (textareaRef.value) {
    const { selectionStart, selectionEnd, value } = textareaRef.value;
    const newValue = value.substring(0, selectionStart) + '\n' + value.substring(selectionEnd);
    sharedState.textInput.value = newValue; // Update v-model
    nextTick(() => { // Ensure DOM updates before setting cursor and resizing
      if(textareaRef.value) {
        textareaRef.value.selectionStart = textareaRef.value.selectionEnd = selectionStart + 1;
        handleTextareaInput({ target: textareaRef.value } as unknown as Event); // Trigger resize
      }
    });
  }
}

function toggleInputToolbar(): void {
  sharedState.showInputToolbar.value = !sharedState.showInputToolbar.value;
}

function closeInputToolbar(): void {
  sharedState.showInputToolbar.value = false;
}

function handleFileUpload(payload: { type: 'text' | 'pdf' | 'image'; file: File }): void {
  // Placeholder for file upload logic
  toast?.add({ type: 'info', title: 'File Selected', message: `${payload.file.name} (${payload.type}) selected. Upload logic pending.` });
  sharedState.showInputToolbar.value = false; // Close toolbar after selection
}

async function handleSttEngineChange(engine: SttEngineType): Promise<void> {
  await voiceSettingsManager.updateSetting('sttPreference', engine);
  toast?.add({ type: 'success', title: 'STT Engine Updated', message: `Switched to ${engine.replace(/_/g, ' ')}.` });
}

async function handleToggleLiveTranscriptionSetting(enabled: boolean): Promise<void> {
  await voiceSettingsManager.updateSetting('showLiveTranscription', enabled);
  toast?.add({ type: 'info', title: 'Live Transcription', message: enabled ? 'Enabled' : 'Disabled' });
}

async function handleAudioModeChange(mode: AudioInputMode): Promise<void> {
  await voiceSettingsManager.updateSetting('audioInputMode', mode);
  // SttModeManager will watch currentAudioMode and switch automatically
}

// STT Handler API Management
const browserSpeechHandlerApi = shallowRef<SttHandlerInstance | null>(null);
const whisperSpeechHandlerApi = shallowRef<SttHandlerInstance | null>(null);

function onBrowserHandlerReady(api: SttHandlerInstance): void {
  browserSpeechHandlerApi.value = api;
  modeManager.registerHandler('browser_webspeech_api', api);
}
function onBrowserHandlerUnmounted(): void {
  if (browserSpeechHandlerApi.value) {
    modeManager.unregisterHandler('browser_webspeech_api');
  }
  browserSpeechHandlerApi.value = null;
}

function onWhisperHandlerReady(api: SttHandlerInstance): void {
  whisperSpeechHandlerApi.value = api;
  modeManager.registerHandler('whisper_api', api);
}
function onWhisperHandlerUnmounted(): void {
  if (whisperSpeechHandlerApi.value) {
    modeManager.unregisterHandler('whisper_api');
  }
  whisperSpeechHandlerApi.value = null;
}

/** Forwards transcription events from STT handlers to the SttModeManager. */
function onTranscriptionHandlerEvent(data: TranscriptionData): void {
  // Prevent processing STT results if LLM is busy and it's not a VAD command capture scenario
  if (props.isProcessingLLM && !(currentAudioMode.value === 'voice-activation' && modeManager.isActive.value && !modeManager.activeHandlerApi.value?.isListeningForWakeWord.value)) {
    if (data.text) effects.addIgnoredText(data.text); // Show visual feedback for ignored text
    console.log('[VoiceInput] Transcription ignored, LLM is busy:', data.text);
    return;
  }
  modeManager.handleTranscriptionFromHandler(data.text, data.isFinal);
}

/** Forwards error events from STT handlers to the SttModeManager. */
function onErrorHandlerEvent(errorPayload: SttHandlerErrorPayload): void {
  // SttModeManager will handle displaying toasts or emitting further.
  modeManager.handleErrorFromHandler(errorPayload);
  emit('stt-processing-audio', false); // Ensure processing audio flag is reset on error
}

// Watcher to update active STT handler in ModeManager when settings change
watch(() => settings.value.sttPreference, (newEnginePref) => {
  if (newEnginePref === 'browser_webspeech_api' && browserSpeechHandlerApi.value) {
    modeManager.activeHandlerApi.value = browserSpeechHandlerApi.value;
  } else if (newEnginePref === 'whisper_api' && whisperSpeechHandlerApi.value) {
    modeManager.activeHandlerApi.value = whisperSpeechHandlerApi.value;
  } else {
    modeManager.activeHandlerApi.value = null; // If preferred handler not ready or unknown
  }
}, { immediate: true });


// Lifecycle Hooks
onMounted(async () => {
  sharedState.isComponentMounted.value = true;
  await voiceSettingsManager.initialize(); // Load settings
  await audioFeedback.loadSounds();
  await microphoneManager.checkCurrentPermission(); // Initial permission check

  if (typeof window !== 'undefined') {
    isWideScreen.value = window.innerWidth > 1024;
    window.addEventListener('resize', () => {
      isWideScreen.value = window.innerWidth > 1024;
    });
  }

  // Setup voice visualization
  watch(microphoneManager.activeStream, (newStream) => {
    if (newStream && visualizationCanvasRef.value) {
      if (!voiceViz) {
        voiceViz = useVoiceVisualization(
          microphoneManager.activeStream, // Ref<MediaStream | null>
          visualizationCanvasRef,         // Ref<HTMLCanvasElement | null>
          { // Example configuration for visualization
            visualizationType: 'waveform',
            // color: 'hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l))',
            lineWidth: 2,
            globalVizAlpha: 0.7,
          }
        );
      }
      if (voiceViz && !voiceViz.isVisualizing.value && isVisualizationVisible.value) {
        voiceViz.startVisualization();
      }
    } else if (voiceViz?.isVisualizing.value) {
      voiceViz.stopVisualization();
      // voiceViz = null; // Don't nullify, just stop, so it can be restarted if stream comes back
    }
  }, { immediate: true });

  watch(isVisualizationVisible, (visible) => {
    if(voiceViz) {
      if(visible && microphoneManager.activeStream.value && !voiceViz.isVisualizing.value) {
        voiceViz.startVisualization();
      } else if (!visible && voiceViz.isVisualizing.value) {
        voiceViz.stopVisualization();
      }
    }
  });
});

onBeforeUnmount(async () => {
  sharedState.isComponentMounted.value = false;
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', () => { isWideScreen.value = window.innerWidth > 1024; });
  }
  await modeManager.cleanup();
  audioFeedback.cleanup();
  microphoneManager.releaseAllMicrophoneResources();
  voiceViz?.stopVisualization(); // Ensure visualization is stopped
  resetVoiceInputState(); // Crucial for clean state if component remounts
});

</script>

<style lang="scss">
// Assuming styles are in a separate file or defined globally as per earlier setup.
// This <style> block can be used for component-specific overrides if needed.
// For this exercise, using the previously provided SCSS from voice-input-panel-ephemeral.scss
// which would typically be imported or be part of a global style structure.

// Visually hidden class for accessibility
.vi-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

// Basic layout classes (can be expanded in the main SCSS file)
.voice-input-panel {
  display: flex;
  flex-direction: column;
  padding: 12px 15px;
  background-color: var(--vt-c-bg); /* Example variable */
  border: 1px solid var(--vt-c-divider-light-2); /* Example variable */
  border-radius: 16px;
  box-shadow: var(--vt-shadow-2); /* Example variable */
  position: relative;
  gap: 10px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  overflow: hidden; // For background effects clipping

  &.vi-widescreen {
    margin-left: auto;
    margin-right: auto;
    max-width: 768px; // Example max width
  }
}

.vi-background-effects-svg {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: visible; /* Or clip as needed */
}

.vi-dynamic-background {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: -1; /* Behind content, above svg if needed or vice-versa */
  pointer-events: none;
  transition: background 0.5s ease-out;
}

.vi-controls-area {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative; /* For z-indexing within panel */
  z-index: 2; /* Above background effects */
}

.vi-mic-button {
  background-color: var(--vt-c-indigo-soft); /* Example variable */
  color: var(--vt-c-indigo-darker); /* Example variable */
  border: none;
  border-radius: 50%;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.64, -0.58, 0.34, 1.56); /* Example spring physics */
  outline: none;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);

  &:hover:not(:disabled) {
    background-color: var(--vt-c-indigo); /* Example variable */
    color: var(--vt-c-white); /* Example variable */
    transform: scale(1.05);
    box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3); /* Example shadow */
  }
  &:active:not(:disabled) {
    transform: scale(0.95);
    background-color: var(--vt-c-indigo-dark); /* Example variable */
  }
  &:disabled {
    background-color: var(--vt-c-gray-soft); /* Example variable */
    color: var(--vt-c-text-3); /* Example variable */
    cursor: not-allowed;
    box-shadow: none;
  }
  &.vi-mic-active {
    background-color: var(--vt-c-red-soft); /* Example variable */
    color: var(--vt-c-red-darker); /* Example variable */
    &:hover:not(:disabled) {
      background-color: var(--vt-c-red); /* Example variable */
      color: var(--vt-c-white); /* Example variable */
      box-shadow: 0 4px 10px rgba(220, 38, 38, 0.3); /* Example shadow */
    }
  }
  &.vi-mic-vad-listening {
    background-color: var(--vt-c-green-soft); /* Example variable */
    color: var(--vt-c-green-darker); /* Example variable */
    animation: vad-listening-pulse-border 1.5s infinite ease-in-out; /* From motion language */
  }
  .icon-md { width: 26px; height: 26px; }
}

@keyframes vad-listening-pulse-border { /* Example animation */
  0% { box-shadow: 0 0 0 0px hsla(145, 63%, 42%, 0.5); } /* Example color */
  50% { box-shadow: 0 0 0 6px hsla(145, 63%, 42%, 0); }
  100% { box-shadow: 0 0 0 0px hsla(145, 63%, 42%, 0.5); }
}


.vi-audio-mode-dropdown {
  z-index: 10; /* Ensure dropdown is above other elements */
}

.vi-status-indicator-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Prevent overflow in flex container */
}

.vi-status-indicator {
  flex-grow: 1;
  display: flex;
  align-items: center;
  padding: 6px 10px;
  background-color: var(--vt-c-bg-mute); /* Example variable */
  border-radius: 8px;
  font-size: 0.875em;
  color: var(--vt-c-text-2); /* Example variable */
  transition: background-color 0.3s ease, color 0.3s ease;
  min-height: 38px;
  overflow: hidden;

  .vi-status-text {
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &.vi-mode-active { background-color: var(--vt-c-blue-mute); color: var(--vt-c-blue-dark); } /* Example variables */
  &.vi-mode-vad-wake { background-color: var(--vt-c-yellow-mute); color: var(--vt-c-yellow-darker); } /* Example variables */
}

.vi-recording-status-html {
  font-size: 0.8em;
  margin-top: 4px;
  padding: 0 10px;
  color: var(--vt-c-text-2); /* Example variable */
  height: 1.2em; /* Ensure space for one line */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  .interim-transcript-feedback { color: var(--vt-c-text-1); } /* Example variable */
  .listening-feedback { color: var(--vt-c-blue); } /* Example variable */
  .error-feedback { color: var(--vt-c-red); font-weight: bold; } /* Example variable */
  .ignored-transcript-feedback { color: var(--vt-c-text-3); font-style: italic; } /* Example variable */
  .transcription-sent-feedback { color: var(--vt-c-green-dark); } /* Example variable */
}

.vi-toolbar-area {
  position: relative; /* For absolute positioning of InputToolbar */
  display: flex;
  justify-content: flex-end; /* Align toggle button to the right */
}

.vi-toolbar-toggle-button {
  background: none;
  border: none;
  color: var(--vt-c-text-2); /* Example variable */
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: color 0.2s, background-color 0.2s;
  z-index: 110; /* Above toolbar if it overlaps */

  &:hover {
    background-color: var(--vt-c-bg-mute); /* Example variable */
    color: var(--vt-c-text-1); /* Example variable */
  }
  .icon-sm { width:20px; height:20px; }
}

.vi-input-toolbar {
  position: absolute;
  bottom: calc(100% + 5px); /* Position above the toggle button/area */
  right: 0;
  z-index: 100;
  border-radius: 12px;
  box-shadow: var(--vt-shadow-3); /* Example variable */
}

.toolbar-transition-enter-active,
.toolbar-transition-leave-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.64, -0.58, 0.34, 1.56); /* Spring physics */
}

.toolbar-transition-enter-from,
.toolbar-transition-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

.vi-input-area {
  display: flex;
  align-items: flex-end; /* Align items to bottom (send button, textarea) */
  gap: 10px;
  padding: 6px 8px 6px 12px;
  background-color: var(--vt-c-bg-soft); /* Example variable */
  border: 1px solid var(--vt-c-divider-light-1); /* Example variable */
  border-radius: 12px;
  min-height: 52px; /* Consistent height */
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  position: relative; /* For z-indexing within panel */
  z-index: 1;

  &:focus-within {
    border-color: var(--vt-c-indigo); /* Example variable */
    box-shadow: 0 0 0 3px hsla(220, 60%, 50%, 0.2); /* Example focus ring */
  }

  &.vi-input-disabled {
    background-color: var(--vt-c-bg-mute); /* Example variable */
    textarea::placeholder {
      color: var(--vt-c-text-3); /* Example variable */
    }
  }

  /* Class for when prominent visualization takes over */
  &.vi-input-area-prominent-viz {
    padding: 0;
    border-color: transparent;
    background-color: transparent;
    box-shadow: none;
  }
}

.vi-textarea {
  flex-grow: 1;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  font-family: inherit;
  font-size: 1rem;
  color: var(--vt-c-text-1); /* Example variable */
  line-height: 1.6;
  padding: 8px 0; /* Adjust padding for baseline alignment */
  max-height: 120px; /* Limit expansion */
  overflow-y: auto; /* Scroll if content exceeds max-height */

  &::placeholder {
    color: var(--vt-c-text-3); /* Example variable */
    transition: color 0.3s ease;
  }
  &:disabled {
    color: var(--vt-c-text-3); /* Example variable */
    cursor: not-allowed;
  }
}

.vi-send-button {
  background-color: var(--vt-c-indigo); /* Example variable */
  color: var(--vt-c-white); /* Example variable */
  border: none;
  border-radius: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0; /* Prevent shrinking */
  margin-bottom: 1px; /* Align with textarea baseline */

  &:hover:not(:disabled) {
    background-color: var(--vt-c-indigo-dark); /* Example variable */
    transform: translateY(-1px); /* Subtle lift */
    box-shadow: 0 2px 4px rgba(79, 70, 229, 0.3); /* Example shadow */
  }
  &:disabled {
    background-color: var(--vt-c-gray-light-3); /* Example variable */
    color: var(--vt-c-text-3); /* Example variable */
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  .icon-sm { width: 20px; height: 20px; }
}

.vi-visualization-canvas {
  width: 100%;
  height: 50px; /* Default height, can be overridden by .vi-visualization-prominent */
  border-radius: 8px; /* Match input area rounding */
  transition: height 0.3s ease-out-quad;

  &.vi-visualization-prominent {
    height: 100%; /* Take full height of .vi-input-area when prominent */
    min-height: 50px; /* Ensure it doesn't collapse too small */
  }
}

/* Panel state classes from useVoiceInputEffects (example) */
/* These should match the SCSS provided in the initial prompt for dynamic effects */
.voice-input-panel.state-llm-processing {
  /* Styles for LLM processing state, e.g., border glow */
  border-color: hsla(var(--vt-c-indigo-h, 240), var(--vt-c-indigo-s, 60%), var(--vt-c-indigo-l, 70%), 0.5);
}
.voice-input-panel.state-stt-active .vi-input-area {
  /* Styles for STT active state, e.g., input area border */
  border-color: hsla(var(--vt-c-green-h, 145), var(--vt-c-green-s, 60%), var(--vt-c-green-l, 45%), 0.6);
}
.voice-input-panel.state-vad-listening .vi-input-area {
  /* Styles for VAD listening state */
  border-color: hsla(var(--vt-c-yellow-h, 45), var(--vt-c-yellow-s, 100%), var(--vt-c-yellow-l, 50%), 0.6);
}

</style>
