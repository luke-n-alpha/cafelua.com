[🇰🇷 한국어](./README.ko.md) · [📝 Changelog](./CHANGELOG.md)

# Cafe Lua

> A digital sanctuary on the border between reality and another world.

**Cafe Lua** is a personal website / virtual teahouse built with Next.js. It features an AI companion (Alpha), a blog, a gallery, a guestbook, seasonal cafe spaces, and retro nostalgia — all in one immersive space.

🌐 **Live site**: [cafelua.com](https://cafelua.com)

---

## 🚀 Quick Start

```bash
git clone https://github.com/luke-n-alpha/cafelua.com
cd cafelua.com
npm install
cp .env.example .env   # fill in your API keys
npm run dev            # → http://localhost:3000
```

The site works without any API keys (AI chat, guestbook, and weather features will be disabled).

---

## ✨ Features

| Space | Description |
|-------|-------------|
| **Intro** | Season/time/weather-reactive entrance with retro visitor counter |
| **Lounge** | Main space with ambient BGM + environment-aware navigation |
| **Counter** | VN-style coffee chat & Celtic Cross tarot (Gemini Flash 3.1 Lite) |
| **Master's Desk** | Blog with 2,100+ posts — category/tag filter, infinite scroll |
| **Gallery** | Photo gallery, Cafe Lua spaces, tarot story decks, BGM |
| **Guestbook** | Firebase-backed guestbook with seasonal cafe backgrounds |
| **2F Atelier** | Retro Win98 PC experience and seasonal atelier backgrounds |
| **2F Library** | Korean/English ebook reader with auto-turn, browser read-aloud, mobile touch/swipe controls, shareable URLs, and WikiDocs/Leanpub editions |

**Also**: ko/en bilingual, responsive design, OG metadata per post/diary, email reply notifications.

---

## 🛠️ Tech Stack

| | |
|--|--|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript |
| Styling | CSS + design tokens |
| AI | Vercel AI Gateway + Google Gemini Flash 3.1 Lite |
| Backend | Firebase (guestbook/comments), GA4 Data API |
| i18n | react-i18next (ko/en) |
| Deployment | Vercel |

---

## 🔧 Environment Variables

Copy `.env.example` to `.env`:

| Variable | Required | Description |
|----------|:--------:|-------------|
| `NAIA_KEY` | ✅ | Server-side Naia account key for chat and tarot. Never expose it to browser code. |
| `NAIA_BASE_URL` | — | Naia gateway base URL. Default: `https://api.nextain.io/v1` |
| `CAFELUA_COFFEE_CHAT_MODEL` | — | Coffee chat model override. Default: `deepseek-v4-flash` |
| `CAFELUA_TAROT_CHAT_MODEL` | — | Tarot chat model override. Default: `deepseek-v4-flash` |
| `FIREBASE_CLIENT_EMAIL` | ✅* | Firebase Admin SDK service account email |
| `FIREBASE_PRIVATE_KEY` | ✅* | Firebase Admin SDK private key |
| `NEXT_PUBLIC_FIREBASE_*` | ✅* | Firebase client config (apiKey, projectId, etc.) |
| `GA4_PROPERTY_ID` | — | GA4 property ID for visitor counter |
| `GA4_CLIENT_EMAIL` / `GA4_PRIVATE_KEY` | — | GA4 Data API auth (popular posts) |
| `NEXT_PUBLIC_OPENWEATHER_API_KEY` | — | OpenWeather API key for real-time weather |
| `RESEND_API_KEY` | — | Email reply notifications (comments/guestbook) |
| `COMMENT_NOTIFY_FROM` | — | Sender address for reply notification emails |
| `ALPHA_SECRET_PHRASE` | — | Secret phrase for master (Alpha's owner) recognition |
| `DESK_PREBUILD_COUNT` | — | Posts pre-rendered at build time (default: `50`) |

*Required for guestbook and AI chat

---

## ✍️ Adding a Blog Post

Create `public/desk-posts/[slug].md`:

```markdown
---
date: "2025-01-01"
titleKo: 제목 (한국어)
titleEn: Title (English)
category: cafelua
tags:
  - 태그
images: []
---

<!-- ko -->
한국어 본문을 여기에 씁니다.

<!-- en -->
Write the English body here.
```

**Slug naming convention**: `YYYYMMDD-title-in-kebab-case`

**Categories**: `cafelua` · `ai` · `it` · `believer` · `xrcloud` · `review` · `art` · `private`

Then commit and push → Vercel auto-deploys.

---

## 📂 Project Structure

```
public/
└── desk-posts/          # Blog posts as Markdown files (2,100+)
    └── [slug].md        # YAML frontmatter + <!-- ko --> / <!-- en --> body

src/
├── app/
│   ├── [locale]/        # ko/en routing
│   │   └── (lounge)/    # Shared BGM layout group
│   │       ├── desk/    # Blog listing + [slug]/ (ISR)
│   │       ├── gallery/ # Gallery + diary
│   │       ├── counter/ # Coffee chat & tarot
│   │       └── guestbook/
│   └── api/             # Server routes (chat, tarot, comments, etc.)
├── components/          # React components
├── data/desk/
│   ├── deskData.ts      # Types, constants, manualPosts (client-safe)
│   └── deskLoader.ts    # Server-only: reads MD files via fs at build time
└── lib/ services/       # Gemini, Firebase, MIDI synth, etc.
```

### How posts are loaded

- `deskLoader.ts` reads all `public/desk-posts/*.md` files using Node.js `fs` at build/request time
- **Do not import `deskLoader.ts` from `'use client'` components** — it's server-only
- `deskData.ts` is client-safe (types + constants only)
- Short posts can also be added inline to `manualPosts` in `deskData.ts`

### ISR

- Blog list page: fully static at build time
- Individual post pages: top `DESK_PREBUILD_COUNT` (default 50) pre-built, rest rendered on-demand with 1-hour cache (`revalidate = 3600`)

---

## 🔨 Key Commands

```bash
npm run dev          # Dev server (port 3000)
npm run build        # Production build (~15 sec)
npm run test         # Jest + React Testing Library
npm run e2e          # Playwright E2E tests
npm run lint         # ESLint
npx tsc --noEmit     # TypeScript type check
```

### Deploy to Vercel

1. Connect `https://github.com/luke-n-alpha/cafelua.com` to [Vercel](https://vercel.com)
2. Add environment variables in Project Settings
3. Push to `main` → auto-deploy

---

## 📊 Stats

| | |
|--|--|
| Blog posts | 2,100+ |
| Diary entries | 20 |
| Categories | 8 |
| Languages | Korean + English |
| Version | 0.2.0 |

## 🔎 SEO & AI Indexing

- Canonical domain: `https://cafelua.com`
- Sitemap: `https://cafelua.com/sitemap.xml`
- LLM guide: `https://cafelua.com/llms.txt`
- Open Graph image: Cafe Lua entrance with the official round logo
- Most shareable pages use a versioned OG image path to avoid stale link-preview caches.

---

## 🧰 Management Tool

**[cafelua.com-manager](https://github.com/luke-n-alpha/cafelua.com-manager)** — local Markdown editor, comment/guestbook management, Git deploy (port 3100)

---

## 📄 License

- **Source code**: [MIT](./LICENSE)
- **Blog posts & content** (`public/desk-posts/`, `src/data/gallery/`): [CC-BY-NC-SA-4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
- **AI context files** (CLAUDE.md, AGENTS.md, GEMINI.md): [CC-BY-SA-4.0](https://creativecommons.org/licenses/by-sa/4.0/)
