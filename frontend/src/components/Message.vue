// File: frontend/src/components/Message.vue
/**
 * @file Message.vue
 * @description Component to render a single chat message for "Ephemeral Harmony" theme.
 * Handles Markdown, syntax highlighting, diagram extraction, and copy button.
 * @version 2.1.0 - Ensured all script setup bindings are correctly exposed for template, fixed type issues.
 */
<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick, type Component as VueComponentType } from 'vue';
import { marked, type MarkedOptions as OriginalMarkedOptions } from 'marked';
import hljs from 'highlight.js'; // highlight.js is used by highlightFn

// HLJS theme should be imported globally once, e.g., in main.ts or main.scss
// For example, if you have a src/styles/vendor/_highlightjs.scss:
// @import 'highlight.js/styles/atom-one-dark.css';
// And then import that SCSS file in main.scss.
// Or directly in main.ts: import 'highlight.js/styles/atom-one-dark.css';

import DiagramViewer from './DiagramViewer.vue';
import { UserIcon, CpuChipIcon, CogIcon as SystemIcon, ExclamationTriangleIcon as ErrorIcon, WrenchScrewdriverIcon as ToolIcon } from '@heroicons/vue/24/outline';

// SVG strings for icons
const ICONS = {
  DOCUMENT_DUPLICATE: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>`,
  CHECK: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="hsl(var(--color-success-h), var(--color-success-s), var(--color-success-l))" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>`
};

interface CustomMarkedOptions extends OriginalMarkedOptions {
  highlight?: (code: string, lang: string, callback?: (error: any, code?: string) => void) => string | void;
  xhtml?: boolean;
}

export interface MessageData {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'error' | 'tool';
  content: string | null;
  timestamp?: number;
  name?: string; // For tool name or system actor name
  tool_call_id?: string; // For tool results, linking back to a tool_call
  // Add other fields from StoreChatMessage if Message.vue needs to render them directly
  // e.g. model, usage for assistant messages for debugging/info display
  model?: string;
  usage?: { prompt_tokens: number | null; completion_tokens: number | null; total_tokens: number | null };
}

const props = defineProps<{
  message: MessageData;
  isLargeText?: boolean;
}>();

const contentRef = ref<HTMLElement | null>(null);
const messageId = computed(() => `msg-eph-${props.message.id || Math.random().toString(36).substring(2,9)}`);

const formattedTimestamp = computed(() => {
  if (!props.message.timestamp) return '';
  try {
    return new Date(props.message.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    console.warn("Message.vue: Invalid timestamp:", props.message.timestamp);
    return '';
  }
});

const highlightFn = (code: string, lang: string): string => {
  const language = lang ? lang.trim().toLowerCase() : 'plaintext';
  if (language && hljs.getLanguage(language)) {
    try { return hljs.highlight(code, { language, ignoreIllegals: true }).value; }
    catch (error) { console.warn(`HLJS error for lang "${language}":`, error); }
  }
  try { return hljs.highlightAuto(code).value; } // Fallback to auto-detection
  catch (error) { console.warn('HLJS auto-highlight error:', error); return code; } // Return unhighlighted on error
};

const baseMarkedOptions: CustomMarkedOptions = {
  breaks: true, gfm: true, xhtml: false, pedantic: false
};
// Set global default once. If specific options per parse are needed, pass them directly.
// marked.setOptions(baseMarkedOptions); // This was in your original, moved to be per-call for safety

const hasDiagram = computed<boolean>(() =>
  props.message.content ? /```(mermaid|plantuml|graphviz)\s*\n([\s\S]*?)\n```/.test(props.message.content) : false
);

const extractedDiagramType = computed<string>(() => {
  const match = props.message.content?.match(/```(mermaid|plantuml|graphviz)\s*\n/);
  return match ? match[1] : 'mermaid';
});

const extractedDiagramCode = computed<string>(() => {
  if (!hasDiagram.value || !props.message.content) return '';
  const regex = new RegExp("```" + extractedDiagramType.value + "\\s*\\n([\\s\\S]*?)\\n```");
  const match = props.message.content.match(regex);
  return match ? match[1].trim() : '';
});

const addLineNumbers = (highlightedCodeHtml: string): string => {
  const lines = highlightedCodeHtml.split('\n');
  const nonEmptyLines = lines.length > 1 && lines[lines.length - 1].trim() === '' ? lines.slice(0, -1) : lines;
  return nonEmptyLines
    .map((line, index) => `<span class="line-number" data-line="${index + 1}"></span><span class="line-content">${line}</span>`)
    .join('\n');
};

const renderMessageContent = async () => {
  if (!contentRef.value) return;
  let displayContent = props.message.content;

  if (props.message.role === 'tool') {
    let toolResultDisplay = '';
    if (props.message.content) {
      try {
        const parsedJson = JSON.parse(props.message.content);
        toolResultDisplay = `Result for '${props.message.name || props.message.tool_call_id || 'tool'}':\n\`\`\`json\n${JSON.stringify(parsedJson, null, 2)}\n\`\`\``;
      } catch (e) {
        toolResultDisplay = `Result for '${props.message.name || props.message.tool_call_id || 'tool'}':\n\`\`\`text\n${props.message.content}\n\`\`\``;
      }
    } else {
      toolResultDisplay = `[Tool: ${props.message.name || 'unknown tool'} executed, no textual output]`;
    }
    displayContent = toolResultDisplay;
  } else if (hasDiagram.value && displayContent) {
    const regex = new RegExp("```" + extractedDiagramType.value + "\\s*\\n[\\s\\S]*?\\n```", "g");
    displayContent = displayContent.replace(regex, `<div class="diagram-placeholder-ephemeral">[Diagram rendered by DiagramViewer component]</div>`);
  }

  if (!displayContent) {
    contentRef.value.innerHTML = props.message.role === 'assistant' ? '<p class="italic text-[var(--color-text-muted)]">[Assistant is processing or action has no textual output]</p>' : '';
    return;
  }

  // Pass options directly to marked.parse for this specific render
  const currentMarkedOptions: CustomMarkedOptions = {
    ...baseMarkedOptions, // Spread base options
    highlight: (code, lang) => addLineNumbers(highlightFn(code, lang)), // Add our highlighter
  };
  contentRef.value.innerHTML = marked.parse(displayContent, currentMarkedOptions);

  await nextTick();

  contentRef.value.querySelectorAll('pre').forEach(preElement => {
    if (preElement.querySelector('.copy-code-button')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper group/codeblock';
    preElement.parentNode?.insertBefore(wrapper, preElement);
    wrapper.appendChild(preElement);

    const codeElement = preElement.querySelector('code');
    const languageMatch = codeElement?.className.match(/language-(\S+)/);
    const language = languageMatch && languageMatch[1] && languageMatch[1].toLowerCase() !== 'hljs' ? languageMatch[1] : '';

    if (language && language !== 'plaintext' && language !== 'text' && language !== 'nohighlight') {
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

    copyButton.onclick = async () => { /* ... (copy logic remains the same) ... */
      const codeToCopy = codeElement?.innerText || '';
      try {
        await navigator.clipboard.writeText(codeToCopy);
        copyButton.innerHTML = ICONS.CHECK;
        setTimeout(() => { copyButton.innerHTML = ICONS.DOCUMENT_DUPLICATE; }, 2000);
      } catch (err) {
        console.error('Message.vue: Failed to copy code:', err);
        copyButton.textContent = 'Err';
        setTimeout(() => { copyButton.innerHTML = ICONS.DOCUMENT_DUPLICATE; }, 2000);
      }
    };
    wrapper.appendChild(copyButton);
  });
};

const getAvatarIcon = (role: MessageData['role']): VueComponentType => {
  switch (role) {
    case 'user': return UserIcon;
    case 'assistant': return CpuChipIcon;
    case 'system': return SystemIcon;
    case 'error': return ErrorIcon;
    case 'tool': return ToolIcon;
    default: return CpuChipIcon; // Fallback
  }
};

const getSenderName = (role: MessageData['role'], messageName?: string): string => {
  if (role === 'tool') return `Tool: ${messageName || 'Execution Result'}`;
  if (role === 'system' && messageName) return `System (${messageName})`;
  switch (role) {
    case 'user': return 'You';
    case 'assistant': return 'Assistant';
    case 'system': return 'System';
    case 'error': return 'System Error';
    default:
      const r = role as string;
      return r.charAt(0).toUpperCase() + r.slice(1);
  }
};

onMounted(() => {
  renderMessageContent();
});

watch(
  () => [props.message.content, props.message.role, props.message.name], // Watch relevant reactive parts
  () => {
    renderMessageContent();
  },
  { deep: false } // Content change is enough, role/name are simple strings
);

</script>

<template>
  <div
    :class="[
      'message-wrapper-ephemeral',
      `message-role-${message.role}`,
      message.role === 'user' ? 'user-message-wrapper' : `${message.role}-message-wrapper assistant-message-wrapper`,
    ]"
    role="article"
    :aria-labelledby="`${messageId}-sender`"
    :aria-describedby="`${messageId}-content`"
  >
    <div
      class="message-container-ephemeral"
      :class="[
        message.role === 'user' ? 'user-bubble-ephemeral' :
        message.role === 'assistant' ? 'assistant-bubble-ephemeral' :
        message.role === 'tool' ? 'tool-bubble-ephemeral' :
        'system-error-bubble-ephemeral' // Default for system/error
      ]"
    >
      <div class="message-header-ephemeral">
        <div
          class="avatar-wrapper-ephemeral"
          :class="[`avatar-${message.role}`]"
          aria-hidden="true"
        >
          <component :is="getAvatarIcon(message.role)" class="avatar-svg-ephemeral" />
        </div>
        <span :id="`${messageId}-sender`" class="sender-name-ephemeral">
          {{ getSenderName(message.role, message.name) }}
        </span>
        <span v-if="formattedTimestamp" class="timestamp-ephemeral">
          {{ formattedTimestamp }}
        </span>
      </div>

      <div
        v-if="message.content || message.role === 'tool'"
        :id="`${messageId}-content`"
        ref="contentRef"
        class="message-content-area-ephemeral prose dark:prose-invert max-w-none"
        :class="{
          'prose-sm': !isLargeText,
          'prose-base': isLargeText,
          'tool-content-display': message.role === 'tool'
        }"
      >
        </div>
      <div v-else-if="message.role === 'assistant' && !message.content" class="message-content-area-ephemeral italic text-[var(--color-text-muted)]">
        [Assistant is performing an action or has no textual output...]
      </div>
       <div v-else-if="(message.role === 'system' || message.role === 'error') && !message.content" class="message-content-area-ephemeral italic text-[var(--color-text-muted)]">
        [{{ message.role }} message - no textual content]
      </div>

      <DiagramViewer
        v-if="hasDiagram && message.content && message.role !== 'tool'"
        :diagram-code="extractedDiagramCode"
        :diagram-type="extractedDiagramType"
        class="mt-3 embedded-diagram-viewer"
      />
    </div>
  </div>
</template>

<style lang="scss">
// Styles are in frontend/src/styles/components/_message.scss
</style>