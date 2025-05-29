// File: frontend/src/components/agents/AgentHub.vue
/**
 * @file AgentHub.vue
 * @description A modal/panel component for Browse, searching, filtering, and selecting AI agents.
 * Designed to be a dynamic and engaging catalog, potentially housing a large number of agents.
 * Implements "Ephemeral Harmony" styling for a futuristic and rich user experience.
 * Includes placeholders for future "Create Agent" and "Import Agent" functionalities.
 *
 * @component AgentHub
 * @props {boolean} isOpen - Controls the visibility of the Agent Hub modal.
 * @emits close - Emitted when a request to close the hub is made (e.g., by clicking overlay or close button).
 * @emits agent-selected - Emitted when an agent is selected, passing the agent's ID.
 * @emits interaction - For miscellaneous interactions like showing a toast (from AgentCard).
 *
 * @version 1.2.0 - Enhanced modal structure, refined controls layout, added placeholders for future actions, improved JSDoc.
 */
<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick, type Ref } from 'vue';
import {
  agentService,
  type IAgentDefinition,
  type AgentId,
  type AgentCategory // Type for agent categories
} from '@/services/agent.service';
import { useAgentStore } from '@/store/agent.store';
import { useAuth } from '@/composables/useAuth';
import { useUiStore } from '@/store/ui.store'; // For toast interactions

// Icons
import {
  XMarkIcon,                // For close button
  MagnifyingGlassIcon,      // For search input
  SparklesIcon,             // For header title icon
  FunnelIcon,               // For filter section indication
  PlusCircleIcon,           // For "Create Agent" (disabled)
  ArrowUpTrayIcon,          // For "Import Agent" (disabled)
  AdjustmentsHorizontalIcon // Alternative for filter/category indication
} from '@heroicons/vue/24/outline';
import AgentCard from './AgentCard.vue'; // The component to display each agent

/**
 * @props - Component properties.
 */
const props = defineProps<{
  /** Controls the visibility of the Agent Hub modal. */
  isOpen: boolean;
}>();

/**
 * @emits - Defines the events emitted by this component.
 */
const emit = defineEmits<{
  /** Emitted when the hub requests to be closed. */
  (e: 'close'): void;
  /** Emitted when an agent card is clicked and selected. */
  (e: 'agent-selected', agentId: AgentId): void;
  /**
   * Emitted for interactions originating from child components (e.g., AgentCard)
   * that need to be handled by a higher-level component (e.g., showing a toast).
   */
  (e: 'interaction', payload: { type: string; data?: any }): void;
}>();

const agentStore = useAgentStore();
const auth = useAuth();
const uiStore = useUiStore(); // For potential toast interactions if not handled by App.vue

/** @ref {Ref<IAgentDefinition[]>} allAgentsFromService - Stores the canonical list of all agents fetched from the service. */
const allAgentsFromService: Ref<IAgentDefinition[]> = ref([]);
/** @ref {Ref<string>} searchQuery - Reactive model for the search input field. */
const searchQuery: Ref<string> = ref('');
/** @ref {Ref<AgentCategory | 'all'>} selectedCategory - Reactive model for the selected agent category filter. 'all' signifies no category filter. */
const selectedCategory: Ref<AgentCategory | 'all'> = ref('all'); // Default to 'all'

/**
 * @computed availableAndAccessibleAgents
 * @description Filters the `allAgentsFromService` list based on user authentication status and agent access tiers.
 * Determines which agents are even shown in the hub to the current user.
 * @returns {IAgentDefinition[]} Filtered list of agents the user can see.
 */
const availableAndAccessibleAgents = computed<IAgentDefinition[]>(() => {
  return allAgentsFromService.value.filter(agent => {
    if (agent.isPublic) return true; // Public agents are always shown
    if (!auth.isAuthenticated.value) return false; // Non-public agents hidden for guests

    // For authenticated users, further checks based on accessTier can be added here if implemented
    // e.g., if (agent.accessTier === 'premium' && !auth.user.hasPremiumAccess) return false;
    return true; // Default to accessible if authenticated and not explicitly restricted
  });
});

/**
 * @computed filteredAgents
 * @description Filters `availableAndAccessibleAgents` based on the current `searchQuery` and `selectedCategory`.
 * Performs case-insensitive search on agent label, description, tags, and category.
 * @returns {IAgentDefinition[]} The final list of agents to be displayed.
 */
const filteredAgents = computed<IAgentDefinition[]>(() => {
  return availableAndAccessibleAgents.value.filter(agent => {
    const searchLower = searchQuery.value.toLowerCase().trim();
    const matchesSearch = !searchLower || // If no search query, all agents match
      agent.label.toLowerCase().includes(searchLower) ||
      agent.description.toLowerCase().includes(searchLower) ||
      (agent.tags && agent.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))) ||
      (agent.category && agent.category.toLowerCase().includes(searchLower));

    const matchesCategory = selectedCategory.value === 'all' || agent.category === selectedCategory.value;

    return matchesSearch && matchesCategory;
  }).sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically by label
});

/**
 * @computed categories
 * @description Extracts a unique, sorted list of all agent categories present in the service.
 * @returns {AgentCategory[]} Array of unique agent categories.
 */
const categories = computed<AgentCategory[]>(() => {
  const cats = new Set(
    agentService.getAllAgents() // Use the canonical list from the service
      .map(agent => agent.category)
      .filter(Boolean) as AgentCategory[] // Filter out undefined/null categories and assert type
  );
  return Array.from(cats).sort();
});

// Fetch all agents when the component is mounted.
onMounted(() => {
  allAgentsFromService.value = [...agentService.getAllAgents()];
});

// Watch for the hub opening to reset search/filters and focus the search input.
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    searchQuery.value = '';
    selectedCategory.value = 'all'; // Reset to 'all' category
    allAgentsFromService.value = [...agentService.getAllAgents()]; // Refresh agent list
    nextTick(() => { // Ensure DOM is updated before trying to focus
      const searchInputEl = document.getElementById('agent-hub-search-input');
      searchInputEl?.focus();
    });
  }
});

/**
 * @function selectAgentAndClose
 * @description Handles agent selection from an AgentCard. Sets the selected agent as active
 * in the store and emits events to close the hub and notify of selection.
 * @param {IAgentDefinition} agent - The agent definition object that was selected.
 */
const selectAgentAndClose = (agent: IAgentDefinition) => {
  // AgentCard component internally handles lock status before emitting select-agent.
  // If this function is called, it's assumed the agent is selectable by the current user.
  agentStore.setActiveAgent(agent.id);
  emit('agent-selected', agent.id);
  emit('close'); // Close the hub after selection
};

/**
 * @function closeHub
 * @description Emits the 'close' event to request closing the Agent Hub modal.
 */
const closeHub = (): void => {
  emit('close');
};

/**
 * @function handleCardInteraction
 * @description Relays interaction events (like toast requests) from AgentCard components
 * to the parent component.
 * @param {object} payload - The event payload from AgentCard.
 */
const handleCardInteraction = (payload: { type: string; data?: any }): void => {
  emit('interaction', payload);
};

</script>

<template>
  <Transition name="agent-hub-fade-transition">
    <div
      v-if="isOpen"
      class="agent-hub-overlay"
      @mousedown.self="closeHub"
      aria-modal="true"
      role="dialog"
      aria-labelledby="agent-hub-title"
    >
      <div class="agent-hub-panel card-neo-raised-ephemeral"> 
        <header class="agent-hub-header">
          <h2 id="agent-hub-title" class="hub-title-ephemeral">
            <SparklesIcon class="hub-title-icon" aria-hidden="true"/>
            Explore & Select Assistants
          </h2>
          <button
            @click="closeHub"
            class="btn btn-ghost-ephemeral btn-icon-ephemeral close-hub-button-ephemeral"
            aria-label="Close Assistant Hub"
            title="Close Hub"
          >
            <XMarkIcon class="icon-lg" aria-hidden="true" />
          </button>
        </header>

        <div class="agent-hub-controls-ephemeral">
          <div class="search-bar-wrapper-ephemeral">
            <MagnifyingGlassIcon class="search-icon-ephemeral" aria-hidden="true" />
            <input
              id="agent-hub-search-input"
              type="search"
              v-model="searchQuery"
              placeholder="Search assistants by name, skill, or category..."
              class="search-input-ephemeral"
              aria-label="Search for an assistant"
            />
          </div>
          <div v-if="categories.length > 0" class="category-filters-ephemeral custom-scrollbar-xs" role="tablist" aria-orientation="horizontal">
            <button
              @click="selectedCategory = 'all'"
              :class="{'active': selectedCategory === 'all'}"
              class="filter-chip-ephemeral"
              role="tab"
              :aria-selected="selectedCategory === 'all'"
              id="agent-hub-cat-all"
              aria-controls="agent-grid-panel"
            >
              All Assistants
            </button>
            <button
              v-for="cat in categories"
              :key="cat"
              @click="selectedCategory = cat"
              :class="{'active': selectedCategory === cat}"
              class="filter-chip-ephemeral"
              role="tab"
              :aria-selected="selectedCategory === cat"
              :id="`agent-hub-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`"
              aria-controls="agent-grid-panel"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <div id="agent-grid-panel" class="agent-grid-container-ephemeral custom-scrollbar-thin" role="tabpanel" tabindex="0">
          <p v-if="allAgentsFromService.length === 0 && !searchQuery" class="loading-agents-message">
            Loading available assistants...
          </p>
          <p v-else-if="filteredAgents.length === 0 && searchQuery" class="no-results-message-ephemeral">
            No assistants found for "<strong>{{ searchQuery }}</strong>". Try adjusting your search or filters.
          </p>
          <p v-else-if="filteredAgents.length === 0 && selectedCategory !== 'all'" class="no-results-message-ephemeral">
            No assistants available in the "<strong>{{ selectedCategory }}</strong>" category.
          </p>
           <p v-else-if="filteredAgents.length === 0 && availableAndAccessibleAgents.length > 0" class="no-results-message-ephemeral">
            No assistants match your current filter.
          </p>
          <p v-else-if="availableAndAccessibleAgents.length === 0" class="no-results-message-ephemeral">
            No assistants are currently available for your access level.
          </p>

          <TransitionGroup name="agent-card-list-transition" tag="div" class="agent-card-grid">
            <AgentCard
              v-for="agentDef in filteredAgents"
              :key="agentDef.id"
              :agent="agentDef"
              @select-agent="() => selectAgentAndClose(agentDef)"
              @interaction="handleCardInteraction"
            />
          </TransitionGroup>
        </div>

        <footer class="agent-hub-footer-ephemeral">
            <button class="btn btn-secondary-ephemeral btn-sm-ephemeral" disabled title="Feature coming soon">
                <PlusCircleIcon class="icon-sm mr-1.5" /> Create New Agent
            </button>
            <button class="btn btn-secondary-ephemeral btn-sm-ephemeral" disabled title="Feature coming soon">
                <ArrowUpTrayIcon class="icon-sm mr-1.5" /> Import Agent
            </button>
        </footer>

      </div>
    </div>
  </Transition>
</template>

<style lang="scss">
// Styles for AgentHub are primarily in frontend/src/styles/components/agents/_agent-hub.scss
// Local transitions are defined here for Vue's <Transition> and <TransitionGroup>.

// Transition for the modal overlay fade-in/out
@use '@/styles/abstracts/variables' as var;
.agent-hub-fade-transition-enter-active,
.agent-hub-fade-transition-leave-active {
  transition: opacity 0.3s var.$ease-out-quad;
}
.agent-hub-fade-transition-enter-from,
.agent-hub-fade-transition-leave-to {
  opacity: 0;
}

// Transition for the panel sliding/scaling effect
.agent-hub-fade-transition-enter-active .agent-hub-panel,
.agent-hub-fade-transition-leave-active .agent-hub-panel {
  transition: transform 0.35s var.$ease-elastic, opacity 0.3s var.$ease-out-quad; // Using elastic ease
}
.agent-hub-fade-transition-enter-from .agent-hub-panel,
.agent-hub-fade-transition-leave-to .agent-hub-panel {
  opacity: 0.8;
  transform: scale(0.92) translateY(25px); // Start slightly smaller and lower
}

// Transition for agent cards within the grid
.agent-card-list-transition-enter-active,
.agent-card-list-transition-leave-active {
  transition: all 0.45s var.$ease-out-quint; // Smoother, slightly longer transition for cards
}
.agent-card-list-transition-leave-active {
  position: absolute; // Important for <TransitionGroup> leave animations
  opacity: 0; // Fade out while moving
}
.agent-card-list-transition-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.96); // Cards appear from slightly below and smaller
}
.agent-card-list-transition-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(0.94); // Cards disappear upwards and smaller
}
</style>