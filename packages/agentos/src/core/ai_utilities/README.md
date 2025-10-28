# AgentOS AI Utilities (`ai_utilities`)

**Version:** 1.1
**Status:** Core Interfaces and Implementations Defined
**Last Updated:** May 23, 2025

## 1. Overview

The `ai_utilities` module provides a standardized suite of AI-driven and statistical Natural Language Processing (NLP) tools for use across the AgentOS backend. These utilities abstract common tasks, allowing components like the Generalized Mind Instance (GMI) and various managers (RAG, Memory Lifecycle) to leverage powerful text processing capabilities without being tightly coupled to specific underlying technologies (LLMs, NLP libraries).

The core of this module is the `IUtilityAI` interface, which defines a comprehensive contract for these services.

## 2. Core Interface: `IUtilityAI.ts`

`IUtilityAI.ts` defines the contract for all utility AI implementations. Key functionalities include:

* **Text Summarization**: Creating concise summaries.
* **Text Classification**: Categorizing text.
* **Keyword Extraction**: Identifying key terms.
* **Tokenization**: Splitting text into words or sentences.
* **Stemming**: Reducing words to their root form.
* **Text Similarity**: Comparing texts lexically or semantically.
* **Sentiment Analysis**: Determining emotional tone.
* **Language Detection**: Identifying text language.
* **Text Normalization**: Cleaning and standardizing text.
* **N-gram Generation**: Creating word sequences.
* **Readability Assessment**: Calculating text readability scores.
* **Safe JSON Parsing**: Robustly parsing JSON from strings, with LLM-based error correction.

Each method allows for `options` to specify behavior, including the `method` (e.g., 'llm' vs. statistical algorithm) and `modelId` if applicable.

## 3. Provided Implementations

### 3.1. `LLMUtilityAI.ts`
* **Primary Engine**: Large Language Models (LLMs), accessed via `AIModelProviderManager`.
* **Strengths**: Excels at tasks requiring deep semantic understanding, nuance, and generation (e.g., abstractive summarization, complex classification, semantic similarity, robust JSON fixing).
* **Behavior**: For tasks not well-suited to direct LLM calls (e.g., traditional stemming, N-gram generation), it may offer basic JavaScript fallbacks or indicate non-support.
* **Configuration**: `LLMUtilityAIConfig` (extends `UtilityAIConfigBase`) allows specifying the `AIModelProviderManager` and default/task-specific LLM model IDs.

### 3.2. `StatisticalUtilityAI.ts`
* **Primary Engine**: Statistical NLP techniques, primarily using the `natural` library.
* **Strengths**: Faster, more cost-effective, and deterministic for many standard NLP tasks (e.g., rule-based normalization, tokenization, TF-IDF keywords, lexicon-based sentiment). Supports training and persistence of simple models like Naive Bayes classifiers.
* **Behavior**: For tasks requiring generative capabilities or deep understanding (e.g., abstractive summarization), it will offer simpler extractive/algorithmic alternatives or indicate non-support.
* **Configuration**: `StatisticalUtilityAIConfig` (extends `UtilityAIConfigBase`) allows specifying paths to resources like custom stop word lists, sentiment lexicons, and pre-trained statistical models.

### 3.3. `HybridUtilityAI.ts` (Recommended Primary Utility)
* **Primary Engine**: Acts as a dispatcher, utilizing both an injected `AIModelProviderManager` (for LLM tasks) and an injected `StatisticalUtilityAI` instance (for statistical tasks).
* **Strengths**: Offers the "best of both worlds" by allowing tasks to be routed to the most appropriate engine. This provides the flexibility to balance performance, cost, and accuracy.
* **Behavior**: The choice of engine for a given task is determined by:
    1.  The `method` field in the `options` object passed to the specific utility function call.
    2.  Default methods configured in `HybridUtilityAIConfig` if no method is specified in the call options.
* **Configuration**: `HybridUtilityAIConfig` (extends `UtilityAIConfigBase`) allows defining default methods for tasks and preferred LLM models for when the LLM engine is chosen.

## 4. Configuration

* **`config/HybridUtilityAIConfig.ts`**: Defines `HybridUtilityAIConfig` which allows setting default dispatch strategies (LLM vs. Statistical) for various tasks and preferred LLM models for those tasks.
* Each utility implementation (`LLMUtilityAI`, `StatisticalUtilityAI`) also has its own more specific configuration needs, typically extending `UtilityAIConfigBase`.

## 5. Usage

Components within AgentOS (like `GMI.ts` or `MemoryLifecycleManager.ts`) should be designed to receive an instance of `IUtilityAI` through dependency injection. This allows the system administrator or application setup to choose and configure the most appropriate utility implementation (e.g., `HybridUtilityAI` for general use, or a specialized one if needed).

**Example (Conceptual GMI usage):**

```typescript
// In GMI initialization
// this.utilityAI = new HybridUtilityAI(hybridConfig, llmProviderManager, statisticalUtility);

// In GMI self-reflection
// const parsedData = await this.utilityAI.parseJsonSafe(llmOutputString, { attemptFixWithLLM: true });

// In MemoryLifecycleManager for summarization
// const summary = await this.utilityAI.summarize(itemContent, { method: 'abstractive_llm', desiredLength: 'short' });
```

By using the options.method parameter in calls to IUtilityAI functions, developers can further control the execution strategy at runtime, overriding any defaults set in the HybridUtilityAIConfig.