// File: frontend/src/components/header/SiteMenuDropdown.vue
/**
 * @file SiteMenuDropdown.vue
 * @description Dropdown for site navigation (About, Settings) and Auth. Uses shared "Ephemeral Harmony" styles.
 * @version 1.2.0 - Adopts fully shared dropdown styles.
 */
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import {
  InformationCircleIcon,
  Cog8ToothIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  SquaresPlusIcon, // Main trigger icon
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
  <div ref="dropdownRef"
      @click="toggleDropdown"
      class="btn btn-ghost-ephemeral btn-icon-ephemeral site-menu-trigger-button"
      :aria-expanded="isOpen"
      title="Menu"
    >
      <SquaresPlusIcon class="icon-base icon-trigger" /> 

    <Transition name="dropdown-float-enhanced">
      <div
        v-if="isOpen"
        class="dropdown-panel-ephemeral absolute right-0 mt-2 w-64 origin-top-right" 
        role="menu"
        aria-orientation="vertical"
      >
        <div class="dropdown-header-ephemeral">
            <h3 class="dropdown-title">Main Menu</h3>
        </div>
        <div class="dropdown-content-ephemeral" role="none">
          <RouterLink to="/about" class="dropdown-item-ephemeral group" role="menuitem" @click="closeDropdown">
            <InformationCircleIcon class="dropdown-item-icon" aria-hidden="true" />
            About VCA
          </RouterLink>
          <RouterLink to="/settings" class="dropdown-item-ephemeral group" role="menuitem" @click="closeDropdown">
            <Cog8ToothIcon class="dropdown-item-icon" aria-hidden="true" />
            App Settings
          </RouterLink>

          <div class="dropdown-divider-ephemeral my-1.5"></div>

          <template v-if="auth.isAuthenticated.value">
            <button @click="handleLogout" class="dropdown-item-ephemeral group w-full logout-item-ephemeral" role="menuitem">
              <ArrowLeftOnRectangleIcon class="dropdown-item-icon" aria-hidden="true" />
              Logout
            </button>
          </template>
          <template v-else>
            <RouterLink to="/login" class="dropdown-item-ephemeral group login-item-ephemeral" role="menuitem" @click="closeDropdown">
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
@use '@/styles/abstracts/variables' as var;

// Trigger button will primarily use styles from _header.scss's
// .header-control-item > button or .mobile-menu-trigger-button
.site-menu-trigger-button {
  // any specific overrides if needed
  .icon-trigger { /* already styled by .icon-base in _header.scss */ }
}

// Panel and items use shared styles from _dropdowns.scss
// Specific item type styling
.logout-item-ephemeral {
  // color: hsl(var(--color-error-h), var(--color-error-s), var(--color-error-l)) !important;
  &:hover {
    // background-color: hsla(var(--color-error-h), var(--color-error-s), var(--color-error-l), 0.1) !important;
  }
}
.login-item-ephemeral {
   // color: hsl(var(--color-success-h), var(--color-success-s), var(--color-success-l)) !important;
   &:hover {
    // background-color: hsla(var(--color-success-h), var(--color-success-s), var(--color-success-l), 0.1) !important;
   }
}

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