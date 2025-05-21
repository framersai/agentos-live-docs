<template>
  <div 
    :class="[
      message.role === 'user' 
        ? 'user-message' 
        : 'assistant-message'
    ]"
  >
    <!-- Message header with role icon -->
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
    
    <!-- Render content as markdown -->
    <div ref="contentRef" class="prose prose-sm max-w-none dark:prose-invert"></div>
    
    <!-- Diagram Viewer (if diagram is detected in the message) -->
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
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true
});

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
  return 'mermaid';
});

const extractedDiagram = computed(() => {
  if (!hasDiagram.value) return '';
  
  const type = diagramType.value;
  const regex = new RegExp(`\`\`\`${type}\\n([\\s\\S]*?)\\n\`\`\``, 'g');
  const match = regex.exec(props.message.content);
  
  return match ? match[1] : '';
});

// Process and render message content
const renderContent = () => {
  if (contentRef.value && props.message.content) {
    // Replace diagram code for rendering separately
    let processedContent = props.message.content;
    
    if (hasDiagram.value) {
      processedContent = processedContent.replace(/```(mermaid|plantuml|graphviz)\n[\s\S]*?\n```/g, 
        (match) => `<div class="mt-4 mb-2 p-2 rounded-md bg-gray-100 dark:bg-gray-900 text-sm text-gray-500 dark:text-gray-400">Diagram visualization below</div>`
      );
    }
    
    // Render markdown
    contentRef.value.innerHTML = marked(processedContent);
    
    // Add copy button to code blocks
    const codeBlocks = contentRef.value.querySelectorAll('pre code');
    codeBlocks.forEach((codeBlock, index) => {
      const pre = codeBlock.parentElement;
      if (pre) {
        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'relative group';
        pre.parentNode?.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
        
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'absolute top-2 right-2 p-1 rounded bg-gray-700 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200';
        copyButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
        `;
        
        // Add click handler
        copyButton.addEventListener('click', () => {
          navigator.clipboard.writeText(codeBlock.textContent || '');
          
          // Show feedback
          const originalHTML = copyButton.innerHTML;
          copyButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          `;
          
          setTimeout(() => {
            copyButton.innerHTML = originalHTML;
          }, 2000);
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