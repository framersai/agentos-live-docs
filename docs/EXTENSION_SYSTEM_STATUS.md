# AgentOS Extension System - Implementation Status

**Last Updated:** 2024-11-14  
**Status:** In Progress

---

## ✅ Completed

### Core Architecture Design

1. **Extension Types System** (`packages/agentos/src/extensions/types.ts`)
   - ✅ Extension kinds: `tool`, `guardrail`, `workflow`, `persona`
   - ✅ Auth/subscription via service injection (NOT a separate extension kind)
   - ✅ `PersonaRegistrySource` for multi-source persona loading
   - ✅ Clean descriptor types for all extension kinds

2. **Registry Configuration** (`packages/agentos/src/extensions/RegistryConfig.ts`)
   - ✅ Multi-registry support
   - ✅ Source types: npm, GitHub, git, file, URL
   - ✅ Default configurations
   - ✅ Registry resolver for different extension kinds

3. **Extension Registry Structure**
   ```
   @framers/agentos-extensions/
   ├── registry.json ✅ Updated with auth extension
   ├── registry/
   │   ├── curated/
   │   │   ├── auth/ ✅ Created
   │   │   │   ├── manifest.json ✅
   │   │   │   ├── README.md ✅
   │   │   │   ├── src/
   │   │   │   │   ├── adapters/ ✅
   │   │   │   │   └── providers/ ✅
   │   │   │   ├── tests/ (structure ready)
   │   │   │   └── examples/ (structure ready)
   │   │   ├── research/web-search/ ✅ Existing
   │   │   └── integrations/telegram/ ✅ Existing
   │   └── community/ ✅ Ready for PRs
   ```

4. **Documentation**
   - ✅ `EXTENSION_REFACTORING_PLAN.md` - Comprehensive architecture plan
   - ✅ `EXTENSION_SYSTEM_STATUS.md` - This file
   - ✅ Auth extension README with examples

---

## 🚧 In Progress

### Persona Registry System

Need to create `@framersai/agentos-personas` package structure:

```
packages/agentos-personas/
├── package.json
├── registry.json
├── registry/
│   ├── curated/
│   │   ├── v-researcher/
│   │   ├── code-assistant/
│   │   └── ... (migrate from packages/agentos/src/cognitive_substrate/personas/)
│   └── community/
├── templates/
│   └── persona-template/
└── docs/
    ├── CREATING_PERSONAS.md
    └── MARKETPLACE.md
```

### Extension Loader Updates

`packages/agentos/src/extensions/ExtensionLoader.ts` needs:
- Multi-registry loading
- GitHub direct loading
- Cache management
- Persona source loading

---

## ⏳ Pending

### 1. Auth Extension Implementation

Files created but need full implementation:
- `packages/agentos-extensions/registry/curated/auth/src/adapters/JWTAuthAdapter.ts`
- `packages/agentos-extensions/registry/curated/auth/src/adapters/SubscriptionAdapter.ts`
- `packages/agentos-extensions/registry/curated/auth/src/providers/ToolPermissionProvider.ts`
- `packages/agentos-extensions/registry/curated/auth/src/providers/PersonaTierProvider.ts`

### 2. Remove Auth from Core AgentOS

Need to make auth/subscription optional in:
- `packages/agentos/src/config/AgentOSConfig.ts`
- `packages/agentos/src/core/tools/permissions/ToolPermissionManager.ts`
- `packages/agentos/src/cognitive_substrate/GMIManager.ts`

Add deprecation warnings for built-in auth services.

### 3. Testing

Create test suites:
- `packages/agentos-extensions/registry/curated/auth/tests/`
  - JWT auth tests
  - Subscription tier tests
  - Permission integration tests
  - End-to-end with AgentOS

### 4. Examples

Create comprehensive examples:
- `packages/agentos-extensions/registry/curated/auth/examples/`
  - basic-auth.ts
  - tool-permissions.ts
  - persona-tiers.ts
  - custom-provider.ts
  - supabase-integration.ts

### 5. Documentation Updates

Update existing docs:
- `docs/ARCHITECTURE.md` - Remove auth from core, add extension patterns
- `packages/agentos/README.md` - Update to reflect optional auth
- `packages/agentos-extensions/README.md` - Document auth extension

Create new docs:
- Migration guide for existing users
- Extension development guide
- Persona marketplace guide

---

## 🎯 Key Design Decisions

### Why Auth is an Extension, Not a Separate Package

**CORRECT:**
```
@framers/agentos-extensions/
└── registry/curated/auth/  ← Auth extension lives here
```

**WRONG (what I almost did):**
```
@framersai/agentos-auth/  ← NO! Don't create separate package
```

**Reasons:**
1. **One repo, one package** - Easier to manage, PRs, releases
2. **Community contributions** - Anyone can PR extensions into `registry/community/`
3. **Lazy loading** - Extensions loaded from registry as needed
4. **Individual credits** - Each extension has manifest.json with author info
5. **Better DX** - Import from main package: `@framers/agentos-extensions/auth`

### Extension Kinds

**Core extension kinds** (in `ExtensionKind` type):
- `tool` - Executable tools for agents
- `guardrail` - Safety/policy enforcement
- `workflow` - Multi-step workflows
- `persona` - Agent personas/personalities

**Auth is NOT an extension kind** - it's injected via `IAuthService`/`ISubscriptionService` interfaces that can be provided by any source (including extensions that export services).

### Scoping Strategy

- **Core:** `@framers/agentos`
- **Extensions:** `@framers/agentos-extensions`
- **Personas:** `@framersai/agentos-personas` (or `@framers/agentos-personas`?)

NOT using `@agentos` scope (taken on npm).

---

## 🚀 Next Steps

1. **Implement auth extension** (1-2 days)
   - Copy auth logic from old separate package attempt
   - Implement JWTAuthAdapter, SubscriptionAdapter
   - Create providers for tool/persona integration

2. **Create persona package structure** (1 day)
   - Set up `@framersai/agentos-personas`
   - Migrate existing personas
   - Create registry.json

3. **Update ExtensionLoader** (1 day)
   - Multi-registry support
   - GitHub loading
   - Persona loading

4. **Make auth optional in core** (1 day)
   - Remove hard dependencies
   - Add deprecation warnings
   - Update configs

5. **Testing & Examples** (2-3 days)
   - Auth extension tests
   - Integration tests
   - Complete examples

6. **Documentation** (1-2 days)
   - Update all existing docs
   - Create migration guides
   - Extension development guide

**Total: ~8-10 days**

---

## 📋 Definition of Done

- [ ] Auth completely extracted from core AgentOS
- [ ] Auth available as extension in `@framers/agentos-extensions`
- [ ] Personas in separate package `@framersai/agentos-personas`
- [ ] Multi-registry loading works (extensions + personas)
- [ ] 80%+ test coverage for auth extension
- [ ] Complete examples for all use cases
- [ ] All documentation updated
- [ ] Migration guide for existing users
- [ ] Backward compatibility layer (deprecation warnings)

---

## 🤔 Open Questions

1. Should personas be `@framers/agentos-personas` or `@framersai/agentos-personas`?
2. Do we need CLI tool for scaffolding extensions/personas?
3. Should we support nested scopes in npm (not possible, so how do we organize)?
4. Versioning strategy for individual extensions within the main package?
5. How to handle breaking changes in individual extensions?

---

**Document Owner:** Frame.dev Engineering
**Status Tracker:** This document

