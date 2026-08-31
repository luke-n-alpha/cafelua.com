#!/usr/bin/env python3
"""List the board-skin files the published editions ask for and never get.

Reads the published tree, which records every address it could not restore in a
`data-unrestored-src` attribute, and keeps the ones that belong to a Zeroboard
or PURY BBS skin. The result feeds scripts/make-fstory-board-skin.py.

Kept separate from the drawing script so the list is a checked-in artefact: a
reviewer can see exactly which files are being redrawn, and a rerun after the
archive layer changes shows up as a diff rather than as silent new artwork.

Usage: python scripts/collect-fstory-skin-needs.py
"""

from __future__ import annotations

import json
import os
import re
from collections import Counter, defaultdict
from pathlib import Path

APP_ROOT = Path(__file__).resolve().parent.parent
PUBLISHED = APP_ROOT / 'public/fstory-homepage'
OUT_FILE = Path(__file__).resolve().parent / 'fstory-board-skin-needs.json'

SKIN_PATH = re.compile(r'(^|/)(skin|icon|images)/', re.I)
# Page furniture that lives outside a skin folder: the tiled page backgrounds
# and the BGM player's transport buttons. Named explicitly, because everything
# else at these levels is Luke's own artwork and must never be redrawn.
FURNITURE = re.compile(r'(^|/)(back\d?\.(gif|jpg)|button_[a-z]\.gif|tab\d?\.jpg)$', re.I)
# Skin furniture arrives two ways: as a picture, and as a table cell's tiled
# background. Collecting only the first leaves the boards' backdrops missing.
IMG_TAG = re.compile(r'<(?:img|td|table|tr|th|body)[^>]*>', re.I)
UNRESTORED = re.compile(r'data-unrestored-(src|background)\s*=\s*"([^"]+)"', re.I)
WIDTH = re.compile(r'\bwidth\s*=\s*"?(\d+)', re.I)
HEIGHT = re.compile(r'\bheight\s*=\s*"?(\d+)', re.I)


def main() -> int:
    found = defaultdict(lambda: {'n': 0, 'sizes': Counter(), 'as': Counter()})
    for root, _, files in os.walk(PUBLISHED):
        for name in files:
            if not name.lower().endswith(('.html', '.htm')):
                continue
            page = Path(root) / name
            edition = page.relative_to(PUBLISHED).parts[0]
            page_dir = page.parent.relative_to(PUBLISHED / edition)
            text = page.read_text(encoding='utf-8', errors='replace')
            for tag in IMG_TAG.findall(text):
                match = UNRESTORED.search(tag)
                if not match:
                    continue
                role, source = match.group(1).lower(), match.group(2).split('?')[0]
                if source.lower().startswith('http'):
                    continue
                if not SKIN_PATH.search(source) and not FURNITURE.search(source):
                    continue
                site = os.path.normpath(os.path.join(page_dir, source)).replace(os.sep, '/')
                if site.startswith('..'):
                    continue
                width = WIDTH.search(tag)
                height = HEIGHT.search(tag)
                entry = found[site]
                entry['n'] += 1
                entry['as'][role] += 1
                if width and height:
                    entry['sizes'][(int(width.group(1)), int(height.group(1)))] += 1

    fresh = {
        site: {
            'references': meta['n'],
            # A file used as a cell background tiles; one used as a picture does
            # not. They have to be drawn differently.
            'usedAs': meta['as'].most_common(1)[0][0] if meta['as'] else 'src',
            'sizes': [[list(size), count] for size, count in meta['sizes'].most_common()],
        }
        for site, meta in found.items()
    }
    # Merge rather than replace. A file already rebuilt no longer shows up as
    # missing, and dropping it from the list would delete the record of what was
    # redrawn and why.
    previous = json.loads(OUT_FILE.read_text(encoding='utf-8')) if OUT_FILE.exists() else {}
    merged = dict(previous)
    # Files already rebuilt no longer appear as missing, so seed the list from
    # what has been drawn. Otherwise a rerun would forget how to remake them.
    rebuilt_root = APP_ROOT.parent / 'data/fstory-net-wayback/manual/rebuilt'
    if rebuilt_root.exists():
        for existing in rebuilt_root.rglob('*'):
            if not existing.is_file():
                continue
            site = str(existing.relative_to(rebuilt_root)).replace(os.sep, '/')
            if not (SKIN_PATH.search(site) or FURNITURE.search(site)) or site in merged:
                continue
            from PIL import Image as _Image
            with _Image.open(existing) as opened:
                width, height = opened.size
            merged[site] = {'references': 0, 'usedAs': 'src', 'sizes': [[[width, height], 0]]}
    for site, meta in fresh.items():
        if site in merged and not meta['sizes']:
            continue
        merged[site] = meta
    payload = {site: merged[site] for site in sorted(merged)}
    OUT_FILE.write_text(json.dumps(payload, indent=1, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'{len(payload)} skin files needed, {sum(v["references"] for v in payload.values())} references')
    print(f'written to {OUT_FILE}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
