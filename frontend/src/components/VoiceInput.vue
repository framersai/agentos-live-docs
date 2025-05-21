vue<template>
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
        :disabled="isProcessing"
        :class="[
          'p-2 sm:p-3 rounded-full transition-all duration-300 focus:outline-none transform hover:scale-105',
          isRecording 
            ? 'bg-gradient-to-r from-red-500 to-red-600 mic-active wave-animation' 
            : 'bg-gradient-to-r from-primary-600 to-primary-500',
          isProcessing ? 'opacity-50 cursor-not-allowed' : 'shadow-md hover:shadow-lg'
        ]"
      >
        <svg v-if="isRecording" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </button>
    </div>
    
    <!-- Recording status -->
    <div v-if="isRecording" class="mt-2 text-sm font-medium text-red-600 dark:text-red-400 animate-pulse">
      Recording... {{ recordingSeconds.toFixed(1) }}s
    </div>
    
    <!-- Interim transcript -->
    <div v-if="interimTranscript" class="mt-2 p-2 sm:p-3 w-full max-w-3xl mx-auto bg-gray-100 dark:bg-gray-800 rounded-md text-sm shadow-inner">
      <span class="text-gray-500 dark:text-gray-400">Listening: </span>{{ interimTranscript }}
    </div>
    
    <!-- API method indicator -->
    <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
      Using: {{ speechPreference === 'whisper' ? 'OpenAI Whisper (Cloud)' : 'Web Speech API (Browser)' }}
      <button 
        @click="toggleSpeechMethod" 
        class="ml-2 text-primary-600 dark:text-primary-400 hover:underline"
      >
        Switch
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useStorage } from '@vueuse/core';
import axios from 'axios';

// Props
const props = defineProps<{
  isProcessing: boolean;
}>();

// Emits
const emit = defineEmits<{
  transcription: [value: string];
}>();

// Refs
const isRecording = ref(false);
const interimTranscript = ref('');
const finalTranscript = ref('');
const recordingSeconds = ref(0);
const textInput = ref('');
const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<Blob[]>([]);
const silenceDetectionInterval = ref<number | null>(null);
const recordingTimer = ref<number | null>(null);
const speechRecognition = ref<any>(null);
const speechPreference = useStorage('speechPreference', 'whisper');

// Toggle speech recognition method
const toggleSpeechMethod = () => {
  speechPreference.value = speechPreference.value === 'whisper' ? 'webspeech' : 'whisper';
};

// Format for speech method display
const speechMethodDisplay = computed(() => {
  return speechPreference.value === 'whisper' 
    ? 'OpenAI Whisper (Higher Accuracy)' 
    : 'Web Speech API (Browser, Free)';
});

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
  
  speechRecognition.value.onresult = (event: any) => {
    let interim = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        finalTranscript.value += event.results[i][0].transcript + ' ';
      } else {
        interim += event.results[i][0].transcript;
      }
    }
    
    interimTranscript.value = interim;
  };
  
  speechRecognition.value.onerror = (event: any) => {
    console.error('Speech recognition error:', event.error);
    stopRecording();
  };
  
  return true;
};

// Start recording with Web Speech API
const startWebSpeechRecording = () => {
  if (!speechRecognition.value) return false;
  
  try {
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

// Initialize microphone recording
const initMicrophoneRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    mediaRecorder.value = new MediaRecorder(stream);
    audioChunks.value = [];
    
    mediaRecorder.value.ondataavailable = (event) => {
      audioChunks.value.push(event.data);
    };
    
    mediaRecorder.value.onstop = async () => {
      const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' });
      
      // Create form data for the API request
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      try {
        const response = await axios.post('/api/speech', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Send transcription to parent component
        if (response.data.transcription) {
          emit('transcription', response.data.transcription);
        }
      } catch (error) {
        console.error('Error transcribing audio:', error);
      }
    };
    
    return true;
  } catch (error) {
    console.error('Error accessing microphone:', error);
    return false;
  }
};

// Start microphone recording
const startMicrophoneRecording = () => {
  if (!mediaRecorder.value) return false;
  
  try {
    audioChunks.value = [];
    mediaRecorder.value.start();
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

// Set up recording timer
const startRecordingTimer = () => {
  recordingSeconds.value = 0;
  recordingTimer.value = window.setInterval(() => {
    recordingSeconds.value += 0.1;
    
    // Auto-stop after 30 seconds to prevent very long recordings
    if (recordingSeconds.value > 30) {
      stopRecording();
    }
  }, 100);
};

// Set up silence detection
const startSilenceDetection = () => {
  // Implement advanced silence detection here
  // For simplicity, we'll use a basic timer-based approach
  silenceDetectionInterval.value = window.setTimeout(() => {
    if (isRecording.value) {
      stopRecording();
    }
  }, 3000); // 3 seconds of apparent silence
};

// Toggle recording state
const toggleRecording = async () => {
  if (isRecording.value) {
    stopRecording();
  } else {
    await startRecording();
  }
};

// Start recording
const startRecording = async () => {
  isRecording.value = true;
  interimTranscript.value = '';
  
  // Determine which recording method to use based on user preference
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
    //startSilenceDetection();
  } else {
    isRecording.value = false;
    console.error('Failed to start recording with any method');
  }
};

// Stop recording
const stopRecording = () => {
  isRecording.value = false;
  
  // Stop the timers
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value);
    recordingTimer.value = null;
  }
  
  if (silenceDetectionInterval.value) {
    clearTimeout(silenceDetectionInterval.value);
    silenceDetectionInterval.value = null;
  }
  
  // Stop Web Speech if active
  stopWebSpeechRecording();
  
  // Stop microphone recording if active
  stopMicrophoneRecording();
  
  // If we have a final transcript from Web Speech API, use it
  if (finalTranscript.value) {
    emit('transcription', finalTranscript.value);
    finalTranscript.value = '';
  }
  
  interimTranscript.value = '';
};

// Handle text submission
const handleTextSubmit = () => {
  if (textInput.value.trim() && !isRecording.value && !props.isProcessing) {
    emit('transcription', textInput.value);
    textInput.value = '';
  }
};

// Initialize on component mount
onMounted(async () => {
  // Initialize Web Speech API if available
  initWebSpeechAPI();
  
  // Initialize microphone access
  await initMicrophoneRecording();
});

// Clean up on component unmount
onBeforeUnmount(() => {
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value);
  }
  
  if (silenceDetectionInterval.value) {
    clearTimeout(silenceDetectionInterval.value);
  }
  
  stopWebSpeechRecording();
  stopMicrophoneRecording();
});
</script>