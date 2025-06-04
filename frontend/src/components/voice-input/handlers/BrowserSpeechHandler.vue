// File: frontend/src/components/voice-input/handlers/BrowserSpeechHandler.vue
/**
 * @file BrowserSpeechHandler.vue
 * @description Vue component wrapper for browser-based speech recognition.
 * Manages dual recognizers for VAD, coordinates with the mode manager,
 * and handles browser-specific quirks.
 * 
 * This is a complete rewrite that:
 * - Uses the new BrowserSpeechCore for actual recognition
 * - Supports all modes (PTT, Continuous, VAD)
 * - Has proper Firefox detection and messaging
 * - Manages wake word detection for VAD
 * - Provides a clean API to the parent component
 */

<template>
  <!-- No visual output - this is a logic-only component -->
</template>


<script setup lang="ts">
/**
 * @file BrowserSpeechHandler.vue
 * @description Vue component wrapper for browser-based speech recognition.
 *
 * Revisions:
 * - Corrected import path for BrowserSpeechCore.
 * - Added explicit types for event callback parameters in createCores.
 * - Ensured SttHandlerInstance for emitted API is imported from `../types`.
 */

import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
// Corrected import path if BrowserSpeechCore.ts is in a 'browser' subdirectory
import { BrowserSpeechCore, type RecognitionMode, type BrowserSpeechEvents } from './BrowserSpeechCore';
import type { VoiceApplicationSettings, AudioInputMode } from '@/services/voice.settings.service';
// Import SttHandlerInstance from the central types file
import type { SttHandlerInstance, MicPermissionStatusType, TranscriptionData, SttHandlerErrorPayload } from '../types';

const props = defineProps<{
  settings: VoiceApplicationSettings;
  audioInputMode: AudioInputMode;
  parentIsProcessingLLM: boolean;
  currentMicPermission: MicPermissionStatusType; // Use defined type
}>();

const emit = defineEmits<{
  (e: 'handler-api-ready', api: SttHandlerInstance): void;
  (e: 'unmounted'): void;
  // Emit structured data for transcriptions and errors
  (e: 'transcription', data: TranscriptionData): void;
  (e: 'processing-audio', isProcessing: boolean): void;
  (e: 'is-listening-for-wake-word', isListening: boolean): void;
  (e: 'error', payload: SttHandlerErrorPayload): void;
  (e: 'wake-word-detected'): void;
}>();

const isActive = ref(false);
const isListeningForWakeWord = ref(false);
const pendingTranscript = ref(''); // Used by the SttHandlerInstance contract
const hasPendingTranscript = computed(() => !!pendingTranscript.value.trim());

const mainCore = ref<BrowserSpeechCore | null>(null);
const vadCore = ref<BrowserSpeechCore | null>(null); // For VAD wake word listening
let activeRecognitionMode: RecognitionMode = 'single'; // To track current mode for core

// Browser support status (simplified, actual check is in BrowserSpeechCore)
const isBrowserSupported = ref(true); // Assume true, core will report if not

function createCores(): void {
  const commonConfig = { language: props.settings.speechLanguage, maxAlternatives: 1 };

  // Main core (for PTT, Continuous, VAD Command Capture)
  if (!mainCore.value) {
    const mainEvents: BrowserSpeechEvents = {
      onStart: () => {
        console.log('[BSH_Main] Recognition started');
        isActive.value = true; // This core is now active
        emit('processing-audio', true);
        if (activeRecognitionMode === 'single') { // PTT
            pendingTranscript.value = '';
        } else if (activeRecognitionMode === 'vad-command') {
            pendingTranscript.value = '';
            startVadCommandTimeout();
        }
        // For continuous, buffer is managed internally, pendingTranscript reflects it
      },
      onResult: (text: string, isFinal: boolean) => {
        if (props.parentIsProcessingLLM && activeRecognitionMode !== 'vad-command') return; // Allow VAD commands
        pendingTranscript.value = text; // Update pending for interim display
        if (isFinal) {
          emit('transcription', { text, isFinal });
          if (activeRecognitionMode === 'vad-command') {
            clearVadCommandTimeout(); // Final result for VAD command received
            // Transition back to wake listening is handled by mode manager / parent
          }
        }
      },
      onError: (message: string, code: string, isFatal?: boolean) => {
        console.error(`[BSH_Main] Error: ${code} - ${message}`);
        emit('error', { type: `main_speech_${code}`, message, code, fatal: isFatal });
        isActive.value = false;
        emit('processing-audio', false);
      },
      onEnd: (reason: string) => {
        console.log(`[BSH_Main] Recognition ended. Reason: ${reason}`);
        const wasActive = isActive.value;
        isActive.value = false; // This core is no longer active
        if (wasActive) emit('processing-audio', false);

        // If VAD command capture ended (e.g. timeout, or normal end without result after wake word)
        if (activeRecognitionMode === 'vad-command' && reason !== 'stopped') { // "stopped" implies deliberate action
             clearVadCommandTimeout();
             // Parent/mode manager should decide to return to wake listening
             console.log('[BSH_Main] VAD Command capture ended, reason:', reason);
        }
      },
      // Add other event handlers as needed, e.g., onAudioStart, onSpeechEnd
    };
    mainCore.value = new BrowserSpeechCore(commonConfig, mainEvents);
    if (!mainCore.value.isSupported()) isBrowserSupported.value = false;
  }

  // VAD core (specifically for Wake Word listening if VAD mode is active)
  if (props.audioInputMode === 'voice-activation' && !vadCore.value) {
    const vadEvents: BrowserSpeechEvents = {
      onStart: () => {
        console.log('[BSH_VAD] Wake listening started');
        isListeningForWakeWord.value = true;
        emit('is-listening-for-wake-word', true);
        emit('processing-audio', true); // VAD wake listening is also a form of audio processing
      },
      onResult: (text: string, isFinal: boolean) => {
        if (!isFinal) return; // Only process final results for wake word
        // Basic wake word check (can be more sophisticated)
        const wakeWords = props.settings.vadWakeWordsBrowserSTT || [];
        const lowerText = text.toLowerCase();
        if (wakeWords.some(word => lowerText.includes(word.toLowerCase()))) {
          console.log('[BSH_VAD] Wake word detected:', text);
          // Stop VAD core, parent/mode manager will start mainCore for command
          vadCore.value?.stop(true); // Abort VAD core immediately
          emit('wake-word-detected');
        }
      },
      onError: (message: string, code: string, isFatal?: boolean) => {
        console.error(`[BSH_VAD] Error: ${code} - ${message}`);
        // Don't emit minor errors like 'no-speech' for VAD wake unless they become persistent
        if (code !== 'no-speech' && code !== 'aborted') {
          emit('error', { type: `vad_wake_speech_${code}`, message, code, fatal: isFatal });
        }
        isListeningForWakeWord.value = false;
        emit('is-listening-for-wake-word', false);
        emit('processing-audio', false);
      },
      onEnd: (reason: string) => {
        console.log(`[BSH_VAD] Wake listening ended. Reason: ${reason}`);
        const wasListening = isListeningForWakeWord.value;
        isListeningForWakeWord.value = false;
        if (wasListening) {
            emit('is-listening-for-wake-word', false);
            emit('processing-audio', false);
        }
        // VAD core might auto-restart if continuous and ended unexpectedly.
      },
    };
    vadCore.value = new BrowserSpeechCore({ ...commonConfig, continuous: true, interimResults: false }, vadEvents);
    if (!vadCore.value.isSupported()) isBrowserSupported.value = false; // Check support for VAD core too
  }
}

let vadCommandTimeout: number | null = null;
function startVadCommandTimeout(): void {
  clearVadCommandTimeout();
  const timeoutDuration = props.settings.vadCommandTimeoutMs ?? 7000; // From settings
  vadCommandTimeout = window.setTimeout(() => {
    console.log('[BSH_Main] VAD command capture timed out.');
    mainCore.value?.stop(true); // Abort command capture
    // Event for timeout can be handled by onEnd of mainCore or a specific error
    emit('error', { type: 'vad_command_timeout', message: 'Command capture timed out.', code: 'timeout', fatal: false });
  }, timeoutDuration);
}
function clearVadCommandTimeout(): void {
  if (vadCommandTimeout) clearTimeout(vadCommandTimeout);
  vadCommandTimeout = null;
}


async function startListening(forVadCommandCapture: boolean = false): Promise<boolean> {
  if (!isBrowserSupported.value) {
    emit('error', { type: 'browser_not_supported', message: 'Speech recognition not supported by this browser.', fatal: true });
    return false;
  }
  if (props.currentMicPermission !== 'granted') {
    emit('error', { type: 'permission_denied', message: 'Microphone permission not granted.', fatal: true });
    return false;
  }

  createCores(); // Ensure cores are initialized

  if (forVadCommandCapture) {
    // VAD Command Capture: Stop VAD core (if active), start Main core
    activeRecognitionMode = 'vad-command';
    if (vadCore.value?.getState() !== 'idle') vadCore.value?.stop(true);
    isListeningForWakeWord.value = false; // No longer listening for wake
    emit('is-listening-for-wake-word', false);
    console.log('[BSH] Starting Main core for VAD command capture.');
    return mainCore.value?.start('vad-command') ?? Promise.resolve(false);
  } else if (props.audioInputMode === 'voice-activation') {
    // VAD Wake Word Listening: Stop Main core (if active), start VAD core
    activeRecognitionMode = 'vad-wake';
    if (mainCore.value?.getState() !== 'idle') mainCore.value?.stop(true);
    isActive.value = false; // Main core is not for this
    console.log('[BSH] Starting VAD core for wake word listening.');
    return vadCore.value?.start('vad-wake') ?? Promise.resolve(false);
  } else {
    // PTT or Continuous: Use Main core
    activeRecognitionMode = props.audioInputMode === 'continuous' ? 'continuous' : 'single';
    console.log(`[BSH] Starting Main core for ${activeRecognitionMode} mode.`);
    return mainCore.value?.start(activeRecognitionMode) ?? Promise.resolve(false);
  }
}

async function stopListening(abort: boolean = false): Promise<void> {
  console.log(`[BSH] stopListening called (abort: ${abort}) for mode: ${activeRecognitionMode}`);
  clearVadCommandTimeout(); // Clear VAD command timeout if any

  if (activeRecognitionMode === 'vad-wake' && vadCore.value) {
    vadCore.value.stop(abort);
  } else if (mainCore.value) { // Covers PTT, Continuous, VAD Command
    mainCore.value.stop(abort);
  }
  // State updates (isActive, isListeningForWakeWord) are handled by core's onEnd/onError
}

async function reinitialize(): Promise<void> {
  console.log('[BSH] Reinitializing cores...');
  await stopAll(true); // Stop everything first
  // Destroy and recreate cores to apply new settings like language
  mainCore.value?.destroy(); mainCore.value = null;
  vadCore.value?.destroy(); vadCore.value = null;
  isBrowserSupported.value = true; // Reset support status, createCores will re-check
  await nextTick(); // Allow Vue to process DOM updates if any
  createCores(); // This will re-check support via core constructors
  if (!isBrowserSupported.value) {
     emit('error', { type: 'browser_not_supported', message: 'Speech recognition not supported after reinitialize.', fatal: true });
  }
}

async function stopAll(abort: boolean = true): Promise<void> {
  console.log('[BSH] stopAll called');
  clearVadCommandTimeout();
  mainCore.value?.stop(abort);
  vadCore.value?.stop(abort);
  // isActive and isListeningForWakeWord will be set by the onEnd handlers of the cores.
}

// Expose API for SttModeManager
const handlerApi: SttHandlerInstance = {
  isActive,
  isListeningForWakeWord,
  hasPendingTranscript,
  pendingTranscript,
  startListening,
  stopListening,
  reinitialize,
  stopAll,
  clearPendingTranscript: () => { pendingTranscript.value = ''; },
};

onMounted(() => {
  console.log('[BSH] Mounted. Initializing cores.');
  createCores(); // Create cores on mount
  emit('handler-api-ready', handlerApi);
   if (!isBrowserSupported.value) {
     emit('error', { type: 'browser_not_supported', message: 'Speech recognition not supported by this browser.', fatal: true });
   }
});

onBeforeUnmount(() => {
  console.log('[BSH] Unmounting. Destroying cores.');
  mainCore.value?.destroy();
  vadCore.value?.destroy();
  emit('unmounted');
});

// Watch for settings changes that require core reconfiguration
watch(() => props.settings.speechLanguage, (newLang, oldLang) => {
  if (newLang !== oldLang && (mainCore.value || vadCore.value)) {
    console.log(`[BSH] Language changed to ${newLang}. Reconfiguring cores.`);
    mainCore.value?.updateConfig({ language: newLang });
    vadCore.value?.updateConfig({ language: newLang });
    // Some browsers might require a full reinitialization for language change to take effect.
    // Consider calling reinitialize() here if simple updateConfig isn't enough.
  }
});

</script>