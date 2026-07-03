[🇰🇷 한국어](./CHANGELOG.ko.md) · [📖 README](./README.md)

# Changelog

### v0.1.9 (2026-07-04)
- **Full Visual Refresh**: Replaced and deployed the Cafe Lua entrance, lounge, about, gallery, guestbook, atelier, and master desk background assets.
- **Environment Propagation Expanded**: Season, time, weather, open/closed state, and Christmas mode now flow beyond the entrance/lounge into counter, coffee chat, tarot, gallery, guestbook, about, atelier, desk, and diary surfaces.
- **Alpha Runtime Awareness**: Coffee chat and tarot prompts now receive the guest's visit context so Alpha can recognize the current season, time, weather, and Christmas mode.
- **AI Model Update**: Cafe Lua AI routes default to `google/gemini-flash-3.1-lite` through Vercel AI Gateway.
- **Tarot Story Decks**: Gallery tarot cards now support story-deck viewing for the current and old decks. The prose is a work in progress and will be refined against the illustrations.
- **Open Graph & SEO**: Replaced the OG image with the Cafe Lua entrance and official round logo, updated versioned OG metadata, refreshed README/llms.txt, and documented current SEO entry points.
- **Version Display**: Intro footer now shows `v0.1.9`.

### v0.1.8 (2026-03-06)
- **Post Comments**: Comment and nested reply system for Desk/Diary posts with email notifications.
- **Guestbook Replies**: Reply support and email notifications for guestbook entries.
- **Management Tool**: Local admin tool [cafelua.com-manager](https://github.com/luke-n-alpha/cafelua.com-manager) — post editor, comment moderation, image upload, deploy.
- **Desk Post Navigation**: Prev/next navigation and popular posts section.
- **Cross-posting**: Naia blog articles cross-posted to Master's Desk.
- **Open Source & License**: CC BY-NC-SA 4.0 badge on posts, GitHub icon on intro page.
- **Bug Fixes**: Mobile image overflow, heading font, SEO metadata.

### v0.1.7 (2026-02-20)
- **Full English Translation**:
    - All 2,311+ Naver blog posts translated to English via Gemini 2.5 Flash.
    - Sharded parallel translation pipeline (5 shards) with checkpointing and result-only mode.
    - Whitespace/symbol-only title handling to prevent Gemini empty responses.
    - Untranslated post filter applied — only fully translated posts appear on Master's Desk.
- **English Tag Mapping**:
    - 27 Korean tags mapped to English equivalents for `/en/desk` display.
    - English-mode search also matches English tag names.
- **i18n Fixes**:
    - Fixed library redirect losing locale (Next.js 16 `params` is a Promise — must `await`).
    - Fixed i18n hydration mismatch: synchronous `changeLanguage` in `[locale]/layout.tsx`.
    - Added language lock to API chat/tarot routes for consistent responses.
- **Hydration Fix**:
    - DeskPost: replaced `<p>` with `<div>` renderer for YouTube embeds to prevent `<div>` inside `<p>`.
- **SEO**:
    - Sitemap expanded to 4,324 URLs (separate entries for ko and en with hreflang alternates).
    - `llms.txt` enriched with full site description, structure, content breakdown, and technical info.
- **Build Optimization**:
    - ISR (`revalidate: 3600`) + `DESK_PREBUILD_COUNT` (default 50) for desk posts.
    - Only 100 pages (50 × 2 locales) pre-built at deploy; rest served on-demand.

### v0.1.6 (2026-02-14)
- **Visitor Counter**:
    - Retro-style visitor counter widget on the intro page (below the enter button).
    - GA4 Data API integration for real-time cumulative visitor count.
    - Server-side API route (`/api/visitors/count`) with 1-hour cache.
    - Graceful fallback: counter hides silently when configuration is missing.
- **Blog Migration + Master's Desk Update**:
    - Added full-list Naver migration pipeline (2,393 posts) with metadata/content normalization.
    - Added Master's Desk route, list, post detail rendering, and per-post OG metadata wiring.
    - Restored publish dates/categories/tags and automated cleanup for menu/markup noise in legacy bodies.
    - Added local image materialization, missing-image fallback (`missing-image.webp`), and safer link/video preservation.
    - Applied list policy filters for me2day relay posts and novel posts.
    - Synced automated `sitemap.xml` / `llms.txt` generation with migration runbook and operations docs.
    - Expanded migration article (`20260218-naver-blog-migration`) as a v0.1.6 update note.

### v0.1.5 (2026-02-13)
- **Gallery — Diary**:
    - Added diary tab to the gallery with 19 entries (newest first).
    - Each diary entry has its own shareable URL with Open Graph metadata (`/gallery/diary/[slug]`).
    - Posting-style layout: text content + multiple images per entry.
    - Image lightbox with keyboard (left/right arrows), mouse wheel, and touch navigation.
    - Keyboard scroll (up/down arrows) for browsing post content.
    - Full Korean/English bilingual support for titles, content, and UI.
    - 50 diary images optimized and converted to WebP format.
- **Guestbook**:
    - Full guestbook feature with nickname + password authentication.
    - Secret message system with viewer authentication.
    - Admin mode for managing all entries.
    - All Firestore operations migrated to Firebase Admin SDK (server-side only).
    - Rate limiting, timing-safe password comparison, and server-side validation.
- **Tarot — Celtic Cross Renewal**:
    - Redesigned tarot reading with full Celtic Cross (10-card) spread UI.
    - Dedicated card components (TarotCard, TarotSpread, CelticCrossSpread).
    - Server-side tarot API routes (cards, interpret, summary) for Gemini integration.
    - Interactive card flip with per-card interpretation and final summary.
    - Tarot reading hook (useTarotReading) for state management.
- **Coffee Chat Improvements**:
    - Rich message rendering with formatted text support.
    - Tarot reading mode layout — dialogue box pinned to bottom during card reading.
    - Mobile responsive adjustments for tarot mode.
- **Security Hardening**:
    - Migrated from client-side Firestore SDK to Firebase Admin SDK.
    - Server-side password hashing (SHA-256) and timing-safe comparison.
    - Per-IP rate limiting on all API endpoints.
    - Secret messages only accessible via authenticated server API.

### v0.1.4 (2026-02-02)
- **AI Chat Features**:
    - **Coffee Chat**: VN-style conversation system with Alpha at the cafe counter. Powered by Google Gemini 2.5 Flash.
    - **Tarot Consultation**: Mystic tarot-themed chat experience (Alpha is still learning to read cards).
    - Expression/mood system with 8 different Alpha expressions.
    - User memory persistence via localStorage (remembers past conversations).
    - Conversation history browsing with session type separation.
    - Real-time message saving.
- **i18n Enhancement**:
    - Added complete translations for Counter, Coffee Chat, and Tarot pages (EN/KO).
- **Documentation**:
    - Added `.env.example` with all environment variables.
    - Updated README with Vercel deployment guide.

### v0.1.3 (2026-01-11)
- **Spaces & Pages**:
    - Lounge and 2F Atelier space updates.
    - Added Luke's 1997/1998 homepages on the old PC in the 2F Atelier.
    - Added Cafe introduction page.
    - Added a planned work list at the Counter.

### v0.1.2 (2024-12-07)
- **Architecture**:
    - Downgraded to **Next.js 14.2 + React 18** with `output: 'export'` so GitHub Pages can host the static build (Next 15 dynamic runtime is unsupported on Pages).
    - GitHub Actions deploy workflow updated to run `npm run build` → upload `out/` → deploy to Pages.
    - Added stricter guidance to keep scratch work in `work-log/` and avoid the legacy `work/` path.

### v0.1.1 (2025-11-30)
- **Features & Improvements**:
    - **Weather API Integration**: Added functionality to fetch real-time weather information and reflect it in the background and environmental elements.
    - **BGM System**: Added automatic background music playback and control UI to the lounge and intro pages.
    - **Lounge Menu**: Added a menu button UI to the lounge screen for accessing key features (linked to under construction page).
- **UI/UX Enhancements**:
    - **Under Construction Page Redesign**:
        - Changed the layout of text and character images (image on the left, text on the right).
        - Fixed character image size (100px) and modified styles (removed border, natural placement).
        - Adjusted the 'Return to Lounge' button position (aligned to the bottom right) and improved its style.
    - **Intro Page Improvements**: Enhanced sharing experience by applying Open Graph meta tags and a cover image.

### v0.1.0 (2025-11-20)
- **Initial Release**:
    - Set up the basic project structure (React + Vite + TypeScript).
    - Implemented the intro page (automatic background image change by time of day).
    - Basic implementation of the lounge page.
    - Set up basic routing.
