// File: frontend/src/components/header/UserSettingsDropdown.vue
/**
 * @file UserSettingsDropdown.vue
 * @description Dropdown menu for user-specific settings and actions, including session management,
 * quick access to memory/context preferences (like toggling advanced history and viewing basic history length),
 * a link to full application settings, and logout. Styled for the "Ephemeral Harmony" theme.
 *
 * @component UserSettingsDropdown
 * @props None. Interacts with various stores and services for its functionality.
 * @emits clear-chat-and-session - Signals a request to clear the current chat and session costs.
 * @emits show-prior-chat-log - Signals a request to display the prior chat log history.
 * @emits logout - Signals a request for user logout.
 *
 * @version 1.2.1 - Corrected TypeScript errors and removed unused imports.
 */
<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, inject, type Ref } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router'; // RouterLink is used in the template
import { useAuth } from '@/composables/useAuth';
// import { useUiStore } from '@/store/ui.store'; // Removed as not directly used
import {
  voiceSettingsManager,
  type VoiceApplicationSettings
} from '@/services/voice.settings.service';
import { conversationManager } from '@/services/conversation.manager';
import {
  advancedConversationManager,
  HistoryStrategyPreset,
  type AdvancedHistoryConfig,
  DEFAULT_ADVANCED_HISTORY_CONFIG,
} from '@/services/advancedConversation.manager';
import { MAX_CHAT_HISTORY_MESSAGES_CONFIGURABLE } from '@/utils/constants';
import type { ToastService } from '@/services/services';

// Icons
import {
  UserCircleIcon,
  ChevronDownIcon,
  ClockIcon as HistoryIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon as LogoutIcon,
  Cog8ToothIcon as SettingsIcon, // Renamed for clarity as it's used for 'Settings' link
  CpuChipIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline';

const auth = useAuth();
const router = useRouter();
const route = useRoute();
const toast = inject<ToastService>('toast');

/**
 * @const {VoiceApplicationSettings} vcaSettings - Reactive access to global voice/application settings.
 * This is the reactive object itself from the manager, not a Ref needing .value here.
 */
const vcaSettings: VoiceApplicationSettings = voiceSettingsManager.settings;

const MIN_CHAT_HISTORY_FOR_SLIDER = 2;
const clampHistoryCount = (value: number): number => {
  const rounded = Math.round(value);
  return Math.min(Math.max(rounded, MIN_CHAT_HISTORY_FOR_SLIDER), MAX_CHAT_HISTORY_MESSAGES_CONFIGURABLE);
};
const clampPositive = (value: number, min: number, max: number): number => {
  const rounded = Math.round(value);
  return Math.min(Math.max(rounded, min), max);
};
const clampNonNegative = (value: number, max: number): number => {
  const rounded = Math.round(value);
  return Math.min(Math.max(rounded, 0), max);
};

const fixedLanguageOptions: Array<{ value: string; label: string }> = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'ru', label: 'Russian' },
  { value: 'ar', label: 'Arabic' },
];

const responseLanguageMode = computed<'auto' | 'fixed' | 'follow-stt'>({
  get: () => vcaSettings.responseLanguageMode ?? 'auto',
  set: (value) => {
    voiceSettingsManager.updateSetting('responseLanguageMode', value);
  },
});

const fixedResponseLanguage = computed<string>({
  get: () => vcaSettings.fixedResponseLanguage ?? 'en-US',
  set: (value) => {
    voiceSettingsManager.updateSetting('fixedResponseLanguage', value);
  },
});

const preventRepetition = computed<boolean>({
  get: () => Boolean(vcaSettings.preventRepetition),
  set: (value) => {
    voiceSettingsManager.updateSetting('preventRepetition', value);
  },
});

const conversationContextOptions: Array<{
  value: NonNullable<VoiceApplicationSettings['conversationContextMode']>;
  label: string;
}> = [
  { value: 'minimal', label: 'Minimal — last 3-4 messages' },
  { value: 'smart', label: 'Smart — balanced context' },
  { value: 'full', label: 'Full — maximum context' },
];

const conversationContextMode = computed<NonNullable<VoiceApplicationSettings['conversationContextMode']>>({
  get: () => vcaSettings.conversationContextMode ?? 'smart',
  set: (value) => {
    voiceSettingsManager.updateSetting('conversationContextMode', value);
  },
});

const maxHistoryMessages = computed<number>({
  get: () => vcaSettings.maxHistoryMessages ?? 12,
  set: (value) => {
    const clamped = clampPositive(value, 6, 50);
    voiceSettingsManager.updateSetting('maxHistoryMessages', clamped);
  },
});

const maxHistoryMessagesSummary = computed<string>(() => {
  const value = maxHistoryMessages.value ?? 12;
  return `${value} messages (~${Math.max(1, Math.floor(value / 2))} exchanges)`;
});

const useAdvancedHistoryManager = ref<boolean>(vcaSettings.useAdvancedMemory);
const chatHistoryCount = ref<number>(clampHistoryCount(conversationManager.getHistoryMessageCount()));

const basicHistorySummary = computed<string>(() => {
  const value = chatHistoryCount.value;
  return `${value} messages (~${Math.max(1, Math.floor(value / 2))} exchanges)`;
});

const advancedHistoryConfigLocal = ref<AdvancedHistoryConfig>({ ...advancedConversationManager.getHistoryConfig() });

const availablePresetDisplayNames = computed<Array<{ key: HistoryStrategyPreset; name: string }>>(() => {
  return (Object.values(HistoryStrategyPreset) as HistoryStrategyPreset[]).map((preset) => {
    const prettified = preset
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase())
      .join(' ');
    return { key: preset, name: prettified };
  });
});

const isRelevancyStrategyActive = computed<boolean>(() => {
  const preset = advancedHistoryConfigLocal.value.strategyPreset;
  return (
    preset === HistoryStrategyPreset.BALANCED_HYBRID ||
    preset === HistoryStrategyPreset.RELEVANCE_FOCUSED ||
    preset === HistoryStrategyPreset.MAX_CONTEXT_HYBRID
  );
});

const isSimpleRecencyStrategy = computed<boolean>(
  () => advancedHistoryConfigLocal.value.strategyPreset === HistoryStrategyPreset.SIMPLE_RECENCY,
);

const advancedRelevancyLabel = computed<string>(() => advancedHistoryConfigLocal.value.relevancyThreshold.toFixed(2));

const sanitizeAdvancedConfig = (config: AdvancedHistoryConfig): AdvancedHistoryConfig => {
  const sanitized = { ...config };
  sanitized.maxContextTokens = clampPositive(sanitized.maxContextTokens || 1000, 500, 128000);
  sanitized.relevancyThreshold = Math.max(0.05, Math.min(sanitized.relevancyThreshold ?? 0.35, 0.95));
  sanitized.numRecentMessagesToPrioritize = clampNonNegative(
    sanitized.numRecentMessagesToPrioritize ?? 6,
    MAX_CHAT_HISTORY_MESSAGES_CONFIGURABLE,
  );
  sanitized.numRelevantOlderMessagesToInclude = clampNonNegative(
    sanitized.numRelevantOlderMessagesToInclude ?? 4,
    MAX_CHAT_HISTORY_MESSAGES_CONFIGURABLE,
  );
  sanitized.simpleRecencyMessageCount = clampHistoryCount(
    sanitized.simpleRecencyMessageCount ?? MIN_CHAT_HISTORY_FOR_SLIDER,
  );
  sanitized.charsPerTokenEstimate = Math.max(1, Math.min(sanitized.charsPerTokenEstimate ?? 4, 10));
  return sanitized;
};

const handleAdvancedPresetChange = (preset: HistoryStrategyPreset): void => {
  advancedConversationManager.setHistoryStrategyPreset(preset);
  const presetName = availablePresetDisplayNames.value.find((entry) => entry.key === preset)?.name || preset;
  toast?.add?.({
    type: 'info',
    title: 'Context Strategy Updated',
    message: `Switched to "${presetName}".`,
    duration: 2800,
  });
};

const resetCurrentAdvancedStrategyToDefaults = (): void => {
  const currentPreset = advancedHistoryConfigLocal.value.strategyPreset;
  advancedConversationManager.setHistoryStrategyPreset(currentPreset);
  const presetName =
    availablePresetDisplayNames.value.find((entry) => entry.key === currentPreset)?.name || currentPreset;
  toast?.add?.({
    type: 'success',
    title: 'Preset Reset',
    message: `Defaults restored for "${presetName}".`,
    duration: 2600,
  });
};

const resetAllAdvancedSettingsToGlobalDefaults = (): void => {
  advancedConversationManager.updateConfig({ ...DEFAULT_ADVANCED_HISTORY_CONFIG });
  toast?.add?.({
    type: 'success',
    title: 'Advanced Settings Reset',
    message: 'All advanced memory settings reset to global defaults.',
    duration: 2800,
  });
};

const onAdvancedPresetSelect = (event: Event): void => {
  const preset = (event.target as HTMLSelectElement).value as HistoryStrategyPreset;
  handleAdvancedPresetChange(preset);
};

const emit = defineEmits<{
  (e: 'clear-chat-and-session'): void;
  (e: 'show-prior-chat-log'): void;
  (e: 'logout'): void;
}>();

const isOpen: Ref<boolean> = ref(false);
const dropdownContainerRef: Ref<HTMLElement | null> = ref(null);

watch(chatHistoryCount, (newValue) => {
  const clamped = clampHistoryCount(newValue);
  if (clamped !== newValue) {
    chatHistoryCount.value = clamped;
    return;
  }
  if (!useAdvancedHistoryManager.value) {
    conversationManager.setHistoryMessageCount(clamped);
  }
});

watch(useAdvancedHistoryManager, (newVal) => {
  if (vcaSettings.useAdvancedMemory !== newVal) {
    voiceSettingsManager.updateSetting('useAdvancedMemory', newVal);
  }
  if (newVal) {
    advancedHistoryConfigLocal.value = { ...advancedConversationManager.getHistoryConfig() };
  } else {
    chatHistoryCount.value = clampHistoryCount(conversationManager.getHistoryMessageCount());
  }
});

watch(
  () => vcaSettings.useAdvancedMemory,
  (serviceValue) => {
    if (useAdvancedHistoryManager.value !== serviceValue) {
      useAdvancedHistoryManager.value = serviceValue;
    }
  },
);

watch(
  () => advancedConversationManager.config.value,
  (managerConfig) => {
    const sanitized = sanitizeAdvancedConfig(managerConfig);
    if (JSON.stringify(advancedHistoryConfigLocal.value) !== JSON.stringify(sanitized)) {
      advancedHistoryConfigLocal.value = { ...sanitized };
    }
  },
  { deep: true, immediate: true },
);

watch(
  advancedHistoryConfigLocal,
  (localConfigUpdate) => {
    const sanitized = sanitizeAdvancedConfig(localConfigUpdate);
    if (JSON.stringify(localConfigUpdate) !== JSON.stringify(sanitized)) {
      advancedHistoryConfigLocal.value = { ...sanitized };
      return;
    }
    advancedConversationManager.updateConfig(sanitized);
  },
  { deep: true },
);

const toggleDropdown = (): void => { isOpen.value = !isOpen.value; };
const closeDropdown = (): void => { isOpen.value = false; };

const handleClickOutside = (event: MouseEvent): void => {
  if (dropdownContainerRef.value && !dropdownContainerRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside, true);
});
onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside, true);
});

const handleClearSession = (): void => {
  emit('clear-chat-and-session');
  closeDropdown();
};

const handleShowHistory = (): void => {
  emit('show-prior-chat-log');
  closeDropdown();
};

const handleLogout = (): void => {
  emit('logout');
  closeDropdown();
};

const navigateToSettings = (sectionHash?: string): void => {
  const locale = route.params.locale || 'en-US';
  router.push(`/${locale}/settings${sectionHash ? sectionHash : ''}`);
  closeDropdown();
};

</script>

<template>
  <div class="relative header-control-item user-settings-dropdown-wrapper" ref="dropdownContainerRef">
    <button
      @click="toggleDropdown"
      id="user-settings-trigger-button"
      class="btn btn-ghost-ephemeral btn-icon-ephemeral user-settings-trigger-button direct-header-button"
      aria-haspopup="true"
      :aria-expanded="isOpen"
      aria-controls="user-settings-panel"
      title="User Settings & Session"
    >
      <UserCircleIcon class="icon-base icon-trigger" />
      <ChevronDownIcon class="icon-xs chevron-indicator ml-0.5 transition-transform duration-200" :class="{'rotate-180': isOpen}"/>
    </button>

    <Transition name="dropdown-float-enhanced">
      <div
        v-if="isOpen"
        id="user-settings-panel"
        class="dropdown-panel-ephemeral absolute right-0 mt-2 w-80 origin-top-right"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="user-settings-trigger-button"
      >
        <div class="dropdown-header-ephemeral">
          <h3 class="dropdown-title">

            <!-- {{ auth.isAuthenticated.value && auth.user.value?.username ? auth.user.value.username : 'User Menu' }} -->
              {{ auth.isAuthenticated ? 'Manage your settings and session' : 'Login to access user settings' }}
         
          </h3>
        </div>

        <div class="dropdown-content-ephemeral custom-scrollbar-thin">
          <div class="dropdown-section-title-ephemeral">
            <CpuChipIcon class="section-title-icon-ephemeral" aria-hidden="true" />
            Memory & Context
          </div>
          <div class="dropdown-form-group">
            <label class="dropdown-label" for="nav-response-language">Response language</label>
            <select
              id="nav-response-language"
              class="dropdown-select"
              v-model="responseLanguageMode"
            >
              <option value="auto">Auto — detect from user input</option>
              <option value="fixed">Fixed language</option>
              <option value="follow-stt">Follow STT language</option>
            </select>
          </div>

          <div v-if="responseLanguageMode === 'fixed'" class="dropdown-form-group">
            <label class="dropdown-label" for="nav-fixed-language">Fixed response language</label>
            <select
              id="nav-fixed-language"
              class="dropdown-select"
              v-model="fixedResponseLanguage"
            >
              <option v-for="option in fixedLanguageOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <div class="dropdown-form-group dropdown-form-group--inline">
            <div class="dropdown-label-group">
              <span class="dropdown-label">Prevent repetitive responses</span>
              <span class="dropdown-hint">Reduce duplicate answers in long sessions</span>
            </div>
            <label class="toggle-switch-ephemeral">
              <input type="checkbox" v-model="preventRepetition" />
              <span class="track"><span class="knob"></span></span>
            </label>
          </div>

          <div class="dropdown-form-group">
            <label class="dropdown-label" for="nav-context-mode">Conversation context mode</label>
            <select
              id="nav-context-mode"
              class="dropdown-select"
              v-model="conversationContextMode"
            >
              <option v-for="option in conversationContextOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <div class="dropdown-form-group">
            <label class="dropdown-label" for="nav-max-history">Maximum history messages</label>
            <input
              id="nav-max-history"
              type="range"
              min="6"
              max="50"
              step="2"
              class="dropdown-range"
              v-model.number="maxHistoryMessages"
            />
            <span class="dropdown-hint">{{ maxHistoryMessagesSummary }}</span>
          </div>

          <div class="dropdown-form-group dropdown-form-group--inline">
            <div class="dropdown-label-group">
              <span class="dropdown-label">Advanced chat history</span>
              <span class="dropdown-hint">Summaries, relevancy scoring, strategy presets</span>
            </div>
            <label class="toggle-switch-ephemeral">
              <input type="checkbox" v-model="useAdvancedHistoryManager" />
              <span class="track"><span class="knob"></span></span>
            </label>
          </div>

          <div v-if="!useAdvancedHistoryManager" class="dropdown-subsection">
            <label class="dropdown-label" for="nav-basic-history">Basic history length</label>
            <input
              id="nav-basic-history"
              type="range"
              :min="MIN_CHAT_HISTORY_FOR_SLIDER"
              :max="MAX_CHAT_HISTORY_MESSAGES_CONFIGURABLE"
              step="2"
              class="dropdown-range"
              v-model.number="chatHistoryCount"
            />
            <span class="dropdown-hint">{{ basicHistorySummary }}</span>
          </div>

          <div v-else class="dropdown-subsection">
            <label class="dropdown-label" for="nav-advanced-preset">Context strategy preset</label>
            <select
              id="nav-advanced-preset"
              class="dropdown-select"
              v-model="advancedHistoryConfigLocal.strategyPreset"
              @change="onAdvancedPresetSelect"
            >
              <option
                v-for="preset in availablePresetDisplayNames"
                :key="preset.key"
                :value="preset.key"
              >
                {{ preset.name }}
              </option>
            </select>

            <div class="dropdown-form-grid">
              <div class="dropdown-form-group">
                <label class="dropdown-label" for="nav-advanced-max-context">Max context tokens</label>
                <input
                  id="nav-advanced-max-context"
                  type="number"
                  min="500"
                  max="128000"
                  step="100"
                  class="dropdown-input"
                  v-model.number="advancedHistoryConfigLocal.maxContextTokens"
                />
              </div>
              <div class="dropdown-form-group">
                <label class="dropdown-label" for="nav-advanced-recent">Recent messages priority</label>
                <input
                  id="nav-advanced-recent"
                  type="number"
                  min="0"
                  :max="MAX_CHAT_HISTORY_MESSAGES_CONFIGURABLE"
                  class="dropdown-input"
                  v-model.number="advancedHistoryConfigLocal.numRecentMessagesToPrioritize"
                />
              </div>
              <div
                class="dropdown-form-group"
                v-if="isRelevancyStrategyActive"
              >
                <label class="dropdown-label" for="nav-advanced-older">Relevant older messages</label>
                <input
                  id="nav-advanced-older"
                  type="number"
                  min="0"
                  :max="MAX_CHAT_HISTORY_MESSAGES_CONFIGURABLE"
                  class="dropdown-input"
                  v-model.number="advancedHistoryConfigLocal.numRelevantOlderMessagesToInclude"
                />
              </div>
            </div>

            <div
              class="dropdown-form-group"
              v-if="isRelevancyStrategyActive"
            >
              <label class="dropdown-label" for="nav-advanced-relevancy">
                Relevancy threshold: {{ advancedRelevancyLabel }}
              </label>
              <input
                id="nav-advanced-relevancy"
                type="range"
                min="0.05"
                max="0.95"
                step="0.01"
                class="dropdown-range"
                v-model.number="advancedHistoryConfigLocal.relevancyThreshold"
              />
            </div>

            <div
              class="dropdown-form-group"
              v-if="isSimpleRecencyStrategy"
            >
              <label class="dropdown-label" for="nav-simple-recency">Simple recency message count</label>
              <input
                id="nav-simple-recency"
                type="number"
                min="1"
                :max="MAX_CHAT_HISTORY_MESSAGES_CONFIGURABLE"
                class="dropdown-input"
                v-model.number="advancedHistoryConfigLocal.simpleRecencyMessageCount"
              />
            </div>

            <div class="dropdown-form-group dropdown-form-group--inline">
              <div class="dropdown-label-group">
                <span class="dropdown-label">Filter system messages</span>
                <span class="dropdown-hint">Skip older system prompts where possible</span>
              </div>
              <label class="toggle-switch-ephemeral">
                <input type="checkbox" v-model="advancedHistoryConfigLocal.filterHistoricalSystemMessages" />
                <span class="track"><span class="knob"></span></span>
              </label>
            </div>

            <div class="dropdown-form-group">
              <label class="dropdown-label" for="nav-chars-per-token">Characters per token estimate</label>
              <input
                id="nav-chars-per-token"
                type="number"
                min="1"
                max="10"
                step="0.1"
                class="dropdown-input"
                v-model.number="advancedHistoryConfigLocal.charsPerTokenEstimate"
              />
            </div>

            <div class="dropdown-actions">
              <button type="button" class="dropdown-action-button" @click="resetCurrentAdvancedStrategyToDefaults">
                Reset preset
              </button>
              <button type="button" class="dropdown-action-button" @click="resetAllAdvancedSettingsToGlobalDefaults">
                Reset all
              </button>
            </div>
          </div>

          <RouterLink
            :to="`/${$route.params.locale || 'en-US'}/settings#memory-settings`"
            @click="closeDropdown"
            role="menuitem"
            class="dropdown-link-ephemeral"
          >
            <SettingsIcon class="dropdown-link-icon" aria-hidden="true" />
            <span>Open full memory settings</span>
          </RouterLink>

          <div class="dropdown-divider-ephemeral"></div>

          <div class="dropdown-section-title-ephemeral">
             <HistoryIcon class="section-title-icon-ephemeral" aria-hidden="true" />
            Session Management
          </div>
          <button @click="handleShowHistory" role="menuitem" class="dropdown-item-ephemeral group">
            <DocumentTextIcon class="dropdown-item-icon" aria-hidden="true" />
            <span>View Full Chat History</span>
          </button>
          <button @click="handleClearSession" role="menuitem" class="dropdown-item-ephemeral group">
            <TrashIcon class="dropdown-item-icon" aria-hidden="true" />
            <span>Clear Current Session</span>
          </button>

          <div class="dropdown-divider-ephemeral"></div>

          <button @click="handleLogout" role="menuitem" class="dropdown-item-ephemeral group logout-item-ephemeral">
            <LogoutIcon class="dropdown-item-icon" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/abstracts/variables' as var;

.header-control-item {
  position: relative;
}

.user-settings-trigger-button {
  display: inline-flex;
  align-items: center;
  gap: calc(var.$spacing-xs * 0.35);

  .icon-trigger { /* Size from .icon-base in _header.scss */ }
  .chevron-indicator {
    width: 0.85rem; height: 0.85rem;
    opacity: 0.7;
  }
  &:hover .chevron-indicator,
  &[aria-expanded="true"] .chevron-indicator {
    opacity: 0.95;
  }
}

.logout-item-ephemeral {
  color: hsl(var(--color-warning-h), var(--color-warning-s), calc(var(--color-warning-l) + 10%)) !important;
  .dropdown-item-icon {
    color: hsl(var(--color-warning-h), var(--color-warning-s), calc(var(--color-warning-l) + 10%)) !important;
  }

  &:hover, &:focus-visible {
    color: hsl(var(--color-error-h), var(--color-error-s), calc(var(--color-error-l) + 5%)) !important;
    background-color: hsla(var(--color-error-h), var(--color-error-s), var(--color-error-l), 0.15) !important;
    .dropdown-item-icon {
      color: hsl(var(--color-error-h), var(--color-error-s), calc(var(--color-error-l) + 5%)) !important;
    }
  }
}

.dropdown-item-ephemeral.\!cursor-default {
    &:hover, &:active, &:focus-visible {
        background-color: transparent !important;
        transform: none !important;
        box-shadow: none !important;
    }
    .dropdown-item-icon {
        color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
        transform: none !important;
    }
}

.dropdown-item-ephemeral .ml-auto {
    font-weight: 500;
}

.section-title-icon-ephemeral {
  width: 1em;
  height: 1em;
  opacity: 0.75;
}

.dropdown-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 0.85rem;
}

.dropdown-form-group--inline {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.dropdown-label-group {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.dropdown-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: hsl(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l));
}

.dropdown-hint {
  font-size: 0.65rem;
  color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
}

.dropdown-select,
.dropdown-input {
  width: 100%;
  border-radius: var.$radius-md;
  background-color: hsla(var(--color-bg-secondary-h), var(--color-bg-secondary-s), var(--color-bg-secondary-l), 0.6);
  border: 1px solid hsla(var(--color-border-glass-h), var(--color-border-glass-s), var(--color-border-glass-l), 0.35);
  color: hsl(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l));
  font-size: 0.75rem;
  padding: 0.35rem 0.6rem;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.dropdown-select:focus,
.dropdown-input:focus {
  outline: none;
  border-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.6);
  background-color: hsla(var(--color-bg-secondary-h), var(--color-bg-secondary-s), var(--color-bg-secondary-l), 0.8);
}

.dropdown-range {
  width: 100%;
}

.dropdown-subsection {
  padding: 0.75rem;
  border-radius: var.$radius-md;
  background-color: hsla(var(--color-bg-secondary-h), var(--color-bg-secondary-s), var(--color-bg-secondary-l), 0.45);
  border: 1px solid hsla(var(--color-border-glass-h), var(--color-border-glass-s), var(--color-border-glass-l), 0.25);
  margin-bottom: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.dropdown-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.6rem;
  margin-bottom: 0.4rem;
}

.dropdown-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.dropdown-action-button {
  flex: 1 1 auto;
  border: 1px solid hsla(var(--color-border-glass-h), var(--color-border-glass-s), var(--color-border-glass-l), 0.35);
  border-radius: var.$radius-md;
  padding: 0.35rem 0.65rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: hsl(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l));
  background: hsla(var(--color-bg-secondary-h), var(--color-bg-secondary-s), var(--color-bg-secondary-l), 0.5);
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.dropdown-action-button:hover {
  transform: translateY(-1px);
  border-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.4);
}

.dropdown-link-ephemeral {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.45rem 0.6rem;
  border-radius: var.$radius-md;
  color: hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l));
  transition: background-color 0.2s ease, color 0.2s ease;
}

.dropdown-link-ephemeral:hover {
  background-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.15);
}

.dropdown-link-icon {
  width: 0.85rem;
  height: 0.85rem;
}
// Removed empty .user-settings-dropdown-wrapper rule as it's not needed.
// The .header-control-item class on the root div provides the necessary context.
</style>
