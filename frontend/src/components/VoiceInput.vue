<template>
  <div class="flex flex-col items-center">
    <div class="flex items-center w-full max-w-3xl mx-auto">
      <!-- Text input for fallback -->
      <input
        v-model="textInput"
        type="text"
        class="input mr-2 transition-all duration-300 focus:ring-primary-500 focus:border-primary-400"
        placeholder="Type your question or click the microphone..."
        :disabled="isRecording || isProcessing"
        @keydown.enter="handleTextSubmit"
      >
      
      <!-- Voice recording button -->
      <button 
        @click="toggleRecording" 
        :disabled="isProcessing || (audioMode === 'continuous' && !hasPermissions)"
        :class="[
          'p-2 sm:p-3 rounded-full transition-all duration-300 focus:outline-none transform hover:scale-105',
          getButtonClass(),
          isProcessing ? 'opacity-50 cursor-not-allowed' : 'shadow-md hover:shadow-lg'
        ]"
      >
        <svg v-if="isRecording || isContinuousListening" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </button>
      
      <!-- Audio mode toggle for quick access -->
      <div class="ml-2 flex items-center">
        <button 
          @click="cycleAudioMode"
          class="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-all"
          :title="`Audio Mode: ${audioMode}`"
        >
          <svg v-if="audioMode === 'continuous'" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          <svg v-else-if="audioMode === 'voice-activation'" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v3M7 4H5a1 1 0 00-1 1v3m12-4v3a1 1 0 001 1h2" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Recording status -->
    <div v-if="isRecording || isContinuousListening" class="mt-2 flex items-center gap-2">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <span class="text-sm font-medium text-red-600 dark:text-red-400">
          {{ getRecordingStatusText() }}
        </span>
      </div>
      <div v-if="audioMode === 'push-to-talk'" class="text-xs text-gray-500">
        {{ recordingSeconds.toFixed(1) }}s
      </div>
    </div>
    
    <!-- Permission status -->
    <div v-if="permissionStatus" class="mt-2 text-xs px-3 py-2 rounded-lg border" :class="getPermissionStatusClass()">
      <div class="flex items-center gap-2">
        <span>{{ permissionStatus }}</span>
        <button v-if="showPermissionHelp" @click="showChromePermissionInstructions" class="text-blue-600 dark:text-blue-400 hover:underline">
          How to fix?
        </button>
      </div>
    </div>
    
    <!-- Interim transcript -->
    <div v-if="interimTranscript" class="mt-2 p-2 sm:p-3 w-full max-w-3xl mx-auto bg-gray-100 dark:bg-gray-800 rounded-md text-sm shadow-inner">
      <span class="text-gray-500 dark:text-gray-400">Listening: </span>{{ interimTranscript }}
    </div>
    
    <!-- Voice activation indicator -->
    <div v-if="audioMode === 'voice-activation' && voiceDetected" class="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
      <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      Voice detected
    </div>
    
    <!-- Audio levels (for voice activation) -->
    <div v-if="audioMode === 'voice-activation' && audioLevels.length > 0" class="mt-2 flex items-center gap-1">
      <div v-for="(level, index) in audioLevels.slice(-10)" :key="index" 
           class="w-1 bg-primary-500 rounded-full transition-all duration-100"
           :style="{ height: `${Math.max(2, level * 20)}px` }">
      </div>
    </div>
    
    <!-- API method indicator -->
    <div class="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-4">
      <span>
        Using: {{ speechPreference === 'whisper' ? 'OpenAI Whisper (Cloud)' : 'Web Speech API (Browser)' }}
        <button 
          @click="toggleSpeechMethod" 
          class="ml-2 text-primary-600 dark:text-primary-400 hover:underline"
        >
          Switch
        </button>
      </span>
      <span>
        Mode: {{ audioMode.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { useStorage } from '@vueuse/core';
import axios from 'axios';

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

// Refs
const isRecording = ref(false);
const isContinuousListening = ref(false);
const interimTranscript = ref('');
const finalTranscript = ref('');
const recordingSeconds = ref(0);
const textInput = ref('');
const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<Blob[]>([]);
const recordingTimer = ref<number | null>(null);
const speechRecognition = ref<any>(null);
const hasPermissions = ref(false);
const permissionStatus = ref('');
const voiceDetected = ref(false);
const audioLevels = ref<number[]>([]);
const audioContext = ref<AudioContext | null>(null);
const analyser = ref<AnalyserNode | null>(null);
const microphone = ref<MediaStreamAudioSourceNode | null>(null);
const voiceActivationTimer = ref<number | null>(null);
const continuousRecognitionTimer = ref<number | null>(null);
const showPermissionHelp = ref(false);

// Settings
const speechPreference = useStorage('speechPreference', 'whisper');
const voiceActivationThreshold = useStorage('voiceActivationThreshold', 0.1);
const silenceTimeout = useStorage('silenceTimeout', 2000);
const selectedAudioDevice = useStorage('selectedAudioDevice', '');

// Computed
const audioMode = computed(() => props.audioMode);

// Get button styling based on state and mode
const getButtonClass = () => {
  if (isRecording.value || isContinuousListening.value) {
    return 'bg-gradient-to-r from-red-500 to-red-600 mic-active wave-animation';
  }
  
  if (audioMode.value === 'continuous' && hasPermissions.value) {
    return 'bg-gradient-to-r from-green-600 to-green-500';
  }
  
  return 'bg-gradient-to-r from-primary-600 to-primary-500';
};

// Get recording status text
const getRecordingStatusText = () => {
  if (audioMode.value === 'continuous') {
    return 'Listening continuously...';
  }
  if (audioMode.value === 'voice-activation') {
    return voiceDetected.value ? 'Voice detected, recording...' : 'Waiting for voice...';
  }
  return 'Recording...';
};

// Get permission status styling
const getPermissionStatusClass = () => {
  if (permissionStatus.value.includes('granted') || permissionStatus.value.includes('✓')) {
    return 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200 border-green-200 dark:border-green-700';
  }
  if (permissionStatus.value.includes('denied') || permissionStatus.value.includes('error')) {
    return 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200 border-red-200 dark:border-red-700';
  }
  return 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700';
};

// Cycle through audio modes
const cycleAudioMode = () => {
  const modes = ['push-to-talk', 'continuous', 'voice-activation'];
  const currentIndex = modes.indexOf(audioMode.value);
  const nextIndex = (currentIndex + 1) % modes.length;
  emit('update:audio-mode', modes[nextIndex]);
};

// Show Chrome permission instructions
const showChromePermissionInstructions = () => {
  const instructions = `To enable microphone access in Chrome:

1. Look for the 🔒 or 🎤 icon in your address bar
2. Click on it and select "Allow" for microphone
3. Or go to Site Settings and change microphone permission to "Allow"
4. Refresh the page after changing settings

Alternative method:
1. Click the three dots menu → Settings
2. Go to Privacy and security → Site Settings → Microphone
3. Find this site and change it to "Allow"
4. Refresh the page

If you're on HTTP (not HTTPS), microphone won't work. Make sure the URL starts with "https://".`;

  alert(instructions);
};

// Toggle speech recognition method
const toggleSpeechMethod = () => {
  speechPreference.value = speechPreference.value === 'whisper' ? 'webspeech' : 'whisper';
  
  // Restart if in continuous mode
  if (audioMode.value === 'continuous') {
    stopContinuousListening();
    setTimeout(() => startContinuousListening(), 500);
  }
};

// Check microphone permissions
const checkPermissions = async () => {
  try {
    // First check if we're on HTTPS (required for microphone access)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      permissionStatus.value = 'HTTPS required for microphone access';
      hasPermissions.value = false;
      showPermissionHelp.value = true;
      return false;
    }

    // Check permission API if available
    if ('permissions' in navigator) {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      
      result.onchange = () => {
        updatePermissionStatus(result.state);
      };
      
      updatePermissionStatus(result.state);
      
      if (result.state === 'denied') {
        showPermissionHelp.value = true;
        return false;
      }
      
      return result.state === 'granted';
    } else {
      // Fallback: try to access microphone directly
      return await requestMicrophoneAccess();
    }
  } catch (error) {
    console.warn('Permission API not supported, trying direct access');
    return await requestMicrophoneAccess();
  }
};

// Update permission status display
const updatePermissionStatus = (state: string) => {
  switch (state) {
    case 'granted':
      permissionStatus.value = 'Microphone access granted ✓';
      hasPermissions.value = true;
      showPermissionHelp.value = false;
      setTimeout(() => { permissionStatus.value = ''; }, 3000);
      break;
    case 'denied':
      permissionStatus.value = 'Microphone access denied - Please enable in browser settings';
      hasPermissions.value = false;
      showPermissionHelp.value = true;
      break;
    case 'prompt':
      permissionStatus.value = 'Click to allow microphone access';
      hasPermissions.value = false;
      showPermissionHelp.value = false;
      break;
  }
};

// Request microphone access
const requestMicrophoneAccess = async () => {
  try {
    console.log('Requesting microphone access...');
    
    const constraints: MediaStreamConstraints = {
      audio: selectedAudioDevice.value 
        ? { deviceId: { exact: selectedAudioDevice.value } }
        : {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
    };
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    hasPermissions.value = true;
    permissionStatus.value = 'Microphone access granted ✓';
    showPermissionHelp.value = false;
    
    console.log('Microphone access granted');
    
    // Stop the test stream
    stream.getTracks().forEach(track => track.stop());
    
    setTimeout(() => { permissionStatus.value = ''; }, 3000);
    return true;
  } catch (error: any) {
    console.error('Microphone access error:', error);
    hasPermissions.value = false;
    showPermissionHelp.value = true;
    
    if (error.name === 'NotAllowedError') {
      permissionStatus.value = 'Microphone access denied - Please click the camera/microphone icon in your address bar';
    } else if (error.name === 'NotFoundError') {
      permissionStatus.value = 'No microphone found - Please check your audio devices';
      showPermissionHelp.value = false;
    } else if (error.name === 'NotReadableError') {
      permissionStatus.value = 'Microphone is being used by another application';
      showPermissionHelp.value = false;
    } else {
      permissionStatus.value = `Microphone error: ${error.message || 'Unknown error'}`;
    }
    
    return false;
  }
};

// Check if Web Speech API is available
const isSpeechRecognitionAvailable = () => {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

// Initialize Web Speech API
const initWebSpeechAPI = () => {
  if (!isSpeechRecognitionAvailable()) return false;
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  speechRecognition.value = new SpeechRecognition();
  speechRecognition.value.continuous = true;
  speechRecognition.value.interimResults = true;
  speechRecognition.value.maxAlternatives = 1;
  
  speechRecognition.value.onstart = () => {
    console.log('Speech recognition started');
  };
  
  speechRecognition.value.onresult = (event: any) => {
    let interim = '';
    let final = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        final += transcript + ' ';
      } else {
        interim += transcript;
      }
    }
    
    interimTranscript.value = interim;
    
    if (final) {
      finalTranscript.value += final;
      
      // In continuous mode, send transcription immediately
      if (audioMode.value === 'continuous' && final.trim()) {
        emit('transcription', final.trim());
        finalTranscript.value = '';
      }
    }
  };
  
  speechRecognition.value.onerror = (event: any) => {
    console.error('Speech recognition error:', event.error);
    
    if (event.error === 'not-allowed') {
      hasPermissions.value = false;
      permissionStatus.value = 'Microphone permission denied';
    }
    
    // Restart in continuous mode if error is not permanent
    if (audioMode.value === 'continuous' && !['not-allowed', 'service-not-allowed'].includes(event.error)) {
      setTimeout(() => {
        if (isContinuousListening.value) {
          startWebSpeechRecording();
        }
      }, 1000);
    }
  };
  
  speechRecognition.value.onend = () => {
    console.log('Speech recognition ended');
    
    // Restart in continuous mode
    if (audioMode.value === 'continuous' && isContinuousListening.value) {
      setTimeout(() => {
        if (isContinuousListening.value) {
          startWebSpeechRecording();
        }
      }, 100);
    }
  };
  
  return true;
};

// Start recording with Web Speech API
const startWebSpeechRecording = () => {
  if (!speechRecognition.value || !hasPermissions.value) return false;
  
  try {
    if (speechRecognition.value.recognizing) {
      speechRecognition.value.stop();
    }
    
    finalTranscript.value = '';
    interimTranscript.value = '';
    speechRecognition.value.start();
    return true;
  } catch (error) {
    console.error('Failed to start Web Speech API:', error);
    return false;
  }
};

// Stop Web Speech recording
const stopWebSpeechRecording = () => {
  if (!speechRecognition.value) return;
  
  try {
    speechRecognition.value.stop();
  } catch (error) {
    console.error('Error stopping speech recognition:', error);
  }
};

// Initialize audio context for voice activation detection
const initAudioContext = async () => {
  try {
    const constraints: MediaStreamConstraints = {
      audio: selectedAudioDevice.value 
        ? { deviceId: { exact: selectedAudioDevice.value } }
        : {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
    };
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    
    audioContext.value = new (window.AudioContext || window.webkitAudioContext)();
    analyser.value = audioContext.value.createAnalyser();
    microphone.value = audioContext.value.createMediaStreamSource(stream);
    
    analyser.value.fftSize = 256;
    microphone.value.connect(analyser.value);
    
    return true;
  } catch (error) {
    console.error('Error initializing audio context:', error);
    return false;
  }
};

// Monitor audio levels for voice activation
const monitorAudioLevels = () => {
  if (!analyser.value) return;
  
  const bufferLength = analyser.value.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  
  const checkLevel = () => {
    if (!analyser.value || audioMode.value !== 'voice-activation') return;
    
    analyser.value.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b) / bufferLength;
    const normalizedLevel = average / 255;
    
    audioLevels.value.push(normalizedLevel);
    if (audioLevels.value.length > 50) {
      audioLevels.value.shift();
    }
    
    // Voice activation logic
    if (normalizedLevel > voiceActivationThreshold.value) {
      if (!voiceDetected.value) {
        voiceDetected.value = true;
        startRecording();
      }
      
      // Reset silence timer
      if (voiceActivationTimer.value) {
        clearTimeout(voiceActivationTimer.value);
      }
      
      voiceActivationTimer.value = window.setTimeout(() => {
        voiceDetected.value = false;
        stopRecording();
      }, silenceTimeout.value);
    }
    
    requestAnimationFrame(checkLevel);
  };
  
  checkLevel();
};

// Initialize microphone recording for Whisper
const initMicrophoneRecording = async () => {
  try {
    const constraints: MediaStreamConstraints = {
      audio: selectedAudioDevice.value 
        ? { deviceId: { exact: selectedAudioDevice.value } }
        : {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
    };
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    
    mediaRecorder.value = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
        ? 'audio/webm;codecs=opus' 
        : 'audio/webm'
    });
    
    audioChunks.value = [];
    
    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.value.push(event.data);
      }
    };
    
    mediaRecorder.value.onstop = async () => {
      if (audioChunks.value.length === 0) return;
      
      const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' });
      
      // Only process if we have meaningful audio (> 1 second)
      if (audioBlob.size > 1000) {
        await transcribeAudio(audioBlob);
      }
      
      audioChunks.value = [];
    };
    
    return true;
  } catch (error) {
    console.error('Error accessing microphone:', error);
    hasPermissions.value = false;
    permissionStatus.value = 'Failed to access microphone';
    return false;
  }
};

// Transcribe audio using Whisper API
const transcribeAudio = async (audioBlob: Blob) => {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');
  
  try {
    const response = await axios.post('/api/speech', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if (response.data.transcription && response.data.transcription.trim()) {
      emit('transcription', response.data.transcription.trim());
    }
  } catch (error) {
    console.error('Error transcribing audio:', error);
    permissionStatus.value = 'Transcription failed - please try again';
    setTimeout(() => { permissionStatus.value = ''; }, 3000);
  }
};

// Start microphone recording
const startMicrophoneRecording = () => {
  if (!mediaRecorder.value || !hasPermissions.value) return false;
  
  try {
    if (mediaRecorder.value.state === 'recording') {
      mediaRecorder.value.stop();
    }
    
    audioChunks.value = [];
    mediaRecorder.value.start(1000); // Collect data every second
    return true;
  } catch (error) {
    console.error('Failed to start microphone recording:', error);
    return false;
  }
};

// Stop microphone recording
const stopMicrophoneRecording = () => {
  if (!mediaRecorder.value || mediaRecorder.value.state === 'inactive') return;
  
  try {
    mediaRecorder.value.stop();
  } catch (error) {
    console.error('Error stopping media recorder:', error);
  }
};

// Start continuous listening
const startContinuousListening = async () => {
  if (!hasPermissions.value) {
    const granted = await requestMicrophoneAccess();
    if (!granted) return;
  }
  
  isContinuousListening.value = true;
  
  if (speechPreference.value === 'webspeech' && isSpeechRecognitionAvailable()) {
    startWebSpeechRecording();
  } else {
    if (!mediaRecorder.value) {
      await initMicrophoneRecording();
    }
    startMicrophoneRecording();
  }
};

// Stop continuous listening
const stopContinuousListening = () => {
  isContinuousListening.value = false;
  stopWebSpeechRecording();
  stopMicrophoneRecording();
};

// Set up recording timer
const startRecordingTimer = () => {
  recordingSeconds.value = 0;
  recordingTimer.value = window.setInterval(() => {
    recordingSeconds.value += 0.1;
    
    // Auto-stop after 30 seconds for push-to-talk
    if (audioMode.value === 'push-to-talk' && recordingSeconds.value > 30) {
      stopRecording();
    }
  }, 100);
};

// Toggle recording state
const toggleRecording = async () => {
  // If no permissions, try to request them first
  if (!hasPermissions.value) {
    console.log('No permissions, requesting access...');
    permissionStatus.value = 'Requesting microphone access...';
    const granted = await requestMicrophoneAccess();
    if (!granted) {
      console.log('Permission denied');
      return;
    }
  }
  
  if (audioMode.value === 'continuous') {
    if (isContinuousListening.value) {
      stopContinuousListening();
    } else {
      await startContinuousListening();
    }
    return;
  }
  
  if (isRecording.value) {
    stopRecording();
  } else {
    await startRecording();
  }
};

// Start recording
const startRecording = async () => {
  if (!hasPermissions.value) {
    const granted = await requestMicrophoneAccess();
    if (!granted) return;
  }
  
  isRecording.value = true;
  interimTranscript.value = '';
  
  let recordingStarted = false;
  
  // Try the preferred method first
  if (speechPreference.value === 'webspeech' && isSpeechRecognitionAvailable()) {
    recordingStarted = startWebSpeechRecording();
  }
  
  // If preferred method failed or is whisper, try Whisper
  if (!recordingStarted || speechPreference.value === 'whisper') {
    if (!mediaRecorder.value) {
      await initMicrophoneRecording();
    }
    recordingStarted = startMicrophoneRecording();
  }
  
  if (recordingStarted) {
    startRecordingTimer();
  } else {
    isRecording.value = false;
    permissionStatus.value = 'Failed to start recording';
    setTimeout(() => { permissionStatus.value = ''; }, 3000);
  }
};

// Stop recording
const stopRecording = () => {
  isRecording.value = false;
  
  // Stop the timer
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value);
    recordingTimer.value = null;
  }
  
  // Stop recordings
  stopWebSpeechRecording();
  stopMicrophoneRecording();
  
  // If we have a final transcript from Web Speech API, use it
  if (finalTranscript.value && audioMode.value === 'push-to-talk') {
    emit('transcription', finalTranscript.value.trim());
    finalTranscript.value = '';
  }
  
  interimTranscript.value = '';
  voiceDetected.value = false;
};

// Handle text submission
const handleTextSubmit = () => {
  if (textInput.value.trim() && !isRecording.value && !props.isProcessing) {
    emit('transcription', textInput.value.trim());
    textInput.value = '';
  }
};

// Watch for audio mode changes
watch(() => props.audioMode, async (newMode) => {
  // Stop any current recording
  stopRecording();
  stopContinuousListening();
  
  if (voiceActivationTimer.value) {
    clearTimeout(voiceActivationTimer.value);
    voiceActivationTimer.value = null;
  }
  
  // Start appropriate mode
  if (newMode === 'continuous') {
    await startContinuousListening();
  } else if (newMode === 'voice-activation') {
    if (!audioContext.value) {
      await initAudioContext();
    }
    monitorAudioLevels();
  }
});

// Initialize on component mount
onMounted(async () => {
  // Check permissions first
  await checkPermissions();
  
  // Initialize Web Speech API if available
  initWebSpeechAPI();
  
  // Initialize microphone access
  if (hasPermissions.value) {
    await initMicrophoneRecording();
  }
  
  // Start continuous mode if that's the current setting
  if (audioMode.value === 'continuous') {
    await startContinuousListening();
  } else if (audioMode.value === 'voice-activation') {
    await initAudioContext();
    monitorAudioLevels();
  }
});

// Clean up on component unmount
onBeforeUnmount(() => {
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value);
  }
  
  if (voiceActivationTimer.value) {
    clearTimeout(voiceActivationTimer.value);
  }
  
  if (continuousRecognitionTimer.value) {
    clearInterval(continuousRecognitionTimer.value);
  }
  
  stopWebSpeechRecording();
  stopMicrophoneRecording();
  stopContinuousListening();
  
  if (audioContext.value) {
    audioContext.value.close();
  }
});
</script>

<style scoped>
.wave-animation {
  animation: wave 1.5s ease-in-out infinite;
}

@keyframes wave {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.mic-active {
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
}

.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white;
}
</style>