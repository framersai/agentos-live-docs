// File: frontend/src/components/Message.vue
/**
 * @file Message.vue
 * @description Component to render a single chat message for "Ephemeral Harmony" theme.
 * Handles Markdown, syntax highlighting, diagram extraction, and copy button. Enhanced for readability and visuals.
 * @version 3.0.0
 */
<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick, type Component as VueComponentType } from 'vue';
import { marked, type MarkedOptions } from 'marked';
import hljs from 'highlight.js';

import DiagramViewer from './DiagramViewer.vue'; // Assuming this component is styled and functional
import {
  UserIcon,
  CpuChipIcon,
  CogIcon as SystemIcon, // Renamed CogIcon to SystemIcon for clarity
  ExclamationTriangleIcon as ErrorIcon,
  WrenchScrewdriverIcon as ToolIcon,
} from '@heroicons/vue/24/outline'; // Using outline icons for a lighter feel

// SVG strings for copy button states, using themed colors via CSS variables
const ICONS = {
  DOCUMENT_DUPLICATE: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-full w-full"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>`,
  CHECK: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="hsl(var(--color-success-h), var(--color-success-s), var(--color-success-l))" class="h-full w-full"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>`
};

interface CustomMarkedOptions extends MarkedOptions {
  highlight?: (code: string, lang: string, callback?: (error: any, code?: string) => void) => string | void;
}

export interface MessageData {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'error' | 'tool';
  content: string | null;
  timestamp?: number;
  name?: string;
  tool_call_id?: string;
  model?: string;
  usage?: { prompt_tokens: number | null; completion_tokens: number | null; total_tokens: number | null };
  // Added from ChatMessage in chat.store.ts for consistency if needed by other parts
  estimatedTokenCount?: number;
  processedTokens?: string[];
  relevanceScore?: number;
  isError?: boolean; // From ChatMessage
  tool_calls?: any[]; // From ChatMessage, ILlmToolCallUI equivalent
}

const props = defineProps<{
  message: MessageData;
  // isLargeText prop might be deprecated if global typography settings are sufficient
  // isLargeText?: boolean;
}>();

const contentRef = ref<HTMLElement | null>(null);
const messageId = computed(() => `msg-eph-${props.message.id || Math.random().toString(36).substring(2, 9)}`);

const formattedTimestamp = computed(() => {
  if (!props.message.timestamp) return '';
  try {
    return new Date(props.message.timestamp).toLocaleTimeString([], {
      hour: 'numeric', // Use 'numeric' for cleaner look, e.g., "3 PM"
      minute: '2-digit',
    });
  } catch (e) {
    console.warn("Message.vue: Invalid timestamp:", props.message.timestamp);
    return '';
  }
});

const highlightFn = (code: string, lang: string): string => {
  const language = lang ? lang.trim().toLowerCase() : 'plaintext';
  if (hljs.getLanguage(language)) {
    try { return hljs.highlight(code, { language, ignoreIllegals: true }).value; }
    catch (error) { console.warn(`HLJS error for lang "${language}":`, error); }
  }
  try { return hljs.highlightAuto(code).value; }
  catch (error) { console.warn('HLJS auto-highlight error:', error); return code; }
};

const addLineNumbersAndLangLabel = (highlightedCodeHtml: string, lang: string): string => {
  const lines = highlightedCodeHtml.split('\n');
  // Remove trailing empty line if present, often added by markdown parsers
  const nonEmptyLines = lines.length > 1 && lines[lines.length - 1].trim() === '' ? lines.slice(0, -1) : lines;
  
  const numberedLines = nonEmptyLines
    .map((line, index) => `<span class="line-number" aria-hidden="true" data-line="${index + 1}"></span><span class="line-content">${line || ' '}</span>`) // Add ' ' for empty lines to ensure height
    .join('\n');
  
  return numberedLines;
};


const baseMarkedOptions: CustomMarkedOptions = {
  breaks: true, gfm: true, pedantic: false,
  // highlight function will be set dynamically before parsing
};

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
    displayContent = displayContent.replace(regex, `<div class="diagram-placeholder-ephemeral">[Diagram rendered separately]</div>`);
  }

  if (!displayContent) {
    contentRef.value.innerHTML = props.message.role === 'assistant' ? '<p class="italic text-[var(--color-text-muted)] opacity-75">[Assistant is processing or action has no textual output]</p>' : '';
    return;
  }
  
  const renderer = new marked.Renderer();
  const originalCodeRenderer = renderer.code;
  renderer.code = (code, languageInfo, isEscaped) => {
    const langString = (languageInfo || '').match(/\S*/)?.[0] || 'plaintext';
    const highlighted = highlightFn(code, langString);
    const withLineNumbers = addLineNumbersAndLangLabel(highlighted, langString);
    
    // Wrap in the structure expected by the SCSS for copy button and lang label
    return `
      <div class="code-block-wrapper group/codeblock" data-lang="${langString}" data-raw-code="${encodeURIComponent(code)}">
        <div class="code-header-ephemeral">
          <span class="code-language-label">${langString}</span>
          <button class="copy-code-button" aria-label="Copy code" title="Copy code">
            ${ICONS.DOCUMENT_DUPLICATE}
          </button>
        </div>
        <pre><code class="language-${langString} hljs">${withLineNumbers}</code></pre>
      </div>
    `;
  };


  const currentMarkedOptions: CustomMarkedOptions = {
    ...baseMarkedOptions,
    renderer, // Use our custom renderer
    // We don't use marked's highlight, our renderer handles it.
  };
  contentRef.value.innerHTML = marked.parse(displayContent, currentMarkedOptions);

  await nextTick(); // Wait for DOM update

  // Attach event listeners to dynamically created copy buttons
  contentRef.value.querySelectorAll('.copy-code-button').forEach(button => {
    const wrapper = button.closest('.code-block-wrapper');
    if (wrapper) {
      const rawCode = decodeURIComponent(wrapper.getAttribute('data-raw-code') || '');
      button.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(rawCode);
          button.innerHTML = ICONS.CHECK;
          setTimeout(() => { button.innerHTML = ICONS.DOCUMENT_DUPLICATE; }, 2000);
        } catch (err) {
          console.error('Message.vue: Failed to copy code:', err);
          button.innerHTML = 'Error'; // Simple error indicator
          setTimeout(() => { button.innerHTML = ICONS.DOCUMENT_DUPLICATE; }, 2000);
        }
      });
    }
  });
};


const getAvatarIcon = (role: MessageData['role']): VueComponentType => {
  switch (role) {
    case 'user': return UserIcon;
    case 'assistant': return CpuChipIcon;
    case 'system': return SystemIcon;
    case 'error': return ErrorIcon;
    case 'tool': return ToolIcon;
    default: return CpuChipIcon;
  }
};

const getSenderName = (role: MessageData['role'], messageName?: string): string => {
  if (role === 'tool') return `Tool: ${messageName || 'Execution'}`;
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
  () => [props.message.content, props.message.role, props.message.name],
  () => {
    renderMessageContent();
  },
  { deep: false }
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
        'system-error-bubble-ephemeral', // Default for system/error
        { 'message-role-error': message.role === 'error' || message.isError }
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
        class="message-content-area-ephemeral"
        :class="{
          'tool-content-display': message.role === 'tool'
        }"
      >
        </div>
      <div v-else-if="message.role === 'assistant' && !message.content" class="message-content-area-ephemeral italic text-[var(--color-text-muted)] opacity-75">
        [Assistant is performing an action or has no textual output...]
      </div>
       <div v-else-if="(message.role === 'system' || message.role === 'error') && !message.content" class="message-content-area-ephemeral italic text-[var(--color-text-muted)] opacity-75">
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
// Styles are primarily in frontend/src/styles/components/_message.scss
// Minor unscoped styles or overrides can go here if absolutely necessary, but prefer the SCSS file.
</style>