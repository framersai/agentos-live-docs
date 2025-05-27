// File: frontend/src/components/ChatWindow.vue
/**
 * @file ChatWindow.vue
 * @description Main panel for displaying chat messages with "Ephemeral Harmony" styling.
 * @version 2.0.0 - Ephemeral Harmony theme integration.
 */
<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, nextTick, type PropType } from 'vue';
import Message from './Message.vue'; // Assumes Message.vue is refactored
import type { ChatMessage as StoreChatMessage } from '@/store/chat.store'; // Using the more complete type from store
import { SparklesIcon } from '@heroicons/vue/24/outline'; // For welcome placeholder

// ChatWindowMessage interface remains the same as your provided file
interface ChatWindowMessage extends Omit<StoreChatMessage, 'agentId' | 'tool_calls' | 'tool_call_id' | 'name' | 'model' | 'usage' | 'estimatedTokenCount' | 'processedTokens' | 'relevanceScore'> {
  // This component primarily cares about id, role, content, timestamp for rendering message bubbles.
  // If it needs more, they should be added or Message.vue's MessageData should be used directly if compatible.
  // For now, this ensures type compatibility with the iterated 'messages' prop.
  // The Message.vue component itself expects a more complete MessageData (which now includes 'tool').
}


const props = defineProps({
  messages: {
    type: Array as PropType<Array<StoreChatMessage>>, // Expecting full StoreChatMessage now
    required: true,
  },
  isLoading: {
    type: Boolean,
    required: true,
  }
});

const chatContainerRef = ref<HTMLElement | null>(null);
// isLandscape can be removed if not used for specific layout changes within this component anymore
// const isLandscape = ref(false);

const scrollToBottom = () => {
  if (chatContainerRef.value) {
    // Smooth scroll for a nicer feel
    chatContainerRef.value.scrollTo({
        top: chatContainerRef.value.scrollHeight,
        behavior: 'smooth'
    });
  }
};

watch(
  () => [props.messages.length, props.isLoading],
  ([messagesLength, isLoadingValue], [prevMessagesLength, prevIsLoadingValue]) => {
    if (messagesLength !== prevMessagesLength || (isLoadingValue && !prevIsLoadingValue)) {
      nextTick(() => {
        scrollToBottom();
      });
    }
  },
  { flush: 'post' }
);

/*
const updateOrientation = () => {
  if (typeof window !== 'undefined') {
    isLandscape.value = window.innerWidth > window.innerHeight;
  }
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateOrientation);
    updateOrientation();
  }
  nextTick(scrollToBottom);
});

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateOrientation);
  }
});
*/
onMounted(() => {
  nextTick(scrollToBottom);
});


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
  >
    <div class="chat-messages-wrapper-ephemeral">
      <div v-if="messages.length === 0 && !isLoading" class="welcome-placeholder-ephemeral">
        <img src="/src/assets/logo.svg" alt="VCA Logo" class="welcome-logo" />
        <h2 class="welcome-title">Voice Chat Assistant</h2>
        <p class="welcome-subtitle">
          Ready to assist. Select an agent or type your query in the input below.
          Explore coding, system design, or simply chat!
        </p>
        <div class="example-prompts-grid-ephemeral">
          <div class="prompt-tag-ephemeral">"Explain Python decorators"</div>
          <div class="prompt-tag-ephemeral">"Design a scalable chat app"</div>
          <div class="prompt-tag-ephemeral">"Brainstorm ideas for..."</div>
        </div>
      </div>

      <Message
        v-for="message in messages"
        :key="message.id"
        :message="message"
        class="message-item-in-log"
      />

      <div v-if="isLoading" class="loading-indicator-chat-ephemeral">
        <div class="spinner-dots-ephemeral">
          <div class="dot-ephemeral"></div>
          <div class="dot-ephemeral"></div>
          <div class="dot-ephemeral"></div>
        </div>
        <p class="loading-text ml-3">Assistant is thinking...</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
// All styles are now in frontend/src/styles/components/_chat-window.scss
// Ensure component-specific scrollbar classes if needed are applied or mixin is used.
.message-item-in-log {
  // Optional: add a slight margin if the gap from flex in wrapper is not enough
  // For transitions if messages are added/removed from this list specifically:
  // transition: all 0.3s var(--ease-out-quad);
}
</style>