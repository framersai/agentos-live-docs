# Function: createOcrPdfLoader()

> **createOcrPdfLoader**(): [`IDocumentLoader`](../interfaces/IDocumentLoader.md) \| `null`

Defined in: [packages/agentos/src/memory/io/ingestion/OcrPdfLoader.ts:161](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/ingestion/OcrPdfLoader.ts#L161)

Checks whether `tesseract.js` is available in the current environment and,
if so, returns a new OCR PDF loader instance; otherwise returns `null`.

The check is performed by attempting to resolve the package path using
Node's `createRequire`.  This avoids a full async dynamic import at call
time while still being accurate.

### Usage
```ts
import { createOcrPdfLoader } from './OcrPdfLoader.js';
import { PdfLoader } from './PdfLoader.js';

const ocrLoader = createOcrPdfLoader();
const loader = new PdfLoader(ocrLoader);
```

## Returns

[`IDocumentLoader`](../interfaces/IDocumentLoader.md) \| `null`

An OCR PDF loader instance when tesseract.js is installed, or
         `null` when it is not.
