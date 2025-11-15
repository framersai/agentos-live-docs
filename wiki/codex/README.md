<div align="center">
  <img src="../../logos/frame-logo-green-no-tagline.svg" alt="Frame Codex" width="150">

# Frame Codex

**The codex of humanity for LLM knowledge retrieval**

[Browse Codex](https://frame.dev/codex) • [GitHub](https://github.com/framersai/codex) • [Contribute](#contributing)

</div>

---

## 📚 What is Frame Codex?

Frame Codex is an open-source, structured knowledge repository designed to be the definitive source of high-quality information for AI systems. It serves as a "codex of humanity" - a comprehensive collection of human knowledge optimized for Large Language Model (LLM) retrieval and understanding.

### Key Principles

- **🌍 Open & Accessible** - Free for all to use, modify, and distribute
- **🎯 AI-Optimized** - Structured for efficient LLM consumption
- **✅ Quality-First** - Curated, verified, and maintained content
- **🔗 Interconnected** - Rich relationships between knowledge units
- **📈 Scalable** - Designed for millions of knowledge entries

## 🏗️ Architecture

Frame Codex uses a three-tier knowledge organization system:

```
┌─────────────────────────────────────────────┐
│                   WEAVE                      │
│          (Knowledge Universe)                │
│  ┌─────────────────────────────────────┐   │
│  │              LOOM                    │   │
│  │       (Topic Collection)             │   │
│  │  ┌─────────────────────────────┐   │   │
│  │  │         STRAND               │   │   │
│  │  │   (Atomic Knowledge Unit)    │   │   │
│  │  └─────────────────────────────┘   │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Terminology

- **Strand**: The atomic unit of knowledge (document, image, media, or asset file)
- **Loom**: A curated collection of related strands forming a topic or module
- **Weave**: An entire universe of strands with no relationships to other weaves

## 🗂️ Repository Structure

```
codex/
├── weaves/                 # Knowledge universes
│   ├── science/           # Science weave
│   │   ├── weave.yaml    # Weave manifest
│   │   └── looms/        # Topic collections
│   │       ├── physics/
│   │       ├── biology/
│   │       └── chemistry/
│   ├── technology/        # Technology weave
│   └── humanities/        # Humanities weave
├── schema/                # Data schemas
│   ├── weave.schema.yaml
│   ├── loom.schema.yaml
│   └── strand.schema.yaml
├── scripts/              # Build and maintenance scripts
├── assets/               # Shared assets
└── index.json           # Generated search index
```

## 📝 Data Schemas

### Strand Schema (Frontmatter)

```yaml
---
id: "uuid-here"
slug: "human-readable-slug"
title: "Knowledge Title"
summary: "Brief description"
version: "1.0.0"
contentType: "text/markdown"
difficulty: "intermediate"
taxonomy:
  subjects: ["AI", "Machine Learning"]
  topics: ["Neural Networks", "Deep Learning"]
  subtopics: ["Transformers", "Attention Mechanisms"]
relationships:
  - type: "prerequisite"
    target: "strand-id"
  - type: "related"
    target: "another-strand-id"
publishing:
  author: "Author Name"
  created: "2024-01-01"
  modified: "2024-01-15"
  license: "CC-BY-4.0"
---

# Content begins here...
```

### Loom Schema

```yaml
slug: "topic-slug"
title: "Topic Title"
summary: "Topic overview"
tags: ["tag1", "tag2"]
ordering:
  type: "sequential"  # or "hierarchical", "graph"
  sequence: ["strand-1", "strand-2", "strand-3"]
relationships:
  - type: "parent"
    target: "parent-loom"
  - type: "sibling"
    target: "related-loom"
```

### Weave Schema

```yaml
slug: "weave-identifier"
title: "Knowledge Universe Title"
description: "Comprehensive description"
maintainedBy:
  organization: "Frame.dev"
  contact: "codex@frame.dev"
license: "CC-BY-4.0"
tags: ["education", "reference", "ai-training"]
```

## 🚀 Usage

### For AI/LLM Integration

```python
# Example: Loading Frame Codex for RAG
import requests
import json

# Fetch the index
index = requests.get('https://raw.githubusercontent.com/framersai/codex/main/index.json').json()

# Search for content
def search_codex(query, index):
    results = []
    for item in index['strands']:
        if query.lower() in item['title'].lower() or query.lower() in item['summary'].lower():
            results.append(item)
    return results

# Retrieve specific strand
def get_strand(weave, loom, strand):
    url = f"https://raw.githubusercontent.com/framersai/codex/main/weaves/{weave}/looms/{loom}/strands/{strand}.md"
    return requests.get(url).text
```

### For OpenStrand Integration

```typescript
// Configure OpenStrand to use Frame Codex
const config = {
  sources: [
    {
      type: 'frame-codex',
      url: 'https://github.com/framersai/codex',
      weaves: ['technology', 'science'],  // Subscribe to specific weaves
      syncInterval: 3600  // Hourly sync
    }
  ]
};

// Import into your knowledge base
await openstrand.import({
  source: 'frame-codex',
  options: {
    preserveStructure: true,
    includeRelationships: true
  }
});
```

## 🤝 Contributing

### How to Contribute

1. **Fork the repository**
   ```bash
   git clone https://github.com/framersai/codex.git
   cd codex
   ```

2. **Create a new branch**
   ```bash
   git checkout -b add-knowledge-topic
   ```

3. **Add your content**
   - Follow the schema specifications
   - Ensure high quality and accuracy
   - Include proper citations

4. **Submit a pull request**
   - Clear description of additions
   - Reference any related issues
   - Pass all validation checks

### Content Guidelines

- **Accuracy**: Ensure all information is correct and up-to-date
- **Clarity**: Write for both humans and AI systems
- **Structure**: Follow the schema strictly
- **Citations**: Include sources for all claims
- **Licensing**: Ensure content is properly licensed

### Quality Standards

- ✅ Factually accurate
- ✅ Well-structured
- ✅ Properly formatted
- ✅ Free of bias
- ✅ Accessible language

## 🔧 API Access

### REST API

```http
# Get weave index
GET https://api.frame.dev/codex/v1/weaves
Authorization: Bearer {token}

# Search across all content
GET https://api.frame.dev/codex/v1/search?q=machine+learning
Authorization: Bearer {token}

# Get specific strand
GET https://api.frame.dev/codex/v1/weaves/{weave}/looms/{loom}/strands/{strand}
Authorization: Bearer {token}
```

### GraphQL API

```graphql
query SearchCodex($query: String!, $weaves: [String!]) {
  searchCodex(query: $query, weaves: $weaves) {
    strands {
      id
      title
      summary
      weave
      loom
      relationships {
        type
        target {
          id
          title
        }
      }
    }
    facets {
      weaves
      subjects
      topics
    }
  }
}
```

## 📊 Statistics

Current Codex Statistics:
- **Weaves**: 3 major knowledge universes
- **Looms**: 50+ topic collections
- **Strands**: 10,000+ knowledge units
- **Contributors**: 100+ active contributors
- **Languages**: English (primary), translations coming

## 🛠️ Tools & Utilities

### Build Index
```bash
npm run build-index
```

### Validate Schemas
```bash
npm run validate
```

### Check Links
```bash
npm run check-links
```

## 📄 License

Frame Codex is released under the Creative Commons Attribution 4.0 International License (CC-BY-4.0). This means you are free to:
- Share — copy and redistribute the material
- Adapt — remix, transform, and build upon the material

As long as you give appropriate credit.

## 🔗 Links

- **Browse Online**: [frame.dev/codex](https://frame.dev/codex)
- **GitHub**: [github.com/framersai/codex](https://github.com/framersai/codex)
- **OpenStrand**: [openstrand.ai](https://openstrand.ai)
- **Frame.dev**: [frame.dev](https://frame.dev)

---

<div align="center">
  <br/>
  <p>
    <a href="https://frame.dev">Frame.dev</a> •
    <a href="https://frame.dev/codex">Frame Codex</a> •
    <a href="https://openstrand.ai">OpenStrand</a>
  </p>
  <p>
    <a href="https://github.com/framersai">GitHub</a> •
    <a href="https://twitter.com/framersai">Twitter</a>
  </p>
  <br/>
  <sub>Building humanity's knowledge repository for the AI age</sub>
</div>
