// File: frontend/src/views/settings/Settings.vue
/**
 * @file Settings.vue
 * @description User-configurable settings page for the Voice Chat Assistant.
 * @version 1.3.4 - Corrected agent property access (isPublic) and removed empty style block.
 */
<script setup lang="ts">
import {
  ref, onMounted, onBeforeUnmount, watch, computed, inject, nextTick, h, type WritableComputedRef
} from 'vue';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
import { api as mainApi, costAPI } from '@/utils/api';
import { voiceSettingsManager, type VoiceApplicationSettings, type VoiceOption } from '@/services/voice.settings.service';
import { conversationManager } from '@/services/conversation.manager';
import {
  advancedConversationManager,
  HistoryStrategyPreset,
  type AdvancedHistoryConfig,
  DEFAULT_ADVANCED_HISTORY_CONFIG
} from '@/services/advancedConversation.manager';
import type { ToastService } from '@/services/services';

import { agentService, type IAgentDefinition } from '@/services/agent.service'; // IAgentDefinition is important here
import { AUTH_TOKEN_KEY, MAX_CHAT_HISTORY_MESSAGES_CONFIGURABLE } from '@/utils/constants';
import SettingsSection from '@/components/settings/SettingsSection.vue';
import SettingsItem from '@/components/settings/SettingsItem.vue';
import { useUiStore } from '@/store/ui.store';
import { useChatStore } from '@/store/chat.store';
import { themeManager } from '@/theme/ThemeManager';

import {
  Cog8ToothIcon, PaintBrushIcon, WrenchScrewdriverIcon, SpeakerWaveIcon, CreditCardIcon, ShieldCheckIcon,
  ArrowDownTrayIcon, ArrowUpTrayIcon, ArrowLeftIcon, CheckCircleIcon, ArrowPathIcon, ArrowLeftOnRectangleIcon,
  AcademicCapIcon,
} from '@heroicons/vue/24/outline';

const SpinnerIcon = {
  name: 'SpinnerIcon',
  render() {
    return h('svg', { class: "animate-spin h-4 w-4", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" }, [
      h('circle', { class: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", 'stroke-width': "4" }),
      h('path', { class: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
    ]);
  }
};

const router = useRouter();
const goHome = () => router.push('/');
const toast = inject<ToastService>('toast');
const uiStore = useUiStore();

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
  return agentService.getAllAgents()
    // Corrected: use agent.isPublic
    .filter(agent => agent.isPublic || ['diaryAgent', 'businessMeetingAgent', 'systemsDesigner', 'codingInterviewer'].includes(agent.id))
    .map(agent => ({ value: agent.id, label: agent.label }));
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
    advancedConversationManager.setHistoryStrategyPreset(currentPreset); // This re-applies defaults for the preset
    toast?.add({type: 'success', title: 'Strategy Reset', message: `Settings for '${currentPreset}' strategy reset to its defaults.`});
};

const resetAllAdvancedSettingsToGlobalDefaults = () => {
    const globalDefaultConfig = { ...DEFAULT_ADVANCED_HISTORY_CONFIG };
    advancedConversationManager.updateConfig(globalDefaultConfig);
    toast?.add({type: 'success', title: 'Advanced Settings Reset', message: 'All advanced history settings reset to global defaults.'});
};

const isDarkModeLocal: WritableComputedRef<boolean> = computed({
  get: () => uiStore.isCurrentThemeDark, // Get from uiStore which gets from ThemeManager
  set: (val) => { // Setting here should trigger ThemeManager
    const themeIdToSet = val ? 
        (themeManager.getThemeById('ephemeral-holo-dark')?.id || 'legacy-twilight-neo') : 
        (themeManager.getThemeById('aurora-light')?.id || 'legacy-warm-embrace');
    themeManager.setTheme(themeIdToSet);
  },
});

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
        'error_overconstrained': 'Microphone is busy or cannot be accessed with current settings (e.g., sample rate).',
        'error_generic': 'An unknown error occurred during the microphone test.',
        '': ''
    };
    return messages[micTestResult.value];
});

const micTestResultClass = computed<string>(() => {
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
  const descriptions: Record<VoiceApplicationSettings['audioInputMode'], string> = {
    'push-to-talk': 'Click and hold the microphone button to record your voice.',
    'continuous': 'Microphone listens continuously. Best for quiet environments.',
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
      const normalizedLevel = Math.min(1, Math.max(0, average / 128)); // Normalize to 0-1
      micAudioLevels.value.push(normalizedLevel);
      if (micAudioLevels.value.length > 60) micAudioLevels.value.shift(); // Keep last 60 samples
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
    const response = await costAPI.getSessionCost();
    currentSessionCost.value = response.data.sessionCost;
  } catch (error) {
    console.error("SettingsPage: Failed to fetch session cost:", error);
    toast?.add({type: 'error', title: 'Cost Data Error', message: 'Could not retrieve current session cost.'});
  }
};

const handleResetSessionCost = async (): Promise<void> => {
  if (!confirm("Are you sure you want to reset your current session's cost tracking?")) return;
  try {
    const response = await costAPI.resetSessionCost({ action: 'reset' });
    currentSessionCost.value = response.data.sessionCost;
    toast?.add({ type: 'success', title: 'Session Cost Reset', message: 'Session cost has been reset.' });
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
  voiceSettingsManager.resetToDefaults(); // Reset all VCA settings to their defaults
  
  const chatStoreInstance = useChatStore();
  chatStoreInstance.clearAllAgentData(); // Clears all messages and main content for all agents

  toast?.add({ type: 'success', title: 'Logged Out', message: 'You have been successfully logged out.' });
  router.push('/login');
};

const handleClearConversationHistory = async (): Promise<void> => {
  if (confirm("Are you sure you want to delete ALL your locally stored chat history for ALL agents? This action cannot be undone.")) {
    try {
      const chatStoreInstance = useChatStore();
      chatStoreInstance.clearAllAgentData(); 
      toast?.add({ type: 'success', title: 'Chat History Cleared', message: 'All local conversation messages have been deleted.' });
    } catch (error) {
      console.error("SettingsPage: Error clearing chat history:", error);
      toast?.add({ type: 'error', title: 'History Clear Failed', message: 'Could not clear chat history.' });
    }
  }
};

const exportAllSettings = (): void => {
  const settingsToExport = {
    appThemeIsDark: isDarkModeLocal.value, // Using the local computed linked to uiStore/ThemeManager
    rememberLogin: rememberLoginLocal.value,
    vcaSettings: { ...vcaSettings }, // Spread to get plain object from proxy
    useAdvancedMemory: useAdvancedHistoryManager.value,
    chatHistoryIndividualMessageCount: !useAdvancedHistoryManager.value ? conversationManager.getHistoryMessageCount() : undefined,
    advancedHistoryConfig: useAdvancedHistoryManager.value ? { ...advancedConversationManager.getHistoryConfig() } : undefined,
    vcaSettingsVersion: '1.3.4', // Update this version as settings structure evolves
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
      
      // Theme
      if (typeof imported.appThemeIsDark === 'boolean') {
        isDarkModeLocal.value = imported.appThemeIsDark; // This will trigger ThemeManager via computed setter
      }
      if (typeof imported.rememberLogin === 'boolean') rememberLoginLocal.value = imported.rememberLogin;
      
      const importedUseAdvanced = imported.useAdvancedMemory ?? imported.useAdvancedHistoryManager; // Backward compatibility
      if (typeof importedUseAdvanced === 'boolean') {
        useAdvancedHistoryManager.value = importedUseAdvanced; // This will trigger watcher to update service
      }

      const baseSettingsObject = imported.vcaSettings || imported; // Handle older exports
      const vcaSettingKeys = Object.keys(voiceSettingsManager.defaultSettings) as Array<keyof VoiceApplicationSettings>;
      
      vcaSettingKeys.forEach(key => {
        if (key === 'useAdvancedMemory') return; // Handled separately by useAdvancedHistoryManager ref
        if (key in baseSettingsObject && baseSettingsObject[key] !== undefined) {
          voiceSettingsManager.updateSetting(key, baseSettingsObject[key]);
        }
      });

      if (!useAdvancedHistoryManager.value && typeof imported.chatHistoryIndividualMessageCount === 'number') {
        conversationManager.setHistoryMessageCount(imported.chatHistoryIndividualMessageCount);
        chatHistoryCount.value = conversationManager.getHistoryMessageCount(); // Update local ref for UI
      }
      if (useAdvancedHistoryManager.value && imported.advancedHistoryConfig) {
        const currentManagerDefaults = DEFAULT_ADVANCED_HISTORY_CONFIG; // Use actual defaults
        const mergedConfig = { ...currentManagerDefaults, ...imported.advancedHistoryConfig };
        advancedConversationManager.updateConfig(mergedConfig as AdvancedHistoryConfig); // This triggers watcher to update local ref
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
  if (importSettingsInputRef.value) importSettingsInputRef.value.value = ''; // Reset file input
};

onMounted(async () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) { // Stricter check: settings page requires auth
    toast?.add({ type: 'error', title: 'Authentication Required', message: 'Please login to access settings.' });
    router.push({name: 'Login', query: { redirect: router.currentRoute.value.fullPath }});
    return;
  }
  if (mainApi.defaults.headers.common['Authorization'] !== `Bearer ${token}`) {
    mainApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  useAdvancedHistoryManager.value = vcaSettings.useAdvancedMemory; // Initial sync

  await fetchCurrentSessionCost();
  if (!voiceSettingsManager.audioInputDevicesLoaded.value) {
    await voiceSettingsManager.loadAudioInputDevices();
  }
  if (!voiceSettingsManager.ttsVoicesLoaded.value && vcaSettings.autoPlayTts) {
    await voiceSettingsManager.loadAllTtsVoices();
  }
  if (!useAdvancedHistoryManager.value) {
    chatHistoryCount.value = conversationManager.getHistoryMessageCount();
  } else {
    // Ensure local advanced config is synced from manager on mount
    advancedHistoryConfigLocal.value = { ...advancedConversationManager.getHistoryConfig() };
  }

  nextTick(() => {
    document.querySelectorAll<HTMLInputElement>('input[type="range"].range-slider').forEach(el => updateRangeProgress(el));
  });
});

onBeforeUnmount(() => {
  stopMicrophoneTest();
});

watch(() => uiStore.isCurrentThemeDark, (newVal) => {
    if (isDarkModeLocal.value !== newVal) {
        isDarkModeLocal.value = newVal;
    }
});

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
    document.querySelectorAll<HTMLInputElement>('input[type="range"].range-slider').forEach(el => updateRangeProgress(el));
  });
}, { deep: true });
</script>