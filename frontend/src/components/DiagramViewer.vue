// File: frontend/src/components/DiagramViewer.vue
/**
 * @file DiagramViewer.vue
 * @description Component to render Mermaid diagrams with caching and dynamic theming
 * for the "Ephemeral Harmony" design system.
 * @version 2.1.0 - Integrated with global ThemeManager.
 */
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick, computed } from 'vue';
import mermaid from 'mermaid';
import localforage from 'localforage';
import { themeManager } from '@/theme/ThemeManager'; // Import our theme manager

const props = defineProps<{
  diagramCode: string;
  diagramType: string; // Currently only 'mermaid' is fully supported
}>();

const mermaidContainer = ref<HTMLElement | null>(null);
const isLoading = ref(false);
const renderError = ref('');
const isComponentMounted = ref(false);

// Observe our global theme manager for changes
const currentMermaidTheme = computed(() => {
  const theme = themeManager.getCurrentTheme().value;
  return theme?.isDark ? 'dark' : 'neutral';
  // Mermaid themes: 'default' (light, like 'neutral'), 'dark', 'neutral', 'forest'
  // 'neutral' often works well for light themes if 'default' has issues or too much contrast.
});

const hasRenderedMermaidContent = computed(() => {
  return mermaidContainer.value?.querySelector('svg') !== null;
});

function simpleHash(str: string): string {
  let hash = 0;
  if (str.length === 0) return 'h0';
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'h' + (hash >>> 0).toString(36).slice(-8);
}

const renderDiagram = async () => {
  if (!isComponentMounted.value) return;

  if (props.diagramType !== 'mermaid') {
    isLoading.value = false;
    renderError.value = `Diagram type "${props.diagramType}" is not supported for rendering.`;
    if (mermaidContainer.value) mermaidContainer.value.innerHTML = ''; // Clear if previously rendered
    return;
  }

  if (!props.diagramCode || props.diagramCode.trim() === '') {
    isLoading.value = false;
    renderError.value = 'Diagram code is empty. Nothing to render.';
    if (mermaidContainer.value) mermaidContainer.value.innerHTML = '';
    return;
  }

  isLoading.value = true;
  renderError.value = '';
  await nextTick();

  if (!mermaidContainer.value) {
    renderError.value = "Diagram container element not found in the DOM. Rendering aborted.";
    isLoading.value = false;
    return;
  }
  mermaidContainer.value.innerHTML = ''; // Clear previous content before rendering new

  try {
    const diagramId = `mermaid-diag-${simpleHash(props.diagramCode.slice(0, 50) + Date.now())}`;
    const cacheKey = `diagram-cache-${simpleHash(props.diagramCode + currentMermaidTheme.value)}`; // Theme influences cache
    const cachedSvg = await localforage.getItem<string>(cacheKey);

    if (cachedSvg) {
      mermaidContainer.value.innerHTML = cachedSvg;
      // Note: For complex diagrams with interactivity, `bindFunctions` might be needed even for cached SVGs.
      // This would require storing more than just the SVG string or re-binding.
      // For now, we assume cached SVGs are primarily for visual display.
      isLoading.value = false;
      return;
    }

    // Initialize Mermaid with dynamic theme
    mermaid.initialize({
      startOnLoad: false,
      theme: currentMermaidTheme.value,
      securityLevel: 'loose', // Review based on content source
      fontSize: 14, // Base font size for diagrams
      // @ts-expect-error 'suppressErrorRendering' is a valid runtime option, may not be in all TS defs for Mermaid
      suppressErrorRendering: true,
      flowchart: { htmlLabels: true, useMaxWidth: true },
      sequence: { showSequenceNumbers: true, useMaxWidth: true },
      gantt: { useMaxWidth: true },
      // Add other diagram type configs if needed
    });

    if (!props.diagramCode.trim()) { // Final check before render call
        throw new Error("Cannot render an empty diagram string.");
    }

    const { svg, bindFunctions } = await mermaid.render(diagramId, props.diagramCode);

    if (mermaidContainer.value) { // Check ref again as it's an async operation
      mermaidContainer.value.innerHTML = svg;
      if (bindFunctions) {
        bindFunctions(mermaidContainer.value); // For clickable nodes, etc.
      }
      await localforage.setItem(cacheKey, svg); // Cache the newly rendered SVG
    } else {
        // This case should ideally not be hit if the initial check passed, but good for safety.
        console.warn("DiagramViewer: Mermaid container became unavailable during async rendering. SVG not appended to DOM.");
    }

  } catch (error: any) {
    console.error('DiagramViewer: Error rendering Mermaid diagram:', error);
    let errorMessage = 'Failed to render diagram. Check console for details.';
    if (error instanceof Error) errorMessage = error.message;
    else if (typeof error === 'string') errorMessage = error;
    // Mermaid often throws an error object with a 'str' property for details
    if (error && typeof error.str === 'string') errorMessage = `${errorMessage} Details: ${error.str}`;
    renderError.value = errorMessage;
  } finally {
    isLoading.value = false;
  }
};

const saveDiagram = () => {
  if (!mermaidContainer.value || props.diagramType !== 'mermaid' || !hasRenderedMermaidContent.value) return;
  const svgElement = mermaidContainer.value.querySelector('svg');
  if (!svgElement) {
    console.warn('DiagramViewer: No SVG element found to save.');
    renderError.value = "Could not find SVG content to save.";
    return;
  }

  if (!svgElement.getAttribute('xmlns')) {
    svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }
  // Add a background to the SVG for better standalone viewing if theme is dark
  if (themeManager.getCurrentTheme().value?.isDark) {
    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgRect.setAttribute('width', '100%');
    bgRect.setAttribute('height', '100%');
    bgRect.setAttribute('fill', getComputedStyle(document.documentElement).getPropertyValue('--color-bg-primary').trim() || '#1a1a1a');
    svgElement.prepend(bgRect); // Add as first child to be background
  }


  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);

  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `diagram-${simpleHash(props.diagramCode.slice(0,30))}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

onMounted(() => {
  isComponentMounted.value = true;
  if (props.diagramCode && props.diagramType === 'mermaid') {
    renderDiagram();
  }
});

onBeforeUnmount(() => {
  isComponentMounted.value = false;
});

// Watch for changes in diagram code, type, or the computed Mermaid theme
watch(
  [() => props.diagramCode, () => props.diagramType, currentMermaidTheme],
  ([newCode, newType, newTheme], [oldCode, oldType, oldTheme]) => {
    if (!isComponentMounted.value) return;

    const codeOrTypeChanged = newCode !== oldCode || newType !== oldType;
    const themeChanged = newTheme !== oldTheme;

    if (codeOrTypeChanged || themeChanged) {
      renderDiagram();
    }
  },
  { deep: false } // Watch props shallowly; currentMermaidTheme is a computed ref
);

</script>

<template>
  <div class="diagram-viewer-wrapper-ephemeral">
    <div v-if="isLoading" class="loading-indicator-ephemeral">
      <div class="spinner-ephemeral"></div>
    </div>

    <div v-else-if="renderError" class="render-error-ephemeral">
      <p class="error-title">Diagram Rendering Error</p>
      <p class="error-message">{{ renderError }}</p>
      <details class="error-code-block">
        <summary class="cursor-pointer text-xs py-1 hover:text-[var(--color-text-primary)]">Show Diagram Code</summary>
        <pre><code class="language-mermaid">{{ diagramCode }}</code></pre>
      </details>
    </div>

    <div v-else>
      <div v-if="diagramType === 'mermaid'" ref="mermaidContainer" class="mermaid-diagram-container-ephemeral">
        <p v-if="!hasRenderedMermaidContent && !isLoading && !renderError" class="p-4 text-sm text-[var(--color-text-muted)] text-center">
          Ready to render diagram.
        </p>
      </div>

      <div v-else-if="diagramCode && diagramType !== 'mermaid'" class="p-4 text-sm text-[var(--color-text-secondary)]">
        <p class="mb-1">Diagram type "{{ diagramType }}" is not yet supported for visual rendering.</p>
        <p class="text-xs">Displaying code block:</p>
        <div class="error-code-block mt-2"><pre><code>{{ diagramCode }}</code></pre></div>
      </div>
       <div v-else-if="!diagramCode && diagramType === 'mermaid'" class="p-4 text-sm text-[var(--color-text-muted)] text-center">
          No diagram code provided.
      </div>
    </div>

    <div class="diagram-actions-ephemeral"
         v-if="!isLoading && !renderError && diagramType === 'mermaid' && hasRenderedMermaidContent">
      <button @click="saveDiagram" class="save-diagram-button">
        Save as SVG
      </button>
    </div>
  </div>
</template>

<style lang="scss">
// Styles are in frontend/src/styles/components/_diagram-viewer.scss
</style>