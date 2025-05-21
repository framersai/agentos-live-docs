<template>
  <div class="flex flex-col min-h-screen app-container">
    <!-- Header -->
    <Header 
      :session-cost="sessionCost" 
      :mode="mode" 
      :language="language" 
      :generate-diagram="generateDiagram"
      @update:mode="mode = $event"
      @update:language="language = $event"
      @update:generate-diagram="generateDiagram = $event"
      @toggle-theme="toggleTheme"
      @logout="logout"
    />
    
    <!-- Main Content Area -->
    <main class="flex-1 p-2 sm:p-4 md:p-6 pt-2 overflow-hidden relative">
      <div class="relative max-w-6xl mx-auto">
        <div class="absolute top-0 left-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -z-10"></div>
        <div class="absolute top-1/3 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
        
        <ChatWindow 
          ref="chatWindowRef"
          :messages="messages" 
          :is-loading="isProcessing"
        />
      </div>
    </main>
    
    <!-- Voice Input Area -->
    <div class="chat-input-container py-3 px-4 sm:py-4 border-t dark:border-gray-800 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 relative z-30">
      <div class="max-w-3xl mx-auto">
        <VoiceInput 
          @transcription="handleTranscription" 
          :is-processing="isProcessing"
          ref="voiceInputRef"
        />
      </div>
    </div>
    
    <!-- Footer -->
    <Footer ref="footerRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
import axios from 'axios';
import Header from '../components/Header.vue';
import ChatWindow from '../components/ChatWindow.vue';
import VoiceInput from '../components/VoiceInput.vue';
import Footer from '../components/Footer.vue';

// Router
const router = useRouter();

// Refs
const chatWindowRef = ref<InstanceType<typeof ChatWindow> | null>(null);
const voiceInputRef = ref<InstanceType<typeof VoiceInput> | null>(null);
const footerRef = ref<InstanceType<typeof Footer> | null>(null);
const messages = ref<Array<{ role: string; content: string; }>>([]);
const isProcessing = ref(false);
const sessionCost = ref(0);
const isLandscape = ref(window.innerWidth > window.innerHeight);

// Settings
const mode = useStorage('mode', 'coding');
const language = useStorage('language', 'python');
const generateDiagram = useStorage('generateDiagram', true);
const isDarkMode = useStorage('darkMode', false);

// Set up axios auth header
onMounted(() => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    footerRef.value?.addLog('info', 'User authenticated successfully');
  } else {
    router.push('/login');
    return;
  }
  
  // Get current session cost
  fetchSessionCost();
  
  // Set up orientation change detection
  const checkOrientation = () => {
    isLandscape.value = window.innerWidth > window.innerHeight;
  };
  
  window.addEventListener('resize', checkOrientation);
  window.addEventListener('orientationchange', checkOrientation);
  
  // Add welcome message
  setTimeout(() => {
    messages.value.push({ 
      role: 'assistant', 
      content: `# Welcome to Voice Coding Assistant!
      
I'm ready to help with your ${mode.value === 'coding' ? 'coding questions' : mode.value === 'system_design' ? 'system design needs' : 'meeting summaries'}.

Just press the microphone button and start speaking. I'll transcribe your voice and provide detailed responses.

How can I assist you today?`
    });
    
    footerRef.value?.addLog('info', 'Application ready for voice input');
  }, 500);
  
  // Clean up event listeners on unmount
  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkOrientation);
    window.removeEventListener('orientationchange', checkOrientation);
  });
  
  // Load the UX enhancements
  loadUxEnhancements();
});

// Load UX enhancements
const loadUxEnhancements = () => {
  try {
    // This would normally be imported as a module, but for this example we'll simulate it
    const script = document.createElement('script');
    script.src = '/src/assets/js/ux-enhancements.js';
    script.async = true;
    document.body.appendChild(script);
    
    script.onload = () => {
      footerRef.value?.addLog('info', 'UI enhancements loaded');
    };
    
    script.onerror = () => {
      footerRef.value?.addLog('warning', 'Failed to load UI enhancements');
    };
  } catch (error) {
    console.error('Error loading UX enhancements:', error);
  }
};

// Fetch current session cost
const fetchSessionCost = async () => {
  try {
    const response = await axios.get('/api/cost');
    sessionCost.value = response.data.sessionCost;
    footerRef.value?.addLog('info', `Session cost updated: $${sessionCost.value.toFixed(4)}`);
  } catch (error) {
    console.error('Error fetching session cost:', error);
    footerRef.value?.addLog('error', 'Failed to fetch session cost');
  }
};

// Toggle theme
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  footerRef.value?.addLog('info', `Theme switched to ${isDarkMode.value ? 'dark' : 'light'} mode`);
};

// Logout function
const logout = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  delete axios.defaults.headers.common['Authorization'];
  router.push('/login');
  
  footerRef.value?.addLog('info', 'User logged out');
};

// Handle user transcription
const handleTranscription = async (text: string) => {
  if (!text.trim()) return;
  
  // Add user message
  messages.value.push({ role: 'user', content: text });
  footerRef.value?.addLog('info', 'Processing voice input');
  
  // Scroll to bottom of chat
  setTimeout(() => {
    chatWindowRef.value?.scrollToBottom();
  }, 100);
  
  // Set processing state
  isProcessing.value = true;
  
  try {
    // Call chat API
    footerRef.value?.addLog('info', `Sending request to ${mode.value} API`);
    const response = await axios.post('/api/chat', {
      mode: mode.value,
      messages: messages.value,
      language: language.value,
      generateDiagram: generateDiagram.value
    });
    
    // Add AI response to messages
    messages.value.push({ role: 'assistant', content: response.data.message });
    footerRef.value?.addLog('info', 'Received AI response');
    
    // Update session cost
    sessionCost.value = response.data.sessionCost;
    footerRef.value?.addLog('info', `Session cost updated: $${sessionCost.value.toFixed(4)}`);
    
    // Scroll to bottom of chat after response
    setTimeout(() => {
      chatWindowRef.value?.scrollToBottom();
    }, 100);
  } catch (error: any) {
    console.error('Chat API error:', error);
    footerRef.value?.addLog('error', `API error: ${error.message || 'Unknown error'}`);
    
    // Add error message
    messages.value.push({ 
      role: 'assistant', 
      content: 'Sorry, there was an error processing your request. Please try again.' 
    });
    
    // Handle cost threshold errors
    if (error.response?.status === 403) {
      messages.value.push({ 
        role: 'assistant', 
        content: 'Session cost threshold reached. Please contact administrator to increase your limit.'
      });
      sessionCost.value = error.response.data.currentCost;
      footerRef.value?.addLog('warning', 'Cost threshold exceeded');
    }
  } finally {
    isProcessing.value = false;
  }
};
</script>

<style scoped>
.app-container {
  background-image: 
    radial-gradient(circle at 90% 10%, rgba(20, 184, 166, 0.05) 0%, transparent 40%),
    radial-gradient(circle at 10% 90%, rgba(20, 184, 166, 0.05) 0%, transparent 40%);
}

.dark .app-container {
  background-image: 
    radial-gradient(circle at 90% 10%, rgba(20, 184, 166, 0.03) 0%, transparent 40%),
    radial-gradient(circle at 10% 90%, rgba(20, 184, 166, 0.03) 0%, transparent 40%);
}
</style>