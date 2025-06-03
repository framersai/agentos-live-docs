// Version 1.2.2 - Applied more TypeScript error fixes
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
      @handler-api-ready="(api: SttHandlerInstance) => sttManager.registerHandler('browser', api)"
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
      @handler-api-ready="(api: SttHandlerInstance) => sttManager.registerHandler('whisper', api)"
      @unmounted="() => sttManager.unregisterHandler('whisper')"
      @transcription="onTranscriptionFromHandler"
      @processing-audio="onProcessingAudioFromHandler"
      @error="onSttErrorFromHandler"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, inject, nextTick, watch } from 'vue';
import { voiceSettingsManager, type VoiceApplicationSettings, type AudioInputMode, type STTPreference } from '@/services/voice.settings.service';
import type { ToastService } from '@/services/services';
import { useMicrophone } from '@/components/voice-input/composables/useMicrophone';
import { useVoiceVisualization, type VoiceVisualizationConfig } from '@/composables/useVoiceVisualization'; // Ensure VoiceVisualizationConfig includes 'oscilloscope' or handle it
import { useSttHandlerManager, type SttHandlerInstance, type SttHandlerEvents } from './composables/useSttHandlerManager';
import { useVoiceInputEffects } from './composables/useVoiceInputEffects';

import BrowserSpeechHandler from './handlers/BrowserSpeechHandler.vue';
import WhisperSpeechHandler from './handlers/WhisperSpeechHandler.vue';
import AudioModeDropdown from './components/AudioModeDropdown.vue';
import InputToolbar from './components/InputToolbar.vue';

import './styles/voice-input.scss';

import {
  MicrophoneIcon,
  PaperAirplaneIcon,
  ClockIcon,
  PlusIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps<{
  isProcessing: boolean;
  inputPlaceholder?: string;
}>();

const emit = defineEmits<{
  (e: 'transcription', value: string): void;
  (e: 'permission-update', status: 'granted' | 'denied' | 'prompt' | 'error'): void;
  (e: 'processing-audio', isProcessingAudio: boolean): void;
}>();

const toast = inject<ToastService>('toast');

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const visualizationCanvasRef = ref<HTMLCanvasElement | null>(null);
const textInput = ref('');
const showTranscriptionHistory = ref(false);
const showInputToolbar = ref(false);

const settings = computed<VoiceApplicationSettings>(() => voiceSettingsManager.settings);
const sttPreference = computed<STTPreference>(() => settings.value.sttPreference);
const currentAudioMode = computed<AudioInputMode>(() => settings.value.audioInputMode);
const isPttMode = computed<boolean>(() => currentAudioMode.value === 'push-to-talk');
const isContinuousMode = computed<boolean>(() => currentAudioMode.value === 'continuous');
const isVoiceActivationMode = computed<boolean>(() => currentAudioMode.value === 'voice-activation');

const {
  activeStream,
  analyser,
  permissionStatus: micPermissionStatus,
  ensureMicrophoneAccessAndStream,
  releaseAllMicrophoneResources,
} = useMicrophone({
  settings: settings,
  toast,
  onPermissionUpdateGlobally: (status) => emit('permission-update', status),
});

const sttManagerEvents: SttHandlerEvents = {
  onTranscription: (_text) => { // Renamed to _text as it's not used here
    // VoiceInput handles transcriptions directly from onTranscriptionFromHandler.
  },
  onProcessingAudio: (isProcessing: boolean) => {
    emit('processing-audio', isProcessing);
  },
  onListeningForWakeWord: (_isListening: boolean) => { // Renamed to _isListening
    // UI primarily reacts to sttManager.isListeningForWakeWord.
  },
  onWakeWordDetected: () => {
    // Action is handled by onWakeWordDetectedFromHandler
  },
  onError: (error) => {
    onSttErrorFromHandler(error);
  },
  onReady: (handlerId, _handlerApi) => { // Renamed to _handlerApi
    console.log(`[VoiceInput] STT Handler ${handlerId} is ready via manager event.`);
  },
};

const sttManager = useSttHandlerManager(
  {
    settings: settings,
    toast,
    isProcessingLLM: computed(() => props.isProcessing),
    currentMicPermission: micPermissionStatus,
  },
  sttManagerEvents
);

const effects = useVoiceInputEffects({
  isProcessingAudio: sttManager.isProcessingAudio,
  isListeningForWakeWord: sttManager.isListeningForWakeWord,
  isProcessingLLM: computed(() => props.isProcessing),
  audioMode: currentAudioMode,
});

let voiceViz: ReturnType<typeof useVoiceVisualization> | null = null;

const isInputDisabled = computed<boolean>(() => {
  return (
    props.isProcessing ||
    (sttManager.isProcessingAudio.value && currentAudioMode.value !== 'push-to-talk' && currentAudioMode.value !== 'continuous' && currentAudioMode.value !== 'voice-activation') ||
    micPermissionStatus.value === 'denied' ||
    micPermissionStatus.value === 'error'
  );
});

const placeholderText = computed<string>(() => {
  if (props.isProcessing) return 'Assistant is responding, input paused...';
  if (micPermissionStatus.value === 'denied') return 'Microphone access denied. Please enable in browser settings.';
  if (micPermissionStatus.value === 'error') return 'Microphone error. Please check device or permissions.';
  const wakeWord = settings.value.vadWakeWordsBrowserSTT?.[0] || 'VEE';
  if (isVoiceActivationMode.value) {
    return sttManager.isListeningForWakeWord.value
      ? `Say "${wakeWord}" to activate...`
      : sttManager.isProcessingAudio.value
        ? 'Listening for your command...'
        : `Ready for wake word ("${wakeWord}")... or type.`;
  }
  if (isContinuousMode.value) {
    return sttManager.isProcessingAudio.value ? 'Listening continuously...' : 'Continuous mode ready. Start speaking or type.';
  }
  return sttManager.isProcessingAudio.value ? 'Recording (PTT)...' : props.inputPlaceholder || 'Press mic for Push-to-Talk or type...';
});

const statusText = computed<string>(() => {
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
  if (micPermissionStatus.value === 'denied' || micPermissionStatus.value === 'error') return true;
  if (props.isProcessing && !sttManager.isProcessingAudio.value && !sttManager.isListeningForWakeWord.value) return true;
  return false;
});

const micButtonLabel = computed<string>(() => {
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
  return sttManager.isProcessingAudio.value ||
    (isContinuousMode.value && sttManager.isCurrentHandlerReady.value && micPermissionStatus.value === 'granted' && !props.isProcessing) ||
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

function onTranscriptionFromHandler(text: string) {
  if (props.isProcessing) {
    effects.addIgnoredText(text);
    console.log('[VoiceInput] STT Transcription ignored (LLM processing):', text);
    currentRecordingStatusText.value = `<span style="opacity:0.5;">(Ignored: ${text.substring(0,30)}...)</span>`;
    setTimeout(() => currentRecordingStatusText.value = '', 2000);
    if (sttManager.activeHandlerApi.value?.clearPendingTranscript) {
        sttManager.activeHandlerApi.value.clearPendingTranscript();
    }
    return;
  }
  if (text.trim()) {
    emit('transcription', text.trim());
    currentRecordingStatusText.value = '';
  }
}

function onProcessingAudioFromHandler(_isProcessing: boolean) { // Parameter often unused if relying on manager state
  if (!_isProcessing) {
    currentRecordingStatusText.value = '';
  }
}

function onListeningForWakeWordFromHandler(_isListening: boolean) { // Renamed as unused by this specific function body
  // UI reacts to sttManager.isListeningForWakeWord.
}

function onWakeWordDetectedFromHandler() {
  if (props.isProcessing) {
    toast?.add({type: 'info', title: 'Assistant Busy', message: 'Wake word ignored while LLM is processing.'});
    return;
  }
  if (sttManager.activeHandlerApi.value && isVoiceActivationMode.value) {
    console.log("[VoiceInput] Wake word detected by handler, telling active handler's API to start command capture.");
    sttManager.activeHandlerApi.value.startListening(true);
  }
}

function onSttErrorFromHandler(error: { type: string; message: string; code?: string }) {
  console.error('[VoiceInput] STT Error from Handler:', error);
  if (error.code !== 'no-speech' && error.code !== 'aborted' && error.code !== 'audio-capture') {
    toast?.add({
      type: 'error',
      title: 'Speech Recognition Error',
      message: `${error.message}${error.code ? ' ('+error.code+')' : ''}`,
    });
  }
  currentRecordingStatusText.value = `<span style="color:var(--color-error)">Error: ${error.message}</span>`;
}

async function handleMicButton() {
  if (micButtonDisabled.value && !(sttManager.isProcessingAudio.value || sttManager.isListeningForWakeWord.value) ) {
    console.warn('[VoiceInput] Mic button action blocked, button is disabled and STT not active.');
    return;
  }
  if (micPermissionStatus.value === 'prompt' || micPermissionStatus.value === '') {
    const accessGranted = await ensureMicrophoneAccessAndStream();
    if (!accessGranted) {
      toast?.add({type: 'warning', title: 'Microphone Access', message: 'Microphone permission is required.'});
      return;
    }
    await nextTick();
  }
  if (micPermissionStatus.value === 'denied' || micPermissionStatus.value === 'error') {
    toast?.add({type: 'error', title: 'Microphone Error', message: 'Microphone is not available. Please check permissions or device.'});
    return;
  }
  if (!sttManager.isCurrentHandlerReady.value) {
    toast?.add({type: 'warning', title: 'STT Not Ready', message: 'Speech services are initializing. Please wait.'});
    await sttManager.reinitializeActiveHandler();
    return;
  }
  if (isPttMode.value) {
    await sttManager.handlePttClick();
  } else {
    if (sttManager.isProcessingAudio.value || sttManager.isListeningForWakeWord.value) {
      await sttManager.stopAll();
    } else {
      await sttManager.startListening();
    }
  }
}

function handleTextSubmit() {
  if (!textInput.value.trim() || props.isProcessing || (sttManager.isProcessingAudio.value && !isPttMode.value)) {
    return;
  }
  emit('transcription', textInput.value.trim());
  textInput.value = '';
  nextTick(() => handleTextareaInput());
}

function handleTextareaInput() {
  if (!textareaRef.value) return;
  textareaRef.value.style.height = 'auto';
  const maxHeight = 150;
  let newHeight = textareaRef.value.scrollHeight;
  textareaRef.value.style.height = `${Math.min(newHeight, maxHeight)}px`;
}

function insertNewline() {
  if(textareaRef.value){
    const { selectionStart, selectionEnd, value } = textareaRef.value;
    textInput.value = value.substring(0, selectionStart) + '\n' + value.substring(selectionEnd);
    nextTick(() => {
      if(textareaRef.value) textareaRef.value.selectionStart = textareaRef.value.selectionEnd = selectionStart + 1;
      handleTextareaInput();
    });
  }
}

function selectAudioMode(mode: string) {
  if (settings.value.audioInputMode === mode) return;
  console.log(`[VoiceInput] User selected audio mode: ${mode}`);
  voiceSettingsManager.updateSetting('audioInputMode', mode as AudioInputMode);
}

function handleFileUpload(file: File) {
  console.log('[VoiceInput] File selected for upload:', file.name);
  toast?.add({type: 'info', title: 'File Upload', message: `${file.name} selected. Processing not yet implemented.`});
}

function handleSttEngineChange(engine: string) {
  if (settings.value.sttPreference === engine) return;
  console.log(`[VoiceInput] User selected STT engine: ${engine}`);
  voiceSettingsManager.updateSetting('sttPreference', engine as STTPreference);
}

function setupVoiceVisualization() {
  if (visualizationCanvasRef.value && activeStream.value && !voiceViz) {
    const vizConfig: VoiceVisualizationConfig = {
      visualizationType: 'circular', // Default type
      fftSize: 256,
      shapeColor: `hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l))`,
    };
    voiceViz = useVoiceVisualization(activeStream, visualizationCanvasRef, vizConfig);
  }

  if (voiceViz) {
    if ((sttManager.isProcessingAudio.value || sttManager.isListeningForWakeWord.value) && micPermissionStatus.value === 'granted' && !props.isProcessing) {
        let vizType: VoiceVisualizationConfig['visualizationType'] = 'circular'; // Default to a known valid type
        let vizColor = `hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l))`;

        if (isVoiceActivationMode.value && sttManager.isListeningForWakeWord.value) { // VAD wake word listening
            vizType = 'frequencyBars';
            vizColor = `hsl(var(--color-accent-secondary-h), var(--color-accent-secondary-s), var(--color-accent-secondary-l))`;
        } else if (sttManager.isProcessingAudio.value) { // VAD command capture or Continuous listening
            vizColor = `hsl(var(--color-voice-user-h), var(--color-voice-user-s), var(--color-voice-user-l))`;
            // The type 'oscilloscope' caused an error. Fallback to 'circular' or 'frequencyBars'.
            // Ensure 'oscilloscope' is added to VoiceVisualizationConfig type in useVoiceVisualization.ts for proper use.
            vizType = isVoiceActivationMode.value ? 'circular' : 'frequencyBars'; // Using 'circular' as a fallback for 'oscilloscope'
        }
        voiceViz.updateConfig({ visualizationType: vizType, shapeColor: vizColor });
        voiceViz.startVisualization();
    } else if (props.isProcessing && voiceViz.isVisualizing.value) { // Check .value for Ref
        voiceViz.updateConfig({ shapeColor: `hsla(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l), 0.4)` });
    } else {
      voiceViz.stopVisualization();
    }
  }
}

watch([
    () => sttManager.isProcessingAudio.value,
    () => sttManager.isListeningForWakeWord.value,
    micPermissionStatus,
    () => props.isProcessing,
    activeStream
], () => {
  setupVoiceVisualization();
}, { deep: true, immediate: true });

onMounted(async () => {
  console.log('[VoiceInput Module - VoiceInput.vue] Mounted.');
  if (!voiceSettingsManager.isInitialized.value) {
      await voiceSettingsManager.initialize();
  }
  handleTextareaInput();
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
// Styles
</style>