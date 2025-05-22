<template>
  <div class="max-w-4xl mx-auto py-4 sm:py-8 px-3 sm:px-4">
    <!-- Mobile header with back button -->
    <div class="sm:hidden flex items-center mb-4">
      <button @click="router.push('/')" class="mr-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <h1 class="text-xl font-bold dark:text-white">Settings</h1>
    </div>
    
    <div class="card">
      <!-- Desktop header -->
      <div class="hidden sm:block">
        <h1 class="text-2xl font-bold mb-6 dark:text-white">Settings</h1>
      </div>
      
      <div class="space-y-8">
        <!-- Appearance Section -->
        <section>
          <h2 class="text-lg font-semibold mb-4 dark:text-white">Appearance</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <label class="text-gray-700 dark:text-gray-300">Dark Mode</label>
              <div class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="isDarkMode" 
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- General Settings -->
        <section>
          <h2 class="text-lg font-semibold mb-4 dark:text-white">General</h2>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="defaultMode" class="block mb-2 text-gray-700 dark:text-gray-300">Default Mode</label>
                <select id="defaultMode" v-model="defaultMode" class="select">
                  <option value="coding">Coding Q&A</option>
                  <option value="system_design">System Design</option>
                  <option value="meeting">Meeting Summary</option>
                  <option value="general">General Chat</option>
                </select>
              </div>
              
              <div>
                <label for="defaultLanguage" class="block mb-2 text-gray-700 dark:text-gray-300">Default Programming Language</label>
                <select id="defaultLanguage" v-model="defaultLanguage" class="select">
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="java">Java</option>
                  <option value="c++">C++</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                  <option value="php">PHP</option>
                  <option value="ruby">Ruby</option>
                  <option value="swift">Swift</option>
                  <option value="kotlin">Kotlin</option>
                </select>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <label class="text-gray-700 dark:text-gray-300">Generate Diagrams</label>
                <p class="text-sm text-gray-500 dark:text-gray-400">Automatically generate Mermaid diagrams for system design</p>
              </div>
              <div class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="generateDiagrams" 
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Audio & Voice Settings -->
        <section>
          <h2 class="text-lg font-semibold mb-4 dark:text-white">Audio & Voice Recognition</h2>
          <div class="space-y-6">
            <!-- Audio Input Device Selection -->
            <div>
              <label for="audioDevice" class="block mb-2 text-gray-700 dark:text-gray-300">Audio Input Device</label>
              <select id="audioDevice" v-model="selectedAudioDevice" class="select">
                <option value="">Default System Microphone</option>
                <option v-for="device in audioDevices" :key="device.deviceId" :value="device.deviceId">
                  {{ device.label || `Microphone ${device.deviceId.slice(0, 8)}...` }}
                </option>
              </select>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Current: {{ getCurrentDeviceName() }}
              </p>
              <button @click="refreshAudioDevices" class="mt-2 btn-secondary text-sm">
                🔄 Refresh Devices
              </button>
            </div>
            
            <!-- Audio Mode -->
            <div>
              <label for="audioMode" class="block mb-2 text-gray-700 dark:text-gray-300">Audio Input Mode</label>
              <select id="audioMode" v-model="audioMode" class="select">
                <option value="push-to-talk">Push to Talk - Click and hold to record</option>
                <option value="continuous">Continuous Listening - Always listening</option>
                <option value="voice-activation">Voice Activation - Start recording when voice detected</option>
              </select>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ getAudioModeDescription(audioMode) }}
              </p>
            </div>
            
            <!-- Speech Recognition Method -->
            <div>
              <label for="speechPreference" class="block mb-2 text-gray-700 dark:text-gray-300">Speech Recognition Method</label>
              <select id="speechPreference" v-model="speechPreference" class="select">
                <option value="whisper">OpenAI Whisper (Higher Accuracy, Uses API Credits)</option>
                <option value="webspeech">Browser Web Speech API (Faster, Free, Chrome/Edge Only)</option>
              </select>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Whisper provides better accuracy especially for technical terms but uses API credits. Web Speech is free but less accurate and only works in Chrome/Edge browsers.
              </p>
            </div>
            
            <!-- Voice Activation Settings (only show when voice activation is selected) -->
            <div v-if="audioMode === 'voice-activation'" class="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 class="text-md font-medium text-gray-800 dark:text-gray-200">Voice Activation Settings</h3>
              
              <div>
                <label for="voiceThreshold" class="block mb-2 text-gray-700 dark:text-gray-300">
                  Voice Detection Sensitivity: {{ Math.round(voiceActivationThreshold * 100) }}%
                </label>
                <input 
                  id="voiceThreshold" 
                  v-model="voiceActivationThreshold" 
                  type="range" 
                  min="0.05" 
                  max="0.3" 
                  step="0.01"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                >
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Lower values = more sensitive (may pick up background noise). Higher values = less sensitive (may miss quiet speech).
                </p>
              </div>
              
              <div>
                <label for="silenceTimeout" class="block mb-2 text-gray-700 dark:text-gray-300">
                  Silence Timeout: {{ silenceTimeout / 1000 }}s
                </label>
                <input 
                  id="silenceTimeout" 
                  v-model="silenceTimeout" 
                  type="range" 
                  min="1000" 
                  max="5000" 
                  step="500"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                >
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  How long to wait after silence before stopping recording.
                </p>
              </div>
            </div>
            
            <!-- Continuous Mode Settings -->
            <div v-if="audioMode === 'continuous'" class="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 class="text-md font-medium text-gray-800 dark:text-gray-200">Continuous Mode Settings</h3>
              
              <div class="flex items-center justify-between">
                <div>
                  <label class="text-gray-700 dark:text-gray-300">Auto-send on Pause</label>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Automatically send transcription when you pause speaking</p>
                </div>
                <div class="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    v-model="autoSendOnPause" 
                    class="sr-only peer"
                  >
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </div>
              </div>
              
              <div>
                <label for="pauseTimeout" class="block mb-2 text-gray-700 dark:text-gray-300">
                  Pause Detection: {{ pauseTimeout / 1000 }}s
                </label>
                <input 
                  id="pauseTimeout" 
                  v-model="pauseTimeout" 
                  type="range" 
                  min="2000" 
                  max="8000" 
                  step="1000"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                >
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  How long to wait after you stop speaking before sending the transcription.
                </p>
              </div>
            </div>
            
            <!-- Microphone Test -->
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 class="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">Microphone Test</h3>
              <div class="flex items-center gap-4">
                <button 
                  @click="testMicrophone" 
                  :disabled="isTesting"
                  class="btn-secondary"
                >
                  {{ isTesting ? 'Testing...' : 'Test Microphone' }}
                </button>
                
                <div v-if="micTestResult" class="flex items-center gap-2 text-sm">
                  <span v-if="micTestResult === 'success'" class="text-green-600 dark:text-green-400">✓ Microphone working</span>
                  <span v-else-if="micTestResult === 'error'" class="text-red-600 dark:text-red-400">✗ Microphone error</span>
                  <span v-else class="text-yellow-600 dark:text-yellow-400">⚠ {{ micTestResult }}</span>
                </div>
              </div>
              
              <!-- Audio level visualization during test -->
              <div v-if="isTesting && audioLevels.length > 0" class="mt-3">
                <div class="flex items-end gap-1 h-8">
                  <div v-for="(level, index) in audioLevels.slice(-20)" :key="index" 
                       class="w-2 bg-primary-500 rounded-full transition-all duration-100"
                       :style="{ height: `${Math.max(2, level * 32)}px` }">
                  </div>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Speak to see audio levels</p>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Session Settings -->
        <section>
          <h2 class="text-lg font-semibold mb-4 dark:text-white">Session & Costs</h2>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 class="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">Current Session</h3>
                <p class="text-2xl font-bold text-primary-600 dark:text-primary-400">${{ sessionCost.toFixed(4) }}</p>
                <button @click="resetSession" class="mt-2 btn-secondary text-sm">
                  Reset Session Cost
                </button>
              </div>
              
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 class="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">Cost Threshold</h3>
                <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">${{ costThreshold.toFixed(0) }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Maximum per session</p>
              </div>
            </div>
            
            <div>
              <label for="costThreshold" class="block mb-2 text-gray-700 dark:text-gray-300">
                Cost Threshold: ${{ costThreshold.toFixed(0) }}
              </label>
              <input 
                id="costThreshold" 
                v-model="costThreshold" 
                type="range" 
                min="1" 
                max="50" 
                step="1"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              >
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Maximum amount to spend in a session before requiring confirmation.
              </p>
            </div>
          </div>
        </section>
        
        <!-- Security Section -->
        <section>
          <h2 class="text-lg font-semibold mb-4 dark:text-white">Security & Privacy</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <label class="text-gray-700 dark:text-gray-300">Remember Login</label>
                <p class="text-sm text-gray-500 dark:text-gray-400">Keep you logged in across browser sessions</p>
              </div>
              <div class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="rememberLogin" 
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </div>
            </div>
            
            <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h3 class="text-md font-medium text-red-800 dark:text-red-200 mb-2">Danger Zone</h3>
              <button @click="logout" class="btn-primary bg-red-600 hover:bg-red-700">
                Logout
              </button>
            </div>
          </div>
        </section>
        
        <!-- Export/Import Settings -->
        <section>
          <h2 class="text-lg font-semibold mb-4 dark:text-white">Backup & Restore</h2>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button @click="exportSettings" class="btn-secondary">
                Export Settings
              </button>
              <div class="relative">
                <input 
                  ref="importInput"
                  type="file" 
                  accept=".json"
                  @change="importSettings"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                >
                <button class="btn-secondary w-full">
                  Import Settings
                </button>
              </div>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Export your settings to backup or transfer to another device.
            </p>
          </div>
        </section>
      </div>
      
      <!-- Save button -->
      <div class="mt-8 flex justify-between sm:justify-end">
        <button @click="router.push('/')" class="btn-secondary mr-2 sm:hidden">
          Cancel
        </button>
        <button @click="saveSettings" class="btn-primary">
          Save Settings
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
import { api, costAPI } from '../utils/api';

// Router
const router = useRouter();

// Settings variables with local storage
const isDarkMode = useStorage('darkMode', false);
const defaultMode = useStorage('mode', 'coding');
const defaultLanguage = useStorage('language', 'python');
const generateDiagrams = useStorage('generateDiagram', true);
const speechPreference = useStorage('speechPreference', 'whisper');
const audioMode = useStorage('audioMode', 'push-to-talk');
const costThreshold = useStorage('costThreshold', 20.0);
const rememberLogin = useStorage('rememberLogin', true);
const selectedAudioDevice = useStorage('selectedAudioDevice', '');

// Audio settings
const voiceActivationThreshold = useStorage('voiceActivationThreshold', 0.1);
const silenceTimeout = useStorage('silenceTimeout', 2000);
const autoSendOnPause = useStorage('autoSendOnPause', true);
const pauseTimeout = useStorage('pauseTimeout', 3000);

// Session cost (fetched from API)
const sessionCost = ref(0);

// Audio devices
const audioDevices = ref<MediaDeviceInfo[]>([]);

// Microphone test
const isTesting = ref(false);
const micTestResult = ref('');
const audioLevels = ref<number[]>([]);
const importInput = ref<HTMLInputElement | null>(null);

// Audio context for testing
let audioContext: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let microphone: MediaStreamAudioSourceNode | null = null;
let testStream: MediaStream | null = null;

// Get audio mode description
const getAudioModeDescription = (mode: string) => {
  switch (mode) {
    case 'push-to-talk':
      return 'Click and hold the microphone button to record your voice. Release to stop.';
    case 'continuous':
      return 'The microphone stays active and listens continuously. Great for long conversations.';
    case 'voice-activation':
      return 'Automatically starts recording when it detects your voice. Stops after silence.';
    default:
      return '';
  }
};

// Get current device name
const getCurrentDeviceName = () => {
  if (!selectedAudioDevice.value) return 'Default System Microphone';
  
  const device = audioDevices.value.find(d => d.deviceId === selectedAudioDevice.value);
  return device?.label || `Microphone ${selectedAudioDevice.value.slice(0, 8)}...`;
};

// Refresh audio devices
const refreshAudioDevices = async () => {
  try {
    console.log('Requesting microphone permission for device enumeration...');
    
    // Request permission first - this is required to get device labels
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log('Permission granted, stopping test stream...');
    
    // Stop the permission test stream immediately
    stream.getTracks().forEach(track => track.stop());
    
    // Now get all devices with proper labels
    const devices = await navigator.mediaDevices.enumerateDevices();
    audioDevices.value = devices.filter(device => device.kind === 'audioinput');
    
    console.log('Audio devices found:', audioDevices.value.length);
    console.log('Audio devices:', audioDevices.value);
  } catch (error: any) {
    console.error('Error refreshing audio devices:', error);
    
    if (error.name === 'NotAllowedError') {
      alert(`Microphone permission denied. To enable:

1. Look for the 🔒 or 🎤 icon in your address bar
2. Click it and select "Allow" for microphone
3. Or go to Chrome Settings → Privacy → Site Settings → Microphone
4. Add this site to the "Allowed" list
5. Refresh this page

Current URL needs permission: ${window.location.origin}`);
    } else {
      alert(`Error accessing audio devices: ${error.message}`);
    }
  }
};

// Test microphone functionality
const testMicrophone = async () => {
  isTesting.value = true;
  micTestResult.value = '';
  audioLevels.value = [];
  
  try {
    console.log('Testing microphone...');
    
    // Request microphone access with selected device
    const constraints: MediaStreamConstraints = {
      audio: selectedAudioDevice.value 
        ? { 
            deviceId: { exact: selectedAudioDevice.value },
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        : {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
    };
    
    console.log('Using constraints:', constraints);
    testStream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log('Microphone access granted for testing');
    
    // Create audio context
audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();    analyser = audioContext.createAnalyser();
    microphone = audioContext.createMediaStreamSource(testStream);
    
    analyser.fftSize = 256;
    microphone.connect(analyser);
    
    micTestResult.value = 'success';
    
    // Monitor audio levels for 5 seconds
    const monitorLevels = () => {
      if (!analyser || !isTesting.value) return;
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);
      
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      const normalizedLevel = average / 255;
      
      audioLevels.value.push(normalizedLevel);
      if (audioLevels.value.length > 50) {
        audioLevels.value.shift();
      }
      
      if (isTesting.value) {
        requestAnimationFrame(monitorLevels);
      }
    };
    
    monitorLevels();
    
    // Stop test after 5 seconds
    setTimeout(() => {
      stopMicrophoneTest();
    }, 5000);
    
  } catch (error: any) {
    console.error('Microphone test error:', error);
    
    if (error.name === 'NotAllowedError') {
      micTestResult.value = 'Permission denied';
      alert(`Microphone permission denied. To fix this:

1. Click the 🔒 or 🎤 icon in your address bar
2. Change microphone setting to "Allow"
3. Refresh the page and try again

Or go to Chrome Settings → Privacy & Security → Site Settings → Microphone
Add ${window.location.origin} to the allowed list.`);
    } else if (error.name === 'NotFoundError') {
      micTestResult.value = 'Selected microphone not found';
    } else if (error.name === 'OverconstrainedError') {
      micTestResult.value = 'Selected microphone cannot be accessed - try choosing a different device';
    } else {
      micTestResult.value = `Error: ${error.message}`;
    }
    
    isTesting.value = false;
  }
};

// Stop microphone test
const stopMicrophoneTest = () => {
  isTesting.value = false;
  
  if (testStream) {
    testStream.getTracks().forEach(track => track.stop());
    testStream = null;
  }
  
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
  
  analyser = null;
  microphone = null;
  audioLevels.value = [];
};

// Export settings
const exportSettings = () => {
  const settings = {
    isDarkMode: isDarkMode.value,
    defaultMode: defaultMode.value,
    defaultLanguage: defaultLanguage.value,
    generateDiagrams: generateDiagrams.value,
    speechPreference: speechPreference.value,
    audioMode: audioMode.value,
    selectedAudioDevice: selectedAudioDevice.value,
    costThreshold: costThreshold.value,
    voiceActivationThreshold: voiceActivationThreshold.value,
    silenceTimeout: silenceTimeout.value,
    autoSendOnPause: autoSendOnPause.value,
    pauseTimeout: pauseTimeout.value,
    exportDate: new Date().toISOString(),
    version: '1.0.0'
  };
  
  const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `voice-assistant-settings-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Import settings
const importSettings = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const settings = JSON.parse(e.target?.result as string);
      
      // Validate and apply settings
      if (settings.isDarkMode !== undefined) isDarkMode.value = settings.isDarkMode;
      if (settings.defaultMode !== undefined) defaultMode.value = settings.defaultMode;
      if (settings.defaultLanguage !== undefined) defaultLanguage.value = settings.defaultLanguage;
      if (settings.generateDiagrams !== undefined) generateDiagrams.value = settings.generateDiagrams;
      if (settings.speechPreference !== undefined) speechPreference.value = settings.speechPreference;
      if (settings.audioMode !== undefined) audioMode.value = settings.audioMode;
      if (settings.selectedAudioDevice !== undefined) selectedAudioDevice.value = settings.selectedAudioDevice;
      if (settings.costThreshold !== undefined) costThreshold.value = settings.costThreshold;
      if (settings.voiceActivationThreshold !== undefined) voiceActivationThreshold.value = settings.voiceActivationThreshold;
      if (settings.silenceTimeout !== undefined) silenceTimeout.value = settings.silenceTimeout;
      if (settings.autoSendOnPause !== undefined) autoSendOnPause.value = settings.autoSendOnPause;
      if (settings.pauseTimeout !== undefined) pauseTimeout.value = settings.pauseTimeout;
      
      alert('Settings imported successfully!');
    } catch (error) {
      alert('Error importing settings. Please check the file format.');
    }
  };
  
  reader.readAsText(file);
  
  // Reset the input
  if (importInput.value) {
    importInput.value.value = '';
  }
};

// Fetch session cost on mount
onMounted(async () => {
  // Set up authentication first
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Authentication token set for Settings page');
  } else {
    console.warn('No authentication token found');
    router.push('/login');
    return;
  }
  
  await fetchSessionCost();
  await refreshAudioDevices();
});

// Clean up on unmount
onBeforeUnmount(() => {
  stopMicrophoneTest();
});


// Fetch current session cost
const fetchSessionCost = async () => {
  try {
    const response = await costAPI.getCost();
    sessionCost.value = response.data.sessionCost;
  } catch (error) {
    console.error('Error fetching session cost:', error);
  }
};



// Reset session cost
const resetSession = async () => {
  try {
    await costAPI.resetCost({ reset: true });
    await fetchSessionCost();
    alert('Session cost reset successfully!');
  } catch (error) {
    console.error('Error resetting session:', error);
    alert('Error resetting session cost. Please try again.');
  }
};

// Logout function
const logout = () => {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    delete api.defaults.headers.common['Authorization'];
    router.push('/login');
  }
};

// Save settings
const saveSettings = () => {
  // Settings are automatically saved via useStorage
  // Just provide feedback to the user
  alert('Settings saved successfully!');
  router.push('/');
};

// Watch for dark mode changes
watch(isDarkMode, (newVal) => {
  if (newVal) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, { immediate: true });
</script>

<style scoped>
.select {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500;
}

.btn-primary {
  @apply px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors;
}

.btn-secondary {
  @apply px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors;
}

.card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6;
}

/* Custom range slider styling */
input[type="range"] {
  background: linear-gradient(to right, #14b8a6 0%, #14b8a6 var(--range-progress, 50%), #e5e7eb var(--range-progress, 50%), #e5e7eb 100%);
}

input[type="range"]::-webkit-slider-thumb {
  @apply appearance-none w-5 h-5 bg-primary-600 rounded-full cursor-pointer;
}

input[type="range"]::-moz-range-thumb {
  @apply w-5 h-5 bg-primary-600 rounded-full cursor-pointer border-0;
}
</style>