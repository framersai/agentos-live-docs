// File: frontend/src/views/Login.vue
/**
 * @file Login.vue
 * @description Login page for the Voice Coding Assistant, revamped with a holographic analog theme.
 * @version 2.0.2 - Corrected theme interactions, removed unused Footer.
 */
<script setup lang="ts">
import { ref, onMounted, computed, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStorage } from '@vueuse/core';
import { authAPI, api } from '@/utils/api';
import { AUTH_TOKEN_KEY } from '@/router';
import { LockClosedIcon, EyeIcon, EyeSlashIcon, ExclamationTriangleIcon, SunIcon, MoonIcon, BeakerIcon } from '@heroicons/vue/24/outline';
import { useUiStore } from '@/store/ui.store';
import { themeManager } from '@/theme/ThemeManager'; // Added: Import themeManager
import type { ToastService } from '@/services/services';
// Removed: import Footer from '@/components/Footer.vue'; // Unused variable

const router = useRouter();
const route = useRoute();
const uiStore = useUiStore(); // This should be the v2.0.0 version of uiStore
const toast = inject<ToastService>('toast');

// --- Theme State ---
// Corrected: Read from uiStore.isCurrentThemeDark which derives from ThemeManager
const isDarkMode = computed(() => uiStore.isCurrentThemeDark);

// --- Form Data ---
const password = ref('');
const rememberMe = useStorage('vca-rememberLoginPreference_v2', true);
const showPassword = ref(false);
const isLoggingIn = ref(false);
const errorMessage = ref('');

// --- Development/Debug ---
const showDevControls = ref(import.meta.env.DEV);
const showTestUI = ref(false); // Was previously missing ref from template, now consistent

// --- Methods ---
const toggleTheme = () => {
  // Corrected: Interact with themeManager directly for theme changes
  const currentTheme = themeManager.getCurrentTheme().value;
  if (currentTheme?.isDark) {
    // Toggle to a default light theme
    const lightTheme = themeManager.getAvailableThemes().find(t => !t.isDark && t.id === 'aurora-light');
    themeManager.setTheme(lightTheme?.id || 'legacy-warm-embrace'); // Fallback
  } else {
    // Toggle to a default dark theme
    const darkTheme = themeManager.getAvailableThemes().find(t => t.isDark && t.id === 'ephemeral-holo-dark');
    themeManager.setTheme(darkTheme?.id || 'legacy-twilight-neo'); // Fallback
  }
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
      // Call the login function from useAuth composable if it's responsible for setting global auth state
      // For now, assuming this direct token setting is sufficient for the auth guard.
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
  // Removed: uiStore.initializeTheme(); Theme is initialized globally by ThemeManager in App.vue
  // The themeManager.initialize() in App.vue will handle initial theme setup.

  const token = localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log("[Login.vue] User already has a token, redirecting.");
    await router.replace({ name: 'AuthenticatedHome' });
    return;
  }

  if (route.query.sessionExpired === 'true') {
    let reasonMessage = "Your session has expired. Please log in again.";
    if (route.query.reason === 'unauthorized') {
      reasonMessage = "Your session was invalid or unauthorized. Please log in again.";
    }
    toast?.add({ type: 'warning', title: 'Session Expired', message: reasonMessage, duration: 7000 });
    await router.replace({ query: {} });
  }
});
</script>

<template> <div class="login-page-wrapper">
    <div class="login-content-area">
      <div class="login-container w-full max-w-md space-y-8">
        <div class="text-center">
          <div class="logo-wrapper">
            <img class="logo-image" src="@/assets/logo.svg" alt="Voice Coding Assistant Logo" />
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
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.login-page-wrapper {
  @apply min-h-screen flex flex-col justify-between;
  /* Apply the animation */
  background: linear-gradient(-45deg, 
    hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.3),
    hsl(var(--color-accent-secondary-h), var(--color-accent-secondary-s), var(--color-accent-secondary-l), 0.3),
    hsl(var(--color-bg-secondary-h), var(--color-bg-secondary-s), var(--color-bg-secondary-l), 0.4),
    hsl(var(--color-bg-primary-h), var(--color-bg-primary-s), var(--color-bg-primary-l), 0.5)
  );
  background-size: 400% 400%;
  animation: gradient-animation 25s ease infinite;
}
/* Custom class to apply the above animation if preferred over direct styling */
.animate-gradient-bg {
  background: linear-gradient(-45deg, 
    hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.3),
    hsl(var(--color-accent-secondary-h), var(--color-accent-secondary-s), var(--color-accent-secondary-l), 0.3),
    hsl(var(--color-bg-secondary-h), var(--color-bg-secondary-s), var(--color-bg-secondary-l), 0.4),
    hsl(var(--color-bg-primary-h), var(--color-bg-primary-s), var(--color-bg-primary-l), 0.5)
  );
  background-size: 400% 400%;
  animation: gradient-animation 25s ease infinite;
}


.login-content-area {
  @apply flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden;
}

.login-content-area::before {
  content: '';
  /* Using the themed holographic grid pattern from Tailwind config (which uses CSS vars) */
  @apply absolute inset-0 opacity-20 dark:opacity-10 bg-holo-grid-pattern; /* Updated opacity */
  background-size: var(--bg-holo-grid-size, 50px) var(--bg-holo-grid-size, 50px); /* Ensure CSS vars are set */
  z-index: 0;
  animation: holoGridScroll var(--duration-pulse-long, 5000ms) linear infinite; /* Ensure holoGridScroll and duration are defined */
}

.login-container {
  @apply relative z-10; /* Ensure form elements are above pseudo-elements */
}

.logo-wrapper {
  @apply mx-auto h-20 w-20 sm:h-24 sm:w-24 p-1 mb-6 rounded-full flex items-center justify-center;
  /* Using CSS custom properties for themeable glass effect */
  background-color: var(--color-bg-glass-header, hsla(220, 25%, 90%, 0.3)); /* Fallback to a light glass */
  border: 1px solid var(--color-border-glass-header, hsla(220, 25%, 80%, 0.2));
  box-shadow: var(--shadow-depth-lg, 0 8px 25px rgba(0,0,0,0.1)); /* Use themed shadow or fallback */
  backdrop-filter: blur(var(--blur-glass-header, 5px));
  -webkit-backdrop-filter: blur(var(--blur-glass-header, 5px));
}
.logo-image {
  @apply h-12 w-12 sm:h-14 sm:w-14 object-contain transition-transform duration-500 ease-in-out;
  /* Themeable drop shadow using text primary color for a subtle effect */
  filter: drop-shadow(0 2px 3px hsla(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l), 0.15));
}
.logo-wrapper:hover .logo-image {
  transform: scale(1.1) rotate(5deg);
}

.app-main-title {
  @apply mt-0 text-3xl sm:text-4xl font-bold tracking-tight;
  font-family: var(--font-display);
  color: hsl(var(--color-text-primary-h), var(--color-text-primary-s), var(--color-text-primary-l));
}
/* Custom text glow utility using CSS variables */
.text-glow-primary {
  text-shadow: 0 0 8px hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.5),
               0 0 16px hsla(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l), 0.3);
}

.app-subtitle {
  @apply mt-3 text-sm sm:text-base max-w-xs mx-auto;
  color: hsl(var(--color-text-secondary-h), var(--color-text-secondary-s), var(--color-text-secondary-l));
}

/* Custom glass-pane utility using CSS variables */
.glass-pane {
  background-color: var(--color-bg-glass, hsla(0, 0%, 100%, 0.1)); /* Default glass from theme */
  border: 1px solid var(--color-border-glass, hsla(0, 0%, 100%, 0.2));
  backdrop-filter: blur(var(--blur-glass, 8px));
  -webkit-backdrop-filter: blur(var(--blur-glass, 8px));
  box-shadow: var(--shadow-depth-lg, 0 10px 20px rgba(0,0,0,0.15)); /* Use themed shadow */
  border-radius: var(--radius-xl, 0.75rem); /* Use themed radius */
}

.login-card {
  /* card-base class from global SCSS can provide padding, base border-radius if needed */
  /* For now, .glass-pane handles the visual appearance. */
  @apply mt-8;
}

.form-label {
  @apply block text-sm font-medium mb-1;
  color: hsl(var(--color-text-secondary-h), var(--color-text-secondary-s), var(--color-text-secondary-l));
}

/* form-input is assumed to be styled globally by _forms.scss using theme variables */
/* .form-input {} */

.password-toggle-button {
  @apply absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none;
  .text-neutral-text-muted { /* Tailwind class from template */
    color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
  }
  .hover\:text-neutral-text:hover { /* Tailwind class from template */
    color: hsl(var(--color-text-secondary-h), var(--color-text-secondary-s), var(--color-text-secondary-l));
  }
}

.remember-me-checkbox {
  /* Assumed to be styled by @tailwindcss/forms and themed via its options or CSS vars */
  /* Example of direct theming if needed: */
  @apply h-4 w-4 rounded border transition-colors duration-150;
  color: hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l)); /* Checkbox color */
  border-color: hsl(var(--color-border-primary-h), var(--color-border-primary-s), var(--color-border-primary-l));
  background-color: hsl(var(--color-bg-secondary-h), var(--color-bg-secondary-s), var(--color-bg-secondary-l));
  &:focus {
    @apply ring-2 ring-offset-2;
    ring-color: hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l));
    ring-offset-color: hsl(var(--color-bg-primary-h), var(--color-bg-primary-s), var(--color-bg-primary-l));
  }
}
.remember-me-label {
  @apply ml-2 block text-sm cursor-pointer;
  color: hsl(var(--color-text-secondary-h), var(--color-text-secondary-s), var(--color-text-secondary-l));
}

.login-button {
  /* Uses .btn .btn-primary classes from global _buttons.scss */
  /* Ensure those global classes are fully themed and functional */
}
.login-spinner {
  @apply h-5 w-5 border-2 rounded-full animate-spin mx-auto;
  border-color: hsla(var(--color-text-on-primary-h), var(--color-text-on-primary-s), var(--color-text-on-primary-l), 0.3);
  border-top-color: hsl(var(--color-text-on-primary-h), var(--color-text-on-primary-s), var(--color-text-on-primary-l));
}

.error-alert {
  @apply p-4 rounded-md shadow-md;
  background-color: hsla(var(--color-error-h), var(--color-error-s), var(--color-error-l), 0.1);
  border: 1px solid hsla(var(--color-error-h), var(--color-error-s), var(--color-error-l), 0.3);
  /* text-error class from template uses --color-error for text */
}
.text-error-content { /* New class to ensure themed error text color */
    color: hsl(var(--color-error-h), var(--color-error-s), calc(var(--color-error-l) - 10%)); /* Darker error text for readability */
}


.text-neutral-text-muted { /* For the paragraph at the bottom */
   color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), var(--color-text-muted-l));
}

.theme-toggle-button {
  /* Uses .btn .btn-icon .btn-ghost classes from global _buttons.scss */
}

/* Ensure icon sizes are consistent, .icon-base is used in template */
.icon-base { @apply w-5 h-5; }
.icon-sm { @apply w-4 h-4; }

/* Ensure keyframes for holoGridScroll and subtlePulse are defined in global SCSS (_keyframes.scss) */
/* @keyframes holoGridScroll { ... } */
/* @keyframes subtlePulse { ... } */
</style>