[🇰🇷 한국어](./README.ko.md)

# Cafe Lua

**Cafe Lua** is a virtual space project themed around a tranquil teahouse in the forest. It offers visitors a relaxing retreat and warm stories, providing an immersive experience through various interactive elements.

## 🌿 Project Introduction

This project is moving to a Next.js (App Router) + shadcn/ui stack, featuring the following characteristics:

*   **Immersive Intro**: Invites you into the world of Cafe Lua with backgrounds that change according to the time of day and weather.
*   **Lounge Space**: The main area where you can enjoy the atmosphere of Cafe Lua with comfortable music.
*   **2F Atelier Space**: A nostalgic “Win98 PC” experience where you can explore Luke's 1997/1998 homepage memories (static, read-only).
*   **Responsive Design**: Provides an optimized experience across various devices.
*   **Multilingual Support**: Offers multilingual support, including Korean and English, using i18next.

## 🚀 Key Features

*   **Real-time Environment Reflection**: Reflects the user's actual location-based weather and time zone in the background (in preparation).
*   **Background Music (BGM)**: BGM playback and control features suitable for each space, such as the intro and lounge.
*   **Character Interaction**: Conversation and interaction with Cafe Lua's mascot, 'Alpha' (in development).

## 🛠️ Tech Stack

*   **Framework**: Next.js 16 (App Router), React 19
*   **Language**: TypeScript
*   **Styling**: CSS with design tokens (variables.css)
*   **Testing**: Jest + React Testing Library (TDD), Playwright for E2E
*   **AI Integration**: Google Gemini 3.0 Flash API
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

*Required only for AI chat features (Coffee Chat, Tarot)

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

### v0.1.4 (2026-02-02)
- **AI Chat Features**:
    - **Coffee Chat**: VN-style conversation system with Alpha at the cafe counter. Powered by Google Gemini 3.0 Flash.
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
