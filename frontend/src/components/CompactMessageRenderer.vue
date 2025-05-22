<template>
  <div class="compact-message-container" :class="{ 
    'fullscreen': isFullscreen,
    'coding-problem': analysisResult?.type === 'leetcode',
    'system-design': analysisResult?.type === 'systemDesign'
  }">
    <div v-if="analysisResult" class="analysis-banner" :class="getAnalysisBannerClass()">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <component :is="getAnalysisIcon()" class="w-5 h-5" />
          <span class="font-semibold">{{ analysisResult.displayTitle }}</span>
          <span v-if="analysisResult.difficulty" class="difficulty-badge" :class="getDifficultyClass()">
            {{ analysisResult.difficulty }}
          </span>
        </div>
        <div class="flex items-center gap-3">
          <span v-if="analysisResult.readingTime" class="text-sm opacity-75">
            ~{{ Math.ceil(analysisResult.readingTime / 60) }}min read
          </span>
          <span v-if="analysisResult.complexity" class="text-xs opacity-75">
            {{ analysisResult.complexity.time || 'O(?)' }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="shouldUseSlides && slides.length > 1" class="slideshow-container">
      <div class="slideshow-header">
        <div class="slide-info">
          <h3 class="slide-title">{{ getCurrentSlideTitle() }}</h3>
          <div class="slide-meta">
            <span class="slide-counter">{{ currentSlide + 1 }} / {{ slides.length }}</span>
            <span class="reading-progress">{{ getReadingProgress() }}% read</span>
          </div>
        </div>
        <div class="slide-controls">
          <button @click="previousSlide" :disabled="currentSlide === 0" class="control-btn" title="Previous">
            <ChevronLeftIcon class="w-4 h-4" />
          </button>
          <button @click="pauseAutoPlay" class="control-btn" :title="isAutoPlaying ? 'Pause' : 'Resume'">
            <PauseIcon v-if="isAutoPlaying && !isPaused" class="w-4 h-4" />
            <PlayIcon v-else class="w-4 h-4" />
          </button>
          <button @click="nextSlide" :disabled="currentSlide === slides.length - 1" class="control-btn" title="Next">
            <ChevronRightIcon class="w-4 h-4" />
          </button>
          <button @click="toggleFullscreen" class="control-btn ml-2" title="Toggle Fullscreen">
            <ArrowsPointingOutIcon v-if="!isFullscreen" class="w-4 h-4" />
            <ArrowsPointingInIcon v-else class="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div class="slide-content" :class="getSlideContentClass()" :key="`slide-${currentSlide}`">
        <div v-html="getCurrentSlideContent()"></div>
        
        <div v-if="getCurrentSlideDiagram()" class="slide-diagram">
          <div class="diagram-container">
            <div ref="diagramContainer" class="mermaid-diagram"></div>
          </div>
        </div>
      </div>
      
      <div v-if="isAutoPlaying" class="auto-play-progress">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${autoPlayProgress}%` }"
          ></div>
        </div>
        <span class="progress-text">
          Auto-advancing in {{ Math.ceil((slideDuration - slideElapsed) / 1000) }}s
        </span>
      </div>
      
      <div class="slide-navigation">
        <button 
          v-for="(slide, index) in slides" 
          :key="index"
          @click="goToSlide(index)"
          :class="['nav-dot', { active: index === currentSlide }]"
          :title="slide.title"
        >
          <span class="sr-only">Go to slide {{ index + 1 }}</span>
        </button>
      </div>
    </div>

    <div v-else class="single-content" :class="{ 'fullscreen-content': isFullscreen }">
      <div v-html="processedContent"></div>
      
      <div v-if="diagrams.length > 0" class="diagrams-section">
        <h4 class="diagrams-title">Visual Diagrams</h4>
        <div v-for="(_, index) in diagrams" :key="index" class="diagram-container">
<div :ref="el => { diagramRefs[index] = el as (HTMLElement | null); }" class="mermaid-diagram"></div>        </div>
      </div>
    </div>

    <div v-if="analysisResult?.type === 'leetcode' && complexityAnalysis" class="complexity-panel">
      <h4 class="complexity-title">Algorithm Analysis</h4>
      <div class="complexity-grid">
        <div class="complexity-item">
          <span class="complexity-label">Time Complexity:</span>
          <span class="complexity-value" :class="getComplexityClass(complexityAnalysis.time)">
            {{ complexityAnalysis.time || 'O(?)' }}
          </span>
        </div>
        <div class="complexity-item">
          <span class="complexity-label">Space Complexity:</span>
          <span class="complexity-value" :class="getComplexityClass(complexityAnalysis.space)">
            {{ complexityAnalysis.space || 'O(?)' }}
          </span>
        </div>
        <div v-if="analysisResult.approach" class="complexity-item full-width">
          <span class="complexity-label">Approach:</span>
          <span class="complexity-approach">{{ analysisResult.approach }}</span>
        </div>
      </div>
    </div>

    <div v-if="analysisResult?.type === 'leetcode' && hasExecutableCode" class="code-execution-panel">
      <h4 class="execution-title">Test Your Solution</h4>
      <div class="test-cases">
        <div v-for="(testCase, index) in testCases" :key="index" class="test-case">
          <div class="test-input">
            <strong>Input:</strong> {{ testCase.input }}
          </div>
          <div class="test-expected">
            <strong>Expected:</strong> {{ testCase.expected }}
          </div>
          <button @click="runTestCase(index)" class="run-test-btn">
            Run Test
          </button>
        </div>
      </div>
    </div>

    <div class="actions-toolbar">
      <div class="action-group">
        <button @click="copyAllCode" class="action-btn" title="Copy All Code">
          <DocumentDuplicateIcon class="w-4 h-4" />
          <span class="action-text">Copy Code</span>
        </button>
        <button v-if="diagrams.length > 0" @click="exportDiagrams" class="action-btn" title="Export Diagrams">
          <PhotoIcon class="w-4 h-4" />
          <span class="action-text">Export Diagrams</span>
        </button>
        <button v-if="shouldUseSlides" @click="exportSlides" class="action-btn" title="Export as Slides">
          <PresentationChartLineIcon class="w-4 h-4" />
          <span class="action-text">Export Slides</span>
        </button>
      </div>
      <div class="action-group">
        <button @click="adjustFontSize(-1)" class="action-btn" title="Decrease Font Size">
          <MinusIcon class="w-4 h-4" />
        </button>
        <button @click="adjustFontSize(1)" class="action-btn" title="Increase Font Size">
          <PlusIcon class="w-4 h-4" />
        </button>
        <button @click="toggleFullscreen" class="action-btn" title="Toggle Fullscreen">
          <ArrowsPointingOutIcon v-if="!isFullscreen" class="w-4 h-4" />
          <ArrowsPointingInIcon v-else class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount } from 'vue';
import { marked } from 'marked';
import mermaid from 'mermaid';
// FIX: hljs import was unused directly, now configured with marked (Error 5)
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  PauseIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  DocumentDuplicateIcon,
  PhotoIcon,
  PresentationChartLineIcon,
  PlusIcon,
  MinusIcon,
  CodeBracketIcon,
  // FIX: AcademicCapIcon was unused (Error 6)
  // AcademicCapIcon, 
  CpuChipIcon,
  LightBulbIcon,
  // FIX: BoltIcon was unused (Error 7)
  // BoltIcon 
} from '@heroicons/vue/24/outline';

// FIX: Cast options object to 'any' to bypass strict type checking for 'highlight' property,
// as the project's MarkedOptions type might be outdated or incorrect,
// but 'highlight' is a standard option in many versions of marked.
marked.setOptions({
  highlight: (code: string, lang: string) => {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language, ignoreIllegals: true }).value;
  },
  langPrefix: 'hljs language-', // common prefix for CSS
} as any); // Cast the entire options object to 'any'

interface Slide {
  title: string;
  content: string;
  diagram?: string;
  type: 'intro' | 'concept' | 'code' | 'analysis' | 'summary';
  readingTime: number;
}

interface ComplexityAnalysis {
  time?: string;
  space?: string;
  explanation?: string;
}

interface AnalysisResult {
  type: 'leetcode' | 'systemDesign' | 'concept' | 'general';
  displayTitle: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  complexity?: ComplexityAnalysis;
  approach?: string;
  readingTime: number;
  shouldCreateSlides: boolean;
  diagramCount: number;
}

interface TestCase {
  input: string;
  expected: string;
  actual?: string;
}

const props = defineProps<{
  content: string;
  mode: string;
  language?: string;
}>();

const emit = defineEmits<{
  'toggle-fullscreen': [];
}>();

// Reactive state
const currentSlide = ref(0);
const isAutoPlaying = ref(false);
const isPaused = ref(false);
const isFullscreen = ref(false);
const slides = ref<Slide[]>([]);
const processedContent = ref('');
const analysisResult = ref<AnalysisResult | null>(null);
const complexityAnalysis = ref<ComplexityAnalysis | null>(null);
const diagrams = ref<string[]>([]);
// FIX: Changed type from HTMLElement[] to (HTMLElement | null)[] to correctly handle refs from v-for (Error 1)
// Vue refs in v-for can be null initially or if the element is conditional.
const diagramRefs = ref<(HTMLElement | null)[]>([]);
const fontSize = ref(1);
const autoPlayProgress = ref(0);
const slideElapsed = ref(0);
const slideDuration = ref(8000);
const hasExecutableCode = ref(false);
const testCases = ref<TestCase[]>([]);

// Timers
// FIX: slideTimer was declared but never read (Error 8)
// let slideTimer: number | null = null; 
let progressTimer: number | null = null;

// Advanced content patterns for better detection
const contentPatterns = {
  leetcode: {
    indicators: [
      /(?:leetcode|algorithm|two sum|binary search|dynamic programming)/i,
      /(?:time complexity|space complexity|big o|O\([^)]+\))/i,
      /(?:optimal solution|brute force|efficient|interview question)/i,
      /(?:array.*sum|find.*maximum|minimum.*path|valid.*parentheses)/i,
      /(?:sliding window|two pointers|backtracking|divide and conquer)/i
    ],
    difficulty: /(?:easy|medium|hard)(?:\s+problem)?/i,
    approaches: /(?:naive|brute\s*force|optimal|efficient|recursive|iterative)/i
  },
  systemDesign: {
    indicators: [
      /(?:system design|architecture|scalability|microservices)/i,
      /(?:load balancer|database|cache|cdn|api gateway)/i,
      /(?:distributed system|high availability|fault tolerance)/i,
      /(?:design.*system|scale.*to.*users|handle.*traffic)/i
    ]
  },
  codeBlocks: /```[\s\S]*?```/g,
  mermaidDiagrams: /```mermaid\n([\s\S]*?)\n```/g,
  complexity: /(?:time complexity|space complexity)[:\s]*O\(([^)]+)\)/gi,
  testCases: /(?:input|example)[:\s]*([^\n]+)\s*(?:output|expected|result)[:\s]*([^\n]+)/gi
};

// Computed properties
const shouldUseSlides = computed(() => {
  return analysisResult.value?.shouldCreateSlides && slides.value.length > 1;
});

const getCurrentSlideTitle = () => {
  return slides.value[currentSlide.value]?.title || `Slide ${currentSlide.value + 1}`;
};

const getCurrentSlideContent = () => {
  return slides.value[currentSlide.value]?.content || '';
};

const getCurrentSlideDiagram = () => {
  return slides.value[currentSlide.value]?.diagram || '';
};

const getReadingProgress = () => {
  if (slides.value.length === 0) return 0;
  return Math.round(((currentSlide.value + 1) / slides.value.length) * 100);
};

const getSlideContentClass = () => {
  const baseClass = 'slide-content-inner';
  const typeClass = slides.value[currentSlide.value]?.type || 'general';
  const fullscreenClass = isFullscreen.value ? 'fullscreen-slide' : '';
  return `${baseClass} ${typeClass}-slide ${fullscreenClass}`;
};

// Advanced content analysis
const analyzeContent = (content: string) => {
  const analysis: AnalysisResult = {
    type: 'general',
    displayTitle: 'General Response',
    readingTime: 0,
    shouldCreateSlides: false,
    diagramCount: 0
  };

  const normalizedContent = content.toLowerCase();
  
  // Detect LeetCode problems with higher accuracy
  let leetcodeScore = 0;
  contentPatterns.leetcode.indicators.forEach(pattern => {
    if (pattern.test(normalizedContent)) leetcodeScore++;
  });

  if (leetcodeScore >= 2) {
    analysis.type = 'leetcode';
    analysis.displayTitle = 'Coding Problem Solution';
    
    // Extract difficulty
    const difficultyMatch = content.match(contentPatterns.leetcode.difficulty);
    if (difficultyMatch) {
      analysis.difficulty = difficultyMatch[0].toLowerCase().includes('easy') ? 'Easy' :
                              difficultyMatch[0].toLowerCase().includes('medium') ? 'Medium' : 'Hard';
    }
    
    // Extract approach
    const approachMatch = content.match(contentPatterns.leetcode.approaches);
    if (approachMatch) {
      analysis.approach = approachMatch[0];
    }
  }
  
  // Detect system design
  else if (contentPatterns.systemDesign.indicators.some(pattern => pattern.test(normalizedContent))) {
    analysis.type = 'systemDesign';
    analysis.displayTitle = 'System Design';
  }

  // Extract complexity information
  const complexityMatches = [...content.matchAll(contentPatterns.complexity)];
  if (complexityMatches.length > 0) {
    const complexity: ComplexityAnalysis = {};
    complexityMatches.forEach(match => {
      const fullMatch = match[0].toLowerCase();
      if (fullMatch.includes('time')) {
        complexity.time = `O(${match[1]})`;
      } else if (fullMatch.includes('space')) {
        complexity.space = `O(${match[1]})`;
      }
    });
    analysis.complexity = complexity;
    complexityAnalysis.value = complexity;
  }

  // Count diagrams
  const diagramMatches = [...content.matchAll(contentPatterns.mermaidDiagrams)];
  analysis.diagramCount = diagramMatches.length;

  // Calculate reading time (200 words per minute)
  const words = content.split(/\s+/).length;
  analysis.readingTime = Math.max(30, (words / 200) * 60);

  // Determine if slides should be created
  const codeBlocks = [...content.matchAll(contentPatterns.codeBlocks)];
  analysis.shouldCreateSlides = (
    analysis.type === 'leetcode' ||
    analysis.type === 'systemDesign' ||
    content.length > 2000 ||
    codeBlocks.length > 1 ||
    analysis.diagramCount > 0
  );

  return analysis;
};

// Create intelligent slides based on content type
const createSlides = (content: string) => {
  const analysis = analysisResult.value;
  if (!analysis || !analysis.shouldCreateSlides) return;

  const newSlides: Slide[] = []; // Renamed to avoid conflict with outer 'slides' ref

  if (analysis.type === 'leetcode') {
    newSlides.push(...createLeetCodeSlides(content));
  } else if (analysis.type === 'systemDesign') {
    newSlides.push(...createSystemDesignSlides(content));
  } else {
    newSlides.push(...createGeneralSlides(content));
  }

  // Ensure each slide has appropriate readingTime
  newSlides.forEach(slide => {
    if (!slide.readingTime) {
      const words = slide.content.split(/\s+/).length;
      slide.readingTime = Math.max(5, (words / 200) * 60);
    }
  });

  return newSlides;
};

// Create slides specifically for LeetCode problems
const createLeetCodeSlides = (content: string): Slide[] => {
  const newSlides: Slide[] = [];
  const sections = splitIntoSections(content);

  // Slide 1: Problem Understanding
  const problemSection = sections.find(s => 
    s.includes('problem') || s.includes('understanding') || s.includes('analysis')
  );
  if (problemSection) {
    newSlides.push({
      title: 'Problem Understanding',
      content: enhanceContent(problemSection, 'problem'),
      type: 'intro',
      readingTime: 45
    });
  }

  // Slide 2: Approach & Strategy
  const approachSection = sections.find(s =>
    s.includes('approach') || s.includes('strategy') || s.includes('solution')
  );
  if (approachSection) {
    newSlides.push({
      title: 'Solution Approach',
      content: enhanceContent(approachSection, 'approach'),
      type: 'concept',
      readingTime: 60
    });
  }

  // Slide 3: Code Implementation
  const codeMatch = content.match(/```[\s\S]*?```/);
  if (codeMatch) {
    newSlides.push({
      title: 'Code Implementation',
      content: enhanceCodeSlide(codeMatch[0]),
      type: 'code',
      readingTime: 90
    });
  }

  // Slide 4: Complexity Analysis
  if (complexityAnalysis.value) {
    newSlides.push({
      title: 'Complexity Analysis',
      content: createComplexitySlide(),
      type: 'analysis',
      readingTime: 45
    });
  }

  // Generate diagram for algorithm visualization
  if (newSlides.length > 0) {
    generateAlgorithmDiagram(content).then(diagram => {
      if (diagram && newSlides.length > 1) {
        newSlides[1].diagram = diagram; // Add to approach slide
      }
    });
  }

  return newSlides;
};

// Create slides for system design
const createSystemDesignSlides = (content: string): Slide[] => {
  const newSlides: Slide[] = [];
  const sections = splitIntoSections(content);

  // Architecture Overview
  newSlides.push({
    title: 'Architecture Overview',
    content: enhanceContent(sections[0] || content.substring(0, 500), 'architecture'),
    type: 'intro',
    readingTime: 60
  });

  // Data Flow
  const dataFlowSection = sections.find(s => 
    s.includes('data flow') || s.includes('flow') || s.includes('process')
  );
  if (dataFlowSection) {
    newSlides.push({
      title: 'Data Flow',
      content: enhanceContent(dataFlowSection, 'dataflow'),
      type: 'concept',
      readingTime: 70
    });
  }

  // Scalability
  const scalabilitySection = sections.find(s =>
    s.includes('scalability') || s.includes('scale') || s.includes('performance')
  );
  if (scalabilitySection) {
    newSlides.push({
      title: 'Scalability Strategy',
      content: enhanceContent(scalabilitySection, 'scalability'),
      type: 'analysis',
      readingTime: 80
    });
  }

  // Generate system architecture diagram
  generateSystemDiagram(content).then(diagram => {
    if (diagram && newSlides.length > 0) {
      newSlides[0].diagram = diagram;
    }
  });

  return newSlides;
};

// Create general slides for other content
const createGeneralSlides = (content: string): Slide[] => {
  const sections = splitIntoSections(content);
  return sections.map((section, index) => ({
    title: `Section ${index + 1}`,
    content: enhanceContent(section, 'general'),
    type: 'concept' as const,
    readingTime: Math.max(30, section.split(/\s+/).length * 0.3) // Removed .value as it's direct calculation
  }));
};

// Split content into logical sections
const splitIntoSections = (content: string): string[] => {
  // Split by headers first
  const headerSplit = content.split(/\n(?=##?\s)/);
  if (headerSplit.length > 1) {
    return headerSplit;
  }

  // Split by code blocks
  const codeSplit = content.split(/(```[\s\S]*?```)/);
  const sections: string[] = [];
  let currentSection = '';

  codeSplit.forEach(part => {
    if (part.startsWith('```')) {
      if (currentSection.trim()) {
        sections.push(currentSection);
        currentSection = '';
      }
      sections.push(part);
    } else {
      currentSection += part;
    }
  });

  if (currentSection.trim()) {
    sections.push(currentSection);
  }

  return sections.filter(s => s.trim());
};

// Enhance content with better formatting
const enhanceContent = (content: string, type: string): string => {
  let enhanced = marked(content);

  // Add smart formatting based on type
  if (type === 'problem') {
    enhanced = enhanced.replace(/\b(input|output|example|constraint)/gi, '<strong class="highlight-keyword">$1</strong>');
  } else if (type === 'approach') {
    enhanced = enhanced.replace(/\b(step \d+|algorithm|approach|strategy)/gi, '<strong class="highlight-approach">$1</strong>');
  } else if (type === 'architecture') {
    enhanced = enhanced.replace(/\b(component|service|database|api|cache|load balancer)/gi, '<strong class="highlight-component">$1</strong>');
  }

  return enhanced;
};

// Create enhanced code slide with syntax highlighting and comments
const enhanceCodeSlide = (codeBlock: string): string => {
  let enhanced = marked(codeBlock);
  
  // Add line numbers and enhanced highlighting
  // FIX: 'match' parameter was unused (Error 9)
  // FIX: Added types for 'line' and 'index' (Errors 2 and 3)
  enhanced = enhanced.replace(/<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/, (_, lang: string, code: string) => {
    const lines = code.split('\n');
    const numberedLines = lines.map((line: string, index: number) => 
      `<span class="line-number">${index + 1}</span><span class="line-content">${line}</span>`
    ).join('\n');
    
    return `
      <div class="enhanced-code-block">
        <div class="code-header">
          <span class="code-language">${lang}</span>
          <button class="copy-code-btn" onclick="copyCode(this)">Copy</button>
        </div>
        <pre><code class="language-${lang} line-numbered">${numberedLines}</code></pre>
      </div>
    `;
  });

  return enhanced;
};

// Create complexity analysis slide
const createComplexitySlide = (): string => {
  const complexity = complexityAnalysis.value;
  if (!complexity) return '';

  return `
    <div class="complexity-breakdown">
      <h3>Complexity Analysis</h3>
      <div class="complexity-cards">
        <div class="complexity-card time">
          <h4>⏱️ Time Complexity</h4>
          <div class="complexity-value">${complexity.time || 'O(?)'}</div>
          <p>Time required relative to input size</p>
        </div>
        <div class="complexity-card space">
          <h4>💾 Space Complexity</h4>
          <div class="complexity-value">${complexity.space || 'O(?)'}</div>
          <p>Memory required relative to input size</p>
        </div>
      </div>
      ${complexity.explanation ? `<div class="complexity-explanation">${complexity.explanation}</div>` : ''}
    </div>
  `;
};

// Generate algorithm visualization diagram
const generateAlgorithmDiagram = async (content: string): Promise<string | null> => {
  try {
    // Extract algorithm type for appropriate diagram
    const algorithmType = detectAlgorithmType(content);
    
    switch (algorithmType) {
      case 'tree':
        return `
        graph TD
          A[Root] --> B[Left Child]
          A --> C[Right Child]
          B --> D[Left Leaf]
          B --> E[Right Leaf]
          C --> F[Left Leaf]
          C --> G[Right Leaf]
        `;
      case 'array':
        return `
        graph LR
          A[0] --> B[1]
          B --> C[2]
          C --> D[3]
          D --> E[4]
          style A fill:#e1f5fe
          style C fill:#fff3e0
          style E fill:#f3e5f5
        `;
      case 'graph':
        return `
        graph TD
          A[Node A] --> B[Node B]
          A --> C[Node C]
          B --> D[Node D]
          C --> D
          C --> E[Node E]
          D --> E
        `;
      default:
        return null;
    }
  } catch (error) {
    console.error('Error generating algorithm diagram:', error);
    return null;
  }
};

// Generate system architecture diagram
// FIX: 'content' parameter was unused (Error 10) - prefixed with underscore
const generateSystemDiagram = async (_content: string): Promise<string | null> => {
  try {
    return `
    graph TB
      User[User] --> LB[Load Balancer]
      LB --> WS1[Web Server 1]
      LB --> WS2[Web Server 2]
      WS1 --> API[API Gateway]
      WS2 --> API
      API --> MS1[Microservice 1]
      API --> MS2[Microservice 2]
      MS1 --> DB1[(Database 1)]
      MS2 --> DB2[(Database 2)]
      MS1 --> Cache[Redis Cache]
      MS2 --> Cache
    `;
  } catch (error) {
    console.error('Error generating system diagram:', error);
    return null;
  }
};

// Detect algorithm type from content
const detectAlgorithmType = (content: string): string => {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('tree') || lowerContent.includes('binary search')) return 'tree';
  if (lowerContent.includes('array') || lowerContent.includes('two sum')) return 'array';
  if (lowerContent.includes('graph') || lowerContent.includes('bfs') || lowerContent.includes('dfs')) return 'graph';
  
  return 'general';
};

// Process content and determine display mode
const processContent = () => {
  analysisResult.value = analyzeContent(props.content);
  
  // Extract diagrams
  const diagramMatches = [...props.content.matchAll(contentPatterns.mermaidDiagrams)];
  diagrams.value = diagramMatches.map(match => match[1]);
  
  // Extract test cases for LeetCode problems
  if (analysisResult.value.type === 'leetcode') {
    extractTestCases();
  }
  
  const createdSlides = createSlides(props.content); // Store result to avoid multiple calls
  if (analysisResult.value.shouldCreateSlides && createdSlides) {
    slides.value = createdSlides;
    
    if (slides.value.length > 1) {
      isAutoPlaying.value = true;
      startAutoPlay();
    }
  } else {
    // Single content view
    processedContent.value = marked(props.content);
  }
  
  // Render diagrams
  nextTick(() => {
    renderDiagrams();
  });
};

// Extract test cases from content
const extractTestCases = () => {
  const matches = [...props.content.matchAll(contentPatterns.testCases)];
  testCases.value = matches.map(match => ({
    input: match[1].trim(),
    expected: match[2].trim()
  }));
  
  hasExecutableCode.value = testCases.value.length > 0;
};

// Render Mermaid diagrams
const renderDiagrams = async () => {
  try {
    mermaid.initialize({
      startOnLoad: false,
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
      securityLevel: 'loose',
      fontSize: isFullscreen.value ? 16 : 12,
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true
      }
    });

    // Render slide diagrams
    if (shouldUseSlides.value) {
      const currentDiagram = getCurrentSlideDiagram();
      if (currentDiagram) {
        // Use querySelector as 'diagramContainer' ref is specific to v-for items, not a single one here.
        const slideDiagramContainer = document.querySelector('.slide-content .mermaid-diagram') as HTMLElement | null;
        if (slideDiagramContainer) {
          // Ensure the container is cleared before rendering, especially if re-rendering the same slide
          slideDiagramContainer.innerHTML = ''; 
          const { svg } = await mermaid.render(`slide-diagram-${currentSlide.value}`, currentDiagram);
          slideDiagramContainer.innerHTML = svg;
        }
      }
    }
    
    // Render regular diagrams
    for (let i = 0; i < diagrams.value.length; i++) {
      const container = diagramRefs.value[i];
      if (container instanceof HTMLElement && diagrams.value[i]) { // Check if container is HTMLElement and not null
        container.innerHTML = ''; // Clear previous diagram
        const { svg } = await mermaid.render(`diagram-${i}`, diagrams.value[i]);
        container.innerHTML = svg;
      }
    }
  } catch (error) {
    console.error('Error rendering diagrams:', error);
  }
};

// Slide navigation
const nextSlide = () => {
  if (currentSlide.value < slides.value.length - 1) {
    currentSlide.value++;
    resetAutoPlay();
  }
};

const previousSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
    resetAutoPlay();
  }
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
  resetAutoPlay();
};

// Auto-play functionality
const startAutoPlay = () => {
  if (!isAutoPlaying.value || isPaused.value) return; // Added isPaused check
  
  const currentSlideData = slides.value[currentSlide.value];
  slideDuration.value = Math.max(5000, currentSlideData?.readingTime * 1000 || 8000);
  slideElapsed.value = 0;
  autoPlayProgress.value = 0; // Reset progress

  if (progressTimer) clearInterval(progressTimer); // Clear existing timer

  progressTimer = window.setInterval(() => {
    if (isPaused.value) return; // Don't advance if paused
    slideElapsed.value += 100;
    autoPlayProgress.value = (slideElapsed.value / slideDuration.value) * 100;
    
    if (slideElapsed.value >= slideDuration.value) {
      if (currentSlide.value < slides.value.length - 1) {
        nextSlide(); // This will call resetAutoPlay which restarts the timer for the new slide
      } else {
        isAutoPlaying.value = false; // Stop autoplay at the end
        if (progressTimer) clearInterval(progressTimer);
        progressTimer = null;
        // Optionally: isPaused.value = true; to show play icon
      }
    }
  }, 100);
};

const pauseAutoPlay = () => {
  isPaused.value = !isPaused.value;
  if (isPaused.value) {
    if (progressTimer) {
      // clearInterval(progressTimer); // Don't clear, just pause counting in interval callback
    }
  } else {
    if (isAutoPlaying.value) { // Only restart if autoplay is generally on
        // To resume from where it left off, we don't reset slideElapsed here
        // startAutoPlay will restart the interval using current slideElapsed if not reset
        startAutoPlay(); 
    }
  }
};

const resetAutoPlay = () => {
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
  
  if (isAutoPlaying.value && !isPaused.value) {
    startAutoPlay();
  }
};

// Utility functions
const getAnalysisBannerClass = () => {
  const type = analysisResult.value?.type;
  const baseClass = 'analysis-banner-content';
  
  switch (type) {
    case 'leetcode':
      return `${baseClass} leetcode-banner`;
    case 'systemDesign':
      return `${baseClass} system-design-banner`;
    default:
      return `${baseClass} general-banner`;
  }
};

const getAnalysisIcon = () => {
  switch (analysisResult.value?.type) {
    case 'leetcode': return CodeBracketIcon;
    case 'systemDesign': return CpuChipIcon;
    default: return LightBulbIcon;
  }
};

const getDifficultyClass = () => {
  const difficulty = analysisResult.value?.difficulty;
  return `difficulty-${difficulty?.toLowerCase() || 'unknown'}`;
};

const getComplexityClass = (complexity?: string) => {
  if (!complexity) return 'complexity-unknown';
  
  if (complexity.includes('O(1)') || complexity.includes('O(log')) {
    return 'complexity-good';
  } else if (complexity.includes('O(n)')) {
    return 'complexity-fair';
  } else if (complexity.includes('O(n²)') || complexity.includes('O(2^n)')) {
    return 'complexity-poor';
  }
  return 'complexity-unknown';
};

// Action handlers
const copyAllCode = async () => {
  const codeBlocks = document.querySelectorAll('pre code');
  const allCode = Array.from(codeBlocks).map(block => block.textContent || '').join('\n\n'); // Added null check for textContent
  
  try {
    await navigator.clipboard.writeText(allCode);
    // Show toast notification (implementation needed)
    console.log('All code copied to clipboard!');
  } catch (error) {
    console.error('Failed to copy code:', error);
  }
};

const exportDiagrams = () => {
  // Implementation for exporting diagrams
  console.log('Exporting diagrams...');
  // Example: You might want to iterate through diagramRefs or rendered SVGs
  // and use a library like 'canvas-toBlob' or 'FileSaver.js' to download them.
};

const exportSlides = () => {
  const slideData = slides.value.map(slide => ({
    title: slide.title,
    content: slide.content,
    diagram: slide.diagram
  }));
  
  const blob = new Blob([JSON.stringify(slideData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `slides-${Date.now()}.json`;
  document.body.appendChild(a); // Required for Firefox
  a.click();
  document.body.removeChild(a); // Clean up
  URL.revokeObjectURL(url);
};

const adjustFontSize = (delta: number) => {
  fontSize.value = Math.max(0.8, Math.min(2.0, fontSize.value + (delta * 0.1)));
  document.documentElement.style.setProperty('--content-font-scale', fontSize.value.toString());
};

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
  emit('toggle-fullscreen');
  
  // Re-render diagrams with new size
  nextTick(() => {
    renderDiagrams();
  });
};

const runTestCase = (index: number) => {
  // Placeholder for test case execution
  console.log(`Running test case ${index}:`, testCases.value[index]);
  // testCases.value[index].actual = "Some result"; // Example of updating actual result
};

// Watch for content changes
watch(() => props.content, () => {
  // Reset state related to previous content before processing new content
  currentSlide.value = 0;
  isAutoPlaying.value = false;
  isPaused.value = false;
  if (progressTimer) clearInterval(progressTimer);
  progressTimer = null;
  slides.value = [];
  diagrams.value = [];
  diagramRefs.value = []; // Clear refs

  processContent();
}, { immediate: true });

// Watch for slide changes
watch(currentSlide, () => {
  nextTick(() => {
    renderDiagrams(); // Re-render diagram for the new current slide
  });
});

// Cleanup
onBeforeUnmount(() => {
  if (progressTimer) {
    clearInterval(progressTimer);
  }
});

// Initialize
onMounted(() => {
  document.documentElement.style.setProperty('--content-font-scale', '1');
  // Initial processing is handled by the immediate watch on props.content
});
</script>

<style lang="postcss" scoped>
/* Base container with enhanced spacing for fullscreen */
.compact-message-container {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300;
}

.compact-message-container.fullscreen {
  @apply fixed inset-0 z-50 max-w-none mx-0 rounded-none shadow-2xl;
  --content-font-scale: 1.4;
}

.compact-message-container.coding-problem {
  @apply border-l-4 border-blue-500;
}

.compact-message-container.system-design {
  @apply border-l-4 border-purple-500;
}

/* Analysis banner with enhanced styling */
.analysis-banner {
  @apply px-6 py-4 border-b;
}

.leetcode-banner {
  @apply bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700;
}

.system-design-banner {
  @apply bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-700;
}

.general-banner {
  @apply bg-gray-50 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700;
}

.difficulty-badge {
  @apply px-2 py-1 text-xs font-semibold rounded-full;
}

.difficulty-easy {
  @apply bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200;
}

.difficulty-medium {
  @apply bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200;
}

.difficulty-hard {
  @apply bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200;
}

/* Slideshow container with enhanced presentation */
.slideshow-container {
  @apply min-h-96; /* Tailwind class, ensure your Tailwind config supports min-h-96 or use a specific value like min-height: 24rem; */
}

.slideshow-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700;
}

.slide-info {
  @apply flex-1;
}

.slide-title {
  @apply text-xl font-bold text-gray-900 dark:text-white mb-1;
  font-size: calc(1.25rem * var(--content-font-scale, 1));
}

.slide-meta {
  @apply flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400;
}

.slide-controls {
  @apply flex items-center gap-2;
}

.control-btn {
  @apply p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all;
}

/* Enhanced slide content with fullscreen optimization */
.slide-content {
  @apply p-8 min-h-96; /* Tailwind class, ensure your Tailwind config supports min-h-96 or use a specific value like min-height: 24rem; */
}

.fullscreen .slide-content {
  @apply p-12 min-h-screen;
}

.slide-content-inner {
  @apply prose prose-lg max-w-none dark:prose-invert;
  font-size: calc(1rem * var(--content-font-scale, 1));
  line-height: calc(1.7 * var(--content-font-scale, 1));
}

.fullscreen-slide {
  @apply prose-xl;
  font-size: calc(1.25rem * var(--content-font-scale, 1));
  line-height: calc(1.8 * var(--content-font-scale, 1));
}

/* Code slide enhancements */
.code-slide {
  @apply font-mono;
}

.enhanced-code-block {
  @apply bg-gray-900 dark:bg-gray-950 rounded-lg overflow-hidden my-4; /* Added my-4 for spacing */
}

.code-header {
  @apply flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-900 text-gray-300;
}

.code-language {
  @apply text-sm font-medium;
}

.copy-code-btn {
  @apply px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors text-white; /* Added text-white */
}

/* line-numbered styling is for the <code> block that contains spans */
:global(.hljs.line-numbered) { /* Using :global if hljs class is outside component scope */
  @apply block overflow-x-auto;
}
:global(.hljs .line-number) { /* Using :global */
  @apply inline-block w-8 text-right text-gray-500 mr-4 select-none; /* Added select-none */
}
:global(.hljs .line-content) { /* Using :global */
  @apply inline-block;
}


/* Diagram enhancements */
.slide-diagram,
.diagrams-section {
  @apply mt-6;
}

.diagram-container {
  @apply bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 overflow-auto; /* Added overflow-auto */
}

.mermaid-diagram :deep(svg) {
  @apply mx-auto max-w-full h-auto;
  max-height: 500px;
}

.fullscreen .mermaid-diagram :deep(svg) {
  max-height: 70vh;
}

/* Auto-play progress */
.auto-play-progress {
  @apply px-6 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700;
}

.progress-bar {
  @apply w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2;
}

.progress-fill {
  @apply h-full bg-blue-500 transition-all duration-100 ease-linear; /* Added ease-linear */
}

.progress-text {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

/* Slide navigation */
.slide-navigation {
  @apply flex items-center justify-center gap-2 p-4;
}

.nav-dot {
  @apply w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors cursor-pointer; /* Added cursor-pointer */
}

.nav-dot.active {
  @apply bg-blue-500 dark:bg-blue-400;
}

/* Complexity panel */
.complexity-panel {
  @apply p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700;
}

.complexity-title {
  @apply text-lg font-semibold mb-4 text-gray-900 dark:text-white;
}

.complexity-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.complexity-item {
  @apply flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow; /* Added shadow */
}

.complexity-item.full-width {
  @apply md:col-span-2 flex-col items-start;
}

.complexity-label {
  @apply text-sm font-medium text-gray-600 dark:text-gray-400;
}

.complexity-value {
  @apply font-mono font-bold text-lg;
}

.complexity-good {
  @apply text-green-600 dark:text-green-400;
}

.complexity-fair {
  @apply text-yellow-600 dark:text-yellow-400;
}

.complexity-poor {
  @apply text-red-600 dark:text-red-400;
}

.complexity-unknown {
  @apply text-gray-600 dark:text-gray-400;
}

/* Enhanced single content view */
.single-content {
  @apply p-6 prose max-w-none dark:prose-invert; /* Added prose for better default styling */
  font-size: calc(1rem * var(--content-font-scale, 1));
}

.fullscreen-content {
  @apply p-12;
}

/* Styling for elements within v-html if not covered by prose */
.single-content :deep(h1),
.single-content :deep(h2),
.single-content :deep(h3) {
  @apply font-bold text-gray-900 dark:text-white mb-4;
  font-size: calc(var(--base-size) * var(--content-font-scale, 1)); /* Keep this if prose doesn't scale with var */
}

.single-content :deep(h1) { --base-size: 2rem; }
.single-content :deep(h2) { --base-size: 1.75rem; }
.single-content :deep(h3) { --base-size: 1.5rem; }

.single-content :deep(p) {
  @apply mb-4 text-gray-700 dark:text-gray-300 leading-relaxed;
  font-size: calc(1rem * var(--content-font-scale, 1)); /* Keep this if prose doesn't scale with var */
}

.single-content :deep(pre) {
  @apply bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto my-6;
  font-size: calc(0.875rem * var(--content-font-scale, 1)); /* Keep this if prose doesn't scale with var */
}

.single-content :deep(code) {
  @apply font-mono;
}

.single-content :deep(ul),
.single-content :deep(ol) {
  @apply mb-4 pl-6;
}

.single-content :deep(li) {
  @apply mb-2 text-gray-700 dark:text-gray-300;
  font-size: calc(1rem * var(--content-font-scale, 1)); /* Keep this if prose doesn't scale with var */
}

/* Actions toolbar */
.actions-toolbar {
  @apply flex items-center justify-between px-6 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700;
}

.action-group {
  @apply flex items-center gap-2;
}

.action-btn {
  @apply flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors;
}

.action-text {
  @apply hidden sm:inline;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .slideshow-header {
    @apply flex-col items-start gap-4;
  }
  
  .slide-controls {
    @apply w-full justify-center;
  }
  
  .complexity-grid {
    @apply grid-cols-1;
  }
  
  .actions-toolbar {
    @apply flex-col gap-4 items-stretch; /* items-stretch for full width buttons in group */
  }
  
  .action-group {
    @apply w-full flex justify-around; /* justify-around or justify-center */
  }
}

/* Enhanced content formatting helpers */
:deep(.highlight-keyword) {
  @apply bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-1 rounded font-semibold; /* Added font-semibold */
}

:deep(.highlight-approach) {
  @apply bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-1 rounded font-semibold; /* Added font-semibold */
}

:deep(.highlight-component) {
  @apply bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-1 rounded font-semibold; /* Added font-semibold */
}

/* Complexity breakdown styling (within slide content) */
:deep(.complexity-breakdown) { /* Using :deep as this class is applied via v-html */
  @apply text-center;
}

:deep(.complexity-cards) {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6 my-8;
}

:deep(.complexity-card) {
  @apply p-6 bg-gradient-to-br rounded-xl shadow-lg; /* Increased shadow */
}

:deep(.complexity-card.time) {
  @apply from-blue-100 to-blue-200 dark:from-blue-800/30 dark:to-blue-700/30; /* Adjusted gradient */
}

:deep(.complexity-card.space) {
  @apply from-green-100 to-green-200 dark:from-green-800/30 dark:to-green-700/30; /* Adjusted gradient */
}

:deep(.complexity-card h4) {
  @apply text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center justify-center gap-2; /* Centered icon and text */
}

:deep(.complexity-card .complexity-value) {
  @apply text-3xl font-mono font-bold mb-2 text-gray-900 dark:text-white;
}

:deep(.complexity-card p) {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

:deep(.complexity-explanation) {
    @apply mt-4 text-left p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md;
}
</style>