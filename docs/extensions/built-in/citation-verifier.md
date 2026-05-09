---
title: "Citation Verifier (deprecated)"
sidebar_position: 16.1
---

:::warning Deprecated
The `@framers/agentos-ext-citation-verifier` extension is deprecated. Citation verification is a **first-class feature** in `@framers/agentos` — use the [CitationVerifier](/features/citation-verification) engine directly. This page is kept only so existing inbound links resolve.
:::

```ts
// Old (deprecated)
import { createExtensionPack } from '@framers/agentos-ext-citation-verifier';

// New
import { CitationVerifier } from '@framers/agentos';
```

See [Citation Verification](/features/citation-verification) for the full API, verdict ladder, NLI contradiction checks, web-search fallback, and `QueryRouter` (`verifyCitations: true`) auto-integration.
