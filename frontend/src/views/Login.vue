// File: frontend/src/views/Login.vue
/**
 * @file Login.vue
 * @description Login page for the Voice Coding Assistant, revamped with a holographic analog theme.
 * @version 2.0.1 - Corrected undefined animation classes.
 * @notes
 * - Incorporates new theme styling.
 * - Includes Footer.vue.
 * - Ensures light/dark mode functionality.
 */
<script setup lang="ts">
// ... script content remains the same ...
import { ref, onMounted, computed, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStorage } from '@vueuse/core';
import { authAPI, api } from '@/utils/api';
import { AUTH_TOKEN_KEY } from '@/router'; // Corrected from constants to router if that's the source
import { LockClosedIcon, EyeIcon, EyeSlashIcon, ExclamationTriangleIcon, SunIcon, MoonIcon, BeakerIcon } from '@heroicons/vue/24/outline';
import { useUiStore } from '@/store/ui.store';
import type { ToastService } from '@/services/services';
import Footer from '@/components/Footer.vue'; // Import Footer

const router = useRouter();
const route = useRoute();
const uiStore = useUiStore();
const toast = inject<ToastService>('toast');

// --- Theme State ---
const isDarkMode = computed(() => uiStore.isDarkMode);

// --- Form Data ---
const password = ref('');
const rememberMe = useStorage('vca-rememberLoginPreference_v2', true);
const showPassword = ref(false);
const isLoggingIn = ref(false);
const errorMessage = ref('');

// --- Development/Debug ---
const showDevControls = ref(import.meta.env.DEV);
const showTestUI = ref(false); // Added this missing ref from template usage

// --- Methods ---
const toggleTheme = () => {
  uiStore.toggleTheme();
};

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
      toast?.add({ type: 'success', title: 'Login Successful', message: 'Welcome back!' });

      const redirectPath = route.query.redirect as string | undefined;
      if (redirectPath && redirectPath !== '/' && redirectPath !== '/login') {
        await router.replace(redirectPath);
      } else {
        // Assuming 'AuthenticatedHome' is the name for the private home page, adjust if different
        // Or directly use router.replace({ path: '/' }); if PrivateHome is at root for authenticated users
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
  uiStore.initializeTheme(); // Ensures theme is set based on preference or system

  const token = localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log("[Login.vue] User already has a token, redirecting.");
    // Assuming 'AuthenticatedHome' is the correct route name
    await router.replace({ name: 'AuthenticatedHome' });
    return;
  }

  if (route.query.sessionExpired === 'true') {
    let reasonMessage = "Your session has expired. Please log in again.";
    if (route.query.reason === 'unauthorized') {
      reasonMessage = "Your session was invalid or unauthorized. Please log in again.";
    }
    toast?.add({ type: 'warning', title: 'Session Expired', message: reasonMessage, duration: 7000 });
    // Clear the query params to prevent re-showing the toast on refresh
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
            <img class="logo-image" src="@/assets/logo.svg" alt="Voice Coding Assistant Logo" />
          </div>
          <h1 class="app-main-title">
            Voice Coding Assistant
          </h1>
          <p class="app-subtitle">
            Unlock the power of AI. Sign in to continue.
          </p>
        </div>

        <div class="login-card card-base">
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
                  class="form-input pr-10"
                  placeholder="Enter application password"
                  aria-required="true"
                  aria-describedby="password-error-message"
                  autocomplete="current-password"
                  @keyup.enter="handleLogin"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="password-toggle-button"
                  tabindex="-1"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                >
                  <component :is="showPassword ? EyeSlashIcon : EyeIcon" class="icon-base text-neutral-text-muted hover:text-neutral-text" />
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember-me"
                  v-model="rememberMe"
                  type="checkbox"
                  class="remember-me-checkbox"
                />
                <label for="remember-me" class="remember-me-label">
                  Remember me
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                :disabled="isLoggingIn"
                class="login-button btn btn-primary w-full group"
              >
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
                  <ExclamationTriangleIcon class="icon-base text-error" />
                </div>
                <div class="ml-3">
                  <p class="text-sm text-error">{{ errorMessage }}</p>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div class="text-center mt-8 space-y-4">
           <p class="text-xs text-neutral-text-muted">
            This application is for authorized users. <br class="sm:hidden"> Contact admin for access.
          </p>
          <div class="inline-flex items-center gap-3">
            <button @click="toggleTheme" class="theme-toggle-button btn btn-icon btn-ghost" aria-label="Toggle theme">
              <component :is="isDarkMode ? SunIcon : MoonIcon" class="icon-base" />
            </button>
            <button v-if="showDevControls" @click="showTestUI = !showTestUI" class="theme-toggle-button btn btn-icon btn-ghost" aria-label="Toggle test UI elements">
                <BeakerIcon class="icon-base" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- <Footer /> -->
  </div>
</template>

<style scoped lang="postcss">
.login-page-wrapper {
  @apply min-h-screen flex flex-col justify-between animate-gradient-bg; /* CORRECTED: Was animated-gradient-bg */
}

.login-content-area {
  @apply flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden;
}

/* Optional: Add a subtle grid or dot pattern for the "analog-esque" feel */
.login-content-area::before {
  content: '';
  /* REMOVED: animated-holo-grid as its definition is not confirmed in global styles */
  /* You can apply a static grid if desired: bg-holo-grid bg-holo-grid-size (ensure these are in tailwind.config) */
  @apply absolute inset-0 opacity-30 dark:opacity-20 bg-holo-grid bg-holo-grid-size;
  z-index: 0;
}

.login-container {
  @apply relative z-10; /* Ensure form elements are above pseudo-elements */
}

.logo-wrapper {
  @apply mx-auto h-20 w-20 sm:h-24 sm:w-24 p-1 mb-6 rounded-full flex items-center justify-center
         bg-neutral-bg-surface shadow-holo-md border-2 border-primary-focus/30;
  backdrop-filter: blur(3px);
}
.logo-image {
  @apply h-12 w-12 sm:h-14 sm:w-14 object-contain transition-transform duration-500 ease-in-out;
  filter: drop-shadow(0 2px 3px hsl(var(--neutral-base-hsl)/0.1)); /* Assuming --neutral-base-hsl is defined in main.css or similar */
}
.logo-wrapper:hover .logo-image {
  transform: scale(1.1) rotate(5deg);
}

.app-main-title {
  @apply mt-0 text-3xl sm:text-4xl font-bold tracking-tight text-neutral-text text-glow-primary;
  font-family: var(--font-display);
}
.app-subtitle {
  @apply mt-3 text-sm sm:text-base text-neutral-text-secondary max-w-xs mx-auto;
}

.login-card {
  /* card-base from main.css will provide base styling */
  @apply mt-8 glass-pane; /* Using glass-pane for a holographic feel */
}

.form-label {
  @apply block text-sm font-medium text-neutral-text-secondary mb-1;
}

.password-toggle-button {
  @apply absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-text-muted hover:text-neutral-text focus:outline-none;
}

.remember-me-checkbox {
  @apply h-4 w-4 text-primary border-neutral-border rounded focus:ring-primary-focus
         bg-neutral-bg-surface dark:bg-neutral-bg-elevated
         focus:ring-offset-neutral-bg dark:focus:ring-offset-neutral-bg-elevated;
}
.remember-me-label {
  @apply ml-2 block text-sm text-neutral-text-secondary cursor-pointer;
}

.login-button {
  /* Styles from .btn and .btn-primary in main.css */
}
.login-spinner {
  @apply h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto;
}

.error-alert {
  @apply bg-error/10 border border-error/30 p-4 rounded-[var(--radius-md)] shadow-md;
}
.error-alert p {
  @apply text-error; /* Uses text-error from main.css vars */
}

.theme-toggle-button {
  /* Styles from .btn, .btn-icon, .btn-ghost in main.css */
}
</style>