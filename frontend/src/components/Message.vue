<template>
  <div
    :class="[
      'message-wrapper group/message',
      message.role === 'user' ? 'user-message-wrapper' : 'assistant-message-wrapper',
    ]"
    role="article"
    :aria-labelledby="`message-sender-${messageId}`"
    :aria-describedby="`message-content-${messageId}`"
  >
    <div class="message-container" :class="message.role === 'user' ? 'user-bubble-container' : 'assistant-bubble-container'">
      <div class="message-header">
        <div
          :class="[
            'avatar-icon-wrapper',
            message.role === 'user' ? 'avatar-user' : 'avatar-assistant',
          ]"
          aria-hidden="true"
        >
          <UserIcon v-if="message.role === 'user'" class="avatar-svg" />
          <CpuChipIcon v-else class="avatar-svg" />
        </div>
        <span :id="`message-sender-${messageId}`" class="sender-name">
          {{ message.role === 'user' ? 'You' : 'Assistant' }}
        </span>
        <span v-if="formattedTimestamp" class="timestamp">
          {{ formattedTimestamp }}
        </span>
      </div>

      <div
        :id="`message-content-${messageId}`"
        ref="contentRef"
        class="message-content-area prose dark:prose-invert max-w-none"
        :class="{
            'prose-sm': !isLargeText,
            'prose-base': isLargeText
        }"
      >
        </div>

      <DiagramViewer
        v-if="hasDiagram"
        :diagram-code="extractedDiagramCode"
        :diagram-type="extractedDiagramType"
        class="mt-3"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file Message.vue
 * @description Component to render a single chat message (user or assistant).
 * Handles Markdown parsing, syntax highlighting with line numbers, diagram extraction,
 * and provides a copy button for code blocks.
 * @version 1.2.2 - Corrected MarkedOptions type issues for xhtml and highlight.
 */
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import { marked, type MarkedOptions as OriginalMarkedOptions } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

import DiagramViewer from './DiagramViewer.vue';
import { UserIcon, CpuChipIcon } from '@heroicons/vue/24/outline';

// Define SVG strings for icons used in innerHTML
const ICONS = {
  DOCUMENT_DUPLICATE: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>`,
  CHECK: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4 text-green-500"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>`
};

// Custom MarkedOptions type to include potentially missing properties like 'highlight' and 'xhtml'
interface CustomMarkedOptions extends OriginalMarkedOptions {
  highlight?: (code: string, lang: string, callback?: (error: any, code?: string) => void) => string | void;
  xhtml?: boolean;
}

export interface MessageData {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

const props = defineProps<{
  message: MessageData;
  isLargeText?: boolean;
}>();

const contentRef = ref<HTMLElement | null>(null);
const messageId = computed(() => `msg-${props.message.timestamp || Date.now()}-${Math.random().toString(36).substring(2, 7)}`);

const formattedTimestamp = computed(() => {
  if (!props.message.timestamp) return '';
  try {
    return new Date(props.message.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    console.warn("Invalid timestamp for message:", props.message.timestamp);
    return '';
  }
});

// Synchronous highlight function using highlight.js
const highlightFn = (code: string, lang: string): string => {
  const language = lang ? lang.trim().toLowerCase() : 'plaintext';
  if (language && hljs.getLanguage(language)) {
    try {
      return hljs.highlight(code, { language, ignoreIllegals: true }).value;
    } catch (error) {
      console.warn(`Highlight.js: Error highlighting for language "${language}". Falling back.`, error);
    }
  }
  try {
    return hljs.highlightAuto(code).value;
  } catch (error) {
    console.warn('Highlight.js: Error auto-highlighting. Returning unhighlighted code.', error);
    return code;
  }
};

// Base Marked configuration using the custom type
const baseMarkedOptions: CustomMarkedOptions = {
  breaks: true,
  gfm: true,
  xhtml: false, // Error on line 129: Now explicitly allowed by CustomMarkedOptions
};
// Set global defaults once (or manage per parse() call if preferred)
marked.setOptions(baseMarkedOptions);


const hasDiagram = computed<boolean>(() => {
  return /```(mermaid|plantuml|graphviz)\s*\n([\s\S]*?)\n```/.test(props.message.content);
});

const extractedDiagramType = computed<string>(() => {
  const match = props.message.content.match(/```(mermaid|plantuml|graphviz)\s*\n/);
  return match ? match[1] : 'mermaid';
});

const extractedDiagramCode = computed<string>(() => {
  if (!hasDiagram.value) return '';
  const regex = new RegExp("```" + extractedDiagramType.value + "\\s*\\n([\\s\\S]*?)\\n```");
  const match = props.message.content.match(regex);
  return match ? match[1].trim() : '';
});

const addLineNumbers = (highlightedCodeHtml: string): string => {
  const lines = highlightedCodeHtml.split('\n');
  const nonEmptyLines = lines.length > 1 && lines[lines.length - 1].trim() === '' ? lines.slice(0, -1) : lines;
  return nonEmptyLines
    .map((line, index) => `<span class="line-number" data-line="${index + 1}"></span>${line}`)
    .join('\n');
};

const renderMessageContent = async () => {
  if (!contentRef.value || !props.message.content) {
    if (contentRef.value) contentRef.value.innerHTML = '';
    return;
  }

  let contentToRender = props.message.content;
  if (hasDiagram.value) {
    const regex = new RegExp("```" + extractedDiagramType.value + "\\s*\\n[\\s\\S]*?\\n```", "g");
    contentToRender = contentToRender.replace(regex,
      `<div class="diagram-placeholder">Diagram rendered separately</div>`
    );
  }

  // Store original default highlight function from marked.defaults
  // Cast to CustomMarkedOptions to satisfy TypeScript about the highlight property
  const originalDefaultHighlight = (marked.defaults as CustomMarkedOptions).highlight; // Error on line 192: Fixed by casting to CustomMarkedOptions

  // Temporarily set a new highlight function for this parse operation
  marked.setOptions({
    ...baseMarkedOptions,
    highlight: (code: string, lang: string): string => { // Error on line 196: Fixed by CustomMarkedOptions
      const highlighted = highlightFn(code, lang); // Use our synchronous highlightFn
      return addLineNumbers(highlighted);
    }
  } as CustomMarkedOptions); // Ensure the entire options object conforms

  contentRef.value.innerHTML = marked.parse(contentToRender);

  // Restore original default highlight function to global defaults
  marked.setOptions({ ...baseMarkedOptions, highlight: originalDefaultHighlight } as CustomMarkedOptions); // Error on line 205: Fixed by CustomMarkedOptions


  await nextTick();

  contentRef.value.querySelectorAll('pre').forEach(preElement => {
    if (preElement.querySelector('.copy-code-button')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper group/codeblock';
    preElement.parentNode?.insertBefore(wrapper, preElement);
    wrapper.appendChild(preElement);

    const codeElement = preElement.querySelector('code');
    const languageMatch = codeElement?.className.match(/language-(\S+)/);
    const language = languageMatch && languageMatch[1] !== 'hljs' ? languageMatch[1] : 'code';

    if (language && language !== 'plaintext' && language !== 'code') {
      const langLabel = document.createElement('span');
      langLabel.className = 'code-language-label';
      langLabel.textContent = language;
      wrapper.appendChild(langLabel);
    }

    const copyButton = document.createElement('button');
    copyButton.className = 'copy-code-button';
    copyButton.setAttribute('aria-label', 'Copy code to clipboard');
    copyButton.title = 'Copy code';
    copyButton.innerHTML = ICONS.DOCUMENT_DUPLICATE;

    copyButton.onclick = async () => {
      const codeToCopy = codeElement?.innerText || '';
      try {
        await navigator.clipboard.writeText(codeToCopy);
        copyButton.innerHTML = ICONS.CHECK;
        setTimeout(() => {
          copyButton.innerHTML = ICONS.DOCUMENT_DUPLICATE;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
        copyButton.textContent = 'Error';
        setTimeout(() => {
          copyButton.innerHTML = ICONS.DOCUMENT_DUPLICATE;
        }, 2000);
      }
    };
    wrapper.appendChild(copyButton);
  });
};

onMounted(() => {
  renderMessageContent();
});

watch(() => props.message.content, () => {
  renderMessageContent();
});

</script>

<style lang="postcss">
/* Styles remain the same as your previous version; no changes needed here based on the errors. */
/* General Message Styling */
.message-wrapper {
  @apply flex mb-4 sm:mb-6;
}
.user-message-wrapper {
  @apply justify-end;
}
.assistant-message-wrapper {
  @apply justify-start;
}

.message-container {
  @apply p-3 sm:p-4 rounded-xl shadow-md max-w-[85%] sm:max-w-[75%];
}
.user-bubble-container {
  @apply bg-gradient-to-br from-blue-500 to-blue-600 text-white dark:from-blue-600 dark:to-blue-700;
  border-bottom-right-radius: 0.25rem; /* Bubble tail */
}
.assistant-bubble-container {
  @apply bg-white dark:bg-gray-750 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700;
  border-bottom-left-radius: 0.25rem; /* Bubble tail */
}

.message-header {
  @apply flex items-center gap-2 mb-2;
}
.avatar-icon-wrapper {
  @apply p-1.5 rounded-full flex-shrink-0;
}
.avatar-user {
  @apply bg-blue-400 dark:bg-blue-500 text-white;
}
.avatar-assistant {
  @apply bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300;
}
.avatar-svg {
  @apply w-4 h-4 sm:w-5 sm:h-5;
}
.sender-name {
  @apply font-semibold text-sm;
}
.user-bubble-container .sender-name { @apply text-white; }
.assistant-bubble-container .sender-name { @apply text-gray-800 dark:text-white; }

.timestamp {
  @apply text-xs opacity-70 ml-auto;
}
.user-bubble-container .timestamp { @apply text-blue-100 dark:text-blue-200; }
.assistant-bubble-container .timestamp { @apply text-gray-500 dark:text-gray-400; }

.message-content-area {
  @apply text-sm leading-relaxed break-words;
}
.message-content-area :deep(p) {
  @apply mb-2 last:mb-0;
}
.message-content-area :deep(ul), .message-content-area :deep(ol) {
  @apply my-2 pl-5;
}
.message-content-area :deep(li) {
  @apply mb-1;
}
.message-content-area :deep(strong) {
    @apply font-semibold text-gray-900 dark:text-white;
}
.message-content-area :deep(a) {
    @apply text-primary-600 dark:text-primary-400 hover:underline;
}

/* Code Block Specific Styling */
.code-block-wrapper {
  @apply relative my-3;
}

.message-content-area :deep(pre) {
  @apply bg-gray-800 dark:bg-black/50 text-gray-100 dark:text-gray-200
        rounded-lg shadow-sm
        text-xs sm:text-sm m-0;
  line-height: 1.6;
}

.message-content-area :deep(pre code.hljs) {
  @apply block overflow-x-auto p-4;
  tab-size: 4;
}

.message-content-area :deep(code.hljs .line-number) {
  @apply inline-block w-8 sm:w-10 text-right pr-3 sm:pr-4 select-none text-gray-500 dark:text-gray-600 sticky left-0;
  background-color: inherit;
  border-right: 1px solid hsl(var(--neutral-hue, 220), 15%, 30%);
}
.dark .message-content-area :deep(code.hljs .line-number) {
  border-right-color: hsl(var(--neutral-hue, 220), 15%, 25%);
}


.code-language-label {
  @apply absolute top-1.5 right-10 sm:right-12 px-1.5 py-0.5 text-xs text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-700 rounded-sm opacity-0 group-hover/codeblock:opacity-100 transition-opacity;
}

.copy-code-button {
  @apply absolute top-1 right-1 p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md opacity-0 group-hover/codeblock:opacity-100 focus:opacity-100 transition-opacity duration-150;
}
.copy-code-button svg {
  @apply h-4 w-4;
}


.message-content-area :deep(code):not(.hljs) { /* Inline code */
  @apply bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-1 py-0.5 rounded-md text-xs;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.diagram-placeholder {
  @apply my-3 p-2 text-sm italic text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 rounded text-center;
}
</style>