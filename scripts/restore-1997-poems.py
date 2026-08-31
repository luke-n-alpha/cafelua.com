#!/usr/bin/env python3
"""Restore the 1997 poem pages whose bodies survived in later fstory.net editions.

Luke carried his own poems forward each time he rebuilt the site, so a poem the
1997 index lists but never saved as a page often still exists under
`myletter/poem/` in a 2001–2003 capture. This script matches the two by title
and date, and writes the surviving body back into a 1997-style page.

Matching is deliberately conservative. It is calibrated against the 42 poems the
1997 edition still has: a candidate is accepted only when the evidence that
identifies those 42 correctly also identifies it, and never when a runner-up
scores as well.
"""

from __future__ import annotations

import json
import re
import sys
import urllib.parse
from html import escape
from pathlib import Path

APP_ROOT = Path(__file__).resolve().parents[1]
EDITION = APP_ROOT / "public" / "1997-homepage"
INDEX_PAGES = ("si.html", "si1.html")
POEM_DIR = EDITION / "gl" / "poem"
ARCHIVE = APP_ROOT.parent / "data" / "fstory-net-wayback"

ACCEPT_SCORE = 7          # calibrated on the 42 known poems
DATE = re.compile(r"(\d{2,4})\s*[.\-/]\s*(\d{1,2})\s*[.\-/]\s*(\d{1,2})")


def read(path: Path) -> str:
    raw = path.read_bytes()
    for encoding in ("utf-8", "cp949"):
        try:
            return raw.decode(encoding)
        except UnicodeDecodeError:
            continue
    return raw.decode("latin1")


def strip_tags(html: str) -> str:
    html = re.sub(r"(?is)<(script|style).*?</\1>", " ", html)
    html = re.sub(r"<br\s*/?>", "\n", html, flags=re.I)
    html = re.sub(r"</(p|div|tr|td)>", "\n", html, flags=re.I)
    html = re.sub(r"<[^>]+>", " ", html)
    return re.sub(r"[ \t]+", " ", html.replace("&nbsp;", " "))


def strip_style(text: str) -> str:
    """Drop the stylesheet the later editions inlined above the poem."""
    lines = [
        line for line in text.split("\n")
        if not re.match(r"\s*(A:|body\b|[.#]?\w[\w-]*\s*\{|[}{]|[A-Z-]+\s*:)", line)
    ]
    return "\n".join(lines)


def dates(text: str) -> set[tuple[int, int, int]]:
    found = set()
    for match in DATE.finditer(text):
        year, month, day = (int(part) for part in match.groups())
        year = 1900 + year if 90 <= year <= 99 else (2000 + year if year < 50 else year)
        found.add((year, month, day))
    return found


def key_of(text: str) -> str:
    # Underscores stand in for spaces in the archived filenames, so they must
    # vanish along with the punctuation rather than count as letters.
    return re.sub(r"[^0-9A-Za-z가-힣]+", "", text)


def archived_poems() -> dict[str, tuple[Path, str]]:
    poems: dict[str, tuple[Path, str]] = {}
    for path in ARCHIVE.rglob("*"):
        if not path.is_file() or "/poem/" not in path.as_posix():
            continue
        if not path.name.lower().endswith((".html", ".htm")):
            continue
        name = urllib.parse.unquote(path.name, encoding="cp949", errors="replace")
        if name in poems:
            continue
        body = re.sub(r"(?i)Fstory's\s+homepage", "", read(path))
        poems[name] = (path, strip_tags(body))
    return poems


def index_entries() -> list[tuple[int, str, set]]:
    entries: dict[int, tuple[str, set]] = {}
    for page in INDEX_PAGES:
        html = read(EDITION / page)
        for match in re.finditer(
            r"href=[\"']?([^\"'\s>]*?poem(\d+)\.html[^\"'>]*)[\"']?[^>]*>(.*?)</a>",
            html, re.I | re.S,
        ):
            _, number, label = match.groups()
            # `<96.4.5>` is a date the page prints, not a tag.
            stamp = re.search(r"<\s*(\d[\d.\s]*)\s*>", label)
            title = re.sub(r"<[^>]*>", "", label).strip()
            entries.setdefault(int(number), (title, dates(stamp.group(1)) if stamp else set()))
    return [(number, title, when) for number, (title, when) in sorted(entries.items())]


def score(title: str, when: set, poems: dict[str, tuple[Path, str]], taken: set[str]):
    key = key_of(title)
    ranked = []
    for name, (_, body) in poems.items():
        if name in taken:
            continue
        stem = key_of(re.sub(r"\.html?$", "", name, flags=re.I)[1:])
        points, why = 0, []
        if key and key == stem:
            points += 6
            why.append("파일 이름이 같음")
        elif key and len(key) >= 3 and (key in stem or stem in key):
            points += 3
            why.append("파일 이름이 비슷함")
        normalized = key_of(strip_style(body))
        if key and len(key) >= 4 and key in normalized[:90]:
            # The 1997 index titled many poems with their own opening line, so a
            # title that opens the body identifies it on its own.
            points += 7
            why.append("본문이 제목으로 시작함")
        elif key and len(key) >= 3 and key in normalized:
            points += 4
            why.append("본문에 제목이 있음")
        found = dates(body)
        if when and found & when:
            points += 5
            why.append("날짜가 같음")
        elif when and found:
            points -= 3
        if points > 0:
            ranked.append((points, name, why))
    ranked.sort(reverse=True)
    return ranked


PAGE = """<html>
        <head>
<meta charset="utf-8">

                <title> Yang Byoug Seok Home page </title>
        </Head>

        <body background="../glbak.gif" >
        
        
        <table align=center>
        <td> <a href="../../si.html"> <img src="../../common/post2.gif" border=0> 
</a> <td><a href="../../si.html"> <font size=6 color="aa0000"> 전화면 </a> <tr>
        </table>
        <hr size=2>
        <font color="aaaaaa" size=4>
      <pre>

{body}

</pre>

 <hr size=2>
<table align=center>
        <td> <a href="../../si.html"> <img src="../../common/post2.gif" border=0> 
</a> <td><a href="../../si.html"> <font size=6 color="aa0000"> 전화면 </a> <tr>
        </table>
<!-- 이 시의 본문은 1997년 판에 남아 있지 않아, 같은 시를 다시 실었던
     {source} 에서 되살렸습니다. -->
</body>
</html>
"""


def clean_body(text: str) -> str:
    lines = [line.rstrip() for line in text.split("\n")]
    while lines and not lines[0].strip():
        lines.pop(0)
    while lines and not lines[-1].strip():
        lines.pop()
    return "\n".join(lines)


def main() -> None:
    apply = "--apply" in sys.argv
    poems = archived_poems()
    entries = index_entries()
    taken: set[str] = set()

    # Consume the archive twin of every poem the edition already has, so a
    # surviving poem is never handed to a second, different title.
    calibration = {"맞음": 0, "틀림": 0, "후보 없음": 0}
    for number, title, when in entries:
        local = POEM_DIR / f"poem{number}.html"
        if not local.exists():
            continue
        marker = re.search(r"(?is)<pre>(.*?)</pre>", read(local))
        truth = key_of(strip_tags(marker.group(1)) if marker else strip_tags(read(local)))
        ranked = score(title, when, poems, taken)
        if not ranked:
            calibration["후보 없음"] += 1
            continue
        best = ranked[0]
        body = key_of(poems[best[1]][1])
        if truth[:40] and (truth[:40] in body or body[:40] in truth):
            calibration["맞음"] += 1
            taken.add(best[1])
        else:
            calibration["틀림"] += 1

    restored, rejected = [], []
    for number, title, when in entries:
        if (POEM_DIR / f"poem{number}.html").exists():
            continue
        ranked = score(title, when, poems, taken)
        best = ranked[0] if ranked else None
        runner_up = ranked[1][0] if len(ranked) > 1 else -1
        if best and best[0] >= ACCEPT_SCORE and best[0] > runner_up:
            taken.add(best[1])
            restored.append({
                "number": number, "title": title,
                "source": best[1], "score": best[0], "evidence": best[2],
                "dates": sorted(when),
            })
        else:
            rejected.append({
                "number": number, "title": title, "dates": sorted(when),
                "bestCandidate": best[1] if best else None,
                "bestScore": best[0] if best else 0,
                "evidence": best[2] if best else [],
            })

    if apply:
        for item in restored:
            body = clean_body(poems[item["source"]][1])
            (POEM_DIR / f"poem{item['number']}.html").write_text(
                PAGE.format(body=escape(body, quote=False), source=escape(item["source"])),
                encoding="utf-8",
            )

    print(json.dumps({
        "calibration": calibration,
        "archivedPoems": len(poems),
        "indexEntries": len(entries),
        "restored": restored,
        "rejected": rejected,
        "applied": apply,
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
