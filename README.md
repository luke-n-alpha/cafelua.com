[🇰🇷 한국어](./README.ko.md) · [📝 Changelog](./CHANGELOG.md)

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
