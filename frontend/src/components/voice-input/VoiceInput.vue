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
    :data-theme="uiStore.currentTheme?.id || 'sakura-sunset'"
  >
    <div class="vi-background-layers">
      <div v-if="currentAudioMode !== 'continuous'" class="vi-orb vi-orb-1"></div>
      <div v-if="currentAudioMode !== 'continuous'" class="vi-orb vi-orb-2"></div>
      <div v-if="currentAudioMode !== 'continuous'" class="vi-orb vi-orb-3"></div>
      <div class="vi-gradient-bg" />
      
      <svg class="vi-geometric-patterns" v-if="geometricPatterns.length > 0 && currentAudioMode !== 'continuous'">
        <defs>
          <filter id="geometricGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <g v-for="pattern in geometricPatterns"
           :key="pattern.id"
           :opacity="pattern.opacity"
           filter="url(#geometricGlow)">
          <path :d="pattern.path"
                fill="none"
                :stroke="currentAudioMode === 'continuous' ? 'var(--color-voice-user)' : 'var(--color-accent-interactive)'"
                stroke-width="1" />
        </g>
      </svg>
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
      <MicInputButton
        ref="micButtonRefInternal"
        :isActive="isActive"
        :isListeningForWakeWord="isListeningForWakeWord"
        :isProcessingLLM="props.isProcessingLLM"
        :hasMicError="hasMicError"
        :disabled="micButtonDisabled"
        :currentAudioMode="currentAudioMode"
        :aria-label="micButtonAriaLabel"
        @click="handleMicButtonClick"
        @mousedown="handleMicButtonMouseDown"
        @mouseup="handleMicButtonMouseUp"
        @mouseleave="handleMicButtonMouseLeave"
        @touchstart="handleMicButtonTouchStart"
        @touchend="handleMicButtonTouchEnd"
        @touchcancel="handleMicButtonTouchEnd"
        class="vi-mic-button"
        :class="{
          'vi-mic-active-outer': isActive,
          'vi-mic-listening-outer': isListeningForWakeWord
        }"
      />
      
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
        <div v-if="displayTranscriptionText && currentSettings.showLiveTranscription" 
             class="vi-live-transcription"
             :class="{ 'vi-transcription-ephemeral': !transcriptionIsFinal }">
          <span class="vi-transcription-text">{{ displayTranscriptionText }}</span>
          <span v-if="!transcriptionIsFinal" class="vi-transcription-cursor"></span>
        </div>
      </transition>
    </div>

    <div class="vi-input-wrapper" :class="{ 'vi-input-disabled': isInputEffectivelyDisabled }">
      <div class="vi-input-container" :class="{ 'vi-input-breathing': currentAudioMode === 'continuous' && isActive }">
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

    <transition name="confirmation-fade-scale">
      <div v-if="transcriptionConfirmation" class="vi-transcription-confirmation">
        <div class="vi-confirmation-content">
          <div class="vi-confirmation-header">
            <span class="vi-confirmation-title">Confirm Message</span>
            <span class="vi-confirmation-countdown">{{ transcriptionConfirmation.countdownSeconds }}s</span>
          </div>
          <div class="vi-confirmation-transcript">
            {{ transcriptionConfirmation.transcript }}
          </div>
          <div class="vi-confirmation-shortcuts">
            <span class="vi-shortcut"><kbd>Enter</kbd> to send</span>
            <span class="vi-shortcut"><kbd>Esc</kbd> to cancel</span>
          </div>
          <div class="vi-confirmation-actions">
            <button @click="editTranscription(false)" class="vi-confirmation-btn vi-confirmation-edit" title="Replace text input">
              Edit
            </button>
            <button @click="editTranscription(true)" class="vi-confirmation-btn vi-confirmation-append" title="Add to existing text">
              Append
            </button>
            <button @click="closeTranscriptionConfirmation" class="vi-confirmation-btn vi-confirmation-cancel">
              <span>Cancel</span>
              <kbd class="vi-kbd-inline">Esc</kbd>
            </button>
            <button @click="confirmTranscription" class="vi-confirmation-btn vi-confirmation-send">
              <span>Send Now</span>
              <kbd class="vi-kbd-inline">↵</kbd>
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
      :is-explicitly-stopped-by-mode-manager="sttManager.isExplicitlyStoppedByUser.value"
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
      :is-explicitly-stopped-by-mode-manager="sttManager.isExplicitlyStoppedByUser.value"
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
 * @version 2.4.2
 * @updated 2025-06-05
 * - Corrected MicInputButton prop casing from `is-processing-llm` to `isProcessingLLM`.
 * - Corrected access to sttManager's `isAwaitingVadCommandResult` (now directly on sttManager instance).
 * - Added optional chaining for `currentSettings.disableTextareaBasedOnMode` with a console warning.
 * - Integrated MicInputButton component into the template.
 * - Ensured `isExplicitlyStoppedByModeManager` from SttManager is passed to STT handlers.
 */
import { ref, computed, onMounted, onBeforeUnmount, inject, watch, nextTick, type Ref, getCurrentInstance } from 'vue';
import { useI18n } from 'vue-i18n';
import { voiceSettingsManager, type VoiceApplicationSettings, type AudioInputMode, type STTPreference } from '@/services/voice.settings.service';
import type { ToastService } from '@/services/services';
import { useUiStore } from '@/store/ui.store';
import { useReactiveStore } from '@/store/reactive.store';

// Composables
import { useVoiceInputState, resetVoiceInputState } from './composables/shared/useVoiceInputState';
import { useTranscriptionDisplay } from './composables/shared/useTranscriptionDisplay';
import { useAudioFeedback } from './composables/shared/useAudioFeedback';
import { useMicrophone } from './composables/useMicrophone';
import { useSttManager } from './composables/useSttManager';
import { useVoiceVisualization, type VoiceVisualizationConfig } from '@/composables/useVoiceVisualization';
import { useVoiceInputEffects } from './composables/useVoiceInputEffects';

// Components
import BrowserSpeechHandler from './handlers/BrowserSpeechHandler.vue';
import WhisperSpeechHandler from './handlers/WhisperSpeechHandler.vue';
import AudioModeDropdown from './components/AudioModeDropdown.vue';
import InputToolbar from './components/InputToolbar.vue';
import MicInputButton from './components/MicInputButton.vue';


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
    MicPermissionStatusType
} from './types';

type SttInternalHandlerId = 'browser' | 'whisper';

interface Hint {
  text: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface PttPreview {
  transcript: string;
  audioBlob?: Blob;
  audioBuffer?: AudioBuffer;
  duration: number;
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
const { t } = useI18n();
const uiStore = useUiStore();
const reactiveStore = useReactiveStore();
const instanceId = ref(getCurrentInstance()?.uid || Math.random().toString(36).substring(7));

const voiceInputPanelRef = ref<HTMLElement>();
const textareaRef = ref<HTMLTextAreaElement>();
const visualizationCanvasRef = ref<HTMLCanvasElement | null>(null);
const micButtonRefInternal = ref<InstanceType<typeof MicInputButton> | null>(null);
const pttWaveformCanvasRef = ref<HTMLCanvasElement | null>(null);

const currentSettings = voiceSettingsManager.settings;
const settingsRef = computed(() => voiceSettingsManager.settings);

const currentAudioMode = computed(() => currentSettings.audioInputMode);

const micPermissionStatus = ref<MicPermissionStatusType>('prompt');
const isWideScreen = ref(typeof window !== 'undefined' ? window.innerWidth > 1024 : false);
const currentHint = ref<Hint | null>(null);
const pttPreview = ref<PttPreview | null>(null);
const displayTranscriptionText = ref('');
const transcriptionIsFinal = ref(true);
const volumeLevels = ref([0.2, 0.3, 0.5, 0.4, 0.3]);

// Transcription confirmation modal state
const transcriptionConfirmation = ref<{
  transcript: string;
  countdownSeconds: number;
} | null>(null);
let autoConfirmInterval: number | null = null; 

let hintTimeout: number | null = null;
let transcriptionTimeout: number | null = null;
let resizeObserver: ResizeObserver | null = null;
let pttAudioSourceNode: AudioBufferSourceNode | null = null;
let volumeAnimationFrame: number | null = null;

// Utility for console.warnOnce
const warnedOnceMessages = new Set<string>();
function consoleWarnOnce(message: string) {
    if (!warnedOnceMessages.has(message)) {
        console.warn(message);
        warnedOnceMessages.add(message);
    }
}


const sharedState = useVoiceInputState(
  currentAudioMode,
  computed(() => props.isProcessingLLM),
  micPermissionStatus as Ref<string>
);

const microphoneManager = useMicrophone({
  settings: settingsRef,
  toast,
  onPermissionUpdateGlobally: (status) => {
    micPermissionStatus.value = status;
    emit('permission-update', status);
  },
});

const audioFeedback = useAudioFeedback({
  volume: computed(() => currentSettings.uiSoundVolume ?? 0.7),
  enabled: computed(() => currentSettings.enableUiSounds ?? true)
});

const transcriptionDisplay = useTranscriptionDisplay({ sharedState });

const sttManager = useSttManager({
  audioMode: currentAudioMode,
  settings: settingsRef,
  sharedState,
  micPermissionStatus: micPermissionStatus as Ref<string>,
  isProcessingLLM: computed(() => props.isProcessingLLM),
  audioFeedback,
  transcriptionDisplay,
  emit: (event: string, ...args: any[]) => {
    if (event === 'transcription-ready') {
      // Show confirmation modal for all modes
      console.log('[VoiceInput] Intercepted transcription-ready event:', args[0]);
      showTranscriptionConfirmation(args[0] as string);
    } else if (event === 'voice-input-error') {
      emit('voice-input-error', args[0] as SttHandlerErrorPayload);
    }
  },
  toast,
  t, // Pass the i18n translator
});

const voiceEffects = useVoiceInputEffects({
  isProcessingAudio: computed(() => sttManager.isActive.value),
  isListeningForWakeWord: computed(() => sttManager.isListeningForWakeWord.value),
  isProcessingLLM: computed(() => props.isProcessingLLM),
  audioMode: currentAudioMode
});

const geometricPatterns = computed(() => {
  return voiceEffects?.geometricPatternSvg.value || [];
});

let voiceViz: ReturnType<typeof useVoiceVisualization> | null = null;

const isActive = computed(() => {
  const active = sttManager.isActive.value;
  console.log('[VoiceInput] isActive computed:', active, 'currentMode:', currentAudioMode.value);
  return active;
});
const isListeningForWakeWord = computed(() => sttManager.isListeningForWakeWord.value);
const isVisualizationActive = computed(() => isActive.value || isListeningForWakeWord.value);

const hasMicError = computed(() =>
  micPermissionStatus.value === 'denied' ||
  micPermissionStatus.value === 'error'
);

const micButtonDisabled = computed(() =>
  hasMicError.value ||
  (props.isProcessingLLM && !isListeningForWakeWord.value && !sttManager.isAwaitingVadCommandResult.value) ||
  (sharedState.isInputEffectivelyDisabled.value && currentAudioMode.value !== 'push-to-talk' && currentAudioMode.value !== 'continuous')
);

const micButtonAriaLabel = computed(() => {
  if (hasMicError.value) return t('voice.microphoneAccessDenied');
  if (isActive.value) return t('voice.stopRecording');
  if (isListeningForWakeWord.value) return t('voice.listeningForWakeWord');
  return t('voice.startVoiceInput');
});

const disableTextareaSetting = computed(() => {
    const settingsTyped = currentSettings as VoiceApplicationSettings & { disableTextareaBasedOnMode?: boolean };
    if (typeof settingsTyped.disableTextareaBasedOnMode === 'undefined') {
        consoleWarnOnce('[VoiceInput] Setting "disableTextareaBasedOnMode" is not defined in VoiceApplicationSettings. Defaulting to true behavior for continuous mode disabling.');
    }
    return settingsTyped.disableTextareaBasedOnMode ?? true;
});

const isInputEffectivelyDisabled = computed(() => 
  (disableTextareaSetting.value && 
   currentAudioMode.value === 'continuous' && isActive.value) ||
  (props.isProcessingLLM && !isActive.value && !isListeningForWakeWord.value && !sttManager.isAwaitingVadCommandResult.value)
);

const inputPlaceholder = computed(() => {
  if (props.isProcessingLLM && !isActive.value && !isListeningForWakeWord.value && !sttManager.isAwaitingVadCommandResult.value) return t('voice.assistantProcessing');
  if (currentAudioMode.value === 'continuous' && isActive.value) return t('voice.continuousListeningActive');
  if (currentAudioMode.value === 'push-to-talk') return t('voice.pttPrompt');
  if (currentAudioMode.value === 'voice-activation' && isListeningForWakeWord.value) return t('voice.listeningForWakeWordShort');
  if (currentAudioMode.value === 'voice-activation' && isActive.value) return t('voice.listeningForCommand');
  return sttManager.placeholderText.value || t('voice.typeOrUseVoice');
});

const canSendMessage = computed(() =>
  sharedState.textInput.value.trim() &&
  !props.isProcessingLLM &&
  !isInputEffectivelyDisabled.value
);

const statusText = computed(() => sttManager.statusText.value);

const stateClass = computed(() => {
  if (props.isProcessingLLM && !isListeningForWakeWord.value && !isActive.value && !sttManager.isAwaitingVadCommandResult.value) return 'state-llm-processing';
  if (isActive.value) return 'state-stt-active';
  if (isListeningForWakeWord.value) return 'state-vad-listening';
  return 'state-idle';
});

const modeClass = computed(() => `vi-mode-${currentAudioMode.value.replace(/_/g, '-')}`);

const shouldShowBrowserHandler = computed(() =>
  currentSettings.sttPreference === 'browser_webspeech_api'
);

const shouldShowWhisperHandler = computed(() =>
  currentSettings.sttPreference === 'whisper_api'
);

const sendGradientStart = computed(() => 'var(--color-accent-primary)');
const sendGradientEnd = computed(() => 'var(--color-accent-secondary)');

const audioModeOptions = computed<UIAudioModeOption[]>(() => [
  { label: t('voice.pushToTalk'), value: 'push-to-talk', icon: '🎙️', description: t('voice.pushToTalkShort') },
  { label: t('voice.continuous'), value: 'continuous', icon: '🌊', description: t('voice.continuousShort') },
  { label: t('voice.voiceActivate'), value: 'voice-activation', icon: '🗣️', description: t('voice.voiceActivationShort') },
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
  if (duration > 0) {
    hintTimeout = window.setTimeout(() => {
      if (currentHint.value?.text === text) currentHint.value = null;
    }, duration);
  }
}

function showLiveTranscription(text: string, isFinal: boolean = true) {
  if (transcriptionTimeout && isFinal) clearTimeout(transcriptionTimeout);
  displayTranscriptionText.value = text;
  transcriptionIsFinal.value = isFinal;

  if (isFinal && text) {
    transcriptionTimeout = window.setTimeout(() => {
      if (displayTranscriptionText.value === text) displayTranscriptionText.value = '';
    }, 3000);
  } else if (!text && isFinal) {
      displayTranscriptionText.value = '';
  }
}

async function handleMicButtonClick() {
  // PTT mode uses click for toggle behavior
  if (currentAudioMode.value === 'push-to-talk') {
    console.log('[VoiceInput] PTT click - toggling recording. isActive:', isActive.value);

    if (!isActive.value) {
      // Start recording
      if (props.isProcessingLLM) {
        showHint('Cannot start recording while assistant is processing', 'warning');
        return;
      }

      const audioCtx = audioFeedback.audioContext.value;
      if (audioCtx?.state === 'suspended') {
        await audioCtx.resume();
      }

      const hasPermission = await microphoneManager.ensureMicrophoneAccessAndStream();
      if (!hasPermission) {
        showHint(`🎤 ${t('voice.microphoneAccess')}`, 'error');
        return;
      }

      await sttManager.startPtt();
    } else {
      // Stop recording
      await sttManager.stopPtt();
    }
    return;
  }

  // console.log(`[VoiceInput] Mic button clicked. Current mode: ${currentAudioMode.value}, isActive: ${isActive.value}, isListeningForWakeWord: ${isListeningForWakeWord.value}`);
  const audioCtx = audioFeedback.audioContext.value;
  if (audioCtx?.state === 'suspended') {
    try {
      await audioCtx.resume();
      // console.log('[VoiceInput] AudioContext resumed.');
    } catch (err) {
      console.error('[VoiceInput] Failed to resume AudioContext:', err);
      showHint('Could not activate audio. Please interact with the page.', 'error');
      return;
    }
  }

  const hasPermission = await microphoneManager.ensureMicrophoneAccessAndStream();
  if (!hasPermission) {
    showHint(`🎤 ${t('voice.microphoneAccess')}`, 'error');
    return;
  }

  if (!isActive.value && !isListeningForWakeWord.value) {
    audioFeedback.playSound(audioFeedback.beepInSound.value, 0.3);
  }

  await sttManager.handleMicButtonClick();
}

// Push-to-Talk specific handlers (now disabled - PTT uses click for toggle)
async function handleMicButtonMouseDown(event: MouseEvent) {
  // Disabled - PTT now uses click event for toggle behavior
  // Don't prevent event propagation
}

async function handleMicButtonMouseUp(event: MouseEvent) {
  // Disabled - PTT now uses click event for toggle behavior
  // Don't prevent event propagation
}

async function handleMicButtonMouseLeave(event: MouseEvent) {
  // Disabled - no need to stop on mouse leave in toggle mode
  // Don't prevent event propagation
}

async function handleMicButtonTouchStart(event: TouchEvent) {
  // Disabled - PTT now uses click event for toggle behavior
  // Don't prevent event propagation
}

async function handleMicButtonTouchEnd(event: TouchEvent) {
  // Disabled - PTT now uses click event for toggle behavior
  // Don't prevent event propagation
}

function handleTextareaInput() {
  if (!textareaRef.value) return;
  const el = textareaRef.value;
  el.style.height = 'auto';
  const maxHeight = parseInt(window.getComputedStyle(el).maxHeight, 10) || 120;
  el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
}

function insertNewline() {
  if (textareaRef.value && !isInputEffectivelyDisabled.value) {
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
  audioFeedback.playSound(audioFeedback.beepOutSound.value, 0.3);
}

async function handleAudioModeChange(mode: AudioInputMode) {
  await voiceSettingsManager.updateSetting('audioInputMode', mode);
  audioFeedback.playSound(audioFeedback.beepNeutralSound.value, 0.5);
  let hintText = '';
  switch(mode) {
    case 'push-to-talk': hintText = '🎙️ ' + t('voice.pttClickMicToStartStop'); break;
    case 'continuous': hintText = '🎤 ' + t('voice.continuousPressToStartStop'); break;
    case 'voice-activation':
      const wakeWord = currentSettings.vadWakeWordsBrowserSTT?.[0] || 'your wake word';
      hintText = t('voice.vadSayToActivate', { wakeWord }); break;
  }
  showHint(hintText, 'info', mode === 'voice-activation' ? 0 : 5000);
  
  if (mode === 'voice-activation') {
    reactiveStore.transitionToState('vad-wake');
  } else {
    reactiveStore.transitionToState('idle');
  }
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
        showTranscriptionConfirmation(data.transcript);
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
      if (data.transcript) showTranscriptionConfirmation(data.transcript);
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
}

function sendPttRecording() {
  if (!pttPreview.value?.transcript) return;
  showTranscriptionConfirmation(pttPreview.value.transcript);
  closePttPreview();
}

// Transcription confirmation modal functions
function showTranscriptionConfirmation(transcript: string) {
  if (!transcript.trim()) return;

  console.log('[VoiceInput] Showing transcription confirmation modal for:', transcript);

  // Clear any existing timer
  if (autoConfirmInterval) {
    clearInterval(autoConfirmInterval);
    autoConfirmInterval = null;
  }

  transcriptionConfirmation.value = {
    transcript: transcript.trim(),
    countdownSeconds: 3
  };

  // Add keyboard event listener for the modal
  const handleKeyboard = (e: KeyboardEvent) => {
    if (!transcriptionConfirmation.value) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      console.log('[VoiceInput] Escape pressed, cancelling transcription');
      closeTranscriptionConfirmation();
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      console.log('[VoiceInput] Enter pressed, confirming transcription');
      confirmTranscription();
    }
  };

  // Add the event listener
  document.addEventListener('keydown', handleKeyboard);

  // Store the handler to remove it later
  (window as any).__transcriptionModalKeyHandler = handleKeyboard;

  // Start countdown
  console.log('[VoiceInput] Starting auto-confirm countdown from 3 seconds');
  autoConfirmInterval = window.setInterval(() => {
    if (!transcriptionConfirmation.value) {
      console.log('[VoiceInput] Confirmation was cancelled, stopping countdown');
      if (autoConfirmInterval) clearInterval(autoConfirmInterval);
      autoConfirmInterval = null;
      return;
    }

    transcriptionConfirmation.value.countdownSeconds--;
    console.log('[VoiceInput] Countdown:', transcriptionConfirmation.value.countdownSeconds);

    if (transcriptionConfirmation.value.countdownSeconds <= 0) {
      console.log('[VoiceInput] Countdown reached 0, auto-confirming...');
      confirmTranscription();
    }
  }, 1000);
}

function confirmTranscription() {
  if (!transcriptionConfirmation.value?.transcript) return;

  console.log('[VoiceInput] Confirming transcription:', transcriptionConfirmation.value.transcript);
  const transcript = transcriptionConfirmation.value.transcript;
  closeTranscriptionConfirmation();

  emit('transcription-ready', transcript);
  audioFeedback.playSound(audioFeedback.beepOutSound.value, 0.5);
}

function closeTranscriptionConfirmation(sendEmpty: boolean = false) {
  console.log('[VoiceInput] Closing transcription confirmation modal, sendEmpty:', sendEmpty);
  if (autoConfirmInterval) {
    clearInterval(autoConfirmInterval);
    autoConfirmInterval = null;
    console.log('[VoiceInput] Cleared auto-confirm interval');
  }

  // Remove keyboard event listener
  const handler = (window as any).__transcriptionModalKeyHandler;
  if (handler) {
    document.removeEventListener('keydown', handler);
    delete (window as any).__transcriptionModalKeyHandler;
    console.log('[VoiceInput] Removed keyboard event listener');
  }

  // Only send empty transcript if explicitly requested (e.g., from auto-confirm with empty text)
  // Cancel button should NOT send empty transcript
  if (sendEmpty && !transcriptionConfirmation.value?.transcript?.trim()) {
    console.log('[VoiceInput] Ignoring sendEmpty request as transcript is empty');
  }

  transcriptionConfirmation.value = null;
}

function editTranscription(append: boolean = false) {
  if (!transcriptionConfirmation.value) return;

  // Put transcript in text input for editing
  const currentText = sharedState.textInput.value.trim();
  const newTranscript = transcriptionConfirmation.value.transcript;

  if (append && currentText) {
    // Append with a space if there's existing text
    sharedState.textInput.value = currentText + ' ' + newTranscript;
  } else {
    // Replace the text
    sharedState.textInput.value = newTranscript;
  }

  closeTranscriptionConfirmation();

  // Focus the text input
  nextTick(() => {
    textareaRef.value?.focus();
    // Only select all if replacing, not if appending
    if (!append || !currentText) {
      textareaRef.value?.select();
    } else {
      // Move cursor to end when appending
      const len = sharedState.textInput.value.length;
      textareaRef.value?.setSelectionRange(len, len);
    }
  });
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function animateVolumeLevels() {
  if (!isListeningForWakeWord.value || !microphoneManager.analyser.value) {
    if (volumeAnimationFrame) {
      cancelAnimationFrame(volumeAnimationFrame);
      volumeAnimationFrame = null;
    }
    return;
  }

  const analyser = microphoneManager.analyser.value;
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);
  const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
  const normalizedVolume = average / 255;

  volumeLevels.value = volumeLevels.value.map((_, i) => {
    const targetLevel = normalizedVolume * (0.5 + Math.random() * 0.5) * (1 - i * 0.1);
    return Math.min(1, targetLevel);
  });

  volumeAnimationFrame = requestAnimationFrame(animateVolumeLevels);
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
  reactiveStore.transitionToState('vad-active');
}

function onListeningForWakeWord(isListening: boolean) {
  const wakeWord = currentSettings.vadWakeWordsBrowserSTT?.[0] || 'your wake word';
  if (isListening && !sharedState.isListeningForWakeWord.value && !props.isProcessingLLM) {
    showHint(t('voice.listeningForQuote', { wakeWord }), 'info', 0);
  } else if (!isListening && currentHint.value?.text.includes(wakeWord)) {
    currentHint.value = null;
  }
  sharedState.isListeningForWakeWord.value = isListening;
  emit('stt-processing-audio', isListening); 
  
  if (isListening) {
    reactiveStore.transitionToState('vad-wake');
  }
}

function onProcessingAudio(isProcessing: boolean) {
  sharedState.isProcessingAudio.value = isProcessing;
  emit('stt-processing-audio', isProcessing);
  
  if (isProcessing) {
    if (currentAudioMode.value === 'voice-activation' && !isListeningForWakeWord.value) {
      reactiveStore.transitionToState('vad-active');
    } else if (currentAudioMode.value !== 'voice-activation') {
      reactiveStore.transitionToState('listening');
    }
  } else if (!props.isProcessingLLM && !isListeningForWakeWord.value) {
    reactiveStore.transitionToState('idle');
  }
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
    showHint(`🎤 ${t('voice.microphoneAccess')}`, 'error');
  } else if (error.fatal) {
    showHint(error.message || 'Voice input error. Please try again.', 'error');
  } else {
    showHint(error.message || 'Voice input issue.', 'warning');
  }
  emit('voice-input-error', error);
  
  if (error.fatal) {
    reactiveStore.transitionToState('error');
  }
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
  } else { // PTT
    vizType = 'frequencyBars'; // Changed from frequencyBars for PTT for a more classic recording look
     Object.assign(vizTypeConfig, {
      waveColor: baseShapeColor, glowColor: baseGlowColor, lineWidth: 2.5,
      amplitude: 50,
    });
  }

  voiceViz = useVoiceVisualization(
    microphoneManager.activeStream,
    visualizationCanvasRef as Ref<HTMLCanvasElement>,
    {
      visualizationType: vizType,
      globalVizAlpha: 0.9,
      ...vizTypeConfig,
      // Ensure these fallbacks are sensible if not provided by vizTypeConfig
      shapeColor: vizTypeConfig.shapeColor || baseShapeColor,
      glowColor: vizTypeConfig.glowColor || baseGlowColor,
      waveColor: vizTypeConfig.waveColor || baseShapeColor,
    }
  );
  updateCanvasSize();
  voiceViz.startVisualization();
}

watch([isVisualizationActive, () => microphoneManager.activeStream.value, currentAudioMode], ([vizActive, stream]) => {
  if (vizActive && stream && visualizationCanvasRef.value) {
    setupVisualization();
  } else if (voiceViz?.isVisualizing.value) {
    voiceViz.stopVisualization();
  }
}, { deep: false });

watch(isListeningForWakeWord, (isListening) => {
  if (isListening) {
    animateVolumeLevels();
  } else {
    if (volumeAnimationFrame) cancelAnimationFrame(volumeAnimationFrame);
    volumeAnimationFrame = null;
  }
});

watch(isActive, (newIsActive, oldIsActive) => {
  if (newIsActive !== oldIsActive && voiceViz && voiceViz.isVisualizing.value && voiceViz.currentConfig.value) {
    const newShapeColor = newIsActive ? 'var(--color-voice-user)' : 
                         (isListeningForWakeWord.value ? 'var(--color-accent-interactive)' : 'var(--color-accent-primary)');
    const newGlowColor = newIsActive ? 'var(--color-voice-user-secondary)' : 
                        (isListeningForWakeWord.value ? 'var(--color-accent-interactive-secondary)' : 'var(--color-accent-secondary)');
    const currentVizType = voiceViz.currentConfig.value.visualizationType;

    voiceViz.updateConfig({
      shapeColor: newShapeColor,
      glowColor: newGlowColor,
      ...( (currentVizType === 'radiantWave' || currentVizType === 'frequencyBars') && { waveColor: newShapeColor }),
    });
  }
});

watch(() => props.isProcessingLLM, (isProcessing) => {
  if (isProcessing && !isActive.value && !isListeningForWakeWord.value && !sttManager.isAwaitingVadCommandResult.value) {
    reactiveStore.transitionToState('thinking');
  } else if (!isProcessing && !isActive.value && !isListeningForWakeWord.value && !sttManager.isAwaitingVadCommandResult.value) {
    // Only transition to idle if not VAD wake, which should maintain its own state
     if(currentAudioMode.value !== 'voice-activation' || !isListeningForWakeWord.value){
        reactiveStore.transitionToState('idle');
     }
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
  
  const initialReactiveState = () => {
    if (props.isProcessingLLM && !sttManager.isAwaitingVadCommandResult.value) {
      reactiveStore.transitionToState('thinking');
    } else if (isActive.value) {
      if (currentAudioMode.value === 'voice-activation') reactiveStore.transitionToState('vad-active');
      else reactiveStore.transitionToState('listening');
    } else if (isListeningForWakeWord.value) {
      reactiveStore.transitionToState('vad-wake');
    } else {
      reactiveStore.transitionToState('idle');
    }
  };
  initialReactiveState();
  
  setTimeout(() => {
      if(currentAudioMode.value && currentSettings.showStartupHint) {
        handleAudioModeChange(currentAudioMode.value);
      }
  }, 500);
});

onBeforeUnmount(() => {
  sharedState.isComponentMounted.value = false;
  if (resizeObserver) resizeObserver.disconnect();
  sttManager.cleanup();
  audioFeedback.cleanup();
  microphoneManager.releaseAllMicrophoneResources();
  if (voiceViz?.isVisualizing.value) voiceViz.stopVisualization();
  if (volumeAnimationFrame) cancelAnimationFrame(volumeAnimationFrame);
  resetVoiceInputState();

  if (hintTimeout) clearTimeout(hintTimeout);
  if (transcriptionTimeout) clearTimeout(transcriptionTimeout);
  if (pttAudioSourceNode) {
    pttAudioSourceNode.stop();
    pttAudioSourceNode.disconnect();
  }

  // Clean up auto-confirm interval
  if (autoConfirmInterval) {
    clearInterval(autoConfirmInterval);
    autoConfirmInterval = null;
  }
});
</script>