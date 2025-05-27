// File: frontend/src/views/settings/Settings.vue
/**
 * @file Settings.vue
 * @description User-configurable settings page for the Voice Chat Assistant.
 * Allows customization of appearance, general preferences, audio/voice parameters,
 * session costs, security, data management, and chat history strategies.
 * Settings are persisted to localStorage and reactively updated.
 * @version 1.3.3
 * @author Voice Coding Assistant Team
 * V1.3.3: Corrected API method calls, store usage, and type inferences. Removed unused imports.
 */

<template>
  <div class="settings-page-container min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
    <header class="sticky top-0 z-30 glass-pane shadow-md border-b-[var(--glass-border)]">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img src="/src/assets/logo.svg" alt="Voice Chat Assistant Logo" class="w-9 h-9 sm:w-10 sm:h-10" />
            <h1 class="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
              Settings
            </h1>
          </div>
          <button @click="goHome" class="btn btn-ghost btn-sm" title="Back to Home">
            <ArrowLeftIcon class="h-4 w-4" />
            Back to App
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-2xl mx-auto py-6 sm:py-10 px-4">
      <div class="hidden sm:block mb-10 text-center">
        <div class="inline-flex items-center gap-3">
          <Cog8ToothIcon class="h-10 w-10 text-primary-600 dark:text-primary-400" />
          <h1 class="text-4xl font-bold tracking-tight text-[var(--text-primary)]">Application Settings</h1>
        </div>
        <p class="mt-3 text-base text-[var(--text-secondary)]">
          Configure your Voice Chat Assistant. Changes are saved automatically.
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
            <SettingsItem label="Default Assistant Mode" description="Initial mode when the app starts." label-for="defaultModeSelect">
              <select id="defaultModeSelect" v-model="vcaSettings.defaultMode" class="select-input">
                <option v-for="agentOption in availableAgentModeOptions" :key="agentOption.value" :value="agentOption.value">
                  {{ agentOption.label }}
                </option>
              </select>
            </SettingsItem>
            <SettingsItem label="Default Programming Language" description="For code examples from assistants." label-for="defaultLanguageSelect">
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
            label="Use Advanced Chat History Management"
            description="Fine-grained control over LLM context history selection."
            label-for="useAdvancedHistoryToggle"
            class="mt-8"
          >
            <label class="toggle-switch">
              <input type="checkbox" id="useAdvancedHistoryToggle" v-model="useAdvancedHistoryManager" class="sr-only peer" />
              <div class="toggle-switch-track"></div>
            </label>
          </SettingsItem>

          <SettingsItem
            v-if="!useAdvancedHistoryManager"
            label="Chat History Length (Basic)"
            :description="`Keep ${chatHistoryCount} messages (${Math.floor(chatHistoryCount / 2)} pairs). Affects context & API tokens.`"
            label-for="chatHistoryLength"
            class="mt-6"
            full-width-description
          >
            <input type="range" id="chatHistoryLength" v-model.number="chatHistoryCount" :min="MIN_CHAT_HISTORY_FOR_SLIDER" :max="MAX_CHAT_HISTORY_MESSAGES_CONFIGURABLE" step="2" class="range-slider" @input="updateRangeProgress($event.target as HTMLInputElement)">
          </SettingsItem>

          <SettingsItem label="Generate Diagrams Automatically" description="For system design and complex explanations (Mermaid)." label-for="generateDiagramsToggle" class="mt-6">
            <label class="toggle-switch">
              <input type="checkbox" id="generateDiagramsToggle" v-model="vcaSettings.generateDiagrams" class="sr-only peer" />
              <div class="toggle-switch-track"></div>
            </label>
          </SettingsItem>
          <SettingsItem label="Auto-Clear Chat on Mode Change" description="Clears previous agent's chat log when switching assistants." label-for="autoClearToggle" class="mt-6">
            <label class="toggle-switch">
              <input type="checkbox" id="autoClearToggle" v-model="vcaSettings.autoClearChat" class="sr-only peer" />
              <div class="toggle-switch-track"></div>
            </label>
          </SettingsItem>
        </SettingsSection>

        <SettingsSection v-if="useAdvancedHistoryManager" title="Advanced Chat History" :icon="AcademicCapIcon">
            <SettingsItem label="Strategy Preset" description="Select a strategy for how chat history is chosen for the LLM." label-for="advHistoryPreset">
              <select id="advHistoryPreset" v-model="advancedHistoryConfigLocal.strategyPreset" @change="onAdvancedPresetChange(($event.target as HTMLSelectElement).value as HistoryStrategyPreset)" class="select-input">
                <option v-for="preset in availablePresetDisplayNames" :key="preset.key" :value="preset.key">
                  {{ preset.name }}
                </option>
              </select>
            </SettingsItem>

            <div class="setting-subsection mt-6">
                <h4 class="subsection-title mb-1">Strategy Configuration</h4>
                <p class="setting-description mb-4">Adjust parameters for the selected strategy. These settings apply when "Advanced Chat History" is enabled.</p>

              <SettingsItem label="Max Context Tokens" description="Target maximum token count for the history context sent to the LLM." label-for="advMaxContextTokens" class="mt-1">
                  <input type="number" id="advMaxContextTokens" v-model.number="advancedHistoryConfigLocal.maxContextTokens" min="500" max="32000" step="100" class="input-field-sm">
              </SettingsItem>

              <SettingsItem
                  v-if="isRelevancyStrategyActive"
                  label="Relevancy Threshold"
                  :description="`Minimum score (0.05-0.95) for a message to be relevant. Current: ${advancedHistoryConfigLocal.relevancyThreshold.toFixed(2)}`"
                  label-for="advRelevancyThreshold" full-width-description class="mt-4">
                  <input type="range" id="advRelevancyThreshold" v-model.number="advancedHistoryConfigLocal.relevancyThreshold" min="0.05" max="0.95" step="0.01" class="range-slider" @input="updateRangeProgress($event.target as HTMLInputElement)">
              </SettingsItem>

              <SettingsItem
                  v-if="advancedHistoryConfigLocal.strategyPreset !== HistoryStrategyPreset.SIMPLE_RECENCY"
                  label="Recent Messages to Prioritize"
                  description="Number of most recent messages to always try to include (subject to token limits)."
                  label-for="advNumRecent" class="mt-4">
                  <input type="number" id="advNumRecent" v-model.number="advancedHistoryConfigLocal.numRecentMessagesToPrioritize" min="0" max="50" step="1" class="input-field-sm">
              </SettingsItem>

              <SettingsItem
                  v-if="isRelevancyStrategyActive"
                  label="Relevant Older Messages"
                  description="Maximum number of older, highly relevant messages to include."
                  label-for="advNumRelevantOlder" class="mt-4">
                  <input type="number" id="advNumRelevantOlder" v-model.number="advancedHistoryConfigLocal.numRelevantOlderMessagesToInclude" min="0" max="50" step="1" class="input-field-sm">
              </SettingsItem>

              <SettingsItem
                  v-if="advancedHistoryConfigLocal.strategyPreset === HistoryStrategyPreset.SIMPLE_RECENCY"
                  label="Simple Recency Message Count"
                  description="Number of recent messages for the Simple Recency strategy."
                  label-for="advSimpleRecencyCount" class="mt-4">
                  <input type="number" id="advSimpleRecencyCount" v-model.number="advancedHistoryConfigLocal.simpleRecencyMessageCount" min="1" max="100" step="1" class="input-field-sm">
              </SettingsItem>
                <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                  <SettingsItem label="Filter System Messages" description="Exclude past system messages from LLM context." label-for="advFilterSystem" >
                      <label class="toggle-switch">
                          <input type="checkbox" id="advFilterSystem" v-model="advancedHistoryConfigLocal.filterHistoricalSystemMessages" class="sr-only peer" />
                          <div class="toggle-switch-track"></div>
                      </label>
                  </SettingsItem>
                  <SettingsItem label="Chars per Token (Est.)" description="Average characters per token for rough estimation." label-for="advCharsPerToken">
                      <input type="number" id="advCharsPerToken" v-model.number="advancedHistoryConfigLocal.charsPerTokenEstimate" min="1" max="10" step="0.1" class="input-field-sm">
                  </SettingsItem>
                </div>
            </div>
            <div class="setting-subsection mt-6">
                <h4 class="subsection-title mb-3">Management</h4>
                <div class="flex flex-col sm:flex-row gap-3">
                    <button @click="resetCurrentAdvancedStrategyToDefaults" class="btn btn-secondary-outline btn-sm flex-1">Reset Current Strategy to Defaults</button>
                    <button @click="resetAllAdvancedSettingsToGlobalDefaults" class="btn btn-secondary-outline btn-sm flex-1">Reset All to Global Defaults</button>
                </div>
            </div>
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
                <button @click="triggerRefreshAudioDevices" class="btn btn-secondary-outline btn-sm mt-2.5 w-full sm:w-auto">
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
              <SettingsItem label="Speech Recognition (STT)" description="Whisper for accuracy, Web Speech for speed/cost." label-for="sttPreferenceSelect">
                <select id="sttPreferenceSelect" v-model="vcaSettings.sttPreference" class="select-input">
                  <option value="whisper_api">OpenAI Whisper (High Accuracy)</option>
                  <option value="browser_webspeech_api">Browser Web Speech (Fast, Free)</option>
                </select>
              </SettingsItem>
                <SettingsItem label="Auto-Play Responses (TTS)" description="Automatically speak assistant's responses aloud." label-for="autoPlayTtsToggle">
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
                  <SettingsItem label="TTS Provider" description="Service used for generating speech." label-for="ttsProviderSelect">
                      <select id="ttsProviderSelect" v-model="vcaSettings.ttsProvider" class="select-input">
                        <option value="browser_tts">Browser Built-in (Free, Varies)</option>
                        <option value="openai_tts">OpenAI TTS (High Quality, Cost)</option>
                      </select>
                  </SettingsItem>
                  <SettingsItem v-if="isTTSSupportedBySelectedProvider" label="TTS Voice" description="Voice selection depends on provider and browser." label-for="ttsVoiceSelect">
                    <select id="ttsVoiceSelect" v-model="vcaSettings.selectedTtsVoiceId" class="select-input" :disabled="!ttsVoicesAreLoaded || currentTTSVoiceOptions.length === 0">
                      <option :value="null">Provider Default</option>
                      <optgroup v-if="ttsVoicesAreLoaded" v-for="group in groupedCurrentTTSVoices" :key="group.lang" :label="group.lang">
                        <option v-for="voice in group.voices" :key="voice.id" :value="voice.id">
                          {{ voice.name }} {{ voice.isDefault ? `(Default)` : ''}}
                        </option>
                      </optgroup>
                      <option v-if="!ttsVoicesAreLoaded && vcaSettings.ttsProvider === 'browser_tts'" disabled>Loading browser voices...</option>
                      <option v-if="!ttsVoicesAreLoaded && vcaSettings.ttsProvider === 'openai_tts'" disabled>Loading OpenAI voices...</option>
                      <option v-if="ttsVoicesAreLoaded && currentTTSVoiceOptions.length === 0" disabled>No voices for provider/lang</option>
                    </select>
                  </SettingsItem>
                  <SettingsItem v-if="isTTSSupportedBySelectedProvider" label="TTS Speech Rate" :description="`Playback speed: ${vcaSettings.ttsRate.toFixed(1)}x`" label-for="ttsRateRange">
                    <input type="range" id="ttsRateRange" v-model.number="vcaSettings.ttsRate" min="0.5" max="2" step="0.1" class="range-slider" @input="updateRangeProgress($event.target as HTMLInputElement)">
                  </SettingsItem>
                  <SettingsItem v-if="isTTSSupportedBySelectedProvider && vcaSettings.ttsProvider === 'browser_tts'" label="TTS Speech Pitch" :description="`Voice pitch: ${vcaSettings.ttsPitch.toFixed(1)}`" label-for="ttsPitchRange">
                    <input type="range" id="ttsPitchRange" v-model.number="vcaSettings.ttsPitch" min="0" max="2" step="0.1" class="range-slider" @input="updateRangeProgress($event.target as HTMLInputElement)">
                  </SettingsItem>
                </div>
              </div>
            </div>

            <div v-if="vcaSettings.audioInputMode === 'voice-activation'" class="setting-subsection mt-8">
              <h4 class="subsection-title">Voice Activation (VAD) Parameters</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8 mt-4">
                <SettingsItem label="Detection Sensitivity" :description="`Threshold: ${Math.round(vcaSettings.vadThreshold * 100)}% (Lower is more sensitive)`" label-for="vadThresholdRange">
                  <input type="range" id="vadThresholdRange" v-model.number="vcaSettings.vadThreshold" min="0.01" max="0.5" step="0.01" class="range-slider" @input="updateRangeProgress($event.target as HTMLInputElement)">
                </SettingsItem>
                <SettingsItem label="Silence Timeout (VAD)" :description="`Stop after ${vcaSettings.vadSilenceTimeoutMs / 1000}s of silence`" label-for="vadSilenceTimeoutRange">
                  <input type="range" id="vadSilenceTimeoutRange" v-model.number="vcaSettings.vadSilenceTimeoutMs" min="500" max="5000" step="100" class="range-slider" @input="updateRangeProgress($event.target as HTMLInputElement)">
                </SettingsItem>
              </div>
            </div>

            <div v-if="vcaSettings.audioInputMode === 'continuous' && vcaSettings.sttPreference === 'browser_webspeech_api'" class="setting-subsection mt-8">
              <h4 class="subsection-title">Continuous Mode (Browser STT) Parameters</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8 mt-4">
                  <SettingsItem label="Auto-send on Pause" description="Send current transcription after a pause in speech." label-for="continuousAutoSendToggle">
                      <label class="toggle-switch">
                        <input type="checkbox" id="continuousAutoSendToggle" v-model="vcaSettings.continuousModeAutoSend" class="sr-only peer" />
                        <div class="toggle-switch-track"></div>
                      </label>
                  </SettingsItem>
                  <SettingsItem v-if="vcaSettings.continuousModeAutoSend" label="Pause Timeout (Continuous)" :description="`Wait ${vcaSettings.continuousModePauseTimeoutMs / 1000}s before sending`" label-for="continuousPauseTimeoutRange">
                      <input type="range" id="continuousPauseTimeoutRange" v-model.number="vcaSettings.continuousModePauseTimeoutMs" min="1000" max="10000" step="250" class="range-slider" @input="updateRangeProgress($event.target as HTMLInputElement)">
                  </SettingsItem>
              </div>
            </div>

            <div class="setting-subsection mt-8">
              <h4 class="subsection-title">Microphone Test</h4>
              <div class="flex flex-col sm:flex-row items-start sm:items-center gap-x-4 mt-3">
                <button @click="testMicrophone" :disabled="isTestingMic" class="btn btn-secondary btn-sm mb-2 sm:mb-0">
                  <span v-if="isTestingMic" class="flex items-center"><SpinnerIcon class="mr-2" /> Testing... (5s)</span>
                  <span v-else>Test Microphone</span>
                </button>
                <div v-if="micTestResult" class="text-sm font-medium" :class="micTestResultClass">{{ micTestResultMessage }}</div>
              </div>
              <div v-if="isTestingMic && micAudioLevels.length > 0" class="mt-3 p-2 bg-[var(--bg-subtle)] rounded-md">
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
                <button @click="handleResetSessionCost" class="btn btn-secondary-outline btn-sm mt-2.5 w-full">Reset Session Cost</button>
              </div>
              <div class="info-card">
                <h4 class="info-card-title">Configured Session Cost Limit</h4>
                <p class="info-card-value">${{ vcaSettings.costLimit.toFixed(2) }}</p>
                <p class="setting-description text-xs">Maximum cost per session before a warning is displayed.</p>
              </div>
            </div>
            <SettingsItem label="Session Cost Limit ($)" :description="`Set a U.S. Dollar limit: $${vcaSettings.costLimit.toFixed(2)}`" label-for="costLimitRange" class="mt-6" full-width-description>
              <input type="range" id="costLimitRange" v-model.number="vcaSettings.costLimit" min="0.50" max="50" step="0.50" class="range-slider" @input="updateRangeProgress($event.target as HTMLInputElement)">
            </SettingsItem>
        </SettingsSection>

        <SettingsSection title="Security & Privacy" :icon="ShieldCheckIcon">
            <SettingsItem label="Remember Login" description="Keep you logged in across browser sessions using local storage (less secure)." label-for="rememberLoginToggle">
                <label class="toggle-switch">
                  <input type="checkbox" id="rememberLoginToggle" v-model="rememberLoginLocal" class="sr-only peer" />
                  <div class="toggle-switch-track"></div>
                </label>
            </SettingsItem>
            <div class="danger-zone mt-8">
              <h4 class="subsection-title text-red-500 dark:text-red-400">Danger Zone</h4>
              <div class="mt-3">
                  <button @click="handleLogout" class="btn btn-danger btn-sm">
                    <ArrowLeftOnRectangleIcon class="h-4 w-4 mr-1.5"/> Logout
                  </button>
                  <p class="setting-description mt-1">This will log you out of the application and clear session data.</p>
              </div>
              <div class="mt-4">
                  <button @click="handleClearConversationHistory" class="btn btn-danger-outline btn-sm">
                    Clear All Local Chat History
                  </button>
                  <p class="setting-description mt-1">This will permanently delete all your locally stored chat messages.</p>
              </div>
            </div>
        </SettingsSection>

        <SettingsSection title="Data Management" :icon="ArrowDownTrayIcon">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button @click="exportAllSettings" class="btn btn-secondary w-full">
                <ArrowUpTrayIcon class="h-5 w-5 mr-2" /> Export Settings
              </button>
              <div class="relative">
                <input ref="importSettingsInputRef" type="file" accept=".json" @change="handleImportSettingsFile" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" aria-label="Import settings file">
                <button @click="triggerImportFile" class="btn btn-secondary w-full">
                  <ArrowDownTrayIcon class="h-5 w-5 mr-2" /> Import Settings
                </button>
              </div>
            </div>
            <p class="setting-description mt-4">Export or import your application settings (JSON format).</p>
        </SettingsSection>
      </div>

      <div class="mt-12 pt-8 border-t border-[var(--border-color)] flex justify-center sm:justify-end">
        <button @click="confirmAndGoBack" class="btn btn-primary btn-lg">
          <CheckCircleIcon class="h-5 w-5 mr-2" /> Done & Return
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  ref, computed, watch, onMounted, onBeforeUnmount, inject, nextTick, h,
  type WritableComputedRef,
} from 'vue';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';

import { api as mainApi, costAPI } from '@/utils/api';
import {
  voiceSettingsManager,
  type VoiceApplicationSettings,
  type VoiceOption,
} from '@/services/voice.settings.service';
import { conversationManager } from '@/services/conversation.manager';
import {
  advancedConversationManager,
  HistoryStrategyPreset,
  type AdvancedHistoryConfig,
  DEFAULT_ADVANCED_HISTORY_CONFIG,
} from '@/services/advancedConversation.manager';
import type { ToastService } from '@/services/services';
import { agentService } from '@/services/agent.service';
import { AUTH_TOKEN_KEY, MAX_CHAT_HISTORY_MESSAGES_CONFIGURABLE } from '@/utils/constants';

import SettingsSection from '@/components/settings/SettingsSection.vue';
import SettingsItem from '@/components/settings/SettingsItem.vue';

import { useUiStore } from '@/store/ui.store';   // ← NEW store
import { useChatStore } from '@/store/chat.store';

import {
  Cog8ToothIcon, PaintBrushIcon, WrenchScrewdriverIcon, SpeakerWaveIcon,
  CreditCardIcon, ShieldCheckIcon, ArrowDownTrayIcon, ArrowUpTrayIcon,
  ArrowLeftIcon, CheckCircleIcon, ArrowPathIcon, ArrowLeftOnRectangleIcon,
  AcademicCapIcon,
} from '@heroicons/vue/24/outline';

// Simple functional component for spinner
const SpinnerIcon = {
  name: 'SpinnerIcon',
  render() {
    return h('svg', { class: "animate-spin h-4 w-4", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" }, [
      h('circle', { class: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", 'stroke-width': "4" }),
      h('path', { class: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
    ]);
  }
};


const router  = useRouter();
const toast   = inject<ToastService>('toast');
const uiStore = useUiStore();

// --- dark‑mode toggle now proxies to theme engine ---
const isDarkModeLocal: WritableComputedRef<boolean> = computed({
  get: () => uiStore.isDarkMode,
  set: (val) => uiStore.setDarkMode(val),
});

// ---------------------------------------------------------------------------
//  availableAgentModeOptions now guards optional public flag
// ---------------------------------------------------------------------------
const goHome = () => router.push('/'); // Assumes Home or PrivateHome based on auth

const vcaSettings = voiceSettingsManager.settings;
const MIN_CHAT_HISTORY_FOR_SLIDER = 2;

const chatHistoryCount = ref(conversationManager.getHistoryMessageCount());
watch(chatHistoryCount, (newVal) => {
  if (!vcaSettings.useAdvancedMemory) {
    conversationManager.setHistoryMessageCount(newVal);
  }
});

const useAdvancedHistoryManager = ref(vcaSettings.useAdvancedMemory);
const advancedHistoryConfigLocal = ref<AdvancedHistoryConfig>({ ...advancedConversationManager.getHistoryConfig() });

const availablePresetDisplayNames = computed<Array<{key: HistoryStrategyPreset, name: string}>>(() => {
    return (Object.values(HistoryStrategyPreset) as HistoryStrategyPreset[]).map(value => {
        let name = value.replace(/([A-Z])/g, ' $1');
        name = name.charAt(0).toUpperCase() + name.slice(1);
        return { key: value, name: name.trim() };
    });
});


// --- Agent list helper now guards optional public flag --------------------------------
const availableAgentModeOptions = computed(() => {
  return agentService
    .getAllAgents()
    .filter((agent) => {
      const isPublic = (agent as any).isPubliclyAvailable ?? (agent as any).public ?? false;
      return isPublic || ['diary','businessMeeting','systemDesigner','codingInterviewer'].includes(agent.id);
    })
    .map((agent) => ({ value: agent.id, label: agent.label }));
});

watch(() => advancedConversationManager.config.value, (managerConfig) => {
    if (JSON.stringify(advancedHistoryConfigLocal.value) !== JSON.stringify(managerConfig)) {
        advancedHistoryConfigLocal.value = { ...managerConfig };
    }
    nextTick(() => {
        document.querySelectorAll<HTMLInputElement>('input[type="range"].range-slider').forEach(el => updateRangeProgress(el));
    });
}, { deep: true, immediate: true });

watch(advancedHistoryConfigLocal, (localConfigUpdate, oldLocalConfigUpdate) => {
    if (localConfigUpdate && oldLocalConfigUpdate && localConfigUpdate.strategyPreset === oldLocalConfigUpdate.strategyPreset) {
        advancedConversationManager.updateConfig(localConfigUpdate);
    } else if (localConfigUpdate && !oldLocalConfigUpdate) {
        advancedConversationManager.updateConfig(localConfigUpdate);
    }
}, { deep: true });

const onAdvancedPresetChange = (newPresetValue: HistoryStrategyPreset) => {
    advancedConversationManager.setHistoryStrategyPreset(newPresetValue);
    toast?.add({type: 'info', title: 'Strategy Preset Changed', message: `Switched to ${newPresetValue}. Settings adjusted.`});
};

const resetCurrentAdvancedStrategyToDefaults = () => {
    const currentPreset = advancedHistoryConfigLocal.value.strategyPreset;
    advancedConversationManager.setHistoryStrategyPreset(currentPreset);
    toast?.add({type: 'success', title: 'Strategy Reset', message: `Settings for '${currentPreset}' strategy reset to its defaults.`});
};

const resetAllAdvancedSettingsToGlobalDefaults = () => {
    const globalDefaultConfig = { ...DEFAULT_ADVANCED_HISTORY_CONFIG };
    advancedConversationManager.updateConfig(globalDefaultConfig);
    toast?.add({type: 'success', title: 'Advanced Settings Reset', message: 'All advanced history settings reset to global defaults.'});
};

const rememberLoginLocal = useStorage('vcaRememberLogin', true);

const audioInputDevices = computed(() => voiceSettingsManager.audioInputDevices.value);
const ttsVoicesAreLoaded = computed(() => voiceSettingsManager.ttsVoicesLoaded.value);
const currentTTSVoiceOptions = voiceSettingsManager.ttsVoicesForCurrentProvider;

const currentSessionCost = ref(0);
const importSettingsInputRef = ref<HTMLInputElement | null>(null);

const isTestingMic = ref(false);
const micTestResult = ref<'' | 'success' | 'error_permission' | 'error_notfound' | 'error_overconstrained' | 'error_generic'>('');
const micAudioLevels = ref<number[]>([]);
let micTestAudioContext: AudioContext | null = null;
let micTestAnalyser: AnalyserNode | null = null;
let micTestMicrophone: MediaStreamAudioSourceNode | null = null;
let micTestStreamLocal: MediaStream | null = null;

const isTTSSupportedBySelectedProvider = computed<boolean>(() => {
    if (vcaSettings.ttsProvider === 'browser_tts') {
        return currentTTSVoiceOptions.value.length > 0 || !ttsVoicesAreLoaded.value;
    }
    return vcaSettings.ttsProvider === 'openai_tts';
});

const groupedCurrentTTSVoices = computed(() => {
  const groups: Record<string, { lang: string, voices: VoiceOption[] }> = {};
  currentTTSVoiceOptions.value.forEach(voiceOpt => {
    const langDisplay = getLanguageDisplayName(voiceOpt.lang) || voiceOpt.lang || 'Unknown Language';
    if (!groups[langDisplay]) {
      groups[langDisplay] = { lang: langDisplay, voices: [] };
    }
    groups[langDisplay].voices.push(voiceOpt);
  });
  return Object.values(groups)
    .sort((a,b) => a.lang.localeCompare(b.lang))
    .map(group => {
        group.voices.sort((a,b) => a.name.localeCompare(b.name));
        return group;
    });
});

const currentAudioDeviceName = computed<string>(() => {
  if (!vcaSettings.selectedAudioInputDeviceId) return 'Default System Microphone';
  const device = audioInputDevices.value.find(d => d.deviceId === vcaSettings.selectedAudioInputDeviceId);
  return device?.label || `Mic ${vcaSettings.selectedAudioInputDeviceId.substring(0,10)}...`;
});

const micTestResultMessage = computed<string>(() => {
    const messages = { /* ... (same as before) ... */
        'success': 'Microphone test active. Speak into the mic.',
        'error_permission': 'Microphone permission denied. Please check browser settings.',
        'error_notfound': 'No microphone found or selected device is unavailable.',
        'error_overconstrained': 'Microphone is busy or cannot be accessed with current settings (e.g., sample rate).',
        'error_generic': 'An unknown error occurred during the microphone test.',
        '': ''
    };
    return messages[micTestResult.value];
});

const micTestResultClass = computed<string>(() => {
    const classes = { /* ... (same as before) ... */
        'success': 'text-green-600 dark:text-green-400',
        'error_permission': 'text-red-600 dark:text-red-400',
        'error_notfound': 'text-red-600 dark:text-red-400',
        'error_overconstrained': 'text-yellow-500 dark:text-yellow-400',
        'error_generic': 'text-red-600 dark:text-red-400',
        '': 'text-gray-500 dark:text-gray-400'
    };
    return classes[micTestResult.value];
});

const isRelevancyStrategyActive = computed(() => {
    const preset = advancedHistoryConfigLocal.value.strategyPreset;
    return preset === HistoryStrategyPreset.BALANCED_HYBRID ||
           preset === HistoryStrategyPreset.RELEVANCE_FOCUSED ||
           preset === HistoryStrategyPreset.MAX_CONTEXT_HYBRID;
});

const confirmAndGoBack = (): void => {
    toast?.add({ type: 'success', title: 'Preferences Applied', message: 'Your settings are saved automatically.' });
    router.push('/');
};

const getLanguageDisplayName = (langCode?: string): string => {
  if (!langCode) return 'Unknown';
  try {
    const mainLangCode = langCode.split('-')[0];
    const displayNameService = new Intl.DisplayNames(['en'], { type: 'language' });
    const displayName = displayNameService.of(mainLangCode);
    return displayName && displayName !== mainLangCode ? `${displayName} (${langCode})` : langCode;
  } catch (e) {
    return langCode;
  }
};

const updateRangeProgress = (target: HTMLInputElement | null): void => {
  if (!target) return;
  const value = parseFloat(target.value);
  const min = parseFloat(target.min);
  const max = parseFloat(target.max);
  const percentage = ((value - min) / (max - min)) * 100;
  target.style.setProperty('--range-progress', `${Math.max(0, Math.min(100, percentage))}%`);
};

const getAudioModeDescription = (mode: VoiceApplicationSettings['audioInputMode']): string => {
  const descriptions: Record<VoiceApplicationSettings['audioInputMode'], string> = { /* ... (same as before) ... */
    'push-to-talk': 'Click and hold the microphone button to record your voice.',
    'continuous': 'Microphone listens continuously. Best for quiet environments (WebSpeech API only).',
    'voice-activation': 'Microphone activates automatically when speech is detected (VAD).',
  };
  return descriptions[mode] || 'Select an audio input mode.';
};

const triggerRefreshAudioDevices = async (): Promise<void> => {
  toast?.add({ type: 'info', title: 'Refreshing Audio Devices...', duration: 2000 });
  try {
    await voiceSettingsManager.loadAudioInputDevices(true);
    if (audioInputDevices.value.length > 0) {
      toast?.add({ type: 'success', title: 'Audio Devices Refreshed', message: `${audioInputDevices.value.length} device(s) found.` });
    } else {
      toast?.add({ type: 'warning', title: 'No Audio Devices', message: 'No microphones found. Check connection/permissions.' });
    }
  } catch (error: any) {
    let message = 'Could not access microphone to list devices. Check browser permissions.';
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      message = 'Microphone permission denied. Please enable it in your browser settings.';
    }
    toast?.add({ type: 'error', title: 'Microphone Access Error', message });
  }
};

const testMicrophone = async (): Promise<void> => {
  // ... (implementation is complex and seems mostly correct, no changes needed for these TS errors)
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
      if (micAudioLevels.value.length > 60) micAudioLevels.value.shift();
      frameId = requestAnimationFrame(monitorLevels);
    };
    monitorLevels();

    setTimeout(() => {
      if (isTestingMic.value) {
        stopMicrophoneTest();
        if (micTestResult.value === 'success') {
            const significantAudio = micAudioLevels.value.some(l => l > 0.05);
            if (significantAudio) {
                toast?.add({ type: 'success', title: 'Mic Test Complete', message: 'Microphone detected audio input successfully.' });
            } else {
                toast?.add({ type: 'warning', title: 'Mic Test Complete', message: 'Mic working, but no significant audio was detected. Check input levels or speak louder.' });
            }
        }
      }
    }, 5000);

  } catch (err: any) {
    console.error('SettingsPage: Microphone test error:', err);
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') micTestResult.value = 'error_permission';
    else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') micTestResult.value = 'error_notfound';
    else if (err.name === 'NotReadableError' || err.name === 'TrackStartError' || err.name === 'OverconstrainedError') micTestResult.value = 'error_overconstrained';
    else micTestResult.value = 'error_generic';
    toast?.add({ type: 'error', title: 'Microphone Test Failed', message: micTestResultMessage.value || 'Could not start microphone test.' });
    stopMicrophoneTest();
  }
};

const stopMicrophoneTest = (): void => {
  // ... (implementation remains same)
  isTestingMic.value = false;
  if (micTestStreamLocal) {
    micTestStreamLocal.getTracks().forEach(track => track.stop());
    micTestStreamLocal = null;
  }
  if (micTestMicrophone) micTestMicrophone.disconnect();
  if (micTestAnalyser) micTestAnalyser.disconnect();
  if (micTestAudioContext && micTestAudioContext.state !== 'closed') {
    micTestAudioContext.close().catch(e => console.warn("Error closing mic test audio context", e));
  }
  micTestMicrophone = null;
  micTestAnalyser = null;
  micTestAudioContext = null;
};

const fetchCurrentSessionCost = async (): Promise<void> => {
  try {
    const response = await costAPI.getSessionCost(); // Corrected: Use getSessionCost
    currentSessionCost.value = response.data.sessionCost;
  } catch (error) {
    console.error("SettingsPage: Failed to fetch session cost:", error);
    toast?.add({type: 'error', title: 'Cost Data Error', message: 'Could not retrieve current session cost details.'});
  }
};

const handleResetSessionCost = async (): Promise<void> => {
  if (!confirm("Are you sure you want to reset your current session's cost tracking? This action cannot be undone for the current session.")) return;
  try {
    const response = await costAPI.resetSessionCost({ action: 'reset' }); // Corrected: Use resetSessionCost
    currentSessionCost.value = response.data.sessionCost;
    toast?.add({ type: 'success', title: 'Session Cost Reset', message: 'Current session cost has been reset successfully.' });
  } catch (error) {
    console.error("SettingsPage: Failed to reset session cost:", error);
    toast?.add({ type: 'error', title: 'Cost Reset Failed', message: 'Could not reset session cost.' });
  }
};

const handleLogout = (): void => {
  const storageToUse = rememberLoginLocal.value ? localStorage : sessionStorage;
  storageToUse.removeItem(AUTH_TOKEN_KEY);
  if (mainApi.defaults.headers.common['Authorization']) {
    delete mainApi.defaults.headers.common['Authorization'];
  }
  voiceSettingsManager.resetToDefaults();
  
  const chatStore = useChatStore(); // Get instance
  chatStore.clearAgentData(); 

  toast?.add({ type: 'success', title: 'Logged Out', message: 'You have been successfully logged out.' });
  router.push('/login');
};

const handleClearConversationHistory = async (): Promise<void> => {
  if (confirm("Are you sure you want to delete ALL your locally stored chat history for ALL agents? This action cannot be undone.")) {
    try {
      const chatStore = useChatStore(); // Get instance
      chatStore.clearAgentData(); 
      toast?.add({ type: 'success', title: 'Chat History Cleared', message: 'All local conversation messages have been deleted.' });
    } catch (error) {
      console.error("SettingsPage: Error clearing chat history:", error);
      toast?.add({ type: 'error', title: 'History Clear Failed', message: 'Could not clear chat history.' });
    }
  }
};

const exportAllSettings = (): void => {
  const settingsToExport = {
    isDarkMode: isDarkModeLocal.value,
    rememberLogin: rememberLoginLocal.value,
    vcaSettings: { ...vcaSettings },
    useAdvancedMemory: useAdvancedHistoryManager.value,
    chatHistoryIndividualMessageCount: !useAdvancedHistoryManager.value ? conversationManager.getHistoryMessageCount() : undefined,
    advancedHistoryConfig: useAdvancedHistoryManager.value ? { ...advancedConversationManager.getHistoryConfig() } : undefined, // Spread to get plain object
    vcaSettingsVersion: '1.3.3', // Update version
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

const triggerImportFile = (): void => { importSettingsInputRef.value?.click(); };

const handleImportSettingsFile = (event: Event): void => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target?.result as string);
      
      if (typeof imported.isDarkMode === 'boolean') isDarkModeLocal.value = imported.isDarkMode;
      if (typeof imported.rememberLogin === 'boolean') rememberLoginLocal.value = imported.rememberLogin;
      
      const importedUseAdvanced = imported.useAdvancedMemory ?? imported.useAdvancedHistoryManager;
      if (typeof importedUseAdvanced === 'boolean') {
        useAdvancedHistoryManager.value = importedUseAdvanced;
        if (vcaSettings.useAdvancedMemory !== importedUseAdvanced) {
          voiceSettingsManager.updateSetting('useAdvancedMemory', importedUseAdvanced);
        }
      }

      const baseSettingsObject = imported.vcaSettings || imported;
      const vcaSettingKeys = Object.keys(voiceSettingsManager.defaultSettings) as Array<keyof VoiceApplicationSettings>;
      
      vcaSettingKeys.forEach(key => {
        if (key === 'useAdvancedMemory') return; 
        if (key in baseSettingsObject && baseSettingsObject[key] !== undefined) {
          voiceSettingsManager.updateSetting(key, baseSettingsObject[key]);
        }
      });

      if (!useAdvancedHistoryManager.value && typeof imported.chatHistoryIndividualMessageCount === 'number') {
        conversationManager.setHistoryMessageCount(imported.chatHistoryIndividualMessageCount);
        chatHistoryCount.value = conversationManager.getHistoryMessageCount();
      }
      if (useAdvancedHistoryManager.value && imported.advancedHistoryConfig) {
        const currentManagerDefaults = DEFAULT_ADVANCED_HISTORY_CONFIG;
        const mergedConfig = { ...currentManagerDefaults, ...imported.advancedHistoryConfig };
        advancedConversationManager.updateConfig(mergedConfig as AdvancedHistoryConfig);
      }

      toast?.add({type: 'success', title: 'Settings Imported', message: 'Your settings have been restored. Some changes may require a page reload or app restart to fully apply.'});
      nextTick(() => {
        document.querySelectorAll<HTMLInputElement>('input[type="range"].range-slider').forEach(el => updateRangeProgress(el));
      });
    } catch (error) {
      console.error("SettingsPage: Error importing settings:", error);
      toast?.add({type: 'error', title: 'Import Failed', message: 'Could not import settings. File may be corrupt or invalid.'});
    }
  };
  reader.readAsText(file);
  if (importSettingsInputRef.value) importSettingsInputRef.value.value = '';
};

// --- Lifecycle & Watchers ---
onMounted(async () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
  if (!token && !window.location.pathname.startsWith('/public')) {
    toast?.add({ type: 'warning', title: 'Authentication Required', message: 'Please login to access settings.' });
    router.push({name: 'Login', query: { redirect: router.currentRoute.value.fullPath }});
    return;
  }
  if (token && (!mainApi.defaults.headers.common['Authorization'] || mainApi.defaults.headers.common['Authorization'] !== `Bearer ${token}`)) {
    mainApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  useAdvancedHistoryManager.value = vcaSettings.useAdvancedMemory;

  await fetchCurrentSessionCost();
  if (!voiceSettingsManager.audioInputDevicesLoaded.value) {
    await voiceSettingsManager.loadAudioInputDevices();
  }
  if (!voiceSettingsManager.ttsVoicesLoaded.value && vcaSettings.autoPlayTts) {
    await voiceSettingsManager.loadAllTtsVoices();
  }
  if (!useAdvancedHistoryManager.value) {
    chatHistoryCount.value = conversationManager.getHistoryMessageCount();
  }

  nextTick(() => {
    document.querySelectorAll<HTMLInputElement>('input[type="range"].range-slider').forEach(el => updateRangeProgress(el));
  });
});

onBeforeUnmount(() => {
  stopMicrophoneTest();
});

// Watcher for isDarkModeLocal (from useStorage) to sync with uiStore and document
watch(isDarkModeLocal, (newVal) => {
  // uiStore.setTheme will handle document.documentElement.classList and persist to its own useStorage instance
  uiStore.setTheme(newVal ? 'dark' : 'light');
}, { immediate: true }); // immediate might cause a double-set if uiStore also initializes from storage. uiStore's initializeTheme should be robust.

// Watcher for uiStore's theme to sync back to isDarkModeLocal if changed elsewhere (e.g., header button)
// Keep dark-mode toggle in sync if some other part of the app changes the active theme
watch(() => uiStore.isDarkMode, (newIsDark) => {
  if (isDarkModeLocal.value !== newIsDark) {
    isDarkModeLocal.value = newIsDark;
  }
});

// Sync useAdvancedHistoryManager (local ref for UI toggle) with vcaSettings.useAdvancedMemory (service state)
watch(() => vcaSettings.useAdvancedMemory, (newValueFromService) => {
  if (useAdvancedHistoryManager.value !== newValueFromService) {
    useAdvancedHistoryManager.value = newValueFromService;
  }
});
watch(useAdvancedHistoryManager, (newLocalValue) => {
  if (vcaSettings.useAdvancedMemory !== newLocalValue) {
    voiceSettingsManager.updateSetting('useAdvancedMemory', newLocalValue);
  }
  if (!newLocalValue) {
    chatHistoryCount.value = conversationManager.getHistoryMessageCount();
    nextTick(() => {
        const el = document.getElementById('chatHistoryLength') as HTMLInputElement | null;
        if(el) updateRangeProgress(el);
    });
  } else {
      advancedHistoryConfigLocal.value = { ...advancedConversationManager.getHistoryConfig() };
  }
});

// Update range sliders visually when their underlying vcaSettings models change
watch([
    () => vcaSettings.vadThreshold, () => vcaSettings.vadSilenceTimeoutMs,
    () => vcaSettings.continuousModePauseTimeoutMs, () => vcaSettings.ttsRate,
    () => vcaSettings.ttsPitch, () => vcaSettings.costLimit, chatHistoryCount,
    () => advancedHistoryConfigLocal.value.relevancyThreshold
  ], () => {
  nextTick(() => {
    document.querySelectorAll<HTMLInputElement>('input[type="range"].range-slider').forEach(el => updateRangeProgress(el));
  });
}, { deep: true }); // Deep watch on advancedHistoryConfigLocal for sub-property changes

</script>

<style lang="postcss" scoped>
/* Using variables from main.css for consistency */
.settings-page-container {
  /* Styles applied via theme variables from main.css */
}

.select-input {
  @apply form-select bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-primary)];
  /* Further customizations if form-select base is not enough */
}

.range-slider {
  @apply w-full h-2 rounded-lg appearance-none cursor-pointer relative;
  background-color: var(--bg-subtle); /* Track background */
  background-image: linear-gradient(to right, var(--primary-500) var(--range-progress, 0%), transparent var(--range-progress, 0%));
}
.dark .range-slider {
  background-color: var(--bg-subtle); /* Ensure dark mode track is defined */
  background-image: linear-gradient(to right, var(--primary-400) var(--range-progress, 0%), transparent var(--range-progress, 0%));
}

.range-slider::-webkit-slider-thumb {
  @apply appearance-none w-5 h-5 bg-primary-600 dark:bg-primary-400 rounded-full shadow-md cursor-pointer transition-transform duration-150;
  transform: scale(1);
}
.range-slider::-moz-range-thumb {
  @apply appearance-none w-5 h-5 bg-primary-600 dark:bg-primary-400 rounded-full shadow-md cursor-pointer border-0;
  transform: scale(1);
}
.range-slider:active::-webkit-slider-thumb, .range-slider:focus-visible::-webkit-slider-thumb {
  transform: scale(1.2);
  @apply ring-2 ring-offset-1 ring-primary-300 dark:ring-primary-500 ring-offset-[var(--bg-surface)];
}
.range-slider:active::-moz-range-thumb, .range-slider:focus-visible::-moz-range-thumb {
  transform: scale(1.2);
}

.input-field-sm {
  @apply form-input py-1.5 text-sm;
  max-width: 150px;
}

/* Styles for SettingsSection and SettingsItem are expected to be in their respective component files or main.css */

.setting-subsection {
  @apply mt-6 pt-6 border-t border-[var(--border-color)];
}
.subsection-title {
  @apply text-xs font-semibold text-[var(--text-muted)] mb-3 uppercase tracking-wider;
}

.info-card {
    @apply p-4 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-color)] shadow-sm;
}
.info-card-title {
    @apply text-xs font-semibold text-[var(--text-muted)] mb-0.5 uppercase tracking-wide;
}
.info-card-value {
    @apply text-2xl font-bold text-[var(--text-primary)];
}

.danger-zone {
    @apply mt-6 p-5 bg-red-500/5 dark:bg-red-900/10 border border-red-500/30 dark:border-red-700/40 rounded-lg;
}

/* Ensure these button styles are either here or defined globally in main.css */
.btn-secondary-outline {
  @apply btn border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:border-slate-400 dark:hover:border-slate-500;
}
.btn-danger-outline {
  @apply btn border-red-500/70 text-red-600 dark:border-red-500/50 dark:text-red-400 hover:bg-red-500/10;
}
</style>