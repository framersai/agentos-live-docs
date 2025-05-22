<template>
  <div class="mt-4 p-2 bg-gray-100 dark:bg-gray-900 rounded-md">
    <div v-if="isLoading" class="flex items-center justify-center p-8">
      <div class="w-8 h-8 border-2 border-t-primary-500 border-primary-200 rounded-full animate-spin"></div>
    </div>
    
    <div v-else-if="renderError" class="p-4 text-red-600 dark:text-red-400 text-sm">
      <p>Error rendering diagram: {{ renderError }}</p>
      <div class="mt-2 p-3 bg-gray-200 dark:bg-gray-800 rounded overflow-x-auto">
        <pre><code>{{ diagramCode }}</code></pre>
      </div>
    </div>
    
    <div v-else>
      <div v-if="diagramType === 'mermaid'" ref="mermaidContainer" class="mermaid-diagram"></div>
      
      <div v-else class="p-4">
        <p class="mb-2 text-sm text-gray-600 dark:text-gray-400">
          {{ diagramType }} diagrams display not yet implemented.
        </p>
        <div class="p-3 bg-gray-200 dark:bg-gray-800 rounded overflow-x-auto">
          <pre><code>{{ diagramCode }}</code></pre>
        </div>
      </div>
    </div>
    
    <div class="mt-2 flex justify-end" v-if="!isLoading && !renderError && diagramType === 'mermaid'">
      <button 
        @click="saveDiagram"
        class="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded"
      >
        Save Diagram
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import mermaid from 'mermaid';
import localforage from 'localforage';

// Props
const props = defineProps<{
  diagramCode: string;
  diagramType: string;
}>();

// Refs
const mermaidContainer = ref<HTMLElement | null>(null);
const isLoading = ref(true);
const renderError = ref('');
const currentTheme = ref(localStorage.getItem('darkMode') === 'true' ? 'dark' : 'default');

// --- FUNCTION DEFINITIONS MOVED UP ---

// Render diagram function
const renderDiagram = async () => {
  if (props.diagramType !== 'mermaid') {
    isLoading.value = false;
    renderError.value = ''; // Clear any previous errors
    // If mermaidContainer.value exists and has content, clear it for non-mermaid types
    if (mermaidContainer.value) {
        mermaidContainer.value.innerHTML = '';
    }
    return;
  }

  if (!props.diagramCode || props.diagramCode.trim() === '') {
    isLoading.value = false;
    renderError.value = 'Diagram code is empty.';
    if (mermaidContainer.value) {
        mermaidContainer.value.innerHTML = ''; // Clear container
    }
    return;
  }
  
  isLoading.value = true;
  renderError.value = '';
  
  // Ensure the container is available in the DOM
  await nextTick();

  if (!mermaidContainer.value) {
    console.error('Mermaid container not found in DOM.');
    renderError.value = 'Diagram container element not found.';
    isLoading.value = false;
    return;
  }
  
  try {
    // Try to get cached diagram
    // Note: btoa can throw an error if the string contains characters outside of the Latin1 range.
    // Consider a more robust hashing or encoding if diagramCode can contain arbitrary unicode.
    let cacheKey = 'diagram-cache-error';
    try {
      cacheKey = `diagram-${btoa(props.diagramCode + currentTheme.value)}`; // Include theme in cache key
    } catch (e) {
      console.warn("Failed to generate cache key with btoa, using fallback. Diagram code might contain non-Latin1 characters.", e);
    }
    
    const cachedSvg = await localforage.getItem<string>(cacheKey);
    
    if (cachedSvg) {
      mermaidContainer.value.innerHTML = cachedSvg;
      isLoading.value = false;
      return;
    }
    
    // Render new diagram
    // Initialize mermaid with the current theme before rendering
    mermaid.initialize({
      startOnLoad: false,
      theme: currentTheme.value,
      securityLevel: 'loose',
      fontSize: 14,
      // Suppress errors in the diagram itself for cleaner UI, handle via catch block
      // FIX: Added @ts-expect-error as 'suppressErrorRendering' might not be in the current MermaidConfig type,
      // but is a valid Mermaid JS option.
      // @ts-expect-error TS2353: 'suppressErrorRendering' does not exist in type 'MermaidConfig'.
      suppressErrorRendering: true,
    });

    const { svg } = await mermaid.render('mermaid-diagram-' + Date.now(), props.diagramCode);
    mermaidContainer.value.innerHTML = svg;
    
    // Cache the rendered SVG
    await localforage.setItem(cacheKey, svg);
    
  } catch (error) {
    console.error('Error rendering Mermaid diagram:', error);
    // Attempt to provide a more user-friendly error message from Mermaid if possible
    let errorMessage = 'Failed to render diagram.';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    renderError.value = errorMessage;
  } finally {
    isLoading.value = false;
  }
};

// Save diagram as SVG
const saveDiagram = () => {
  if (!mermaidContainer.value || props.diagramType !== 'mermaid') return;
  
  const svgContent = mermaidContainer.value.innerHTML;
  if (!svgContent.toLowerCase().includes('<svg')) {
    console.warn('No SVG content found to save.');
    // Optionally notify the user
    return;
  }

  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `diagram-${Date.now()}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};


// --- LIFECYCLE HOOKS AND WATCHERS ---

// Initialize and render on mount
onMounted(() => {
  // Initial render is triggered by the watcher with immediate: true
});

// Watch for changes in diagram code or type to re-render
watch(
  [() => props.diagramCode, () => props.diagramType, currentTheme], 
  async () => {
    await renderDiagram();
  },
  { immediate: true, deep: true } // immediate to render on initial load, deep for objects if props were complex
);

// Watch for theme changes from localStorage (e.g., if another tab changes it or via dev tools)
// This is a simple polling mechanism for localStorage, as it's not natively reactive.
// For a more robust solution, consider a shared state management (Pinia/Vuex) or browser events.
let themeWatcherInterval: number | undefined;
onMounted(() => {
  themeWatcherInterval = window.setInterval(() => {
    const newThemeValue = localStorage.getItem('darkMode') === 'true' ? 'dark' : 'default';
    if (newThemeValue !== currentTheme.value) {
      console.log('Theme changed via localStorage:', newThemeValue);
      currentTheme.value = newThemeValue;
      // The watcher on currentTheme will trigger re-render
    }
  }, 1000); // Check every second
});

// Clear interval on unmount
import { onBeforeUnmount } from 'vue';
onBeforeUnmount(() => {
  if (themeWatcherInterval) {
    clearInterval(themeWatcherInterval);
  }
});

</script>

<style lang="postcss" scoped>
.mermaid-diagram {
  @apply overflow-x-auto p-2 bg-white dark:bg-gray-800 rounded; /* Added padding and bg for diagram itself */
}

.mermaid-diagram :deep(svg) {
  @apply mx-auto;
  /* min-width: 100%; Ensure SVG scales, but max-width on container might be better */
  display: block; /* Fixes potential extra space under SVG */
}

/* Styling for the spinner to match the provided HTML */
.border-t-primary-500 {
  border-top-color: #3b82f6; /* Example: Tailwind's blue-500 */
}
.border-primary-200 {
  border-color: #bfdbfe; /* Example: Tailwind's blue-200, for the other parts of the border */
}
</style>