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

<style lang="scss">// Visually hidden class for accessibility
.vi-sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.voice-input-panel {
  display: flex;
  flex-direction: column;
  padding: 1rem 1.25rem; // Slightly more padding
  background-color: var(--vt-c-bg-soft); // Neomorphism often uses lighter backgrounds
  border-radius: 20px; // Softer radius for neomorphism
  position: relative;
  gap: 0.75rem;
  // Neomorphic shadows: one light top-left, one dark bottom-right
  box-shadow: 
    -6px -6px 12px var(--vt-c-bg-mute), // Lighter shadow (adjust color for theme)
    6px 6px 12px var(--vt-c-shadow-3);   // Darker shadow (adjust color for theme)
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  // overflow: visible; // IMPORTANT for InputToolbar to pop out.
                       // If background effects require clipping, toolbar needs portalling or different positioning.

  &.vi-widescreen {
    margin-left: auto;
    margin-right: auto;
    max-width: 768px;
  }

  // Depressed neomorphic look when active/focused
  &.state-stt-active,
  &:focus-within { // General focus on the panel
    background-color: var(--vt-c-bg); // Slightly darker
    box-shadow: 
      inset -3px -3px 7px var(--vt-c-bg-mute),
      inset 3px 3px 7px var(--vt-c-shadow-3);
  }
}

.vi-background-effects-svg, .vi-dynamic-background {
  // Styles remain as before, ensure they don't conflict with overflow:visible if toolbar needs it
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  z-index: 0; pointer-events: none;
  border-radius: inherit; // Clip to panel's border radius
}
.vi-dynamic-background { z-index: -1; transition: background 0.5s ease-out; }


.vi-controls-area {
  display: flex;
  align-items: center;
  gap: 0.75rem; // Consistent gap
  position: relative;
  z-index: 2;
}

.vi-mic-button {
  flex-shrink: 0;
  width: 56px; // Slightly larger
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative; // For pseudo-elements (auras)
  outline: none;
  border: none; // Remove default border for neomorphism
  background-color: var(--vt-c-bg-soft); // Match panel bg
  color: var(--vt-c-indigo); // Icon color
  box-shadow: 
    -4px -4px 8px var(--vt-c-bg-mute),
    4px 4px 8px var(--vt-c-shadow-2);
  transition: all 0.2s cubic-bezier(0.64, -0.58, 0.34, 1.56); // Springy

  &::before, &::after { // For radial effects
    content: '';
    position: absolute;
    left: 0; top: 0;
    width: 100%; height: 100%;
    border-radius: 50%;
    transition: all 0.4s var(--ease-out-expo); // Use a defined easing
    pointer-events: none;
  }

  // Example idle aura
  &::before { 
    box-shadow: 0 0 0 0px hsla(var(--vt-c-indigo-h), var(--vt-c-indigo-s), var(--vt-c-indigo-l), 0.3);
    opacity: 0.5;
  }
  &:hover:not(:disabled)::before {
    transform: scale(1.2);
    opacity: 0; // Fade out on hover as main shadow takes over
  }

  &:hover:not(:disabled) {
    color: var(--vt-c-indigo-dark);
    box-shadow: 
      -5px -5px 10px var(--vt-c-bg-mute),
      5px 5px 10px var(--vt-c-shadow-3);
    transform: translateY(-1px);
  }

  // Active/Recording state - "pressed in" neomorphic look
  &.vi-mic-active,
  &:active:not(:disabled) {
    box-shadow: 
      inset -3px -3px 6px var(--vt-c-bg-mute),
      inset 3px 3px 6px var(--vt-c-shadow-2);
    color: var(--vt-c-red); // Active color
    transform: translateY(1px);
    &::before { // Active aura
      animation: micPulsingAuraActive 1.5s infinite ease-out;
      box-shadow: 0 0 10px 5px hsla(var(--vt-c-red-h), var(--vt-c-red-s), var(--vt-c-red-l), 0.4);
      opacity: 1;
      transform: scale(1.1);
    }
  }
  
  &.vi-mic-vad-listening { // VAD listening for wake word
    color: var(--vt-c-green); // VAD color
    &::before {
      animation: micPulsingAuraVad 2s infinite ease-in-out;
      box-shadow: 0 0 12px 4px hsla(var(--vt-c-green-h), var(--vt-c-green-s), var(--vt-c-green-l), 0.35);
      opacity: 1;
      transform: scale(1.05);
    }
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    box-shadow: 
      -2px -2px 4px var(--vt-c-bg-mute),
      2px 2px 4px var(--vt-c-shadow-1); // Flatter disabled look
    color: var(--vt-c-text-3);
  }

  .icon-md { width: 28px; height: 28px; } // Slightly larger icon
}

@keyframes micPulsingAuraActive {
  0% { transform: scale(1); opacity: 0.5; box-shadow: 0 0 8px 3px hsla(var(--vt-c-red-h), var(--vt-c-red-s), var(--vt-c-red-l), 0.3); }
  50% { transform: scale(1.15); opacity: 0.7; box-shadow: 0 0 14px 7px hsla(var(--vt-c-red-h), var(--vt-c-red-s), var(--vt-c-red-l), 0.5); }
  100% { transform: scale(1); opacity: 0.5; box-shadow: 0 0 8px 3px hsla(var(--vt-c-red-h), var(--vt-c-red-s), var(--vt-c-red-l), 0.3); }
}
@keyframes micPulsingAuraVad {
  0% { transform: scale(1); opacity: 0.4; box-shadow: 0 0 7px 2px hsla(var(--vt-c-green-h), var(--vt-c-green-s), var(--vt-c-green-l), 0.25); }
  50% { transform: scale(1.1); opacity: 0.6; box-shadow: 0 0 12px 5px hsla(var(--vt-c-green-h), var(--vt-c-green-s), var(--vt-c-green-l), 0.4); }
  100% { transform: scale(1); opacity: 0.4; box-shadow: 0 0 7px 2px hsla(var(--vt-c-green-h), var(--vt-c-green-s), var(--vt-c-green-l), 0.25); }
}


.vi-status-indicator-wrapper { /* Styles as before, or refine for neomorphism */ }
.vi-status-indicator { /* Styles as before */ }
.vi-recording-status-html { /* Styles as before */
  .mode-hint-feedback {
    color: var(--vt-c-text-2); // Subtler color for hints
    font-style: italic;
  }
}

.vi-toolbar-area {
  position: relative; 
  display: flex;
  justify-content: flex-end;
  z-index: 100; // Toolbar area itself needs z-index if panel has overflow:visible
}
.vi-toolbar-toggle-button { /* Styles as before */ }

.vi-input-toolbar { // The actual toolbar component that expands
  position: absolute;
  bottom: calc(100% + 8px); // Position above the toggle button/area
  right: 0;
  z-index: 1050; // High z-index to ensure visibility
  // Add neomorphic styling to the toolbar itself if desired
  background-color: var(--vt-c-bg-soft);
  border-radius: 12px;
  padding: 0.5rem;
  box-shadow: 
    -5px -5px 10px var(--vt-c-bg-mute),
    5px 5px 10px var(--vt-c-shadow-2);
}

.vi-input-area {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: var(--vt-c-bg); // Inner area, can be slightly different
  border-radius: 12px;
  min-height: 52px;
  position: relative;
  z-index: 1;
  // "Pressed in" neomorphic effect for input area
  box-shadow: 
    inset -2px -2px 5px var(--vt-c-bg-mute),
    inset 2px 2px 5px var(--vt-c-shadow-1);
  transition: box-shadow 0.3s ease;

  &:focus-within {
    // Stronger inset shadow or an outer glow for focus
    box-shadow: 
      inset -3px -3px 7px var(--vt-c-bg-mute),
      inset 3px 3px 7px var(--vt-c-shadow-2),
      0 0 0 2px var(--vt-c-indigo-alpha-focus); // Subtle outer focus ring
  }
  &.vi-input-disabled { /* Styles as before */ }
}

.vi-textarea {
  flex-grow: 1; // Ensures it takes full width
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  font-family: inherit;
  font-size: 1rem;
  color: var(--vt-c-text-1);
  line-height: 1.6;
  padding: 0.5rem 0.25rem; // Minimal padding inside
  max-height: 120px;
  overflow-y: auto;

  &::placeholder { /* Styles as before */ }
  &:disabled { /* Styles as before */ }

  // Shimmer/highlight effect on focus (can be expanded with JS for "on type")
  &:focus {
    // Example: A subtle changing gradient or animated border if desired
    // For a simple highlight, the parent :focus-within is often enough.
    // If a text shimmer is needed *as characters appear*, that's more JS heavy.
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
