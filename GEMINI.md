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
| Hosting | Azure VM `naia-home-prod-az` 의 도커 컨테이너 (SSR). Cloudflare → Azure Front Door → VM 안 Caddy → 앱 `:3000` |
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

요청 경로는 이렇습니다.

```
Cloudflare → Azure Front Door → cafelua.naia.land (VM 안 Caddy) → cafelua 컨테이너 :3000
```

Front Door 프로필은 `afd-naia-global`(리소스 그룹 `rg-naia-koreacentral`)입니다. `www.cafelua.com` 과 `cafelua.com` 은 엔드포인트 `afd-naia-dev` 의 라우트 `route-cafelua-www-prod` 를 타고, 오리진 그룹 `og-cafelua-prod` 를 거쳐 오리진 호스트 `cafelua.naia.land` 로 갑니다. 라우트 캐시는 꺼져 있습니다.

`cafelua.naia.land` 는 `20.214.153.4`, 곧 VM `naia-home-prod-az`(리소스 그룹 `RG-NAIA-KOREACENTRAL`)입니다. 그 VM 에서 systemd 유닛 `cafelua.service` 가 도커 컨테이너 두 개를 띄웁니다. 앱 컨테이너 `cafelua` 와 `caddy`(`caddy:2.10-alpine`)입니다. Caddy 설정은 VM 의 `/opt/cafelua/Caddyfile` 이고, `www.cafelua.com` 과 `cafelua.naia.land` 를 `cafelua:3000` 으로 프록시합니다. `cafelua.com` 은 `www` 로 영구 리다이렉트합니다.

이미지 레지스트리는 `acrnaia83b29893.azurecr.io`, 저장소는 `cafelua/home` 입니다. 태그는 `<용도>-<YYYYMMDD>-<public-home 짧은 커밋>` 규칙을 따릅니다. 앱 컨테이너는 `--read-only`, `--cap-drop ALL`, 메모리 1400m, CPU 1.5 로 돌고, 시크릿은 유닛이 Key Vault `kv-naia-83b29893` 의 `cafelua-naia-key` 를 읽어 `/run/cafelua.env` 로 떨군 뒤 `--env-file` 로 넣습니다.

순서는 이렇습니다. 이 레포를 먼저 푸시하고, **그 커밋으로 이미지를 구워**, VM 유닛의 IMAGE 를 새 태그로 바꿔 재시작합니다.

```bash
git push origin main
az acr build --registry acrnaia83b29893 --resource-group RG-NAIA-KOREACENTRAL \
  --image cafelua/home:<태그> --file Dockerfile .

# 아래는 VM 에서 실행합니다.
#   az vm run-command invoke -g RG-NAIA-KOREACENTRAL -n naia-home-prod-az \
#     --command-id RunShellScript --scripts '...'
# systemctl set-environment 가 아니라 드롭인으로 IMAGE 를 새 태그로 바꾼 뒤
systemctl restart cafelua
```

푸시만으로는 아무것도 배포되지 않습니다. 자동 배포는 없습니다. CI 도 없습니다 — 이 레포에 `.github` 디렉터리는 없습니다.

`src/middleware.ts` 는 `x-azure-fdid` 헤더가 `AZURE_FRONT_DOOR_ID` 와 맞지 않으면 403 Forbidden 을 냅니다. Front Door 를 우회해 오리진에 직접 붙으면 403 이 나므로, 이 사실을 모르면 오리진이 죽은 줄로 오해하게 됩니다.

Azure Container App `ca-cafelua-prod` 는 **서빙 경로가 아닙니다.** 같은 앱 코드가 올라가 있어 헷갈리기 쉬운 미사용 잔재이고, 정리 여부는 아직 정해지지 않았습니다.

### 배포 확인의 함정

확인은 상태 코드로 하지 않습니다. `cafelua.com` 은 `www` 로 영구 리다이렉트되므로 `curl -L` 과 `www.cafelua.com` 을 씁니다. 데스크 글과 책 페이지는 서버가 껍데기(`Loading...`)만 내려보내고 브라우저에서 본문을 채우므로 `curl` 과 `grep` 으로는 내용을 볼 수 없습니다. 헤드리스 브라우저로 렌더한 뒤 본문 문자열을 확인해야 합니다. 그리고 확인용 검사 스크립트는 먼저 정상인 이미지에 돌려 기준선을 잡고 나서 운영에 돌립니다.

이 레포는 Private 레포(`luke-n-alpha/cafelua-private`)의 `public-home/` 서브모듈입니다.
동기화: `src/scripts/sync-public-home.sh`

## Open Source

- **소스코드**: MIT
- **블로그 포스트 및 콘텐츠** (`src/data/desk/posts/`, `src/data/gallery/`): CC-BY-NC-SA-4.0
- **AI 컨텍스트** (CLAUDE.md, AGENTS.md, GEMINI.md): CC-BY-SA-4.0

> 바이브 코딩 시대, AI 컨텍스트는 코드만큼 가치 있는 자산입니다.
> 이 프로젝트의 패턴이 도움이 되었다면 후원으로 응원해주세요.
> https://naia.nextain.io/donation
