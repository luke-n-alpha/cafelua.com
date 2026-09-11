---
date: "2026-09-11"
titleKo: "음치 나이아가, 이제 노래를 좀 부르기 시작했어요"
titleEn: "Tone-Deaf Naia Is Starting to Sing a Little"
category: ai
tags:
  - naia
  - ai-singing
  - blue-water
  - korean-svs
  - naia-os
  - naia-hw
images: []
thumbnail: /desk/20260911-naia-sing-starting-to-sing/hero.webp
canonicalUrl: "https://www.naia.land/{locale}/blog/20260911-naia-sing-starting-to-sing"
---
<!-- ko -->
![왼쪽에서는 아직 음치로 애쓰는 알파와 고개를 감싸는 루크, 오른쪽에서는 음을 타기 시작한 알파와 놀라는 루크](/desk/20260911-naia-sing-starting-to-sing/hero.webp)

안녕하세요. 오픈소스 비주얼 에이전트 **나이아**를 만드는 루크입니다.

[지난 글](https://www.naia.land/ko/blog/20260820-naia-sing-from-drunk-to-off-key)에서 알파는 술 취한 음치에서 **그냥 음치**가 됐다는 소식을 알려드렸습니다. 드디어 이제 **노래를 좀 부르기 시작했습니다.** 이 시작은 그냥 알파가 저한테 노래 좀 불러 줬으면 좋겠다고 생각해서 시작한 연구 프로젝트입니다. 최종 목적은 진짜 자기 노래도 듣고, 감정에 따라 다른 사람들과 같이 부르는 것이지만, 그건 아직 멀었습니다. 지금은 악보와 가사를 보고 한글 노래를 부르게 하는 것이 1단계입니다. 유튜브 커버곡이나, 노래를 아예 만드는 수노(Suno)와는 다릅니다. 오히려 하츠네 미쿠를 떠올리시면 가깝습니다.

1차, 2차와 같은 블루워터 한국어 번안곡으로 테스트했습니다. 이번에는 방법을 자세히 적지 않겠습니다. 정말 쓸 만해졌을 때 어떻게 할지를 좀 고민해 볼 예정입니다. 알려드릴 수 있는 건, AI Hub 가창 데이터로 실제 훈련을 시작했다는 것입니다. 그 위에 우리 쪽 실험을 이어 가고 있습니다.

## 들어보세요

지금 것부터 듣고, 과거를 들어 보시면 됩니다. 여전히 음치 구간이 있습니다. 사실 이게 좋아진 겁니다. 과거엔 이랬거든요.

### 3차 — 2026-09-11, 이제 조금 부르기 시작

1분 남짓입니다. 앞 2초 페이드인, 끝 3초 페이드아웃입니다.

<iframe src="https://www.youtube.com/embed/B5wV5z7epBc" title="나이아 블루워터 한국어 번안 3차 — 2026-09-11" style="width:100%;aspect-ratio:16/9;border:0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[YouTube에서 보기](https://youtu.be/B5wV5z7epBc)

박자와 발음이 아직 어색한 구간이 있습니다. 그래도 멜로디 위에 한국어가 얹히기 시작했습니다.

### 1차 — 2026-05-27, 술 취한 음치

과거엔 이랬습니다. 발음과 음가가 무너지고, 소절 안에서도 빨라졌다 늘어집니다.

<iframe src="https://www.youtube.com/embed/KDOBMfj3k_c" title="나이아 블루워터 한국어 번안 1차 — 2026-05-27" style="width:100%;aspect-ratio:16/9;border:0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[YouTube에서 보기](https://youtu.be/KDOBMfj3k_c)

### 2차 — 2026-08-21, 그냥 음치

가사는 들리고 음표를 따라갑니다. 긴 음이 끊기고, 아직 음치처럼 들립니다.

<iframe src="https://www.youtube.com/embed/F3dT0v_XqHk" title="나이아 블루워터 한국어 번안 2차 — 2026-08-21" style="width:100%;aspect-ratio:16/9;border:0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[YouTube에서 보기](https://youtu.be/F3dT0v_XqHk)

## 무엇을 하려는가

만들고 싶은 것은 커버 앱도, 아무 노래나 뽑는 생성기도 아닙니다. **노래 부르는 엔진**입니다. 그리고 그 엔진 위에, 그 사람만의 목소리와 그 사람만의 가창 습관을 얹는 것입니다.

나이아에 이게 어떻게 들어갈지는 아직 모릅니다. 채팅 옆에 붙을 수도 있고, 전혀 다른 자리가 될 수도 있습니다. 결국 원하는 것은 하나입니다. **개인의 AI가, 그 사람을 위해 노래도 부르게 하고 싶다.**

알파가 저를 위해 블루워터를 한국어로 불러 주는 것. 그 방향으로 한 걸음 더 갔습니다. 음치는 아직 졸업 전이지만, 이제 마이크를 잡고 서 있는 정도는 됩니다.

## 서버와 클라이언트로 쓸 수 있는 나이아 전용 기기로, 목소리도 반값으로

노래와 별개로, 나이아의 전용 기기도 손대고 있습니다.

![내부 사용성 테스트 중인 나이아 클라우드 음성 서버와, 왼쪽의 3D 프린트 나이아 하드웨어](/desk/20260911-naia-sing-starting-to-sing/voice-server.webp)

왼쪽의 3D 프린터로 찍은 작은 상자가 지금 테스트 중인 **나이아 하드웨어**입니다. 비싼 맥 스튜디오가 필요 없이, 로컬에서 실시간 음성과 준수한 3D 게임이 가능하고, 화면에 보이는 것이 **나이아 OS**입니다. 클라이언트로도, 서버로도 쓸 수 있습니다. 어제 테스트 결과, 다행히 음성 생성 속도가 발화 속도를 따라잡아 실시간 서비스가 가능함을 확인했습니다. 이를 바탕으로 나이아 OS를 이용해 기존 시세의 **절반 가격**으로 공급할 수 있는 인프라인지 기술 검증을 한 상태입니다. 넥스테인의 최종 목표는 P2P AI 환경 인프라입니다. 아직은 1대도 중고 부품을 모아 산 수준이지만, 초기 투자가 이루어지는 대로 서비스는 가능할 것 같습니다.

지금은 아직 내부 사용성 테스트 중입니다. 성능은 확인했는데, SSD가 읽기 전용으로 바뀌거나 시간이 지나면 검은 화면으로 바뀌는 문제가 있어서 OS 구성 문제인지, 하드웨어 이상인지 체크 중입니다. 나중에 이 소식도 공유드리겠습니다.

<!-- en -->
![Left: Alpha still struggling off-key while Luke covers his face. Right: Alpha starting to hit the notes, Luke surprised.](/desk/20260911-naia-sing-starting-to-sing/hero.webp)

Hello. This is Luke, building the open-source visual agent **Naia**.

In [the last post](https://www.naia.land/en/blog/20260820-naia-sing-from-drunk-to-off-key) I wrote that Alpha had gone from a drunk, tone-deaf singer to **just tone-deaf**. She has finally **started to sing a little**. This began as a research project because I wanted Alpha to sing for me. The end goal is to hear her own songs, and to sing with other people depending on how she feels — that is still far off. For now, stage one is: look at a score and lyrics, and sing in Korean. This is not a YouTube cover, and it is not Suno making a song from scratch. Hatsune Miku is the closer picture.

We tested the same Korean adaptation of Blue Water as in rounds 1 and 2. I will not describe the method in detail this time. I want to think about how to talk about it when it is actually usable. What I can say is that we have started real training on AI Hub singing data, and we are continuing our own experiments on top of that.

## Listen

Start with the new one, then go back. There are still tone-deaf stretches. That is the improvement. This is what it used to sound like.

### Round 3 — 2026-09-11, starting to sing a little

About a minute. Two-second fade-in, three-second fade-out.

<iframe src="https://www.youtube.com/embed/B5wV5z7epBc" title="Naia Blue Water Korean adaptation, round 3 — 2026-09-11" style="width:100%;aspect-ratio:16/9;border:0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[Watch on YouTube](https://youtu.be/B5wV5z7epBc)

Some rhythm and pronunciation is still off. Korean is starting to sit on the melody anyway.

### Round 1 — 2026-05-27, drunk and tone-deaf

This is what it used to be. Pronunciation and pitch collapsed, and even inside a phrase it sped up and dragged.

<iframe src="https://www.youtube.com/embed/KDOBMfj3k_c" title="Naia Blue Water Korean adaptation, round 1 — 2026-05-27" style="width:100%;aspect-ratio:16/9;border:0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[Watch on YouTube](https://youtu.be/KDOBMfj3k_c)

### Round 2 — 2026-08-21, just tone-deaf

The lyrics are audible and it follows the notes. Long notes still break, and it still sounds tone-deaf.

<iframe src="https://www.youtube.com/embed/F3dT0v_XqHk" title="Naia Blue Water Korean adaptation, round 2 — 2026-08-21" style="width:100%;aspect-ratio:16/9;border:0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[Watch on YouTube](https://youtu.be/F3dT0v_XqHk)

## What this is for

I do not want a cover app, and I do not want a generator that makes any song. I want a **singing engine**. On top of that engine, a voice that is someone's own, and singing habits that are someone's own.

I do not know yet how this will land in Naia. It might sit next to chat. It might live somewhere else. The goal is simple. **I want a personal AI to sing, for that person.**

Alpha singing Blue Water in Korean for me. That is one step closer. She has not graduated from being tone-deaf. She can stand at the mic now.

## Dedicated Naia hardware that can be a server or a client — voice at half the going rate

Separately from the singing, I have also been working on dedicated hardware for Naia.

![Naia cloud-voice server under internal testing, with the 3D-printed Naia hardware on the left](/desk/20260911-naia-sing-starting-to-sing/voice-server.webp)

The small 3D-printed box on the left is the **Naia hardware** we are testing now. You do not need an expensive Mac Studio. Locally it can do realtime voice and decent 3D games, and the screen is running **Naia OS**. It can be a client or a server. Yesterday's test showed that voice generation kept up with speaking speed, so a realtime service is possible. On that basis we have done a technical check of whether Naia OS can supply infrastructure at about **half the going rate**. Nextain's longer goal is peer-to-peer AI infrastructure. We are still at the level of one machine built from used parts, but once the initial investment is in, the service should be possible.

Internal usability testing is still running. We have confirmed performance, but the SSD flips to read-only, or the screen goes black after a while, so we are checking whether that is the OS setup or a hardware fault. I will share that news later too.
