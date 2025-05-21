<template>
  <div class="max-w-3xl mx-auto py-4 sm:py-8 px-3 sm:px-4">
    <!-- Mobile header with back button -->
    <div class="sm:hidden flex items-center mb-4">
      <button @click="router.push('/')" class="mr-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <h1 class="text-xl font-bold dark:text-white">Settings</h1>
    </div>
    
    <div class="card">
      <!-- Desktop header -->
      <div class="hidden sm:block">
        <h1 class="text-2xl font-bold mb-6 dark:text-white">Settings</h1>
      </div>
      
      <div class="space-y-6">
        <!-- Appearance Section -->
        <section>
          <h2 class="text-lg font-semibold mb-4 dark:text-white">Appearance</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <label class="text-gray-700 dark:text-gray-300">Dark Mode</label>
              <div class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="isDarkMode" 
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- General Settings -->
        <section>
          <h2 class="text-lg font-semibold mb-4 dark:text-white">General</h2>
          <div class="space-y-4">
            <div class="flex flex-col sm:grid sm:grid-cols-2 sm:gap-4">
              <div class="mb-4 sm:mb-0">
                <label for="defaultMode" class="mb-2 text-gray-700 dark:text-gray-300">Default Mode</label>
                <select id="defaultMode" v-model="defaultMode" class="select mt-1">
                  <option value="coding">Coding Q&A</option>
                  <option value="system_design">System Design</option>
                  <option value="meeting">Meeting Summary</option>
                </select>
              </div>
              
              <div>
                <label for="defaultLanguage" class="mb-2 text-gray-700 dark:text-gray-300">Default Programming Language</label>
                <select id="defaultLanguage" v-model="defaultLanguage" class="select mt-1">
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="java">Java</option>
                  <option value="c++">C++</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                </select>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <label class="text-gray-700 dark:text-gray-300">Generate Diagrams</label>
              <div class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="generateDiagrams" 
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Voice Input Settings -->
        <section>
          <h2 class="text-lg font-semibold mb-4 dark:text-white">Voice Recognition</h2>
          <div class="space-y-4">
            <div class="flex flex-col">
              <label for="speechPreference" class="mb-2 text-gray-700 dark:text-gray-300">Speech Recognition Method</label>
              <select id="speechPreference" v-model="speechPreference" class="select">
                <option value="whisper">OpenAI Whisper (More Accurate)</option>
                <option value="webspeech">Browser Web Speech API (Faster, Free)</option>
              </select>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Whisper provides better accuracy but uses API credits. Web Speech is free but less accurate.
              </p>
            </div>
          </div>
        </section>
        
        <!-- Session Settings -->
        <section>
          <h2 class="text-lg font-semibold mb-4 dark:text-white">Session</h2>
          <div class="space-y-4">
            <div>
              <p class="text-gray-700 dark:text-gray-300">Current Session Cost: ${{ sessionCost.toFixed(3) }}</p>
              <button @click="resetSession" class="mt-2 btn-secondary text-sm">
                Reset Session Cost
              </button>
            </div>
            
            <div class="flex flex-col">
              <label for="costThreshold" class="mb-2 text-gray-700 dark:text-gray-300">
                Cost Threshold: ${{ costThreshold.toFixed(2) }}
              </label>
              <input 
                id="costThreshold" 
                v-model="costThreshold" 
                type="range" 
                min="1" 
                max="10" 
                step="0.5"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              >
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Maximum amount to spend in a session before requiring confirmation.
              </p>
            </div>
          </div>
        </section>
        
        <!-- Security Section -->
        <section>
          <h2 class="text-lg font-semibold mb-4 dark:text-white">Security</h2>
          <div class="space-y-4">
            <div>
              <button @click="logout" class="btn-primary">
                Logout
              </button>
            </div>
            
            <div class="flex items-center justify-between">
              <label class="text-gray-700 dark:text-gray-300">Remember Login</label>
              <div class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="rememberLogin" 
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <!-- Save button -->
      <div class="mt-8 flex justify-between sm:justify-end">
        <button @click="router.push('/')" class="btn-secondary mr-2 sm:hidden">
          Cancel
        </button>
        <button @click="saveSettings" class="btn-primary">
          Save Settings
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
import axios from 'axios';

// Router
const router = useRouter();

// Settings variables with local storage
const isDarkMode = useStorage('darkMode', false);
const defaultMode = useStorage('mode', 'coding');
const defaultLanguage = useStorage('language', 'python');
const generateDiagrams = useStorage('generateDiagram', true);
const speechPreference = useStorage('speechPreference', 'whisper');
const costThreshold = useStorage('costThreshold', 5.0);
const rememberLogin = useStorage('rememberLogin', true);

// Session cost (fetched from API)
const sessionCost = ref(0);

// Orientation check
const isLandscape = ref(window.innerWidth > window.innerHeight);

// Check orientation
const updateOrientation = () => {
  isLandscape.value = window.innerWidth > window.innerHeight;
};

// Fetch session cost on mount
onMounted(async () => {
  await fetchSessionCost();
  
  // Set up orientation detection
  window.addEventListener('resize', updateOrientation);
  window.addEventListener('orientationchange', updateOrientation);
  updateOrientation();
});

// Clean up event listeners
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateOrientation);
  window.removeEventListener('orientationchange', updateOrientation);
});

// Fetch current session cost
const fetchSessionCost = async () => {
  try {
    const response = await axios.get('/api/cost');
    sessionCost.value = response.data.sessionCost;
  } catch (error) {
    console.error('Error fetching session cost:', error);
  }
};

// Reset session cost
const resetSession = async () => {
  try {
    await axios.post('/api/cost', { reset: true });
    await fetchSessionCost();
  } catch (error) {
    console.error('Error resetting session:', error);
  }
};

// Logout function
const logout = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  delete axios.defaults.headers.common['Authorization'];
  router.push('/login');
};

// Save settings
const saveSettings = () => {
  // Settings are automatically saved via useStorage
  // Just provide feedback to the user
  alert('Settings saved successfully!');
  router.push('/');
};

// Watch for dark mode changes
watch(isDarkMode, (newVal) => {
  if (newVal) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, { immediate: true });
</script>