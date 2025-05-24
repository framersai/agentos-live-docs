<template>
  <div
    :class="['chat-message-item', messageRoleClass, { 'is-last-message': isLast }]"
    :data-message-id="message.id"
    :data-voice-target="voiceTargetId"
    role="article"
    :aria-labelledby="voiceTargetId + '-sender'"
    :aria-describedby="voiceTargetId + '-content'"
  >
    <div class="message-bubble">
      <div class="message-header">
        <div class="sender-avatar" :class="avatarBgClass" :data-voice-target="voiceTargetIdPrefix + 'avatar'">
          <component :is="senderIcon" class="avatar-icon" aria-hidden="true" />
        </div>
        <div class="sender-info">
          <span class="sender-name" :id="voiceTargetId + '-sender'" :data-voice-target="voiceTargetIdPrefix + 'sender-name'">
            {{ senderName }}
          </span>
          <time :datetime="new Date(message.timestamp).toISOString()" class="message-timestamp" :data-voice-target="voiceTargetIdPrefix + 'timestamp'">
            {{ formattedTimestamp }}
          </time>
        </div>
        <div class="message-actions" v-if="message.role === 'assistant'">
          <AppButton
            variant="tertiary" size="xs" :pill="true" :icon="ClipboardDocumentIcon"
            :aria-label="t('chat.actions.copyMessage')" :title="t('chat.actions.copyMessage')"
            :data-voice-target="voiceTargetIdPrefix + 'action-copy'"
            @click="handleCopyMessage"
          />
          </div>
      </div>

      <div class="message-content-wrapper" :id="voiceTargetId + '-content'">
        <template v-if="message.role === 'user'">
          <p class="user-content-text" :data-voice-target="voiceTargetIdPrefix + 'text-content'">
            {{ message.content }}
          </p>
          <div v-if="message.detectedIntent" class="user-intent-display" :data-voice-target="voiceTargetIdPrefix + 'detected-intent'">
            <span class="intent-label">{{ t('chat.detectedIntentLabel') }}</span>
            <span class="intent-value">{{ message.detectedIntent }}</span>
          </div>
        </template>
        <CompactMessageRenderer
          v-else-if="message.role === 'assistant'"
          :content="message.content"
          :analysis="message.analysis"
          :is-generating="chatStore.isLoading && isLast && message.role === 'assistant'"
          :streaming-text="isLast && message.role === 'assistant' && chatStore.isLoading ? chatStore.streamingAssistantResponse : ''"
          :language="chatSettingsStore.currentLanguage"
          :mode="chatSettingsStore.currentMode"
          :voice-target-id-prefix="voiceTargetIdPrefix + 'assistant-content-'"
          :is-fullscreen="isFullscreen"
          :show-fullscreen-toggle="true"
          @toggle-fullscreen="toggleMessageFullscreen"
          @diagram-rendered="(status) => handleDiagramRendered(status, message.id)"
        />
        <div v-else-if="message.role === 'system'" class="system-message-content italic" :data-voice-target="voiceTargetIdPrefix + 'system-text'">
            {{ message.content }}
        </div>
         <div v-else-if="message.role === 'error'" class="error-message-content" :data-voice-target="voiceTargetIdPrefix + 'error-text'">
            <ExclamationCircleIcon class="w-5 h-5 text-danger-color mr-2 inline-block" />
            <span>{{ message.content }}</span>
        </div>
      </div>
       <div v-if="message.analysis && message.role === 'assistant' && message.analysis.displayTitle && !isCompactRendererHandlingAnalysisHeader(message.analysis)" class="message-analysis-tags">
            <span class="analysis-tag" :class="`tag-${message.analysis.type?.toLowerCase().replace(/\s+/g, '-')}`">
                {{ message.analysis.displayTitle }}
            </span>
            <span v-if="message.analysis.problemMetadata?.difficulty" class="difficulty-tag" :class="`diff-${message.analysis.problemMetadata.difficulty.toLowerCase()}`">
                {{ message.analysis.problemMetadata.difficulty }}
            </span>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file ChatMessageItem.vue
 * @description Renders a single chat message (user or assistant).
 * Utilizes CompactMessageRenderer for rich assistant messages.
 * Designed for accessibility, theming, and voice interaction.
 */
import { computed, PropType, ref } from 'vue';
import { useI18n } from '../../../composables/useI18n';
import { useUiStore } from '../../../store/ui.store';
import { useChatStore, ChatMessage } from '../store/chat.store';
import { useChatSettingsStore } from '../store/chatSettings.store';
import CompactMessageRenderer from './CompactMessageRenderer.vue'; // SOTA version
import AppButton from '../../common/AppButton.vue';
import {
  UserIcon as UserSolidIcon, // Assuming solid for user
  CpuChipIcon as AssistantSolidIcon, // Example for assistant
  ClipboardDocumentIcon,
  ExclamationCircleIcon, // For error messages
} from '@heroicons/vue/24/solid';
import { SpeakerWaveIcon as SystemSolidIcon } from '@heroicons/vue/24/solid'; // Example for system
import type { ContentAnalysis } from '../../../utils/ContentAnalyzer';

const props = defineProps({
  /**
   * The chat message object to render.
   * @type {ChatMessage}
   * @required
   */
  message: {
    type: Object as PropType<ChatMessage>,
    required: true,
  },
  /**
   * Indicates if this is the last message in the chat list.
   * Useful for applying different styling or behavior (e.g., streaming indicator).
   * @type {boolean}
   */
  isLast: {
    type: Boolean,
    default: false,
  },
  /**
   * Prefix for voice target IDs to ensure uniqueness.
   * @type {string}
   * @default 'chat-msg-'
   */
  voiceTargetIdPrefix: {
    type: String,
    default: 'chat-msg-',
  },
});

const emit = defineEmits<{
  /** Emitted when an action is triggered from within the message (e.g., copy code, retry). */
  (e: 'action-from-message', action: string, message: ChatMessage): void;
}>();

const { t, formatDate } = useI18n(); // Assuming formatDate is for full date-time, we'll use a simpler time format
const uiStore = useUiStore();
const chatStore = useChatStore();
const chatSettingsStore = useChatSettingsStore();

const isFullscreen = ref(false); // Local fullscreen state for THIS message content

/** The unique voice target ID for this message item. */
const voiceTargetId = computed(() => props.voiceTargetIdPrefix + props.message.id);

/** Computes CSS classes based on the message role. */
const messageRoleClass = computed(() => {
  switch (props.message.role) {
    case 'user': return 'user-message-item';
    case 'assistant': return 'assistant-message-item';
    case 'system': return 'system-message-item';
    case 'error': return 'error-message-item';
    default: return '';
  }
});

/** Determines the sender's name for display. */
const senderName = computed(() => {
  switch (props.message.role) {
    case 'user': return t('chat.senderYou');
    case 'assistant': return t('chat.senderAssistant'); // Could be dynamic based on GMI persona
    case 'system': return t('chat.senderSystem');
    case 'error': return t('chat.senderError');
    default: return 'Unknown';
  }
});

/** Determines the icon component for the sender. */
const senderIcon = computed(() => {
  switch (props.message.role) {
    case 'user': return UserSolidIcon;
    case 'assistant': return AssistantSolidIcon; // Could be dynamic based on GMI persona
    case 'system': return SystemSolidIcon;
    case 'error': return ExclamationCircleIcon;
    default: return UserSolidIcon; // Fallback
  }
});

/** Determines background class for the avatar. */
const avatarBgClass = computed(() => {
  switch (props.message.role) {
    case 'user': return 'avatar-user-bg';
    case 'assistant': return 'avatar-assistant-bg';
    case 'system': return 'avatar-system-bg';
    case 'error': return 'avatar-error-bg';
    default: return 'avatar-default-bg';
  }
});

/** Formats the message timestamp into a human-readable time string. */
const formattedTimestamp = computed(() => {
  return new Date(props.message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
});

/** Handles copying the message content to the clipboard. */
const handleCopyMessage = async () => {
  try {
    await navigator.clipboard.writeText(props.message.content);
    uiStore.addNotification({ type: 'success', message: t('chat.actions.messageCopied'), duration: 2000 });
    emit('action-from-message', 'copy-content', props.message);
  } catch (err) {
    console.error('Failed to copy message content:', err);
    uiStore.addNotification({ type: 'error', message: t('chat.actions.copyFailed'), duration: 3000 });
  }
};

const toggleMessageFullscreen = () => {
    isFullscreen.value = !isFullscreen.value;
    // This is a local fullscreen for the message content, distinct from app-level fullscreen
    // You might want to emit an event to the parent if this needs to affect layout more broadly
    // or use a Pinia store if multiple messages can be fullscreened independently.
    const targetElement = document.querySelector(`[data-message-id="${props.message.id}"] .compact-message-renderer`);
    if (targetElement) {
        if (isFullscreen.value && !document.fullscreenElement) { // Check if app isn't already fullscreen
            // targetElement.requestFullscreen(); // This would fullscreen just the renderer
        } else if (!isFullscreen.value && document.fullscreenElement === targetElement) {
            // document.exitFullscreen();
        }
    }
     uiStore.addNotification({type: 'info', message: isFullscreen.value ? 'Content expanded (simulated)' : 'Content minimized (simulated)'});
};

const handleDiagramRendered = (status: 'success' | 'error', details?: any) => {
    console.log(`[ChatMessageItem] Diagram for message ${props.message.id} rendered with status: ${status}`, details || '');
    if(status === 'error') {
        uiStore.addNotification({type: 'warning', title: t('chat.diagramErrorTitle'), message: details?.error || t('chat.diagramRenderFailed')});
    }
};

/**
 * Checks if the CompactMessageRenderer is likely handling the display of analysis type (e.g., in its own banner).
 * This helps avoid duplicate display of type/difficulty.
 */
const isCompactRendererHandlingAnalysisHeader = (analysis: ContentAnalysis | null): boolean => {
    if (!analysis) return false;
    // Based on current CompactMessageRenderer, it shows a banner if certain types like leetcode/systemDesign.
    return ['leetcode', 'systemDesign'].includes(analysis.type);
};

</script>

<style scoped>
.chat-message-item {
  display: flex;
  width: 100%;
  position: relative; /* For potential absolute positioned actions */
}

.message-bubble {
  max-width: 85%; /* Max width for bubbles */
  padding: 0.75rem 1rem; /* Tailwind p-3 sm:p-4 */
  border-radius: var(--app-chat-bubble-radius, 0.75rem); /* Tailwind rounded-xl */
  word-wrap: break-word;
  overflow-wrap: break-word;
  box-shadow: var(--app-shadow-md);
  position: relative; /* For actions positioning */
}

/* User Messages */
.user-message-item {
  justify-content: flex-end;
}
.user-message-item .message-bubble {
  background-color: var(--app-user-message-bg, var(--app-primary-color));
  color: var(--app-user-message-text-color, white);
  border-bottom-right-radius: var(--app-chat-bubble-pointed-radius, 0.25rem); /* "Pointy" corner */
  margin-left: auto;
}
.user-message-item .message-header {
    flex-direction: row-reverse; /* Avatar on the right for user */
}
.user-message-item .sender-avatar { margin-left: 0.5rem; margin-right: 0; }
.user-message-item .sender-info { text-align: right; }


/* Assistant, System, Error Messages */
.assistant-message-item, .system-message-item, .error-message-item {
  justify-content: flex-start;
}
.assistant-message-item .message-bubble {
  background-color: var(--app-assistant-message-bg, var(--app-surface-raised-color));
  color: var(--app-assistant-message-text-color, var(--app-text-color));
  border: 1px solid var(--app-assistant-message-border-color, var(--app-border-color));
  border-bottom-left-radius: var(--app-chat-bubble-pointed-radius, 0.25rem);
  margin-right: auto;
}
.system-message-item .message-bubble {
    background-color: var(--app-system-message-bg, var(--app-info-bg-subtle));
    color: var(--app-system-message-text-color, var(--app-info-text-strong));
    border: 1px solid var(--app-info-border-color, var(--app-info-color));
    border-radius: var(--app-border-radius-md);
    font-style: italic;
    font-size: var(--app-font-size-sm);
    margin: 0.5rem auto; /* Centered for system messages */
    max-width: 95%;
}
.error-message-item .message-bubble {
    background-color: var(--app-error-message-bg, var(--app-danger-bg-subtle));
    color: var(--app-error-message-text-color, var(--app-danger-text-strong));
    border: 1px solid var(--app-danger-border-color, var(--app-danger-color));
     border-bottom-left-radius: var(--app-chat-bubble-pointed-radius, 0.25rem);
    margin-right: auto;
}


.message-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem; /* Tailwind mb-2 */
  gap: 0.5rem; /* Tailwind gap-2 */
}
.sender-avatar {
  width: 2rem; /* Tailwind w-8 */
  height: 2rem; /* Tailwind h-8 */
  border-radius: var(--app-border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: var(--app-shadow-sm);
}
.avatar-icon {
  width: 1rem; /* Tailwind w-4 */
  height: 1rem; /* Tailwind h-4 */
}
/* Themeable avatar backgrounds */
.avatar-user-bg { background-color: var(--app-primary-color-dark); color: var(--app-primary-contrast-text-color); }
.avatar-assistant-bg { background-color: var(--app-assistant-avatar-bg, var(--app-accent-color)); color: var(--app-accent-contrast-text-color); }
.avatar-system-bg { background-color: var(--app-info-color); color: var(--app-info-contrast-text-color); }
.avatar-error-bg { background-color: var(--app-danger-color); color: var(--app-danger-contrast-text-color); }


.sender-info {
  display: flex;
  flex-direction: column;
}
.sender-name {
  font-size: var(--app-font-size-sm);
  font-weight: var(--app-font-weight-semibold);
}
.user-message-item .sender-name { color: var(--app-user-message-sender-name-color, var(--app-primary-contrast-text-color)); }
.assistant-message-item .sender-name { color: var(--app-assistant-message-sender-name-color, var(--app-text-color)); }


.message-timestamp {
  font-size: var(--app-font-size-xs);
  opacity: 0.8;
}
.user-message-item .message-timestamp { color: var(--app-user-message-timestamp-color, var(--app-primary-contrast-text-color)); }
.assistant-message-item .message-timestamp { color: var(--app-assistant-message-timestamp-color, var(--app-text-muted-color)); }

.message-actions {
  margin-left: auto; /* Pushes actions to the right if header is flex */
  display: flex;
  gap: 0.25rem;
}
/* AppButton will handle its own tertiary styling */

.message-content-wrapper {
  /* Wrapper for the actual content, e.g., CompactMessageRenderer or plain text */
}
.user-content-text {
  white-space: pre-wrap; /* Preserve whitespace and newlines */
  font-size: var(--app-font-size-base);
}
.user-intent-display {
  margin-top: 0.5rem;
  padding: 0.25rem 0.5rem;
  background-color: color-mix(in srgb, var(--app-primary-color) 15%, transparent); /* Subtle background */
  border-radius: var(--app-border-radius-sm);
  font-size: var(--app-font-size-xs);
  display: inline-block;
}
.user-intent-display .intent-label { font-weight: var(--app-font-weight-medium); }
.user-intent-display .intent-value { margin-left: 0.25rem; text-transform: capitalize; }

.system-message-content, .error-message-content {
    padding: 0.25rem 0; /* Minimal padding as bubble handles most */
    font-size: var(--app-font-size-sm);
}

.error-message-content {
    display: flex;
    align-items: center;
}

.message-analysis-tags {
    margin-top: 0.75rem;
    padding-top: 0.5rem;
    border-top: 1px dashed var(--app-assistant-message-divider-color, var(--app-border-color-light));
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}
.analysis-tag, .difficulty-tag { /* Shared styling defined in HomeView or global styles */
    @apply px-2.5 py-1 text-xs font-medium rounded-full shadow-sm;
}
/* ... (tag-leetcode, diff-easy etc. classes defined globally or in HomeView) ... */


/* Holographic Theme Adjustments */
.theme-holographic .user-message-item .message-bubble {
  background: var(--holographic-user-bubble-bg, linear-gradient(135deg, rgba(var(--holographic-accent-rgb), 0.5), rgba(var(--holographic-accent-rgb), 0.3)));
  color: var(--holographic-user-bubble-text, var(--holographic-text-primary));
  border: 1px solid var(--holographic-user-bubble-border, rgba(var(--holographic-accent-rgb), 0.4));
  box-shadow: var(--holographic-glow-sm-accent);
}
.theme-holographic .user-message-item .sender-avatar {
  background-color: var(--holographic-accent);
  color: var(--holographic-bg-start);
}
.theme-holographic .user-message-item .sender-name,
.theme-holographic .user-message-item .message-timestamp {
  color: var(--holographic-text-on-accent);
}

.theme-holographic .assistant-message-item .message-bubble {
  background-color: var(--holographic-assistant-bubble-bg, rgba(var(--holographic-panel-rgb), 0.7));
  color: var(--holographic-assistant-bubble-text, var(--holographic-text-primary));
  border: 1px solid var(--holographic-assistant-bubble-border, var(--holographic-border-translucent));
  box-shadow: var(--holographic-glow-sm-panel);
}
.theme-holographic .assistant-message-item .sender-avatar {
  background-color: var(--holographic-panel-highlight);
  color: var(--holographic-text-primary);
}
.theme-holographic .message-analysis-tags {
    border-top-color: var(--holographic-border-very-subtle);
}
</style>