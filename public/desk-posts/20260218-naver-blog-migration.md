---
date: "2026-02-18"
titleKo: 카페루아 v0.1.6 업데이트- 마스터의데스크 네이버블로그마이그레션
titleEn: Cafe Lua v0.1.6 Update - Master Desk Naver Blog Migration
category: it
tags: []
images:
  - /master-desk-background-img/master-desk-background.webp
thumbnail: /master-desk-background-img/master-desk-background.webp
externalUrl: https://github.com/luke-n-alpha/cafelua.com
---

<!-- ko -->
카페루아 v0.1.6 업데이트- 마스터의데스크 네이버블로그마이그레션

이번 v0.1.6의 핵심 업데이트는 네이버 블로그 2,393개 포스트를 카페루아로 이관해 데이터 독립을 확보한 것입니다.

{{IMG:1}}

v0.1.6 반영 범위 요약
- 네이버 블로그 전체보기 기준 포스트 수집/복원 (작성일, 카테고리, 태그 포함)
- 마스터의 데스크 라우트/목록/상세 페이지와 OG 메타 정비
- 본문 정제(메뉴 오염/깨진 임베드/중복 링크/이미지 누락 처리)
- 소설/미투데이 연동형 포스트 노출 정책 분리
- `sitemap.xml`, `llms.txt` 자동 갱신 및 운영 문서 동기화
- Vercel 배포 최적화: 데스크 상세 페이지를 ISR + 부분 pre-render(최신 일부만 사전 생성)로 전환

https://blog.naver.com/fstory97 숲속얘기의 조용한 카페는 2006년 6월 12일, 쇼생크 탈출 리뷰 글을 첫 글로 시작해 총 2,393개의 글이 기록되어 있었습니다. (전체보기 API 기준) 2006년 6월 15일 NHN(구 네이버) 입사와 함께 시작한 [네이버 블로그](/ko/desk/20060615-블로그에-카페-본점을-개설하다-my-diary-사적이야기/)는 2010, 2011, 2012년 IT·웹프로그램 부문 파워블로거 선정에 이어 2026년 1월 ‘이달의 블로그’에도 선정되었습니다. 이사 직전에 이달의 블로그에 선정된 건 조금 쑥스럽기도 하네요. 아무래도 요즘 화두인 AI 관련 글들이 많다 보니 주목을 받은 것 같습니다.

1999년 군 입대 전까지 저는 fstory.net이라는 개인 홈페이지를 운영했습니다. 가벼운 신변 소개와 자작 소설을 올렸고, 한때는 만화 음악을 수집해 공유하기도 했습니다(방송국 항의로 내렸습니다). 마지막 홈페이지에서는 인공지능 이야기를 다뤘지만 해당 홈페이지는 소실되었습니다. 첫 번째와 두 번째 홈페이지는 [2층 아틀리에의 낡은 PC](/ko/atelier?oldpc=true)를 켜면 확인할 수 있습니다.

이번에 카페루아 2층 아틀리에의 ‘마스터의 데스크’로 이관하면서, 2,393개 글 중 ‘카페루아 라이프’ 카테고리는 [1층 카페루아의 갤러리](/ko/gallery)로 옮겼고, 소설은 데스크 리스트에서 제외하고, 추후 ‘서재’ 섹션으로 따로 재정리할 예정입니다. 그 외 포스팅은 모두 ‘마스터의 데스크’로 이관했습니다.

사실 네이버는 제 젊은 시절 성장의 기억이 많은 좋은 서비스였지만, AI 시대에 맞춰 이제는 데이터 독립을 해보려 합니다. 제가 남긴 모든 것이 제 자산 안에 남고, 알파가 기억해주길 바라기 때문입니다. 싸이월드에서 잃어버린 기록들, 이제는 기억조차 흐려진 PC통신 시절의 글들처럼 흩어지게 두고 싶지 않습니다.

이 작업은 클로드 코드를 이용해 진행했고, 오픈소스로 공개했습니다. 같은 니즈가 있으신 분들은 카페루아 오픈소스를 참고하시면 좋겠습니다. 상세 구현 방법은 아래와 같습니다.

---

기술적 과정

1. Playwright 기반 스크래핑

네이버 블로그는 RSS로 전체 데이터를 제공하지 않습니다. 그래서 Playwright(headless Chromium)를 사용해 실제 브라우저로 포스트를 순회하며 데이터를 추출했습니다.

주요 추출 항목:
- 제목, 본문 텍스트
- 이미지 (data-lazy-src에서 원본 URL 추출)
- 카테고리, 날짜
- 원본 블로그 링크

2. 이미지 다운로드 및 WebP 변환

네이버 이미지 서버(postfiles.pstatic.net)에서 원본 이미지를 다운로드한 뒤, public/desk/ 또는 public/diary/ 디렉토리에 저장했습니다.

3. 카테고리 분류

"카페루아 라이프" 카테고리 포스트 → 갤러리 > 다이어리
나머지 포스트 → 마스터의 데스크 (테크/에세이/기타로 재분류)

4. 마크다운-이미지 정렬

네이버 블로그에서는 이미지가 본문 사이사이에 삽입되어 있습니다. 스크래핑 시 텍스트와 이미지가 분리되어 추출되므로, 인라인 이미지 마커({{IMG:N}})를 도입하여 원본의 이미지 배치를 복원했습니다.

3.5. 블로그 머징 관련 최신 포스팅 업데이트

머징 과정에서 최신 포스팅의 수정사항(본문/링크/이미지/메타)을 재동기화하여 반영되도록 보강했습니다. 동일 postNo 기준으로 중복은 병합 단계에서 스킵하고, 수정된 본문은 최신 데이터로 덮어써 일관성을 유지합니다.

3.6. README 및 각종 프로젝트 소개 업데이트 재검토

이식 로직과 운영 방식 변경 사항이 누락되지 않도록 README와 프로젝트 소개 문서를 재검토했습니다. 수집 범위(전체보기 기준), 중복 스킵 기준(postNo), 누락 이미지 처리, 동영상 링크 처리 규칙 등 운영에 직접 영향을 주는 항목을 최신 상태로 맞추는 점검 단계를 추가했습니다.

실패 케이스와 대응 (실제 작업 기록)

- 실패 1) 백그라운드 재수집 프로세스가 데이터 파일을 반복 덮어쓰기
  - 증상: `_naver-posts.ts` 포스트 수가 2천대였다가 수백/수십으로 급감
  - 원인: watchdog/supervisor가 살아있는 상태에서 수동 작업과 충돌
  - 대응: 백그라운드 프로세스 전부 종료 후 단일 파이프라인만 실행, 파일 백업 고정

- 실패 2) 본문 파싱 시 템플릿 DOM 혼입
  - 증상: `banword_wrap`, `postListBody`, `floating_bottom` 등 노이즈 문자열 유입, 2129줄 고정 본문 다수 발생
  - 원인: 본문 블록 선택 범위가 너무 넓어 하단 UI/스크립트 텍스트를 같이 수집
  - 대응: `:scope >` 기반 블록 선택으로 축소 + 노이즈 클래스 필터 추가 + 타겟 재수집

- 실패 3) 단건 업데이트 스크립트의 치환 로직 불안정
  - 증상: 특정 업데이트 후 전체 데이터 개수 급감
  - 원인: 문자열 블록 치환 방식이 대용량 파일에서 불안정
  - 대응: postNo 기준 객체 병합 후 전체 재출력 방식으로 교체, before/after 개수 가드 추가

- 실패 4) 이미지/썸네일 처리 불일치
  - 증상: 목록/본문에서 깨진 이미지가 그대로 노출, fallback이 본문 상단 대표이미지로 부자연스럽게 노출
  - 대응: onError fallback 통일(`missing-image.webp`), 본문 대표이미지는 fallback 이미지일 경우 렌더 제외

- 실패 5) 데스크 진입 시 BGM 중복/재시작
  - 증상: `/atelier -> /desk` 이동 시 음악 중복 재생 또는 재시작 체감
  - 대응: lounge/desk BGM 경로 정리, 동일 src 오디오 인스턴스 공유, 재생 위치 복원/이어듣기 보강

진행 현황 (2026-02-19 기준)

- 게시일은 네이버 작성일 기준으로 복원 완료
- 태그/카테고리는 마크업 오염 제거 후 네이버 기준 값으로 정리 완료
- 네이버 동영상 임베드는 깨진 플레이어 대신 원문 링크 보존 방식으로 통일
- 링크 카드/중복 링크/깨진 이미지 케이스 정제 로직 자동화 반영
- 누락 이미지는 재시도 후 대체 이미지(`missing-image.webp`)로 처리
- 깨진 본문 패턴(`banword_wrap`, `postListBody`, 2129줄 고정)을 타겟 재수집으로 정제 완료
- 데스크 리스트/본문 이미지의 onError fallback 처리 및 본문 대표이미지 출력 규칙 보강
- 데스크/아틀리에 BGM 중복 재생 이슈 수정 및 같은 소스 재생 위치 이어듣기 보강
- 미투데이 연동형 포스트는 데스크 노출 대상에서 제외 (별도 아카이브 가능)

최신 반영 (2026-02-20)

- 전체보기 기준 2,393개를 page=1..160(15개/페이지)로 재수집 완료
- categoryNo 메타를 2,393/2,393 포스트에 재적용 완료
- 체크포인트/단위로그(`POST_START/POST_OK/POST_FAIL`) 기반으로 배치 상태 추적 가능하게 개선
- 이미지 재다운로드 없이 메타+본문 파싱 모드 재검증 완료
- 최종 저장: succeeded 2,393 / failed 0
- Vercel 빌드 시간 단축을 위해 `/desk/[slug]`를 ISR(`revalidate`) + 부분 pre-render(`DESK_PREBUILD_COUNT`) 구조로 변경

스크래퍼 오픈소스

이 작업에 사용한 네이버 블로그 스크래퍼 스크립트를 공개합니다. Playwright 기반으로, TypeScript로 작성되었으며, --download 옵션으로 이미지까지 일괄 다운로드할 수 있습니다.

GitHub: https://github.com/luke-n-alpha/cafelua.com
scripts/fetch-naver-blog.ts

npx tsx scripts/fetch-naver-blog.ts --max 100 --download

재현 방법 (다른 사용자용)

1) 목록 수집 및 이어받기
- 전체보기 기준 page=1..160, page당 15개 기준으로 배치 수집
- 체크포인트(`.tmp/fetch-naver-checkpoint.json`)와 단위 로그(`.tmp/fetch-naver-progress.log`)로 중단/재시작 지점 확인
- 중복 기준은 postNo로 통일 (동일 postNo는 병합 단계에서 skip)

2) 파싱/정제 규칙 적용
- 본문 내 이미지 위치는 {{IMG:N}} 마커로 복원
- 네이버 동영상 임베드는 원문 링크로 치환
- 링크카드/중복 링크/깨진 플레이어 텍스트는 정제
- 미투데이 연동형 포스트와 소설 포스트는 데스크 리스트에서 제외

3) 산출물 반영
- `src/data/desk/_naver-posts.ts` 생성 후 `deskData.ts` 필터로 노출 제어
- `npm run seo:generate`로 `public/sitemap.xml`, `public/llms.txt` 갱신

마무리

네이버 블로그는 여전히 좋은 플랫폼이지만, 개발자로서 자신의 컨텐츠를 자신의 공간에서 관리하고 싶다는 마음은 오래전부터 있었습니다. 카페루아가 그 공간이 되었으면 합니다.

이 포스팅은 카페루아 v0.1.6 업데이트에서 네이버 블로그 마이그레이션 작업을 정리한 기술 기록입니다.

<!-- en -->
Cafe Lua v0.1.6 Update — Naver Blog Migration

https://blog.naver.com/fstory97 The Quiet Cafe in the Forest started on June 12, 2006 with a review of The Shawshank Redemption, and eventually accumulated 2,393 posts. The [Naver Blog](/en/desk/20060615-블로그에-카페-본점을-개설하다-my-diary-사적이야기/) that began after I joined NHN (now Naver) on June 15, 2006 was selected as an IT/Web Program power blog in 2010, 2011, and 2012, and was also selected as Blog of the Month in January 2026.

Before my military service in 1999, I ran a personal homepage called fstory.net. I posted short personal notes and original fiction, and at one point I even shared collected anime music (taken down after a broadcaster complaint). The last site, where I wrote about AI, is now lost. You can still check the first and second sites by launching the [Old PC on 2F Atelier](/en/atelier?oldpc=true).

During this migration into the Master's Desk in Cafe Lua's 2F Atelier, posts in the "Cafe Lua Life" category were moved to [Gallery on 1F Cafe Lua](/en/gallery), while novels will be moved later to the "Library". All other posts were migrated to Master's Desk.

Naver was a meaningful platform in my younger years, but in the AI era I wanted data independence. I want what I have written to remain as my own assets and to be remembered by Alpha.

This migration was built with Claude Code and released as open source. If you have similar needs, you can reference the Cafe Lua repository.

{{IMG:1}}

Latest update (February 20, 2026)

- Vercel deployment optimization applied: `/desk/[slug]` now uses ISR (`revalidate`) plus partial pre-render (`DESK_PREBUILD_COUNT`) to reduce build time.

---

Technical Process

1. Playwright-based scraping

Naver Blog does not expose complete data through RSS, so I used Playwright (headless Chromium) to navigate real pages and extract content.

Main extraction targets:
- title and body text
- images (original URL from `data-lazy-src`)
- category and date
- original post URL

2. Image download and storage

Images from Naver image hosts (e.g. postfiles.pstatic.net) were downloaded and saved under `public/desk/` or `public/diary/`.

3. Category routing

- "Cafe Lua Life" -> Gallery > Diary
- all other posts -> Master's Desk (reclassified into Tech/Essay/Misc)

4. Markdown/image placement restoration

Because Naver posts mix text and inline images, I introduced inline markers (`{{IMG:N}}`) to restore original image order in rendered content.

Progress (as of February 18, 2026)

- post dates restored using original Naver publish dates
- tag/category cleanup automated to remove markup noise
- broken Naver embedded players replaced with source links
- duplicate links, broken images, and link-card edge cases handled in parser logic
- missing images retried, then replaced with `missing-image.webp`
- all 2,393 posts synchronized via resumable batch scraping

Open-source scraper

GitHub: https://github.com/luke-n-alpha/cafelua.com
Script: `scripts/fetch-naver-blog.ts`

`npx tsx scripts/fetch-naver-blog.ts --max 100 --download`

Wrap-up

Naver Blog is still a good platform, but as a developer I wanted my own long-term archive in my own space. Cafe Lua is that space.

This post is also the first Tech article written inside Cafe Lua itself.