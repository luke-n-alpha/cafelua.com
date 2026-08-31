#!/usr/bin/env python3
"""Rebuild the board-skin furniture Wayback never stored.

The boards on this site ran Zeroboard and the guestbook ran PURY BBS, and both
shipped their look as dozens of small image files: spacers, header strips, row
icons, little action buttons. The archive kept the pages but almost none of
that furniture, so the boards render as a field of "picture missing" cards.

None of it is Luke's own artwork — it is stock skin packaging — so nothing is
lost by drawing it again, and the pages become readable. What is drawn here is
deliberately plain: a spacer is a spacer, a header is a flat strip in the skin's
own colour, a button is a small pictogram of what its filename says it does.

Two things keep this honest. Every file is reported as `reconstructed`, never
as archive material. And every choice is derived, not invented: the colour
comes from the skin folder's own name (`kissofgod_pink`, `jeje04green`), the
size comes from the width and height the page asked for where it gave them, and
the pictogram comes from the filename (`n_mail` draws an envelope).

Usage: python scripts/make-fstory-board-skin.py [--check]
"""

from __future__ import annotations

import hashlib
import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw

APP_ROOT = Path(__file__).resolve().parent.parent
PUBLISHED = APP_ROOT / 'public/fstory-homepage'
OUT_ROOT = APP_ROOT.parent / 'data/fstory-net-wayback/manual/rebuilt'

# Colour named by the skin folder itself. Anything unnamed stays neutral grey,
# which is what most Zeroboard skins shipped.
THEMES = {
    'pink': (0xE8, 0x8C, 0xB4),
    'pi': (0xE8, 0x8C, 0xB4),
    'green': (0x7E, 0xB5, 0x6E),
    'navy': (0x46, 0x5C, 0x8B),
    'orange': (0xE8, 0x9A, 0x4C),
    'gray': (0x99, 0x99, 0x99),
    'grey': (0x99, 0x99, 0x99),
}
NEUTRAL = (0x99, 0x99, 0x99)

# The BGM player's buttons are named by their first letter. Play, stop, pause,
# forward, back — the五 transport controls a 2001 web player carried.
TRANSPORT_WORDS = {'p': 'play', 's': 'stop', 'b': 'back', 'f': 'forward', 'o': 'open'}

SPACER = re.compile(r'^(t|dot_?|blank|space|s|line|bar|null)\.(gif|jpg)$', re.I)
PAGE_BACKGROUND = re.compile(r'^back\d?\.(gif|jpg)$', re.I)
TRANSPORT = re.compile(r'^button_([a-z])\.gif$', re.I)
ICON_70 = re.compile(r'/icon/[^/]+\.(gif|jpg)$', re.I)
HEADER = re.compile(r'head', re.I)


def theme_for(path: str) -> tuple[int, int, int]:
    folder = path.lower()
    for name, colour in THEMES.items():
        if re.search(rf'[_/]{name}(\d|[_/]|$)', folder):
            return colour
    return NEUTRAL


def tint(colour, factor: float):
    return tuple(min(255, max(0, int(channel * factor))) for channel in colour)


def spacer(size: tuple[int, int]) -> Image.Image:
    """A spacer holds a gap open; it must not draw anything."""
    image = Image.new('RGBA', size, (0, 0, 0, 0))
    return image


def header(colour, size: tuple[int, int]) -> Image.Image:
    """A flat strip with the soft top highlight these skins all had."""
    width, height = size
    image = Image.new('RGB', size, colour)
    pen = ImageDraw.Draw(image)
    for y in range(height):
        shade = 1.18 - (y / max(height - 1, 1)) * 0.34
        pen.line([(0, y), (width, y)], fill=tint(colour, shade))
    pen.line([(0, height - 1), (width, height - 1)], fill=tint(colour, 0.72))
    return image


def tile(colour, size: tuple[int, int]) -> Image.Image:
    """A cell background repeats, so it must be flat and quiet — anything with a
    figure in it turns into wallpaper of that figure."""
    return Image.new('RGB', size, tint(colour, 1.62))


def pictogram(name: str, colour, size: tuple[int, int]) -> Image.Image:
    """Draw what the filename says the button does."""
    width, height = size
    image = Image.new('RGBA', size, (0, 0, 0, 0))
    pen = ImageDraw.Draw(image)
    ink = tint(colour, 0.62)
    # Padding has to come off the short side, or a wide flat button ends up with
    # a box whose bottom is above its top.
    pad = max(1, min(width, height) // 6)
    box = (pad, pad, max(pad + 2, width - pad - 1), max(pad + 2, height - pad - 1))
    stem = name.lower()

    if 'mail' in stem or 'letter' in stem:
        pen.rectangle(box, outline=ink)
        pen.line([box[0], box[1], (box[0] + box[2]) // 2, (box[1] + box[3]) // 2, box[2], box[1]], fill=ink)
    elif 'home' in stem:
        mid = (box[0] + box[2]) // 2
        pen.polygon([(mid, box[1]), (box[2], (box[1] + box[3]) // 2), (box[0], (box[1] + box[3]) // 2)], outline=ink)
        pen.rectangle((box[0] + 1, (box[1] + box[3]) // 2, box[2] - 1, box[3]), outline=ink)
    elif 'search' in stem or 'find' in stem:
        pen.ellipse((box[0], box[1], box[2] - 2, box[3] - 2), outline=ink)
        pen.line([box[2] - 3, box[3] - 3, box[2], box[3]], fill=ink)
    elif 'modify' in stem or 'edit' in stem or 'write' in stem:
        pen.line([box[0], box[3], box[2], box[1]], fill=ink)
        pen.line([box[0], box[3], box[0] + 2, box[3] - 2], fill=ink)
    elif 'del' in stem or 'close' in stem or 'cancel' in stem:
        pen.line([box[0], box[1], box[2], box[3]], fill=ink)
        pen.line([box[0], box[3], box[2], box[1]], fill=ink)
    elif 'memo' in stem or 'note' in stem or 'reply' in stem:
        pen.rectangle(box, outline=ink)
        for offset in range(1, 4):
            y = box[1] + offset * max(2, height // 6)
            if y < box[3]:
                pen.line([box[0] + 2, y, box[2] - 2, y], fill=ink)
    elif 'info' in stem:
        pen.ellipse(box, outline=ink)
        mid = (box[0] + box[2]) // 2
        pen.line([mid, box[1] + 3, mid, box[3] - 2], fill=ink)
    elif stem == 'play':
        pen.polygon([(box[0], box[1]), (box[2], (box[1] + box[3]) // 2), (box[0], box[3])], fill=ink)
    elif stem == 'stop':
        pen.rectangle(box, fill=ink)
    elif stem == 'back':
        pen.polygon([(box[2], box[1]), (box[0], (box[1] + box[3]) // 2), (box[2], box[3])], fill=ink)
    elif stem == 'forward':
        pen.polygon([(box[0], box[1]), (box[2], (box[1] + box[3]) // 2), (box[0], box[3])], fill=ink)
    elif stem == 'open':
        pen.rectangle((box[0], box[1] + 2, box[2], box[3]), outline=ink)
        pen.line([box[0], box[1] + 2, (box[0] + box[2]) // 2, box[1]], fill=ink)
    elif 'lock' in stem or 'secret' in stem:
        pen.rectangle((box[0], (box[1] + box[3]) // 2, box[2], box[3]), outline=ink)
        pen.arc((box[0] + 2, box[1], box[2] - 2, box[3]), 180, 360, fill=ink)
    else:
        # The filename says nothing about what this one did. An empty box drawn
        # down a whole board column reads as damage, so leave a quiet dot: the
        # cell keeps its size and the eye passes over it.
        cx, cy = width // 2, height // 2
        radius = max(1, min(width, height) // 6)
        pen.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=tint(colour, 1.15))
    return image


def row_icon(name: str, size: tuple[int, int]) -> Image.Image:
    """A poster's chosen icon. No two should look alike, and the same name must
    always come out the same, so the shape and hue are drawn from the name."""
    seed = int(hashlib.sha256(name.encode()).hexdigest()[:8], 16)
    hue = seed % 360
    from colorsys import hsv_to_rgb
    base = tuple(int(channel * 255) for channel in hsv_to_rgb(hue / 360, 0.42, 0.86))
    width, height = size
    image = Image.new('RGB', size, (0xFF, 0xFF, 0xFF))
    pen = ImageDraw.Draw(image)
    pen.rounded_rectangle((1, 1, width - 2, height - 2), radius=max(3, width // 8),
                          fill=tint(base, 1.12), outline=tint(base, 0.7))
    inner = (width // 4, height // 4, width - width // 4, height - height // 4)
    shape = (seed >> 8) % 4
    fill = tint(base, 0.74)
    if shape == 0:
        pen.ellipse(inner, fill=fill)
    elif shape == 1:
        pen.rectangle(inner, fill=fill)
    elif shape == 2:
        pen.polygon([((inner[0] + inner[2]) // 2, inner[1]), (inner[2], inner[3]), (inner[0], inner[3])], fill=fill)
    else:
        pen.ellipse(inner, outline=fill, width=max(2, width // 12))
    return image


def main() -> int:
    check = '--check' in sys.argv
    needs_file = Path(__file__).resolve().parent / 'fstory-board-skin-needs.json'
    if not needs_file.exists():
        print(f'needs file missing: {needs_file}', file=sys.stderr)
        print('regenerate it with scripts/collect-fstory-skin-needs.py', file=sys.stderr)
        return 1
    needs = json.loads(needs_file.read_text(encoding='utf-8'))

    written = 0
    for site_path, meta in sorted(needs.items()):
        name = site_path.rsplit('/', 1)[-1]
        # A page that asks for a 1x0 image is stating a spacer, not a size to
        # draw at, so only a box big enough to hold a drawing is honoured.
        asked = meta.get('sizes') or []
        requested = tuple(asked[0][0]) if asked else None
        size = requested if requested and requested[0] >= 8 and requested[1] >= 8 else None

        if SPACER.match(name) or (requested and min(requested) < 4):
            image = spacer(requested if requested and all(requested) else (1, 1))
        elif PAGE_BACKGROUND.match(name):
            image = tile(theme_for(site_path), size or (24, 24))
        elif TRANSPORT.match(name):
            image = pictogram(TRANSPORT_WORDS.get(TRANSPORT.match(name).group(1).lower(), 'button'),
                              theme_for(site_path), size or (18, 18))
        elif meta.get('usedAs') == 'background':
            image = tile(theme_for(site_path), size or (8, 8))
        elif ICON_70.search('/' + site_path):
            image = row_icon(site_path, size or (70, 70))
        elif HEADER.search(name):
            image = header(theme_for(site_path), size or (120, 24))
        else:
            image = pictogram(name, theme_for(site_path), size or (16, 16))

        if check:
            written += 1
            continue
        target = OUT_ROOT / site_path
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.suffix.lower() in {'.jpg', '.jpeg'}:
            image.convert('RGB').save(target, quality=88)
        else:
            image.save(target)
        written += 1

    print(f'{"would write" if check else "wrote"} {written} skin files to {OUT_ROOT}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
