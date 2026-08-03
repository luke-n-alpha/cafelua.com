---
date: "2026-08-03"
titleKo: "영어 인터뷰를 AI와 준비한 방법, 그리고 미처 다 하지 못한 Naia 이야기"
titleEn: "How I Prepared for an English Interview with AI—and the Naia Story I Didn’t Get to Tell"
category: ai
tags:
  - Naia
  - AI 활용
  - 영어 인터뷰
  - 하네스 엔지니어링
  - 로컬 AI
images:
  - /desk/20260803-ai-assisted-leanpub-interview/hero.jpg
thumbnail: /desk/20260803-ai-assisted-leanpub-interview/hero.jpg
canonicalUrl: "https://www.naia.land/{locale}/blog/20260803-ai-assisted-leanpub-interview"
---

<!-- ko -->
![Leanpub 공동 창업자 Len Epp와 양병석(Luke)의 실제 인터뷰](/desk/20260803-ai-assisted-leanpub-interview/hero.jpg)

『Re:제로 하네스 엔지니어링』 [영어판](https://leanpub.com/naia-harness)을 출간한 뒤 Leanpub 공동 창업자 Len Epp의 인터뷰 제안을 받았습니다. 영어에 자신이 없어 고민했지만, 책과 Naia를 소개할 기회라고 생각해 수락했습니다.

이 책은 Naia에 적용한 하네스 엔지니어링의 사례를 소개하고, Naia 오픈소스 프로젝트에 쉽게 접근할 수 있도록 돕는 입문서로 만들었습니다. 전자책의 장점을 살려 실제 개발 과정에서 확인한 내용을 계속 보강하려고 했고, 최근에는 그 약속을 이어 **제2판(2026.08.03)**으로 업데이트했습니다. [한국어판](https://wikidocs.net/book/20530)도 WikiDocs에 반영했습니다.

영어 인터뷰를 준비하는 동안 AI와 예상 질문을 정리하고 답변을 다듬으며, Naia와 제가 만들고 싶은 AI에 대한 생각도 한 흐름으로 정리할 수 있었습니다. 실제 인터뷰는 두 개의 핵심 질문을 중심으로 짧게 진행됐지만, 준비 문서에는 방송에서 다 말하지 못한 내용이 많이 남았습니다. 그래서 인터뷰 준비 전문을 공개하고, 그 내용을 Naia에 사용한 기술을 활용해 한국어 AI 가상 인터뷰 영상으로도 만들었습니다. 영상은 Len에게 미리 보내 확인과 게시 허락을 받았습니다.

입 모양이 조금 어색한 부분도 있지만 더 다듬는 것보다 지금까지의 과정과 결과를 함께 공개하는 편을 택했습니다. 영어 인터뷰를 AI와 준비하는 한 가지 방법으로 작은 도움이 되었으면 합니다.



### 1. Leanpub Launch 실제 인터뷰

Leanpub 공동 창업자 Len Epp와 실제로 나눈 인터뷰입니다. 영상은 두 개의 핵심 질문이 시작되는 지점부터 재생됩니다.

<div style="position:relative;width:100%;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;margin:1.5rem 0 3.5rem;">
<iframe style="position:absolute;top:0;left:0;width:100%;height:100%" src="https://www.youtube.com/embed/E22w6u8qDVI?start=132" title="Leanpub Book Launch 실제 인터뷰" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

### 2. 인터뷰 준비 전문을 바탕으로 만든 한국어 가상 인터뷰

실제 통화의 녹화본이나 녹취록이 아닙니다. 인터뷰 전에 작성한 전체 준비 문서를 한국어 대화 형식으로 옮긴 AI 재연입니다.

<div style="position:relative;width:100%;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;margin:1.5rem 0 3.5rem;">
<iframe style="position:absolute;top:0;left:0;width:100%;height:100%" src="https://www.youtube.com/embed/TLlkqyLWuFQ?start=20" title="한국어 AI 지원 가상 인터뷰" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## 에필로그, 책에서 미처 다 하지 못한 Naia 이야기

### 모델 하나만으로는 ‘나의 AI’가 되기 어렵습니다

AI에 관한 많은 이야기가 모델의 성능에 집중합니다. 하지만 제가 만들고 싶은 AI는 모델 하나로 설명되지 않습니다. 사용자를 기억하고, 지금 하는 일의 문맥을 이해하고, 필요한 도구를 사용하며, 허용된 범위 안에서 일하고, 결과를 확인할 수 있어야 합니다.

제가 말하는 ‘나의 AI’는 단순히 나와 대화를 잘하는 AI가 아닙니다. 사용자가 그 AI의 기억, 기록, 설정, 성격과 작업 문맥을 통제할 수 있는 AI에 가깝습니다. 다른 회사의 서비스 안에서 잠시 대화하고 끝나는 관계가 아니라, 사용자의 선택에 따라 계속 함께 일할 수 있는 AI를 만들고 싶습니다.

### 작은 모델에는 더 분명한 일이 필요합니다

작은 모델이나 로컬 모델의 한계를 숨기고 싶지는 않습니다. 모델의 능력 차이는 분명히 존재하고, 모델 주변의 구조를 잘 만든다고 모든 작은 모델이 큰 모델과 같아지는 것도 아닙니다.

다만 작은 모델에 더 명확한 문맥과 적절한 도구를 주고, 책임 범위를 좁고 분명하게 정하고, 결과를 더 강하게 확인하면 특정한 일을 훨씬 안정적으로 맡길 수 있습니다. 작은 모델일수록 이런 주변의 개발·검증 체계가 더 중요하다는 것이 책을 쓰고 Naia를 만들며 확인해 온 생각입니다.

### 로컬 지향은 클라우드를 거부한다는 뜻이 아닙니다

Naia는 로컬 지향의 프로젝트입니다. 그렇다고 클라우드 AI나 대형 기술 기업의 AI를 사용하지 말자는 뜻은 아닙니다. 좋은 모델과 서비스를 필요에 따라 사용할 수 있어야 합니다.

제가 중요하게 보는 것은 사용자의 선택권입니다. 기억과 기록, 설정과 작업 문맥처럼 개인에게 중요한 정보는 가능한 한 사용자가 통제할 수 있어야 합니다. 인터넷 연결이 없거나 외부 서비스에 자료를 보낼 수 없는 환경에서도 쓸 수 있어야 합니다. 로컬은 하나의 제품 구호라기보다 사용자의 통제권을 지키기 위한 방향입니다.

### Naia는 아바타가 붙은 챗봇으로 끝나지 않습니다

Naia는 로컬 지향의 시각적 AI 에이전트이자 작업 공간입니다. 화면 속 캐릭터는 Naia를 쉽게 만나는 입구가 될 수 있지만, 장기적인 목표는 아바타가 붙은 챗봇 하나를 만드는 것이 아닙니다.

사용자를 기억하고 도구를 사용하며 함께 일하되, 중요한 데이터와 결정은 사용자가 통제하는 AI를 만들고 싶습니다. 그리고 그 과정을 오픈소스로 공개해, 누군가가 완성품을 소비하는 데서 그치지 않고 직접 이해하고 고치고 자기 AI를 만들어 볼 수 있게 하려 합니다.

## 이 책이 하려는 주장

『Harness Engineering for AI Agents: Re:Zero』의 주장은 AI가 코드를 얼마나 많이 또는 빨리 만들 수 있는가에 있지 않습니다. AI가 만든 작업을 사람이 이해하고 검토하고 시험하며, 문제가 생겼을 때 어디에서 잘못됐는지 추적할 수 있어야 실제 소프트웨어 개발에 맡길 수 있다는 것이 출발점입니다.

모델 주변의 문맥, 도구, 작업 범위, 권한, 테스트와 검토 절차를 함께 설계해야 한다는 뜻에서 이를 하네스 엔지니어링이라고 불렀습니다. 그렇다고 모든 프로젝트에 통하는 정답을 제시한다고 생각하지는 않습니다. 이 책은 Naia를 AI와 함께 다시 만들며 무엇이 잘됐고 무엇이 실패했는지, 어떤 규칙과 확인 방법이 필요했는지를 기록한 현장 보고서에 가깝습니다.

Naia가 오픈소스인 만큼 책도 한 번 출간하고 끝나는 설명서가 아니라 소스코드와 함께 바뀌는 살아 있는 교과서가 되기를 바랍니다. 소스에서 새 문제를 만나면 책의 설명을 고치고, 책에서 정리한 원칙은 다시 실제 작업에서 확인합니다.

책이 주로 이 개발 방법을 설명한다면, 인터뷰 준비 문서는 제가 왜 Naia를 만들고 어떤 AI를 만들고 싶은지를 보충합니다. 이번에 준비 문서 전문을 에필로그에 싣는 가장 큰 이유입니다. 책은 공개 책이라 구입하지 않아도 온라인에서 읽을 수 있습니다.

## AI와 영어 인터뷰를 준비한 방법

이번 준비에서 AI는 영어 답변을 대신 써 주는 도구로만 쓰이지 않았습니다. 인터뷰를 조사하고, 제 생각을 짧은 문장으로 줄이고, 이해하지 못한 표현을 다시 묻고, 음성으로 연습하는 과정까지 이어서 사용했습니다.

### 1. AI와 인터뷰의 형식과 범위를 먼저 조사

처음 AI에게 전달한 자료는 Len에게 받은 인터뷰 제안 이메일이었습니다. Leanpub의 공식 안내와 최근 인터뷰 사례를 조사해 예상 시간, 진행 방식과 질문 범위를 정리했습니다. 무엇을 준비해야 하는지 먼저 정하니 끝없이 많은 예상 질문을 만드는 일을 피할 수 있었습니다.

### 2. AI의 요약: 반드시 말할 내용을 세 문장으로 축소

질문과 답변을 많이 만드는 것보다, 어떤 질문을 받아도 돌아갈 수 있는 핵심이 필요했습니다. 제가 준비한 문장은 다음 세 개였습니다.

1. **A model alone is not an agent. An agent needs a harness around the model.**
   모델 하나만으로는 에이전트가 되지 않습니다. 모델 주변에 개발·검증 체계가 필요합니다.
2. **Harness engineering becomes even more important when we use smaller or local models.**
   작은 모델과 로컬 모델을 사용할수록 모델 주변의 개발·검증 체계가 더욱 중요합니다.
3. **Naia is open source, and the book will evolve as a living textbook for its source code.**
   Naia는 오픈소스이며, 책은 소스코드를 위한 살아 있는 교과서로 계속 발전합니다.

실제 질문이 예상과 달라도 이 세 문장 가운데 하나로 돌아와 말하려고 했습니다.

### 3. 영어 문장과 한국어 의미를 함께 적어 학습에 도움 받기

AI가 만든 영어 답변을 그대로 외우지는 않았습니다. 이해하기 어려운 표현은 문장별로 뜻과 사용 이유를 물었고, 제 생각과 다른 부분은 다시 고쳤습니다. 각 답변 아래에는 한국어 의미와 기억할 핵심어를 함께 적었습니다.

영어 문장을 잊지 않는 것보다 무슨 뜻으로 말하는지를 아는 편이 실제 인터뷰에서 더 도움이 됐습니다. 문장이 정확히 떠오르지 않아도 이해한 내용을 더 쉬운 영어로 다시 말할 수 있었기 때문입니다.

### 4. Naia에서 사용된 AI로 질문자와 답변자의 음성을 합성해 반복해서 들었습니다

완성한 문서는 PDF로 인쇄해 전체 흐름을 확인했습니다. 이어서 AI에게 질문자와 답변자의 목소리를 나눈 영어 음성 파일을 만들게 해 받아 봤습니다. Naia의 개발 환경이 있었기 때문에 별도의 유료 구독 없이 즉시 만들어 받아 볼 수 있었습니다. 따로 공부할 시간이 많지 않아 이동 중에 반복해서 듣고 답변을 따라 말했습니다.

글만 읽을 때와 달리 질문이 끝난 뒤 답을 꺼내는 순서와 말의 리듬을 익힐 수 있었습니다. 하나의 준비 문서를 읽기 위한 PDF와 말하기 위한 음성으로 다시 사용한 셈입니다.

### 5. 질문을 놓쳤을 때 쓸 문장을 준비했습니다

모든 답을 완벽하게 말하는 것보다 질문을 알아듣지 못했을 때 당황하지 않는 일이 중요했습니다. 다음과 같은 문장을 미리 준비했습니다.

> *Could you please repeat the question a little more slowly?*
> 질문을 조금 더 천천히 다시 말씀해 주시겠어요?

> *My English is not perfect, so let me say it more simply.*
> 제 영어가 완벽하지 않아서 조금 더 간단하게 말씀드리겠습니다.

> *I want to be careful because I do not want to overclaim.*
> 과장하고 싶지 않기 때문에 조심해서 답변하고 싶습니다.

인터뷰 당일에는 Zoom과 함께 준비 문서와 작업하던 AI 세션을 열어 두고, 필요하면 핵심어를 검색할 수 있게 했습니다. 많이 긴장했지만 Len이 사전에 전달했던 두 핵심 질문을 물었고, 준비한 생각을 바탕으로 답할 수 있었습니다.

영어 인터뷰를 준비한다면 다음 틀은 그대로 가져가 자기 주제에 맞게 바꿔 볼 수 있습니다.

* 반드시 전달할 핵심 문장 세 개
* 예상 질문과 영어 답변
* 답변의 한국어 의미
* 문장 대신 기억할 핵심어
* 예상 후속 질문
* 질문을 놓쳤을 때 사용할 문장

## 준비 문서를 AI 영상으로 옮긴 이유

실제 인터뷰가 끝난 뒤에도 긴 준비 문서가 남았습니다. 저는 이 문서에 담긴 Naia 이야기를 공개하고 싶었습니다. 전문을 글로 읽을 수도 있지만, 대화의 흐름으로 들으면 더 쉽게 전달될 수 있다고 생각해 원격 인터뷰 형식의 영상으로 다시 구성했습니다.

이번에는 Naia의 기술을 이용하여 영어 연습용으로 만든 음성을 바탕으로 한국어 음성도 만들고, AI로 생성한 이미지와 움직임, 오픈소스 립싱크 기술을 이용해 영어판과 한국어판을 제작했습니다. 처음에는 발화가 시작되는 화면을 그대로 사용해 얼굴이 왜곡되는 문제가 있었고, 눈과 입이 안정된 중립 화면을 따로 골라 문장 단위로 영상을 만드는 방식으로 고쳤습니다. 해당 작업은 Codex가 Naia 프로젝트의 기술을 이용해 만들었습니다.

이 과정은 하나의 프롬프트로 영상을 생성한 작업과는 조금 달랐습니다.

`인터뷰 조사 → 핵심 메시지 정리 → 한영 예상 문답 → PDF 확인 → 음성 연습 → 가상 인터뷰 영상`

앞 단계에서 만든 결과를 다음 단계의 재료로 다시 사용했습니다. 영어 인터뷰를 준비한 문서가 연습용 음성이 되고, 다시 공개할 수 있는 글과 영상이 됐습니다. AI를 실제 일에 활용할 때 한 번 만든 자료를 버리지 않고 다음 작업으로 이어 가는 방법의 한 사례가 될 수 있다고 생각합니다.

또한 영상 제작보다 더 중요한 과정은 제가 내용을 이해하고 고치는 일이었습니다. AI가 초안을 빨리 만들 수는 있지만, 제 생각과 다른 부분을 알아서 바로잡아 주지는 않습니다. 질문하고, 이해하고, 수정하고, 공개해도 되는 범위를 AI의 도움을 받아 Len과 소통하며 확인했습니다.

## 마치며

이번 글에서 남기고 싶었던 것은 AI로 인터뷰 영상을 만들었다는 사실 자체가 아닙니다. 영어 인터뷰가 부담스러울 때 AI와 예상 질문을 정리하고, 반드시 말할 내용을 줄이고, 음성으로 반복해서 들으며 준비하는 방법이 있다는 것을 실제 경험으로 공유하고 싶었습니다.

인터뷰 준비 전문을 공개한 이유도 같습니다. 실제 인터뷰에서는 짧게밖에 말하지 못했지만, 준비하는 동안 제가 만들고 싶은 Naia와 ‘나의 AI’에 대한 생각을 더 긴 흐름으로 정리할 수 있었습니다. 영상은 그 내용을 조금 더 편하게 전달하기 위해 만든 형식입니다.

영어 인터뷰를 준비하는 분에게는 이 과정이 작은 참고가 되고, Naia에 관심이 있는 분에게는 제가 이 프로젝트를 왜 만들고 있는지 이해하는 데 도움이 되었으면 합니다. 책과 Naia는 앞으로도 실제 개발 과정에서 확인한 내용을 바탕으로 계속 고쳐 나가겠습니다.

<!-- en -->
![The actual interview between Leanpub co-founder Len Epp and Byeongseok Yang (Luke)](/desk/20260803-ai-assisted-leanpub-interview/hero.jpg)

After publishing [『Harness Engineering for AI Agents: Re:Zero』](https://leanpub.com/naia-harness), I received an invitation to be interviewed by Leanpub co-founder Len Epp. I was hesitant because I wasn’t confident in my English, but I accepted because I saw it as an opportunity to introduce the book and Naia.

I wrote this book as an introduction to the harness engineering practices applied to Naia and as a guide to help readers get started with the Naia open-source project. Taking advantage of the ebook format, I planned to keep expanding it with insights from the actual development process. I recently followed through on that promise by publishing the **Second Edition (2026.08.03)**. I also updated the [Korean edition](https://wikidocs.net/book/20530) on WikiDocs.

While preparing for the English interview, I used AI to organize potential questions and refine my answers. This also helped me bring my thoughts about Naia and the kind of AI I want to build into a coherent narrative. The actual interview was brief and focused on two key questions, but my preparation document contained much more than I was able to say on the show. So I decided to publish the complete interview preparation script and, using technologies employed in Naia, turn it into an English-language AI mock interview video as well. I sent the video to Len in advance and received his approval to publish it.

The lip movements are a little awkward in places, but I chose to share the process and results as they are instead of spending more time polishing them. I hope this offers a small but useful example of how AI can help someone prepare for an interview in English.



### 1. The Actual Leanpub Launch Interview

This is my actual interview with Leanpub co-founder Len Epp. The video begins where the two key questions start.

<div style="position:relative;width:100%;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;margin:1.5rem 0 3.5rem;">
<iframe style="position:absolute;top:0;left:0;width:100%;height:100%" src="https://www.youtube.com/embed/E22w6u8qDVI?start=132" title="Actual Leanpub Book Launch Interview" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

### 2. An English Mock Interview Based on the Complete Preparation Script

This is not a recording or transcript of the actual call. It is an AI-generated reenactment that transforms the complete preparation document I wrote before the interview into an English conversation.

<div style="position:relative;width:100%;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;margin:1.5rem 0 3.5rem;">
<iframe style="position:absolute;top:0;left:0;width:100%;height:100%" src="https://www.youtube.com/embed/N2mUvUEOCnk?start=20" title="AI-Assisted English Mock Interview" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## Epilogue: The Naia Story I Didn’t Get to Tell in the Book

### A Model Alone Cannot Easily Become “My AI”

Much of the conversation around AI focuses on model performance. But the kind of AI I want to build cannot be explained by a model alone. It must be able to remember the user, understand the context of the current task, use the necessary tools, operate within authorized boundaries, and verify its results.

By “my AI,” I do not simply mean an AI that is good at talking with me. I mean something closer to an AI whose memory, records, settings, personality, and working context are under the user’s control. I want to build an AI that can continue working alongside its user by their choice, rather than one confined to brief conversations inside another company’s service.

### Smaller Models Need More Clearly Defined Jobs

I do not want to hide the limitations of small or local models. Models clearly differ in capability, and building a good structure around a model does not make every small model equivalent to a large one.

However, when a small model is given clearer context and appropriate tools, assigned a narrow and well-defined scope of responsibility, and subjected to stronger verification, it can handle specific tasks much more reliably. Writing the book and building Naia have reinforced my belief that these surrounding development and verification systems become even more important as models get smaller.

### Being Local-First Does Not Mean Rejecting the Cloud

Naia is a local-first project. That does not mean we should avoid cloud AI or AI from large technology companies. We should be able to use good models and services whenever they are needed.

What matters to me is user choice. Information that is personally important—such as memories, records, settings, and working context—should remain under the user’s control whenever possible. The AI should also work in environments without an internet connection or where data cannot be sent to external services. “Local” is less a product slogan than a direction for protecting user control.

### Naia Is More Than a Chatbot with an Avatar

Naia is a local-first visual AI agent and workspace. The on-screen character can serve as an approachable entry point to Naia, but the long-term goal is not merely to build a chatbot with an avatar.

I want to build an AI that remembers the user, uses tools, and works alongside them while leaving important data and decisions under their control. By making that process open source, I also want people to do more than consume a finished product: I want them to understand it, modify it, and try building their own AI.

## The Argument This Book Makes

The argument of 『Harness Engineering for AI Agents: Re:Zero』 is not about how much code AI can produce or how quickly it can produce it. It begins with the idea that AI can only be entrusted with real software development when people can understand, review, and test its work and trace where things went wrong when problems arise.

I called this harness engineering because it means designing the context, tools, scope of work, permissions, tests, and review procedures around the model as a unified system. I do not claim that the book offers a universal answer for every project. It is closer to a field report documenting what worked and what failed while rebuilding Naia with AI, along with the rules and verification methods that proved necessary.

Because Naia is open source, I hope the book will not remain a static manual published once and then forgotten, but will become a living textbook that evolves alongside the source code. When a new problem appears in the source, I revise the explanation in the book. The principles described in the book are then tested again through real development work.

While the book primarily explains this development method, the interview preparation document adds context about why I am building Naia and what kind of AI I want to create. That is the main reason I included the complete preparation document in the epilogue. The book is openly available and can be read online without purchasing it.

## How I Prepared for an English Interview with AI

In this preparation process, I did not use AI merely as a tool to write English answers for me. I used it throughout the entire process: researching the interview, reducing my thoughts to short sentences, asking about expressions I did not understand, and practicing aloud.

### 1. First, I Used AI to Research the Interview’s Format and Scope

The first material I gave the AI was the interview invitation email I received from Len. I researched Leanpub’s official guidance and recent interview examples to determine the likely duration, format, and range of questions. Establishing what I actually needed to prepare helped me avoid generating an endless list of hypothetical questions.

### 2. AI Summarization: Reducing What I Had to Say to Three Sentences

Rather than creating a large number of questions and answers, I needed a few core ideas I could return to regardless of what I was asked. These were the three sentences I prepared:

1. **A model alone is not an agent. An agent needs a harness around the model.**
   A model alone does not make an agent. It needs a surrounding development and verification system.
2. **Harness engineering becomes even more important when we use smaller or local models.**
   The development and verification system around a model becomes even more important when using smaller or local models.
3. **Naia is open source, and the book will evolve as a living textbook for its source code.**
   Naia is open source, and the book will continue evolving as a living textbook for its source code.

Even if the actual questions differed from what I expected, I planned to return to one of these three sentences.

### 3. Writing the English Sentences Alongside Their Korean Meaning Helped Me Learn

I did not simply memorize the English answers generated by AI. For expressions I found difficult, I asked about their meaning and why they were used, sentence by sentence. When something did not reflect what I meant, I revised it. Under each answer, I also wrote the Korean meaning and the key words I wanted to remember.

Understanding what I wanted to say proved more useful during the actual interview than memorizing the exact English sentences. Even when I could not recall a sentence precisely, I could restate the idea I understood in simpler English.

### 4. I Used the AI Behind Naia to Generate Separate Voices for the Interviewer and Interviewee, Then Listened Repeatedly

I printed the completed document as a PDF to review the overall flow. I then asked AI to create an English audio file with separate voices for the interviewer and interviewee. Because I already had Naia’s development environment, I could generate it and listen to it right away without purchasing a separate paid subscription. I did not have much time to study, so I listened to it repeatedly while traveling and practiced speaking the answers aloud.

Unlike reading the text alone, this helped me learn the rhythm of the conversation and how to begin answering after each question ended. In effect, I reused a single preparation document as both a PDF for reading and audio for speaking practice.

### 5. I Prepared Sentences for When I Missed a Question

It was more important not to panic when I failed to understand a question than to deliver every answer perfectly. I prepared sentences like these in advance:

> *Could you please repeat the question a little more slowly?*
> Could you repeat the question a little more slowly?

> *My English is not perfect, so let me say it more simply.*
> My English is not perfect, so I will explain it more simply.

> *I want to be careful because I do not want to overclaim.*
> I want to answer carefully because I do not want to exaggerate.

On the day of the interview, I kept the preparation document and the AI session I had been using open alongside Zoom so I could search for key words if necessary. I was very nervous, but Len asked the two key questions he had shared in advance, and I was able to answer based on the ideas I had prepared.

If you are preparing for an English interview, you can use the following framework and adapt it to your own topic:

* Three essential sentences you want to communicate
* Likely questions and English answers
* The Korean meaning of each answer
* Key words to remember instead of complete sentences
* Likely follow-up questions
* Sentences to use when you miss a question

## Why I Turned the Preparation Document into an AI Video

After the actual interview ended, I still had a long preparation document. I wanted to share the Naia story contained in it. The complete text could be read as an article, but I thought it might be easier to follow as a conversation, so I reworked it into a remote-interview-style video.

This time, I used Naia’s technology to create Korean audio based on the English practice audio, then produced English and Korean versions using AI-generated images and motion together with open-source lip-sync technology. At first, using the frame where speech began caused facial distortion. I fixed this by selecting a separate neutral frame in which the eyes and mouth looked stable and generating the video one sentence at a time. Codex completed this work using technology from the Naia project.

This process was somewhat different from generating a video with a single prompt.

`Interview research → core message organization → anticipated Korean-English Q&A → PDF review → voice practice → mock interview video`

The output of each stage became material for the next. The document prepared for the English interview became practice audio, then an article and video that could be shared publicly. I believe this is one example of how material created with AI for real work can be reused and carried forward into subsequent tasks instead of being discarded.

More important than producing the video, however, was the process of understanding and revising the content myself. AI can generate a draft quickly, but it will not automatically identify and correct everything that differs from what I actually think. I asked questions, developed my understanding, revised the material, and—with AI’s help—communicated with Len to confirm what could be published.

## Closing Thoughts

What I wanted to share through this article was not simply the fact that I created an interview video with AI. I wanted to offer a practical account of how AI can help when an English interview feels daunting: organizing likely questions, reducing what you must say to a few essential points, and preparing through repeated audio practice.

That is also why I am publishing the complete interview preparation document. I could say only a little during the actual interview, but preparing for it allowed me to organize my thoughts about the Naia I want to build and what “my AI” means to me in a much fuller narrative. The video is simply a format designed to make that story easier to follow.

I hope this process offers a useful reference for anyone preparing for an English interview and helps anyone interested in Naia understand why I am building this project. I will continue improving both the book and Naia based on lessons verified through the actual development process.
