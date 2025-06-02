// File: frontend/src/components/CompactMessageRendererTypes.ts
/**
 * @file CompactMessageRendererTypes.ts
 * @description Type definitions for the CompactMessageRenderer component and its composable.
 * @version 1.0.1 - Cleaned up, no autoplayRemainingTimeText computed prop.
 */

import type { Ref, ComputedRef } from 'vue';
import type { MarkedOptions as OriginalMarkedOptions } from 'marked'; // Ensure this path is correct based on your setup

/**
 * @interface Slide
 * @description Represents a single slide in a slideshow presentation.
 */
export interface Slide {
  id: string;
  title: string;
  rawContent: string;
  htmlContent: string;
  diagramMermaidCode?: string;
  slideType: 'intro' | 'concept' | 'code' | 'diagram' | 'analysis' | 'summary' | 'general';
  estimatedReadingTimeMs: number;
}

/**
 * @interface ComplexityDetails
 * @description Stores time and space complexity.
 */
export interface ComplexityDetails {
  time?: string;
  space?: string;
  explanation?: string;
}

/**
 * @interface ContentAnalysisResult
 * @description Holds metadata about the analyzed content.
 */
export interface ContentAnalysisResult {
  contentType: 'leetcode' | 'systemDesign' | 'concept' | 'general' | 'unknown';
  displayTitle: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  complexity?: ComplexityDetails;
  approach?: string;
  estimatedTotalReadingTimeMs: number;
  shouldCreateSlideshow: boolean;
  diagramCount: number;
  hasCodeBlocks: boolean;
}

/**
 * @interface EnhancedMarkedOptions
 * @description Extends Marked's options for custom highlighting.
 */
export interface EnhancedMarkedOptions extends OriginalMarkedOptions {
  highlight?: (code: string, lang: string) => string;
}

/**
 * @interface NonSlideDiagram
 * @description Represents a Mermaid diagram found in non-slideshow content.
 */
export interface NonSlideDiagram {
  id: string;
  mermaidCode: string;
  renderedHtml?: string;
}

/**
 * @interface CompactMessageRendererState
 * @description Defines the reactive state for the composable.
 */
export interface CompactMessageRendererState {
  isLoadingContent: Ref<boolean>;
  analyzedContent: Ref<ContentAnalysisResult | null>;
  slides: Ref<Slide[]>;
  currentSlideIndex: Ref<number>;
  nonSlideDiagrams: Ref<NonSlideDiagram[]>; // For diagrams in single-view mode
  
  isAutoplayActive: Ref<boolean>;
  isAutoplayEffectivelyPaused: Ref<boolean>;
  autoplayProgress: Ref<number>; // 0-100
  currentSlideTargetDurationMs: Ref<number>; // For autoplay timing
  currentSlideTimeElapsedMs: Ref<number>;   // For autoplay timing

  isComponentFullscreen: Ref<boolean>;
  currentContentFontScale: Ref<number>;
}

/**
 * @interface CompactMessageRendererComputeds
 * @description Defines computed properties for the composable.
 */
export interface CompactMessageRendererComputeds {
  isSlideshowMode: ComputedRef<boolean>;
  currentSlideData: ComputedRef<Slide | null>;
  totalSlides: ComputedRef<number>;
  overallProgressPercent: ComputedRef<number>; // Kept, as it's a useful computed value
  canGoNext: ComputedRef<boolean>;
  canGoPrev: ComputedRef<boolean>;
  currentMermaidTheme: ComputedRef<'dark' | 'default'>;
}

/**
 * @interface CompactMessageRendererActions
 * @description Defines actions for the composable.
 */
export interface CompactMessageRendererActions {
  processAndRenderContent(fullMarkdownContent: string, initialSlideIdx?: number): Promise<void>;
  navigateToSlide(index: number, source?: 'user' | 'autoplay' | 'init'): void;
  nextSlide(): void;
  prevSlide(): void;
  toggleInternalAutoplay(): void;
  pauseInternalAutoplay(): void;
  resumeInternalAutoplay(): void;
  toggleComponentFullscreen(): void;
  adjustFontSize(delta: number): void;
  copyAllCodeBlocks(rootElement: HTMLElement | null): Promise<void>;
  exportDiagrams(): { id: string, code?: string }[];
  exportSlidesContent(): { title: string, rawContent: string, diagram?: string }[];
  reRenderMermaidDiagrams(rootElement: HTMLElement | null): Promise<void>;
}

/**
 * @interface CompactMessageRendererExposedMethods
 * @description Methods exposed by the CompactMessageRenderer.vue component via defineExpose.
 */
export interface CompactMessageRendererPublicMethods {
  navigateToSlide: (index: number) => void;
  next: () => void;
  prev: () => void;
  pauseAutoplay: () => void;
  resumeAutoplay: () => void;
  toggleFullscreen: () => void;
  getCurrentSlideIndex: () => number;
  getTotalSlides: () => number;
}

/**
 * @interface CompactMessageRendererComposable
 * @description Complete type for the composable.
 */
export interface CompactMessageRendererComposable extends CompactMessageRendererState, CompactMessageRendererComputeds, CompactMessageRendererActions {
  contentDisplayRootRef: Ref<HTMLElement | null>;
}

export const DEFAULT_SLIDE_READING_TIME_MS = 10000;
export const MIN_SLIDE_DURATION_MS = 3000;
export const WORDS_PER_MINUTE_READING_SPEED = 180;