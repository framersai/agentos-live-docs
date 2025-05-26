// components/DiagramViewer.vue
<template>
  <div class="diagram-viewer-wrapper mt-4 p-2 bg-[var(--bg-subtle)] dark:bg-[var(--bg-surface)] rounded-lg shadow-sm border border-[var(--border-color)] dark:border-[var(--border-color)]">
    <div v-if="isLoading" class="flex items-center justify-center p-8 min-h-[150px]">
      <div class="w-8 h-8 border-2 rounded-full animate-spin diagram-spinner"></div>
    </div>
    
    <div v-else-if="renderError" class="p-4 text-red-600 dark:text-red-400 text-sm">
      <p class="font-semibold">Error Rendering Diagram:</p>
      <p class="mt-1 text-xs">{{ renderError }}</p>
      <div class="mt-3 p-3 bg-[var(--bg-base)] dark:bg-gray-800 border border-[var(--border-color)] dark:border-gray-700 rounded overflow-x-auto">
        <pre class="text-xs whitespace-pre-wrap break-all"><code>{{ diagramCode }}</code></pre>
      </div>
    </div>
    
    <div v-else>
      <div v-if="diagramType === 'mermaid'" ref="mermaidContainer" class="mermaid-diagram-container">
      </div>
      
      <div v-else class="p-4">
        <p class="mb-2 text-sm text-[var(--text-secondary)]">
          Diagram type "{{ diagramType }}" display not yet implemented. Showing code instead:
        </p>
        <div class="p-3 bg-[var(--bg-base)] dark:bg-gray-800 border border-[var(--border-color)] dark:border-gray-700 rounded overflow-x-auto">
          <pre class="text-xs whitespace-pre-wrap break-all"><code>{{ diagramCode }}</code></pre>
        </div>
      </div>
    </div>
    
    <div class="mt-2 pt-2 border-t border-[var(--border-color)] dark:border-gray-700 flex justify-end" 
         v-if="!isLoading && !renderError && diagramType === 'mermaid' && hasRenderedMermaidContent">
      <button 
        @click="saveDiagram"
        class="px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors 
               bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 
               text-[var(--text-secondary)] hover:text-[var(--text-primary)]
               focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-subtle)]"
      >
        Save Diagram
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// components/DiagramViewer.vue
import { ref, onMounted, onBeforeUnmount, watch, nextTick, computed } from 'vue';
import mermaid from 'mermaid';
import localforage from 'localforage';

// Props
const props = defineProps<{
  diagramCode: string;
  diagramType: string;
}>();

// Refs
const mermaidContainer = ref<HTMLElement | null>(null);
const isLoading = ref(false); // Start as false, set to true when actually rendering
const renderError = ref('');
const currentTheme = ref(localStorage.getItem('darkMode') === 'true' ? 'dark' : 'default');
let isMounted = false; // Track mounted state

// Computed
const hasRenderedMermaidContent = computed(() => {
  return mermaidContainer.value?.innerHTML?.includes('<svg');
});

// --- Helper Functions ---
function simpleHash(str: string): string {
  let hash = 0;
  if (str.length === 0) return 'h0';
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; 
  }
  return 'h' + (hash >>> 0).toString(36);
}

// --- Core Logic ---
const renderDiagram = async () => {
  if (!isMounted) { // Don't attempt to render if not mounted
    // console.log('DiagramViewer: Attempted to render before component is mounted.');
    return;
  }

  if (props.diagramType !== 'mermaid') {
    isLoading.value = false;
    renderError.value = '';
    if (mermaidContainer.value) mermaidContainer.value.innerHTML = '';
    return;
  }

  if (!props.diagramCode || props.diagramCode.trim() === '') {
    isLoading.value = false;
    renderError.value = 'Diagram code is empty.';
    if (mermaidContainer.value) mermaidContainer.value.innerHTML = '';
    return;
  }
  
  isLoading.value = true;
  renderError.value = '';
  
  // This nextTick is crucial to ensure the container div is truly in the DOM
  // especially if the component's own visibility was just toggled.
  await nextTick(); 

  if (!mermaidContainer.value) {
    console.error('DiagramViewer: Mermaid container ref is not available in the DOM for rendering.');
    renderError.value = 'Diagram container element failed to initialize in the DOM. It might be hidden or not yet rendered.';
    isLoading.value = false;
    return;
  }
  
  mermaidContainer.value.innerHTML = ''; // Clear previous content

  try {
    const uniqueDiagramId = `m-${simpleHash(props.diagramCode.slice(0, 50) + Date.now().toString() + Math.random().toString(16).slice(2))}`;
    const cacheKey = `diagram-cache-${simpleHash(props.diagramCode + currentTheme.value)}`;
    const cachedSvg = await localforage.getItem<string>(cacheKey);
    
    if (cachedSvg) {
      if (mermaidContainer.value) mermaidContainer.value.innerHTML = cachedSvg;
      isLoading.value = false;
      return;
    }
    
    mermaid.initialize({
      startOnLoad: false,
      theme: currentTheme.value,
      securityLevel: 'loose',
      fontSize: 14,
      // @ts-expect-error 'suppressErrorRendering' is a valid runtime option
      suppressErrorRendering: true, 
      flowchart: { htmlLabels: true },
      sequence: { showSequenceNumbers: true }
    });

    const { svg, bindFunctions } = await mermaid.render(uniqueDiagramId, props.diagramCode);
    
    if (mermaidContainer.value) {
        mermaidContainer.value.innerHTML = svg;
        if (bindFunctions) bindFunctions(mermaidContainer.value);
        await localforage.setItem(cacheKey, svg);
    } else {
        throw new Error("Mermaid container became unavailable during async rendering.");
    }
    
  } catch (error: any) {
    console.error('DiagramViewer: Error rendering Mermaid diagram:', error);
    let errorMessage = 'Failed to render diagram.';
    if (error instanceof Error) errorMessage = error.message;
    else if (typeof error === 'string') errorMessage = error;
    if (error && typeof error.str === 'string') errorMessage += ` Details: ${error.str}`;
    renderError.value = errorMessage;
  } finally {
    isLoading.value = false;
  }
};

const saveDiagram = () => {
  // ... (saveDiagram logic remains the same)
  if (!mermaidContainer.value || props.diagramType !== 'mermaid') return;
  const svgElement = mermaidContainer.value.querySelector('svg');
  if (!svgElement) {
    console.warn('DiagramViewer: No SVG element found to save.');
    return;
  }
  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(svgElement);
  if (!svgString.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/2000\/svg"/)) {
    svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `diagram-${simpleHash(props.diagramCode.slice(0,30))}-${Date.now()}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// --- Lifecycle Hooks and Watchers ---

onMounted(async () => {
  // The watcher with immediate: true might have already tried.
  // This onMounted call provides a more reliable point AFTER the element is in DOM.
  if (props.diagramCode && props.diagramType) {
    await renderDiagram();
  } else {
    isLoading.value = false; // Ensure loading state is false if no diagram to render
    if (!props.diagramCode && props.diagramType === 'mermaid') {
        renderError.value = 'Diagram code is empty.';
    }
     // Clear container if it exists but no code/type
    if (mermaidContainer.value) mermaidContainer.value.innerHTML = '';
  }
});

watch(
  [() => props.diagramCode, () => props.diagramType, currentTheme], 
  async ([newCode, newType, newTheme], [oldCode, oldType, oldTheme]) => {
    if (!isMounted) return; // Don't do anything if not mounted yet

    const hasRelevantChange = newCode !== oldCode || newType !== oldType || newTheme !== oldTheme;
    const needsRender = newCode && newType === 'mermaid' && (hasRelevantChange || !mermaidContainer.value?.hasChildNodes());

    if (needsRender) {
      await renderDiagram();
    } else if (!newCode && newType === 'mermaid') { 
      isLoading.value = false;
      renderError.value = 'Diagram code is empty.';
      if (mermaidContainer.value) mermaidContainer.value.innerHTML = '';
    } else if (newType !== 'mermaid') {
      isLoading.value = false;
      renderError.value = ''; 
      if (mermaidContainer.value) mermaidContainer.value.innerHTML = '';
    }
  },
  { deep: true } // No immediate: true, onMounted handles initial render
);

let themeWatcherInterval: number | undefined;
onMounted(() => {
  themeWatcherInterval = window.setInterval(() => {
    const newThemeValue = localStorage.getItem('darkMode') === 'true' ? 'dark' : 'default';
    if (newThemeValue !== currentTheme.value) {
      currentTheme.value = newThemeValue;
    }
  }, 1000);
});

onBeforeUnmount(() => {
  isMounted = false;
  if (themeWatcherInterval) {
    clearInterval(themeWatcherInterval);
  }
});

</script>

<style lang="postcss" scoped>
.diagram-viewer-wrapper {
  background-color: var(--bg-subtle);
  border-color: var(--border-color);
}
.dark .diagram-viewer-wrapper {
  background-color: var(--bg-surface);
  border-color: var(--border-color);
}

.mermaid-diagram-container {
  @apply overflow-auto p-2 rounded-md;
  background-color: var(--bg-base);
  min-height: 100px; /* Ensure container has some height */
  border: 1px solid var(--border-color); /* Add a border to the diagram area */
}
.dark .mermaid-diagram-container {
  background-color: var(--bg-surface); /* Or a specific dark bg for diagrams */
  border-color: var(--border-color);
}

.mermaid-diagram-container :deep(svg) {
  @apply mx-auto block;
  max-width: 100%;
  height: auto;
}

.diagram-spinner {
  border-color: var(--primary-200, #dbeafe); 
  border-top-color: var(--primary-500, #3b82f6);
}
.dark .diagram-spinner {
  border-color: var(--primary-800, #3730a3); 
  border-top-color: var(--primary-400, #60a5fa);
}

.p-4.text-red-600 { /* For light mode errors */
  color: var(--error-color, #dc2626);
}
.dark .p-4.text-red-400 { /* For dark mode errors */
  color: hsl(0, 70%, 70%); /* Lighter red for dark backgrounds */
}
.p-4 pre { /* Styling for the code block in error message */
  background-color: hsla(0,0%,50%,0.05);
  border: 1px solid hsla(0,0%,50%,0.1);
}
.dark .p-4 pre {
  background-color: hsla(0,0%,20%,0.2);
  border: 1px solid hsla(0,0%,30%,0.3);
}
</style>