/**
 * @file AgentHub.vue
 * @description A modal/panel for Browse, searching, and selecting AI agents.
 * Implements "Ephemeral Harmony" styling for a rich user experience.
 * @version 1.1.2 - Resolved TS errors and removed unused imports.
 */
<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { agentService, type IAgentDefinition, type AgentId, type AgentCategory } from '@/services/agent.service'; // AgentCategory is exported
import { useAgentStore } from '@/store/agent.store';
import { useAuth } from '@/composables/useAuth';
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  SparklesIcon, // For header title
  // Removed icons that are now encapsulated within AgentCard or not used directly here
} from '@heroicons/vue/24/outline';
import AgentCard from './AgentCard.vue'; // Import the AgentCard component

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'agent-selected', agentId: AgentId): void; // Use specific AgentId type
}>();

const agentStore = useAgentStore();
const auth = useAuth();
const allAgentsFromService = ref<IAgentDefinition[]>([]); // Store the initial list
const searchQuery = ref('');
const selectedCategory = ref<AgentCategory | null>(null);

const availableAndAccessibleAgents = computed(() => {
  return allAgentsFromService.value.filter(agent => {
    // Access tier logic for filtering which agents are even shown in the hub
    if (!agent.isPublic && !auth.isAuthenticated.value) return false; // Locked non-public for guests
    if (agent.accessTier === 'member' && !auth.isAuthenticated.value) return false; // Locked member for guests
    if (agent.accessTier === 'premium' && !auth.isAuthenticated.value) return false; // Locked premium for guests
    // TODO: Add more granular premium check if auth.userHasPremiumAccess exists
    return true;
  });
});

const filteredAgents = computed(() => {
  return availableAndAccessibleAgents.value.filter(agent => {
    const searchLower = searchQuery.value.toLowerCase();
    const matchesSearch =
      agent.label.toLowerCase().includes(searchLower) ||
      agent.description.toLowerCase().includes(searchLower) ||
      (agent.tags && agent.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))) ||
      (agent.category && agent.category.toLowerCase().includes(searchLower));

    const matchesCategory = selectedCategory.value ? agent.category === selectedCategory.value : true;
    
    return matchesSearch && matchesCategory;
  });
});

const categories = computed<AgentCategory[]>(() => {
  const cats = new Set(
    agentService.getAllAgents() // Use the service method that returns canonical agents
      .map(agent => agent.category)
      .filter(Boolean) as AgentCategory[]
  );
  return Array.from(cats).sort();
});

onMounted(() => {
  allAgentsFromService.value = [...agentService.getAllAgents()]; // Fetch canonical agents
});

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    searchQuery.value = '';
    selectedCategory.value = null;
    allAgentsFromService.value = [...agentService.getAllAgents()]; // Refresh when opened
    nextTick(() => {
        const searchInputEl = document.getElementById('agent-hub-search-input');
        searchInputEl?.focus();
    });
  }
});

const selectAgentAndClose = (agent: IAgentDefinition) => {
  // AgentCard now handles its own "isLocked" state before emitting "select-agent".
  // If this is called, assume the agent is selectable.
  agentStore.setActiveAgent(agent.id);
  emit('agent-selected', agent.id);
};

const closeHub = () => {
  emit('close');
};

// This handler is for events from AgentCard, e.g., if AgentCard had an info button
// that this Hub should react to by showing a more detailed modal.
const handleShowAgentInfoFromCard = (agent: IAgentDefinition) => {
  // console.log("[AgentHub] Request to show detailed info for agent:", agent.label);
  // Implement logic here to display a detailed modal/view for 'agent'
  // For example, set a ref with 'agent' data and toggle a modal visibility flag.
  // This is distinct from the 'show-agent-info' emit from AgentCard itself,
  // which might be handled by an even higher-level component if this Hub is nested.
  // If AgentHub is the one showing the detailed info, this is the place.
  // For now, we can assume AgentCard passes enough info for the card display itself.
};

</script>

<template>
  <Transition name="agent-hub-fade-transition">
    <div v-if="isOpen" class="agent-hub-overlay" @mousedown.self="closeHub" aria-modal="true" role="dialog" aria-labelledby="agent-hub-title">
      <div class="agent-hub-panel card-neo-raised-ephemeral"> {/* Assumes this class is defined elsewhere, e.g. in _cards.scss or _agent-hub.scss */}
        <header class="agent-hub-header">
          <h2 id="agent-hub-title" class="hub-title-ephemeral">
            <SparklesIcon class="hub-title-icon"/> Explore Assistants
          </h2>
          <button @click="closeHub" class="btn btn-ghost-ephemeral btn-icon-ephemeral close-hub-button-ephemeral" aria-label="Close Assistant Hub">
            <XMarkIcon class="icon-lg" />
          </button>
        </header>

        <div class="agent-hub-controls-ephemeral">
          <div class="search-bar-wrapper-ephemeral">
            <MagnifyingGlassIcon class="search-icon-ephemeral" />
            <input
              id="agent-hub-search-input"
              type="search"
              v-model="searchQuery"
              placeholder="Search assistants by name, skill, or category..."
              class="search-input-ephemeral"
              aria-label="Search for an assistant"
            />
          </div>
          <div v-if="categories.length > 1" class="category-filters-ephemeral custom-scrollbar-xs">
            <button @click="selectedCategory = null"
                    :class="{'active': !selectedCategory}"
                    class="filter-chip-ephemeral"
                    :aria-pressed="!selectedCategory"
                    role="tab">
              All
            </button>
            <button
              v-for="cat in categories" :key="cat"
              @click="selectedCategory = cat"
              :class="{'active': selectedCategory === cat}"
              class="filter-chip-ephemeral"
              :aria-pressed="selectedCategory === cat"
              role="tab"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <div class="agent-grid-container-ephemeral custom-scrollbar-thin" role="tabpanel">
          <p v-if="allAgentsFromService.length === 0 && !searchQuery" class="loading-agents-message">Loading available assistants...</p>
          <p v-else-if="filteredAgents.length === 0 && searchQuery" class="no-results-message-ephemeral">
            No assistants found for "<strong>{{ searchQuery }}</strong>". Try a different search or category.
          </p>
          <p v-else-if="filteredAgents.length === 0 && selectedCategory" class="no-results-message-ephemeral">
            No assistants available in the "<strong>{{ selectedCategory }}</strong>" category.
          </p>
           <p v-else-if="filteredAgents.length === 0 && allAgentsFromService.length > 0" class="no-results-message-ephemeral">
            No assistants match your current filter and access level.
          </p>


          <TransitionGroup name="agent-card-list-transition" tag="div" class="agent-card-grid">
            <AgentCard
              v-for="agentDef in filteredAgents"
              :key="agentDef.id"
              :agent="agentDef"
              @select-agent="() => selectAgentAndClose(agentDef)" 
              @show-agent-info="handleShowAgentInfoFromCard" />
          </TransitionGroup>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss">
// Styles for AgentHub are in frontend/src/styles/components/agents/_agent-hub.scss
// Ensure that SCSS file styles:
// .agent-hub-overlay, .agent-hub-panel, .card-neo-raised-ephemeral (if custom or from _cards.scss),
// .agent-hub-header, .hub-title-ephemeral, .hub-title-icon, .close-hub-button-ephemeral,
// .agent-hub-controls-ephemeral, .search-bar-wrapper-ephemeral, .search-icon-ephemeral, .search-input-ephemeral,
// .category-filters-ephemeral, .custom-scrollbar-xs, .filter-chip-ephemeral, .filter-chip-ephemeral.active,
// .agent-grid-container-ephemeral, .custom-scrollbar-thin, .loading-agents-message, .no-results-message-ephemeral,
// .agent-card-grid

// Transitions are defined locally as per original file.
.agent-hub-fade-transition-enter-active,
.agent-hub-fade-transition-leave-active {
  transition: opacity 0.3s var(--ease-out-quad);
}
.agent-hub-fade-transition-enter-from,
.agent-hub-fade-transition-leave-to {
  opacity: 0;
}
.agent-hub-fade-transition-enter-active .agent-hub-panel,
.agent-hub-fade-transition-leave-active .agent-hub-panel {
  transition: transform 0.3s var(--ease-out-expo), opacity 0.25s var(--ease-out-quad);
}
.agent-hub-fade-transition-enter-from .agent-hub-panel,
.agent-hub-fade-transition-leave-to .agent-hub-panel {
  opacity: 0.8;
  transform: scale(0.95) translateY(20px);
}

.agent-card-list-transition-enter-active,
.agent-card-list-transition-leave-active {
  transition: all 0.4s var(--ease-out-quint);
}
.agent-card-list-transition-leave-active {
  position: absolute; 
}
.agent-card-list-transition-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.97);
}
.agent-card-list-transition-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>