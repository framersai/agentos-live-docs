<template>
  <div class="login-page min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-100 via-sky-50 to-indigo-50 dark:from-gray-900 dark:via-gray-850 dark:to-indigo-900/30">
    <div class="login-container w-full max-w-md space-y-8">
      <div class="text-center">
        <div class="mx-auto h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-full shadow-xl bg-white dark:bg-gray-800 p-1 ring-2 ring-primary-200 dark:ring-primary-700/50 flex items-center justify-center">
          <img class="h-12 w-12 sm:h-14 sm:w-14 object-contain transition-transform duration-500 ease-in-out hover:scale-110" src="@/assets/logo.svg" alt="Voice Coding Assistant Logo" />
        </div>
        <h1 class="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Welcome to
          <span class="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-sky-500 to-teal-500">
            Voice Chat Assistant
          </span>
        </h1>
        <p class="mt-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
          Unlock the power of AI to streamline your coding, design, and meeting workflows.
        </p>
      </div>

      <div class="login-card p-6 sm:p-8 rounded-2xl shadow-2xl transition-all bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700/50">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Access Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="form-input pr-10"
                placeholder="Enter application password"
                aria-required="true"
                aria-describedby="password-error"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                tabindex="-1"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
              >
                <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                <EyeSlashIcon v-else class="h-5 w-5" />
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 text-primary-600 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 dark:bg-gray-700 dark:focus:ring-offset-gray-800"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                Remember me
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoggingIn"
              class="login-button group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-primary-600 to-sky-500 hover:from-primary-700 hover:to-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-primary-500 transform transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <LockClosedIcon v-if="!isLoggingIn" class="h-5 w-5 text-primary-400 group-hover:text-primary-300 transition-colors" />
              </span>
              <div v-if="isLoggingIn" class="h-5 w-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
              <span v-else>Sign in to Your Assistant</span>
            </button>
          </div>

          <div v-if="errorMessage" id="password-error" class="error-alert" role="alert">
            <div class="flex">
              <div class="flex-shrink-0">
                <ExclamationTriangleIcon class="h-5 w-5 text-red-400 dark:text-red-300" />
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700 dark:text-red-200">{{ errorMessage }}</p>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="text-center mt-8 space-y-4">
         <p class="text-xs text-gray-500 dark:text-gray-400">
          This application is for authorized users. <br class="sm:hidden"> Contact admin if you need access.
        </p>
        <div class="inline-flex items-center gap-2">
          <button @click="toggleTheme" class="theme-toggle-button" aria-label="Toggle theme">
            <SunIcon v-if="isDarkMode" class="h-5 w-5" />
            <MoonIcon v-else class="h-5 w-5" />
          </button>
          <button v-if="showDevControls" @click="showTestUI = !showTestUI" class="theme-toggle-button" aria-label="Toggle test UI elements">
             <BeakerIcon class="h-5 w-5" />
          </button>
        </div>
        <p v-if="showTestUI" class="text-xs text-gray-500 dark:text-gray-400">
          (Test UI elements are visible for development)
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file Login.vue
 * @description Login page for the Voice Coding Assistant.
 * Handles user authentication using a shared password and manages session persistence.
 * @version 1.1.0 - Refined UI, branding, and token storage logic.
 */
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
import { authAPI, api } from '../utils/api'; // Assuming api.ts handles Axios instance and token injection
import { LockClosedIcon, EyeIcon, EyeSlashIcon, ExclamationTriangleIcon, SunIcon, MoonIcon, BeakerIcon } from '@heroicons/vue/24/outline';

const router = useRouter();

// --- Theme State ---
const isDarkMode = useStorage('darkMode', false); // Synchronized with App.vue via localStorage

// --- Form Data ---
const password = ref('');
const rememberMe = useStorage('vca-rememberLoginPreference', true); // Persist the checkbox state itself
const showPassword = ref(false);
const isLoggingIn = ref(false);
const errorMessage = ref('');

// --- Development/Debug ---
// @ts-ignore
const showDevControls = ref(import.meta.env.DEV); // Show only in development
const showTestUI = ref(false);

// --- Methods ---
/**
 * Toggles the application's theme (dark/light mode).
 */
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
};

/**
 * Handles the login form submission.
 * Authenticates the user and manages token storage based on "Remember me" preference.
 */
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

    // Store token based on rememberMe preference
    // `localStorage` for "Remember me", `sessionStorage` otherwise.
    const storage = rememberMe.value ? localStorage : sessionStorage;
    storage.setItem('vcaAuthToken', response.data.token); // Use a specific key for clarity

    // Set default auth header for subsequent API requests in this session
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

    router.push('/'); // Redirect to home page on successful login
  } catch (error: any) {
    console.error('Login error details:', error.response || error);
    if (error.response?.status === 401) {
      errorMessage.value = 'Invalid password. Please check and try again.';
    } else if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = 'An unexpected error occurred during login. Please try again later.';
    }
  } finally {
    isLoggingIn.value = false;
  }
};

// --- Lifecycle Hooks ---
/**
 * On component mount, checks if the user is already authenticated.
 * If so, redirects them to the home page.
 * Also applies the dark mode class to the HTML element if enabled.
 */
onMounted(() => {
  // Check for existing token (more robustly, an API call to check status would be better)
  const token = localStorage.getItem('vcaAuthToken') || sessionStorage.getItem('vcaAuthToken');
  if (token) {
    // Potentially verify token with backend here before redirecting
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // Example: authAPI.checkStatus().then(() => router.push('/')).catch(() => clearTokenAndStay());
    console.log("User already has a token, redirecting to home.");
    router.push('/');
  }

  // Apply initial theme
  document.documentElement.classList.toggle('dark', isDarkMode.value);
});

/**
 * Watches for changes in `isDarkMode` to toggle the class on the HTML element.
 */
watch(isDarkMode, (newVal) => {
  document.documentElement.classList.toggle('dark', newVal);
});

</script>

<style scoped>
.login-page {
  /* Base background gradient */
}
.login-container {
  /* Max width and spacing for the central login box */
}
.login-card {
  position: relative;
  z-index: 1; /* Keep content above pseudo-element */
  overflow: hidden; /* Important for pseudo-element */
}
.login-card::before {
  content: '';
  position: absolute;
  top: -75%; /* Adjust to make the gradient larger and more diffuse */
  left: -75%;
  width: 250%;
  height: 250%;
  background-image: radial-gradient(circle at center, 
    rgba(var(--color-primary-500-rgb), 0.1) 0%,
    rgba(var(--color-primary-500-rgb), 0.05) 20%,
    transparent 50%
  );
  z-index: -1;
  animation: rotate-gradient 25s linear infinite;
  opacity: 0.7;
}
.dark .login-card::before {
  background-image: radial-gradient(circle at center, 
    rgba(var(--color-primary-400-rgb), 0.1) 0%,
    rgba(var(--color-primary-400-rgb), 0.05) 20%,
    transparent 50%
  );
  opacity: 0.5;
}

@keyframes rotate-gradient {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.form-input {
 @apply w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
         bg-white dark:bg-gray-700/50 
         text-gray-900 dark:text-white 
         placeholder-gray-400 dark:placeholder-gray-500 
         focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 
         focus:border-transparent transition-all;
}
.login-button {
  /* Gradient and hover effects are defined inline via Tailwind */
}
.error-alert {
  @apply bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-400 p-4 rounded-md shadow;
}
.theme-toggle-button {
 @apply p-2 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 
        hover:bg-gray-200 dark:hover:bg-gray-600/50 
        focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400
        transition-colors;
}

/* Define RGB versions of primary colors for RGBA usage */
:root {
  --color-primary-500-rgb: 59, 130, 246; /* Tailwind blue-500 */
  --color-primary-400-rgb: 96, 165, 250; /* Tailwind blue-400 */
}
</style>