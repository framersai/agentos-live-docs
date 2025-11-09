# Contributing to AgentOS Guardrails

Thank you for contributing safety and policy guardrails to the AgentOS ecosystem! 🛡️

## 🎁 Free CI/CD for Contributors

**When you contribute a guardrail, we provide completely FREE infrastructure:**

✅ **GitHub Actions CI/CD**: Automated testing, linting, building  
✅ **Multi-version testing**: Node 18, 20, 22  
✅ **Automatic npm publishing**: Releases published on version bump  
✅ **Dependency management**: Dependabot auto-merge for patches  
✅ **Code quality gates**: ESLint, type-checking, test coverage  
✅ **Documentation generation**: TypeDoc + README validation  
✅ **Security scanning**: Secret detection, vulnerability checks  

**You write the guardrail—we handle the DevOps.** No setup, no cost, no hassle.

---

## 📋 Contribution Guidelines

### 1. Choose a Template

We provide three starter templates:

- **`templates/keyword-template/`**: For exact match, regex, or PII patterns
- **`templates/llm-template/`**: For LLM-powered policy reasoning
- **`templates/basic-template/`**: Minimal boilerplate for custom logic

```bash
# Use the scaffold script
pnpm run create-guardrail

# Or manually copy a template
cp -r templates/keyword-template registry/community/guardrail-yourname
```

### 2. Guardrail Structure

```
registry/community/guardrail-yourname/
├── package.json          # npm metadata
├── manifest.json         # AgentOS manifest
├── src/
│   ├── index.ts          # Entry point (exports guardrail class)
│   ├── MyGuardrail.ts    # Main implementation
│   └── types.ts          # Type definitions
├── test/
│   └── MyGuardrail.spec.ts  # Unit tests (required!)
├── README.md             # Usage guide
├── tsconfig.json         # TypeScript config
└── LICENSE               # MIT or compatible
```

### 3. Naming Standards

- **Package name**: `@framersai/guardrail-{name}` (e.g., `@framersai/guardrail-medical-advice`)
- **Directory**: `guardrail-{name}` (lowercase, hyphen-separated)
- **Class name**: `{Name}Guardrail` (e.g., `MedicalAdviceGuardrail`)
- **Manifest ID**: `guardrail-{name}` (matches directory)

### 4. Required Fields

**`package.json`:**
```json
{
  "name": "@framersai/guardrail-yourname",
  "version": "1.0.0",
  "description": "Short description",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/framersai/agentos-guardrails",
    "directory": "registry/community/guardrail-yourname"
  },
  "keywords": ["agentos", "guardrail", "safety"]
}
```

**`manifest.json`:**
```json
{
  "id": "guardrail-yourname",
  "kind": "guardrail",
  "version": "1.0.0",
  "displayName": "Your Guardrail Name",
  "description": "What it does and when to use it",
  "category": "safety",
  "author": "Your Name <email@example.com>",
  "license": "MIT",
  "repository": "https://github.com/framersai/agentos-guardrails",
  "configuration": {
    "schema": {
      "type": "object",
      "properties": {
        "yourConfig": { "type": "string" }
      }
    }
  }
}
```

### 5. Testing Requirements

All guardrails MUST include tests:

```typescript
// test/MyGuardrail.spec.ts
import { describe, it, expect } from 'vitest';
import { MyGuardrail } from '../src/MyGuardrail';
import { GuardrailAction } from '@agentos/core/guardrails/IGuardrailService';

describe('MyGuardrail', () => {
  it('blocks prohibited input', async () => {
    const guard = new MyGuardrail({ /* config */ });
    const result = await guard.evaluateInput({ /* payload */ });
    expect(result?.action).toBe(GuardrailAction.BLOCK);
  });

  it('allows safe content', async () => {
    const guard = new MyGuardrail({ /* config */ });
    const result = await guard.evaluateInput({ /* safe payload */ });
    expect(result).toBeNull();
  });
});
```

**Minimum coverage**: 80% (enforced by CI)

### 6. Documentation Requirements

**`README.md`** must include:

- What the guardrail does (2-3 sentences)
- Installation instructions
- Configuration example
- Use case examples
- TSDoc comments in all exported classes/functions

**TSDoc standards:**

```typescript
/**
 * Detects and sanitizes credit card numbers in text.
 * 
 * @example
 * ```typescript
 * const guard = new CreditCardGuardrail({
 *   action: 'sanitize',
 *   replacement: '[CARD]',
 * });
 * ```
 */
export class CreditCardGuardrail implements IGuardrailService {
  /**
   * Evaluate user input for credit card patterns.
   * @param payload - Input payload with user text
   * @returns Guardrail decision or null if no match
   */
  async evaluateInput(payload: GuardrailInputPayload): Promise<GuardrailEvaluationResult | null> {
    // ...
  }
}
```

### 7. Submission Process

1. **Fork** this repository
2. **Create branch**: `add-guardrail-yourname`
3. **Scaffold** from template (see templates/)
4. **Implement** your guardrail with tests
5. **Test locally**: `pnpm test`
6. **Commit** with lowercase, 1-2 line messages (no scope prefix):
   ```
   add medical advice guardrail
   
   blocks requests for diagnosis or treatment recommendations
   ```
7. **Push** and open a PR
8. **Automated checks** run on your PR (lint, test, coverage, structure)
9. **Review** by maintainers (usually 1-2 days)
10. **Merge** → automatic npm publish!

### 8. Code of Conduct

- Be respectful and constructive
- Follow existing code style (enforced by ESLint)
- No hardcoded secrets or API keys
- Test thoroughly before submitting
- Respond to review feedback within 7 days

---

## 🛠️ Development Workflow

```bash
# Clone the repo
git clone https://github.com/framersai/agentos-guardrails
cd agentos-guardrails

# Install dependencies
pnpm install

# Create a new guardrail
pnpm run create-guardrail

# Run tests for your guardrail
cd registry/community/guardrail-yourname
pnpm test

# Run all guardrail tests
cd ../../..
pnpm test

# Generate docs
pnpm run docs

# Lint
pnpm run lint
```

---

## 🎯 Guardrail Categories

- **safety**: Content filtering, harmful content detection
- **privacy**: PII redaction, data protection
- **budget**: Cost ceilings, rate limiting
- **compliance**: Regulatory, organizational policies
- **quality**: Confidence thresholds, factuality checks
- **custom**: Specialized use cases

Choose the category that best fits your guardrail's primary purpose.

---

## 📄 License

All contributions must be MIT licensed or compatible. By submitting a PR, you agree to license your guardrail under MIT.

---

## 🙋 Need Help?

- [Open an issue](https://github.com/framersai/agentos-guardrails/issues/new/choose)
- [Join Discord](https://discord.gg/agentos)
- Email: guardrails@framers.ai

---

**Thank you for making AgentOS safer and more reliable!** 🙏

