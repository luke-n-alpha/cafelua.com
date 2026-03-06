[🇰🇷 한국어](./README.ko.md)

# Cafe Lua

**Cafe Lua** is a virtual space project themed around a tranquil teahouse in the forest. It offers visitors a relaxing retreat and warm stories, providing an immersive experience through various interactive elements.

## 🌿 Project Introduction

This project is an immersive web application built on Next.js 16 (App Router), offering the following spaces and features:

*   **Immersive Intro**: Invites you into the world of Cafe Lua with backgrounds that change according to the time of day and weather.
*   **Lounge Space**: The main area where you can enjoy the atmosphere of Cafe Lua with ambient music.
*   **Counter**: VN-style Coffee Chat and Celtic Cross (10-card) tarot reading with AI mascot 'Alpha'. Powered by Google Gemini 2.5 Flash.
*   **Gallery**: Browse cafe space photos, diary entries, tarot card collection, and BGM collection.
*   **Diary**: Personal diary entries in text + multi-image posting format. Each entry has its own shareable URL with OG metadata.
*   **Guestbook**: Guestbook with nickname + password authentication. Secret message system and admin mode.
*   **2F Atelier**: A nostalgic "Win98 PC" experience where you can explore Luke's 1997/1998 homepage memories.
*   **Responsive Design**: Provides an optimized experience across various devices.
*   **Multilingual Support**: Full Korean/English bilingual support using i18next.

## 🚀 Key Features

*   **AI Conversation System**: Coffee Chat and Tarot consultation powered by Google Gemini 2.5 Flash. 8 Alpha expression/mood states, conversation memory via localStorage.
*   **Tarot Reading**: Celtic Cross (10-card) spread UI with per-card interpretation and final summary. Server-side API routes for Gemini integration.
*   **Gallery & Diary**: Cafe spaces, tarot cards, and BGM collection gallery. Individual diary URLs with image lightbox (keyboard/mouse/touch navigation).
*   **Guestbook**: Firestore-based guestbook with secret messages, admin mode, rate limiting, and server-side security.
*   **Background Music (BGM)**: BGM playback and control features for each space.
*   **Real-time Environment Reflection**: Location-based weather and time zone background changes via OpenWeather API.
*   **Visitor Counter**: Retro-style visitor counter on the intro page, powered by GA4 Data API.

## 🛠️ Tech Stack

*   **Framework**: Next.js 16 (App Router), React 19
*   **Language**: TypeScript
*   **Styling**: CSS with design tokens (variables.css)
*   **Testing**: Jest + React Testing Library (TDD), Playwright for E2E
*   **AI Integration**: Google Gemini 2.5 Flash API
*   **Deployment**: Vercel (recommended) or static export

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_TOKEN` | Yes* | Google Gemini API key for Coffee Chat & Tarot features. Get it from [AI Studio](https://aistudio.google.com/app/apikey) |
| `ALPHA_SECRET_PHRASE` | No | Secret phrase for master recognition |
| `ALPHA_FAMILY_MEMBERS` | No | Family members JSON for Alpha's memory |
| `ALPHA_MASTER_BIRTHDAY` | No | Master's birthday for Alpha to remember |
| `VITE_OPENWEATHER_API_KEY` | No | OpenWeather API key for real-time weather |
| `FIREBASE_CLIENT_EMAIL` | Yes* | Firebase Admin SDK service account email |
| `FIREBASE_PRIVATE_KEY` | Yes* | Firebase Admin SDK private key |
| `GA4_PROPERTY_ID` | No | GA4 Property ID for visitor counter on intro page |
| `DESK_PREBUILD_COUNT` | No | Number of latest desk posts to pre-render at build time (default: `50`). Keeps build fast with ISR for the rest. |
| `RESEND_API_KEY` | No | Resend API key for email reply notifications (comments/guestbook) |
| `COMMENT_NOTIFY_FROM` | No | Sender address for reply notification emails |

*Required for Guestbook and AI chat features

### Vercel Deployment

1. Connect your repository to [Vercel](https://vercel.com)
2. Add environment variables in Project Settings → Environment Variables
3. Deploy automatically on push to main branch

**Security**: Never commit `.env` files. They are gitignored.

## 📂 Project Structure

```
src/
├── app/
│   ├── [locale]/                # Locale-based routing (ko/en)
│   │   ├── (lounge)/            # 1F route group (shared BGM layout)
│   │   │   ├── desk/            # Master's Desk listing
│   │   │   │   └── [slug]/      # Individual post (ISR)
│   │   │   ├── gallery/diary/   # Gallery + diary entries
│   │   │   ├── counter/         # Coffee chat & tarot
│   │   │   ├── guestbook/       # Guestbook
│   │   │   └── about/[tab]/     # About page (tabs)
│   │   ├── atelier/             # 2F Atelier (Old PC, menu)
│   │   └── library/             # Redirect → atelier
│   └── api/                     # API routes (chat, tarot, comments, guestbook, etc.)
├── components/                  # React components
├── data/
│   └── desk/
│       ├── _naver-posts.ts      # 2,393 Naver blog posts (source data)
│       └── deskData.ts          # Filtering, categorization, EN tag mapping
├── i18n.ts                      # i18next config with full ko/en resources
├── lib/                         # Utilities (Gemini API, Alpha prompt)
└── services/                    # MIDI synth, etc.
scripts/
├── generate-seo-files.ts        # Sitemap + llms.txt generator
├── translate-naver-posts.ts     # Gemini-based blog translation (sharded)
├── fetch-naver-blog.ts          # Naver blog scraper (Playwright)
└── localize-naver-images.ts     # Image download & localization
public/
├── sitemap.xml                  # Auto-generated (4,324 URLs, ko+en)
├── llms.txt                     # AI crawler info
├── desk/                        # Desk post images (localized)
├── 1997-homepage/               # Archived 1997 homepage
└── 1998-homepage/               # Archived 1998 homepage
```

## 📊 Stats

| Metric | Count |
|--------|-------|
| Total pages (ko + en) | 4,324 |
| Desk posts | 2,133 |
| Diary entries | 20 |
| Desk categories | 8 |
| Supported languages | 2 (ko, en) |
| Sitemap URLs | 4,324 |

## 📝 Changelog

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

## Management Tool

A separate local management tool is available:

- **[cafelua.com-manager](https://github.com/luke-n-alpha/cafelua.com-manager)** — Markdown editor, comment/guestbook management, Git deploy (localhost:3100)

## 🤝 Contributing

This project is currently being developed as a personal project, and a contribution guide will be prepared in the future. Please leave bug reports or feature suggestions through Issues.

## 📄 License

- **Source code**: MIT
- **Blog posts & content** (`src/data/desk/posts/`, `src/data/gallery/`): [CC-BY-NC-SA-4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
- **AI context** (CLAUDE.md, AGENTS.md, GEMINI.md): [CC-BY-SA-4.0](https://creativecommons.org/licenses/by-sa/4.0/)

## 🔄 Naver Migration Runbook (Summary)

1. Collect post list in batches (`page=1..160`, `count-per-page=15`) with resume support.
2. Deduplicate strictly by `postNo` while appending.
3. Normalize body (inline image markers, broken player cleanup, external video link fallback).
4. Exclude me2day relay posts + novels from Master's Desk listing policy.
5. Regenerate SEO artifacts:
   - `npm run seo:generate`

### Recommended Command (Full Resync)

```bash
node --loader ts-node/esm scripts/fetch-naver-blog.ts \
  --full-resync \
  --start-page 1 \
  --end-page 160 \
  --count-per-page 15 \
  --max 2600
```
