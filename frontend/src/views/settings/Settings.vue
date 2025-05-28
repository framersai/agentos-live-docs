// File: frontend/src/views/settings/Settings.vue
/**
 * @file Settings.vue
 * @description User-configurable settings page, revamped for "Ephemeral Harmony" theme.
 * Styles are now in `frontend/src/styles/views/settings/_settings-page.scss`.
 * @version 2.1.1 - TypeScript fixes and import.meta.glob correction.
 */
<template>
  <div class="settings-page-ephemeral">
    <header class="settings-header-ephemeral">
      <div class="header-content-container-ephemeral">
        <div class="logo-title-group-ephemeral">
          <img src="/src/assets/logo.svg" alt="VCA Logo" class="logo-img-ephemeral" />
          <h1 class="page-title-ephemeral">Application Settings</h1>
        </div>
        <button @click="confirmAndGoBack" class="btn btn-secondary-ephemeral btn-sm back-button-ephemeral">
          <ArrowLeftIcon class="icon-sm" />
          Done & Back to App
        </button>
      </div>
    </header>

    <main class="settings-main-content-ephemeral">
      <div class="intro-text-ephemeral">
        <Cog8ToothIcon class="intro-icon-ephemeral" />
        <p>
          Customize your Voice Chat Assistant experience. Changes are saved automatically.
        </p>
      </div>

      <div class="settings-layout-grid-ephemeral">
        <SettingsSection title="Appearance" :icon="PaintBrushIcon" class="settings-grid-span-2">
          <SettingsItem
            label="Theme Mode"
            description="Select your preferred interface theme."
            label-for="themeModeSelect"
            class="theme-selector-item-ephemeral"
          >
            <div class="theme-buttons-group-ephemeral">
                <button
                    @click="() => uiStore.setThemeFlexible('aurora-daybreak')"
                    class="btn theme-btn-ephemeral" :class="{'active': uiStore.currentThemeId === 'aurora-daybreak'}">
                    <SunIcon class="icon-xs"/> Aurora Light
                </button>
                 <button
                    @click="() => uiStore.setThemeFlexible('warm-embrace')"
                    class="btn theme-btn-ephemeral" :class="{'active': uiStore.currentThemeId === 'warm-embrace'}">
                    <SparklesIcon class="icon-xs"/> Warm Embrace
                </button>
                <button
                    @click="() => uiStore.setThemeFlexible('twilight-neo')"
                    class="btn theme-btn-ephemeral" :class="{'active': uiStore.currentThemeId === 'twilight-neo'}">
                    <MoonIcon class="icon-xs"/> Twilight Neo
                </button>
                <button
                    @click="() => uiStore.setThemeFlexible('magenta-mystic')" 
                    class="btn theme-btn-ephemeral" :class="{'active': uiStore.currentThemeId === 'magenta-mystic'}">
                    <SparklesIcon class="icon-xs"/> Magenta Mystic
                </button>
            </div>
          </SettingsItem>
        </SettingsSection>

        <SettingsSection title="General Preferences" :icon="WrenchScrewdriverIcon" class="settings-grid-span-2">
          <div class="settings-items-grid-ephemeral">
            <SettingsItem label="Default Assistant Mode" description="Initial mode when the app starts." label-for="defaultModeSelect">
              <select id="defaultModeSelect" v-model="vcaSettings.defaultMode" class="select-input-ephemeral">
                <option v-for="agentOption in availableAgentModeOptions" :key="agentOption.value" :value="agentOption.value">
                  {{ agentOption.label }}
                </option>
              </select>
            </SettingsItem>
            <SettingsItem label="Preferred Coding Language" description="For code examples from assistants." label-for="defaultLanguageSelect">
              <select id="defaultLanguageSelect" v-model="vcaSettings.preferredCodingLanguage" class="select-input-ephemeral">
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </SettingsItem>
          </div>
          <SettingsItem
            label="Advanced Chat History"
            description="Enable sophisticated context management for LLM interactions."
            label-for="useAdvancedHistoryToggle" class="settings-item-spaced-ephemeral"
          >
            <label class="toggle-switch-ephemeral">
              <input type="checkbox" id="useAdvancedHistoryToggle" v-model="useAdvancedHistoryManager" />
              <span class="track"><span class="knob"></span></span>
            </label>
          </SettingsItem>
           <SettingsItem
            v-if="!useAdvancedHistoryManager"
            label="Chat History Length (Basic)"
            :description="`Keep ${chatHistoryCount} messages (${Math.floor(chatHistoryCount / 2)} pairs). Affects context & API tokens.`"
            label-for="chatHistoryLength"
            class="settings-item-spaced-ephemeral"
            full-width-description
          >
            <input type="range" id="chatHistoryLength" v-model.number="chatHistoryCount" :min="MIN_CHAT_HISTORY_FOR_SLIDER" :max="MAX_CHAT_HISTORY_MESSAGES_CONFIGURABLE" step="2" class="range-slider-ephemeral" @input="updateRangeProgress($event.target as HTMLInputElement)">
          </SettingsItem>
           <SettingsItem label="Generate Diagrams Automatically" description="For system design and complex explanations (Mermaid)." label-for="generateDiagramsToggle" class="settings-item-spaced-ephemeral">
            <label class="toggle-switch-ephemeral">
              <input type="checkbox" id="generateDiagramsToggle" v-model="vcaSettings.generateDiagrams" />
              <span class="track"><span class="knob"></span></span>
            </label>
          </SettingsItem>
          <SettingsItem label="Auto-Clear Chat on Mode Change" description="Clears previous agent's chat log when switching." label-for="autoClearToggle" class="settings-item-spaced-ephemeral">
            <label class="toggle-switch-ephemeral">
              <input type="checkbox" id="autoClearToggle" v-model="vcaSettings.autoClearChat" />
              <span class="track"><span class="knob"></span></span>
            </label>
          </SettingsItem>
        </SettingsSection>

        <SettingsSection v-if="useAdvancedHistoryManager" title="Advanced History Config" :icon="AcademicCapIcon" class="settings-grid-span-2">
           <SettingsItem label="Strategy Preset" description="Select context strategy." label-for="advHistoryPreset">
             <select id="advHistoryPreset" v-model="advancedHistoryConfigLocal.strategyPreset" @change="onAdvancedPresetChange(($event.target as HTMLSelectElement).value as HistoryStrategyPreset)" class="select-input-ephemeral">
               <option v-for="preset in availablePresetDisplayNames" :key="preset.key" :value="preset.key">
                 {{ preset.name }}
               </option>
             </select>
           </SettingsItem>
           <div class="setting-subsection-ephemeral">
             <h4 class="subsection-title-ephemeral">Strategy Configuration</h4>
             <p class="subsection-description-ephemeral">Adjust parameters for the selected strategy.</p>
             <SettingsItem label="Max Context Tokens" description="Target token count for LLM history." label-for="advMaxContextTokens" class="settings-item-compact-ephemeral">
                <input type="number" id="advMaxContextTokens" v-model.number="advancedHistoryConfigLocal.maxContextTokens" min="500" max="32000" step="100" class="input-field-sm-ephemeral">
             </SettingsItem>
            <SettingsItem
                v-if="isRelevancyStrategyActive"
                label="Relevancy Threshold"
                :description="`Min score (0.05-0.95): ${advancedHistoryConfigLocal.relevancyThreshold.toFixed(2)}`"
                label-for="advRelevancyThreshold" full-width-description class="settings-item-spaced-ephemeral">
                <input type="range" id="advRelevancyThreshold" v-model.number="advancedHistoryConfigLocal.relevancyThreshold" min="0.05" max="0.95" step="0.01" class="range-slider-ephemeral" @input="updateRangeProgress($event.target as HTMLInputElement)">
            </SettingsItem>
            <SettingsItem
                v-if="advancedHistoryConfigLocal.strategyPreset !== HistoryStrategyPreset.SIMPLE_RECENCY"
                label="Recent Messages to Prioritize"
                description="Number of recent messages to always try to include."
                label-for="advNumRecent" class="settings-item-compact-ephemeral">
                <input type="number" id="advNumRecent" v-model.number="advancedHistoryConfigLocal.numRecentMessagesToPrioritize" min="0" max="50" step="1" class="input-field-sm-ephemeral">
            </SettingsItem>
             <SettingsItem
                v-if="isRelevancyStrategyActive"
                label="Relevant Older Messages"
                description="Max number of older, relevant messages to include."
                label-for="advNumRelevantOlder" class="settings-item-compact-ephemeral">
                <input type="number" id="advNumRelevantOlder" v-model.number="advancedHistoryConfigLocal.numRelevantOlderMessagesToInclude" min="0" max="50" step="1" class="input-field-sm-ephemeral">
            </SettingsItem>
             <SettingsItem
                v-if="advancedHistoryConfigLocal.strategyPreset === HistoryStrategyPreset.SIMPLE_RECENCY"
                label="Simple Recency Message Count"
                description="Number of recent messages for Simple Recency strategy."
                label-for="advSimpleRecencyCount" class="settings-item-compact-ephemeral">
                <input type="number" id="advSimpleRecencyCount" v-model.number="advancedHistoryConfigLocal.simpleRecencyMessageCount" min="1" max="100" step="1" class="input-field-sm-ephemeral">
            </SettingsItem>
            <div class="settings-items-grid-ephemeral settings-item-spaced-ephemeral">
                <SettingsItem label="Filter System Messages" description="Exclude past system messages from context." label-for="advFilterSystem" >
                    <label class="toggle-switch-ephemeral">
                        <input type="checkbox" id="advFilterSystem" v-model="advancedHistoryConfigLocal.filterHistoricalSystemMessages" />
                        <span class="track"><span class="knob"></span></span>
                    </label>
                </SettingsItem>
                <SettingsItem label="Chars per Token (Est.)" description="Avg chars/token for estimation." label-for="advCharsPerToken">
                    <input type="number" id="advCharsPerToken" v-model.number="advancedHistoryConfigLocal.charsPerTokenEstimate" min="1" max="10" step="0.1" class="input-field-sm-ephemeral">
                </SettingsItem>
            </div>
           </div>
           <div class="setting-subsection-ephemeral">
             <h4 class="subsection-title-ephemeral">Management</h4>
             <div class="settings-actions-group-ephemeral">
                <button @click="resetCurrentAdvancedStrategyToDefaults" class="btn btn-secondary-outline-ephemeral btn-sm">Reset Current Strategy</button>
                <button @click="resetAllAdvancedSettingsToGlobalDefaults" class="btn btn-secondary-outline-ephemeral btn-sm">Reset All Advanced</button>
             </div>
           </div>
        </SettingsSection>

        <SettingsSection title="Audio & Voice" :icon="SpeakerWaveIcon" class="settings-grid-span-2">
           <div class="settings-items-grid-ephemeral">
             <SettingsItem label="Audio Input Device" :description="`Current: ${currentAudioDeviceName}`" label-for="audioDeviceSelect">
                <select id="audioDeviceSelect" v-model="vcaSettings.selectedAudioInputDeviceId" class="select-input-ephemeral">
                  <option :value="null">Default System Microphone</option>
                  <option v-for="device in audioInputDevices" :key="device.deviceId" :value="device.deviceId">
                    {{ device.label || `Microphone ${device.deviceId.substring(0,12)}...` }}
                  </option>
                </select>
                 <button @click="triggerRefreshAudioDevices" class="btn btn-secondary-ephemeral btn-sm mt-3 w-full">
                    <ArrowPathIcon class="icon-xs mr-1.5" /> Refresh Devices
                </button>
            </SettingsItem>
            <SettingsItem label="Audio Input Mode" :description="getAudioModeDescription(vcaSettings.audioInputMode)" label-for="audioModeSelect">
              <select id="audioModeSelect" v-model="vcaSettings.audioInputMode" class="select-input-ephemeral">
                <option value="push-to-talk">Push to Talk</option>
                <option value="continuous">Continuous</option>
                <option value="voice-activation">Voice Activate</option>
              </select>
            </SettingsItem>
            <SettingsItem label="Speech Recognition (STT)" description="Whisper for accuracy, Web Speech for speed/cost." label-for="sttPreferenceSelect">
              <select id="sttPreferenceSelect" v-model="vcaSettings.sttPreference" class="select-input-ephemeral">
                <option value="whisper_api">OpenAI Whisper (High Accuracy)</option>
                <option value="browser_webspeech_api">Browser Web Speech (Fast, Free)</option>
              </select>
            </SettingsItem>
            <SettingsItem label="Auto-Play Responses (TTS)" description="Automatically speak assistant's responses aloud." label-for="autoPlayTtsToggle">
               <label class="toggle-switch-ephemeral">
                <input type="checkbox" id="autoPlayTtsToggle" v-model="vcaSettings.autoPlayTts" />
                <span class="track"><span class="knob"></span></span>
              </label>
            </SettingsItem>
           </div>
           <div v-if="vcaSettings.autoPlayTts" class="setting-subsection-ephemeral">
             <h4 class="subsection-title-ephemeral">Text-to-Speech (TTS) Details</h4>
             <div class="settings-items-grid-ephemeral">
                <SettingsItem label="TTS Provider" description="Service used for generating speech." label-for="ttsProviderSelect">
                    <select id="ttsProviderSelect" v-model="vcaSettings.ttsProvider" class="select-input-ephemeral">
                        <option value="browser_tts">Browser Built-in (Free, Varies)</option>
                        <option value="openai_tts">OpenAI TTS (High Quality, Cost)</option>
                    </select>
                </SettingsItem>
                <SettingsItem v-if="isTTSSupportedBySelectedProvider" label="TTS Voice" description="Voice selection depends on provider." label-for="ttsVoiceSelect">
                   <select id="ttsVoiceSelect" v-model="vcaSettings.selectedTtsVoiceId" class="select-input-ephemeral" :disabled="!ttsVoicesAreLoaded || currentTTSVoiceOptions.length === 0">
                     <option :value="null">Provider Default</option>
                     <optgroup v-if="ttsVoicesAreLoaded" v-for="group in groupedCurrentTTSVoices" :key="group.lang" :label="group.lang">
                       <option v-for="voice in group.voices" :key="voice.id" :value="voice.id">
                         {{ voice.name }} {{ voice.isDefault ? `(Default)` : ''}}
                       </option>
                     </optgroup>
                     <option v-if="!ttsVoicesAreLoaded" disabled>Loading voices...</option>
                     <option v-if="ttsVoicesAreLoaded && currentTTSVoiceOptions.length === 0" disabled>No voices for provider/lang</option>
                   </select>
                </SettingsItem>
             </div>
             <div class="settings-items-grid-ephemeral settings-item-spaced-ephemeral" v-if="isTTSSupportedBySelectedProvider">
                <SettingsItem label="TTS Speech Rate" :description="`Playback speed: ${vcaSettings.ttsRate.toFixed(1)}x`" label-for="ttsRateRange">
                  <input type="range" id="ttsRateRange" v-model.number="vcaSettings.ttsRate" min="0.5" max="2" step="0.1" class="range-slider-ephemeral" @input="updateRangeProgress($event.target as HTMLInputElement)">
                </SettingsItem>
                <SettingsItem v-if="vcaSettings.ttsProvider === 'browser_tts'" label="TTS Speech Pitch" :description="`Voice pitch: ${vcaSettings.ttsPitch.toFixed(1)}`" label-for="ttsPitchRange">
                  <input type="range" id="ttsPitchRange" v-model.number="vcaSettings.ttsPitch" min="0" max="2" step="0.1" class="range-slider-ephemeral" @input="updateRangeProgress($event.target as HTMLInputElement)">
                </SettingsItem>
             </div>
           </div>
           <div v-if="vcaSettings.audioInputMode === 'voice-activation'" class="setting-subsection-ephemeral">
             <h4 class="subsection-title-ephemeral">Voice Activation (VAD)</h4>
              <div class="settings-items-grid-ephemeral">
                <SettingsItem label="Detection Sensitivity" :description="`Threshold: ${Math.round(vcaSettings.vadThreshold * 100)}% (Lower is more sensitive)`" label-for="vadThresholdRange">
                  <input type="range" id="vadThresholdRange" v-model.number="vcaSettings.vadThreshold" min="0.01" max="0.5" step="0.01" class="range-slider-ephemeral" @input="updateRangeProgress($event.target as HTMLInputElement)">
                </SettingsItem>
                <SettingsItem label="Silence Timeout (VAD)" :description="`Stop after ${vcaSettings.vadSilenceTimeoutMs / 1000}s of silence`" label-for="vadSilenceTimeoutRange">
                  <input type="range" id="vadSilenceTimeoutRange" v-model.number="vcaSettings.vadSilenceTimeoutMs" min="500" max="5000" step="100" class="range-slider-ephemeral" @input="updateRangeProgress($event.target as HTMLInputElement)">
                </SettingsItem>
              </div>
           </div>
           <div v-if="vcaSettings.audioInputMode === 'continuous' && vcaSettings.sttPreference === 'browser_webspeech_api'" class="setting-subsection-ephemeral">
             <h4 class="subsection-title-ephemeral">Continuous Mode (Browser STT)</h4>
              <div class="settings-items-grid-ephemeral">
                <SettingsItem label="Auto-send on Pause" description="Send transcription after a speech pause." label-for="continuousAutoSendToggle">
                    <label class="toggle-switch-ephemeral">
                        <input type="checkbox" id="continuousAutoSendToggle" v-model="vcaSettings.continuousModeAutoSend" />
                        <span class="track"><span class="knob"></span></span>
                    </label>
                </SettingsItem>
                <SettingsItem v-if="vcaSettings.continuousModeAutoSend" label="Pause Timeout" :description="`Wait ${vcaSettings.continuousModePauseTimeoutMs / 1000}s before sending`" label-for="continuousPauseTimeoutRange">
                  <input type="range" id="continuousPauseTimeoutRange" v-model.number="vcaSettings.continuousModePauseTimeoutMs" min="1000" max="10000" step="250" class="range-slider-ephemeral" @input="updateRangeProgress($event.target as HTMLInputElement)">
                </SettingsItem>
              </div>
           </div>
           <div class="setting-subsection-ephemeral">
             <h4 class="subsection-title-ephemeral">Microphone Test</h4>
             <div class="mic-test-controls-ephemeral">
                <button @click="testMicrophone" :disabled="isTestingMic" class="btn btn-secondary-ephemeral btn-sm">
                    <span v-if="isTestingMic" class="flex items-center"><SpinnerIcon class="mr-2" /> Testing... (5s)</span>
                    <span v-else>Test Microphone</span>
                </button>
                <div v-if="micTestResult" class="mic-test-result-ephemeral" :class="micTestResultClass">{{ micTestResultMessage }}</div>
             </div>
             <div v-if="isTestingMic && micAudioLevels.length > 0" class="mic-audio-level-viz-ephemeral">
                <div v-for="(level, index) in micAudioLevels.slice(-60)" :key="index"
                     class="level-bar-ephemeral"
                     :style="{ height: `${Math.max(1, level * 100)}%` }">
                </div>
             </div>
             <p v-if="isTestingMic" class="setting-description text-center text-xs mt-1">Speak to see audio levels. Test runs for 5 seconds.</p>
           </div>
        </SettingsSection>

        <SettingsSection title="Session & Costs" :icon="CreditCardIcon" class="settings-grid-span-2">
            <div class="settings-items-grid-ephemeral">
                <div class="info-card-ephemeral">
                    <h4 class="info-card-title-ephemeral">Current Session Cost</h4>
                    <p class="info-card-value-ephemeral">${{ currentSessionCost.toFixed(4) }}</p>
                    <button @click="handleResetSessionCost" class="btn btn-secondary-outline-ephemeral btn-sm mt-2.5 w-full">Reset Cost</button>
                </div>
                <div class="info-card-ephemeral">
                    <h4 class="info-card-title-ephemeral">Session Cost Limit</h4>
                    <p class="info-card-value-ephemeral">${{ vcaSettings.costLimit.toFixed(2) }}</p>
                </div>
            </div>
            <SettingsItem label="Set Cost Limit ($)" :description="`Limit: $${vcaSettings.costLimit.toFixed(2)}`" label-for="costLimitRange" class="settings-item-spaced-ephemeral" full-width-description>
              <input type="range" id="costLimitRange" v-model.number="vcaSettings.costLimit" min="0.50" max="50" step="0.50" class="range-slider-ephemeral" @input="updateRangeProgress($event.target as HTMLInputElement)">
            </SettingsItem>
        </SettingsSection>

        <SettingsSection title="Security & Privacy" :icon="ShieldCheckIcon" class="settings-grid-span-2">
          <SettingsItem label="Remember Login" description="Persist login across browser sessions." label-for="rememberLoginToggle">
             <label class="toggle-switch-ephemeral">
              <input type="checkbox" id="rememberLoginToggle" v-model="rememberLoginLocal" />
              <span class="track"><span class="knob"></span></span>
            </label>
          </SettingsItem>
          <div class="danger-zone-ephemeral settings-item-spaced-ephemeral">
            <h4 class="subsection-title-ephemeral text-[var(--color-error-text)]">Danger Zone</h4>
            <div class="settings-actions-group-ephemeral">
                <button @click="handleLogout" class="btn btn-danger-ephemeral btn-sm">
                    <ArrowLeftOnRectangleIcon class="icon-xs mr-1.5"/> Logout
                </button>
                <button @click="handleClearConversationHistory" class="btn btn-danger-outline-ephemeral btn-sm">
                    Clear All Local Chat History
                </button>
            </div>
             <p class="setting-description text-xs mt-2">Logout clears session data. Clearing history is permanent.</p>
          </div>
        </SettingsSection>

        <SettingsSection title="Data Management" :icon="ArrowDownTrayIcon" class="settings-grid-span-2">
            <div class="settings-actions-group-ephemeral">
              <button @click="exportAllSettings" class="btn btn-secondary-ephemeral w-full">
                <ArrowUpTrayIcon class="icon-sm mr-2" /> Export Settings
              </button>
              <div class="relative w-full">
                <input ref="importSettingsInputRef" type="file" accept=".json" @change="handleImportSettingsFile" class="file-input-hidden-ephemeral" aria-label="Import settings file">
                <button @click="triggerImportFile" class="btn btn-secondary-ephemeral w-full">
                  <ArrowDownTrayIcon class="icon-sm mr-2" /> Import Settings
                </button>
              </div>
            </div>
            <p class="setting-description text-center mt-3">Export or import your application settings (JSON format).</p>
        </SettingsSection>
      </div>

      <div class="form-actions-footer-ephemeral">
        <button @click="confirmAndGoBack" class="btn btn-primary-ephemeral btn-lg">
          <CheckCircleIcon class="icon-sm mr-2" /> Done & Return
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
import { useAuth } from '@/composables/useAuth'; // Import useAuth
import { useCostStore } from '@/store/cost.store'; // Import useCostStore
import { useAgentStore } from '@/store/agent.store'; // Import useAgentStore

import SettingsSection from '@/components/settings/SettingsSection.vue';
import SettingsItem from '@/components/settings/SettingsItem.vue';

import { useUiStore } from '@/store/ui.store';
import { useChatStore } from '@/store/chat.store';

import {
  Cog8ToothIcon, PaintBrushIcon, WrenchScrewdriverIcon, SpeakerWaveIcon,
  CreditCardIcon, ShieldCheckIcon, ArrowDownTrayIcon, ArrowUpTrayIcon,
  ArrowLeftIcon, CheckCircleIcon, ArrowPathIcon, ArrowLeftOnRectangleIcon,
  AcademicCapIcon, SunIcon, MoonIcon, SparklesIcon
} from '@heroicons/vue/24/outline';

// Corrected import.meta.glob
const rawPromptModules = import.meta.glob("../../../../prompts/*.md", { query: "?raw", import: "default", eager: false });
const promptModules: Record<string, () => Promise<string>> = {};
for (const key in rawPromptModules) {
  const mod = rawPromptModules[key];
  promptModules[key] = async () => String(await mod());
}

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
const auth = useAuth(); // Initialize useAuth
const costStore = useCostStore(); // Initialize costStore
const agentStore = useAgentStore(); // Initialize agentStore
const chatStoreInstance = useChatStore(); // Initialize chatStore, renamed to avoid conflict with `chatHistoryCount`

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
const availableAgentModeOptions = computed(() => {
  return agentService
    .getAllAgents()
    .filter((agent) => {
      const isPublic = (agent as any).isPubliclyAvailable ?? (agent as any).public ?? false;
      return isPublic || ['general','diary','businessMeeting','systemDesigner','codingInterviewer', 'codingAssistant', 'tutorAgent'].includes(agent.id);
    })
    .map((agent) => ({ value: agent.id, label: agent.label }));
});

watch(() => advancedConversationManager.config.value, (managerConfig) => {
    if (JSON.stringify(advancedHistoryConfigLocal.value) !== JSON.stringify(managerConfig)) {
        advancedHistoryConfigLocal.value = { ...managerConfig };
    }
    nextTick(() => {
        document.querySelectorAll<HTMLInputElement>('input[type="range"].range-slider-ephemeral').forEach(el => updateRangeProgress(el));
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
    const messages = {
        'success': 'Microphone test active. Speak into the mic.',
        'error_permission': 'Microphone permission denied. Please check browser settings.',
        'error_notfound': 'No microphone found or selected device is unavailable.',
        'error_overconstrained': 'Microphone is busy or cannot be accessed with current settings.',
        'error_generic': 'An unknown error occurred during the microphone test.',
        '': ''
    };
    return messages[micTestResult.value];
});
const micTestResultClass = computed<string>(() => {
    const classes = {
        'success': 'text-success', // Use theme variable color classes
        'error_permission': 'text-error',
        'error_notfound': 'text-error',
        'error_overconstrained': 'text-warning',
        'error_generic': 'text-error',
        '': 'text-muted'
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
    router.push({ name: auth.isAuthenticated.value ? 'AuthenticatedHome' : 'PublicHome' });
};
const goHome = () => router.push({ name: auth.isAuthenticated.value ? 'AuthenticatedHome' : 'PublicHome' });

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
  target.style.setProperty('--range-progress-ephemeral', `${Math.max(0, Math.min(100, percentage))}%`);
};

const getAudioModeDescription = (mode: VoiceApplicationSettings['audioInputMode']): string => {
  const descriptions: Record<VoiceApplicationSettings['audioInputMode'], string> = {
    'push-to-talk': 'Click and hold the microphone button to record your voice.',
    'continuous': 'Microphone listens continuously. Best for quiet environments.',
    'voice-activation': 'Microphone activates automatically when speech is detected (VAD).',
  };
  return descriptions[mode] || 'Select an audio input mode.';
};
const triggerRefreshAudioDevices = async (): Promise<void> => { /* ... same as before ... */};
const testMicrophone = async (): Promise<void> => { /* ... same as before ... */};
const stopMicrophoneTest = (): void => { /* ... same as before ... */};
const fetchCurrentSessionCost = async (): Promise<void> => { /* ... same as before ... */};
const handleResetSessionCost = async (): Promise<void> => { /* ... same as before ... */};

const handleLogout = (): void => {
  auth.logout(true).then(() => { // Let useAuth handle API call, storage, and redirect
    // Reset Pinia stores after logout is confirmed by useAuth or immediately
    costStore.$reset();
    chatStoreInstance.$reset();
    agentStore.$reset();
    uiStore.$reset();
    toast?.add({ type: 'success', title: 'Logged Out', message: 'Session data cleared.' });
    // Navigation is handled by auth.logout if redirectToLogin is true
  });
};
const handleClearConversationHistory = async (): Promise<void> => {
  if (confirm("Are you sure you want to delete ALL your locally stored chat history for ALL agents? This action cannot be undone.")) {
    try {
      chatStoreInstance.$reset(); // Full reset of chat store for this action
      toast?.add({ type: 'success', title: 'Chat History Cleared', message: 'All local conversation messages have been deleted.' });
    } catch (error) {
      console.error("SettingsPage: Error clearing chat history:", error);
      toast?.add({ type: 'error', title: 'History Clear Failed', message: 'Could not clear chat history.' });
    }
  }
};
const exportAllSettings = (): void => { /* ... same as before ... */};
const triggerImportFile = (): void => { importSettingsInputRef.value?.click(); };
const handleImportSettingsFile = (event: Event): void => { /* ... same as before ... */};

onMounted(async () => {
  if (!auth.isAuthenticated.value) { // Check auth status using the composable
    const token = localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
        auth.checkAuthStatus(); // Re-check if token exists but state isn't updated
    }
    // If still not authenticated after re-check, redirect
    if(!auth.isAuthenticated.value && !window.location.pathname.startsWith('/public')) {
        toast?.add({ type: 'warning', title: 'Authentication Required', message: 'Please login to access settings.' });
        router.push({name: 'Login', query: { redirect: router.currentRoute.value.fullPath }});
        return;
    }
  }
  // Ensure API headers are set if authenticated
  if (auth.isAuthenticated.value && auth.currentToken.value && 
      (!mainApi.defaults.headers.common['Authorization'] || mainApi.defaults.headers.common['Authorization'] !== `Bearer ${auth.currentToken.value}`)) {
    mainApi.defaults.headers.common['Authorization'] = `Bearer ${auth.currentToken.value}`;
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
    document.querySelectorAll<HTMLInputElement>('input[type="range"].range-slider-ephemeral').forEach(el => updateRangeProgress(el));
  });
});

onBeforeUnmount(() => { // Corrected import
  stopMicrophoneTest();
});

watch(() => uiStore.currentThemeId, (newThemeId) => {
  // Theme button active states are now directly bound to uiStore.currentThemeId
}, { immediate: true });

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

watch([
    () => vcaSettings.vadThreshold, () => vcaSettings.vadSilenceTimeoutMs,
    () => vcaSettings.continuousModePauseTimeoutMs, () => vcaSettings.ttsRate,
    () => vcaSettings.ttsPitch, () => vcaSettings.costLimit, chatHistoryCount,
    () => advancedHistoryConfigLocal.value.relevancyThreshold
  ], () => {
  nextTick(() => {
    document.querySelectorAll<HTMLInputElement>('input[type="range"].range-slider-ephemeral').forEach(el => updateRangeProgress(el));
  });
}, { deep: true });

</script>