#!/usr/bin/env python3
"""Read-only lineage + content-diff analysis across restored fstory.net snapshots.

Produces a machine-derived design lineage (from index/main page fingerprints)
and a per-path content difference matrix across the nine captures.
"""

from __future__ import annotations

import hashlib
import json
import re
from collections import Counter, defaultdict
from pathlib import Path

from bs4 import BeautifulSoup

APP_ROOT = Path(__file__).resolve().parents[1]
DATA_ROOT = APP_ROOT.parent / "data" / "fstory-net-wayback" / "versions"
SOURCE_ROOT = DATA_ROOT / "reconstructed"
TIMESTAMPS = (
    "20010715123146", "20010723051951", "20010925220320",
    "20011202212712", "20020325014505", "20020924164928",
    "20021120053627", "20021128181318", "20030726202839",
)
HTML_EXTENSIONS = {".html", ".htm", ".php", ".cgi"}


def read_text(path: Path) -> str:
    raw = path.read_bytes()
    try:
        return raw.decode("utf-8")
    except UnicodeDecodeError:
        return raw.decode("cp949", errors="replace")


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()[:16]


def normalized_text(html: str) -> str:
    """Visible text only, whitespace collapsed — for content comparison."""
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style"]):
        tag.decompose()
    return re.sub(r"\s+", " ", soup.get_text(" ")).strip()


def dom_skeleton(html: str) -> str:
    """Tag sequence with structural attributes only — for design comparison."""
    soup = BeautifulSoup(html, "html.parser")
    parts: list[str] = []
    for tag in soup.find_all(True):
        if tag.name in ("script", "style"):
            continue
        marks = []
        for key in ("bgcolor", "background", "border", "width", "height", "rows", "cols", "name", "target"):
            value = tag.get(key)
            if isinstance(value, str):
                marks.append(f"{key}={value.lower()}")
        parts.append(tag.name + ("[" + ",".join(marks) + "]" if marks else ""))
    return " ".join(parts)


def chrome_chain(root: Path, entry: Path, seen: set[Path] | None = None, depth: int = 0) -> list[Path]:
    """Entry page plus every frame/iframe document it composes, recursively.

    The v2 lineage nests an iframe inside index.html and a frameset inside
    main.html, so a fingerprint that stops at index.html cannot see the design.
    """
    if seen is None:
        seen = set()
    if entry in seen or depth > 4 or not entry.exists():
        return []
    seen.add(entry)
    chain = [entry]
    html = read_text(entry)
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup.find_all(["frame", "iframe"]):
        src = (tag.get("src") or "").split("?")[0].split("#")[0]
        if not src or "://" in src:
            continue
        target = (entry.parent / src).resolve()
        try:
            target.relative_to(root.resolve())
        except ValueError:
            continue
        chain += chrome_chain(root, target, seen, depth + 1)
    return chain


def frame_tree(root: Path, entry: Path, depth: int = 0) -> dict:
    """Nested frame layout as a comparable structure."""
    if depth > 4 or not entry.exists():
        return {}
    soup = BeautifulSoup(read_text(entry), "html.parser")
    node: dict = {"page": entry.relative_to(root).as_posix(), "children": []}
    frameset = soup.find("frameset")
    if frameset is not None:
        node["layout"] = frameset.get("rows") or frameset.get("cols") or ""
    for tag in soup.find_all(["frame", "iframe"]):
        src = (tag.get("src") or "").split("?")[0].split("#")[0]
        entry_node = {
            "name": tag.get("name") or tag.name,
            "src": src,
            "size": f"{tag.get('width') or ''}x{tag.get('height') or ''}".strip("x"),
        }
        if src and "://" not in src:
            target = (entry.parent / src).resolve()
            try:
                target.relative_to(root.resolve())
                entry_node["tree"] = frame_tree(root, target, depth + 1)
            except ValueError:
                pass
        node["children"].append(entry_node)
    return node


def design_fingerprint(root: Path) -> dict:
    """Design identity of a snapshot: composed frame chrome, art, palette."""
    entry = root / "index.html"
    if not entry.exists():
        candidates = sorted(root.glob("*.htm*"))
        entry = candidates[0] if candidates else None
    if entry is None:
        return {}
    html = read_text(entry)
    soup = BeautifulSoup(html, "html.parser")
    body = soup.find("body")
    chrome_pages = chrome_chain(root, entry)

    images: list[str] = []
    palette: Counter = Counter()
    skeleton_parts: list[str] = []
    menu_links: list[str] = []
    for page in chrome_pages:
        page_html = read_text(page)
        page_soup = BeautifulSoup(page_html, "html.parser")
        for tag in page_soup.find_all(True):
            for key in ("bgcolor", "background", "text", "link", "vlink"):
                value = tag.get(key)
                if isinstance(value, str) and value.strip():
                    palette[f"{key}:{value.strip().lower()}"] += 1
        images += [
            (img.get("src") or "").split("?")[0].lower()
            for img in page_soup.find_all("img")
            if img.get("src")
        ]
        menu_links += [
            (a.get("href") or "").split("?")[0].lower()
            for a in page_soup.find_all("a")
            if a.get("href")
        ]
        skeleton_parts.append(dom_skeleton(page_html))

    return {
        "entry": entry.relative_to(root).as_posix(),
        "title": (soup.title.get_text(strip=True) if soup.title else ""),
        "frameTree": frame_tree(root, entry),
        "bodyBackground": (body.get("background") if body else None),
        "bodyBgcolor": (body.get("bgcolor") if body else None),
        "chromeImages": sorted(set(images)),
        "menuLinks": sorted(set(link for link in menu_links if link and not link.startswith(("#", "javascript:", "mailto:")))),
        "paletteTop": [key for key, _ in palette.most_common(8)],
        "skeletonHash": digest(" || ".join(skeleton_parts).encode()),
        "chromePages": [p.relative_to(root).as_posix() for p in chrome_pages],
    }


def collect(timestamp: str) -> dict:
    root = SOURCE_ROOT / timestamp / "files"
    files: dict[str, dict] = {}
    for path in sorted(root.rglob("*")):
        if not path.is_file():
            continue
        relative = path.relative_to(root).as_posix()
        raw = path.read_bytes()
        record = {"bytes": len(raw), "sha": digest(raw)}
        if path.suffix.lower() in HTML_EXTENSIONS:
            html = read_text(path)
            record["textSha"] = digest(normalized_text(html).encode())
            record["textLen"] = len(normalized_text(html))
            record["domSha"] = digest(dom_skeleton(html).encode())
            soup = BeautifulSoup(html, "html.parser")
            record["title"] = soup.title.get_text(strip=True) if soup.title else ""
        files[relative] = record
    return {
        "timestamp": timestamp,
        "root": root.as_posix(),
        "fileCount": len(files),
        "files": files,
        "fingerprint": design_fingerprint(root),
    }


def main() -> None:
    snapshots = [collect(timestamp) for timestamp in TIMESTAMPS]
    by_timestamp = {s["timestamp"]: s for s in snapshots}

    # Pairwise consecutive difference
    transitions = []
    for previous, current in zip(snapshots, snapshots[1:]):
        old, new = previous["files"], current["files"]
        added = sorted(set(new) - set(old))
        removed = sorted(set(old) - set(new))
        changed = sorted(
            key for key in set(old) & set(new) if old[key]["sha"] != new[key]["sha"]
        )
        text_changed = sorted(
            key for key in changed
            if "textSha" in old[key] and "textSha" in new[key]
            and old[key]["textSha"] != new[key]["textSha"]
        )
        design_changed = sorted(
            key for key in changed
            if "domSha" in old[key] and "domSha" in new[key]
            and old[key]["domSha"] != new[key]["domSha"]
        )
        transitions.append({
            "from": previous["timestamp"], "to": current["timestamp"],
            "added": len(added), "removed": len(removed), "changed": len(changed),
            "textChanged": len(text_changed), "designChanged": len(design_changed),
            "addedExamples": added[:40], "removedExamples": removed[:40],
            "textChangedExamples": text_changed[:40],
            "identicalTree": not added and not removed and not changed,
        })

    # Full pairwise identity matrix (byte level and visible-text level)
    matrix = []
    for a in snapshots:
        row = []
        for b in snapshots:
            shared = set(a["files"]) & set(b["files"])
            same = sum(1 for key in shared if a["files"][key]["sha"] == b["files"][key]["sha"])
            union = set(a["files"]) | set(b["files"])
            row.append(round(same / len(union), 4) if union else 1.0)
        matrix.append(row)

    # Design lineage grouping by entry fingerprint
    lineage: dict[str, list[str]] = defaultdict(list)
    for snapshot in snapshots:
        fingerprint = snapshot["fingerprint"]
        key = json.dumps({
            "chromePages": fingerprint.get("chromePages"),
            "frameTree": fingerprint.get("frameTree"),
            "menuLinks": fingerprint.get("menuLinks"),
        }, ensure_ascii=False, sort_keys=True)
        lineage[key].append(snapshot["timestamp"])

    result = {
        "scope": "read-only lineage and content-diff analysis of reconstructed fstory.net snapshots",
        "snapshots": [
            {
                "timestamp": s["timestamp"], "fileCount": s["fileCount"],
                "fingerprint": s["fingerprint"],
            }
            for s in snapshots
        ],
        "transitions": transitions,
        "similarityMatrix": {"order": list(TIMESTAMPS), "jaccardIdentical": matrix},
        "designGroups": [
            {"members": members, "signature": json.loads(key)}
            for key, members in lineage.items()
        ],
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
