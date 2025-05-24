<template>
  <div class="header-quick-toggles flex items-center gap-x-3 sm:gap-x-4" data-voice-target-region="quick-toggles">
    <div class="toggle-item" v-if="showDiagramToggle">
      <label
        :for="voiceTargetIdPrefix + 'diagram-toggle'"
        class="toggle-label"
        :data-voice-target="voiceTargetIdPrefix + 'diagram-toggle-label'"
      >
        {{ t('header.diagramsLabel') }}
      </label>
      <AppToggleSwitch
        :id="voiceTargetIdPrefix + 'diagram-toggle'"
        :model-value="chatSettingsStore.shouldGenerateDiagrams"
        @update:model-value="chatSettingsStore.setShouldGenerateDiagrams"
        :aria-label="t('header.toggleDiagramGeneration')"
        :data-voice-target="voiceTargetIdPrefix + 'diagram-toggle-switch'"
        size="sm"
      />
    </div>

    <div class="toggle-item">
      <label
        :for="voiceTargetIdPrefix + 'autoclear-toggle'"
        class="toggle-label"
        :data-voice-target="voiceTargetIdPrefix + 'autoclear-toggle-label'"
      >
        {{ t('header.autoClearLabel') }}
      </label>
      <AppToggleSwitch
        :id="voiceTargetIdPrefix + 'autoclear-toggle'"
        :model-value="chatSettingsStore.shouldAutoClearInput"
        @update:model-value="chatSettingsStore.setShouldAutoClearInput"
        :aria-label="t('header.toggleAutoClearInput')"
        :data-voice-target="voiceTargetIdPrefix + 'autoclear-toggle-switch'"
        size="sm"
      />
    </div>
    </div>
</template>

<script setup lang="ts">
/**
 * @file HeaderQuickToggles.vue
 * @description Provides quick toggle switches for common settings in the app header.
 * Integrates with ChatSettingsStore, is themeable, and voice-navigable.
 */
import { computed, PropType } from 'vue';
import { useI18n } from '../../composables/useI18n';
import { useChatSettingsStore, AssistantMode } from '../../features/chat/store/chatSettings.store';
import AppToggleSwitch from '../common/AppToggleSwitch.vue'; // Assuming a reusable toggle switch component

const props = defineProps({
  /** Prefix for voice target IDs. */
  voiceTargetIdPrefix: { type: String, required: true },
  /** Indicates if rendered in a mobile context (might influence layout slightly). */
  isMobile: { type: Boolean, default: false },
});

const { t } = useI18n();
const chatSettingsStore = useChatSettingsStore();

/**
 * Determines if the diagram generation toggle should be visible.
 * Typically shown for modes like System Design.
 * @returns {boolean}
 */
const showDiagramToggle = computed(() => {
  return chatSettingsStore.currentMode === AssistantMode.SYSTEM_DESIGN;
  // Or more broadly:
  // return [AssistantMode.SYSTEM_DESIGN, AssistantMode.CODING].includes(chatSettingsStore.currentMode);
});

</script>

<style scoped>
.header-quick-toggles {
  /* Base styling for the container */
}

.toggle-item {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* Space between label and switch */
}

.toggle-label {
  font-size: var(--app-font-size-sm, 0.875rem);
  color: var(--app-header-toggle-label-color, var(--app-text-secondary-color));
  font-weight: var(--app-font-weight-medium, 500);
  cursor: pointer; /* Make label also clickable for the switch */
  user-select: none;
}

/* Mobile specific layout if needed */
.header-quick-toggles.is-mobile {
  /* Example: flex-direction: column; align-items: flex-start; gap: 0.75rem; */
  /* Or, if these are rendered inside the mobile panel, they might be full-width items */
}
.header-quick-toggles.is-mobile .toggle-item {
    /* Example: width: 100%; justify-content: space-between; padding: 0.5rem 0; */
}

/* Holographic theme adjustments */
.theme-holographic .toggle-label {
  color: var(--holographic-text-secondary);
}
/* AppToggleSwitch should handle its own theming internally via CSS variables */
</style>