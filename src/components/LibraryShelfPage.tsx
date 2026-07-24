"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Maximize2,
  Minimize2,
  Menu,
  X,
} from "lucide-react";
import UnderConstruction from "./UnderConstruction";
import ImageLightbox from "./ImageLightbox";
import {
  libraryBooks,
  type LibraryBook,
  type LibraryEdition,
} from "@/data/library/libraryContent";
import { libraryCopy, type LibraryLocale } from "@/data/library/libraryCopy";
import {
  resolveEnvironmentBackgroundSrc,
  type Season,
  type TimeOfDay,
  type Weather,
} from "@/lib/environmentBackgrounds";
import { splitMarkdownTable } from "@/lib/library-table-pagination";
import "./LibraryShelfPage.css";

type ReaderState = {
  book: LibraryBook;
  edition: LibraryEdition;
  pageIndex: number;
};

type ReaderPage = {
  chapterIndex: number;
  chapterTitle: string;
  pageInChapter: number;
  markdown: string;
};

const getReaderPageCharacterLimit = (fontScale: number, isCompact: boolean) =>
  Math.max(
    isCompact ? 80 : 260,
    Math.round((isCompact ? 110 : 420) / fontScale),
  );

const editionFor = (book: LibraryBook, locale: LibraryLocale) =>
  book.editions.find((edition) => edition.lang === locale) ?? book.editions[0];

const editionCoverSources: Partial<Record<LibraryEdition["sourceSlug"], string>> = {
  "naia-harness-book-en":
    "/library-books/naia-harness-book-en/assets/cover-rezero-sw-en-final.webp",
};

const coverSourceFor = (
  edition: LibraryEdition,
  fallbackEditions: LibraryEdition[] = [],
) => {
  const knownCover = editionCoverSources[edition.sourceSlug];
  if (knownCover) return knownCover;
  for (const candidate of [edition, ...fallbackEditions]) {
    const coverMarkdown = candidate.chapters[0]?.markdown ?? "";
    const match = coverMarkdown.match(/!\[[^\]]*\]\(([^)]+)\)/);
    if (match) {
      return `/library-books/${candidate.sourceSlug}/${match[1].replace(/^\.\//, "")}`;
    }
  }
  return null;
};

function focusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])',
    ),
  );
}

function splitMarkdownIntoPages(
  markdown: string,
  fontScale: number,
  isCompact: boolean,
) {
  const pageCharacterLimit = getReaderPageCharacterLimit(fontScale, isCompact);
  const blocks = markdown
    .trim()
    .split(/\n{2,}/)
    .filter(Boolean);
  const pages: string[] = [];
  let page = "";
  const take = (text: string, limit: number) => {
    if (text.length <= limit) return [text, ""] as const;
    const punctuation = Math.max(
      text.lastIndexOf(". ", limit),
      text.lastIndexOf("? ", limit),
      text.lastIndexOf("! ", limit),
    );
    const breakAt = Math.max(
      text.lastIndexOf("\n", limit),
      punctuation,
      text.lastIndexOf(" ", limit),
    );
    const safeBreakAt =
      breakAt > limit * 0.42
        ? breakAt + (text[breakAt] === " " ? 0 : 1)
        : limit;
    return [
      text.slice(0, safeBreakAt).trim(),
      text.slice(safeBreakAt).trim(),
    ] as const;
  };
  for (const block of blocks) {
    const trimmedBlock = block.trim();
    const isImageBlock = /^!\[/.test(trimmedBlock);
    const isTableBlock =
      /^\|.*\|$/m.test(trimmedBlock) &&
      /^\|?\s*:?-{3,}/m.test(trimmedBlock);
    const isCodeBlock = /^```/.test(trimmedBlock);
    if (isTableBlock) {
      if (page) pages.push(page);
      pages.push(
        ...splitMarkdownTable(block, pageCharacterLimit, isCompact),
      );
      page = "";
      continue;
    }
    if (isImageBlock || isCodeBlock) {
      if (page) pages.push(page);
      pages.push(block);
      page = "";
      continue;
    }
    let remaining = block;
    while (remaining) {
      const separator = page ? 2 : 0;
      const available = pageCharacterLimit - page.length - separator;
      if (available < 80 && page) {
        pages.push(page);
        page = "";
        continue;
      }
      const [segment, rest] = take(remaining, Math.max(available, 80));
      page = page ? `${page}\n\n${segment}` : segment;
      remaining = rest;
      if (remaining) {
        pages.push(page);
        page = "";
      }
    }
  }
  if (page) pages.push(page);
  return pages.length ? pages : [markdown];
}

function paginateEdition(
  edition: LibraryEdition,
  fontScale: number,
  isCompact: boolean,
): ReaderPage[] {
  return edition.chapters.flatMap((chapter, chapterIndex) =>
    splitMarkdownIntoPages(chapter.markdown, fontScale, isCompact).map(
      (markdown, pageInChapter) => ({
        chapterIndex,
        chapterTitle: chapter.title,
        pageInChapter,
        markdown,
      }),
    ),
  );
}

export default function LibraryShelfPage({
  locale,
  initialBookId = null,
  initialRead = false,
}: {
  locale: LibraryLocale;
  initialBookId?: LibraryBook["id"] | null;
  initialRead?: boolean;
}) {
  const copy = libraryCopy[locale];
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialBook = initialBookId
    ? libraryBooks.find((book) => book.id === initialBookId) ?? null
    : null;
  const initialEdition = initialBook ? editionFor(initialBook, locale) : null;
  const season = (searchParams.get("season") || "spring") as Season;
  const time = (searchParams.get("time") || "day") as TimeOfDay;
  const weather = (searchParams.get("weather") || "sunny") as Weather;
  const isChristmas = searchParams.get("christmas") === "true";
  const backgroundSrc = useMemo(
    () =>
      resolveEnvironmentBackgroundSrc(
        "library",
        season,
        time,
        weather,
        isChristmas,
      ),
    [isChristmas, season, time, weather],
  );
  const [selected, setSelected] = useState<LibraryBook | null>(
    initialRead ? null : initialBook,
  );
  const [showGreeting, setShowGreeting] = useState(!initialBook);
  const [reader, setReader] = useState<ReaderState | null>(() =>
    initialRead &&
    initialBook &&
    initialEdition?.status === "published" &&
    initialEdition.chapters.length
      ? { book: initialBook, edition: initialEdition, pageIndex: 0 }
      : null,
  );
  const [tocOpen, setTocOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [isReaderFullscreen, setIsReaderFullscreen] = useState(false);
  const [expandedImage, setExpandedImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const pendingChapterIndexRef = useRef<number | null>(null);
  const readerPanelRef = useRef<HTMLElement>(null);
  const readerGestureStartRef = useRef<{ x: number; y: number } | null>(null);
  const edition = useMemo(
    () => (selected ? editionFor(selected, locale) : null),
    [locale, selected],
  );
  const documentPages = useMemo(
    () => (reader ? paginateEdition(reader.edition, fontScale, isCompact) : []),
    [fontScale, isCompact, reader?.edition],
  );

  useEffect(() => {
    if (!reader || !documentPages.length) return;
    const step = isCompact ? 1 : 2;
    const nearbyPages = documentPages.slice(
      Math.max(0, reader.pageIndex - step),
      Math.min(documentPages.length, reader.pageIndex + step * 3),
    );
    const sources = new Set<string>();
    for (const page of nearbyPages) {
      for (const match of page.markdown.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
        const rawSource = match[1];
        sources.add(
          rawSource.startsWith("http")
            ? rawSource
            : `/library-books/${reader.edition.sourceSlug}/${rawSource.replace(/^(?:(?:\.\.)?\/)+/, "")}`,
        );
      }
    }
    for (const source of sources) {
      const image = new Image();
      image.src = source;
      void image.decode().catch(() => undefined);
    }
  }, [documentPages, isCompact, reader]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 720px)");
    const sync = () => setIsCompact(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const syncFullscreen = () => {
      setIsReaderFullscreen(document.fullscreenElement === readerPanelRef.current);
    };
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  useEffect(() => {
    if (!reader) return;
    readerPanelRef.current?.focus();
  }, [reader]);

  useEffect(() => {
    if (!reader || pendingChapterIndexRef.current === null) return;
    const pageIndex = documentPages.findIndex(
      (page) => page.chapterIndex === pendingChapterIndexRef.current,
    );
    setReader(
      (current) => current && { ...current, pageIndex: Math.max(0, pageIndex) },
    );
    pendingChapterIndexRef.current = null;
  }, [documentPages, reader]);

  const openDetail = (book: LibraryBook) => {
    setSelected(book);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("read");
    const query = params.toString();
    router.push(`/${locale}/library/${book.id}${query ? `?${query}` : ""}`);
  };
  const closeDetail = () => {
    setSelected(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("read");
    const query = params.toString();
    router.push(`/${locale}/library${query ? `?${query}` : ""}`);
  };
  const openReader = () => {
    if (
      selected &&
      edition?.status === "published" &&
      edition.chapters.length
    ) {
      setReader({ book: selected, edition, pageIndex: 0 });
      setSelected(null);
      setTocOpen(false);
      const params = new URLSearchParams(searchParams.toString());
      params.set("read", "1");
      router.push(`/${locale}/library/${selected.id}?${params.toString()}`);
    }
  };
  const closeReader = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    }
    const book = reader?.book ?? null;
    setReader(null);
    setSelected(book);
    setTocOpen(false);
    setExpandedImage(null);
    if (book) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("read");
      const query = params.toString();
      router.push(`/${locale}/library/${book.id}${query ? `?${query}` : ""}`);
    }
  };
  const enterReaderFullscreen = async () => {
    if (
      document.fullscreenElement ||
      !readerPanelRef.current?.requestFullscreen
    ) {
      return;
    }
    try {
      await readerPanelRef.current.requestFullscreen();
    } catch {
      // Fullscreen can be blocked by a browser or embedded webview policy.
    }
  };
  const toggleReaderFullscreen = async () => {
    if (document.fullscreenElement === readerPanelRef.current) {
      await document.exitFullscreen();
      return;
    }
    await enterReaderFullscreen();
  };
  const trapDialog = (
    event: KeyboardEvent<HTMLElement>,
    close: () => void,
    navigate?: (offset: number) => void,
  ) => {
    if (event.key === "Escape") {
      event.preventDefault();
      if (document.fullscreenElement) {
        void document.exitFullscreen();
        return;
      }
      close();
      return;
    }
    if (navigate && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
      event.preventDefault();
      navigate(event.key === "ArrowLeft" ? -1 : 1);
      return;
    }
    if (event.key !== "Tab") return;
    const elements = focusableElements(event.currentTarget);
    if (!elements.length) return;
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const roomStyle = { backgroundImage: `url('${backgroundSrc}')` };
  if (showGreeting) {
    return (
      <main
        className="library-room"
        style={roomStyle}
        data-time={time}
        data-weather={weather}
        data-season={season}
      >
        <UnderConstruction
          onClose={() => setShowGreeting(false)}
          message={copy.alphaGreeting}
          backgroundSrc={backgroundSrc}
          illustrationSrc={backgroundSrc}
          characterSrc="/characters/alpha/alpha-nice-talk.webp"
          closeLabel={copy.shelf}
        />
      </main>
    );
  }

  const readerStep = isCompact ? 1 : 2;
  const readerPages = reader
    ? documentPages.slice(reader.pageIndex, reader.pageIndex + readerStep)
    : [];
  const movePages = (offset: number) =>
    setReader((current) => {
      if (!current) return current;
      const step = isCompact ? 1 : 2;
      const lastStart = Math.max(
        0,
        Math.floor((documentPages.length - 1) / step) * step,
      );
      return {
        ...current,
        pageIndex: Math.max(
          0,
          Math.min(lastStart, current.pageIndex + offset * step),
        ),
      };
    });
  const chooseChapter = (index: number) =>
    setReader(
      (current) =>
        current && {
          ...current,
          pageIndex: Math.max(
            0,
            documentPages.findIndex((page) => page.chapterIndex === index),
          ),
        },
    );
  const returnToAtelier = () => {
    const query = searchParams.toString();
    router.push(`/${locale}/atelier${query ? `?${query}` : ""}`);
  };
  const changeFontScale = (delta: number) => {
    if (reader)
      pendingChapterIndexRef.current =
        documentPages[reader.pageIndex]?.chapterIndex ?? 0;
    setFontScale((current) =>
      Math.max(0.85, Math.min(1.15, Number((current + delta).toFixed(2)))),
    );
  };

  return (
    <main
      className="library-room"
      style={roomStyle}
      data-time={time}
      data-weather={weather}
      data-season={season}
    >
      <section className="library-panel" aria-labelledby="library-title">
        <header className="library-panel-header">
          <div>
            <p>{copy.eyebrow}</p>
            <h1 id="library-title">{copy.title}</h1>
          </div>
        </header>
        <div className="library-book-rail" aria-label={copy.shelf}>
          {libraryBooks.map((book) => {
            const localEdition = editionFor(book, locale);
            const isPublished =
              localEdition.status === "published" &&
              localEdition.chapters.length > 0;
            const coverSrc = coverSourceFor(localEdition, book.editions);
            return (
              <button
                className={`library-book-card ${book.coverTone}`}
                key={book.id}
                onClick={() => openDetail(book)}
              >
                {coverSrc ? (
                  <img src={coverSrc} alt={`${localEdition.title} 표지`} />
                ) : (
                  <span className="library-book-cover-fallback">
                    {!isPublished && <small>{copy.preparing}</small>}
                    <strong>{localEdition.title}</strong>
                    <em>{localEdition.biblio.author}</em>
                  </span>
                )}
                {!isPublished && (
                  <span className="library-book-status">{copy.preparing}</span>
                )}
              </button>
            );
          })}
        </div>
        <button className="library-back-to-atelier" onClick={returnToAtelier}>
          <ArrowLeft size={15} />
          {locale === "ko" ? "아뜰리에로 돌아가기" : "Back to Atelier"}
        </button>
      </section>

      {selected && edition && (
        <div className="library-layer" role="presentation">
          <section
            className="library-detail-panel"
            role="dialog"
            aria-modal="true"
            aria-label={copy.detail}
            tabIndex={-1}
            onKeyDown={(event) => trapDialog(event, closeDetail)}
          >
            <button
              className="library-close"
              onClick={closeDetail}
              aria-label={copy.close}
            >
              <X size={18} />
            </button>
            <div className={`library-detail-cover ${selected.coverTone}`}>
              {coverSourceFor(edition, selected.editions) ? (
                <img
                  src={coverSourceFor(edition, selected.editions) ?? undefined}
                  alt={`${edition.title} 표지`}
                />
              ) : (
                <span>{edition.title}</span>
              )}
            </div>
            <div className="library-detail-copy">
              <p>{copy.detail}</p>
              <h2>{edition.title}</h2>
              {edition.subtitle && <h3>{edition.subtitle}</h3>}
              <div className="library-detail-actions">
                {edition.status === "published" && edition.chapters.length > 0 ? (
                  <button className="library-read-action" onClick={openReader}>
                    {copy.read}
                    <ChevronRight size={18} />
                  </button>
                ) : (
                  <p className="library-pending">{copy.unavailable}</p>
                )}
                <div className="library-external-actions">
                  {edition.lang === "ko" && (
                    <ExternalLinkButton
                      href={edition.links.wikidocs}
                      label={copy.wikidocs}
                    />
                  )}
                  {edition.lang === "en" && (
                    <ExternalLinkButton
                      href={edition.links.leanpub}
                      label={copy.leanpub}
                    />
                  )}
                </div>
              </div>
              <p>
                {selected.id === "mars-invasion" ? copy.mars : copy.harness}
              </p>
              <small>
                {[
                  edition.biblio.author,
                  edition.biblio.publisher,
                  edition.biblio.date
                    ? `${copy.publishedDate} ${edition.biblio.date}`
                    : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </small>
            </div>
          </section>
        </div>
      )}

      {reader && (
        <div className="library-layer library-reader-layer" role="presentation">
          <section
            className="library-reader-panel"
            role="dialog"
            aria-modal="true"
            aria-label={reader.edition.title}
            tabIndex={-1}
            ref={readerPanelRef}
            onKeyDown={(event) => trapDialog(event, closeReader, movePages)}
          >
            <header className="library-reader-toolbar">
              <div className="library-reader-tools">
                <button
                  className="library-toc-toggle"
                  onClick={() => setTocOpen((open) => !open)}
                  aria-expanded={tocOpen}
                  aria-controls="library-reader-toc"
                >
                  <Menu size={17} />
                  <span>{copy.contents}</span>
                </button>
                <div className="library-font-size" aria-label={copy.fontSize}>
                  <button
                    onClick={() => changeFontScale(-0.05)}
                    disabled={fontScale <= 0.85}
                    aria-label={copy.decreaseFontSize}
                    title={copy.decreaseFontSize}
                  >
                    A−
                  </button>
                  <button
                    onClick={() => changeFontScale(0.05)}
                    disabled={fontScale >= 1.15}
                    aria-label={copy.increaseFontSize}
                    title={copy.increaseFontSize}
                  >
                    A+
                  </button>
                </div>
                <button
                  className="library-fullscreen-toggle"
                  onClick={() => void toggleReaderFullscreen()}
                  aria-label={
                    isReaderFullscreen
                      ? copy.exitFullscreen
                      : copy.enterFullscreen
                  }
                  title={
                    isReaderFullscreen
                      ? copy.exitFullscreen
                      : copy.enterFullscreen
                  }
                  aria-pressed={isReaderFullscreen}
                >
                  {isReaderFullscreen ? (
                    <Minimize2 size={16} />
                  ) : (
                    <Maximize2 size={16} />
                  )}
                </button>
              </div>
              <span>{reader.edition.title}</span>
              {reader.edition.lang === "ko" && reader.edition.links.wikidocs && (
                <a
                  className="library-reader-publisher-link"
                  href={reader.edition.links.wikidocs}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>위키독스</span>
                  <ExternalLink size={14} />
                </a>
              )}
              {reader.edition.lang === "en" && reader.edition.links.leanpub && (
                <a
                  className="library-reader-publisher-link"
                  href={reader.edition.links.leanpub}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>LeanPub</span>
                  <ExternalLink size={14} />
                </a>
              )}
              <button
                className="library-reader-close"
                onClick={closeReader}
                aria-label={copy.close}
                title={copy.close}
              >
                <X size={18} />
              </button>
            </header>
            <div className="library-reading-progress" aria-hidden="true">
              <span
                style={{
                  width: `${Math.min(
                    100,
                    ((reader.pageIndex + readerStep) /
                      Math.max(1, documentPages.length)) *
                      100,
                  )}%`,
                }}
              />
            </div>
            <div className="library-reader-layout">
              <aside
                id="library-reader-toc"
                className={`library-reader-toc ${tocOpen ? "open" : ""}`}
                aria-hidden={!tocOpen}
              >
                <div>
                  <BookOpen size={17} />
                  <p>{copy.contents}</p>
                </div>
                {reader.edition.chapters.map((chapter, index) => (
                  <button
                    key={chapter.path}
                    className={
                      readerPages.some((page) => page.chapterIndex === index)
                        ? "active"
                        : ""
                    }
                    tabIndex={tocOpen ? 0 : -1}
                    onClick={() => {
                      chooseChapter(index);
                      setTocOpen(false);
                    }}
                  >
                    {chapter.title}
                  </button>
                ))}
              </aside>
              <div
                className={`library-reader-spread ${isCompact ? "compact" : ""}`}
                aria-label={copy.read}
                style={{ "--reader-font-scale": fontScale } as CSSProperties}
                onPointerDown={(event) => {
                  if (
                    event.target instanceof Element &&
                    event.target.closest("a, button, .library-illustration")
                  ) {
                    return;
                  }
                  readerGestureStartRef.current = {
                    x: event.clientX,
                    y: event.clientY,
                  };
                }}
                onPointerUp={(event) => {
                  if (
                    event.target instanceof Element &&
                    event.target.closest("a, button, .library-illustration")
                  ) {
                    return;
                  }
                  const start = readerGestureStartRef.current;
                  readerGestureStartRef.current = null;
                  if (!start) return;

                  const bounds = event.currentTarget.getBoundingClientRect();
                  if (!isCompact) {
                    movePages(
                      event.clientX < bounds.left + bounds.width / 2 ? -1 : 1,
                    );
                    return;
                  }

                  const deltaX = event.clientX - start.x;
                  const deltaY = event.clientY - start.y;
                  if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
                    movePages(deltaX > 0 ? -1 : 1);
                    return;
                  }

                  const touchPosition = (event.clientX - bounds.left) / bounds.width;
                  if (touchPosition < 1 / 3) {
                    movePages(-1);
                  } else if (touchPosition > 2 / 3) {
                    movePages(1);
                  }
                }}
              >
                {readerPages.map((page, spreadPageIndex) => {
                  return (
                    <article
                      className="library-paper-page"
                      key={`${page.chapterIndex}-${page.pageInChapter}`}
                      data-reader-page-index={
                        reader.pageIndex + spreadPageIndex
                      }
                    >
                      <header>
                        <span>{page.chapterTitle}</span>
                        <small>{reader.pageIndex + spreadPageIndex + 1}</small>
                      </header>
                      <div className="library-paper-content">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            img: ({ src, alt }) => (
                              <ReaderIllustration
                                sourceSlug={reader.edition.sourceSlug}
                                src={typeof src === "string" ? src : undefined}
                                alt={alt}
                                onOpen={(image) => setExpandedImage(image)}
                              />
                            ),
                          }}
                        >
                          {page.markdown || copy.noChapter}
                        </ReactMarkdown>
                      </div>
                    </article>
                  );
                })}
              </div>
              <nav className="library-spread-navigation" aria-label={copy.read}>
                <button
                  disabled={reader.pageIndex === 0}
                  onClick={() => movePages(-1)}
                  aria-label={copy.previous}
                >
                  <ChevronLeft size={18} />
                </button>
                <span>
                  {reader.pageIndex + 1}–
                  {Math.min(
                    reader.pageIndex + readerStep,
                    documentPages.length,
                  )}{" "}
                  / {documentPages.length}
                </span>
                <button
                  disabled={
                    reader.pageIndex + readerStep >= documentPages.length
                  }
                  onClick={() => movePages(1)}
                  aria-label={copy.next}
                >
                  <ChevronRight size={18} />
                </button>
              </nav>
            </div>
            {expandedImage && (
              <ImageLightbox
                src={expandedImage.src}
                alt={expandedImage.alt}
                onClose={() => setExpandedImage(null)}
                closeLabel={copy.close}
                closeOnImageClick
              >
                {expandedImage.alt && (
                  <div className="library-lightbox-caption">{expandedImage.alt}</div>
                )}
              </ImageLightbox>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

function ExternalLinkButton({
  href,
  label,
}: {
  href: string | null;
  label: string;
}) {
  return href ? (
    <a href={href} target="_blank" rel="noreferrer">
      {label}
      <ExternalLink size={14} />
    </a>
  ) : (
    <span>{label}</span>
  );
}

function ReaderIllustration({
  sourceSlug,
  src,
  alt,
  onOpen,
}: {
  sourceSlug: string;
  src?: string;
  alt?: string;
  onOpen: (image: { src: string; alt: string }) => void;
}) {
  if (!src) return null;
  const source = src.startsWith("http")
    ? src
    : `/library-books/${sourceSlug}/${src.replace(/^(?:(?:\.\.)?\/)+/, "")}`;
  return (
    <span
      className="library-illustration"
      role="button"
      tabIndex={0}
      aria-label={alt ? `${alt} 크게 보기` : "이미지 크게 보기"}
      onClick={() => onOpen({ src: source, alt: alt ?? "" })}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen({ src: source, alt: alt ?? "" });
        }
      }}
    >
      <img
        src={source}
        alt={alt ?? ""}
        loading="eager"
        decoding="sync"
      />
      {alt && <span className="library-illustration-caption">{alt}</span>}
    </span>
  );
}
