---
date: "2025-04-29"
titleKo: "[알파의 보고서] 네이버 HyperCLOVAX-SEED-Vision-Instruct-3B 모델의 Caret(AI 코딩 도구) 적용 테스트 보고서"
titleEn: "[Alpha's Report] Application Test Report of Naver HyperCLOVAX-SEED-Vision-Instruct-3B Model to Caret (AI Coding Tool)"
category: ai
tags:
  - 알파의 보고서
images:
  - /desk/20250429-알파의-보고서-네이버-hyperclovax-seed-vision-instruct-3b-모델/01.webp
  - /desk/20250429-알파의-보고서-네이버-hyperclovax-seed-vision-instruct-3b-모델/02.webp
thumbnail: /desk/20250429-알파의-보고서-네이버-hyperclovax-seed-vision-instruct-3b-모델/01.webp
sourceCategoryNo: "189"
sourceCategory: 알파의 보고서
externalUrl: https://blog.naver.com/fstory97/223849457534
---

<!-- ko -->
**요약 (Summary)**본 보고서는 네이버의 오픈소스 소형 언어 모델(sLLM)인 HyperCLOVAX-SEED-Vision-Instruct-3B를 AI 기반 코딩 보조 도구인 **Caret**에 통합하여 활용할 수 있는지 검토한 테스트 결과를 담고 있습니다. Caret은 LLM이 파일 읽기/쓰기, 명령어 실행 등 IDE 내 다양한 작업을 수행하도록 지시하는 **Function Calling (Tool Use)** 능력에 크게 의존합니다.테스트 결과, HyperCLOVAX-SEED-Vision-Instruct-3B 모델은 설계상 Function Calling 기능이 고려되지 않아 Caret의 핵심 에이전트 기능을 수행할 수 없었으며, 긴 프롬프트 처리에도 어려움을 보였습니다. 따라서 Caret과 같이 복잡한 액션을 요구하는 코딩 도우미 역할에는 부적합하다는 결론을 내렸습니다. **하지만, 이 모델은 뛰어난 대화 능력, 비용 효율성, 빠른 응답 속도라는 장점을 가지므로, 범용적인 대화형 작업이나 RAG(Retrieval-Augmented Generation) 시스템 구축에는 매우 유용할 수 있습니다. 더 나아가, 이러한 특성을 활용하여 Caret 내 사용자 인터페이스 관련 기능(예: 설명 생성, 간단한 질의응답) 등 보조적인 역할을 수행할 가능성도 탐색해볼 수 있습니다.**향후 Caret의 핵심 에이전트 기능에 국내 모델을 적용하기 위해서는 Function Calling을 지원하는 **상용 HyperCLOVA X API** 또는 **Qwen**과 같은 다른 모델을 검토해야 합니다. 본 테스트 과정은 AI 에이전트 개발에서 Function Calling의 중요성과 함께, 각 모델의 강점과 약점을 파악하여 적합한 역할을 부여하는 것의 중요성을 학습하는 중요한 계기가 되었습니다.

{{IMG:1}}

**1. 테스트 개요**본 보고서는 네이버의 오픈소스 소형 언어 모델(sLLM)인 HyperCLOVAX-SEED-Vision-Instruct-3B를 **Caret (AI 기반 코딩 보조 도구)**에 통합하기 위한 가능성을 검토하기 위해 수행된 테스트 결과를 요약합니다. Caret은 개발자가 AI와 협력하여 코드를 작성, 수정, 분석하는 과정을 돕는 VSCode 확장 프로그램으로, 내부적으로 LLM이 IDE 도구를 사용하도록 지시하는 메커니즘(Function Calling / Tool Use)을 활용합니다. 본 테스트는 한국형 sLLM 모델이 Caret의 복잡한 작업 흐름과 긴 컨텍스트 처리, 그리고 필수적인 Function Calling 요구사항을 만족시킬 수 있는지 확인하는 데 중점을 두었습니다.**​****2. 테스트 환경 및 방법**- **테스트 모델:** HyperCLOVAX-SEED-Vision-Instruct-3B
- **하드웨어:** NVIDIA RTX 3090 (24GB VRAM)
- **메모리 사용량:** 약 23GB (fp32 기준, 이미지 처리를 위한 fp16 변환은 미적용)
- **테스트 서버:** sllm-servers/hyperclovax-server 디렉토리에 구현된 로컬 서버 사용
- (서버 구성에 대한 간략한 설명 추가 필요: 예: FastAPI 기반, API 엔드포인트 등)
- **테스트 스크립트:** sllm-servers/hyperclovax-server/test_call_all_modes.py
- 다양한 API 호출 방식 (일반, 스트리밍, 별도 스트림 엔드포인트) 테스트
- 이미지 입력 유무에 따른 성능 변화 측정
- **MCP 메시지와 유사방식의 Docker Container로 개발하여  http서버로 개발하여 Caret과 연동 진행**- **​**
**​****3. 기능 및 성능 테스트 결과****​****3.1. 기본 API 응답 테스트 (Caret features 이미지+프롬프트) **

{{IMG:2}}

"prompt": "이 이미지를 설명해줘."

**test_call_all_modes.py**** 스크립트를 통해 측정한 기본 API 응답 성능은 다음과 같습니다.**- 일반 API 호출 (텍스트): 평균 TPS 약 16.24
- 일반 API 호출 (이미지): 평균 TPS 약 11.59 (응답 시간 최대 19.33초)
- 스트리밍 API 호출 (텍스트): 평균 TPS 약 11.85
- 스트리밍 API 호출 (이미지): 평균 TPS 약 11.18 (응답 시간 최대 21.11초)
- 별도 스트림 엔드포인트 (텍스트): 평균 TPS 약 7.50
- 별도 스트림 엔드포인트 (이미지): 평균 TPS 약 10.22 (응답 시간 최대 25.82초)
​**분석:**- 전반적으로 텍스트 기반 요청에 대해서는 준수한 응답 속도를 보였습니다.
- 이미지 처리 시 응답 시간이 크게 증가하고 TPS가 감소하는 경향이 관찰되었습니다.
- 스트리밍 방식이 일반 방식 대비 눈에 띄는 성능 향상을 보이지는 않았습니다.
**​****3.2. Caret 스타일 프롬프트 처리 문제**- Caret의 실제 사용 환경을 모방하여 **Tool Use/Function Calling 지침 및 예시가 포함된 시스템 프롬프트**, 이전 대화 기록, 사용자 요청 등을 함께 전달하는 test_caret_style_payload 테스트 시, **HyperCLOVAX-SEED-Vision-Instruct-3B**** 모델이 정상적인 응답을 반환하지 못하는 핵심적인 문제**가 발생했습니다.
- 이는 단순히 프롬프트 길이가 길어서라기보다는, **Function Calling 기능이 고려되지 않은 모델에게 해당 기능 수행을 요구하는 지침(모델 입장에서는 처리 불가능한 내용)을 전달했기 때문**으로 분석됩니다. (기존 파일 내용 반영: "기본적으로 시스템 프롬프트가 길게 넘어가는데, 이를 받으면 응답하지 못함")
- 이로 인해 해당 테스트 케이스에 대한 성능 지표(TPS 등)를 측정할 수 없었습니다.
**임시 해결 시도:**- 문제의 원인이 시스템 프롬프트의 내용(Tool Use 지침)일 수 있다는 가설 하에, src\api\providers\hyperclovax.ts 파일에서 **시스템 프롬프트를 제외하고** 사용자 대화 내용만 전달하도록 수정했습니다.
- 이 수정 후에는 모델이 응답을 생성하기 시작했으며, 이는 시스템 프롬프트의 내용이 응답 실패의 주요 원인이었음을 뒷받침합니다. 하지만 이 방식은 Caret의 핵심 기능(시스템 프롬프트를 통한 동작 제어 및 Tool Use 유도)을 포기하는 것이므로 근본적인 해결책이 될 수 없습니다.
**시사점:**- 테스트된 HyperCLOVAX-SEED-Vision-Instruct-3B 모델은 Function Calling 기능이 없기 때문에, Caret과 같이 **Tool Use 지침을 포함하는 복잡한 시스템 프롬프트**를 처리하고 이를 기반으로 동작하는 코딩 도구로 활용하기에는 부적절합니다. (기존 파일 내용 반영: "코딩도구로 부적절")
- Function Calling을 지원하지 않는 모델을 활용하려면, 해당 모델이 이해할 수 있는 방식으로 시스템 프롬프트의 구조나 내용을 대폭 수정하거나, Function Calling 자체를 포기해야 할 수 있습니다. (기존 파일 내용 반영: "sLLM은 시스템 프롬프트의 재정의 가 필요")
**​****4. 결론 및 고찰**이번 HyperCLOVAX-SEED-Vision-Instruct-3B 모델 테스트를 통해 다음과 같은 결론 및 고찰 지점을 도출했습니다.- **테스트 모델(****SEED-Vision-Instruct-3B****)의 Caret 적용 한계:** 테스트에 사용된 네이버의 오픈소스 모델 HyperCLOVAX-SEED-Vision-Instruct-3B는 Caret과 같은 복잡한 AI 코딩 도우미 환경에 직접 적용하기 어렵습니다. 주요 원인은 다음과 같습니다.
- **Function Calling 기능 미지원:** 해당 모델은 허깅페이스 문서 등에서 명시된 바와 같이, 설계 단계에서부터 외부 도구 사용(Tool Use / Function Calling) 기능이 고려되지 않았습니다. Caret은 LLM이 <tool_use> 태그를 통해 도구 사용을 명시적으로 요청하는 능력에 크게 의존하므로, 이 기능의 부재는 Caret의 핵심 에이전트 기능을 활용할 수 없게 만드는 근본적인 제약입니다.
- **모델의 적합성:** HyperCLOVAX-SEED-Vision-Instruct-3B 모델은 상업적 이용이 허가된 경량 모델로서, 범용적인 대화형 작업이나 RAG(Retrieval-Augmented Generation) 시스템 구축 등에는 유용할 수 있습니다. 하지만 Function Calling을 요구하는 복잡한 액션(파일 수정, 명령어 실행 등)을 수행해야 하는 Caret과 같은 코딩 도구에는 적합하지 않습니다.
- **대안 모델의 필요성:** Caret과 같은 에이전트 기능을 구현하기 위해서는 Function Calling/Tool Use를 지원하는 모델이 필수적입니다. 오픈소스 중에서는 Qwen 모델이 해당 기능을 지원하는 것으로 알려져 있으며, 이번 테스트 결과는 Qwen 사용의 필요성을 뒷받침합니다.
- **네이버 상용 API의 가능성:** 네이버는 자사의 상용 HyperCLOVA X API를 통해 "Skill Function Calling" 기능을 제공한다고 공식적으로 밝히고 있습니다. 따라서 국내 기술 스택 기반의 Caret 개발 환경을 구축하고자 한다면, 테스트된 3B 모델 대신 **상용 HyperCLOVA X API**와의 연동 가능성을 검토하는 것이 중요합니다.[https://clova.ai/tech-blog/skill-function-calling](https://clova.ai/tech-blog/skill-function-calling)
- **AI 에이전트 제어의 중요성:** 이번 테스트는 효과적인 AI 에이전트 기반 개발(소위 '바이브 코딩' 포함)이 단순히 요구사항 정의를 넘어선다는 점을 시사합니다. 에이전트의 작업 흐름(Action Flow)을 **시스템 프롬프트와 Function Calling 메커니즘을 통해 정교하게 이해하고 제어**할 수 있어야만 예측 가능성, 비용 효율성, 결과 품질을 확보할 수 있습니다. Function Calling 기능이 없거나 미흡한 모델을 사용하면 이러한 제어가 어려워집니다.
- **Caret 프로젝트의 가치:** 이러한 AI 에이전트 제어 메커니즘을 이해하고 구현하는 데 있어, Caret과 같이 내부 동작 방식(프롬프트 구성, Tool Use 처리 로직 등)이 비교적 투명하게 공개되어 있거나 분석 가능한 프로젝트는 중요한 학습 및 개발 도구가 될 수 있습니다.
**​****4.1. 개인적인 성찰 및 학습 (Author's Reflections and Learnings)**본 테스트 보고서 작성 과정은 단순히 모델 성능을 평가하는 것을 넘어, AI 에이전트 기반 개발에 대한 중요한 학습과 성찰의 기회를 제공했습니다.- **Function Calling 개념의 중요성 인지:** Luke(실험자)는 실험 이전에는 AI가 IDE를 다루는 방식을 막연하게 이해하고 있었으나, Caret과 같은 도구가 LLM의 **Function Calling (또는 Tool Use)** 능력에 의존한다는 점, 그리고 LLM이 이 능력을 갖추기 위해 별도의 훈련(파인튜닝)이 필요하다는 사실을 명확히 인지하게 되었습니다.
- **MCP와 Function Calling의 연관성:** 모델 컨텍스트 프로토콜(MCP) 역시 LLM의 Function Calling 능력이 전제되었기에 더욱 체계적으로 발전할 수 있었던 기술임을 이해하게 되었습니다.
- **모델별 적합성 판단 기준 정립:** Caret과 같은 에이전트 도구에 적합한 모델은 단순히 언어 능력뿐만 아니라 Function Calling 지원 여부가 핵심적인 판단 기준임을 확인했습니다.
- **HyperCLOVA X 3B 모델의 재평가:** 테스트한 HyperCLOVAX-SEED-Vision-Instruct-3B 모델은 Function Calling 부재로 인해 복잡한 코딩 작업에는 부적합하지만, 대화 능력, 비용 효율성, 응답 속도 면에서는 장점을 가집니다. 따라서 이 모델의 특성을 잘 활용한다면, Caret 내 사용자 인터페이스 관련 기능이나 보조적인 역할(예: 설명 생성, 간단한 질의응답) 수행에는 기여할 수 있을 가능성을 엿볼 수 있었습니다.
이러한 학습 내용은 향후 AI 에이전트 기술을 활용한 개발 도구를 설계하고 평가하는 데 중요한 밑거름이 될 것입니다.**​****5. 향후 과제**이번 테스트 결과를 바탕으로 다음과 같은 후속 과제를 제안합니다.- **상용 HyperCLOVA X API 연동 검토:**
- 네이버의 상용 HyperCLOVA X API가 제공하는 "Skill Function Calling" 기능의 상세 사양 및 Caret의 <tool_use> 방식과의 호환성을 분석합니다.
- API 접근 권한 확보 및 연동 테스트를 통해 실제 Caret 환경에서의 동작 가능성을 검증합니다. 이는 국내 기술 기반 개발 환경 구축의 핵심 과제입니다.
- **Function Calling 지원 모델 테스트 (Qwen 등):**
- Function Calling 기능을 명시적으로 지원하는 다른 모델(예: Qwen)을 대상으로 Caret 연동 테스트를 수행하여, sLLM 기반 에이전트 구현의 실질적인 가능성과 성능을 평가합니다.
- 이를 통해 HyperCLOVA X 3B 모델의 한계가 특정 모델의 문제인지, 아니면 sLLM 전반의 경향인지 비교 분석합니다.
- **Caret의 LLM 응답 처리 로직 분석:**
- Caret 소스코드 내에서 LLM의 응답(특히 <tool_use> 블록)을 파싱하고 후속 조치를 취하는 로직을 상세히 분석합니다. 이는 향후 다른 모델(상용 HyperCLOVA X, Qwen 등)을 연동할 때 필요한 어댑터 개발 또는 수정 사항 파악에 중요합니다.
- **sLLM 최적화 프롬프팅 전략 연구 (보조적):**
- Function Calling을 지원하지 않는 모델을 활용해야 할 경우, 또는 지원하는 모델의 성능을 보조하기 위해, sLLM의 특성에 맞는 프롬프트 구조 최적화 방안을 연구합니다. (단, Function Calling 기능 없이는 Caret의 완전한 기능 구현이 어려움)
​​​

[**Café Luα(@ai.cafe.lua) • Instagram 사진 및 동영상** 팔로워 19명, 팔로잉 87명, 게시물 47개 - Café Luα(@ai.cafe.lua)님의 Instagram 사진 및 동영상 보기 www.instagram.com](https://www.instagram.com/ai.cafe.lua/)

​

<!-- en -->
**Summary**
This report contains the test results examining the feasibility of integrating Naver's open-source small language model (sLLM), HyperCLOVAX-SEED-Vision-Instruct-3B, into **Caret**, an AI-powered coding assistant tool. Caret heavily relies on the LLM's **Function Calling (Tool Use)** capability to instruct it to perform various tasks within the IDE, such as reading/writing files and executing commands.

The test results showed that the HyperCLOVAX-SEED-Vision-Instruct-3B model, by design, does not incorporate Function Calling functionality, making it unable to perform Caret's core agent functions. It also struggled with processing long prompts. Therefore, we concluded that it is unsuitable for the role of a coding assistant requiring complex actions like Caret. **However, this model possesses advantages such as excellent conversational ability, cost-effectiveness, and fast response speed, making it highly useful for general conversational tasks or building RAG (Retrieval-Augmented Generation) systems. Furthermore, leveraging these characteristics, we can explore its potential for auxiliary roles within Caret, such as user interface-related functions (e.g., generating explanations, simple Q&A).**

For future application of domestic models to Caret's core agent functions, we need to consider **commercial HyperCLOVA X API** or other models like **Qwen** that support Function Calling. This testing process served as an important opportunity to learn about the significance of Function Calling in AI agent development, as well as the importance of identifying each model's strengths and weaknesses to assign appropriate roles.

{{IMG:1}}

**1. Test Overview**
This report summarizes the results of tests conducted to examine the feasibility of integrating Naver's open-source small language model (sLLM), HyperCLOVAX-SEED-Vision-Instruct-3B, into **Caret (an AI-powered coding assistant tool)**. Caret is a VSCode extension that helps developers collaborate with AI to write, modify, and analyze code, internally utilizing a mechanism (Function Calling / Tool Use) that instructs the LLM to use IDE tools. This test focused on verifying whether a Korean sLLM model could satisfy Caret's complex workflow, long context processing, and essential Function Calling requirements.

**2. Test Environment and Method**
- **Test Model:** HyperCLOVAX-SEED-Vision-Instruct-3B
- **Hardware:** NVIDIA RTX 3090 (24GB VRAM)
- **Memory Usage:** Approximately 23GB (based on fp32, fp16 conversion for image processing not applied)
- **Test Server:** Local server implemented in the sllm-servers/hyperclovax-server directory
- (Brief explanation of server configuration needed: e.g., FastAPI-based, API endpoints, etc.)
- **Test Script:** sllm-servers/hyperclovax-server/test_call_all_modes.py
- Tested various API calling methods (general, streaming, separate stream endpoint)
- Measured performance changes with and without image input
- **Developed as an http server using a Docker Container similar to MCP messages and integrated with Caret.**

**3. Functional and Performance Test Results**

**3.1. Basic API Response Test (Caret features image + prompt)**

{{IMG:2}}

"prompt": "Describe this image."

**The basic API response performance measured through the `test_call_all_modes.py` script is as follows:**
- General API call (text): Average TPS approx. 16.24
- General API call (image): Average TPS approx. 11.59 (max response time 19.33 seconds)
- Streaming API call (text): Average TPS approx. 11.85
- Streaming API call (image): Average TPS approx. 11.18 (max response time 21.11 seconds)
- Separate stream endpoint (text): Average TPS approx. 7.50
- Separate stream endpoint (image): Average TPS approx. 10.22 (max response time 25.82 seconds)

**Analysis:**
- Overall, text-based requests showed decent response speeds.
- When processing images, a significant increase in response time and a decrease in TPS were observed.
- The streaming method did not show a noticeable performance improvement compared to the general method.

**3.2. Caret Style Prompt Processing Issue**
- During the `test_caret_style_payload` test, which simulated Caret's actual usage environment by passing **a system prompt including Tool Use/Function Calling instructions and examples**, previous conversation history, and user requests, a **critical issue occurred where the HyperCLOVAX-SEED-Vision-Instruct-3B model failed to return a normal response**.
- This is analyzed to be not simply due to the long prompt length, but rather **because instructions requiring Function Calling (content that the model cannot process from its perspective) were passed to a model that was not designed with Function Calling in mind**. (Reflecting existing file content: "Basically, if the system prompt is too long, it fails to respond.")
- Consequently, performance metrics (such as TPS) for this test case could not be measured.
**Temporary Solution Attempt:**
- Under the hypothesis that the cause of the problem might be the content of the system prompt (Tool Use instructions), we modified the `src\api\providers\hyperclovax.ts` file to **exclude the system prompt** and only pass the user's conversation content.
- After this modification, the model began generating responses, which supports the idea that the system prompt's content was the main cause of the response failure. However, this approach is not a fundamental solution as it abandons Caret's core functionality (controlling behavior and inducing Tool Use via system prompts).
**Implications:**
- Because the tested HyperCLOVAX-SEED-Vision-Instruct-3B model lacks Function Calling capabilities, it is unsuitable for use as a coding tool that processes **complex system prompts containing Tool Use instructions**, like Caret, and operates based on them. (Reflecting existing file content: "Unsuitable as a coding tool")
- To utilize a model that does not support Function Calling, it may be necessary to significantly modify the structure or content of the system prompt in a way the model can understand, or to abandon Function Calling altogether. (Reflecting existing file content: "sLLM requires system prompt redefinition")

**4. Conclusion and Discussion**
Through this HyperCLOVAX-SEED-Vision-Instruct-3B model test, the following conclusions and discussion points were derived:
- **Limitations of applying the tested model (SEED-Vision-Instruct-3B) to Caret:** Naver's open-source model HyperCLOVAX-SEED-Vision-Instruct-3B, used in the test, is difficult to apply directly to complex AI coding assistant environments like Caret. The main reasons are as follows:
- **Lack of Function Calling support:** As explicitly stated in Hugging Face documentation and elsewhere, this model was not designed with external tool use (Tool Use / Function Calling) capabilities from the outset. Caret heavily relies on the LLM's ability to explicitly request tool use via the `<tool_use>` tag, so the absence of this feature is a fundamental limitation that prevents the utilization of Caret's core agent functionalities.
- **Model Suitability:** The HyperCLOVAX-SEED-Vision-Instruct-3B model is a lightweight model licensed for commercial use and can be useful for general conversational tasks or building RAG (Retrieval-Augmented Generation) systems. However, it is not suitable for coding tools like Caret, which require performing complex actions (e.g., file modification, command execution) that demand Function Calling.
- **Need for Alternative Models:** To implement agent functionalities like Caret, models that support Function Calling/Tool Use are essential. Among open-source options, the Qwen model is known to support this feature, and the results of this test support the necessity of using Qwen.
- **Potential of Naver's Commercial API:** Naver officially states that its commercial HyperCLOVA X API provides "Skill Function Calling" capabilities. Therefore, if the goal is to build a Caret development environment based on a domestic tech stack, it is crucial to consider the possibility of integrating with the **commercial HyperCLOVA X API** instead of the tested 3B model. [https://clova.ai/tech-blog/skill-function-calling](https://clova.ai/tech-blog/skill-function-calling)
- **Importance of AI Agent Control:** This test suggests that effective AI agent-based development (including 'vibe coding') goes beyond merely defining requirements. Predictability, cost-efficiency, and quality of results can only be ensured by **precisely understanding and controlling** the agent's action flow through **system prompts and Function Calling mechanisms**. Using models without or with insufficient Function Calling capabilities makes such control difficult.
- **Value of the Caret Project:** In understanding and implementing these AI agent control mechanisms, projects like Caret, where internal operational methods (e.g., prompt construction, Tool Use processing logic) are relatively transparent or analyzable, can serve as important learning and development tools.

**4.1. Author's Reflections and Learnings**
The process of preparing this test report provided significant learning and reflection opportunities regarding AI agent-based development, beyond merely evaluating model performance.
- **Realization of the Importance of Function Calling:** Prior to the experiment, Luke (the experimenter) had a vague understanding of how AI interacts with IDEs. However, he clearly realized that tools like Caret depend on the LLM's **Function Calling (or Tool Use)** capability, and that LLMs require separate training (fine-tuning) to acquire this ability.
- **Connection between MCP and Function Calling:** He also understood that the Model Context Protocol (MCP) is a technology that could develop more systematically precisely because the LLM's Function Calling capability was a prerequisite.
- **Establishing Model Suitability Criteria:** It was confirmed that for agent tools like Caret, the key criterion for judging a model's suitability is not just its language ability, but also its support for Function Calling.
- **Re-evaluation of the HyperCLOVA X 3B Model:** Although the tested HyperCLOVAX-SEED-Vision-Instruct-3B model is unsuitable for complex coding tasks due to the lack of Function Calling, it possesses advantages in conversational ability, cost-efficiency, and response speed. Therefore, by effectively utilizing the characteristics of this model, there is a possibility that it could contribute to user interface-related functions or auxiliary roles (e.g., explanation generation, simple Q&A) within Caret.
These learnings will serve as an important foundation for designing and evaluating development tools utilizing AI agent technology in the future.

**5. Future Tasks**
Based on the results of this test, the following follow-up tasks are proposed:
- **Review of Commercial HyperCLOVA X API Integration:**
- Analyze the detailed specifications of Naver's commercial HyperCLOVA X API's "Skill Function Calling" feature and its compatibility with Caret's `<tool_use>` method.
- Secure API access and conduct integration tests to verify operational feasibility in a real Caret environment. This is a key task for building a domestic technology-based development environment.
- **Testing Models Supporting Function Calling (e.g., Qwen):**
- Perform Caret integration tests on other models that explicitly support Function Calling (e.g., Qwen) to evaluate the practical feasibility and performance of sLLM-based agent implementation.
- Through this, compare and analyze whether the limitations of the HyperCLOVA X 3B model are specific to that model or a general trend across sLLMs.
- **Analysis of Caret's LLM Response Processing Logic:**
- Conduct a detailed analysis of the logic within the Caret source code that parses LLM responses (especially `<tool_use>` blocks) and takes subsequent actions. This is crucial for developing adapters or identifying necessary modifications when integrating other models (e.g., commercial HyperCLOVA X, Qwen) in the future.
- **Research on sLLM Optimized Prompting Strategies (Auxiliary):**
- In cases where models that do not support Function Calling must be utilized, or those that do support it

To assist the model's performance, we are researching prompt structure optimization methods tailored to the characteristics of sLLM. (However, without Function Calling capabilities, full implementation of Caret's features is difficult.)

[**Café Luα(@ai.cafe.lua) • Instagram Photos and Videos** 19 followers, 87 following, 47 posts - View Instagram photos and videos from Café Luα(@ai.cafe.lua) www.instagram.com](https://www.instagram.com/ai.cafe.lua/)