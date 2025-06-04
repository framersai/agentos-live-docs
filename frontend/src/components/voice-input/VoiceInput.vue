// File: frontend/src/components/voice-input/VoiceInput.vue
/**
 * @file VoiceInput.vue
 * @description Futuristic "Her"-inspired voice input interface with holographic effects,
 * organic animations, and seamless voice/text interaction.
 * 
 * @version 4.0.0 - Complete fix with proper structure
 */
<template>
  <div
    ref="voiceInputPanelRef"
    class="voice-input-panel"
    :class="[
      stateClass,
      { 'vi-wide': isWideScreen }
    ]"
    :data-theme="uiStore.theme?.id || 'sakura-sunset'"
  >
    <!-- Holographic Background Layers -->
    <div class="vi-background-layers">
      <!-- Geometric patterns -->
      <svg
        v-if="!uiStore.isReducedMotionPreferred"
        class="vi-geometric-pattern"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#glow)">
          <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.3">
            <animate attributeName="r" values="20;25;20" dur="4s" repeatCount="indefinite"/>
          </circle>
          <circle cx="75" cy="75" r="15" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.3">
            <animate attributeName="r" values="15;20;15" dur="3s" repeatCount="indefinite"/>
          </circle>
          <path d="M10,50 Q50,20 90,50 T10,50" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.2">
            <animate attributeName="d" values="M10,50 Q50,20 90,50 T10,50;M10,50 Q50,80 90,50 T10,50;M10,50 Q50,20 90,50 T10,50" dur="6s" repeatCount="indefinite"/>
          </path>
        </g>
      </svg>
      
      <!-- Dynamic gradient background -->
      <div class="vi-gradient-bg" />
      
      <!-- Audio visualization canvas (background layer) -->
      <canvas
        v-show="isVisualizationVisible"
        ref="visualizationCanvasRef"
        class="vi-visualization-bg"
        :class="{
          'viz-active': isVisualizationVisible,
          'viz-prominent': currentAudioMode === 'continuous' && isActive
        }"
      />
    </div>

    <!-- Main Controls -->
    <div class="vi-controls-wrapper">
      <!-- Microphone Button with Organic Animation -->
      <button
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
          'vi-mic-vad': isVadListeningForWake,
          'vi-mic-error': micPermissionStatus === 'denied' || micPermissionStatus === 'error'
        }"
        :aria-label="micButtonAriaLabel"
      >
        <svg class="vi-mic-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="micGrad">
              <stop offset="0%" stop-color="currentColor" stop-opacity="1"/>
              <stop offset="100%" stop-color="currentColor" stop-opacity="0.6"/>
            </radialGradient>
          </defs>
          <path d="M50 10 C40 10 32 18 32 28 L32 45 C32 55 40 63 50 63 C60 63 68 55 68 45 L68 28 C68 18 60 10 50 10 Z" 
                fill="url(#micGrad)"
                stroke="currentColor" 
                stroke-width="2"/>
          <path d="M35 45 L35 50 C35 60 42 68 50 68 C58 68 65 60 65 50 L65 45"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"/>
          <line x1="50" y1="68" x2="50" y2="80" stroke="currentColor" stroke-width="2"/>
          <line x1="40" y1="80" x2="60" y2="80" stroke="currentColor" stroke-width="2"/>
        </svg>
        <svg class="vi-mic-rings" viewBox="0 0 100 100">
          <circle 
            v-for="i in 3" 
            :key="i"
            cx="50" 
            cy="50" 
            :r="20 + (i * 10)"
            fill="none"
            stroke="currentColor"
            :stroke-opacity="0.3 - (i * 0.1)"
            :stroke-width="2 - (i * 0.5)"
            :style="{
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${2 + (i * 0.5)}s`
            }"
          />
        </svg>
      </button>

      <!-- Mode Selector -->
      <AudioModeDropdown
        :current-mode="currentAudioMode"
        :options="audioModeOptions"
        :disabled="isActive || props.isProcessingLLM"
        @select-mode="handleAudioModeChange"
        class="vi-mode-selector"
      />

      <!-- Temporary Hint Display -->
      <Transition name="hint-fade">
        <div 
          v-if="currentHint"
          class="vi-hint-display"
          :class="`vi-hint-${currentHint.type}`"
        >
          <span v-html="currentHint.text" />
        </div>
      </Transition>
    </div>

    <!-- Input Area with Holographic Effects -->
    <div class="vi-input-wrapper" :class="{ 'vi-input-disabled': isInputDisabled }">
      <div class="vi-input-container">
        <!-- Transcription Overlay -->
        <Transition name="transcription-fade">
          <div 
            v-if="currentTranscription"
            class="vi-transcription-overlay"
          >
            <span class="vi-transcription-text">{{ currentTranscription }}</span>
          </div>
        </Transition>
        
        <!-- Text Input -->
        <textarea
          ref="textareaRef"
          v-model="sharedState.textInput.value"
          @input="handleTextareaInput"
          @keydown.enter.exact.prevent="handleTextSubmit"
          @keydown.enter.shift.prevent="insertNewline"
          :placeholder="inputPlaceholder"
          :disabled="isInputDisabled"
          class="vi-textarea"
          rows="1"
        />

        <!-- Organic Send Button -->
        <button
          @click="handleTextSubmit"
          :disabled="!canSendMessage"
          class="vi-send-button"
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" class="vi-send-icon" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="sendGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="var(--color-accent-primary)" />
                <stop offset="100%" stop-color="var(--color-accent-secondary)" />
              </linearGradient>
            </defs>
            <!-- Organic flowing shape -->
            <path 
              fill="url(#sendGradient)"
              d="M3 12 C3 10 4 8 6 8 Q8 8 9 9 L10 8 C11 6 13 5 15 5 Q17 5 18 6 L19 7 Q20 8 20 10 L20 12 Q20 14 19 15 L18 16 Q17 17 15 17 C13 17 11 16 10 14 L9 15 Q8 16 6 16 C4 16 3 14 3 12 Z M7 12 L16 12 L12 8 Z"
            />
          </svg>
        </button>
      </div>

      <!-- Settings Toolbar -->
      <div class="vi-toolbar-wrapper">
        <button
          @click="toggleToolbar"
          class="vi-toolbar-toggle"
          :aria-expanded="sharedState.showInputToolbar.value"
        >
          <svg viewBox="0 0 24 24" class="vi-settings-icon" :class="{ 'vi-rotating': sharedState.showInputToolbar.value }">
            <path fill="currentColor" d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97L21.54,14.63C21.73,14.78 21.78,15.05 21.66,15.27L19.66,18.73C19.55,18.95 19.28,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.48,18.68 14.87,18.93L14.49,21.58C14.46,21.82 14.25,22 14,22H10C9.75,22 9.54,21.82 9.51,21.58L9.13,18.93C8.52,18.68 7.96,18.34 7.44,17.95L4.95,18.95C4.72,19.04 4.45,18.95 4.34,18.73L2.34,15.27C2.22,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11.03L2.46,9.37C2.27,9.22 2.22,8.95 2.34,8.73L4.34,5.27C4.45,5.05 4.72,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.52,5.32 9.13,5.07L9.51,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.49,2.42L14.87,5.07C15.48,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.28,4.96 19.55,5.05 19.66,5.27L21.66,8.73C21.78,8.95 21.73,9.22 21.54,9.37L19.43,11.03L19.5,12L19.43,12.97Z" />
          </svg>
        </button>
        
        <Transition name="toolbar-slide">
          <InputToolbar
            v-if="sharedState.showInputToolbar.value"
            :stt-engine-options="sttEngineOptions"
            :current-stt-engine-prop="settings.sttPreference"
            :live-transcription-enabled-prop="settings.showLiveTranscription ?? false"
            :features="{ textUpload: true, imageUpload: true, 
              // pdfUpload: true 
              }"
            @file-upload="handleFileUpload"
            @stt-engine-change="handleSttEngineChange"
            @toggle-live-transcription="handleToggleLiveTranscription"
            @close-toolbar="sharedState.showInputToolbar.value = false"
            class="vi-toolbar"
          />
        </Transition>
      </div>
    </div>

    <!-- PTT Preview Modal -->
    <Transition name="preview-slide">
      <div v-if="pttPreview" class="vi-ptt-preview">
        <div class="vi-preview-header">
          <span class="vi-preview-duration">{{ formatDuration(pttPreview.duration) }}</span>
          <button @click="closePttPreview" class="vi-preview-close">
            <XMarkIcon class="icon-sm" />
          </button>
        </div>
        <canvas ref="pttWaveformCanvasRef" class="vi-preview-waveform" />
        <div class="vi-preview-controls">
          <button @click="playPttRecording" class="vi-preview-btn">
            <PlayIcon v-if="!pttPreview.isPlaying" class="icon-sm" />
            <PauseIcon v-else class="icon-sm" />
          </button>
          <button @click="rerecordPtt" class="vi-preview-btn">
            <ArrowPathIcon class="icon-sm" />
          </button>
          <button @click="sendPttRecording" class="vi-preview-btn vi-preview-send">
            <PaperAirplaneIcon class="icon-sm" />
          </button>
        </div>
      </div>
    </Transition>

    <!-- STT Handlers -->
    <BrowserSpeechHandler
      v-if="settings.sttPreference === 'browser_webspeech_api'"
      :settings="settings"
      :audio-input-mode="currentAudioMode"
      :parent-is-processing-l-l-m="props.isProcessingLLM"
      :current-mic-permission="micPermissionStatus"
      :active-stream="microphoneManager.activeStream.value"
      :analyser="microphoneManager.analyser.value"
      @handler-api-ready="onHandlerReady"
      @unmounted="onHandlerUnmounted"
      @transcription="onTranscription"
      @wake-word-detected="modeManager.handleWakeWordDetectedFromHandler"
      @is-listening-for-wake-word="(val) => sharedState.isListeningForWakeWord.value = val"
      @processing-audio="(val) => sharedState.isProcessingAudio.value = val"
      @error="onSttError"
    />
    
    <WhisperSpeechHandler
      v-if="settings.sttPreference === 'whisper_api'"
      :settings="settings"
      :audio-input-mode="currentAudioMode"
      :parent-is-processing-l-l-m="props.isProcessingLLM"
      :current-mic-permission="micPermissionStatus"
      :active-stream="microphoneManager.activeStream.value"
      :analyser="microphoneManager.analyser.value"
      @handler-api-ready="onHandlerReady"
      @unmounted="onHandlerUnmounted"
      @transcription="onTranscription"
      @processing-audio="(val) => sharedState.isProcessingAudio.value = val"
      @error="onSttError"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, inject, watch, nextTick, shallowRef } from 'vue';
import { voiceSettingsManager, type VoiceApplicationSettings, type AudioInputMode } from '@/services/voice.settings.service';
import type { ToastService } from '@/services/services';
import { useUiStore } from '@/store/ui.store';

// Types
import type {
  SttHandlerInstance, SttEngineType, AudioModeOption, SttEngineOption,
  MicPermissionStatusType, TranscriptionData, SttHandlerErrorPayload
} from './types';

// Composables
import { useVoiceInputState, resetVoiceInputState } from './composables/shared/useVoiceInputState';
import { useTranscriptionDisplay } from './composables/shared/useTranscriptionDisplay';
import { useAudioFeedback } from './composables/shared/useAudioFeedback';
import { useMicrophone } from './composables/useMicrophone';
import { useSttModeManager } from './composables/useSttModeManager';
import { useVoiceVisualization } from '@/composables/useVoiceVisualization';

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

const props = defineProps<{
  isProcessingLLM: boolean;
}>();

const emit = defineEmits<{
  (e: 'transcription-ready', value: string): void;
  (e: 'permission-update', status: MicPermissionStatusType): void;
  (e: 'stt-processing-audio', isProcessing: boolean): void;
  (e: 'voice-input-error', errorPayload: SttHandlerErrorPayload): void;
}>();

// Services
const toast = inject<ToastService>('toast');
const uiStore = useUiStore();

// Refs
const voiceInputPanelRef = ref<HTMLElement>();
const textareaRef = ref<HTMLTextAreaElement>();
const visualizationCanvasRef = ref<HTMLCanvasElement | null>(null);
const pttWaveformCanvasRef = ref<HTMLCanvasElement>();

// State
const settings = computed(() => voiceSettingsManager.settings);
const currentAudioMode = computed(() => settings.value.audioInputMode);
const micPermissionStatus = ref<MicPermissionStatusType>('');
const isWideScreen = ref(false);
const isPttHolding = ref(false);

// Hints
interface Hint {
  text: string;
  type: 'info' | 'success' | 'warning';
}
const currentHint = ref<Hint | null>(null);
let hintTimeout: number | null = null;

// PTT Preview
interface PttPreview {
  audioBlob: Blob;
  duration: number;
  isPlaying: boolean;
}
const pttPreview = ref<PttPreview | null>(null);

// Transcription
const currentTranscription = ref('');
let transcriptionTimeout: number | null = null;

// Shared state
const sharedState = useVoiceInputState(
  currentAudioMode,
  computed(() => props.isProcessingLLM),
  micPermissionStatus
);

// Microphone
const microphoneManager = useMicrophone({
  settings,
  toast,
  onPermissionUpdateGlobally: (status) => {
    micPermissionStatus.value = status;
    emit('permission-update', status);
  },
});

// Audio feedback
const audioFeedback = useAudioFeedback({ volume: 0.6 });

// Transcription display
const transcriptionDisplay = useTranscriptionDisplay({ sharedState });

// STT Mode Manager
const modeManager = useSttModeManager({
  audioMode: currentAudioMode,
  settings,
  sharedState,
  micPermissionStatus,
  isProcessingLLM: computed(() => props.isProcessingLLM),
  audioFeedback,
  transcriptionDisplay,
  emit: (event: string, ...args: any[]) => {
    if (event === 'transcription') {
      emit('transcription-ready', args[0]);
    } else if (event === 'error') {
      emit('voice-input-error', args[0]);
    }
  },
  toast,
});

// Visualization
let voiceViz: ReturnType<typeof useVoiceVisualization> | null = null;

// Computed
const isActive = computed(() => modeManager.isActive.value);

const isVadListeningForWake = computed(() => 
  currentAudioMode.value === 'voice-activation' && 
  sharedState.isListeningForWakeWord.value
);

const micButtonDisabled = computed(() => 
  micPermissionStatus.value === 'denied' || 
  micPermissionStatus.value === 'error' ||
  (props.isProcessingLLM && !isVadListeningForWake.value)
);

const micButtonAriaLabel = computed(() => {
  if (micPermissionStatus.value === 'denied') return 'Microphone access denied';
  if (isActive.value) return 'Stop recording';
  if (isVadListeningForWake.value) return 'Listening for wake word';
  return 'Start recording';
});

const isInputDisabled = computed(() => 
  props.isProcessingLLM || 
  (currentAudioMode.value === 'continuous' && isActive.value)
);

const inputPlaceholder = computed(() => {
  if (currentAudioMode.value === 'continuous' && isActive.value) {
    return 'Listening...';
  }
  return 'Type a message or use voice...';
});

const canSendMessage = computed(() => 
  sharedState.textInput.value.trim() && 
  !props.isProcessingLLM && 
  !isInputDisabled.value
);

const isVisualizationVisible = computed(() => 
  isActive.value || isVadListeningForWake.value
);

const stateClass = computed(() => {
  if (props.isProcessingLLM) return 'state-llm-processing';
  if (isActive.value) return 'state-stt-active';
  if (isVadListeningForWake.value) return 'state-vad-listening';
  return 'state-idle';
});

const audioModeOptions = computed<AudioModeOption[]>(() => [
  { label: 'Push to Talk', value: 'push-to-talk' },
  { label: 'Continuous', value: 'continuous' },
  { label: 'Voice Activate', value: 'voice-activation' },
]);

const sttEngineOptions = computed<SttEngineOption[]>(() => [
  { label: 'Browser', value: 'browser_webspeech_api' },
  { label: 'Whisper', value: 'whisper_api' },
]);

// Methods
function showHint(text: string, type: 'info' | 'success' | 'warning' = 'info', duration: number = 4000) {
  if (hintTimeout) clearTimeout(hintTimeout);
  currentHint.value = { text, type };
  hintTimeout = window.setTimeout(() => {
    currentHint.value = null;
  }, duration);
}

function showTranscription(text: string) {
  if (transcriptionTimeout) clearTimeout(transcriptionTimeout);
  currentTranscription.value = text;
  transcriptionTimeout = window.setTimeout(() => {
    currentTranscription.value = '';
  }, 3000);
}

async function handleMicButtonClick() {
  if (currentAudioMode.value === 'push-to-talk' && isPttHolding.value) {
    return; // Handled by mouse up
  }
  
  const hasPermission = await microphoneManager.ensureMicrophoneAccessAndStream();
  if (!hasPermission) {
    showHint('Microphone access required', 'warning');
    return;
  }
  
  try {
    await modeManager.handleMicButtonClick();
  } catch (error) {
    console.error('[VoiceInput] Error handling mic click:', error);
    // Don't break the app - just show a hint
    showHint('Voice input error. Please try again.', 'warning');
  }
}

function handleMicMouseDown() {
  if (currentAudioMode.value === 'push-to-talk' && !isActive.value) {
    isPttHolding.value = true;
    handleMicButtonClick();
  }
}

function handleMicMouseUp() {
  if (currentAudioMode.value === 'push-to-talk' && isPttHolding.value) {
    isPttHolding.value = false;
    // In PTT mode, we could capture the audio blob for preview
    // For now, just stop
    if (isActive.value) {
      modeManager.currentModeInstance.value?.stop();
    }
  }
}

function handleTextareaInput(event: Event) {
  const target = event.target as HTMLTextAreaElement;
  target.style.height = 'auto';
  target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
}

function insertNewline() {
  if (textareaRef.value) {
    const { selectionStart, selectionEnd, value } = textareaRef.value;
    const newValue = value.substring(0, selectionStart) + '\n' + value.substring(selectionEnd);
    sharedState.textInput.value = newValue;
    nextTick(() => {
      if (textareaRef.value) {
        textareaRef.value.selectionStart = textareaRef.value.selectionEnd = selectionStart + 1;
        handleTextareaInput({ target: textareaRef.value } as any);
      }
    });
  }
}

function handleTextSubmit() {
  const text = sharedState.textInput.value.trim();
  if (!text || props.isProcessingLLM) return;
  
  emit('transcription-ready', text);
  sharedState.textInput.value = '';
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
  }
  showHint('Message sent!', 'success', 2000);
}

async function handleAudioModeChange(mode: AudioInputMode) {
  await voiceSettingsManager.updateSetting('audioInputMode', mode);
  
  // Show mode-specific hint
  switch(mode) {
    case 'push-to-talk':
      showHint('Hold mic button to record', 'info');
      break;
    case 'continuous':
      showHint('Press mic to start continuous listening', 'info');
      break;
    case 'voice-activation':
      const wakeWord = settings.value.vadWakeWordsBrowserSTT?.[0] || 'Hey V';
      showHint(`Say "${wakeWord}" to activate`, 'info');
      break;
  }
}

function toggleToolbar() {
  sharedState.showInputToolbar.value = !sharedState.showInputToolbar.value;
}

async function handleFileUpload(payload: { type: 'text' | 'pdf' | 'image'; file: File }) {
  if (payload.type === 'text') {
    try {
      const text = await payload.file.text();
      sharedState.textInput.value = text;
      showHint(`Loaded ${payload.file.name}`, 'success');
      
      // Trigger textarea resize
      nextTick(() => {
        if (textareaRef.value) {
          handleTextareaInput({ target: textareaRef.value } as any);
        }
      });
    } catch (error) {
      showHint('Failed to load file', 'warning');
    }
  } else {
    showHint(`${payload.type} upload coming soon!`, 'info');
  }
  sharedState.showInputToolbar.value = false;
}

async function handleSttEngineChange(engine: SttEngineType) {
  await voiceSettingsManager.updateSetting('sttPreference', engine);
  showHint(`Switched to ${engine === 'browser_webspeech_api' ? 'Browser' : 'Whisper'} STT`, 'success');
}

async function handleToggleLiveTranscription(enabled: boolean) {
  await voiceSettingsManager.updateSetting('showLiveTranscription', enabled);
}

// PTT Preview methods
function showPttPreview(audioBlob: Blob, duration: number) {
  pttPreview.value = {
    audioBlob,
    duration,
    isPlaying: false
  };
  
  // TODO: Draw waveform
}

function closePttPreview() {
  pttPreview.value = null;
}

function playPttRecording() {
  if (!pttPreview.value) return;
  // TODO: Implement playback
  pttPreview.value.isPlaying = !pttPreview.value.isPlaying;
}

function rerecordPtt() {
  closePttPreview();
  handleMicButtonClick();
}

function sendPttRecording() {
  if (!pttPreview.value) return;
  // TODO: Send the recording
  showHint('Recording sent!', 'success');
  closePttPreview();
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Handler management
const activeHandler = shallowRef<SttHandlerInstance | null>(null);

function onHandlerReady(api: SttHandlerInstance) {
  activeHandler.value = api;
  modeManager.registerHandler(
    settings.value.sttPreference, 
    api
  );
}

function onHandlerUnmounted() {
  if (activeHandler.value) {
    modeManager.unregisterHandler(settings.value.sttPreference);
    activeHandler.value = null;
  }
}

function onTranscription(data: TranscriptionData) {
  if (data.isFinal) {
    showTranscription(data.text);
  } else if (settings.value.showLiveTranscription) {
    showTranscription(data.text);
  }
  
  modeManager.handleTranscriptionFromHandler(data.text, data.isFinal);
}

function onSttError(error: SttHandlerErrorPayload) {
  // Ignore non-fatal errors
  if (!error.fatal && (error.code === 'no-speech' || error.code === 'aborted')) {
    return;
  }
  
  // Don't break the app - just show a hint for errors
  console.warn('[VoiceInput] STT Error:', error);
  
  if (error.fatal) {
    showHint('Voice input error. Please try again.', 'warning');
    // Try to recover
    if (isActive.value) {
      modeManager.currentModeInstance.value?.stop();
    }
  }
}

// Watch for settings changes
watch(() => settings.value.sttPreference, (newPref) => {
  if (newPref === 'browser_webspeech_api' || newPref === 'whisper_api') {
    modeManager.activeHandlerApi.value = activeHandler.value;
  }
});

// Setup visualization
function setupVisualization() {
  if (!visualizationCanvasRef.value || !microphoneManager.activeStream.value) return;
  
  if (voiceViz) {
    voiceViz.stopVisualization();
  }
  
  voiceViz = useVoiceVisualization(
    microphoneManager.activeStream,
    visualizationCanvasRef,
    {
      visualizationType: currentAudioMode.value === 'continuous' ? 'circular' : 
                        currentAudioMode.value === 'voice-activation' ? 'frequencyBars' : 
                        'waveform',
      globalVizAlpha: 0.3,
      shapeColor: 'currentColor',
      circularBaseRadiusFactor: 0.3,
      circularAmplitudeFactor: 0.6,
      circularMaxExtensionRadius: 50,
      circularPointCount: 60,
      circularRotationSpeed: 0.001,
      circularPulseSpeed: 0.01,
    }
  );
}

// Watch for visualization needs
watch([microphoneManager.activeStream, isVisualizationVisible], ([stream, visible]) => {
  if (stream && visible && visualizationCanvasRef.value) {
    setupVisualization();
    voiceViz?.startVisualization();
  } else if (voiceViz?.isVisualizing.value) {
    voiceViz.stopVisualization();
  }
});

// Lifecycle
onMounted(async () => {
  sharedState.isComponentMounted.value = true;
  await voiceSettingsManager.initialize();
  await audioFeedback.loadSounds();
  await microphoneManager.checkCurrentPermission();
  
  // Check screen size
  isWideScreen.value = window.innerWidth > 1024;
  window.addEventListener('resize', () => {
    isWideScreen.value = window.innerWidth > 1024;
  });
  
  // Show initial hint based on mode
  setTimeout(() => {
    handleAudioModeChange(currentAudioMode.value);
  }, 500);
});

onBeforeUnmount(() => {
  sharedState.isComponentMounted.value = false;
  window.removeEventListener('resize', () => {});
  modeManager.cleanup();
  audioFeedback.cleanup();
  microphoneManager.releaseAllMicrophoneResources();
  voiceViz?.stopVisualization();
  resetVoiceInputState();
  
  if (hintTimeout) clearTimeout(hintTimeout);
  if (transcriptionTimeout) clearTimeout(transcriptionTimeout);
});
</script>