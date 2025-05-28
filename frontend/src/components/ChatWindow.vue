/**
 * @file ChatWindow.vue
 * @description Main panel for displaying chat messages, welcome placeholder, and loading state.
 * @version 3.1.6 - Final review and alignment with current AgentId and IAgentDefinition.
 */
<script setup lang="ts">
import { ref, onMounted, watch, nextTick, type PropType, computed } from 'vue';
import Message from './Message.vue';
import type { ChatMessage as StoreChatMessage } from '@/store/chat.store';
import { useAgentStore } from '@/store/agent.store';
import { type IAgentDefinition, type AgentId } from '@/services/agent.service'; // AgentId used for comparisons

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

const emit = defineEmits<{
  (e: 'example-prompt-click', promptText: string): void;
}>();

const chatContainerRef = ref<HTMLElement | null>(null);
const agentStore = useAgentStore();

const currentAgent = computed<IAgentDefinition | undefined>(() => agentStore.activeAgent);

// Use canonical agent IDs for comparison
const isGenericWelcome = computed(() => {
  if (!currentAgent.value) return true; // If no agent, show generic welcome
  return currentAgent.value.id === 'general_chat' || currentAgent.value.id === 'public-quick-helper';
});

const welcomeTitle = computed<string>(() => {
  if (isGenericWelcome.value) {
    return "Voice Chat Assistant";
  }
  return `${currentAgent.value?.label || 'Assistant'} Ready`;
});

const welcomeSubtitle = computed<string>(() => {
  if (isGenericWelcome.value) {
    return "How can I assist you today? Feel free to ask anything!";
  }
  return currentAgent.value?.description || `The ${currentAgent.value?.label || 'Assistant'} is active. What's on your mind?`;
});

// examplePrompts is now a valid optional property on IAgentDefinition
const examplePromptsToDisplay = computed<string[]>(() => {
  if (currentAgent.value?.examplePrompts && currentAgent.value.examplePrompts.length > 0) {
    return currentAgent.value.examplePrompts;
  }
  // Default prompts if agent doesn't define any, or for generic welcome
  return [
    "Explain Quantum Entanglement",
    "Draft an email to my team about the new project.",
    "Give me ideas for a healthy breakfast.",
    "What's the weather like in Tokyo today?"
  ];
});

const agentIconSource = computed(() => {
    if (currentAgent.value?.iconComponent) return null; // Handled by <component :is>
    // iconPath and avatar are optional legacy fields in IAgentDefinition
    if (currentAgent.value?.iconPath) return currentAgent.value.iconPath;
    if (currentAgent.value?.avatar) return currentAgent.value.avatar;
    return '/src/assets/logo.svg'; // Global fallback
});

const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
  if (chatContainerRef.value) {
    nextTick(() => {
        if(chatContainerRef.value) {
            chatContainerRef.value.scrollTo({
                top: chatContainerRef.value.scrollHeight,
                behavior: behavior
            });
        }
    });
  }
};

watch(() => props.messages.length, () => { scrollToBottom('smooth'); }, { flush: 'post' });
watch(() => props.isLoading, (newIsLoading, oldIsLoading) => {
    if (oldIsLoading && !newIsLoading && props.messages.length > 0) { // Response finished loading
        scrollToBottom('smooth');
    } else if (newIsLoading) { // New message or loading started
        scrollToBottom('auto'); // Faster scroll if content might jump
    }
});

onMounted(() => {
  scrollToBottom('auto'); // Initial scroll without smooth behavior
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
        <component 
            v-if="currentAgent?.iconComponent && typeof currentAgent.iconComponent !== 'string'"
            :is="currentAgent.iconComponent"
            class="welcome-logo-ephemeral"
            :class="currentAgent.iconClass" 
            aria-hidden="true"
        />
        <img
          v-else-if="agentIconSource"
          :src="agentIconSource" 
          :alt="`${currentAgent?.label || 'VCA'} Logo`"
          class="welcome-logo-ephemeral"
        />
        <img 
            v-else
            src="/src/assets/logo.svg" 
            alt="Voice Chat Assistant Logo"
            class="welcome-logo-ephemeral"
        />

        <h2 class="welcome-title-ephemeral">{{ welcomeTitle }}</h2>
        <p class="welcome-subtitle-ephemeral">
          {{ welcomeSubtitle }}
        </p>
        <div v-if="examplePromptsToDisplay.length > 0" class="example-prompts-grid-ephemeral">
          <div
            v-for="(prompt, index) in examplePromptsToDisplay.slice(0, 4)"
            :key="`prompt-${currentAgent?.id || 'default'}-${index}`" class="prompt-tag-ephemeral"
            role="button"
            tabindex="0"
            @click="emit('example-prompt-click', prompt)"
            @keydown.enter.space.prevent="emit('example-prompt-click', prompt)"
            :aria-label="`Use example prompt: ${prompt}`"
          >
            {{ prompt }}
          </div>
        </div>
      </div>

      <Message
        v-for="(message, index) in messages" :key="message.id || `msg-${index}`"
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
// Ensure that SCSS file defines .welcome-logo-ephemeral, .welcome-title-ephemeral, etc.
// and provides appropriate styling for the 'ephemeral' theme.
</style>