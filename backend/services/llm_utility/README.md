Markdown

# AgentOS: Utility LLM Service

**Version:** 1.0
**Status:** Core Implementation

## 1. Overview

The `UtilityLLMService` provides a set of general-purpose functionalities leveraging Large Language Models (LLMs) through the configured `AIModelProviderManager`. Unlike the complex, persona-driven `GMI` (Generalized Mind Instance), this service offers direct access to common LLM tasks like direct prompting, text summarization, translation, classification, and structured data extraction.

It is designed to be:
* **Provider-Agnostic:** Works with any LLM provider configured in `AIModelProviderManager`.
* **Cost-Aware:** All LLM calls made through this service return usage and estimated cost information, inherited from the provider layer.
* **Configurable:** Allows specifying models, providers, and completion options on a per-request basis.
* **Stream-Capable:** Supports streaming responses for applicable methods (e.g., `streamDirectPrompt`, `streamSummarizeText`).

## 2. Core Functionalities & API

The service is typically instantiated once and shared or injected where needed.

```typescript
// Constructor
// const utilityLLMService = new UtilityLLMService(providerManager, promptEngine);

2.1. Direct Prompting

Allows sending a raw prompt (with an optional system prompt) to an LLM and getting its response.

    processDirectPrompt(request: DirectPromptRequest): Promise<UtilityLLMServiceOutput>
        DirectPromptRequest:
            prompt: string (User's main prompt/query)
            systemPrompt?: string (System-level instructions for the LLM)
            modelId?: string (e.g., "gpt-4o-mini", "anthropic/claude-3-haiku")
            providerId?: string (e.g., "openai", "openrouter", "ollama")
            taskHint?: string (Helps internal model selection, e.g., "creative_writing")
            completionOptions?: Partial<ModelCompletionOptions> (e.g., temperature, max_tokens)
        UtilityLLMServiceOutput:
            responseText: string | null
            usage?: ModelUsage (includes costUSD)
            error?: string
            isFinal: true
            providerId?: string (Provider used)
            modelIdUsed?: string (Model used)

    streamDirectPrompt(request: DirectPromptRequest): AsyncIterable<UtilityLLMServiceOutput>
        Same request structure.
        Yields UtilityLLMServiceOutput chunks. responseText in each non-final chunk is a delta. usage is typically in the final chunk.

2.2. Text Summarization

Generates a summary of a given text.

    summarizeText(request: SummarizationTaskRequest): Promise<UtilityLLMServiceOutput>
    streamSummarizeText(request: SummarizationTaskRequest): AsyncIterable<UtilityLLMServiceOutput>
        SummarizationTaskRequest:
            textToSummarize: string
            desiredLength?: 'short' | 'medium' | 'long' | number
            outputFormat?: 'paragraph' | 'bullet_points'
            modelId?, providerId?, completionOptions?
        Output is similar to processDirectPrompt.

2.3. Text Translation

Translates text from a source language to a target language.

    translateText(request: TranslationRequest): Promise<UtilityLLMServiceOutput>
        TranslationRequest:
            text: string
            targetLanguage: string (e.g., "Spanish", "fr-CA")
            sourceLanguage?: string (If omitted, model attempts auto-detection)
            modelId?, providerId?, completionOptions?

2.4. General Purpose Classification

Classifies text into one or more predefined categories.

    generalPurposeClassify(request: GeneralClassificationRequest): Promise<UtilityLLMServiceOutput & { classification?: { bestClass: string | string[], confidence?: number, allScores?: any } }>
        GeneralClassificationRequest:
            text: string
            categories: string[] (List of target categories)
            instruction?: string (Custom instruction for the LLM, e.g., "Focus on the user's intent.")
            modelId?, providerId?, completionOptions? (Recommend using response_format: {type: "json_object"})
        The classification field in the output will contain the LLM's structured JSON response.

2.5. Structured Data Extraction (Function Calling Simulation)

Extracts structured information from text based on a provided JSON schema. This simulates LLM function calling if the model supports it, or uses prompting with JSON mode for other models.

    extractStructuredData(request: StructuredExtractionRequest): Promise<UtilityLLMServiceOutput & { extractedData?: object }>
        StructuredExtractionRequest:
            text: string
            outputSchema: object (A JSON schema object defining the desired output structure)
            extractionInstruction?: string (e.g., "Extract the person's name, email, and company.")
            modelId?, providerId?, completionOptions?
        The extractedData field in the output will contain the parsed JSON object. If the model used tool calling, responseText might be null. If it used JSON mode, responseText will be the JSON string, and extractedData its parsed form.

3. Model Selection

The service uses an internal _selectProviderAndModel method. For each request, if providerId and modelId are not explicitly provided, it attempts a basic selection:

    If providerId is given, uses it. modelId defaults to that provider's default.
    If only modelId is given, it asks AIModelProviderManager for a suitable provider.
    If neither, it uses a very simple heuristic based on taskHint to pick from available models or defaults to the system's default provider and model.

For more advanced or LLM-driven model routing, the GMI or a dedicated IModelRouter should be used prior to calling this service if specific model intelligence is required beyond what this service's simple selection offers.
4. Error Handling & Cost

    All methods return a UtilityLLMServiceOutput (or yield it). If an error occurs during the LLM call or processing, the error field will be populated.
    The usage field (containing costUSD, promptTokens, etc.) is returned for successful calls, providing transparency into resource consumption.

5. Usage Example
TypeScript

// Assuming 'utilityLLMService' is an initialized instance

async function exampleUsage() {
  try {
    const summaryOutput = await utilityLLMService.summarizeText({
      textToSummarize: "A very long document...",
      desiredLength: 'short',
      modelId: 'openai/gpt-4o-mini' // Optional
    });
    if (summaryOutput.responseText) {
      console.log("Summary:", summaryOutput.responseText);
      console.log("Cost:", summaryOutput.usage?.costUSD);
    } else {
      console.error("Summarization Error:", summaryOutput.error);
    }

    const structuredDataOutput = await utilityLLMService.extractStructuredData({
        text: "John Doe is 30 years old and works at AgentOS. His email is john.doe@agentos.ai.",
        outputSchema: {
            type: "object",
            properties: {
                name: { type: "string", description: "Full name of the person" },
                age: { type: "number" },
                email: { type: "string", format: "email"},
                company: {type: "string"}
            },
            required: ["name", "email"]
        }
    });
    if(structuredDataOutput.extractedData) {
        console.log("Extracted:", structuredDataOutput.extractedData);
        console.log("Extraction Cost:", structuredDataOutput.usage?.costUSD);
    }

  } catch (e) {
    console.error("Service call error:", e);
  }
}

This service acts as a crucial building block for both GMIs (which might use it for sub-tasks) and other parts of the AgentOS backend that require straightforward LLM interactions without the full complexity of persona management.