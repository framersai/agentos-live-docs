// File: frontend/src/components/header/UserSettingsDropdown.vue
/**
 * @file UserSettingsDropdown.vue
 * @description Dropdown menu for user actions: theme, fullscreen, session controls.
 * Features a prominent theme selector.
 * @version 1.2.0 - Enhanced theme selection UI, adopted shared dropdown styles.
 */
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { themeManager, type ThemeDefinition } from '@/theme/ThemeManager';
import { useUiStore } from '@/store/ui.store';
// Removed useRouter and RouterLink as direct navigation is out
import {
  UserCircleIcon,
  PaintBrushIcon,
  ArrowsPointingOutIcon, ArrowsPointingInIcon,
  ClockIcon, TrashIcon,
  ChevronDownIcon,
  SunIcon, MoonIcon, SparklesIcon as ThemeTypeIcon, // For more generic theme type indication
  CheckIcon
} from '@heroicons/vue/24/outline';

const emit = defineEmits<{
  (e: 'clear-chat-and-session'): void;
  (e: 'show-prior-chat-log'): void;
  // toggle-theme and toggle-fullscreen are now handled by direct calls to uiStore/themeManager
  // or specific buttons for theme choice
}>();

const uiStore = useUiStore();

const isOpen = ref(false);
const dropdownContainerRef = ref<HTMLElement | null>(null);

// Use uiStore for reactive currentThemeId to ensure consistency
const currentThemeId = computed(() => uiStore.currentThemeId);
const availableThemes = computed(() => themeManager.getAvailableThemes());

const toggleDropdown = () => isOpen.value = !isOpen.value;
const closeDropdown = () => isOpen.value = false;

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownContainerRef.value && !dropdownContainerRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));

const selectTheme = (themeId: string) => {
  uiStore.setTheme(themeId); // Use uiStore to set theme, it will call themeManager
  // closeDropdown(); // Keep open to see change, or close if preferred
};

const toggleAppFullscreen = () => {
  uiStore.toggleBrowserFullscreen();
  // closeDropdown(); // Keep open or close
};

const getThemeIndicatorColor = (theme: ThemeDefinition): string => {
  const h = theme.cssVariables['--color-accent-primary-h'] || theme.cssVariables['--color-bg-secondary-h'] || '210';
  const s = theme.cssVariables['--color-accent-primary-s'] || theme.cssVariables['--color-bg-secondary-s'] || '30%';
  const l = theme.cssVariables['--color-accent-primary-l'] || theme.cssVariables['--color-bg-secondary-l'] || '70%';
  return `hsl(${h}, ${s}, ${l})`;
};

const handleClearSession = () => {
    emit('clear-chat-and-session');
    closeDropdown();
}
const handleShowHistory = () => {
    emit('show-prior-chat-log');
    closeDropdown();
}

</script>

<template>
  <div class="relative" ref="dropdownContainerRef">
    <button
      @click="toggleDropdown"
      id="user-settings-trigger-button"
      class="btn btn-ghost-ephemeral btn-icon-ephemeral user-settings-trigger-button"
      aria-haspopup="true"
      :aria-expanded="isOpen"
      title="Display & Session Settings"
    >
      <UserCircleIcon class="icon-base icon-trigger" />
      <ChevronDownIcon class="icon-xs chevron-indicator" :class="{'open': isOpen}"/>
    </button>

    <Transition name="dropdown-float-enhanced">
      <div
        v-if="isOpen"
        class="dropdown-panel-ephemeral absolute right-0 mt-2 w-80 origin-top-right" 
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="user-settings-trigger-button"
      >
        <div class="dropdown-header-ephemeral">
          <h3 class="dropdown-title">Display & Session</h3>
        </div>
        <div class="dropdown-content-ephemeral custom-scrollbar-thin">
          <div class="dropdown-section-ephemeral">
            <h4 class="dropdown-section-title-ephemeral">
              <PaintBrushIcon class="section-title-icon-ephemeral" />Application Theme
            </h4>
            <div class="theme-selector-grid-ephemeral">
              <button
                v-for="theme in availableThemes"
                :key="theme.id"
                @click="selectTheme(theme.id)"
                class="theme-button-ephemeral"
                :class="{ 'active': currentThemeId === theme.id }"
                :title="`Switch to ${theme.name} theme (${theme.isDark ? 'Dark' : 'Light'})`"
                role="menuitemradio"
                :aria-checked="currentThemeId === theme.id"
              >
                <span class="theme-indicator-swatch-ephemeral" :style="{ background: getThemeIndicatorColor(theme) }">
                    <component :is="theme.isDark ? MoonIcon : SunIcon" class="theme-type-icon" />
                </span>
                <span class="theme-name-ephemeral">{{ theme.name }}</span>
                <CheckIcon v-if="currentThemeId === theme.id" class="checkmark-icon-ephemeral" />
              </button>
            </div>
          </div>
          
          <div class="dropdown-divider-ephemeral"></div>

          <button @click="toggleAppFullscreen" role="menuitem" class="dropdown-item-ephemeral group">
            <component :is="uiStore.isBrowserFullscreenActive ? ArrowsPointingInIcon : ArrowsPointingOutIcon" class="dropdown-item-icon" />
            <span>{{ uiStore.isBrowserFullscreenActive ? 'Exit Fullscreen' : 'Enter Fullscreen' }}</span>
          </button>

          <div class="dropdown-divider-ephemeral"></div>
          
          <button @click="handleShowHistory" role="menuitem" class="dropdown-item-ephemeral group">
            <ClockIcon class="dropdown-item-icon" />
            <span>View Chat History</span>
          </button>
          <button @click="handleClearSession" role="menuitem" class="dropdown-item-ephemeral group">
            <TrashIcon class="dropdown-item-icon" />
            <span>Clear Current Session</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/abstracts/variables' as var;
@use '@/styles/components/dropdowns'; // To ensure its utility classes are available if used directly in template
                                     // And for its mixins to be available via dropdowns.mixin-name

// Trigger button inherits from global .btn-ghost-ephemeral.btn-icon-ephemeral
.user-settings-trigger-button {
  display: inline-flex;
  align-items: center;
  gap: var.$spacing-xs * 0.3; // Tighter gap for chevron
  padding: calc(var.$spacing-xs * 0.8) !important; // Slightly smaller padding

  .icon-trigger { /* size from .icon-base */ }
  .chevron-indicator {
    transition: transform 0.2s var.$ease-out-quad;
    opacity: 0.6;
    width: 0.8rem; height: 0.8rem; // Smaller chevron
    &.open { transform: rotate(180deg); }
  }
  &:hover .chevron-indicator, &[aria-expanded="true"] .chevron-indicator {
    opacity: 0.9;
  }
}

// Panel and general items use shared styles from _dropdowns.scss
// by applying .dropdown-panel-ephemeral, .dropdown-item-ephemeral etc.

.dropdown-section-title-ephemeral {
  @include dropdowns.dropdown-section-title-ephemeral; // Use mixin
  display: flex; align-items: center; gap: var.$spacing-xs;
  .section-title-icon-ephemeral { width: 1rem; height: 1rem; opacity: 0.7; }
}

.theme-selector-grid-ephemeral {
  display: grid;
  grid-template-columns: 1fr; // Stack theme buttons for clarity
  gap: var.$spacing-xs;
  padding: var.$spacing-xs 0;
}

.theme-button-ephemeral {
  @include dropdowns.dropdown-item-ephemeral; // Base item style
  // Specifics for theme buttons
  .theme-indicator-swatch-ephemeral {
    width: 20px; height: 20px;
    border-radius: var.$radius-sm; // Square swatch
    margin-right: var.$spacing-sm;
    border: 1px solid hsla(var(--color-border-primary-h),var(--color-border-primary-s),var(--color-border-primary-l), 0.4);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    .theme-type-icon {
        width: 12px; height: 12px;
        color: hsla(var(--color-text-on-primary-h), var(--color-text-on-primary-s), var(--color-text-on-primary-l), 0.7); // Icon color on swatch
    }
  }
  .theme-name-ephemeral { flex-grow: 1; font-size: var.$font-size-sm; }
  .checkmark-icon-ephemeral { width: 1.1rem; height: 1.1rem; margin-left: auto; }

  &.active {
    font-weight: 600;
    // Active state background/color is handled by .dropdown-item-ephemeral.active
    .theme-indicator-swatch-ephemeral {
        box-shadow: 0 0 0 2px hsl(var(--color-bg-primary-h),var(--color-bg-primary-s),var(--color-bg-primary-l)),
                    0 0 0 4px hsl(var(--color-accent-interactive-h),var(--color-accent-interactive-s),var(--color-accent-interactive-l)); // Ring effect
    }
  }
}

// Transition for dropdown panel
.dropdown-float-enhanced-enter-active,
.dropdown-float-enhanced-leave-active {
  transition: opacity 0.25s var.$ease-out-quint, transform 0.3s var.$ease-elastic;
}
.dropdown-float-enhanced-enter-from,
.dropdown-float-enhanced-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.92);
}
</style>