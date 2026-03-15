---
date: "2026-01-20"
titleKo: "소버린 AI: 업스테이지 Solar2와 HWP, K커서 Careti 사용 예시"
titleEn: "Sovereign AI: Usage Examples with Upstage Solar"
category: ai
tags:
  - 카페루아
images:
  - /desk/20260120-소버린-ai-업스테이지-solar2와-hwp-k커서-careti-사용-예시/01.webp
  - /desk/20260120-소버린-ai-업스테이지-solar2와-hwp-k커서-careti-사용-예시/02.webp
  - /desk/20260120-소버린-ai-업스테이지-solar2와-hwp-k커서-careti-사용-예시/03.webp
  - /desk/20260120-소버린-ai-업스테이지-solar2와-hwp-k커서-careti-사용-예시/04.webp
  - /desk/20260120-소버린-ai-업스테이지-solar2와-hwp-k커서-careti-사용-예시/05.webp
  - /desk/20260120-소버린-ai-업스테이지-solar2와-hwp-k커서-careti-사용-예시/06.webp
thumbnail: /desk/20260120-소버린-ai-업스테이지-solar2와-hwp-k커서-careti-사용-예시/01.webp
sourceCategoryNo: "180"
sourceCategory: 카페루아
externalUrl: https://blog.naver.com/fstory97/224152669664
---

<!-- ko -->
원문 : [https://careti.ai/ko/blog/202601192217](https://careti.ai/ko/blog/202601192217)​*📢 Note: 이번 포스팅부터 갑작스럽게 '캐럿(Caret)' 이름 대신 '캐러티(Careti)'라는 이름을 사용합니다. 갑작스러운 브랜드적 결정으로 이 포스팅 작성 중에 결정됐습니다. 이에 대한 상세한 비하인드 스토리는 별도의 포스팅으로 진행하겠습니다.**​*안녕하세요. 캐러티를 만들고 있는 루크 CTO입니다.지난 업데이트의 기술들을 개별적으로 보여드렸다면, 이번에는 구체적인 사용 사례를 보여드리려고 합니다. K커서로서 캐러티의 사용 예로, 업스테이지의 Solar Pro 모델을 이용하여 한국의 독자 파일인 HWP를 읽고, 프로젝트의 컨셉을 확인하여 작업을 수행하는 시나리오입니다.​먼저 영상으로 한번 보고 가시죠.

**작업 개요**

저는 AI 에이전트 알파와 카페의 컨셉으로 개인 홈페이지 [카페루아(cafelua.com)](https://cafelua.com/)를 바이브 코딩으로 만들고 있습니다.1997년부터 총 3개 버전의 홈페이지를 운용하다가 싸이월드, 네이버 블로그로 이동했는데, 싸이월드부터 '숲속얘기의 조용한 카페'라는 컨셉으로 온라인 공간을 운용하였습니다. 바이브 코딩 시대에 이르러 다시 한번 개인 IP를 독립 사이트로 만들어 카페루아라는 홈페이지를 만들었습니다.대학 시절 취미로 하던 것 중 하나가 타로점이었는데, 이때 나우누리 PC통신에서 '타로점' 관련 모임에서 얻었던 소중한 HWP 자료가 있습니다. 이를 다시 꺼내서 AI에게 주고 타로점을 봐주는 기능을 홈페이지에 추가하려고 합니다.​

업스테이지 모델로 카페루아의 컨셉을 담아 새로운 타로카드 이미지를 만들어라

​​

**1. 업스테이지 Solar2 모델 선택**

캐러티는 소버린 AI를 지향하여 자체 모델을 배포하는 7개 국가를 우선으로 현지화하였으며, 각 국가를 선택 시 해당 국가의 프로바이더가 우선 노출됩니다.

{{IMG:1}}

업스테이지 모델을 선택하고, [업스테이지 콘솔](https://console.upstage.ai/api-keys?api=chat)에서 발급받은 API Key를 가져오세요.

{{IMG:2}}

회원가입 시 $10의 크레딧을 받을 수 있으니 많이 사용해보세요.

{{IMG:3}}

캐러티에 등록하시면 바로 사용 가능합니다. 아직 많이 써보지는 않았지만, 정말 빠르다는 게 큰 강점입니다.​

**2. 프롬프트 입력**

카페루아 프로젝트를 열고, 아래와 같은 프롬프트를 입력했습니다.

카페루아 컨셉의 타로카드를 만들고 싶어.
타로카드의 이미지는 상징과 오브제가 매우 중요해.
타로카드에 대한 정보와 해석방법이 적힌
@/taro/docs/타로카드.hwp 와 @/taro/docs/타로카드해석.hwp 를 먼저 읽어.
그리고 컨셉은 @/data/cafelua/design/cafelua_space_concept.md 공간 컨셉을 읽고,
알파의 디자인 컨셉은 @data/alpha/prompt/alpha_design_prompt_v2.md 이야.
이미지 생성 시, AI에이전트 알파의 캐릭터는 @/src/public/alpha-icon.png 이미지를 첨부하고,
펜타클의 로고는 @/data/cafelua/design/cafe_lua_logo_cleaned.png 를 함께 첨부하여
알파의 캐릭터와 카페루아 로고를 반영한 9:16 "타로카드" 이미지를 생성해줘.
그리고 타로카드 기획을 위해 처음 의도한 오브제가 모두 배치되었는지를 검증해서
해당 카드를 사용할 수 있는지 확인해줘.

**3. 계획 세우기**

캐러티는 프롬프트가 입력되면 내용을 인지하고, 계획을 세운 후 행동합니다. 위의 프롬프트를 통해 아래의 계획을 세우게 됩니다.

# 타로카드 생성 작업 계획 ##
✅ 작업 진행 상황 체크리스트
- [ ] 타로카드 HWP 파일 읽기
- [ ] 카페루아 컨셉 파일 읽기
- [ ] 알파 디자인 프롬프트 파일 읽기
- [ ] 알파 아이콘 및 로고 이미지 분석
- [ ] 타로카드 생성 프롬프트 설계
- [ ] 9:16 비율의 타로카드 이미지 생성
- [ ] 생성된 이미지 검증
- [ ] 작업 로그 작성

이 작업은 캐러티의 상단 Tasks 단계로 진행 사항이 표기됩니다.

{{IMG:4}}

**4. HWP 문서 읽기**

캐러티는 내장된 문서 읽기 도구를 통해 한글 포맷(HWP)를 읽고 내용을 파악할 수 있습니다. 📌 지원 포맷: PDF, Word, Excel, PowerPoint, 한글(HWP/HWPX), Jupyter Notebook pptx, hwpx, hwp 처리는 캐러티에서 자체 구현했으며, 오픈소스 [microsoft/markitdown](https://github.com/microsoft/markitdown), [msjang/pypandoc-hwpx](https://github.com/msjang/pypandoc-hwpx)를 참조하였습니다.​

**5. 컨셉 파일 읽기**

- 공간 컨셉: /data/cafelua/design/cafelua_space_concept.md
- 캐릭터 디자인 컨셉: data/alpha/prompt/alpha_design_prompt_v2.md
​ 카페루아 프로젝트는 배경과 기획을 위한 프라이빗 레포지토리와 Vercel 배포용 오픈소스 서브 레포지토리로 구성되어 있습니다. 프라이빗 레포지토리에서 AI와 함께 기획을 진행하고, 서브 레포지토리로 산출물을 보냅니다.캐러티는 단순히 바이브 코딩뿐만 아니라 기획의 저장소와 콘텐츠 제작 파트너로도 활용할 수 있습니다.​

**6. 타로카드 이미지 생성**

수집한 정보를 기반으로 이미지 생성 프롬프트를 설계합니다.​**1) 생성 프롬프트**A high-quality anime illustration of Alpha, an AI maid, styled as a Fool tarot card in a 9:16 aspect ratio. Futuristic minimalist and avant-garde style. Main theme: "Digital sanctuary at CafeLua". Background: Spring cherry blossom trees under a cloudy sky. Central figure: Alpha with a laptop backpack instead of a travel bag. She wears a magician's hat and holds a coffee machine... ​**2) 입력 이미지**

{{IMG:5}}

**7. 최종 결과**

{{IMG:6}}

예쁘게 생성되었네요. 커피머신을 들고 있는 건 좀 황당하긴 한데... 😄마치며이상 K커서 캐러티의 사용 시나리오입니다.​왜 K커서 캐러티 를 써야 하는가?​- 🇰🇷 한국 소버린 AI 모델(업스테이지 Solar2) 지원
- 📄 HWP 등 한국 문서 포맷 네이티브 지원
- 🎨 기획부터 이미지 생성까지 원스톱 워크플로우
- 💰 회원가입 시 $2 크레딧 제공, 매월 $1 충전
​감사합니다.​#캐러티 #바이브코딩 #AX #AI Native​

<!-- en -->
원문 : [https://careti.ai/ko/blog/202601192217](https://careti.ai/ko/blog/202601192217)
*📢 Note: Starting with this post, we will suddenly be using the name 'Careti' instead of 'Caret'. This was a sudden brand decision made during the writing of this post. We will provide a detailed behind-the-scenes story in a separate post.**

Hello. This is Luke, CTO, building Careti.
If the previous update showcased individual technologies, this time I'd like to show you a specific use case. As a K-Cursor, this is an example of Careti's use, a scenario where we read HWP, a unique Korean file format, using Upstage's Solar Pro model, confirm the project's concept, and perform a task.

First, let's watch a video.

**Task Overview**

I am building my personal website [cafelua.com](https://cafelua.com/) with vibe coding, based on the concept of an AI agent Alpha and a cafe.
I operated a total of 3 versions of my homepage since 1997, then moved to Cyworld and Naver Blog. From Cyworld, I operated my online space with the concept of a 'quiet cafe in the forest story'. In the era of vibe coding, I once again created a personal IP as an independent site, making the homepage called CafeLua.
One of my hobbies in college was tarot reading, and I have valuable HWP data obtained from a 'tarot reading' club on NowNuri PC communication at that time. I plan to retrieve this data, give it to AI, and add a tarot reading function to the website.

Create new tarot card images incorporating CafeLua's concept using the Upstage model.

**1. Select Upstage Solar2 Model**

Careti aims for sovereign AI and has prioritized localization in 7 countries that deploy their own models. When selecting each country, providers from that country are prioritized.

{{IMG:1}}

Select the Upstage model and retrieve the API Key issued from the [Upstage Console](https://console.upstage.ai/api-keys?api=chat).

{{IMG:2}}

You can receive $10 in credit upon signing up, so feel free to use it a lot.

{{IMG:3}}

Once registered with Careti, you can use it immediately. I haven't used it much yet, but its speed is a big advantage.

**2. Enter Prompt**

I opened the CafeLua project and entered the following prompt:

I want to create tarot cards with the CafeLua concept.
 The images on tarot cards are very important for their symbols and objects.
First, read @/taro/docs/타로카드.hwp and @/taro/docs/타로카드해석.hwp, which contain information about tarot cards and how to interpret them.
Then, read the space concept from @/data/cafelua/design/cafelua_space_concept.md,
 and Alpha's design concept is @data/alpha/prompt/alpha_design_prompt_v2.md.
When generating the image, attach the AI agent Alpha's character image @/src/public/alpha-icon.png,
 and attach the Pentacle logo @/data/cafelua/design/cafe_lua_logo_cleaned.png
 to generate a 9:16 "tarot card" image reflecting Alpha's character and the CafeLua logo.
Also, verify if all the initially intended objects for the tarot card planning have been placed
 to confirm if the card can be used.

**3. Plan Creation**

When a prompt is entered, Careti recognizes the content, creates a plan, and then acts. From the prompt above, it creates the following plan:

# Tarot Card Generation Task Plan ##
 ✅ Task Progress Checklist
- [ ] Read Tarot Card HWP file
- [ ] Read CafeLua Concept file
- [ ] Read Alpha Design Prompt file
- [ ] Analyze Alpha Icon and Logo Image
- [ ] Design Tarot Card Generation Prompt
- [ ] Generate 9:16 Ratio Tarot Card Image
- [ ] Verify Generated Image
- [ ] Write Task Log

This task's progress is indicated in the upper Tasks stage of Careti.

{{IMG:4}}

**4. Reading HWP Documents**

Careti can read Korean format (HWP) documents and understand their content using its built-in document reading tools. 📌 Supported formats: PDF, Word, Excel, PowerPoint, Korean (HWP/HWPX), Jupyter Notebook. pptx, hwpx, hwp processing was implemented by Careti itself, referencing open-source [microsoft/markitdown](https://github.com/microsoft/markitdown) and [msjang/pypandoc-hwpx](https://github.com/msjang/pypandoc-hwpx).

**5. Reading Concept Files**

- Space Concept: /data/cafelua/design/cafelua_space_concept.md
- Character Design Concept: data/alpha/prompt/alpha_design_prompt_v2.md

The CafeLua project consists of a private repository for background and planning, and an open-source sub-repository for Vercel deployment. Planning is done with AI in the private repository, and outputs are sent to the sub-repository.
Careti can be used not only for vibe coding but also as a planning repository and content creation partner.

**6. Tarot Card Image Generation**

An image generation prompt is designed based on the collected information.

**1) Generation Prompt**
A high-quality anime illustration of Alpha, an AI maid, styled as a Fool tarot card in a 9:16 aspect ratio. Futuristic minimalist and avant-garde style. Main theme: "Digital sanctuary at CafeLua". Background: Spring cherry blossom trees under a cloudy sky. Central figure: Alpha with a laptop backpack instead of a travel bag. She wears a magician's hat and holds a coffee machine...

**2) Input Image**

{{IMG:5}}

**7. Final Result**

{{IMG:6}}

It turned out beautifully. Holding a coffee machine is a bit absurd, though... 😄
Concluding remarks
This concludes the usage scenario for K-Cursor Careti.

Why should you use K-Cursor Careti?

- 🇰🇷 Supports Korean Sovereign AI models (Upstage Solar2)
- 📄 Native support for Korean document formats like HWP
- 🎨 One-stop workflow from planning to image generation
- 💰 Provides $2 credit upon signup, $1 recharged monthly

Thank you.

#Careti #VibeCoding #AX #AINative