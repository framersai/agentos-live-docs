---
name: git
description: Work with Git repositories from the command line.
metadata:
  agentos:
    emoji: '🧰'
    requires:
      bins: ['git']
    install:
      - id: brew
        kind: brew
        formula: git
        bins: ['git']
        label: 'Install git (brew)'
      - id: apt
        kind: apt
        package: git
        bins: ['git']
        os: ['linux']
        label: 'Install git (apt)'
---

# Git

Use `git` to inspect history, create branches, commit changes, and resolve conflicts.

## Common workflows

- Check status: `git status`
- Create a branch: `git checkout -b my-branch`
- Stage + commit: `git add -A && git commit -m "message"`
- Rebase: `git rebase -i origin/main`
