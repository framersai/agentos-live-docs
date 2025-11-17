---
title: "Hierarchy & Vocabulary"
tags: ["schema", "hierarchy"]
publishing:
  status: published
---

OpenStrand organizes knowledge into three named layers:

```
WEAVE (Knowledge Universe)
└── LOOM (Topic Collection)
    └── STRAND (Atomic Knowledge Unit)
```

| Layer | Description | Example |
| ----- | ----------- | ------- |
| **Weave** | Complete, self-contained universe of strands. No cross-weave dependencies. | `weaves/openstrand` |
| **Loom** | Curated folder inside a weave. Groups strands by topic or workflow. | `weaves/openstrand/schema` |
| **Strand** | Individual markdown file with YAML frontmatter metadata. | `weaves/openstrand/schema/hierarchy.md` |

### Node levels surfaced in the viewer

The Codex viewer reads this hierarchy directly from GitHub and applies level-specific styling (fabric/weave/loom/strand) so humans can instantly see where they are. Metadata such as `tags`, `taxonomy`, or `publishing.status` flows into the sidebar and search filters.

### Schema goals

1. **Nesting without magic** – folders on disk are the schema; no hidden database.
2. **Frontmatter as API** – every strand’s YAML block becomes structured data for search, analytics, and embeddings.
3. **Machine-friendly URLs** – `https://frame.dev/codex?path=weaves/openstrand&file=schema/hierarchy.md`

For practical authoring tips see the `playbooks/indexing.md` strand.

