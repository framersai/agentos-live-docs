// File: frontend/src/components/header/AgentHubTrigger.vue
/**
 * @file AgentHubTrigger.vue
 * @description Button to open the main Agent Hub/Catalog. Styled for prominence.
 * @version 1.0.1 - Enhanced clarity.
 */
<script setup lang="ts">
import { Squares2X2Icon } from '@heroicons/vue/24/outline';

const emit = defineEmits<{
  (e: 'open-agent-hub'): void;
}>();

const handleClick = () => {
  emit('open-agent-hub');
};
</script>

<template>
  <button
    @click="handleClick"
    class="agent-hub-trigger-button btn btn-ghost-ephemeral btn-icon-ephemeral"
    title="Explore & Select Assistants"
    aria-label="Open assistant catalog"
  >
    <Squares2X2Icon class="icon-base icon-trigger" />
    <span class="trigger-text-ephemeral hidden xl:inline">Assistants</span>
  </button>
</template>

<style lang="scss" scoped>
@use '@/styles/abstracts/variables' as var;

.agent-hub-trigger-button {
  // Inherits .btn .btn-ghost-ephemeral .btn-icon-ephemeral from _header.scss global rules for header controls
  // Add specific flair or override if needed:
  padding: var.$spacing-sm calc(var.$spacing-sm + 2px) !important;
  gap: var.$spacing-xs;

  .icon-trigger {
    transition: transform 0.3s var.$ease-elastic, color 0.2s var.$ease-out-quad;
  }
  .trigger-text-ephemeral {
    font-size: var.$font-size-xs;
    font-weight: 500;
    letter-spacing: 0.02em;
    transition: color 0.2s var.$ease-out-quad;
  }

  &:hover {
    // Hover state defined by .btn-ghost-ephemeral general hover in _header.scss
    // Specific animation for this trigger's icon:
    .icon-trigger {
      transform: scale(1.15) rotate(25deg);
    }
  }
}
</style>