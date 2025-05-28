// File: frontend/src/components/EphemeralChatLog.vue
/**
 * @file EphemeralChatLog.vue
 * @description Displays a limited number of recent chat messages in a top-mounted,
 * semi-transparent, auto-scrolling panel. Designed for the "Ephemeral Harmony" theme.
 * Messages are compressed and older ones fade out to maintain a transient feel.
 * @version 1.1.0 - Minor adjustments for styling hooks.
 */
<script setup lang="ts">
import { computed, watch, ref, nextTick, onMounted } from 'vue';
import { useChatStore, type ChatMessage } from '@/store/chat.store';
import { useAgentStore } from '@/store/agent.store';
import { marked } from 'marked'; // For rendering markdown in messages if needed

const chatStore = useChatStore();
const agentStore = useAgentStore();
const scrollAreaRef = ref<HTMLElement | null>(null);

/**
 * @const MAX_EPHEMERAL_MESSAGES
 * @description Maximum number of messages to display in the ephemeral log.
 * CSS relies on this for fading effects.
 */
const MAX_EPHEMERAL_MESSAGES = 7; // Keep this in sync with SCSS if using nth-child logic

const messagesToDisplay = computed<ChatMessage[]>(() => {
  const agentMessages = chatStore.getMessagesForAgent(agentStore.activeAgentId);
  return agentMessages.slice(-MAX_EPHEMERAL_MESSAGES);
});

/**
 * @function renderMarkdown
 * @description Renders a string of Markdown to HTML.
 * @param {string | null} content - The Markdown content to render.
 * @returns {string} The rendered HTML.
 */
const renderMarkdown = (content: string | null): string => {
  if (!content) return '';
  // Ensure basic GFM breaks and sanitization (if user content can appear here, though unlikely)
  return marked.parse(content, { breaks: true, gfm: true, async: false });
};

/**
 * @function scrollToTopEphemeral
 * @description Scrolls the ephemeral chat log to show the newest message.
 * Due to flex-direction: column-reverse, "bottom" is visually the top.
 */
const scrollToTopEphemeral = () => {
  if (scrollAreaRef.value) {
    scrollAreaRef.value.scrollTop = 0; // Newest messages are at the "top" of the visual flow
  }
};

watch(messagesToDisplay, async () => {
  await nextTick();
  scrollToTopEphemeral();
}, { deep: true });

onMounted(() => {
  nextTick(scrollToTopEphemeral);
});

</script>

<template>
  <div 
    class="ephemeral-chat-log-container" 
    v-if="messagesToDisplay.length > 0" 
    aria-live="polite" 
    aria-atomic="false" 
    aria-relevant="additions"
    :style="{'--max-ephemeral-messages': MAX_EPHEMERAL_MESSAGES}"
  >
    <div class="ephemeral-chat-log-scroller" ref="scrollAreaRef">
      <div class="ephemeral-chat-log-content">
        <TransitionGroup name="ephemeral-message-list" tag="div">
          <div
            v-for="(message, index) in messagesToDisplay"
            :key="message.id"
            class="ephemeral-message-item"
            :class="[`message-role-${message.role}`]"
            role="logitem"
            :style="{ '--message-index-from-newest': messagesToDisplay.length - 1 - index }"
          >
            <div
              class="message-content prose prose-sm max-w-none" 
              v-if="message.content"
              v-html="renderMarkdown(message.content)"
            ></div>
            </div>
        </TransitionGroup>
      </div>
    </div>
    <div class="ephemeral-chat-log-fade-overlay--top"></div>
    <div class="ephemeral-chat-log-fade-overlay--bottom"></div>
  </div>
</template>

<style lang="scss">
// Styles are in frontend/src/styles/layout/_chat-interface.scss
// Transition for message list
.ephemeral-message-list-enter-active,
.ephemeral-message-list-leave-active {
  transition: all 0.4s var(--ease-out-quint); // Use SCSS variable for easing
}
.ephemeral-message-list-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.95);
}
.ephemeral-message-list-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(0.95);
}
</style>