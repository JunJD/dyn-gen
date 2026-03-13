#!/usr/bin/env python3
"""Flag fallback-shaped code for manual review.

This is a smell scanner, not a verdict engine. It helps an agent review touched
files for places where silent defaults may be hiding contract problems.
"""

from __future__ import annotations

import argparse
from pathlib import Path
import re
import sys


PATTERNS = (
    ("fallback keyword", re.compile(r"\bfallback\b")),
    ("nullish coalescing", re.compile(r"\?\?")),
    ("logical-or default", re.compile(r"\|\|")),
    ("default helper naming", re.compile(r"\bdefault[A-Z_]\w*|\bwithDefault\b")),
    ("safe helper naming", re.compile(r"\bsafe[A-Z_]\w*")),
)


def iter_hits(path: Path):
    try:
        text = path.read_text()
    except UnicodeDecodeError:
        return []

    hits: list[tuple[int, str, str]] = []
    for lineno, line in enumerate(text.splitlines(), start=1):
        for label, pattern in PATTERNS:
            if pattern.search(line):
                hits.append((lineno, label, line.rstrip()))
    return hits


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Scan files for fallback-shaped code that deserves review."
    )
    parser.add_argument("paths", nargs="+", help="Files to scan")
    args = parser.parse_args()

    total_hits = 0
    for raw_path in args.paths:
        path = Path(raw_path)
        if not path.exists():
            print(f"[missing] {raw_path}", file=sys.stderr)
            continue
        if path.is_dir():
            print(f"[skip dir] {raw_path}", file=sys.stderr)
            continue

        hits = iter_hits(path)
        if not hits:
            continue

        total_hits += len(hits)
        print(f"\n{path}")
        for lineno, label, line in hits:
            print(f"  L{lineno:>4}  {label:<22} {line}")

    if total_hits == 0:
        print("No fallback-shaped patterns found.")
    else:
        print(
            "\nReview every hit. Remove silent defaults unless the fallback is "
            "strictly local and clearly justified."
        )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
