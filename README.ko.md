[🇺🇸 English](./README.md)

# Cafe Lua (카페루아)

**카페루아(Cafe Lua)**는 고요한 숲속의 찻집을 테마로 한 가상 공간 프로젝트입니다. 방문객들에게 편안한 휴식과 따뜻한 이야기를 제공하며, 다양한 인터랙티브 요소를 통해 몰입감 있는 경험을 선사합니다.

## 🌿 프로젝트 소개

이 프로젝트는 Next.js 16(App Router) 기반의 몰입형 웹 애플리케이션으로, 다음과 같은 공간과 기능을 제공합니다.

*   **몰입형 인트로**: 시간대와 날씨에 따라 변화하는 배경과 함께 카페루아의 세계로 초대합니다.
*   **라운지 공간**: 편안한 음악과 함께 카페루아의 분위기를 즐길 수 있는 메인 공간입니다.
*   **카운터**: AI 마스코트 '알파'와 VN 스타일 커피챗, 켈틱 크로스(10장) 타로 리딩. Google Gemini 2.5 Flash 기반.
*   **갤러리**: 카페 공간 사진, 다이어리, 타로 카드 도감, BGM 컬렉션을 둘러볼 수 있는 갤러리.
*   **다이어리**: 텍스트 + 다중 이미지 포스팅 형식의 개인 일기. 개별 URL 및 OG 메타데이터로 공유 가능.
*   **방명록**: 닉네임 + 비밀번호 인증 방식의 방명록. 비밀글 시스템 및 관리자 모드 지원.
*   **2층 아틀리에**: Win98 PC 감성으로 1997/1998년 루크의 홈페이지 추억을 탐험할 수 있는 공간.
*   **반응형 디자인**: 다양한 디바이스에서 최적화된 경험을 제공합니다.
*   **다국어 지원**: i18next를 활용하여 한국어 및 영어 완전 이중언어 지원.

## 🚀 주요 기능

*   **AI 대화 시스템**: Google Gemini 2.5 Flash 기반의 커피챗 및 타로 상담. 8가지 알파 표정/기분 시스템, localStorage를 통한 대화 기억.
*   **타로 리딩**: 켈틱 크로스(10장) 스프레드 UI, 카드별 해석 및 최종 종합 해석 제공. 서버사이드 API로 Gemini 연동.
*   **갤러리 & 다이어리**: 카페 공간, 타로 카드, BGM 컬렉션 갤러리. 다이어리 엔트리별 개별 URL, 이미지 라이트박스(키보드/마우스/터치 네비게이션).
*   **방명록**: Firestore 기반 방명록. 비밀글, 관리자 모드, Rate Limiting, 서버사이드 보안.
*   **배경 음악 (BGM)**: 각 공간에 어울리는 배경 음악 재생 및 제어 기능.
*   **실시간 환경 반영**: OpenWeather API를 활용한 위치 기반 날씨 및 시간대 배경 변화.
*   **방문자 카운터**: GA4 Data API 기반 레트로 스타일 방문자 카운터 (인트로 페이지).

## 🛠️ 기술 스택

*   **Framework**: Next.js 16 (App Router), React 19
*   **Language**: TypeScript
*   **Styling**: CSS + 디자인 토큰(variables.css)
*   **Testing**: Jest + React Testing Library(TDD), Playwright(E2E)
*   **AI 연동**: Google Gemini 2.5 Flash API
*   **Deployment**: Vercel (권장) 또는 정적 빌드

## 🔧 환경 변수

`.env.example`을 `.env`로 복사하고 설정하세요:

| 변수명 | 필수 | 설명 |
|--------|------|------|
| `GEMINI_TOKEN` | Yes* | Coffee Chat & Tarot 기능용 Google Gemini API 키. [AI Studio](https://aistudio.google.com/app/apikey)에서 발급 |
| `ALPHA_SECRET_PHRASE` | No | 마스터 인식용 비밀 문구 |
| `ALPHA_FAMILY_MEMBERS` | No | 알파 메모리용 가족 구성원 JSON |
| `ALPHA_MASTER_BIRTHDAY` | No | 알파가 기억할 마스터 생일 |
| `VITE_OPENWEATHER_API_KEY` | No | 실시간 날씨용 OpenWeather API 키 |
| `FIREBASE_CLIENT_EMAIL` | Yes* | Firebase Admin SDK 서비스 계정 이메일 |
| `FIREBASE_PRIVATE_KEY` | Yes* | Firebase Admin SDK 비공개 키 |
| `GA4_PROPERTY_ID` | No | 인트로 페이지 방문자 카운터용 GA4 속성 ID |
| `DESK_PREBUILD_COUNT` | No | 빌드 시 사전 렌더링할 최신 데스크 포스트 수 (기본값: `50`). 나머지는 ISR로 온디맨드 생성. |

*방명록 및 AI 채팅 기능 사용 시 필수

### Vercel 배포

1. [Vercel](https://vercel.com)에 저장소 연결
2. Project Settings → Environment Variables에서 환경변수 추가
3. main 브랜치 push 시 자동 배포

**보안**: `.env` 파일은 절대 커밋하지 않습니다. gitignore에 포함되어 있습니다.

## 📂 프로젝트 구조

```
src/
├── app/
│   ├── [locale]/                # 로케일 기반 라우팅 (ko/en)
│   │   ├── (lounge)/            # 1층 라우트 그룹 (공유 BGM 레이아웃)
│   │   │   ├── desk/            # 마스터의 데스크 목록
│   │   │   │   └── [slug]/      # 개별 포스트 (ISR)
│   │   │   ├── gallery/diary/   # 갤러리 + 다이어리
│   │   │   ├── counter/         # 커피챗 & 타로
│   │   │   ├── guestbook/       # 방명록
│   │   │   └── about/[tab]/     # 소개 페이지 (탭)
│   │   ├── atelier/             # 2층 아틀리에 (낡은 PC, 메뉴)
│   │   └── library/             # atelier로 리다이렉트
│   └── api/                     # API 라우트 (채팅, 타로, 방명록 등)
├── components/                  # React 컴포넌트
├── data/
│   └── desk/
│       ├── _naver-posts.ts      # 네이버 블로그 2,393개 포스트 원본
│       └── deskData.ts          # 필터링, 카테고리 분류, 영문 태그 매핑
├── i18n.ts                      # i18next 설정 (ko/en 전체 리소스)
├── lib/                         # 유틸리티 (Gemini API, 알파 프롬프트)
└── services/                    # MIDI 신시사이저 등
scripts/
├── generate-seo-files.ts        # sitemap + llms.txt 생성기
├── translate-naver-posts.ts     # Gemini 기반 블로그 번역 (샤딩)
├── fetch-naver-blog.ts          # 네이버 블로그 스크래퍼 (Playwright)
└── localize-naver-images.ts     # 이미지 다운로드 & 로컬화
public/
├── sitemap.xml                  # 자동 생성 (4,324 URL, ko+en)
├── llms.txt                     # AI 크롤러 정보
├── desk/                        # 데스크 포스트 이미지 (로컬화)
├── 1997-homepage/               # 아카이브: 1997년 홈페이지
└── 1998-homepage/               # 아카이브: 1998년 홈페이지
```

## 📊 통계

| 항목 | 수량 |
|------|------|
| 전체 페이지 (ko + en) | 4,324 |
| 데스크 포스트 | 2,133 |
| 다이어리 | 20 |
| 데스크 카테고리 | 8 |
| 지원 언어 | 2 (ko, en) |
| 사이트맵 URL | 4,324 |

## 📝 업데이트 내역 (Changelog)

### v0.1.8 (2026-03-06)
- **데스크 포스트 네비게이션 & 인기 포스팅**:
    - 포스트 하단에 이전/다음 포스트 네비게이션 추가.
    - GA4 기반 인기 포스팅 섹션 추가 (최근 30일 조회수 기준, 5분 캐싱).
- **naia.nextain.io 크로스포스팅**:
    - Naia 블로그 글을 마스터의 데스크에 전문 크로스포스팅.
- **모바일 & UI 수정**:
    - 모바일에서 포스팅 이미지가 화면 밖으로 삐져나가는 문제 수정.
    - DeskPost 헤딩 폰트 스타일 수정.
- **i18n & SEO**:
    - 모든 `[locale]` 페이지에 locale 인식 메타데이터 적용.
    - GA4 gtag.js 트래킹 복원.

### v0.1.7 (2026-02-20)
- **전체 영문 번역**:
    - 네이버 블로그 2,311+ 포스트 전체 영문 번역 (Gemini 2.5 Flash).
    - 5개 샤드 병렬 번역 파이프라인 (체크포인트 + result-only 모드).
    - 공백/기호 전용 제목 처리로 Gemini 빈 응답 방지.
    - 미번역 포스트 필터 적용 — 번역 완료된 포스트만 마스터의 데스크에 노출.
- **영문 태그 매핑**:
    - 27개 한국어 태그의 영문 매핑 추가 (`/en/desk` 표시용).
    - 영문 모드 검색 시 영문 태그명으로도 매칭.
- **i18n 수정**:
    - library 리다이렉트 locale 유실 수정 (Next.js 16 `params`는 Promise — `await` 필요).
    - i18n hydration 불일치 수정: `[locale]/layout.tsx`에서 동기 `changeLanguage` 호출.
    - API 채팅/타로 라우트에 언어 잠금 추가 (일관된 응답 보장).
- **Hydration 수정**:
    - DeskPost: YouTube 임베드의 `<div>` inside `<p>` 방지를 위해 커스텀 `div` 렌더러 적용.
- **SEO**:
    - sitemap.xml: 4,324 URL로 확장 (ko/en 각각 별도 엔트리 + hreflang alternate).
    - `llms.txt`: 사이트 소개, 구조, 콘텐츠 분류, 기술 정보 등 풍부하게 보강.
- **빌드 최적화**:
    - ISR (`revalidate: 3600`) + `DESK_PREBUILD_COUNT` (기본 50)으로 데스크 포스트 빌드 최적화.
    - 배포 시 100페이지(50 × 2 로케일)만 사전 빌드, 나머지는 온디맨드 생성.

### v0.1.6 (2026-02-14)
- **방문자 카운터**:
    - 인트로 페이지 입장 버튼 아래 레트로 스타일 방문자 카운터 위젯 추가.
    - GA4 Data API 연동으로 실시간 누적 방문자 수 표시.
    - 서버사이드 API 라우트 (`/api/visitors/count`) + 1시간 캐싱.
    - 환경변수 미설정 시 카운터 자동 숨김 (graceful fallback).
- **블로그 이식 + 마스터의 데스크 업데이트**:
    - 네이버 블로그 전체보기 기준(2,393개) 수집/정규화 파이프라인 구축.
    - 마스터의 데스크 라우트/목록/상세 페이지 구성 및 OG 메타 연동.
    - 게시일/카테고리/태그 복원 및 본문 노이즈(메뉴/마크업 혼입) 정제 자동화.
    - 이미지 로컬화, 누락 이미지 fallback(`missing-image.webp`) 처리, 링크/동영상 링크 보존.
    - 미투데이 연동형 포스트/소설 포스트의 데스크 노출 제외 규칙 반영.
    - `sitemap.xml`, `llms.txt` 자동 갱신 스크립트 및 운영 문서 동기화.
    - 블로그 마이그레이션 안내 포스트(`20260218-naver-blog-migration`)를 v0.1.6 업데이트 소식 기준으로 보강.

### v0.1.5 (2026-02-13)
- **갤러리 — 다이어리**:
    - 갤러리에 다이어리 탭 추가 (19개 엔트리, 최신순 정렬).
    - 각 다이어리 개별 URL 및 Open Graph 메타데이터 지원 (`/gallery/diary/[slug]`).
    - 포스팅 형식 레이아웃: 텍스트 + 다중 이미지.
    - 이미지 라이트박스: 키보드(좌/우 화살표), 마우스 스크롤, 터치 네비게이션.
    - 본문 스크롤: 위/아래 화살표 키보드 지원.
    - 한국어/영어 완전 이중언어 지원 (제목, 본문, UI).
    - 다이어리 이미지 50장 WebP 최적화 변환.
- **방명록**:
    - 닉네임 + 비밀번호 인증 방식의 방명록 기능.
    - 비밀글 시스템 및 조회 인증.
    - 관리자 모드 (전체 글 관리).
    - 모든 Firestore 작업을 Firebase Admin SDK로 마이그레이션 (서버사이드 전용).
    - Rate Limiting, 타이밍 세이프 비밀번호 비교, 서버사이드 검증.
- **타로 — 켈틱 크로스 리뉴얼**:
    - 켈틱 크로스(10장) 스프레드 UI로 타로 리딩 리디자인.
    - 전용 카드 컴포넌트 (TarotCard, TarotSpread, CelticCrossSpread).
    - 서버사이드 타로 API (cards, interpret, summary) — Gemini 연동.
    - 카드별 해석 및 최종 종합 해석 인터랙션.
    - 타로 리딩 훅 (useTarotReading) 상태 관리.
- **커피챗 개선**:
    - 리치 메시지 렌더링 (포맷팅된 텍스트 지원).
    - 타로 리딩 모드 레이아웃 — 카드 리딩 중 대화창 하단 고정.
    - 타로 모드 모바일 반응형 조정.
- **보안 강화**:
    - 클라이언트 Firestore SDK → Firebase Admin SDK 전환.
    - 서버사이드 비밀번호 해싱 (SHA-256) 및 타이밍 세이프 비교.
    - 모든 API 엔드포인트에 IP 기반 Rate Limiting 적용.
    - 비밀글은 인증된 서버 API를 통해서만 접근 가능.

### v0.1.4 (2026-02-02)
- **AI 채팅 기능**:
    - **Coffee Chat**: 카페 카운터에서 알파와 VN 스타일 대화 시스템. Google Gemini 2.5 Flash 사용.
    - **타로 상담**: 신비로운 타로 테마 채팅 경험 (알파는 아직 카드 읽기 수련 중).
    - 8가지 알파 표정/기분 시스템.
    - localStorage를 통한 사용자 메모리 유지 (과거 대화 기억).
    - 세션 타입별 대화 기록 열람 기능.
    - 실시간 메시지 저장.
- **i18n 강화**:
    - 카운터, Coffee Chat, 타로 페이지 완전 번역 추가 (EN/KO).
- **문서화**:
    - 모든 환경변수 포함 `.env.example` 추가.
    - Vercel 배포 가이드로 README 업데이트.

### v0.1.3 (2026-01-11)
- **주요 업데이트**:
    - 라운지 및 2층 아틀리에 공간 업데이트
    - 2층 아틀리에 낡은 PC에 1997/1998년 루크의 홈페이지 추가
    - 카페 소개 페이지 추가
    - 카운터에 작업예정 내역 추가

### v0.1.2 (2024-12-07)
- **아키텍처**:
    - GitHub Pages가 Next 15 동적 런타임을 지원하지 않아 **Next.js 14.2 + React 18**로 다운그레이드하고 `output: 'export'` 정적 빌드로 전환.
    - 배포 워크플로우를 `npm run build` → `out/` 업로드 → Pages 배포 순서로 갱신.
    - 스크래치 문서는 `work-log/`에만 보관하도록 가이드 강화, 과거 `work/` 경로 정리.

### v0.1.1 (2025-11-30)
- **기능 추가 및 개선**:
    - **날씨 API 연동**: 실시간 날씨 정보를 받아와 배경 및 환경 요소에 반영하는 기능 추가.
    - **BGM 시스템**: 라운지 및 인트로 페이지에 배경 음악 자동 재생 및 제어 UI 추가.
    - **라운지 메뉴**: 라운지 화면에 주요 기능을 이용할 수 있는 메뉴 버튼 UI 추가 (공사중 페이지 연결).
- **UI/UX 개선**:
    - **공사중(Under Construction) 페이지 디자인 리뉴얼**:
        - 텍스트와 캐릭터 이미지 레이아웃 변경 (이미지 좌측, 텍스트 우측 배치).
        - 캐릭터 이미지 크기 고정(100px) 및 스타일 수정 (테두리 제거, 자연스러운 배치).
        - '라운지로 돌아가기' 버튼 위치 조정 (우측 하단 정렬) 및 스타일 개선.
    - **인트로 페이지 개선**: Open Graph 메타 태그 및 커버 이미지 적용으로 공유 경험 향상.

### v0.1.0 (2025-11-20)
- **최초 릴리즈**:
    - 프로젝트 기본 구조 설정 (React + Vite + TypeScript).
    - 인트로 페이지 구현 (시간대별 배경 이미지 자동 전환).
    - 라운지 페이지 기초 구현.
    - 기본 라우팅 설정.

## 🤝 기여하기 (Contributing)

현재 이 프로젝트는 개인 프로젝트로 진행되고 있으며, 추후 기여 가이드를 마련할 예정입니다. 버그 제보나 기능 제안은 Issue를 통해 남겨주세요.

## 📄 라이선스 (License)

(라이선스 정보 추가 예정)

## 🔄 네이버 이식 실행 요약

1. 전체보기 기준 배치 수집(`page=1..160`, `count-per-page=15`) + 이어받기 실행
2. append 시 `postNo` 기준 중복 스킵
3. 본문 정규화(`{{IMG:N}}` 복원, 깨진 플레이어 텍스트 제거, 영상 링크 치환)
4. 미투데이 연동형 + 소설 포스트는 데스크 리스트 노출 제외
5. SEO 산출물 갱신
   - `npm run seo:generate`

### 권장 명령 (전수 재수집)

```bash
node --loader ts-node/esm scripts/fetch-naver-blog.ts \
  --full-resync \
  --start-page 1 \
  --end-page 160 \
  --count-per-page 15 \
  --max 2600
```
