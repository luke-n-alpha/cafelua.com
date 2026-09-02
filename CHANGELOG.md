[🇰🇷 한국어](./CHANGELOG.ko.md) · [📖 README](./README.md)

# Changelog

### v0.2.1 (2026-09-01)
- **Mail Moved to Azure**: Notification mail used to go through Resend, chosen when the site ran on Vercel; the key did not survive the move to Azure. It now goes through Azure Communication Services and leaves as noreply@notify.cafelua.com. The subdomain is deliberate — the apex carries the MX and SPF for the real cafelua.com mailboxes, and a sending service has no business editing those.
- **Visitor Counter and Popular Posts Are Back**: Both read Google Analytics and had lost their credentials in the move. A new service account key is in place.
- **The Master Signs In**: Writing with the master's name and password puts a badge beside the message, in the guestbook, on post comments, and in the timeline. That name is refused to anyone without the password, and the master is not rate limited.
- **Room to Reply**: Posting several messages in a row no longer trips the limit — a guestbook entry every twelve seconds, a comment every eight.
- **Timeline at the Front Door**: A tab at the top left of the entrance slides a panel in from the edge holding the most recent guestbook entries and post comments in one stream. Every line is a shortcut — it carries the visitor straight to the corner that writing lives in, with the season, time, and weather they picked still on.
- **NEW Badges on the Map**: Each corner of the sitemap can now carry the date its contents last changed, and the map marks anything from the last three weeks. The badge follows the content and falls off on its own. The Library and the Old PC carry it today.
- **The Old PC Holds 2001-2003**: The restored fstory.net homepage joined the 1997 and 1998 ones inside the atelier's old PC.
- **Reply Notifications for the Master**: A new guestbook entry or comment now also reaches the master by email, not only the visitor being replied to. A secret entry is announced without its text.
- **Guestbook and Comments Are Back**: Both had been answering with a 500 since the move to Azure, because the storage credentials never came across. They now live in Azure Table Storage beside the rest of the site, and the Firestore dependency is gone.
- **Canonical Address Fixed**: `og:url`, `og:image`, and the canonical link pointed at the bare domain, which redirects to `www`; link previews gave up at the redirect and showed nothing. They now point where the site actually answers.

### v0.2.0 (2026-07-23)
- **Auto-turn and Continuous Read Aloud**: Added a configurable 3–120 second auto-turn timer plus browser-native speech playback, pause, voice, and rate controls. Read-aloud continues when each spread finishes, and timed auto-turn and speech are mutually exclusive.
- **Canonical Library Reader**: Declared the deployed Library as the single ebook reader and removed the disconnected legacy BookViewer, Bookshelf, WorldGuide, and loader implementation.
- **July 24 Follow-up**: Added sequential Play All playback to the Gallery BGM tab while preserving each scene track's individual loop behavior.
- **Reader Layout Fixes**: Long tables now split across pages with repeated headers, and reader text stays at a consistent size instead of shrinking differently from page to page.
- **Clearer Reader Controls**: Placed an icon-only screen expand/reduce control beside the font-size buttons, separated it from the close action, and removed the ambiguous mobile center-tap fullscreen gesture.
- **Desk Post Update**: Refined the Korean and English announcement titles and added the Cafe Lua GitHub repository URL to both article bodies.
- **Link Label Fix**: Corrected the Korean edition label from WikiBooks to WikiDocs.
- **2F Library Opened**: Added `/ko/library` and `/en/library` as an independent Cafe Lua space.
- **Ebook Reader**: Added desktop two-page and mobile single-page reading, table of contents, font sizing, progress, fullscreen, page-edge clicks, three-zone mobile touch controls, and swipe navigation.
- **Books Available**: Readers can open *Harness Engineering: Re:Zero — Software Engineering for AI-Assisted Development* and *The Invasion of Mars & AI Fiction Writing* directly inside Cafe Lua.
- **Shareable Book URLs**: Added dedicated book detail URLs and `?read=1` reader URLs for sharing a specific book or reading view.
- **English Mars Edition**: Connected the English manuscript and cover to the English Library together with the [published Leanpub edition](https://leanpub.com/invasionofmars).
- **Edition-Aware Links**: Korean pages lead to WikiDocs, while English pages show published Leanpub editions.
- **Mobile Library**: Reworked the shelf into a two-column vertical grid and shortened the path to book details and Direct View.
- **Shared Image Viewer**: Reused one lightbox for enlarged book illustrations and Gallery images.
- **Reader Stability**: Fixed Markdown image hydration, table pagination, image flicker, and mobile overflow.
- **Room Experience**: Added dedicated Library and Master's Desk BGM, seasonal Library backgrounds, WebP background optimization, and tighter mobile reader spacing.
- **Master's Desk**: Published the Cafe Lua 0.2.0 Library announcement as a bilingual post.
- **Version Display**: Updated the app and entrance footer to `v0.2.0`.

### v0.1.9 (2026-07-04)
- **Full Visual Refresh**: Replaced and deployed the Cafe Lua entrance, lounge, about, gallery, guestbook, atelier, and master desk background assets.
- **Environment Propagation Expanded**: Season, time, weather, open/closed state, and Christmas mode now flow beyond the entrance/lounge into counter, coffee chat, tarot, gallery, guestbook, about, atelier, desk, and diary surfaces.
- **Alpha Runtime Awareness**: Coffee chat and tarot prompts now receive the guest's visit context so Alpha can recognize the current season, time, weather, and Christmas mode.
- **AI Model Update**: Cafe Lua AI routes default to `google/gemini-3.1-flash-lite` through Vercel AI Gateway.
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
