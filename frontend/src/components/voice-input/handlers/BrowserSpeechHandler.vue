// File: frontend/src/components/voice-input/handlers/BrowserSpeechHandler.vue
// Version: 4.0.0 - Refactored for event-based communication
<template>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, inject, nextTick } from 'vue';
import type { VoiceApplicationSettings, AudioInputMode } from '@/services/voice.settings.service';
import type { ToastService } from '@/services/services';

// Props
const props = defineProps<{
  settings: VoiceApplicationSettings;
  audioInputMode: AudioInputMode;
  parentIsProcessingLLM: boolean;
  currentMicPermission: 'prompt' | 'granted' | 'denied' | 'error' | '';
}>();

// Emits
const emit = defineEmits<{
  (e: 'mounted'): void;
  (e: 'unmounted'): void;
  (e: 'transcription', value: string): void;
  (e: 'processing-audio', isProcessingAudio: boolean): void;
  (e: 'is-listening-for-wake-word', isListening: boolean): void;
  (e: 'error', payload: { type: string; message: string; code?: string }): void;
  (e: 'wake-word-detected'): void;
}>();

const toast = inject<ToastService>('toast');

// State
type RecognitionState =
  | 'IDLE'
  | 'STARTING_MAIN'
  | 'MAIN_ACTIVE'
  | 'STARTING_VAD_WAKE'
  | 'VAD_WAKE_LISTENING'
  | 'STOPPING';

const state = ref<RecognitionState>('IDLE');
const mainRecognizer = ref<SpeechRecognition | null>(null);
const vadRecognizer = ref<SpeechRecognition | null>(null);
const isActive = ref(false);
const isListeningForWakeWord = ref(false);

// Transcript management
const interimTranscript = ref('');
const finalTranscript = ref('');
const pendingTranscript = ref('');
const hasPendingTranscript = computed(() => !!pendingTranscript.value.trim());

// Timers
let continuousPauseTimer: number | null = null;
let vadCommandTimer: number | null = null;
let restartTimer: number | null = null;

// Computed
const isPttMode = computed(() => props.audioInputMode === 'push-to-talk');
const isContinuousMode = computed(() => props.audioInputMode === 'continuous');
const isVoiceActivationMode = computed(() => props.audioInputMode === 'voice-activation');

// Create recognizer instance
function createRecognizer(forWakeWord: boolean = false): SpeechRecognition | null {
  const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognitionAPI) {
    emit('error', { type: 'init', message: 'Web Speech API not supported' });
    return null;
  }

  const recognizer: SpeechRecognition = new SpeechRecognitionAPI();
  recognizer.lang = props.settings.speechLanguage || 'en-US';
  recognizer.continuous = forWakeWord || isContinuousMode.value;
  recognizer.interimResults = !forWakeWord;
  recognizer.maxAlternatives = 1;

  return recognizer;
}

// Initialize main recognizer
function initMainRecognizer(): boolean {
  if (mainRecognizer.value) {
    try {
      mainRecognizer.value.abort();
    } catch (e) {
      console.warn('[BSH] Error aborting old recognizer:', e);
    }
    mainRecognizer.value = null;
  }

  const recognizer = createRecognizer(false);
  if (!recognizer) return false;

  recognizer.onstart = () => {
    console.log('[BSH] Main recognizer started');
    if (state.value === 'STARTING_MAIN') {
      state.value = 'MAIN_ACTIVE';
      isActive.value = true;
      emit('processing-audio', true);
    }
  };

  recognizer.onresult = (event: SpeechRecognitionEvent) => {
    if (state.value !== 'MAIN_ACTIVE') return;
    
    clearTimers();
    
    let interim = '';
    let final = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        final += transcript;
      } else {
        interim += transcript;
      }
    }
    
    interimTranscript.value = interim;
    
    if (final.trim()) {
      if (isPttMode.value) {
        finalTranscript.value += (finalTranscript.value ? ' ' : '') + final;
      } else if (isContinuousMode.value) {
        pendingTranscript.value += (pendingTranscript.value ? ' ' : '') + final;
        if (props.settings.continuousModeAutoSend) {
          startContinuousPauseTimer();
        }
      }
    }
  };

  recognizer.onerror = (event: SpeechRecognitionErrorEvent) => {
    console.error('[BSH] Main recognizer error:', event.error);
    handleError(event.error);
  };

  recognizer.onend = () => {
    console.log('[BSH] Main recognizer ended');
    const wasActive = state.value === 'MAIN_ACTIVE' || state.value === 'STARTING_MAIN';
    
    mainRecognizer.value = null; // Clear ref after it's truly ended
    state.value = 'IDLE';
    isActive.value = false;
    
    if (wasActive) {
      emit('processing-audio', false);
      
      // Send any pending transcripts
      if (isPttMode.value && finalTranscript.value.trim()) {
        emit('transcription', finalTranscript.value.trim());
        finalTranscript.value = '';
      } else if (isContinuousMode.value && pendingTranscript.value.trim() && props.settings.continuousModeAutoSend) {
        // Only emit if auto-send is on, otherwise it's sent via explicit call or on mode change
        emit('transcription', pendingTranscript.value.trim());
        pendingTranscript.value = '';
      }
      
      // Auto-restart for continuous mode
      if (isContinuousMode.value && props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) {
        scheduleRestart();
      }
    }
    
    // Clear interim transcripts regardless of mode, final for PTT handled above
    interimTranscript.value = ''; 
    if(!isPttMode.value && !isContinuousMode.value) finalTranscript.value = ''; // Clear if not PTT or continuous (e.g. VAD command mode)
  };

  mainRecognizer.value = recognizer;
  return true;
}

// Initialize VAD wake word recognizer
function initVadRecognizer(): boolean {
  if (vadRecognizer.value) {
    try {
      vadRecognizer.value.abort();
    } catch (e) {
      console.warn('[BSH] Error aborting old VAD recognizer:', e);
    }
    vadRecognizer.value = null;
  }

  const recognizer = createRecognizer(true); // forWakeWord = true
  if (!recognizer) return false;

  recognizer.onstart = () => {
    console.log('[BSH] VAD recognizer started');
    if (state.value === 'STARTING_VAD_WAKE') {
      state.value = 'VAD_WAKE_LISTENING';
      isListeningForWakeWord.value = true;
      emit('is-listening-for-wake-word', true);
    }
  };

  recognizer.onresult = (event: SpeechRecognitionEvent) => {
    if (state.value !== 'VAD_WAKE_LISTENING' || props.parentIsProcessingLLM) return;
    
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      // For VAD, we usually care about final results to check for wake word
      if (event.results[i].isFinal) { 
        transcript += event.results[i][0].transcript;
      } else { 
        // Optionally, one could check interim results too for faster detection if needed
        transcript += event.results[i][0].transcript; 
      }
    }
    
    const wakeWords = props.settings.vadWakeWordsBrowserSTT || ['v', 'vee']; // Default wake words
    const detected = wakeWords.some(word => 
      transcript.toLowerCase().includes(word.toLowerCase())
    );
    
    if (detected) {
      console.log('[BSH] Wake word detected:', transcript);
      toast?.add({ 
        type: 'info', 
        title: 'Wake word activated!', 
        message: 'Listening for command...',
        duration: 2000 
      });
      
      // Stop VAD listener
      if (vadRecognizer.value) {
        vadRecognizer.value.stop(); // Let it send final result if any, then onend will handle state
      }
      
      // Emit wake word detected
      emit('wake-word-detected');
    }
  };

  recognizer.onerror = (event: SpeechRecognitionErrorEvent) => {
    console.error('[BSH] VAD recognizer error:', event.error);
    if (event.error !== 'no-speech' && event.error !== 'aborted') {
      emit('error', { type: 'speech', message: `VAD Error: ${event.error}`, code: event.error });
    }
    // VAD errors usually lead to restart, handled in onend
  };

  recognizer.onend = () => {
    console.log('[BSH] VAD recognizer ended');
    const wasListening = state.value === 'VAD_WAKE_LISTENING' || state.value === 'STARTING_VAD_WAKE';
    
    vadRecognizer.value = null; // Clear ref
    state.value = 'IDLE';
    isListeningForWakeWord.value = false;
    
    if (wasListening) {
      emit('is-listening-for-wake-word', false);
      
      // Auto-restart VAD if appropriate (e.g., not stopped due to wake word detection that starts main listener)
      // and if we are still in voice activation mode and no LLM processing
      if (isVoiceActivationMode.value && props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM && !isActive.value /* Ensure main recognizer didn't just start */) {
        scheduleRestart();
      }
    }
  };

  vadRecognizer.value = recognizer;
  return true;
}

// Start listening
async function startListening(forVadCommand: boolean = false): Promise<void> {
  console.log('[BSH] startListening called, forVadCommand:', forVadCommand, 'current state:', state.value);
  
  if (state.value !== 'IDLE') {
    console.warn('[BSH] Cannot start, state is not IDLE:', state.value);
    // Optionally, try to stop existing recognition before starting new one if this is a valid recovery path
    // await stopAll(true); 
    // await nextTick(); // ensure state is updated
    // if (state.value !== 'IDLE') {
    //   console.error('[BSH] Still not IDLE after stopAll. Aborting start.');
    //   return;
    // }
    return; // Current behavior: do not start if not IDLE
  }
  
  if (props.currentMicPermission !== 'granted') {
    emit('error', { type: 'permission', message: 'Microphone permission not granted' });
    return;
  }
  
  clearTimers();
  clearTranscripts(); // Clear any old transcripts before starting new recognition
  
  if (isVoiceActivationMode.value && !forVadCommand) {
    // Start VAD wake word listener
    state.value = 'STARTING_VAD_WAKE';
    if (!initVadRecognizer()) {
      state.value = 'IDLE'; // Revert state if init failed
      return;
    }
    
    try {
      vadRecognizer.value!.start();
    } catch (e: any) {
      console.error('[BSH] Error starting VAD recognizer:', e);
      emit('error', { type: 'speech', message: `Failed to start VAD: ${e.message || e.name}`, code: e.name });
      state.value = 'IDLE'; // Revert state on error
      if (vadRecognizer.value) { // Clean up recognizer if start failed
         initVadRecognizer(); // This will set vadRecognizer.value to null if it fails.
      }
    }
  } else {
    // Start main recognizer (for PTT, Continuous, or VAD command)
    state.value = 'STARTING_MAIN';
    if (!initMainRecognizer()) {
      state.value = 'IDLE'; // Revert state if init failed
      return;
    }
    
    try {
      mainRecognizer.value!.start();
      
      if (forVadCommand) {
        // Set timeout for VAD command
        vadCommandTimer = window.setTimeout(() => {
          if (state.value === 'MAIN_ACTIVE' && isVoiceActivationMode.value) {
            console.log('[BSH] VAD command silence timeout. Stopping.');
            stopListening(); // Stop main recognizer, VAD will restart via its onend logic
          }
        }, props.settings.vadSilenceTimeoutMs || 2500);
      }
    } catch (e: any) {
      console.error('[BSH] Error starting main recognizer:', e);
      emit('error', { type: 'speech', message: `Failed to start: ${e.message || e.name}`, code: e.name });
      state.value = 'IDLE'; // Revert state on error
      if (mainRecognizer.value) { // Clean up recognizer if start failed
          initMainRecognizer(); // This will set mainRecognizer.value to null if it fails.
      }
    }
  }
}

// Stop listening
async function stopListening(abort: boolean = false): Promise<void> {
  console.log('[BSH] stopListening called, abort:', abort, 'current state:', state.value);
  
  clearTimers(); // Clear any pending timers like VAD command or continuous pause
  
  const previousState = state.value;
  state.value = 'STOPPING';

  if (mainRecognizer.value && (previousState === 'MAIN_ACTIVE' || previousState === 'STARTING_MAIN')) {
    try {
      if (abort) {
        mainRecognizer.value.abort();
      } else {
        mainRecognizer.value.stop();
      }
    } catch (e) {
      console.warn('[BSH] Error stopping main recognizer:', e);
      // If stopping fails, force state to IDLE and nullify recognizer
      mainRecognizer.value = null;
      if(state.value === 'STOPPING') state.value = 'IDLE'; // Only if still in stopping, might have changed in onend
      isActive.value = false;
      emit('processing-audio', false);
    }
  }
  
  if (vadRecognizer.value && (previousState === 'VAD_WAKE_LISTENING' || previousState === 'STARTING_VAD_WAKE')) {
    try {
      // VAD usually should be aborted to stop immediately, unless specific reason to 'stop'
      vadRecognizer.value.abort(); 
    } catch (e) {
      console.warn('[BSH] Error stopping VAD recognizer:', e);
      vadRecognizer.value = null;
      if(state.value === 'STOPPING') state.value = 'IDLE';
      isListeningForWakeWord.value = false;
      emit('is-listening-for-wake-word', false);
    }
  }
  
  // If no recognizers were active or they were already null, ensure state is reset
  if (!mainRecognizer.value && !vadRecognizer.value && state.value === 'STOPPING') {
    state.value = 'IDLE';
    isActive.value = false;
    isListeningForWakeWord.value = false;
    emit('processing-audio', false);
    emit('is-listening-for-wake-word', false);
  }
}

// Reinitialize
async function reinitialize(): Promise<void> {
  console.log('[BSH] Reinitializing. Current mode:', props.audioInputMode);
  await stopAll(true); // Abort current operations
  
  // Auto-start if appropriate after reinitialization
  // Use nextTick to allow Vue to process state changes from stopAll before starting again
  await nextTick(); 
  if (props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) {
    if (isVoiceActivationMode.value || isContinuousMode.value) {
      console.log('[BSH] Reinitializing: Auto-starting listening for VAD/Continuous.')
      startListening();
    } else if (isPttMode.value && isActive.value) {
      // This case is tricky for PTT, usually PTT is user-initiated.
      // If PTT was active, reinitialize might mean it should be ready to start on next push.
      // For now, PTT doesn't auto-start after reinitialize.
    }
  }
}

// Stop all recognition and reset state
async function stopAll(abort: boolean = true): Promise<void> {
  console.log('[BSH] stopAll called, abort:', abort);
  await stopListening(abort); // This will set state to STOPPING, onEnd handlers eventually set to IDLE.
                              // Need to ensure state becomes IDLE if onEnd doesn't fire (e.g. no recognizer was active)
  
  clearTimers();
  clearTranscripts(); // Clear all transcripts

  // Explicitly reset all relevant states as stopListening might not cover all paths if no recognizer was active
  state.value = 'IDLE';
  isActive.value = false;
  isListeningForWakeWord.value = false;
  
  // Ensure recognizer refs are nullified if not already by their onEnd handlers
  if (mainRecognizer.value) {
      try { if (abort) mainRecognizer.value.abort(); else mainRecognizer.value.stop(); } catch(e){}
      mainRecognizer.value = null;
  }
  if (vadRecognizer.value) {
      try { vadRecognizer.value.abort(); } catch(e){}
      vadRecognizer.value = null;
  }

  emit('processing-audio', false);
  emit('is-listening-for-wake-word', false);
}

// Clear pending transcript (typically for continuous mode)
function clearPendingTranscript(): void {
  pendingTranscript.value = '';
}

// Helper functions
function clearTimers(): void {
  if (continuousPauseTimer) {
    clearTimeout(continuousPauseTimer);
    continuousPauseTimer = null;
  }
  if (vadCommandTimer) {
    clearTimeout(vadCommandTimer);
    vadCommandTimer = null;
  }
  if (restartTimer) {
    clearTimeout(restartTimer);
    restartTimer = null;
  }
}

function clearTranscripts(): void {
  interimTranscript.value = '';
  finalTranscript.value = '';
  // pendingTranscript is handled more specifically, e.g. cleared on send or mode change
  // but for a full stopAll, it should be cleared.
  pendingTranscript.value = '';
}

function startContinuousPauseTimer(): void {
  clearTimers(); // Clear any existing timer (important for subsequent speech spurts)
  
  continuousPauseTimer = window.setTimeout(() => {
    if (pendingTranscript.value.trim() && !props.parentIsProcessingLLM && isContinuousMode.value && state.value === 'MAIN_ACTIVE') {
      emit('transcription', pendingTranscript.value.trim());
      pendingTranscript.value = '';
    }
  }, props.settings.continuousModePauseTimeoutMs || 3000);
}

function scheduleRestart(): void {
  clearTimers(); // Clear other timers before scheduling a restart
  restartTimer = window.setTimeout(() => {
    // Ensure conditions are still met for restart
    if (state.value === 'IDLE' && 
        props.currentMicPermission === 'granted' && 
        !props.parentIsProcessingLLM &&
        (isContinuousMode.value || isVoiceActivationMode.value)) {
      console.log('[BSH] Restart timer triggered. Starting listening.');
      startListening();
    } else {
      console.log('[BSH] Restart timer triggered, but conditions not met. State:', state.value, 'Perm:', props.currentMicPermission, 'LLM:', props.parentIsProcessingLLM);
    }
  }, 500); // Short delay before restarting
}

function handleError(errorCode: string): void {
  console.log(`[BSH] handleError called with: ${errorCode}`);
  const wasActive = isActive.value;
  const wasListeningVAD = isListeningForWakeWord.value;
  
  // Reset core states immediately
  state.value = 'IDLE';
  isActive.value = false;
  isListeningForWakeWord.value = false;
  mainRecognizer.value = null; // Ensure recognizer ref is cleared on error
  vadRecognizer.value = null; // Ensure VAD recognizer ref is cleared

  if (wasActive) {
    emit('processing-audio', false);
  }
  if (wasListeningVAD) {
    emit('is-listening-for-wake-word', false);
  }
  
  // Do not emit application-level error for common, recoverable speech events
  if (errorCode !== 'no-speech' && errorCode !== 'aborted' && errorCode !== 'audio-capture') {
    emit('error', { 
      type: 'speech', 
      message: `Recognition error: ${errorCode}`, 
      code: errorCode 
    });
  } else if (errorCode === 'audio-capture') {
    // audio-capture is more severe, usually mic issues
     emit('error', { 
      type: 'permission', // or 'hardware'
      message: `Audio capture error. Please check microphone. (${errorCode})`, 
      code: errorCode 
    });
  }
  
  // Auto-restart for continuous/VAD modes if appropriate
  if ((isContinuousMode.value || isVoiceActivationMode.value) && 
      props.currentMicPermission === 'granted' && 
      !props.parentIsProcessingLLM) {
    console.log(`[BSH] Error (${errorCode}) occurred. Scheduling restart for continuous/VAD mode.`);
    scheduleRestart();
  }
}

// Watchers
watch(() => props.audioInputMode, async (newMode, oldMode) => {
  if (newMode === oldMode) return;
  console.log(`[BSH] Audio input mode changed: ${oldMode} -> ${newMode}. Reinitializing.`);
  // Send any pending transcript from continuous mode before reinitializing
  if (oldMode === 'continuous' && pendingTranscript.value.trim() && props.settings.continuousModeAutoSend) {
      emit('transcription', pendingTranscript.value.trim());
  }
  pendingTranscript.value = ''; // Clear pending transcript on mode change
  await reinitialize();
});

watch(() => props.parentIsProcessingLLM, async (isProcessing, wasProcessing) => {
  if (isProcessing === wasProcessing) return;
  console.log(`[BSH] parentIsProcessingLLM changed: ${wasProcessing} -> ${isProcessing}. State: ${state.value}`);

  if (isProcessing) {
    // LLM started processing
    if (isActive.value || isListeningForWakeWord.value) {
      console.log('[BSH] LLM processing started. Stopping STT.');
      // Abort immediately. The onend handler will check parentIsProcessingLLM
      // and should not auto-restart if it's true.
      await stopListening(true); 
    }
    // If continuous mode had a pending transcript, send it now as LLM is starting
    if (isContinuousMode.value && pendingTranscript.value.trim() && props.settings.continuousModeAutoSend) {
        console.log('[BSH] LLM processing started. Sending pending continuous transcript.');
        emit('transcription', pendingTranscript.value.trim());
        pendingTranscript.value = '';
    }
    clearTimers(); // Stop continuous pause timer for example
  } else {
    // LLM finished processing
    // Check if we should restart listening (e.g., continuous or VAD mode)
    if (state.value === 'IDLE' && props.currentMicPermission === 'granted') {
      if (isContinuousMode.value || isVoiceActivationMode.value) {
        console.log('[BSH] LLM finished processing. Attempting to restart STT for continuous/VAD mode.');
        await nextTick(); // Allow other state updates
        startListening();
      }
    }
  }
});

watch(() => props.currentMicPermission, async (newPerm, oldPerm) => {
  if (newPerm === oldPerm) return;
  console.log(`[BSH] Mic permission changed: ${oldPerm} -> ${newPerm}. State: ${state.value}`);
  if (newPerm !== 'granted') {
    console.log('[BSH] Mic permission not granted. Stopping all.');
    await stopAll(true); // Abort all activities
  } else if (newPerm === 'granted' && oldPerm !== 'granted') {
    // Mic permission newly granted
    // If in a mode that should auto-start (Continuous or VAD) and not processing LLM
    if (state.value === 'IDLE' && !props.parentIsProcessingLLM) {
      if (isContinuousMode.value || isVoiceActivationMode.value) {
        console.log('[BSH] Mic perm granted. Auto-starting continuous/VAD.');
        await nextTick();
        startListening();
      }
    }
  }
});

watch(() => props.settings.speechLanguage, async (newLang, oldLang) => {
  if (newLang && oldLang && newLang !== oldLang) {
    console.log(`[BSH] Speech language changed: ${oldLang} -> ${newLang}. Reinitializing.`);
    await reinitialize();
  }
});

// Lifecycle Hooks
onMounted(() => {
  console.log('[BSH] Mounted. Emitting mounted event. Mode:', props.audioInputMode);
  emit('mounted');
  // Initial auto-start if conditions are met
  if (props.currentMicPermission === 'granted' && !props.parentIsProcessingLLM) {
    if (isContinuousMode.value || isVoiceActivationMode.value) {
      console.log('[BSH] Mounted: Auto-starting listening for VAD/Continuous.')
      startListening();
    }
  }
});

onBeforeUnmount(async () => {
  console.log('[BSH] Unmounting. Stopping all recognition.');
  await stopAll(true); // Ensure everything is aborted and cleaned up
  emit('unmounted');
});

// Expose public API
defineExpose({
  startListening,
  stopListening,
  reinitialize,
  stopAll,
  isActive, // reactive ref
  isListeningForWakeWord, // reactive ref
  hasPendingTranscript, // computed ref
  pendingTranscript, // reactive ref (for parent to read if needed)
  clearPendingTranscript, // method
});

</script>