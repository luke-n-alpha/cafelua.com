---
date: "2026-07-12"
titleKo: "빅테크의 하네스엔지니어링 무용론과, 무분별한 루프 차세대론에 대한 비판"
titleEn: "On Big Tech's Harness Engineering Futility Thesis and Uncritical Next-Generation Loop Advocacy"
category: ai
tags:
  - 하네스 엔지니어링
  - AI 에이전트
  - naia
  - 로컬 AI
  - 오픈웨이트
  - 소프트웨어 공학
images: []
thumbnail: /desk/20260712-bigtech-harness-loop-critique/hero-harness-control.webp
canonicalUrl: "https://naia.land/{locale}/blog/bigtech-harness-loop-critique"
---

<!-- ko -->
'빅테크의 하네스 엔지니어링 무용론'을 다룬 [AI타임스의 관련 기사](https://www.aitimes.com/news/articleView.html?idxno=212582)가 올라온 뒤, [여러 테크 리더들이 이에 대한 의견](https://www.facebook.com/stevehan/posts/pfbid02ipouDx75whja1BRRiJAdJC5hRmoyrDZgsYmrL6ye8MyqobpNEyzaRvJAtUYGUMpCl)을 주고받았습니다. 구글에 이어 OpenAI도 차세대 모델이 현재의 하네스 기능 상당 부분을 흡수할 수 있다는 취지의 발언을 했다는 보도였습니다.

이 글도 그 논의에 덧붙이는 글입니다. 결론부터 말하면, 대부분의 하네스가 무용해질 것이라는 전망에는 동의합니다. 저 역시 [하네스 엔지니어링 완전 해설 — 탄생·개념·격차·미래를 한 번에](https://www.naia.land/ko/blog/harness-engineering-final)의 포스팅에서 모델의 약점을 보정하려고 만든 복잡한 하네스는 모델이 좋아지면 빠르게 대체된다고 썼습니다.

다만 이것을 근거로 하네스 전체가 곧 필요 없어질 것이라고 말하면, 하네스의 본질을 놓치게 됩니다. 모델이 기능을 흡수하는 문제와, 인간과 조직이 AI에게 일을 맡기며 책임을 관리하는 문제는 다릅니다.

![플래그십 연산과 사용자 측 하네스의 경계](/desk/20260712-bigtech-harness-loop-critique/hero-harness-control.webp)

## 1. 먼저, 키워드가 유통되는 방식을 봐야 합니다

하지만 먼저 테크 키워드는 국내는 해외와 동떨어진 방식과 의미로 소비된 경우가 많았기 때문에 이에 대한 검증을 먼저 했습니다. 이번에도 원래의 발언, 실제 기술 논의, 국내에서 만들어진 프레임을 나눠 봐야 합니다.

[하네스 엔지니어링 완전 해설 — 탄생·개념·격차·미래를 한 번에](https://www.naia.land/ko/blog/harness-engineering-final)의 포스팅 중 하네스엔지니어링 키워드의 국내와 글로벌 소비 비교입니다.

| 구분 | 글로벌 | 한국 |
| ------ | ------ | ------ |
| 담론 주도 | 엔지니어·실무자의 공개 분석이 중심입니다. Hashimoto, [Martin Fowler](https://martinfowler.com/articles/harness-engineering.html) 같은 실무자의 글과 사례가 축을 이룹니다. | 미디어·교육 플랫폼과 일부 테크 인플루언서의 기사·요약·해설이 빠르게 확산됩니다. |
| 주요 채널 | GitHub, 기술 블로그, X(트위터), 공식 사례 연구 | 유튜브, 브런치, 블로그, 기사 |
| 심화 자료 | OpenAI 사례 연구, Martin Fowler 분석처럼 원문·코드·운영 경험을 함께 봅니다. | 번역·요약 중심의 유통 비중이 크고, 1차 사례 생산은 상대적으로 적습니다. |
| 실사용 공유 | [Stripe의 주당 1,000건 이상 PR 처리 사례](https://stripe.com/en-br/sessions/2026/developer-keynote), Salesforce 같은 기업이 운영 수치와 실패 경험을 공개합니다. | 토스·채널톡 같은 일부 선도 기업이 실사용 경험을 공유하지만, 산업 전반의 공통 사례로 일반화하기는 아직 이릅니다. |

이번에도 확대 해석 하기에는 좀 조심 스러운 점은, 영어권에서 harness is dead나 harness is useless가 넓게 통용되는 구호라는 근거는 뚜렷하지 않았습니다. 모델의 도구 사용 능력이 좋아지고 일부 스캐폴딩이 모델 또는 플랫폼 안으로 흡수되며, 수작업으로 쌓은 복잡한 조율 계층의 수명이 짧아질 수 있다는 논의가 더 가깝습니다. 노엄 브라운 부사장의 발언도 제가 직접 원출처까지 확인한 것은 아니고 국내외 보도를 통해 접한 것입니다. 그래서 국내에서 빠르게 굳어진 '하네스 무용론' 프레임 자체를 살펴보겠습니다.

## 2. 사라질 하네스와 남아야 할 하네스는 다릅니다

사라질 하네스는 분명합니다. 프롬프트를 여러 단계로 쪼개야만 하던 방식, 특정 모델의 결함을 우회하기 위한 임시 규칙, 도구 호출 순서를 사람이 억지로 고정한 얕은 작업 흐름은 모델이 좋아질수록 흡수될 수 있습니다. 이런 하네스는 사라지는 것이 맞습니다.

그러나 [A2Sys 이동수 대표님의 정리](https://www.facebook.com/dongsoo.lee.104/posts/pfbid0KBgFagJohQyaaXk4XW1gsEQq3XmZgcDEgSMoY8kVmPTMrDshWGNGAN9XqNdLTFJTl)처럼, 이를 모든 하네스로 확대 해석하는건 위험하다고 생각합니다. 정리하자면 아래와 같습니다.

- 프롬프트·작업 흐름 하네스는 모델에 흡수될 수 있습니다. 동의합니다.
- 도구 실행 하네스는 권한, 승인, 실패 복구를 다룹니다. 이게 정말 사라질 하네스 일까요 ?
- 런타임·메모리·인프라 하네스는 컨텍스트, 캐시, 모델 라우팅, 비용, 지연 시간, 감사 기록을 다룹니다. 이것 역시 마찬가지로 사라질 하네스라 보기에는 어렵다고 생각합니다.

제가 [『하네스 엔지니어링: Re:제로부터 시작하는 AI 소프트웨어 공학』](https://wikidocs.net/book/20530) 7장부터 11장에서 말한 하네스의 핵심도 여기에 있습니다. 계약은 허용 범위를 정하고, 구조와 격리는 변경 범위를 좁히며, 추적성과 검증은 원래의 목표와 실제 결과를 이었습니다. 측정과 운영은 비용, 권한, 장애, 복구를 관리합니다. 이 범위의 하네스 엔지니어링은 모델이 좋아진다고 해결되는 부분이 아닙니다.

한편으로는 하네스, 루프, 프롬프트 엔지니어링이 인간의 휴리스틱이라는 주장도 맞습니다. 모든 방법론은 휴리스틱에서 시작합니다. 타입, 테스트, CI, 코드 리뷰, 권한 분리도 모두 인간이 복잡한 시스템을 다루기 위해 만든 방법입니다. 하지만 여기서 더 중요한건 투명성과 책임까지 플래그십 모델에 맡길 수 있는가 ? 입니다. 일을 시켰으면 제대로 의도대로 일을 하고 있는지, 책임을 넘어서 사고를 치는 일은 없는지는 AI 스스로 할 수 없습니다. 물론 이걸 감시하고 보정하는 AI가 있을 수 있겠지만, 그러면 그것이 하네스입니다.

한상기 교수님 게시물의 댓글에서 저는 이 입장을 이렇게 적었습니다.

> 하네스 엔지니어링을 어디까지 보냐에 따라 다를 것 같습니다. 조직과 개발자의 의도가 있는 한 없어지기는 어렵다고 봅니다.

모델이 더 똑똑해질수록 AI가 더 엉뚱한 것을 더 멋지게 끝까지 만들 가능성도 함께 커집니다. 그래서 하네스는 모델의 약점 보정 장치가 아니라, 방향과 책임을 고정하는 운영 장치입니다.

## 3. 실제 운용에서는 모델 능력보다 책임 경계가 먼저입니다

넥스테인은 개발의뢰기업과 디스코드로 일을 진행합니다. 그리고 오늘 여기에 저는 특정 이슈를 해결하고 있던 클로드 코드의 에이전트를 넣었습니다. 디스코드에 참가한 넥스테인 에이전트(사실은 서버에 띄워둔 클로드코드)가 디스코드 채널을 읽어 대답을 합니다.

해당 채널에 함께 있는 비개발자 운용자가 테스트 결과와 부족한 점과 요구사항을 전달했습니다. 그리고 여기에 대해 처리할 수 있는 것을 처리하다가, 중요 배포나 건드리면 안되는 리소스를 수정해야 하는 경우 제 승인이 필요한 것은 제게 허락 여부를 물어봅니다.

또한 처음 투입하니 요구사항 듣고 바로 일을 시작해서 시킨 분들 입장에서는 답답해하고 있어서 업무프로세스를 지시했습니다. 요구사항 들으면 들었다고 회신하고, 분석을 진행하고 계획을 세운 후, 계획을 다시 디스코드 채널에 보고하고 작업 진행해. 그리고 마지막으로 작업 완료하면 최종 보고를 올리고, 혹시 중간에 문제 생기면 나(개발 리더)를 호출해서 결정이 필요한 것은 디스코드로 물어보라 시켰습니다.

이 하네스의 핵심은 넥스테인의 개발프로세스와 각 구성원들의 권한입니다. 이게 플래그십이면 알아서 최선의 방법으로 일 할까요 ? 최선의 방법이 과연 한개 인가요 ? 조직과 업무 프로세스의 일관됨이란 결국 하네스입니다. 이 책임 경계는 모델의 능력과 별개입니다. 모델이 더 많은 일을 할 수 있게 될수록, 무엇을 해도 되는지와 어디서 멈춰야 하는지는 더 엄격하게 나눠야 합니다.

## 4. 현업의 문제는 드리프트와 비용입니다

현업에서 Codex와 Claude를 쓰는 개발자가 마주하는 문제는 여전히 드리프트입니다. 목표를 좁혀도 다른 길로 새고, 하지 말라는 변경을 하고, 테스트를 바꿔 통과했다고 말하며, 운영 권한의 경계를 놓칩니다. 모델이 정교해질수록 이 문제는 더 매끈하게 숨겨질 수 있습니다.

이때 "더 많이 돌리면 된다"는 답은 빅테크에는 가능합니다. 추론 시간을 늘리고, 후보를 더 만들고, 실패한 경로를 버리고, 외부 검증을 붙일 수 있습니다. 그러나 현업 개발자와 한 푼을 아껴야 하는 중소 스타트업은 그렇게 할 수 없습니다. 국내 기업의 현실도 마찬가지입니다.

위에 링크를 건 한상기 교수님과의 댓글에서 하정우 전 AI미래기획수석비서관께서 언급하신 "토큰 총비용 효율성"이 바로 이 기준입니다. 하네스는 플래그십 모델을 거부하는 장치가 아닙니다. 비싼 모델을 정말 필요한 판단에만 쓰고, 반복 가능한 일은 작은 모델·로컬 도구·스크립트·결정론적 검증기로 분리하기 위한 비용 제어 장치입니다.

최근 발표된 OpenAI의 수학 관련 성과도 두 시점으로 구분할 필요가 있습니다. 저는 [에르되시 평면 단위 거리 문제 반례와 관련된 첫 성과](https://openai.com/index/model-disproves-discrete-geometry-conjecture/)는, 기존 접근과 다른 수학적 연결을 찾아낸 가능성으로 높게 평가합니다. AI만이 낼 수 있는 새로운 발견의 가능성을 보여준 사례이기 때문입니다.

반면 이후 더 부각된 [테스트 타임 컴퓨팅](https://openai.com/index/learning-to-reason-with-llms/)은, 추론 시점에 더 많은 연산과 후보 탐색, 검증, 반복을 투입하는 방향입니다. 이것도 중요한 기술입니다. 다만 그것을 모델 하나의 순수 지능 향상으로만 말하면 비용 구조가 사라집니다. 물량전도 기술이지만, 빅테크에 특히 유리한 기술입니다.

## 5. 하네스는 비용과 데이터의 방어선입니다

"모델이 하네스를 먹어 치울 것이다"라는 말은 자극적입니다. 그러나 그 모델을 누가 얼마에 쓰는지는 별개의 문제입니다. 모델이 더 많은 기능을 흡수할수록 사용자의 코드가 단순해질 수는 있습니다. 동시에 더 무겁고 비싼 모델 호출에 의존하게 될 수도 있습니다. 복잡성이 사라지는 것이 아니라, 사용자의 작업장에서 모델 제공자의 과금 계층으로 이동하는 것입니다.

데이터도 같습니다. 에이전트가 실제로 유용해지려면 문서, 코드, 일정, 메일, 운영 로그, 장애 이력, 결재 흐름, 고객 데이터를 봐야 합니다. 에이전트가 작업장이 되는 순간, 사용자의 일 전체가 입력이 됩니다.

좋은 하네스는 필요한 맥락만 외부 모델에 보내고 나머지는 사용자의 작업장에 남깁니다. 모델을 라우팅하고, 캐시를 재사용하고, 권한을 나누며, 재현 가능한 검증을 붙입니다. 그래서 하네스는 비용 방어선이고 데이터 방어선입니다.

이 관점에서 보면 글로벌 모델 기업이 강한 사용자 측 하네스를 불편해할 가능성도 있습니다. 사용자가 먼저 작은 모델과 로컬 도구로 처리하고, 필요한 순간에만 플래그십을 호출하면 호출량과 전송되는 맥락이 줄어듭니다. 이것은 사실 단정이 아니라, 프론티어 모델 개발·추론·GPU·전력 비용이 커지는 산업 구조에서 자연스럽게 검토해야 할 이해관계입니다.

OpenAI와 Anthropic은 [Codex](https://openai.com/index/introducing-codex/)와 [Claude Code](https://docs.anthropic.com/en/docs/claude-code/getting-started)를 통해 하네스 경쟁의 최전선에 있습니다. 반면 Google은 모델 회사이면서 클라우드 사업자이기도 합니다. 회사마다 정확히 같은 이해관계라고 말할 수는 없지만, 이 논쟁을 순수한 기술 예측으로만 듣기 어려운 이유는 분명합니다. 좋은 하네스는 빅테크들이 원하는 '작업장을 모델로 옮겨와 데이터를 수집하고 싶은 욕구'와 '플래그십 사용 의존'을 줄여버립니다.

## 6. 루프는 차세대 기본값이 아닙니다

루프도 마찬가지입니다. 저는 루프를 쓰고 있지만, 대부분의 미션에는 루프를 쓰지 않는 편이 맞다고 봅니다. 일반 개발자에게 맡겨도 적절한 결과가 나올 수 있는 일이라면, 좋은 모델을 한 번 제대로 쓰는 편이 더 싸고 빠를 가능성이 큽니다. 의외로 루프가 효과적인 경우는 좁습니다.

첫째는 연구개발입니다. 정답이 없고, 실험 결과에 따라 가설이 바뀌며, 다음 실험이 이전 결과를 읽고 능동적으로 바뀌어야 하는 작업입니다. 내부에서 진행하는 음성·노래 연구가 그렇습니다. 이 경우에는 실험 결과와 전체 데이터를 여러 AI가 검토하고, 기존 실험과의 연속성, 드리프트 여부, 다음 사이클의 필요성을 판단합니다. 완료 기준은 그럴듯한 결과가 아니라, 지표가 더 이상 오르지 않는다는 판단입니다. 탐색의 수렴이 목표이므로 루프가 맞습니다.

둘째는 제한된 환경에서 작은 모델을 쓸 때입니다. 작은 LLM은 목표를 축소하고 "이 정도면 됐다"고 멈추기 쉽습니다. 다만 이 경우 필요한 것은 긴 루프보다 목표와 종료 조건을 닫아 주는 장치입니다. 루프라기보다 Claude Code의 goal 기능에 가까운 하네스입니다. 일반 사용자의 일상 작업에 루프를 남발하면 비용 낭비가 됩니다. 루프는 탐색의 수렴을 위해 쓰고, 하네스는 목표와 책임을 고정하기 위해 씁니다. 두 개는 대체 관계가 아닙니다.

## 7. 나이아는 작업장을 사용자 쪽에 남기려 합니다

나이아는 플래그십 모델을 거부하지 않습니다. 개발에는 클라우드 플래그십을 철저히 이용할 생각입니다. 좋은 모델은 써야 합니다.

다만 모든 작업장과 데이터를 빅테크 플랫폼에 넘길 생각은 없습니다. 나이아가 지향하는 것은 로컬, P2P, 오픈웨이트, 작은 모델, 결정론적 검증기, 명시적 권한 하네스를 함께 쓰는 구조입니다. 비싼 플래그십은 필요한 판단에 쓰되, 기본 작업장은 사용자의 손에 남겨야 합니다.

이 점에서 [DeepSeek](https://www.deepseek.com/), [Qwen](https://qwenlm.github.io/), [Kimi](https://www.moonshot.cn/), [GLM](https://www.z.ai/) 계열과 같은 오픈웨이트 모델의 발전은 중요합니다. 목적에 따라 모델을 조합하고, 로컬에서 데이터를 지키며, 필요한 순간에만 폐쇄형 플래그십을 호출하는 구성이 가능해집니다. 한국에서는 업스테이지와 네이버 같은 독자 모델 전략도 이 흐름에서 의미가 있습니다. 글로벌 빅테크의 플래그십을 그대로 따라가기보다, 오픈웨이트·독자 모델·특화 하네스·국내 업무 맥락을 잘 묶는 길이 더 현실적일 수 있습니다.

모델은 빌려 쓸 수 있습니다. 그러나 작업장과 데이터까지 빌려줄 필요는 없습니다.

## 결론: 무용론보다 필요한 것은 기술 수준의 논의입니다

사라질 하네스는 사라질 것입니다. 모델이 흡수할 기능도 늘어날 것입니다. 이 점을 부정할 이유는 없습니다. 그러나 모델이 흡수하는 기능, 조직의 의도와 책임을 고정하는 실행 체계, 비용과 데이터의 경계를 지키는 운영 체계가 사라질거라고 생각되지 않습니다. AI에게 일을 시키는 주체가 인간이고 결과에 책임지는 주체도 인간이라면, 계약·구조·추적성·검증·운영은 사라지지 않습니다.

이제는 하네스가 죽었는지 살았는지같은 키워드 논쟁을 그만 봤으면 좋겠습니다. 무엇을 모델 안으로 넣을 것인지, 무엇을 사용자와 조직의 통제 아래 남길 것인지, 드리프트를 어떻게 검증하고 되돌릴 것인지, 토큰 비용과 데이터 노출을 누가 부담할 것인지 같은 진짜 기술 중심의 논의들이 앞섰으면 좋겠습니다.

## 참고와 출처

### 제 글과 책

- [『하네스 엔지니어링: Re:제로부터 시작하는 AI 소프트웨어 공학』](https://wikidocs.net/book/20530)
- [「하네스 엔지니어링 완전 해설 — 탄생·개념·격차·미래를 한 번에」](https://www.naia.land/ko/blog/harness-engineering-final)
- [「하네스 엔지니어링」 출간 소식](https://www.naia.land/ko/blog/20260709-harness-engineering-launch)

### 이번 논의의 직접 계기

- [AI타임스, "구글 이어 오픈AI도 '하네스 무용론'... 차세대 모델이 기능 흡수할 것"](https://www.aitimes.com/news/articleView.html?idxno=212582)
- [AI타임스, "[6월25일] '모델이 하네스를 먹어 치울 것'..."](https://www.aitimes.com/news/articleView.html?idxno=212092)
- [한상기 교수님 Facebook 게시물과 댓글 논의](https://www.facebook.com/stevehan/posts/pfbid02ipouDx75whja1BRRiJAdJC5hRmoyrDZgsYmrL6ye8MyqobpNEyzaRvJAtUYGUMpCl)
- [이동수 A2Sys 대표님, "하네스 무용론? 반은 맞고 반은 틀립니다"](https://www.facebook.com/dongsoo.lee.104/posts/pfbid0KBgFagJohQyaaXk4XW1gsEQq3XmZgcDEgSMoY8kVmPTMrDshWGNGAN9XqNdLTFJTl)

### 원문과 기술 자료

- [OpenAI, "Learning to Reason with LLMs"](https://openai.com/index/learning-to-reason-with-llms/)
- [OpenAI, "An OpenAI model has disproved a central conjecture in discrete geometry"](https://openai.com/index/model-disproves-discrete-geometry-conjecture/)
- [OpenAI, "Introducing Codex"](https://openai.com/index/introducing-codex/)
- [OpenAI, "Introducing OpenAI o3 and o4-mini"](https://openai.com/index/introducing-o3-and-o4-mini/)
- [Google, "Gemini 2.0: our new AI model for the agentic era"](https://blog.google/innovation-and-ai/models-and-research/google-deepmind/google-gemini-ai-update-december-2024/)
- ["The Interplay of Harness Design and Post-Training in LLM Agents"](https://arxiv.org/abs/2606.25447)
- ["More Is Not Always Better: Cross-Component Interference in LLM Agent Scaffolding"](https://arxiv.org/abs/2605.05716)
- ["AutoHarness"](https://arxiv.org/abs/2603.03329)

<!-- en -->
After an [AI Times article discussing big tech's harness engineering futility thesis](https://www.aitimes.com/news/articleView.html?idxno=212582) was published, [various tech leaders exchanged opinions on the matter](https://www.facebook.com/stevehan/posts/pfbid02ipouDx75whja1BRRiJAdJC5hRmoyrDZgsYmrL6ye8MyqobpNEyzaRvJAtUYGUMpCl). Reports indicated that following Google, OpenAI also made statements suggesting that next-generation models could absorb significant portions of current harness functionality.

This post is an addition to that discussion. To state my conclusion upfront, I agree with the outlook that most harness engineering will become obsolete. In my own post [Harness Engineering Explained Comprehensively — Birth, Concepts, Gaps, and Future in One Go](https://www.naia.land/ko/blog/harness-engineering-final), I wrote that complex harness designs created to compensate for model weaknesses are rapidly replaced as models improve.

However, using this as grounds to claim that harness engineering as a whole will soon become unnecessary misses the essence of harness engineering. The problem of models absorbing functionality is different from the problem of humans and organizations managing responsibility as they delegate work to AI.

![The boundary between flagship inference and user-side harness](/desk/20260712-bigtech-harness-loop-critique/hero-harness-control.webp)

## 1. First, we must examine how keywords circulate

However, before anything else, tech keywords are often consumed in ways and meanings disconnected from their overseas origins in Korea, so I first verified this. Again, we need to distinguish between the original statements, actual technical discussions, and the frameworks created within Korea.

A comparison from my post [Harness Engineering Explained Comprehensively — Birth, Concepts, Gaps, and Future in One Go](https://www.naia.land/ko/blog/harness-engineering-final) of how the harness engineering keyword is consumed globally versus in Korea.

| Category | Global | Korea |
| ------ | ------ | ------ |
| Discourse Leadership | Public analysis by engineers and practitioners forms the core. Articles and case studies from practitioners like Hashimoto and [Martin Fowler](https://martinfowler.com/articles/harness-engineering.html) constitute the backbone. | Articles, summaries, and commentary from media, educational platforms, and some tech influencers spread rapidly. |
| Primary Channels | GitHub, technical blogs, X (Twitter), official case studies | YouTube, Brunch, blogs, news articles |
| Advanced Materials | Cases like OpenAI and analyses like Martin Fowler's examine source materials, code, and operational experience together. | Distribution heavily emphasizes translations and summaries, with relatively limited primary case generation. |
| Operational Sharing | Companies like [Stripe handling over 1,000 PRs per week](https://stripe.com/en-br/sessions/2026/developer-keynote) and Salesforce publicly share operational metrics and failure experiences. | Some leading companies like Toss and Channel Talk share operational experience, but generalization to industry-wide common cases is still limited. |

One caveat about over-interpretation: there is no clear evidence that "harness is dead" or "harness is useless" is a widely used slogan in English-language discourse. The discussion is closer to models improving their tool use abilities, some scaffolding being absorbed into models or platforms, and manually constructed complex orchestration layers having shorter lifespans. The statement from Vice President Noam Brown that I saw was not something I directly verified to the original source, but rather learned through domestic and international reporting. That's why I want to examine the 'harness futility thesis' frame that has quickly solidified within Korea.

## 2. Harness that will disappear and harness that must remain are different

The harness that will disappear is clear. The practice of splitting prompts into multiple stages, temporary rules to work around specific model defects, and shallow workflows where tool invocation order is artificially fixed by humans can be absorbed as models improve. This harness should disappear.

However, as [A2Sys CEO Dong-Soo Lee organized it](https://www.facebook.com/dongsoo.lee.104/posts/pfbid0KBgFagJohQyaaXk4XW1gsEQq3XmZgcDEgSMoY8kVmPTMrDshWGNGAN9XqNdLTFJTl), I believe it is risky to extrapolate this to all harness. To summarize, it looks like this:

- Prompt and workflow harness can be absorbed by models. I agree.
- Tool execution harness addresses permissions, approvals, and failure recovery. Is this really harness that will disappear?
- Runtime, memory, and infrastructure harness address context, cache, model routing, cost, latency, and audit logs. I find it difficult to say this will also disappear.

The essence of harness that I discussed from chapters 7 through 11 in [『Harness Engineering: Re:Starting from Zero in AI Software Engineering』](https://wikidocs.net/book/20530) lies here. Contracts define allowable scope, structure and isolation narrow the scope of change, and traceability and verification connect intended goals to actual results. Measurement and operations manage cost, permissions, incidents, and recovery. Harness engineering in this scope is not something solved by better models.

On the other hand, the claim that harness, loops, and prompt engineering are human heuristics is also correct. All methodologies start with heuristics. Types, tests, CI, code review, and permission separation are all methods humans created to handle complex systems. But what's more important here is: can we delegate transparency and accountability entirely to the flagship model? AI cannot do this on its own—verify that work is proceeding as intended and ensure accidents don't occur. Of course, there could be an AI that monitors and corrects this, but then that is the harness.

I wrote this position in a comment on Professor Han Sang-ki's post like this:

> It seems to depend on how broadly you define harness engineering. As long as organizations and developers have intent, I don't think it will disappear.

The better the model becomes, the greater the possibility that AI will accomplish increasingly nonsensical things with greater sophistication until completion. That's why harness is not a device to correct model weaknesses, but an operational device to fix direction and responsibility.

## 3. In actual operations, responsibility boundaries come before model capabilities

Nextain conducts work with development clients through Discord. And today, I put into that an agent from Claude Code that was handling a specific issue. A Claude Code instance (actually a server-deployed Claude Code) that participates in a Discord channel reads that channel to provide answers.

A non-developer operator present in the channel conveyed test results, shortcomings, and requirements. In handling what could be addressed, when important deployments or resources that shouldn't be touched needed modification, the agent asks me for approval.

Also, since they were initially frustrated that the agent started work right after hearing requirements (without delay), I instructed work process. Upon hearing requirements, acknowledge receipt, conduct analysis, create a plan, report the plan back to the Discord channel, and then proceed with work. When work is finally complete, file a final report. If any issues arise mid-process, call me (development lead) and ask on Discord when a decision is needed.

The core of this harness is Nextain's development process and the permissions of each member. If this were left to a flagship model, would it automatically handle work in the best way? Is there even one best method? Consistency in organization and work process is ultimately harness. This responsibility boundary is separate from model capability. The better a model becomes at handling more work, the more rigorously we must divide what may and may not be done and where to stop.

## 4. The real problem facing practitioners is drift and cost

Developers using Codex and Claude in practice still face the problem of drift. Even when narrowing objectives, work leaks in other directions. Prohibited changes get made. Tests get changed to pass. Operational permission boundaries are lost. As models become more sophisticated, this problem can be concealed more smoothly.

In such cases, "just run more" is possible for big tech. They can extend reasoning time, generate more candidates, discard failed paths, and attach external verification. However, working developers and cost-conscious startups cannot do this. The reality of domestic companies is the same.

In the comments with Professor Han Sang-ki linked above, former AI Future Planning Senior Secretary Hah Jung-woo mentioned the "total token cost efficiency" that is precisely this criterion. Harness is not a device that rejects flagship models. It's a cost control device—using expensive models only for truly necessary judgments, and separating repetitive work into smaller models, local tools, scripts, and deterministic validators.

Recent OpenAI achievements in mathematics also need to be distinguished at two points. I rate the first achievement, related to the [counterexample related to the Erdős unit distance problem in the plane](https://openai.com/index/model-disproves-discrete-geometry-conjecture/), highly as showing the possibility of finding mathematical connections different from existing approaches. This is a case demonstrating the possibility of new discoveries only AI could make.

In contrast, the subsequently highlighted [test-time compute](https://openai.com/index/learning-to-reason-with-llms/) is a direction of investing more computation, candidate exploration, verification, and iteration at inference time. This is also important technology. However, talking about it solely as pure intelligence improvement of a single model erases the cost structure. It's a quantity strategy, but a technique particularly favorable to big tech.

## 5. Harness is the defense line for cost and data

The saying "models will consume harness" is provocative. But who uses that model and at what cost is a separate issue. As models absorb more functionality, user code can become simpler. Simultaneously, users may become more dependent on heavier, more expensive model calls. Complexity doesn't disappear—it shifts from the user's workspace to the model provider's billing layer.

Data is the same. For agents to become truly useful, they must see documents, code, schedules, emails, operational logs, incident history, approval flows, and customer data. The moment an agent becomes a workspace, the user's entire work becomes input.

Good harness sends only necessary context to external models and keeps the rest in the user's workspace. It routes models, reuses cache, divides permissions, and attaches reproducible validation. That's why harness is a cost defense line and a data defense line.

From this perspective, it's possible that global model companies would find strong user-side harness inconvenient. If users first process with small models and local tools, calling on flagships only when necessary, then call volumes and context sent decreases. This is not speculation but a natural consideration of interests in an industry structure where frontier model development, inference, GPU, and power costs grow.

OpenAI and Anthropic are at the forefront of harness competition through [Codex](https://openai.com/index/introducing-codex/) and [Claude Code](https://docs.anthropic.com/en/docs/claude-code/getting-started). Google, meanwhile, is both a model company and a cloud provider. It can't be said that all companies have exactly the same interests, but the reason this debate is difficult to hear as pure technical prediction is clear. Good harness reduces big tech's desire to 'move workspaces to the model, collect data, and increase dependency on flagships.'

## 6. Loops are not the next-generation default

Loops are the same. I use loops, but I think for most missions, not using loops is the right approach. If it's work where regular developers could deliver appropriate results even if delegated, using a good model once well might be cheaper and faster. Surprisingly, effective use cases for loops are narrow.

First is research and development. Work where there is no single answer, hypotheses change based on experimental results, and the next experiment must actively respond by reading previous results. Internal voice and song research is like this. In such cases, multiple AIs review experimental results and full data, judge continuity with existing experiments, drift, and necessity for the next cycle. The completion criterion is not plausible results but the judgment that metrics no longer improve. Since convergence of exploration is the goal, loops are appropriate.

Second is using small models in restricted environments. Small LLMs easily truncate objectives and stop at "this is good enough." But what's needed in this case is not lengthy loops but a mechanism that closes objectives and termination conditions. It's closer to Claude Code's goal feature than a loop—a harness device. If you produce loops indiscriminately for general user daily tasks, it becomes wasteful. Use loops for convergence of exploration, and harness for fixing objectives and responsibility. They are not interchangeable.

## 7. Naia aims to keep the workspace on the user side

Naia does not reject flagship models. Development will thoroughly utilize cloud flagship models. Good models must be used.

However, we have no intention of delegating all workspaces and data to big tech platforms. Naia's direction is to combine local, P2P, open-weight, small models, deterministic validators, and explicit permission harness. Use expensive flagships for necessary judgments, but the basic workspace should remain in the user's hands.

From this perspective, the development of open-weight models like [DeepSeek](https://www.deepseek.com/), [Qwen](https://qwenlm.github.io/), [Kimi](https://www.moonshot.cn/), and [GLM](https://www.z.ai/) is important. It becomes possible to combine models by purpose, protect data locally, and call closed flagships only when necessary. In Korea, proprietary model strategies from Upstage and Naver have meaning in this flow as well. Rather than simply following global big tech flagships, binding open-weight models, proprietary models, specialized harness, and domestic business context well may be more realistic.

Models can be borrowed. But there's no need to borrow the workspace and data too.

## Conclusion: More necessary than futility thesis is technical-level discussion

Harness that will disappear will disappear. Functionality that models absorb will increase. There's no reason to deny this. However, I don't think the functionality models absorb, the execution systems that fix organizational intent and responsibility, and the operational systems that protect cost and data boundaries will disappear. If the subject directing AI is human and the subject taking responsibility for results is human, then contracts, structure, traceability, validation, and operations will not disappear.

I hope we can stop the keyword debate about whether harness is dead or alive. I'd prefer discussions centered on real technology: what to put inside the model, what to keep under user and organizational control, how to validate and reverse drift, who bears the burden of token cost and data exposure.

## References and Sources

### My writings and books

- [『Harness Engineering: Re:Starting from Zero in AI Software Engineering』](https://wikidocs.net/book/20530)
- ["Harness Engineering Explained Comprehensively — Birth, Concepts, Gaps, and Future in One Go"](https://www.naia.land/ko/blog/harness-engineering-final)
- ["Harness Engineering Publication News"](https://www.naia.land/ko/blog/20260709-harness-engineering-launch)

### Direct catalysts for this discussion

- [AI Times, "Following Google, OpenAI also embraces 'harness futility thesis'... next-generation models will absorb function"](https://www.aitimes.com/news/articleView.html?idxno=212582)
- [AI Times, "[June 25] 'Models will consume harness'..."](https://www.aitimes.com/news/articleView.html?idxno=212092)
- [Professor Han Sang-ki's Facebook post and comment discussion](https://www.facebook.com/stevehan/posts/pfbid02ipouDx75whja1BRRiJAdJC5hRmoyrDZgsYmrL6ye8MyqobpNEyzaRvJAtUYGUMpCl)
- [A2Sys CEO Dong-Soo Lee, "Harness futility thesis? Half right and half wrong"](https://www.facebook.com/dongsoo.lee.104/posts/pfbid0KBgFagJohQyaaXk4XW1gsEQq3XmZgcDEgSMoY8kVmPTMrDshWGNGAN9XqNdLTFJTl)

### Original materials and technical references

- [OpenAI, "Learning to Reason with LLMs"](https://openai.com/index/learning-to-reason-with-llms/)
- [OpenAI, "An OpenAI model has disproved a central conjecture in discrete geometry"](https://openai.com/index/model-disproves-discrete-geometry-conjecture/)
- [OpenAI, "Introducing Codex"](https://openai.com/index/introducing-codex/)
- [OpenAI, "Introducing OpenAI o3 and o4-mini"](https://openai.com/index/introducing-o3-and-o4-mini/)
- [Google, "Gemini 2.0: our new AI model for the agentic era"](https://blog.google/innovation-and-ai/models-and-research/google-deepmind/google-gemini-ai-update-december-2024/)
- ["The Interplay of Harness Design and Post-Training in LLM Agents"](https://arxiv.org/abs/2606.25447)
- ["More Is Not Always Better: Cross-Component Interference in LLM Agent Scaffolding"](https://arxiv.org/abs/2605.05716)
- ["AutoHarness"](https://arxiv.org/abs/2603.03329)
