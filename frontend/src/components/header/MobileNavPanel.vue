// File: frontend/src/components/header/MobileNavPanel.vue
/**
 * @file MobileNavPanel.vue
 * @version 3.0.0
 *
 * @description
 *  Super-clean mobile drawer: **only** links you requested
 *   – Explore Assistants, App Settings, About VCA, Login/Logout –  
 *
 * @props
 *  @prop {boolean}  isOpen
 *  @prop {boolean}  isUserListening
 *  @prop {boolean}  isAiStateActive
 *  @prop {boolean}  isAuthenticated
 *
 * @emits
 *  close-panel, open-agent-hub, logout
 */

<script setup lang="ts">
import { computed, ref, type PropType } from 'vue';
import { RouterLink } from 'vue-router';
import { useUiStore } from '@/store/ui.store';
import { themeManager } from '@/theme/ThemeManager';
import AnimatedLogo from '@/components/ui/AnimatedLogo.vue';

/* ─ Icons ─ */
import {
  XMarkIcon, Squares2X2Icon, Cog8ToothIcon, InformationCircleIcon,
  ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/outline';

/* ─ Props / emits ─ */
const props = defineProps({
  isOpen             : { type: Boolean, required: true },
  isUserListening    : { type: Boolean, default: false },
  isAiStateActive    : { type: Boolean, default: false },
  isAuthenticated    : { type: Boolean, required: true },
});
const emit = defineEmits<{
  (e:'close-panel'): void;
  (e:'open-agent-hub'): void;
  (e:'logout'): void;
}>();

/* ─ store & theme selection ─ */
const uiStore = useUiStore();
const selectedThemeId = ref(uiStore.currentThemeId);
const onThemeChange = () => uiStore.setTheme(selectedThemeId.value);

/* helper */
const closeAndNavigate = () => emit('close-panel');
</script>

<template>
  <Transition name="mobile-nav-slide-from-right-ephemeral">
    <nav v-if="isOpen" class="mobile-nav-panel-ephemeral" role="dialog" aria-modal="true">
      <!-- ▸ HEADER -->
      <div class="mobile-nav-header-ephemeral">
        <RouterLink to="/" class="animated-logo-link" @click="closeAndNavigate">
          <AnimatedLogo
            app-name-main="VCA" app-name-subtitle="Assistant" :is-mobile-context="true"
            :is-user-listening="isUserListening"
            :is-ai-speaking-or-processing="isAiStateActive"
          />
        </RouterLink>
        <button class="mobile-nav-close-button btn btn-ghost-ephemeral btn-icon-ephemeral"
                aria-label="Close menu" @click="emit('close-panel')">
          <XMarkIcon class="icon-base"/>
        </button>
      </div>

      <!-- ▸ CONTENT -->
      <div class="mobile-nav-content-ephemeral custom-scrollbar-thin-ephemeral">
        <!-- LINKS -->
        <button class="mobile-nav-item-ephemeral group prominent-action"
                @click="emit('open-agent-hub'); closeAndNavigate();">
          <Squares2X2Icon class="nav-item-icon"/><span>Explore Assistants</span>
        </button>

        <RouterLink to="/settings" class="mobile-nav-item-ephemeral group" @click="closeAndNavigate">
          <Cog8ToothIcon class="nav-item-icon"/><span>App Settings</span>
        </RouterLink>

        <RouterLink to="/about" class="mobile-nav-item-ephemeral group" @click="closeAndNavigate">
          <InformationCircleIcon class="nav-item-icon"/><span>About VCA</span>
        </RouterLink>

        <!-- THEME DROPDOWN -->
        <label class="theme-dropdown-label">Theme:
          <select class="theme-dropdown-select" v-model="selectedThemeId" @change="onThemeChange">
            <option v-for="t in themeManager.getAvailableThemes()" :key="t.id" :value="t.id">
              {{ t.name }}
            </option>
          </select>
        </label>

        <!-- AUTH-AWARE LOGIN / LOGOUT -->
        <template v-if="isAuthenticated">
          <button class="mobile-nav-item-ephemeral group logout-item"
                  @click="emit('logout'); closeAndNavigate();">
            <ArrowRightOnRectangleIcon class="nav-item-icon"/><span>Logout</span>
          </button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="mobile-nav-item-ephemeral group prominent-action"
                      @click="closeAndNavigate">
            <ArrowLeftOnRectangleIcon class="nav-item-icon"/><span>Login / Sign Up</span>
          </RouterLink>
        </template>
      </div>
    </nav>
  </Transition>
</template>

<style lang="scss" scoped>
/* slide animation (unchanged) */
.mobile-nav-slide-from-right-ephemeral-enter-active,
.mobile-nav-slide-from-right-ephemeral-leave-active {
  transition: transform .4s cubic-bezier(.25,.85,.45,1), opacity .35s ease-out;
}
.mobile-nav-slide-from-right-ephemeral-enter-from,
.mobile-nav-slide-from-right-ephemeral-leave-to {
  transform: translateX(100%); opacity: 0;
}

/* quick cosmetics for the new dropdown */
.theme-dropdown-label   { display:block; margin:1rem 0 .5rem; font-weight:500; font-size:0.95rem; }
.theme-dropdown-select  {
  width:100%; padding:0.4rem 0.6rem; border-radius:0.375rem;
  background:hsla(var(--color-bg-secondary-h),var(--color-bg-secondary-s),var(--color-bg-secondary-l),0.85);
  border:1px solid hsla(var(--color-border-primary-h),var(--color-border-primary-s),var(--color-border-primary-l),0.4);
  color:hsl(var(--color-text-primary-h),var(--color-text-primary-s),var(--color-text-primary-l));
  font-size:0.95rem;
}
</style>
