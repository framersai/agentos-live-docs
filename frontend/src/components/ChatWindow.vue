// File: frontend/src/components/ChatWindow.vue
/**
 * @file ChatWindow.vue
 * @description Main panel for displaying chat messages with "Ephemeral Harmony" styling.
 * Manages message rendering, welcome placeholder, and loading state indication.
 * @version 3.0.0 - Enhanced holographic styling and refined placeholder/loading states.
 */
<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, nextTick, type PropType, computed } from 'vue';
import Message from './Message.vue';
import type { ChatMessage as StoreChatMessage } from '@/store/chat.store';
import { useAgentStore } from '@/store/agent.store';
import { agentService } from '@/services/agent.service';

// Props
const props = defineProps({
  /**
   * @prop {Array<StoreChatMessage>} messages - Array of chat messages to display.
   */
  messages: {
    type: Array as PropType<Array<StoreChatMessage>>,
    required: true,
  },
  /**
   * @prop {boolean} isLoading - Indicates if the assistant is currently loading a response.
   */
  isLoading: {
    type: Boolean,
    required: true,
  }
});

// Refs
const chatContainerRef = ref<HTMLElement | null>(null);
const agentStore = useAgentStore();

// Computed properties
const currentAgent = computed(() => agentStore.activeAgent || agentService.getDefaultAgent());

const welcomeTitle = computed(() => {
  if (currentAgent.value?.id === 'general' || !currentAgent.value) {
    return "Voice Chat Assistant";
  }
  return `${currentAgent.value.label}`;
});

const welcomeSubtitle = computed(() => {
  if (currentAgent.value?.id === 'general' || !currentAgent.value) {
    return "Ready to assist. How can I help you today? Try asking about coding, system design, or just chat!";
  }
  return currentAgent.value.description || `The ${currentAgent.value.label} is ready. What's on your mind?`;
});

const examplePrompts = computed(() => {
  return currentAgent.value?.examplePrompts || [
    "Explain Python decorators",
    "Design a scalable chat app",
    "Summarize this meeting's key points",
    "Brainstorm ideas for a new project"
  ];
});


// Methods
/**
 * @function scrollToBottom
 * @description Scrolls the chat container to the latest message.
 * Uses smooth scrolling for a better user experience.
 */
const scrollToBottom = () => {
  if (chatContainerRef.value) {
    chatContainerRef.value.scrollTo({
      top: chatContainerRef.value.scrollHeight,
      behavior: 'smooth'
    });
  }
};

// Watchers
watch(
  () => [props.messages.length, props.isLoading],
  ([messagesLength, isLoadingValue], [prevMessagesLength, prevIsLoadingValue]) => {
    // Scroll to bottom if new messages are added or loading starts/stops
    if (messagesLength !== prevMessagesLength || isLoadingValue !== prevIsLoadingValue) {
      nextTick(() => {
        scrollToBottom();
      });
    }
  },
  { flush: 'post' } // Ensure DOM is updated before scrolling
);

// Lifecycle Hooks
onMounted(() => {
  nextTick(scrollToBottom); // Initial scroll to bottom
});

// Expose methods to parent components if needed
defineExpose({
  scrollToBottom
});
</script>

<template>
  <div
    ref="chatContainerRef"
    class="chat-window-container-ephemeral"
    role="log"
    aria-live="polite"
    aria-relevant="additions text"
  >
    <div class="chat-messages-wrapper-ephemeral">
      <div v-if="messages.length === 0 && !isLoading" class="welcome-placeholder-ephemeral">
        <img 
          :src="currentAgent?.iconPath || '/src/assets/logo.svg'" 
          :alt="`${currentAgent?.label || 'VCA'} Logo`" 
          class="welcome-logo-ephemeral" 
        />
        <h2 class="welcome-title-ephemeral">{{ welcomeTitle }}</h2>
        <p class="welcome-subtitle-ephemeral">
          {{ welcomeSubtitle }}
        </p>
        <div v-if="examplePrompts.length > 0" class="example-prompts-grid-ephemeral">
          <div 
            v-for="(prompt, index) in examplePrompts.slice(0, 4)" 
            :key="`prompt-${index}`" 
            class="prompt-tag-ephemeral"
          >
            {{ prompt }}
          </div>
        </div>
      </div>

      <Message
        v-for="message in messages"
        :key="message.id"
        :message="message"
        class="message-item-in-log"
      />

      <div v-if="isLoading" class="loading-indicator-chat-ephemeral" aria-label="Assistant is thinking">
        <div class="spinner-dots-ephemeral">
          <div class="dot-ephemeral dot-1"></div>
          <div class="dot-ephemeral dot-2"></div>
          <div class="dot-ephemeral dot-3"></div>
        </div>
        <p class="loading-text-ephemeral">Assistant is responding...</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
// Styles are in frontend/src/styles/components/_chat-window.scss
// This ensures that the component-specific styles are co-located with the component logic
// while still being part of the global SCSS build process.
</style>