from __future__ import annotations

"""
Message rewrite callback for git-filter-repo.

This is intentionally conservative: it tries to prefix commits without a
Conventional Commit type with "chore:", and normalizes trivial subjects.
"""

import re

TYPES = ("feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "chore", "revert")
TYPE_RE = re.compile(rf"^({'|'.join(TYPES)})(\(.+?\))?:\s+")

def normalize_subject(subject: str) -> str:
    s = subject.strip()
    # Collapse whitespace
    s = re.sub(r"\s+", " ", s)
    # Ensure it isn't empty
    return s if s else "chore: maintenance"

def ensure_conventional(subject: str) -> str:
    s = normalize_subject(subject)
    if TYPE_RE.match(s):
        return s
    # Prefix with chore: if the subject lacks a known type
    return f"chore: {s}"

def rename_message(message, metadata):
    """
    git-filter-repo message-callback signature.
    'message' is a bytearray; 'metadata' includes 'commit' and other fields.
    """
    # Convert to text, rewrite subject line, keep body intact
    try:
        text = message.decode("utf-8", errors="replace")
    except Exception:
        return
    lines = text.splitlines()
    if not lines:
        return
    lines[0] = ensure_conventional(lines[0])
    new_text = "\n".join(lines)
    message[:] = new_text.encode("utf-8")


