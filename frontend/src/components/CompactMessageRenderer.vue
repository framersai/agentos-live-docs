// File: frontend/src/components/CompactMessageRenderer.vue
/**
 * @file CompactMessageRenderer.vue
 * @description A versatile component for rendering Markdown content, potentially as a slideshow
 * with interactive controls, Mermaid diagram support, and code highlighting.
 * It is designed to be highly themeable and adaptable to different agent UIs.
 * @version 1.1.0 - Refined rendering logic, improved autoplay and diagram handling.
 */
<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount, type Component as VueComponentType } from 'vue';
import { marked, type MarkedOptions as OriginalMarkedOptions } from 'marked';
import mermaid from 'mermaid';
import hljs from 'highlight.js';
// Ensure a HLJS theme CSS is imported globally if you haven't already
// e.g., import 'highlight.js/styles/atom-one-dark.css'; // Or your preferred theme

import { themeManager } from '@/theme/ThemeManager'; // Assuming path is correct

import {
  ChevronLeftIcon, ChevronRightIcon, PlayIcon as PlaySolidIcon, PauseIcon as PauseSolidIcon, // Using solid for play/pause
  ArrowsPointingOutIcon, ArrowsPointingInIcon, DocumentDuplicateIcon, PhotoIcon,
  PresentationChartLineIcon, PlusIcon, MinusIcon, CodeBracketIcon,
  CpuChipIcon, LightBulbIcon,
} from '@heroicons/vue/24/solid'; // Changed to solid for consistency in controls

// --- Type Definitions ---
/**
 * @interface Slide
 * @description Represents a single slide in a slideshow presentation.
 */
interface Slide {
  /** Unique identifier for the slide. */
  id: string;
  /** The title of the slide, often derived from a heading. */
  title: string;
  /** The raw Markdown content of the slide. */
  rawContent: string;
  /** The HTML content rendered from rawContent. */
  htmlContent: string;
  /** Optional Mermaid diagram code specific to this slide. */
  diagram?: string;
  /** Categorization of the slide's content type. */
  type: 'intro' | 'concept' | 'code' | 'analysis' | 'summary' | 'general';
  /** Estimated reading time for this slide in seconds, used for autoplay. */
  readingTimeSeconds?: number;
}

/**
 * @interface ComplexityAnalysis
 * @description Stores time and space complexity details.
 */
interface ComplexityAnalysis {
  time?: string;
  space?: string;
  explanation?: string;
}

/**
 * @interface AnalysisResult
 * @description Holds metadata about the analyzed content, determining layout and features.
 */
interface AnalysisResult {
  /** The primary type of content (e.g., LeetCode problem, System Design). */
  type: 'leetcode' | 'systemDesign' | 'concept' | 'general';
  /** The main display title for the content block. */
  displayTitle: string;
  /** Optional difficulty level for problems. */
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  /** Optional complexity analysis. */
  complexity?: ComplexityAnalysis;
  /** Optional primary approach discussed. */
  approach?: string;
  /** Overall estimated reading time for the entire content. */
  estimatedTotalReadingTimeSeconds: number;
  /** Flag indicating if the content should be rendered as a slideshow. */
  shouldCreateSlides: boolean;
  /** Count of Mermaid diagrams found in the content. */
  diagramCount: number;
}

/**
 * @interface CustomMarkedOptions
 * @description Extends Marked's options to include custom highlighting.
 */
interface CustomMarkedOptions extends OriginalMarkedOptions {
  highlight?: (code: string, lang: string) => string;
}

// --- Component Props ---
const props = defineProps<{
  /** The full Markdown content string to be rendered. */
  content: string;
  /** A mode identifier (e.g., agent ID) to potentially influence styling or behavior. */
  mode: string;
  /** Optional default programming language for code blocks if not specified in fences. */
  language?: string;
  /** Optional 0-based index for the initially displayed slide in slideshow mode. */
  initialSlideIndex?: number;
  /** If true, this component's internal readingTime-based autoplay is disabled; parent controls timing via events. */
  disableInternalAutoplay?: boolean;
}>();

// --- Component Emits ---
const emit = defineEmits<{
  /** Emitted when the fullscreen toggle is activated. */
  (e: 'toggle-fullscreen'): void;
  /** Emitted for user interactions within the component (e.g., copy code, export). */
  (e: 'interaction', payload: { type: string; data?: any }): void;
  /** Emitted when the current slide changes (either manually or via autoplay). */
  (e: 'slide-changed', payload: { newIndex: number; totalSlides: number; navigatedManually: boolean }): void;
  /** Emitted when the internal autoplay state (playing/paused) changes. */
  (e: 'internal-autoplay-status-changed', payload: { isPlaying: boolean; isPaused: boolean }): void;
  /** Emitted after the main content (slides or single view) has been rendered/updated. */
  (e: 'rendered'): void;
}>();

// --- Reactive State & Refs ---
const slides = ref<Slide[]>([]);
const currentSlideInternalIndex = ref(0);

const isInternalAutoplayOn = ref(false);
const isInternalAutoplayEffectivelyPaused = ref(true); // Start paused

const autoPlayProgressBarValue = ref(0);
const currentSlideTargetDurationMs = ref(8000); // Default duration
const currentSlideTimeElapsedMs = ref(0);
let internalAutoplayTimeoutId: ReturnType<typeof setTimeout> | null = null;
let internalProgressIntervalId: ReturnType<typeof setInterval> | null = null;

const isComponentFullscreen = ref(false);
const analysisResultData = ref<AnalysisResult | null>(null);
const singleContentViewHtml = ref('');
const nonSlideDiagramsList = ref<{ id: string, code: string }[]>([]);

const contentDisplayRootRef = ref<HTMLElement | null>(null);
const slideDiagramContainerDivRef = ref<HTMLElement | null>(null); // For the diagram within the current slide

// --- Mermaid Configuration ---
const currentMermaidThemeName = computed(() => themeManager.getCurrentTheme().value?.isDark ? 'dark' : 'default');

// --- SVG Icon Strings for Dynamic Buttons ---
const SVG_ICON_COPY_STRING = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-xs"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>`;
const SVG_ICON_CHECK_STRING = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon-xs text-green-500 dark:text-green-400"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>`;

// --- Content Parsing Patterns & Marked.js Configuration ---
const contentBreakPatterns = {
  slide: /\n---\s*SLIDE_BREAK\s*---\n/i, // Case-insensitive for robustness
  codeBlock: /```([a-zA-Z0-9\-_#+.]*)\n([\s\S]*?)```/g, // Allow more lang chars like C#
  mermaidBlock: /```mermaid\n([\s\S]*?)\n```/g,
  mainHeading: /^\s*(?:#{1,3})\s+(.*)/, // H1, H2, or H3, allowing leading whitespace
};

const configuredMarkedOptions: CustomMarkedOptions = {
  breaks: true, gfm: true, pedantic: false,
  highlight: (code, lang) => {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    try {
      return hljs.highlight(code, { language, ignoreIllegals: true }).value;
    } catch (e) {
      console.warn(`Highlight.js error for lang ${lang}:`, e);
      return hljs.highlight(code, { language: 'plaintext', ignoreIllegals: true }).value;
    }
  },
};

// --- Computed Properties ---
const useSlideshowLayout = computed(() => analysisResultData.value?.shouldCreateSlides && slides.value.length > 0);
const currentDisplayedSlide = computed<Slide | null>(() => slides.value[currentSlideInternalIndex.value] || null);
const totalNumberOfSlides = computed(() => slides.value.length);
const overallReadingProgressPercent = computed(() => totalNumberOfSlides.value === 0 ? 0 : Math.round(((currentSlideInternalIndex.value + 1) / totalNumberOfSlides.value) * 100));

// --- Core Content Processing Logic ---

/**
 * Analyzes the provided Markdown content to determine its type, title, complexity,
 * and whether it should be rendered as a slideshow.
 * @param {string} content - The full Markdown content.
 * @returns {AnalysisResult} An object containing analysis metadata.
 */
const analyzeProvidedContent = (content: string): AnalysisResult => {
  const analysis: AnalysisResult = { type: 'general', displayTitle: 'Content Analysis', estimatedTotalReadingTimeSeconds: 0, shouldCreateSlides: false, diagramCount: 0, complexity: {} };
  const normalizedContent = content.toLowerCase();

  const lcKeywords = ['leetcode', 'algorithm', 'problem solving', 'coding challenge', 'data structure', 'two sum', 'array', 'string', 'linked list', 'tree', 'graph', 'dynamic programming', 'recursion', 'binary search'];
  const sdKeywords = ['system design', 'architecture', 'scalability', 'microservices', 'distributed system', 'database', 'api design', 'load balancer', 'caching'];

  if (lcKeywords.some(kw => normalizedContent.includes(kw)) || props.mode?.toLowerCase().includes('coding') || props.mode?.toLowerCase().includes('lc_audit')) {
    analysis.type = 'leetcode';
    analysis.displayTitle = 'Problem Breakdown';
    const diffMatch = content.match(/(?:Difficulty:\s*)?(Easy|Medium|Hard)\s*(?:Problem|Challenge)?/i);
    if (diffMatch) analysis.difficulty = diffMatch[1] as 'Easy' | 'Medium' | 'Hard';

    const timeComplexityMatch = content.match(/(?:Time Complexity|TC):\s*(O\([^\)]+\))/i);
    if (timeComplexityMatch) analysis.complexity!.time = timeComplexityMatch[1];
    const spaceComplexityMatch = content.match(/(?:Space Complexity|SC):\s*(O\([^\)]+\))/i);
    if (spaceComplexityMatch) analysis.complexity!.space = spaceComplexityMatch[1];

  } else if (sdKeywords.some(kw => normalizedContent.includes(kw)) || props.mode?.toLowerCase().includes('system')) {
    analysis.type = 'systemDesign';
    analysis.displayTitle = 'System Architecture Overview';
  }
  
  const firstHeadingMatch = content.match(contentBreakPatterns.mainHeading);
  if (firstHeadingMatch && firstHeadingMatch[1]) {
    analysis.displayTitle = firstHeadingMatch[1].trim();
  }

  analysis.diagramCount = (content.match(contentBreakPatterns.mermaidBlock) || []).length;
  analysis.estimatedTotalReadingTimeSeconds = Math.max(30, Math.ceil((content.split(/\s+/).length / 200) * 60)); // Approx 200 WPM

  const slideChunks = content.split(contentBreakPatterns.slide);
  // Decision for slideshow: if mode is specifically lc-audit, OR multiple slide breaks, OR specific content types with length/diagrams
  analysis.shouldCreateSlides = props.mode === 'lc_audit_aide' ||
                                slideChunks.length > 1 ||
                                (analysis.type === 'leetcode' && (content.length > 800 || analysis.diagramCount > 0)) ||
                                (analysis.type === 'systemDesign' && (content.length > 500 || analysis.diagramCount > 0)) ||
                                (analysis.diagramCount > 1); // Multiple diagrams usually benefit from slides
  return analysis;
};

/**
 * Formats a raw code block string (including fences) into an enhanced HTML structure
 * with syntax highlighting, line numbers, and a copy button.
 * @param {string} rawCodeBlockMatch - The full matched code block string (e.g., "```python\ncode\n```").
 * @returns {string} The HTML string for the enhanced code block.
 */
const formatCodeForDisplay = (rawCodeBlockMatch: string): string => {
  const langMatch = rawCodeBlockMatch.match(/^```([a-zA-Z0-9\-_#+.]*)\n/);
  const lang = langMatch && langMatch[1] ? langMatch[1].toLowerCase() : props.language || 'plaintext';
  let code = rawCodeBlockMatch.replace(/^```[a-zA-Z0-9\-_#+.]*\n?/, '').replace(/\n```$/, '');

  // Basic unescaping for common entities that might be double-escaped by LLM
  code = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  
  // Ensure newline consistency, especially for empty lines, before splitting
  code = code.replace(/\r\n/g, '\n'); 
  const highlightedHtml = configuredMarkedOptions.highlight!(code, lang);
  
  const lines = highlightedHtml.split('\n');
  const numberedLinesHtml = lines.map((line, index) =>
    // Ensure content even for empty lines to maintain structure
    `<span class="line-number-ephemeral">${index + 1}</span><span class="line-content-ephemeral">${line || ' '}</span>`
  ).join('\n'); // Rejoin with \n which pre will respect

  return `
    <div class="enhanced-code-block-ephemeral" data-lang="${lang}" data-raw-code="${encodeURIComponent(code)}">
      <div class="code-header-ephemeral">
        <span class="code-language-tag-ephemeral">${lang}</span>
        <button class="copy-code-button-placeholder btn btn-xs btn-ghost-ephemeral" title="Copy code" aria-label="Copy code snippet">
          ${SVG_ICON_COPY_STRING}
        </button>
      </div>
      <pre><code class="language-${lang} hljs">${numberedLinesHtml}</code></pre>
    </div>`;
};

/**
 * Parses the full Markdown content into an array of Slide objects.
 * Extracts titles, Mermaid diagrams, and determines slide types.
 * @param {string} fullMarkdownContent - The entire Markdown string.
 * @returns {Slide[]} An array of parsed slide objects.
 */
const parseContentToSlides = (fullMarkdownContent: string): Slide[] => {
  if (!fullMarkdownContent || !fullMarkdownContent.trim()) return [];
  const slideMarkdownChunks = fullMarkdownContent.split(contentBreakPatterns.slide);
  
  return slideMarkdownChunks.map((chunk, index) => {
    let title = `Slide ${index + 1}`;
    let slideType: Slide['type'] = 'general';
    let mainContentMarkdown = chunk.trim();

    const headingMatch = mainContentMarkdown.match(contentBreakPatterns.mainHeading);
    if (headingMatch && headingMatch[1]) {
      title = headingMatch[1].trim();
      mainContentMarkdown = mainContentMarkdown.replace(headingMatch[0], '').trim(); // Remove heading from main content
    }

    let diagramCode: string | undefined = undefined;
    const MERMAID_SLIDE_PLACEHOLDER = '';
    // Temporarily remove mermaid blocks before general markdown processing to handle them separately
    let tempContentForMarked = mainContentMarkdown.replace(contentBreakPatterns.mermaidBlock, (match, p1) => {
      if (!diagramCode) diagramCode = p1.trim(); // Capture first mermaid block for the slide
      return MERMAID_SLIDE_PLACEHOLDER; // Keep a placeholder
    });

    const contentWithEnhancedCode = tempContentForMarked.replace(contentBreakPatterns.codeBlock, (match) => formatCodeForDisplay(match));
    let htmlContent = marked.parse(contentWithEnhancedCode, configuredMarkedOptions);
    if (diagramCode) {
        htmlContent = htmlContent.replace(MERMAID_SLIDE_PLACEHOLDER, `<div class="mermaid-diagram-slide-wrapper"></div>`);
    } else {
        htmlContent = htmlContent.replace(MERMAID_SLIDE_PLACEHOLDER, ''); // Remove placeholder if no diagram
    }


    const readingTimeSeconds = Math.max(5, Math.ceil((mainContentMarkdown.split(/\s+/).length / 180) * 60));

    // Determine slide type
    if (index === 0 && slideMarkdownChunks.length > 1) slideType = 'intro';
    else if (diagramCode) slideType = 'analysis'; // Prioritize if diagram exists
    else if (contentWithEnhancedCode.includes('class="enhanced-code-block-ephemeral"')) slideType = 'code';
    else if (index === slideMarkdownChunks.length - 1 && slideMarkdownChunks.length > 1 && mainContentMarkdown.length > 100) slideType = 'summary';
    else slideType = 'concept';

    return { id: `slide-${index}-${Date.now()}`, title, rawContent: chunk, htmlContent, diagram: diagramCode, type: slideType, readingTimeSeconds };
  }).filter(slide => slide.htmlContent.trim() !== '' || slide.diagram); // Filter out completely empty slides
};


/**
 * Initializes or updates the component's content based on the `props.content`.
 * Analyzes content, parses slides if needed, and sets up initial rendering.
 * @async
 */
const initializeOrUpdateContent = async () => {
  clearInternalAutoplayStates();
  if (!props.content || !props.content.trim()) {
    slides.value = [];
    singleContentViewHtml.value = '<p class="text-slate-500 dark:text-slate-400 p-4 italic">No content provided.</p>';
    analysisResultData.value = null;
    emit('rendered');
    return;
  }
  analysisResultData.value = analyzeProvidedContent(props.content);

  if (useSlideshowLayout.value) {
    slides.value = parseContentToSlides(props.content);
    const initialIdx = props.initialSlideIndex && props.initialSlideIndex < slides.value.length ? props.initialSlideIndex : 0;
    currentSlideInternalIndex.value = slides.value.length > 0 ? Math.min(initialIdx, slides.value.length -1) : 0;

    if (slides.value.length > 0) {
      await nextTick();
      renderCurrentSlideMermaidDiagram(); // Render for initial slide
      if (contentDisplayRootRef.value) addAllCopyButtonListeners(contentDisplayRootRef.value);
      
      emit('slide-changed', { newIndex: currentSlideInternalIndex.value, totalSlides: totalNumberOfSlides.value, navigatedManually: false });
      
      if (!props.disableInternalAutoplay && slides.value.length > 1) {
        isInternalAutoplayOn.value = true;
        isInternalAutoplayEffectivelyPaused.value = false;
        startOrResumeInternalAutoplay(true); // Pass true to indicate it's a new slideshow setup
      } else {
        isInternalAutoplayOn.value = false;
        isInternalAutoplayEffectivelyPaused.value = true;
      }
      emit('internal-autoplay-status-changed', {isPlaying: isInternalAutoplayOn.value && !isInternalAutoplayEffectivelyPaused.value, isPaused: isInternalAutoplayEffectivelyPaused.value });
    } else { // No valid slides parsed, fallback to single view
        analysisResultData.value.shouldCreateSlides = false; // Force single view
        initializeOrUpdateContent(); // Re-run with slideshow disabled
        return;
    }
  } else { // Single content view
    slides.value = [];
    let tempContent = props.content;
    const diagramMatches = [...tempContent.matchAll(contentBreakPatterns.mermaidBlock)];
    nonSlideDiagramsList.value = diagramMatches.map((match, i) => ({ id: `nsd-${Date.now()}-${i}`, code: match[1].trim() }));
    
    let placeholderIndex = 0;
    tempContent = tempContent.replace(contentBreakPatterns.mermaidBlock, () => {
      const diagramId = nonSlideDiagramsList.value[placeholderIndex]?.id || `nsd-fallback-${placeholderIndex}`;
      placeholderIndex++;
      // This placeholder will be targeted by renderAllNonSlideMermaidDiagrams
      return `<div class="mermaid-diagram-placeholder" data-diagram-id="${diagramId}"></div>`;
    });
    tempContent = tempContent.replace(contentBreakPatterns.codeBlock, (match) => formatCodeForDisplay(match));
    singleContentViewHtml.value = marked.parse(tempContent, configuredMarkedOptions);
    
    await nextTick();
    renderAllNonSlideMermaidDiagrams();
    if (contentDisplayRootRef.value) addAllCopyButtonListeners(contentDisplayRootRef.value);
  }
  emit('rendered');
};

// --- Diagram Rendering ---
const initializeMermaidConfig = () => {
  mermaid.initialize({
    startOnLoad: false, // We call mermaid.run() or mermaid.render() manually
    theme: currentMermaidThemeName.value,
    securityLevel: 'loose', // Or 'strict' if preferred, ensure compatibility
    fontSize: isComponentFullscreen.value ? 16 : 14,
    flowchart: { useMaxWidth: !isComponentFullscreen.value, htmlLabels: true },
    // Add other themeVariables or specific diagram configs if needed
    // themeVariables: {
    //   primaryColor: currentMermaidThemeName.value === 'dark' ? '#BB86FC' : '#6200EE',
    //   // ... other vars
    // }
  });
};

const renderSingleMermaidDiagram = async (container: HTMLElement, diagramCode: string, diagramId: string) => {
  if (!container || !diagramCode.trim()) {
    container.innerHTML = '<p class="text-xs italic text-slate-500">(No diagram content)</p>';
    return;
  }
  container.innerHTML = '<div class="diagram-loading-spinner"></div>'; // Placeholder for loading
  await nextTick();
  try {
    initializeMermaidConfig(); // Re-initialize with current theme/settings before each render
    // Ensure diagramId is valid for mermaid.render (must start with a letter)
    const validDiagramId = `mermaid-${diagramId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
    const { svg, bindFunctions } = await mermaid.render(validDiagramId, diagramCode);
    container.innerHTML = svg;
    if (bindFunctions) bindFunctions(container);
  } catch (error: any) {
    console.error(`Error rendering Mermaid diagram (ID: ${diagramId}):`, error.str || error.message, error);
    container.innerHTML = `<div class="render-error-ephemeral"><p class="error-title">Diagram Error</p><p class="text-xs">${error.str || error.message}</p><pre class="text-xxs overflow-auto p-1 bg-black/20 rounded max-h-20">${diagramCode.substring(0,150)}...</pre></div>`;
  }
};

const renderCurrentSlideMermaidDiagram = () => {
  const slide = currentDisplayedSlide.value;
  const diagramContainer = slideDiagramContainerDivRef.value; // Use the direct ref

  if (slide?.diagram && diagramContainer) {
    renderSingleMermaidDiagram(diagramContainer as HTMLElement, slide.diagram, `slide-diag-${slide.id}`);
  } else if (diagramContainer) {
    (diagramContainer as HTMLElement).innerHTML = ''; // Clear if no diagram for this slide
  }
};

const renderAllNonSlideMermaidDiagrams = () => {
  nonSlideDiagramsList.value.forEach(diag => {
    if (contentDisplayRootRef.value) {
      const placeholder = contentDisplayRootRef.value.querySelector(`.mermaid-diagram-placeholder[data-diagram-id="${diag.id}"]`);
      if (placeholder) {
        renderSingleMermaidDiagram(placeholder as HTMLElement, diag.code, diag.id);
      }
    }
  });
};

// --- Code Block Copy Button Logic ---
const addAllCopyButtonListeners = (containerElement: HTMLElement) => {
  containerElement.querySelectorAll('.copy-code-button-placeholder').forEach(buttonEl => {
    const button = buttonEl as HTMLElement;
    if (button.dataset.listenerAttached === 'true') return; // Avoid attaching multiple listeners

    const codeBlockWrapper = button.closest('.enhanced-code-block-ephemeral');
    if (!codeBlockWrapper) return;

    const rawCode = decodeURIComponent(codeBlockWrapper.getAttribute('data-raw-code') || '');
    if (!rawCode) return;

    button.addEventListener('click', async (event) => {
      event.stopPropagation(); // Prevent other click events if nested
      try {
        await navigator.clipboard.writeText(rawCode);
        button.innerHTML = SVG_ICON_CHECK_STRING; // Show checkmark
        emit('interaction', { type: 'toast', data: { type: 'success', title: 'Code Copied!', duration: 2000 } });
        setTimeout(() => { button.innerHTML = SVG_ICON_COPY_STRING; }, 2000); // Revert to copy icon
      } catch (err) {
        console.error('Failed to copy code:', err);
        emit('interaction', { type: 'toast', data: { type: 'error', title: 'Copy Failed', message: 'Could not copy code to clipboard.' } });
      }
    });
    button.dataset.listenerAttached = 'true'; // Mark as attached
  });
};

// --- Slideshow Navigation & Autoplay Control ---
const navigateToSlide = (index: number, fromAutoplay: boolean = false) => {
  if (index >= 0 && index < totalNumberOfSlides.value && currentSlideInternalIndex.value !== index) {
    currentSlideInternalIndex.value = index;

    if (!fromAutoplay) { // Manual navigation
      isInternalAutoplayOn.value = false; // User took control, turn off autoplay intent
      isInternalAutoplayEffectivelyPaused.value = true;
      clearInternalAutoplayStates();
      emit('slide-changed', { newIndex: currentSlideInternalIndex.value, totalSlides: totalNumberOfSlides.value, navigatedManually: true });
      emit('internal-autoplay-status-changed', {isPlaying: false, isPaused: true });
    } else { // Navigation by internal autoplay
      emit('slide-changed', { newIndex: currentSlideInternalIndex.value, totalSlides: totalNumberOfSlides.value, navigatedManually: false });
    }
    
    // If autoplay is still on (even if paused temporarily by manual nav, the intent might be to resume)
    // and this component is not disabled from internal autoplay, reset for the new slide.
    if (isInternalAutoplayOn.value && !props.disableInternalAutoplay) {
        resetInternalAutoplayForNewSlide();
    }
  } else if (index >= 0 && index < totalNumberOfSlides.value && currentSlideInternalIndex.value === index && !fromAutoplay) {
    // If clicking current slide dot (manual action on current slide), explicitly pause autoplay
    isInternalAutoplayOn.value = false; 
    isInternalAutoplayEffectivelyPaused.value = true;
    clearInternalAutoplayStates();
    emit('internal-autoplay-status-changed', {isPlaying: false, isPaused: true });
  }
};
const next = () => { navigateToSlide(currentSlideInternalIndex.value + 1, false); };
const prev = () => { navigateToSlide(currentSlideInternalIndex.value - 1, false); };

const clearInternalAutoplayStates = () => {
  if (internalAutoplayTimeoutId) clearTimeout(internalAutoplayTimeoutId);
  if (internalProgressIntervalId) clearInterval(internalProgressIntervalId);
  internalAutoplayTimeoutId = null;
  internalProgressIntervalId = null;
  autoPlayProgressBarValue.value = 0;
  currentSlideTimeElapsedMs.value = 0;
};

const startOrResumeInternalAutoplay = (isStartingNewSlideshow: boolean = false) => {
  if (props.disableInternalAutoplay) {
    isInternalAutoplayOn.value = false; // Ensure it's off if disabled
    isInternalAutoplayEffectivelyPaused.value = true;
    emit('internal-autoplay-status-changed', {isPlaying: false, isPaused: true });
    return;
  }
  // Don't start if no slides, or on last slide (unless starting a new show which would reset index)
  if (slides.value.length <= 1 || (currentSlideInternalIndex.value >= slides.value.length - 1 && !isStartingNewSlideshow)) {
    isInternalAutoplayOn.value = false; 
    isInternalAutoplayEffectivelyPaused.value = true;
    clearInternalAutoplayStates();
    emit('internal-autoplay-status-changed', {isPlaying: false, isPaused: true });
    return;
  }

  isInternalAutoplayOn.value = true; // Intent is on
  isInternalAutoplayEffectivelyPaused.value = false; // Actively playing/timing
  emit('internal-autoplay-status-changed', {isPlaying: true, isPaused: false });

  const slideData = slides.value[currentSlideInternalIndex.value];
  currentSlideTargetDurationMs.value = Math.max(3000, (slideData?.readingTimeSeconds || 10) * 1000); 
  
  if(isStartingNewSlideshow) { // If it's a brand new slideshow, always reset elapsed time
    currentSlideTimeElapsedMs.value = 0;
  }
  
  autoPlayProgressBarValue.value = Math.min(100, (currentSlideTimeElapsedMs.value / currentSlideTargetDurationMs.value) * 100);
  // Clear previous timers before setting new ones
  if (internalAutoplayTimeoutId) clearTimeout(internalAutoplayTimeoutId);
  if (internalProgressIntervalId) clearInterval(internalProgressIntervalId);

  const timeRemainingMs = currentSlideTargetDurationMs.value - currentSlideTimeElapsedMs.value;

  if (timeRemainingMs > 0) {
    internalAutoplayTimeoutId = setTimeout(() => {
      if (isInternalAutoplayOn.value && !isInternalAutoplayEffectivelyPaused.value) {
        navigateToSlide(currentSlideInternalIndex.value + 1, true); // fromAutoplay = true
      }
    }, timeRemainingMs);

    internalProgressIntervalId = setInterval(() => {
      if (!isInternalAutoplayOn.value || isInternalAutoplayEffectivelyPaused.value) { // Stop if paused or turned off
        clearInternalAutoplayStates(); // This clears the interval
        return;
      }
      currentSlideTimeElapsedMs.value += 100;
      autoPlayProgressBarValue.value = Math.min(100, (currentSlideTimeElapsedMs.value / currentSlideTargetDurationMs.value) * 100);
      if (currentSlideTimeElapsedMs.value >= currentSlideTargetDurationMs.value) {
        if(internalProgressIntervalId) clearInterval(internalProgressIntervalId); // Interval self-clears when done
      }
    }, 100);
  } else if (currentSlideInternalIndex.value < slides.value.length - 1) { // Duration was 0 or negative, but not last slide
    navigateToSlide(currentSlideInternalIndex.value + 1, true); // Advance immediately
  } else { // Duration was 0 or negative, AND it's the last slide
    isInternalAutoplayOn.value = false; // Turn off autoplay intent
    isInternalAutoplayEffectivelyPaused.value = true;
    emit('internal-autoplay-status-changed', {isPlaying: false, isPaused: true });
  }
};

const pauseInternalAutoplayHandler = () => { 
  isInternalAutoplayEffectivelyPaused.value = true; // isInternalAutoplayOn (intent) remains true
  clearInternalAutoplayStates();
  emit('internal-autoplay-status-changed', {isPlaying: false, isPaused: true });
};

const resumeInternalAutoplayHandler = () => { 
    if (isInternalAutoplayOn.value) { // Only resume if autoplay intent is still on
        isInternalAutoplayEffectivelyPaused.value = false;
        startOrResumeInternalAutoplay(false); // false means it's not a brand new slideshow load
    }
};

const toggleInternalAutoplayAndPause = () => {
    if (isInternalAutoplayOn.value && !isInternalAutoplayEffectivelyPaused.value) { // Currently playing
        pauseInternalAutoplayHandler();
    } else { // Currently paused or off, so start/resume
        isInternalAutoplayOn.value = true; // Ensure intent is set to on
        resumeInternalAutoplayHandler();
    }
};

const resetInternalAutoplayForNewSlide = () => {
  clearInternalAutoplayStates(); // Clear old timers/progress
  if (isInternalAutoplayOn.value && !props.disableInternalAutoplay && !isInternalAutoplayEffectivelyPaused.value) {
    currentSlideTimeElapsedMs.value = 0; // Reset elapsed time for the new slide
    autoPlayProgressBarValue.value = 0;
    startOrResumeInternalAutoplay(false); // Start timing for the new slide
  }
};

// --- Utility Getters for Template ---
const getAnalysisIcon = (): VueComponentType => (analysisResultData.value?.type === 'leetcode' ? CodeBracketIcon : analysisResultData.value?.type === 'systemDesign' ? CpuChipIcon : LightBulbIcon);
const getAnalysisBannerClass = () => `banner-type-${analysisResultData.value?.type || 'general'}`;
const getDifficultyClass = () => `difficulty-${analysisResultData.value?.difficulty?.toLowerCase() || 'unknown'}`;
const getComplexityClass = (complexityVal?: string): string => {
  if (!complexityVal) return 'unknown';
  const complexity = complexityVal.toLowerCase();
  if (complexity.includes('o(1)') || complexity.includes('o(log n)')) return 'good';
  if (complexity.includes('o(n log n)')) return 'fair';
  if (complexity.includes('o(n)') && !complexity.includes('log n') && !complexity.includes('^') && !complexity.includes('²')) return 'fair';
  if (complexity.includes('o(n^2)') || complexity.includes('o(n²)') || complexity.includes('o(2^n)') || complexity.includes('o(n!)')) return 'poor';
  return 'unknown';
};

// --- Action Handlers for Toolbar ---
const adjustFontSizeHandler = (delta: number) => {
  const rootEl = contentDisplayRootRef.value || document.documentElement;
  const currentScale = parseFloat(getComputedStyle(rootEl).getPropertyValue('--content-font-scale') || '1');
  const newScale = Math.max(0.5, Math.min(2.5, currentScale + (delta * 0.1))); // Max 2.5x
  rootEl.style.setProperty('--content-font-scale', newScale.toString());
  emit('interaction', {type: 'adjustFontSize', data: { delta, currentScale: newScale }});
};
const toggleFullscreenHandler = () => { isComponentFullscreen.value = !isComponentFullscreen.value; emit('toggle-fullscreen'); };
const copyAllCode = async () => {
  if (!contentDisplayRootRef.value) return;
  const codeElements = contentDisplayRootRef.value.querySelectorAll('.enhanced-code-block-ephemeral[data-raw-code]');
  if (codeElements.length === 0) {
    emit('interaction', { type: 'toast', data: { type: 'info', title: 'No Code Found', message: 'There are no code blocks to copy.', duration: 2000 } });
    return;
  }
  let allCode = '';
  codeElements.forEach(el => {
    const rawCode = decodeURIComponent(el.getAttribute('data-raw-code') || '');
    const lang = el.getAttribute('data-lang') || 'code';
    allCode += `// ----- ${lang} -----\n${rawCode}\n// ----- END ${lang} -----\n\n`;
  });
  try {
    await navigator.clipboard.writeText(allCode.trim());
    emit('interaction', { type: 'toast', data: { type: 'success', title: 'All Code Copied!', message: `${codeElements.length} code block(s) copied.`, duration: 2500 } });
  } catch (err) {
    console.error('Failed to copy all code:', err);
    emit('interaction', { type: 'toast', data: { type: 'error', title: 'Copy Failed', message: 'Could not copy all code blocks.' } });
  }
};
const exportDiagrams = () => {
  const diagramsToExport: { id: string, code?: string }[] = [];
  if (useSlideshowLayout.value) {
    slides.value.forEach(slide => { if (slide.diagram) diagramsToExport.push({ id: slide.id, code: slide.diagram }); });
  } else {
    nonSlideDiagramsList.value.forEach(diag => diagramsToExport.push({ id: diag.id, code: diag.code }));
  }
  if (diagramsToExport.length === 0) {
    emit('interaction', { type: 'toast', data: { type: 'info', title: 'No Diagrams', message: 'No diagrams available for export.', duration: 2000 } });
    return;
  }
  emit('interaction', {type: 'export', data: { type: 'diagrams', items: diagramsToExport }});
};
const exportSlides = () => {
  if (!useSlideshowLayout.value || slides.value.length === 0) {
    emit('interaction', { type: 'toast', data: { type: 'info', title: 'No Slides', message: 'No slides available for export.', duration: 2000 } });
    return;
  }
  emit('interaction', {type: 'export', data: { type: 'slides', items: slides.value.map(s => ({ title: s.title, rawContent: s.rawContent, diagram: s.diagram })) }});
};

// --- Watchers & Lifecycle Hooks ---
watch(() => props.content, (newContent, oldContent) => {
  if (newContent !== oldContent || !analysisResultData.value) { // Process if content changes or not yet analyzed
    currentSlideInternalIndex.value = props.initialSlideIndex && props.initialSlideIndex >=0 ? props.initialSlideIndex : 0;
    initializeOrUpdateContent();
  }
}, { immediate: true });

watch(currentSlideInternalIndex, async (newIndex, oldIndex) => {
  if (newIndex !== oldIndex && useSlideshowLayout.value) {
    await nextTick();
    renderCurrentSlideMermaidDiagram();
    if (contentDisplayRootRef.value) {
      addAllCopyButtonListeners(contentDisplayRootRef.value); // Re-attach for new slide content
      const slideWrapper = contentDisplayRootRef.value.querySelector('.slide-content-wrapper-ephemeral') as HTMLElement;
      if(slideWrapper) slideWrapper.focus({ preventScroll: true }); // For accessibility focus
    }
  }
});

watch(isComponentFullscreen, async () => { 
  await nextTick();
  initializeMermaidConfig(); 
  if (useSlideshowLayout.value) renderCurrentSlideMermaidDiagram();
  else renderAllNonSlideMermaidDiagrams();
});
watch(currentMermaidThemeName, async () => { 
  await nextTick();
  initializeMermaidConfig();
  if (useSlideshowLayout.value) renderCurrentSlideMermaidDiagram();
  else renderAllNonSlideMermaidDiagrams();
});

onMounted(() => {
  const rootEl = contentDisplayRootRef.value || document.documentElement;
  if (!getComputedStyle(rootEl).getPropertyValue('--content-font-scale')) {
    rootEl.style.setProperty('--content-font-scale', '1');
  }
  // Initial Mermaid setup if diagrams are present in initial content
  if (analysisResultData.value?.diagramCount && analysisResultData.value.diagramCount > 0) {
      if (useSlideshowLayout.value) renderCurrentSlideMermaidDiagram();
      else renderAllNonSlideMermaidDiagrams();
  }
});
onBeforeUnmount(() => { clearInternalAutoplayStates(); });

// --- Expose API for Parent Control (if disableInternalAutoplay is true) ---
defineExpose({
  navigateToSlide: (index: number) => navigateToSlide(index, false), // Manual navigation by parent
  next: () => next(), // Manual next by parent
  prev: () => prev(), // Manual prev by parent
  getCurrentSlideIndex: () => currentSlideInternalIndex.value,
  getTotalSlides: () => totalNumberOfSlides.value,
  pauseInternalAutoplay: pauseInternalAutoplayHandler, // Allow parent to pause component's autoplay
  resumeInternalAutoplay: resumeInternalAutoplayHandler, // Allow parent to resume
  toggleFullscreen: toggleFullscreenHandler,
});

</script>

<template>
  <div class="compact-message-renderer-ephemeral" ref="contentDisplayRootRef" :class="{
    'fullscreen': isComponentFullscreen,
    'slideshow-active': useSlideshowLayout,
    [`analysis-type-${analysisResultData?.type || 'general'}`]: true
  }">
    <div v-if="analysisResultData" class="analysis-banner-ephemeral" :class="getAnalysisBannerClass()">
        <div class="info-group-ephemeral">
          <component :is="getAnalysisIcon()" class="icon w-5 h-5 mr-1.5 shrink-0" />
          <span class="title-text-ephemeral font-semibold">{{ analysisResultData.displayTitle }}</span>
          <span v-if="analysisResultData.difficulty" class="difficulty-badge-ephemeral" :class="getDifficultyClass()">
            {{ analysisResultData.difficulty }}
          </span>
        </div>
        <div class="meta-group-ephemeral text-xs">
          <span v-if="analysisResultData.estimatedTotalReadingTimeSeconds > 0">~{{ Math.ceil(analysisResultData.estimatedTotalReadingTimeSeconds / 60) }} min read</span>
          <span v-if="analysisResultData.complexity?.time" :class="['complexity-tag-ephemeral', 'time', getComplexityClass(analysisResultData.complexity.time)]">Time: {{ analysisResultData.complexity.time }}</span>
          <span v-if="analysisResultData.complexity?.space" :class="['complexity-tag-ephemeral', 'space', getComplexityClass(analysisResultData.complexity.space)]">Space: {{ analysisResultData.complexity.space }}</span>
        </div>
      </div>

    <div v-if="useSlideshowLayout && slides.length > 0" class="slideshow-container-ephemeral">
      <div class="slideshow-header-ephemeral">
        <div class="slide-info-ephemeral truncate">
          <h3 class="slide-title-text truncate" :title="currentDisplayedSlide?.title">{{ currentDisplayedSlide?.title || `Slide ${currentSlideInternalIndex + 1}` }}</h3>
          <div class="slide-meta-ephemeral">
            <span class="slide-counter">Slide {{ currentSlideInternalIndex + 1 }} / {{ totalNumberOfSlides }}</span>
            <span class="reading-progress ml-2">{{ overallReadingProgressPercent }}%</span>
          </div>
        </div>
        <div class="slide-controls-ephemeral">
          <button @click="prev" :disabled="currentSlideInternalIndex === 0" class="control-button-ephemeral" title="Previous Slide" aria-label="Previous Slide"><ChevronLeftIcon class="icon" /></button>
          <button 
            v-if="!disableInternalAutoplay && totalNumberOfSlides > 1" 
            @click="toggleInternalAutoplayAndPause" 
            class="control-button-ephemeral" 
            :title="isInternalAutoplayOn && !isInternalAutoplayEffectivelyPaused ? 'Pause Autoplay' : 'Start/Resume Autoplay'" 
            :aria-pressed="isInternalAutoplayOn && !isInternalAutoplayEffectivelyPaused">
            <PauseSolidIcon v-if="isInternalAutoplayOn && !isInternalAutoplayEffectivelyPaused" class="icon" />
            <PlaySolidIcon v-else class="icon" />
          </button>
          <button @click="next" :disabled="currentSlideInternalIndex >= totalNumberOfSlides - 1" class="control-button-ephemeral" title="Next Slide" aria-label="Next Slide"><ChevronRightIcon class="icon" /></button>
          <button @click="toggleFullscreenHandler" class="control-button-ephemeral ml-2" title="Toggle Fullscreen" aria-label="Toggle Fullscreen View">
            <ArrowsPointingOutIcon v-if="!isComponentFullscreen" class="icon" />
            <ArrowsPointingInIcon v-else class="icon" />
          </button>
        </div>
      </div>

      <div class="slide-content-wrapper-ephemeral" :key="currentDisplayedSlide?.id || `slide-empty`" tabindex="-1" role="region" :aria-label="`Slide content: ${currentDisplayedSlide?.title || 'Current slide'}`" aria-live="polite">
        <div :class="['slide-content-inner-ephemeral', currentDisplayedSlide?.type ? `type-${currentDisplayedSlide.type}-slide` : '', isComponentFullscreen ? 'fullscreen-slide-content' : '']" v-html="currentDisplayedSlide?.htmlContent"></div>
        <div v-if="currentDisplayedSlide?.diagram" class="slide-diagram-ephemeral">
          <div class="diagram-container-inner">
                          <div ref="slideDiagramContainerDivRef" class="mermaid-diagram mermaid-diagram-slide-wrapper">
              </div>
          </div>
        </div>
      </div>

      <div v-if="isInternalAutoplayOn && !disableInternalAutoplay && totalNumberOfSlides > 1" class="autoplay-progress-bar-ephemeral">
        <div class="progress-track"><div class="progress-fill-animated" :style="{ width: `${autoPlayProgressBarValue}%` }"></div></div>
        <p v-if="!isInternalAutoplayEffectivelyPaused" class="progress-text-label">Auto-advancing in {{ Math.max(0, Math.ceil((currentSlideTargetDurationMs - currentSlideTimeElapsedMs) / 1000)) }}s</p>
        <p v-else class="progress-text-label">Autoplay Paused</p>
      </div>

      <div v-if="slides.length > 1" class="slide-navigation-dots-ephemeral" role="tablist" aria-label="Slide Navigation">
        <button v-for="(_, index) in slides" :key="`dot-${index}`" @click="() => navigateToSlide(index)"
                class="nav-dot-button" :class="{ 'active': index === currentSlideInternalIndex }"
                :title="`Go to slide ${index + 1}: ${slides[index]?.title || ''}`" :aria-label="`Slide ${index + 1}`"
                role="tab" :aria-selected="index === currentSlideInternalIndex">
        </button>
      </div>
    </div>

    <div v-else class="single-content-view-ephemeral" :class="{ 'fullscreen-active-content': isComponentFullscreen }">
      <div class="content-html-wrapper" v-html="singleContentViewHtml"></div>
      <div v-if="nonSlideDiagramsList.length > 0" class="diagrams-section-ephemeral">
        <h4 class="diagrams-section-title">Visual Diagrams</h4>
        <div v-for="diag in nonSlideDiagramsList" :key="diag.id" class="diagram-instance-wrapper">
                    <div :data-diagram-id="diag.id" class="mermaid-diagram-placeholder mermaid-diagram">
            </div>
        </div>
      </div>
      <div v-if="!props.content.trim() && !analysisResultData" class="p-6 text-center text-slate-500 dark:text-slate-400 italic">
        Content will be displayed here.
      </div>
    </div>

    <div class="actions-toolbar-ephemeral">
        <div class="action-button-group-ephemeral">
          <button @click="copyAllCode" class="action-button-ephemeral" title="Copy All Code Snippets">
            <DocumentDuplicateIcon class="icon" /><span class="action-text-label-ephemeral">Copy Code</span>
          </button>
          <button @click="exportSlides" v-if="useSlideshowLayout" class="action-button-ephemeral" title="Export Slides Content">
            <PresentationChartLineIcon class="icon" /><span class="action-text-label-ephemeral">Export Slides</span>
          </button>
          <button @click="exportDiagrams" v-if="(useSlideshowLayout && slides.some(s => s.diagram)) || (!useSlideshowLayout && nonSlideDiagramsList.length > 0)" class="action-button-ephemeral" title="Export Diagrams">
            <PhotoIcon class="icon" /><span class="action-text-label-ephemeral">Export Diagrams</span>
          </button>
        </div>
        <div class="action-button-group-ephemeral">
          <button @click="adjustFontSizeHandler(-1)" class="action-button-ephemeral" title="Decrease Font Size"><MinusIcon class="icon" /></button>
          <button @click="adjustFontSizeHandler(1)" class="action-button-ephemeral" title="Increase Font Size"><PlusIcon class="icon" /></button>
          <button @click="toggleFullscreenHandler" class="action-button-ephemeral" title="Toggle Fullscreen View">
            <component :is="isComponentFullscreen ? ArrowsPointingInIcon : ArrowsPointingOutIcon" class="icon" />
          </button>
        </div>
      </div>
  </div>
</template>

<style lang="scss">
// Styles for CompactMessageRenderer are expected to be in an external SCSS file,
// e.g., frontend/src/styles/components/_compact-message-renderer.scss
// This ensures this Vue file remains focused on structure and logic.
// The SCSS file should contain all necessary styling for the 'ephemeral' classes.

// Example for --content-font-scale usage (should be in your SCSS):
// .compact-message-renderer-ephemeral {
//   --content-font-scale: 1; // Default scale
// }
// .slide-content-inner-ephemeral, .content-html-wrapper {
//   font-size: calc(1rem * var(--content-font-scale));
//   h1, h2, h3, h4, h5, h6 { /* Scale headings proportionally */
//     font-size: calc(1.2em * var(--content-font-scale)); /* Adjust base 'em' as needed */
//   }
//   p, li, span, div { /* Apply to general text elements */
//     font-size: calc(1em * var(--content-font-scale)); /* Relative to parent if nested */
//   }
//   pre, code {
//      font-size: calc(0.9em * var(--content-font-scale)); /* Code blocks slightly smaller */
//   }
// }
</style>