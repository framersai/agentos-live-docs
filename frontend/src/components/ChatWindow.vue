// File: frontend/src/components/ChatWindow.vue
/**
 * @file ChatWindow.vue
 * @description Main component for displaying the flow of chat messages.
 * Dynamically personalizes welcome messages and loading indicators based on the active AI agent.
 * Handles rendering individual messages, welcome placeholder, loading state, and auto-scrolling.
 * Styled according to the "Ephemeral Harmony" theme and ensures it fills available vertical space.
 *
 * @component ChatWindow
 * @props None. Relies on Pinia stores (`chatStore`, `agentStore`) for data.
 * @emits focus-voice-input - Emitted when an example prompt is clicked to suggest focusing the input.
 * @emits set-input-text - Emitted when an example prompt is clicked, with the prompt text as payload, for the parent to handle setting the actual input field's value.
 *
 * @version 3.2.3 - Corrected TypeScript errors. Uses 'set-input-text' event for example prompts. Uses robust getMessageKey.
 */
<script setup lang="ts">
import { computed, watch, ref, nextTick, onMounted, onUpdated, type Ref, type Component as VueComponentType, type FunctionalComponent, type DefineComponent } from 'vue';
import { useChatStore } from '@/store/chat.store'; // ChatMessage type is also implicitly from here if not overridden
import { useAgentStore } from '@/store/agent.store';
import { type ChatMessageFE } from '@/utils/api'; // This is the type for messages from the API/store
import type { IAgentDefinition } from '@/services/agent.service';
import Message from './Message.vue';
import { SparklesIcon } from '@heroicons/vue/24/outline'; // For default welcome logo

/** @const {Store<ChatStore>} chatStore - Pinia store for chat state and messages. */
const chatStore = useChatStore();
/** @const {Store<AgentStore>} agentStore - Pinia store for active agent information. */
const agentStore = useAgentStore();

/** @ref {Ref<HTMLElement | null>} chatWindowContainerRef - Template ref for the root container of this component. */
const chatWindowContainerRef: Ref<HTMLElement | null> = ref(null);
/** @ref {Ref<HTMLElement | null>} messagesWrapperRef - Template ref for the direct parent of messages that scrolls. */
const messagesWrapperRef: Ref<HTMLElement | null> = ref(null);

const emit = defineEmits<{
  (e: 'focus-voice-input'): void;
  /**
   * Emitted when an example prompt is clicked. The parent component
   * should listen to this and update the actual text input component's value.
   */
  (e: 'set-input-text', text: string): void;
}>();

/**
 * @computed {IAgentDefinition | undefined} activeAgent - The currently active agent's definition.
 */
const activeAgent = computed<IAgentDefinition | undefined>(() => agentStore.activeAgent);

/**
 * @computed currentMessages
 * @description Retrieves the list of messages for the currently active agent from the chat store.
 * The type `ChatMessageFE[]` is used here as these messages are typically what's stored/retrieved.
 * The `getMessageKey` function will handle potential differences in `id` property.
 * @returns {ChatMessageFE[]} An array of chat messages.
 */
const currentMessages = computed<ChatMessageFE[]>(() => {
  if (!activeAgent.value?.id) return [];
  // Assuming getMessagesForAgent returns an array compatible with ChatMessageFE,
  // or that ChatMessageFE is the type stored. Your store uses 'ChatMessage' internally.
  // Ensure these types are compatible or mapped correctly if they differ significantly.
  return chatStore.getMessagesForAgent(activeAgent.value.id) as ChatMessageFE[];
});


/**
 * @computed isMainContentLoading
 * @description Indicates if the AI is actively generating or streaming its main response.
 * This controls visibility of the loading indicator within the chat window.
 * @returns {boolean} True if loading or streaming.
 */
const isMainContentLoading = computed<boolean>(() => chatStore.isMainContentStreaming && currentMessages.value.length > 0);

/**
 * @computed showWelcomePlaceholder
 * @description Determines if the welcome placeholder should be displayed.
 * Shown only if there are no messages and content is not currently loading.
 * @returns {boolean} True if the welcome placeholder should be shown.
 */
const showWelcomePlaceholder = computed<boolean>(() => {
  return currentMessages.value.length === 0 && !chatStore.isMainContentStreaming;
});


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
 * @computed welcomeLogoComponent
 * @description Returns the icon component for the welcome placeholder. Uses agent's icon or a default.
 * @returns {VueComponentType | FunctionalComponent | DefineComponent} The icon component.
 */
const welcomeLogoComponent = computed<VueComponentType | FunctionalComponent | DefineComponent>(() => {
  const icon = activeAgent.value?.iconComponent;
  // Only return if icon is a function/object (component), not a string
  if (icon && typeof icon !== 'string') {
    return icon;
  }
  return SparklesIcon;
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
 * @description Scrolls the chat message wrapper to the bottom to show the latest message.
 * @param {ScrollBehavior} [behavior='auto'] - The scroll behavior ('auto' or 'smooth').
 * @async
 */
const scrollToBottom = async (behavior: ScrollBehavior = 'auto'): Promise<void> => {
  await nextTick();
  if (messagesWrapperRef.value) {
    const scrollThreshold = 250;
    const userHasScrolledUp = messagesWrapperRef.value.scrollHeight - messagesWrapperRef.value.scrollTop - messagesWrapperRef.value.clientHeight > scrollThreshold;
    if (behavior === 'smooth' || !userHasScrolledUp) {
      messagesWrapperRef.value.scrollTo({
        top: messagesWrapperRef.value.scrollHeight,
        behavior: behavior
      });
    }
  }
};

/**
 * @function handleExamplePromptClick
 * @description Emits an event to the parent component to set the input text value,
 * and another event to suggest focusing the voice input field.
 * @param {string} promptText - The example prompt text to use.
 */
const handleExamplePromptClick = (promptText: string): void => {
  // Emit an event for the parent component (e.g., PublicHome.vue or PrivateHome.vue)
  // to handle updating the actual input field's value.
  emit('set-input-text', promptText);
  emit('focus-voice-input');
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

/**
 * @function getMessageKey
 * @description Generates a unique key for each message in the v-for loop.
 * Your `chat.store.ts` defines `ChatMessage` with an `id: string`.
 * This function assumes `ChatMessageFE` from `utils/api.ts` will also have a compatible `id`.
 * If `ChatMessageFE`'s `id` is optional or differently named, this function provides a robust fallback.
 * @param {ChatMessageFE} msg - The chat message object.
 * @param {number} index - The index of the message in the array.
 * @returns {string | number} A unique key for the message.
 */
const getMessageKey = (msg: ChatMessageFE, index: number): string | number => {
  const msgAsAny = msg as any; // Use 'as any' for dynamic property access if types might mismatch.
                              // Ideal: Ensure ChatMessageFE reliably has 'id: string'.
  if (msgAsAny.id && (typeof msgAsAny.id === 'string' || typeof msgAsAny.id === 'number') && String(msgAsAny.id).trim() !== '') {
    return msgAsAny.id;
  }
  // Fallback key if 'id' is not present or not suitable
  return `msg-${msg.role}-${msg.timestamp}-${index}`;
};

</script>

<template>
  <div class="chat-window-container-ephemeral" ref="chatWindowContainerRef" role="log" aria-live="polite" tabindex="-1">
    <div class="chat-messages-wrapper-ephemeral" ref="messagesWrapperRef">
      <div v-if="showWelcomePlaceholder" class="welcome-placeholder-ephemeral" aria-labelledby="welcome-title" aria-describedby="welcome-subtitle">
        <component :is="welcomeLogoComponent" class="welcome-logo-ephemeral" :class="activeAgent?.iconClass" aria-hidden="true" />
        <h2 id="welcome-title" class="welcome-title-ephemeral">
          {{ welcomeTitle }}
        </h2>
        <p id="welcome-subtitle" class="welcome-subtitle-ephemeral">
          {{ welcomeSubtitle }}
        </p>
        <div v-if="activeAgent?.examplePrompts && activeAgent.examplePrompts.length > 0" class="example-prompts-grid-ephemeral">
          <button
            v-for="(prompt, index) in activeAgent.examplePrompts.slice(0, 4)" 
            :key="`prompt-${activeAgent.id}-${index}`"
            class="prompt-tag-ephemeral btn" 
            @click="handleExamplePromptClick(prompt)" :title="`Use prompt: ${prompt}`"
          >
            {{ prompt }}
          </button>
        </div>
      </div>

      <template v-else-if="currentMessages.length > 0">
        <Message
          v-for="(msg, index) in currentMessages"
          :key="getMessageKey(msg, index)" :message="msg"
          :previous-message-sender="index > 0 ? currentMessages[index - 1].role : null"
          :is-last-message-in-group="index === currentMessages.length - 1 || (index < currentMessages.length - 1 && currentMessages[index+1].role !== msg.role)"
        />
      </template>

      <div v-if="isMainContentLoading" class="loading-indicator-chat-ephemeral" aria-label="Assistant is generating response">
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