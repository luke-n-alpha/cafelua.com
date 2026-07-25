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

## Page Metadata (OG / SEO) — 새 페이지 필수 규칙

새 라우트(`page.tsx`)를 만들면 **반드시 `og:image`를 포함한 OpenGraph·Twitter 메타데이터를 지정**한다. 지정하지 않으면 카드 미리보기에 이미지가 사라진다.

- **왜 상속에 의존하면 안 되나**: `src/app/[locale]/layout.tsx`가 `openGraph`를 **이미지 없이** 재정의한다. Next.js 메타데이터는 세그먼트별로 `openGraph` 키 전체를 덮어쓰므로(얕은 override), 루트 `layout.tsx`의 기본 `og:image`가 하위 로케일 트리에서 **유실**된다. 따라서 각 페이지가 `openGraph.images`를 **직접** 주지 않으면 `og:image`가 빈다.
- **필수 필드**: `openGraph.images`(배열) + `twitter.images` + `twitter.card: 'summary_large_image'` + `alternates.canonical`.
- **이미지 선택**: 개별 콘텐츠(글/책/다이어리)는 그 콘텐츠의 대표 이미지(표지·히어로·첫 이미지), 없으면 `'/og-cafelua-entrance-v019.png'`로 폴백. 목록/공간 페이지는 그 공간의 배경 이미지.
- **경로**: `metadataBase`가 `https://cafelua.com`이므로 `/`로 시작하는 절대 경로 문자열이면 Next가 절대 URL로 변환한다.
- **참고 구현**: `gallery/diary/[slug]/page.tsx`(콘텐츠 이미지+폴백), `library/[bookId]/page.tsx`(책 표지, `bookCoverFor`), `library/page.tsx`(공간 배경).

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

## Post Data Management

### 공개 레포 (이 레포)

- `public/desk-posts/*.md` — 실제 블로그 포스트 (2100+ 개)
- 포스트는 YAML frontmatter + `<!-- ko -->` / `<!-- en -->` 본문 구조
- `src/data/desk/deskLoader.ts` (서버 전용) — 빌드/요청 시 MD 파일 읽기
- `src/data/desk/deskData.ts` — 타입, 상수, `manualPosts` (인라인 TypeScript)

### 포스트 추가/편집

1. `public/desk-posts/[slug].md` 파일 생성 또는 수정
2. 형식:
   ```markdown
   ---
   date: "YYYY-MM-DD"
   titleKo: 제목 (한국어)
   titleEn: Title (English)
   category: cafelua|ai|it|believer|xrcloud|review|art|private
   tags:
     - 태그1
   images: []
   ---
   <!-- ko -->
   한국어 본문
   <!-- en -->
   English body
   ```
3. `git add public/desk-posts/[slug].md && git commit && git push` → Vercel 자동 배포

### 대규모 데이터 관리

- 네이버 블로그 스크래핑 등 대용량 원본 데이터는 Private 레포에서만 관리
- `src/data/desk/_naver-posts*.ts` 파일은 `.gitignore`에 등록 (생성 금지)
- 변환 스크립트: `scripts/migrate-posts-to-md.ts` (일회성, 이미 실행 완료)

## Open Source

- **소스코드**: MIT
- **블로그 포스트 및 콘텐츠** (`public/desk-posts/`, `src/data/gallery/`): CC-BY-NC-SA-4.0
- **AI 컨텍스트** (CLAUDE.md, AGENTS.md, GEMINI.md): CC-BY-SA-4.0

> 바이브 코딩 시대, AI 컨텍스트는 코드만큼 가치 있는 자산입니다.
> 이 프로젝트의 패턴이 도움이 되었다면 후원으로 응원해주세요.
> https://naia.nextain.io/donation
