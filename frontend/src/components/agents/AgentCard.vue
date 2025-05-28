/**
 * @file AgentCard.vue
 * @description Displays an individual AI agent with its details in a visually rich card format.
 * Features hover animations, capability tags, and access tier indicators.
 * @version 1.0.1 - Aligned with IAgentDefinition v1.3+, removed getCapabilityIcon.
 */
<script setup lang="ts">
import { computed, type Component as VueComponentType } from 'vue';
// IDetailedCapabilityItem is part of IAgentDefinition if detailedCapabilities is an array of this type
import { type IAgentDefinition, type IDetailedCapabilityItem } from '@/services/agent.service';
import { useAgentStore } from '@/store/agent.store';
import { useAuth } from '@/composables/useAuth';
import {
  CheckCircleIcon,
  LockClosedIcon,
  InformationCircleIcon,
  TagIcon,
  CogIcon, // Default for capability icon if not provided in IDetailedCapabilityItem
  ShieldCheckIcon,
  // CodeBracketSquareIcon, // Example, not directly used unless a capability icon
} from '@heroicons/vue/24/outline';

const props = defineProps<{
  agent: IAgentDefinition;
}>();

const emit = defineEmits<{
  (e: 'select-agent', agentId: string): void;
  (e: 'show-agent-info', agent: IAgentDefinition): void;
  (e: 'interaction', payload: { type: string; data?: any }): void; // Added for toast from card
}>();

const agentStore = useAgentStore();
const auth = useAuth();

const isActiveAgent = computed(() => agentStore.activeAgentId === props.agent.id);

const isLocked = computed(() => {
  if (props.agent.isPublic && props.agent.accessTier === 'public') return false;
  if (!auth.isAuthenticated.value) { // If not public, user must be authenticated
    return true;
  }
  // If authenticated, check tiers
  if (props.agent.accessTier === 'member') return false; // Members can access
  if (props.agent.accessTier === 'premium') {
    // TODO: Implement a real check: return !auth.userHasPremiumAccess.value;
    return false; // Simplified: if authenticated, assume premium access for now
  }
  // If it's not public, no specific tier, and user is authenticated, assume accessible.
  // If it's not public, no specific tier, and user is NOT authenticated, it's locked (covered by first !auth check).
  return false; 
});


const cardClasses = computed(() => [
  'agent-card-ephemeral',
  isActiveAgent.value ? 'is-active-agent' : '',
  isLocked.value ? 'is-locked-agent' : 'card-interactive-ephemeral',
  `tier--${props.agent.accessTier || (props.agent.isPublic ? 'public' : 'member')}` // Provide a sensible default tier class
]);

const handleSelectAgent = () => {
  if (!isLocked.value) {
    emit('select-agent', props.agent.id);
  } else {
    let message = `Access to ${props.agent.label} requires login.`;
    if (props.agent.accessTier === 'member') message = `Access to ${props.agent.label} requires member access. Please log in.`;
    if (props.agent.accessTier === 'premium') message = `Access to ${props.agent.label} requires a premium subscription.`;
    
    emit('interaction', { type: 'toast', data: { type: 'warning', title: 'Access Restricted', message: message, duration: 5000 }});
    // console.warn(`[AgentCard] Attempt to select locked agent: ${props.agent.label}`);
  }
};

const handleShowInfo = (event: MouseEvent) => {
  event.stopPropagation();
  emit('show-agent-info', props.agent);
};

</script>

<template>
  <div
    :class="cardClasses"
    @click="handleSelectAgent"
    @keydown.enter.space.prevent="handleSelectAgent"
    :tabindex="isLocked ? -1 : 0" role="button"
    :aria-pressed="isActiveAgent"
    :aria-label="`Select assistant: ${agent.label}. ${isLocked ? (agent.accessTier === 'premium' ? 'Premium access required.' : (agent.accessTier === 'member' ? 'Member access required.' : 'Login required.')) : agent.description}`"
    :aria-disabled="isLocked"
  >
    <div v-if="isLocked" class="locked-overlay-ephemeral">
      <LockClosedIcon class="locked-icon" />
      <span class="locked-text">{{ agent.accessTier === 'premium' ? 'Premium Tier' : (agent.accessTier === 'member' ? 'Member Access' : 'Login Required') }}</span>
    </div>

    <div class="agent-card-content-wrapper">
      <header class="agent-card-header-ephemeral">
        <div class="agent-icon-wrapper-ephemeral" :class="agent.iconClass">
          <component 
            :is="agent.iconComponent || InformationCircleIcon" class="agent-icon-ephemeral" 
            aria-hidden="true"
          />
        </div>
        <div class="agent-title-group-ephemeral">
          <h3 class="agent-name-ephemeral">{{ agent.label }}</h3>
          <p v-if="agent.category" class="agent-category-ephemeral">
            {{ agent.category }}
          </p>
        </div>
        <CheckCircleIcon v-if="isActiveAgent && !isLocked" class="selected-checkmark-ephemeral" aria-label="Currently selected assistant"/>
        <button 
          v-if="agent.longDescription || (agent.detailedCapabilities && agent.detailedCapabilities.length > 0)" 
          @click.stop="handleShowInfo" 
          class="info-button-ephemeral btn btn-ghost-ephemeral btn-icon-ephemeral btn-xs-ephemeral"
          title="More Information"
          aria-label="Show more information about this assistant"
        >
          <InformationCircleIcon class="icon-xs" />
        </button>
      </header>

      <p class="agent-description-ephemeral">
        {{ agent.description }}
      </p>

      <div class="agent-details-section-ephemeral">
        <div class="agent-tags-ephemeral" v-if="agent.tags && agent.tags.length > 0">
          <TagIcon class="details-section-icon" aria-hidden="true" />
          <div class="tags-list-ephemeral" aria-label="Tags">
            <span v-for="tag in agent.tags.slice(0, 3)" :key="tag" class="tag-chip-ephemeral">{{ tag }}</span>
            <span v-if="agent.tags.length > 3" class="tag-chip-ephemeral more-tags-chip" :title="agent.tags.slice(3).join(', ')">
              +{{ agent.tags.length - 3 }}
            </span>
          </div>
        </div>

        <div class="agent-capabilities-ephemeral" v-if="agent.detailedCapabilities && agent.detailedCapabilities.length > 0">
          <CogIcon class="details-section-icon" aria-hidden="true"/>
          <div class="capabilities-list-ephemeral" aria-label="Key Capabilities">
            <span
              v-for="cap in agent.detailedCapabilities.slice(0, 2)" :key="cap.id" class="capability-chip-ephemeral" :title="cap.description"
            >
              <component v-if="cap.icon" :is="cap.icon" class="capability-icon-ephemeral" aria-hidden="true"/>
              <CogIcon v-else class="capability-icon-ephemeral default-cap-icon" aria-hidden="true"/> {{ cap.label }}
            </span>
             <span v-if="agent.detailedCapabilities.length > 2" class="capability-chip-ephemeral more-tags-chip" :title="agent.detailedCapabilities.slice(2).map(c => c.label).join(', ')">
              +{{ agent.detailedCapabilities.length - 2 }}
            </span>
          </div>
        </div>
      </div>
    </div>
     <div v-if="agent.accessTier && agent.accessTier !== 'public'" class="access-tier-badge-ephemeral" :class="`tier--${agent.accessTier}`">
        <ShieldCheckIcon v-if="agent.accessTier === 'member'" class="tier-icon" aria-hidden="true"/>
        <LockClosedIcon v-if="agent.accessTier === 'premium'" class="tier-icon" aria-hidden="true"/>
        {{ agent.accessTier.charAt(0).toUpperCase() + agent.accessTier.slice(1) }}
    </div>
  </div>
</template>

<style lang="scss">
// Styles are in frontend/src/styles/components/agents/_agent-card.scss
</style>