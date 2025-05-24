<template>
  <div class="header-language-selector relative" ref="dropdownContainerRef" v-if="chatSettingsStore.currentMode === AssistantMode.CODING">
    <AppButton
      variant="tertiary"
      size="sm"
      :aria-label="t('header.selectProgrammingLanguage')"
      :aria-expanded="isDropdownOpen"
      aria-haspopup="true"
      :data-voice-target="voiceTargetIdPrefix + 'toggle-button'"
      @click="toggleDropdown"
      class="language-selector-button"
    >
      <span class="language-icon-wrapper">
        <span class="language-icon-text">{{ currentLanguageDetails?.icon || ' L ' }}</span>
      </span>
      <span class="font-medium hidden xl:inline">{{ currentLanguageDetails?.label }}</span>
      <span class="font-medium xl:hidden">{{ currentLanguageDetails?.shortLabel || currentLanguageDetails?.label }}</span>
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
          <h3 class="header-title-sm">{{ t('header.selectLanguageTitle') }}</h3>
        </div>
        <div class="dropdown-content py-1" role="none">
          <button
            v-for="lang in availableLanguagesWithOptions"
            :key="lang.value"
            :class="['dropdown-item', { 'is-active': chatSettingsStore.currentLanguage === lang.value }]"
            role="menuitem"
            :data-voice-target="voiceTargetIdPrefix + 'lang-option-' + lang.value"
            @click="selectLanguage(lang.value)"
          >
            <span class="language-icon-wrapper is-item-icon">
              <span class="language-icon-text is-item-icon-text">{{ lang.icon }}</span>
            </span>
            <div class="flex-1 text-left">
              <div class="font-medium item-label">{{ lang.label }}</div>
              <div v-if="lang.description" class="text-xs item-description">{{ lang.description }}</div>
            </div>
            <CheckIcon v-if="chatSettingsStore.currentLanguage === lang.value" class="w-5 h-5 text-primary-color ml-auto" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
/**
 * @file HeaderLanguageSelector.vue
 * @description Dropdown component for selecting the programming language, primarily for 'coding' mode.
 * Integrates with ChatSettingsStore, is themeable, and voice-navigable.
 */
import { ref, computed, onMounted, onBeforeUnmount, PropType } from 'vue';
import { useI18n } from '../../composables/useI18n';
import { useChatSettingsStore, AssistantMode } from '../../features/chat/store/chatSettings.store';
import AppButton from '../common/AppButton.vue';
import { ChevronDownIcon, CheckIcon } from '@heroicons/vue/24/solid';

interface LanguageOption {
  value: string;
  label: string;
  shortLabel?: string;
  description?: string;
  icon: string; // Emoji or short text symbol
}

const props = defineProps({
  /** Prefix for voice target IDs. */
  voiceTargetIdPrefix: { type: String, required: true },
  /** Indicates if rendered in a mobile context. */
  isMobile: { type: Boolean, default: false },
});

const emit = defineEmits<{
  /** Emitted when a language is selected. */
  (e: 'language-selected', language: string): void;
}>();

const { t } = useI18n();
const chatSettingsStore = useChatSettingsStore();

const isDropdownOpen = ref(false);
const dropdownContainerRef = ref<HTMLElement | null>(null);

// This data could be expanded or moved to a config file/store getter
const availableLanguagesWithOptions = computed<LanguageOption[]>(() => [
  { value: 'python', label: 'Python', shortLabel: 'Py', description: t('languages.python.description'), icon: '🐍' },
  { value: 'javascript', label: 'JavaScript', shortLabel: 'JS', description: t('languages.javascript.description'), icon: '⚡' },
  { value: 'typescript', label: 'TypeScript', shortLabel: 'TS', description: t('languages.typescript.description'), icon: '🔷' },
  { value: 'java', label: 'Java', shortLabel: 'Java', description: t('languages.java.description'), icon: '☕' },
  { value: 'go', label: 'Go', shortLabel: 'Go', description: t('languages.go.description'), icon: '🔵' },
  { value: 'rust', label: 'Rust', shortLabel: 'Rust', description: t('languages.rust.description'), icon: '🦀' },
  { value: 'csharp', label: 'C#', shortLabel: 'C#', description: t('languages.csharp.description'), icon: '♯' },
  { value: 'php', label: 'PHP', shortLabel: 'PHP', description: t('languages.php.description'), icon: '🐘' },
]);

const currentLanguageDetails = computed(() =>
  availableLanguagesWithOptions.value.find(lang => lang.value === chatSettingsStore.currentLanguage)
);

const toggleDropdown = () => isDropdownOpen.value = !isDropdownOpen.value;
const closeDropdown = () => isDropdownOpen.value = false;

const selectLanguage = (language: string) => {
  chatSettingsStore.setLanguage(language);
  closeDropdown();
  emit('language-selected', language);
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownContainerRef.value && !dropdownContainerRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside, true));
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside, true));
</script>

<style scoped>
/* Styles are very similar to HeaderModeSelector, with minor adjustments for language icons */
.language-selector-button {
  min-width: var(--app-header-dropdown-button-min-width-sm, 120px);
  justify-content: space-between;
}

.language-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem; /* Tailwind w-7 */
  height: 1.75rem; /* Tailwind h-7 */
  border-radius: var(--app-border-radius-sm, 0.25rem);
  background-color: var(--app-language-icon-bg, var(--app-surface-inset-color));
  color: var(--app-language-icon-text, var(--app-text-secondary-color));
  font-size: var(--app-font-size-sm);
  font-weight: var(--app-font-weight-medium);
  margin-right: 0.5rem;
}
.language-icon-wrapper.is-item-icon {
    width: 2rem; height: 2rem;
    font-size: var(--app-font-size-base); /* Larger for dropdown items */
}
.language-icon-text {
    /* Styles for the emoji/text icon */
}

/* Re-use dropdown styles from HeaderModeSelector or a common dropdown stylesheet */
.dropdown-menu {
  position: absolute;
  right: 0;
  margin-top: 0.5rem;
  width: var(--app-header-dropdown-width-sm, 16rem); /* Tailwind w-64 */
  background-color: var(--app-dropdown-bg, var(--app-surface-color));
  border: 1px solid var(--app-dropdown-border-color, var(--app-border-color));
  border-radius: var(--app-border-radius-lg, 0.5rem);
  box-shadow: var(--app-shadow-lg);
  z-index: var(--z-index-dropdown, 50);
}
.dropdown-header { padding: 0.75rem 1rem; border-bottom: 1px solid var(--app-dropdown-divider-color); }
.header-title-sm { font-size: var(--app-font-size-base); font-weight: var(--app-font-weight-semibold); color: var(--app-dropdown-header-text-color); }
.dropdown-content { max-height: 60vh; overflow-y: auto; }
.dropdown-item { display: flex; align-items: center; width: 100%; padding: 0.75rem 1rem; text-align: left; font-size: var(--app-font-size-sm); color: var(--app-dropdown-item-text-color); cursor: pointer; gap: 0.75rem; }
.dropdown-item:hover { background-color: var(--app-dropdown-item-hover-bg); }
.dropdown-item.is-active { background-color: var(--app-dropdown-item-active-bg); color: var(--app-dropdown-item-active-text); font-weight: var(--app-font-weight-medium); }
.dropdown-item.is-active .item-label { color: var(--app-dropdown-item-active-text); }
.item-label { color: var(--app-dropdown-item-text-color); }
.item-description { color: var(--app-dropdown-item-description-text-color); }

/* Holographic theme adjustments */
.theme-holographic .language-selector-button {
    background-color: var(--holographic-button-bg-translucent);
    border-color: var(--holographic-border-translucent);
    color: var(--holographic-text-secondary);
}
.theme-holographic .language-icon-wrapper {
    background-color: var(--holographic-surface-inset-translucent);
    color: var(--holographic-text-primary);
}
/* ... other holographic styles similar to HeaderModeSelector ... */
</style>