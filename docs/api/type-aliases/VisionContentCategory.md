# Type Alias: VisionContentCategory

> **VisionContentCategory** = `"printed-text"` \| `"handwritten"` \| `"document-layout"` \| `"photograph"` \| `"diagram"` \| `"screenshot"` \| `"mixed"`

Defined in: [packages/agentos/src/vision/types.ts:57](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/vision/types.ts#L57)

What kind of visual content the pipeline detected or was told to expect.

Used to route images to the most appropriate processing tier — e.g.
handwritten content triggers TrOCR, complex layouts trigger Florence-2.
