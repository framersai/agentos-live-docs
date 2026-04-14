# Type Alias: VisionContentCategory

> **VisionContentCategory** = `"printed-text"` \| `"handwritten"` \| `"document-layout"` \| `"photograph"` \| `"diagram"` \| `"screenshot"` \| `"mixed"`

Defined in: [packages/agentos/src/vision/types.ts:57](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/vision/types.ts#L57)

What kind of visual content the pipeline detected or was told to expect.

Used to route images to the most appropriate processing tier — e.g.
handwritten content triggers TrOCR, complex layouts trigger Florence-2.
