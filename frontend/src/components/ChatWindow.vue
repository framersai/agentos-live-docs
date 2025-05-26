<template>
  <div
    ref="chatContainerRef"
    class="h-[calc(100vh-10rem)] sm:h-[calc(100vh-12rem)] overflow-y-auto rounded-lg"
    :class="isLandscape ? 'landscape-mode' : 'portrait-mode'" >
    <div class="max-w-3xl mx-auto space-y-4 sm:space-y-6 px-1 sm:px-3">
      <div v-if="messages.length === 0 && !isLoading" class="p-4 sm:p-6 text-center card"> <h2 class="mb-2 text-xl font-medium dark:text-white">Welcome to Voice Coding Assistant</h2>
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

      <Message
        v-for="(message, index) in messages"
        :key="index" :message="message"
      />

      <div v-if="isLoading" class="flex items-center justify-center p-4">
        <div class="w-6 h-6 border-2 border-t-primary-500 border-primary-200 rounded-full animate-spin"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, nextTick } from 'vue';
import Message from './Message.vue'; // Assuming MessageData will be implicitly handled by Message.vue's props

// Define the expected shape of a message, matching Message.vue's MessageData for 'role'
interface ChatWindowMessage {
  role: 'user' | 'assistant'; // This is the crucial fix
  content: string;
  timestamp?: number; // Include if timestamps are passed from the parent
  // Add any other properties that might be part of the message object, e.g., id
}

// Props
const props = defineProps<{
  messages: Array<ChatWindowMessage>; // Use the corrected type here
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

// Watch for new messages or loading state changes to scroll down
watch(
  () => [props.messages.length, props.isLoading],
  ([messagesLength, isLoadingValue], [prevMessagesLength, prevIsLoadingValue]) => {
    // Scroll if messages are added or if loading starts (to show spinner at bottom)
    if (messagesLength !== prevMessagesLength || (isLoadingValue && !prevIsLoadingValue)) {
      nextTick(() => { // Use nextTick to ensure DOM has updated
        scrollToBottom();
      });
    }
  },
  { flush: 'post' } // flush: 'post' can also help ensure DOM updates before scrolling
);


// Check orientation to adjust styles
const updateOrientation = () => {
  isLandscape.value = window.innerWidth > window.innerHeight;
};

// Set up orientation listeners
onMounted(() => {
  window.addEventListener('resize', updateOrientation);
  // 'orientationchange' is less reliable than 'resize' for modern devices/browsers
  // window.addEventListener('orientationchange', updateOrientation);
  updateOrientation();

  // Initial scroll after mount
  nextTick(scrollToBottom);
});

// Clean up
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateOrientation);
  // window.removeEventListener('orientationchange', updateOrientation);
});

// Expose methods to parent
defineExpose({
  scrollToBottom
});
</script>

<style scoped>
/* Custom scrollbar for chat window */
/* :deep() is deprecated in Vue 3 for scoped styles, use ::v-deep or :global if necessary, */
/* but for general browser scrollbars, direct styling is often better in a global stylesheet. */
/* For this component-specific scrollbar, this is okay. */
div::-webkit-scrollbar { /* Target the div directly for webkit */
  width: 6px;
}

div::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800 rounded;
}

div::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500;
}

/* Firefox scrollbar - add if needed */
/*
.chat-container {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.gray.300') theme('colors.gray.100');
}
.dark .chat-container {
  scrollbar-color: theme('colors.gray.600') theme('colors.gray.800');
}
*/

/* Adjust container height based on orientation via JS-controlled class */
/* These classes are not strictly necessary if the Tailwind class directly uses isLandscape,
   but kept if you prefer explicit class names. The template was updated to use these. */
.landscape-mode {
  /* Example, adjust as needed or remove if Tailwind classes in template are sufficient */
  /* height: calc(100vh - 10rem); /* Example value, was sm:h-[calc(100vh-12rem)] */
}

.portrait-mode {
  /* Example, adjust as needed or remove */
  /* height: calc(100vh - 10rem); /* Example value, was h-[calc(100vh-10rem)] */
}
</style>