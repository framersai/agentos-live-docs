// File: frontend/src/features/settings/views/SettingsView.vue
<template>
  <div class="settings-view-page" :data-voice-target-region="'settings-page'">
    <div class="settings-mobile-header">
      <AppButton
        variant="tertiary"
        size="sm" :pill="true"
        :icon="ArrowLeftIcon"
        :aria-label="t('common.backToHome')"
        :data-voice-target="voiceTargetIdPrefix + 'back-home-button-mobile'"
        @click="router.push({ name: 'Home' })"
      />
      <h1 class="page-title-mobile" :data-voice-target="voiceTargetIdPrefix + 'page-title-mobile'">
        {{ t('settings.title') }}
      </h1>
    </div>

    <div class="settings-view-container">
      <header class="settings-desktop-header">
        <h1 class="page-title-desktop" :data-voice-target="voiceTargetIdPrefix + 'page-title-desktop'">
          {{ t('settings.title') }}
        </h1>
        <AppButton
            variant="primary"
            size="md"
            :label="t('settings.saveAndReturnButton')"
            :icon="CheckCircleIcon"
            iconPosition="left"
            :data-voice-target="voiceTargetIdPrefix + 'save-settings-button-main'"
            @click="handleSaveAllSettings"
            :loading="isSaving"
        />
      </header>

      <div class="settings-grid">
        <div class="settings-column space-y-6">
          <AppCard :title="t('settings.appearance.title')" :voice-target-id-prefix="voiceTargetIdPrefix + 'appearance-card-'">
            <div class="setting-item">
              <span class="setting-label">{{ t('settings.appearance.theme') }}</span>
              <AppSelect
                v-model="selectedTheme"
                :options="themeOptions"
                :label="t('settings.appearance.themeLabelScreenReader')"
                class="w-full md:w-auto md:min-w-[180px]"
                :voice-target="voiceTargetIdPrefix + 'theme-select'"
                size="md"
              />
            </div>
          </AppCard>

          <AppCard :title="t('settings.general.title')" :voice-target-id-prefix="voiceTargetIdPrefix + 'general-card-'">
            <div class="space-y-4">
                <div class="setting-item">
                    <label :for="voiceTargetIdPrefix + 'default-mode-select'" class="setting-label">{{ t('settings.general.defaultMode') }}</label>
                    <AppSelect
                        :id="voiceTargetIdPrefix + 'default-mode-select'"
                        v-model="currentModeRef"
                        :options="modeOptions"
                        class="w-full"
                        :voice-target="voiceTargetIdPrefix + 'default-mode-select-input'"
                        size="md"
                    />
                </div>
                <div class="setting-item" v-if="currentModeRef === AssistantMode.CODING">
                    <label :for="voiceTargetIdPrefix + 'default-language-select'" class="setting-label">{{ t('settings.general.defaultLanguage') }}</label>
                    <AppSelect
                        :id="voiceTargetIdPrefix + 'default-language-select'"
                        v-model="currentLanguageRef"
                        :options="languageOptions"
                        class="w-full"
                        :voice-target="voiceTargetIdPrefix + 'default-language-select-input'"
                        size="md"
                    />
                </div>
                <div class="setting-item">
                    <AppToggleSwitch
                        :model-value="shouldGenerateDiagramsRef"
                        @update:model-value="chatSettingsStore.setShouldGenerateDiagrams"
                        :label="t('settings.general.generateDiagrams')"
                        :id="voiceTargetIdPrefix + 'generate-diagrams-toggle'"
                        :voice-target="voiceTargetIdPrefix + 'generate-diagrams-switch'"
                        showLabel
                    />
                    <p class="setting-description">{{ t('settings.general.generateDiagramsDesc') }}</p>
                </div>
                <div class="setting-item">
                    <AppToggleSwitch
                        :model-value="shouldAutoClearInputRef"
                        @update:model-value="chatSettingsStore.setShouldAutoClearInput"
                        :label="t('settings.general.autoClearInput')"
                        :id="voiceTargetIdPrefix + 'auto-clear-toggle'"
                        :voice-target="voiceTargetIdPrefix + 'auto-clear-switch'"
                        showLabel
                    />
                    <p class="setting-description">{{ t('settings.general.autoClearInputDesc') }}</p>
                </div>
            </div>
          </AppCard>

          <AppCard :title="t('settings.voiceAudio.title')" :voice-target-id-prefix="voiceTargetIdPrefix + 'voice-audio-card-'">
            <div class="space-y-4">
                <div class="setting-item">
                    <AppToggleSwitch
                        :model-value="voiceStore.isEnabledByUser"
                        @update:model-value="voiceStore.setUserVoicePreference"
                        :label="t('settings.voiceAudio.enableVoiceCommands')"
                        :id="voiceTargetIdPrefix + 'enable-voice-toggle'"
                        :voice-target="voiceTargetIdPrefix + 'enable-voice-switch'"
                        showLabel
                    />
                </div>
                <template v-if="voiceStore.isEnabledByUser">
                    <div class="setting-item">
                        <label :for="voiceTargetIdPrefix + 'audio-mode-select'" class="setting-label">{{ t('settings.voiceAudio.audioInputMode') }}</label>
                        <AppSelect
                            :id="voiceTargetIdPrefix + 'audio-mode-select'"
                            v-model="currentAudioModeRef"
                            :options="audioModeOptions"
                            class="w-full"
                            :voice-target="voiceTargetIdPrefix + 'audio-mode-select-input'"
                            size="md"
                        />
                        <p class="setting-description">{{ currentAudioModeDescription }}</p>
                    </div>
                     </template>
                 <p v-else class="setting-description">{{t('settings.voiceAudio.enableVoiceCommandsToSeeOptions')}}</p>
            </div>
            </AppCard>
        </div>

        <div class="settings-column space-y-6">
            <AppCard :title="t('settings.account.title')" :voice-target-id-prefix="voiceTargetIdPrefix + 'account-card-'">
                <div v-if="authStore.isAuthenticated && authStore.currentUser" class="space-y-3">
                    <p><span class="font-medium">{{t('settings.account.username')}}:</span> {{ authStore.currentUser.username }}</p>
                    <p><span class="font-medium">{{t('settings.account.email')}}:</span> {{ authStore.currentUser.email }}</p>
                    <AppButton variant="secondary" size="sm" :label="t('settings.account.editProfileButton')" :data-voice-target="voiceTargetIdPrefix + 'edit-profile-button'" @click="openEditProfileModal" />
                    <AppButton variant="danger" size="sm" :label="t('auth.logout')" @click="handleLogout" :data-voice-target="voiceTargetIdPrefix + 'logout-button'" />
                </div>
                <div v-else>
                    <p>{{t('settings.account.notLoggedIn')}}</p>
                    <AppButton variant="primary" :label="t('auth.loginButton')" @click="router.push({name: 'Login'})" :data-voice-target="voiceTargetIdPrefix + 'navigate-login-button'" />
                </div>
            </AppCard>

            <AppCard :title="t('settings.subscription.title')" :voice-target-id-prefix="voiceTargetIdPrefix + 'subscription-card-'">
                <div v-if="authStore.isAuthenticated && authStore.currentSubscription" class="space-y-2">
                    <p><span class="font-medium">{{t('settings.subscription.currentTier')}}:</span> <span class="font-semibold text-primary-color">{{ authStore.currentSubscription.name }}</span></p>
                    <p class="text-sm text-muted-color">{{ authStore.currentSubscription.description }}</p>
                    <AppButton variant="secondary" size="sm" :label="t('settings.subscription.manageButton')" :data-voice-target="voiceTargetIdPrefix + 'manage-subscription-button'" @click="manageSubscription" />
                </div>
                <div v-else-if="authStore.isAuthenticated">
                     <p>{{t('settings.subscription.noActiveSubscription')}}</p>
                     <AppButton variant="primary" :label="t('settings.subscription.viewPlansButton')" @click="viewSubscriptionPlans" :data-voice-target="voiceTargetIdPrefix + 'view-plans-button'" />
                </div>
                <p v-else>{{t('settings.subscription.loginToView')}}</p>
            </AppCard>

            <AppCard :title="t('settings.dataPrivacy.title')" :voice-target-id-prefix="voiceTargetIdPrefix + 'data-card-'">
                 <div class="space-y-4">
                    <div class="setting-item">
                        <AppToggleSwitch
                            :model-value="rememberLoginRef"
                            @update:model-value="authStore.setRememberMePreference"
                            :label="t('settings.dataPrivacy.rememberLogin')"
                            :id="voiceTargetIdPrefix + 'remember-login-toggle'"
                            :voice-target="voiceTargetIdPrefix + 'remember-login-switch'"
                            showLabel
                        />
                        <p class="setting-description">{{ t('settings.dataPrivacy.rememberLoginDesc') }}</p>
                    </div>
                     <AppButton variant="secondary" size="sm" :label="t('settings.dataPrivacy.exportSettingsButton')" :icon="DownloadIcon" :data-voice-target="voiceTargetIdPrefix + 'export-settings-button'" @click="exportAllSettings" />
                     </div>
            </AppCard>
        </div>
      </div>

       <div class="settings-fab-save">
            <AppButton
                variant="primary"
                size="lg"
                :label="t('settings.saveChangesButton')"
                :icon="CheckCircleIcon"
                iconPosition="left"
                :data-voice-target="voiceTargetIdPrefix + 'save-settings-fab'"
                @click="handleSaveAllSettings"
                :loading="isSaving"
                class="shadow-xl"
            />
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file SettingsView.vue
 * @description User settings page. Allows configuration of appearance, general preferences,
 * voice/audio settings, account management, and data privacy options.
 * Fully integrated with Pinia stores, themeable, responsive, and voice-navigable.
 */
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from '../../../composables/useI18n';
import { useUiStore } from '../../../store/ui.store';
import { useAuthStore } from '../auth/store/auth.store'; // Corrected path
import { useChatSettingsStore, AssistantMode, AudioInputMode } from '../chat/store/chatSettings.store'; // Corrected path
import { useVoiceStore } from '../../../store/voice.store';
import AppCard from '../../../components/common/AppCard.vue';
import AppInput from '../../../components/common/AppInput.vue';
import AppSelect from '../../../components/common/AppSelect.vue';
import AppButton from '../../../components/common/AppButton.vue';
import AppToggleSwitch from '../../../components/common/AppToggleSwitch.vue';
import type { SelectOption } from '../../../types';
import {
  ArrowLeftIcon, CheckCircleIcon, DownloadIcon,
  // Icons for specific settings can be imported if needed
} from '@heroicons/vue/24/solid';
import { AppTheme } from '../../../types/ui.types';

const router = useRouter();
const { t } = useI18n();
const uiStore = useUiStore();
const authStore = useAuthStore();
const chatSettingsStore = useChatSettingsStore();
const voiceStore = useVoiceStore();

const voiceTargetIdPrefix = 'settings-view-';
const isSaving = ref(false);

// --- Local reactive refs bound to store values for two-way binding with form elements ---
// These will commit to store on save, or could be watched to commit immediately.
// For a "Save" button approach, local refs are better.
const selectedTheme = ref<AppTheme>(uiStore.currentTheme);
const currentModeRef = ref<AssistantMode>(chatSettingsStore.currentMode);
const currentLanguageRef = ref<string>(chatSettingsStore.currentLanguage);
const shouldGenerateDiagramsRef = ref<boolean>(chatSettingsStore.shouldGenerateDiagrams);
const shouldAutoClearInputRef = ref<boolean>(chatSettingsStore.shouldAutoClearInput);
const currentAudioModeRef = ref<AudioInputMode>(chatSettingsStore.currentAudioMode);
const rememberLoginRef = ref<boolean>(authStore.rememberMePreference || false); // Assuming this getter/state in authStore

// --- Watchers to update local refs if store changes externally ---
watch(() => uiStore.currentTheme, (newVal) => selectedTheme.value = newVal);
watch(() => chatSettingsStore.currentMode, (newVal) => currentModeRef.value = newVal);
// ... and so on for other settings ...

// --- Options for Selects ---
const themeOptions = computed<SelectOption<AppTheme>[]>(() => [
  { value: AppTheme.LIGHT, label: t('settings.appearance.themes.light') },
  { value: AppTheme.DARK, label: t('settings.appearance.themes.dark') },
  { value: AppTheme.HOLOGRAPHIC, label: t('settings.appearance.themes.holographic') },
]);
const modeOptions = computed<SelectOption<AssistantMode>[]>(() => chatSettingsStore.availableModes.map(m => ({...m, label: t(`modes.${m.value}.label`)}))); // Translate labels
const languageOptions = computed<SelectOption<string>[]>(() => chatSettingsStore.availableLanguages.map(l => ({...l, label: t(`languages.${l.value}.label`)})));
const audioModeOptions = computed<SelectOption<AudioInputMode>[]>(() => chatSettingsStore.availableAudioModes.map(m=> ({...m, label: t(`audioModes.${m.value}.label`)})));

const currentAudioModeDescription = computed(() => {
    const mode = audioModeOptions.value.find(m => m.value === currentAudioModeRef.value);
    return mode ? t(`audioModes.${mode.value}.description`) : '';
});


/** Handles saving all settings from local refs to their respective stores. */
const handleSaveAllSettings = async () => {
  isSaving.value = true;
  uiStore.setGlobalLoading(true, t('settings.savingNotification'));

  try {
    // Commit local changes to stores
    uiStore.setTheme(selectedTheme.value);
    chatSettingsStore.setMode(currentModeRef.value);
    chatSettingsStore.setLanguage(currentLanguageRef.value);
    chatSettingsStore.setShouldGenerateDiagrams(shouldGenerateDiagramsRef.value);
    chatSettingsStore.setShouldAutoClearInput(shouldAutoClearInputRef.value);
    chatSettingsStore.setAudioMode(currentAudioModeRef.value);
    // authStore.setRememberMePreference(rememberLoginRef.value); // Assuming this action in authStore

    // Simulate API call for settings that might be backend-persisted
    await new Promise(resolve => setTimeout(resolve, 700));

    uiStore.addNotification({ type: 'success', title: t('settings.saveSuccessTitle'), message: t('settings.saveSuccessMessage') });
    router.push({ name: 'Home' }); // Navigate back home after saving
  } catch (error: any) {
    console.error('[SettingsView] Error saving settings:', error);
    uiStore.addNotification({ type: 'error', title: t('settings.saveErrorTitle'), message: error.message || t('settings.saveErrorMessage') });
  } finally {
    isSaving.value = false;
    uiStore.setGlobalLoading(false);
  }
};

const handleLogout = async () => {
  await authStore.logout();
};

const openEditProfileModal = () => {
  uiStore.openModal({
    component: () => import('../auth/components/UserProfileModal.vue'), // Assuming this modal component exists
    props: { userId: authStore.currentUser?.id },
    title: t('settings.account.editProfileModalTitle'),
    options: { persistent: true, maxWidth: '500px' }
  });
};

const manageSubscription = () => {
    // This would typically redirect to a LemonSqueezy customer portal URL or open a payment modal
    uiStore.addNotification({type: 'info', message: t('settings.subscription.manageNotImplemented')});
    // const portalUrl = authStore.currentUser?.lemonSqueezyPortalUrl;
    // if (portalUrl) window.open(portalUrl, '_blank');
};
const viewSubscriptionPlans = () => {
    // Navigate to a pricing page or open a modal with plans
    uiStore.addNotification({type: 'info', message: t('settings.subscription.viewPlansNotImplemented')});
    // router.push({name: 'PricingPlans'});
};

const exportAllSettings = () => {
    // Combine all relevant store states into a JSON object and download
    const settingsToExport = {
        theme: uiStore.currentTheme,
        chat: {
            mode: chatSettingsStore.currentMode,
            language: chatSettingsStore.currentLanguage,
            generateDiagrams: chatSettingsStore.shouldGenerateDiagrams,
            autoClear: chatSettingsStore.shouldAutoClearInput,
            audioMode: chatSettingsStore.currentAudioMode,
        },
        voice: {
            enabled: voiceStore.isEnabledByUser,
            // Add other voice settings if they are in voiceStore and exportable
        },
        // auth: { rememberMe: authStore.rememberMePreference } // Be careful about exporting sensitive auth info
        appVersion: appConfig.version,
        exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(settingsToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vca-settings-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    uiStore.addNotification({type: 'success', message: t('settings.dataPrivacy.exportSuccess')});
};


onMounted(() => {
  // Ensure local refs are initialized with store values when component mounts
  selectedTheme.value = uiStore.currentTheme;
  currentModeRef.value = chatSettingsStore.currentMode;
  currentLanguageRef.value = chatSettingsStore.currentLanguage;
  shouldGenerateDiagramsRef.value = chatSettingsStore.shouldGenerateDiagrams;
  shouldAutoClearInputRef.value = chatSettingsStore.shouldAutoClearInput;
  currentAudioModeRef.value = chatSettingsStore.currentAudioMode;
  // rememberLoginRef.value = authStore.rememberMePreference || false;

  if (!authStore.isAuthenticated) {
    // For a settings page, usually redirect if not authenticated,
    // unless some settings are available to guests.
    // For this example, we allow viewing but some sections will be disabled/hidden.
  }
});
</script>

<style scoped>
.settings-view-page {
  min-height: 100vh;
  background-color: var(--app-bg-alt-color, #f9fafb); /* Slightly off-white/gray */
  padding-bottom: 6rem; /* Space for FAB */
}
.theme-dark .settings-view-page, .theme-holographic .settings-view-page {
  background-color: var(--app-bg-alt-color, var(--app-bg-color));
}

.settings-mobile-header {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: var(--app-header-background, var(--app-surface-color-transparent));
  border-bottom: 1px solid var(--app-header-border-color, var(--app-border-color));
  position: sticky;
  top:0;
  z-index: var(--z-index-mobile-header, 500);
}
@media (min-width: 640px) { /* sm breakpoint */
  .settings-mobile-header { display: none; }
}
.page-title-mobile {
  font-size: var(--app-font-size-lg);
  font-weight: var(--app-font-weight-semibold);
  color: var(--app-heading-color);
  margin-left: 0.5rem;
}

.settings-view-container {
  max-width: var(--view-max-width, 56rem); /* Tailwind max-w-3xl or 4xl */
  margin: 0 auto;
  padding: 1rem;
}
@media (min-width: 640px) { /* sm breakpoint */
  .settings-view-container { padding: 1.5rem; }
}
@media (min-width: 1024px) { /* lg breakpoint */
  .settings-view-container { padding: 2rem; max-width: var(--view-max-width-lg, 72rem); }
}


.settings-desktop-header {
  display: none; /* Hidden by default, shown on sm+ */
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem; /* Tailwind mb-8 */
}
@media (min-width: 640px) { /* sm breakpoint */
  .settings-desktop-header { display: flex; }
}
.page-title-desktop {
  font-size: var(--app-font-size-2xl, 1.5rem); /* Tailwind text-2xl */
  font-weight: var(--app-font-weight-bold, 700);
  color: var(--app-heading-color);
}

.settings-grid {
  display: grid;
  grid-template-columns: 1fr; /* Single column by default */
  gap: 1.5rem; /* Tailwind gap-6 */
}
@media (min-width: 1024px) { /* lg breakpoint */
  .settings-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } /* Two columns on large screens */
}

.settings-column {
  /* Styling for columns if needed, but space-y handles internal spacing */
}

/* Shared style for setting items within cards */
.setting-item {
  display: flex;
  flex-wrap: wrap; /* Allow label and control to wrap on small screens */
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0; /* Vertical padding for spacing */
  gap: 0.75rem; /* Gap between label and control */
}
.setting-item:not(:last-child) {
  /* border-bottom: 1px solid var(--app-card-divider-color, var(--app-border-color-light)); */
  /* Optional divider within card sections */
}
.setting-label {
  font-size: var(--app-font-size-base);
  color: var(--app-text-color);
  font-weight: var(--app-font-weight-medium);
  flex-shrink: 0; /* Prevent label from shrinking too much */
}
.setting-item .app-select, .setting-item .app-input {
  min-width: 180px; /* Ensure controls have a decent min width */
  flex-grow: 1; /* Allow control to take available space */
  max-width: 100%; /* Prevent overflow on very small screens */
}
@media (min-width: 640px) {
    .setting-item .app-select, .setting-item .app-input {
        max-width: 280px; /* Cap width on larger screens within the item */
    }
}


.setting-description {
  font-size: var(--app-font-size-xs);
  color: var(--app-text-muted-color);
  margin-top: 0.25rem;
  flex-basis: 100%; /* Ensure description takes full width below label/control */
}

.text-primary-color { color: var(--app-primary-color); }
.text-muted-color { color: var(--app-text-muted-color); }
.text-danger-500 { color: var(--app-danger-color); } /* Ensure this variable is defined */

.settings-fab-save {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: var(--z-index-fab, 900);
}
@media (min-width: 640px) { /* Hide FAB on larger screens if save button is in header */
    /* .settings-fab-save { display: none; } */
    /* Or only show if page is scrolled */
}

/* Holographic theme specifics */
.theme-holographic .settings-view-page {
    background-image: var(--holographic-bg-gradient-deep);
}
.theme-holographic .page-title-desktop,
.theme-holographic .page-title-mobile {
    color: var(--holographic-text-primary);
    text-shadow: var(--holographic-text-glow-sm);
}
.theme-holographic .setting-label {
    color: var(--holographic-text-secondary);
}
.theme-holographic .setting-description {
    color: var(--holographic-text-muted);
}
</style>