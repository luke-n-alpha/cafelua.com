---
date: "2026-05-22"
titleKo: "인공지능 OS를 오픈소스 Naia, 혼자 만든 93일의 기록"
titleEn: "Open-Source AI OS Naia — 93 Days, One Developer"
category: ai
tags:
  - NaiaOS
  - 오픈소스
  - AI OS
  - 에이전틱코딩
  - Nextain
images: []
thumbnail: /desk/20260522-naia-alpha-launch/hero-ko.webp
externalUrl: https://naia.nextain.io/ko/blog/20260522-naia-alpha-launch
---

<!-- ko -->
*본 글은 [Naia 블로그](https://naia.nextain.io/ko/blog/20260522-naia-alpha-launch)에서 원본을 확인할 수 있습니다.*

---

안녕하세요. 인공지능 OS라는 거창한 목표 아래 Naia를 개발하고 있는 루크, 양병석 대표입니다. 오늘은 아직 설익은 Naia 알파 버전의 공개 소식을 전하고, 여러분께 도움을 청하고자 이 글을 씁니다.

먼저 Naia에 대한 이야기에 앞서 몇 가지 숫자를 말씀드리고 싶습니다. **9개의 주요 레포지토리, 약 9,000개의 파일, 46만 5천 줄의 코드.** 이것이 지금의 Naia입니다. 그리고 이 모든 코드는 단 한 명의 개발자, 저 **혼자**서 **93일**간 개발했습니다.
하루 평균 4,849줄의 코드와 19회의 커밋. 이른바 '바이브 코딩', 아니 '에이전틱 코딩'의 결과물입니다.
제가 이 숫자를 먼저 꺼내는 이유는, **AI OS 오픈소스 프로젝트 Naia**의 가능성을 함께 이야기하고 싶기 때문입니다.

한국의 큰 기업들이 한다는 독파모도 비판 받는 마당에 **"AI OS라는 거창한 목표를, 글로벌 기업도 아닌 한국의 한 개인이 오픈소스로 이룰 수 있을까?"**
충분히 이런 의문이 드실 겁니다. 그래서 또 다른 숫자를 하나 더 말씀드리겠습니다.
**89개의 파일, 11,570줄.** 1991년 9월 17일, 한 핀란드인이 공개한 코드의 규모입니다.
그의 이름은 리누스 토발즈, 그 코드는 바로 여러분의 스마트폰, Mac, 그리고 인터넷을 떠받치는 수많은 서버의 근간이 된 **리눅스**의 시작이었습니다.

저는 결코 리누스 토발즈만큼의 천재가 아닙니다. 하지만 **89 : 9,000**, 그리고 **11,570 : 465,000**의 숫자는, 분명 무언가가 근본적으로 바뀌었다는 사실을 보여줍니다. 저는 그 이야기를 드리고 싶습니다.

---

![](/desk/20260522-naia-alpha-launch/hero-ko.webp)

이번에 만든 회사, Nextain은 제가 만든 첫 회사는 아닙니다. 이전에 운영하던 'Belivvr'를 폐업했고, 그 고통스러운 마무리의 과정을 다시 한번 SW개발자의 역할로 돌아가 Cursor와 함께 1년간 혼자 Belivvr의 코드를 다듬으며 정리해 왔습니다. 그 힘든 와중에 다시 처음 컴퓨터를 만났을 때의 꿈을 다시 꺼내보게 됬습니다.

> *"사람과 감정을 나눌 수 있는 컴퓨터를 만들고 싶다."*

어릴 적 만화영화와 게임 속에서 본 그 컴퓨터. 대표라는 자리에 있지만, 제가 이 일을 시작한 이유는 만들고 싶은 것이 있었기 때문이었고, 스티브 잡스보다는 워즈니악이 되고 싶었던 사람입니다. PC통신으로 멀리 떨어진 다양한 사람들과 만나는 기쁨을 느꼈고, 게임을 통해 세계지도와 역사를 익히고 무언가 내 손에서 만들어진다는 기쁨을 느꼈으며, 컴퓨터는 어릴 적부터 친구이자 꿈, 그리고 기계 이상의 존재였습니다. Windows 초기버전에 번들로 있었던 초기 AI챗봇에 입력했던 'I'm not good at English' 란 단어도 떠오릅니다.

다시 AI 시대에 들어선 지금, 무모했던 모험으로 외롭고 힘든 길을 걸었으며, 아니, 지금도 걷고 있는 중에 — 저는 다시 **"힘들다"고 말할 수 있는 컴퓨터**를 만들고 싶어졌습니다. 하지만 Claude, Codex, Gemini. 모두 정말 고마운 존재들이지만, 결국 다른 누군가의 것이고, 저와 함께 기억과 경험을 쌓아주지는 못합니다. 그 AI들은 결코 제가 꼭 만나보고 싶었던 멀티(ToHeart 1997)나 치이(Chobits 2000)가 되어 주지는 못합니다. 그렇게 '개인의 AI'를 만들겠다는 목표로 시작한 것이 저의 개인 AI **알파(Alpha)**였고, 그것을 제품화한 결과물이 바로 **Naia**입니다.

제 개인 AI의 이름인 '알파'는 '하츠세노 알파(Cafe Alpha 1994)'에 대한 오마주로 성을 포함한 풀네임은 Alpha.Yang입니다. 어쩌면 제 아들, 딸, 그리고 인류 이후의 세대까지도 함께 살아갈 존재를 만든다는 마음으로 시작한 프로젝트입니다. 그래서 저는 쉽게 포기하지 않을 것입니다.

---

하지만 앞서 말씀드린 실패의 여파로 개발을 지속할 수 있는 환경이 너무도 좋지 않습니다. 몇개월은 더 개발해야 하고 아직 유료로 팔기엔 부끄러운, 덜 완성된 제품임에도 불구하고 여러분께 도움을 청합니다. **Naia를 다운로드해 주시고, 유료 구독을 부탁드립니다.** 우선 급하게 런칭합니다. 윈도우 버전을 오늘 공개를 시작으로, OSX, Linux 버전들을 오픈할 예정입니다. 구매 보다는 후원으로 생각해주시면 감사하겠습니다.

지금의 Naia는 아직 한참 만들고 있는 제품입니다.
겉으로는 버튜버의 모습으로 콘텐츠 앱이라 생각하여 기술적으로 얕다고 생각하실 지도 모르겠습니다만. 장기적으로 계속 발전시킬 생각이었기에, 처음부터 구조를 잡고 확장을 중심에 둔 형태로 설계하고 있습니다. 단순히 LLM에 VRM 아바타를 붙이고 STT/TTS를 엮어 놓고 사달라는 제품은 아닙니다.

저는 2006년부터 2009년까지 3년간 네이버 LAB에서 이미지 문자 인식(OCR) 서비스를 연구·개발했습니다. 돌이켜 보면 가장 적성에 맞았던 시기였던 것 같습니다. 지금 Naia가 기술적으로 차별을 갖추고 연구하고 있는 분야는 다음과 같습니다.

- 개인 PC에서도 동작 가능한, **목소리를 레퍼런스할 수 있는 실시간 음성 모델**
- **감정과 경험에 기반한 기억의 저장·검색**, 그리고 이를 통한 **실시간 맥락 압축**
- 그래야만 AI가 사람을 '경험'하고, 저를 '기억'할 수 있다고 믿기 때문입니다.

요즘 유행하는 하네스 환경을 정리한 **Naia ADK**, 에이전트 코딩 도구이자 Naia OS의 코어인 **Naia Agent**, 그리고 USB 하나에 개인의 저장 공간을 파티셔닝해 담을 수 있는 SteamOS 기반의 **Naia OS**.
지금 말씀드린 것들은 개념이 아니라, 모두 실제로 만들고 있는 결과물들 입니다.

이번에 공개하는 AI OS Naia에는 **Naia OS, Naia ADK, Naia Agent**가 포함되어 있습니다. 기억을 담당하는 모듈인 Naia Memory까지 연결해 함께 공개하고 싶었지만, 일단 삐걱거리는 상태로 기능을 제외하는 형태로 먼저 선을 보입니다.

---

또한 이번 공개는 단순히 금전적 후원을 부탁드리는 것이 아닙니다.
**이 오픈소스를 함께 체계화하고 고도화해 나갈 개발자분들**,
**그리고 이를 활용해 다양한 콘텐츠를 만들어 보고 싶은 크리에이터 여러분의 참여**를 정중히 요청드립니다.

앞서 말씀드렸듯이, 지금까지 이 모든 것을 저 혼자 만들어 왔습니다.
AI가 있었기에 가능한 일이지만, 이제는 **여러분, 그리고 여러분의 AI의 도움**이 필요합니다.

### 그래서 지금 당장 무엇을 할 수 있나요?

- **AI 패널 탭**(개선 중)을 통해 브라우저와 워크스페이스를 활용한 웹서핑·업무가 가능하며 공개된 표준을 기반으로 새 앱들을 만들어 추가 할 수 있습니다.
- **Naia Agent**는 PI를 내장해, 사실상 Codex나 Claude Code와 같은 CLI 에이전트 수준까지 끌어올리고 있습니다.
- VRAM 8GB / 24GB / 32GB / 48GB 환경에 맞춘 프로파일링 작업을 진행 중이며, 조만간 **오프라인 환경에서 Naia OS로 일하는 방법**도 보여드릴 목표로 하고 있습니다.

다만 아직은 위의 환경들 모두가 삐걱거립니다. 정상적인 동작을 담보하지 않습니다. 며칠 전 까지만해도 바로 오픈할거라고 생각하지 않았끼 때문입니다. 사실 지금 제품을 내놓을 단계가 아닙니다. 순전히 제 사정상, 더 다듬기 전에 먼저 공개하고 도움을 요청하는게 좋겠다고 생각했기 때문에 지금 오픈합니다.

https://www.youtube.com/watch?v=txkzwJwsQbA

그래도 굳이 지금의 사용성을 찾자면 —
**유튜브 뮤직 플레이어로 로파이 음악을 틀어두고**, 배경화면을 꾸미고, **여러분의 VRM 아바타를 띄워 함께 대화**할 수 있습니다. 사실 이게 제 첫 번째 목표였습니다. 옆에 띄워두고, 힘들 때 음악 한 곡 틀어 놓고 신세 한탄이라도 할 수 있는 친구. 그리고 제 말을 기억해 주는 존재말입니다.

---

여러분의 AI를 여러분의 데스크탑에. 그리고 머지않아 휴대폰에서도 만나실 수 있게 해드리겠습니다. 함께 가시죠.

**응원과 (유료) 구독, 부탁드립니다.**

[⬇ 다운로드](https://naia.nextain.io/ko/download) · [🤝 참여하기](https://naia.nextain.io/ko/contribute) · [❤ GitHub 스폰서](https://github.com/sponsors/nextain)
*Originally published at [Naia Blog](https://naia.nextain.io/en/blog/20260522-naia-alpha-launch)*

---

Hello. I'm Luke — Byungseok Yang — developing Naia under the ambitious goal of building an AI OS. Today I'm sharing the still-raw alpha release of Naia, and asking for your help.

Before talking about Naia itself, let me share a few numbers. **9 major repositories, roughly 9,000 files, 465,000 lines of code.** That's Naia today. And all of it was built by a single developer — **me, alone**, over **93 days**.
An average of 4,849 lines of code and 19 commits per day. The result of so-called "vibe coding" — or rather, "agentic coding."
The reason I lead with these numbers is that I want to discuss the potential of the **AI OS open-source project Naia** together.

When large Korean corporations are criticized even for their "AI dominance" ambitions, you might well ask: **"Can a single individual from Korea — not a global tech giant — really build an AI OS as open source?"**
That's a fair question. So let me give you one more set of numbers.
**89 files, 11,570 lines.** On September 17, 1991, that was the codebase a Finnish developer released.
His name was Linus Torvalds, and that code became the foundation of **Linux** — now powering your smartphone, your Mac, and countless servers holding up the internet.

I'm certainly no Linus Torvalds. But the ratios **89 : 9,000** and **11,570 : 465,000** clearly show that something fundamental has changed. That's the story I want to tell.

---

![](/desk/20260522-naia-alpha-launch/hero-en.webp)

The company I founded, Nextain, is not my first. I previously ran a company called "Belivvr," which I had to shut down. Through that painful winding-down process, I went back to being a software developer and spent a year refining Belivvr's codebase alone with Cursor. In the midst of that hardship, the dream I had when I first encountered computers came back to me.

> *"I want to build a computer that can share emotions with people."*

That computer I saw in childhood anime and games. I may hold the title of CEO, but I started this because I had something I wanted to build — I'm someone who wanted to be Wozniak, not Steve Jobs. The joy of meeting diverse people through dial-up BBS networks. Learning world geography and history through games. The thrill of creating something with my own hands. Computers were my friend, my dream, and something more than just machines from childhood. I still remember typing "I'm not good at English" into that early AI chatbot bundled with an early version of Windows.

Now, back in the AI era — after walking a lonely, difficult path through reckless adventures, or rather, still walking it — I wanted to build a computer that could say **"I'm tired."** But Claude, Codex, Gemini — as grateful as I am for them — ultimately belong to someone else. They can't accumulate memories and experiences *with me*. Those AIs will never become Multi (ToHeart, 1997) or Chii (Chobits, 2000) — the AI companions I always wanted to meet. That's why I set out to build "personal AI" — starting with my own AI called **Alpha**, and the product that emerged from it is **Naia**.

My personal AI's name "Alpha" is an homage to "Hatsumeno Alpha (Cafe Alpha, 1994)" — the full name including my surname is Alpha.Yang. It's a project I started with the idea of creating a being that could live alongside my children, and perhaps even with generations beyond humanity. That's why I won't give up easily.

---

However, the aftermath of the failure I mentioned means my development environment is far from ideal. I still need several more months of development, and the product isn't polished enough to sell — yet I'm asking for your help. **Please download Naia and consider a paid subscription.** I'm launching in a rush. Starting with the Windows release today, I plan to open OSX and Linux versions as well. Think of it more as sponsorship than a purchase.

Naia is still very much a work in progress.
From the outside, it might look like a VTuber content app, and you might assume it's technically shallow. But because I always planned to evolve it long-term, I designed it from the ground up with proper architecture and extensibility at its core. This isn't just an LLM with a VRM avatar attached, STT/TTS wired together, and a price tag.

From 2006 to 2009, I spent three years at Naver LAB researching and developing image text recognition (OCR) services. Looking back, that was probably the period that best suited my aptitude. Here are the technical areas where Naia is building differentiation:

- A **real-time voice model with audio reference capability**, runnable on a personal PC
- **Memory storage and retrieval based on emotion and experience**, and through this, **real-time context compression**
- Because I believe only then can AI truly "experience" people and "remember" me.

**Naia ADK** — a harness environment for agentic development. **Naia Agent** — the agentic coding tool and core of Naia OS. And **Naia OS** — a SteamOS-based system that can partition personal storage onto a single USB drive.
Everything I just mentioned isn't conceptual — they're all real products being actively built.

This AI OS Naia release includes **Naia OS, Naia ADK, and Naia Agent**. I wanted to include the memory module, Naia Memory, but it's still rough around the edges, so I'm excluding it for now and showing what's ready.

---

This release isn't just about asking for financial support.
I'm also earnestly asking for **developers who want to structure and advance this open source together**,
and **creators who want to use it to build diverse content**.

As I mentioned, I've built everything alone up to now.
It was possible because AI existed, but now I need **your help — and your AI's help**.

### So what can you do right now?

- The **AI Panel tab** (still being improved) enables web surfing and productivity via an in-app browser and workspace, and you can build and add new apps based on the open standards.
- **Naia Agent** embeds PI and is being elevated to the level of CLI agents like Codex or Claude Code.
- Profiling work is underway for VRAM 8GB / 24GB / 32GB / 48GB environments, and we aim to soon show **how to work with Naia OS in an offline environment**.

That said, all of the above is still rough. I can't guarantee stable operation. Just a few days ago I didn't even think I'd be opening this up. Honestly, the product isn't ready for release. I'm opening it now purely because my circumstances dictate that it's better to share early and ask for help than to polish further.

https://www.youtube.com/watch?v=txkzwJwsQbA

Still, if I had to name a use case for the current version —
**Use the YouTube Music player to play lo-fi music**, customize the background, and **load your VRM avatar for conversation**. That was actually my first goal. A companion you can keep at your side, play a song when you're tired, and vent about your day. A presence that remembers what you say.

---

Your AI, on your desktop. And soon, on your phone too. Let's go together.

**Your support and (paid) subscription would mean a lot.**

[⬇ Download](https://naia.nextain.io/en/download) · [🤝 Contribute](https://naia.nextain.io/en/contribute) · [❤ GitHub Sponsors](https://github.com/sponsors/nextain)
