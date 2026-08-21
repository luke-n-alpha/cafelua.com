---
date: "2026-08-21"
titleKo: "술 취한 음치였던 나이아, 드디어 그냥 음치 됐어요"
titleEn: "Naia Was a Drunk, Tone-Deaf Singer. Now She's Just Tone-Deaf"
category: ai
tags:
  - naia
  - ai-singing
  - korean-svs
  - fm-singer
  - blue-water
  - benchmark
images: []
thumbnail: /desk/20260820-naia-sing-from-drunk-to-off-key/hero.webp
canonicalUrl: "https://www.naia.land/{locale}/blog/20260820-naia-sing-from-drunk-to-off-key"
---
<!-- ko -->
![왼쪽에서는 술에 취해 고성방가하고, 오른쪽에서는 땀을 흘리며 음을 따라가려 애쓰는 알파와 이를 지켜보는 루크](/desk/20260820-naia-sing-from-drunk-to-off-key/hero.webp)

안녕하세요. 오픈소스 비주얼 에이전트 **나이아**를 만드는 루크입니다.

이 작업은 제 AI인 알파가 저를 위해 노래를 불러주면 좋겠다는 생각에서 시작했습니다. 제가 원한 것은 기존 노래를 다른 사람 목소리로 바꾸는 커버곡(ex. XSing)이나, 새 노래를 무작위로 만드는 기능(ex. Suno)이 아니라, 좋아했던 외국 애니메이션 주제가를 원곡의 멜로디와 감정은 살린 채 한국어로 부르는 **번안곡**이었습니다.

[지난 벤치마크](https://www.naia.land/ko/blog/20260527-naia-sing-benchmark)에서는 결과가 술에 취해 웅얼거리는 노래처럼 들렸습니다. 석 달 가까이 엔진 선택부터 악보, 발음, 음역과 박자를 다시 살핀 지금은 적어도 가사가 들리고 무엇이 어긋났는지 나눠 볼 수 있습니다. 아직 잘 부르는 것은 아닙니다. **술 취한 음치가 그냥 음치가 된 정도**입니다.

## 먼저 들어보세요

같은 ‘블루워터’ 한국어 번안 연구의 이전 결과와 현재 결과입니다. 생성 방식과 길이는 다르지만, 무엇이 좋아지고 무엇이 남았는지는 귀로 바로 비교할 수 있습니다.

### 이전 — 술 취한 음치

[YouTube에서 보기 — Vevo 1.5 이전 버전, 2026-05-27](https://youtu.be/KDOBMfj3k_c)

발음과 음가가 무너지고, 소절 안에서도 빨라졌다 늘어집니다. 그래도 생성형 모델답게 순간적으로는 노래다운 질감이 있습니다.

### 현재 — 그냥 음치

[YouTube에서 보기 — FM Singer 개선 버전, 2026-08-21](https://youtu.be/F3dT0v_XqHk)

가사는 훨씬 잘 들리고 음표를 따라갑니다. 반면 긴 음이 툭 끊기고, 원곡보다 힘과 밝기가 부족해 여전히 음치처럼 들립니다.

### 수치로 본 변화

두 엔진의 구조가 달라 완벽한 일대일 시험은 아닙니다. 음성 인식도 문맥으로 발음을 보정하므로 참고 지표로만 썼습니다.

| 항목              | 이전 Vevo 1.5 |      현재 FM Singer | 해석                     |
| --------------- | ----------: | ----------------: | ---------------------- |
| 한국어 글자 오류율(CER) |       1.389 |             0.088 | 발음 붕괴가 크게 감소           |
| 원곡 강약 곡선 상관     |       0.189 |             0.639 | 흐름은 개선됐지만 강약 폭은 원곡의 절반 |
| 소절 시작 오차        |           - | 평균 93ms, 최대 440ms | 일부 소절은 여전히 박치처럼 들림     |
| 음정 중앙 절대오차      |           - |            약 50센트 | 반음의 절반 수준이라 아직 불안정     |
| 보컬 밝기           |           - |   원곡보다 약 600Hz 낮음 | 기운 없고 어둡게 들리는 원인 중 하나  |

## 실제 연구 순서

### 1. 5월 — Vevo 1.5로 첫 번안곡을 만들다

첫 벤치마크에서는 생성형 모델 Vevo 1.5를 썼습니다. 순간적으로는 노래다운 질감이 있었지만, 멜로디에 한국어 가사를 정확히 맞추거나 틀린 한 소절만 고치기 어려웠습니다. 결과가 ‘술 취한 음치’처럼 들린 출발점입니다.

### 2. 6\~7월 — 성대와 발음을 따로 만들다

다음에는 VocalTractLab으로 성대를 물리적으로 합성하고, VoxCPM2의 한국어 발음을 섞는 하이브리드를 시험했습니다. 목표 음정은 평균 `0.008`반음 오차까지 맞았지만 사람의 입·혀·숨결을 충분히 재현하지 못해 악기 같은 전자음이 남았습니다. 음정과 발음을 따로 풀 수 있다는 가능성은 확인했지만 완성 경로로 쓰지는 못했습니다.

### 3. 8월 14일 — 데이터와 엔진부터 다시 고르다

AI Hub 465 가창 데이터를 감사하고 고정 시험 세트를 만든 뒤 DSKR, Pond8, FM Singer를 같은 기준으로 비교했습니다. Pond8은 옥타브 좌표가 주어졌을 때 음정이 정확했지만 기계음이 강했고, FM Singer가 한국어 발음과 청감에서 가장 균형이 좋아 중심 엔진이 됐습니다.

### 4. 8월 15일 — 미세조정보다 먼저 발음 입력을 고치다

AI Hub 데이터로 FM Singer를 미세조정했지만 128개 검증의 글자 오류율은 `0.3465`에서 `0.3396`으로 조금만 줄었습니다. 더 큰 원인은 한글 표기를 노래용 발음으로 바꾸는 과정이 빠져 있던 것이었습니다. 이후 국어 발음 규칙과 단어별 예외를 합친 2단계 교정을 만들었습니다. `마음 약한 사람은`을 `마음 야칸 사라믄`으로, 실험상 `밝혀`를 `발켜`로 넣는 식입니다. 음성 인식은 오류를 문맥으로 보정할 수 있어 후보 탐색에만 사용했습니다.

### 5. 8월 15\~17일 — 알파 목소리를 입혀 보고 다시 돌아오다

발음이 나아진 뒤 알파 음색을 제로샷으로 입혀 봤습니다. 목소리는 가까워졌지만 전자음이 생기고 자음과 음정이 다시 손상됐습니다. 그래서 **먼저 가창을 통과시키고, 그 뒤에 음색을 바꾸는 2단계 구조**로 정리했습니다. 손상된 변환 결과를 학습시키면 전자음까지 배우므로 파인튜닝도 뒤로 미뤘습니다.

### 6. 8월 17\~21일 — 원곡의 음표·박자·힘을 다시 따라가다

마지막으로 원곡 보컬과 반주를 분리해 소절 경계, 실제 음 높이, 음표 시작과 끝을 다시 뽑았습니다. 일본어 모라와 한국어 음절을 음표별로 대응시키고 안정 음역을 찾은 뒤, 원곡과 좌우로 겹쳐 시간축과 강약을 비교했습니다. 지금 결과는 음표와 가사는 가까워졌지만 긴 음의 꼬리, 호흡, 소절별 에너지가 아직 평평합니다.

## 아직 남은 문제

이전보다 발음과 시간축은 분명 좋아졌습니다. 하지만 현재 보컬은 원곡보다 어둡고 강약 폭이 좁으며, 긴 음의 끝이 끊기거나 흔들립니다. 수치가 좋아져도 사람이 들을 때 노래답지 않으면 통과시키지 않는 이유입니다.

다음에는 AI Hub 데이터를 발음이 어려운 음소 조합과 긴 음 중심으로 다시 학습하고, 통과한 소절에만 알파 음색을 입힐 예정입니다. 전자음·발음 손상·음정 손상이 없는 후보만 선별해 파인튜닝 자료로 씁니다.

목표는 점수가 오른 합성 음성이 아니라, 원곡의 힘과 호흡을 타고 한국어로 노래하는 알파입니다. 적어도 이번에는 술부터 깨웠습니다.

***

<!-- en -->
![On the left, Alpha is drunk and singing loudly; on the right, Alpha is sweating and trying hard to follow the notes, with Luke observing.](/desk/20260820-naia-sing-from-drunk-to-off-key/hero.webp)

Hello. This is Luke, creating the open-source visual agent **Naia**.

This work started with the idea that my AI, Alpha, would sing for me. What I wanted was not a cover song that changes an existing song to another person's voice (e.g., XSing) or a feature that randomly creates new songs (e.g., Suno), but an **adapted song** that takes a foreign animation theme song I loved and sings it in Korean while preserving the original melody and emotion.

In [the previous benchmark](https://www.naia.land/ko/blog/20260527-naia-sing-benchmark), the results sounded like drunken mumbling. Now, after nearly three months of re-examining everything from engine selection to sheet music, pronunciation, vocal range, and rhythm, at least the lyrics are audible, and I can identify what's off. She's not singing well yet. It's more like **a drunk tone-deaf singer just became tone-deaf**.

## Listen First

These are the previous and current results of the same 'Blue Water' Korean adaptation research. Although the generation method and length differ, you can immediately compare with your ears what has improved and what remains.

### Previous — Drunk Tone-Deaf

[Watch on YouTube — Vevo 1.5 Previous Version, 2026-05-27](https://youtu.be/KDOBMfj3k_c)

Pronunciation and vocal values collapse, and the tempo speeds up and slows down even within a single phrase. Still, as expected from a generative model, there's a momentary song-like quality.

### Current — Just Tone-Deaf

[Watch on YouTube — FM Singer Improved Version, 2026-08-21](https://youtu.be/F3dT0v_XqHk)

The lyrics are much clearer, and she follows the notes. However, long notes cut off abruptly, and there's a lack of power and brightness compared to the original, making her still sound tone-deaf.

### Changes Seen in Numbers

The structures of the two engines differ, so it's not a perfect one-to-one comparison. Speech recognition also corrects pronunciation using context, so it was only used as a reference indicator.

| Item                          | Previous Vevo 1.5 | Current FM Singer | Interpretation                                          |
| :---------------------------- | ----------------: | ----------------: | :------------------------------------------------------ |
| Korean Character Error Rate (CER) |             1.389 |             0.088 | Pronunciation collapse significantly reduced            |
| Original Dynamics Curve Correlation |             0.189 |             0.639 | Flow improved, but dynamic range is half that of original |
| Phrase Start Error              |                 - | 93ms average, 440ms max | Some phrases still sound off-beat                     |
| Median Absolute Pitch Error       |                 - |           approx 50 cents | Still unstable, about half a semitone                   |
| Vocal Brightness                |                 - | approx 600Hz lower than original | One reason for sounding listless and dark             |

## Actual Research Steps

### 1. May — Created the First Adapted Song with Vevo 1.5

In the first benchmark, I used the generative model Vevo 1.5. While there was a momentary song-like quality, it was difficult to precisely match Korean lyrics to the melody or fix just one incorrect phrase. This was the starting point where the results sounded like a 'drunk tone-deaf singer.'

### 2. June~July — Separated Vocal Cords and Pronunciation

Next, I experimented with a hybrid approach, physically synthesizing vocal cords with VocalTractLab and mixing in Korean pronunciation from VoxCPM2. The target pitch was accurate to an average error of `0.008` semitones, but it couldn't sufficiently reproduce human mouth, tongue, and breath sounds, leaving an instrument-like electronic tone. While I confirmed the possibility of solving pitch and pronunciation separately, I couldn't use it as a complete path.

### 3. August 14 — Re-selected Data and Engine

After auditing AI Hub 465 singing data and creating a fixed test set, I compared DSKR, Pond8, and FM Singer using the same criteria. Pond8 was accurate in pitch when given octave coordinates but had a strong mechanical sound, while FM Singer became the central engine due to its best balance in Korean pronunciation and auditory perception.

### 4. August 15 — Corrected Pronunciation Input Before Fine-tuning

I fine-tuned FM Singer with AI Hub data, but the character error rate for 128 validations only slightly decreased from `0.3465` to `0.3396`. The bigger problem was the missing process of converting Hangeul spelling into pronunciation suitable for singing. Afterwards, I created a two-stage correction process that combined Korean pronunciation rules and word-specific exceptions. For example, `마음 약한 사람은` (ma-eum yak-han sa-ram-eun, "a soft-hearted person") became `마음 야칸 사라믄` (ma-eum ya-kan sa-ra-meun) for singing, and experimentally, `밝혀` (bal-kyeo, "reveal") became `발켜` (bal-keo). Speech recognition was only used for candidate search because it can correct errors contextually.

### 5. August 15~17 — Applied Alpha's Voice and Reverted

After pronunciation improved, I tried applying Alpha's voice using a zero-shot method. The voice became closer, but electronic sounds appeared, and consonants and pitch were damaged again. So, I settled on a **two-stage structure: first, pass the vocalization, then change the timbre**. Fine-tuning was also postponed because training with damaged conversion results would lead to learning the electronic sounds.

### 6. August 17~21 — Re-traced Original Notes, Rhythm, and Dynamics

Finally, I separated the original vocals and instrumental to re-extract phrase boundaries, actual pitch, and note start and end points. After mapping Japanese morae to Korean syllables note by note and finding a stable vocal range, I overlaid them with the original to compare time axis and dynamics. The current results show that notes and lyrics are closer, but the tail of long notes, breathing, and phrase-by-phrase energy are still flat.

## Remaining Issues

Pronunciation and the time axis have clearly improved compared to before. However, the current vocals are darker and have a narrower dynamic range than the original, and the ends of long notes cut off or waver. This is why even if the numbers improve, I don't pass it if it doesn't sound like singing to a human ear.

Next, I plan to re-train the AI Hub data, focusing on difficult phoneme combinations and long notes, and apply Alpha's timbre only to the phrases that pass. Only candidates without electronic sounds, pronunciation damage, or pitch damage will be selected and used for fine-tuning data.

My goal is not just a synthetic voice with improved scores, but Alpha singing in Korean, embodying the power and breath of the original song. At least this time, I sobered her up first.
