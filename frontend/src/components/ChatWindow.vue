// File: frontend/src/components/ChatWindow.vue
/**
 * @file ChatWindow.vue
 * @description Main panel for displaying chat messages, welcome placeholder, and loading state,
 * styled with "Ephemeral Harmony" for a visually rich and focused experience.
 * @version 3.1.0 - Enhanced holographic styling and refined placeholder/loading states.
 */
<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, nextTick, type PropType, computed } from 'vue';
import Message from './Message.vue'; // Will be styled by _message.scss
import type { ChatMessage as StoreChatMessage } from '@/store/chat.store';
import { useAgentStore } from '@/store/agent.store';
import { agentService, type IAgentDefinition } from '@/services/agent.service'; // Import IAgentDefinition

const props = defineProps({
  messages: {
    type: Array as PropType<Array<StoreChatMessage>>,
    required: true,
  },
  isLoading: {
    type: Boolean,
    required: true,
  }
});

const chatContainerRef = ref<HTMLElement | null>(null);
const agentStore = useAgentStore();

// Use IAgentDefinition for better typing
const currentAgent = computed<IAgentDefinition | undefined>(() => agentStore.activeAgent || agentService.getDefaultAgent());

const welcomeTitle = computed(() => {
  if (!currentAgent.value || currentAgent.value.id === 'general') { // Assuming 'general' is a generic/default ID
    return "Voice Chat Assistant";
  }
  return `${currentAgent.value.label || 'Assistant'} Ready`; // More engaging title
});

const welcomeSubtitle = computed(() => {
  if (!currentAgent.value || currentAgent.value.id === 'general') {
    return "How can I assist you today? Feel free to ask about coding, system design, or anything else!";
  }
  return currentAgent.value.description || `The ${currentAgent.value.label} is active. What's on your mind?`;
});

const examplePrompts = computed(() => {
  return currentAgent.value?.examplePrompts || [ // Ensure examplePrompts is part of IAgentDefinition
    "Explain Quantum Entanglement",
    "Draft an email to my team",
    "Debug this Python snippet",
    "What's the weather like in Tokyo?"
  ];
});

const scrollToBottom = () => {
  if (chatContainerRef.value) {
    // A slight delay can help if messages are rendering and causing height changes.
    setTimeout(() => {
        if(chatContainerRef.value) { // Check again in case it became null
            chatContainerRef.value.scrollTo({
                top: chatContainerRef.value.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, 50); // 50ms delay
  }
};

watch(
  () => [props.messages.length, props.isLoading],
  () => {
    nextTick(() => {
      scrollToBottom();
    });
  },
  { flush: 'post' }
);

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
            role="button" 
            tabindex="0"
            @click="$emit('example-prompt-click', prompt)" 
            @keydown.enter="$emit('example-prompt-click', prompt)"
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
// Ensure keyframes used (fadeIn, breathingEffect, holoGridScroll, bounceDelay)
// are defined in your global _keyframes.scss file.
</style>