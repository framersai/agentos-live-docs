// frontend/src/utils/ContentAnalyzer.ts - Advanced Content Analysis and Problem Detection

// Exporting interfaces needed by other modules (e.g., Home.vue)
export interface LeetCodePattern {
  keywords: string[];
  patterns: RegExp[];
  problemTypes: string[];
  dataStructures: string[];
  algorithms: string[];
}

export interface SystemDesignPattern {
  keywords: string[];
  patterns: RegExp[];
  components: string[];
  concepts: string[];
}

export interface ComplexityInfo {
  time?: string;
  space?: string;
  explanation?: string;
  approach?: string;
  optimizations?: string[];
}

export interface CodeBlock {
  type: 'fenced' | 'inline';
  language?: string;
  code: string;
  fullMatch: string;
  lineCount: number;
  hasComments: boolean;
  complexity?: string;
}

export interface DiagramHint {
  type: 'tree' | 'graph' | 'array' | 'system' | 'flowchart';
  description: string;
  mermaidCode?: string;
  priority: number;
}

export interface ContentSuggestion {
  type: 'diagram' | 'complexity' | 'code' | 'explanation' | 'example';
  message: string;
  priority: 'high' | 'medium' | 'low';
  implementation?: string;
}

export interface ProblemMetadata {
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  category?: string;
  approach?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  dataStructures?: string[];
  algorithms?: string[];
  patterns?: string[];
}

// Define the union type for content types - Added 'error' type
export type ContentAnalysisType = 'leetcode' | 'systemDesign' | 'concept' | 'tutorial' | 'documentation' | 'general' | 'error';

export interface ContentAnalysis {
  type: ContentAnalysisType;
  subtype?: string;
  confidence: number;
  displayTitle?: string;
  shouldVisualize: boolean;
  shouldGenerateDiagram: boolean;
  shouldCreateSlides: boolean;
  interactiveElements: boolean;
  complexity: ComplexityInfo | null;
  codeBlocks: CodeBlock[];
  estimatedReadTime: number; // in seconds
  wordCount: number;
  problemMetadata?: ProblemMetadata;
  language: string | null;
  keywords: string[];
  entities: string[];
  suggestions: ContentSuggestion[];
  diagramHints: DiagramHint[];
  slideCount: number;
  slideDuration: number; // Default duration per slide in ms
  slideTopics: string[];
}

interface AdvancedPatterns {
  leetcode: LeetCodePattern;
  systemDesign: SystemDesignPattern;
  complexity: {
    time: RegExp[];
    space: RegExp[];
    combined: RegExp[];
  };
  codeBlocks: {
    fenced: RegExp;
    inline: RegExp;
    withComments: RegExp;
  };
  diagrams: {
    mermaid: RegExp;
    plantuml: RegExp;
    ascii: RegExp;
  };
}

export class ContentAnalyzer {
  private readonly patterns: AdvancedPatterns = {
    leetcode: {
      keywords: [
        'two sum', 'three sum', 'binary search', 'binary tree', 'linked list',
        'dynamic programming', 'dp', 'sliding window', 'two pointers', 'backtracking',
        'divide and conquer', 'greedy', 'graph traversal', 'dfs', 'bfs',
        'trie', 'heap', 'priority queue', 'stack', 'queue', 'hash map', 'hash table',
        'easy problem', 'medium problem', 'hard problem', 'leetcode',
        'coding interview', 'technical interview', 'algorithm problem',
        'brute force', 'naive approach', 'optimal solution', 'efficient solution',
        'recursive', 'iterative', 'memoization', 'tabulation',
        'time complexity', 'space complexity', 'big o', 'o(n)', 'o(1)', 'o(log n)',
        'o(n²)', 'o(2^n)', 'o(n log n)', 'linear', 'logarithmic', 'quadratic', 'exponential'
      ],
      patterns: [
        /(?:problem|question)[:\s]*(.{1,100})/i, /(?:given|input)[:\s]*(.{1,150})/i,
        /(?:return|output|find)[:\s]*(.{1,100})/i, /(?:example|test case)[:\s]*(.{1,200})/i,
        /(?:constraint|limit)[s]?[:\s]*(.{1,100})/i, /(?:follow[- ]?up|extension)[:\s]*(.{1,100})/i,
        /(?:approach|solution|algorithm)[:\s]*(.{1,200})/i, /(?:step \d+|first|second|third|then|next|finally)[:\s]*(.{1,150})/i
      ],
      problemTypes: [
        'array manipulation', 'string processing', 'tree traversal', 'graph algorithms',
        'dynamic programming', 'searching', 'sorting', 'linked list operations',
        'stack/queue problems', 'hash table usage', 'bit manipulation', 'math problems'
      ],
      dataStructures: [
        'array', 'string', 'linked list', 'binary tree', 'binary search tree', 'bst',
        'heap', 'priority queue', 'stack', 'queue', 'hash map', 'hash set', 'hash table',
        'trie', 'graph', 'matrix', 'prefix tree'
      ],
      algorithms: [
        'binary search', 'depth-first search', 'dfs', 'breadth-first search', 'bfs', 'merge sort',
        'quick sort', 'dijkstra', 'union find', 'topological sort', 'kadane algorithm',
        'kmp algorithm', 'sliding window', 'two pointers', 'backtracking'
      ]
    },
    systemDesign: {
      keywords: [
        'load balancer', 'api gateway', 'microservices', 'database', 'cache', 'cdn',
        'message queue', 'pub/sub', 'event streaming', 'service mesh', 'horizontal scaling',
        'vertical scaling', 'sharding', 'replication', 'consistency', 'availability',
        'partition tolerance', 'cap theorem', 'eventual consistency', 'acid properties',
        'base properties', 'event-driven architecture', 'domain-driven design', 'cqrs',
        'event sourcing', 'saga pattern', 'circuit breaker', 'bulkhead pattern', 'rate limiting',
        'kubernetes', 'docker', 'redis', 'elasticsearch', 'kafka', 'rabbitmq',
        'nginx', 'apache', 'mysql', 'postgresql', 'mongodb', 'cassandra', 'design a system',
        'system architecture'
      ],
      patterns: [
        /design\s+(?:a|an|the)?\s*(.{1,50})\s*(?:system|application|service)/i,
        /how\s+(?:would\s+you\s+)?(?:design|build|architect|scale)\s+(.{1,100})/i,
        /(?:scalability|performance|availability)\s+(?:requirements|considerations|challenges)/i,
        /(?:database|storage|caching)\s+(?:design|strategy|approach)/i,
        /(?:api|service|component)\s+(?:design|architecture|structure)/i,
        /(?:traffic|load|users?)\s+(?:handling|management|distribution)/i
      ],
      components: [
        'web servers', 'application servers', 'databases', 'caches', 'load balancers',
        'content delivery networks', 'message brokers', 'search engines', 'monitoring systems'
      ],
      concepts: [
        'high availability', 'fault tolerance', 'disaster recovery', 'data consistency',
        'performance optimization', 'cost optimization', 'security considerations'
      ]
    },
    complexity: {
      time: [ /time\s+complexity(?:is)?[:\s]*O\(([^)]+)\)/gi, /runtime(?:is)?[:\s]*O\(([^)]+)\)/gi, /(?:takes|runs\s+in)[:\s]*O\(([^)]+)\)/gi ],
      space: [ /space\s+complexity(?:is)?[:\s]*O\(([^)]+)\)/gi, /memory\s+usage(?:is)?[:\s]*O\(([^)]+)\)/gi, /(?:uses|requires)[:\s]*O\(([^)]+)\)\s*(?:space|memory)/gi ],
      combined: [ /O\(([^)]+)\)\s*(?:for\s*)?(?:time|space|memory)/gi, /complexity(?:is)?[:\s]*O\(([^)]+)\)/gi ]
    },
    codeBlocks: {
      fenced: /```(?:(\w+)\n)?([\s\S]*?)\n?```/g,
      inline: /`([^`\n]+?)`/g,
      withComments: /(?:\/\/|#|\/\*[\s\S]*?\*\/|).*/g
    },
    diagrams: {
      mermaid: /```mermaid\n([\s\S]*?)\n```/g,
      plantuml: /```plantuml\n([\s\S]*?)\n```/g,
      ascii: /```(?:text|ascii)?\n([\s\S]*?(?:[-+|=]{3,}|[┌┬┐└┴┘├┼┤│─]{2,})[\s\S]*?)\n```/g
    }
  };

  private readonly leetcodeProblemKeywords = new Map<string, Partial<ProblemMetadata>>([
    ['two sum', { difficulty: 'Easy', category: 'Array', approach: 'Hash Map', dataStructures: ['Array', 'Hash Map'], algorithms: ['Hash Table lookup'] }],
    ['reverse linked list', { difficulty: 'Easy', category: 'Linked List', approach: 'Iterative or Recursive', dataStructures: ['Linked List'], algorithms: ['Two Pointers'] }],
    ['binary tree inorder traversal', { difficulty: 'Easy', category: 'Tree', approach: 'Recursion or Iteration with Stack', dataStructures: ['Binary Tree', 'Stack'], algorithms: ['DFS']}],
  ]);

  public analyzeContent(content: string, mode: string = 'general'): ContentAnalysis {
    const analysis: ContentAnalysis = {
      type: 'general', confidence: 0, shouldVisualize: false, shouldGenerateDiagram: false,
      shouldCreateSlides: false, interactiveElements: false, complexity: null, codeBlocks: [],
      estimatedReadTime: 0, wordCount: 0, language: null, keywords: [], entities: [],
      suggestions: [], diagramHints: [], slideCount: 0, slideDuration: 7000, slideTopics: [],
      displayTitle: 'General Content'
    };

    if (!content || typeof content !== 'string' || content.trim() === "") {
        return analysis;
    }

    analysis.wordCount = this.countWords(content);
    analysis.estimatedReadTime = this.calculateReadTime(content);

    const typeResult = this.determineContentType(content, mode);
    analysis.type = typeResult.type;
    analysis.subtype = typeResult.subtype;
    analysis.confidence = typeResult.confidence;
    analysis.keywords = typeResult.keywords;
    analysis.displayTitle = this.getDisplayTitle(analysis.type, analysis.subtype);

    analysis.codeBlocks = this.extractCodeBlocks(content);
    analysis.language = this.detectLanguage(content, analysis.codeBlocks);
    analysis.complexity = this.extractComplexity(content);

    if (analysis.type === 'leetcode') {
      analysis.problemMetadata = this.analyzeLeetCodeProblem(content, analysis.keywords);
      analysis.interactiveElements = true;
    } else if (analysis.type === 'systemDesign') {
        analysis.interactiveElements = true;
    }

    analysis.diagramHints = this.generateDiagramHints(analysis, content);
    analysis.suggestions = this.generateSuggestions(analysis, content);

    analysis.shouldVisualize = this.shouldVisualize(analysis);
    analysis.shouldGenerateDiagram = this.shouldGenerateDiagram(analysis);
    analysis.shouldCreateSlides = this.shouldCreateSlides(analysis);

    if (analysis.shouldCreateSlides) {
      const slideData = this.planSlides(content, analysis);
      analysis.slideCount = slideData.count;
      analysis.slideDuration = slideData.duration;
      analysis.slideTopics = slideData.topics;
    }

    return analysis;
  }

  private getDisplayTitle(type: ContentAnalysisType, subtype?: string): string {
    if (subtype) {
        return `${type.charAt(0).toUpperCase() + type.slice(1)}: ${subtype.charAt(0).toUpperCase() + subtype.slice(1)}`;
    }
    const titles: Record<string, string> = {
        leetcode: "LeetCode Problem",
        systemDesign: "System Design Discussion",
        concept: "Conceptual Explanation",
        tutorial: "Tutorial / Guide",
        documentation: "Documentation Snippet",
        general: "General Content",
        error: "Error Occurred"
    };
    return titles[type] || "Content";
  }

  private determineContentType(content: string, mode: string): {
    type: ContentAnalysisType; subtype?: string; confidence: number; keywords: string[];
  } {
    const normalizedContent = content.toLowerCase();
    const scores = new Map<ContentAnalysisType, number>([
        ['leetcode', 0], ['systemDesign', 0], ['concept', 0],
        ['tutorial', 0], ['documentation', 0], ['general', 0]
    ]);
    const detectedKeywords: Set<string> = new Set();
    const codeBlockCount = this.extractCodeBlocks(content).length;

    // Scoring logic
    let leetcodeScore = 0;
    this.patterns.leetcode.keywords.forEach(kw => { if (normalizedContent.includes(kw)) { leetcodeScore += this.getKeywordWeight(kw); detectedKeywords.add(kw); } });
    this.patterns.leetcode.patterns.forEach(p => { if (p.test(content)) leetcodeScore += 3; });
    if (content.match(/```(?:python|java|c\+\+|javascript|swift|kotlin|go|rust)/i)) leetcodeScore += 2;
    if (normalizedContent.includes("leetcode") || normalizedContent.includes("coding problem")) leetcodeScore += 5;
    scores.set('leetcode', leetcodeScore);

    let systemDesignScore = 0;
    this.patterns.systemDesign.keywords.forEach(kw => { if (normalizedContent.includes(kw)) { systemDesignScore += this.getKeywordWeight(kw); detectedKeywords.add(kw); } });
    this.patterns.systemDesign.patterns.forEach(p => { if (p.test(content)) systemDesignScore += 4; });
    if (normalizedContent.includes("design a") || normalizedContent.includes("system architecture")) systemDesignScore += 5;
    scores.set('systemDesign', systemDesignScore);

    if (codeBlockCount > 1 && (normalizedContent.includes("how to") || normalizedContent.includes("step-by-step"))) {
        scores.set('tutorial', (scores.get('tutorial') || 0) + codeBlockCount * 1.5 + 3);
    } else if (codeBlockCount > 0 && (normalizedContent.includes("api documentation") || normalizedContent.includes("reference"))) {
        scores.set('documentation', (scores.get('documentation') || 0) + codeBlockCount * 1 + 2);
    }
    if (codeBlockCount <= 1 && (normalizedContent.includes("explain") || normalizedContent.includes("what is") || normalizedContent.includes("concept of"))) {
        scores.set('concept', (scores.get('concept') || 0) + 3);
    }

    const modeBias = this.getModeBias(mode);
    scores.forEach((score, type) => { if (modeBias.has(type)) scores.set(type, score * (modeBias.get(type) ?? 1)); });

    let maxScore = -1;
    let initialWinnerType: ContentAnalysisType = 'general';
    scores.forEach((score, typeKey ) => {
      const type = typeKey as ContentAnalysisType;
      if (score > maxScore) {
        maxScore = score;
        initialWinnerType = type;
      }
    });
    if (maxScore <= 0 && initialWinnerType === 'general') {
        maxScore = 0;
    }

    let subtype: string | undefined;
    switch (initialWinnerType) {
        case 'leetcode':
            subtype = this.determineLeetCodeSubtype(content, Array.from(detectedKeywords));
            break;
        case 'systemDesign':
            const systemNameMatch = content.match(this.patterns.systemDesign.patterns[0]);
            if (systemNameMatch && systemNameMatch[1]) {
                subtype = systemNameMatch[1].trim();
            }
            break;
        // Default: subtype remains undefined for other types
    }

    let finalWinnerTypeResult: ContentAnalysisType = initialWinnerType;

    if (maxScore < 3) { // Low confidence override
      finalWinnerTypeResult = codeBlockCount > 0 ? 'general' : 'concept';

      // If the original type was one that had a subtype (leetcode or systemDesign),
      // and it's now overridden to 'general' or 'concept', clear the subtype.
      if (initialWinnerType === 'leetcode' || initialWinnerType === 'systemDesign') {
        subtype = undefined;
      }
    }

    // Fixed: Use string comparison instead of ContentAnalysisType comparison
    const confidence = Math.min(maxScore / (mode === finalWinnerTypeResult.toString() ? 15 : 25), 1.0);

    return {
      type: finalWinnerTypeResult,
      subtype,
      confidence,
      keywords: Array.from(detectedKeywords).slice(0, 10)
    };
  }

  private analyzeLeetCodeProblem(content: string, keywords: string[]): ProblemMetadata {
    const metadata: ProblemMetadata = {};
    const normalizedContent = content.toLowerCase();

    for (const [problemName, knownMeta] of this.leetcodeProblemKeywords) {
        if (normalizedContent.includes(problemName)) {
            return { ...metadata, ...knownMeta, category: knownMeta.category || problemName };
        }
    }
    const difficultyMatch = content.match(/\b(easy|medium|hard)(?:\s+(?:problem|question|level))?\b/i);
    if (difficultyMatch) metadata.difficulty = difficultyMatch[1].charAt(0).toUpperCase() + difficultyMatch[1].slice(1).toLowerCase() as ProblemMetadata['difficulty'];
    metadata.dataStructures = this.patterns.leetcode.dataStructures.filter(ds => keywords.some(kw => kw.includes(ds.toLowerCase())) || normalizedContent.includes(ds.toLowerCase()));
    metadata.algorithms = this.patterns.leetcode.algorithms.filter(algo => keywords.some(kw => kw.includes(algo.toLowerCase())) || normalizedContent.includes(algo.toLowerCase()));
    const approachKeywords = ['brute force', 'optimal', 'recursive', 'iterative', 'dp', 'greedy', 'dynamic programming', 'divide and conquer', 'sliding window', 'two pointers'];
    for (const approach of approachKeywords) { if (normalizedContent.includes(approach)) { metadata.approach = approach; break; } }
    const complexityInfo = this.extractComplexity(content);
    if (complexityInfo) { metadata.timeComplexity = complexityInfo.time; metadata.spaceComplexity = complexityInfo.space; }
    if (!metadata.category) {
        if (metadata.dataStructures && metadata.dataStructures.length > 0) metadata.category = metadata.dataStructures[0];
        else if (metadata.algorithms && metadata.algorithms.length > 0) metadata.category = metadata.algorithms[0];
    }
    return metadata;
  }

  private extractCodeBlocks(content: string): CodeBlock[] {
    const blocks: CodeBlock[] = [];
    const fencedMatches = [...content.matchAll(this.patterns.codeBlocks.fenced)];
    fencedMatches.forEach(match => {
      const language = (match[1] || 'plaintext').toLowerCase();
      const code = match[2] || '';
      blocks.push({
        type: 'fenced', language, code, fullMatch: match[0],
        lineCount: code.split('\n').length,
        hasComments: this.patterns.codeBlocks.withComments.test(code),
        complexity: this.estimateCodeComplexity(code)
      });
    });
    return blocks;
  }

  private detectLanguage(content: string, codeBlocks: CodeBlock[]): string | null {
    const declaredLanguages = codeBlocks
      .map(block => block.language)
      .filter(lang => lang && lang !== 'unknown' && lang !== 'plaintext');
    if (declaredLanguages.length > 0) {
      const langCounts = declaredLanguages.reduce((acc, lang) => {
        acc[lang!] = (acc[lang!] || 0) + 1; return acc;
      }, {} as Record<string, number>);
      return Object.keys(langCounts).sort((a,b) => langCounts[b] - langCounts[a])[0];
    }
    if (/\b(def|import|class)\s/.test(content) && content.includes(':')) return 'python';
    if (/\b(function|const|let|var)\s/.test(content) && (content.includes('{') || content.includes('=>'))) return 'javascript';
    if (/\b(public\s+(class|static|void)|System\.out\.print)/.test(content)) return 'java';
    return null;
  }

  private generateDiagramHints(analysis: ContentAnalysis, content: string): DiagramHint[] {
    const hints: DiagramHint[] = [];
    const normalizedContent = content.toLowerCase();
    if (analysis.type === 'systemDesign' || normalizedContent.includes('architecture') || normalizedContent.includes('component diagram')) {
      hints.push({ type: 'system', description: 'System architecture diagram', priority: 9, mermaidCode: this.generateSystemArchitectureDiagram(content) });
    }
    if (analysis.type === 'leetcode' && analysis.problemMetadata?.dataStructures?.some(ds => ['tree', 'graph'].includes(ds.toLowerCase()))) {
        if (analysis.problemMetadata.dataStructures.includes('tree')) {
             hints.push({ type: 'tree', description: 'Tree structure visualization', priority: 8, mermaidCode: this.generateTreeDiagram(content) });
        } else {
             hints.push({ type: 'graph', description: 'Graph structure visualization', priority: 8, mermaidCode: this.generateGraphDiagram(content) });
        }
    }
    if (normalizedContent.includes('flowchart') || (normalizedContent.includes('algorithm') && normalizedContent.includes('steps'))) {
        hints.push({ type: 'flowchart', description: 'Algorithm/process flowchart', priority: 7, mermaidCode: this.generateFlowchartDiagram(content) });
    }
    return hints.sort((a, b) => b.priority - a.priority);
  }

  private generateSuggestions(analysis: ContentAnalysis, content: string): ContentSuggestion[] {
    const suggestions: ContentSuggestion[] = [];
    if (analysis.type === 'leetcode' && !analysis.complexity) {
      suggestions.push({ type: 'complexity', message: 'Add Big O complexity analysis', priority: 'high' });
    }
    if (analysis.type === 'concept' && analysis.codeBlocks.length === 0) {
      suggestions.push({ type: 'code', message: 'Include a code example', priority: 'medium' });
    }
    if (analysis.shouldGenerateDiagram && analysis.diagramHints.length > 0 && !content.match(this.patterns.diagrams.mermaid)) {
        suggestions.push({ type: 'diagram', message: `Consider adding a ${analysis.diagramHints[0].type} diagram`, priority: 'high', implementation: analysis.diagramHints[0].mermaidCode});
    }
     if (analysis.wordCount > 700) {
        suggestions.push({ type: 'explanation', message: 'Summarize key points or break into sections', priority: 'medium' });
    }
    return suggestions;
  }

  private generateTreeDiagram(content: string): string { return `graph TD\n    A[Root] --> B(Child1)\n    A --> C(Child2)`; }
  private generateGraphDiagram(content: string): string { return `graph LR\n    N1 --- N2\n    N2 --- N3\n    N1 --- N3`; }
  private generateSystemArchitectureDiagram(content: string): string { return `graph TB\n    User --> WebApp[Web App]\n    WebApp --> APIService[API Service]\n    APIService --> Database[(DB)]`; }
  private generateFlowchartDiagram(content: string): string { return `graph TD\n    Start --> Step1{Decision} -- Yes --> Step2 --> End\n    Step1 -- No --> Step3 --> End`; }

  private getKeywordWeight(keyword: string): number { return ['leetcode', 'system design', 'time complexity', 'big o'].some(h => keyword.includes(h)) ? 2 : 1; }
  private getModeBias(mode: string): Map<ContentAnalysisType, number> { const bias = new Map<ContentAnalysisType, number>(); if (mode === 'coding') bias.set('leetcode', 1.5).set('tutorial', 1.2); if (mode === 'system_design') bias.set('systemDesign', 1.8); return bias; }
  private determineLeetCodeSubtype(content: string, keywords: string[]): string { const ds = this.patterns.leetcode.dataStructures.find(d => keywords.includes(d.toLowerCase()) || content.toLowerCase().includes(d.toLowerCase())); const algo = this.patterns.leetcode.algorithms.find(a => keywords.includes(a.toLowerCase()) || content.toLowerCase().includes(a.toLowerCase())); if (ds && algo) return `${ds} + ${algo}`; return ds || algo || 'General Problem'; }
  private countWords(content: string): number { return content.split(/\s+/).filter(Boolean).length; }
  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200; const codeLinesPerMinute = 70;
    const codeBlockContent = (this.extractCodeBlocks(content) || []).map(b => b.code).join('\n');
    const codeLineCount = codeBlockContent.split('\n').length;
    const textContent = content.replace(/```[\s\S]*?```/g, '');
    const textWordCount = this.countWords(textContent);
    const timeForText = (textWordCount / wordsPerMinute) * 60;
    const timeForCode = (codeLineCount / codeLinesPerMinute) * 60;
    return Math.max(15, Math.round(timeForText + timeForCode));
  }

  private extractComplexity(content: string): ComplexityInfo | null {
    const info: ComplexityInfo = {}; const lowerContent = content.toLowerCase(); let match;
    for (const p of this.patterns.complexity.time) { p.lastIndex = 0; match = p.exec(content); if (match) { info.time = `O(${match[1]})`; break; } }
    for (const p of this.patterns.complexity.space) { p.lastIndex = 0; match = p.exec(content); if (match) { info.space = `O(${match[1]})`; break; } }
    if (!info.time && !info.space) { for (const p of this.patterns.complexity.combined) { p.lastIndex = 0; match = p.exec(content); if (match) { if (lowerContent.substring(0, match.index).includes('time')) info.time = `O(${match[1]})`; else if (lowerContent.substring(0, match.index).includes('space')) info.space = `O(${match[1]})`; else { info.time = `O(${match[1]})`; info.space = `O(${match[1]})`;} break; } } }
    return Object.keys(info).length > 0 ? info : null;
  }

  private estimateCodeComplexity(code: string): string {
    const loopKeywords = /\b(for|while|do)\b/g;
    const recursionPattern = /(\w+)\s*\([^)]*\)\s*{[\s\S]*?\b\1\b\s*\(/;

    let loopCount = (code.match(loopKeywords) || []).length;
    if (loopCount > 1 && code.match(/(\s+(for|while|do)[\s\S]*?\n)+\s+(for|while|do)/)) {
        loopCount = 2;
    }

    if (recursionPattern.test(code)) return 'O(2^N) or O(N)';
    if (loopCount >= 2) return 'O(N^2)';
    if (loopCount === 1) return 'O(N)';
    return 'O(1)';
  }

  private shouldVisualize(analysis: ContentAnalysis): boolean { return analysis.type === 'leetcode' || analysis.type === 'systemDesign' || (analysis.estimatedReadTime > 120 && analysis.codeBlocks.length > 0) || analysis.diagramHints.length > 0; }
  private shouldGenerateDiagram(analysis: ContentAnalysis): boolean { return analysis.diagramHints.length > 0 || analysis.type === 'systemDesign' || (analysis.type === 'leetcode' && analysis.problemMetadata?.dataStructures?.some(ds => ['tree', 'graph', 'linked list'].includes(ds.toLowerCase())) === true); }

  private shouldCreateSlides(analysis: ContentAnalysis): boolean {
    return (analysis.shouldVisualize ?? false) &&
           (analysis.wordCount > 300 ||
            analysis.codeBlocks.length > 0 ||
            analysis.type === 'leetcode' ||
            analysis.type === 'systemDesign');
  }

  private planSlides(content: string, analysis: ContentAnalysis): { count: number; duration: number; topics: string[] } {
    const topics: string[] = [];
    if (analysis.type === 'leetcode') { topics.push('Problem Statement', 'Approach & Logic'); if (analysis.codeBlocks.length > 0) topics.push('Code Implementation'); if (analysis.complexity) topics.push('Complexity Analysis');
    } else if (analysis.type === 'systemDesign') { topics.push('Requirements & Goals', 'High-Level Architecture', 'Components Deep-Dive', 'Trade-offs & Scalability');
    } else { const headers = content.match(/^#{1,3}\s+(.+)$/gm); if (headers && headers.length > 1) { topics.push(...headers.map(h => h.replace(/^#+\s+/, '').trim()).slice(0,5)); } else { const sections = Math.min(5, Math.max(1, Math.ceil(analysis.wordCount / 200))); for (let i = 1; i <= sections; i++) topics.push(`Key Section ${i}`); } }
    if (topics.length === 0) topics.push(analysis.displayTitle || "Overview");
    const slideDuration = Math.max(5000, Math.min(15000, Math.round(analysis.estimatedReadTime / Math.max(1, topics.length)) * 1000)); // Avoid division by zero
    return { count: topics.length, duration: slideDuration, topics };
  }

  public generateEnhancedPrompt(analysis: ContentAnalysis, originalSystemPrompt: string, language: string): string {
    let enhancedPrompt = originalSystemPrompt; const langOrDefault = language || 'python';
    enhancedPrompt += `\n\n## Content Analysis Insights (for AI model awareness):\n- Detected Content Type: ${analysis.type}\n- Detected Subtype/Topic: ${analysis.subtype || 'N/A'}\n- Primary Language (if code present): ${analysis.language || 'N/A'}\n- Estimated Reading Time: ${Math.ceil(analysis.estimatedReadTime / 60)} minutes\n- Keywords: ${analysis.keywords.join(', ')}`;
    if (analysis.type === 'leetcode') { enhancedPrompt += `\n- LeetCode Problem Metadata: Difficulty: ${analysis.problemMetadata?.difficulty || 'N/A'}, Data Structures: ${analysis.problemMetadata?.dataStructures?.join(', ') || 'N/A'}, Algorithms: ${analysis.problemMetadata?.algorithms?.join(', ') || 'N/A'}`; enhancedPrompt += `\n\n## Instructions for LeetCode Problem Response:\n1.  **Problem Understanding:** Briefly re-state the problem... \n2.  **Solution Approach:** Clearly explain your main approach... \n3.  **Code Implementation:** Provide a complete, correct, and runnable solution in \`\`\`${langOrDefault}\n ... \n\`\`\`...\n4.  **Complexity Analysis:**...\n5.  **(Optional) Alternative Approaches:**...`;
    } else if (analysis.type === 'systemDesign') { enhancedPrompt += `\n- System Design Keywords: ${analysis.keywords.filter(kw => this.patterns.systemDesign.keywords.includes(kw)).join(', ') || 'N/A'}`; enhancedPrompt += `\n\n## Instructions for System Design Response:\n1.  **Requirements Clarification (if needed):**...\n2.  **High-Level Design:**...\n3.  **Component Deep-Dive:**...\n4.  **Data Storage & Schema:**...\n5.  **Scalability and Availability:**...\n6.  **API Design (example):**...\n7.  **Trade-offs:**...`;
    } else if (analysis.type === 'tutorial') { enhancedPrompt += `\n\n## Instructions for Tutorial Response:\nProvide a clear, step-by-step tutorial. Include code examples in \`\`\`${analysis.language || langOrDefault}\n ... \n\`\`\` where appropriate...`;
    } else if (analysis.type === 'concept') { enhancedPrompt += `\n\n## Instructions for Concept Explanation:\nExplain the concept clearly and concisely...`; }
    if (analysis.shouldGenerateDiagram && analysis.diagramHints.length > 0) { const topHint = analysis.diagramHints[0]; enhancedPrompt += `\n\n**Diagram Request:** Please include a ${topHint.type} diagram using Mermaid syntax...`; }
    if (analysis.shouldCreateSlides) { enhancedPrompt += `\n\n**Presentation Structure:** Please structure your response with clear Markdown headings for sections like "${analysis.slideTopics.join('", "')}"...`; }
    enhancedPrompt += `\n\nEnsure your response is well-formatted with Markdown. Be accurate and helpful.`;
    return enhancedPrompt;
  }
}