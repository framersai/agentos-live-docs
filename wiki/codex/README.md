# Frame Codex

Knowledge repository for LLM retrieval.

## Overview

Frame Codex is an open-source, structured knowledge repository designed for Large Language Model consumption. It serves as a comprehensive collection of human knowledge organized for efficient AI retrieval.

### Key Principles

- Open and accessible
- AI-optimized structure
- Quality-focused content
- Interconnected relationships
- Scalable architecture

## Architecture

Frame Codex uses three-tier knowledge organization:

```
WEAVE (Knowledge Universe)
└── LOOM (Topic Collection)  
    └── STRAND (Atomic Knowledge Unit)
```

### Terminology

- **Strand**: Atomic unit of knowledge (document, image, media, asset)
- **Loom**: Curated collection of related strands
- **Weave**: Complete universe of strands with no cross-weave relationships

## Repository Structure

```
codex/
├── weaves/                 # Knowledge universes
│   ├── science/
│   ├── technology/
│   └── humanities/
├── schema/                # Data schemas
├── scripts/              # Build scripts
├── assets/               # Shared assets
└── index.json           # Search index
```

## Data Schemas

### Strand Frontmatter

```yaml
---
id: "uuid"
slug: "url-safe-slug"
title: "Knowledge Title"
summary: "Brief description"
version: "1.0.0"
contentType: "text/markdown"
difficulty: "intermediate"
taxonomy:
  subjects: ["AI", "Machine Learning"]
  topics: ["Neural Networks"]
  subtopics: ["Transformers"]
relationships:
  - type: "prerequisite"
    target: "strand-id"
publishing:
  author: "Author Name"
  created: "2024-01-01"
  license: "CC-BY-4.0"
---
```

### Loom Manifest

```yaml
slug: "topic-slug"
title: "Topic Title"  
summary: "Topic overview"
tags: ["tag1", "tag2"]
ordering:
  type: "sequential"
  sequence: ["strand-1", "strand-2"]
relationships:
  - type: "parent"
    target: "parent-loom"
```

### Weave Configuration

```yaml
slug: "weave-id"
title: "Knowledge Universe"
description: "Description"
maintainedBy:
  organization: "Frame.dev"
  contact: "codex@frame.dev"
license: "CC-BY-4.0"
tags: ["education", "reference"]
```

## Usage

### For AI/LLM Integration

```python
import requests

# Fetch index
index = requests.get('https://raw.githubusercontent.com/framersai/codex/main/index.json').json()

# Search content
def search_codex(query, index):
    results = []
    for item in index['strands']:
        if query.lower() in item['title'].lower():
            results.append(item)
    return results

# Retrieve strand
def get_strand(weave, loom, strand):
    url = f"https://raw.githubusercontent.com/framersai/codex/main/weaves/{weave}/looms/{loom}/strands/{strand}.md"
    return requests.get(url).text
```

### For OpenStrand Integration

```typescript
const config = {
  sources: [{
    type: 'frame-codex',
    url: 'https://github.com/framersai/codex',
    weaves: ['technology', 'science'],
    syncInterval: 3600
  }]
};

await openstrand.import({
  source: 'frame-codex',
  options: {
    preserveStructure: true,
    includeRelationships: true
  }
});
```

## Contributing

### How to Contribute

1. Fork the repository
2. Create a new branch
3. Add content following schemas
4. Submit pull request

### Content Guidelines

- Ensure accuracy
- Write clearly
- Follow structure
- Include citations
- Proper licensing

### Quality Standards

- Factually accurate
- Well-structured  
- Properly formatted
- Unbiased
- Accessible language

## API Access

### REST API

```http
# Get weave index
GET https://api.frame.dev/codex/v1/weaves

# Search content
GET https://api.frame.dev/codex/v1/search?q=machine+learning

# Get specific strand
GET https://api.frame.dev/codex/v1/weaves/{weave}/looms/{loom}/strands/{strand}
```

### GraphQL

```graphql
query SearchCodex($query: String!) {
  searchCodex(query: $query) {
    strands {
      id
      title
      summary
      weave
      loom
    }
  }
}
```

## Tools

```bash
# Build index
npm run build-index

# Validate schemas
npm run validate

# Check links
npm run check-links
```

## License

Frame Codex content is licensed under CC-BY-4.0. You are free to:
- Share - copy and redistribute
- Adapt - remix and transform

With attribution requirement.

## Links

- Browse: [frame.dev/codex](https://frame.dev/codex)
- GitHub: [github.com/framersai/codex](https://github.com/framersai/codex)
- OpenStrand: [openstrand.ai](https://openstrand.ai)