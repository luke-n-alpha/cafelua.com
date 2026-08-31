#!/usr/bin/env python3
"""Read-only structural and resource audit for restored fstory.net snapshots."""

from __future__ import annotations

import json
import re
import sys
from collections import Counter
from pathlib import Path
from urllib.parse import unquote, urljoin, urlparse

from bs4 import BeautifulSoup


APP_ROOT = Path(__file__).resolve().parents[1]
PUBLIC_ROOT = APP_ROOT / "public" / "fstory-homepage"
DATA_ROOT = APP_ROOT.parent / "data" / "fstory-net-wayback" / "versions"
TIMESTAMPS = (
    "20010715123146", "20010723051951", "20010925220320",
    "20011202212712", "20020325014505", "20020924164928",
    "20021120053627", "20021128181318", "20030726202839",
)
TEXT_EXTENSIONS = {".html", ".htm", ".php", ".cgi", ".css", ".js"}
HTML_EXTENSIONS = {".html", ".htm", ".php", ".cgi"}
RESOURCE_ATTRIBUTES = {
    "a": ("href",), "area": ("href",), "img": ("src", "lowsrc"),
    "frame": ("src",), "iframe": ("src",), "script": ("src",),
    "link": ("href",), "body": ("background",), "td": ("background",),
    "table": ("background",), "input": ("src",), "embed": ("src",),
    "object": ("data",), "form": ("action",),
}
URL_IN_SCRIPT = re.compile(
    r"(?:window\.open|location(?:\.href)?\s*=)\s*\(?'([^']+)'|"
    r'(?:window\.open|location(?:\.href)?\s*=)\s*\(?"([^"]+)"', re.I,
)
CSS_URL = re.compile(r"url\(\s*['\"]?([^)'\"\s]+)", re.I)
DOWNLOAD_EXTENSIONS = {".zip", ".rar", ".7z", ".exe", ".msi", ".gz", ".tar"}


def canonical(value: str, base: str) -> str | None:
    try:
        parsed = urlparse(urljoin(base, value.replace("&amp;", "&")))
    except ValueError:
        return None
    if parsed.scheme not in ("http", "https"):
        return None
    host = (parsed.hostname or "").lower().removeprefix("www.")
    if host != "fstory.net":
        return None
    path = parsed.path or "/"
    return f"{host}{path}" + (f"?{parsed.query}" if parsed.query else "")


def local_target(root: Path, source: Path, raw: str) -> Path | None:
    value = raw.strip().replace("&amp;", "&")
    if not value or value.startswith(("#", "javascript:", "mailto:", "tel:", "data:")):
        return None
    parsed = urlparse(value)
    if parsed.scheme in ("http", "https"):
        host = (parsed.hostname or "").lower().removeprefix("www.")
        if host != "fstory.net":
            return None
        relative = unquote(parsed.path.lstrip("/")) or "index.html"
    elif parsed.scheme or value.startswith("//"):
        return None
    elif parsed.path.startswith("/"):
        relative = unquote(parsed.path.lstrip("/")) or "index.html"
    else:
        relative = str((source.parent / unquote(parsed.path)).relative_to(root))
    target = root / relative
    if target.is_dir():
        target /= "index.html"
    return target


def audit_snapshot(timestamp: str, all_canonicals: set[str], source_kind: str, full: bool = False) -> dict:
    root = (
        DATA_ROOT / "reconstructed" / timestamp / "files"
        if source_kind == "source"
        else PUBLIC_ROOT / timestamp
    )
    manifest_path = DATA_ROOT / "reconstructed" / timestamp / "manifest.json"
    manifest = json.loads(manifest_path.read_text())
    canonical_by_snapshot = {
        item.get("snapshotPath", item["sitePath"]): item["original"] for item in manifest
    }
    files = [path for path in root.rglob("*") if path.is_file()]
    types = Counter(path.suffix.lower() or "[none]" for path in files)
    seen_refs: list[dict] = []
    forms = 0
    disabled_forms = 0
    inline_handlers = 0
    downloads = 0
    disabled_links = 0
    placeholder_images = 0
    notice_links = 0

    for source in files:
        extension = source.suffix.lower()
        if extension not in TEXT_EXTENSIONS:
            continue
        try:
            text = source.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            text = source.read_text(encoding="cp949", errors="replace")
        relative_source = source.relative_to(root).as_posix()
        original_base = canonical_by_snapshot.get(
            relative_source, f"http://fstory.net/{relative_source}"
        )
        refs: list[tuple[str, str, str]] = []
        if extension in HTML_EXTENSIONS:
            soup = BeautifulSoup(text, "html.parser")
            forms += len(soup.find_all("form"))
            disabled_forms += sum(
                1 for tag in soup.find_all("form")
                if tag.get("data-unrestored") == "form" or "data-unrestored-action" in tag.attrs
            )
            disabled_links += sum(
                1 for tag in soup.find_all("a")
                if "data-unrestored-href" in tag.attrs and not tag.get("href")
            )
            placeholder_images += sum(
                1 for tag in soup.find_all("img")
                if (tag.get("src") or "").endswith("_missing-image.svg")
            )
            notice_links += sum(
                1 for tag in soup.find_all(["a", "frame", "iframe", "area"])
                if "_unrestored.html" in (tag.get("href") or tag.get("src") or "")
            )
            for tag in soup.find_all(True):
                inline_handlers += sum(1 for key in tag.attrs if key.lower().startswith("on"))
                for attribute in RESOURCE_ATTRIBUTES.get(tag.name, ()):
                    raw = tag.get(attribute)
                    if isinstance(raw, str):
                        refs.append((tag.name, attribute, raw))
            for match in URL_IN_SCRIPT.finditer(text):
                refs.append(("script", "url", match.group(1) or match.group(2)))
        elif extension == ".css":
            refs.extend(("css", "url", match.group(1)) for match in CSS_URL.finditer(text))
        elif extension == ".js":
            refs.extend(("script", "url", match.group(1) or match.group(2)) for match in URL_IN_SCRIPT.finditer(text))

        for tag, attribute, raw in refs:
            target = local_target(root, source, raw)
            parsed = urlparse(raw.replace("&amp;", "&"))
            suffix = Path(parsed.path).suffix.lower()
            anchor_download = tag == "a" and (suffix in DOWNLOAD_EXTENSIONS or re.search(r"(?:download|source|소스|다운)", raw, re.I))
            downloads += int(bool(anchor_download))
            state = "ignored"
            if target is not None:
                state = "exists" if target.exists() else "missing"
            key = canonical(raw, original_base)
            archived_elsewhere = bool(key and key in all_canonicals)
            seen_refs.append({
                "source": relative_source, "tag": tag, "attribute": attribute,
                "raw": raw, "state": state, "archivedElsewhere": archived_elsewhere,
            })

    broken_images = [
        item for item in seen_refs
        if item["state"] == "missing" and item["tag"] in ("img", "input", "frame", "iframe")
    ]
    state_counts = Counter(item["state"] for item in seen_refs)
    missing = [item for item in seen_refs if item["state"] == "missing"]
    unique_missing = {(item["source"], item["raw"]): item for item in missing}
    return {
        "timestamp": timestamp,
        "fileCount": len(files),
        "manifestCount": len(manifest),
        "fileTypes": dict(sorted(types.items())),
        "textFiles": sum(1 for path in files if path.suffix.lower() in TEXT_EXTENSIONS),
        "references": len(seen_refs),
        "referenceStates": dict(state_counts),
        "uniqueMissingReferences": len(unique_missing),
        "missingArchivedElsewhere": sum(1 for item in unique_missing.values() if item["archivedElsewhere"]),
        "forms": forms,
        "disabledForms": disabled_forms,
        "liveForms": forms - disabled_forms,
        "inlineHandlers": inline_handlers,
        "downloadReferences": downloads,
        "disabledLinks": disabled_links,
        "placeholderImages": placeholder_images,
        "noticeLinks": notice_links,
        "brokenVisualReferences": len(broken_images),
        "brokenVisualExamples": [
            {"source": item["source"], "tag": item["tag"], "raw": item["raw"]}
            for item in broken_images
        ][:40],
        "missingExamples": list(unique_missing.values())[: (10**9 if full else 80)],
    }


def main() -> None:
    source_kind = "source" if "--source" in sys.argv else "public"
    full = "--full" in sys.argv
    archive_manifest = json.loads((DATA_ROOT / "manifest.json").read_text())
    all_canonicals = {item["canonical"] for item in archive_manifest if item.get("recovered")}
    snapshots = [audit_snapshot(timestamp, all_canonicals, source_kind, full) for timestamp in TIMESTAMPS]
    result = {
        "scope": f"read-only audit of {'Wayback reconstructed sources' if source_kind == 'source' else 'restored public snapshots'}",
        "snapshots": snapshots,
        "totals": {
            key: sum(snapshot[key] for snapshot in snapshots)
            for key in (
                "fileCount", "manifestCount", "textFiles", "references",
                "uniqueMissingReferences", "missingArchivedElsewhere",
                "forms", "disabledForms", "liveForms", "inlineHandlers",
                "downloadReferences", "disabledLinks", "placeholderImages",
                "noticeLinks", "brokenVisualReferences",
            )
        },
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
