<template>
  <div class="voice-input-wrapper">
    <div class="input-container">
      <div class="text-input-wrapper">
        <input
          v-model="textInput"
          type="text"
          class="text-input"
          placeholder="Type your question or use voice..."
          :disabled="isRecording || isProcessing"
          @keydown.enter="handleTextSubmit"
        >
      </div>
      
      <div class="voice-controls">
        <button 
          @click="toggleRecording" 
          :disabled="isProcessing"
          :class="[
            'voice-button',
            {
              'recording': isRecording || isContinuousListening,
              'processing': isProcessing,
              'disabled': isProcessing
            }
          ]"
          :title="getButtonTitle()"
        >
          <div class="button-content">
            <div v-if="isRecording || isContinuousListening" class="recording-indicator">
              <div class="pulse-animation">
                <div class="pulse-ring"></div>
                <div class="pulse-ring pulse-ring-2"></div>
              </div>
              <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2" stroke-width="2"/>
              </svg>
            </div>
            
            <svg v-else class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            
            <div v-if="isProcessing" class="processing-spinner">
              <svg class="icon animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        </button>
        
        <button 
          @click="cycleAudioMode"
          class="mode-toggle"
          :title="`Audio Mode: ${getAudioModeDisplay()}`"
        >
          <svg v-if="currentAudioMode === 'continuous'" class="mode-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          <svg v-else class="mode-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v3M7 4H5a1 1 0 00-1 1v3m12-4v3a1 1 0 001 1h2" />
          </svg>
        </button>
      </div>
    </div>
    
    <div class="status-section">
      <div v-if="isRecording || isContinuousListening" class="status-indicator recording-status">
        <div class="status-dot"></div>
        <span class="status-text">{{ getRecordingStatusText() }}</span>
        <span v-if="currentAudioMode === 'push-to-talk' && isRecording" class="timer"> {{ recordingSeconds.toFixed(1) }}s
        </span>
        
        <div v-if="currentAudioMode === 'continuous' && isContinuousListening" class="continuous-controls">
          <button
            v-if="pendingTranscription"
            @click="sendPendingTranscription"
            class="control-btn send-btn"
          >
            Send
          </button>
          <button
            @click="clearPendingTranscription"
            class="control-btn clear-btn"
          >
            Clear
          </button>
        </div>
      </div>
      
      <div v-if="permissionStatus" class="status-indicator" :class="getPermissionStatusClass()">
        <span class="status-text">{{ permissionStatus }}</span>
        <button v-if="showPermissionHelp" @click="showChromePermissionInstructions" class="help-link">
          Help
        </button>
      </div>
      
      <div v-if="currentAudioMode === 'continuous' && (pauseDetected || silenceDetected)" class="status-indicator detection-status">
        <div v-if="pauseDetected" class="pause-indicator">
          <div class="pause-dot"></div>
          <span class="pause-text">Auto-send in {{ Math.ceil(pauseCountdown / 1000) }}s</span>
        </div>
         </div>
    </div>
    
    <div v-if="(liveTranscription || pendingTranscription) && currentAudioMode === 'continuous'" class="transcription-preview">
      <div class="preview-header">
        <span class="preview-label">
          {{ liveTranscription ? 'Listening...' : (pendingTranscription ? 'Ready to Send / Paused' : '') }}
        </span>
        <button
          v-if="pendingTranscription"
          @click="editPendingTranscription"
          class="edit-btn"
        >
          Edit
        </button>
      </div>
      <div class="preview-content">
        <span v-if="liveTranscription" class="live-text">{{ liveTranscription }}</span>
        <span v-if="pendingTranscription && !liveTranscription" class="pending-text">{{ pendingTranscription }}</span>
      </div>
    </div>
    
    <div v-if="interimTranscript && currentAudioMode !== 'continuous' && isRecording" class="interim-transcript">
      <span class="interim-label">Listening:</span>
      <span class="interim-text">{{ interimTranscript }}</span>
    </div>
    
    <div v-if="showVoiceLevels && audioLevels.length > 0 && (isRecording || isContinuousListening)" class="voice-activity">
      <div class="activity-header">
        <span class="activity-label">Voice Activity</span>
        <span class="activity-stats">{{ Math.round(voiceActivityStats.avgLevel * 100) }}%</span>
      </div>
      <div class="activity-bars">
        <div 
          v-for="(level, index) in displayAudioLevels" 
          :key="index" 
          class="activity-bar"
          :style="{ height: `${Math.max(2, level)}px` }" :class="getVoiceLevelClass(level / 100)" />
      </div>
    </div>
    
    <div class="method-info">
      <span class="method-text">
        {{ getTranscriptionMethodDisplay() }}
      </span>
      <button @click="toggleSpeechMethod" class="method-toggle" title="Switch Transcription Method">
        Switch
      </button>
      <span class="mode-text">
        {{ getAudioModeDisplay() }}
      </span>
    </div>

    <div v-if="showEditModal" class="modal-overlay" @click="cancelEdit">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Edit Transcription</h3>
          <button @click="cancelEdit" class="modal-close">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <textarea
          v-model="editingTranscription"
          class="modal-textarea"
          placeholder="Edit your transcription..."
          rows="4"
        />
        <div class="modal-actions">
          <button @click="cancelEdit" class="btn-secondary">
            Cancel
          </button>
          <button @click="saveEdit" class="btn-primary">
            Save & Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useStorage } from '@vueuse/core';

// Props
const props = defineProps<{
  isProcessing: boolean;
  audioMode: string; 
}>();

// Emits
const emit = defineEmits<{
  transcription: [value: string];
  'update:audio-mode': [value: string];
}>();

// Core refs
const isRecording = ref(false);
const isContinuousListening = ref(false);
const interimTranscript = ref('');
const finalTranscript = ref('');
const liveTranscription = ref('');
const pendingTranscription = ref('');
const recordingSeconds = ref(0);
const textInput = ref('');
const hasPermissions = ref(false);
const permissionStatus = ref('');
const showPermissionHelp = ref(false);

// Smart detection refs
const showVoiceLevels = ref(false);
const pauseDetected = ref(false);
const silenceDetected = ref(false); // Added for explicit tracking if needed
const pauseCountdown = ref(0);
const audioLevels = ref<number[]>([]);
const voiceActivityStats = ref({ avgLevel: 0, status: 'idle' });
const showEditModal = ref(false);
const editingTranscription = ref('');

// Audio processing variables
// let mediaRecorder: MediaRecorder | null = null; // For Whisper uploads, not direct recording here yet
let speechRecognition: any = null; 
let audioContext: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let recordingTimer: number | null = null; // Stores ID from setInterval
let pauseTimer: number | null = null; // Stores ID from setTimeout

// Settings
const speechPreference = useStorage('speechPreference', 'webspeech');
const selectedAudioDevice = useStorage('selectedAudioDevice', '');
const pauseTimeoutDuration = useStorage('pauseTimeoutMs', 3000); // Explicitly Ms

// Computed properties
const currentAudioMode = computed(() => props.audioMode);

const displayAudioLevels = computed(() => {
  return audioLevels.value.slice(-20).map(level => Math.max(2, level * 20)); // Max 20 bars, scale to 20px height
});


// Helper methods
const getButtonTitle = () => {
  if (props.isProcessing) return 'Processing...';
  if (isRecording.value || isContinuousListening.value) {
    return currentAudioMode.value === 'continuous' ? 'Stop Continuous Listening' : 'Stop Recording';
  }
  return currentAudioMode.value === 'continuous' ? 'Start Continuous Listening' : 'Start Recording (Push-to-Talk)';
};

const getRecordingStatusText = () => {
  if (currentAudioMode.value === 'continuous') {
    if (pauseDetected.value) return `Pause detected - Auto-sending in ${Math.ceil(pauseCountdown.value / 1000)}s`;
    if (liveTranscription.value) return 'Listening... (say "stop listening" or click to end)';
    if (pendingTranscription.value) return 'Paused. Ready to send or continue speaking.';
    return isContinuousListening.value ? 'Listening continuously...' : 'Continuous mode idle.';
  }
  return isRecording.value ? 'Recording...' : 'Push-to-Talk idle.';
};

const getPermissionStatusClass = () => {
  const statusLower = permissionStatus.value.toLowerCase();
  if (statusLower.includes('granted') || statusLower.includes('✓')) return 'status-success';
  if (statusLower.includes('denied') || statusLower.includes('error')) return 'status-error';
  return 'status-warning';
};

const getVoiceLevelClass = (level: number) => { // level is 0-1
  if (level > 0.7) return 'level-high';
  if (level > 0.4) return 'level-medium';
  if (level > 0.1) return 'level-low';
  return 'level-silent';
};

const getTranscriptionMethodDisplay = () => {
  return speechPreference.value === 'whisper' ? 'Method: Whisper API' : 'Method: Web Speech';
};

const getAudioModeDisplay = () => {
  return currentAudioMode.value === 'continuous' ? 'Mode: Continuous' : 'Mode: Push-to-Talk';
};

// Core methods
const cycleAudioMode = () => {
  const modes = ['push-to-talk', 'continuous'];
  const currentIndex = modes.indexOf(currentAudioMode.value);
  const nextIndex = (currentIndex + 1) % modes.length;
  emit('update:audio-mode', modes[nextIndex]);
};

const toggleSpeechMethod = () => {
  speechPreference.value = speechPreference.value === 'whisper' ? 'webspeech' : 'whisper';
  if (isRecording.value || isContinuousListening.value) {
    stopAllAudioProcessing();
    // Optionally, try to restart with the new method if permissions are granted
    if (hasPermissions.value) {
        if(currentAudioMode.value === 'continuous') startContinuousListening();
        // For PTT, user would click again
    }
  }
};

const showChromePermissionInstructions = () => {
  alert(`To enable microphone access in Chrome:\n1. Click the 🔒 (padlock) or 🎤 (microphone) icon in the address bar (left side).\n2. In the dropdown, find "Microphone" and select "Allow".\n3. If "Microphone" is not listed, click "Site settings" and change Microphone to "Allow".\n4. You may need to refresh the page for changes to take effect.`);
};

const sendPendingTranscription = () => {
  if (pendingTranscription.value.trim()) {
    emit('transcription', pendingTranscription.value.trim());
  }
  clearPendingTranscription();
};

const clearPendingTranscription = () => {
  pendingTranscription.value = '';
  liveTranscription.value = '';
  pauseDetected.value = false;
  if (pauseTimer !== null) { // TS FIX: Check for null
    clearTimeout(pauseTimer);
    pauseTimer = null;
  }
  pauseCountdown.value = 0;
};

const editPendingTranscription = () => {
  editingTranscription.value = pendingTranscription.value;
  showEditModal.value = true;
};

const saveEdit = () => {
  pendingTranscription.value = editingTranscription.value;
  showEditModal.value = false;
  sendPendingTranscription();
};

const cancelEdit = () => {
  showEditModal.value = false;
  editingTranscription.value = '';
};

const handleTextSubmit = () => {
  if (textInput.value.trim() && !isRecording.value && !props.isProcessing) {
    emit('transcription', textInput.value.trim());
    textInput.value = '';
  }
};

const requestMicrophoneAccess = async (): Promise<MediaStream | null> => {
  // ... (implementation from previous correct version, ensures hasPermissions is set)
  permissionStatus.value = 'Requesting microphone access...';
  showPermissionHelp.value = false;
  try {
    const constraints: MediaStreamConstraints = {
      audio: selectedAudioDevice.value 
        ? { deviceId: { exact: selectedAudioDevice.value } }
        : { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    hasPermissions.value = true;
    permissionStatus.value = 'Microphone access granted ✓';
    setTimeout(() => { if(permissionStatus.value.includes('granted')) permissionStatus.value = ''; }, 3000);
    return stream;
  } catch (error: any) {
    hasPermissions.value = false;
    showPermissionHelp.value = true; 
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      permissionStatus.value = 'Error: Microphone access denied by user.';
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      permissionStatus.value = 'Error: No microphone found.';
    } else {
      permissionStatus.value = `Error: Mic access - ${error.name}`;
      console.error('Microphone access error:', error);
    }
    return null;
  }
};

const initWebSpeechAPI = () => {
  // ... (implementation from previous correct version)
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    console.warn('Web Speech API not supported by this browser.');
    if(speechPreference.value === 'webspeech') permissionStatus.value = 'Web Speech API not supported.';
    return false;
  }
  const SpeechRecognitionAPI = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
  speechRecognition = new SpeechRecognitionAPI();
  speechRecognition.continuous = true; 
  speechRecognition.interimResults = true;
  speechRecognition.maxAlternatives = 1;

  speechRecognition.onresult = (event: any) => {
    let interim = '';
    let finalPart = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) finalPart += transcript + ' ';
      else interim += transcript;
    }
    if (currentAudioMode.value === 'continuous') {
      liveTranscription.value = interim; 
      if (finalPart.trim()) {
        pendingTranscription.value = (pendingTranscription.value + finalPart).trim();
        liveTranscription.value = ''; 
        resetPauseDetection(); 
      }
    } else { 
      interimTranscript.value = finalTranscript.value + interim; 
      if (finalPart.trim()) finalTranscript.value += finalPart;
    }
  };
  speechRecognition.onerror = (event: any) => { /* ... (error handling from previous version) ... */ 
    console.error('Speech recognition error:', event.error, event.message);
    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
      hasPermissions.value = false; permissionStatus.value = 'Error: Microphone permission denied for speech.'; showPermissionHelp.value = true;
    } else if (event.error === 'no-speech') {
      permissionStatus.value = 'No speech detected. Try again.';
      if (currentAudioMode.value === 'continuous' && isContinuousListening.value) resetPauseDetection();
    } else if (event.error === 'network') permissionStatus.value = 'Network error with Speech API.';
    else permissionStatus.value = `Speech API Error: ${event.error}`;
  };
  speechRecognition.onend = () => {
    if (currentAudioMode.value === 'continuous' && isContinuousListening.value && speechRecognition && !props.isProcessing) {
      try { speechRecognition.start(); } catch (e) { console.error("Error restarting speech recognition:", e); }
    } else if (!isContinuousListening.value) {
        isRecording.value = false;
    }
  };
  return true;
};

const resetPauseDetection = () => {
  if (pauseTimer !== null) { // TS FIX: Check for null
    clearTimeout(pauseTimer);
    // pauseTimer = null; // pauseTimer is assigned a new value below or remains null
  }
  pauseDetected.value = false;
  pauseCountdown.value = 0;

  if (currentAudioMode.value === 'continuous' && pendingTranscription.value.trim() && isContinuousListening.value) {
    pauseTimer = window.setTimeout(() => { // Assign new timer ID
      if (pendingTranscription.value.trim() && isContinuousListening.value) {
        pauseDetected.value = true;
        pauseCountdown.value = pauseTimeoutDuration.value;
        
        const countdownInterval = setInterval(() => {
          if (!pauseDetected.value) {
            clearInterval(countdownInterval);
            return;
          }
          pauseCountdown.value -= 100;
          if (pauseCountdown.value <= 0) {
            clearInterval(countdownInterval);
            if(pauseDetected.value) sendPendingTranscription();
          }
        }, 100);
      }
    }, 500); 
  } else {
    pauseTimer = null; // Ensure it's null if conditions not met
  }
};

const startWebSpeechRecording = async () => {
  // ... (implementation from previous correct version, ensure it returns boolean)
  if (!speechRecognition) { if (!initWebSpeechAPI()) return false; }
  if (!hasPermissions.value) { if (!(await requestMicrophoneAccess())) return false; }
  try {
    if (currentAudioMode.value !== 'continuous') { finalTranscript.value = ''; interimTranscript.value = ''; }
    speechRecognition.start();
    return true;
  } catch (error: any) {
    console.error('Failed to start Web Speech API:', error);
    if (error.name === 'InvalidStateError' && speechRecognition) return true; 
    permissionStatus.value = `Could not start speech: ${error.message}`;
    return false;
  }
};

const stopWebSpeechRecording = () => {
  // ... (implementation from previous correct version)
  if (speechRecognition) {
    try { speechRecognition.stop(); } catch (error) { /* console.warn('Error stopping speech recognition:', error); */ }
  }
};

const startRecordingTimer = () => {
  recordingSeconds.value = 0;
  if (recordingTimer !== null) clearInterval(recordingTimer); // TS FIX: Check for null
  recordingTimer = window.setInterval(() => {
    recordingSeconds.value += 0.1;
    if (currentAudioMode.value === 'push-to-talk' && recordingSeconds.value >= 30) {
      stopRecording();
    }
  }, 100);
};

const toggleRecording = async () => {
  // ... (implementation from previous correct version)
  if (props.isProcessing) return; 
  if (currentAudioMode.value === 'continuous') {
    if (isContinuousListening.value) stopContinuousListening();
    else await startContinuousListening();
  } else { 
    if (isRecording.value) stopRecording();
    else await startRecording();
  }
};

const startContinuousListening = async () => {
  // ... (implementation from previous correct version)
  const stream = await requestMicrophoneAccess();
  if (!stream) return;
  isContinuousListening.value = true; isRecording.value = false; 
  if (speechPreference.value === 'webspeech') {
    if (!(await startWebSpeechRecording())) isContinuousListening.value = false;
  } else if (speechPreference.value === 'whisper') {
    permissionStatus.value = 'Continuous Whisper not fully implemented.'; isContinuousListening.value = false;
  }
};

const stopContinuousListening = () => {
  // ... (implementation from previous correct version)
  isContinuousListening.value = false;
  if (speechPreference.value === 'webspeech') stopWebSpeechRecording();
  if (pendingTranscription.value.trim()) sendPendingTranscription();
  clearPendingTranscription();
};

const startRecording = async () => { // For Push-to-Talk
  // ... (implementation from previous correct version)
  const stream = await requestMicrophoneAccess();
  if (!stream) return;
  isRecording.value = true; isContinuousListening.value = false;
  interimTranscript.value = ''; finalTranscript.value = '';
  let recordingStartedSuccessfully = false;
  if (speechPreference.value === 'webspeech') recordingStartedSuccessfully = await startWebSpeechRecording();
  else if (speechPreference.value === 'whisper') { permissionStatus.value = 'PTT Whisper not implemented.'; recordingStartedSuccessfully = false; }
  if (recordingStartedSuccessfully) startRecordingTimer();
  else isRecording.value = false;
};

const stopRecording = () => { // For Push-to-Talk
  // ... (implementation from previous correct version)
  isRecording.value = false;
  if (recordingTimer !== null) { clearInterval(recordingTimer); recordingTimer = null; } // TS FIX
  if (speechPreference.value === 'webspeech') {
    stopWebSpeechRecording(); 
    if (finalTranscript.value.trim()) emit('transcription', finalTranscript.value.trim());
  }
  interimTranscript.value = ''; finalTranscript.value = ''; recordingSeconds.value = 0;
};

const stopAllAudioProcessing = () => {
    isRecording.value = false;
    isContinuousListening.value = false;
    if (recordingTimer !== null) { // TS FIX
        clearInterval(recordingTimer);
        recordingTimer = null;
    }
    if (pauseTimer !== null) { // TS FIX
        clearTimeout(pauseTimer);
        pauseTimer = null;
    }
    stopWebSpeechRecording();
    if (audioContext) {
        audioContext.close().catch(e => console.error("Error closing AudioContext:", e));
        audioContext = null;
        analyser = null;
    }
};

// Lifecycle hooks
watch(() => props.audioMode, (newMode, oldMode) => {
  if (newMode !== oldMode) {
    stopAllAudioProcessing();
    clearPendingTranscription(); // Ensure continuous mode state is reset
    interimTranscript.value = ''; finalTranscript.value = ''; // Reset PTT transcripts
    if (newMode === 'continuous' && hasPermissions.value) {
      startContinuousListening();
    }
  }
});

watch(() => speechPreference.value, (newPref, oldPref) => {
    if (newPref !== oldPref) {
        console.log(`Speech preference changed from ${oldPref} to ${newPref}`);
        stopAllAudioProcessing();
        if (newPref === 'webspeech') initWebSpeechAPI(); // Re-init if switching to WebSpeech
        if ((currentAudioMode.value === 'continuous' && hasPermissions.value)) {
            startContinuousListening(); // Attempt to restart listening with new preference
        }
    }
});

onMounted(async () => {
  // Don't auto-request on mount, let user click trigger if needed or handled by continuous mode logic
  if (speechPreference.value === 'webspeech') {
    initWebSpeechAPI();
  }
  // If default mode is continuous, and permissions were perhaps granted previously, try starting.
  // This needs careful handling to avoid permission prompts without user action.
  if (currentAudioMode.value === 'continuous') {
    // Check if permission was already granted in this session or from storage
    const perm = await navigator.permissions?.query({ name: 'microphone' as PermissionName });
    if (perm && perm.state === 'granted') {
        hasPermissions.value = true;
        startContinuousListening();
    } else if (hasPermissions.value) { // If hasPermissions was set true by a previous manual call
        startContinuousListening();
    }
  }
});

onBeforeUnmount(() => {
  stopAllAudioProcessing();
});

</script>

<style scoped>
/* Styles remain the same as previous correct version */
.voice-input-wrapper {
  @apply w-full max-w-3xl mx-auto text-sm; /* Adjusted max-width and base font size */
}

/* Main Input Container */
.input-container {
  @apply flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg; /* Enhanced shadow and rounding */
}

.text-input-wrapper {
  @apply flex-1;
}

.text-input {
  @apply w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow;
}
.text-input:focus {
    @apply shadow-md;
}

.voice-controls {
  @apply flex items-center gap-2;
}

/* Voice Button */
.voice-button {
  @apply relative w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800;
  background: linear-gradient(145deg, #4f8ff7, #2563eb); /* Default gradient */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.1);
}

.voice-button:hover:not(.disabled) {
  @apply scale-105 shadow-xl;
  background: linear-gradient(145deg, #60a5fa, #3b82f6);
}
.voice-button:active:not(.disabled) {
    @apply scale-95 shadow-md;
}

.voice-button.recording {
  background: linear-gradient(145deg, #f87171, #ef4444); /* Red gradient for recording */
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.5), 0 2px 4px rgba(0,0,0,0.1);
}

.voice-button.processing {
  @apply opacity-70 cursor-wait bg-gray-400 dark:bg-gray-600;
}

.voice-button.disabled {
  @apply opacity-60 cursor-not-allowed bg-gray-300 dark:bg-gray-700;
  box-shadow: none;
}

.button-content {
  @apply relative w-full h-full flex items-center justify-center;
}

.icon { /* For microphone, stop icons */
  @apply w-5 h-5 sm:w-6 sm:h-6 text-white;
}

/* Recording Animation */
.recording-indicator { /* Used within button-content */
  @apply relative flex items-center justify-center w-full h-full;
}
.pulse-animation { @apply absolute inset-0; }
.pulse-ring {
  @apply absolute inset-0 rounded-full border-2 border-white/50;
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
.pulse-ring.pulse-ring-2 { animation-delay: 0.5s; }

@keyframes pulse {
  0% { transform: scale(0.8); opacity: 0.7; }
  70% { transform: scale(1.2); opacity: 0; }
  100% { transform: scale(0.8); opacity: 0; }
}

.processing-spinner .icon { @apply w-5 h-5 sm:w-5 sm:h-5; } /* Spinner icon size */

/* Mode Toggle */
.mode-toggle {
  @apply w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500;
}
.mode-icon { @apply w-4 h-4 sm:w-5 sm:h-5; }

/* Status Section */
.status-section { @apply mt-2.5 space-y-1.5 text-xs sm:text-sm; }

.status-indicator {
  @apply flex items-center gap-2 px-3 py-1.5 rounded-lg border;
}

.recording-status { @apply bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700/50; }
.status-success { @apply bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700/50; }
.status-error { @apply bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700/50; }
.status-warning { @apply bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700/50; }
.detection-status { @apply bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700/50; }

.status-dot { @apply w-2 h-2 bg-current rounded-full animate-pulse; } 
.pause-dot { @apply w-2 h-2 bg-current rounded-full animate-pulse; }

.status-text { @apply font-medium flex-1; } 
.timer { @apply ml-auto font-mono text-gray-500 dark:text-gray-400; }
.help-link { @apply ml-auto underline hover:no-underline cursor-pointer text-blue-600 dark:text-blue-400; }

/* Continuous Controls */
.continuous-controls { @apply flex items-center gap-2 ml-auto; }
.control-btn { @apply px-2.5 py-1 text-xs rounded-md border font-medium transition-colors shadow-sm; }
.send-btn { @apply bg-blue-500 text-white border-blue-600 hover:bg-blue-600; }
.clear-btn { @apply bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500; }

/* Transcription Preview */
.transcription-preview { @apply mt-2.5 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700/50 shadow-sm; }
.preview-header { @apply flex items-center justify-between mb-1.5; }
.preview-label { @apply text-xs font-semibold text-blue-700 dark:text-blue-300; }
.edit-btn { @apply text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium; }
.preview-content { @apply text-sm text-blue-800 dark:text-blue-200 whitespace-pre-wrap break-words; }
.live-text { @apply italic opacity-80; }
.pending-text { @apply font-normal; } 

/* Interim Transcript */
.interim-transcript { @apply mt-2.5 p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg border border-gray-200 dark:border-gray-600/50 shadow-sm; }
.interim-label { @apply text-xs font-semibold text-gray-600 dark:text-gray-400 mr-2; }
.interim-text { @apply text-sm text-gray-800 dark:text-gray-200 italic; }

/* Voice Activity */
.voice-activity { @apply mt-2.5 p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg shadow-sm; }
.activity-header { @apply flex items-center justify-between mb-1.5; }
.activity-label { @apply text-xs font-semibold text-gray-600 dark:text-gray-400; }
.activity-stats { @apply text-xs font-mono text-gray-500 dark:text-gray-500; }
.activity-bars { @apply flex items-end gap-px h-5 sm:h-6; } 
.activity-bar { @apply flex-1 rounded-sm transition-all duration-100; } 
.level-high { @apply bg-red-400 dark:bg-red-500; }
.level-medium { @apply bg-yellow-400 dark:bg-yellow-500; }
.level-low { @apply bg-green-400 dark:bg-green-500; }
.level-silent { @apply bg-gray-200 dark:bg-gray-600; }

/* Method Info */
.method-info { @apply mt-2.5 flex items-center justify-end text-xs text-gray-500 dark:text-gray-400 gap-2; }
.method-text { @apply font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-full; }
.method-toggle { @apply text-blue-600 dark:text-blue-400 hover:underline cursor-pointer; }
.mode-text { @apply capitalize px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-full; }

/* Modal Styles */
.modal-overlay { @apply fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4; }
.modal-content { @apply bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg mx-auto; }
.modal-header { @apply flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700; }
.modal-title { @apply text-lg font-semibold text-gray-900 dark:text-white; }
.modal-close { @apply p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700; }
.modal-textarea {
  @apply w-auto m-4 sm:m-5 p-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}
.modal-actions { @apply flex justify-end gap-2 sm:gap-3 p-4 sm:p-5 border-t border-gray-200 dark:border-gray-700; }

.btn-secondary { 
  @apply px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm;
}
.btn-primary { 
  @apply px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm;
}

/* Responsive */
@media (max-width: 640px) { /* sm breakpoint */
  .input-container { @apply flex-col gap-2.5 sm:gap-3; }
  .text-input-wrapper { @apply w-full; }
  .voice-controls { @apply w-full justify-center; }
  .voice-button { @apply w-10 h-10 sm:w-11 sm:h-11; }
  .icon { @apply w-4 h-4 sm:w-5 sm:h-5; }
  .mode-toggle { @apply w-8 h-8 sm:w-9 sm:h-9; }
  .mode-icon { @apply w-3.5 h-3.5 sm:w-4 sm:h-4; }
}
</style>