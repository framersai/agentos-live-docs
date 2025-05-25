<template>
  <div
    :class="[
      'message-wrapper group/message', // Added group for copy button context
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
          <CpuChipIcon v-else class="avatar-svg" /> </div>
        <span :id="`message-sender-${messageId}`" class="sender-name">
          {{ message.role === 'user' ? 'You' : 'Assistant' }}
        </span>
        <span class="timestamp">
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
 * @version 1.2.0 - Implemented line numbering for code blocks. Enhanced styling and accessibility.
 */
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import { marked, MarkedOptions } from 'marked';
import hljs from 'highlight.js';
// Ensure a default theme is imported. More themes can be added and toggled.
import 'highlight.js/styles/atom-one-dark.css'; // Example: Atom One Dark theme
// Or: import 'highlight.js/styles/github-dark.css';

import DiagramViewer from './DiagramViewer.vue';
import { UserIcon, CpuChipIcon, DocumentDuplicateIcon, CheckIcon } from '@heroicons/vue/24/outline'; // Added icons

/**
 * @typedef MessageData
 * @property {'user' | 'assistant'} role - The role of the message sender.
 * @property {string} content - The raw text content of the message.
 * @property {number} [timestamp] - Optional timestamp of the message.
 */
interface MessageData {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

const props = defineProps<{
  message: MessageData;
  isLargeText?: boolean; // Optional prop to control text size
}>();

const contentRef = ref<HTMLElement | null>(null);
const messageId = computed(() => `msg-${props.message.timestamp || Date.now()}-${Math.random().toString(36).substring(2,7)}`);

const formattedTimestamp = computed(() => {
  if (!props.message.timestamp) return '';
  return new Date(props.message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
});

/**
 * Configures Marked library for Markdown parsing.
 * Enables GitHub Flavored Markdown, line breaks, and syntax highlighting via highlight.js.
 */
const markedOptions: MarkedOptions = {
  highlight: (code: string, lang: string): string => {
    const language = lang ? lang.trim().toLowerCase() : 'plaintext';
    if (language && hljs.getLanguage(language)) {
      try {
        return hljs.highlight(code, { language, ignoreIllegals: true }).value;
      } catch (error) {
        console.warn(`Highlight.js: Error highlighting for language "${language}". Falling back.`, error);
      }
    }
    try {
      // Fallback to auto-detection if language is not specified or not supported
      return hljs.highlightAuto(code).value;
    } catch (error) {
      console.warn('Highlight.js: Error auto-highlighting. Returning unhighlighted code.', error);
      return code; // Return original code as a last resort
    }
  },
  breaks: true, // Convert GFM line breaks to <br>
  gfm: true,    // Enable GitHub Flavored Markdown
  xhtml: false, // Do not output self-closing tags for elements like <br />
};
marked.setOptions(markedOptions);

const hasDiagram = computed<boolean>(() => {
  return /```(mermaid|plantuml|graphviz)\s*\n([\s\S]*?)\n```/.test(props.message.content);
});

const extractedDiagramType = computed<string>(() => {
  const match = props.message.content.match(/```(mermaid|plantuml|graphviz)\s*\n/);
  return match ? match[1] : 'mermaid'; // Default to mermaid if type not explicit or found
});

const extractedDiagramCode = computed<string>(() => {
  if (!hasDiagram.value) return '';
  const regex = new RegExp("```" + extractedDiagramType.value + "\\s*\\n([\\s\\S]*?)\\n```");
  const match = props.message.content.match(regex);
  return match ? match[1].trim() : '';
});

/**
 * Adds line numbers to a pre-formatted (by highlight.js) HTML code block.
 * @param {string} highlightedCodeHtml - The HTML string of the highlighted code.
 * @returns {string} HTML string with line numbers prepended to each line.
 */
const addLineNumbers = (highlightedCodeHtml: string): string => {
    const lines = highlightedCodeHtml.split('\n');
    // Filter out a potential trailing empty line that results from split if code ends with \n
    const nonEmptyLines = lines.length > 1 && lines[lines.length -1].trim() === '' ? lines.slice(0, -1) : lines;

    return nonEmptyLines
        .map((line, index) => `<span class="line-number" data-line="${index + 1}"></span>${line}`)
        .join('\n');
};

/**
 * Renders the message content as Markdown, applying syntax highlighting and line numbers.
 * Also attaches copy-to-clipboard functionality to code blocks.
 */
const renderMessageContent = async () => {
  if (!contentRef.value || !props.message.content) return;

  let contentToRender = props.message.content;
  if (hasDiagram.value) {
    // Remove diagram block from main content as it's handled by DiagramViewer
    const regex = new RegExp("```" + extractedDiagramType.value + "\\s*\\n[\\s\\S]*?\\n```", "g");
    contentToRender = contentToRender.replace(regex,
      `<div class="diagram-placeholder my-3 p-2 text-sm italic text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 rounded text-center">Diagram rendered separately</div>`
    );
  }

  // Temporarily override the highlight function to inject line numbers
  const originalHighlight = marked.options.highlight;
  marked.setOptions({
    highlight: (code: string, lang: string): string => {
      const highlighted = originalHighlight?.(code, lang, (err, highlightedCode) => {
        if (err) throw err;
        return highlightedCode || code;
      }) || hljs.highlightAuto(code).value; // Fallback if originalHighlight is undefined
      return addLineNumbers(highlighted as string);
    }
  });

  contentRef.value.innerHTML = marked.parse(contentToRender) as string;
  marked.setOptions({ highlight: originalHighlight }); // Restore original highlight function

  await nextTick(); // Wait for DOM updates

  // Add copy buttons to all <pre> elements (which now contain highlighted code with line numbers)
  contentRef.value.querySelectorAll('pre').forEach(preElement => {
    if (preElement.querySelector('.copy-code-button')) return; // Already has a button

    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper relative group/codeblock'; // For group hover
    preElement.parentNode?.insertBefore(wrapper, preElement);
    wrapper.appendChild(preElement);
    // Add language label
    const codeElement = preElement.querySelector('code');
    const language = codeElement?.className.match(/language-(\S+)/)?.[1] || 'code';
    if (language && language !== 'plaintext') {
        const langLabel = document.createElement('span');
        langLabel.className = 'code-language-label absolute top-1.5 right-10 sm:right-12 px-1.5 py-0.5 text-xs text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-700 rounded-sm opacity-0 group-hover/codeblock:opacity-100 transition-opacity';
        langLabel.textContent = language;
        wrapper.appendChild(langLabel);
    }


    const copyButton = document.createElement('button');
    copyButton.className = 'copy-code-button absolute top-1 right-1 p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md opacity-0 group-hover/codeblock:opacity-100 focus:opacity-100 transition-opacity duration-150';
    copyButton.setAttribute('aria-label', 'Copy code to clipboard');
    copyButton.title = 'Copy code';
    copyButton.innerHTML = DocumentDuplicateIcon({ class: 'h-4 w-4' }).outerHTML; // Use Heroicon

    copyButton.onclick = async () => {
      const codeToCopy = preElement.querySelector('code')?.innerText || '';
      try {
        await navigator.clipboard.writeText(codeToCopy);
        copyButton.innerHTML = CheckIcon({ class: 'h-4 w-4 text-green-500' }).outerHTML;
        setTimeout(() => {
          copyButton.innerHTML = DocumentDuplicateIcon({ class: 'h-4 w-4' }).outerHTML;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
        copyButton.textContent = 'Error';
        setTimeout(() => {
          copyButton.innerHTML = DocumentDuplicateIcon({ class: 'h-4 w-4' }).outerHTML;
        }, 2000);
      }
    };
    wrapper.appendChild(copyButton);
  });
};


// --- Lifecycle Hooks & Watchers ---
onMounted(() => {
  renderMessageContent();
});

watch(() => props.message.content, () => {
  renderMessageContent();
});
watch(() => props.isLargeText, () => {
    // Could force re-render if prose classes depend on it, but usually CSS handles this.
});

</script>

<style lang="postcss">
/* Scoped styles are not ideal for v-html content, so use global or :deep */

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
  /* Ensure prose styles for v-html content are applied correctly */
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
    @apply font-semibold text-gray-900 dark:text-white; /* Ensure strong stands out */
}
.message-content-area :deep(a) {
    @apply text-primary-600 dark:text-primary-400 hover:underline;
}

/* Code Block Styling with Line Numbers */
.message-content-area :deep(pre) {
  @apply bg-gray-800 dark:bg-black/50 text-gray-100 dark:text-gray-200 
         p-0 rounded-lg shadow-sm my-3 text-xs sm:text-sm; /* Remove padding from pre, add to code */
  line-height: 1.6; /* Adjust for better readability with line numbers */
}
.message-content-area :deep(pre code.hljs) { /* Target hljs class specifically */
  @apply block overflow-x-auto p-4; /* Add padding here */
  tab-size: 4;
}

.message-content-area :deep(code.hljs .line-number) {
  @apply inline-block w-8 sm:w-10 text-right pr-3 sm:pr-4 select-none text-gray-500 dark:text-gray-600 sticky left-0 bg-gray-800 dark:bg-black/50; /* Sticky line numbers */
  border-right: 1px solid var(--line-number-border-color, #374151); /* gray-700 */
}
.dark .message-content-area :deep(code.hljs .line-number) {
  border-right-color: var(--line-number-border-color-dark, #4b5563); /* gray-600 */
}

.message-content-area :deep(code):not(.hljs) { /* Inline code */
  @apply bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-1 py-0.5 rounded-md text-xs;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.diagram-placeholder {
  /* Styles for the placeholder text indicating diagram location */
}
</style>