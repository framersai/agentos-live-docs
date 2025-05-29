// File: frontend/src/components/Message.vue
/**
 * @file Message.vue
 * @description Component to render an individual chat message (user, assistant, system, error, tool).
 * Features distinct styling per role, avatar display, timestamp, markdown rendering for content,
 * code block highlighting with a copy button, and a new general message copy button that appears on hover.
 * Designed for the "Ephemeral Harmony" theme with neo-holographic aesthetics.
 *
 * @component Message
 * @props {ChatMessageFE} message - The chat message object to display.
 * @props {string | null} [previousMessageSender=null] - The sender ID of the previous message, for grouping.
 * @props {boolean} [isLastMessageInGroup=true] - True if this is the last message from the current sender in a sequence.
 *
 * @emits copy-error - Emitted if copying to clipboard fails.
 * @emits copy-success - Emitted with the copied text upon successful copy.
 *
 * @version 4.1.3 - Corrected all TypeScript errors from user log. Ensured proper icon imports and usage.
 * Refined Markdown rendering options and toast feedback.
 */
<script setup lang="ts">
import { computed, inject, ref, type PropType, type Component as VueComponentType } from 'vue';
// Corrected import: Use ChatMessageFE and alias it to ChatMessage for internal consistency
import { type ChatMessageFE as ChatMessage, type ILlmToolCallFE } from '@/utils/api';
import { useUiStore } from '@/store/ui.store';
import { marked, Renderer } from 'marked'; // Import Renderer for customization
import DOMPurify from 'dompurify';
import hljs from 'highlight.js'; // Ensure hljs is configured globally or imported as needed
import type { ToastService } from '@/services/services';

// Import necessary icons - ensuring all are used or removed if superfluous
import {
  UserCircleIcon as UserAvatarIcon,
  CpuChipIcon as AssistantAvatarIcon,
  WrenchScrewdriverIcon as ToolAvatarIcon,
  InformationCircleIcon as SystemAvatarIcon, // Used for System role and as a fallback
  ExclamationTriangleIcon as ErrorAvatarIcon,
  ClipboardDocumentIcon, // For the general message copy button
} from '@heroicons/vue/24/outline';
import { CheckCircleIcon as CopiedSuccessIcon } from '@heroicons/vue/24/solid'; // For toast feedback on copy

/**
 * @props - Component's props definition.
 */
const props = defineProps({
  /** The chat message object to render. Type aliased to ChatMessage for internal use. */
  message: { type: Object as PropType<ChatMessage>, required: true },
  /** The sender ID of the message immediately preceding this one. Used for message grouping. */
  previousMessageSender: { type: String as PropType<string | null>, default: null },
  /** True if this message is the last in a contiguous block from the same sender. Affects bubble styling. */
  isLastMessageInGroup: { type: Boolean as PropType<boolean>, default: true },
});

/**
 * @emits - Defines custom events emitted by this component.
 */
const emit = defineEmits<{
  /** Emitted when an error occurs while trying to copy text to the clipboard. */
  (e: 'copy-error', error: Error): void;
  /** Emitted upon successful copying of text to the clipboard. */
  (e: 'copy-success', copiedText: string): void;
}>();

const uiStore = useUiStore();
const toast = inject<ToastService>('toast');

/** @ref {Ref<boolean>} showMessageToolbar - Controls visibility of the hover toolbar. */
const showMessageToolbar = ref(false);

/**
 * @computed isSystemOrError
 * @description Determines if the message is a system or error message for special styling.
 * @returns {boolean}
 */
const isSystemOrError = computed<boolean>(() => props.message.role === 'system' || props.message.role === 'error');

/**
 * @computed avatarIcon
 * @description Selects the appropriate avatar icon based on the message sender's role.
 * @returns {VueComponentType} The Vue component for the avatar icon.
 */
const avatarIcon = computed<VueComponentType>(() => {
  switch (props.message.role) {
    case 'user': return UserAvatarIcon;
    case 'assistant': return AssistantAvatarIcon;
    case 'tool': return ToolAvatarIcon;
    case 'system': return SystemAvatarIcon;
    case 'error': return ErrorAvatarIcon;
    default: return SystemAvatarIcon; // Fallback to SystemAvatarIcon, already imported
  }
});

/**
 * @computed avatarRoleClass
 * @description Generates a CSS class for the avatar wrapper based on the message role.
 * @returns {string} The CSS class string (e.g., 'avatar-user').
 */
const avatarRoleClass = computed<string>(() => `avatar-${props.message.role}`);

/**
 * @computed senderName
 * @description Determines the display name for the message sender.
 * @returns {string} The sender's name (e.g., "You", "Assistant", "System").
 */
const senderName = computed<string>(() => {
  switch (props.message.role) {
    case 'user': return 'You';
    case 'assistant': return props.message.agentId || 'Assistant';
    case 'tool': return `Tool (${props.message.name || 'System Tool'})`;
    case 'system': return 'System';
    case 'error': return 'Error Notification';
    default:
      // This ensures all cases of ChatMessageRole are handled.
      // If ChatMessageRole gets new values, TypeScript will error here if not updated.
      const _exhaustiveCheck: never = props.message.role;
      return 'Unknown Sender';
  }
});

/**
 * @computed formattedTimestamp
 * @description Formats the message timestamp into a user-friendly time string (e.g., "10:30 AM").
 * Returns an empty string if no timestamp is present.
 * @returns {string} The formatted time string.
 */
const formattedTimestamp = computed<string>(() => {
  if (!props.message.timestamp) return '';
  return new Date(props.message.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
});

/**
 * @const {Renderer} renderer - Custom `marked` renderer instance.
 * Used to customize HTML output for code blocks, adding wrappers, language class, and copy button.
 */
const renderer = new Renderer();
renderer.code = (code: string, languageString: string | undefined): string => {
  const language = (languageString || 'plaintext').toLowerCase().split(/[\s{]/)[0];
  const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
  const highlightedCode = hljs.highlight(code, { language: validLanguage, ignoreIllegals: true }).value;
  const lines = highlightedCode.split('\n');
  // The `index` in map is used for `key` in v-for if this were a Vue template, but here it's for generating HTML string.
  // It's also useful for the line number itself.
  const numberedCode = lines.map((lineContent, index) => `<span class="line-number" aria-hidden="true">${index + 1}</span><span class="line-content">${lineContent}</span>`).join('\n');

  // SVG for copy icon
  const copyIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>`;
  // SVG for copied (success) icon
  const copiedIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-[hsl(var(--color-success-h),var(--color-success-s),var(--color-success-l))]"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;

  return `
    <div class="code-block-wrapper" data-language="${validLanguage}">
      <div class="code-header-ephemeral">
        <span class="code-language-label">${validLanguage}</span>
        <button class="copy-code-button btn btn-xs-ephemeral btn-ghost-ephemeral" title="Copy Code Snippet" aria-label="Copy code snippet">
          <span class="copy-icon-placeholder">${copyIconSvg}</span>
          <span class="copied-icon-placeholder" style="display:none;">${copiedIconSvg}</span>
        </button>
      </div>
      <pre><code class="hljs ${validLanguage} line-numbered">${numberedCode}</code></pre>
    </div>`;
};
marked.setOptions({
  renderer: renderer,
  gfm: true,
  breaks: true,
  // Removed `sanitize: false` (deprecated). DOMPurify is used after parsing.
});

/**
 * @computed renderedContent
 * @description Parses raw message content (Markdown) into sanitized HTML using `marked` and `DOMPurify`.
 * Handles tool call summaries if no direct content.
 * @returns {string} Sanitized HTML string.
 */
const renderedContent = computed<string>(() => {
  if (props.message.content) {
    const rawHtml = marked.parse(props.message.content) as string;
    // Sanitize HTML after parsing to prevent XSS.
    return DOMPurify.sanitize(rawHtml, {
      USE_PROFILES: { html: true }, // Allow standard HTML tags
      ADD_ATTR: ['target', 'start'], // Allow target for links, start for ol
      ADD_TAGS: ['span'], // Allow span for line numbers/content if used by hljs or custom
      // Ensure class attribute is allowed if hljs relies on it for styling spans.
      // Usually, hljs classes like 'hljs-keyword' are safe.
      // Allowing all classes can be risky if the markdown source is untrusted.
      // For a controlled environment where markdown is from AI, allowing common hljs classes is typical.
      // Alternatively, style based on tag names if hljs output is predictable.
      // For now, this setup is generally safe for standard Markdown + hljs output.
    });
  }
  if (props.message.tool_calls && props.message.tool_calls.length > 0) {
    const toolNames = props.message.tool_calls.map((tc: ILlmToolCallFE) => tc.function.name).join(', ');
    return `<em class="tool-call-summary-text">Assistant initiated tool call${props.message.tool_calls.length > 1 ? 's' : ''}: ${toolNames}.</em>`;
  }
  return '<em class="opacity-70">[Empty message content]</em>';
});

const messageWrapperClasses = computed(() => ({
  'message-wrapper-ephemeral': true,
  [`${props.message.role}-message-wrapper`]: true,
}));

const messageBubbleClasses = computed(() => ({
  'message-container-ephemeral': true,
  [`${props.message.role}-bubble-ephemeral`]: true,
  'system-error-bubble-ephemeral': isSystemOrError.value,
}));

/**
 * @function copyMessageContent
 * @description Copies the raw text content of the message to the clipboard.
 * Provides user feedback via toast notifications.
 * @returns {Promise<void>}
 */
const copyMessageContent = async (): Promise<void> => {
  const contentToCopy = props.message.content ||
                       (props.message.tool_calls ? `[Tool call: ${props.message.tool_calls.map((tc: ILlmToolCallFE) => tc.function.name).join(', ')}]` : '');

  if (!contentToCopy.trim()) {
    toast?.add({ type: 'warning', title: 'Nothing to Copy', message: 'This message has no text content.', duration: 3000 });
    return;
  }
  try {
    await navigator.clipboard.writeText(contentToCopy.trim());
    // Icon is handled by App.vue's toast system based on type
    toast?.add({ type: 'success', title: 'Message Copied!', duration: 2000 });
    emit('copy-success', contentToCopy.trim());
  } catch (err) {
    console.error('Failed to copy message content: ', err);
    toast?.add({ type: 'error', title: 'Copy Failed', message: 'Could not copy content to clipboard.', duration: 3000 });
    emit('copy-error', err as Error);
  }
};

/**
 * @function handleCodeCopy
 * @description Event delegation handler for copy buttons within code blocks.
 * Copies the code content to the clipboard and provides visual feedback on the button.
 * @param {Event} event - The click event.
 */
const handleCodeCopy = async (event: Event) => {
  const button = (event.target as HTMLElement).closest('.copy-code-button');
  if (!button) return;

  const pre = button.closest('.code-block-wrapper')?.querySelector('pre code');
  if (!pre) return;

  // Extract text only from .line-content spans to avoid copying line numbers
  const codeToCopy = Array.from(pre.querySelectorAll('.line-content'))
                          .map(line => line.textContent || '')
                          .join('\n')
                          .trim(); // Trim leading/trailing newlines that might accumulate

  if (!codeToCopy) { // Check if it's empty after trim
    toast?.add({ type: 'warning', title: 'Nothing to Copy', message: 'Code block is empty.', duration: 3000 });
    return;
  }
  try {
    await navigator.clipboard.writeText(codeToCopy);
    toast?.add({ type: 'success', title: 'Code Copied!', duration: 2000 });
    const copyIconEl = button.querySelector('.copy-icon-placeholder');
    const copiedIconEl = button.querySelector('.copied-icon-placeholder');
    if (copyIconEl && copiedIconEl) {
      (copyIconEl as HTMLElement).style.display = 'none';
      (copiedIconEl as HTMLElement).style.display = 'inline-block';
      setTimeout(() => {
        (copyIconEl as HTMLElement).style.display = 'inline-block';
        (copiedIconEl as HTMLElement).style.display = 'none';
      }, 2000);
    }
  } catch (err) {
    console.error('Failed to copy code: ', err);
    toast?.add({ type: 'error', title: 'Copy Failed', message: 'Could not copy code.', duration: 3000 });
  }
};
</script>

<template>
  <div :class="messageWrapperClasses" role="listitem">
    <div
      v-if="!isSystemOrError"
      class="avatar-wrapper-ephemeral"
      :class="avatarRoleClass"
      aria-hidden="true"
    >
      <component :is="avatarIcon" class="avatar-svg-ephemeral" />
    </div>

    <div
      class="message-container-ephemeral"
      :class="messageBubbleClasses"
      @mouseenter="showMessageToolbar = true"
      @mouseleave="showMessageToolbar = false"
      tabindex="0"
      :aria-label="`Message from ${senderName} at ${formattedTimestamp}. Content: ${message.content ? message.content.substring(0, 100) + '...' : (message.tool_calls ? 'Tool actions requested.' : 'No text content.')}`"
    >
      <div class="message-header-ephemeral" v-if="!isSystemOrError">
        <span class="sender-name-ephemeral">{{ senderName }}</span>
        <span class="timestamp-ephemeral">{{ formattedTimestamp }}</span>
      </div>

      <div
        class="message-content-area-ephemeral prose-ephemeral"
        :class="{'prose-invert': uiStore.isCurrentThemeDark && props.message.role !== 'user' && props.message.role !== 'tool'}"
        v-html="renderedContent"
        @click.capture="handleCodeCopy"
      ></div>

      <Transition name="fade-in-toolbar">
        <div v-if="showMessageToolbar && (message.content || message.tool_calls) && !isSystemOrError" class="message-toolbar-ephemeral">
          <button
            @click.stop="copyMessageContent"
            class="btn btn-xs-ephemeral btn-ghost-ephemeral btn-icon-ephemeral message-action-button"
            title="Copy message text"
            aria-label="Copy message text to clipboard"
          >
            <ClipboardDocumentIcon class="icon-xs" />
          </button>
        </div>
      </Transition>

    </div>
  </div>
</template>

<style lang="scss">
// Styles for Message.vue are primarily in frontend/src/styles/components/_message.scss

.fade-in-toolbar-enter-active,
.fade-in-toolbar-leave-active {
  transition: opacity 0.2s var.$ease-out-quad, transform 0.2s var.$ease-out-quad;
}
.fade-in-toolbar-enter-from,
.fade-in-toolbar-leave-to {
  opacity: 0;
  transform: translateY(3px) scale(0.95);
}

.message-toolbar-ephemeral {
  position: absolute;
  top: var.$spacing-xs;
  right: var.$spacing-xs;
  display: flex;
  gap: var.$spacing-xs;
  background-color: hsla(var(--color-bg-tertiary-h), var(--color-bg-tertiary-s), var(--color-bg-tertiary-l), 0.5);
  padding: calc(var.$spacing-xs / 1.5);
  border-radius: var.$radius-md;
  backdrop-filter: blur(3.5px);
  box-shadow: var(--shadow-depth-sm);
  z-index: 3;
}

.message-action-button {
  color: hsl(var(--color-text-muted-h), var(--color-text-muted-s), calc(var(--color-text-muted-l) + 10%));
  .icon-xs { width: 0.9rem; height: 0.9rem; } /* Adjusted size */

  &:hover {
    color: hsl(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l));
    background-color: hsla(var(--color-accent-interactive-h), var(--color-accent-interactive-s), var(--color-accent-interactive-l), 0.15) !important;
  }
}
</style>