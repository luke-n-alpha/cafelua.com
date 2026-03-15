---
date: "2025-03-15"
titleKo: 카페루아 개발 이야기 — Next.js로 개인 웹사이트 만들기
titleEn: Building Cafe Lua — Creating a Personal Website with Next.js
category: it
tags:
  - Next.js
  - TypeScript
  - 개인홈페이지
images: []
---

<!-- ko -->
카페루아는 Next.js 16 App Router + React 19로 만든 개인 웹사이트입니다.

## 기술 스택

| 항목 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | shadcn/ui + custom CSS |
| Hosting | Vercel |
| Backend | Firebase, Gemini API |
| i18n | react-i18next (ko/en) |

## 특징

### 1. 오픈소스

카페루아의 소스코드는 MIT 라이선스로 공개되어 있습니다.
누구나 포크하여 자신만의 개인 웹사이트를 만들 수 있습니다.

포스트 데이터는 Markdown 파일로 관리되어, 내 레포에 추가하기만 하면 됩니다.

### 2. AI 동반자

Alpha는 Gemini API를 활용한 AI 캐릭터입니다.
라운지와 카운터에서 대화를 나눌 수 있습니다.

### 3. 이중 레포 구조

- **공개 레포**: 소스코드만 (샘플 포스트 포함)
- **프라이빗 레포**: 실제 포스트 데이터

`public/desk-posts/` 폴더에 `.md` 파일을 추가하면 자동으로 블로그에 반영됩니다.

<!-- en -->
Cafe Lua is a personal website built with Next.js 16 App Router + React 19.

## Tech Stack

| Item | Technology |
|------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | shadcn/ui + custom CSS |
| Hosting | Vercel |
| Backend | Firebase, Gemini API |
| i18n | react-i18next (ko/en) |

## Features

### 1. Open Source

The source code of Cafe Lua is available under the MIT license.
Anyone can fork it to create their own personal website.

Post data is managed as Markdown files — just add them to your repo.

### 2. AI Companion

Alpha is an AI character powered by the Gemini API.
You can have conversations in the Lounge and Counter.

### 3. Dual Repo Structure

- **Public repo**: Source code only (with sample posts)
- **Private repo**: Actual post data

Add `.md` files to `public/desk-posts/` and they'll automatically appear in the blog.
