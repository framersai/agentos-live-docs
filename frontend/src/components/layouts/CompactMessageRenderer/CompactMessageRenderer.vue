<script setup lang="ts">
import { ref, onMounted, watch, type PropType } from 'vue'; // Removed nextTick, onBeforeUnmount
import {
  ChevronLeftIcon, ChevronRightIcon, PlayIcon as PlaySolidIcon, PauseIcon as PauseSolidIcon,
  ArrowsPointingOutIcon, ArrowsPointingInIcon, DocumentDuplicateIcon, PhotoIcon,
  PresentationChartLineIcon, PlusCircleIcon, MinusCircleIcon,
} from '@heroicons/vue/24/solid';

// Assuming composable is in the same directory or adjust path
import { useCompactMessageRenderer } from './useCompactMessageRenderer';
import type { CompactMessageRendererPublicMethods } from './CompactMessageRendererTypes';

const props = defineProps({
  content: { type: String as PropType<string>, required: true },
  mode: { type: String as PropType<string>, default: 'general' },
  language: { type: String as PropType<string>, default: 'plaintext' },
  initialSlideIndex: { type: Number as PropType<number>, default: 0 },
  disableInternalAutoplay: { type: Boolean as PropType<boolean>, default: false },
});

const emit = defineEmits<{
  (e: 'toggle-fullscreen'): void;
  (e: 'interaction', payload: { type: string; data?: any }): void;
  (e: 'slide-changed', payload: { newIndex: number; totalSlides: number; navigatedManually: boolean }): void;
  (e: 'internal-autoplay-status-changed', payload: { isPlaying: boolean; isPaused: boolean }): void;
  (e: 'rendered'): void;
}>();

const localContentDisplayRootRef = ref<HTMLElement | null>(null);

const {
  isLoadingContent,
  analyzedContent,
  slides, 
  currentSlideIndex,
  isSlideshowMode,
  isAutoplayActive,
  isAutoplayEffectivelyPaused,
  autoplayProgress,
  isComponentFullscreen,
  currentContentFontScale,
  nonSlideDiagrams, // Exposed for v-if in template

  currentSlideData,
  totalSlides,
  // overallProgressPercent, // Removed to clear warning, not used in this template version
  canGoNext,
  canGoPrev,
  currentSlideTargetDurationMs, // Exposed for template
  currentSlideTimeElapsedMs,   // Exposed for template

  navigateToSlide,
  nextSlide,
  prevSlide,
  toggleInternalAutoplay,
  toggleComponentFullscreen,
  adjustFontSize,
  copyAllCodeBlocks,
  exportDiagrams,
  exportSlidesContent,
  contentDisplayRootRef,
} = useCompactMessageRenderer(props, emit);

watch(localContentDisplayRootRef, (newEl) => {
  contentDisplayRootRef.value = newEl;
});

onMounted(() => {
  const rootEl = localContentDisplayRootRef.value || document.documentElement;
   if (rootEl && !getComputedStyle(rootEl).getPropertyValue('--content-font-scale')) {
     rootEl.style.setProperty('--content-font-scale', '1');
   }
});

defineExpose<CompactMessageRendererPublicMethods>({
  navigateToSlide: (index: number) => navigateToSlide(index, 'user'),
  next: nextSlide,
  prev: prevSlide,
  pauseAutoplay: () => { if (!props.disableInternalAutoplay) isAutoplayActive.value = false; },
  resumeAutoplay: () => { if (!props.disableInternalAutoplay) isAutoplayActive.value = true; },
  toggleFullscreen: toggleComponentFullscreen,
  getCurrentSlideIndex: () => currentSlideIndex.value,
  getTotalSlides: () => totalSlides.value,
});

</script>

<template>
  <div
    class="cmr"
    ref="localContentDisplayRootRef"
    :class="[
      `cmr--mode-${props.mode}`,
      {
        'cmr--fullscreen': isComponentFullscreen,
        'cmr--slideshow-active': isSlideshowMode,
      },
      `cmr--analysis-type-${analyzedContent?.contentType || 'general'}`
    ]"
    :style="{ '--content-font-scale': currentContentFontScale }"
  >
    <div v-if="isLoadingContent" class="cmr__loading-overlay">
      <div class="cmr__spinner"></div>
      <p>Processing Content...</p>
    </div>

    <div v-if="analyzedContent && !isSlideshowMode" class="cmr__analysis-banner">
      <div class="cmr__banner-info-group">
        <span class="cmr__banner-title">{{ analyzedContent.displayTitle }}</span>
        <span v-if="analyzedContent.difficulty" :class="`cmr__difficulty-badge cmr__difficulty--${analyzedContent.difficulty.toLowerCase()}`">
          {{ analyzedContent.difficulty }}
        </span>
      </div>
      <div class="cmr__banner-meta-group">
        <span v-if="analyzedContent.estimatedTotalReadingTimeMs > 0">~{{ Math.ceil(analyzedContent.estimatedTotalReadingTimeMs / 60000) }} min read</span>
        <span v-if="analyzedContent.complexity?.time" :class="['cmr__complexity-tag', 'cmr__complexity--time']">Time: {{ analyzedContent.complexity.time }}</span>
        <span v-if="analyzedContent.complexity?.space" :class="['cmr__complexity-tag', 'cmr__complexity--space']">Space: {{ analyzedContent.complexity.space }}</span>
      </div>
    </div>

    <div class="cmr__content-area">
      <template v-if="isSlideshowMode && currentSlideData">
        <div class="cmr__slide-content-wrapper" :key="currentSlideData.id" role="tabpanel" :aria-labelledby="`slide-title-${currentSlideData.id}`">
          <div v-if="analyzedContent && currentSlideIndex === 0" class="cmr__analysis-banner cmr__analysis-banner--slide-header">
            <span class="cmr__banner-title">{{ analyzedContent.displayTitle }}</span>
             <span v-if="analyzedContent.difficulty" :class="`cmr__difficulty-badge cmr__difficulty--${analyzedContent.difficulty.toLowerCase()}`">
              {{ analyzedContent.difficulty }}
            </span>
          </div>
          <h3 v-if="currentSlideData.title && !(currentSlideIndex === 0 && currentSlideData.title === analyzedContent?.displayTitle)" :id="`slide-title-${currentSlideData.id}`" class="cmr__slide-title">
            {{ currentSlideData.title }}
          </h3>
          <div
            :class="['cmr__slide-html-content', `cmr__slide-type--${currentSlideData.slideType}`]"
            v-html="currentSlideData.htmlContent"
          ></div>
          <div v-if="currentSlideData.diagramMermaidCode" class="cmr__slide-diagram-wrapper" :data-slide-diagram-id="`slide-${currentSlideData.id.split('-')[1]}-diagram`">
          </div>
        </div>
      </template>
      <template v-else-if="!isSlideshowMode && analyzedContent">
         <div class="cmr__single-content-html" v-html="slides.length > 0 ? slides[0].htmlContent : (nonSlideDiagrams.length > 0 ? '' : '<p class=\'cmr__status-text\'>No structured content to display.</p>')">
         </div>
      </template>
      <p v-else-if="!isLoadingContent" class="cmr__status-text cmr__status-text--empty">
        No content to display.
      </p>
    </div>

    <div class="cmr__control-bar" v-if="analyzedContent">
      <div class="cmr__controls-group cmr__controls-group--nav" v-if="isSlideshowMode && totalSlides > 1">
        <button @click="prevSlide" :disabled="!canGoPrev" class="cmr__control-btn" title="Previous Slide" aria-label="Previous Slide"><ChevronLeftIcon class="cmr__icon" /></button>
        <div class="cmr__slide-indicator">
          <span class="cmr__slide-counter">{{ currentSlideIndex + 1 }} / {{ totalSlides }}</span>
          <div class="cmr__progress-dots" role="tablist" aria-label="Slide Navigation">
            <button
              v-for="(_, index) in slides" :key="`dot-${index}`"
              @click="() => navigateToSlide(index, 'user')"
              class="cmr__dot" :class="{ 'cmr__dot--active': index === currentSlideIndex }"
              :aria-label="`Go to slide ${index + 1}`" role="tab" :aria-selected="index === currentSlideIndex"
            ></button>
          </div>
        </div>
        <button @click="nextSlide" :disabled="!canGoNext" class="cmr__control-btn" title="Next Slide" aria-label="Next Slide"><ChevronRightIcon class="cmr__icon" /></button>
         <button
            v-if="!disableInternalAutoplay"
            @click="toggleInternalAutoplay"
            class="cmr__control-btn"
            :title="isAutoplayActive && !isAutoplayEffectivelyPaused ? 'Pause Autoplay' : 'Start/Resume Autoplay'"
            :aria-pressed="isAutoplayActive && !isAutoplayEffectivelyPaused">
            <PauseSolidIcon v-if="isAutoplayActive && !isAutoplayEffectivelyPaused" class="cmr__icon" />
            <PlaySolidIcon v-else class="cmr__icon" />
          </button>
      </div>
      <div class="cmr__controls-group cmr__controls-group--actions">
        <button @click="copyAllCodeBlocks(contentDisplayRootRef)" class="cmr__control-btn" title="Copy All Code">
          <DocumentDuplicateIcon class="cmr__icon" /><span class="cmr__btn-label">Copy Code</span>
        </button>
        <button @click="exportDiagrams" v-if="analyzedContent?.diagramCount > 0" class="cmr__control-btn" title="Export Diagrams">
          <PhotoIcon class="cmr__icon" /><span class="cmr__btn-label">Diagrams</span>
        </button>
        <button @click="exportSlidesContent" v-if="isSlideshowMode" class="cmr__control-btn" title="Export Slides">
          <PresentationChartLineIcon class="cmr__icon" /><span class="cmr__btn-label">Slides</span>
        </button>
      </div>
      <div class="cmr__controls-group cmr__controls-group--view">
        <button @click="adjustFontSize(-1)" class="cmr__control-btn" title="Decrease Font Size"><MinusCircleIcon class="cmr__icon" /></button>
        <button @click="adjustFontSize(1)" class="cmr__control-btn" title="Increase Font Size"><PlusCircleIcon class="cmr__icon" /></button>
        <button @click="toggleComponentFullscreen" class="cmr__control-btn" title="Toggle Fullscreen">
          <component :is="isComponentFullscreen ? ArrowsPointingInIcon : ArrowsPointingOutIcon" class="cmr__icon" />
        </button>
      </div>
    </div>
    <div v-if="isSlideshowMode && isAutoplayActive && !disableInternalAutoplay && totalSlides > 1" class="cmr__autoplay-progress">
        <div class="cmr__progress-track"><div class="cmr__progress-fill" :style="{ width: `${autoplayProgress}%` }"></div></div>
        <p v-if="!isAutoplayEffectivelyPaused && autoplayProgress < 100" class="cmr__progress-label">Next slide in {{ Math.max(0, Math.ceil((currentSlideTargetDurationMs - currentSlideTimeElapsedMs) / 1000)) }}s</p>
        <p v-else-if="isAutoplayEffectivelyPaused" class="cmr__progress-label">Autoplay Paused</p>
    </div>
  </div>
</template>

<style lang="scss">
// Minimal structural styles here. Detailed theming and looks should be in external SCSS.
// This defines the basic layout and BEM-like class structure.

.cmr { // Root element
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: var(--color-bg-primary, #fff); // Fallback
  color: var(--color-text-primary, #000);
  font-size: calc(1rem * var(--content-font-scale, 1)); // Base font size scaled
  position: relative; // For overlays

  &--fullscreen {
    position: fixed;
    inset: 0;
    z-index: var(--z-index-modal, 1050); // Ensure it's above other content
    // font-size: calc(1.1rem * var(--content-font-scale, 1)); // Slightly larger base in fullscreen
  }

  // Mode specific styling hook
  // Example: &.cmr--mode-lc_audit_aide { border: 1px solid blue; }
}

.cmr__loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: hsla(var(--color-bg-primary-h,0), var(--color-bg-primary-s,0%), var(--color-bg-primary-l,100%), 0.7);
  z-index: 10;
  .cmr__spinner { /* Basic spinner */
    width: 40px; height: 40px;
    border: 4px solid hsla(var(--color-accent-primary-h,200), var(--color-accent-primary-s,50%), var(--color-accent-primary-l,50%), 0.2);
    border-top-color: hsl(var(--color-accent-primary-h,200), var(--color-accent-primary-s,50%), var(--color-accent-primary-l,50%));
    border-radius: 50%;
    animation: cmr-spin 0.8s linear infinite;
  }
  p { margin-top: 0.75rem; font-size: 0.9em; color: var(--color-text-secondary); }
}

@keyframes cmr-spin { to { transform: rotate(360deg); } }

.cmr__analysis-banner {
  padding: 0.5rem 0.75rem;
  background-color: hsla(var(--color-bg-secondary-h,0), var(--color-bg-secondary-s,0%), var(--color-bg-secondary-l,95%), 0.8);
  border-bottom: 1px solid var(--color-border-primary, #eee);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.8em;

  .cmr__banner-info-group { display: flex; align-items: center; gap: 0.5rem; }
  .cmr__banner-title { font-weight: 600; color: var(--color-text-primary); }
  .cmr__difficulty-badge {
    padding: 0.1rem 0.5rem; border-radius: var(--radius-sm, 4px); font-size: 0.7em; font-weight: 500;
    &.cmr__difficulty--easy { background-color: hsla(120, 60%, 70%, 0.2); color: hsl(120, 60%, 30%); }
    &.cmr__difficulty--medium { background-color: hsla(40, 80%, 70%, 0.2); color: hsl(40, 80%, 30%); }
    &.cmr__difficulty--hard { background-color: hsla(0, 70%, 70%, 0.2); color: hsl(0, 70%, 35%); }
  }
  .cmr__banner-meta-group { display: flex; align-items: center; gap: 0.75rem; color: var(--color-text-muted); }
  .cmr__complexity-tag { font-size: 0.7em; padding: 0.1rem 0.4rem; border-radius: var(--radius-xs); background-color: hsla(var(--color-bg-tertiary-h), var(--color-bg-tertiary-s), var(--color-bg-tertiary-l), 0.7); }
}

.cmr__content-area {
  flex-grow: 1;
  overflow-y: auto;
  position: relative; // For absolute positioned elements inside if any
  // Apply custom scrollbar mixin if available from _mixins.scss
  // @include custom-scrollbar('--color-accent-primary', 0.4, 0.6, '--color-bg-secondary', 0.1);
}

.cmr__slide-content-wrapper {
  padding: 1rem; // Base padding for slide content
  min-height: 150px; // Ensure slide has some min height
  outline: none; // For focus management
}
.cmr__slide-title {
  font-size: calc(1.4em * var(--content-font-scale, 1));
  font-weight: 600;
  color: var(--color-text-accent, inherit);
  margin-bottom: 0.75em;
  border-bottom: 1px solid hsla(var(--color-border-primary-h),var(--color-border-primary-s),var(--color-border-primary-l), 0.5);
  padding-bottom: 0.25em;
}
.cmr__slide-html-content {
  // Standard prose styling will apply here from global styles or :deep overrides
  line-height: 1.6;
  font-size: inherit; /* Inherit scaled font size */
}
.cmr__slide-diagram-wrapper {
  margin-top: 1rem;
  padding: 0.5rem;
  border: 1px solid var(--color-border-secondary, #ddd);
  border-radius: var(--radius-md, 6px);
  background-color: hsla(var(--color-bg-secondary-h),var(--color-bg-secondary-s),var(--color-bg-secondary-l), 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px; // For empty/loading state
  .mermaid-diagram-slide-wrapper { // If an inner div is used for mermaid specifically
    width: 100%;
    svg { max-width: 100%; height: auto; }
  }
}

.cmr__single-content-html {
  padding: 1rem;
  line-height: 1.6;
  font-size: inherit;
  .cmr__diagram-placeholder { /* Styles for these placeholders */
    border: 1px dashed var(--color-border-secondary, #ccc);
    padding: 1rem; margin: 1rem 0; text-align: center;
    min-height: 100px;
  }
}

.cmr__control-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-top: 1px solid var(--color-border-primary, #eee);
  background-color: hsla(var(--color-bg-secondary-h),var(--color-bg-secondary-s),var(--color-bg-secondary-l), 0.7);
  backdrop-filter: blur(4px); // Subtle glassmorphism for control bar
  flex-wrap: wrap; // Allow wrapping on small screens
  gap: 0.5rem;
}
.cmr__controls-group {
  display: flex;
  align-items: center;
  gap: 0.35rem; // Space between buttons in a group
}
.cmr__control-btn {
  background: transparent;
  border: 1px solid transparent;
  padding: 0.35rem;
  border-radius: var(--radius-md, 6px);
  cursor: pointer;
  color: var(--color-text-secondary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s ease-out, color 0.15s ease-out;
  &:hover:not(:disabled) {
    background-color: hsla(var(--color-accent-primary-h),var(--color-accent-primary-s),var(--color-accent-primary-l), 0.1);
    color: var(--color-text-accent, var(--color-accent-primary));
  }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
  .cmr__icon { width: 1.1rem; height: 1.1rem; } // Adjusted icon size
  .cmr__btn-label { font-size: 0.7rem; margin-left: 0.25rem; display: none; @media (min-width: 640px) { display: inline; } } // Hide on xs screens
}
.cmr__slide-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-muted);
  font-size: 0.75rem;
}
.cmr__progress-dots {
  display: flex;
  gap: 0.3rem;
  .cmr__dot {
    width: 6px; height: 6px; border-radius: 50%;
    background-color: hsla(var(--color-text-muted-h),var(--color-text-muted-s),var(--color-text-muted-l), 0.3);
    border: none; padding: 0; cursor: pointer;
    transition: background-color 0.2s ease;
    &.cmr__dot--active { background-color: hsl(var(--color-accent-primary-h),var(--color-accent-primary-s),var(--color-accent-primary-l)); }
    &:hover { background-color: hsla(var(--color-accent-primary-h),var(--color-accent-primary-s),var(--color-accent-primary-l), 0.7); }
  }
}

.cmr__autoplay-progress {
  padding: 0.25rem 0.75rem;
  background-color: hsla(var(--color-bg-tertiary-h),var(--color-bg-tertiary-s),var(--color-bg-tertiary-l), 0.5);
  font-size: 0.7rem;
  color: var(--color-text-muted);
  text-align: center;
  .cmr__progress-track {
    height: 3px; background-color: hsla(var(--color-text-muted-h),var(--color-text-muted-s),var(--color-text-muted-l), 0.2);
    border-radius: 3px; overflow: hidden; margin-bottom: 0.15rem;
  }
  .cmr__progress-fill {
    height: 100%;
    background-color: hsl(var(--color-accent-primary-h),var(--color-accent-primary-s),var(--color-accent-primary-l));
    transition: width 0.1s linear; // Smooth progress update
    border-radius: 3px;
  }
}

// Styles for enhanced code blocks (ensure these match _formatCodeForDisplay output)
.cmr__code-block {
  position: relative;
  background-color: var(--color-bg-code-block, #f5f5f5);
  border-radius: var(--radius-md, 6px);
  margin: 1em 0;
  box-shadow: var(--shadow-depth-xs, 0 1px 2px rgba(0,0,0,0.05));
  border: 1px solid var(--color-border-code-block, #e0e0e0);
  .cmr__code-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.35rem 0.65rem;
    background-color: hsla(var(--color-bg-code-block-h),var(--color-bg-code-block-s),calc(var(--color-bg-code-block-l) + 5%), 0.7);
    border-bottom: 1px solid var(--color-border-code-block, #e0e0e0);
    font-size: 0.75em;
  }
  .cmr__code-lang-tag {
    color: var(--color-text-code-meta, #888);
    text-transform: uppercase;
    font-weight: 500;
  }
  .cmr__copy-code-btn { /* Styles for the copy button itself */
    background: none; border: none; cursor: pointer; padding: 0.2rem;
    color: var(--color-text-code-meta);
    .icon-xs { width: 1em; height: 1em; }
    &:hover { color: var(--color-text-accent); }
  }
  pre {
    margin: 0; padding: 0.75rem; overflow-x: auto;
    // Apply custom scrollbar mixin for pre blocks
    // @include custom-scrollbar('--color-accent-secondary', 0.3, 0.5, '--color-bg-code-block', 0.1, 6px);
    font-size: calc(0.85em * var(--content-font-scale, 1));
    line-height: 1.5;
  }
  code.hljs { padding: 0 !important; background: transparent !important; } // Override hljs default padding/bg
  .cmr__line-number {
    display: inline-block;
    width: 2.5em; // Adjust as needed
    padding-right: 0.8em;
    text-align: right;
    color: hsla(var(--color-text-code-meta-h,0),var(--color-text-code-meta-s,0%),var(--color-text-code-meta-l,50%), 0.5);
    user-select: none;
    border-right: 1px solid hsla(var(--color-border-code-block-h),var(--color-border-code-block-s),var(--color-border-code-block-l),0.3);
    margin-right: 0.8em;
  }
  .cmr__line-content { white-space: pre-wrap; } // Allow long lines to wrap
}

.cmr__mermaid-status {
  font-style: italic;
  text-align: center;
  padding: 1rem;
  &--empty { color: var(--color-text-muted); }
  &--loading {
    min-height: 80px; display: flex; align-items: center; justify-content: center;
    &::before { /* Basic spinner */
      content: ''; display: block; width: 24px; height: 24px;
      border: 3px solid hsla(var(--color-accent-primary-h),var(--color-accent-primary-s),var(--color-accent-primary-l),0.2);
      border-top-color: var(--color-accent-primary);
      border-radius: 50%; animation: cmr-spin 0.7s linear infinite;
    }
  }
  &--error {
    color: var(--color-error-text, red);
    background-color: hsla(var(--color-error-h),var(--color-error-s),var(--color-error-l), 0.1);
    border: 1px solid hsla(var(--color-error-h),var(--color-error-s),var(--color-error-l), 0.3);
    border-radius: var(--radius-sm);
    .cmr__error-title { font-weight: bold; margin-bottom: 0.25rem; }
    .cmr__error-message { font-size: 0.85em; }
    .cmr__error-code-preview {
      margin-top: 0.5rem; padding: 0.25rem 0.5rem;
      background-color: hsla(var(--color-text-primary-h),var(--color-text-primary-s),var(--color-text-primary-l),0.05);
      border-radius: var(--radius-xs); font-size: 0.7em;
      max-height: 60px; overflow-y: auto; text-align: left;
      white-space: pre-wrap;
    }
  }
}

.cmr__status-text {
    padding: 1rem; text-align: center;
    &--empty { color: var(--color-text-muted); font-style: italic; }
}

// Ensure prose styles from global scope apply correctly.
// If using Tailwind Typography, :deep(.prose) might be needed on the v-html container.
// For direct styling:
.cmr__content-area :deep(h1),
.cmr__content-area :deep(h2),
.cmr__content-area :deep(h3),
.cmr__content-area :deep(h4) {
  margin-top: calc(1.2em * var(--content-font-scale, 1));
  margin-bottom: calc(0.6em * var(--content-font-scale, 1));
  line-height: 1.3;
  font-weight: 600;
  color: var(--color-text-heading, var(--color-text-primary));
}
.cmr__content-area :deep(p) {
  margin-bottom: calc(1em * var(--content-font-scale, 1));
}
.cmr__content-area :deep(ul), .cmr__content-area :deep(ol) {
  margin-bottom: calc(1em * var(--content-font-scale, 1));
  padding-left: calc(1.5em * var(--content-font-scale, 1));
}
.cmr__content-area :deep(li) {
  margin-bottom: calc(0.5em * var(--content-font-scale, 1));
}
.cmr__content-area :deep(a) {
  color: var(--color-text-accent, hsl(var(--color-accent-primary-h), var(--color-accent-primary-s), var(--color-accent-primary-l)));
  text-decoration: underline;
  &:hover { opacity: 0.8; }
}
.cmr__content-area :deep(blockquote) {
  border-left: 3px solid var(--color-accent-secondary, #ccc);
  padding-left: calc(1em * var(--content-font-scale, 1));
  margin-left: 0;
  margin-right: 0;
  font-style: italic;
  color: var(--color-text-secondary);
}

</style>