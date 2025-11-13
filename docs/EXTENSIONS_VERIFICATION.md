# AgentOS Extensions – Verification Program

This document defines the administrative process, standards, and security practices for awarding the “Verified” badge to AgentOS extensions and tools.

## Overview

- Verified indicates a curated, security-reviewed, and quality-gated extension/tool pack that meets AgentOS standards.
- The badge is recorded in the extensions registry alongside verification metadata and surfaced in the backend and UI.

## Roles

- Maintainer: Author or primary contact for the extension.
- Reviewer: AgentOS team member(s) performing the review.
- Approver: Admin who can grant or revoke the Verified badge.

## Requirements (Checklist)

1. Documentation
   - README with purpose, setup, configuration, capabilities, and limitations
   - Usage examples and expected I/O schemas
   - Change log or release notes
2. Types and Schemas
   - Strong TypeScript types for exported APIs
   - JSON Schema for each tool input/output with examples
3. Testing
   - Unit test coverage (≥ 80% for tool logic) – run via `pnpm test`
   - Minimal integration test showing real or stubbed execution path
   - No flaky tests; deterministic seed or mocks for network
4. Security Practices
   - No dynamic code execution (`eval`, `Function` constructors) unless strictly sandboxed
   - No secret exfiltration: secrets must be passed via configuration and never logged
   - Minimal, pinned dependencies; zero known vulnerabilities (OSV/GitHub advisories)
   - Network calls are explicit and documented (domains, auth methods)
   - Input validation with JSON Schema (AJV) before execution
   - Output sanitization where applicable (e.g., HTML/markdown outputs)
   - License compliance and attribution for third-party assets
5. Operational Quality
   - Clear error handling and typed errors
   - Idempotent or clearly documented side-effects
   - Performance reasonable for intended use (time limits documented)
   - Runtime compatibility matrix (Node/browser/edge, supported AgentOS versions)

## Process

1. Submission
   - Maintainer opens a verification request with: repo link, version, README, schema links, test report, and changelog.
2. Automated Checks (CI)
   - Lint + typecheck + unit tests + coverage
   - Security scan (e.g., `osv-scanner`, `npm audit`), dependency review, license checks
3. Manual Review
   - Reviewers validate docs, behavior, schemas, error handling, side-effects, and security controls
4. Decision
   - Approver sets verification metadata in the registry:
     ```json
     {
       "verified": true,
       "verifiedAt": "2025-11-13T00:00:00Z",
       "verifiedBy": { "name": "AgentOS Admin", "email": "security@agentos.sh" },
       "verificationChecklistVersion": "1.0.0"
     }
     ```
5. Publication
   - Registry change merged; UI shows a Verified badge and hover hint linking to this policy

## Revocation

- Reasons: new vulnerabilities, broken tests, policy violations, or undisclosed side-effects
- Registry `verified` set to false; `revokedAt` and `revocationReason` recorded

## Versioning

- Verification applies to a semver range or a specific version
- The registry may include `verifiedRange` to reflect coverage (e.g., `^1.2.0`)

## Contact

- security@agentos.sh for disclosure and verification inquiries


