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

*방명록 및 AI 채팅 기능 사용 시 필수

### Vercel 배포

1. [Vercel](https://vercel.com)에 저장소 연결
2. Project Settings → Environment Variables에서 환경변수 추가
3. main 브랜치 push 시 자동 배포

**보안**: `.env` 파일은 절대 커밋하지 않습니다. gitignore에 포함되어 있습니다.

## 📂 프로젝트 구조

```
public-home/
├── public/              # 정적 리소스 (이미지, 오디오 등)
├── src/                 # Next.js App Router 소스
│   ├── app/             # 라우트/레이아웃/페이지
│   ├── components/      # UI 컴포넌트 (shadcn + 커스텀)
│   ├── styles/          # 전역 스타일 및 테마 토큰
│   └── data/            # 생성된 콘텐츠 인덱스 및 헬퍼
└── ...
```

## 📝 업데이트 내역 (Changelog)

### v0.1.6 (2026-02-14)
- **방문자 카운터**:
    - 인트로 페이지 입장 버튼 아래 레트로 스타일 방문자 카운터 위젯 추가.
    - GA4 Data API 연동으로 실시간 누적 방문자 수 표시.
    - 서버사이드 API 라우트 (`/api/visitors/count`) + 1시간 캐싱.
    - 환경변수 미설정 시 카운터 자동 숨김 (graceful fallback).
- **블로그 이식 + 마스터의 데스크 업데이트**:
    - 네이버 블로그 포스트 이식 파이프라인 구축 및 데이터 정규화.
    - 마스터의 데스크 노출 규칙/분류/정제 로직 정비.
    - `sitemap.xml`, `llms.txt` 자동 갱신 흐름과 운영 문서 동기화.

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
