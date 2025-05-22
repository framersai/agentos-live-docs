<template>
  <div
    :class="[
      message.role === 'user'
        ? 'user-message'
        : 'assistant-message'
    ]"
  >
    <div class="flex items-center mb-3">
      <div
        :class="[
          'p-1.5 rounded-full mr-2',
          message.role === 'user'
            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm'
            : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-sm dark:from-gray-700 dark:to-gray-800'
        ]"
      >
        <svg v-if="message.role === 'user'" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <span class="font-medium dark:text-white">{{ message.role === 'user' ? 'You' : 'Assistant' }}</span>
      <span class="ml-2 text-xs text-gray-500 dark:text-gray-400">
        {{ new Date().toLocaleTimeString() }}
      </span>
    </div>

    <div ref="contentRef" class="prose prose-sm max-w-none dark:prose-invert"></div>

    <DiagramViewer
      v-if="hasDiagram"
      :diagram-code="extractedDiagram"
      :diagram-type="diagramType"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { marked } from 'marked';
import DiagramViewer from './DiagramViewer.vue';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

// Props
const props = defineProps<{
  message: { role: string; content: string };
}>();

// Refs
const contentRef = ref<HTMLElement | null>(null);

// Setup marked options for code highlighting
marked.setOptions({
  highlight: function(code: string, lang: string): string {
    const language = lang ? lang.trim().toLowerCase() : '';
    if (language && hljs.getLanguage(language)) {
      try {
        return hljs.highlight(code, { language: language, ignoreIllegals: true }).value;
      } catch (error) {
        console.error(`Highlight.js: Error highlighting for language "${language}"`, error);
        // Fallback to auto-highlight or no highlight (handled by the next try-catch)
      }
    }
    try {
      return hljs.highlightAuto(code).value;
    } catch (error) {
      console.error('Highlight.js: Error auto-highlighting', error);
      return code; // Return original code as a last resort if all highlighting fails
    }
  },
  breaks: true
} as any); // Use 'as any' to bypass TS2353 if MarkedOptions type is incomplete

// Extract diagram if present
const hasDiagram = computed(() => {
  return props.message.content.includes('```mermaid') ||
         props.message.content.includes('```plantuml') ||
         props.message.content.includes('```graphviz');
});

const diagramType = computed(() => {
  if (props.message.content.includes('```mermaid')) return 'mermaid';
  if (props.message.content.includes('```plantuml')) return 'plantuml';
  if (props.message.content.includes('```graphviz')) return 'graphviz';
  return 'mermaid'; // Default or fallback
});

const extractedDiagram = computed(() => {
  if (!hasDiagram.value) return '';

  const type = diagramType.value;
  // Ensure 'type' is a string that can be safely inserted into a RegExp
  const safeType = type.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\`\`\`${safeType}\\n([\\s\\S]*?)\\n\`\`\``, 'g');
  const match = regex.exec(props.message.content);

  return match ? match[1] : '';
});

// Process and render message content
const renderContent = () => {
  if (contentRef.value && props.message.content) {
    // Replace diagram code for rendering separately
    let processedContent = props.message.content;

    if (hasDiagram.value) {
      const type = diagramType.value;
      // Ensure 'type' is a string that can be safely inserted into a RegExp
      const safeType = type.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      processedContent = processedContent.replace(new RegExp(`\`\`\`${safeType}\\n[\\s\\S]*?\\n\`\`\``, 'g'),
        () => `<div class="mt-4 mb-2 p-2 rounded-md bg-gray-100 dark:bg-gray-900 text-sm text-gray-500 dark:text-gray-400">Diagram visualization below</div>`
      );
    }

    // Render markdown
    contentRef.value.innerHTML = marked(processedContent);

    // Add copy button to code blocks
    const codeBlocks = contentRef.value.querySelectorAll('pre code');
    codeBlocks.forEach((codeBlockEl) => { // Renamed for clarity
      const codeBlock = codeBlockEl as HTMLElement; // Type assertion
      const pre = codeBlock.parentElement as HTMLPreElement | null; // Type assertion and get parent
      if (pre) {
        // Check if a copy button wrapper already exists to prevent duplicates
        if (pre.parentElement?.classList.contains('code-block-wrapper')) {
            return;
        }

        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'relative group code-block-wrapper'; // Added a specific class
        pre.parentNode?.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'absolute top-2 right-2 p-1 rounded bg-gray-700 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500';
        copyButton.setAttribute('aria-label', 'Copy code');
        copyButton.setAttribute('title', 'Copy code');
        copyButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        `;

        // Add click handler
        copyButton.addEventListener('click', async () => { // Make async for clipboard
          if (!codeBlock.textContent) return;
          try {
            await navigator.clipboard.writeText(codeBlock.textContent);

            // Show feedback
            const originalHTML = copyButton.innerHTML;
            copyButton.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            `;
            copyButton.classList.add('text-green-400'); // Feedback color

            setTimeout(() => {
              copyButton.innerHTML = originalHTML;
              copyButton.classList.remove('text-green-400');
            }, 2000);
          } catch (err) {
            console.error('Failed to copy text: ', err);
            // Optionally, provide user feedback about the copy failure
            const originalHTML = copyButton.innerHTML;
            copyButton.innerHTML = 'Error'; // Simple error text
            setTimeout(() => {
              copyButton.innerHTML = originalHTML;
            }, 2000);
          }
        });

        wrapper.appendChild(copyButton);
      }
    });
  }
};

// Initial render and watch for changes
onMounted(renderContent);
watch(() => props.message.content, renderContent);

</script>