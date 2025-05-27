// File: frontend/src/components/EphemeralChatLog.vue
/**
 * @file EphemeralChatLog.vue
 * @description Displays a limited number of recent chat messages in a top-mounted,
 * semi-transparent, auto-scrolling panel. Designed for the "Ephemeral Harmony" theme.
 * @version 1.0.0
 */
<script setup lang="ts">
import { computed, watch, ref, nextTick } from 'vue';
import { useChatStore, type ChatMessage } from '@/store/chat.store';
import { useAgentStore } from '@/store/agent.store';
import { marked } from 'marked'; // For rendering markdown in messages if needed

const chatStore = useChatStore();
const agentStore = useAgentStore();
const scrollAreaRef = ref<HTMLElement | null>(null);

const MAX_EPHEMERAL_MESSAGES = 7; // Show last N messages

const messagesToDisplay = computed<ChatMessage[]>(() => {
  const agentMessages = chatStore.getMessagesForAgent(agentStore.activeAgentId);
  // Take the last N messages. Since new messages are pushed, slice from the end.
  return agentMessages.slice(-MAX_EPHEMERAL_MESSAGES);
});

const renderMarkdown = (content: string | null) => {
  if (!content) return '';
  // Basic markdown rendering for chat messages, ensure it's sanitized if from user
  // For now, assuming assistant content is safe.
  return marked.parse(content, { breaks: true, gfm: true });
};

watch(messagesToDisplay, async () => {
  await nextTick();
  if (scrollAreaRef.value) {
    // Because flex-direction is column-reverse, scroll to bottom means scroll to top of visible area
    scrollAreaRef.value.scrollTop = 0; // scrollAreaRef.value.scrollHeight; (would be for normal flex-direction)
  }
}, { deep: true });

</script>

<template>
  <div class="ephemeral-chat-log-container" v-if="messagesToDisplay.length > 0" aria-live="polite" aria-atomic="false" aria-relevant="additions">
    <div class="ephemeral-chat-log">
      <div class="messages-scroll-area" ref="scrollAreaRef">
        <div
          v-for="(message) in messagesToDisplay"
          :key="message.id"
          class="ephemeral-message-item"
          :class="[`message-role-${message.role}`]"
          role="logitem"
        >
          <div
            class="message-content prose prose-sm dark:prose-invert max-w-none"
            v-if="message.content"
            v-html="renderMarkdown(message.content)"
          ></div>
          </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
// Styles are in frontend/src/styles/components/_ephemeral-chat-log.scss
</style>