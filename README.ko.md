[🇺🇸 English](./README.md) · [📝 업데이트 내역](./CHANGELOG.ko.md)

# Cafe Lua (카페루아)

> 현실과 이세계의 경계에 있는 디지털 안식처.

**카페루아**는 Next.js로 만든 개인 웹사이트 겸 가상 찻집입니다. AI 동반자(알파), 블로그, 갤러리, 방명록, 계절형 카페 공간, 레트로 추억 공간이 하나로 모인 몰입형 공간입니다.

🌐 **사이트**: [cafelua.com](https://cafelua.com)

---

## 🚀 빠른 시작

```bash
git clone https://github.com/luke-n-alpha/cafelua.com
cd cafelua.com
npm install
cp .env.example .env   # API 키 입력
npm run dev            # → http://localhost:3000
```

API 키 없이도 사이트는 동작합니다 (AI 채팅, 방명록, 날씨 기능만 비활성화됩니다).

---

## ✨ 기능

| 공간 | 설명 |
|------|------|
| **인트로** | 계절/시간/날씨 반응형 입구, 레트로 방문자 카운터 |
| **라운지** | 메인 공간 — 앰비언트 BGM + 환경 상태를 이어받는 내비게이션 |
| **카운터** | VN 스타일 커피챗 & 켈틱 크로스 타로 (Gemini Flash 3.1 Lite) |
| **마스터의 데스크** | 블로그 — 2,100+개 포스트, 카테고리/태그 필터, 무한 스크롤 |
| **갤러리** | 사진 갤러리, 카페루아 공간, 타로 스토리 덱, BGM |
| **방명록** | Firebase 기반 방명록, 계절형 카페 배경, 비밀글 기능 |
| **2층 아틀리에** | 레트로 Win98 PC 체험과 계절형 아틀리에 배경 |
| **2층 서재** | 한·영 전자책 뷰어, 모바일 터치·스와이프, 책별 공유 URL과 바로보기 링크, 위키독스·Leanpub 판본 연결 |

**공통**: 한/영 이중언어, 반응형, 포스트/다이어리별 OG 메타데이터, 이메일 답글 알림.

---

## 🛠️ 기술 스택

| | |
|--|--|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript |
| Styling | CSS + 디자인 토큰 |
| AI | Vercel AI Gateway + Google Gemini Flash 3.1 Lite |
| Backend | Firebase (방명록/댓글), GA4 Data API |
| i18n | react-i18next (ko/en) |
| Deployment | Vercel |

---

## 🔧 환경 변수

`.env.example`을 `.env`로 복사하세요:

| 변수명 | 필수 | 설명 |
|--------|:----:|------|
| `NAIA_KEY` | ✅ | 채팅·타로용 서버 측 Naia 계정 키. 브라우저 코드에 노출하지 않습니다. |
| `NAIA_BASE_URL` | — | Naia 게이트웨이 기본 URL. 기본값: `https://api.nextain.io/v1` |
| `CAFELUA_COFFEE_CHAT_MODEL` | — | 커피챗 모델 override. 기본값: `deepseek-v4-flash` |
| `CAFELUA_TAROT_CHAT_MODEL` | — | 타로챗 모델 override. 기본값: `deepseek-v4-flash` |
| `FIREBASE_CLIENT_EMAIL` | ✅* | Firebase Admin SDK 서비스 계정 이메일 |
| `FIREBASE_PRIVATE_KEY` | ✅* | Firebase Admin SDK 비공개 키 |
| `NEXT_PUBLIC_FIREBASE_*` | ✅* | Firebase 클라이언트 설정 (apiKey, projectId 등) |
| `GA4_PROPERTY_ID` | — | 방문자 카운터용 GA4 속성 ID |
| `GA4_CLIENT_EMAIL` / `GA4_PRIVATE_KEY` | — | GA4 Data API 인증 (인기 포스트) |
| `NEXT_PUBLIC_OPENWEATHER_API_KEY` | — | 실시간 날씨용 OpenWeather API 키 |
| `RESEND_API_KEY` | — | 답글 이메일 알림 (댓글/방명록) |
| `COMMENT_NOTIFY_FROM` | — | 답글 알림 발신자 이메일 주소 |
| `ALPHA_SECRET_PHRASE` | — | 마스터 인식용 비밀 문구 |
| `DESK_PREBUILD_COUNT` | — | 빌드 시 사전 생성할 포스트 수 (기본값: `50`) |

*방명록 및 AI 채팅 사용 시 필수

---

## ✍️ 블로그 포스트 추가

`public/desk-posts/[slug].md` 파일을 생성합니다:

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

**슬러그 네이밍**: `YYYYMMDD-제목-kebab-case`

**카테고리**: `cafelua` · `ai` · `it` · `believer` · `xrcloud` · `review` · `art` · `private`

파일 추가 후 `git commit → push` 하면 Vercel이 자동 배포합니다.

---

## 📂 프로젝트 구조

```
public/
└── desk-posts/          # 블로그 포스트 Markdown 파일 (2,100+개)
    └── [slug].md        # YAML frontmatter + <!-- ko --> / <!-- en --> 본문

src/
├── app/
│   ├── [locale]/        # ko/en 라우팅
│   │   └── (lounge)/    # 공유 BGM 레이아웃 그룹
│   │       ├── desk/    # 블로그 목록 + [slug]/ (ISR)
│   │       ├── gallery/ # 갤러리 + 다이어리
│   │       ├── counter/ # 커피챗 & 타로
│   │       └── guestbook/
│   └── api/             # 서버 라우트 (채팅, 타로, 댓글 등)
├── components/          # React 컴포넌트
├── data/desk/
│   ├── deskData.ts      # 타입, 상수, manualPosts (클라이언트 safe)
│   └── deskLoader.ts    # 서버 전용: 빌드 시 fs로 MD 파일 읽기
└── lib/ services/       # Gemini, Firebase, MIDI 신시사이저 등
```

### 포스트 로딩 구조

- `deskLoader.ts`가 빌드/요청 시 `public/desk-posts/*.md` 파일을 Node.js `fs`로 읽습니다
- **`'use client'` 컴포넌트에서 `deskLoader.ts` 임포트 금지** — 서버 전용
- `deskData.ts`는 클라이언트 safe (타입 + 상수만)
- 짧은 포스트는 `deskData.ts`의 `manualPosts` 배열에 TypeScript로 직접 추가 가능

### ISR (점진적 정적 재생성)

- 블로그 목록 페이지: 빌드 시 완전 정적 생성
- 개별 포스트 페이지: 상위 `DESK_PREBUILD_COUNT`개 (기본 50개) 빌드 시 사전 생성, 나머지는 요청 시 1시간 캐시

---

## 🔨 주요 커맨드

```bash
npm run dev          # 개발 서버 (포트 3000)
npm run build        # 프로덕션 빌드 (~15초)
npm run test         # Jest + React Testing Library
npm run e2e          # Playwright E2E 테스트
npm run lint         # ESLint
npx tsc --noEmit     # TypeScript 타입 체크
```

### Vercel 배포

1. [Vercel](https://vercel.com)에 `https://github.com/luke-n-alpha/cafelua.com` 연결
2. Project Settings에서 환경변수 추가
3. `main` 브랜치에 push → 자동 배포

---

## 📊 통계

| | |
|--|--|
| 블로그 포스트 | 2,100+ |
| 다이어리 | 20개 |
| 카테고리 | 8개 |
| 지원 언어 | 한국어 + 영어 |
| 버전 | 0.2.0 |

## 🔎 SEO & AI 인덱싱

- 대표 도메인: `https://cafelua.com`
- 사이트맵: `https://cafelua.com/sitemap.xml`
- LLM 안내문: `https://cafelua.com/llms.txt`
- Open Graph 이미지: 카페루아 현관과 공식 원형 로고
- 주요 공유 페이지는 링크 프리뷰 캐시 갱신을 위해 버전이 붙은 OG 이미지 경로를 사용합니다.

---

## 🧰 관리 도구

**[cafelua.com-manager](https://github.com/luke-n-alpha/cafelua.com-manager)** — 로컬 Markdown 에디터, 댓글/방명록 관리, Git 배포 (포트 3100)

---

## 📄 라이선스

- **소스코드**: [MIT](./LICENSE)
- **블로그 포스트 및 콘텐츠** (`public/desk-posts/`, `src/data/gallery/`): [CC-BY-NC-SA-4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
- **AI 컨텍스트** (CLAUDE.md, AGENTS.md, GEMINI.md): [CC-BY-SA-4.0](https://creativecommons.org/licenses/by-sa/4.0/)
