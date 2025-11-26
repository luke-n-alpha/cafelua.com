# Café Luα — Public Landing

공개용 레포: 인트로(랜딩) 화면과 필요한 에셋만 포함합니다. 본 사이트의 나머지 페이지, 데이터, 에셋은 `cafelua-private` 리포에 있습니다.

## 사용 방법
- 설치: `npm install`
- 개발 서버: `npm run dev`
- 빌드: `npm run build`
- 미리보기: `npm run preview`

## 배포 (GitHub Pages)
- 기본 브랜치: `main`
- 빌드 출력: `dist` (Vite, `base: '/cafelua.com/'`)
- 워크플로: `.github/workflows/deploy.yml` (push to `main` 또는 `workflow_dispatch`로 실행)

## 포함된 것
- `src/components/IntroPage.tsx` / `.css`: 시즌·날씨별 인트로 배경 및 로고 애니메이션
- `public/intro-background-img/*`: 인트로 배경 이미지 세트
- `src/assets/logo.png`: 인트로 로고

## 빠진 것 (프라이빗에만 존재)
- 소설/문서/캐릭터 데이터, 나머지 페이지(카페, 라이브러리, 랩 등) 컴포넌트, 기타 민감 자산
