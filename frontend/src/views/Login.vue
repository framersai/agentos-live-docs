<template>
  <div class="login-page min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="login-container w-full max-w-md space-y-8">
      <!-- Logo and Heading -->
      <div class="text-center">
        <div class="mx-auto h-24 w-24 overflow-hidden rounded-full shadow-xl bg-white dark:bg-gray-800 p-1 ring-2 ring-primary-100 dark:ring-primary-900">
          <img class="h-full w-full object-contain hover:scale-105 transition-all duration-500" src="@/assets/logo.svg" alt="Voice Coding Assistant Logo" />
        </div>
        <h1 class="mt-6 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700">Voice Coding</span> Assistant
        </h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Use your voice to code, design, and summarize meetings
        </p>
      </div>

      <!-- Login Form -->
      <div class="login-card p-8 rounded-2xl shadow-xl transition-all bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-100 dark:border-gray-700">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                tabindex="-1"
              >
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zM10 5a5 5 0 00-5 5c0 1.493.663 2.83 1.705 3.746l7.041-7.041A4.978 4.978 0 0010 5zm5 5a5 5 0 01-5 5c-1.493 0-2.83-.663-3.746-1.705L13.295 6.25A4.978 4.978 0 0115 10z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="remember-me" 
                  v-model="rememberMe" 
                  class="sr-only peer"
                />
                <div class="h-5 w-10 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </div>
              <label for="remember-me" class="block text-sm text-gray-700 dark:text-gray-300">
                Remember me
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoggingIn"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform transition-all hover:scale-[1.02] active:scale-[0.98] relative"
            >
              <div v-if="isLoggingIn" class="absolute inset-0 flex items-center justify-center">
                <div class="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
              <span :class="{ 'opacity-0': isLoggingIn }">Sign in</span>
            </button>
          </div>
          
          <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700 dark:text-red-300">{{ errorMessage }}</p>
              </div>
            </div>
          </div>

          <!-- Sample Buttons Showcase -->
          <div v-if="showTestUI" class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">UI Component Examples:</p>
            <div class="flex flex-wrap gap-2">
              <button class="px-3 py-1.5 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors">
                Primary
              </button>
              <button class="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Secondary
              </button>
              <button class="px-3 py-1.5 border border-primary-500 text-primary-500 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                Outline
              </button>
            </div>
          </div>
        </form>
      </div>
      
      <!-- Footer -->
      <div class="text-center mt-8">
        <div class="inline-flex items-center gap-2 mb-2">
          <button @click="toggleTheme" class="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </button>
          <button @click="showTestUI = !showTestUI" class="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          © {{ new Date().getFullYear() }} 
          <a href="https://manic.agency" target="_blank" rel="noopener" class="text-primary-500 hover:text-primary-600 transition-colors">
            Manic.Agency
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
// Remove: import axios from 'axios';
// Add:
import { authAPI, api } from '../utils/api';

// Router
const router = useRouter();

// Theme state
const isDarkMode = useStorage('darkMode', false);

// Form data
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);
const isLoggingIn = ref(false);
const errorMessage = ref('');
const showTestUI = ref(false);

// Toggle theme function
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
};

// Handle login
const handleLogin = async () => {
  if (!password.value) {
    errorMessage.value = 'Please enter a password';
    return;
  }
  
  try {
    isLoggingIn.value = true;
    errorMessage.value = '';
    
    const response = await authAPI.login({
      password: password.value,
      rememberMe: rememberMe.value
    });
    
    // Store token based on remember me preference
    const storage = rememberMe.value ? localStorage : sessionStorage;
    storage.setItem('token', response.data.token);
    
    // Set default auth header for future requests
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    
    // Redirect to home
    router.push('/');
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Show error message
    if (error.response?.status === 401) {
      errorMessage.value = 'Invalid password. Please try again.';
    } else {
      errorMessage.value = 'An error occurred. Please try again later.';
    }
  } finally {
    isLoggingIn.value = false;
  }
};

// Check if already logged in
onMounted(() => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    router.push('/');
  }
});
</script>

<style scoped>
.login-page {
  background-image: 
    radial-gradient(circle at 70% 30%, rgba(20, 184, 166, 0.1) 0%, transparent 60%),
    radial-gradient(circle at 30% 70%, rgba(20, 184, 166, 0.1) 0%, transparent 60%);
}

.dark .login-page {
  background-image: 
    radial-gradient(circle at 70% 30%, rgba(20, 184, 166, 0.05) 0%, transparent 60%),
    radial-gradient(circle at 30% 70%, rgba(20, 184, 166, 0.05) 0%, transparent 60%);
}

.login-card {
  position: relative;
  z-index: 10;
  overflow: hidden;
}

.login-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(20, 184, 166, 0.07), transparent 70%);
  transform: rotate(0deg);
  z-index: -1;
  animation: rotate-gradient 15s linear infinite;
}

.dark .login-card::before {
  background: radial-gradient(circle at center, rgba(20, 184, 166, 0.05), transparent 70%);
}

@keyframes rotate-gradient {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>