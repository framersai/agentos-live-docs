// File: frontend/src/components/header/UserSettingsDropdown.vue
/**
 * @file UserSettingsDropdown.vue
 * @description Dropdown menu for user-related actions and application settings.
 * Includes theme switching, fullscreen toggle, settings link, about link, and dynamic login/logout.
 * @version 1.0.0
 */
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { themeManager } from '@/theme/ThemeManager';
import { useUiStore } from '@/store/ui.store';
import { useAuth } from '@/composables/useAuth'; // For auth state and logout action
import type { ThemeDefinition } from '@/theme/themes.config';
import {
  UserCircleIcon,
  Cog8ToothIcon,
  InformationCircleIcon,
  ArrowRightOnRectangleIcon, // Logout
  ArrowLeftOnRectangleIcon,  // Login
  SunIcon, MoonIcon, ComputerDesktopIcon, // For theme icons (though not used in current simple theme toggle)
  CheckIcon,
  ArrowsPointingInIcon, ArrowsPointingOutIcon,
  EllipsisVerticalIcon, // Fallback trigger icon if user not authenticated
  ClockIcon,
  TrashIcon,
  ChevronDownIcon, // For dropdown indicator on trigger if desired
  PaintBrushIcon // For theme section
} from '@heroicons/vue/24/outline';

/**
 * @emits clear-chat-and-session - Event emitted to request clearing chat and session data.
 * @emits show-prior-chat-log - Event emitted to request showing prior chat log.
 */
const emit = defineEmits<{
  (e: 'clear-chat-and-session'): void;
  (e: 'show-prior-chat-log'): void;
}>();

const router = useRouter();
const uiStore = useUiStore();
const auth = useAuth();

const isOpen = ref(false);
const dropdownContainerRef = ref<HTMLElement | null>(null);

const currentThemeId = themeManager.getCurrentThemeId(); // Readonly<Ref<string>>
const availableThemes = computed(() => themeManager.getAvailableThemes());
const currentThemeIsDark = computed(() => themeManager.getCurrentTheme().value?.isDark || false);


const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownContainerRef.value && !dropdownContainerRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

/**
 * @function selectTheme
 * @description Sets the application theme using ThemeManager.
 * @param {string} themeId - The ID of the theme to select.
 */
const selectTheme = (themeId: string) => {
  themeManager.setTheme(themeId);
  // Optionally close dropdown, or allow multiple theme clicks
  // closeDropdown(); 
};

/**
 * @function toggleAppFullscreen
 * @description Toggles the browser's fullscreen mode via the UI store.
 */
const toggleAppFullscreen = () => {
  uiStore.toggleBrowserFullscreen();
  closeDropdown();
};

/**
 * @function handleNavigation
 * @description Navigates to the specified path using Vue Router and closes the dropdown.
 * @param {string} path - The route path to navigate to.
 */
const handleNavigation = (path: string) => {
  router.push(path);
  closeDropdown();
};

/**
 * @function handleLogout
 * @description Logs the user out using the auth composable, clears relevant stores, and navigates to login.
 * @async
 */
const handleLogout = async () => {
  // UserSettingsDropdown emits global events which App.vue handles for store resets.
  // Here, we just need to call the auth logout and navigate.
  await auth.logout(false); // auth.logout handles token removal & API header update
  
  // Emitting events for App.vue to handle specific store resets might be cleaner
  // than UserSettingsDropdown importing multiple stores.
  // For now, assume App.vue handles resetting costStore, chatStore, agentStore upon logout event.
  
  router.push('/login');
  closeDropdown();
};

/**
 * @function getThemeIndicatorColor
 * @description Provides a representative background color for a theme item in the selector.
 * @param {ThemeDefinition} theme - The theme definition object.
 * @returns {string} A CSS HSL color string.
 */
const getThemeIndicatorColor = (theme: ThemeDefinition): string => {
  const h = theme.cssVariables['--color-accent-primary-h'] || theme.cssVariables['--color-bg-primary-h'] || '200';
  const s = theme.cssVariables['--color-accent-primary-s'] || theme.cssVariables['--color-bg-primary-s'] || '50%';
  const l = theme.cssVariables['--color-accent-primary-l'] || theme.cssVariables['--color-bg-primary-l'] || '50%';
  return `hsl(${h}, ${s}, ${l})`;
};

</script>

<template>
  <div class="relative" ref="dropdownContainerRef">
    <button
      @click="toggleDropdown"
      id="user-settings-trigger-button"
      class="user-settings-trigger-button-ephemeral"
      aria-haspopup="true"
      :aria-expanded="isOpen"
      title="User Menu & Settings"
    >
      <UserCircleIcon class="icon-trigger" v-if="auth.isAuthenticated.value" />
      <EllipsisVerticalIcon class="icon-trigger" v-else />
      <span class="sr-only">Open user and settings menu</span>
    </button>

    <transition name="dropdown-float-neomorphic">
      <div
        v-if="isOpen"
        class="user-settings-dropdown-menu-ephemeral card-neo-raised-ephemeral"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="user-settings-trigger-button"
      >
        <div v-if="auth.isAuthenticated.value" class="dropdown-user-info-ephemeral">
          <UserCircleIcon class="user-avatar-icon-ephemeral" />
          <div>
            <p class="user-name-ephemeral">Authenticated User</p> {/* Replace with actual user data if available */}
            <p class="user-status-ephemeral">Online</p>
          </div>
        </div>
        <div v-if="auth.isAuthenticated.value" class="dropdown-divider-ephemeral"></div>

        <div class="dropdown-section-ephemeral">
          <h3 class="dropdown-section-title-ephemeral">
            <PaintBrushIcon class="section-title-icon-ephemeral" /> Theme
          </h3>
          <div class="theme-selector-grid-ephemeral">
            <button
              v-for="theme in availableThemes"
              :key="theme.id"
              @click="selectTheme(theme.id)"
              class="theme-button-ephemeral"
              :class="{ 'active': currentThemeId === theme.id, 'dark-theme-preview': theme.isDark, 'light-theme-preview': !theme.isDark }"
              :title="`Switch to ${theme.name} theme`"
              role="menuitemradio"
              :aria-checked="currentThemeId === theme.id"
            >
              <span class="theme-indicator-ephemeral" :style="{ backgroundColor: getThemeIndicatorColor(theme) }"></span>
              <span class="theme-name-ephemeral">{{ theme.name }}</span>
              <CheckIcon v-if="currentThemeId === theme.id" class="checkmark-icon-ephemeral" />
            </button>
          </div>
        </div>
        
        <div class="dropdown-divider-ephemeral"></div>
        
        <div class="dropdown-action-group-ephemeral">
           <button @click="handleNavigation('/settings')" role="menuitem" class="dropdown-item-ephemeral">
            <Cog8ToothIcon class="item-icon-ephemeral" />
            <span>Settings</span>
          </button>
          <button @click="handleNavigation('/about')" role="menuitem" class="dropdown-item-ephemeral">
            <InformationCircleIcon class="item-icon-ephemeral" />
            <span>About VCA</span>
          </button>
           <button @click="toggleAppFullscreen" role="menuitem" class="dropdown-item-ephemeral">
            <component :is="uiStore.isBrowserFullscreenActive ? ArrowsPointingInIcon : ArrowsPointingOutIcon" class="item-icon-ephemeral" />
            <span>{{ uiStore.isBrowserFullscreenActive ? 'Exit Fullscreen' : 'Enter Fullscreen' }}</span>
          </button>
        </div>

        <div v-if="auth.isAuthenticated.value">
          <div class="dropdown-divider-ephemeral"></div>
          <div class="dropdown-action-group-ephemeral">
             <button @click="emit('show-prior-chat-log')" role="menuitem" class="dropdown-item-ephemeral">
                <ClockIcon class="item-icon-ephemeral" />
                <span>Chat History</span>
            </button>
            <button @click="emit('clear-chat-and-session')" role="menuitem" class="dropdown-item-ephemeral">
                <TrashIcon class="item-icon-ephemeral" />
                <span>Clear Session</span>
            </button>
          </div>
        </div>

        <div class="dropdown-divider-ephemeral"></div>

        <div class="dropdown-action-group-ephemeral">
          <button v-if="auth.isAuthenticated.value" @click="handleLogout" role="menuitem" class="dropdown-item-ephemeral logout-item-ephemeral">
            <ArrowRightOnRectangleIcon class="item-icon-ephemeral" />
            <span>Logout</span>
          </button>
          <button v-else @click="handleNavigation('/login')" role="menuitem" class="dropdown-item-ephemeral login-item-ephemeral">
            <ArrowLeftOnRectangleIcon class="item-icon-ephemeral" />
            <span>Login</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/abstracts/variables' as var;
@use '@/styles/abstracts/mixins' as mixins;
@use '@/styles/components/buttons'; // For potentially extending/using button mixins

.user-settings-trigger-button-ephemeral {
  @include buttons.btn-icon; // Use the btn-icon mixin
  // Override or add specific styles
  color: hsl(var(--color-text-secondary-h), var(--color-text-secondary-s), var(--color-text-secondary-l));
  border-radius: var.$radius-full;
  padding: var.$spacing-xs; // Adjust padding for header context
  background-color: transparent;
  border: 1px solid transparent; // For consistent box model

  &:hover, &:focus-visible {
    background-color: hsla(var(--color-bg-tertiary-h), var(--color-bg-tertiary-s), var(--color-bg-tertiary-l), 0.7);
    color: hsl(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l));
    border-color: hsla(var(--color-border-secondary-h),var(--color-border-secondary-s),var(--color-border-secondary-l), 0.3);
    outline: none;
  }
  .icon-trigger { width: 1.5rem; height: 1.5rem; } // 24px, good size for header action
}

.user-settings-dropdown-menu-ephemeral {
  position: absolute;
  top: calc(100% + #{var.$spacing-sm});
  right: 0;
  z-index: var.$z-index-dropdown;
  width: 300px; // Good width for this type of dropdown
  min-width: 280px;
  padding: var.$spacing-sm; // Overall padding for the card
  border-radius: var.$radius-xl; // Consistent large radius
  color: hsl(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l));
  
  // Apply a neomorphic or glassmorphic style. Let's use neomorphic extrude for this.
  &.card-neo-raised-ephemeral { // More specific class name
    @include mixins.neomorphic-extrude(
      hsl(var(--color-bg-primary-h), var(--color-bg-primary-s), var(--color-bg-primary-l)),
      4px, // distance
      10px, // blur
      var(--shadow-opacity-medium), // Use medium opacity for more definition
      var.$radius-xl,
      var(--shadow-color-h),
      var(--color-shadow-s),
      var(--color-shadow-l),
      calc(var(--color-shadow-l) + var(--shadow-highlight-modifier))
    );
    // Add a subtle border to enhance the raised effect on some backgrounds
    border: 1px solid hsla(var(--color-border-primary-h), var(--color-border-primary-s), var(--color-border-primary-l), 0.1);
  }
}

.dropdown-float-neomorphic-enter-active,
.dropdown-float-neomorphic-leave-active {
  transition: opacity 0.2s var.$ease-out-quad, transform 0.25s var.$ease-elastic; // Use elastic for a bit of bounce
}
.dropdown-float-neomorphic-enter-from,
.dropdown-float-neomorphic-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

.dropdown-user-info-ephemeral {
  display: flex;
  align-items: center;
  gap: var.$spacing-md;
  padding: var.$spacing-sm var.$spacing-md;
  margin-bottom: var.$spacing-xs; // Space before divider
  border-bottom: 1px solid hsla(var(--color-border-secondary-h), var(--color-border-secondary-s), var(--color-border-secondary-l), 0.1);
  padding-bottom: var.$spacing-md;

  .user-avatar-icon-ephemeral {
    width: 2.75rem; height: 2.75rem; // 44px
    color: hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l));
    background-color: hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.1);
    padding: var.$spacing-xs;
    border-radius: var.$radius-full;
  }
  .user-name-ephemeral {
    font-weight: 600;
    font-size: var.$font-size-base;
    color: hsl(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l));
  }
  .user-status-ephemeral {
    font-size: var.$font-size-xs;
    color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
  }
}

.dropdown-divider-ephemeral {
  height: 1px;
  background-color: hsla(var(--color-border-primary-h), var(--color-border-primary-s), var(--color-border-primary-l), 0.15);
  margin: var.$spacing-sm var.$spacing-xs; // Give some horizontal margin too
}

.dropdown-section-ephemeral {
  padding: var.$spacing-xs var.$spacing-sm; // Reduced padding around section title
}

.dropdown-section-title-ephemeral {
  display: flex;
  align-items: center;
  gap: var.$spacing-xs;
  font-size: var.$font-size-xs;
  font-weight: 600;
  color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
  text-transform: uppercase;
  letter-spacing: 0.06em; // Wider spacing for section titles
  margin-bottom: var.$spacing-sm;
  padding: var.$spacing-xs 0;
  .section-title-icon-ephemeral {
    width: 1rem; height: 1rem; opacity: 0.7;
  }
}

.theme-selector-grid-ephemeral {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); // Adjust minmax for item width
  gap: var.$spacing-sm;
}

.theme-button-ephemeral {
  @include buttons.btn-subtle; // Assuming a new mixin for subtle, less prominent buttons
  // Or use existing and override:
  // @include buttons.btn-ghost;
  // background-color: hsla(var(--color-bg-secondary-h), var(--color-bg-secondary-s), var(--color-bg-secondary-l), 0.4) !important;
  // border-color: hsla(var(--color-border-secondary-h), var(--color-border-secondary-s), var(--color-border-secondary-l), 0.3) !important;
  // color: hsl(var(--color-text-secondary-h), var(--color-text-secondary-s), var(--color-text-secondary-l)) !important;

  display: flex;
  align-items: center;
  gap: var.$spacing-sm;
  padding: var.$spacing-xs var.$spacing-sm;
  border-radius: var.$radius-md;
  font-size: var.$font-size-sm;
  text-align: left;
  transition: all var.$duration-quick var.$ease-out-quad;

  &:hover {
    background-color: hsla(var(--color-bg-tertiary-h), var(--color-bg-tertiary-s), var(--color-bg-tertiary-l), 0.8) !important;
    border-color: hsla(var(--color-border-interactive-h), var(--color-border-interactive-s), var(--color-border-interactive-l), 0.5) !important;
    color: hsl(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l)) !important;
    transform: scale(1.02);
  }

  &.active {
    background-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.2) !important;
    border-color: hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l)) !important;
    color: hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l)) !important;
    font-weight: 600;
    box-shadow: inset 0 0 5px hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.1);
    .checkmark-icon-ephemeral { display: inline-block; }
  }
   // Visual cues for dark/light themes
  &.dark-theme-preview .theme-indicator-ephemeral { border: 2px solid hsl(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l), 0.5); }
  &.light-theme-preview .theme-indicator-ephemeral { border: 2px solid hsl(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l), 0.2); }


  .theme-indicator-ephemeral {
    width: 14px; height: 14px;
    border-radius: var.$radius-full;
    flex-shrink: 0;
    box-shadow: inset 0 0 2px hsla(0,0%,0%,0.2);
  }
  .theme-name-ephemeral {
    flex-grow: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .checkmark-icon-ephemeral {
    display: none; margin-left: auto;
    width: 1rem; height: 1rem;
    color: hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l));
  }
}

.dropdown-action-group-ephemeral {
  padding: var.$spacing-xs var.$spacing-sm; // Consistent padding
  display: flex;
  flex-direction: column;
  gap: var.$spacing-xs; // Small gap between items in a group
}

.dropdown-item-ephemeral {
  @include buttons.btn-subtle; // Base subtle button style
  // Override for dropdown context:
  width: 100%;
  justify-content: flex-start !important; // Align icon and text to start
  padding: var.$spacing-sm var.$spacing-md !important;
  font-size: var.$font-size-base !important;
  border-radius: var.$radius-md !important;
  gap: var.$spacing-md !important; // More gap between icon and text

  &:hover, &:focus-visible {
    background-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.1) !important;
    color: hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l)) !important;
    outline: none;
    transform: translateX(3px); // Subtle shift on hover
  }
  .item-icon-ephemeral {
    width: 1.125rem; height: 1.125rem; // 18px
    opacity: 0.7;
  }
  &:hover .item-icon-ephemeral, &:focus-visible .item-icon-ephemeral {
    opacity: 1;
  }

  &.logout-item-ephemeral {
    color: hsl(var(--color-error-h), var(--color-error-s), var(--color-error-l));
    .item-icon-ephemeral { color: hsl(var(--color-error-h), var(--color-error-s), var(--color-error-l)); }
    &:hover, &:focus-visible {
      background-color: hsla(var(--color-error-h), var(--color-error-s), var(--color-error-l), 0.1) !important;
      color: hsl(var(--color-error-h), var(--color-error-s), calc(var(--color-error-l) - 5%)) !important;
      .item-icon-ephemeral { color: hsl(var(--color-error-h), var(--color-error-s), calc(var(--color-error-l) - 5%)) !important; }
    }
  }
  &.login-item-ephemeral {
    color: hsl(var(--color-success-h), var(--color-success-s), var(--color-success-l));
    .item-icon-ephemeral { color: hsl(var(--color-success-h), var(--color-success-s), var(--color-success-l)); }
     &:hover, &:focus-visible {
      background-color: hsla(var(--color-success-h), var(--color-success-s), var(--color-success-l), 0.1) !important;
      color: hsl(var(--color-success-h), var(--color-success-s), calc(var(--color-success-l) - 5%)) !important;
      .item-icon-ephemeral { color: hsl(var(--color-success-h), var(--color-success-s), calc(var(--color-success-l) - 5%)) !important; }
    }
  }
}

</style>