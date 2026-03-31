# Function: createVisionPipeline()

> **createVisionPipeline**(`config?`): `Promise`\<[`VisionPipeline`](../classes/VisionPipeline.md)\>

Defined in: [packages/agentos/src/vision/index.ts:160](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/vision/index.ts#L160)

Create a vision pipeline with sensible defaults by auto-detecting
which providers are installed in the current environment.

The factory probes for optional peer dependencies (ppu-paddle-ocr,
tesseract.js, @huggingface/transformers) and cloud API keys in
environment variables, then configures the pipeline accordingly.

## Auto-detection logic

| Check | Result |
|-------|--------|
| `ppu-paddle-ocr` importable | `ocr: 'paddle'` |
| `tesseract.js` importable (paddle missing) | `ocr: 'tesseract'` |
| Neither importable | `ocr: 'none'` |
| `@huggingface/transformers` importable | `handwriting: true`, `documentAI: true`, `embedding: true` |
| `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / etc. set | `cloudProvider` configured |

Caller-supplied config overrides always take precedence over
auto-detected values.

## Parameters

### config?

`Partial`\<[`VisionPipelineConfig`](../interfaces/VisionPipelineConfig.md)\>

Optional partial configuration. Fields that are set
  override auto-detected values. Fields that are omitted are filled
  by the auto-detection logic.

## Returns

`Promise`\<[`VisionPipeline`](../classes/VisionPipeline.md)\>

A configured and ready-to-use VisionPipeline instance.

## Example

```typescript
// Full auto-detection
const pipeline = await createVisionPipeline();

// Override strategy but auto-detect everything else
const localOnly = await createVisionPipeline({
  strategy: 'local-only',
});

// Explicit full config (no auto-detection)
const explicit = await createVisionPipeline({
  strategy: 'progressive',
  ocr: 'tesseract',
  handwriting: true,
  documentAI: false,
  embedding: true,
  cloudProvider: 'openai',
  cloudModel: 'gpt-4o',
  confidenceThreshold: 0.85,
});
```
