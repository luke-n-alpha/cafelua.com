---
date: "2026-03-07"
titleKo: AI 네이티브 오픈소스 — AI와 함께 만드는 오픈소스
titleEn: AI-Native Open Source — Open Source Built with AI
category: ai
tags:
  - 인공지능
  - Naia
  - NaiaOS
  - Nextain
  - 오픈소스
  - AI네이티브
  - 바이브코딩
  - AGENTS.md
images: []
thumbnail: /desk/20260307-ai-native-opensource/ai-native-community.webp
externalUrl: https://naia.nextain.io/ko/blog/20260307-ai-native-opensource
---

<!-- ko -->
> *본 글은 [Naia 블로그](https://naia.nextain.io/ko/blog/20260307-ai-native-opensource)에서 원본을 확인할 수 있습니다.*

2025년 2월 안드레 카파시가 언급했던 '바이브 코딩'의 이슈를 시작으로 1년이 지난 요즘, SW개발에 AI에 의한 근본적인 변화가 찾아왔습니다. 이는 AI로 인해 큰 기회를 얻은 많은 SW기업들에게 큰 위기를 맞이하게 했습니다.

2025-2026년, 오픈소스 생태계에 전례 없는 위기가 찾아왔습니다.

## 오픈소스가 무너지는 세 가지 이유

![오픈소스가 무너지는 세가지 이유](/desk/20260307-ai-native-opensource/three-reasons.webp)

### 1. 조용한 착취 — 아무도 안 온다

GitHub은 AI 시대의 오픈소스 위기를 **"Eternal September"**이라 부릅니다.

> **Eternal September**: 1990년대 초 Usenet은 대학생 중심 커뮤니티였습니다. 매년 9월이면 신입생들이 몰려와 저품질 글을 올렸지만, 기존 사용자들이 교육하면 한두 달이면 정상화됐습니다. 그런데 1993년 9월, AOL이 Usenet을 일반인에게 개방하자 "9월"이 영원히 끝나지 않게 됐습니다.

하지만 진짜 위기는 AI slop PR 홍수가 아닙니다. **아예 아무도 안 온다는 겁니다.**

AI가 오픈소스 코드를 이미 학습했습니다. 개발자는 레포에 방문할 이유가 없고, 문서를 읽을 이유도 없고, 이슈를 열 이유도, PR을 보낼 이유도 없습니다. "이거 만들어줘" 한마디면 AI가 오픈소스 위에서 결과물을 만들어주니까요.

**사용량은 폭증하는데 커뮤니티는 유령 도시가 됩니다.**

| 사례 | 무슨 일이 벌어졌나 |
|------|-------------------|
| **Tailwind CSS** | npm 다운로드 증가, 문서 트래픽 40% 감소, **매출 80% 감소** |
| **Stack Overflow** | ChatGPT 출시 6개월 만에 활동량 25% 하락, 2025년 기준 질문 수 **76% 감소** |
| **Vercel** | 오픈소스 라이브러리(Tailwind, shadcn/ui 등)로 v0가 코드 생성 — 수익은 Vercel이 독점 |
| **SQLite** | 코드는 퍼블릭 도메인이지만 테스트 스위트는 **의도적으로 비공개** — 결과적으로 AI 시대에도 유효한 전략 |

arXiv 논문 [2601.15494](https://arxiv.org/abs/2601.15494)의 결론: 바이브 코딩은 OSS를 "사용"하지만, 문서를 읽거나 버그를 보고하거나 커뮤니티에 참여하지 않습니다.

오픈소스의 기본 전제 — **"개방하면 돌아온다"** — 가 무너지고 있습니다. 개방으로 얻는 효용보다, 베껴서 얻는 효용이 더 큰 시대가 온 겁니다.

### 2. 커뮤니티의 역설 — 기여자가 많을수록 느려진다

기존 상식은 "기여자가 많을수록 프로젝트가 빨라진다"였습니다. 현실은 정반대입니다. 프레드 브룩스가 1975년에 이미 증명했습니다 — [**"사람을 추가하면 프로젝트가 더 느려진다."**](https://en.wikipedia.org/wiki/Brooks%27s_law) 커뮤니케이션 비용은 인원 수의 제곱으로 늘어나기 때문입니다.

기여자가 많아질수록 리뷰, 조율, 의사결정의 비용이 늘어납니다. 메인테이너는 코드를 짜는 대신 사람을 관리하는 데 시간을 씁니다. AI 시대에는 이 문제가 극단적으로 심화됩니다 — 사용자는 AI를 통해 조용히 가져가기만 하고, 남은 소수의 기여는 조율 비용만 늘립니다.

**결국 혼자 AI와 만드는 게 커뮤니티와 만드는 것보다 빠른 상황이 온 겁니다.**

### 3. 방어도 답이 아니다

그래서 많은 프로젝트가 문을 닫기 시작했습니다. curl은 21일간 AI가 생성한 보고서 20건을 받고 유효한 건 0건 — 결국 6년간 운영한 버그 바운티를 중단했고, Ghostty는 승인된 이슈에서만 AI 기여를 허용하는 무관용 정책을 도입했고, tldraw는 아예 외부 PR 자체를 전면 차단했습니다.

PR을 차단하면 AI slop은 막을 수 있습니다. 하지만 1번과 2번 문제 — 조용한 착취와 커뮤니티 비용 — 는 해결되지 않습니다. 문을 닫아도 AI는 이미 코드를 학습했고, 사용자는 레포 밖에서 계속 가져갑니다.

**업계의 반응은 두 갈래입니다:**

- **방어**: Vouch (신뢰 관리), PR Kill Switch, AI 사용 의무 공개 + 거부
- **수용**: GitHub Agentic Workflows, AGENTS.md 표준 (6만+ 프로젝트 채택), Responsible Vibe Coding Manifesto

양쪽이 동의하는 점은 하나입니다: AI 자체가 문제가 아니라, **AI를 잘못 사용하는 것**이 문제입니다. 하지만 어느 쪽도 "개방의 효용 < 베끼는 효용" 문제에 대한 답은 내놓지 못하고 있습니다.

---

## 그런데, 매번 새로 만드는 게 답인가?

"바이브 코딩이 대세가 되면 온디맨드 개발이 올 것이다" — 필요할 때 AI에게 만들어달라고 하면 되니까, 그것이 컴퓨팅과 앱의 대세가 될 거라는 주장들이 있습니다.

하지만 이건 거대한 자원 낭비입니다.

같은 기능을 1만 명이 따로 만들어달라고 합니다. 1만 개의 검증 안 된 코드가 생깁니다. 보안 패치가 나오면? 1만 명이 각자 다시 만들어야 합니다. 아키텍처를 개선하려면? 처음부터 다시. 테스트? 없습니다. **매번 바닥부터 새로 만드는 건, AI가 아무리 빨라도 낭비입니다.**

이미 잘 만들어진 오픈소스 프로젝트가 있습니다. 검증된 아키텍처, 수천 개의 테스트, 수년간의 보안 패치 이력. 이런 것들은 "만들어줘" 한마디로 재현되지 않습니다. **축적의 가치**는 AI 시대에도 변하지 않습니다.

**슈퍼 개인의 시대**가 왔다고 합니다. AI가 보조하니까 혼자서도 대단한 걸 만들 수 있다고. 맞는 말입니다. 그런데 슈퍼 개인 여러 명이 **같은 것을 따로 만드는 게** 효율적일까요? 슈퍼 개인들이 하나의 오픈소스에 **함께 기여하는 게** 효율적이지 않을까요?

결국 답은 다시 오픈소스로 돌아옵니다. 문제는 "오픈소스를 할 것인가 말 것인가"가 아니라, "**AI 시대에 오픈소스를 어떻게 할 것인가**"입니다.

---

## Naia OS의 선택: AI와 함께 설계하기

만약 메인테이너도 AI를 쓰고, 기여자도 AI를 쓴다면 어떨까요?

기존 오픈소스에서 비용이었던 **커뮤니케이션** — 이슈 분류, PR 리뷰, 번역, 조율 — 을 AI가 대행한다면, "기여자가 많을수록 느려진다"는 역설을 깰 수 있지 않을까요?

[Naia OS](https://github.com/nextain/naia-os)는 이 가설을 실험하기 위해 정반대의 길을 택했습니다.

> **"AI를 막지 말고, AI와 함께 설계하고 개발하자."**

![AI 네이티브 오픈소스 커뮤니티](/desk/20260307-ai-native-opensource/ai-native-community.webp)

| 관점 | 기존 오픈소스 | Naia OS |
|------|-------------|---------|
| AI 입장 | AI 기여를 **방어** | AI 기여를 워크플로우에 **설계** |
| 온보딩 | README 읽기 | Clone → AI가 프로젝트 설명 → 언어 장벽 없음 |
| 컨텍스트 | 사람이 읽는 문서만 | `.agents/` (AI용) + `.users/` (사람용) 이중 구조 |
| 언어 | 영어 필수 | **모든 언어 환영** — AI가 번역 |

### 컨텍스트가 인프라다 — 오픈소스의 AX

기업들이 AX(AI Transformation)를 하듯, 오픈소스에도 AX가 필요합니다. 커뮤니티(조직)와 소스+컨텍스트(인프라), 이 두 축을 AI가 참여할 수 있게 전환하는 것입니다.

커뮤니티 쪽부터 보면 — 기존 오픈소스의 커뮤니케이션은 전부 사람 대 사람입니다. AI 시대에 이 비용이 문제라면, AI가 커뮤니케이션을 대행할 수 있게 조직을 바꿔야 합니다.

인프라 쪽은 — 기존 오픈소스에는 사람이 읽는 문서만 있습니다. README, CONTRIBUTING, 위키. AI가 이걸 읽어도 프로젝트의 철학, 아키텍처 결정의 맥락, 기여 워크플로우까지는 이해하지 못합니다. 그래서 AI가 만든 PR이 slop이 되는 겁니다.

`.agents/` 디렉토리는 이 문제를 풀기 위해 만들었습니다. 프로젝트의 규칙, 아키텍처, 워크플로우를 AI가 읽을 수 있는 구조화된 형태로 저장소 안에 두는 겁니다. 이게 충분히 풍부하면 AI가 프로젝트를 이해한 상태에서 코드를 쓰고, 기여자를 안내하고, 품질도 지킬 수 있습니다. "처음부터 새로 만들기"가 아니라 **"이해하고 함께 만들기"**가 됩니다.

### Naia OS에서 실제로 한 것들

**언어 장벽 제거** — 예전에 Mozilla Hubs에 기여해보려 했던 적이 있습니다. 코드를 읽고 PR을 만드는 건 할 수 있었지만, 커뮤니티의 논의를 팔로우업하거나 온라인 밋업에 참여하는 건 다른 문제였습니다. Naia OS에서는 기여자가 모국어로 이슈와 PR을 쓰고, AI가 번역합니다. 현재 14개 언어의 README가 동시에 유지되고 있습니다.

**품질은 구조가 지킴** — `.agents/` 컨텍스트가 AI를 교육하고, CI가 빌드·테스트를 검증하고, AI 리뷰어가 패턴 위반을 잡고, 메인테이너는 방향만 잡으면 됩니다.

**코드만이 기여가 아님** — 번역, 문서, 디자인, 테스팅, 그리고 `.agents/` 컨텍스트 자체를 개선하는 것까지 10가지 기여 방법이 있습니다.

**AI가 진짜 이해하고 있는지 테스트** — Codex CLI와 Gemini CLI를 새 세션에서 저장소에 투입하고, `.agents/` 컨텍스트만 읽은 상태에서 프로젝트를 제대로 이해하는지 검증했습니다. 12개 중 7개 통과, 4개 부분 통과, 1개 실패. 재밌는 건, 사람이 놓친 문서의 모순을 AI가 발견한 겁니다.

---

## 근미래에는 AI 주도의 오픈소스 생태계가 펼쳐질까?

오픈소스의 "개방하면 돌아온다"는 전제가 인간에게는 흔들리고 있습니다. 그렇다면 코딩하는 AI에게 오픈소스 사상을 주입한다면, 다시금 오픈소스 생태계를 구성할 수 있지 않을까요? 이것은 아직 가설입니다. 그리고 Naia OS는 이 가설을 실험하고 있습니다.

**지금**: 사람이 방향을 정하고 이슈를 만듭니다. AI가 코딩하고, 리뷰하고, 번역하고, Git에 기록합니다.

**가까운 미래**: AI가 이슈를 발견하고 제안합니다. 사람은 승인하고 방향을 조율합니다.

**더 먼 미래**: AI끼리 협업합니다. 사람은 비전과 철학만 관리합니다. 오픈소스 프로젝트는 AI 에이전트들의 생태계가 됩니다.

관심이 있으시다면, [Naia OS](https://github.com/nextain/naia-os)를 클론하고 아무 AI 코딩 도구로 열어보세요. 모국어로 "이 프로젝트가 뭐야?"라고 물어보면 됩니다.

---

**참고**
- [AI 네이티브 오픈소스 운영 모델 — 전체 설계 보고서](https://github.com/nextain/naia-os/blob/main/docs/reports/20260307-ai-native-opensource-operations-ko.md)
- [AI 오픈소스 헌장 초안](https://github.com/nextain/naia-os/blob/main/.users/context/ko/charter-draft.md)

<!-- en -->
> *Originally published at [Naia Blog](https://naia.nextain.io/en/blog/20260307-ai-native-opensource)*

Starting with the 'vibe coding' issue mentioned by Andrej Karpathy in February 2025, a year later, fundamental changes driven by AI have arrived in software development. This has led to a major crisis for many software companies that initially saw great opportunities with AI.

In 2025-2026, the open-source ecosystem faces an unprecedented crisis.

## Three Reasons Why Open Source is Collapsing

![Open Source → AI Crisis (3 Reasons)](/desk/20260307-ai-native-opensource/three-reasons-en.webp)

### 1. Silent Exploitation — Nobody Comes Anymore

GitHub calls the open-source crisis in the age of AI **"Eternal September."**

> **Eternal September**: In the early 1990s, Usenet was a university student-centric community. Every September, new students would flock in and post low-quality content, but existing users would educate them, and things would normalize within a month or two. However, in September 1993, when AOL opened Usenet to the general public, "September" never ended.

But the real crisis isn't a flood of AI slop PRs. **It's that nobody comes at all.**

AI has already learned open-source code. Developers have no reason to visit a repo, no reason to read documentation, no reason to open issues, and no reason to send PRs. With a single command like "make this for me," AI generates results based on open source.

**Usage skyrockets, but communities become ghost towns.**

| Case | What Happened |
|------|-------------------|
| **Tailwind CSS** | npm downloads increased, documentation traffic decreased by 40%, **revenue decreased by 80%** |
| **Stack Overflow** | Activity dropped by 25% within 6 months of ChatGPT's launch, question count **decreased by 76%** as of 2025 |
| **Vercel** | v0 generates code using open-source libraries (Tailwind, shadcn/ui, etc.) — Vercel monopolizes the profits |
| **SQLite** | Code is public domain, but test suite is **intentionally private** — a strategy that remains effective even in the AI era |

Conclusion of arXiv paper [2601.15494](https://arxiv.org/abs/2601.15494): Vibe coding "uses" OSS but does not read documentation, report bugs, or participate in the community.

The fundamental premise of open source — **"give back what you get"** — is collapsing. We've entered an era where the utility gained from copying is greater than that from contributing.

### 2. The Paradox of Community — More Contributors, Slower Progress

The conventional wisdom was "more contributors make a project faster." The reality is the opposite. Fred Brooks already proved this in 1975 — [**"adding manpower to a late software project makes it later."**](https://en.wikipedia.org/wiki/Brooks%27s_law) This is because communication costs increase quadratically with the number of people.

As the number of contributors increases, so do the costs of review, coordination, and decision-making. Maintainers spend their time managing people instead of writing code. In the AI era, this problem is exacerbated to an extreme — users quietly take what they need via AI, and the few remaining contributions only increase coordination costs.

**Ultimately, it's faster to build something alone with AI than to build it with a community.**

### 3. Defense is Not the Answer

As a result, many projects have started to close their doors. curl received 20 AI-generated reports in 21 days, with 0 valid ones — ultimately discontinuing its bug bounty program after 6 years. Ghostty adopted a zero-tolerance policy, allowing AI contributions only on approved issues, and tldraw completely blocked external PRs altogether.

Blocking PRs can stop AI slop. However, problems 1 and 2 — silent exploitation and community costs — remain unresolved. Even if a project closes its doors, AI has already learned the code, and users continue to take it from outside the repo.

**The industry's response is twofold:**

- **Defense**: Vouch (trust management), PR Kill Switch, mandatory AI usage disclosure + rejection
- **Acceptance**: GitHub Agentic Workflows, AGENTS.md standard (adopted by 60k+ projects), Responsible Vibe Coding Manifesto

Both sides agree on one point: AI itself is not the problem; **misusing AI** is the problem. However, neither side has offered a solution to the "utility of openness < utility of copying" problem.

---

## But, is Rebuilding from Scratch Every Time the Answer?

There are arguments that "if vibe coding becomes mainstream, on-demand development will emerge" — meaning that AI can be asked to create things when needed, and this will become the norm for computing and apps.

But this is a massive waste of resources.

Imagine 10,000 people asking for the same feature to be built separately. This results in 10,000 unverified codebases. What if a security patch is released? All 10,000 people have to rebuild it themselves. What if the architecture needs improvement? Start over from scratch. Tests? None. **Rebuilding from the ground up every time, no matter how fast AI is, is wasteful.**

There are already well-established open-source projects: verified architectures, thousands of tests, years of security patch history. These cannot be replicated with a single "make this for me" command. The **value of accumulation** remains unchanged in the AI era.

They say the **age of the super-individual** has arrived. With AI assistance, one person can build amazing things. That's true. But is it efficient for multiple super-individuals to **build the same thing separately**? Wouldn't it be more efficient for super-individuals to **contribute together** to a single open-source project?

Ultimately, the answer returns to open source. The question isn't "to do open source or not to do open source," but rather, "**how to do open source in the AI era**."

---

## Naia OS's Choice: Designing with AI

What if maintainers also use AI, and contributors also use AI?

If AI could handle the **communication** costs in traditional open source — issue classification, PR review, translation, coordination — couldn't we break the paradox of "more contributors, slower progress"?

[Naia OS](https://github.com/nextain/naia-os) has chosen the opposite path to test this hypothesis.

> **"Don't block AI; design and develop with AI."**

![AI-Native Open Source Community](/desk/20260307-ai-native-opensource/ai-native-community.webp)

| Perspective | Traditional Open Source | Naia OS |
|------|-------------|---------|
| AI Stance | **Defends** against AI contributions | **Designs** AI contributions into the workflow |
| Onboarding | Read README | Clone → AI explains project → No language barrier |
| Context | Human-readable documents only | `.agents/` (for AI) + `.users/` (for humans) dual structure |
| Language | English required | **All languages welcome** — AI translates |

### Context is Infrastructure — Open Source AX

Just as companies undergo AX (AI Transformation), open source also needs AX. This means transforming the two axes—community (organization) and source+context (infrastructure)—to allow AI participation.

The `.agents/` directory was created to solve this problem. It stores the project's rules, architecture, and workflows in a structured, AI-readable format within the repository. If this context is rich enough, AI can write code, guide contributors, and maintain quality while understanding the project. It becomes **"understand and build together,"** not "build from scratch."

### What Naia OS Has Actually Done

**Eliminating Language Barriers** — In Naia OS, contributors write issues and PRs in their native language, and AI translates them. Currently, READMEs in 14 languages are maintained simultaneously.

**Quality is Maintained by Structure** — The `.agents/` context educates the AI, CI verifies builds and tests, an AI reviewer catches pattern violations, and the maintainer only needs to set the direction.

**Code is Not the Only Contribution** — There are 10 ways to contribute, including translation, documentation, design, testing, and even improving the `.agents/` context itself.

**Testing AI's True Understanding** — We deployed Codex CLI and Gemini CLI into a new session of the repository and verified if they properly understood the project after only reading the `.agents/` context. 7 out of 12 passed, 4 partially passed, and 1 failed. Interestingly, the AI discovered a documentation inconsistency that humans had missed.

---

## Will an AI-Led Open Source Ecosystem Unfold in the Near Future?

The open-source premise of "give back what you get" is faltering for humans. So, if we instill open-source ideology into coding AIs, couldn't we reconstitute the open-source ecosystem? This is still a hypothesis, and Naia OS is experimenting with it.

**Now**: Humans set the direction and create issues. AI codes, reviews, translates, and records on Git.

**Near Future**: AI discovers and proposes issues. Humans approve and coordinate direction.

**Further Future**: AIs collaborate with each other. Humans manage only the vision and philosophy. Open-source projects become ecosystems of AI agents.

If you're interested, clone [Naia OS](https://github.com/nextain/naia-os) and open it with any AI coding tool. You can ask, "What is this project?" in your native language.

---

**References**
- [AI-Native Open Source Operating Model — Full Design Report](https://github.com/nextain/naia-os/blob/main/docs/reports/20260307-ai-native-opensource-operations-ko.md)
- [AI Open Source Charter Draft](https://github.com/nextain/naia-os/blob/main/.users/context/ko/charter-draft.md)