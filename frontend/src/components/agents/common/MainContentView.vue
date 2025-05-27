<template>
  <div
    :class="containerClasses"
    role="main"
    :aria-labelledby="contentTitleId"
  >
    <!-- Visually hidden heading for accessibility -->
    <h2 :id="contentTitleId" class="sr-only">{{ agent.label }} Main Content</h2>

    <!-- Main content slot -->
    <slot>
      <!-- Fallback shown while the agent view is loading or has not provided content -->
      <div class="p-6 text-center text-slate-500 italic text-sm">
        Loading {{ agent.label }} content area...
      </div>
    </slot>
  </div>
</template>

<script lang="ts" setup>
/**
 * @file MainContentView.vue
 * @description A flexible container for the main content display of an active agent.
 * It acts as a "whiteboard" where agents can render rich text, structured data,
 * diagrams, code, or embed more complex components. The actual content is provided
 * by the currently active agent's UI component through this slot.
 */

import { computed } from 'vue';
import type { IAgentDefinition } from '@/services/agent.service';
import { useAgentStore } from '@/store/agent.store';
import { useChatStore } from '@/store/chat.store';

interface Props {
  agent: IAgentDefinition;
}

const props = defineProps<Props>();

// Stores reserved for future use (e.g., when mainContentData becomes dynamic)
const agentStore = useAgentStore(); // eslint-disable-line @typescript-eslint/no-unused-vars
const chatStore = useChatStore();   // eslint-disable-line @typescript-eslint/no-unused-vars

/**
 * Accessible heading id used by `aria-labelledby` to describe the region.
 */
const contentTitleId = computed(() => `main-content-title-${props.agent.id}`);

/**
 * Dynamic container classes providing hooks for agent‑specific styling.
 */
const containerClasses = computed(() => [
  'main-content-view',
  'flex-grow',
  'flex',
  'flex-col',
  'relative',
  'overflow-y-auto',
  `agent-main-content-${props.agent.id}`,
  `content-type-${props.agent.mainContentType ?? 'default'}`,
]);
</script>

<style lang="postcss" scoped>
.main-content-view {
  /* Subtle contrast against PrivateHome background for depth */
  background-color: rgba(10, 5, 20, 0.2);
}

/* Example: when CompactMessageRenderer (slideshow) is the primary content */
.content-type-slideshow {
  padding: 0; /* CompactMessageRenderer handles its own padding */
}

/* Example: interactive code editors / side‑by‑side views */
.content-type-interactive-code {
  /* Add code‑specific styles here as needed */
}

/* Example: diagram canvases or centered boards */
.content-type-diagram-canvas {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
