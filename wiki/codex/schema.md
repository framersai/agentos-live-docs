# Frame Codex Schema Reference

Schema specifications for Weaves, Looms, and Strands.

## Overview

Frame Codex uses a hierarchical schema system. Each level has specific fields and validation rules to ensure consistency across the repository.

## Weave Schema

A Weave represents a knowledge universe. Strands from different weaves have no relationships.

### Schema Definition

```yaml
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
    description: "URL-safe identifier"
  
  title:
    type: string
    minLength: 1
    maxLength: 100
  
  description:
    type: string
    minLength: 50
    maxLength: 500
  
  maintainedBy:
    type: object
    required:
      - organization
      - contact
    properties:
      organization:
        type: string
      contact:
        type: string
        format: email
  
  license:
    type: string
    enum: ["CC-BY-4.0", "CC-BY-SA-4.0", "CC0-1.0", "MIT", "Apache-2.0"]
  
  tags:
    type: array
    items:
      type: string
```

### Example

```yaml
slug: technology
title: Technology & Computer Science
description: |
  Comprehensive collection covering computer science, software engineering,
  hardware, networking, and emerging technologies.
maintainedBy:
  organization: Frame.dev Community
  contact: tech-weave@frame.dev
license: CC-BY-4.0
tags:
  - computer-science
  - software-engineering
  - programming
```

## Loom Schema

A Loom is a curated collection of related Strands.

### Schema Definition

```yaml
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
  
  title:
    type: string
    minLength: 1
    maxLength: 100
  
  summary:
    type: string
    minLength: 50
    maxLength: 300
  
  tags:
    type: array
    items:
      type: string
  
  ordering:
    type: object
    required:
      - type
    properties:
      type:
        type: string
        enum: ["sequential", "hierarchical", "graph"]
      
      sequence:
        type: array
        items:
          type: string
        description: "For sequential ordering"
      
      hierarchy:
        type: object
        description: "For hierarchical ordering"
      
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
  
  metadata:
    type: object
    properties:
      difficulty:
        type: string
        enum: ["beginner", "intermediate", "advanced", "expert"]
      estimatedTime:
        type: string
      prerequisites:
        type: array
        items:
          type: string
```

### Example

```yaml
slug: machine-learning
title: Machine Learning Fundamentals
summary: |
  Introduction to machine learning concepts, algorithms, and applications.
tags:
  - artificial-intelligence
  - data-science

ordering:
  type: sequential
  sequence:
    - introduction
    - supervised-learning
    - unsupervised-learning
    - neural-networks

relationships:
  - type: parent
    target: artificial-intelligence
  - type: prerequisite
    target: linear-algebra

metadata:
  difficulty: intermediate
  estimatedTime: "20 hours"
  prerequisites:
    - "Basic programming"
    - "Mathematics"
```

## Strand Schema

A Strand is the atomic unit of knowledge.

### Frontmatter Schema

```yaml
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
  
  slug:
    type: string
    pattern: "^[a-z0-9-]+$"
  
  title:
    type: string
    minLength: 1
    maxLength: 200
  
  summary:
    type: string
    minLength: 50
    maxLength: 500
  
  version:
    type: string
    pattern: "^\\d+\\.\\d+\\.\\d+$"
  
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
  
  difficulty:
    type: string
    enum: ["beginner", "intermediate", "advanced", "expert"]
  
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
      
      topics:
        type: array
        items:
          type: string
        minItems: 1
      
      subtopics:
        type: array
        items:
          type: string
  
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
        
        target:
          type: string
          description: "UUID of related strand"
        
        description:
          type: string
  
  publishing:
    type: object
    required:
      - author
      - created
      - license
    properties:
      author:
        type: string
      
      contributors:
        type: array
        items:
          type: string
      
      created:
        type: string
        format: date
      
      modified:
        type: string
        format: date
      
      reviewed:
        type: string
        format: date
      
      license:
        type: string
      
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

### Example

```markdown
---
id: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
slug: "transformer-architecture"
title: "Understanding Transformer Architecture"
summary: |
  Guide to Transformer architecture covering self-attention, positional
  encoding, and encoder-decoder structure.
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
  subtopics:
    - "Attention Mechanisms"
    - "Transformer Models"

relationships:
  - type: "prerequisite"
    target: "a1b2c3d4-58cc-4372-a567-0e02b2c3d479"
    description: "Basic neural networks required"
  - type: "related"
    target: "e5f6g7h8-58cc-4372-a567-0e02b2c3d479"
    description: "BERT builds on transformers"

publishing:
  author: "Dr. Jane Smith"
  contributors:
    - "John Doe"
    - "Frame.dev Community"
  created: "2024-01-15"
  modified: "2024-11-15"
  license: "CC-BY-4.0"
  citations:
    - title: "Attention Is All You Need"
      author: "Vaswani et al."
      url: "https://arxiv.org/abs/1706.03762"
      date: "2017-06-12"
---

# Understanding Transformer Architecture

[Content begins here...]
```

## Schema Validation

### Validation Tools

```bash
# Validate all content
npm run validate

# Validate specific weave
npm run validate -- --weave=technology

# Validate specific file
npm run validate -- --file=path/to/file.md
```

### Validation Rules

1. Required fields must be present
2. Fields must match specified types
3. Slugs and versions must match patterns
4. All relationships must point to valid targets
5. Summaries must meet length requirements

### Common Errors

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

## Working with Schemas

### Creating Content

1. Choose appropriate schema level
2. Use templates when available
3. Validate before committing

```bash
# Generate from template
npm run create -- --type=strand --title="My Topic"

# Validate before commit
npm run validate -- --staged
```

### Schema Evolution

Principles for schema changes:
1. Backward compatibility - new fields are optional
2. Migration scripts for breaking changes
3. Version tracking in meta files
4. Deprecation notices with timeline