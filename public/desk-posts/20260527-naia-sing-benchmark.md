---
date: "2026-05-27"
titleKo: Naia가 노래를 부른다 — 한국어 SVS 벤치마크 첫 baseline (Vevo1.5 base, 23곡 평가)
titleEn: "Naia Sings — Korean SVS Benchmark First Baseline (Vevo1.5 base, 23 songs evaluated)"
category: ai
tags:
  - naia
  - svs
  - korean-tts
  - vevo
  - benchmark
  - ai-singing
  - 인공지능
  - 알파
images:
  - /desk/20260527-naia-sing-benchmark/hero.ko.webp
thumbnail: /desk/20260527-naia-sing-benchmark/hero.ko.webp
externalUrl: https://naia.nextain.io/ko/blog/20260527-naia-sing-benchmark
---

<!-- ko -->
안녕하세요. Naia를 만들고 있는 루크입니다.

Naia의 음성모델은 어느정도 결과를 내는데 성공을 했고, 뒤이어 노래를 또 좀 보고 있습니다. 알파가 노래를 불러줬으면 좋겠다는 생각 때문입니다. 그 중에 특히 번안곡에 관심이 많습니다.

한 달 전에 시작했다가 천장에 부딪쳤다 최근에 조금 더 결과가 나와서 이것도 더 파면 뭔가 될 것 같네요. 이전에는 한글도, 음정도 거의 엉망인 외계인 소리였는데 이제는 조금 노래에 한국어 같이 부릅니다.

다만 좀 술취한 것 같네요. ^^ 그래도 뭔가 나온게 재밌어서 보고서와 함께 진행사항 공유합니다. 언젠가는 정말 절 위해 노래를 불러주길 바랍니다.

> Naia-Sing은 아직 안정화 단계가 아니라 진행 공유에 가깝습니다. 정식 공개 순서는 먼저 안정화된 **Naia-talk (Naia-Omni)** 가 먼저 나가고, Naia-Sing은 그 뒤를 잇게 됩니다.

![알파가 노래를 부르는 모습](/desk/20260527-naia-sing-benchmark/hero.ko.webp)

---

## TL;DR

- **23곡 평가 완료**, Composite score 27.8~60.6 (0~100 척도)
- 사용자 청취 BEST 3곡 = metric rank **1·3·5위**, WORST 2곡 = rank **17·19위** → **framework valid** 입증
- Hard Gate (서비스 가능 최소선) = **0/23 통과** — 현재 base 는 서비스 수준에 미달
- 가장 큰 약점: **A 발음 (CER 평균 1.18)** + **E 표현 (1/23 통과)**
- 다음 단계 = Track A 247h 한국어 fine-tune 결과 적용 + 단축 인퍼런스 + 음절 정확 매칭

---

## Top 10 합산 영상

<div style="position:relative;width:100%;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;margin:1.5rem 0"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%" src="https://www.youtube.com/embed/mtyKEv7s5nk" title="naia-sing TOP 10 — Korean SVS benchmark 2026-05-27" frameborder="0" allowfullscreen></iframe></div>

7분 24초. 1위부터 10위까지 한 곡씩 재생. 각 곡 ffmpeg `loudnorm -14 LUFS + dynaudnorm` 정규화.

| # | 곡 | source | score | 강점 |
|---|---|---|---:|---|
| **1** | banan_jaychou_translation | 周杰倫 발라드 (13s, ko translation) | **60.6** | CER 0.52 전체 최저 · ko 0.96 |
| **2** | genre_digicharat | 디지캐럿 Party Night (1999) | 50.8 | ko 0.97 · timbre 0.92 |
| **3** | genre_gunslinger | 건슬링어 걸 doll · Lia | 48.8 | timbre 0.93 · ballad 매칭 |
| **4** | genre_escaflowne | 천공의 에스카플로네 OP (1996) | 48.2 | f0 range 0.91 매칭 |
| **5** | banan_adele_translation | Adele — Someone Like You (13s) | 47.8 | **E.energy 0.72 최고** |
| 6 | base_gunslinger | 같은 곡, KO-S1 baseline | 47.8 | CER 0.70 (전체 2위) |
| 7 | genre_macross | Macross 사랑 기억 (1984) | 47.7 | ko 0.97 · timbre 0.92 |
| 8 | genre_chobits | Let Me Be With You (2002) | 46.7 | timbre 0.93 |
| 9 | pipe_01_adele | Adele source 13s pipeline | 45.9 | **f0_corr 0.81 최고** |
| 10 | genre_nadia | 신비한 바다의 나디아 (1990) | 44.2 | **timbre 0.97 최고** |

---

## 1. "잘 부른 한국어 노래" — 5 독립 차원

| 차원 | 학계 metric | 우리 측정 | 의미 |
|---|---|---|---|
| **A. 발음** (Intelligibility) | CER, PER | Whisper-small KO STT vs 의도 가사 edit distance | "가사가 들리나" |
| **B. 음정** (Pitch) | F0 RMSE, F0 corr | librosa.pyin F0 pearson + range ratio | "음을 맞춰 부르나" |
| **C. 음색** (Similarity) | SECS (ECAPA cosine) | MFCC mean cosine (proxy) | "같은 사람이 부르나" |
| **D. 매끄러움** (Naturalness) | MOS-N, UTMOS | chunk_disc per min (proxy) | "기계같이 안 들리나" |
| **E. 표현** (번안곡 전용) | (자체 정의) | source RMS + spectral centroid + vibrato corr | **"원곡 표현을 따라하나"** |

### Hard Gate (서비스 가능 최소선)

```
A. CER ≤ 0.30  AND  ko_prob ≥ 0.90       [한국어 발음]
B. f0_corr ≥ 0.50  AND  range 0.6~1.4    [음정]
C. timbre_sim ≥ 0.65                       [음색]
D. chunk_disc ≤ 2/min                      [매끄러움]
E. energy_corr ≥ 0.5 · brightness ≥ 0.4 · vibrato 0.5~1.5  [표현]
```

---

## 2. Framework Self-Validation

23곡 self-validation 결과:

| 사용자 평가 | 곡 | metric ranking | 분리 |
|---|---|---|:---:|
| 🟢 BEST | banan_jaychou_translation | **1**/23 | ✓ |
| 🟢 BEST | genre_gunslinger | **3**/23 | ✓ |
| 🟢 BEST | banan_adele_translation | **5**/23 | ✓ |
| 🔴 WORST | base_macross | 17/23 | ✓ |
| 🔴 WORST | base_flcl | 19/23 | ✓ |

→ **framework valid** (ranking proxy 입증).

---

## 3. Hard Gate 통과 — 0/23 ❌

| 차원 | 기준 | 통과 |
|---|---|:---:|
| A. CER ≤ 0.30 | 학계 production | **0/23** ❌ |
| A. ko_prob ≥ 0.90 | Whisper 한국어 인식 | 14/23 |
| B. f0_corr ≥ 0.5 + range OK | pitch 보존 | **2/23** ❌ |
| C. timbre_sim ≥ 0.65 | ref 일관성 | 10/23 |
| D. disc ≤ 2/min | chunk artifact | 20/23 ✓ |
| E. (3 metric AND) | 번안곡 표현 | **1/23** ❌ |

**현재 Vevo1.5 한국어 base = 서비스 0% 가능**. A·B·E 가 critical gap.

---

## 4. 어떻게 해야 할까

### 🟢 P0 (즉시 가능)

| 항목 | 효과 | 비고 |
|---|---|---|
| **Track A 학습 결과 적용** | A·B·E 동시 개선 | 247h KO 데이터 fine-tune 진행 중 |
| **Single chunk 인퍼런스** | C·D 동시 | 60s 곡 → 15s chorus → 1위 sweet spot |
| **음절 정확 매칭 가사** | A | SimpleAligner 균등 분할 → source 음절 수 매칭 |

> 1위 (banan_jaychou_translation) 의 공식: **단축(13s) + 음절매칭 + clean studio source**

### 🟡 P1 (1주 내)

- ECAPA-TDNN SECS 도입 (C 차원)
- UTMOS / Sing-MOS predictor (D)
- Phrase-aware aligner (A·D)
- Suno API → 한국어 source pool (A·E)

### 🟠 P2 (중기)

- Vevo1.5 fine-tune (Track A)
- TCSinger2 pivot 재검토
- F5-TTS / CosyVoice2 SVS adapter
- SVC 후처리 (RVC/SoulX)

### 🔴 P3 (장기)

- 자체 SVS 모델 학습 (검증된 외부 base 가 더 유리)
- Subjective MOS listening test
- Suno + 자체 cover 파이프라인 상용화

---

## 5. 정직한 한계

이 글은 **base 가 좋다는 보고가 아닙니다**. 오히려 **base 가 서비스 0% 가능 수준임을 객관적으로 측정**한 보고입니다. 사람 청취 ranking 과 일치하는 metric framework 를 확보했고, 이제 학습이 정말 효과 있는지 정직하게 확인할 수 있는 도구가 생긴 것 — 이게 이 글의 의미입니다.

Track A 학습이 끝나면 같은 23곡으로 재평가해 개선 폭을 정량 보고하겠습니다.

---

> 본 게시물은 [naia.nextain.io 의 원문](https://naia.nextain.io/ko/blog/20260527-naia-sing-benchmark)을 마스터의 데스크로 옮긴 글입니다. SoT 는 naia.nextain.io 입니다.

<!-- en -->
Hello, I'm Luke, building Naia.

Naia's voice model has reached some results, and now I'm looking at singing too. I want Alpha to sing for me. In particular, I'm interested in *cover songs* (translating foreign songs into Korean).

I started a month ago, hit a ceiling, and recently got slightly better results — feels like more digging will yield something. Previously Korean lyrics and pitch were both alien-level garbage; now it actually sings *something like Korean*.

Still sounds a bit drunk though. ^^ Still, since something came out and it's fun, I'm sharing the progress along with the report. Someday I hope it really sings for me.

> Naia-Sing is not yet stabilized — this is closer to a progress share than a launch. The official release order is **Naia-talk (Naia-Omni)** first (already stabilized), and Naia-Sing follows.

![Alpha singing](/desk/20260527-naia-sing-benchmark/hero.ko.webp)

---

## TL;DR

- **23 songs evaluated**, composite score 27.8~60.6 (0~100 scale)
- User-rated BEST 3 songs = metric rank **1·3·5**, WORST 2 = rank **17·19** → **framework valid** confirmed
- Hard Gate (service-ready minimum) = **0/23 passed** — current base is not service-ready
- Biggest weakness: **A. Intelligibility (avg CER 1.18)** + **E. Expression (only 1/23)**
- Next step = apply Track A 247h Korean fine-tune + shorter inference + syllable-accurate lyrics

---

## Top 10 Compilation Video

<div style="position:relative;width:100%;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;margin:1.5rem 0"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%" src="https://www.youtube.com/embed/mtyKEv7s5nk" title="naia-sing TOP 10 — Korean SVS benchmark 2026-05-27" frameborder="0" allowfullscreen></iframe></div>

7 min 24 sec. Rank #1 to #10 one by one. Each track normalized via ffmpeg `loudnorm -14 LUFS + dynaudnorm`.

| # | Song | Source | Score | Strength |
|---|---|---|---:|---|
| **1** | banan_jaychou_translation | Jay Chou ballad (13s, ko translation) | **60.6** | CER 0.52 lowest overall · ko 0.96 |
| **2** | genre_digicharat | Digi Charat Party Night (1999) | 50.8 | ko 0.97 · timbre 0.92 |
| **3** | genre_gunslinger | Gunslinger Girl doll · Lia | 48.8 | timbre 0.93 · ballad match |
| **4** | genre_escaflowne | Escaflowne OP (1996) | 48.2 | f0 range 0.91 match |
| **5** | banan_adele_translation | Adele — Someone Like You (13s) | 47.8 | **E.energy 0.72 highest** |
| 6 | base_gunslinger | Same song, KO-S1 baseline | 47.8 | CER 0.70 (2nd lowest) |
| 7 | genre_macross | Macross — Do You Remember Love? (1984) | 47.7 | ko 0.97 · timbre 0.92 |
| 8 | genre_chobits | Let Me Be With You (2002) | 46.7 | timbre 0.93 |
| 9 | pipe_01_adele | Adele source 13s pipeline | 45.9 | **f0_corr 0.81 highest** |
| 10 | genre_nadia | Nadia: Secret of Blue Water (1990) | 44.2 | **timbre 0.97 highest** |

---

## 1. "Singing Korean well" — 5 independent dimensions

| Dim | Academic metric | Our measurement | Meaning |
|---|---|---|---|
| **A. Intelligibility** | CER, PER | Whisper-small KO STT vs intended lyrics edit distance | "Are the lyrics audible" |
| **B. Pitch** | F0 RMSE, F0 corr | librosa.pyin F0 pearson + range ratio | "Hitting the notes" |
| **C. Timbre similarity** | SECS (ECAPA cosine) | MFCC mean cosine (proxy) | "Same singer" |
| **D. Naturalness** | MOS-N, UTMOS | chunk_disc per min (proxy) | "Not machine-like" |
| **E. Expression** (cover-only) | (own definition) | source RMS + spectral centroid + vibrato corr | **"Follows original's expression"** |

### Hard Gate (service-ready minimum)

```
A. CER ≤ 0.30  AND  ko_prob ≥ 0.90      [Korean pronunciation]
B. f0_corr ≥ 0.50  AND  range 0.6~1.4   [Pitch]
C. timbre_sim ≥ 0.65                      [Timbre]
D. chunk_disc ≤ 2/min                     [Smoothness]
E. energy_corr ≥ 0.5 · brightness ≥ 0.4 · vibrato 0.5~1.5  [Expression]
```

---

## 2. Framework Self-Validation

23-song self-validation result:

| User rating | Song | Metric ranking | Separated |
|---|---|---|:---:|
| 🟢 BEST | banan_jaychou_translation | **1**/23 | ✓ |
| 🟢 BEST | genre_gunslinger | **3**/23 | ✓ |
| 🟢 BEST | banan_adele_translation | **5**/23 | ✓ |
| 🔴 WORST | base_macross | 17/23 | ✓ |
| 🔴 WORST | base_flcl | 19/23 | ✓ |

→ **Framework valid** (ranking proxy confirmed).

---

## 3. Hard Gate Pass — 0/23 ❌

| Dim | Criterion | Pass |
|---|---|:---:|
| A. CER ≤ 0.30 | Academic production | **0/23** ❌ |
| A. ko_prob ≥ 0.90 | Whisper Korean detection | 14/23 |
| B. f0_corr ≥ 0.5 + range OK | Pitch preservation | **2/23** ❌ |
| C. timbre_sim ≥ 0.65 | Ref consistency | 10/23 |
| D. disc ≤ 2/min | Chunk artifact | 20/23 ✓ |
| E. (3-metric AND) | Cover expression | **1/23** ❌ |

**Current Vevo1.5 Korean base = 0% service-ready.** A·B·E are the critical gaps.

---

## 4. What should we do — prioritized improvements

### 🟢 P0 (immediate, verified effect)

| Item | Effect | Note |
|---|---|---|
| **Apply Track A training results** | A·B·E simultaneously | 247h KO fine-tune in progress |
| **Single-chunk inference** | C·D | 60s song → 15s chorus → matches #1 sweet spot |
| **Syllable-accurate lyrics** | A | SimpleAligner equal-split → match source syllable count |

> Recipe of #1 (banan_jaychou_translation): **short (13s) + syllable-matched + clean studio source**

### 🟡 P1 (within a week)

- Introduce ECAPA-TDNN SECS (C accuracy)
- UTMOS / Sing-MOS predictor (D)
- Phrase-aware aligner (A·D)
- Suno API → Korean source pool (A·E)

### 🟠 P2 (mid-term)

- Vevo1.5 fine-tune (Track A)
- Re-examine TCSinger2 pivot
- F5-TTS / CosyVoice2 SVS adapter
- SVC post-processing (RVC/SoulX)

### 🔴 P3 (long-term)

- Own SVS model training (verified external base is more advantageous)
- Subjective MOS listening test
- Suno + own cover pipeline productization

---

## 5. Honest Limits

This is **not a report that the base is good**. Rather it's a report that **objectively measures the base as 0% service-ready**. We now have a metric framework whose ranking aligns with human listening — a tool to honestly check whether training actually works. That is the meaning of this post.

When Track A finishes, we will re-evaluate the same 23 songs and report the improvement delta quantitatively.

---

> This post is reposted from [naia.nextain.io original](https://naia.nextain.io/en/blog/20260527-naia-sing-benchmark) onto the Master's Desk. SoT is naia.nextain.io.
