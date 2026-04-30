# Type Alias: FormattedPrompt

> **FormattedPrompt** = `ChatMessage`[] \| `string` \| \{\[`key`: `string`\]: `any`; `messages`: `ChatMessage`[]; `system?`: `string`; `tools?`: `any`[]; \}

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:212](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L212)

The final formatted prompt ready for submission to an LLM provider.
The structure varies based on the target model's requirements.
- `ChatMessage[]`: For models like OpenAI Chat.
- `string`: For older text completion models.
- `object`: For models with more complex input structures (e.g., Anthropic Messages API which takes an object with `messages` and `system`).
