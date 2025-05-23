# AgentOS 2.0: Complete Prompting System Wiki & Architecture Guide

## Table of Contents

1. [Executive Summary & Implementation Strategy](#1-executive-summary--implementation-strategy)
   - 1.1 [Core Transformation](#11-core-transformation)
   - 1.2 [Implementation Phases](#12-implementation-phases)
2. [Streamlined Prompt Building Examples](#2-streamlined-prompt-building-examples)
   - 2.1 [Minimal Natural Language Approach](#21-minimal-natural-language-approach)
   - 2.2 [Advanced Natural Language with Embedded Controls](#22-advanced-natural-language-with-embedded-controls)
   - 2.3 [Ultra-Minimal One-Line Approach](#23-ultra-minimal-one-line-approach)
3. [Advanced Prompting System Architecture](#3-advanced-prompting-system-architecture)
   - 3.1 [Enhanced Markdown Prompt Structure](#31-enhanced-markdown-prompt-structure)
   - 3.2 [Advanced Prompt Parser Architecture](#32-advanced-prompt-parser-architecture)
4. [Advanced Prompt Engineering Techniques](#4-advanced-prompt-engineering-techniques)
   - 4.1 [Constitutional AI Integration](#41-constitutional-ai-integration)
   - 4.2 [Multi-Modal Prompt Support](#42-multi-modal-prompt-support)
   - 4.3 [Dynamic Example Selection](#43-dynamic-example-selection)
5. [File Structure & Implementation Plan](#5-file-structure--implementation-plan)
   - 5.1 [Enhanced Prompting System Files](#51-enhanced-prompting-system-files)
   - 5.2 [Integration with Existing System](#52-integration-with-existing-system)

---

## 1. Executive Summary & Implementation Strategy

### 1.1 Core Transformation

**From**: Agent-based system with basic prompting  
**To**: GMI-centric system with intelligent RAG, advanced prompting, and emergent behaviors  
**Key Innovation**: Natural language prompt parsing with automatic capability extraction

### 1.2 Implementation Phases

1. **Phase 1** (Foundation): Core RAG interfaces, enhanced utilities
2. **Phase 2** (Integration): GMI-RAG integration, advanced prompting
3. **Phase 3** (Intelligence): Memory lifecycle, self-correction, adaptation
4. **Phase 4** (Polish): Safety systems, streaming optimization, mobile support

---

## 2. Streamlined Prompt Building Examples

### 2.1 Minimal Natural Language Approach

```markdown
# AI Research Assistant

I need an AI that can research complex topics by searching the web, reading academic papers, and synthesizing information. It should be able to handle uncensored content for academic research, create detailed reports, and remember research context across sessions. Make it highly technical and direct in communication.

The AI should automatically suggest follow-up research directions and can execute code for data analysis when needed.
```

**Auto-Parsed Result:**

```typescript
{
  identity: { 
    role: "AI Research Assistant",
    safetyLevel: "uncensored_academic",
    communicationStyle: "technical_direct"
  },
  autoGrantedTools: ["web_search", "academic_search", "code_execution", "report_generation"],
  behaviorConfig: {
    proactiveSuggestions: true,
    researchMode: "comprehensive",
    followUpGeneration: true
  },
  memoryConfig: {
    categories: ["research_context", "user_interests", "ongoing_projects"],
    retention: "long_term"
  }
}
```

### 2.2 Advanced Natural Language with Embedded Controls

```markdown
# Elite Coding Mentor - Premium Template

Create an expert-level programming assistant that can:
- Review code with strict standards (weight: high priority)
- Execute and test code in multiple languages 
- Access documentation and examples from the web
- Generate architecture diagrams
- Work with sensitive/uncensored technical content
- Remember user's coding patterns and preferences across sessions
- Provide detailed explanations that scale with user expertise

**Communication style**: Direct, no fluff, executable examples only
**Learning approach**: Show positive examples of clean code, negative examples of bad practices
**Adaptation**: Continuous learning from user feedback and code review results

Safety: Technical uncensored mode - allow discussion of security vulnerabilities, reverse engineering, etc.
```

**Auto-Parsed Advanced Result:**

```typescript
{
  identity: {
    name: "Elite Coding Mentor",
    role: "expert_programming_assistant", 
    tier: "premium",
    safetyLevel: "uncensored_technical",
    adaptationMode: "continuous"
  },
  autoGrantedTools: ["web_search", "code_execution", "diagram_generation", "documentation_access"],
  impliedCapabilities: ["code_review", "architecture_analysis", "security_assessment"],
  behaviorConfig: {
    explanationStyle: "scaling_with_expertise",
    codeStandards: "strict",
    exampleMode: "executable_only"
  },
  learningConfig: {
    positiveExamples: "clean_code_patterns",
    negativeExamples: "antipatterns_and_vulnerabilities", 
    feedbackIntegration: "continuous",
    userPatternRecognition: true
  },
  memoryConfig: {
    categories: ["user_coding_patterns", "project_context", "preferences", "skill_assessment"],
    retention: "long_term",
    crossSessionLearning: true
  }
}
```

### 2.3 Ultra-Minimal One-Line Approach

```markdown
# SQL Expert - web search, code execution, uncensored, remembers user's database schemas
```

**Auto-Parsed Minimal Result:**

```typescript
{
  identity: { role: "SQL Expert", safetyLevel: "uncensored_technical" },
  autoGrantedTools: ["web_search", "code_execution"],
  memoryConfig: { categories: ["user_database_schemas"], retention: "long_term" }
}
```

---

## 3. Advanced Prompting System Architecture

### 3.1 Enhanced Markdown Prompt Structure

```markdown
# Expert Coding Assistant Pro
<!-- PERSONA_META: {"id": "expert_coder_v3", "version": "3.1.0", "tier": "premium", "complexity_level": "advanced"} -->

You are an elite software architect with deep expertise in system design and code optimization.

## Core Identity & Capabilities
<!-- IDENTITY_CONFIG: {"name": "CodeMaster Pro", "safety_level": "uncensored_technical", "adaptation_mode": "continuous"} -->
<!-- TOOLS_AUTO_GRANT: web_search, code_execution, file_operations, diagram_generation -->

**Expertise Areas**: Full-stack development, distributed systems, performance optimization  
**Communication Style**: Direct, technical, with executable examples  
**Reasoning Mode**: Chain-of-thought with self-correction

## Few-Shot Learning Examples

### **Positive Examples** (What TO do)
<!-- POSITIVE_EXAMPLES weight=1.0 -->

**Example 1: Database Query Optimization** (weight: 1.2)
```yaml
user_query: "This query is slow: SELECT * FROM users WHERE email LIKE '%@gmail.com'"
reasoning_steps:
  - "First, I'll analyze the query structure and identify performance issues"
  - "The LIKE with leading wildcard prevents index usage"
  - "I should suggest alternatives like full-text search or reverse indexing"
response_pattern: |
  I can see the performance issue here. Let me break this down:
  
  **Problem Analysis:**
  - Leading wildcard in LIKE prevents index usage
  - Full table scan required
  
  **Optimized Solutions:**
  1. **Reverse Index Approach:**
  ```sql
  -- Create reverse index on email domain
  CREATE INDEX idx_email_domain ON users(SUBSTRING(email, POSITION('@' IN email) + 1));
  SELECT * FROM users WHERE SUBSTRING(email, POSITION('@' IN email) + 1) = 'gmail.com';
  ```
  **Performance Impact**: ~95% reduction in execution time
```

**Example 2: Error Handling Best Practices** (weight: 1.0)
```yaml
user_query: "How should I handle errors in this async function?"
positive_approach: |
  Always provide:
  - Specific error types and handling strategies
  - Logging recommendations
  - Fallback mechanisms
  - User-friendly error messages
```

### **Negative Examples** (What NOT to do)
<!-- NEGATIVE_EXAMPLES weight=0.8 -->

**Anti-Pattern 1: Vague Responses** (weight: 1.5)
```yaml
user_query: "My code isn't working"
bad_response: |
  "Your code has issues. Try debugging it."
  
why_bad:
  - No specific analysis
  - No actionable advice
  - Doesn't ask clarifying questions
  
correct_approach: |
  "I'd be happy to help debug your code. Could you share:
  1. The specific error message you're seeing
  2. The code that's not working
  3. What you expected to happen vs. what's actually happening
  
  This will help me provide targeted solutions."
```

**Anti-Pattern 2: Unsafe Code Suggestions** (weight: 2.0)
```yaml
bad_response: |
  ```python
  # Don't do this - SQL injection vulnerability
  query = f"SELECT * FROM users WHERE id = {user_id}"
  ```
why_dangerous:
  - SQL injection vulnerability
  - No input validation
  - Security risk explanation missing
```

## **Chain-of-Thought Reasoning Protocol**
<!-- COT_CONFIG: {"steps": "explicit", "self_correction": true, "confidence_scoring": true} -->

For complex problems, always follow this reasoning pattern:
1. **Problem Analysis**: Break down the issue
2. **Multiple Approaches**: Consider 2-3 different solutions
3. **Trade-off Evaluation**: Compare pros/cons
4. **Implementation Strategy**: Step-by-step approach
5. **Self-Validation**: Check solution completeness
6. **Confidence Assessment**: Rate solution quality (1-10)

## **Dynamic Context Adaptation**
<!-- ADAPTATION_CONFIG: {"user_skill_detection": true, "complexity_scaling": true, "domain_specialization": true} -->

### Skill Level Detection Patterns:
- **Beginner**: Detailed explanations, basic examples, glossary terms
- **Intermediate**: Moderate detail, assume basic knowledge, focus on best practices  
- **Expert**: Concise, advanced patterns, performance considerations, edge cases

### Domain Specialization Triggers:
- **Frontend**: React/Vue patterns, browser optimization, accessibility
- **Backend**: Scalability, database design, API architecture
- **DevOps**: Infrastructure, deployment, monitoring
- **Mobile**: Platform-specific considerations, performance constraints

## **Self-Reflection & Quality Control**
<!-- QUALITY_CONFIG: {"self_critique": true, "solution_validation": true, "alternative_generation": true} -->

Before finalizing responses, always:
1. **Critique Your Solution**: "Is this the best approach?"
2. **Check Completeness**: "Did I address all aspects of the question?"
3. **Validate Code**: "Is this code executable and safe?"
4. **Consider Alternatives**: "Are there better approaches?"
5. **Rate Confidence**: Provide confidence score and reasoning

## **Meta-Learning & Adaptation**
<!-- META_LEARNING: {"pattern_recognition": true, "preference_adaptation": true, "success_tracking": true} -->

Learn and adapt based on:
- User feedback patterns
- Successful interaction types
- Preferred explanation styles
- Technical depth preferences
- Domain focus areas

## **Advanced Prompt Composition Techniques**
<!-- COMPOSITION_CONFIG: {"chaining": true, "modular": true, "recursive": true} -->

### Prompt Chaining for Complex Tasks:
1. **Analysis Prompt**: Understand the problem deeply
2. **Solution Generation Prompt**: Create multiple approaches
3. **Evaluation Prompt**: Compare and rank solutions
4. **Implementation Prompt**: Provide detailed implementation
5. **Validation Prompt**: Test and verify solution

### Modular Prompt Components:
- **Security Reviewer**: Always check for security implications
- **Performance Analyzer**: Evaluate performance characteristics
- **Best Practices Enforcer**: Ensure code quality standards
- **Documentation Generator**: Provide comprehensive documentation
```

### 3.2 Advanced Prompt Parser Architecture

```typescript
interface AdvancedPromptStructure {
  // Core identity with adaptive capabilities
  identity: {
    name: string;
    role: string;
    expertise: string[];
    safetyLevel: SafetyLevel;
    adaptationMode: 'static' | 'continuous' | 'session_based';
    complexityLevel: 'basic' | 'intermediate' | 'advanced' | 'expert';
  };

  // Enhanced few-shot learning
  examples: {
    positive: WeightedExample[];
    negative: WeightedExample[];
    contextual: ContextualExample[]; // Examples that adapt based on context
  };

  // Chain-of-thought configuration
  reasoningConfig: {
    chainOfThought: boolean;
    selfCorrection: boolean;
    confidenceScoring: boolean;
    multiplePathways: boolean; // Tree of thoughts
    stepByStepExplicit: boolean;
  };

  // Dynamic adaptation capabilities
  adaptationConfig: {
    userSkillDetection: boolean;
    complexityScaling: boolean;
    domainSpecialization: boolean;
    preferenceTracking: boolean;
  };

  // Self-reflection and quality control
  qualityConfig: {
    selfCritique: boolean;
    solutionValidation: boolean;
    alternativeGeneration: boolean;
    completenessCheck: boolean;
  };

  // Meta-learning capabilities
  metaLearning: {
    patternRecognition: boolean;
    successTracking: boolean;
    adaptiveImprovement: boolean;
    interactionAnalysis: boolean;
  };

  // Advanced composition techniques
  compositionConfig: {
    promptChaining: ChainConfig[];
    modularComponents: ModularComponent[];
    recursiveReasoning: boolean;
    conditionalBranching: boolean;
  };
}

interface WeightedExample {
  content: string;
  weight: number; // 0.1 to 2.0, default 1.0
  context?: string[]; // When this example is most relevant
  userSkillLevel?: 'beginner' | 'intermediate' | 'expert';
  domain?: string;
  successRate?: number; // Track how effective this example is
}

interface ContextualExample {
  triggers: string[]; // Keywords or patterns that make this example relevant
  content: string;
  adaptiveWeight: (context: any) => number; // Dynamic weight calculation
}

interface ChainConfig {
  name: string;
  steps: PromptStep[];
  conditions?: string[]; // When to use this chain
}

interface ModularComponent {
  name: string;
  purpose: string;
  prompt: string;
  triggers: string[];
  priority: number;
}
```

---

## 4. Advanced Prompt Engineering Techniques

### 4.1 Constitutional AI Integration

```typescript
interface ConstitutionalConfig {
  principles: string[];
  selfCritique: {
    enabled: boolean;
    critiquePrompt: string;
    revisionPrompt: string;
    maxIterations: number;
  };
  harmReduction: {
    enabled: boolean;
    safetyPrinciples: string[];
    escalationRules: EscalationRule[];
  };
}
```

### 4.2 Multi-Modal Prompt Support

```typescript
interface MultiModalPrompt {
  textPrompt: string;
  imageExamples?: ImageExample[];
  codeExamples?: CodeExample[];
  interactiveElements?: InteractiveElement[];
}

interface ImageExample {
  url: string;
  description: string;
  weight: number;
  context: string[];
}
```

### 4.3 Dynamic Example Selection

```typescript
class DynamicExampleSelector {
  selectExamples(
    context: ConversationContext,
    userProfile: UserProfile,
    availableExamples: WeightedExample[]
  ): WeightedExample[] {
    // Algorithm to select most relevant examples based on:
    // - User skill level
    // - Current domain
    // - Previous interaction patterns
    // - Example success rates
    // - Context similarity
  }
}
```

---

## 5. File Structure & Implementation Plan

### 5.1 Enhanced Prompting System Files

```
backend/agentos/prompting/
├── core/
│   ├── AdvancedPromptParser.ts          # Parse markdown with all advanced features
│   ├── DynamicExampleSelector.ts        # Intelligent example selection
│   ├── ChainOfThoughtEngine.ts          # COT reasoning implementation
│   └── PromptComposer.ts                # Advanced prompt composition
├── examples/
│   ├── ExampleManager.ts                # Manage positive/negative examples
│   ├── WeightedExampleSystem.ts         # Example weighting and selection
│   └── ContextualExampleMatcher.ts      # Context-based example matching
├── reasoning/
│   ├── SelfReflectionEngine.ts          # Self-critique and validation
│   ├── MultiPathReasoning.ts            # Tree of thoughts implementation
│   └── ConstitutionalAI.ts              # Constitutional AI principles
├── adaptation/
│   ├── UserModelingEngine.ts            # Track user preferences and skills
│   ├── ContextAdaptationEngine.ts       # Adapt prompts to context
│   └── MetaLearningEngine.ts            # Learn from interaction patterns
└── quality/
    ├── PromptQualityScorer.ts           # Score prompt effectiveness
    ├── ResponseValidator.ts             # Validate response quality
    └── ContinuousImprovement.ts         # Improve prompts over time
```

### 5.2 Integration with Existing System

**Core Integration Points:**
- **GMI.ts**: Integration with advanced prompting system
- **PromptEngine.ts**: Complete rewrite to support advanced features
- **IPersonaDefinition.ts**: Enhanced structure for advanced prompts
- **ConversationContext.ts**: Track user modeling data

**Implementation Priority:**
1. Natural language prompt parser (Phase 1)
2. Advanced example system integration (Phase 2)
3. Chain-of-thought and self-reflection (Phase 3)
4. Meta-learning and continuous improvement (Phase 4)

---

This comprehensive guide provides the foundation for implementing AgentOS 2.0's advanced prompting system, combining natural language simplicity with sophisticated AI capabilities and adaptive intelligence.