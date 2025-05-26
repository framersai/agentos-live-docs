// File: frontend/src/views/PublicHome.vue
/**
 * @file Public Home View
 * @description Public-facing home page with rate-limited access
 * @version 1.0.0
 */

<template>
  <div class="public-home-container min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-850 dark:to-blue-950">
    <!-- Header -->
    <header class="sticky top-0 z-30 glass-pane shadow-lg border-b border-blue-200/50 dark:border-blue-800/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img src="/src/assets/logo.svg" alt="Voice Chat Assistant Logo" class="w-10 h-10 sm:w-12 sm:h-12 animate-pulse-slow" />
            <div>
              <h1 class="text-xl sm:text-2xl font-bold">
                <span class="animated-title">
                  <span class="letter-v">V</span>
                  <span class="letter-o">o</span>
                  <span class="letter-i">i</span>
                  <span class="letter-c">c</span>
                  <span class="letter-e">e</span>
                  <span class="letter-space"> </span>
                  <span class="letter-c2">C</span>
                  <span class="letter-h">h</span>
                  <span class="letter-a">a</span>
                  <span class="letter-t">t</span>
                  <span class="letter-space"> </span>
                  <span class="letter-a2">A</span>
                  <span class="letter-s">s</span>
                  <span class="letter-s2">s</span>
                  <span class="letter-i2">i</span>
                  <span class="letter-s3">s</span>
                  <span class="letter-t">t</span>
                  <span class="letter-a3">a</span>
                  <span class="letter-n">n</span>
                  <span class="letter-t2">t</span>
                </span>
              </h1>
              <p class="text-xs text-gray-600 dark:text-gray-400">Public Access</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div v-if="rateLimitInfo" class="hidden sm:flex items-center gap-2 text-sm">
              <span class="text-gray-600 dark:text-gray-400">Usage:</span>
              <div class="flex items-center gap-1">
                <div class="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                    :style="{ width: `${(rateLimitInfo.used / rateLimitInfo.limit) * 100}%` }"
                  ></div>
                </div>
                <span class="text-xs text-gray-500">{{ rateLimitInfo.remaining }}/{{ rateLimitInfo.limit }}</span>
              </div>
            </div>
            <router-link to="/login" class="btn-primary btn-sm">
              <KeyIcon class="w-4 h-4 mr-1" />
              Unlock Pro
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- Hero Section -->
        <section class="hero-section py-12 px-4">
          <div class="max-w-4xl mx-auto text-center">
            <div class="mb-8">
              <h2 class="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                AI-Powered Voice Assistant
              </h2>
              <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300">
                Experience the future of coding assistance with limited free access
              </p>
            </div>

            <!-- Feature Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div class="feature-card glass-pane p-6 hover:scale-105 transition-transform">
                <MicrophoneIcon class="w-12 h-12 mx-auto mb-4 text-blue-500" />
                <h3 class="font-semibold mb-2">Voice-First Interface</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">Natural speech recognition for seamless interaction</p>
              </div>
              <div class="feature-card glass-pane p-6 hover:scale-105 transition-transform">
                <CpuChipIcon class="w-12 h-12 mx-auto mb-4 text-purple-500" />
                <h3 class="font-semibold mb-2">AI-Powered Responses</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">Intelligent assistance for coding and more</p>
              </div>
              <div class="feature-card glass-pane p-6 hover:scale-105 transition-transform">
                <ChartBarIcon class="w-12 h-12 mx-auto mb-4 text-pink-500" />
                <h3 class="font-semibold mb-2">Limited Free Access</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ rateLimitInfo?.limit || 100 }} requests per day</p>
              </div>
            </div>

            <!-- Rate Limit Warning -->
            <div v-if="rateLimitInfo && rateLimitInfo.remaining < 20" class="mb-8">
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-lg">
                <ExclamationTriangleIcon class="w-5 h-5" />
                <span>Only {{ rateLimitInfo.remaining }} requests remaining today</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Chat Interface -->
        <section class="chat-section flex-1 px-4 pb-4">
          <div class="max-w-4xl mx-auto">
            <div class="glass-pane rounded-xl shadow-xl overflow-hidden">
              <!-- Messages -->
              <div class="messages-container h-96 overflow-y-auto p-4">
                <div v-if="messages.length === 0" class="text-center py-12">
                  <SparklesIcon class="w-16 h-16 mx-auto mb-4 text-gray-400 animate-pulse" />
                  <p class="text-gray-600 dark:text-gray-400">Start a conversation with your AI assistant</p>
                  <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">{{ rateLimitInfo?.remaining || 0 }} requests remaining today</p>
                </div>
                <div v-else class="space-y-4">
                  <Message 
                    v-for="(message, index) in messages" 
                    :key="index" 
                    :message="message" 
                  />
                </div>
                <div v-if="isLoading" class="flex justify-center py-4">
                  <div class="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>

              <!-- Input Section -->
              <div class="border-t border-gray-200 dark:border-gray-700 p-4">
                <div v-if="rateLimitInfo && rateLimitInfo.remaining === 0" class="text-center py-4">
                  <p class="text-red-600 dark:text-red-400 font-medium mb-2">Daily limit reached</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Resets at {{ formatResetTime(rateLimitInfo.resetAt) }}</p>
                  <router-link to="/login" class="btn-primary">
                    Unlock Unlimited Access
                  </router-link>
                </div>
                <div v-else>
                  <VoiceInput
                    :is-processing="isLoading"
                    :audio-mode="audioMode"
                    @transcription="handleTranscription"
                    @update:audio-mode="val => audioMode = val"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="cta-section py-12 px-4">
          <div class="max-w-4xl mx-auto text-center">
            <div class="glass-pane p-8 rounded-xl">
              <h3 class="text-2xl font-bold mb-4">Want Unlimited Access?</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6">
                Unlock the full power of Voice Chat Assistant with premium features
              </p>
              <div class="flex flex-wrap justify-center gap-4">
                <router-link to="/login" class="btn-primary">
                  <LockClosedIcon class="w-5 h-5 mr-2" />
                  Login for Pro Access
                </router-link>
                <router-link to="/about" class="btn-secondary">
                  Learn More
                </router-link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, inject } from 'vue';
import { useRouter } from 'vue-router';
import { api, chatAPI } from '../utils/api';
import VoiceInput from '../components/VoiceInput.vue';
import Message from '../components/Message.vue';
import {
  MicrophoneIcon,
  CpuChipIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  LockClosedIcon,
  KeyIcon
} from '@heroicons/vue/24/outline';

interface RateLimitInfo {
  used: number;
  limit: number;
  remaining: number;
  resetAt: Date;
}

const router = useRouter();
const toast = inject('toast') as any;

const messages = ref<Array<{ role: string; content: string; timestamp: number }>>([]);
const isLoading = ref(false);
const audioMode = ref('push-to-talk');
const rateLimitInfo = ref<RateLimitInfo | null>(null);

// Fetch rate limit info
const fetchRateLimitInfo = async () => {
  try {
    const response = await api.get('/api/rate-limit/status');
    rateLimitInfo.value = {
      ...response.data,
      resetAt: new Date(response.data.resetAt)
    };
  } catch (error) {
    console.error('Failed to fetch rate limit info:', error);
  }
};

// Handle transcription
const handleTranscription = async (transcription: string) => {
  if (!transcription.trim() || isLoading.value) return;
  
  if (rateLimitInfo.value && rateLimitInfo.value.remaining === 0) {
    toast?.add({
      type: 'error',
      title: 'Rate Limit Exceeded',
      message: 'You have reached your daily limit. Please try again tomorrow or login for unlimited access.'
    });
    return;
  }

  const userMessage = {
    role: 'user',
    content: transcription,
    timestamp: Date.now()
  };
  
  messages.value.push(userMessage);
  isLoading.value = true;

  try {
    const response = await chatAPI.sendMessage({
      messages: [userMessage],
      mode: 'general',
      language: 'python'
    });

    messages.value.push({
      role: 'assistant',
      content: response.data.content,
      timestamp: Date.now()
    });

    // Update rate limit info
    await fetchRateLimitInfo();
  } catch (error: any) {
    console.error('Chat error:', error);
    
    if (error.response?.status === 429) {
      toast?.add({
        type: 'error',
        title: 'Rate Limit Exceeded',
        message: 'Please try again tomorrow or login for unlimited access.'
      });
      await fetchRateLimitInfo();
    } else {
      messages.value.push({
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now()
      });
    }
  } finally {
    isLoading.value = false;
  }
};

// Format reset time
const formatResetTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

onMounted(() => {
  fetchRateLimitInfo();
  // Refresh rate limit info every minute
  setInterval(fetchRateLimitInfo, 60000);
});
</script>

<style scoped>
/* Animated Title */
.animated-title {
  @apply inline-flex items-center;
}

.animated-title span {
  @apply inline-block transition-all duration-300;
  animation: titleWave 3s ease-in-out infinite;
}

.letter-v { animation-delay: 0s; color: #3b82f6; }
.letter-o { animation-delay: 0.1s; color: #6366f1; }
.letter-i { animation-delay: 0.2s; color: #8b5cf6; }
.letter-c { animation-delay: 0.3s; color: #a855f7; }
.letter-e { animation-delay: 0.4s; color: #c026d3; }
.letter-c2 { animation-delay: 0.5s; color: #3b82f6; }
.letter-h { animation-delay: 0.6s; color: #6366f1; }
.letter-a { animation-delay: 0.7s; color: #8b5cf6; }
.letter-t { animation-delay: 0.8s; color: #a855f7; }
.letter-a2 { animation-delay: 0.9s; color: #3b82f6; }
.letter-s { animation-delay: 1s; color: #6366f1; }
.letter-s2 { animation-delay: 1.1s; color: #8b5cf6; }
.letter-i2 { animation-delay: 1.2s; color: #a855f7; }
.letter-s3 { animation-delay: 1.3s; color: #c026d3; }
.letter-t2 { animation-delay: 1.4s; color: #3b82f6; }
.letter-a3 { animation-delay: 1.5s; color: #6366f1; }
.letter-n { animation-delay: 1.6s; color: #8b5cf6; }
.letter-t3 { animation-delay: 1.7s; color: #a855f7; }

@keyframes titleWave {
  0%, 100% {
    transform: translateY(0) scale(1);
    filter: brightness(1);
  }
  50% {
    transform: translateY(-5px) scale(1.1);
    filter: brightness(1.2) drop-shadow(0 0 10px currentColor);
  }
}

/* Loading Dots */
.loading-dots {
  @apply flex items-center gap-1;
}

.loading-dots span {
  @apply w-2 h-2 bg-blue-500 rounded-full animate-bounce;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.1s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.2s;
}

/* Glass Pane */
.glass-pane {
  @apply bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50;
}

/* Buttons */
.btn-primary {
  @apply inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl;
}

.btn-secondary {
  @apply inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200;
}

.btn-sm {
  @apply text-sm px-3 py-1.5;
}

/* Animations */
@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 5s ease infinite;
}

.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>