# Enumeration: ContextualElementType

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:43](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/llm/IPromptEngine.ts#L43)

Represents different types of contextual prompt elements that can be dynamically
selected and integrated into prompts based on execution context.
These elements allow for fine-grained adaptation of prompts.

## Enumeration Members

### ASSISTANT\_PROMPT\_AUGMENTATION

> **ASSISTANT\_PROMPT\_AUGMENTATION**: `"assistant_prompt_augmentation"`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:67](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/llm/IPromptEngine.ts#L67)

Content to be injected into the assistant part for few-shot or role-play setup.

***

### BEHAVIORAL\_GUIDANCE

> **BEHAVIORAL\_GUIDANCE**: `"behavioral_guidance"`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:49](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/llm/IPromptEngine.ts#L49)

Behavioral guidance or tone adjustments for the persona.

***

### DOMAIN\_CONTEXT

> **DOMAIN\_CONTEXT**: `"domain_context"`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:57](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/llm/IPromptEngine.ts#L57)

Domain-specific knowledge, facts, or context relevant to the current query.

***

### ERROR\_HANDLING\_GUIDANCE

> **ERROR\_HANDLING\_GUIDANCE**: `"error_handling_guidance"`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:53](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/llm/IPromptEngine.ts#L53)

Instructions for handling errors or recovering from unexpected situations.

***

### ETHICAL\_GUIDELINE

> **ETHICAL\_GUIDELINE**: `"ethical_guideline"`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:59](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/llm/IPromptEngine.ts#L59)

Ethical guidelines or safety instructions to ensure responsible AI behavior.

***

### FEW\_SHOT\_EXAMPLE

> **FEW\_SHOT\_EXAMPLE**: `"few_shot_example"`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:47](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/llm/IPromptEngine.ts#L47)

Dynamic few-shot examples selected based on context to guide the LLM.

***

### INTERACTION\_STYLE\_MODIFIER

> **INTERACTION\_STYLE\_MODIFIER**: `"interaction_style_modifier"`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:55](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/llm/IPromptEngine.ts#L55)

Adjustments to the GMI's interaction style with the user.

***

### OUTPUT\_FORMAT\_SPEC

> **OUTPUT\_FORMAT\_SPEC**: `"output_format_spec"`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:61](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/llm/IPromptEngine.ts#L61)

Specifications for the desired output format (e.g., JSON, Markdown).

***

### REASONING\_PROTOCOL

> **REASONING\_PROTOCOL**: `"reasoning_protocol"`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:63](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/llm/IPromptEngine.ts#L63)

Instructions for specific reasoning protocols (e.g., chain-of-thought, tree-of-thought).

***

### SYSTEM\_INSTRUCTION\_ADDON

> **SYSTEM\_INSTRUCTION\_ADDON**: `"system_instruction_addon"`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:45](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/llm/IPromptEngine.ts#L45)

Additional system-level instructions appended to base system prompt.

***

### TASK\_SPECIFIC\_INSTRUCTION

> **TASK\_SPECIFIC\_INSTRUCTION**: `"task_specific_instruction"`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:51](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/llm/IPromptEngine.ts#L51)

Specific instructions or constraints related to the current task.

***

### USER\_PROMPT\_AUGMENTATION

> **USER\_PROMPT\_AUGMENTATION**: `"user_prompt_augmentation"`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:65](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/llm/IPromptEngine.ts#L65)

Dynamic content to be injected directly into the user part of the prompt.
