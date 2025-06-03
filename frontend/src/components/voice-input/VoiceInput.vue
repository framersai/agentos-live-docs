// File: frontend/src/components/voice-input/VoiceInput.vue
// Version 1.2.0 - Corrected VoiceVisualizationConfig usage, removed unused variables.
/**
 * @file VoiceInput.vue
 * @description Main UI component for voice and text input.
 * Orchestrates STT handlers, voice visualization, and UI effects.
 *
 * @component VoiceInput
 * @props {boolean} isProcessing - True if the main application/LLM is processing a response.
 * @props {string} [inputPlaceholder] - Optional placeholder text for the textarea.
 *
 * @emits transcription - Emits finalized transcriptions.
 * @emits permission-update - Emits microphone permission status changes.
 * @emits processing-audio - Emits true if STT is actively processing audio, false otherwise.
 */
<template>
  <div
    class="voice-input-wrapper"
    :class="effects.panelStateClass.value"
    :style="effects.cssVariables.value"
  >
    <svg class="geometric-pattern-bg" aria-hidden="true">
      <defs>
        <filter id="voice-input-blur-filter"> <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        </filter>
      </defs>
      <g filter="url(#voice-input-blur-filter)">
        <path
          v-for="pattern in effects.geometricPatternSvg.value"
          :key="pattern.id"
          :d="pattern.path"
          fill="none"
          stroke="currentColor"
          :stroke-opacity="pattern.opacity"
          stroke-width="1"
          class="pattern-stroke"
        />
      </g>
    </svg>

    <div
      class="dynamic-gradient-bg"
      :style="{ background: effects.backgroundGradient.value }"
    ></div>

    <div class="ignored-text-container" aria-hidden="true">
      <div
        v-for="element in effects.ignoredTextElements.value"
        :key="element.id"
        class="ignored-text"
        :style="{
          opacity: element.opacity,
          transform: `translateY(-${element.y}px)`,
        }"
      >
        {{ element.text }}
      </div>
    </div>

    <canvas
      ref="visualizationCanvasRef"
      class="voice-visualization-canvas"
      :class="{ prominent: isProminentVizActive }"
    ></canvas>

    <div class="input-area">
      <textarea
        ref="textareaRef"
        v-model="textInput"
        @input="handleTextareaInput"
        @keyup.enter.exact.prevent="handleTextSubmit"
        @keyup.enter.shift.exact.prevent="insertNewline"
        class="voice-textarea"
        :placeholder="placeholderText"
        :disabled="isInputDisabled"
        rows="1"
      ></textarea>

      <button
        @click="handleTextSubmit"
        :disabled="!textInput.trim() || sttManager.isProcessingAudio.value || props.isProcessing"
        class="send-button"
        aria-label="Send message"
        title="Send message (Enter)"
      >
        <PaperAirplaneIcon class="icon" />
      </button>
    </div>

    <div class="controls-row">
      <button
        @click="handleMicButton"
        class="mic-button"
        :class="{
          listening: isPttMode && sttManager.isProcessingAudio.value,
          error: micPermissionStatus === 'denied' || micPermissionStatus === 'error',
          vad_listening: isVoiceActivationMode && sttManager.isListeningForWakeWord.value,
        }"
        :disabled="micButtonDisabled"
        :aria-label="micButtonLabel"
        :title="micButtonLabel"
      >
        <MicrophoneIcon class="icon" />
      </button>

      <div class="status-display">
        <div class="mode-indicator">
          <span class="mode-dot" :class="modeIndicatorClass"></span>
          <span class="mode-text">{{ statusText }}</span>
        </div>
        <div class="recording-status" v-html="currentRecordingStatusText"></div>
      </div>

      <AudioModeDropdown
        :current-mode="currentAudioMode"
        :options="audioModeOptions"
        :disabled="props.isProcessing || sttManager.isProcessingAudio.value"
        @select="selectAudioMode"
      />

      <div class="secondary-controls">
        <button
          @click="showInputToolbar = !showInputToolbar"
          class="control-btn"
          title="Input options"
          aria-label="Toggle input options toolbar"
          :aria-expanded="showInputToolbar"
        >
          <PlusIcon class="icon-sm" />
        </button>

        <button
          v-if="false" @click="showTranscriptionHistory = !showTranscriptionHistory"
          class="control-btn"
          title="Show transcription history"
          aria-label="Toggle transcription history"
        >
          <ClockIcon class="icon-sm" />
        </button>
      </div>
    </div>

    <Transition name="toolbar-slide">
      <InputToolbar
        v-if="showInputToolbar"
        @close="showInputToolbar = false"
        @file-upload="handleFileUpload"
        @stt-engine-change="handleSttEngineChange"
      />
    </Transition>

    <BrowserSpeechHandler
      v-if="sttPreference === 'browser_webspeech_api'"
      :settings="settings"
      :audio-input-mode="currentAudioMode"
      :parent-is-processing-l-l-m="props.isProcessing"
      :current-mic-permission="micPermissionStatus"
      @handler-api-ready="(api: any) => sttManager.registerHandler('browser', api)"
      @unmounted="() => sttManager.unregisterHandler('browser')"
      @transcription="onTranscriptionFromHandler"
      @processing-audio="onProcessingAudioFromHandler"
      @is-listening-for-wake-word="onListeningForWakeWordFromHandler"
      @wake-word-detected="onWakeWordDetectedFromHandler"
      @error="onSttErrorFromHandler"
    />

    <WhisperSpeechHandler
      v-if="sttPreference === 'whisper_api'"
      :settings="settings"
      :audio-input-mode="currentAudioMode"
      :active-stream="activeStream"
      :analyser="analyser"
      :parent-is-processing-l-l-m="props.isProcessing"
      :initial-permission-status="micPermissionStatus"
      @handler-api-ready="(api: any) => sttManager.registerHandler('whisper', api)"
      @unmounted="() => sttManager.unregisterHandler('whisper')"
      @transcription="onTranscriptionFromHandler"
      @processing-audio="onProcessingAudioFromHandler"
      @error="onSttErrorFromHandler"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, inject, nextTick } from 'vue'; // Removed unused 'watch' and 'StyleValue'
import { voiceSettingsManager, type VoiceApplicationSettings, type AudioInputMode, type STTPreference } from '@/services/voice.settings.service';
import type { ToastService } from '@/services/services';
import { useMicrophone } from '@/components/voice-input/composables/useMicrophone'; // Corrected path
import { useVoiceVisualization, type VoiceVisualizationConfig } from '@/composables/useVoiceVisualization'; // Corrected path
import { useSttHandlerManager } from './composables/useSttHandlerManager';
import { useVoiceInputEffects } from './composables/useVoiceInputEffects';

import BrowserSpeechHandler from './handlers/BrowserSpeechHandler.vue';
import WhisperSpeechHandler from './handlers/WhisperSpeechHandler.vue';
import AudioModeDropdown from './components/AudioModeDropdown.vue'; // Assuming path is components/AudioModeDropdown.vue
import InputToolbar from './components/InputToolbar.vue'; // Assuming path is components/InputToolbar.vue

import { watch } from 'vue'; // Corrected import, removed unused 'StyleValue'
// import styles from ./styles/voice-input.scss
import './styles/voice-input.scss'; // Assuming styles are in a separate SCSS file


import {
  MicrophoneIcon,
  PaperAirplaneIcon,
  ClockIcon,
  PlusIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps<{
  /** True if the main application/LLM is processing a response. */
  isProcessing: boolean;
  /** Optional placeholder text for the textarea. */
  inputPlaceholder?: string;
}>();

const emit = defineEmits<{
  /** Emitted when a finalized transcription is available. */
  (e: 'transcription', value: string): void;
  /** Emitted when microphone permission status changes. */
  (e: 'permission-update', status: 'granted' | 'denied' | 'prompt' | 'error'): void;
  /** Emitted when the STT handler's audio processing state changes. */
  (e: 'processing-audio', isProcessingAudio: boolean): void;
}>();

const toast = inject<ToastService>('toast');

// --- Refs ---
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const visualizationCanvasRef = ref<HTMLCanvasElement | null>(null);
const textInput = ref('');
const showTranscriptionHistory = ref(false);
const showInputToolbar = ref(false);

// --- Settings & Modes ---
const settings = computed<VoiceApplicationSettings>(() => voiceSettingsManager.settings);
const sttPreference = computed<STTPreference>(() => settings.value.sttPreference);
const currentAudioMode = computed<AudioInputMode>(() => settings.value.audioInputMode);
const isPttMode = computed<boolean>(() => currentAudioMode.value === 'push-to-talk');
const isContinuousMode = computed<boolean>(() => currentAudioMode.value === 'continuous');
const isVoiceActivationMode = computed<boolean>(() => currentAudioMode.value === 'voice-activation');

// --- Microphone Management ---
const {
  activeStream,
  analyser,
  permissionStatus: micPermissionStatus,
  // micPermissionMessage, // Removed as it caused 'unused' error in previous checks
  ensureMicrophoneAccessAndStream,
  releaseAllMicrophoneResources,
} = useMicrophone({
  settings: settings,
  toast,
  onPermissionUpdateGlobally: (status) => emit('permission-update', status),
});

// --- STT Handler Manager ---
const sttManager = useSttHandlerManager(
  {
    settings: settings,
    toast,
    isProcessingLLM: computed(() => props.isProcessing),
    currentMicPermission: micPermissionStatus,
  },
  { // Event handlers from manager to VoiceInput
    onTranscription: () => { /* Handled by onTranscriptionFromHandler */ },
    onProcessingAudio: (isProcessing: boolean) => { emit('processing-audio', isProcessing); },
    onListeningForWakeWord: () => { /* UI reacts to sttManager.isListeningForWakeWord */ },
    onWakeWordDetected: () => { /* Handled by onWakeWordDetectedFromHandler */ },
    onError: () => { /* Handled by onSttErrorFromHandler */ },
    onReady: () => { /* Optionally handle STT handler ready event */ },
  }
);

// --- Visual Effects ---
const effects = useVoiceInputEffects({
  isProcessingAudio: sttManager.isProcessingAudio,
  isListeningForWakeWord: sttManager.isListeningForWakeWord,
  isProcessingLLM: computed(() => props.isProcessing),
  audioMode: currentAudioMode,
});

// --- Voice Visualization ---
let voiceViz: ReturnType<typeof useVoiceVisualization> | null = null;


// --- Computed Properties for UI ---
const isInputDisabled = computed<boolean>(() => {
  return (
    props.isProcessing ||
    (sttManager.isProcessingAudio.value && !isPttMode.value && !isVoiceActivationMode.value && currentAudioMode.value !== 'continuous') || // More specific condition
    micPermissionStatus.value === 'denied' ||
    micPermissionStatus.value === 'error'
  );
});

const placeholderText = computed<string>(() => {
  // (Logic remains largely the same as v1.1.0, ensure it uses sttManager states)
  if (props.isProcessing) return 'Assistant is responding, input paused...';
  if (micPermissionStatus.value === 'denied') return 'Microphone access denied. Please enable in browser settings.';
  if (micPermissionStatus.value === 'error') return 'Microphone error. Please check device or permissions.';

  if (isVoiceActivationMode.value) {
    return sttManager.isListeningForWakeWord.value
      ? `Say "${settings.value.vadWakeWordsBrowserSTT?.[0] || 'VEE'}" to activate...`
      : sttManager.isProcessingAudio.value
        ? 'Listening for your command...'
        : `Ready for wake word ("${settings.value.vadWakeWordsBrowserSTT?.[0] || 'VEE'}")... or type.`;
  }
  if (isContinuousMode.value) {
    return sttManager.isProcessingAudio.value ? 'Listening continuously...' : 'Continuous mode ready. Start speaking or type.';
  }
  return sttManager.isProcessingAudio.value ? 'Recording (PTT)...' : props.inputPlaceholder || 'Press mic for Push-to-Talk or type...';
});

const statusText = computed<string>(() => {
  // (Logic remains largely the same as v1.1.0, ensure it uses sttManager states)
  if (props.isProcessing) return 'Assistant Responding';
  if (micPermissionStatus.value === 'denied') return 'Mic Denied';
  if (micPermissionStatus.value === 'error') return 'Mic Error';

  if (isVoiceActivationMode.value) {
    return sttManager.isListeningForWakeWord.value
      ? 'VAD: Awaiting Wake Word'
      : sttManager.isProcessingAudio.value
        ? 'VAD: Capturing Command'
        : 'VAD: Ready';
  }
  if (isContinuousMode.value) {
    return sttManager.isProcessingAudio.value ? 'Continuous: Listening' : 'Continuous: Ready';
  }
  return sttManager.isProcessingAudio.value ? 'PTT: Recording' : 'PTT: Ready';
});

const currentRecordingStatusText = ref('');

const modeIndicatorClass = computed<string>(() => {
  // (Logic remains largely the same as v1.1.0, ensure it uses sttManager states)
  if (props.isProcessing) return 'processing-llm';
  if (micPermissionStatus.value === 'error' || micPermissionStatus.value === 'denied') return 'mic-error';

  if (isVoiceActivationMode.value) {
    return sttManager.isListeningForWakeWord.value
      ? 'vad-standby'
      : sttManager.isProcessingAudio.value
        ? 'active'
        : 'idle';
  }
  return sttManager.isProcessingAudio.value ? 'active' : 'idle';
});

const micButtonDisabled = computed<boolean>(() => {
  // (Logic remains largely the same as v1.1.0)
  if (micPermissionStatus.value === 'denied' || micPermissionStatus.value === 'error') return true;
  if (props.isProcessing && !sttManager.isProcessingAudio.value) return true; // If LLM processing and STT isn't already active
  return false;
});

const micButtonLabel = computed<string>(() => {
  // (Logic remains largely the same as v1.1.0)
  if (micPermissionStatus.value === 'denied') return 'Microphone Denied';
  if (micPermissionStatus.value === 'error') return 'Microphone Error';

  if (sttManager.isProcessingAudio.value) {
    return isPttMode.value ? 'Stop PTT Recording' : 'Stop Listening';
  }
  if (isVoiceActivationMode.value && sttManager.isListeningForWakeWord.value) {
    return 'Stop VAD Wake Word Listening';
  }
  return isPttMode.value ? 'Start PTT Recording' : 'Start Listening';
});

const isProminentVizActive = computed<boolean>(() => {
  // (Logic remains largely the same as v1.1.0, ensure it uses sttManager states)
  return sttManager.isProcessingAudio.value ||
         (isContinuousMode.value && sttManager.isHandlerReady.value) || // Show if handler ready in continuous
         (isVoiceActivationMode.value && (sttManager.isListeningForWakeWord.value || sttManager.isProcessingAudio.value));
});

const audioModeOptions = computed(() => [
  { value: 'push-to-talk', label: 'PTT', description: 'Click mic to record' },
  { value: 'continuous', label: 'Continuous', description: 'Always listening' },
  {
    value: 'voice-activation',
    label: 'VAD',
    description: `Say "${settings.value.vadWakeWordsBrowserSTT?.[0] || 'VEE'}"`,
  },
]);

// --- Methods ---
function onTranscriptionFromHandler(text: string) {
  if (props.isProcessing) {
    effects.addIgnoredText(text);
    console.log('[VoiceInput] STT Transcription ignored (LLM processing):', text);
    currentRecordingStatusText.value = `<span style="opacity:0.5;">(Ignored: ${text.substring(0,30)}...)</span>`;
    setTimeout(() => currentRecordingStatusText.value = '', 2000);
    return;
  }
  if (text.trim()) {
    emit('transcription', text.trim());
    currentRecordingStatusText.value = '';
  }
}

function onProcessingAudioFromHandler(isProcessing: boolean) {
  emit('processing-audio', isProcessing); // This updates the parent of VoiceInput
  // sttManager.isProcessingAudio will be updated by its own internal logic based on handler state
  if (!isProcessing) {
    currentRecordingStatusText.value = '';
  }
}

// Corrected: Removed unused 'isListening' parameter
function onListeningForWakeWordFromHandler(/* isListening: boolean */) {
  // UI reacts to sttManager.isListeningForWakeWord, no direct action needed here from param
  // console.log('[VoiceInput] VAD wake word listening state from handler:', isListening);
}

function onWakeWordDetectedFromHandler() {
  if (props.isProcessing) {
    toast?.add({type: 'info', title: 'Assistant Busy', message: 'Wake word ignored while LLM is processing.'});
    return;
  }
  if (sttManager.activeHandler.value && isVoiceActivationMode.value) {
      console.log("[VoiceInput] Wake word detected, telling active handler to start command capture.");
      sttManager.activeHandler.value.startListening(true);
  }
}

function onSttErrorFromHandler(error: { type: string; message: string; code?: string }) {
  console.error('[VoiceInput] STT Error from Handler:', error);
  if (error.code !== 'no-speech' && error.code !== 'aborted') {
    toast?.add({
      type: 'error',
      title: 'Speech Recognition Error',
      message: error.message,
    });
  }
  currentRecordingStatusText.value = `<span style="color:var(--color-error)">Error: ${error.message}</span>`;
}

async function handleMicButton() {
  if (micButtonDisabled.value) return;
  if (!sttManager.isHandlerReady.value) {
    toast?.add({type: 'warning', title: 'STT Not Ready', message: 'Speech services are initializing. Please wait.'});
    // Try to reinitialize if not ready. It might be an issue with the handler itself.
    await sttManager.reinitialize();
    return;
  }

  if (isPttMode.value) {
    await sttManager.handlePttClick();
  } else {
    if (sttManager.isProcessingAudio.value || sttManager.isListeningForWakeWord.value) {
      await sttManager.stopAll();
    } else {
      // For continuous/VAD, this button would manually start the respective mode.
      await sttManager.startListening(); // sttManager determines if it's VAD wake or continuous
    }
  }
}

function handleTextSubmit() {
  // (Logic remains same as v1.1.0)
  if (!textInput.value.trim() || props.isProcessing || sttManager.isProcessingAudio.value) {
    return;
  }
  emit('transcription', textInput.value.trim());
  textInput.value = '';
  nextTick(() => handleTextareaInput());
}

function handleTextareaInput() {
  // (Logic remains same as v1.1.0)
  if (!textareaRef.value) return;
  textareaRef.value.style.height = 'auto';
  const maxHeight = 150;
  textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, maxHeight)}px`;
}

function insertNewline() {
  // (Logic remains same as v1.1.0)
    if(textareaRef.value){
        const { selectionStart, selectionEnd, value } = textareaRef.value;
        textInput.value = value.substring(0, selectionStart) + '\n' + value.substring(selectionEnd);
        nextTick(() => {
            if(textareaRef.value) textareaRef.value.selectionStart = textareaRef.value.selectionEnd = selectionStart + 1;
            handleTextareaInput();
        });
    }
}

function selectAudioMode(mode: string /* AudioInputMode */) {
  // (Logic remains same as v1.1.0)
  if (settings.value.audioInputMode === mode) return;
  console.log(`[VoiceInput] User selected audio mode: ${mode}`);
  voiceSettingsManager.updateSetting('audioInputMode', mode as AudioInputMode);
}

function handleFileUpload(file: File) {
  // (Logic remains same as v1.1.0)
  console.log('[VoiceInput] File selected for upload:', file.name);
  toast?.add({type: 'info', title: 'File Upload', message: `${file.name} selected. Processing not yet implemented.`});
}

function handleSttEngineChange(engine: string /* STTPreference */) {
  // (Logic remains same as v1.1.0)
  if (settings.value.sttPreference === engine) return;
  console.log(`[VoiceInput] User selected STT engine: ${engine}`);
  voiceSettingsManager.updateSetting('sttPreference', engine as STTPreference);
}

// --- Voice Visualization Setup ---
function setupVoiceVisualization() {
  if (visualizationCanvasRef.value && activeStream.value && !voiceViz) {
    // Corrected: Use shapeColor for the initial config
    const vizConfig: VoiceVisualizationConfig = {
      visualizationType: 'circular',
      fftSize: 256,
      shapeColor: `hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l))`, // CORRECTED
    };
    voiceViz = useVoiceVisualization(activeStream, visualizationCanvasRef, vizConfig);
  }

  if (voiceViz) {
    if ((sttManager.isProcessingAudio.value || sttManager.isListeningForWakeWord.value) && micPermissionStatus.value === 'granted') {
        let vizType: VoiceVisualizationConfig['visualizationType'] = 'circular';
        let vizColor = `hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l))`;

        if (isVoiceActivationMode.value && sttManager.isListeningForWakeWord.value) {
            vizType = 'frequencyBars';
            // Use a slightly different color for VAD wake to distinguish from command capture
            vizColor = `hsl(var(--color-accent-secondary-h), var(--color-accent-secondary-s), var(--color-accent-secondary-l))`;
        } else if (props.isProcessing) { // LLM Processing, show muted viz
             vizColor = `hsla(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l), 0.4)`; // CORRECTED
        }
        // When STT is active (not just VAD wake), use a more prominent color
        else if (sttManager.isProcessingAudio.value) {
            vizColor = `hsl(var(--color-voice-user-h), var(--color-voice-user-s), var(--color-voice-user-l))`;
        }

        voiceViz.updateConfig({ visualizationType: vizType, shapeColor: vizColor }); // CORRECTED
        voiceViz.startVisualization();
    } else {
      voiceViz.stopVisualization();
    }
  }
}

// Watchers for visualization updates (Remains same as v1.1.0)
watch([() => sttManager.isProcessingAudio.value, () => sttManager.isListeningForWakeWord.value, micPermissionStatus, () => props.isProcessing], () => {
  setupVoiceVisualization();
}, { deep: true, immediate: true }); // immediate: true to run on mount if conditions met

watch(activeStream, (newStream) => {
  if (newStream) {
    setupVoiceVisualization();
  } else {
    voiceViz?.stopVisualization();
    voiceViz = null; // Release instance if stream is gone
  }
});

// --- Lifecycle Hooks ---
onMounted(async () => {
  console.log('[VoiceInput Module - VoiceInput.vue] Mounted.');
  if (!voiceSettingsManager.isInitialized.value) {
      await voiceSettingsManager.initialize();
  }
  await ensureMicrophoneAccessAndStream();
  handleTextareaInput();
  // Visualization will be set up by the watcher when activeStream is ready.
});

onBeforeUnmount(async () => {
  console.log('[VoiceInput Module - VoiceInput.vue] Unmounting.');
  await sttManager.stopAll();
  await releaseAllMicrophoneResources();
  if (voiceViz) {
    voiceViz.stopVisualization();
    voiceViz = null;
  }
});

</script>

<style lang="scss">
// Styles are largely unchanged from v6.0.8, ensure _voice-input.scss is applied
// Key change was removing dynamic scaling from the .voice-input-panel-ephemeral itself.
// Specific state glows or subtle background patterns would be added here or in imported partials.

.voice-input-panel-initializing {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 100px; 
  text-align: center;
  color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
}

.voice-input-panel-ephemeral {
  position: relative;
  // No transform: scale here anymore
  &.state-prominent-viz-active {
    .input-area-ephemeral.viz-input-overlay-active .voice-textarea-ephemeral {
      opacity: 0.15; 
      pointer-events: none;
    }
    .voice-visualization-canvas-ephemeral {
      opacity: calc(var(--voice-presence, 0) * 0.7 + 0.25); 
      width: 90%; 
      height: 40px; 
      bottom: 50%; 
      transform: translate(-50%, 50%);
      top: auto; 
      z-index: 0; 
    }
  }
}

.voice-visualization-canvas-ephemeral {
  position: absolute;
  bottom: calc(100% + 2px); 
  left: 50%;
  transform: translateX(-50%);
  width: 120px; 
  height: 35px; 
  opacity: 0; 
  transition: opacity 0.2s ease-out, width 0.3s ease-out, height 0.3s ease-out, bottom 0.3s ease-out, top 0.3s ease-out, transform 0.3s ease-out;
  pointer-events: none;
  z-index: 1; 
}

.input-area-ephemeral {
  position: relative;
  &.viz-input-overlay-active .voice-textarea-ephemeral { 
      opacity: 0.15; 
      pointer-events: none;
  }
}

.voice-textarea-ephemeral {
  position: relative;
  &.glimmer-active:not(:disabled) {
    animation: textGlimmerAnimation 1s ease-in-out infinite alternate;
  }
}

@keyframes textGlimmerAnimation {
  0% {
    text-shadow: 0 0 2px hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), calc(var(--color-accent-primary-l) + 10%), 0.2),
                 0 0 4px hsla(var(--color-text-primary-h), var(--color-text-primary-s), calc(var(--color-text-primary-l) + 5%), 0.1);
  }
  100% {
    text-shadow: 0 0 4px hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), calc(var(--color-accent-primary-l) + 15%), 0.35),
                 0 0 7px hsla(var(--color-text-primary-h), var(--color-text-primary-s), calc(var(--color-text-primary-l) + 10%), 0.2);
  }
}

.send-button-ephemeral-v2 {
  transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1),
              background 0.15s cubic-bezier(0.25, 0.1, 0.25, 1),
              opacity 0.15s cubic-bezier(0.25, 0.1, 0.25, 1);
  &:hover:not(:disabled) {
    transform: scale(1.05); 
  }
}

// Modal Styles remain the same
.transcription-history-overlay-ephemeral,
.edit-modal-overlay-ephemeral {
  position: fixed; inset: 0;
  background-color: hsla(var(--color-bg-primary-h,0), var(--color-bg-primary-s,0%), var(--color-bg-primary-l,0%), 0.5);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1040; 
  padding: 1rem;
}

.transcription-history-modal-ephemeral,
.edit-modal-ephemeral {
  width: 100%; max-width: 500px; max-height: 80vh;
  display: flex; flex-direction: column;
  border-radius: 0.75rem; overflow: hidden;
  background-color: hsla(var(--color-bg-secondary-h,0),var(--color-bg-secondary-s,0%),var(--color-bg-secondary-l,15%),0.85); 
  border: 1px solid hsla(var(--color-border-primary-h,0),var(--color-border-primary-s,0%),var(--color-border-primary-l,30%),0.3);
  box-shadow: 0 8px 32px 0 hsla(var(--color-shadow-primary-h,0),var(--color-shadow-primary-s,0%),var(--color-shadow-primary-l,0%),0.25);
}

.modal-header-ephemeral {
  display: flex; justify-content: space-between; align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid hsla(var(--color-border-primary-h,0),var(--color-border-primary-s,0%),var(--color-border-primary-l,30%),0.2);
  h3 { font-size: 1.125rem; font-weight: 600; color: hsl(var(--color-text-primary-h,0),var(--color-text-primary-s,0%),var(--color-text-primary-l,90%)); }
}
.close-btn-ephemeral { color: hsl(var(--color-text-secondary-h,0),var(--color-text-secondary-s,0%),var(--color-text-secondary-l,70%)); }

.modal-content-ephemeral { padding: 1.25rem; overflow-y: auto; flex-grow: 1; }

.custom-scrollbar-deep-panel { 
    &::-webkit-scrollbar { width: 6px; height: 6px; }
    &::-webkit-scrollbar-track { background-color: hsla(var(--color-bg-tertiary-h, 0), var(--color-bg-tertiary-s, 0%), var(--color-bg-tertiary-l, 20%), 0.1); border-radius: 3px; }
    &::-webkit-scrollbar-thumb { background-color: hsla(var(--color-accent-primary-h, 210), var(--color-accent-primary-s, 80%), var(--color-accent-primary-l, 60%), 0.4); border-radius: 3px; }
    &::-webkit-scrollbar-thumb:hover { background-color: hsla(var(--color-accent-primary-h, 210), var(--color-accent-primary-s, 80%), var(--color-accent-primary-l, 60%), 0.6); }
    scrollbar-width: thin;
    scrollbar-color: hsla(var(--color-accent-primary-h, 210), var(--color-accent-primary-s, 80%), var(--color-accent-primary-l, 60%), 0.4) hsla(var(--color-bg-tertiary-h, 0), var(--color-bg-tertiary-s, 0%), var(--color-bg-tertiary-l, 20%), 0.1);
}

.history-item-ephemeral { padding: 0.5rem 0; border-bottom: 1px solid hsla(var(--color-border-primary-h,0),var(--color-border-primary-s,0%),var(--color-border-primary-l,30%),0.1); &:last-child { border-bottom: none; } }
.history-text-ephemeral { color: hsl(var(--color-text-secondary-h,0),var(--color-text-secondary-s,0%),var(--color-text-secondary-l,80%)); margin-bottom: 0.25rem; word-break: break-word; }
.history-meta-ephemeral { display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: hsl(var(--color-text-muted-h,0),var(--color-text-muted-s,0%),var(--color-text-muted-l,60%)); }

.edit-textarea-ephemeral {
  width: 100%;
  background-color: hsla(var(--color-bg-tertiary-h,0),var(--color-bg-tertiary-s,0%),var(--color-bg-tertiary-l,25%),0.5);
  border: 1px solid hsla(var(--color-border-secondary-h,0),var(--color-border-secondary-s,0%),var(--color-border-secondary-l,40%),0.3);
  border-radius: 0.5rem; padding: 0.5rem;
  color: hsl(var(--color-text-primary-h,0),var(--color-text-primary-s,0%),var(--color-text-primary-l,90%));
  &:focus {
    border-color: hsl(var(--color-accent-interactive-h,200),var(--color-accent-interactive-s,90%),var(--color-accent-interactive-l,65%));
    box-shadow: 0 0 0 2px hsla(var(--color-accent-interactive-h,200),var(--color-accent-interactive-s,90%),var(--color-accent-interactive-l,65%),0.2);
    outline: none;
  }
}
.modal-actions-ephemeral { display: flex; justify-content: flex-end; gap: 1rem; padding: 1rem 1.25rem; border-top: 1px solid hsla(var(--color-border-primary-h,0),var(--color-border-primary-s,0%),var(--color-border-primary-l,30%),0.2); }

.btn { display: inline-flex; align-items: center; justify-content: center; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 500; transition: background-color 0.2s, opacity 0.2s; cursor:pointer; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-ghost-ephemeral { background-color: transparent; border: 1px solid transparent; &:hover:not(:disabled) { background-color: hsla(var(--color-bg-hover-h, 0), var(--color-bg-hover-s, 0%), var(--color-bg-hover-l, 50%), 0.1); } }
.btn-sm-ephemeral { padding: 0.375rem 0.75rem; font-size: 0.875rem; }
.btn-icon-ephemeral { padding: 0.5rem; }
.btn-link-ephemeral { background: none; border: none; color: hsl(var(--color-accent-interactive-h,200),var(--color-accent-interactive-s,90%),var(--color-accent-interactive-l,65%)); padding: 0; &:hover:not(:disabled) { text-decoration: underline; opacity:0.8; } }
.btn-xs-ephemeral { font-size: 0.75rem; padding: 0.125rem 0.25rem; }
.btn-secondary-ephemeral { background-color: hsl(var(--color-bg-btn-secondary-h,0),var(--color-bg-btn-secondary-s,0%),var(--color-bg-btn-secondary-l,40%)); border: 1px solid hsl(var(--color-border-btn-secondary-h,0),var(--color-border-btn-secondary-s,0%),var(--color-border-btn-secondary-l,50%)); color: hsl(var(--color-text-on-secondary-h,0),var(--color-text-on-secondary-s,0%),var(--color-text-on-secondary-l,90%)); &:hover:not(:disabled) { opacity: 0.8; } }
.btn-primary-ephemeral { background-color: hsl(var(--color-accent-primary-h,210),var(--color-accent-primary-s,80%),var(--color-accent-primary-l,60%)); border: 1px solid hsl(var(--color-accent-primary-h,210),var(--color-accent-primary-s,80%),var(--color-accent-primary-l,60%)); color: hsl(var(--color-text-on-accent-h,0),var(--color-text-on-accent-s,0%),var(--color-text-on-accent-l,100%)); &:hover:not(:disabled) { opacity:0.8; } }

.card-neo-raised {
  background: hsl(var(--color-bg-primary-h, 0), var(--color-bg-primary-s, 0%), var(--color-bg-primary-l, 93%));
  border-radius: 0.5rem;
  box-shadow: 2px 2px 5px hsla(var(--color-shadow-primary-h, 0), var(--color-shadow-primary-s, 0%), var(--color-shadow-primary-l, 0%), 0.1),
              -2px -2px 5px hsla(var(--color-highlight-primary-h, 0), var(--color-highlight-primary-s, 0%), var(--color-highlight-primary-l, 100%), 0.7);
}
.dark .card-neo-raised {
  background: hsl(var(--color-bg-primary-h, 240), var(--color-bg-primary-s, 10%), var(--color-bg-primary-l, 20%));
  box-shadow: 2px 2px 5px hsla(var(--color-shadow-primary-h, 0), var(--color-shadow-primary-s, 0%), var(--color-shadow-primary-l, 0%), 0.3),
              -2px -2px 5px hsla(var(--color-highlight-primary-h, 240), var(--color-highlight-primary-s, 10%), var(--color-highlight-primary-l, 28%), 0.9);
}

.dark .card-glassmorphic-deep { background: rgba(30,30,40,0.8); border: 1px solid rgba(180,180,200,0.1); }

.dropdown-float-neomorphic-enter-active, .dropdown-float-neomorphic-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.dropdown-float-neomorphic-enter-from, .dropdown-float-neomorphic-leave-to { opacity: 0; transform: translateY(-10px) scale(0.95); }
.modal-holographic-translucent-enter-active, .modal-holographic-translucent-leave-active { transition: opacity 0.3s ease; }
.modal-holographic-translucent-enter-from, .modal-holographic-translucent-leave-to { opacity: 0; }
.modal-holographic-translucent-enter-active .card-glassmorphic-deep, 
.modal-holographic-translucent-leave-active .card-glassmorphic-deep { transition: transform 0.3s ease, opacity 0.3s ease; }
.modal-holographic-translucent-enter-from .card-glassmorphic-deep, 
.modal-holographic-translucent-leave-to .card-glassmorphic-deep { opacity: 0; transform: scale(0.9); }

.icon, .icon-sm, .icon-xs, .icon-base { display: inline-block; vertical-align: middle; }
.icon { width: 1.5rem; height: 1.5rem; } 
.icon-sm { width: 1.25rem; height: 1.25rem; } 
.icon-xs { width: 1rem; height: 1rem; } 
.icon-base { width: 1.25rem; height: 1.25rem; }
.ml-1\.5 { margin-left: 0.375rem; } .mr-2 { margin-right: 0.5rem; } .ml-auto { margin-left: auto; }
.hidden { display: none; } .sm\:inline { @media (min-width: 640px) { display: inline; } }
.\!py-1\.5 { padding-top: 0.375rem !important; padding-bottom: 0.375rem !important; }
.\!px-2\.5 { padding-left: 0.625rem !important; padding-right: 0.625rem !important; }
.\!text-xs { font-size: 0.75rem !important; }

.send-icon-animated-wrapper { display: inline-flex; align-items: center; justify-content: center; }
.send-icon-animated { width: 1.25rem; height: 1.25rem; fill: currentColor; }
.send-icon-shape { transition: transform 0.2s ease-out; }
.send-button-ephemeral-v2:hover:not(:disabled) .send-icon-shape { transform: translateX(2px) translateY(-1px) scale(1.05); }
.send-icon-trail { stroke: currentColor; stroke-width: 1.5; opacity: 0; transition: opacity 0.3s ease-out, transform 0.3s ease-out; }
.send-button-ephemeral-v2:active:not(:disabled) .send-icon-trail-1 { opacity: 0.5; transform: translate(-10px, 5px) scale(0.8); transition-duration: 0.1s; }
.send-button-ephemeral-v2:active:not(:disabled) .send-icon-trail-2 { opacity: 0.3; transform: translate(-15px, 8px) scale(0.7); transition-duration: 0.15s; transition-delay: 0.05s;}
.send-button-ephemeral-v2:active:not(:disabled) .send-icon-trail-3 { opacity: 0.2; transform: translate(-20px, 10px) scale(0.6); transition-duration: 0.2s; transition-delay: 0.1s;}

.controls-main-row-ephemeral {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0; 
}
.status-display-ephemeral { flex-grow: 1; min-width:0; }
.mic-button-ephemeral { /* Basic styles in _buttons.scss or component-specific */ }
.audio-mode-selector-wrapper { position: relative; }
.secondary-controls-ephemeral { display: flex; gap: 0.25rem; }
.stop-btn-ephemeral { /* Styles for emphasis, e.g., red on hover/active */ }
.audio-mode-button { /* Styles for consistent button appearance */ }
.chevron-icon { /* Styles for rotation if needed */ }
.audio-mode-dropdown { position: absolute; bottom: calc(100% + 0.5rem); right: 0; z-index: 20; min-width: 220px; }
.dropdown-header-ephemeral { /* Styling for the dropdown header */ }
.dropdown-title { /* Styling for the title within header */ }
.audio-mode-item { /* Styling for individual items in dropdown */ }
.empty-history-ephemeral { padding: 1rem; text-align: center; color: hsl(var(--color-text-muted-h,0),var(--color-text-muted-s,0%),var(--color-text-muted-l,60%)); }

</style>