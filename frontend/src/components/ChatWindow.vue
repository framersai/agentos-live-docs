<template>
  <div 
    ref="chatContainerRef" 
    class="h-[calc(100vh-10rem)] sm:h-[calc(100vh-12rem)] overflow-y-auto rounded-lg"
  >
    <div class="max-w-3xl mx-auto space-y-4 sm:space-y-6 px-1 sm:px-3">
      <!-- Welcome message if no messages -->
      <div v-if="messages.length === 0" class="p-4 sm:p-6 text-center card">
        <h2 class="mb-2 text-xl font-medium dark:text-white">Welcome to Voice Coding Assistant</h2>
        <p class="mb-4 text-gray-600 dark:text-gray-300">
          Click the microphone button below and ask a coding question, request a system design, or summarize a meeting.
        </p>
        <div class="flex flex-wrap justify-center gap-3 mt-4">
          <div class="px-3 py-2 text-sm bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-gray-300">
            "How do I implement a binary search in Python?"
          </div>
          <div class="px-3 py-2 text-sm bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-gray-300">
            "Design a scalable chat application"
          </div>
          <div class="px-3 py-2 text-sm bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-gray-300">
            "Summarize meeting notes about project timeline"
          </div>
        </div>
      </div>
      
      <!-- Messages -->
      <Message 
        v-for="(message, index) in messages" 
        :key="index" 
        :message="message" 
      />
      
      <!-- Loading indicator -->
      <div v-if="isLoading" class="flex items-center justify-center p-4">
        <div class="w-6 h-6 border-2 border-t-primary-500 border-primary-200 rounded-full animate-spin"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import Message from './Message.vue';

// Props
const props = defineProps<{
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  isLoading: boolean;
}>();

// Refs
const chatContainerRef = ref<HTMLElement | null>(null);
const isLandscape = ref(window.innerWidth > window.innerHeight);

// Methods
const scrollToBottom = () => {
  if (chatContainerRef.value) {
    chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight;
  }
};

// Watch for new messages to scroll down
watch(() => props.messages.length, () => {
  setTimeout(scrollToBottom, 100);
});

// Watch loading state changes
watch(() => props.isLoading, (newVal) => {
  if (newVal) {
    setTimeout(scrollToBottom, 100);
  }
});

// Check orientation to adjust styles
const updateOrientation = () => {
  isLandscape.value = window.innerWidth > window.innerHeight;
};

// Set up orientation listeners
onMounted(() => {
  window.addEventListener('resize', updateOrientation);
  window.addEventListener('orientationchange', updateOrientation);
  updateOrientation();
  
  // Initial scroll
  scrollToBottom();
});

// Clean up
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateOrientation);
  window.removeEventListener('orientationchange', updateOrientation);
});

// Expose methods to parent
defineExpose({
  scrollToBottom
});
</script>

<style scoped>
/* Custom scrollbar for chat window */
:deep(::-webkit-scrollbar) {
  width: 6px;
}

:deep(::-webkit-scrollbar-track) {
  @apply bg-gray-100 dark:bg-gray-800 rounded;
}

:deep(::-webkit-scrollbar-thumb) {
  @apply bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500;
}

/* Adjust container height based on orientation via JS */
.landscape-mode {
  height: calc(100vh - 12rem);
}

.portrait-mode {
  height: calc(100vh - 14rem);
}
</style>