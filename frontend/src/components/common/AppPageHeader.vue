<template>
  <header
    class="app-page-header"
    :class="[uiStore.currentTheme, { 'has-border': border, 'is-sticky': sticky }]"
    :data-voice-target-region="voiceTargetIdPrefix + 'region'"
    :aria-labelledby="titleId"
    :aria-describedby="subtitleIdIfPresent"
  >
    <div class="app-page-header-content app-container">
      <div class="header-main-content">
        <AppButton
          v-if="showBackButton"
          variant="tertiary"
          size="sm" :pill="true"
          :icon="ArrowLeftIcon"
          :aria-label="backButtonAriaLabel || t('common.backButtonLabel')"
          :title="backButtonAriaLabel || t('common.backButtonLabel')"
          :data-voice-target="voiceTargetIdPrefix + 'back-button'"
          @click="handleBack"
          class="back-button"
        />
        <div class="title-group">
          <component
            :is="titleTag"
            :id="titleId"
            class="page-main-title"
            :data-voice-target="voiceTargetIdPrefix + 'title-text'"
          >
            <slot name="title">{{ title }}</slot>
          </component>
          <p
            v-if="subtitle || $slots.subtitle"
            :id="subtitleId"
            class="page-subtitle"
            :data-voice-target="voiceTargetIdPrefix + 'subtitle-text'"
          >
            <slot name="subtitle">{{ subtitle }}</slot>
          </p>
        </div>
      </div>
      <div v-if="$slots.actions" class="header-actions-slot" :data-voice-target-region="voiceTargetIdPrefix + 'actions-region'">
        <slot name="actions"></slot>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
/**
 * @file AppPageHeader.vue
 * @description A SOTA, reusable, and accessible page header component.
 * Supports a main title, subtitle, optional back button, and an actions slot.
 * It is themeable via CSS custom properties and fully voice-navigable.
 * Intended for use in standard views that are not the main chat interface.
 *
 * @property {string} title - The main title for the page header. Required.
 * @property {string} [subtitle=''] - Optional subtitle displayed below the main title.
 * @property {boolean} [showBackButton=false] - If true, displays a back button.
 * @property {RouteLocationRaw} [backRoute=null] - Optional Vue Router route for the back button. If null, router.back() is used.
 * @property {string} [backButtonAriaLabel=''] - Optional ARIA label for the back button, overrides default.
 * @property {boolean} [border=true] - If true, adds a bottom border to the header.
 * @property {boolean} [sticky=true] - If true, the header will stick to the top of the viewport on scroll.
 * @property {string} [titleTag='h1'] - The HTML tag to use for the main title.
 * @property {string} [voiceTargetIdPrefix='app-page-header-'] - Prefix for voice target IDs.
 */
import { computed, PropType } from 'vue';
import { useRouter, RouteLocationRaw } from 'vue-router';
import { useI18n } from '../../composables/useI18n';
import { useUiStore } from '../../store/ui.store';
import AppButton from './AppButton.vue';
import { ArrowLeftIcon } from '@heroicons/vue/24/solid';

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div';

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  showBackButton: { type: Boolean, default: false },
  backRoute: { type: Object as PropType<RouteLocationRaw>, default: null },
  backButtonAriaLabel: { type: String, default: '' },
  border: { type: Boolean, default: true },
  sticky: { type: Boolean, default: true },
  titleTag: { type: String as PropType<HeadingTag>, default: 'h1' },
  voiceTargetIdPrefix: { type: String, default: 'app-page-header-' },
});

const router = useRouter();
const { t } = useI18n();
const uiStore = useUiStore();

const titleId = computed(() => props.voiceTargetIdPrefix + 'main-title-element');
const subtitleId = computed(() => props.voiceTargetIdPrefix + 'main-subtitle-element');
const subtitleIdIfPresent = computed(() => (props.subtitle || slots.subtitle) ? subtitleId.value : undefined);

const slots = defineSlots<{
  title?: (props: Record<string, never>) => any;
  subtitle?: (props: Record<string, never>) => any;
  actions?: (props: Record<string, never>) => any;
}>();


/** Handles the click on the back button, navigating via router. */
const handleBack = () => {
  if (props.backRoute) {
    router.push(props.backRoute);
  } else if (window.history.length > 2) { // Check if there is a page to go back to
    router.back();
  } else {
    router.push({ name: 'Home' }); // Fallback to Home if no history
  }
};
</script>

<style scoped>
/* Uses CSS custom properties from _variables.css and Tailwind utilities */
.app-page-header {
  padding: var(--app-page-header-padding-y, var(--space-md)) 0;
  background-color: var(--app-page-header-bg, var(--app-surface-color-transparent));
  backdrop-filter: var(--app-blur-sm);
  width: 100%;
  transition: background-color var(--duration-normal) ease, border-color var(--duration-normal) ease;
}
.app-page-header.is-sticky {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-index-page-header, 900);
}
.app-page-header.has-border {
  border-bottom: 1px solid var(--app-page-header-border-color, var(--app-border-color));
}

.app-page-header-content {
  /* .app-container for max-width and horizontal padding is defined globally in main.css */
  @apply flex items-center justify-between gap-4;
}

.header-main-content {
  @apply flex items-center gap-3 flex-grow min-w-0;
}

.back-button { /* Targets AppButton specific usage */
  color: var(--app-page-header-back-button-color, var(--app-text-secondary-color));
}
.back-button:hover {
  color: var(--app-page-header-back-button-hover-color, var(--app-text-color));
  background-color: var(--app-page-header-back-button-hover-bg, var(--app-surface-hover-color));
}

.title-group {
  @apply flex flex-col flex-grow min-w-0;
}
.page-main-title {
  font-size: var(--app-page-title-font-size, 1.5rem); /* text-2xl */
  font-weight: var(--app-page-title-font-weight, 700); /* font-bold */
  color: var(--app-page-title-color, var(--app-heading-color));
  line-height: 1.3;
  @apply truncate;
}
.page-subtitle {
  font-size: var(--app-page-subtitle-font-size, 0.875rem); /* text-sm */
  color: var(--app-page-subtitle-color, var(--app-text-muted-color));
  margin-top: 0.125rem; /* mt-0.5 */
  @apply truncate;
}

.header-actions-slot {
  @apply flex-shrink-0 flex items-center gap-2;
}

/* Holographic theme adjustments */
.theme-holographic .app-page-header {
  background-color: var(--holographic-header-bg-translucent, rgba(var(--holographic-panel-rgb), 0.7));
  border-bottom-color: var(--holographic-border-translucent, rgba(var(--holographic-accent-rgb), 0.3));
  backdrop-filter: var(--holographic-blur-md);
}
.theme-holographic .app-page-header.has-border {
  border-bottom-color: var(--holographic-border-subtle);
}
.theme-holographic .back-button {
    color: var(--holographic-text-muted);
}
.theme-holographic .back-button:hover {
    color: var(--holographic-accent);
    background-color: var(--holographic-surface-hover-translucent);
}
.theme-holographic .page-main-title {
  color: var(--holographic-text-accent);
  text-shadow: var(--holographic-text-glow-xs);
}
.theme-holographic .page-subtitle {
  color: var(--holographic-text-secondary);
}
</style>