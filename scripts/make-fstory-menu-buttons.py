#!/usr/bin/env python3
"""Rebuild the ver 2.0 side-menu buttons Wayback never stored.

The menu was one set of twelve pill buttons. The archive kept two of them —
`dia_n.gif` and `gal_n.gif` — and returned 404 for the rest when it crawled
them on 2001-11-04; the others it never requested at all. See the CDX record.

So the pill itself is not invented here. It is lifted pixel for pixel from
`dia_n.gif`: the rounded end caps are kept as they are, and the middle is
filled by repeating a column from inside the pill, which is flat to within
five levels. Only the lettering is new, and the wording comes from the page
itself — each button's filename is the word it carried (`dia_n` → Diary,
`gal_n` → Gallery), and the `alt` text names it in Korean.

Output goes to the archive's manual layer under the site path it belongs to,
so the published tree stays generated and nothing here is mistaken for
something the archive held.

Usage: python scripts/make-fstory-menu-buttons.py [--check]
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

APP_ROOT = Path(__file__).resolve().parent.parent
SAMPLE = APP_ROOT / 'public/fstory-homepage/20021120053627/img/dia_n.gif'
# Rebuilt assets live under the site path they belong to, so the publisher can
# place one without guessing which folder a filename came from.
OUT_DIR = APP_ROOT.parent / 'data/fstory-net-wayback/manual/rebuilt/img'
FONT_PATH = Path('/usr/share/fonts/liberation-sans-fonts/LiberationSans-Bold.ttf')

# Filename → the word the button carried. The two that survive prove the rule:
# the stem is an abbreviation of an English label, and the page's `alt` gives
# the Korean meaning. Kept here so a wrong guess is one line to correct.
BUTTONS = {
    'pro_n.gif': ('Profile', '프로필'),
    'let_n.gif': ('Letter', '내 글'),
    'stu_n.gif': ('Study', '공부'),
    'kor_n.gif': ('Korea', '한국 에니메이션 음악'),
    'tech_n.gif': ('Tech', '신기술'),
    'chr_n.gif': ('Christian', '크리스챤'),
    'mybbs_n.gif': ('MyBBS', '내 게시판'),
    'tea_n.gif': ('TeaTime', '숲속얘기의 찻집'),
    'gue_n.gif': ('Guest', '방명록'),
    'lin_n.gif': ('Link', '링크'),
    'ai_n.gif': ('AI', '인공지능'),
    'upl_n.gif': ('Upload', '자료실'),
}


def ink_mask(pixels: np.ndarray) -> np.ndarray:
    """Lettering is the blue-grey; the pill is the bright blue behind it."""
    blueness = pixels[:, :, 2] - pixels[:, :, 0]
    return (blueness < 130) & (pixels[:, :, 2] < 230)


def blank_pill(sample: Path) -> tuple[Image.Image, tuple[int, int]]:
    """The sample with its word erased, plus the box the word sat in."""
    pixels = np.array(Image.open(sample).convert('RGB')).astype(int)
    columns = np.where(ink_mask(pixels).any(axis=0))[0]
    rows = np.where(ink_mask(pixels).any(axis=1))[0]
    left, right = int(columns.min()), int(columns.max())

    # The column just inside the cap repeats cleanly across the flat middle.
    filler = pixels[:, left - 1, :]
    cleaned = pixels.copy()
    cleaned[:, left:right + 1, :] = filler[:, None, :].transpose(0, 1, 2)
    for x in range(left, right + 1):
        cleaned[:, x, :] = filler
    return Image.fromarray(cleaned.astype(np.uint8)), (int(rows.min()), int(rows.max()))


def letter_colour(sample: Path) -> tuple[int, int, int]:
    """The darkest tone the sample writes with, which is its core colour."""
    pixels = np.array(Image.open(sample).convert('RGB')).astype(int)
    mask = ink_mask(pixels)
    lettering = pixels[mask]
    darkest = lettering[lettering.sum(axis=1).argmin()]
    return tuple(int(channel) for channel in darkest)


# Read off the two surviving buttons: "Diary" is 34px wide and "Gallery" 49px,
# both 12px tall, and Liberation Sans Bold at 14 renders them at 35 and 48. The
# lettering is therefore not guessed at either — it is the size the originals
# used, and only a word too long for the pill is stepped down.
BASE_SIZE = 14
SIDE_MARGIN = 16


def draw(pill: Image.Image, word: str, box: tuple[int, int], colour) -> Image.Image:
    """Centre the word in the pill at the size the surviving buttons used."""
    top, bottom = box
    width, height = pill.size
    target = bottom - top + 1
    canvas = pill.convert('RGB').copy()
    pen = ImageDraw.Draw(canvas)

    size = BASE_SIZE
    while size > 8:
        font = ImageFont.truetype(str(FONT_PATH), size)
        left, upper, right, lower = pen.textbbox((0, 0), word, font=font)
        if right - left <= width - SIDE_MARGIN:
            break
        size -= 1

    font = ImageFont.truetype(str(FONT_PATH), size)
    left, upper, right, lower = pen.textbbox((0, 0), word, font=font)
    x = (width - (right - left)) // 2 - left
    y = top + (target - (lower - upper)) // 2 - upper
    pen.text((x, y), word, font=font, fill=colour)
    return canvas


def main() -> int:
    check = '--check' in sys.argv
    if not SAMPLE.exists():
        print(f'sample button missing: {SAMPLE}', file=sys.stderr)
        return 1
    if not FONT_PATH.exists():
        print(f'font missing: {FONT_PATH}', file=sys.stderr)
        return 1

    pill, box = blank_pill(SAMPLE)
    colour = letter_colour(SAMPLE)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    written = []
    for name, (word, korean) in BUTTONS.items():
        image = draw(pill, word, box, colour)
        if check:
            written.append(f'{name}: {word} ({korean})')
            continue
        # Match the originals: palette GIF, no transparency.
        image.convert('P', palette=Image.ADAPTIVE, colors=128).save(OUT_DIR / name)
        written.append(f'{name}: {word} ({korean})')

    print(f'{"would write" if check else "wrote"} {len(written)} buttons to {OUT_DIR}')
    for line in written:
        print(f'  {line}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
