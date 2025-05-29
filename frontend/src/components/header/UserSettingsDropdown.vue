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
import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'; // Removed unused 'watch'
import { useRouter, RouterLink } from 'vue-router'; // RouterLink is used in the template
import { useAuth } from '@/composables/useAuth';
// import { useUiStore } from '@/store/ui.store'; // Removed as not directly used
import {
  voiceSettingsManager,
  type VoiceApplicationSettings
} from '@/services/voice.settings.service';
import { conversationManager } from '@/services/conversation.manager';

// Icons
import {
  UserCircleIcon,
  ChevronDownIcon,
  ClockIcon as HistoryIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon as LogoutIcon,
  Cog8ToothIcon as SettingsIcon, // Renamed for clarity as it's used for 'Settings' link
  CpuChipIcon as AdvancedMemoryIcon,
  BookOpenIcon as BasicHistoryIcon,
  DocumentTextIcon,
  CheckIcon as ActiveStateIcon // Using outline for consistency, can be solid if preferred
} from '@heroicons/vue/24/outline';

const auth = useAuth();
const router = useRouter();

/**
 * @const {VoiceApplicationSettings} vcaSettings - Reactive access to global voice/application settings.
 * This is the reactive object itself from the manager, not a Ref needing .value here.
 */
const vcaSettings: VoiceApplicationSettings = voiceSettingsManager.settings;

const emit = defineEmits<{
  (e: 'clear-chat-and-session'): void;
  (e: 'show-prior-chat-log'): void;
  (e: 'logout'): void;
}>();

const isOpen: Ref<boolean> = ref(false);
const dropdownContainerRef: Ref<HTMLElement | null> = ref(null);

const useAdvancedMemory = computed<boolean>({
  get: () => vcaSettings.useAdvancedMemory,
  set: (val: boolean) => {
    voiceSettingsManager.updateSetting('useAdvancedMemory', val);
  }
});

const basicHistoryLengthDisplay = computed<string>(() => {
  const count = conversationManager.getHistoryMessageCount();
  return `${count} messages`;
});

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
  router.push({ name: 'Settings', hash: sectionHash });
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
          <button @click="useAdvancedMemory = !useAdvancedMemory" role="menuitemcheckbox" :aria-checked="useAdvancedMemory" class="dropdown-item-ephemeral group">
            <component
              :is="useAdvancedMemory ? ActiveStateIcon : AdvancedMemoryIcon"
              class="dropdown-item-icon"
              :class="{'text-[hsl(var(--color-success-h),var(--color-success-s),var(--color-success-l))]': useAdvancedMemory}"
              aria-hidden="true" />
            <span>Advanced Chat History</span>
             <span class="ml-auto text-xs px-1.5 py-0.5 rounded-md font-medium"
                  :class="useAdvancedMemory
                    ? 'bg-[hsla(var(--color-success-h),var(--color-success-s),var(--color-success-l),0.2)] text-[hsl(var(--color-success-h),var(--color-success-s),calc(var(--color-success-l) - 5%))]'
                    : 'bg-[hsla(var(--color-bg-tertiary-h),var(--color-bg-tertiary-s),var(--color-bg-tertiary-l),0.7)] text-[hsl(var(--color-text-muted-h),var(--color-text-muted-s),var(--color-text-muted-l))]'">
                {{ useAdvancedMemory ? 'ON' : 'OFF' }}
            </span>
          </button>
          <div v-if="!useAdvancedMemory" class="dropdown-item-ephemeral !cursor-default !bg-transparent !hover:bg-transparent !active:transform-none !shadow-none !py-1.5">
            <BasicHistoryIcon class="dropdown-item-icon !opacity-60" aria-hidden="true" />
            <span class="text-xs text-[hsl(var(--color-text-muted-h),var(--color-text-muted-s),var(--color-text-muted-l))]">
              Basic History: {{ basicHistoryLengthDisplay }}
            </span>
          </div>
          <RouterLink :to="{ name: 'Settings', hash: '#memory-settings' }" @click="closeDropdown" role="menuitem" class="dropdown-item-ephemeral group">
            <SettingsIcon class="dropdown-item-icon" aria-hidden="true" />
            <span>Full Memory Settings</span>
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
// Removed empty .user-settings-dropdown-wrapper rule as it's not needed.
// The .header-control-item class on the root div provides the necessary context.
</style>