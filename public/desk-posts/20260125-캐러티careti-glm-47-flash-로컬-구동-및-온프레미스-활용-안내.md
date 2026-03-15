---
date: "2026-01-25"
titleKo: 캐러티(Careti) GLM-4.7-Flash 로컬 구동 및 온프레미스 활용 안내
titleEn: Careti GLM-4.7
category: ai
tags:
  - 카페루아
images: []
sourceCategoryNo: "180"
sourceCategory: 카페루아
externalUrl: https://blog.naver.com/fstory97/224158661898
---

<!-- ko -->
최근 GLM-4.7-Flash-Latest 모델에 대한 관심과 더불어, 캐러티(Careti)의 로컬 LLM 및 온프레미스 환경 지원에 대한 문의가 많아 실제 구동 영상을 준비했습니다.​

**1. 왜 GLM-4.7-Flash 인가?**GLM-4.7-Flash는 30B 클래스 최강자로, 성능과 효율성의 균형을 맞춘 새로운 경량 배포 옵션(30B-A3B MoE)입니다. 특히 코딩 및 추론 벤치마크에서 타 모델 대비 압도적인 성능을 보여줍니다.

| **Benchmark** | **GLM-4.7-Flash** | **Qwen3-30B-Thinking** | **GPT-OSS-20B** |
| --- | --- | --- | --- |
| AIME 25 | 91.6 | 85.0 | 91.7 |
| GPQA | 75.2 | 73.4 | 71.5 |
| SWE-bench (Verified) | 59.2 | 22.0 | 34.0 |
| τ²-Bench | 79.5 | 49.0 | 47.7 |
| BrowseComp | 42.8 | 2.29 | 28.3 |
| LCB v6 | 64.0 | 66.0 | 61.0 |
| HLE | 14.4 | 9.8 | 10.9 |

특히 실전 코딩 능력을 평가하는 SWE-bench Verified에서 59.2점을 기록하며, 경쟁 모델들을 크게 앞서고 있습니다. 이는 로컬 환경에서도 상용 API 수준의 코딩 에이전트 구동이 가능함을 시사합니다.**2. 로컬 배포 (Serve GLM-4.7-Flash Locally)**GLM-4.7-Flash는 vLLM과 SGLang 추론 프레임워크를 통해 로컬 배포가 가능합니다. 현재 두 프레임워크 모두 메인 브랜치에서 지원하며, 자세한 배포 지침은 공식 GitHub 저장소(zai-org/GLM-4.5)에서 확인할 수 있습니다.**3. 로컬 및 온프레미스 환경에서의 활용**이번 영상은 보안이나 비용 문제로 외부 API 사용이 어려운 환경을 가정하여, RTX 3090 단일 환경에서 Ollama를 통해 로컬 모델을 구동하는 과정을 담고 있습니다.- 수행 작업: 마크다운 뷰어 에디터 개발 계획 문서를 평가하고 후속 작업을 도출하는 실무 시나리오 테스트.
- 테스트 결과: 클라우드 연결 없이도 문서 분석 및 개발 가이드 작성이 원활하게 진행됨을 확인했습니다.
**4. 캐러티(Careti) 업데이트: Thinking UI 적용**현재 배포된 버전에서 Ollama 연동 시 속도가 느리게 느껴졌던 부분은 모델의 추론(Thinking) 과정이 사용자에게 보이지 않았기 때문입니다.- 패치 예정 사항: 영상에 사용된 캐러티는 Thinking 프로세스가 노출되도록 패치된 차기 버전입니다.
**5. 하드웨어별 성능 예상 (RTX 3090 vs 5090)**영상 속 RTX 3090의 구동 속도가 다소 천천히 느껴질 수 있으나, 이는 하드웨어의 메모리 대역폭 한계에 기인합니다. 추후 RTX 5090 도입 시 기대할 수 있는 성능 차이는 다음과 같습니다.

| **구분** | **RTX 3090 (현재 영상)** | **RTX 5090 (예상)** |
| --- | --- | --- |
| 추론 속도 (TPS) | 약 80 ~ 100 TPS | 약 180 ~ 220 TPS |
| 메모리 대역폭 | 936 GB/s | 1,792 GB/s 이상 |
| VRAM 용량 | 24GB | 32GB |

RTX 5090을 사용할 경우 대역폭 상승으로 인해 약 2배 이상의 속도 향상이 예상되며, 늘어난 VRAM 덕분에 더 긴 소스 코드를 한꺼번에 처리하는 데 유리해집니다.​#GLM4.7 #GLM4.7flahs #온프레미스 #sllm #로컬바이브코딩  #바이브코딩 #캐러티 #Careti​​

<!-- en -->
Recently, with growing interest in the GLM-4.7-Flash-Latest model, we've received many inquiries about Careti's support for local LLMs and on-premise environments. Therefore, we've prepared a video demonstrating its operation.

**1. Why GLM-4.7-Flash?**
GLM-4.7-Flash is the strongest contender in the 30B class, a new lightweight deployment option (30B-A3B MoE) that balances performance and efficiency. It demonstrates overwhelming performance compared to other models, especially in coding and inference benchmarks.

| **Benchmark** | **GLM-4.7-Flash** | **Qwen3-30B-Thinking** | **GPT-OSS-20B** |
| --- | --- | --- | --- |
| AIME 25 | 91.6 | 85.0 | 91.7 |
| GPQA | 75.2 | 73.4 | 71.5 |
| SWE-bench (Verified) | 59.2 | 22.0 | 34.0 |
| τ²-Bench | 79.5 | 49.0 | 47.7 |
| BrowseComp | 42.8 | 2.29 | 28.3 |
| LCB v6 | 64.0 | 66.0 | 61.0 |
| HLE | 14.4 | 9.8 | 10.9 |

Notably, it scored 59.2 on SWE-bench Verified, which evaluates practical coding ability, significantly outperforming competing models. This suggests that commercial API-level coding agents can be run even in local environments.

**2. Local Deployment (Serve GLM-4.7-Flash Locally)**
GLM-4.7-Flash can be deployed locally via the vLLM and SGLang inference frameworks. Both frameworks are currently supported in their main branches, and detailed deployment instructions can be found in the official GitHub repository (zai-org/GLM-4.5).

**3. Utilization in Local and On-premise Environments**
This video assumes an environment where external API usage is difficult due to security or cost issues, and it demonstrates running a local model via Ollama in a single RTX 3090 environment.
- Task performed: A practical scenario test involving evaluating a markdown viewer editor development plan document and deriving subsequent tasks.
- Test result: Confirmed that document analysis and development guide creation proceeded smoothly even without cloud connectivity.

**4. Careti Update: Thinking UI Applied**
The reason why the speed felt slow when integrating with Ollama in the currently deployed version was that the model's inference (Thinking) process was not visible to the user.
- Upcoming patch: The Careti version used in the video is a future version patched to expose the Thinking process.
- Improvements: Users can monitor the model's internal logic organization process in real-time, making it easier to understand the workflow and improving perceived waiting times.

**5. Hardware-specific Performance Expectations (RTX 3090 vs 5090)**
While the RTX 3090's operating speed in the video might seem a bit slow, this is due to the hardware's memory bandwidth limitations. The expected performance difference with the future introduction of the RTX 5090 is as follows:

| **Category** | **RTX 3090 (Current Video)** | **RTX 5090 (Expected)** |
| --- | --- | --- |
| Inference Speed (TPS) | Approx. 80 ~ 100 TPS | Approx. 180 ~ 220 TPS |
| Memory Bandwidth | 936 GB/s | 1,792 GB/s or more |
| VRAM Capacity | 24GB | 32GB |

When using the RTX 5090, a speed improvement of more than double is expected due to increased bandwidth, and the expanded VRAM will be advantageous for processing longer source codes at once.

#GLM4.7 #GLM4.7flash #onpremise #sllm #localvibecoding #vibecoding #careti #Careti