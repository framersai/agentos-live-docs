// File: frontend/src/components/header/SiteMenuDropdown.vue
/**
 * @file SiteMenuDropdown.vue
 * @description A dropdown menu for site-wide navigation links (About, Settings) and authentication actions (Login/Logout).
 * @version 1.0.1 - Added SASS variable import for scoped styles.
 */
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import {
  InformationCircleIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  EllipsisVerticalIcon,
} from '@heroicons/vue/24/outline';

const auth = useAuth();
const router = useRouter();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const toggleDropdown = (): void => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = (): void => {
  isOpen.value = false;
};

const emit = defineEmits<{
  (e: 'logout'): void;
}>();

const handleLogout = async (): Promise<void> => {
  closeDropdown();
  emit('logout');
};

const handleClickOutside = (event: MouseEvent): void => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
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
      <EllipsisVerticalIcon class="icon-base site-menu-trigger-icon" />
    </button>

    <Transition name="dropdown-float-neomorphic">
      <div
        v-if="isOpen"
        class="site-menu-dropdown-panel card-neo-raised absolute right-0 mt-2 w-56 origin-top-right"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="site-menu-trigger-button"
      >
        <div class="dropdown-content-holographic p-1" role="none">
          <RouterLink
            to="/about"
            class="dropdown-item-holographic group"
            role="menuitem"
            @click="closeDropdown"
          >
            <InformationCircleIcon class="dropdown-item-icon" aria-hidden="true" />
            About
          </RouterLink>
          <RouterLink
            to="/settings"
            class="dropdown-item-holographic group"
            role="menuitem"
            @click="closeDropdown"
          >
            <Cog6ToothIcon class="dropdown-item-icon" aria-hidden="true" />
            Settings
          </RouterLink>

          <hr class="dropdown-divider-holographic my-1" />

          <template v-if="auth.isAuthenticated.value">
            <button
              @click="handleLogout"
              class="dropdown-item-holographic group w-full"
              role="menuitem"
            >
              <ArrowLeftOnRectangleIcon class="dropdown-item-icon" aria-hidden="true" />
              Logout
            </button>
          </template>
          <template v-else>
            <RouterLink
              to="/login"
              class="dropdown-item-holographic group"
              role="menuitem"
              @click="closeDropdown"
            >
              <ArrowRightOnRectangleIcon class="dropdown-item-icon" aria-hidden="true" />
              Login
            </RouterLink>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/abstracts/variables' as var; // Import SASS variables
@use '@/styles/abstracts/mixins' as mixins;   // Import SASS mixins

// Scoped styles specific to SiteMenuDropdown, leveraging global dropdown styles where possible.
// Styles for .card-neo-raised, .dropdown-content-holographic, .dropdown-item-holographic
// are expected to be in global component SCSS files (_cards.scss, _dropdowns.scss or similar).

.site-menu-trigger-button {
  // Base styles from .btn-ghost-ephemeral & .btn-icon-ephemeral are applied globally
  // Add specific tweaks if needed
  padding: var.$spacing-xs; // Now var.$spacing-xs should work
  .site-menu-trigger-icon {
    transition: transform 0.2s var.$ease-out-quad;
  }
  &:hover .site-menu-trigger-icon,
  &[aria-expanded='true'] .site-menu-trigger-icon {
    transform: scale(1.15) rotate(90deg);
    color: hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l));
  }
}

.site-menu-dropdown-panel {
  // General panel styling from .card-neo-raised is applied
  z-index: var.$z-index-dropdown;
}

.dropdown-item-icon {
  width: 1rem; // 16px
  height: 1rem; // 16px
  margin-right: var.$spacing-sm; // Use SASS var
  color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
  // group-hover typically handled by Tailwind, or define specific hover here:
  // .group:hover & { color: hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l)); }
  transition: color var.$duration-quick;
}

.dropdown-item-holographic.group:hover .dropdown-item-icon {
   color: hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l));
}


.dropdown-divider-holographic {
  border-top: 1px solid hsla(var(--color-border-primary-h), var(--color-border-primary-s), var(--color-border-primary-l), 0.2);
}

.dropdown-float-neomorphic-enter-active,
.dropdown-float-neomorphic-leave-active {
  transition: opacity var.$duration-quick var.$ease-out-quad, transform var.$duration-quick var.$ease-out-quad;
}
.dropdown-float-neomorphic-enter-from,
.dropdown-float-neomorphic-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>