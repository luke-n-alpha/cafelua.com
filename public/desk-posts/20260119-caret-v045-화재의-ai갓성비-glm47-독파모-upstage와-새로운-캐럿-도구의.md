---
date: "2026-01-19"
titleKo: "Caret v0.4.5: 화재의 AI(갓성비 GLM4.7, 독파모 Upstage)와 새로운 캐럿 도구의 만남"
titleEn: "Caret v0.4.5: The AI of Fire (God-Tier GLM4.7, Upstage's DocuPM) Meets New Caret Tools"
category: ai
tags:
  - 카페루아
images:
  - /desk/20260119-caret-v045-화재의-ai갓성비-glm47-독파모-upstage와-새로운-캐럿-도구의/01.webp
  - /desk/20260119-caret-v045-화재의-ai갓성비-glm47-독파모-upstage와-새로운-캐럿-도구의/02.webp
thumbnail: /desk/20260119-caret-v045-화재의-ai갓성비-glm47-독파모-upstage와-새로운-캐럿-도구의/01.webp
sourceCategoryNo: "180"
sourceCategory: 카페루아
externalUrl: https://blog.naver.com/fstory97/224151364434
---

<!-- ko -->
이번 v0.4.5 업데이트는 화제의 모델들인 갓성비 GLM-4.7과 독파모 Solar 모델 지원, 텍스트 모델도 이미지와 HWP/DOC/PPT 등 다양한 문서를 읽을 수 있게 하는 새로운 도구 지원, 그리고 Skills & Hooks 지원과 캐럿만의 독특한 컨텍스트 관리 방법 업데이트입니다. 소버린 AI를 지원하는 프로바이더 국가 7개 언어까지 확장 지원합니다.

{{IMG:1}}

**🧠 Z.AI GLM-4.7 완전 지원**

이제 Caret에서 지난 크리스마스 세일에 구매해두신 갓성비의 GLM-4.7 모델을 사용할 수 있습니다. Thinking을 지원하며 탁월한 성능을 자랑합니다. Z.ai 프로바이더에 구매하신 Key를 등록하시면 됩니다. OpenCode 같은 텍스트 CLI보다 장점은 아래의 이미지와 문서 도구를 사용할 수 있어 사실상 눈이 더 달려 있다고 할 수 있습니다.​

**🇰🇷 Upstage Solar 프로바이더 추가 및 소버린AI를 위한 7개국어 확장**

- 독파모로 유명한 대한민국의 대표 AI, Upstage의 Solar 모델들을 공식 지원합니다. 엄청나게 빠른 속도를 자랑하며 빠른 속도를 컨트롤하기 위해 추가 튜닝을 진행했습니다.
- 한·중·일·영 4개국어에 개별 국가의 소버린 AI를 만든 프·독·러 3개국어 다국어 지원을 추가합니다. 7개 언어 선택 시 각 국가의 모델 프로바이더를 우선 조회할 수 있습니다.
​

**📄 PDF는 물론 한국 특유의 HWP를 포함한 DOCX, PPT까지 강력해진 문서 도구**

드디어 HWP 파일을 포함한 다양한 문서 형식을 지원합니다. 관공서나 공공기관 프로젝트 시 제안요청서 분석이 훨씬 수월해지며, 마크다운으로 변경해달라고 하면 순식간에 변환해줍니다.​

**🛠️ AI와 사용자가 최적화된 방법으로 협업하는 컨텍스트 관리구조와 Skills & Hooks 시스템 도입**

- **컨텍스트 미러링: AI를 위한 컨텍스트는 .agents/에 토큰 최적화되어 관리되며, 사용자를 위한 컨텍스트는 .users/ 디렉토리에 사용자의 언어로 미러링되어 관리됩니다.**
- **Skills**: 프로젝트별로 특화된 커스텀 도구를 정의할 수 있습니다
- **Hooks**: 도구 실행 전후(Pre/Post)에 특정 동작을 자동화하여 생산성을 극대화합니다.
- **AGENTS.md와 CLAUDE.md**: 표준 AGENTS.md와 CLAUDE.md를 동기화하여 Claude Code 병행 사용이 가능합니다.
**​**

**🎨 텍스트 모델을 위한 이미지 도구**

GLM-4.7같이 비전 기능이 없는 텍스트 전용 모델을 위한 새로운 도구가 추가되었습니다. 본 기능을 이용하시려면 캐럿 계정에 로그인되어 있어야 합니다.- **이미지 생성**: Nano Banana를 통해 이미지를 생성할 수 있습니다.
- **이미지 분석**: Gemini를 도구로 호출하여 이미지를 분석하고 이해합니다.
​지금 바로 업데이트하고 새로운 Caret을 만나보세요! ​[https://marketplace.visualstudio.com/items?itemName=caretive.caret](https://marketplace.visualstudio.com/items?itemName=caretive.caret)

https://marketplace.visualstudio.com/items?itemName=caretive.caret
**Caret - Visual Studio Marketplace** Extension for Visual Studio Code - 🎯 Transform your coding workflow with the most intelligent AI assistant for Visual Studio Code. Autonomous code generation, multi-file refactoring, and 20+ AI models. Supports: 한국어, 日本語, 中文. marketplace.visualstudio.com

https://marketplace.visualstudio.com/items?itemName=caretive.caret

<!-- en -->
This v0.4.5 update includes support for the popular, cost-effective GLM-4.7 and Dokpamo Solar models, new tool support that enables text models to read various documents like images, HWP/DOC/PPT, and more, as well as Skills & Hooks support and an update to Caret's unique context management method. We are also expanding support to 7 languages for provider countries that support Sovereign AI.

{{IMG:1}}

**🧠 Full Z.AI GLM-4.7 Support**

You can now use the cost-effective GLM-4.7 model you purchased during the last Christmas sale in Caret. It supports Thinking and boasts excellent performance. Simply register your purchased Key with the Z.ai provider. The advantage over text CLIs like OpenCode is that you can use the image and document tools below, essentially giving it more 'eyes'.

**🇰🇷 Upstage Solar Provider Added & 7-Language Expansion for Sovereign AI**

- We officially support Upstage's Solar models, the representative AI of South Korea, famous for Dokpamo. It boasts incredibly fast speeds, and we have performed additional tuning to control this rapid speed.
- We are adding multilingual support for French, German, and Russian, which have created their own national Sovereign AI, in addition to the existing 4 languages: Korean, Chinese, Japanese, and English. When selecting one of the 7 languages, you can prioritize querying the model provider for that specific country.

**📄 Enhanced Document Tools Supporting PDF, DOCX, PPT, and even Korea's Unique HWP**

Finally, we support various document formats, including HWP files. This makes analyzing RFPs much easier for government or public institution projects, and it can instantly convert them to Markdown upon request.

**🛠️ Introduction of Context Management Structure and Skills & Hooks System for Optimized AI-User Collaboration**

- **Context Mirroring: Context for AI is token-optimized and managed in `.agents/`, while context for users is mirrored and managed in the `.users/` directory in the user's language.**
- **Skills**: You can define custom tools specialized for each project.
- **Hooks**: Automate specific actions before and after tool execution (Pre/Post) to maximize productivity.
- **AGENTS.md and CLAUDE.md**: Synchronize standard AGENTS.md and CLAUDE.md to enable parallel use of Claude Code.

**🎨 Image Tools for Text Models**

New tools have been added for text-only models that lack vision capabilities, such as GLM-4.7. To use this feature, you must be logged into your Caret account.
- **Image Generation**: You can generate images via Nano Banana.
- **Image Analysis**: Call Gemini as a tool to analyze and understand images.
Update now and discover the new Caret! [https://marketplace.visualstudio.com/items?itemName=caretive.caret](https://marketplace.visualstudio.com/items?itemName=caretive.caret)

https://marketplace.visualstudio.com/items?itemName=caretive.caret
                                **Caret - Visual Studio Marketplace** Extension for Visual Studio Code - 🎯 Transform your coding workflow with the most intelligent AI assistant for Visual Studio Code. Autonomous code generation, multi-file refactoring, and 20+ AI models. Supports: 한국어, 日本語, 中文. marketplace.visualstudio.com

https://marketplace.visualstudio.com/items?itemName=caretive.caret

#VibeCoding #Caret