# Frame.dev Wiki

*The OS for humans, the codex of humanity.*

**AI Infrastructure for Knowledge and Superintelligence.**

Documentation for Frame.dev ecosystem components.

## Navigation

- [Frame.dev](./frame/README.md) - AI infrastructure platform
- [Frame Codex](./codex/README.md) - Knowledge repository for LLMs
- [OpenStrand](./openstrand/README.md) - Personal knowledge management system  
- [API Reference](./api/README.md) - Integration documentation

## Overview

Frame.dev builds infrastructure for AI-powered knowledge management. The ecosystem includes:

### Frame.dev
Parent infrastructure platform providing tools for building AI-native applications with knowledge management capabilities.

### Frame Codex
Open-source repository containing structured knowledge optimized for LLM retrieval. Data-only repository consumed by Frame.dev and other applications.

### OpenStrand
Personal knowledge management system built on Frame infrastructure. Local-first architecture with AI integration, supporting 20+ import formats.

## Integration

- Frame Codex provides the knowledge base
- OpenStrand adds AI functionality on top of the Codex
- Frame.dev infrastructure connects the ecosystem

## Quick Start

```bash
# Clone Frame Codex
git clone https://github.com/framersai/codex.git

# Explore OpenStrand
git clone https://github.com/framersai/openstrand.git
```

## Documentation Structure

```
wiki/
├── README.md                 # This file
├── frame/                    # Frame.dev documentation
│   ├── README.md
│   ├── architecture.md
│   └── roadmap.md
├── codex/                    # Frame Codex documentation
│   ├── README.md
│   ├── schema.md
│   ├── api.md
│   └── contributing.md
├── openstrand/              # OpenStrand documentation
│   ├── README.md
│   ├── architecture.md
│   ├── features.md
│   └── api.md
└── api/                     # API documentation
    ├── README.md
    ├── authentication.md
    └── examples.md
```