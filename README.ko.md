[🇺🇸 English](./README.md) · [📝 업데이트 내역](./CHANGELOG.ko.md)

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
| `RESEND_API_KEY` | No | 답글 이메일 알림용 Resend API 키 (댓글/방명록) |
| `COMMENT_NOTIFY_FROM` | No | 답글 알림 발신자 이메일 주소 |

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
│   └── api/                     # API 라우트 (채팅, 타로, 댓글, 방명록 등)
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

## 관리 도구

별도 레포의 로컬 관리 도구를 사용합니다:

- **[cafelua.com-manager](https://github.com/luke-n-alpha/cafelua.com-manager)** — Markdown 에디터, 댓글/방명록 관리, Git 배포 (localhost:3100)

## 🤝 기여하기 (Contributing)

현재 이 프로젝트는 개인 프로젝트로 진행되고 있으며, 추후 기여 가이드를 마련할 예정입니다. 버그 제보나 기능 제안은 Issue를 통해 남겨주세요.

## 📄 라이선스 (License)

- **소스코드**: MIT
- **블로그 포스트 및 콘텐츠** (`src/data/desk/posts/`, `src/data/gallery/`): [CC-BY-NC-SA-4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
- **AI 컨텍스트** (CLAUDE.md, AGENTS.md, GEMINI.md): [CC-BY-SA-4.0](https://creativecommons.org/licenses/by-sa/4.0/)

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
