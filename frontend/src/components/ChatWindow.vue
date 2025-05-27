// File: frontend/src/components/ChatWindow.vue
<template>
  <div
    ref="chatContainerRef"
    class="chat-window-container"
    :class="[
      isLandscape ? 'landscape-mode' : 'portrait-mode',
      'p-2 sm:p-4 md:p-6 scrollbar-thin'
    ]"
    role="log"
    aria-live="polite"
  >
    <div class="chat-messages-wrapper">
      <div v-if="messages.length === 0 && !isLoading" class="welcome-placeholder card-base">
        <div class="text-center p-6 sm:p-8">
          <img src="/src/assets/logo.svg" alt="VCA Logo" class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 opacity-70 animate-pulse-subtle" />
          <h2 class="text-2xl sm:text-3xl font-display font-bold text-neutral-text mb-3 text-glow-primary">
            Voice Chat Assistant
          </h2>
          <p class="text-neutral-text-secondary mb-6 text-sm sm:text-base leading-relaxed">
            Ready to assist you. Click the microphone or type your query below.
            Ask about coding, system design, or just chat!
          </p>
          <div class="example-prompts-grid">
            <div class="prompt-tag">"Binary search in Python?"</div>
            <div class="prompt-tag">"Design a chat app"</div>
            <div class="prompt-tag">"Summarize project notes"</div>
          </div>
        </div>
      </div>

      <Message
        v-for="(message, index) in messages"
        :key="message.id || index"
        :message="message"
        class="my-2 sm:my-3"
      />

      <div v-if="isLoading" class="loading-indicator-chat">
        <div class="spinner">
          <div v-for="i in 3" :key="`dot-${i}`" class="dot"></div>
        </div>
        <p class="text-sm text-neutral-text-muted ml-2">Assistant is thinking...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, nextTick, type PropType } from 'vue';
import Message from './Message.vue'; // Assuming MessageData will be implicitly handled by Message.vue's props
import type { ChatMessage as StoreChatMessage } from '@/store/chat.store'; // Using the more complete type from store

// Define the expected shape of a message, aligning with StoreChatMessage
interface ChatWindowMessage extends Omit<StoreChatMessage, 'agentId'> {
  // agentId is not directly needed for rendering individual messages here,
  // but it's part of the full StoreChatMessage type.
  // If Message.vue needs agentId, it should be included.
}

// Props
const props = defineProps({
  messages: {
    type: Array as PropType<Array<ChatWindowMessage>>,
    required: true,
  },
  isLoading: {
    type: Boolean,
    required: true,
  }
});

// Refs
const chatContainerRef = ref<HTMLElement | null>(null);
const isLandscape = ref(false); // Initial value, will be updated

// Methods
/**
 * @function scrollToBottom
 * @description Scrolls the chat container to the latest message.
 * Ensures that the most recent interactions are always visible.
 */
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
      nextTick(() => {
        scrollToBottom();
      });
    }
  },
  { flush: 'post' } // Ensures DOM updates before scrolling
);

/**
 * @function updateOrientation
 * @description Updates the isLandscape ref based on window dimensions.
 * Used for applying orientation-specific styles if needed.
 */
const updateOrientation = () => {
  if (typeof window !== 'undefined') {
    isLandscape.value = window.innerWidth > window.innerHeight;
  }
};

// Lifecycle Hooks
onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateOrientation);
    updateOrientation(); // Initial check
  }
  nextTick(scrollToBottom); // Initial scroll after mount
});

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateOrientation);
  }
});

// Expose methods to parent
defineExpose({
  scrollToBottom
});
</script>

<style scoped lang="postcss">
.chat-window-container {
  @apply h-full overflow-y-auto relative bg-neutral-bg/30 dark:bg-neutral-bg-subtle/30;
  /* Subtle holographic grid background */
  background-image: theme('backgroundImage.holo-grid');
  background-size: theme('backgroundSize.holo-grid-size');
  animation: holo-grid-scroll-anim 120s linear infinite; /* Slower scroll */
}

.chat-messages-wrapper {
  @apply max-w-4xl mx-auto space-y-3 sm:space-y-4 pb-4; /* Added padding-bottom */
}

.welcome-placeholder {
  @apply mt-4 sm:mt-8 border-neutral-border/50 shadow-lg transition-all duration-500 ease-out hover:shadow-xl;
  /* Consider adding a subtle holographic border or glow on hover */
}

.example-prompts-grid {
  @apply flex flex-wrap justify-center items-center gap-2 sm:gap-3 mt-6;
}

.prompt-tag {
  @apply px-3 py-1.5 text-xs sm:text-sm bg-primary-500/10 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 rounded-full border border-primary-500/20 dark:border-primary-500/30 cursor-default transition-all duration-200 hover:bg-primary-500/20 dark:hover:bg-primary-500/30 hover:shadow-sm;
  font-family: var(--font-mono);
}

.loading-indicator-chat {
  @apply flex items-center justify-center p-4 text-neutral-text-muted;
}

/* Simple dots spinner */
.spinner {
  @apply flex space-x-1.5;
}
.dot {
  @apply w-2 h-2 bg-primary-500 rounded-full animate-pulse-subtle;
}
.dot:nth-child(1) { animation-delay: 0s; }
.dot:nth-child(2) { animation-delay: 0.15s; }
.dot:nth-child(3) { animation-delay: 0.3s; }

/* The component specific scrollbar styling is now in main.css with ::-webkit-scrollbar */
/* However, if you need very specific scrollbar for JUST this component, you can use: */
/*
.chat-window-container::-webkit-scrollbar { width: 8px; }
.chat-window-container::-webkit-scrollbar-track { @apply bg-neutral-bg/50 rounded; }
.chat-window-container::-webkit-scrollbar-thumb { @apply bg-primary-500/50 rounded hover:bg-primary-500/70; }
*/
</style>