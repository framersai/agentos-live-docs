// File: frontend/src/components/settings/SettingsSection.vue
/**
 * @file SettingsSection.vue
 * @description A reusable UI component to group related settings with a common title and optional icon.
 * It provides a consistent visual structure for different sections within a settings page.
 * @version 1.0.0
 * @author Your Name / AI Architect
 */

<template>
  <section
    class="settings-section-card"
    :aria-labelledby="sectionTitleId"
  >
    <div class="section-header">
      <component
        :is="icon"
        v-if="icon"
        class="section-icon shrink-0"
        aria-hidden="true"
      />
      <h2 :id="sectionTitleId" class="section-title">
        {{ title }}
      </h2>
    </div>
    <slot />
  </section>
</template>

<script setup lang="ts">
import { computed, type Component as VueComponent } from 'vue';

/**
 * @interface SettingsSectionProps
 * @description Props definition for the SettingsSection component.
 */
interface SettingsSectionProps {
  /**
   * @prop {string} title - The title of the settings section. This will also be used to generate an accessible ID.
   * @required
   */
  title: string;
  /**
   * @prop {VueComponent} [icon] - Optional Vue component to be used as an icon for the section header.
   * @optional
   */
  icon?: VueComponent;
}

const props = defineProps<SettingsSectionProps>();

/**
 * @computed sectionTitleId
 * @description Generates a unique and accessible ID for the section title, derived from the props.title.
 * @returns {string} The unique ID for the section title element.
 */
const sectionTitleId = computed<string>(() => `${props.title.toLowerCase().replace(/\s+/g, '-')}-settings-title`);

</script>

<style scoped lang="postcss">
/**
 * Styles for the SettingsSection component.
 * These styles are scoped to this component and leverage global design tokens and Tailwind utility classes.
 */
.settings-section-card {
  @apply bg-white dark:bg-gray-800/60 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/50;
  /* transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out; */
  /* &:hover {
    @apply shadow-xl transform -translate-y-0.5;
  } */
}

.section-header {
  @apply flex items-center gap-3 pb-4 mb-6 border-b border-gray-200 dark:border-gray-700;
}

.section-icon {
  @apply h-6 w-6 text-primary-500 dark:text-primary-400;
}

.section-title {
  @apply text-xl font-semibold text-gray-800 dark:text-gray-100;
}
</style>