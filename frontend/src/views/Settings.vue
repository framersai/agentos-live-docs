<template>
  <div class="settings-page-container min-h-screen py-4 sm:py-8 px-3 sm:px-4">
    <div class="sm:hidden flex items-center mb-4 sticky top-0 bg-primary-50 dark:bg-gray-900 py-2 z-10 -mx-3 px-3">
      <button @click="goBack" class="mr-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Back to Home">
        <ArrowLeftIcon class="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </button>
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">Settings</h1>
    </div>

    <div class="settings-card max-w-4xl mx-auto">
      <div class="hidden sm:block mb-6">
        <div class="flex items-center gap-3">
          <Cog8ToothIcon class="h-8 w-8 text-primary-600 dark:text-primary-400" />
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Application Settings</h1>
        </div>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Customize your Voice Coding Assistant experience.</p>
      </div>

      <div class="space-y-10">
        <section aria-labelledby="appearance-settings">
          <div class="section-header">
            <PaintBrushIcon class="section-icon" />
            <h2 id="appearance-settings" class="section-title">Appearance</h2>
          </div>
          <div class="setting-item">
            <label for="darkModeToggle" class="setting-label">Dark Mode</label>
            <div class="toggle-switch-container">
              <input
                type="checkbox"
                id="darkModeToggle"
                v-model="isDarkMode"
                class="sr-only peer"
                aria-describedby="darkModeDescription"
              >
              <div class="toggle-switch-track
                          peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800
                          peer-checked:bg-primary-600
                          peer-checked:after:translate-x-full peer-checked:after:border-white">
              </div>
            </div>
          </div>
            <p id="darkModeDescription" class="setting-description">Toggle between light and dark themes for the application.</p>
        </section>

        <section aria-labelledby="general-settings">
          <div class="section-header">
            <WrenchScrewdriverIcon class="section-icon" />
            <h2 id="general-settings" class="section-title">General Preferences</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <div>
              <label for="defaultMode" class="form-label">Default Assistant Mode</label>
              <select id="defaultMode" v-model="defaultMode" class="select-input">
                <option value="coding">Coding Q&A</option>
                <option value="system_design">System Design</option>
                <option value="meeting">Meeting Summary</option>
                <option value="general">General Chat</option>
              </select>
              <p class="setting-description">Choose the default mode when the app starts.</p>
            </div>
            <div>
              <label for="defaultLanguage" class="form-label">Default Programming Language</label>
              <select id="defaultLanguage" v-model="defaultLanguage" class="select-input">
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++ (cpp)</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="php">PHP</option>
                <option value="ruby">Ruby</option>
                <option value="swift">Swift</option>
                <option value="kotlin">Kotlin</option>
              </select>
              <p class="setting-description">Preferred language for code examples.</p>
            </div>
            <div class="md:col-span-2">
              <label for="chatHistoryLength" class="form-label">
                Chat History Length: {{ chatHistoryIndividualMessageCount }} messages ({{ Math.floor(chatHistoryIndividualMessageCount / 2) }} pairs)
              </label>
              <input
                type="range"
                id="chatHistoryLength"
                v-model.number="chatHistoryIndividualMessageCount"
                min="10"
                max="200"
                step="2"
                class="range-slider"
                aria-describedby="chatHistoryDescription"
                @input="updateRangeProgress($event.target as HTMLInputElement)"
              >
              <p id="chatHistoryDescription" class="setting-description">Number of recent messages (user + assistant) to keep for context. Affects API token usage.</p>
            </div>
          </div>
          <div class="setting-item mt-6">
            <label for="generateDiagramsToggle" class="setting-label">Generate Diagrams Automatically</label>
              <div class="toggle-switch-container">
              <input type="checkbox" id="generateDiagramsToggle" v-model="generateDiagrams" class="sr-only peer" aria-describedby="diagramsDescription">
              <div class="toggle-switch-track
                          peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800
                          peer-checked:bg-primary-600
                          peer-checked:after:translate-x-full peer-checked:after:border-white">
              </div>
            </div>
          </div>
          <p id="diagramsDescription" class="setting-description">Enable to automatically generate Mermaid diagrams for system design and complex explanations.</p>

          <div class="setting-item mt-6">
            <label for="autoClearToggle" class="setting-label">Auto-Clear Chat on Mode Change / Single View</label>
            <div class="toggle-switch-container">
              <input type="checkbox" id="autoClearToggle" v-model="autoClearChat" class="sr-only peer" aria-describedby="autoClearDescription">
              <div class="toggle-switch-track
                          peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800
                          peer-checked:bg-primary-600
                          peer-checked:after:translate-x-full peer-checked:after:border-white">
              </div>
            </div>
          </div>
          <p id="autoClearDescription" class="setting-description">When enabled, focuses on the latest exchange. Disable to see full chat history.</p>
        </section>

        <section aria-labelledby="audio-settings">
          <div class="section-header">
              <SpeakerWaveIcon class="section-icon" />
            <h2 id="audio-settings" class="section-title">Audio & Voice</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            <div>
              <label for="audioDevice" class="form-label">Audio Input Device</label>
              <select id="audioDevice" v-model="selectedAudioDevice" class="select-input">
                <option value="">Default System Microphone</option>
                <option v-for="device in audioDevices" :key="device.deviceId" :value="device.deviceId">
                  {{ device.label || `Microphone ${device.deviceId.substring(0,12)}...` }}
                </option>
              </select>
              <p class="setting-description">Current: {{ getCurrentDeviceName() }}</p>
              <button @click="refreshAudioDevices" class="btn-secondary btn-sm mt-2">
                <ArrowPathIcon class="h-4 w-4 mr-1.5" /> Refresh Devices
              </button>
            </div>
            <div>
              <label for="audioMode" class="form-label">Audio Input Mode</label>
              <select id="audioMode" v-model="audioMode" class="select-input">
                <option value="push-to-talk">Push to Talk</option>
                <option value="continuous">Continuous Listening</option>
                <option value="voice-activation">Voice Activation</option>
              </select>
              <p class="setting-description">{{ getAudioModeDescription(audioMode) }}</p>
            </div>
            <div>
              <label for="speechPreference" class="form-label">Speech Recognition (STT)</label>
              <select id="speechPreference" v-model="speechPreference" class="select-input">
                <option value="whisper">OpenAI Whisper (High Accuracy)</option>
                <option value="webspeech">Browser Web Speech (Fast, Free)</option>
              </select>
              <p class="setting-description">Whisper is more accurate but uses API credits. Web Speech is browser-dependent.</p>
            </div>
            <div class="setting-item">
                <label for="enableAutoTTS" class="setting-label">Enable Auto Text-to-Speech</label>
                <div class="toggle-switch-container">
                  <input type="checkbox" id="enableAutoTTS" v-model="enableAutoTTS" class="sr-only peer" aria-describedby="autoTTSDescription">
                  <div class="toggle-switch-track
                              peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800
                              peer-checked:bg-primary-600
                              peer-checked:after:translate-x-full peer-checked:after:border-white">
                  </div>
                </div>
            </div>
            <p id="autoTTSDescription" class="setting-description md:col-span-2 -mt-4">Automatically speak out assistant's responses.</p>

            <div v-if="isTTSSupported">
              <label for="ttsVoice" class="form-label">TTS Voice</label>
              <select id="ttsVoice" v-model="selectedVoiceURI" class="select-input" :disabled="availableTTSVoices.length === 0">
                <option value="">Browser Default</option>
                <optgroup v-for="group in groupedTTSVoices" :key="group.lang" :label="getLanguageDisplayName(group.lang)">
                    <option v-for="voice in group.voices" :key="voice.voiceURI" :value="voice.voiceURI">
                    {{ voice.name }} ({{ voice.lang }}) {{ voice.default ? '[Default]' : ''}}
                    </option>
                </optgroup>
              </select>
              <p class="setting-description">Select a preferred voice for assistant responses. Options depend on your browser.</p>
            </div>

            <div v-if="isTTSSupported">
                <label for="ttsRate" class="form-label">TTS Speech Rate: {{ ttsRate.toFixed(1) }}x</label>
                <input type="range" id="ttsRate" v-model.number="ttsRate" min="0.5" max="2" step="0.1" class="range-slider" @input="updateRangeProgress($event.target as HTMLInputElement)">
                <p class="setting-description">Adjust the speaking speed of the assistant.</p>
            </div>
              <div v-if="isTTSSupported" class="md:col-span-2">
                <label for="ttsPitch" class="form-label">TTS Speech Pitch: {{ ttsPitch.toFixed(1) }}</label>
                <input type="range" id="ttsPitch" v-model.number="ttsPitch" min="0" max="2" step="0.1" class="range-slider" @input="updateRangeProgress($event.target as HTMLInputElement)">
                <p class="setting-description">Adjust the pitch of the assistant's voice.</p>
            </div>
          </div>

          <div v-if="audioMode === 'voice-activation'" class="setting-subsection">
            <h4 class="subsection-title">Voice Activation Settings</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mt-4">
              <div>
                <label for="voiceActivationThreshold" class="form-label">
                  Voice Detection Sensitivity: {{ Math.round(voiceActivationThreshold * 100) }}%
                </label>
                <input
                  type="range"
                  id="voiceActivationThreshold"
                  v-model.number="voiceActivationThreshold"
                  min="0.05" max="0.3" step="0.01"
                  class="range-slider"
                  aria-describedby="vadThresholdDescription"
                  @input="updateRangeProgress($event.target as HTMLInputElement)"
                >
                <p id="vadThresholdDescription" class="setting-description">
                  Lower = more sensitive (may pick up background noise). Higher = less sensitive.
                </p>
              </div>
              <div>
                <label for="silenceTimeoutVAD" class="form-label">
                  Silence Timeout (VAD): {{ (silenceTimeout / 1000).toFixed(1) }}s
                </label>
                <input
                  type="range"
                  id="silenceTimeoutVAD"
                  v-model.number="silenceTimeout"
                  min="1000" max="5000" step="500"
                  class="range-slider"
                  aria-describedby="vadSilenceDescription"
                  @input="updateRangeProgress($event.target as HTMLInputElement)"
                >
                <p id="vadSilenceDescription" class="setting-description">
                  How long to wait after silence before stopping recording in VAD mode.
                </p>
              </div>
            </div>
          </div>

          <div v-if="audioMode === 'continuous'" class="setting-subsection">
            <h4 class="subsection-title">Continuous Mode Settings</h4>
            <div class="space-y-6 mt-4">
                <div class="setting-item">
                    <label for="autoSendOnPauseToggle" class="setting-label">Auto-send on Pause</label>
                    <div class="toggle-switch-container">
                      <input type="checkbox" id="autoSendOnPauseToggle" v-model="autoSendOnPause" class="sr-only peer" aria-describedby="autoSendDescriptionContinuous">
                      <div class="toggle-switch-track
                                  peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800
                                  peer-checked:bg-primary-600
                                  peer-checked:after:translate-x-full peer-checked:after:border-white">
                      </div>
                    </div>
                </div>
                <p id="autoSendDescriptionContinuous" class="setting-description -mt-2">Automatically send transcription when you pause speaking.</p>

              <div>
                <label for="pauseTimeoutContinuous" class="form-label">
                  Pause Detection Timeout: {{ (pauseTimeout / 1000).toFixed(1) }}s
                </label>
                <input
                  type="range"
                  id="pauseTimeoutContinuous"
                  v-model.number="pauseTimeout"
                  min="1000" max="8000" step="500"
                  class="range-slider"
                  aria-describedby="continuousPauseDescription"
                  @input="updateRangeProgress($event.target as HTMLInputElement)"
                >
                <p id="continuousPauseDescription" class="setting-description">
                  How long to wait after you stop speaking before sending transcription.
                </p>
              </div>
            </div>
          </div>

          <div class="setting-subsection">
            <h4 class="subsection-title">Microphone Test</h4>
            <div class="flex items-center gap-x-4 mt-2">
              <button
                @click="testMicrophone"
                :disabled="isTesting"
                class="btn-secondary btn-sm"
              >
                <span v-if="isTesting" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Testing...
                </span>
                <span v-else>Test Microphone</span>
              </button>

              <div v-if="micTestResult" class="flex items-center gap-2 text-sm">
                <span v-if="micTestResult === 'success'" class="text-green-600 dark:text-green-400">✓ Microphone working</span>
                <span v-else-if="micTestResult === 'error_permission'" class="text-red-600 dark:text-red-400">✗ Permission Denied</span>
                <span v-else-if="micTestResult === 'error_notfound'" class="text-red-600 dark:text-red-400">✗ Mic Not Found</span>
                <span v-else-if="micTestResult === 'error_overconstrained'" class="text-yellow-600 dark:text-yellow-400">⚠ Mic Cannot Be Accessed</span>
                <span v-else-if="micTestResult === 'error_generic'" class="text-red-600 dark:text-red-400">✗ Error</span>
              </div>
            </div>

            <div v-if="isTesting && audioLevels.length > 0" class="mt-3">
              <div class="flex items-end gap-0.5 h-8 bg-gray-100 dark:bg-gray-700 p-1 rounded">
                <div v-for="(level, index) in audioLevels.slice(-30)" :key="index"
                     class="w-1.5 bg-primary-500 dark:bg-primary-400 rounded-sm transition-all duration-100"
                     :style="{ height: `${Math.max(1, level * 30)}px` }">
                </div>
              </div>
              <p class="setting-description mt-1">Speak to see audio levels. Test runs for 5 seconds.</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="session-settings">
            <div class="section-header">
              <CreditCardIcon class="section-icon" />
            <h2 id="session-settings" class="section-title">Session & Costs</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="info-card">
              <h4 class="info-card-title">Current Session Cost</h4>
              <p class="info-card-value text-primary-600 dark:text-primary-400">${{ sessionCost.toFixed(4) }}</p>
              <button @click="resetSessionCost" class="btn-secondary btn-sm mt-2">Reset Session Cost</button>
            </div>
            <div class="info-card">
              <h4 class="info-card-title">Configured Cost Threshold</h4>
              <p class="info-card-value">${{ costLimit.toFixed(2) }}</p>
              <p class="setting-description">Max per session before warning.</p>
            </div>
          </div>
          <div class="mt-6">
            <label for="costThresholdSlider" class="form-label">
              Session Cost Limit: ${{ costLimit.toFixed(2) }}
            </label>
            <input
              type="range"
              id="costThresholdSlider"
              v-model.number="costLimit"
              min="1" max="100" step="1"
              class="range-slider"
              @input="updateRangeProgress($event.target as HTMLInputElement)"
            >
            <p class="setting-description">Set a U.S. Dollar limit for API usage per session. You'll be warned before exceeding it.</p>
          </div>
        </section>

        <section aria-labelledby="security-settings">
            <div class="section-header">
            <ShieldCheckIcon class="section-icon" />
            <h2 id="security-settings" class="section-title">Security & Privacy</h2>
          </div>
            <div class="setting-item">
            <label for="rememberLoginToggle" class="setting-label">Remember Login</label>
            <div class="toggle-switch-container">
              <input type="checkbox" id="rememberLoginToggle" v-model="rememberLogin" class="sr-only peer" aria-describedby="rememberLoginDescription">
              <div class="toggle-switch-track
                          peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800
                          peer-checked:bg-primary-600
                          peer-checked:after:translate-x-full peer-checked:after:border-white">
              </div>
            </div>
          </div>
          <p id="rememberLoginDescription" class="setting-description">Keep you logged in across browser sessions using local storage.</p>
            <div class="danger-zone mt-6">
            <h4 class="subsection-title text-red-600 dark:text-red-400">Danger Zone</h4>
            <button @click="handleLogout" class="btn-danger">
              <ArrowLeftOnRectangleIcon class="h-5 w-5 mr-2"/> Logout
            </button>
            <p class="setting-description mt-2">This will log you out of the application.</p>
          </div>
        </section>

        <section aria-labelledby="backup-settings">
            <div class="section-header">
                <ArrowDownTrayIcon class="section-icon" />
                <h2 id="backup-settings" class="section-title">Backup & Restore Settings</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button @click="exportAllSettings" class="btn-secondary">
                    <ArrowUpTrayIcon class="h-5 w-5 mr-2" /> Export All Settings
                </button>
                <div class="relative">
                    <input
                        ref="importSettingsInputRef"
                        type="file"
                        accept=".json"
                        @change="handleImportSettingsFile"
                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        aria-label="Import settings file"
                    >
                    <button @click="triggerImportFile" class="btn-secondary w-full">
                        <ArrowDownTrayIcon class="h-5 w-5 mr-2" /> Import Settings
                    </button>
                </div>
            </div>
            <p class="setting-description mt-4">Export your current settings to a JSON file, or import settings from a previously exported file.</p>
        </section>
      </div>

      <div class="mt-10 pt-6 border-t dark:border-gray-700 flex justify-end">
        <button @click="saveAllSettings" class="btn-primary btn-lg">
          <CheckCircleIcon class="h-5 w-5 mr-2" /> Save All Settings
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file Settings.vue
 * @description User settings page for the Voice Coding Assistant.
 * Allows configuration of appearance, general behavior, audio/voice preferences,
 * session costs, security, and data backup/restore.
 * @version 1.2.1 - Corrected toggle switch CSS and HTML for Tailwind peer utility.
 */
import { ref, onMounted, onBeforeUnmount, watch, computed, inject, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
import { api, costAPI } from '../utils/api';
import { ttsService } from '../services/tts.service';
import {
  Cog8ToothIcon, PaintBrushIcon, WrenchScrewdriverIcon, SpeakerWaveIcon, CreditCardIcon, ShieldCheckIcon,
  ArrowDownTrayIcon, ArrowUpTrayIcon, ArrowLeftIcon, CheckCircleIcon, ArrowPathIcon, ArrowLeftOnRectangleIcon,
} from '@heroicons/vue/24/outline';

const router = useRouter();
const toast = inject('toast') as any;

// --- Appearance ---
const isDarkMode = useStorage('darkMode', false);

// --- General ---
const defaultMode = useStorage('vca-mode', 'coding');
const defaultLanguage = useStorage('vca-language', 'python');
const generateDiagrams = useStorage('vca-generateDiagram', true);
const autoClearChat = useStorage('vca-autoClearChat', true);
const chatHistoryIndividualMessageCount = useStorage('chatHistoryIndividualMessageCount', 20);

// --- Audio & Voice ---
const speechPreference = useStorage<'webspeech' | 'whisper'>('speechPreference', 'webspeech');
const audioMode = useStorage('vca-audioMode', 'push-to-talk');
const selectedAudioDevice = useStorage<string>('selectedAudioDevice', '');
const audioDevices = ref<MediaDeviceInfo[]>([]);
const enableAutoTTS = useStorage('vca-enableAutoTTS', true);
const selectedVoiceURI = useStorage('vca-selectedVoiceURI', '');
const availableTTSVoices = ref<SpeechSynthesisVoice[]>([]);
const ttsRate = useStorage('vca-ttsRate', 1.0);
const ttsPitch = useStorage('vca-ttsPitch', 1.0);

// Voice Activation & Continuous Settings
const voiceActivationThreshold = useStorage('vca-voiceActivationThreshold', 0.1);
const silenceTimeout = useStorage('vca-silenceTimeoutMsVAD', 2000); // For VAD
const autoSendOnPause = useStorage('vca-autoSendOnPauseWebSpeech', true); // For Continuous
const pauseTimeout = useStorage('vca-pauseTimeoutMsContinuousWebSpeech', 3000); // For Continuous

// --- Session & Costs ---
const sessionCost = ref(0);
const costLimit = useStorage('vca-costThreshold', 20.0);

// --- Security ---
const rememberLogin = useStorage('rememberLogin', true);

// --- UI Refs ---
const importSettingsInputRef = ref<HTMLInputElement | null>(null);

// Microphone Test variables
const isTesting = ref(false);
const micTestResult = ref<'' | 'success' | 'error_permission' | 'error_notfound' | 'error_overconstrained' | 'error_generic'>('');
const audioLevels = ref<number[]>([]);
let audioContext: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let microphone: MediaStreamAudioSourceNode | null = null;
let testStream: MediaStream | null = null;


// --- Computed Properties ---
const isTTSSupported = computed(() => ttsService.isSupported());

const groupedTTSVoices = computed(() => {
  const groups: Record<string, { lang: string, voices: SpeechSynthesisVoice[] }> = {};
  availableTTSVoices.value.forEach(voice => {
    const langDisplay = getLanguageDisplayName(voice.lang) || voice.lang; // Use full lang display for grouping
    if (!groups[langDisplay]) {
      groups[langDisplay] = { lang: langDisplay, voices: [] };
    }
    groups[langDisplay].voices.push(voice);
  });
  // Sort groups by language display name
  return Object.values(groups).sort((a,b) => a.lang.localeCompare(b.lang));
});

// --- Methods ---
const goBack = () => router.push('/');

const getLanguageDisplayName = (langCode: string) => {
    try {
        const displayName = new Intl.DisplayNames(['en'], { type: 'language' }).of(langCode);
        return displayName || langCode;
    } catch (e) {
        return langCode; // Fallback for older browsers or invalid codes
    }
};

const updateRangeProgress = (target: HTMLInputElement | null) => {
  if (!target) return;
  const value = parseFloat(target.value);
  const min = parseFloat(target.min);
  const max = parseFloat(target.max);
  const percentage = ((value - min) / (max - min)) * 100;
  target.style.setProperty('--range-progress', `${percentage}%`);
};

const getAudioModeDescription = (mode: string) => {
  switch (mode) {
    case 'push-to-talk':
      return 'Click and hold the microphone button to record. Release to stop.';
    case 'continuous':
      return 'The microphone listens continuously. Good for longer conversations.';
    case 'voice-activation':
      return 'Automatically records when voice is detected. Stops after silence.';
    default:
      return 'Select an audio input mode.';
  }
};

const getCurrentDeviceName = () => {
  if (!selectedAudioDevice.value || selectedAudioDevice.value === '') {
    return 'Default System Microphone';
  }
  const device = audioDevices.value.find(d => d.deviceId === selectedAudioDevice.value);
  return device?.label || `Microphone ${selectedAudioDevice.value.substring(0, 12)}...`;
};

const refreshAudioDevices = async () => {
  try {
    // Request permission first - this is required to get device labels
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop()); // Stop the permission test stream immediately

    const devices = await navigator.mediaDevices.enumerateDevices();
    audioDevices.value = devices.filter(device => device.kind === 'audioinput');
    toast?.add({ type: 'success', title: 'Audio Devices Refreshed' });
  } catch (err: any) {
    console.error('Error refreshing audio devices:', err);
    let message = 'Could not access microphone to list devices.';
    if (err.name === 'NotAllowedError') {
      message = 'Microphone permission denied. Please enable it in your browser settings.';
    }
    toast?.add({ type: 'error', title: 'Mic Permission Error', message });
  }
};

const testMicrophone = async () => {
  isTesting.value = true;
  micTestResult.value = '';
  audioLevels.value = [];

  try {
    const constraints: MediaStreamConstraints = {
      audio: selectedAudioDevice.value
        ? { deviceId: { exact: selectedAudioDevice.value }, echoCancellation: true, noiseSuppression: true, autoGainControl: true }
        : { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
    };
    testStream = await navigator.mediaDevices.getUserMedia(constraints);

    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    microphone = audioContext.createMediaStreamSource(testStream);

    analyser.fftSize = 256; // Controls number of bins for frequency data
    microphone.connect(analyser);

    micTestResult.value = 'success';

    const monitorLevels = () => {
      if (!analyser || !isTesting.value || !audioContext || audioContext.state === 'closed') return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray); // More suitable for volume visualization

      let sum = 0;
      for(let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;
      const normalizedLevel = average / 128; // Normalize based on Uint8 max value / 2 (more dynamic range)

      audioLevels.value.push(Math.min(1, Math.max(0, normalizedLevel))); // Clamp between 0 and 1
      if (audioLevels.value.length > 30) { // Keep last 30 samples for visualization
        audioLevels.value.shift();
      }
      requestAnimationFrame(monitorLevels);
    };
    monitorLevels();

    setTimeout(() => {
      if (isTesting.value) { // Only stop if still in testing state
         stopMicrophoneTest();
         if (micTestResult.value === 'success') { // if it was successful and timed out
            toast?.add({ type: 'info', title: 'Mic Test Complete', message: 'Microphone test finished.' });
         }
      }
    }, 5000); // Test for 5 seconds

  } catch (err: any) {
    console.error('Microphone test error:', err);
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      micTestResult.value = 'error_permission';
      toast?.add({ type: 'error', title: 'Mic Permission Denied', message: 'Please enable microphone access in browser settings.' });
    } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      micTestResult.value = 'error_notfound';
      toast?.add({ type: 'error', title: 'Mic Not Found', message: 'Selected microphone not found. Try refreshing devices.' });
    } else if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
        micTestResult.value = 'error_overconstrained';
        toast?.add({ type: 'warning', title: 'Mic Access Issue', message: 'Selected mic cannot be accessed with current constraints. Try default or another device.' });
    } else {
      micTestResult.value = 'error_generic';
      toast?.add({ type: 'error', title: 'Mic Test Error', message: 'An unexpected error occurred during the mic test.' });
    }
    stopMicrophoneTest(); // Ensure cleanup on any error
  }
};

const stopMicrophoneTest = () => {
  isTesting.value = false;
  if (testStream) {
    testStream.getTracks().forEach(track => track.stop());
    testStream = null;
  }
  if (microphone) {
    microphone.disconnect();
    microphone = null;
  }
  if (analyser) {
    analyser.disconnect();
    analyser = null;
  }
  if (audioContext && audioContext.state !== 'closed') {
    audioContext.close().catch(e => console.warn("Error closing audio context:", e));
    audioContext = null;
  }
  // audioLevels.value = []; // Optionally clear levels display immediately
};


const fetchSessionCost = async () => {
  try {
    const response = await costAPI.getCost();
    sessionCost.value = response.data.sessionCost ?? 0;
  } catch (error) {
    console.error('Error fetching session cost:', error);
    toast?.add({type: 'error', title: 'Cost Error', message: 'Failed to fetch session cost.'});
  }
};

const resetSessionCost = async () => {
  if (!confirm("Are you sure you want to reset your current session cost? This action cannot be undone.")) return;
  try {
    await costAPI.resetCost({ userId: 'default_user', action: 'reset' }); // Assuming 'default_user' or get actual user ID
    await fetchSessionCost();
    toast?.add({type: 'success', title: 'Session Reset', message: 'Session cost has been reset to $0.00.'});
  } catch (error) {
    console.error('Error resetting session:', error);
    toast?.add({type: 'error', title: 'Reset Error', message: 'Failed to reset session cost.'});
  }
};

const handleLogout = () => {
  if (confirm('Are you sure you want to logout? This will clear your session.')) {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    // Clear relevant cookies if any using document.cookie manipulation
    // Example: document.cookie = "myCookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    if (api.defaults.headers.common['Authorization']) {
      delete api.defaults.headers.common['Authorization'];
    }
    toast?.add({type: 'info', title: 'Logged Out', message: 'You have been successfully logged out.'});
    router.push('/login');
  }
};

const exportAllSettings = () => {
  const settingsToExport = {
    isDarkMode: isDarkMode.value,
    defaultMode: defaultMode.value,
    defaultLanguage: defaultLanguage.value,
    generateDiagrams: generateDiagrams.value,
    autoClearChat: autoClearChat.value,
    chatHistoryIndividualMessageCount: chatHistoryIndividualMessageCount.value,
    speechPreference: speechPreference.value,
    audioMode: audioMode.value,
    selectedAudioDevice: selectedAudioDevice.value,
    enableAutoTTS: enableAutoTTS.value,
    selectedVoiceURI: selectedVoiceURI.value,
    ttsRate: ttsRate.value,
    ttsPitch: ttsPitch.value,
    costLimit: costLimit.value,
    rememberLogin: rememberLogin.value,
    voiceActivationThreshold: voiceActivationThreshold.value,
    silenceTimeout: silenceTimeout.value, // vca-silenceTimeoutMsVAD
    autoSendOnPause: autoSendOnPause.value, // vca-autoSendOnPauseWebSpeech
    pauseTimeout: pauseTimeout.value, // vca-pauseTimeoutMsContinuousWebSpeech
    exportDate: new Date().toISOString(),
    settingsVersion: '1.2.1' // Updated version
  };
  const blob = new Blob([JSON.stringify(settingsToExport, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vca-settings-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast?.add({type: 'success', title: 'Settings Exported', message: 'Your settings have been downloaded.'});
};

const triggerImportFile = () => {
    importSettingsInputRef.value?.click();
}

const handleImportSettingsFile = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target?.result as string);

      if (typeof imported.isDarkMode === 'boolean') isDarkMode.value = imported.isDarkMode;
      if (typeof imported.defaultMode === 'string') defaultMode.value = imported.defaultMode;
      if (typeof imported.defaultLanguage === 'string') defaultLanguage.value = imported.defaultLanguage;
      if (typeof imported.generateDiagrams === 'boolean') generateDiagrams.value = imported.generateDiagrams;
      if (typeof imported.autoClearChat === 'boolean') autoClearChat.value = imported.autoClearChat;
      if (typeof imported.chatHistoryIndividualMessageCount === 'number') chatHistoryIndividualMessageCount.value = imported.chatHistoryIndividualMessageCount;
      if (['webspeech', 'whisper'].includes(imported.speechPreference)) speechPreference.value = imported.speechPreference;
      if (['push-to-talk', 'continuous', 'voice-activation'].includes(imported.audioMode)) audioMode.value = imported.audioMode;
      if (typeof imported.selectedAudioDevice === 'string') selectedAudioDevice.value = imported.selectedAudioDevice;
      if (typeof imported.enableAutoTTS === 'boolean') enableAutoTTS.value = imported.enableAutoTTS;
      if (typeof imported.selectedVoiceURI === 'string') selectedVoiceURI.value = imported.selectedVoiceURI;
      if (typeof imported.ttsRate === 'number') ttsRate.value = imported.ttsRate;
      if (typeof imported.ttsPitch === 'number') ttsPitch.value = imported.ttsPitch;
      if (typeof imported.costLimit === 'number') costLimit.value = imported.costLimit;
      if (typeof imported.rememberLogin === 'boolean') rememberLogin.value = imported.rememberLogin;
      if (typeof imported.voiceActivationThreshold === 'number') voiceActivationThreshold.value = imported.voiceActivationThreshold;
      if (typeof imported.silenceTimeout === 'number') silenceTimeout.value = imported.silenceTimeout;
      if (typeof imported.autoSendOnPause === 'boolean') autoSendOnPause.value = imported.autoSendOnPause;
      if (typeof imported.pauseTimeout === 'number') pauseTimeout.value = imported.pauseTimeout;

      toast?.add({type: 'success', title: 'Settings Imported', message: 'Your settings have been restored.'});

      nextTick(() => {
        document.querySelectorAll<HTMLInputElement>('input[type="range"]').forEach(el => updateRangeProgress(el));
      });
    } catch (error) {
      console.error("Error importing settings:", error);
      toast?.add({type: 'error', title: 'Import Failed', message: 'Could not import settings. File might be corrupted or invalid.'});
    }
  };
  reader.readAsText(file);
  if (importSettingsInputRef.value) importSettingsInputRef.value.value = '';
};

const saveAllSettings = () => {
  // All settings are reactively saved by useStorage.
  toast?.add({type: 'success', title: 'Settings Confirmed', message: 'Your preferences have been saved locally in your browser.'});
  router.push('/');
};

const loadTTSVoices = async () => {
    if (ttsService.isSupported()) {
        availableTTSVoices.value = await ttsService.getVoices();
        if (selectedVoiceURI.value && !availableTTSVoices.value.find(v => v.voiceURI === selectedVoiceURI.value)) {
            console.warn("Previously selected TTS voice URI no longer available. Resetting to browser default.");
            selectedVoiceURI.value = '';
        }
    }
};

// --- Lifecycle Hooks ---
onMounted(async () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  await fetchSessionCost();
  await refreshAudioDevices();
  await loadTTSVoices();

  nextTick(() => {
    document.querySelectorAll<HTMLInputElement>('input[type="range"]').forEach(el => updateRangeProgress(el));
  });
});

onBeforeUnmount(() => {
  stopMicrophoneTest();
});

watch(isDarkMode, (newVal) => {
  document.documentElement.classList.toggle('dark', newVal);
}, { immediate: true });

// Watchers for range sliders to update their CSS variables
watch(chatHistoryIndividualMessageCount, () => nextTick(() => updateRangeProgress(document.getElementById('chatHistoryLength') as HTMLInputElement)));
watch(ttsRate, () => nextTick(() => updateRangeProgress(document.getElementById('ttsRate') as HTMLInputElement)));
watch(ttsPitch, () => nextTick(() => updateRangeProgress(document.getElementById('ttsPitch') as HTMLInputElement)));
watch(costLimit, () => nextTick(() => updateRangeProgress(document.getElementById('costThresholdSlider') as HTMLInputElement)));
watch(voiceActivationThreshold, () => nextTick(() => updateRangeProgress(document.getElementById('voiceActivationThreshold') as HTMLInputElement)));
watch(silenceTimeout, () => nextTick(() => updateRangeProgress(document.getElementById('silenceTimeoutVAD') as HTMLInputElement)));
watch(pauseTimeout, () => nextTick(() => updateRangeProgress(document.getElementById('pauseTimeoutContinuous') as HTMLInputElement)));

</script>

<style scoped>
.settings-page-container {
  @apply bg-primary-50 dark:bg-gray-900;
}
.settings-card {
  @apply bg-white dark:bg-gray-850 rounded-xl shadow-xl border dark:border-gray-700/50 p-6 sm:p-8;
}

.section-header {
  @apply flex items-center gap-3 pb-2 mb-6 border-b border-gray-200 dark:border-gray-700;
}
.section-icon {
  @apply h-6 w-6 text-primary-500 dark:text-primary-400;
}
.section-title {
  @apply text-xl font-semibold text-gray-800 dark:text-white;
}

.setting-item {
  @apply flex items-center justify-between py-3;
}
.setting-label { /* For toggle labels primarily */
  @apply text-sm font-medium text-gray-700 dark:text-gray-300;
}
.setting-description {
  @apply text-xs text-gray-500 dark:text-gray-400 mt-1;
}

.form-label { /* For select, range, etc. */
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5;
}
.select-input {
  @apply w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm
         bg-white dark:bg-gray-700
         text-gray-900 dark:text-white
         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
         transition-colors duration-150;
}

.toggle-switch-container {
  @apply relative inline-flex items-center cursor-pointer;
}

/* Corrected .toggle-switch-track CSS */
.toggle-switch-track {
  @apply w-11 h-6 bg-gray-200 rounded-full dark:bg-gray-700 relative;
  /* Base styles for the track.
     The input element (sibling) MUST have the 'peer' class.
     The following Tailwind utility classes should be on THIS div element in the HTML template:
       - peer-checked:bg-primary-600
       - peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800
       - peer-checked:after:translate-x-full
       - peer-checked:after:border-white
  */
}

.toggle-switch-track::after {
  @apply content-[''] absolute top-[2px] left-[2px] bg-white border-gray-300 dark:border-gray-600 border rounded-full h-5 w-5 transition-all;
  /* Base styles for the thumb (the ::after pseudo-element).
     Its peer-checked transformations (translate, border color) are handled by utilities
     on the parent .toggle-switch-track div in the HTML template.
  */
}


/* Enhanced Range Slider Styling (Unchanged, looks good) */
.range-slider {
  @apply w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer;
  --range-progress: 0%; /* Default, updated by JS */
  background: linear-gradient(to right,
    var(--primary-color, theme('colors.primary.600')) var(--range-progress),
    theme('colors.gray.200') var(--range-progress));
}
.dark .range-slider {
  background: linear-gradient(to right,
    var(--primary-color-dark, theme('colors.primary.400')) var(--range-progress),
    theme('colors.gray.700') var(--range-progress));
}

.range-slider::-webkit-slider-thumb {
  @apply appearance-none w-5 h-5 bg-primary-600 dark:bg-primary-500 rounded-full cursor-pointer shadow-md
         ring-2 ring-white/50 dark:ring-black/30;
}
.range-slider::-moz-range-thumb {
  @apply w-5 h-5 bg-primary-600 dark:bg-primary-500 rounded-full cursor-pointer border-0 shadow-md;
}


.setting-subsection {
  @apply mt-6 pt-4 border-t border-gray-200 dark:border-gray-700;
}
.subsection-title {
  @apply text-md font-semibold text-gray-700 dark:text-gray-300 mb-3;
}

.info-card {
    @apply p-4 bg-primary-50 dark:bg-gray-700/60 rounded-lg border border-primary-200 dark:border-gray-600/50 shadow;
}
.info-card-title {
    @apply text-sm font-medium text-gray-700 dark:text-gray-300 mb-1;
}
.info-card-value {
    @apply text-2xl font-bold;
}

.danger-zone {
    @apply p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 rounded-lg;
}
.btn-danger {
  @apply px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors inline-flex items-center;
}
.btn-primary {
 @apply px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-150 ease-in-out;
}
.btn-secondary {
  @apply px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-150 ease-in-out;
}
.btn-primary.btn-lg { @apply px-6 py-3 text-base; }
.btn-secondary.btn-sm { @apply px-3 py-1.5 text-xs inline-flex items-center; }

/* Define CSS variables for primary colors used in JS if not using Tailwind theme() directly in JS */
:root {
  --primary-color: #3b82f6; /* Matches primary-500 from your tailwind.config.js */
  --primary-color-dark: #60a5fa; /* Matches primary-400 from your tailwind.config.js */
}
</style>