// File: frontend/src/components/voice-input/VoiceInput.vue
<template>
  <div
    ref="voiceInputPanelRef"
    class="voice-input-panel"
    :class="[
      stateClass,
      modeClass,
      { 'vi-wide': isWideScreen }
    ]"
    :data-theme="uiStore.theme?.id || 'sakura-sunset'"
  >
    <div class="vi-background-layers">
      <div class="vi-orb vi-orb-1"></div>
      <div class="vi-orb vi-orb-2"></div>
      <div class="vi-orb vi-orb-3"></div>
      <div class="vi-gradient-bg" />
    </div>

    <canvas
      v-show="isVisualizationActive"
      ref="visualizationCanvasRef"
      class="vi-visualization-canvas"
      :class="{
        'viz-active': isVisualizationActive,
        'viz-listening': isListeningForWakeWord,
        'viz-recording': isActive && !isListeningForWakeWord
      }"
    />

    <transition name="status-slide">
      <div v-if="currentHint || statusText" class="vi-status-bar">
        <div class="vi-status-content">
          <span v-if="currentHint" class="vi-hint" :class="`vi-hint-${currentHint.type}`">
            <span class="vi-hint-icon">{{ getHintIcon(currentHint.type) }}</span>
            <span class="vi-hint-text">{{ currentHint.text }}</span>
          </span>
          <span v-else class="vi-status-text" v-html="statusText"></span>
        </div>
      </div>
    </transition>

    <div class="vi-controls-wrapper">
      <button
        ref="micButtonRef"
        @click="handleMicButtonClick"
        @mousedown="handleMicMouseDown"
        @mouseup="handleMicMouseUp"
        @mouseleave="handleMicMouseUp"
        @touchstart.passive="handleMicMouseDown"
        @touchend.passive="handleMicMouseUp"
        :disabled="micButtonDisabled"
        class="vi-mic-button"
        :class="{
          'vi-mic-active': isActive,
          'vi-mic-listening': isListeningForWakeWord,
          'vi-mic-holding': isPttHolding,
          'vi-mic-error': hasMicError,
          'vi-mic-processing': props.isProcessingLLM && !isActive && !isListeningForWakeWord
        }"
        :aria-label="micButtonAriaLabel"
      >
        <svg class="vi-mic-icon" viewBox="0 0 100 100">
          <defs>
            <linearGradient :id="`micGradientVoiceInput_${instanceId}`" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" :stop-color="micGradientStart" />
              <stop offset="100%" :stop-color="micGradientEnd" />
            </linearGradient>
            <filter :id="`micGlowVoiceInput_${instanceId}`">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g :filter="`url(#micGlowVoiceInput_${instanceId})`">
            <path d="M50 15 C40 15 33 22 33 32 L33 45 C33 55 40 62 50 62 C60 62 67 55 67 45 L67 32 C67 22 60 15 50 15 Z"
                  :fill="`url(#micGradientVoiceInput_${instanceId})`"
                  :stroke="micStrokeColor"
                  stroke-width="2"/>
            <path d="M35 45 L35 50 C35 60 42 67 50 67 C58 67 65 60 65 50 L65 45"
                  fill="none" :stroke="micStrokeColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="50" y1="67" x2="50" y2="78" :stroke="micStrokeColor" stroke-width="2"/>
            <line x1="42" y1="78" x2="58" y2="78" :stroke="micStrokeColor" stroke-width="2"/>
          </g>
        </svg>
        <svg class="vi-mic-rings" viewBox="0 0 120 120">
          <circle v-for="i in 3" :key="`ring-${i}`"
            cx="60" cy="60" :r="25 + (i * 12)" fill="none" :stroke="ringColor"
            :stroke-opacity="0.4 - (i * 0.1)" :stroke-width="2.5 - (i * 0.5)"
            :style="{ animationDelay: `${i * 0.15}s`, animationDuration: `${2 + (i * 0.3)}s` }"
          />
        </svg>
        <transition name="timer-fade">
          <div v-if="isPttHolding && pttDuration > 0" class="vi-ptt-timer">
            {{ formatDuration(pttDuration) }}
          </div>
        </transition>
      </button>

      <transition name="fade">
        <AudioModeDropdown
          v-if="!props.isProcessingLLM || currentAudioMode === 'push-to-talk'"
          :current-mode="currentAudioMode"
          :options="audioModeOptions"
          :disabled="isActive || isListeningForWakeWord"
          @select-mode="handleAudioModeChange"
          class="vi-mode-selector"
        />
      </transition>

      <transition name="fade">
        <div v-if="displayTranscriptionText && currentSettings.showLiveTranscription" class="vi-live-transcription">
          <span class="vi-transcription-text">{{ displayTranscriptionText }}</span>
          <span v-if="!transcriptionIsFinal" class="vi-transcription-cursor"></span>
        </div>
      </transition>
    </div>

    <div class="vi-input-wrapper" :class="{ 'vi-input-disabled': isInputEffectivelyDisabled }">
      <div class="vi-input-container">
        <textarea
          ref="textareaRef"
          v-model="sharedState.textInput.value"
          @input="handleTextareaInput"
          @keydown.enter.exact.prevent="handleTextSubmit"
          @keydown.enter.shift.prevent="insertNewline"
          :placeholder="inputPlaceholder"
          :disabled="isInputEffectivelyDisabled"
          class="vi-textarea" rows="1"
        />
        <transition name="scale">
          <button
            v-if="canSendMessage"
            @click="handleTextSubmit"
            class="vi-send-button" aria-label="Send message"
          >
            <svg viewBox="0 0 24 24" class="vi-send-icon">
              <defs>
                <linearGradient :id="`sendGradVoiceInput_${instanceId}`" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" :stop-color="sendGradientStart" />
                  <stop offset="100%" :stop-color="sendGradientEnd" />
                </linearGradient>
              </defs>
              <path :fill="`url(#sendGradVoiceInput_${instanceId})`" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </transition>
      </div>
      <button
        @click="toggleToolbar"
        class="vi-settings-button"
        :class="{ 'vi-settings-active': sharedState.showInputToolbar.value }"
        aria-label="Voice settings"
        :disabled="props.isProcessingLLM && !isActive && !isListeningForWakeWord"
      >
        <svg viewBox="0 0 24 24" class="vi-settings-icon">
          <path fill="currentColor" d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97L21.54,14.63C21.73,14.78 21.78,15.05 21.66,15.27L19.66,18.73C19.55,18.95 19.28,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.48,18.68 14.87,18.93L14.49,21.58C14.46,21.82 14.25,22 14,22H10C9.75,22 9.54,21.82 9.51,21.58L9.13,18.93C8.52,18.68 7.96,18.34 7.44,17.95L4.95,18.95C4.72,19.04 4.45,18.95 4.34,18.73L2.34,15.27C2.22,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11.03L2.46,9.37C2.27,9.22 2.22,8.95 2.34,8.73L4.34,5.27C4.45,5.05 4.72,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.52,5.32 9.13,5.07L9.51,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.49,2.42L14.87,5.07C15.48,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.28,4.96 19.55,5.05 19.66,5.27L21.66,8.73C21.78,8.95 21.73,9.22 21.54,9.37L19.43,11.03L19.5,12L19.43,12.97Z" />
        </svg>
      </button>
    </div>

    <transition name="toolbar-slide">
      <div v-if="sharedState.showInputToolbar.value" class="vi-toolbar-wrapper">
        <InputToolbar
          :stt-engine-options="sttEngineOptions"
          :current-stt-engine-prop="currentSettings.sttPreference"
          :live-transcription-enabled-prop="currentSettings.showLiveTranscription ?? false"
          :features="{ textUpload: true, imageUpload: false }"
          @file-upload="handleFileUpload"
          @stt-engine-change="handleSttEngineChange"
          @toggle-live-transcription="handleToggleLiveTranscription"
          @close-toolbar="sharedState.showInputToolbar.value = false"
          class="vi-toolbar"
        />
      </div>
    </transition>

    <transition name="preview-modal">
      <div v-if="pttPreview" class="vi-ptt-preview-modal">
        <div class="vi-preview-backdrop" @click="closePttPreview"></div>
        <div class="vi-preview-content">
          <div class="vi-preview-header">
            <h3>Review Recording</h3>
            <button @click="closePttPreview" class="vi-preview-close"><XMarkIcon class="icon-sm" /></button>
          </div>
          <div class="vi-preview-body">
            <div class="vi-preview-transcript"><p>{{ pttPreview.transcript || 'Processing...' }}</p></div>
            <canvas ref="pttWaveformCanvasRef" class="vi-preview-waveform" />
            <div class="vi-preview-duration"><span>{{ formatDuration(pttPreview.duration) }}</span></div>
          </div>
          <div class="vi-preview-actions">
            <button @click="playPttRecording" class="vi-preview-btn vi-preview-play" :disabled="!pttPreview.audioBuffer">
              <PlayIcon v-if="!pttPreview.isPlaying" class="icon-sm" /><PauseIcon v-else class="icon-sm" />
              <span>{{ pttPreview.isPlaying ? 'Pause' : 'Play' }}</span>
            </button>
            <button @click="rerecordPtt" class="vi-preview-btn vi-preview-retry">
              <ArrowPathIcon class="icon-sm" /><span>Re-record</span>
            </button>
            <button @click="sendPttRecording" class="vi-preview-btn vi-preview-send" :disabled="!pttPreview.transcript">
              <PaperAirplaneIcon class="icon-sm" /><span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <BrowserSpeechHandler
      v-if="shouldShowBrowserHandler"
      :settings="currentSettings"
      :audio-input-mode="currentAudioMode"
      :parent-is-processing-l-l-m="props.isProcessingLLM"
      :current-mic-permission="micPermissionStatus"
      @handler-ready="onHandlerReady"
      @handler-unmounted="onHandlerUnmounted"
      @transcription="onTranscription"
      @wake-word-detected="onWakeWordDetected"
      @listening-for-wake-word="onListeningForWakeWord"
      @processing-audio="onProcessingAudio"
      @error="onSttError"
      @ptt-audio-ready="onPttAudioReady"
    />
    <WhisperSpeechHandler
      v-if="shouldShowWhisperHandler"
      :settings="currentSettings"
      :audio-input-mode="currentAudioMode"
      :parent-is-processing-l-l-m="props.isProcessingLLM"
      :current-mic-permission="micPermissionStatus"
      :active-stream="microphoneManager.activeStream.value"
      :analyser="microphoneManager.analyser.value"
      @handler-ready="onHandlerReady"
      @handler-unmounted="onHandlerUnmounted"
      @transcription="onTranscription"
      @processing-audio="onProcessingAudio"
      @error="onSttError"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * @file VoiceInput.vue
 * @description Main UI component for voice and text input, managing STT handlers, modes, and visualizations.
 * @version 2.1.0
 * @updated 2025-06-05 - All TypeScript errors addressed. Visualization integration refined.
 * - Added mode-specific CSS class. Settings access corrected.
 */
import { ref, computed, onMounted, onBeforeUnmount, inject, watch, nextTick, type Ref, getCurrentInstance, readonly } from 'vue';
import { voiceSettingsManager, type AudioInputMode, type STTPreference, type VoiceApplicationSettings } from '@/services/voice.settings.service';
import type { ToastService } from '@/services/services';
import { useUiStore } from '@/store/ui.store';

// Composables
import { useVoiceInputState, resetVoiceInputState } from './composables/shared/useVoiceInputState';
import { useTranscriptionDisplay } from './composables/shared/useTranscriptionDisplay';
import { useAudioFeedback } from './composables/shared/useAudioFeedback';
import { useMicrophone } from './composables/useMicrophone';
import { useSttManager } from './composables/useSttManager';
import { useVoiceVisualization, type VoiceVisualizationConfig, type StaticWaveformConfig } from '@/composables/useVoiceVisualization';

// Components
import BrowserSpeechHandler from './handlers/BrowserSpeechHandler.vue';
import WhisperSpeechHandler from './handlers/WhisperSpeechHandler.vue';
import AudioModeDropdown from './components/AudioModeDropdown.vue';
import InputToolbar from './components/InputToolbar.vue';

// Icons
import {
  XMarkIcon, PaperAirplaneIcon, PlayIcon, PauseIcon, ArrowPathIcon
} from '@heroicons/vue/24/outline';

// Import styles
import './styles/voice-input.scss';

// Types
import type {
    SttHandlerInstance,
    TranscriptionData,
    SttEngineOption,
    SttHandlerErrorPayload,
    AudioModeOption as UIAudioModeOption,
    MicPermissionStatusType // Correctly imported from types
} from './types';

/**
 * @typedef SttInternalHandlerId
 * @description Defines the internal keys used by STT handlers when emitting events for registration.
 */
type SttInternalHandlerId = 'browser' | 'whisper';

interface Hint {
  text: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface PttPreview {
  transcript: string;
  audioBlob?: Blob;
  audioBuffer?: AudioBuffer;
  duration: number; // in ms
  isPlaying: boolean;
}

const props = defineProps<{
  isProcessingLLM: boolean;
}>();

const emit = defineEmits<{
  (e: 'transcription-ready', value: string): void;
  (e: 'permission-update', status: MicPermissionStatusType): void;
  (e: 'stt-processing-audio', isProcessing: boolean): void;
  (e: 'voice-input-error', error: SttHandlerErrorPayload): void;
  (e: 'file-selected', file: File): void;
}>();

const toast = inject<ToastService>('toast');
const uiStore = useUiStore();
const instanceId = ref(getCurrentInstance()?.uid || Math.random().toString(36).substring(7));


const voiceInputPanelRef = ref<HTMLElement>();
const textareaRef = ref<HTMLTextAreaElement>();
const visualizationCanvasRef = ref<HTMLCanvasElement | null>(null);
const micButtonRef = ref<HTMLButtonElement>();
const pttWaveformCanvasRef = ref<HTMLCanvasElement | null>(null);

// Corrected: voiceSettingsManager.settings is the reactive object.
// Create a computed ref to it if it needs to be passed reactively to deep children or watched.
// For local template and direct composable use, direct access or specific computed props are fine.
const currentSettings = voiceSettingsManager.settings; // Direct reactive object
const settingsRef = computed(() => voiceSettingsManager.settings); // As a Ref for props if needed by children

const currentAudioMode = computed(() => currentSettings.audioInputMode);

const micPermissionStatus = ref<MicPermissionStatusType>('');
const isWideScreen = ref(typeof window !== 'undefined' ? window.innerWidth > 1024 : false);
const isPttHolding = ref(false);
const pttStartTime = ref(0);
const currentHint = ref<Hint | null>(null);
const pttPreview = ref<PttPreview | null>(null);
const displayTranscriptionText = ref('');
const transcriptionIsFinal = ref(true);

let hintTimeout: number | null = null;
let transcriptionTimeout: number | null = null;
let resizeObserver: ResizeObserver | null = null;
let pttAudioSourceNode: AudioBufferSourceNode | null = null;


const sharedState = useVoiceInputState(
  currentAudioMode,
  computed(() => props.isProcessingLLM),
  micPermissionStatus as Ref<string> // Cast for useVoiceInputState if it expects Ref<string>
);

const microphoneManager = useMicrophone({
  settings: settingsRef, // Pass the Ref<VoiceApplicationSettings>
  toast,
  onPermissionUpdateGlobally: (status) => {
    micPermissionStatus.value = status;
    emit('permission-update', status);
  },
});

const audioFeedback = useAudioFeedback({
  // These now correctly use the added properties from VoiceApplicationSettings
  volume: computed(() => currentSettings.uiSoundVolume ?? 0.7),
  enabled: computed(() => currentSettings.enableUiSounds ?? true)
});

const transcriptionDisplay = useTranscriptionDisplay({ sharedState });

const sttManager = useSttManager({
  audioMode: currentAudioMode,
  settings: settingsRef, // Pass the Ref<VoiceApplicationSettings>
  sharedState,
  micPermissionStatus: micPermissionStatus as Ref<string>,
  isProcessingLLM: computed(() => props.isProcessingLLM),
  audioFeedback,
  transcriptionDisplay,
  emit: (event: string, ...args: any[]) => {
    if (event === 'transcription-ready') {
      emit('transcription-ready', args[0] as string);
    } else if (event === 'voice-input-error') {
      emit('voice-input-error', args[0] as SttHandlerErrorPayload);
    }
  },
  toast,
});

let voiceViz: ReturnType<typeof useVoiceVisualization> | null = null;

const isActive = computed(() => sttManager.isActive.value);
const isListeningForWakeWord = computed(() => sttManager.isListeningForWakeWord.value);
const isVisualizationActive = computed(() => isActive.value || isListeningForWakeWord.value);

const hasMicError = computed(() =>
  micPermissionStatus.value === 'denied' ||
  micPermissionStatus.value === 'error'
);

const micButtonDisabled = computed(() =>
  hasMicError.value ||
  (props.isProcessingLLM && !isListeningForWakeWord.value && currentAudioMode.value !== 'push-to-talk') ||
  sharedState.isInputEffectivelyDisabled.value
);

const micButtonAriaLabel = computed(() => {
  if (hasMicError.value) return 'Microphone access denied';
  if (isActive.value) return currentAudioMode.value === 'push-to-talk' ? 'Release to stop recording' : 'Stop recording';
  if (isListeningForWakeWord.value) return 'Listening for wake word';
  return currentAudioMode.value === 'push-to-talk' ? 'Hold to record' : 'Start recording';
});

const isInputEffectivelyDisabled = computed(() => sharedState.isInputEffectivelyDisabled.value);

const inputPlaceholder = computed(() => {
  if (props.isProcessingLLM && !isActive.value && !isListeningForWakeWord.value) return 'Assistant is thinking...';
  if (currentAudioMode.value === 'continuous' && isActive.value) return 'Listening... Text input disabled.';
  return sttManager.placeholderText.value || 'Type a message or use voice...';
});

const canSendMessage = computed(() =>
  sharedState.textInput.value.trim() &&
  !props.isProcessingLLM &&
  !isInputEffectivelyDisabled.value
);

const statusText = computed(() => sttManager.statusText.value);

const stateClass = computed(() => {
  if (props.isProcessingLLM && !isListeningForWakeWord.value && !isActive.value) return 'state-llm-processing';
  if (isActive.value) return 'state-stt-active';
  if (isListeningForWakeWord.value) return 'state-vad-listening';
  return 'state-idle';
});

const modeClass = computed(() => `vi-mode-${currentAudioMode.value.replace(/_/g, '-')}`);


const pttDuration = computed(() => {
  if (!isPttHolding.value || !pttStartTime.value) return 0;
  return Date.now() - pttStartTime.value;
});

const shouldShowBrowserHandler = computed(() =>
  currentSettings.sttPreference === 'browser_webspeech_api'
);

const shouldShowWhisperHandler = computed(() =>
  currentSettings.sttPreference === 'whisper_api'
);

const micGradientStart = computed(() => `var(--vi-mic-gradient-${stateClass.value}-start, var(--color-accent-primary))`);
const micGradientEnd = computed(() => `var(--vi-mic-gradient-${stateClass.value}-end, var(--color-accent-secondary))`);
const micStrokeColor = computed(() => `var(--vi-mic-stroke-${stateClass.value}, var(--color-text-on-primary))`);
const ringColor = computed(() => `var(--vi-ring-${stateClass.value}, var(--color-accent-primary))`);

const sendGradientStart = computed(() => 'var(--color-accent-primary)');
const sendGradientEnd = computed(() => 'var(--color-accent-secondary)');

const audioModeOptions = computed<UIAudioModeOption[]>(() => [
  { label: 'Push to Talk', value: 'push-to-talk', icon: '🖐️', description: 'Hold mic to speak' },
  { label: 'Continuous', value: 'continuous', icon: '🌊', description: 'Listens continuously' },
  { label: 'Voice Activate', value: 'voice-activation', icon: '🗣️', description: 'Activate with wake word' },
]);

const sttEngineOptions = computed<SttEngineOption[]>(() => [
  { label: 'Browser STT', value: 'browser_webspeech_api', description: 'Uses built-in browser speech recognition.' },
  { label: 'Whisper API', value: 'whisper_api', description: 'Uses OpenAI Whisper API for higher accuracy.' },
]);

function getHintIcon(type: Hint['type']): string {
  switch (type) {
    case 'success': return '✓';
    case 'warning': return '⚠';
    case 'error': return '✕';
    default: return 'ℹ';
  }
}

function showHint(text: string, type: Hint['type'] = 'info', duration: number = 4000) {
  if (hintTimeout) clearTimeout(hintTimeout);
  currentHint.value = { text, type };
  hintTimeout = window.setTimeout(() => {
    currentHint.value = null;
  }, duration);
}

function showLiveTranscription(text: string, isFinal: boolean = true) {
  if (transcriptionTimeout && isFinal) clearTimeout(transcriptionTimeout);
  displayTranscriptionText.value = text;
  transcriptionIsFinal.value = isFinal;

  if (isFinal && text) {
    transcriptionTimeout = window.setTimeout(() => {
      displayTranscriptionText.value = '';
    }, 3000);
  } else if (!text && isFinal) {
      displayTranscriptionText.value = '';
  }
}

async function handleMicButtonClick() {
  if (currentAudioMode.value === 'push-to-talk' && isPttHolding.value) return;

  const audioCtx = audioFeedback.audioContext.value;
  if (audioCtx?.state === 'suspended') await audioCtx.resume();

  const hasPermission = await microphoneManager.ensureMicrophoneAccessAndStream();
  if (!hasPermission) {
    showHint('🎤 Microphone access is required.', 'error');
    return;
  }
  await sttManager.handleMicButtonClick();
}

function handleMicMouseDown() {
  if (currentAudioMode.value === 'push-to-talk' && !isActive.value && !micButtonDisabled.value) {
    isPttHolding.value = true;
    pttStartTime.value = Date.now();
    handleMicButtonClick();
  }
}

async function handleMicMouseUp() {
  if (currentAudioMode.value === 'push-to-talk' && isPttHolding.value) {
    isPttHolding.value = false;
    pttStartTime.value = 0;
    if (isActive.value && sttManager.currentModeInstance.value) {
      await sttManager.currentModeInstance.value.stop();
    }
  }
}

function handleTextareaInput() {
  if (!textareaRef.value) return;
  const el = textareaRef.value;
  el.style.height = 'auto';
  const maxHeight = parseInt(window.getComputedStyle(el).maxHeight, 10) || 120;
  el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
}

function insertNewline() {
  if (textareaRef.value) {
    const { selectionStart, selectionEnd, value } = textareaRef.value;
    const newValue = value.substring(0, selectionStart) + '\n' + value.substring(selectionEnd);
    sharedState.textInput.value = newValue;
    nextTick(() => {
      if (textareaRef.value) {
        textareaRef.value.selectionStart = textareaRef.value.selectionEnd = selectionStart + 1;
        handleTextareaInput();
      }
    });
  }
}

function handleTextSubmit() {
  const text = sharedState.textInput.value.trim();
  if (!text || props.isProcessingLLM) return;
  emit('transcription-ready', text);
  sharedState.textInput.value = '';
  if (textareaRef.value) textareaRef.value.style.height = 'auto';
  toast?.add({ type: 'success', title: 'Sent', message: 'Text message submitted.' });
}

async function handleAudioModeChange(mode: AudioInputMode) {
  await voiceSettingsManager.updateSetting('audioInputMode', mode);
  audioFeedback.playSound(audioFeedback.beepNeutralSound.value, 0.5);
  let hintText = '';
  switch(mode) {
    case 'push-to-talk': hintText = '🎙️ Push-to-Talk: Hold mic to record.'; break;
    case 'continuous': hintText = '🎤 Continuous: Press mic to start/stop.'; break;
    case 'voice-activation':
      const wakeWord = currentSettings.vadWakeWordsBrowserSTT?.[0] || 'your wake word';
      hintText = `👂 VAD: Say "${wakeWord}" to activate.`; break;
  }
  showHint(hintText, 'info', 5000);
}

function toggleToolbar() {
  sharedState.showInputToolbar.value = !sharedState.showInputToolbar.value;
  audioFeedback.playSound(audioFeedback.beepNeutralSound.value, 0.3);
}

async function handleFileUpload(payload: { type: string; file: File }) {
  if (payload.type === 'text') {
    try {
      const text = await payload.file.text();
      sharedState.textInput.value = text;
      toast?.add({type: 'success', title: 'File Loaded', message: `Loaded ${payload.file.name}`});
      nextTick(() => { if (textareaRef.value) handleTextareaInput(); });
      emit('file-selected', payload.file);
    } catch (error) {
      toast?.add({type: 'error', title: 'Load Error', message: 'Failed to load text file.'});
    }
  }
  sharedState.showInputToolbar.value = false;
}

async function handleSttEngineChange(engine: STTPreference) {
  await voiceSettingsManager.updateSetting('sttPreference', engine);
  toast?.add({type: 'success', title: 'STT Engine Changed', message: `Switched to ${engine === 'browser_webspeech_api' ? 'Browser' : 'Whisper'} STT`});
}

async function handleToggleLiveTranscription(enabled: boolean) {
  await voiceSettingsManager.updateSetting('showLiveTranscription', enabled);
  toast?.add({type: 'info', title: 'Live Transcription', message: enabled ? 'Enabled' : 'Disabled'});
}

async function onPttAudioReady(data: { transcript: string; duration: number; blob?: Blob }) {
  if (!data.blob) {
    if (data.transcript) {
        emit('transcription-ready', data.transcript);
        toast?.add({type: 'success', title: 'PTT Sent', message: 'Transcript sent (no audio preview).'});
    } else {
        toast?.add({type: 'warning', title: 'PTT Issue', message: 'No audio recorded for preview.'});
    }
    return;
  }
  try {
    const audioCtx = audioFeedback.audioContext.value;
    const audioBuffer = audioCtx ? await audioCtx.decodeAudioData(await data.blob.arrayBuffer()) : undefined;
    pttPreview.value = { ...data, audioBuffer, isPlaying: false };

    if (pttWaveformCanvasRef.value && audioBuffer && voiceViz) {
      voiceViz.drawStaticWaveform(pttWaveformCanvasRef.value, audioBuffer, {
          waveColor: 'var(--color-accent-primary)', lineWidth: 2, density: 0.5
      });
    }
  } catch (error) {
      console.error("Error processing PTT audio for preview:", error);
      toast?.add({ type: 'error', title: 'Preview Error', message: 'Could not prepare audio preview.' });
      if (data.transcript) emit('transcription-ready', data.transcript);
  }
}

function closePttPreview() {
  if (pttPreview.value?.isPlaying && pttAudioSourceNode) {
    pttAudioSourceNode.stop(); pttAudioSourceNode.disconnect(); pttAudioSourceNode = null;
  }
  pttPreview.value = null;
}

async function playPttRecording() {
  if (!pttPreview.value?.audioBuffer || !audioFeedback.audioContext.value) return;
  const audioCtx = audioFeedback.audioContext.value;
  if (pttPreview.value.isPlaying && pttAudioSourceNode) {
    pttAudioSourceNode.stop(); pttAudioSourceNode.disconnect(); pttAudioSourceNode = null;
    pttPreview.value.isPlaying = false;
  } else {
    pttAudioSourceNode = audioCtx.createBufferSource();
    pttAudioSourceNode.buffer = pttPreview.value.audioBuffer;
    pttAudioSourceNode.connect(audioCtx.destination);
    pttAudioSourceNode.onended = () => {
      if (pttPreview.value) pttPreview.value.isPlaying = false;
      pttAudioSourceNode?.disconnect(); pttAudioSourceNode = null;
    };
    pttAudioSourceNode.start();
    pttPreview.value.isPlaying = true;
  }
}

function rerecordPtt() {
  closePttPreview();
  showHint('Ready to record again', 'info');
  if (micButtonRef.value) {
      micButtonRef.value.dispatchEvent(new MouseEvent('mousedown'));
  }
}

function sendPttRecording() {
  if (!pttPreview.value?.transcript) return;
  emit('transcription-ready', pttPreview.value.transcript);
  toast?.add({type: 'success', title: 'PTT Sent', message: 'Recording submitted.'});
  closePttPreview();
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function onHandlerReady(handlerId: SttInternalHandlerId, api: SttHandlerInstance) {
  sttManager.registerHandler(handlerId, api);
}
function onHandlerUnmounted(handlerId: SttInternalHandlerId) {
  sttManager.unregisterHandler(handlerId);
}

function onTranscription(data: TranscriptionData) {
  if (currentSettings.showLiveTranscription || data.isFinal) {
    showLiveTranscription(data.text, data.isFinal);
  }
  sttManager.handleTranscriptionFromHandler(data.text, data.isFinal);
  if (data.isFinal && currentAudioMode.value !== 'push-to-talk' && data.text.trim()) {
    audioFeedback.playSound(audioFeedback.beepOutSound.value, 0.5);
  }
}

function onWakeWordDetected() {
  audioFeedback.playSound(audioFeedback.beepInSound.value);
  showHint('Wake word detected!', 'success', 1500);
  sttManager.handleWakeWordDetectedFromHandler();
}
function onListeningForWakeWord(isListening: boolean) {
  if (isListening && !sharedState.isListeningForWakeWord.value && !props.isProcessingLLM) {
     const wakeWord = currentSettings.vadWakeWordsBrowserSTT?.[0] || 'your wake word';
    showHint(`👂 Listening for "${wakeWord}"...`, 'info', 0);
  } else if (!isListening && currentHint.value?.text.startsWith('👂 Listening for')) {
    currentHint.value = null;
  }
  sharedState.isListeningForWakeWord.value = isListening;
  emit('stt-processing-audio', isListening);
}
function onProcessingAudio(isProcessing: boolean) {
  sharedState.isProcessingAudio.value = isProcessing;
  emit('stt-processing-audio', isProcessing);
}
function onSttError(error: SttHandlerErrorPayload) {
  if (!error.fatal && (error.code === 'no-speech' || error.code === 'aborted' || error.message?.includes('aborted by the user'))) {
    if (currentAudioMode.value !== 'continuous') {
        transcriptionDisplay.showError('No speech detected or cancelled.', 1500);
    }
    return;
  }
  console.error('[VoiceInput] STT Error:', error);
  if (error.type === 'permission' || error.code === 'mic-permission-denied') {
    showHint('🎤 Microphone access required.', 'error');
  } else if (error.fatal) {
    showHint(error.message || 'Voice input error. Please try again.', 'error');
  } else {
    showHint(error.message || 'Voice input issue.', 'warning');
  }
  emit('voice-input-error', error);
}

function updateCanvasSize() {
  if (!visualizationCanvasRef.value || !voiceInputPanelRef.value) return;
  const panelRect = voiceInputPanelRef.value.getBoundingClientRect();
  visualizationCanvasRef.value.width = panelRect.width;
  visualizationCanvasRef.value.height = panelRect.height;
   if (voiceViz) {
    voiceViz.resizeCanvas(panelRect.width, panelRect.height);
  }
}

function setupVisualization() {
  if (!visualizationCanvasRef.value || !microphoneManager.activeStream.value) return;
  if (voiceViz && voiceViz.isVisualizing.value) voiceViz.stopVisualization();

  const vizTypeConfig: Partial<VoiceVisualizationConfig> = {};
  let vizType: VoiceVisualizationConfig['visualizationType'] = 'frequencyBars';

  const baseShapeColor = isActive.value ? 'var(--color-voice-user)' : 'var(--color-accent-interactive)';
  const baseGlowColor = isActive.value ? 'var(--color-voice-user-secondary)' : 'var(--color-accent-interactive-secondary)';

  if (currentAudioMode.value === 'voice-activation') {
    vizType = 'circularPulse';
    Object.assign(vizTypeConfig, {
      shapeColor: isListeningForWakeWord.value ? 'var(--color-accent-interactive)' : 'var(--color-voice-user)',
      glowColor: isListeningForWakeWord.value ? 'var(--color-accent-interactive-secondary)' : 'var(--color-voice-user-secondary)',
      lineWidth: 3, pulseFactor: 0.4, circularBaseRadiusFactor: 0.2,
    });
  } else if (currentAudioMode.value === 'continuous') {
    vizType = 'radiantWave';
     Object.assign(vizTypeConfig, {
      waveColor: baseShapeColor, glowColor: baseGlowColor, lineWidth: 2,
      amplitude: 60, frequency: 0.035, lineCount: 6,
    });
  } else {
    vizType = 'frequencyBars';
     Object.assign(vizTypeConfig, {
      shapeColor: baseShapeColor, glowColor: baseGlowColor,
    });
  }

  voiceViz = useVoiceVisualization(
    microphoneManager.activeStream,
    visualizationCanvasRef as Ref<HTMLCanvasElement>,
    {
      visualizationType: vizType,
      globalVizAlpha: 0.9, // Brighter base alpha
      ...vizTypeConfig,
      shapeColor: vizTypeConfig.shapeColor || baseShapeColor,
      glowColor: vizTypeConfig.glowColor || baseGlowColor,
      waveColor: vizTypeConfig.waveColor || baseShapeColor,
    }
  );
  updateCanvasSize();
  voiceViz.startVisualization();
}

watch([isVisualizationActive, () => microphoneManager.activeStream.value, currentAudioMode], ([vizActive, stream, _mode]) => {
  if (vizActive && stream && visualizationCanvasRef.value) {
    setupVisualization();
  } else if (voiceViz?.isVisualizing.value) {
    voiceViz.stopVisualization();
  }
}, { deep: false });

watch(isActive, (newIsActive) => {
  if (voiceViz && voiceViz.isVisualizing.value && voiceViz.currentConfig.value) { // Added null check for currentConfig.value
    const newShapeColor = newIsActive ? 'var(--color-voice-user)' : 'var(--color-accent-interactive)';
    const newGlowColor = newIsActive ? 'var(--color-voice-user-secondary)' : 'var(--color-accent-interactive-secondary)';
    const currentVizType = voiceViz.currentConfig.value.visualizationType;

    voiceViz.updateConfig({
      shapeColor: newShapeColor,
      glowColor: newGlowColor,
      ...(currentVizType === 'frequencyBars' && { /* barColor: newShapeColor, capColor: newGlowColor */ }),
      ...(currentVizType === 'radiantWave' && { waveColor: newShapeColor }),
    });
  }
});

onMounted(async () => {
  sharedState.isComponentMounted.value = true;
  await voiceSettingsManager.initialize();
  await audioFeedback.loadSounds();
  await microphoneManager.checkCurrentPermission();

  if (voiceInputPanelRef.value && typeof window !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      isWideScreen.value = window.innerWidth > 1024;
      updateCanvasSize();
    });
    resizeObserver.observe(voiceInputPanelRef.value);
  }
  setTimeout(() => {
      if(currentAudioMode.value && currentSettings.showStartupHint) {
        handleAudioModeChange(currentAudioMode.value);
      }
  }, 500);
});

onBeforeUnmount(() => {
  sharedState.isComponentMounted.value = false;
  resizeObserver?.disconnect();
  sttManager.cleanup();
  audioFeedback.cleanup();
  microphoneManager.releaseAllMicrophoneResources();
  if (voiceViz?.isVisualizing.value) voiceViz.stopVisualization();
  resetVoiceInputState();

  if (hintTimeout) clearTimeout(hintTimeout);
  if (transcriptionTimeout) clearTimeout(transcriptionTimeout);
  if (pttAudioSourceNode) {
    pttAudioSourceNode.stop();
    pttAudioSourceNode.disconnect();
  }
});
</script>