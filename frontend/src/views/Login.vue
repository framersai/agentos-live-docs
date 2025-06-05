// File: frontend/src/views/Login.vue
/**
* @file Login.vue
* @description Login page for the Voice Coding Assistant, themed dynamically.
* @version 2.0.3 - Updated logo wrapper to use standard theme glass variables.
* Refined theme toggle to use uiStore and more generic theme IDs.
*/
<script setup lang="ts">
import { ref, onMounted, computed, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStorage } from '@vueuse/core';
import { authAPI, api } from '@/utils/api';
import { AUTH_TOKEN_KEY } from '@/router'; // AUTH_TOKEN_KEY should be exported from constants.ts if used elsewhere too
import { LockClosedIcon, EyeIcon, EyeSlashIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'; // BeakerIcon removed as not used
import { useUiStore } from '@/store/ui.store';
import type { ToastService } from '@/services/services';
import logoSvg from "@/assets/logo.svg"

const router = useRouter();
const route = useRoute();
const uiStore = useUiStore();
const toast = inject<ToastService>('toast');

// --- Theme State ---
const isDarkMode = computed(() => uiStore.isCurrentThemeDark);

// --- Form Data ---
const password = ref('');
const rememberMe = useStorage('vca-rememberLoginPreference_v2', true);
const showPassword = ref(false);
const isLoggingIn = ref(false);
const errorMessage = ref('');

// --- Development/Debug ---
// const showDevControls = ref(import.meta.env.DEV); // If used in template, keep
// const showTestUI = ref(false); // If used in template, keep

const handleLogin = async () => {
  if (!password.value) {
    errorMessage.value = 'Please enter the application password.';
    return;
  }
  isLoggingIn.value = true;
  errorMessage.value = '';
  try {
    const response = await authAPI.login({
      password: password.value,
      rememberMe: rememberMe.value
    });
    const token = response.data.token;
    if (token) {
      const storage = rememberMe.value ? localStorage : sessionStorage;
      storage.setItem(AUTH_TOKEN_KEY, token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // If useAuth composable has a login method that updates global state, call it:
      // auth.login(token, rememberMe.value); // Assuming auth.login handles token storage & redirect

      toast?.add({ type: 'success', title: 'Login Successful', message: 'Welcome back!' });
      const redirectPath = route.query.redirect as string | undefined;
      if (redirectPath && redirectPath !== '/' && redirectPath !== '/login') {
        await router.replace(redirectPath);
      } else {
        await router.replace({ name: 'AuthenticatedHome' });
      }
    } else {
      throw new Error('Login successful, but no token received.');
    }
  } catch (error: any) {
    console.error('Login error details:', error.response || error);
    if (error.response?.status === 401) {
      errorMessage.value = 'Invalid password. Please check and try again.';
    } else if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = 'An unexpected error occurred. Please try again later.';
    }
    toast?.add({ type: 'error', title: 'Login Failed', message: errorMessage.value });
  } finally {
    isLoggingIn.value = false;
  }
};

// --- Lifecycle Hooks ---
onMounted(async () => {
  // Theme is initialized globally by ThemeManager in App.vue
  const token = localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // Optionally, verify token validity with backend here before redirecting
    // For now, assume token presence implies valid session for quick redirect
    console.log("[Login.vue] User already has a token, attempting redirect.");
    // Check if useAuth has an init method or if redirect is handled elsewhere
    // For simplicity, direct redirect:
    await router.replace({ name: 'AuthenticatedHome' });
    return;
  }

  if (route.query.sessionExpired === 'true') {
    let reasonMessage = "Your session has expired. Please log in again.";
    if (route.query.reason === 'unauthorized') {
      reasonMessage = "Your session was invalid or unauthorized. Please log in again.";
    }
    toast?.add({ type: 'warning', title: 'Session Expired', message: reasonMessage, duration: 7000 });
    // Clean up query params after displaying message
    await router.replace({ query: {} });
  }
});
</script>

<template>
  <div class="login-page-wrapper">
    <div class="login-content-area">
      <div class="login-container w-full max-w-md space-y-8">
        <div class="text-center">
          <div class="logo-wrapper">
            <img class="logo-image" :src="logoSvg" alt="Voice Chat Assistant Logo" />
          </div>
          <h1 class="app-main-title text-glow-primary">
            Meet <strong>V</strong>
          </h1>
          <p class="app-subtitle">
            Your Voice Chat Assistant
          </p>
        </div>

        <div class="login-card glass-pane">
          <form @submit.prevent="handleLogin" class="space-y-6 p-6 sm:p-8">
            <div>
              <label for="password" class="form-label">
                Access Password
              </label>
              <div class="relative mt-1">
                <input
  id="password"
  v-model="password"
  :type="showPassword ? 'text' : 'password'"
  required
  class="form-input !px-4 !py-4 !pr-12"
  placeholder="Enter application password"
  aria-required="true"
  aria-describedby="password-error-message"
  autocomplete="current-password"
  @keyup.enter="handleLogin"
/>
                <button type="button" @click="showPassword = !showPassword" class="password-toggle-button" tabindex="-1"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'">
                  <component :is="showPassword ? EyeSlashIcon : EyeIcon"
                    class="icon-base text-neutral-text-muted hover:text-neutral-text" />
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input id="remember-me" v-model="rememberMe" type="checkbox" class="remember-me-checkbox" />
                <label for="remember-me" class="remember-me-label">
                  Remember me
                </label>
              </div>
            </div>

            <div>
              <button type="submit" :disabled="isLoggingIn" class="login-button btn btn-primary w-full group">
                <span v-if="!isLoggingIn" class="flex items-center justify-center">
                  <LockClosedIcon class="icon-sm mr-2" />
                  Sign In
                </span>
                <div v-if="isLoggingIn" class="login-spinner"></div>
              </button>
            </div>

            <div v-if="errorMessage" id="password-error-message" class="error-alert" role="alert">
              <div class="flex">
                <div class="flex-shrink-0">
                  <ExclamationTriangleIcon class="icon-base text-error-icon" />
                </div>
                <div class="ml-3">
                  <p class="text-sm text-error-content">{{ errorMessage }}</p>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div class="text-center mt-8 space-y-4">
          <p class="text-xs text-neutral-text-muted">
            This application is for authorized users. <br class="sm:hidden"> Contact admin for access.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
/* Define Keyframes for animated gradient background */
@keyframes gradient-animation {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.login-page-wrapper {
  @apply min-h-screen flex flex-col justify-center;
  /* Changed from justify-between to center content better */
  background: linear-gradient(-45deg,
      hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), var(--color-accent-primary-a, 0.3)),
      /* Added alpha var */
      hsla(var(--color-accent-secondary-h), var(--color-accent-secondary-s), var(--color-accent-secondary-l), var(--color-accent-secondary-a, 0.3)),
      /* Added alpha var */
      hsla(var(--color-bg-secondary-h), var(--color-bg-secondary-s), var(--color-bg-secondary-l), var(--color-bg-secondary-a, 0.4)),
      /* Added alpha var */
      hsla(var(--color-bg-primary-h), var(--color-bg-primary-s), var(--color-bg-primary-l), var(--color-bg-primary-a, 0.5))
      /* Added alpha var */
    );
  background-size: 400% 400%;
  animation: gradient-animation 25s ease infinite;
  /* Ensure children can stack correctly if needed, e.g. for footer if it were present */
  /* Forcing no scroll on login page itself */
  @apply overflow-hidden;
}

.login-content-area {
  @apply flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative;
  /* overflow-hidden removed from here, as page-wrapper handles it */
}

.login-content-area::before {
  content: '';
  @apply absolute inset-0 bg-holo-grid-pattern;
  background-size: var(--bg-holo-grid-size, 50px) var(--bg-holo-grid-size, 50px);
  opacity: var(--bg-holo-grid-opacity, 0.07);
  /* Use theme variable for opacity */
  z-index: 0;
  animation: holoGridScroll calc(var(--duration-pulse-long, 4000ms) * 2) linear infinite;
  /* Adjusted duration */
}

.login-container {
  @apply relative z-10;
}

.logo-wrapper {
  @apply mx-auto h-20 w-20 sm:h-24 sm:w-24 p-1 mb-4 sm:mb-6 rounded-full flex items-center justify-center transition-all duration-300 ease-out;
  /* Using standard theme glass variables */
  background-color: hsla(var(--color-bg-glass-h), var(--color-bg-glass-s), var(--color-bg-glass-l), var(--color-bg-glass-a, 0.7));
  border: 1px solid hsla(var(--color-border-glass-h), var(--color-border-glass-s), var(--color-border-glass-l), var(--color-border-glass-a, 0.4));
  box-shadow: var(--shadow-depth-md);
  /* Standard themed shadow */
  backdrop-filter: blur(var(--blur-glass));
  -webkit-backdrop-filter: blur(var(--blur-glass));
}

.logo-image {
  @apply h-12 w-12 sm:h-14 sm:w-14 object-contain transition-transform duration-500 ease-in-out;
  filter: drop-shadow(0 2px 4px hsla(var(--color-shadow-h, 0), var(--color-shadow-s, 0%), var(--color-shadow-l, 0%), 0.15));
  /* Softer, themed shadow */
}

.logo-wrapper:hover .logo-image {
  transform: scale(1.12) rotate(3deg);
}

.logo-wrapper:hover {
  box-shadow: var(--shadow-depth-lg);
  /* Enhanced shadow on hover */
}

.app-main-title {
  @apply mt-0 text-3xl sm:text-4xl font-bold tracking-tight;
  font-family: var(--font-family-display, 'Plus Jakarta Sans', sans-serif);
  /* Ensure fallback */
  color: hsl(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l));
}

.text-glow-primary {
  /* Ensure this uses the primary accent */
  text-shadow: 0 0 10px hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), var(--color-accent-glow-a, 0.6)),
    /* Adjusted alpha var */
    0 0 20px hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), var(--color-accent-glow-a, 0.4));
  /* Adjusted alpha var */
}

.app-subtitle {
  @apply mt-2 sm:mt-3 text-sm sm:text-base max-w-xs mx-auto;
  color: hsl(var(--color-text-secondary-h), var(--color-text-secondary-s), var(--color-text-secondary-l));
  opacity: 0.9;
}

.glass-pane {
  /* This is used for the login-card */
  background-color: hsla(var(--color-bg-glass-h), var(--color-bg-glass-s), var(--color-bg-glass-l), var(--color-bg-glass-a, 0.75));
  /* Adjusted alpha for better card definition */
  border: 1px solid hsla(var(--color-border-glass-h), var(--color-border-glass-s), var(--color-border-glass-l), var(--color-border-glass-a, 0.45));
  backdrop-filter: blur(var(--blur-glass));
  -webkit-backdrop-filter: blur(var(--blur-glass));
  box-shadow: var(--shadow-depth-lg);
  border-radius: var(--radius-xl);
}

.login-card {
  @apply mt-6 sm:mt-8;
}

.form-label {
  @apply block text-sm font-medium mb-1.5;
  /* Increased margin */
  color: hsl(var(--color-text-secondary-h), var(--color-text-secondary-s), var(--color-text-secondary-l));
  opacity: 0.9;
}

/* Assuming .form-input is styled in _forms.scss using theme variables. Placeholder: */
.form-input {
  @apply block w-full rounded-md shadow-sm sm:text-sm;
  /* Added not-prose */
  background-color: hsla(var(--color-bg-secondary-h), var(--color-bg-secondary-s), calc(var(--color-bg-secondary-l) + 3%), 0.8);
  /* Slightly lighter than card bg, with some transparency */
  border: 1px solid hsl(var(--color-border-primary-h), var(--color-border-primary-s), var(--color-border-primary-l));
  color: hsl(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l));
  padding: var(--spacing-xs) var(--spacing-sm);
  /* Use theme spacing */

  &::placeholder {
    color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
    opacity: 0.7;
  }

  &:focus {
    @apply ring-2;
    border-color: hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l));
    ring-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.5);
    background-color: hsla(var(--color-bg-secondary-h), var(--color-bg-secondary-s), calc(var(--color-bg-secondary-l) + 5%), 0.9);
  }
}


.password-toggle-button {
  @apply absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none rounded-r-md;
  /* Ensure it fits well */
}

/* These classes are used on the icon inside the button */
.text-neutral-text-muted {
  color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
  opacity: 0.7;
  transition: color 0.2s ease-in-out, opacity 0.2s ease-in-out;
}

.hover\:text-neutral-text:hover {
  /* Applied to the icon's class if parent button is hovered */
  color: hsl(var(--color-text-secondary-h), var(--color-text-secondary-s), var(--color-text-secondary-l));
  opacity: 1;
}


.remember-me-checkbox {
  @apply h-4 w-4 rounded border transition-colors duration-150 focus:ring-offset-0;
  /* Removed ring-offset-2 for cleaner look if bg is similar */
  color: hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l));
  border-color: hsl(var(--color-border-secondary-h), var(--color-border-secondary-s), var(--color-border-secondary-l));
  background-color: hsla(var(--color-bg-tertiary-h), var(--color-bg-tertiary-s), var(--color-bg-tertiary-l), 0.5);

  /* Slightly transparent bg */
  &:focus {
    @apply ring-2;
    ring-color: hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l));
    /* ring-offset-color: hsl(var(--color-bg-primary-h), var(--color-bg-primary-s), var(--color-bg-primary-l)); */
  }

  &:checked {
    border-color: hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l));
    background-color: hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l));
  }
}

.remember-me-label {
  @apply ml-2 block text-sm cursor-pointer select-none;
  /* Added select-none */
  color: hsl(var(--color-text-secondary-h), var(--color-text-secondary-s), var(--color-text-secondary-l));
  opacity: 0.9;
}

.login-button {
  /* Relies on .btn .btn-primary from _buttons.scss which should be fully themed */
  @apply py-2.5 sm:py-3;
  /* Slightly larger padding */
}

.login-spinner {
  @apply h-5 w-5 border-2 rounded-full animate-spin mx-auto;
  border-color: hsla(var(--color-text-on-primary-h), var(--color-text-on-primary-s), var(--color-text-on-primary-l), 0.35);
  border-top-color: hsl(var(--color-text-on-primary-h), var(--color-text-on-primary-s), var(--color-text-on-primary-l));
}

.error-alert {
  @apply p-3 sm:p-4 rounded-md shadow-md mt-4;
  /* Consistent margin */
  background-color: hsla(var(--color-error-h), var(--color-error-s), var(--color-error-l), 0.15);
  /* Slightly more visible error bg */
  border: 1px solid hsla(var(--color-error-h), var(--color-error-s), var(--color-error-l), 0.4);
}

.text-error-icon {
  /* New class for the icon itself */
  color: hsl(var(--color-error-h), var(--color-error-s), calc(var(--color-error-l) - 5%));
  /* Slightly darker/more saturated error icon */
}

.text-error-content {
  color: hsl(var(--color-error-h), var(--color-error-s), calc(var(--color-error-l) - 15%));
  /* Darker for high contrast on light error bg */
  /* Fallback for themes where error color might be light: */
  /* color: var(--color-error-text, hsl(var(--color-error-text-h), var(--color-error-text-s), var(--color-error-text-l))); */
}

/* For the paragraph at the bottom & theme toggle button icon */
.text-themed-secondary {
  /* Utility class for themed secondary text color if needed */
  color: hsl(var(--color-text-secondary-h), var(--color-text-secondary-s), var(--color-text-secondary-l));
  opacity: 0.9;
}

.theme-toggle-button-login {
  padding: 0.5rem !important;

  /* Ensure consistent padding for icon button */
  &:hover .text-themed-secondary {
    color: hsl(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l));
  }
}

.icon-base {
  @apply w-5 h-5;
}

.icon-sm {
  @apply w-4 h-4;
}

/* Ensure keyframes for holoGridScroll are globally defined, e.g., in _keyframes.scss */
@keyframes holoGridScroll {
  0% {
    background-position: 0px 0px;
  }

  100% {
    background-position: var(--bg-holo-grid-size, 50px) var(--bg-holo-grid-size, 50px);
  }

  /* Match size */
}
</style>