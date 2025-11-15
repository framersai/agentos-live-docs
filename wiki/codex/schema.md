<div align="center">
  <img src="../../logos/frame-logo-green-no-tagline.svg" alt="Frame Codex" width="150">

# Frame Codex Schema Reference

**Complete schema specifications for Weaves, Looms, and Strands**

</div>

---

## 📋 Overview

Frame Codex uses a hierarchical schema system to organize knowledge. Each level has specific fields and validation rules to ensure consistency and quality across the repository.

## 🌐 Weave Schema

A Weave represents an entire knowledge universe. Strands from different weaves have no relationships.

### YAML Schema Definition

```yaml
# weave.schema.yaml
$schema: "http://json-schema.org/draft-07/schema#"
type: object
required:
  - slug
  - title
  - description
  - maintainedBy
  - license
properties:
  slug:
    type: string
    pattern: "^[a-z0-9-]+$"
    description: "URL-safe identifier for the weave"
  
  title:
    type: string
    minLength: 1
    maxLength: 100
    description: "Human-readable weave name"
  
  description:
    type: string
    minLength: 50
    maxLength: 500
    description: "Comprehensive description of the weave's scope"
  
  maintainedBy:
    type: object
    required:
      - organization
      - contact
    properties:
      organization:
        type: string
        description: "Organization maintaining this weave"
      contact:
        type: string
        format: email
        description: "Contact email for maintainers"
  
  license:
    type: string
    enum: ["CC-BY-4.0", "CC-BY-SA-4.0", "CC0-1.0", "MIT", "Apache-2.0"]
    description: "License for content in this weave"
  
  tags:
    type: array
    items:
      type: string
    description: "Categorical tags for the weave"
  
  statistics:
    type: object
    properties:
      loomCount:
        type: integer
        minimum: 0
      strandCount:
        type: integer
        minimum: 0
      lastUpdated:
        type: string
        format: date-time
```

### Example Weave Manifest

```yaml
# weaves/technology/weave.yaml
slug: technology
title: Technology & Computer Science
description: |
  A comprehensive collection of knowledge covering computer science,
  software engineering, hardware, networking, and emerging technologies.
  This weave serves as the authoritative reference for technical concepts
  and implementations.
maintainedBy:
  organization: Frame.dev Community
  contact: tech-weave@frame.dev
license: CC-BY-4.0
tags:
  - computer-science
  - software-engineering
  - programming
  - ai-ml
  - systems
statistics:
  loomCount: 42
  strandCount: 3847
  lastUpdated: 2024-11-15T00:00:00Z
```

## 🧵 Loom Schema

A Loom is a curated collection of related Strands forming a coherent topic or learning path.

### YAML Schema Definition

```yaml
# loom.schema.yaml
$schema: "http://json-schema.org/draft-07/schema#"
type: object
required:
  - slug
  - title
  - summary
  - ordering
properties:
  slug:
    type: string
    pattern: "^[a-z0-9-]+$"
    description: "URL-safe identifier for the loom"
  
  title:
    type: string
    minLength: 1
    maxLength: 100
    description: "Human-readable loom title"
  
  summary:
    type: string
    minLength: 50
    maxLength: 300
    description: "Brief overview of the loom's content"
  
  tags:
    type: array
    items:
      type: string
    description: "Topic tags for categorization"
  
  ordering:
    type: object
    required:
      - type
    properties:
      type:
        type: string
        enum: ["sequential", "hierarchical", "graph"]
        description: "How strands are organized"
      
      sequence:
        type: array
        items:
          type: string
        description: "For sequential ordering: ordered list of strand slugs"
      
      hierarchy:
        type: object
        description: "For hierarchical ordering: nested structure"
      
      graph:
        type: object
        properties:
          nodes:
            type: array
            items:
              type: string
          edges:
            type: array
            items:
              type: object
              properties:
                from:
                  type: string
                to:
                  type: string
                type:
                  type: string
  
  relationships:
    type: array
    items:
      type: object
      properties:
        type:
          type: string
          enum: ["parent", "child", "sibling", "prerequisite", "next"]
        target:
          type: string
          description: "Slug of related loom"
  
  metadata:
    type: object
    properties:
      difficulty:
        type: string
        enum: ["beginner", "intermediate", "advanced", "expert"]
      estimatedTime:
        type: string
        description: "Estimated time to complete (e.g., '2 hours')"
      prerequisites:
        type: array
        items:
          type: string
```

### Example Loom Manifest

```yaml
# weaves/technology/looms/machine-learning/loom.yaml
slug: machine-learning
title: Machine Learning Fundamentals
summary: |
  A comprehensive introduction to machine learning concepts, algorithms,
  and practical applications. Covers supervised learning, unsupervised
  learning, and neural networks basics.
tags:
  - artificial-intelligence
  - data-science
  - algorithms
  - neural-networks

ordering:
  type: sequential
  sequence:
    - introduction
    - supervised-learning
    - unsupervised-learning
    - neural-networks-basics
    - practical-applications
    - future-directions

relationships:
  - type: parent
    target: artificial-intelligence
  - type: sibling
    target: deep-learning
  - type: prerequisite
    target: linear-algebra
  - type: prerequisite
    target: statistics-basics

metadata:
  difficulty: intermediate
  estimatedTime: "20 hours"
  prerequisites:
    - "Basic programming knowledge"
    - "High school mathematics"
```

## 📄 Strand Schema

A Strand is the atomic unit of knowledge - a single document, image, or other content.

### Frontmatter Schema Definition

```yaml
# strand.schema.yaml
$schema: "http://json-schema.org/draft-07/schema#"
type: object
required:
  - id
  - slug
  - title
  - summary
  - version
  - contentType
  - taxonomy
  - publishing
properties:
  id:
    type: string
    format: uuid
    description: "Unique identifier for the strand"
  
  slug:
    type: string
    pattern: "^[a-z0-9-]+$"
    description: "URL-safe identifier"
  
  title:
    type: string
    minLength: 1
    maxLength: 200
    description: "Strand title"
  
  summary:
    type: string
    minLength: 50
    maxLength: 500
    description: "Brief description of content"
  
  version:
    type: string
    pattern: "^\\d+\\.\\d+\\.\\d+$"
    description: "Semantic version (e.g., 1.0.0)"
  
  contentType:
    type: string
    enum: 
      - "text/markdown"
      - "text/plain"
      - "image/png"
      - "image/jpeg"
      - "video/mp4"
      - "audio/mp3"
      - "application/pdf"
    description: "MIME type of the content"
  
  difficulty:
    type: string
    enum: ["beginner", "intermediate", "advanced", "expert"]
    description: "Content difficulty level"
  
  taxonomy:
    type: object
    required:
      - subjects
      - topics
    properties:
      subjects:
        type: array
        items:
          type: string
        minItems: 1
        description: "High-level subject areas"
      
      topics:
        type: array
        items:
          type: string
        minItems: 1
        description: "Specific topics covered"
      
      subtopics:
        type: array
        items:
          type: string
        description: "Detailed subtopics"
  
  relationships:
    type: array
    items:
      type: object
      required:
        - type
        - target
      properties:
        type:
          type: string
          enum: 
            - "prerequisite"
            - "related"
            - "follows"
            - "references"
            - "contradicts"
            - "updates"
          description: "Relationship type"
        
        target:
          type: string
          description: "UUID of related strand"
        
        description:
          type: string
          description: "Optional relationship description"
  
  publishing:
    type: object
    required:
      - author
      - created
      - license
    properties:
      author:
        type: string
        description: "Primary author or organization"
      
      contributors:
        type: array
        items:
          type: string
        description: "Additional contributors"
      
      created:
        type: string
        format: date
        description: "Creation date"
      
      modified:
        type: string
        format: date
        description: "Last modification date"
      
      reviewed:
        type: string
        format: date
        description: "Last review date"
      
      license:
        type: string
        description: "Content license"
      
      citations:
        type: array
        items:
          type: object
          properties:
            title:
              type: string
            author:
              type: string
            url:
              type: string
              format: uri
            date:
              type: string
              format: date
```

### Example Strand Document

```markdown
---
id: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
slug: "transformer-architecture"
title: "Understanding Transformer Architecture"
summary: |
  A comprehensive guide to the Transformer architecture that revolutionized
  natural language processing. Covers self-attention mechanisms, positional
  encoding, and the encoder-decoder structure that powers models like GPT
  and BERT.
version: "2.1.0"
contentType: "text/markdown"
difficulty: "intermediate"

taxonomy:
  subjects:
    - "Artificial Intelligence"
    - "Computer Science"
  topics:
    - "Neural Networks"
    - "Natural Language Processing"
    - "Deep Learning"
  subtopics:
    - "Attention Mechanisms"
    - "Transformer Models"
    - "Sequence Processing"

relationships:
  - type: "prerequisite"
    target: "a1b2c3d4-58cc-4372-a567-0e02b2c3d479"
    description: "Basic neural networks understanding required"
  - type: "related"
    target: "e5f6g7h8-58cc-4372-a567-0e02b2c3d479"
    description: "BERT architecture builds on transformers"
  - type: "follows"
    target: "i9j0k1l2-58cc-4372-a567-0e02b2c3d479"
    description: "Continue with advanced transformer variants"

publishing:
  author: "Dr. Jane Smith"
  contributors:
    - "John Doe"
    - "Frame.dev Community"
  created: "2024-01-15"
  modified: "2024-11-15"
  reviewed: "2024-10-01"
  license: "CC-BY-4.0"
  citations:
    - title: "Attention Is All You Need"
      author: "Vaswani et al."
      url: "https://arxiv.org/abs/1706.03762"
      date: "2017-06-12"
---

# Understanding Transformer Architecture

The Transformer architecture has revolutionized the field of natural language
processing since its introduction in 2017...

[Content continues...]
```

## 🔍 Schema Validation

### Validation Tools

Frame Codex provides validation scripts to ensure all content conforms to schemas:

```bash
# Validate all content
npm run validate

# Validate specific weave
npm run validate -- --weave=technology

# Validate specific file
npm run validate -- --file=weaves/technology/looms/ml/strands/intro.md
```

### Validation Rules

1. **Required Fields**: All required fields must be present
2. **Type Checking**: Fields must match specified types
3. **Pattern Matching**: Slugs and versions must match patterns
4. **Reference Integrity**: All relationships must point to valid targets
5. **Content Standards**: Summaries must meet length requirements

### Common Validation Errors

```bash
# Missing required field
ERROR: strand 'intro.md' missing required field 'summary'

# Invalid slug format
ERROR: loom slug 'Machine Learning' invalid - must be lowercase with hyphens

# Broken relationship
ERROR: strand 'advanced.md' references non-existent target 'xyz123'

# Content too short
ERROR: strand 'overview.md' summary too short (minimum 50 characters)
```

## 🛠️ Working with Schemas

### Creating New Content

1. **Choose appropriate schema level**
   - Weave: New knowledge domain
   - Loom: New topic within a weave
   - Strand: Individual content piece

2. **Use templates**
   ```bash
   # Generate from template
   npm run create -- --type=strand --title="My New Topic"
   ```

3. **Validate before committing**
   ```bash
   npm run validate -- --staged
   ```

### Schema Evolution

Schemas may evolve over time. We follow these principles:

1. **Backward Compatibility**: New fields are optional
2. **Migration Scripts**: Provided for breaking changes
3. **Version Tracking**: Schema versions in meta files
4. **Deprecation Notices**: 6-month warning period

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
  <sub>Structured knowledge for the AI age</sub>
</div>
