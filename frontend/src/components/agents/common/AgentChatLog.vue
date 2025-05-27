// File: frontend/src/components/agents/common/AgentChatLog.vue
/**
 * @file AgentChatLog.vue
 * @description Displays the conversational chat history for the active agent.
 * @version 1.0.2 - Correctly maps ChatMessage to MessageData for the Message component.
 */
<script setup lang="ts">
import { computed, watch, nextTick, PropType, ref as vueRef } from 'vue';
import { useChatStore, type ChatMessage } from '@/store/chat.store';
import Message from '@/components/Message.vue';
import type { MessageData } from '@/components/Message.vue'; // Import MessageData
import type { AgentId } from '@/services/agent.service';

const props = defineProps({
    agentId: {
        type: String as PropType<AgentId>,
        required: true,
    }
});

const chatStore = useChatStore();
const chatLogRef = vueRef<HTMLElement | null>(null);

// Filter 'system' messages and map to MessageData if other properties differ significantly
// For now, the main difference is the 'role' type.
const displayableMessages = computed((): MessageData[] => {
    return chatStore.getMessagesForAgent(props.agentId)
        .filter(msg => msg.role === 'user' || msg.role === 'assistant')
        .map(msg => ({
            // Explicitly map to MessageData properties
            role: msg.role as 'user' | 'assistant', // Cast here is safe due to filter
            content: msg.content ?? '', // Ensure content is always a string
            timestamp: msg.timestamp,
            // id: msg.id, // Message.vue doesn't use 'id' prop based on its MessageData interface
            // Any other properties on ChatMessage not in MessageData are implicitly dropped here
        }));
});

const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    nextTick(() => {
        if (chatLogRef.value) {
            chatLogRef.value.scrollTo({
                top: chatLogRef.value.scrollHeight,
                behavior: behavior
            });
        }
    });
};

watch(displayableMessages, () => {
    scrollToBottom('auto'); // Use 'auto' for instant scroll on new messages if preferred
}, { deep: true, immediate: true });

</script>

<template>
    <div ref="chatLogRef" class="agent-chat-log flex-grow p-3 md:p-4 space-y-3 overflow-y-auto">
        <transition-group name="chat-message-fade" tag="div">
            <Message
                v-for="(message, index) in displayableMessages"
                :key="message.timestamp ? `msg-${message.timestamp}-${index}` : `msg-fallback-${index}`" 
                :message="message"
                class="chat-message-item"
            />
        </transition-group>
        <div v-if="displayableMessages.length === 0" class="text-center py-10 text-slate-500 italic text-sm">
            Chat log is empty for {{ agentId }}. Start a conversation!
        </div>
    </div>
</template>

<style lang="postcss" scoped>
.agent-chat-log {
    background-color: rgba(10, 5, 20, 0.1);
    min-height: 200px;
}

.chat-message-item {
    opacity: 1;
    transform: translateY(0);
}

.chat-message-fade-enter-active {
    transition: all 0.4s ease-out;
}
.chat-message-fade-leave-active {
    transition: all 0.3s ease-in;
}

.chat-message-fade-enter-from {
    opacity: 0;
    transform: translateY(20px);
}
.chat-message-fade-leave-to {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
}

.chat-message-fade-move {
  transition: transform 0.3s ease-out;
}
</style>