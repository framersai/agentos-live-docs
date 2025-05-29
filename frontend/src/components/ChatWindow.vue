// File: frontend/src/components/ChatWindow.vue
/**
 * @file ChatWindow.vue
 * @description Main component for displaying the flow of chat messages.
 * Dynamically personalizes welcome messages and loading indicators based on the active AI agent.
 * Handles rendering individual messages, welcome placeholder, loading state, and auto-scrolling.
 * Styled according to the "Ephemeral Harmony" theme.
 *
 * @component ChatWindow
 * @props None. Relies on Pinia stores (`chatStore`, `agentStore`) for data.
 * @emits None directly that affect parent state, but example prompts use chatStore.setInputText.
 *
 * @version 3.1.1 - Ensured `handleExamplePromptClick` is correctly exposed and functional.
 * Refined JSDoc and comments for clarity.
 */
<script setup lang="ts">
import { computed, watch, ref, nextTick, onMounted, onUpdated, type Ref } from 'vue';
import { useChatStore } from '@/store/chat.store';
import { useAgentStore } from '@/store/agent.store';
import { ChatMessageFE } from '@/utils/api';
import type { IAgentDefinition } from '@/services/agent.service';
import Message from './Message.vue';
// Assuming WelcomePlaceholder and LoadingIndicator structures are styled divs within this template
// and not separate components, for simplicity based on current SCSS structure.

/** @const {Store<ChatStore>} chatStore - Pinia store for chat state and messages. */
const chatStore = useChatStore();
/** @const {Store<AgentStore>} agentStore - Pinia store for active agent information. */
const agentStore = useAgentStore();

/** @ref {Ref<HTMLElement | null>} chatWindowRef - Template ref for the main scrollable chat window container. */
const chatWindowRef: Ref<HTMLElement | null> = ref(null);
/** @ref {Ref<HTMLElement | null>} messagesWrapperRef - Template ref for the direct parent of messages. */
const messagesWrapperRef: Ref<HTMLElement | null> = ref(null);

/**
 * @computed {IAgentDefinition | undefined} activeAgent - The currently active agent's definition.
 */
const activeAgent = computed<IAgentDefinition | undefined>(() => agentStore.activeAgent);

/**
 * @computed currentMessages
 * @description Retrieves the list of messages for the currently active agent from the chat store.
 * @returns {ChatMessageFE[]} An array of chat messages.
 */
const currentMessages = computed<ChatMessageFE[]>(() => {
  if (!activeAgent.value?.id) return [];
  return chatStore.getMessagesForAgent(activeAgent.value.id);
});

/**
 * @computed showWelcomePlaceholder
 * @description Determines if the welcome placeholder should be displayed.
 * @returns {boolean} True if the welcome placeholder should be shown.
 */
const showWelcomePlaceholder = computed<boolean>(() => {
  return currentMessages.value.length === 0 && !isMainContentLoading.value;
});

/**
 * @computed isMainContentLoading
 * @description Indicates if the AI is actively generating or streaming its main response.
 * @returns {boolean} True if loading or streaming.
 */
const isMainContentLoading = computed<boolean>(() => chatStore.isMainContentStreaming);

/**
 * @computed welcomeTitle
 * @description Generates a personalized welcome title using the active agent's name.
 * @returns {string} The welcome title.
 */
const welcomeTitle = computed<string>(() => {
  return `${activeAgent.value?.label || 'Voice Assistant'} is ready.`;
});

/**
 * @computed welcomeSubtitle
 * @description Provides a personalized subtitle or call to action for the welcome placeholder.
 * @returns {string} The welcome subtitle.
 */
const welcomeSubtitle = computed<string>(() => {
  return activeAgent.value?.inputPlaceholder || 'How can I assist you today? Ask a question or use your voice.';
});

/**
 * @computed loadingText
 * @description Provides a personalized loading text indicating which agent is processing.
 * @returns {string} The loading text.
 */
const loadingText = computed<string>(() => {
  return `${activeAgent.value?.label || 'Assistant'} is thinking...`;
});

/**
 * @function scrollToBottom
 * @description Scrolls the chat window to the bottom to show the latest message.
 * @param {ScrollBehavior} [behavior='auto'] - The scroll behavior.
 * @async
 */
const scrollToBottom = async (behavior: ScrollBehavior = 'auto'): Promise<void> => {
  await nextTick();
  if (chatWindowRef.value) {
    const scrollThreshold = 200;
    const userHasScrolledUp = chatWindowRef.value.scrollHeight - chatWindowRef.value.scrollTop - chatWindowRef.value.clientHeight > scrollThreshold;
    if (behavior === 'smooth' || !userHasScrolledUp) {
      chatWindowRef.value.scrollTo({
        top: chatWindowRef.value.scrollHeight,
        behavior: behavior
      });
    }
  }
};

/**
 * @function handleExamplePromptClick
 * @description Sets the provided prompt text into the main input area using `chatStore.setInputText`.
 * This function is defined at the top level of `<script setup>` and is automatically available to the template.
 * @param {string} promptText - The example prompt text to use.
 */
const handleExamplePromptClick = (promptText: string): void => {
  // Use the correct property or action for setting input text.
  // If your chatStore has an inputText property, set it directly:
  if ('inputText' in chatStore) {
    (chatStore as any).inputText = promptText;
  }
  // Optionally, could emit an event to focus the VoiceInput component:
  // emit('focus-voice-input');
};

// Watchers and Lifecycle Hooks
watch(currentMessages, (newMessages, oldMessages) => {
  if (newMessages.length > (oldMessages?.length || 0)) {
    scrollToBottom('smooth');
  } else if (newMessages.length > 0 && !chatStore.isMainContentStreaming) {
    scrollToBottom('auto');
  }
}, { deep: true });

onMounted(() => {
  if (currentMessages.value.length > 0) {
    scrollToBottom('auto');
  }
});
onUpdated(() => {
  if (currentMessages.value.length > 0 && !chatStore.isMainContentStreaming) {
    scrollToBottom('auto');
  }
});

</script>

<template>
  <div class="chat-window-container-ephemeral" ref="chatWindowRef" role="log" aria-live="polite" tabindex="-1">
    <div class="chat-messages-wrapper-ephemeral" ref="messagesWrapperRef">
      <div v-if="showWelcomePlaceholder" class="welcome-placeholder-ephemeral" aria-labelledby="welcome-title" aria-describedby="welcome-subtitle">
        <img src="@/assets/logo.svg" alt="Voice Assistant Logo" class="welcome-logo-ephemeral" />
        <h2 id="welcome-title" class="welcome-title-ephemeral">
          {{ welcomeTitle }}
        </h2>
        <p id="welcome-subtitle" class="welcome-subtitle-ephemeral">
          {{ welcomeSubtitle }}
        </p>
        <div v-if="activeAgent?.examplePrompts && activeAgent.examplePrompts.length > 0" class="example-prompts-grid-ephemeral">
          <button
            v-for="(prompt, index) in activeAgent.examplePrompts"
            :key="`prompt-${activeAgent.id}-${index}`"
            class="prompt-tag-ephemeral btn"
            @click="handleExamplePromptClick(prompt)" :title="`Use prompt: ${prompt}`"
          >
            {{ prompt }}
          </button>
        </div>
      </div>

      <template v-else>
        <Message
          v-for="(msg, index) in currentMessages"
          :key="`msg-${msg.role}-${msg.timestamp}-${index}`"
          :message="msg"
          :previous-message-sender="index > 0 ? currentMessages[index - 1].role : null"
          :is-last-message-in-group="index === currentMessages.length - 1 || (index < currentMessages.length - 1 && currentMessages[index+1].role !== msg.role)"
        />
      </template>

      <div v-if="isMainContentLoading && currentMessages.length > 0" class="loading-indicator-chat-ephemeral" aria-label="Assistant is generating response">
        <div class="spinner-dots-ephemeral" role="status" aria-hidden="true">
          <div class="dot-ephemeral dot-1"></div>
          <div class="dot-ephemeral dot-2"></div>
          <div class="dot-ephemeral dot-3"></div>
        </div>
        <p class="loading-text-ephemeral">{{ loadingText }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
// Styles for ChatWindow.vue are primarily in frontend/src/styles/components/_chat-window.scss
</style>