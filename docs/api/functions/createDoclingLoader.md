# Function: createDoclingLoader()

> **createDoclingLoader**(): [`IDocumentLoader`](../interfaces/IDocumentLoader.md) \| `null`

Defined in: [packages/agentos/src/memory/io/ingestion/DoclingLoader.ts:276](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/io/ingestion/DoclingLoader.ts#L276)

Checks whether `python3 -m docling` is available in the current environment
and, if so, returns a new Docling-backed loader instance; otherwise returns
`null`.

The availability check runs `python3 -m docling --version` synchronously
via `spawnSync` — it exits quickly and is only called once during registry
initialisation.

### Usage
```ts
import { createDoclingLoader } from './DoclingLoader.js';
import { PdfLoader } from './PdfLoader.js';

const doclingLoader = createDoclingLoader();
const loader = new PdfLoader(null, doclingLoader);
```

## Returns

[`IDocumentLoader`](../interfaces/IDocumentLoader.md) \| `null`

A Docling-backed loader instance when Docling is installed, or `null`.
