// File: frontend/src/components/header/SiteMenuDropdown.vue
/**
 * @file SiteMenuDropdown.vue
 * @description A dropdown menu for site-wide navigation links and auth actions,
 * styled for "Ephemeral Harmony" for a more special and prominent look.
 * @version 1.1.0 - Adopted shared dropdown styles.
 */
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router'; // useRouter not needed here if only navigating via RouterLink
import { useAuth } from '@/composables/useAuth';
import {
  InformationCircleIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  SquaresPlusIcon, // New, more "menu-like" icon
} from '@heroicons/vue/24/outline';

const auth = useAuth();
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const toggleDropdown = (): void => { isOpen.value = !isOpen.value; };
const closeDropdown = (): void => { isOpen.value = false; };

const emit = defineEmits<{ (e: 'logout'): void; }>();
const handleLogout = (): void => { closeDropdown(); emit('logout'); };

const handleClickOutside = (event: MouseEvent): void => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));
</script>

<template>
  <div class="site-menu-dropdown-container relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="site-menu-trigger-button btn btn-ghost-ephemeral btn-icon-ephemeral"
      aria-label="Open site menu"
      :aria-expanded="isOpen"
      title="Menu"
    >
      <SquaresPlusIcon class="icon-base site-menu-trigger-icon" />
    </button>

    <Transition name="dropdown-float-neomorphic">
      <div
        v-if="isOpen"
        class="dropdown-panel-ephemeral absolute right-0 mt-2 w-60 origin-top-right" 
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="site-menu-trigger-button"
      >
        <div class="dropdown-header-ephemeral">
            <h3 class="dropdown-title">Navigation</h3>
        </div>
        <div class="dropdown-content-ephemeral" role="none">
          <RouterLink
            to="/about"
            class="dropdown-item-ephemeral group"
            role="menuitem"
            @click="closeDropdown"
          >
            <InformationCircleIcon class="dropdown-item-icon" aria-hidden="true" />
            About VCA
          </RouterLink>
          <RouterLink
            to="/settings"
            class="dropdown-item-ephemeral group"
            role="menuitem"
            @click="closeDropdown"
          >
            <Cog6ToothIcon class="dropdown-item-icon" aria-hidden="true" />
            App Settings
          </RouterLink>

          <div class="dropdown-divider-ephemeral my-1.5"></div>

          <template v-if="auth.isAuthenticated.value">
            <button
              @click="handleLogout"
              class="dropdown-item-ephemeral group w-full"
              role="menuitem"
            >
              <ArrowLeftOnRectangleIcon class="dropdown-item-icon" aria-hidden="true" />
              Logout
            </button>
          </template>
          <template v-else>
            <RouterLink
              to="/login"
              class="dropdown-item-ephemeral group"
              role="menuitem"
              @click="closeDropdown"
            >
              <ArrowRightOnRectangleIcon class="dropdown-item-icon" aria-hidden="true" />
              Login / Sign Up
            </RouterLink>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/abstracts/variables' as var; // For specific overrides if needed

// The .site-menu-trigger-button will inherit from global .btn-ghost-ephemeral.btn-icon-ephemeral
// defined in _header.scss or _buttons.scss
.site-menu-trigger-icon {
  // Specific animations for this icon if desired
  transition: transform 0.25s var.$ease-out-expo;
}

.site-menu-trigger-button:hover .site-menu-trigger-icon,
.site-menu-trigger-button[aria-expanded='true'] .site-menu-trigger-icon {
  transform: scale(1.1) rotate(180deg); // Example: more engaging animation
}

// Dropdown panel and items use shared styles from _dropdowns.scss by applying classes like:
// .dropdown-panel-ephemeral
// .dropdown-header-ephemeral, .dropdown-title
// .dropdown-content-ephemeral
// .dropdown-item-ephemeral, .dropdown-item-icon
// .dropdown-divider-ephemeral

// Ensure the transition name matches one defined in animations/_transitions.scss
.dropdown-float-neomorphic-enter-active,
.dropdown-float-neomorphic-leave-active {
  transition: opacity var.$duration-quick var.$ease-out-quad, transform var.$duration-quick var.$ease-out-quad;
}
.dropdown-float-neomorphic-enter-from,
.dropdown-float-neomorphic-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.92); // Slightly more pronounced transition
}
</style>