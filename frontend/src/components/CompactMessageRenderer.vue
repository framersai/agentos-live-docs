<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount, type Component as VueComponentType } from 'vue';
import { marked, type MarkedOptions as OriginalMarkedOptions } from 'marked';
import mermaid from 'mermaid';
import hljs from 'highlight.js';
// Ensure a HLJS theme CSS is imported globally (e.g., in main.scss or main.ts)
// import 'highlight.js/styles/atom-one-dark.css'; // Or your preferred theme

import { themeManager } from '@/theme/ThemeManager';

import {
  ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon,
  ArrowsPointingOutIcon, ArrowsPointingInIcon, DocumentDuplicateIcon, PhotoIcon,
  PresentationChartLineIcon, PlusIcon, MinusIcon, CodeBracketIcon,
  CpuChipIcon, LightBulbIcon,
} from '@heroicons/vue/24/outline';

// --- Interfaces ---
interface Slide {
  id: string;
  title: string;
  rawContent: string;
  htmlContent: string;
  diagram?: string;
  type: 'intro' | 'concept' | 'code' | 'analysis' | 'summary' | 'general';
  readingTimeSeconds?: number; // Estimated reading time for this slide
}
interface ComplexityAnalysis { time?: string; space?: string; explanation?: string; }
interface AnalysisResult {
  type: 'leetcode' | 'systemDesign' | 'concept' | 'general';
  displayTitle: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  complexity?: ComplexityAnalysis;
  approach?: string;
  estimatedTotalReadingTimeSeconds: number;
  shouldCreateSlides: boolean;
  diagramCount: number;
}
interface CustomMarkedOptions extends OriginalMarkedOptions {
  highlight?: (code: string, lang: string) => string;
}

// --- Props ---
const props = defineProps<{
  content: string;
  mode: string;
  language?: string;
  initialSlideIndex?: number;
  disableInternalAutoplay?: boolean; // If true, parent controls slide timing
}>();

// --- Emits ---
const emit = defineEmits<{
  (e: 'toggle-fullscreen'): void;
  (e: 'interaction', payload: { type: string; data?: any }): void;
  (e: 'slide-changed', payload: { newIndex: number; totalSlides: number; navigatedManually: boolean }): void;
  (e: 'internal-autoplay-status-changed', payload: { isPlaying: boolean; isPaused: boolean }): void;
}>();

// --- Reactive State ---
const slides = ref<Slide[]>([]);
const currentSlideInternalIndex = ref(0); // This component's source of truth for current slide

const isInternalAutoplayOn = ref(false); // For this component's readingTime-based autoplay intent
const isInternalAutoplayEffectivelyPaused = ref(false); // Combines explicit pause and end-of-slideshow/disabled

const autoPlayProgressBarValue = ref(0);
const currentSlideTargetDurationMs = ref(8000);
const currentSlideTimeElapsedMs = ref(0);
let internalAutoplayTimeoutId: ReturnType<typeof setTimeout> | null = null;
let internalProgressIntervalId: ReturnType<typeof setInterval> | null = null;

const isComponentFullscreen = ref(false);
const analysisResultData = ref<AnalysisResult | null>(null);
const singleContentViewHtml = ref(''); // For non-slideshow content
const nonSlideDiagramsList = ref<{ id: string, code: string }[]>([]);

const contentDisplayRootRef = ref<HTMLElement | null>(null);
const slideDiagramContainerDivRef = ref<HTMLElement | null>(null);

// --- Mermaid Configuration ---
const currentMermaidThemeName = computed(() => themeManager.getCurrentTheme().value?.isDark ? 'dark' : 'default');

// --- SVG Icon Strings ---
const SVG_ICON_COPY_STRING = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-xs"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>`;
const SVG_ICON_CHECK_STRING = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="icon-xs text-green-500 dark:text-green-400"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>`;

// --- Content Patterns ---
const contentBreakPatterns = {
  slide: /\n---\s*SLIDE_BREAK\s*---\n/,
  codeBlock: /```([a-zA-Z0-9\-_]*)\n([\s\S]*?)```/g,
  mermaidBlock: /```mermaid\n([\s\S]*?)\n```/g,
  mainHeading: /^(?:#{1,3})\s+(.*)/, // H1, H2, or H3
};

// --- Marked.js Configuration ---
const configuredMarkedOptions: CustomMarkedOptions = {
  breaks: true, gfm: true, pedantic: false,
  highlight: (code, lang) => {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    try {
      return hljs.highlight(code, { language, ignoreIllegals: true }).value;
    } catch (e) { return hljs.highlight(code, { language: 'plaintext', ignoreIllegals: true }).value; }
  },
};

// --- Computed Properties ---
const useSlideshowLayout = computed(() => analysisResultData.value?.shouldCreateSlides && slides.value.length > 0);
const currentDisplayedSlide = computed<Slide | null>(() => slides.value[currentSlideInternalIndex.value] || null);
const totalNumberOfSlides = computed(() => slides.value.length);
const overallReadingProgressPercent = computed(() => totalNumberOfSlides.value === 0 ? 0 : Math.round(((currentSlideInternalIndex.value + 1) / totalNumberOfSlides.value) * 100));

// --- Core Content Processing ---
const analyzeProvidedContent = (content: string): AnalysisResult => {
  const analysis: AnalysisResult = { type: 'general', displayTitle: 'Content', estimatedTotalReadingTimeSeconds: 0, shouldCreateSlides: false, diagramCount: 0, complexity: {} };
  const normalizedContent = content.toLowerCase();

  // Basic type detection (can be expanded based on old file's comprehensive logic if needed)
  const lcKeywords = ['leetcode', 'algorithm', 'problem solving', 'coding challenge', 'data structure'];
  const sdKeywords = ['system design', 'architecture', 'scalability', 'microservices', 'distributed system'];

  if (lcKeywords.some(kw => normalizedContent.includes(kw)) || props.mode.includes('coding') || props.mode.includes('lc-audit')) {
    analysis.type = 'leetcode';
    analysis.displayTitle = 'Problem Analysis';
    const diffMatch = content.match(/(Easy|Medium|Hard)\s*(Problem|Challenge)?/i);
    if (diffMatch) analysis.difficulty = diffMatch[1] as 'Easy' | 'Medium' | 'Hard';

    const timeComplexityMatch = content.match(/Time Complexity:\s*(O\([^\)]+\))/i);
    if (timeComplexityMatch) analysis.complexity!.time = timeComplexityMatch[1];
    const spaceComplexityMatch = content.match(/Space Complexity:\s*(O\([^\)]+\))/i);
    if (spaceComplexityMatch) analysis.complexity!.space = spaceComplexityMatch[1];

  } else if (sdKeywords.some(kw => normalizedContent.includes(kw)) || props.mode.includes('system')) {
    analysis.type = 'systemDesign';
    analysis.displayTitle = 'Architecture Overview';
  }
  
  analysis.diagramCount = (content.match(contentBreakPatterns.mermaidBlock) || []).length;
  analysis.estimatedTotalReadingTimeSeconds = Math.max(30, Math.ceil((content.split(/\s+/).length / 200) * 60)); // Approx 200 WPM
  
  const slideChunks = content.split(contentBreakPatterns.slide);
  analysis.shouldCreateSlides = props.mode === 'lc-audit-aide' || // Specific mode from old logic
                                 slideChunks.length > 1 ||
                                 (analysis.type === 'leetcode' && content.length > 800) || // Heuristic
                                 (analysis.type === 'systemDesign') ||
                                 analysis.diagramCount > 0 ||
                                 (content.match(contentBreakPatterns.codeBlock) || []).length > 1;
  return analysis;
};

const formatCodeForDisplay = (rawCodeBlockMatch: string): string => {
  const langMatch = rawCodeBlockMatch.match(/^```(\S*)\n/);
  const lang = langMatch && langMatch[1] ? langMatch[1].toLowerCase() : props.language || 'plaintext';
  let code = rawCodeBlockMatch.replace(/^```\S*\n?/, '').replace(/\n```$/, '');

  code = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  const highlightedHtml = configuredMarkedOptions.highlight!(code, lang);
  
  const lines = highlightedHtml.split('\n');
  const numberedLinesHtml = lines.map((line, index) =>
    `<span class="line-number-ephemeral">${index + 1}</span><span class="line-content-ephemeral">${line || ' '}</span>`
  ).join('\n');

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

const parseContentToSlides = (fullMarkdownContent: string): Slide[] => {
  const slideMarkdownChunks = fullMarkdownContent.split(contentBreakPatterns.slide);
  return slideMarkdownChunks.map((chunk, index) => {
    let title = `Slide ${index + 1}`;
    let slideType: Slide['type'] = 'general';
    let mainContentMarkdown = chunk.trim();

    const headingMatch = mainContentMarkdown.match(contentBreakPatterns.mainHeading);
    if (headingMatch) {
      title = headingMatch[1].trim(); // Group 1 is the text after H1/H2/H3
      mainContentMarkdown = mainContentMarkdown.replace(headingMatch[0], '').trim();
    }

    let diagramCode: string | undefined = undefined;
    const mermaidMatch = mainContentMarkdown.match(contentBreakPatterns.mermaidBlock);
    if (mermaidMatch) {
      diagramCode = mermaidMatch[1].trim(); // Group 1 is the mermaid code
      mainContentMarkdown = mainContentMarkdown.replace(contentBreakPatterns.mermaidBlock, '').trim();
    }

    const contentWithEnhancedCode = mainContentMarkdown.replace(contentBreakPatterns.codeBlock, (match) => formatCodeForDisplay(match));
    const htmlContent = marked.parse(contentWithEnhancedCode, configuredMarkedOptions);
    const readingTimeSeconds = Math.max(5, Math.ceil((chunk.split(/\s+/).length / 180) * 60)); // Approx 180 WPM for slides

    if (index === 0 && slideMarkdownChunks.length > 1) slideType = 'intro';
    else if (diagramCode) slideType = 'analysis';
    else if (contentWithEnhancedCode.includes('class="enhanced-code-block-ephemeral"')) slideType = 'code';
    else if (index === slideMarkdownChunks.length - 1 && slideMarkdownChunks.length > 1) slideType = 'summary';
    else slideType = 'concept';

    return { id: `slide-${index}-${Date.now()}`, title, rawContent: chunk, htmlContent, diagram: diagramCode, type: slideType, readingTimeSeconds };
  }).filter(slide => slide.htmlContent.trim() !== '' || slide.diagram);
};


const initializeOrUpdateContent = async () => {
  clearInternalAutoplayStates();
  analysisResultData.value = analyzeProvidedContent(props.content);

  if (useSlideshowLayout.value) {
    slides.value = parseContentToSlides(props.content);
    const initialIdx = props.initialSlideIndex && props.initialSlideIndex < slides.value.length ? props.initialSlideIndex : 0;
    currentSlideInternalIndex.value = slides.value.length > 0 ? Math.min(initialIdx, slides.value.length -1) : 0;

    if (slides.value.length > 0) {
      await nextTick();
      renderCurrentSlideMermaidDiagram();
      if (contentDisplayRootRef.value) addAllCopyButtonListeners(contentDisplayRootRef.value);
      
      emit('slide-changed', { newIndex: currentSlideInternalIndex.value, totalSlides: totalNumberOfSlides.value, navigatedManually: false });
      
      if (!props.disableInternalAutoplay && slides.value.length > 1) {
        isInternalAutoplayOn.value = true; // Set intent
        isInternalAutoplayEffectivelyPaused.value = false;
        startOrResumeInternalAutoplay(true);
      } else {
        isInternalAutoplayOn.value = false;
        isInternalAutoplayEffectivelyPaused.value = true;
      }
      emit('internal-autoplay-status-changed', {isPlaying: isInternalAutoplayOn.value && !isInternalAutoplayEffectivelyPaused.value, isPaused: isInternalAutoplayEffectivelyPaused.value });
    }
  } else {
    slides.value = [];
    let tempContent = props.content;
    const diagramMatches = [...tempContent.matchAll(contentBreakPatterns.mermaidBlock)];
    nonSlideDiagramsList.value = diagramMatches.map((match, i) => ({ id: `nsd-${Date.now()}-${i}`, code: match[1].trim() }));
    
    let placeholderIndex = 0;
    tempContent = tempContent.replace(contentBreakPatterns.mermaidBlock, () => {
      const diagramId = nonSlideDiagramsList.value[placeholderIndex]?.id || `nsd-fallback-${placeholderIndex}`;
      placeholderIndex++;
      return `<div class="mermaid-diagram-placeholder" data-diagram-id="${diagramId}"></div>`;
    });
    tempContent = tempContent.replace(contentBreakPatterns.codeBlock, (match) => formatCodeForDisplay(match));
    singleContentViewHtml.value = marked.parse(tempContent, configuredMarkedOptions);
    
    await nextTick();
    renderAllNonSlideMermaidDiagrams();
    if (contentDisplayRootRef.value) addAllCopyButtonListeners(contentDisplayRootRef.value);
  }
};

// --- Diagram Rendering ---
const initializeMermaidConfig = () => {
  mermaid.initialize({
    startOnLoad: false,
    theme: currentMermaidThemeName.value,
    securityLevel: 'loose',
    fontSize: isComponentFullscreen.value ? 16 : 14,
    flowchart: { useMaxWidth: !isComponentFullscreen.value, htmlLabels: true },
  });
};

const renderSingleMermaidDiagram = async (container: HTMLElement, diagramCode: string, diagramId: string) => {
  if (!container || !diagramCode.trim()) return;
  container.innerHTML = '<div class="diagram-loading-spinner"></div>'; 
  await nextTick();
  try {
    initializeMermaidConfig();
    const { svg, bindFunctions } = await mermaid.render(diagramId, diagramCode);
    container.innerHTML = svg;
    if (bindFunctions) bindFunctions(container);
  } catch (error) {
    console.error(`Error rendering Mermaid diagram ${diagramId}:`, error);
    container.innerHTML = `<div class="render-error-ephemeral"><p class="error-title">Diagram Error</p><pre>${diagramCode.substring(0,100)}...</pre></div>`;
  }
};

const renderCurrentSlideMermaidDiagram = () => {
  const slide = currentDisplayedSlide.value;
  if (slide?.diagram && slideDiagramContainerDivRef.value) {
    renderSingleMermaidDiagram(slideDiagramContainerDivRef.value, slide.diagram, `slide-diag-${slide.id}`);
  } else if (slideDiagramContainerDivRef.value) {
    slideDiagramContainerDivRef.value.innerHTML = ''; 
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

// --- Code Block Enhancements ---
const addAllCopyButtonListeners = (containerElement: HTMLElement) => {
  containerElement.querySelectorAll('.copy-code-button-placeholder').forEach(buttonEl => {
    const button = buttonEl as HTMLElement;
    if (button.dataset.listenerAttached === 'true') return;

    const codeBlockWrapper = button.closest('.enhanced-code-block-ephemeral');
    if (!codeBlockWrapper) return;

    const rawCode = decodeURIComponent(codeBlockWrapper.getAttribute('data-raw-code') || '');
    button.addEventListener('click', async (event) => {
      event.stopPropagation();
      try {
        await navigator.clipboard.writeText(rawCode);
        button.innerHTML = SVG_ICON_CHECK_STRING;
        setTimeout(() => { button.innerHTML = SVG_ICON_COPY_STRING; }, 2000);
        emit('interaction', { type: 'toast', data: { type: 'success', title: 'Code Copied!', duration: 2000 } });
      } catch (err) {
        console.error('Failed to copy code:', err);
        emit('interaction', { type: 'toast', data: { type: 'error', title: 'Copy Failed', message: 'Could not copy code.' } });
      }
    });
    button.dataset.listenerAttached = 'true';
  });
};


// --- Slideshow Navigation & Control ---
const navigateToSlide = (index: number, fromAutoplay: boolean = false) => {
  if (index >= 0 && index < totalNumberOfSlides.value && currentSlideInternalIndex.value !== index) {
    currentSlideInternalIndex.value = index;

    if (!fromAutoplay) {
      isInternalAutoplayOn.value = false; 
      isInternalAutoplayEffectivelyPaused.value = true;
      clearInternalAutoplayStates();
      emit('slide-changed', { newIndex: currentSlideInternalIndex.value, totalSlides: totalNumberOfSlides.value, navigatedManually: true });
      emit('internal-autoplay-status-changed', {isPlaying: false, isPaused: true });
    } else {
      emit('slide-changed', { newIndex: currentSlideInternalIndex.value, totalSlides: totalNumberOfSlides.value, navigatedManually: false });
    }
    
    if (isInternalAutoplayOn.value && !props.disableInternalAutoplay) {
        resetInternalAutoplayForNewSlide();
    }
  } else if (index >= 0 && index < totalNumberOfSlides.value && currentSlideInternalIndex.value === index && !fromAutoplay) {
    // If clicking current slide dot, treat as manual interaction to pause autoplay
    isInternalAutoplayOn.value = false; 
    isInternalAutoplayEffectivelyPaused.value = true;
    clearInternalAutoplayStates();
    emit('internal-autoplay-status-changed', {isPlaying: false, isPaused: true });
  }
};
const next = () => { navigateToSlide(currentSlideInternalIndex.value + 1, false); };
const prev = () => { navigateToSlide(currentSlideInternalIndex.value - 1, false); };

// --- Internal Autoplay (readingTime-based) ---
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
    isInternalAutoplayOn.value = false;
    isInternalAutoplayEffectivelyPaused.value = true;
    emit('internal-autoplay-status-changed', {isPlaying: false, isPaused: true });
    return;
  }
  if (slides.value.length <= 1 || currentSlideInternalIndex.value >= slides.value.length - 1 && !isStartingNewSlideshow) {
    isInternalAutoplayOn.value = false; 
    isInternalAutoplayEffectivelyPaused.value = true;
    clearInternalAutoplayStates();
    emit('internal-autoplay-status-changed', {isPlaying: false, isPaused: true });
    return;
  }

  isInternalAutoplayOn.value = true; // Set intent
  isInternalAutoplayEffectivelyPaused.value = false;
  emit('internal-autoplay-status-changed', {isPlaying: true, isPaused: false });

  const slideData = slides.value[currentSlideInternalIndex.value];
  currentSlideTargetDurationMs.value = Math.max(3000, (slideData?.readingTimeSeconds || 10) * 1000); 
  
  if(isStartingNewSlideshow) {
    currentSlideTimeElapsedMs.value = 0;
  }
 
  autoPlayProgressBarValue.value = Math.min(100, (currentSlideTimeElapsedMs.value / currentSlideTargetDurationMs.value) * 100);
  clearInternalAutoplayStates(); 

  const timeRemainingMs = currentSlideTargetDurationMs.value - currentSlideTimeElapsedMs.value;

  if (timeRemainingMs > 0) {
    internalAutoplayTimeoutId = setTimeout(() => {
      if (isInternalAutoplayOn.value && !isInternalAutoplayEffectivelyPaused.value) {
        navigateToSlide(currentSlideInternalIndex.value + 1, true); 
      }
    }, timeRemainingMs);

    internalProgressIntervalId = setInterval(() => {
      if (!isInternalAutoplayOn.value || isInternalAutoplayEffectivelyPaused.value) {
        clearInternalAutoplayStates();
        return;
      }
      currentSlideTimeElapsedMs.value += 100;
      autoPlayProgressBarValue.value = Math.min(100, (currentSlideTimeElapsedMs.value / currentSlideTargetDurationMs.value) * 100);
      if (currentSlideTimeElapsedMs.value >= currentSlideTargetDurationMs.value) {
        if(internalProgressIntervalId) clearInterval(internalProgressIntervalId);
      }
    }, 100);
  } else if (currentSlideInternalIndex.value < slides.value.length - 1) {
    navigateToSlide(currentSlideInternalIndex.value + 1, true);
  } else {
    isInternalAutoplayOn.value = false;
    isInternalAutoplayEffectivelyPaused.value = true;
    emit('internal-autoplay-status-changed', {isPlaying: false, isPaused: true });
  }
};

const pauseInternalAutoplayHandler = () => { 
  // isInternalAutoplayOn remains true (intent is still there)
  isInternalAutoplayEffectivelyPaused.value = true;
  clearInternalAutoplayStates();
  emit('internal-autoplay-status-changed', {isPlaying: false, isPaused: true });
};

const resumeInternalAutoplayHandler = () => { 
    if (isInternalAutoplayOn.value) { 
        isInternalAutoplayEffectivelyPaused.value = false;
        startOrResumeInternalAutoplay(false); 
    }
    // No emit here, startOrResumeInternalAutoplay will emit
};

const toggleInternalAutoplayAndPause = () => {
    if (isInternalAutoplayOn.value && !isInternalAutoplayEffectivelyPaused.value) { 
        pauseInternalAutoplayHandler();
    } else { 
        isInternalAutoplayOn.value = true; // Ensure intent is on if resuming/starting
        resumeInternalAutoplayHandler();
    }
};

const resetInternalAutoplayForNewSlide = () => {
  clearInternalAutoplayStates();
  if (isInternalAutoplayOn.value && !props.disableInternalAutoplay && !isInternalAutoplayEffectivelyPaused.value) {
    currentSlideTimeElapsedMs.value = 0; 
    autoPlayProgressBarValue.value = 0;
    startOrResumeInternalAutoplay(false); 
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

// --- Action Handlers ---
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


// --- Watchers & Lifecycle ---
watch(() => props.content, (newContent, oldContent) => {
  if (newContent !== oldContent || !analysisResultData.value) { 
    currentSlideInternalIndex.value = props.initialSlideIndex || 0;
    // Autoplay intent will be set within initializeOrUpdateContent
    initializeOrUpdateContent();
  }
}, { immediate: true });

watch(currentSlideInternalIndex, async (newIndex, oldIndex) => {
  if (newIndex !== oldIndex && useSlideshowLayout.value) {
    await nextTick();
    renderCurrentSlideMermaidDiagram();
    if (contentDisplayRootRef.value) {
      addAllCopyButtonListeners(contentDisplayRootRef.value);
      const slideWrapper = contentDisplayRootRef.value.querySelector('.slide-content-wrapper-ephemeral') as HTMLElement;
      if(slideWrapper) slideWrapper.focus({ preventScroll: true }); 
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
});
onBeforeUnmount(() => { clearInternalAutoplayStates(); });

// --- Expose API for Parent Control ---
defineExpose({
  navigateToSlide: (index: number) => navigateToSlide(index, false),
  next: () => next(),
  prev: () => prev(),
  getCurrentSlideIndex: () => currentSlideInternalIndex.value,
  getTotalSlides: () => totalNumberOfSlides.value,
  pauseInternalAutoplay: pauseInternalAutoplayHandler,
  resumeInternalAutoplay: resumeInternalAutoplayHandler,
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
            <PauseIcon v-if="isInternalAutoplayOn && !isInternalAutoplayEffectivelyPaused" class="icon" />
            <PlayIcon v-else class="icon" />
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
            <div :ref="el => slideDiagramContainerDivRef = el as HTMLElement" class="mermaid-diagram">
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
// Styles are expected to be in an external SCSS file, e.g., frontend/src/styles/components/_compact-message-renderer.scss
// Ensure that SCSS file uses --content-font-scale for relevant text elements (e.g., p, li, code, pre).
// It should also include styles for all 'ephemeral' classes used in this template for UI elements like:
// .compact-message-renderer-ephemeral, .analysis-banner-ephemeral, .slideshow-container-ephemeral,
// .slide-content-wrapper-ephemeral, .enhanced-code-block-ephemeral, .code-header-ephemeral,
// .line-number-ephemeral, .line-content-ephemeral, .diagram-loading-spinner,
// .render-error-ephemeral, .autoplay-progress-bar-ephemeral, .actions-toolbar-ephemeral, etc.
//
// Example for font scaling:
// .compact-message-renderer-ephemeral {
//   --content-font-scale: 1; // Default
//
//   .slide-content-inner-ephemeral, .content-html-wrapper {
//     font-size: calc(1rem * var(--content-font-scale)); // Apply to base text containers
//     h1 { font-size: calc(2em * var(--content-font-scale)); }
//     // etc. for other text elements
//   }
// }
</style>