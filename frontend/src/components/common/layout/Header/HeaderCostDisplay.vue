<template>
  <div
    class="header-cost-display"
    :class="costDisplayClasses"
    :aria-label="t('header.sessionCostLabel', { cost: formattedCost })"
    :data-voice-target="voiceTargetIdPrefix + 'session-cost'"
    :title="t('header.sessionCostTooltip')"
  >
    <span class="cost-display-label hidden sm:inline">{{ t('header.costLabelShort') }}</span>
    <span class="cost-display-value font-mono" :style="{ color: costColor }">
      {{ formattedCost }}
    </span>
    <div v-if="isCostCritical" class="cost-warning-indicator" :title="t('header.costThresholdWarning')">
      <ExclamationTriangleIcon class="w-3 h-3 sm:w-4 sm:h-4" />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file HeaderCostDisplay.vue
 * @description Displays the current session's API usage cost.
 * It visually indicates if the cost is approaching or has exceeded a predefined threshold.
 * Themeable and voice-navigable.
 */
import { computed, PropType } from 'vue';
import { useI18n } from '../../composables/useI18n';
import { useAuthStore } from '../../features/auth/store/auth.store'; // Assuming cost threshold might be part of subscription
import { ExclamationTriangleIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
  /**
   * The current session cost value.
   * @type {number}
   * @required
   */
  sessionCost: {
    type: Number,
    required: true,
  },
  /**
   * The cost threshold at which a warning or critical state is indicated.
   * If not provided, it might be fetched from a store or default to a high value.
   * @type {number}
   */
  costThreshold: {
    type: Number,
    default: 20.00, // Default threshold, can be overridden by user settings/subscription
  },
  /**
   * Prefix for voice target IDs to ensure uniqueness within the header.
   * @type {string}
   * @default 'header-cost-'
   */
  voiceTargetIdPrefix: {
    type: String,
    default: 'header-cost-',
  },
});

const { t, formatCurrency } = useI18n(); // Assuming formatCurrency is part of useI18n
const authStore = useAuthStore(); // To potentially get user-specific threshold or currency

/**
 * Formats the session cost as a currency string.
 * Uses user's locale and preferred currency if available, otherwise defaults.
 * @returns {string} The formatted cost.
 */
const formattedCost = computed(() => {
  // const userCurrency = authStore.currentUser?.settings?.preferredCurrency || 'USD';
  // const userLocale = authStore.currentUser?.settings?.locale || navigator.language || 'en-US';
  // For now, using a simplified formatter from useI18n
  return formatCurrency(props.sessionCost, 'USD', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
});

/**
 * Determines if the current cost is in a warning state (e.g., >75% of threshold).
 * @returns {boolean}
 */
const isCostWarning = computed(() => {
  const effectiveThreshold = props.costThreshold > 0 ? props.costThreshold : Infinity;
  return props.sessionCost >= effectiveThreshold * 0.75 && props.sessionCost < effectiveThreshold;
});

/**
 * Determines if the current cost is in a critical state (e.g., >= threshold).
 * @returns {boolean}
 */
const isCostCritical = computed(() => {
  const effectiveThreshold = props.costThreshold > 0 ? props.costThreshold : Infinity;
  return props.sessionCost >= effectiveThreshold;
});

/**
 * Computes dynamic CSS classes for the cost display based on its state.
 * @returns {object}
 */
const costDisplayClasses = computed(() => ({
  'is-warning': isCostWarning.value && !isCostCritical.value,
  'is-critical': isCostCritical.value,
  // Add theme-specific classes if needed, though variables are preferred
}));

/**
 * Computes the color for the cost value based on its state.
 * Uses CSS custom properties for theming.
 * @returns {string} CSS color variable.
 */
const costColor = computed(() => {
  if (isCostCritical.value) return 'var(--app-danger-color, #ef4444)';
  if (isCostWarning.value) return 'var(--app-warning-color, #f59e0b)';
  return 'var(--app-cost-display-value-color, var(--app-primary-color))'; // Default to primary or a specific var
});

</script>

<style scoped>
.header-cost-display {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem; /* Tailwind sm:gap-1 */
  padding: 0.375rem 0.75rem; /* Tailwind sm:px-3 py-1.5 */
  border-radius: var(--app-badge-border-radius, 9999px); /* pill shape */
  font-size: var(--app-font-size-sm, 0.875rem);
  font-weight: var(--app-font-weight-medium, 500);
  background-color: var(--app-cost-display-bg, var(--app-surface-inset-color));
  color: var(--app-cost-display-label-color, var(--app-text-secondary-color));
  border: 1px solid var(--app-cost-display-border-color, var(--app-border-color-subtle));
  transition: background-color 0.2s, border-color 0.2s;
  /* Glass effect from original header if desired */
  /* backdrop-filter: var(--app-blur-sm); */
  /* background-color: var(--app-surface-color-transparent); */
}

.cost-display-label {
  /* Styles for "Cost:" label */
}

.cost-display-value {
  font-weight: var(--app-font-weight-bold, 700);
  transition: color 0.2s;
}

.cost-warning-indicator {
  display: inline-flex;
  align-items: center;
  margin-left: 0.25rem;
  color: var(--app-warning-color); /* Default warning icon color */
}

.header-cost-display.is-warning {
  background-color: var(--app-warning-bg-subtle);
  border-color: var(--app-warning-border-color, var(--app-warning-color));
}
.header-cost-display.is-warning .cost-warning-indicator {
    color: var(--app-warning-text-strong, var(--app-warning-color));
}


.header-cost-display.is-critical {
  background-color: var(--app-danger-bg-subtle);
  border-color: var(--app-danger-border-color, var(--app-danger-color));
}
.header-cost-display.is-critical .cost-warning-indicator {
  color: var(--app-danger-text-strong, var(--app-danger-color)); /* Use danger color for icon */
}

/* Holographic theme adjustments */
.theme-holographic .header-cost-display {
  background-color: var(--holographic-panel-bg-translucent, rgba(var(--holographic-panel-rgb), 0.5));
  border-color: var(--holographic-border-translucent, rgba(var(--holographic-accent-rgb), 0.3));
  color: var(--holographic-text-secondary);
  box-shadow: var(--holographic-glow-sm);
}
.theme-holographic .cost-display-value {
  /* Default color will be primary, which is holographic-accent */
}
.theme-holographic .header-cost-display.is-warning {
  background-color: rgba(var(--app-warning-rgb), 0.3);
  border-color: var(--app-warning-color);
}
.theme-holographic .header-cost-display.is-critical {
  background-color: rgba(var(--app-danger-rgb), 0.3);
  border-color: var(--app-danger-color);
}
</style>