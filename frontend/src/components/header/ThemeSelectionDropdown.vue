// File: frontend/src/components/header/ThemeSelectionDropdown.vue
/**
 * @file ThemeSelectionDropdown.vue
 * @description A dedicated dropdown for selecting application themes.
 * @version 1.0.0
 */
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { themeManager, type ThemeDefinition } from '@/theme/ThemeManager';
import { useUiStore } from '@/store/ui.store';
import {
  PaintBrushIcon, // Trigger icon
  CheckIcon,
  SunIcon, MoonIcon // To indicate light/dark nature of theme
} from '@heroicons/vue/24/outline';

const uiStore = useUiStore();
const isOpen = ref(false);
const dropdownContainerRef = ref<HTMLElement | null>(null);

const availableThemes = computed(() => themeManager.getAvailableThemes());
const currentThemeId = computed(() => uiStore.currentThemeId);

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
  uiStore.setTheme(themeId); // uiStore calls themeManager.setTheme
  // Consider not closing dropdown to allow user to see the change immediately
  // closeDropdown();
};

const getThemeIndicatorColor = (theme: ThemeDefinition): string => {
  const h = theme.cssVariables['--color-accent-primary-h'] || theme.cssVariables['--color-bg-secondary-h'] || '210';
  const s = theme.cssVariables['--color-accent-primary-s'] || theme.cssVariables['--color-bg-secondary-s'] || '30%';
  const l = theme.cssVariables['--color-accent-primary-l'] || theme.cssVariables['--color-bg-secondary-l'] || '60%'; // Adjusted for visibility
  return `hsl(${h}, ${s}, ${l})`;
};
</script>

<template>
  <div class="relative" ref="dropdownContainerRef">
    <button
      @click="toggleDropdown"
      class="btn btn-ghost-ephemeral btn-icon-ephemeral direct-header-button"
      aria-label="Select Theme"
      :aria-expanded="isOpen"
      title="Change Theme"
    >
      <PaintBrushIcon class="icon-base" />
    </button>

    <Transition name="dropdown-float-enhanced">
      <div
        v-if="isOpen"
        class="dropdown-panel-ephemeral absolute right-0 lg:right-auto lg:left-1/2 lg:-translate-x-1/2 mt-2 w-72 origin-top-right lg:origin-top-center"
        role="menu"
        aria-orientation="vertical"
        aria-label="Theme Selection Menu"
      >
        <div class="dropdown-header-ephemeral">
          <h3 class="dropdown-title">Select Theme</h3>
        </div>
        <div class="dropdown-content-ephemeral custom-scrollbar-thin">
          <div class="theme-selector-grid-ephemeral">
            <button
              v-for="theme in availableThemes"
              :key="theme.id"
              @click="selectTheme(theme.id)"
              class="theme-button-ephemeral"
              :class="{ 'active': currentThemeId === theme.id }"
              :title="`Switch to ${theme.name} theme`"
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
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/abstracts/variables' as var;

// Trigger button uses global .direct-header-button styles (will be defined in _header.scss)

// Panel and items use shared styles from _dropdowns.scss via classes
// .dropdown-panel-ephemeral, .dropdown-header-ephemeral, etc.

// Specific styles for theme selection UI within this dropdown
.theme-selector-grid-ephemeral {
  display: grid;
  grid-template-columns: 1fr; // Stack themes for clarity
  gap: var.$spacing-xs;
  padding: var.$spacing-xs 0;
}

.theme-button-ephemeral {
  // Uses .dropdown-item-ephemeral base from _dropdowns.scss
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  position: relative; // For checkmark absolute positioning

  .theme-indicator-swatch-ephemeral {
    width: 20px; height: 20px;
    border-radius: var.$radius-sm;
    margin-right: var.$spacing-sm;
    border: 1px solid hsla(var(--color-border-primary-h),var(--color-border-primary-s),var(--color-border-primary-l), 0.4);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    .theme-type-icon {
        width: 12px; height: 12px;
        // Color will be chosen for contrast against swatch, or use a fixed light/dark color
        color: hsla(var(--color-text-on-primary-h), var(--color-text-on-primary-s), var(--color-text-on-primary-l), 0.8);
    }
  }
  .theme-name-ephemeral { flex-grow: 1; font-size: var.$font-size-sm; }
  .checkmark-icon-ephemeral {
    width: 1.1rem; height: 1.1rem;
    margin-left: auto; // Push checkmark to the right
    color: hsl(var(--color-accent-interactive-h),var(--color-accent-interactive-s),var(--color-accent-interactive-l));
    opacity: 0;
    transition: opacity var.$duration-quick;
  }

  &.active {
    font-weight: 600;
    // Active state visual comes from .dropdown-item-ephemeral.active
    .checkmark-icon-ephemeral { opacity: 1; }
    .theme-indicator-swatch-ephemeral {
        box-shadow: 0 0 0 2px hsl(var(--color-bg-primary-h),var(--color-bg-primary-s),var(--color-bg-primary-l)),
                    0 0 0 3.5px hsl(var(--color-accent-interactive-h),var(--color-accent-interactive-s),var(--color-accent-interactive-l));
    }
  }
}

.dropdown-float-enhanced-enter-active,
.dropdown-float-enhanced-leave-active {
  transition: opacity 0.2s var.$ease-out-quad, transform 0.25s var.$ease-elastic;
}
.dropdown-float-enhanced-enter-from,
.dropdown-float-enhanced-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
</style>