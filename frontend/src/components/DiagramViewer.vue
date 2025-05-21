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
      <!-- Mermaid diagram -->
      <div v-if="diagramType === 'mermaid'" ref="mermaidContainer" class="mermaid-diagram"></div>
      
      <!-- Other diagram types (placeholder) -->
      <div v-else class="p-4">
        <p class="mb-2 text-sm text-gray-600 dark:text-gray-400">
          {{ diagramType }} diagrams display not yet implemented.
        </p>
        <div class="p-3 bg-gray-200 dark:bg-gray-800 rounded overflow-x-auto">
          <pre><code>{{ diagramCode }}</code></pre>
        </div>
      </div>
    </div>
    
    <!-- Save diagram button -->
    <div class="mt-2 flex justify-end" v-if="!isLoading && !renderError">
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
import { ref, onMounted, watch } from 'vue';
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

// Initialize mermaid
onMounted(() => {
  mermaid.initialize({
    startOnLoad: false,
    theme: localStorage.getItem('darkMode') === 'true' ? 'dark' : 'default',
    securityLevel: 'loose',
    fontSize: 14
  });
  
  renderDiagram();
});

// Watch for changes in diagram code or type
watch([() => props.diagramCode, () => props.diagramType], renderDiagram);

// Watch for theme changes
watch(() => localStorage.getItem('darkMode'), (newVal) => {
  mermaid.initialize({
    startOnLoad: false,
    theme: newVal === 'true' ? 'dark' : 'default'
  });
  renderDiagram();
});

// Render diagram
const renderDiagram = async () => {
  if (!props.diagramCode || props.diagramCode.trim() === '') {
    isLoading.value = false;
    return;
  }
  
  isLoading.value = true;
  renderError.value = '';
  
  try {
    // Try to get cached diagram
    const cacheKey = `diagram-${btoa(props.diagramCode)}`;
    const cachedSvg = await localforage.getItem<string>(cacheKey);
    
    if (cachedSvg && mermaidContainer.value) {
      mermaidContainer.value.innerHTML = cachedSvg;
      isLoading.value = false;
      return;
    }
    
    // Render new diagram
    if (props.diagramType === 'mermaid' && mermaidContainer.value) {
      const { svg } = await mermaid.render('mermaid-diagram-' + Date.now(), props.diagramCode);
      mermaidContainer.value.innerHTML = svg;
      
      // Cache the rendered SVG
      await localforage.setItem(cacheKey, svg);
    }
  } catch (error) {
    console.error('Error rendering diagram:', error);
    renderError.value = (error as Error).message || 'Failed to render diagram';
  } finally {
    isLoading.value = false;
  }
};

// Save diagram as SVG
const saveDiagram = () => {
  if (!mermaidContainer.value) return;
  
  const svgContent = mermaidContainer.value.innerHTML;
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `diagram-${Date.now()}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
</script>

<style scoped>
.mermaid-diagram {
  @apply overflow-x-auto;
}

.mermaid-diagram :deep(svg) {
  @apply mx-auto;
  min-width: 100%;
}
</style>