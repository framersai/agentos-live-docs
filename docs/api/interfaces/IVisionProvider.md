# Interface: IVisionProvider

Defined in: [packages/agentos/src/rag/multimodal/types.ts:313](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/multimodal/types.ts#L313)

Minimal interface for a vision LLM that can describe images.

This is kept intentionally narrow to avoid coupling the multimodal
indexer to a specific LLM provider. Any service that can take an
image and return a text description satisfies this contract.

## Example

```typescript
const visionProvider: IVisionProvider = {
  describeImage: async (image) => {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: [
        { type: 'text', text: 'Describe this image in detail.' },
        { type: 'image_url', image_url: { url: imageUrl } },
      ]}],
    });
    return response.choices[0].message.content!;
  },
};
```

## Methods

### describeImage()

> **describeImage**(`image`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/rag/multimodal/types.ts:320](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/multimodal/types.ts#L320)

Generate a text description of the provided image.

#### Parameters

##### image

`string`

Image as a URL string or base64 data URL.

#### Returns

`Promise`\<`string`\>

A detailed text description of the image content.
