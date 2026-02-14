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

*Required for Guestbook and AI chat features

### Vercel Deployment

1. Connect your repository to [Vercel](https://vercel.com)
2. Add environment variables in Project Settings → Environment Variables
3. Deploy automatically on push to main branch

**Security**: Never commit `.env` files. They are gitignored.

## 📂 Project Structure

```
public-home/
├── public/              # Static resources (images, audio, etc.)
├── src/                 # Next.js App Router source
│   ├── app/             # Route handlers, layouts, pages
│   ├── components/      # UI components (shadcn + custom)
│   ├── styles/          # Global styles and theme tokens
│   └── data/            # Generated content index & helpers
└── ...
```

## 📝 Changelog

### v0.1.6 (2026-02-14)
- **Visitor Counter**:
    - Retro-style visitor counter widget on the intro page (below the enter button).
    - GA4 Data API integration for real-time cumulative visitor count.
    - Server-side API route (`/api/visitors/count`) with 1-hour cache.
    - Graceful fallback: counter hides silently when configuration is missing.

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

## 🤝 Contributing

This project is currently being developed as a personal project, and a contribution guide will be prepared in the future. Please leave bug reports or feature suggestions through Issues.

## 📄 License

(License information to be added)
