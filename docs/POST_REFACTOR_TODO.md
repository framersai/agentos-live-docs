# Post-Refactor TODO List

**Date:** 2024-11-14  
**Purpose:** Verify implementation and update all documentation to reflect new auth architecture

---

## 🔍 Verification Checklist

### Code Verification

#### 1. Check for Broken Imports
- [ ] Search for imports from deleted files:
  - `packages/agentos/src/extensions/types.ts` (deleted)
  - `packages/agentos/src/extensions/RegistryConfig.ts` (deleted)
  - `packages/agentos/src/extensions/MultiRegistryLoader.ts` (deleted)
  - `packages/agentos/src/extensions/index.ts` (deleted)
  - `packages/agentos/src/core/tools/permissions/ToolPermissionManager.ts` (deleted)
  - `packages/agentos/src/cognitive_substrate/GMIManager.ts` (deleted)

#### 2. Verify Extension System
- [ ] Auth extension loads correctly
- [ ] Tests pass for auth extension
- [ ] Examples run without errors
- [ ] Registry.json is valid JSON

#### 3. Check Core AgentOS
- [ ] Works without auth services
- [ ] Shows warnings when auth required but not provided
- [ ] No hard dependencies on auth/subscription services

---

## 📝 Documentation Updates Needed

### 1. **ARCHITECTURE.md** (Main Docs)
**Current Issue:** Still references auth/billing as required adapters

**Line 203:** 
```
- **Auth/billing**: supply adapters implementing `IAuthService` and `ISubscriptionService` so the runtime can check entitlements (`@framers/agentos/services/user_auth/types`).
```

**Should be:**
```
- **Auth/billing (optional)**: Auth is now optional! Use `@framers/agentos-extensions/auth` extension or implement your own `IAuthService` and `ISubscriptionService`. Without auth, AgentOS works with all features enabled by default. See examples in the auth extension.
```

**Other updates needed:**
- Add section about extension system
- Update configuration example to show auth as optional
- Add migration notes for existing users

### 2. **BACKEND_API.md**
**Current Issue:** Doesn't explain new auth extension

**Updates needed:**
- Add note that auth endpoints require auth extension
- Explain how to enable auth in backend
- Update `/api/agentos/personas` docs about tier filtering

### 3. **packages/agentos/README.md**
**Current Issue:** May still show auth as required

**Updates needed:**
- Show basic usage without auth
- Add section on optional auth extension
- Update examples

### 4. **backend/src/integrations/agentos/**
**Current Issue:** May have hard dependencies on auth

**Check:**
- `agentos.auth-service.ts`
- `agentos.subscription-service.ts`
- Update to use auth extension

### 5. **References to agentos-guardrails**
**Files mentioning it:**
- `apps/agentos.sh/components/sections/ecosystem-section.tsx`
- `backend/src/integrations/agentos/guardrails.service.ts`
- Various docs

**Action:** Update to reference guardrails in extensions registry

### 6. **PLANS_AND_BILLING.md**
**Current Issue:** Doesn't explain new subscription system

**Updates needed:**
- Explain subscription adapter in auth extension
- Show how to configure tiers
- Update examples

### 7. **RBAC.md**
**Current Issue:** Assumes built-in auth

**Updates needed:**
- Explain auth is optional
- Show how RBAC works with auth extension

---

## 🚀 Additional Improvements

### 1. Migration Guide
Create `docs/MIGRATION_TO_AUTH_EXTENSION.md`:
- For users with existing auth setup
- Step-by-step migration
- Backward compatibility notes

### 2. Extension Development Guide
Create `docs/CREATING_EXTENSIONS.md`:
- How to create extensions
- Best practices
- Contributing to registry

### 3. Backend Updates
- Update backend to use auth extension
- Remove direct auth service implementations
- Add configuration for auth extension

### 4. Frontend Updates
- Update any references to auth being required
- Add UI for showing when auth is not configured

### 5. CI/CD Updates
- Ensure tests run for auth extension
- Add integration tests
- Update build scripts

---

## 🔧 Technical Debt

### 1. File Organization
- Some auth types might still be in core
- Check for duplicate type definitions
- Ensure clean separation

### 2. Import Paths
- Verify all imports are correct
- No circular dependencies
- Clean up any unused imports

### 3. Type Safety
- Ensure all auth types are properly exported
- Check for any `any` types
- Verify interface compatibility

---

## 📊 Verification Script

```bash
# Check for broken imports
grep -r "from.*extensions/types" packages/
grep -r "from.*RegistryConfig" packages/
grep -r "from.*MultiRegistryLoader" packages/

# Check for old auth references
grep -r "IAuthService" --include="*.ts" --include="*.tsx" packages/
grep -r "ISubscriptionService" --include="*.ts" --include="*.tsx" packages/

# Check for guardrails references
grep -r "agentos-guardrails" --include="*.ts" --include="*.tsx" --include="*.json" .

# Verify extension structure
ls -la packages/agentos-extensions/registry/curated/auth/
```

---

## 🎯 Priority Order

1. **HIGH:** Fix broken imports and references
2. **HIGH:** Update ARCHITECTURE.md
3. **MEDIUM:** Create migration guide
4. **MEDIUM:** Update backend integration
5. **LOW:** Update all other docs
6. **LOW:** Add more examples

---

**Status:** Ready to execute
**Estimated Time:** 2-3 hours for all updates
