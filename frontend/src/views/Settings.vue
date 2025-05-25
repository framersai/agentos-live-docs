// File: src/views/Settings.vue
<template>
  <div class="settings-page-container min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
    <div class="sm:hidden sticky top-0 bg-white dark:bg-gray-900 py-3 px-4 z-30 border-b border-gray-200 dark:border-gray-700/80 shadow-sm">
      <div class="flex items-center">
        <button @click="goBack" class="mr-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors" aria-label="Back">
          <ArrowLeftIcon class="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>
        <h1 class="text-lg font-semibold">Settings</h1>
      </div>
    </div>

    <main class="max-w-2xl mx-auto py-6 sm:py-10 px-4">
      <div class="hidden sm:block mb-10 text-center">
        <div class="inline-flex items-center gap-3">
          <Cog8ToothIcon class="h-10 w-10 text-primary-600 dark:text-primary-400" />
          <h1 class="text-4xl font-bold tracking-tight">Application Settings</h1>
        </div>
        <p class="mt-3 text-base text-gray-600 dark:text-gray-400">
          Configure your Voice Coding Assistant. Changes are saved automatically.
        </p>
      </div>

      <div class="space-y-12">
        <SettingsSection title="Appearance" :icon="PaintBrushIcon">
          <SettingsItem
            label="Dark Mode"
            description="Toggle between light and dark themes for the application."
            label-for="darkModeToggle"
          >
            <label class="toggle-switch">
              <input type="checkbox" id="darkModeToggle" v-model="isDarkModeLocal" class="sr-only peer" />
              <div class="toggle-switch-track"></div>
            </label>
          </SettingsItem>
        </SettingsSection>

        <SettingsSection title="General Preferences" :icon="WrenchScrewdriverIcon">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
            <SettingsItem label="Default Assistant Mode" description="Mode when the app starts." label-for="defaultModeSelect">
              <select id="defaultModeSelect" v-model="vcaSettings.defaultMode" class="select-input">
                <option value="coding">Coding Q&A</option>
                <option value="system_design">System Design</option>
                <option value="meeting">Meeting Summary</option>
                <option value="general">General Chat</option>
              </select>
            </SettingsItem>
            <SettingsItem label="Default Programming Language" description="For code examples." label-for="defaultLanguageSelect">
              <select id="defaultLanguageSelect" v-model="vcaSettings.defaultLanguage" class="select-input">
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                 <option value="php">PHP</option>
                <option value="ruby">Ruby</option>
                <option value="swift">Swift</option>
                <option value="kotlin">Kotlin</option>
              </select>
            </SettingsItem>
          </div>
          <SettingsItem
            label="Chat History Length"
            :description="`Keep ${chatHistoryCount} messages (${Math.floor(chatHistoryCount / 2)} pairs). Affects context & API tokens.`"
            label-for="chatHistoryLength"
            class="mt-8"
            full-width-description
          >
            <input type="range" id="chatHistoryLength" v-model.number="chatHistoryCount" :min="MIN_CHAT_HISTORY_FOR_SLIDER" :max="MAX_CHAT_HISTORY_MESSAGES" step="2" class="range-slider" @input="updateRangeProgress($event.target as HTMLInputElement)">
          </SettingsItem>
          <SettingsItem label="Generate Diagrams Automatically" description="For system design and complex explanations (Mermaid)." label-for="generateDiagramsToggle" class="mt-6">
            <label class="toggle-switch">
              <input type="checkbox" id="generateDiagramsToggle" v-model="vcaSettings.generateDiagrams" class="sr-only peer" />
              <div class="toggle-switch-track"></div>
            </label>
          </SettingsItem>
          <SettingsItem label="Auto-Clear Chat on Mode Change" description="Focuses on the latest exchange by default." label-for="autoClearToggle" class="mt-6">
            <label class="toggle-switch">
              <input type="checkbox" id="autoClearToggle" v-model="vcaSettings.autoClearChat" class="sr-only peer" />
              <div class="toggle-switch-track"></div>
            </label>
          </SettingsItem>
        </SettingsSection>

        <SettingsSection title="Audio & Voice" :icon="SpeakerWaveIcon">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
            <SettingsItem label="Audio Input Device" :description="`Current: ${currentAudioDeviceName}`" label-for="audioDeviceSelect">
              <select id="audioDeviceSelect" v-model="vcaSettings.selectedAudioInputDeviceId" class="select-input">
                <option :value="null">Default System Microphone</option>
                <option v-for="device in audioInputDevices" :key="device.deviceId" :value="device.deviceId">
                  {{ device.label || `Microphone ${device.deviceId.substring(0,12)}...` }}
                </option>
              </select>
              <button @click="triggerRefreshAudioDevices" class="btn-secondary-outline btn-sm mt-2.5 w-full sm:w-auto">
                <ArrowPathIcon class="h-4 w-4 mr-1.5" /> Refresh Devices
              </button>
            </SettingsItem>
            <SettingsItem label="Audio Input Mode" :description="getAudioModeDescription(vcaSettings.audioInputMode)" label-for="audioModeSelect">
              <select id="audioModeSelect" v-model="vcaSettings.audioInputMode" class="select-input">
                <option value="push-to-talk">Push to Talk</option>
                <option value="continuous">Continuous Listening</option>
                <option value="voice-activation">Voice Activation</option>
              </select>
            </SettingsItem>
            <SettingsItem label="Speech Recognition (STT)" description="Whisper for accuracy, Web Speech for speed." label-for="sttPreferenceSelect">
              <select id="sttPreferenceSelect" v-model="vcaSettings.sttPreference" class="select-input">
                <option value="whisper_api">OpenAI Whisper (High Accuracy)</option>
                <option value="browser_webspeech_api">Browser Web Speech (Fast, Free)</option>
              </select>
            </SettingsItem>
             <SettingsItem label="Auto-Play Responses (TTS)" description="Automatically speak assistant's responses." label-for="autoPlayTtsToggle">
              <label class="toggle-switch">
                <input type="checkbox" id="autoPlayTtsToggle" v-model="vcaSettings.autoPlayTts" class="sr-only peer" />
                <div class="toggle-switch-track"></div>
              </label>
            </SettingsItem>
          </div>

          <div v-if="vcaSettings.autoPlayTts">
            <div class="setting-subsection mt-8">
              <h4 class="subsection-title">Text-to-Speech (TTS) Details</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8 mt-4">
                <SettingsItem label="TTS Provider" description="Source for generating speech." label-for="ttsProviderSelect">
                    <select id="ttsProviderSelect" v-model="vcaSettings.ttsProvider" class="select-input">
                        <option value="browser_tts">Browser Built-in</option>
                        <option value="openai_tts" disabled>OpenAI TTS (Soon)</option>
                    </select>
                </SettingsItem>
                <SettingsItem v-if="isTTSSupportedBySelectedProvider" label="TTS Voice" description="Browser-dependent voices." label-for="ttsVoiceSelect">
                  <select id="ttsVoiceSelect" v-model="vcaSettings.selectedTtsVoiceId" class="select-input" :disabled="currentTTSVoiceOptions.length === 0 && ttsVoicesAreLoaded">
                    <option :value="null">Default Voice</option>
                     <optgroup v-if="ttsVoicesAreLoaded" v-for="group in groupedCurrentTTSVoices" :key="group.lang" :label="group.lang">
                        <option v-for="voice in group.voices" :key="voice.id" :value="voice.id">
                          {{ voice.name }} {{ voice.isDefault ? `(${voice.lang} Default)` : `(${voice.lang})`}}
                        </option>
                    </optgroup>
                    <option v-if="!ttsVoicesAreLoaded" disabled>Loading voices...</option>
                  </select>
                </SettingsItem>
                <SettingsItem v-if="isTTSSupportedBySelectedProvider" label="TTS Speech Rate" :description="`${vcaSettings.ttsRate.toFixed(1)}x`" label-for="ttsRateRange">
                  <input type="range" id="ttsRateRange" v-model.number="vcaSettings.ttsRate" min="0.5" max="2" step="0.1" class="range-slider" @input="updateRangeProgress($event.target as HTMLInputElement)">
                </SettingsItem>
                <SettingsItem v-if="isTTSSupportedBySelectedProvider" label="TTS Speech Pitch" :description="`${vcaSettings.ttsPitch.toFixed(1)}`" label-for="ttsPitchRange">
                  <input type="range" id="ttsPitchRange" v-model.number="vcaSettings.ttsPitch" min="0" max="2" step="0.1" class="range-slider" @input="updateRangeProgress($event.target as HTMLInputElement)">
                </SettingsItem>
              </div>
            </div>
          </div>
          
          <div v-if="vcaSettings.audioInputMode === 'voice-activation'" class="setting-subsection mt-8">
            <h4 class="subsection-title">Voice Activation (VAD)</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8 mt-4">
              <SettingsItem label="Detection Sensitivity" :description="`${Math.round(vcaSettings.vadThreshold * 100)}% (Lower is more sensitive)`" label-for="vadThresholdRange">
                <input type="range" id="vadThresholdRange" v-model.number="vcaSettings.vadThreshold" min="0.05" max="0.3" step="0.01" class="range-slider" @input="updateRangeProgress($event.target as HTMLInputElement)">
              </SettingsItem>
              <SettingsItem label="Silence Timeout" :description="`${(vcaSettings.vadSilenceTimeoutMs / 1000).toFixed(1)}s to stop after silence`" label-for="vadSilenceTimeoutRange">
                <input type="range" id="vadSilenceTimeoutRange" v-model.number="vcaSettings.vadSilenceTimeoutMs" min="1000" max="5000" step="250" class="range-slider" @input="updateRangeProgress($event.target as HTMLInputElement)">
              </SettingsItem>
            </div>
          </div>

           <div v-if="vcaSettings.audioInputMode === 'continuous'" class="setting-subsection mt-8">
            <h4 class="subsection-title">Continuous Mode (WebSpeech)</h4>
             <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8 mt-4">
                <SettingsItem label="Auto-send on Pause" description="Send transcription on speaking pause." label-for="continuousAutoSendToggle">
                    <label class="toggle-switch">
                        <input type="checkbox" id="continuousAutoSendToggle" v-model="vcaSettings.continuousModeAutoSend" class="sr-only peer" />
                        <div class="toggle-switch-track"></div>
                    </label>
                </SettingsItem>
                <SettingsItem label="Pause Detection Timeout" :description="`${(vcaSettings.continuousModePauseTimeoutMs / 1000).toFixed(1)}s to wait before sending`" label-for="continuousPauseTimeoutRange">
                    <input type="range" id="continuousPauseTimeoutRange" v-model.number="vcaSettings.continuousModePauseTimeoutMs" min="1000" max="8000" step="500" class="range-slider" @input="updateRangeProgress($event.target as HTMLInputElement)">
                </SettingsItem>
            </div>
          </div>

          <div class="setting-subsection mt-8">
            <h4 class="subsection-title">Microphone Test</h4>
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-x-4 mt-3">
              <button @click="testMicrophone" :disabled="isTestingMic" class="btn-secondary btn-sm mb-2 sm:mb-0">
                <span v-if="isTestingMic" class="flex items-center"><SpinnerIcon class="mr-2" /> Testing...</span>
                <span v-else>Test Microphone</span>
              </button>
              <div v-if="micTestResult" class="text-sm font-medium" :class="micTestResultClass">{{ micTestResultMessage }}</div>
            </div>
            <div v-if="isTestingMic && micAudioLevels.length > 0" class="mt-3 p-2 bg-gray-100 dark:bg-gray-700/50 rounded-md">
              <div class="flex items-end gap-0.5 h-10 w-full">
                <div v-for="(level, index) in micAudioLevels.slice(-60)" :key="index"
                     class="w-full bg-primary-500 dark:bg-primary-400 rounded-sm transition-all duration-75"
                     :style="{ height: `${Math.max(1, level * 100)}%` }">
                </div>
              </div>
              <p class="setting-description mt-1.5 text-center">Speak to see audio levels. Test runs for 5 seconds.</p>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Session & Costs" :icon="CreditCardIcon">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="info-card">
              <h4 class="info-card-title">Current Session Cost</h4>
              <p class="info-card-value text-primary-600 dark:text-primary-400">${{ currentSessionCost.toFixed(4) }}</p>
              <button @click="resetSessionCost" class="btn-secondary-outline btn-sm mt-2.5">Reset Cost</button>
            </div>
            <div class="info-card">
              <h4 class="info-card-title">Configured Cost Limit</h4>
              <p class="info-card-value">${{ vcaSettings.costLimit.toFixed(2) }}</p>
              <p class="setting-description text-xs">Max per session before warning.</p>
            </div>
          </div>
          <SettingsItem label="Session Cost Limit" :description="`Set a U.S. Dollar limit: $${vcaSettings.costLimit.toFixed(2)}`" label-for="costLimitRange" class="mt-6" full-width-description>
            <input type="range" id="costLimitRange" v-model.number="vcaSettings.costLimit" min="1" max="100" step="1" class="range-slider" @input="updateRangeProgress($event.target as HTMLInputElement)">
          </SettingsItem>
        </SettingsSection>

        <SettingsSection title="Security & Privacy" :icon="ShieldCheckIcon">
          <SettingsItem label="Remember Login" description="Keep you logged in across browser sessions using local storage." label-for="rememberLoginToggle">
             <label class="toggle-switch">
                <input type="checkbox" id="rememberLoginToggle" v-model="rememberLoginLocal" class="sr-only peer" />
                <div class="toggle-switch-track"></div>
            </label>
          </SettingsItem>
          <div class="danger-zone mt-8">
            <h4 class="subsection-title text-red-500 dark:text-red-400">Danger Zone</h4>
            <div class="mt-3">
                <button @click="handleLogout" class="btn-danger btn-sm">
                    <ArrowLeftOnRectangleIcon class="h-4 w-4 mr-1.5"/> Logout
                </button>
                <p class="setting-description mt-1">This will log you out of the application.</p>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Data Management" :icon="ArrowDownTrayIcon">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button @click="exportAllSettings" class="btn-secondary">
              <ArrowUpTrayIcon class="h-5 w-5 mr-2" /> Export Settings
            </button>
            <div class="relative">
              <input ref="importSettingsInputRef" type="file" accept=".json,.txt" @change="handleImportSettingsFile" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" aria-label="Import settings file">
              <button @click="triggerImportFile" class="btn-secondary w-full">
                <ArrowDownTrayIcon class="h-5 w-5 mr-2" /> Import Settings
              </button>
            </div>
          </div>
          <p class="setting-description mt-4">Export or import your application settings (JSON format).</p>
        </SettingsSection>
      </div>

      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700/80 flex justify-center sm:justify-end">
        <button @click="confirmAndGoBack" class="btn-primary btn-lg">
          <CheckCircleIcon class="h-5 w-5 mr-2" /> Done
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed, inject, nextTick, defineAsyncComponent, h as VueH } from 'vue';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
import { api as mainApi, costAPI } from '../utils/api';
import { voiceSettingsManager, VoiceApplicationSettings, VoiceOption } from '../services/voice.settings.service';
import { conversationManager } from '../services/conversation.manager'; // Import conversationManager
import {
  Cog8ToothIcon, PaintBrushIcon, WrenchScrewdriverIcon, SpeakerWaveIcon, CreditCardIcon, ShieldCheckIcon,
  ArrowDownTrayIcon, ArrowUpTrayIcon, ArrowLeftIcon, CheckCircleIcon, ArrowPathIcon, ArrowLeftOnRectangleIcon,
} from '@heroicons/vue/24/outline';

// Define a leaner SpinnerIcon for local use
const SpinnerIcon = defineAsyncComponent(() =>
  Promise.resolve({
    render() {
      return VueH('svg', { class: "animate-spin h-4 w-4", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" }, [
        VueH('circle', { class: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", 'stroke-width': "4" }),
        VueH('path', { class: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
      ]);
    }
  })
);

// Helper components for structure (can be moved to separate files if preferred)
const SettingsSection = defineAsyncComponent(() => Promise.resolve({
  props: { title: String, icon: Object },
  setup(props, { slots }) {
    return () => VueH('section', { 'aria-labelledby': props.title?.toLowerCase().replace(/\s+/g, '-') + '-settings-title', class: 'settings-section-card' }, [
      VueH('div', { class: 'section-header' }, [
        props.icon ? VueH(props.icon, { class: 'section-icon shrink-0' }) : null,
        VueH('h2', { id: props.title?.toLowerCase().replace(/\s+/g, '-') + '-settings-title', class: 'section-title' }, props.title)
      ]),
      slots.default ? slots.default() : null
    ]);
  }
}));

const SettingsItem = defineAsyncComponent(() => Promise.resolve({
  props: { label: String, description: String, labelFor: String, fullWidthDescription: Boolean },
  setup(props, { slots }) {
    return () => VueH('div', { class: ['setting-item-wrapper', props.fullWidthDescription ? 'full-width-desc-item' : ''] }, [
      VueH('div', { class: 'setting-item-label-action' }, [
        VueH('label', { for: props.labelFor, class: 'setting-label' }, props.label),
        VueH('div', { class: 'setting-control' }, slots.default ? slots.default() : [])
      ]),
      props.description ? VueH('p', { class: 'setting-description' }, props.description) : null
    ]);
  }
}));


const router = useRouter();
const toast = inject('toast') as any;
const AUTH_TOKEN_KEY = 'vcaAuthToken';

// --- Centralized Settings from voiceSettingsManager ---
// Assuming VoiceApplicationSettings is extended in voice.settings.service.ts
// to include: defaultMode, defaultLanguage, generateDiagrams, autoClearChat, costLimit
const vcaSettings = voiceSettingsManager.settings;

// --- Settings managed by conversationManager ---
const MIN_CHAT_HISTORY_FOR_SLIDER = 2; // Min 1 pair
const MAX_CHAT_HISTORY_MESSAGES = 200; // Max 100 pairs, from conversationManager

const chatHistoryCount = ref(conversationManager.getHistoryMessageCount());
watch(chatHistoryCount, (newVal) => {
  conversationManager.setHistoryMessageCount(newVal);
});
// If conversationManager.currentMessagesToKeepCount were directly exposed and reactive:
// const chatHistoryCount = conversationManager.currentMessagesToKeepCount; // Would be simpler

// --- Local UI Settings ---
const isDarkModeLocal = useStorage('darkMode', false);
const rememberLoginLocal = useStorage('rememberLogin', true);

// --- Data for UI elements ---
const audioInputDevices = voiceSettingsManager.audioInputDevices;
const ttsVoicesAreLoaded = voiceSettingsManager.ttsVoicesLoaded;
const currentTTSVoiceOptions = voiceSettingsManager.ttsVoicesForCurrentProvider;

const currentSessionCost = ref(0);
const importSettingsInputRef = ref<HTMLInputElement | null>(null);

// --- Microphone Test State ---
const isTestingMic = ref(false);
const micTestResult = ref<'' | 'success' | 'error_permission' | 'error_notfound' | 'error_overconstrained' | 'error_generic'>('');
const micAudioLevels = ref<number[]>([]);
let micTestAudioContext: AudioContext | null = null;
let micTestAnalyser: AnalyserNode | null = null;
let micTestMicrophone: MediaStreamAudioSourceNode | null = null;
let micTestStreamLocal: MediaStream | null = null;


// --- Computed Properties ---
const isTTSSupportedBySelectedProvider = computed(() => {
    if (vcaSettings.ttsProvider === 'browser_tts') {
        return currentTTSVoiceOptions.value.length > 0 || !ttsVoicesAreLoaded.value; // Show if voices exist or are still loading
    }
    // Assume OpenAI TTS is always "available" to configure, actual usage depends on API key etc.
    return vcaSettings.ttsProvider === 'openai_tts';
});

const groupedCurrentTTSVoices = computed(() => {
  const groups: Record<string, { lang: string, voices: VoiceOption[] }> = {};
  currentTTSVoiceOptions.value.forEach(voiceOpt => {
    const langDisplay = getLanguageDisplayName(voiceOpt.lang) || voiceOpt.lang;
    if (!groups[langDisplay]) {
      groups[langDisplay] = { lang: langDisplay, voices: [] };
    }
    groups[langDisplay].voices.push(voiceOpt);
  });
  // Sort groups by language display name, then voices within each group by name
  return Object.values(groups)
    .sort((a,b) => a.lang.localeCompare(b.lang))
    .map(group => {
        group.voices.sort((a,b) => a.name.localeCompare(b.name));
        return group;
    });
});

const currentAudioDeviceName = computed(() => {
  if (!vcaSettings.selectedAudioInputDeviceId) return 'Default System Microphone';
  const device = audioInputDevices.value.find(d => d.deviceId === vcaSettings.selectedAudioInputDeviceId);
  return device?.label || `Mic ${vcaSettings.selectedAudioInputDeviceId.substring(0,10)}...`;
});

const micTestResultMessage = computed(() => {
    const messages = {
        'success': 'Microphone working!',
        'error_permission': 'Permission Denied.',
        'error_notfound': 'Mic Not Found.',
        'error_overconstrained': 'Mic Inaccessible.',
        'error_generic': 'Test Error.',
        '': ''
    };
    return messages[micTestResult.value];
});
const micTestResultClass = computed(() => {
    const classes = {
        'success': 'text-green-600 dark:text-green-400',
        'error_permission': 'text-red-600 dark:text-red-400',
        'error_notfound': 'text-red-600 dark:text-red-400',
        'error_overconstrained': 'text-yellow-500 dark:text-yellow-400',
        'error_generic': 'text-red-600 dark:text-red-400',
        '': 'text-gray-500 dark:text-gray-400'
    };
    return classes[micTestResult.value];
});

// --- Methods ---
const goBack = () => router.push('/');
const confirmAndGoBack = () => {
    toast?.add({ type: 'info', title: 'Preferences Applied', message: 'Your settings are saved automatically.' });
    router.push('/');
}

const getLanguageDisplayName = (langCode: string): string => {
  try {
    if (!langCode) return 'Unknown';
    const mainLangCode = langCode.split('-')[0];
    const displayName = new Intl.DisplayNames(['en'], { type: 'language' }).of(mainLangCode);
    return displayName || langCode;
  } catch (e) { return langCode; }
};

const updateRangeProgress = (target: HTMLInputElement | null) => {
  if (!target) return;
  const value = parseFloat(target.value);
  const min = parseFloat(target.min);
  const max = parseFloat(target.max);
  const percentage = ((value - min) / (max - min)) * 100;
  target.style.setProperty('--range-progress', `${Math.max(0, Math.min(100, percentage))}%`);
};

const getAudioModeDescription = (mode: VoiceApplicationSettings['audioInputMode']) => {
  const descriptions: Record<VoiceApplicationSettings['audioInputMode'], string> = {
    'push-to-talk': 'Click and hold the mic button to record.',
    'continuous': 'Mic listens continuously for longer conversations.',
    'voice-activation': 'Mic activates automatically when voice is detected.',
  };
  return descriptions[mode] || 'Select an audio input mode.';
};

const triggerRefreshAudioDevices = async () => {
  toast?.add({ type: 'info', title: 'Refreshing Audio Devices...' });
  try {
    await voiceSettingsManager.loadAudioInputDevices(true);
    if (audioInputDevices.value.length > 0) {
      toast?.add({ type: 'success', title: 'Audio Devices Refreshed' });
    } else {
      toast?.add({ type: 'warning', title: 'No Audio Devices', message: 'No microphones found. Please check your connection and browser permissions.' });
    }
  } catch (error: any) {
    console.error('Error refreshing audio devices from settings page:', error);
    let message = 'Could not access microphone to list devices.';
    if (error.name === 'NotAllowedError') {
      message = 'Microphone permission denied. Please enable it in your browser settings.';
    }
    toast?.add({ type: 'error', title: 'Mic Permission Error', message });
  }
};

const testMicrophone = async () => {
  isTestingMic.value = true;
  micTestResult.value = '';
  micAudioLevels.value = [];
  try {
    const constraints: MediaStreamConstraints = {
      audio: vcaSettings.selectedAudioInputDeviceId
        ? { deviceId: { exact: vcaSettings.selectedAudioInputDeviceId }, echoCancellation: true, noiseSuppression: true, autoGainControl: true }
        : { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
    };
    micTestStreamLocal = await navigator.mediaDevices.getUserMedia(constraints);
    micTestAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    micTestAnalyser = micTestAudioContext.createAnalyser();
    micTestMicrophone = micTestAudioContext.createMediaStreamSource(micTestStreamLocal);
    micTestAnalyser.fftSize = 256;
    micTestAnalyser.smoothingTimeConstant = 0.3;
    micTestMicrophone.connect(micTestAnalyser);
    micTestResult.value = 'success';

    let frameId: number;
    const monitorLevels = () => {
      if (!micTestAnalyser || !isTestingMic.value || !micTestAudioContext || micTestAudioContext.state === 'closed') {
        if(frameId) cancelAnimationFrame(frameId);
        return;
      }
      const bufferLength = micTestAnalyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      micTestAnalyser.getByteFrequencyData(dataArray);
      let sum = 0; for(let i = 0; i < dataArray.length; i++) { sum += dataArray[i]; }
      const average = dataArray.length > 0 ? sum / dataArray.length : 0;
      const normalizedLevel = Math.min(1, Math.max(0, average / 128));
      micAudioLevels.value.push(normalizedLevel);
      if (micAudioLevels.value.length > 60) micAudioLevels.value.shift(); // Keep more samples for smoother bar display
      frameId = requestAnimationFrame(monitorLevels);
    };
    monitorLevels();

    setTimeout(() => {
      if (isTestingMic.value) {
        stopMicrophoneTest();
        if (micTestResult.value === 'success' && micAudioLevels.value.some(l => l > 0.1)) { // Check if any significant audio was detected
             toast?.add({ type: 'success', title: 'Mic Test Complete', message: 'Microphone detected audio input.' });
        } else if (micTestResult.value === 'success') {
             toast?.add({ type: 'warning', title: 'Mic Test Complete', message: 'Microphone is working, but no significant audio was detected. Check input levels.' });
        }
      }
    }, 5000);
  } catch (err: any) {
    console.error('Microphone test error:', err);
    // ... (error handling as before) ...
    stopMicrophoneTest();
  }
};

const stopMicrophoneTest = () => { /* ... (same as your provided code) ... */ };
const fetchCurrentSessionCost = async () => { /* ... (same as your provided code) ... */ };
const resetSessionCost = async () => { /* ... (same as your provided code) ... */ };
const handleLogout = () => { /* ... (same as your provided code, ensure AUTH_TOKEN_KEY is used) ... */ };

const exportAllSettings = () => {
  const settingsToExport = {
    // Local UI settings
    isDarkMode: isDarkModeLocal.value,
    rememberLogin: rememberLoginLocal.value,
    // Centralized VCA settings
    ...JSON.parse(JSON.stringify(vcaSettings)), // Deep copy of all VCA settings
    // Conversation manager specific settings
    chatHistoryIndividualMessageCount: conversationManager.getHistoryMessageCount(),
    // Metadata
    vcaSettingsVersion: '1.3.0', // Increment this if settings structure changes significantly
    exportDate: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(settingsToExport, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vca-settings-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  toast?.add({type: 'success', title: 'Settings Exported', message: 'Your application settings have been downloaded.'});
};

const triggerImportFile = () => { importSettingsInputRef.value?.click(); };

const handleImportSettingsFile = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target?.result as string);
      if (typeof imported.isDarkMode === 'boolean') isDarkModeLocal.value = imported.isDarkMode;
      if (typeof imported.rememberLogin === 'boolean') rememberLoginLocal.value = imported.rememberLogin;
      
      if (typeof imported.chatHistoryIndividualMessageCount === 'number') {
        conversationManager.setHistoryMessageCount(imported.chatHistoryIndividualMessageCount);
        chatHistoryCount.value = conversationManager.getHistoryMessageCount(); // Sync local ref for UI
      }

      // Apply settings to voiceSettingsManager (iterate over known keys of VoiceApplicationSettings)
      const vcaSettingKeys = Object.keys(voiceSettingsManager.defaultSettings || {}) as Array<keyof VoiceApplicationSettings>;
      vcaSettingKeys.forEach(key => {
        if (key in imported && typeof imported[key] === typeof vcaSettings[key]) {
            voiceSettingsManager.updateSetting(key, imported[key]);
        }
      });

      toast?.add({type: 'success', title: 'Settings Imported', message: 'Your settings have been restored.'});
      nextTick(() => {
        document.querySelectorAll<HTMLInputElement>('input[type="range"].range-slider').forEach(el => updateRangeProgress(el));
      });
    } catch (error) {
      console.error("Error importing settings:", error);
      toast?.add({type: 'error', title: 'Import Failed', message: 'Could not import settings. File may be corrupt or invalid.'});
    }
  };
  reader.readAsText(file);
  if (importSettingsInputRef.value) importSettingsInputRef.value.value = '';
};

onMounted(async () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) {
    toast?.add({ type: 'error', title: 'Authentication Required', message: 'Please login to access settings.' });
    router.push('/login');
    return;
  }
  if (mainApi.defaults.headers.common['Authorization'] !== `Bearer ${token}`) {
    mainApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  await fetchCurrentSessionCost();
  // voiceSettingsManager handles its own onMounted loading for devices/voices
  // We can trigger a refresh if needed, or ensure its loaded status is checked
  if (!voiceSettingsManager.audioInputDevicesLoaded.value) {
    await voiceSettingsManager.loadAudioInputDevices();
  }
  if (!voiceSettingsManager.ttsVoicesLoaded.value && vcaSettings.autoPlayTts) {
    await voiceSettingsManager.loadAllTtsVoices();
  }
  // Sync local chatHistoryCount ref with manager's current value
  chatHistoryCount.value = conversationManager.getHistoryMessageCount();


  nextTick(() => {
    document.querySelectorAll<HTMLInputElement>('input[type="range"].range-slider').forEach(el => updateRangeProgress(el));
  });
});

onBeforeUnmount(() => {
  stopMicrophoneTest();
});

watch(isDarkModeLocal, (newVal) => {
  document.documentElement.classList.toggle('dark', newVal);
}, { immediate: true });

// Update range progress for all sliders when settings object changes (e.g., after import)
watch(vcaSettings, () => {
    nextTick(() => {
        document.querySelectorAll<HTMLInputElement>('input[type="range"].range-slider').forEach(el => updateRangeProgress(el));
    });
}, { deep: true });
watch(chatHistoryCount, () => { // Also for chat history specific slider
     nextTick(() => {
        const el = document.getElementById('chatHistoryLength') as HTMLInputElement | null;
        if(el) updateRangeProgress(el);
    });
});

</script>

<style lang="postcss" scoped>
.settings-page-container {
  @apply transition-colors duration-300 ease-in-out;
}
.settings-section-card {
  @apply bg-white dark:bg-gray-800/60 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/50;
  /* Removed backdrop-blur from section cards for potentially better performance on complex pages */
}

.section-header {
  @apply flex items-center gap-3 pb-4 mb-6 border-b border-gray-200 dark:border-gray-700;
}
.section-icon {
  @apply h-6 w-6 text-primary-500 dark:text-primary-400;
}
.section-title {
  @apply text-xl font-semibold text-gray-800 dark:text-gray-100;
}

.setting-item-wrapper {
  @apply py-3 sm:py-4; /* Consistent padding */
}
.setting-item-wrapper.full-width-desc-item .setting-item-label-action {
  /* For items like range sliders where label is above */
  @apply flex-col items-start;
}
.setting-item-wrapper.full-width-desc-item .setting-label {
  @apply mb-2; /* Space between label and control if stacked */
}
.setting-item-wrapper.full-width-desc-item .setting-description {
    @apply pt-1.5 text-left;
}

.setting-item-label-action {
    @apply flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4;
}
.setting-label {
  @apply text-sm font-medium text-gray-800 dark:text-gray-200 flex-shrink-0 cursor-default;
  /* Removed fixed width, let flexbox handle it */
}
.setting-control {
  @apply flex-grow flex sm:justify-end items-center; /* Push controls to the right on sm+ */
}
.setting-item-label-action .setting-control {
  @apply w-full sm:w-auto; /* Allow control to take full width on mobile, auto on larger */
}
.setting-description {
  @apply text-xs text-gray-500 dark:text-gray-400 mt-1;
}
.setting-item-wrapper:not(.full-width-desc-item) .setting-item-label-action + .setting-description {
    @apply pt-1 sm:text-right;
    /* Ensure description is correctly aligned if it's for the whole item, not just control */
}


/* Form Inputs */
.select-input {
  @apply w-full sm:max-w-xs text-sm px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm
        bg-white dark:bg-gray-700/80
        text-gray-900 dark:text-gray-50
        focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400
        transition-all duration-150 ease-in-out appearance-none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.25em 1.25em;
  padding-right: 2.75rem;
}
.dark .select-input {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
}

.toggle-switch { /* Container for the input and the visual track */
  @apply relative inline-flex items-center h-6 w-11 cursor-pointer flex-shrink-0;
}
.toggle-switch-track {
  @apply w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors duration-200 ease-in-out
         peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-primary-500 dark:peer-focus:ring-offset-gray-950
         peer-checked:bg-primary-600 dark:peer-checked:bg-primary-500;
}
.toggle-switch-track::after { /* The thumb */
  @apply content-[''] absolute top-0.5 left-[2px] bg-white border-gray-300 dark:border-gray-500 border rounded-full h-5 w-5
         transition-all duration-200 ease-in-out shadow-sm
         peer-checked:translate-x-full peer-checked:border-white;
}

.range-slider {
  @apply w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer;
  --range-progress: 0%;
  background: linear-gradient(to right,
    var(--primary-color, theme('colors.primary.600')) var(--range-progress),
    var(--range-track-bg, theme('colors.gray.300')) var(--range-progress));
}
.dark .range-slider {
  background: linear-gradient(to right,
    var(--primary-color-dark, theme('colors.primary.500')) var(--range-progress),
    var(--range-track-bg-dark, theme('colors.gray.700')) var(--range-progress));
}
.range-slider::-webkit-slider-thumb {
  @apply appearance-none w-5 h-5 bg-primary-600 dark:bg-primary-500 rounded-full cursor-grab shadow-md
        ring-2 ring-white/70 dark:ring-black/30 active:cursor-grabbing
        transition-shadow duration-100 ease-in-out focus:outline-none focus:ring-primary-500/50 focus:ring-offset-1;
}
.range-slider::-moz-range-thumb {
  @apply w-5 h-5 bg-primary-600 dark:bg-primary-500 rounded-full cursor-grab border-0 shadow-md
        focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-1;
}

.setting-subsection {
  @apply mt-8 pt-6 border-t border-gray-200 dark:border-gray-700/80;
}
.subsection-title {
  @apply text-base font-semibold text-gray-700 dark:text-gray-300 mb-1;
}

.info-card {
    @apply p-5 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700/50 shadow-sm;
}
.info-card-title {
    @apply text-sm font-medium text-gray-600 dark:text-gray-400 mb-0.5;
}
.info-card-value {
    @apply text-2xl font-bold text-gray-800 dark:text-gray-100;
}

.danger-zone {
    @apply mt-8 p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg;
}

/* Buttons */
.btn-primary, .btn-secondary, .btn-danger, .btn-secondary-outline {
  @apply px-4 py-2 rounded-lg text-sm font-medium border
         focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-950
         transition-all duration-150 ease-in-out inline-flex items-center justify-center shadow-sm hover:shadow-md;
}
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white border-transparent focus:ring-primary-500;
}
.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 focus:ring-gray-400;
}
.btn-secondary-outline {
  @apply bg-transparent hover:bg-gray-100 text-gray-700 border-gray-300 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700/60 focus:ring-gray-500;
}
.btn-danger {
  @apply bg-red-600 hover:bg-red-700 text-white border-transparent focus:ring-red-500;
}
.btn-lg { @apply px-6 py-2.5 text-base; }
.btn-sm { @apply px-3 py-1.5 text-xs; }

:root { /* For range slider progress, ensure primary is defined in Tailwind config */
  --primary-color: theme('colors.primary.600', #3b82f6);
  --primary-color-dark: theme('colors.primary.500', #60a5fa);
  --range-track-bg: theme('colors.gray.300', #d1d5db);
  --range-track-bg-dark: theme('colors.gray.700', #374151);
}
.dark { /* Ensure dark mode overrides are specific enough if :root is also used by Tailwind base */
  --primary-color: theme('colors.primary.500', #60a5fa);
}
</style>