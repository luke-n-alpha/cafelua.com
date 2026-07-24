<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
<!-- Copyright 2026 Luke & Alpha. -->

# Cafelua.com ☕

Luke와 AI 동반자 Alpha의 개인 웹사이트. 현실과 이세계의 경계에 있는 디지털 안식처.

> "미뤄둔 꿈들의 안식처, 카페루아에 오신 것을 환영합니다."

## Tech Stack

| 항목 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript |
| UI | shadcn/ui + custom CSS |
| Hosting | Vercel (SSR) |
| Analytics | Google Analytics 4 |
| Backend | Firebase (guestbook), Gemini API (chat/tarot), GA4 Data API |
| i18n | react-i18next (ko/en) |
| Package | npm |

## Key Commands

```bash
npm run dev              # Dev server (port 3000)
npm run build            # Production build
npm run test             # Jest + RTL
npm run e2e              # Playwright
npm run lint             # ESLint
npx tsc --noEmit         # Type check
npm run generate-index   # Regenerate content-index.json
```

## Project Structure

```
src/
├── app/
│   ├── [locale]/                    # Locale-aware routes (ko/en)
│   │   ├── (lounge)/                # Layout group (shared BGM)
│   │   │   ├── lounge/              # Main lounge (Alpha chat)
│   │   │   ├── counter/             # Coffee counter (chat + tarot)
│   │   │   ├── desk/                # Master's Desk (blog)
│   │   │   │   └── [slug]/          # Post detail
│   │   │   ├── gallery/             # Gallery + diary
│   │   │   │   └── diary/[slug]/    # Diary detail
│   │   │   ├── guestbook/           # Guestbook (Firebase)
│   │   │   └── about/[tab]/         # About (sitemap/alpha/luke)
│   │   ├── atelier/                 # 2F Win98 experience
│   │   ├── tarot/                   # AI tarot reading
│   │   └── page.tsx                 # Intro
│   └── api/
│       ├── chat/                    # Alpha chat (Gemini)
│       ├── desk/popular/            # GA4 popular posts
│       ├── comments/                 # Post comments (Firebase Admin)
│       ├── guestbook/               # Firebase guestbook
│       ├── link-preview/            # OG metadata fetch
│       ├── tarot/                   # Tarot cards/interpret
│       └── visitors/count/          # GA4 visitor counter
├── components/                      # React components
├── data/                            # Static/generated data
│   ├── desk/                        # Blog post data (deskData.ts)
│   ├── gallery/                     # Gallery/diary data
│   └── tarot/                       # Tarot card data
├── services/                        # Business logic
│   ├── GeminiChatService.ts         # Gemini AI chat
│   ├── ChatMemoryService.ts         # Chat memory
│   ├── CommentService.ts            # Post comments API client
│   ├── GuestbookService.ts          # Firebase guestbook
│   ├── WeatherService.ts            # OpenWeather API
│   └── LegacyMidiSynth.ts          # MIDI synth for BGM
├── lib/                             # Utilities
│   ├── alpha-prompt.ts              # Alpha persona prompt
│   ├── firebase.ts / firebase-admin.ts
│   ├── gemini.ts                    # Gemini client
│   └── tarot-data.ts                # Tarot data loader
├── styles/                          # Global CSS
└── middleware.ts                    # Locale detection + routing
```

## Feature Map

### Intro (`/`)
날씨 기반 분위기 연출 + 레트로 방문자 카운터 (GA4).
- `IntroPage.tsx`, `VisitorCounter.tsx`, `WeatherService.ts`

### Lounge (`/lounge`)
메인 라운지. Alpha AI 채팅. BGM이 라운지 그룹 페이지 간 유지됨.
- `LoungePage.tsx`, `CoffeeChatDialog.tsx`, `BackgroundMusic.tsx`
- API: `/api/chat` (Gemini)

### Counter (`/counter`)
커피 카운터. Alpha 채팅 + AI 타로.
- `CounterPage.tsx`, `tarot/` components
- API: `/api/chat`, `/api/tarot/*`

### Master's Desk (`/desk`)
블로그/포스팅. Naver 블로그 마이그레이션 + 수동 포스트.
- **리스트**: `MasterDeskPage.tsx` (카테고리/태그 필터, 검색, 무한 스크롤)
- **상세**: `DeskPost.tsx` (Markdown/HTML, 라이트박스, 이전/다음, 인기 포스팅)
- **데이터**: `data/desk/deskData.ts` (DESK_POSTS, DeskPostCard)
- **API**: `/api/desk/popular` (GA4 30일 조회수, 5분 캐싱)
- **카테고리**: cafelua, ai, it, believer, xrcloud, review, art, private

### Gallery (`/gallery`)
이미지 갤러리 + 다이어리.
- `GalleryPage.tsx`, `DiaryPost.tsx`

### Guestbook (`/guestbook`)
Firebase 기반 방명록. 대댓글(1단계), 이메일 답글 알림(Resend API).
- `GuestbookPage.tsx`, `GuestbookService.ts`
- API: `/api/guestbook/*`

### Comments
Desk/Diary 포스트 댓글 시스템. 대댓글(1단계), 이메일 답글 알림.
- `Comments.tsx`, `CommentService.ts`
- API: `/api/comments`

### About (`/about`)
사이트맵, Alpha 프로필, Luke 프로필 탭.
- `AboutPage.tsx`, `AboutModal.tsx`

### Atelier (`/atelier`)
2층 아틀리에. Win98 PC로 1997/1998 추억 홈페이지 감상.
- `AtelierPage.tsx`

### Library (`/[locale]/library`, `/[locale]/library/[bookId]?read=1`)
아틀리에와 분리된 전자책 서재. `LibraryPage.tsx`가 유일한 정본 리더이며 양면/단면 페이지, 목차, 글자 크기, 전체 화면, 시간 기반 자동 넘김과 펼침 단위 연속 브라우저 TTS를 담당합니다. 자동 넘김과 TTS는 상호 배타적으로 실행합니다.
- `LibraryPage.tsx`, `ReaderPlaybackControls.tsx`, `useReaderPlayback.ts`

### Tarot (`/tarot`)
AI 타로 리딩. Celtic Cross 스프레드 + Gemini 해석.
- `tarot/TarotCard.tsx`, `TarotSpread.tsx`, `CelticCrossSpread.tsx`
- API: `/api/tarot/cards`, `/api/tarot/interpret`, `/api/tarot/summary`

## Coding Conventions

- **Components**: PascalCase (`MasterDeskPage.tsx`)
- **CSS**: Component-scoped (`DeskPost.css`), BEM-like naming (`desk-post-title`)
- **Data/Services**: camelCase (`deskData.ts`, `GeminiChatService.ts`)
- **Imports**: External → internal → relative
- **'use client'**: Only when hooks/browser APIs needed
- **API routes**: Server-only (Firebase Admin, Gemini, GA4 Data API)

## Environment Variables

```
GEMINI_TOKEN                          # Gemini API (chat/tarot)
GA4_PROPERTY_ID                       # GA4 visitor counter + popular posts
GA4_CLIENT_EMAIL / GA4_PRIVATE_KEY    # GA4 Data API auth
NEXT_PUBLIC_FIREBASE_*                # Firebase client (guestbook)
FIREBASE_CLIENT_EMAIL / PRIVATE_KEY   # Firebase Admin
ALPHA_SECRET_PHRASE                   # Master recognition
ALPHA_FAMILY_MEMBERS                  # Family info (JSON)
NEXT_PUBLIC_OPENWEATHER_API_KEY        # Weather API (optional)
RESEND_API_KEY                        # Email notifications (Resend)
COMMENT_NOTIFY_FROM                   # Reply notification sender (optional)
```

## Management Tool

별도 레포의 로컬 관리 도구:
- **[cafelua.com-manager](https://github.com/luke-n-alpha/cafelua.com-manager)** — Markdown 에디터, 댓글/방명록 관리, Git 배포 (localhost:3100)

## Deployment

Vercel (SSR). Push to main → auto-deploy.

이 레포는 Private 레포(`luke-n-alpha/cafelua-private`)의 `public-home/` 서브모듈입니다.
동기화: `src/scripts/sync-public-home.sh`

## Open Source

- **소스코드**: MIT
- **블로그 포스트 및 콘텐츠** (`src/data/desk/posts/`, `src/data/gallery/`): CC-BY-NC-SA-4.0
- **AI 컨텍스트** (CLAUDE.md, AGENTS.md, GEMINI.md): CC-BY-SA-4.0

> 바이브 코딩 시대, AI 컨텍스트는 코드만큼 가치 있는 자산입니다.
> 이 프로젝트의 패턴이 도움이 되었다면 후원으로 응원해주세요.
> https://naia.nextain.io/donation
