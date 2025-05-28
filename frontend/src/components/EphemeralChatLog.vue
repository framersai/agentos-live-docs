// File: frontend/src/components/EphemeralChatLog.vue
/**
 * @file EphemeralChatLog.vue
 * @description Displays prior chat messages.
 * @version 1.2.1 - Corrected agent store import.
 */
<script setup lang="ts">
import { computed, watch, ref, nextTick, onMounted } from 'vue';
import { useChatStore, type ChatMessage } from '@/store/chat.store';
import { useAgentStore } from '@/store/agent.store'; // This should now resolve
import { marked } from 'marked';

const chatStore = useChatStore();
const agentStore = useAgentStore(); // This instantiation should be correct now
// ... rest of the script setup from version 1.2.0 I provided ...
const scrollAreaRef = ref<HTMLElement | null>(null);
const MAX_EPHEMERAL_MESSAGES = 5; // Reduced for a more "glanceable" history, also helps with fading effects

const messagesToDisplay = computed<ChatMessage[]>(() => {
  const allAgentMessages = chatStore.getMessagesForAgent(agentStore.activeAgentId);

  if (allAgentMessages.length === 0) {
    return [];
  }

  // If the main chat window is actively streaming an AI response,
  // we want to show messages *before* the user prompt that triggered this response.
  if (chatStore.isMainContentStreaming) {
    // Find the last user message. If it exists, messages *before* it are "prior".
    // If no user messages, or only user messages and AI is streaming (unlikely scenario),
    // it implies the context is just being established.
    // A more robust way might be to get all messages except the last `X` if streaming,
    // or if the last message is an assistant message that's still being formed.

    // Simpler approach: Exclude the very last message if AI is streaming,
    // assuming it's either the prompt or the start of the response.
    // And if there's only one message (the prompt), show nothing.
    if (allAgentMessages.length <= 1) {
      return []; // Don't show the single prompt that's leading to a stream
    }
    // Show messages up to, but not including, the last one.
    return allAgentMessages.slice(0, -1).slice(-MAX_EPHEMERAL_MESSAGES);
  }

  // If not streaming, and there's only one message, it's likely a completed AI response
  // or a user message awaiting response. Showing it as "prior" context is acceptable.
  // However, to strictly show "prior messages" meaning "not the very latest completed exchange":
  if (allAgentMessages.length > 0) {
    // Show the last N messages, but if there's only one, it might be the "current" one.
    // To avoid showing the *absolute latest* message if it just completed:
    // This logic could make the log feel one step behind, which might be desired.
    // For instance, after AI replies, ephemeral shows the user's prompt that led to it.
    // If we want to show up to the last AI response (but not a currently streaming one):
    // The current `slice(-MAX_EPHEMERAL_MESSAGES)` is okay if not streaming.

    // Let's try this: display the last N messages, but ensure it's not the *very* last message if it's an assistant one
    // that might have just landed and is still the "focus" of the main chat.
    // This can be tricky without more state about "focus".

    // Sticking to: if not streaming, the latest history is fair game for "prior context".
    // The `slice(-MAX_EPHEMERAL_MESSAGES)` is the most straightforward here.
    // The main issue was showing the *currently streaming* response.
    return allAgentMessages.slice(-MAX_EPHEMERAL_MESSAGES);
  }
  
  return [];
});
const renderMarkdown = (content: string | null): string => { /* ... */ return content ? marked.parse(content, { breaks: true, gfm: true, async: false }) : ''; };
const scrollToTopEphemeral = () => { if (scrollAreaRef.value) scrollAreaRef.value.scrollTop = 0; };
watch(messagesToDisplay, async () => { await nextTick(); scrollToTopEphemeral(); }, { deep: true });
onMounted(() => { nextTick(scrollToTopEphemeral); });
</script>

<template>
  <div
    class="ephemeral-chat-log-container"
    v-if="messagesToDisplay.length > 0"
    aria-live="polite"
    aria-atomic="false"
    aria-relevant="additions"
    :style="{ '--max-ephemeral-messages': MAX_EPHEMERAL_MESSAGES }"
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
            :style="{
              '--message-index-from-newest': messagesToDisplay.length - 1 - index,
              '--message-total-in-log': messagesToDisplay.length
            }"
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
/* ... transition styles from version 1.2.0 ... */
.ephemeral-message-list-enter-active,
.ephemeral-message-list-leave-active {
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}
.ephemeral-message-list-leave-active {
  position: absolute; 
  left: 0; right: 0;
}
.ephemeral-message-list-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
.ephemeral-message-list-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}
</style>