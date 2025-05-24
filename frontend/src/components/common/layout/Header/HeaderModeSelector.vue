<template>
  <div class="header-mode-selector relative" ref="dropdownContainerRef">
    <AppButton
      variant="tertiary"
      size="sm"
      :aria-label="t('header.selectAssistantMode')"
      :aria-expanded="isDropdownOpen"
      aria-haspopup="true"
      :data-voice-target="voiceTargetIdPrefix + 'toggle-button'"
      @click="toggleDropdown"
      class="mode-selector-button"
    >
      <span class="mode-icon-wrapper" :class="currentModeDetails?.iconClass">
        <component :is="currentModeDetails?.icon" class="w-4 h-4" aria-hidden="true" />
      </span>
      <span class="font-medium hidden xl:inline">{{ currentModeDetails?.label }}</span>
      <span class="font-medium xl:hidden">{{ currentModeDetails?.shortLabel || currentModeDetails?.label }}</span>
      <ChevronDownIcon class="w-4 h-4 ml-1 transition-transform duration-200" :class="{ 'rotate-180': isDropdownOpen }" />
    </AppButton>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isDropdownOpen"
        class="dropdown-menu origin-top-right"
        role="menu"
        aria-orientation="vertical"
        :aria-labelledby="voiceTargetIdPrefix + 'toggle-button'"
      >
        <div class="dropdown-header">
          <h3 class="header-title-sm">{{ t('header.selectModeTitle') }}</h3>
          <p class="text-xs header-subtitle-sm">{{ t('header.selectModeSubtitle') }}</p>
        </div>
        <div class="dropdown-content py-1" role="none">
          <button
            v-for="mode in availableModesWithOptions"
            :key="mode.value"
            :class="['dropdown-item', { 'is-active': chatSettingsStore.currentMode === mode.value }]"
            role="menuitem"
            :data-voice-target="voiceTargetIdPrefix + 'mode-option-' + mode.value"
            @click="selectMode(mode.value)"
          >
            <span class="mode-icon-wrapper" :class="mode.iconClass">
              <component :is="mode.icon" class="w-5 h-5" aria-hidden="true" />
            </span>
            <div class="flex-1 text-left">
              <div class="font-medium item-label">{{ mode.label }}</div>
              <div v-if="mode.description" class="text-xs item-description">{{ mode.description }}</div>
            </div>
            <CheckIcon v-if="chatSettingsStore.currentMode === mode.value" class="w-5 h-5 text-primary-color ml-auto" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
/**
 * @file HeaderModeSelector.vue
 * @description Dropdown component for selecting the AI assistant's operational mode.
 * Integrates with ChatSettingsStore, is themeable, and voice-navigable.
 */
import { ref, computed, onMounted, onBeforeUnmount, PropType } from 'vue';
import { useI18n } from '../../composables/useI18n';
import { useChatSettingsStore, AssistantMode } from '../../features/chat/store/chatSettings.store';
import AppButton from '../common/AppButton.vue';
import {
  ChevronDownIcon,
  CodeBracketIcon,
  CpuChipIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
} from '@heroicons/vue/24/solid'; // Using solid for more visual weight in UI
import type { Component } from 'vue'; // For icon component type

interface ModeOption {
  value: AssistantMode;
  label: string;
  shortLabel?: string;
  description?: string;
  icon: Component;
  iconClass: string; // For themed background/color of icon wrapper
}

const props = defineProps({
  /** Prefix for voice target IDs. */
  voiceTargetIdPrefix: { type: String, required: true },
  /** Indicates if the component is rendered in a mobile context (e.g., vertical layout). */
  isMobile: { type: Boolean, default: false },
});

const emit = defineEmits<{
  /** Emitted when a mode is selected, especially useful in mobile context to close panels. */
  (e: 'mode-selected', mode: AssistantMode): void;
}>();

const { t } = useI18n();
const chatSettingsStore = useChatSettingsStore();

const isDropdownOpen = ref(false);
const dropdownContainerRef = ref<HTMLElement | null>(null);

/**
 * Maps AssistantMode enum to display properties including icons and descriptions.
 * This could be moved to a configuration file or the store itself if it grows larger.
 */
const availableModesWithOptions = computed<ModeOption[]>(() => [
  {
    value: AssistantMode.CODING,
    label: t('modes.coding.label'),
    shortLabel: t('modes.coding.shortLabel'),
    description: t('modes.coding.description'),
    icon: CodeBracketIcon,
    iconClass: 'mode-icon-coding',
  },
  {
    value: AssistantMode.SYSTEM_DESIGN,
    label: t('modes.systemDesign.label'),
    shortLabel: t('modes.systemDesign.shortLabel'),
    description: t('modes.systemDesign.description'),
    icon: CpuChipIcon,
    iconClass: 'mode-icon-system-design',
  },
  {
    value: AssistantMode.MEETING_SUMMARY,
    label: t('modes.meetingSummary.label'),
    shortLabel: t('modes.meetingSummary.shortLabel'),
    description: t('modes.meetingSummary.description'),
    icon: DocumentTextIcon,
    iconClass: 'mode-icon-meeting-summary',
  },
  {
    value: AssistantMode.GENERAL_CHAT,
    label: t('modes.generalChat.label'),
    shortLabel: t('modes.generalChat.shortLabel'),
    description: t('modes.generalChat.description'),
    icon: ChatBubbleLeftRightIcon,
    iconClass: 'mode-icon-general-chat',
  },
]);

/** Details of the currently selected mode for display. */
const currentModeDetails = computed(() =>
  availableModesWithOptions.value.find(m => m.value === chatSettingsStore.currentMode)
);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
};

const selectMode = (mode: AssistantMode) => {
  chatSettingsStore.setMode(mode);
  closeDropdown();
  emit('mode-selected', mode);
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownContainerRef.value && !dropdownContainerRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside, true);
});
</script>

<style scoped>
/* Styles for the mode selector button and dropdown menu, using CSS variables */
.header-mode-selector {
  /* Base styling for the container if needed */
}

.mode-selector-button {
  /* Re-use AppButton styles if AppButton is used, or define specific styles */
  /* For this example, assuming AppButton handles most styling */
  min-width: var(--app-header-dropdown-button-min-width, 150px); /* Ensure it's not too small */
  justify-content: space-between; /* For icon, text, chevron */
}
.mode-selector-button .mode-icon-wrapper {
    margin-right: 0.5rem; /* Space between icon and text */
}

.mode-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem; /* Tailwind w-8 */
  height: 2rem; /* Tailwind h-8 */
  border-radius: var(--app-border-radius-md, 0.375rem);
  padding: 0.25rem; /* Ensure icon is not too cramped */
}
/* Themeable icon backgrounds/colors */
.mode-icon-coding { background-color: var(--app-blue-bg-subtle); color: var(--app-blue-text-strong); }
.mode-icon-system-design { background-color: var(--app-purple-bg-subtle); color: var(--app-purple-text-strong); }
.mode-icon-meeting-summary { background-color: var(--app-green-bg-subtle); color: var(--app-green-text-strong); }
.mode-icon-general-chat { background-color: var(--app-neutral-bg-subtle); color: var(--app-neutral-text-strong); }


.dropdown-menu {
  position: absolute;
  /* right-0 for desktop, potentially centered or full-width for mobile if not in panel */
  right: 0;
  margin-top: 0.5rem; /* Space from button */
  width: var(--app-header-dropdown-width-md, 20rem); /* Tailwind w-80 */
  background-color: var(--app-dropdown-bg, var(--app-surface-color));
  border: 1px solid var(--app-dropdown-border-color, var(--app-border-color));
  border-radius: var(--app-border-radius-lg, 0.5rem);
  box-shadow: var(--app-shadow-lg);
  z-index: var(--z-index-dropdown, 50); /* Ensure it's above other header content */
}

.dropdown-header {
  padding: 0.75rem 1rem; /* Tailwind p-3 sm:p-4 */
  border-bottom: 1px solid var(--app-dropdown-divider-color, var(--app-border-color-light));
}
.header-title-sm {
  font-size: var(--app-font-size-base);
  font-weight: var(--app-font-weight-semibold);
  color: var(--app-dropdown-header-text-color, var(--app-text-color));
}
.header-subtitle-sm {
  font-size: var(--app-font-size-xs);
  color: var(--app-dropdown-subtitle-text-color, var(--app-text-secondary-color));
}

.dropdown-content {
  max-height: 60vh; /* Prevent overly long dropdowns */
  overflow-y: auto;
}

.dropdown-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem; /* Tailwind p-3 */
  text-align: left;
  font-size: var(--app-font-size-sm);
  color: var(--app-dropdown-item-text-color, var(--app-text-color));
  background-color: transparent;
  border: none;
  cursor: pointer;
  gap: 0.75rem; /* Space between icon and text block */
}
.dropdown-item:hover {
  background-color: var(--app-dropdown-item-hover-bg, var(--app-surface-hover-color));
}
.dropdown-item.is-active {
  background-color: var(--app-dropdown-item-active-bg, var(--app-primary-bg-subtle));
  color: var(--app-dropdown-item-active-text, var(--app-primary-color));
  font-weight: var(--app-font-weight-medium);
}
.dropdown-item.is-active .item-label {
    color: var(--app-dropdown-item-active-text, var(--app-primary-color));
}
.dropdown-item .item-label {
    color: var(--app-dropdown-item-text-color, var(--app-text-color));
}
.dropdown-item .item-description {
    color: var(--app-dropdown-item-description-text-color, var(--app-text-secondary-color));
}

/* Mobile specific styling if props.isMobile is true */
.header-mode-selector.is-mobile .mode-selector-button {
    /* Example: Make button full width or change padding */
    width: 100%;
    justify-content: flex-start; /* Align items to start for mobile cards */
}
.header-mode-selector.is-mobile .dropdown-menu {
    /* Example: Make dropdown full width or position differently */
    width: 100%;
    left:0; right:0;
    position: static; /* If rendered inside a mobile panel that handles positioning */
    box-shadow: none;
    border-width: 1px 0; /* Top/bottom borders only */
    border-radius: 0;
}

/* Holographic theme adjustments */
.theme-holographic .mode-selector-button {
    background-color: var(--holographic-button-bg-translucent);
    border-color: var(--holographic-border-translucent);
    color: var(--holographic-text-secondary);
}
.theme-holographic .mode-selector-button:hover {
    background-color: var(--holographic-button-hover-bg);
    border-color: var(--holographic-accent);
}
.theme-holographic .dropdown-menu {
    background-color: var(--holographic-panel-bg-deep-translucent);
    border-color: var(--holographic-border-subtle);
    box-shadow: var(--holographic-shadow-lg);
}
.theme-holographic .dropdown-header {
    border-bottom-color: var(--holographic-border-very-subtle);
}
.theme-holographic .header-title-sm { color: var(--holographic-text-primary); }
.theme-holographic .header-subtitle-sm { color: var(--holographic-text-secondary); }
.theme-holographic .dropdown-item { color: var(--holographic-text-secondary); }
.theme-holographic .dropdown-item:hover { background-color: var(--holographic-surface-hover); }
.theme-holographic .dropdown-item.is-active {
    background-color: var(--holographic-accent-bg-translucent);
    color: var(--holographic-accent-text-strong);
}
.theme-holographic .dropdown-item.is-active .item-label,
.theme-holographic .dropdown-item.is-active .item-description {
    color: var(--holographic-accent-text-strong);
}
/* Icon wrapper backgrounds for holographic */
.theme-holographic .mode-icon-coding { background-color: rgba(var(--app-blue-rgb), 0.2); color: var(--app-blue-text-holographic); }
/* Define similar for other modes */
</style>