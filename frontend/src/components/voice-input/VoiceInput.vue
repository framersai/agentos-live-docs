// File: frontend/src/components/voice-input/VoiceInput.vue
/**
 * @file VoiceInput.vue
 * @description Main UI component for voice and text input. Integrates STT handlers,
 * microphone access, voice visualization, and dynamic effects based on input state and mode.
 *
 * @component VoiceInput
 * @props {boolean} isProcessing - True if the parent component (e.g., LLM) is processing a response.
 * @props {string} [inputPlaceholder] - Optional placeholder text for the textarea.
 *
 * @emits transcription - Emits final transcribed text.
 * @emits permission-update - Emits microphone permission status changes.
 * @emits processing-audio - Emits true when STT is actively processing audio, false otherwise.
 *
 * @version 3.7.0 - Corrected audio beep loading using Vite imports.
 * Enhanced transcription visibility and VAD visualization logic.
 */
<template>
  <div
    class="voice-input-panel-ephemeral" :class="[
      effects.panelStateClass.value,
      { 'layout-wide-screen': isWideScreen },
      `mic-permission-${micPermissionStatus}`,
      { 'continuous-listening-active': isContinuousMode && (sttManager.isProcessingAudio.value || sttManager.isListeningForWakeWord.value) }
    ]"
    :style="effects.cssVariables.value"
    ref="voiceInputPanelRef"
  >
    <svg class="geometric-pattern-bg" aria-hidden="true">
      <defs>
        <filter id="voice-input-blur-filter-ephemeral">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
        </filter>
      </defs>
      <g filter="url(#voice-input-blur-filter-ephemeral)">
        <path
          v-for="pattern in effects.geometricPatternSvg.value"
          :key="pattern.id"
          :d="pattern.path"
          fill="none"
          stroke="currentColor"
          :stroke-opacity="pattern.opacity"
          stroke-width="0.75"
          class="pattern-stroke"
        />
      </g>
    </svg>
    <div
      class="dynamic-gradient-bg"
      :style="{ background: effects.backgroundGradient.value }"
      aria-hidden="true"
    ></div>

    <div class="ignored-text-container-ephemeral" aria-hidden="true">
      <div
        v-for="element in effects.ignoredTextElements.value"
        :key="element.id"
        class="ignored-text-ephemeral"
        :style="{
          opacity: element.opacity,
          transform: `translateY(-${element.y}px) scale(${element.opacity * 0.5 + 0.5})`,
          filter: `blur(${(1 - element.opacity) * 3}px)`
        }"
      >
        {{ element.text }}
      </div>
    </div>

    <canvas
      ref="visualizationCanvasRef"
      class="voice-visualization-canvas-ephemeral"
      :class="{
        prominent: isProminentVizActive,
        'vad-bars-active': isVoiceActivationMode && sttManager.isListeningForWakeWord.value,
        'continuous-viz-active': isContinuousMode && (sttManager.isProcessingAudio.value || sttManager.isListeningForWakeWord.value) && isInputEffectivelyDisabled,
      }"
      aria-hidden="true"
    ></canvas>

    <div class="input-and-controls-wrapper-ephemeral">
      <div class="input-area-ephemeral" :class="inputAreaProminenceClass">
        <textarea
          ref="textareaRef"
          v-model="textInput"
          @input="handleTextareaInput"
          @keyup.enter.exact.prevent="handleTextSubmit"
          @keyup.enter.shift.exact.prevent="insertNewline"
          class="voice-textarea-ephemeral"
          :placeholder="placeholderText"
          :disabled="isInputEffectivelyDisabled"
          rows="1"
          aria-label="Message input"
        ></textarea>

        <button
          @click="handleTextSubmit"
          :disabled="!textInput.trim() || props.isProcessing || isInputEffectivelyDisabled"
          class="send-button-ephemeral-v2"
          aria-label="Send message"
          title="Send message (Enter)"
        >
          <PaperAirplaneIcon class="send-icon-animated icon" />
        </button>
      </div>

      <div class="controls-main-row-ephemeral">
        <button
          @click="handleMicButton"
          class="mic-button-ephemeral"
          :class="{
            'listening': sttManager.isProcessingAudio.value && !sttManager.isListeningForWakeWord.value,
            'vad-listening-wake': isVoiceActivationMode && sttManager.isListeningForWakeWord.value,
            'active-command': isVoiceActivationMode && sttManager.isProcessingAudio.value && !sttManager.isListeningForWakeWord.value,
            'mic-error': micPermissionStatus === 'denied' || micPermissionStatus === 'error',
            'processing-llm': props.isProcessing && !sttManager.isProcessingAudio.value && !sttManager.isListeningForWakeWord.value,
          }"
          :disabled="micButtonDisabled"
          :aria-label="micButtonLabel"
          :title="micButtonLabel"
          aria-live="polite"
        >
          <MicrophoneIcon class="icon" />
          <span class="mic-state-ring"></span>
        </button>

        <div class="status-display-ephemeral">
          <div class="mode-indicator-wrapper-ephemeral">
            <span class="mode-dot-ephemeral" :class="modeIndicatorClass"></span>
            <span class="mode-text-ephemeral">{{ statusText }}</span>
          </div>
          <div class="transcription-status-ephemeral" v-html="currentRecordingStatusTextHtml" aria-live="assertive"></div>
        </div>

        <div class="right-controls-group-ephemeral">
          <div class="main-controls-stack-ephemeral">
             <button
                @click="toggleInputToolbar"
                class="control-btn-ephemeral toolbar-trigger-btn-ephemeral"
                title="Input options"
                aria-label="Toggle input options toolbar"
                :aria-expanded="showInputToolbar"
              >
                <PlusIcon class="icon-sm" />
            </button>
            <Transition name="toolbar-slide-vertical">
              <InputToolbar
                v-if="showInputToolbar"
                @close="showInputToolbar = false"
                @file-upload="handleFileUpload"
                @stt-engine-change="handleSttEngineChange"
                class="input-toolbar-instance-ephemeral"
              />
            </Transition>
          </div>
           <AudioModeDropdown
            :current-mode="currentAudioMode"
            :options="audioModeOptions"
            :disabled="props.isProcessing || sttManager.isProcessingAudio.value || sttManager.isListeningForWakeWord.value"
            @select="selectAudioMode"
            class="audio-mode-dropdown-instance-ephemeral"
          />
        </div>
      </div>
    </div>

    <BrowserSpeechHandler
      v-if="sttPreference === 'browser_webspeech_api'"
      :settings="settings"
      :audio-input-mode="currentAudioMode"
      :parent-is-processing-l-l-m="props.isProcessing"
      :current-mic-permission="micPermissionStatus"
      @handler-api-ready="(api: SttHandlerInstance) => sttManager.registerHandler('browser', api)"
      @unmounted="() => sttManager.unregisterHandler('browser')"
      @transcription="sttManagerEvents.onTranscription"
      @processing-audio="sttManagerEvents.onProcessingAudio"
      @is-listening-for-wake-word="sttManagerEvents.onListeningForWakeWord"
      @wake-word-detected="sttManagerEvents.onWakeWordDetected"
      @error="sttManagerEvents.onError"
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
      @transcription="sttManagerEvents.onTranscription"
      @processing-audio="sttManagerEvents.onProcessingAudio"
      @error="sttManagerEvents.onError"
      @is-listening-for-wake-word="sttManagerEvents.onListeningForWakeWord"
      @wake-word-detected="sttManagerEvents.onWakeWordDetected"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, inject, nextTick, watch } from 'vue';
import { voiceSettingsManager, type VoiceApplicationSettings, type AudioInputMode, type STTPreference } from '@/services/voice.settings.service';
import type { ToastService } from '@/services/services';
import { useMicrophone, type UseMicrophoneReturn } from '@/components/voice-input/composables/useMicrophone';
import { useVoiceVisualization, type VoiceVisualizationConfig } from '@/composables/useVoiceVisualization';
import { useSttHandlerManager, type SttHandlerInstance, type SttHandlerEvents } from './composables/useSttHandlerManager';
import { useVoiceInputEffects } from './composables/useVoiceInputEffects';

import BrowserSpeechHandler from './handlers/BrowserSpeechHandler.vue';
import WhisperSpeechHandler from './handlers/WhisperSpeechHandler.vue';
import AudioModeDropdown from './components/AudioModeDropdown.vue';
import InputToolbar from './components/InputToolbar.vue';

import './styles/voice-input.scss';

import { MicrophoneIcon, PaperAirplaneIcon, PlusIcon } from '@heroicons/vue/24/outline';
import { useBreakpoints } from '@vueuse/core';

// **IMPORTANT: If your sound files are in `src/assets/sounds/`, import them like this:**
import beepInSmoothUrl from '@/assets/sounds/beep_in_smooth.mp3';
import beepOutSmoothUrl from '@/assets/sounds/beep_out_smooth.mp3';
// If they are in `public/assets/sounds/`, the fetch paths will be `/assets/sounds/...`

const props = defineProps<{
  isProcessing: boolean;
  inputPlaceholder?: string;
}>();

const emit = defineEmits<{
  (e: 'transcription', value: string): void;
  (e: 'permission-update', status: 'prompt' | 'granted' | 'denied' | 'error'): void;
  (e: 'processing-audio', isProcessingAudio: boolean): void;
}>();

const toast = inject<ToastService>('toast');

const voiceInputPanelRef = ref<HTMLElement | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const visualizationCanvasRef = ref<HTMLCanvasElement | null>(null);
const textInput = ref('');
const showInputToolbar = ref(false);

const isComponentMountedAndReady = ref(false);
const lastTranscriptionEmitTime = ref(0);
const MIN_TIME_BETWEEN_TRANSCRIPTIONS_MS = 100;
const currentRecordingStatusTextHtml = ref('');

const audioContextForBeeps = ref<AudioContext | null>(null);
const beepInSmoothSound = ref<AudioBuffer | null>(null);
const beepOutSmoothSound = ref<AudioBuffer | null>(null);

const settings = computed<VoiceApplicationSettings>(() => voiceSettingsManager.settings);
const sttPreference = computed<STTPreference>(() => settings.value.sttPreference);
const currentAudioMode = computed<AudioInputMode>(() => settings.value.audioInputMode);

const isPttMode = computed<boolean>(() => currentAudioMode.value === 'push-to-talk');
const isContinuousMode = computed<boolean>(() => currentAudioMode.value === 'continuous');
const isVoiceActivationMode = computed<boolean>(() => currentAudioMode.value === 'voice-activation');

const breakpoints = useBreakpoints({ medium: 768, large: 1024 });
const isWideScreen = breakpoints.greaterOrEqual('large');

const {
  activeStream,
  analyser,
  permissionStatus: micPermissionStatus,
  ensureMicrophoneAccessAndStream,
  checkCurrentPermission,
  releaseAllMicrophoneResources,
} = useMicrophone({
  settings: settings,
  toast,
  onPermissionUpdateGlobally: (status) => {
    emit('permission-update', status);
  }
}) as UseMicrophoneReturn;

const sttManagerEvents: SttHandlerEvents = {
  onTranscription: (text: string) => onTranscriptionFromManager(text),
  onProcessingAudio: (isProcessing: boolean) => onProcessingAudioFromManager(isProcessing),
  onListeningForWakeWord: (_isListening: boolean) => { /* UI reacts to manager's computed props */ },
  onWakeWordDetected: () => {
      onWakeWordDetectedFromManagerInternal();
      sttManager.handleWakeWordDetected();
  },
  onError: (error: { type: string; message: string; code?: string }) => onSttErrorFromManager(error),
  onReady: (handlerId, _handlerApi) => {
    console.log(`[VoiceInput] STT Manager reports handler ${handlerId} is ready.`);
    if (isComponentMountedAndReady.value &&
        (isContinuousMode.value || isVoiceActivationMode.value) &&
        micPermissionStatus.value === 'granted' &&
        !props.isProcessing &&
        sttManager &&
        !sttManager.isProcessingAudio.value &&
        !sttManager.isListeningForWakeWord.value) {
      console.log(`[VoiceInput onManagerHandlerReady] Conditions met for auto-start. Manager's internal logic should take over.`);
    }
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

const interimTranscriptFromHandler = computed<string>(() => {
  const handlerApi = sttManager.activeHandlerApi.value;
  if (handlerApi && handlerApi.pendingTranscript && typeof handlerApi.pendingTranscript.value === 'string') {
    return handlerApi.pendingTranscript.value;
  }
  return '';
});

watch(interimTranscriptFromHandler, (newText) => {
  if (!isComponentMountedAndReady.value) return;
  if (newText.trim() && (sttManager.isProcessingAudio.value || (isVoiceActivationMode.value && sttManager.isListeningForWakeWord.value))) {
    // Sanitize HTML before setting it, or use textContent if HTML is not needed.
    // For simplicity, assuming the source is trusted or use a sanitizer.
    const sanitizedText = newText.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    currentRecordingStatusTextHtml.value = `<span class="interim-transcript-feedback">${sanitizedText}</span>`;
  } else if (!newText.trim() && currentRecordingStatusTextHtml.value.includes('interim-transcript-feedback')) {
    if (!currentRecordingStatusTextHtml.value.includes('Error:') &&
        !currentRecordingStatusTextHtml.value.includes('ignored-transcript-feedback') &&
        !currentRecordingStatusTextHtml.value.includes('listening-feedback')) {
        // Let onProcessingAudio or onTranscriptionFromManager manage explicit clears
    }
  }
});

function onTranscriptionFromManager(text: string) {
  const now = Date.now();
  const timeSinceLast = now - lastTranscriptionEmitTime.value;

  if (timeSinceLast < MIN_TIME_BETWEEN_TRANSCRIPTIONS_MS) {
    return;
  }

  if (props.isProcessing && !sttManager.isListeningForWakeWord.value) {
    effects.addIgnoredText(text);
    currentRecordingStatusTextHtml.value = `<span class="ignored-transcript-feedback">(Assistant busy, ignored: ${text.substring(0,30).replace(/</g, '&lt;').replace(/>/g, '&gt;')}...)</span>`;
    setTimeout(() => {
        if (currentRecordingStatusTextHtml.value.includes('ignored-transcript-feedback')) {
            currentRecordingStatusTextHtml.value = '';
        }
    }, 2500);
    sttManager.activeHandlerApi.value?.clearPendingTranscript?.();
    return;
  }

  if (text.trim()) {
    lastTranscriptionEmitTime.value = now;
    emit('transcription', text.trim());
    currentRecordingStatusTextHtml.value = '';
    playSound(beepOutSmoothSound.value);
  } else {
      if(currentRecordingStatusTextHtml.value.includes('listening-feedback')) {
          currentRecordingStatusTextHtml.value = '';
      }
  }
}

function onProcessingAudioFromManager(isProcessing: boolean) {
  if (isComponentMountedAndReady.value) {
    emit('processing-audio', isProcessing);
  }
  if (isProcessing) {
    playSound(beepInSmoothSound.value);
    if (!interimTranscriptFromHandler.value.trim() &&
        !currentRecordingStatusTextHtml.value.includes('Error:') &&
        !currentRecordingStatusTextHtml.value.includes('ignored-transcript-feedback') &&
        !currentRecordingStatusTextHtml.value.includes('interim-transcript-feedback')
      ) {
      currentRecordingStatusTextHtml.value = '<span class="listening-feedback">Listening...</span>';
    }
  } else {
    if (currentRecordingStatusTextHtml.value.includes('listening-feedback') && !interimTranscriptFromHandler.value.trim()) {
      currentRecordingStatusTextHtml.value = '';
    }
    if(isPttMode.value && !interimTranscriptFromHandler.value.trim() && !lastTranscriptionEmitTime.value){
        playSound(beepOutSmoothSound.value);
    }
    lastTranscriptionEmitTime.value = 0;
  }
}

function onWakeWordDetectedFromManagerInternal() {
  playSound(beepInSmoothSound.value);
  if (props.isProcessing) {
    toast?.add({type: 'info', title: 'Assistant Busy', message: 'Wake word heard, but assistant is still responding.', duration: 3000});
    return;
  }
  console.log("[VoiceInput] Wake word detected. Manager will handle STT transition.");
  toast?.add({type: 'success', title: 'Wake Word Detected!', message: 'Listening for your command...', duration: 2500});
  currentRecordingStatusTextHtml.value = '<span class="listening-feedback">Wake word detected! Listening for command...</span>';
}

function onSttErrorFromManager(error: { type: string; message: string; code?: string }) {
  console.error('[VoiceInput] STT Error (via manager event):', error.type, error.message, error.code);
  if (error.code !== 'no-speech' && error.code !== 'aborted' && error.message !== 'Recognition aborted.' && error.code !== 'audio-capture') {
    toast?.add({ type: 'error', title: `Speech Error: ${error.code || error.type}`, message: `${error.message}`, duration: 5000 });
  }
  currentRecordingStatusTextHtml.value = `<span class="error-feedback">Error: ${error.message.substring(0, 50).replace(/</g, '&lt;').replace(/>/g, '&gt;')}...</span>`;
  setTimeout(() => {
    if (currentRecordingStatusTextHtml.value.includes(`Error: ${error.message.substring(0, 50)}`)) {
        currentRecordingStatusTextHtml.value = '';
    }
  }, 3500);
}

async function loadAudioBeeps() {
  if (typeof window === 'undefined' || !window.AudioContext) {
    console.warn('[VoiceInput] AudioContext not supported, cannot load beeps.');
    return;
  }
  if (!audioContextForBeeps.value || audioContextForBeeps.value.state === 'closed') {
    try {
      audioContextForBeeps.value = new window.AudioContext();
      console.log('[VoiceInput] New AudioContext for beeps created.');
    } catch (e) {
      console.error('[VoiceInput] Failed to create AudioContext for beeps:', e);
      toast?.add({type: 'error', title: 'Audio System Error', message: 'Could not initialize audio for UI sounds.'});
      return;
    }
  }

  if (audioContextForBeeps.value.state === 'suspended') {
    try {
      await audioContextForBeeps.value.resume();
      console.log('[VoiceInput] AudioContext for beeps resumed.');
    } catch (resumeError) {
      console.error('[VoiceInput] Failed to resume AudioContext for beeps:', resumeError);
      toast?.add({type: 'warning', title: 'Audio Context Issue', message: 'Could not resume audio context for UI sounds.'});
      return;
    }
  }

  const loadSound = async (url: string, soundName: string): Promise<AudioBuffer | null> => {
    try {
      console.log(`[VoiceInput] Fetching ${soundName} from imported URL: ${url}`);
      // Vite handles the import, so 'url' is the direct path to the asset
      const response = await fetch(url);
      if (!response.ok) {
        const responseText = await response.text().catch(() => "Could not read response text.");
        console.error(`[VoiceInput] Fetch failed for ${soundName} (URL: ${url}): ${response.status} ${response.statusText}. Response body: ${responseText.substring(0,200)}`);
        throw new Error(`Fetch failed for ${soundName}: ${response.status} ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      if (!audioContextForBeeps.value) throw new Error("AudioContext for beeps became null during fetch.");
      console.log(`[VoiceInput] Received ${soundName} ArrayBuffer size: ${arrayBuffer.byteLength} bytes. Attempting decode...`);
      if (arrayBuffer.byteLength < 100) {
          console.error(`[VoiceInput] ${soundName} ArrayBuffer is too small (${arrayBuffer.byteLength} bytes). File likely corrupted or empty.`);
          throw new Error(`${soundName} file appears to be empty or corrupted.`);
      }
      return await audioContextForBeeps.value.decodeAudioData(arrayBuffer);
    } catch (error: any) {
      console.error(`[VoiceInput] Error loading or decoding sound ${soundName} from URL ${url}:`, error.message, error.name, error);
      if (error.name === 'EncodingError') {
        toast?.add({type:'error', title: `Audio Decode Error (${soundName})`, message: `Could not decode sound. Check file format/integrity.`});
      }
      return null;
    }
  };

  try {
    beepInSmoothSound.value = await loadSound(beepInSmoothUrl, 'beep_in_smooth');
    beepOutSmoothSound.value = await loadSound(beepOutSmoothUrl, 'beep_out_smooth');

    if (beepInSmoothSound.value && beepOutSmoothSound.value) {
      console.log('[VoiceInput] Audio beeps loaded successfully using imported URLs.');
    } else {
      let failedSounds = [];
      if (!beepInSmoothSound.value) failedSounds.push("beep_in_smooth.mp3");
      if (!beepOutSmoothSound.value) failedSounds.push("beep_out_smooth.mp3");
      const errorMessage = `One or more UI sounds failed to load/decode: ${failedSounds.join(', ')}. Sound effects may not play.`;
      console.error(`[VoiceInput] ${errorMessage}`);
      toast?.add({type: 'warning', title: 'Audio Feedback Warning', message: errorMessage, duration: 7000});
    }
  } catch (error) {
    console.error('[VoiceInput] Final error in loadAudioBeeps sequence:', error);
    toast?.add({type: 'warning', title: 'Audio Feedback System Error', message: 'Could not load UI sounds. Check console.'});
  }
}


function playSound(buffer: AudioBuffer | null) {
  if (!buffer || !audioContextForBeeps.value || audioContextForBeeps.value.state === 'closed') {
    if (audioContextForBeeps.value?.state === 'suspended') {
      console.log("[VoiceInput] playSound: AudioContext suspended, attempting resume.");
      audioContextForBeeps.value.resume().catch(e => console.error("[VoiceInput] Error resuming AudioContext for playSound:", e));
    } else {
      console.warn("[VoiceInput] Cannot play sound: No buffer or AudioContext not ready/closed.", {hasBuffer: !!buffer, contextState: audioContextForBeeps.value?.state});
    }
    return;
  }

  if (audioContextForBeeps.value.state === 'running') {
    try {
      const source = audioContextForBeeps.value.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextForBeeps.value.destination);
      source.start(0);
    } catch (error) {
      console.error('[VoiceInput] Error playing sound:', error);
    }
  } else if (audioContextForBeeps.value.state === 'suspended') {
     console.log("[VoiceInput] playSound: AudioContext still suspended after resume attempt, sound not played this time.");
  }
}

const isInputEffectivelyDisabled = computed<boolean>(() => {
  return (
    (isContinuousMode.value && sttManager && (sttManager.isProcessingAudio.value || sttManager.isListeningForWakeWord.value)) ||
    micPermissionStatus.value === 'denied' ||
    micPermissionStatus.value === 'error'
  );
});

const inputAreaProminenceClass = computed(() => { /* ... as before ... */ if (!sttManager) return 'input-area-idle'; if (isContinuousMode.value && (sttManager.isProcessingAudio.value || sttManager.isListeningForWakeWord.value)) return 'input-area-continuous-active'; if (isVoiceActivationMode.value && sttManager.isListeningForWakeWord.value) return 'input-area-vad-wake-listening'; if (props.isProcessing) return 'input-area-llm-processing'; return 'input-area-idle'; });
const placeholderText = computed<string>(() => { /* ... as before ... */ if (props.isProcessing) return 'Assistant is responding...'; if (micPermissionStatus.value === 'denied') return 'Microphone access denied.'; if (micPermissionStatus.value === 'error') return 'Microphone error.'; if (!sttManager || typeof sttManager.isListeningForWakeWord === 'undefined' || typeof sttManager.isProcessingAudio === 'undefined') return props.inputPlaceholder || 'Initializing speech...'; const wakeWord = settings.value.vadWakeWordsBrowserSTT?.[0]?.toUpperCase() || 'HEY VEE'; if (isVoiceActivationMode.value) return sttManager.isListeningForWakeWord.value ? `Say "${wakeWord}" or type...` : sttManager.isProcessingAudio.value ? 'Listening for command...' : `Ready for "${wakeWord}" or type message.`; if (isContinuousMode.value) return (sttManager.isProcessingAudio.value || sttManager.isListeningForWakeWord.value) ? 'Listening continuously... (text input disabled)' : 'Continuous: Ready'; return sttManager.isProcessingAudio.value ? 'PTT: Recording...' : props.inputPlaceholder || 'Press mic or type...'; });
const statusText = computed<string>(() => { /* ... as before ... */ if (props.isProcessing && (!sttManager || (!sttManager.isProcessingAudio.value && !sttManager.isListeningForWakeWord.value))) return 'Assistant Responding'; if (micPermissionStatus.value === 'denied') return 'Mic Denied'; if (micPermissionStatus.value === 'error') return 'Mic Error'; if (!sttManager || typeof sttManager.isListeningForWakeWord === 'undefined' || typeof sttManager.isProcessingAudio === 'undefined') return 'Status initializing...'; const currentModeLabel = audioModeOptions.value.find(opt => opt.value === currentAudioMode.value)?.label || currentAudioMode.value; if (isVoiceActivationMode.value) return sttManager.isListeningForWakeWord.value ? `${currentModeLabel}: Awaiting Wake Word` : sttManager.isProcessingAudio.value ? `${currentModeLabel}: Capturing Command` : `${currentModeLabel}: Ready`; if (isContinuousMode.value) return (sttManager.isProcessingAudio.value || sttManager.isListeningForWakeWord.value) ? `${currentModeLabel}: Listening` : `${currentModeLabel}: Ready`; return sttManager.isProcessingAudio.value ? `${currentModeLabel}: Recording` : `${currentModeLabel}: Ready`; });
const modeIndicatorClass = computed<string>(() => { /* ... as before ... */ if (props.isProcessing && (!sttManager || (!sttManager.isProcessingAudio.value && !sttManager.isListeningForWakeWord.value))) return 'state-processing-llm'; if (micPermissionStatus.value === 'error' || micPermissionStatus.value === 'denied') return 'state-mic-error'; if (!sttManager || typeof sttManager.isListeningForWakeWord === 'undefined' || typeof sttManager.isProcessingAudio === 'undefined') return 'state-idle'; if (isVoiceActivationMode.value) return sttManager.isListeningForWakeWord.value ? 'state-vad-listening-wake' : sttManager.isProcessingAudio.value ? 'state-vad-active-command' : 'state-idle'; if (isContinuousMode.value) return (sttManager.isProcessingAudio.value || sttManager.isListeningForWakeWord.value) ? 'state-continuous-active' : 'state-idle'; return sttManager.isProcessingAudio.value ? 'state-ptt-active' : 'state-idle'; });
const micButtonDisabled = computed<boolean>(() => { /* ... as before ... */ if (micPermissionStatus.value === 'denied' || micPermissionStatus.value === 'error') return true; if (!sttManager || typeof sttManager.isListeningForWakeWord === 'undefined') return true; if (props.isProcessing && !(isVoiceActivationMode.value && sttManager.isListeningForWakeWord.value)) { return true; } return false; });
const micButtonLabel = computed<string>(() => { /* ... as before ... */ if (micPermissionStatus.value === 'denied') return 'Microphone access denied. Enable in browser settings.'; if (micPermissionStatus.value === 'error') return 'Microphone error. Check console or try another device.'; if (!sttManager || typeof sttManager.isListeningForWakeWord === 'undefined' || typeof sttManager.isProcessingAudio === 'undefined') return 'Mic initializing...'; if (props.isProcessing && !(isVoiceActivationMode.value && sttManager.isListeningForWakeWord.value)) return 'Assistant is busy, please wait.'; if (sttManager.isProcessingAudio.value && !sttManager.isListeningForWakeWord.value) return isPttMode.value ? 'Stop Push-to-Talk Recording' : 'Stop Listening'; if (isVoiceActivationMode.value && sttManager.isListeningForWakeWord.value) return 'Stop Voice Activation (Wake Word Listening)'; if (isPttMode.value) return 'Start Push-to-Talk Recording (Hold or Click)'; if (isContinuousMode.value) return 'Start Continuous Listening'; if (isVoiceActivationMode.value) return `Start Voice Activation (Listening for "${settings.value.vadWakeWordsBrowserSTT?.[0]?.toUpperCase() || 'HEY VEE'}")`; return 'Start Listening'; });
const isProminentVizActive = computed<boolean>(() => { /* ... as before ... */ if (micPermissionStatus.value !== 'granted') return false; if (!sttManager || typeof sttManager.isListeningForWakeWord === 'undefined' || typeof sttManager.isProcessingAudio === 'undefined') return false; const sttIsCapturingCommand = sttManager.isProcessingAudio.value && !sttManager.isListeningForWakeWord.value; const sttIsListeningForWake = isVoiceActivationMode.value && sttManager.isListeningForWakeWord.value; const sttIsInContinuousListenWhileUITextDisabled = isContinuousMode.value && (sttManager.isProcessingAudio.value || sttManager.isListeningForWakeWord.value) && isInputEffectivelyDisabled.value; if (props.isProcessing && !sttIsListeningForWake && !sttIsInContinuousListenWhileUITextDisabled) { return false; } return sttIsCapturingCommand || sttIsListeningForWake || sttIsInContinuousListenWhileUITextDisabled; });
const audioModeOptions = computed(() => [ /* ... as before ... */ { value: 'push-to-talk' as AudioInputMode, label: 'PTT', description: 'Click/Hold mic to record' }, { value: 'continuous' as AudioInputMode, label: 'Continuous', description: 'Always listening when active' }, { value: 'voice-activation' as AudioInputMode, label: 'VAD', description: `Say "${settings.value.vadWakeWordsBrowserSTT?.[0]?.toUpperCase() || 'HEY VEE'}"`, }, ]);
async function handleMicButton() { /* ... as before ... */ let currentPerm = micPermissionStatus.value; if (currentPerm !== 'granted') { currentPerm = await checkCurrentPermission(); } if (currentPerm !== 'granted') { const accessGranted = await ensureMicrophoneAccessAndStream(); if (!accessGranted) { if (micPermissionStatus.value === 'prompt') { toast?.add({type: 'info', title: 'Microphone Permission', message: 'Please grant microphone access via the browser prompt.'}); } return; } await nextTick(); if (micPermissionStatus.value === 'granted' && !sttManager.isCurrentHandlerReady.value) { await sttManager.reinitializeActiveHandler(); } } if (micPermissionStatus.value !== 'granted') { return; } if (micButtonDisabled.value && !(isVoiceActivationMode.value && sttManager.isListeningForWakeWord.value) ) { return; } if (!sttManager.isCurrentHandlerReady.value) { toast?.add({type: 'warning', title: 'STT Not Ready', message: 'Speech services initializing. Please wait.'}); await sttManager.reinitializeActiveHandler(); return; } if (props.isProcessing && isVoiceActivationMode.value && sttManager.isListeningForWakeWord.value) { await sttManager.stopAll(); return; } if (isPttMode.value) { await sttManager.handlePttClick(); } else { if (sttManager.isProcessingAudio.value || sttManager.isListeningForWakeWord.value) { await sttManager.stopAll(); } else { await sttManager.startListening(false); } } }
function handleTextSubmit() { /* ... as before ... */ if (!textInput.value.trim() || props.isProcessing || isInputEffectivelyDisabled.value) { return; } emit('transcription', textInput.value.trim()); textInput.value = ''; nextTick(() => handleTextareaInput()); }
function handleTextareaInput() { /* ... as before ... */ if (!textareaRef.value) return; textareaRef.value.style.height = 'auto'; const maxHeightStyle = getComputedStyle(textareaRef.value).getPropertyValue('--height-voice-textarea-max'); const maxHeight = parseInt(maxHeightStyle || '150'); let newHeight = textareaRef.value.scrollHeight; textareaRef.value.style.height = `${Math.min(newHeight, maxHeight)}px`; }
function insertNewline() { /* ... as before ... */ if(textareaRef.value){ const { selectionStart, selectionEnd, value } = textareaRef.value; textInput.value = value.substring(0, selectionStart) + '\n' + value.substring(selectionEnd); nextTick(() => { if(textareaRef.value) textareaRef.value.selectionStart = textareaRef.value.selectionEnd = selectionStart + 1; handleTextareaInput(); }); } }
function selectAudioMode(mode: string) { /* ... as before ... */ if (settings.value.audioInputMode === mode as AudioInputMode) return; voiceSettingsManager.updateSetting('audioInputMode', mode as AudioInputMode); }
function toggleInputToolbar() { showInputToolbar.value = !showInputToolbar.value; }
function handleFileUpload(file: File) { /* ... as before ... */ toast?.add({type: 'info', title: 'File Upload', message: `${file.name} selected. UI processing TBD.`}); }
function handleSttEngineChange(engine: string) { /* ... as before ... */ if (settings.value.sttPreference === engine as STTPreference) return; voiceSettingsManager.updateSetting('sttPreference', engine as STTPreference); }

let voiceViz: ReturnType<typeof useVoiceVisualization> | null = null;
function setupVoiceVisualization() { /* ... as before ... */ if (!visualizationCanvasRef.value) { if (voiceViz) { voiceViz.stopVisualization(); voiceViz = null; } return; } if (activeStream.value && !voiceViz) { const initialVizConfig: VoiceVisualizationConfig = { visualizationType: 'circular', fftSize: 256, shapeColor: `hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l))`, globalVizAlpha: 0.7, circularPointCount: 60, circularAmplitudeFactor: 0.4, circularBaseRadiusFactor: 0.2, circularMaxExtensionRadius: 30, circularRotationSpeed: 0.003, circularPulseSpeed: 0.02, circularConnectionType: 'curve', circularPointSharpness: 0.3, lineWidth: 1.5, barCount: 24, }; voiceViz = useVoiceVisualization(activeStream, visualizationCanvasRef, initialVizConfig); } if (voiceViz) { if (isProminentVizActive.value && micPermissionStatus.value === 'granted') { let vizType: VoiceVisualizationConfig['visualizationType'] = 'circular'; let vizColor = `hsla(var(--color-voice-user-h), var(--color-voice-user-s), var(--color-voice-user-l), 0.85)`; let vizAlpha = 0.85, ampFactor = 0.5, baseRadiusFactor = 0.25, pulseSpeed = 0.02, vizLineWidth = 2; if (isVoiceActivationMode.value && sttManager.isListeningForWakeWord.value) { vizType = 'frequencyBars'; vizColor = `hsla(var(--color-accent-secondary-h), var(--color-accent-secondary-s), var(--color-accent-secondary-l), 0.7)`; vizAlpha = 0.7; } else if (sttManager.isProcessingAudio.value) { vizColor = `hsla(var(--color-voice-user-h), var(--color-voice-user-s), var(--color-voice-user-l), ${vizAlpha})`; if (isContinuousMode.value && isInputEffectivelyDisabled.value) { vizType = 'circular'; ampFactor = 0.6; baseRadiusFactor = 0.3; pulseSpeed = 0.025; vizLineWidth = 2.5; } else { vizType = 'waveform'; vizLineWidth = 2.5; } } else if (props.isProcessing) { vizType = 'circular'; vizColor = `hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.5)`; vizAlpha = 0.4; ampFactor = 0.2; baseRadiusFactor = 0.15; pulseSpeed = 0.01; vizLineWidth = 1.5; } voiceViz.updateConfig({ visualizationType: vizType, shapeColor: vizColor, globalVizAlpha: vizAlpha, circularAmplitudeFactor: ampFactor, circularBaseRadiusFactor: baseRadiusFactor, circularPulseSpeed: pulseSpeed, lineWidth: vizLineWidth }); if (!voiceViz.isVisualizing.value) voiceViz.startVisualization(); } else if (props.isProcessing && voiceViz.isVisualizing.value && !isProminentVizActive.value) { voiceViz.updateConfig({ shapeColor: `hsla(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l), 0.2)`, globalVizAlpha: 0.2, visualizationType: 'circular', circularAmplitudeFactor: 0.1, circularBaseRadiusFactor: 0.1, circularPulseSpeed: 0.005, lineWidth: 1 }); if (!voiceViz.isVisualizing.value) voiceViz.startVisualization(); } else { if (voiceViz.isVisualizing.value) voiceViz.stopVisualization(); } } }

let vizSetupDebounceTimer: number | null = null;
watch([() => sttManager?.isProcessingAudio?.value, () => sttManager?.isListeningForWakeWord?.value, micPermissionStatus, () => props.isProcessing, activeStream, visualizationCanvasRef, currentAudioMode, sttPreference,], () => { if (vizSetupDebounceTimer) clearTimeout(vizSetupDebounceTimer); vizSetupDebounceTimer = window.setTimeout(() => { if (isComponentMountedAndReady.value && visualizationCanvasRef.value && sttManager && typeof sttManager.isProcessingAudio !== 'undefined' && typeof sttManager.isListeningForWakeWord !== 'undefined') { setupVoiceVisualization(); } }, 100); }, { deep: false });

onMounted(async () => {
  console.log('[VoiceInput Module - VoiceInput.vue] Mounted.');
  if (!voiceSettingsManager.isInitialized.value) {
    await voiceSettingsManager.initialize();
  }
  if (typeof window !== 'undefined' && window.AudioContext) {
    await loadAudioBeeps(); // Load audio beeps using imported URLs
  } else {
    console.warn("[VoiceInput] AudioContext not available on mount. UI Sounds disabled.");
  }
  const initialPerm = await checkCurrentPermission();
  console.log(`[VoiceInput Mounted] Initial mic perm: ${initialPerm}. Manager STT target ready: ${sttManager.isCurrentHandlerReady.value}`);
  handleTextareaInput(); // Initial height adjustment

  setTimeout(async () => {
    isComponentMountedAndReady.value = true;
    console.log('[VoiceInput] Component marked as ready.');
    if (visualizationCanvasRef.value && sttManager) {
        setupVoiceVisualization();
    }
    if (micPermissionStatus.value === 'granted' && (isContinuousMode.value || isVoiceActivationMode.value)) {
        if (sttManager.isCurrentHandlerReady.value) {
            console.log('[VoiceInput Mounted & Ready] Mic granted, handler ready. Manager evaluating auto-start.');
        } else {
            console.log('[VoiceInput Mounted & Ready] Mic granted, but STT handler not yet ready. Manager onReady/watchers will handle auto-start.');
        }
    }
  }, 750);
});

onBeforeUnmount(async () => { console.log('[VoiceInput Module - VoiceInput.vue] Unmounting.'); isComponentMountedAndReady.value = false; if (vizSetupDebounceTimer) clearTimeout(vizSetupDebounceTimer); await sttManager.stopAll(); if (sttManager.cleanup) { sttManager.cleanup(); } await releaseAllMicrophoneResources(); if (voiceViz) { voiceViz.stopVisualization(); voiceViz = null; } if (audioContextForBeeps.value && audioContextForBeeps.value.state !== 'closed') { audioContextForBeeps.value.close().catch(e => console.warn("Error closing beep audio context on unmount:", e)); } });

</script>