<template>
  <div class="home-example-prompts" :data-voice-target-region="voiceTargetIdPrefix + 'region'">
    <h3 class="section-title" :data-voice-target="voiceTargetIdPrefix + 'title'">
      {{ t('home.tryAskingTitle') }}
    </h3>
    <div class="examples-grid">
      <AppButton
        v-for="(example, index) in smartExamples"
        :key="example.text"
        :aria-label="t('home.askExampleLabel', { exampleText: example.text })"
        :data-voice-target="voiceTargetIdPrefix + 'example-' + (index + 1)"
        class="example-prompt-card"
        :class="example.className"
        variant="custom"
        @click="onExampleClick(example)"
      >
        <div class="example-card-content">
          <div class="example-icon-container">
            <component :is="example.icon" class="example-icon" aria-hidden="true" />
          </div>
          <div class="example-text-content">
            <span class="example-main-text">{{ example.text }}</span>
            <span v-if="example.hint" class="example-hint-text">{{ example.hint }}</span>
          </div>
        </div>
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @file HomeExamplePrompts.vue
 * @description Displays a grid of clickable example prompts for the user to try.
 * Examples are contextually relevant to the selected assistant mode.
 * Fully themeable, accessible, and voice-navigable.
 */
import { computed, PropType, Component as VueComponent } from 'vue';
import { useI18n } from '../../../composables/useI18n';
import { AssistantMode } from '../store/chatSettings.store'; // Assuming AssistantMode enum is here
import AppButton from '../../../components/common/AppButton.vue'; // Using our SOTA button

// Icons for examples (ensure these are imported or globally available)
import {
  CodeBracketIcon, CpuChipIcon, DocumentTextIcon, LightBulbIcon,
  AcademicCapIcon, CogIcon, RocketLaunchIcon, BugAntIcon, SparklesIcon
} from '@heroicons/vue/24/outline';

/**
 * Represents the structure of an example prompt.
 * @interface ExamplePrompt
 */
export interface ExamplePrompt {
  /** The prompt text to display and send. */
  text: string;
  /** The icon component to display for this example. */
  icon: VueComponent;
  /** A short hint or description for the example. */
  hint?: string;
  /** Optional CSS class for custom styling of the card. */
  className?: string;
  /** Optional: Specific modes this example is most relevant for. */
  modes?: AssistantMode[];
}

const props = defineProps({
  /**
   * The current assistant mode, used to filter and display relevant examples.
   * @type {AssistantMode}
   * @required
   */
  mode: {
    type: String as PropType<AssistantMode>,
    required: true,
  },
  /**
   * Prefix for voice target IDs to ensure uniqueness.
   * @type {string}
   * @default 'home-examples-'
   */
  voiceTargetIdPrefix: {
    type: String,
    default: 'home-examples-',
  },
});

const emit = defineEmits<{
  /**
   * Emitted when an example prompt card is clicked.
   * @param {ExamplePrompt} example - The clicked example prompt object.
   */
  (e: 'example-clicked', example: ExamplePrompt): void;
}>();

const { t } = useI18n();

/**
 * A predefined list of smart example prompts.
 * This could be fetched from a configuration or an API in a more advanced setup.
 */
const allSmartExamples: ExamplePrompt[] = [
  // Coding Mode Examples
  { text: "Solve Two Sum problem step by step", icon: CodeBracketIcon, hint: "Classic array problem with O(n) solution", className: "example-type-leetcode", modes: [AssistantMode.CODING] },
  { text: "Implement binary search with complexity analysis", icon: CpuChipIcon, hint: "O(log n) search algorithm", className: "example-type-algorithm", modes: [AssistantMode.CODING] },
  { text: "Debug common recursive function pitfalls", icon: BugAntIcon, hint: "Stack overflow, base cases", className: "example-type-debug", modes: [AssistantMode.CODING] },
  { text: "Optimize a dynamic programming solution for speed", icon: RocketLaunchIcon, hint: "Space-time tradeoffs", className: "example-type-optimization", modes: [AssistantMode.CODING] },

  // System Design Mode Examples
  { text: "Design an Instagram-like photo sharing service", icon: CogIcon, hint: "Scalable architecture for millions of users", className: "example-type-system", modes: [AssistantMode.SYSTEM_DESIGN] },
  { text: "Architect a real-time chat application", icon: CpuChipIcon, hint: "WebSockets, message queues, data partitioning", className: "example-type-scale", modes: [AssistantMode.SYSTEM_DESIGN] },
  { text: "Explain database sharding strategies", icon: DocumentTextIcon, hint: "Pros and cons of different approaches", className: "example-type-architecture", modes: [AssistantMode.SYSTEM_DESIGN] },

  // Meeting Summary Mode Examples
  { text: "Summarize my sprint planning meeting notes", icon: DocumentTextIcon, hint: "Extract decisions and action items", className: "example-type-summary", modes: [AssistantMode.MEETING_SUMMARY] },
  { text: "Generate key takeaways from this product update", icon: LightBulbIcon, hint: "Main points for stakeholders", className: "example-type-takeaways", modes: [AssistantMode.MEETING_SUMMARY] },

  // General Chat Examples (Fallback)
  { text: "Explain the concept of machine learning simply", icon: AcademicCapIcon, hint: "Clear definitions with everyday examples", className: "example-type-concept", modes: [AssistantMode.GENERAL_CHAT] },
  { text: "What are some uses for Large Language Models?", icon: SparklesIcon, hint: "Explore practical applications of LLMs", className: "example-type-application", modes: [AssistantMode.GENERAL_CHAT] },
];

/** Filters examples based on the current assistant mode. */
const smartExamples = computed<ExamplePrompt[]>(() => {
  const modeSpecificExamples = allSmartExamples.filter(ex => ex.modes?.includes(props.mode));
  if (modeSpecificExamples.length > 0) {
    return modeSpecificExamples.slice(0, 4); // Show up to 4 relevant examples
  }
  // Fallback to general examples if no mode-specific ones or current mode is general
  return allSmartExamples.filter(ex => ex.modes?.includes(AssistantMode.GENERAL_CHAT) || !ex.modes).slice(0, 4);
});

/** Handles the click event on an example card. */
const onExampleClick = (example: ExamplePrompt) => {
  emit('example-clicked', example);
};
</script>

<style scoped>
.home-example-prompts {
  /* Container styling */
  margin-bottom: var(--space-8, 2rem); /* Tailwind mb-8 or mb-12 */
}

.section-title {
  font-size: var(--app-font-size-xl, 1.25rem); /* Tailwind text-xl */
  font-weight: var(--app-font-weight-semibold, 600);
  color: var(--app-text-secondary-color);
  margin-bottom: var(--space-6, 1.5rem); /* Tailwind mb-6 */
  text-align: center;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Responsive grid */
  gap: var(--space-4, 1rem); /* Tailwind gap-4 sm:gap-6 */
}

.example-prompt-card.app-button { /* Targeting the AppButton's root for override */
  /* Reset AppButton's default padding and text alignment if necessary */
  padding: 0;
  text-align: left;
  height: auto; /* Allow content to define height */
  /* Card-like appearance */
  background-color: var(--app-card-bg, var(--app-surface-color));
  border: 1px solid var(--app-card-border-color, var(--app-border-color));
  border-radius: var(--app-card-border-radius, var(--app-border-radius-lg));
  box-shadow: var(--app-card-shadow-sm, var(--app-shadow-sm));
  transition: all 0.2s ease-out;
  overflow: hidden; /* For pseudo-elements or internal absolute positioning */
  position: relative;
}
.example-prompt-card.app-button:hover {
  transform: translateY(-3px) scale(1.01);
  box-shadow: var(--app-card-shadow-hover, var(--app-shadow-lg));
  border-color: var(--app-card-hover-border-color, var(--app-primary-color));
}

/* Top border accent styling (already provided in your old Home.vue, adapted here) */
.example-prompt-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0.25rem; /* Tailwind h-1 */
  background-image: linear-gradient(to right, var(--app-gradient-from, var(--app-primary-color)), var(--app-gradient-to, var(--app-accent-color)));
  opacity: 0.8;
  transition: opacity 0.2s ease-out;
}
.example-prompt-card:hover::before {
  opacity: 1;
}
/* Specific accent colors for different example types */
.example-type-leetcode::before { --app-gradient-from: var(--app-blue-500); --app-gradient-to: var(--app-blue-700); }
.example-type-algorithm::before { --app-gradient-from: var(--app-green-500); --app-gradient-to: var(--app-green-700); }
/* ... add more for other classNames based on your initial CSS ... */

.example-card-content {
    padding: var(--space-5, 1.25rem); /* Tailwind p-5 sm:p-6 */
    display: flex;
    flex-direction: column; /* Stack icon above text content */
    gap: var(--space-3, 0.75rem);
}

.example-icon-container {
  width: 2.5rem; /* Tailwind w-10 */
  height: 2.5rem; /* Tailwind h-10 */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--app-border-radius-md);
  background-color: var(--app-icon-container-bg, var(--app-surface-inset-color));
  margin-bottom: var(--space-2, 0.5rem);
}
.example-icon {
  width: 1.5rem; /* Tailwind w-6 h-6 or w-7 h-7 */
  height: 1.5rem;
  color: var(--app-icon-color, var(--app-primary-color));
}

.example-text-content {
  display: flex;
  flex-direction: column;
}
.example-main-text {
  font-size: var(--app-font-size-base);
  font-weight: var(--app-font-weight-medium);
  color: var(--app-text-color);
  margin-bottom: 0.25rem; /* Tailwind mb-1 */
}
.example-hint-text {
  font-size: var(--app-font-size-sm);
  color: var(--app-text-secondary-color);
}

/* Holographic theme adjustments */
.theme-holographic .section-title {
  color: var(--holographic-text-secondary);
}
.theme-holographic .example-prompt-card.app-button {
  background-color: var(--holographic-card-bg-translucent);
  border-color: var(--holographic-border-translucent);
  box-shadow: var(--holographic-glow-sm-panel);
}
.theme-holographic .example-prompt-card.app-button:hover {
  border-color: var(--holographic-accent);
  box-shadow: var(--holographic-glow-md-accent);
}
.theme-holographic .example-prompt-card::before {
   background-image: linear-gradient(to right, var(--holographic-accent), color-mix(in srgb, var(--holographic-accent) 60%, var(--holographic-glow-color)));
}
.theme-holographic .example-icon-container {
    background-color: var(--holographic-surface-inset-translucent);
}
.theme-holographic .example-icon {
    color: var(--holographic-accent);
}
.theme-holographic .example-main-text { color: var(--holographic-text-primary); }
.theme-holographic .example-hint-text { color: var(--holographic-text-muted); }
</style>