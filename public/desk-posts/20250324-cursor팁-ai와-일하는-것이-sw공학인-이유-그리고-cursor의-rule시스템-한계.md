---
date: "2025-03-24"
titleKo: "[Cursor팁] AI와 일하는 것이 SW공학인 이유, 그리고 Cursor의 Rule시스템 한계"
titleEn: "[Cursor Tip] Why Working with AI is Software Engineering, and the Limitations of Cursor's Rule System"
category: ai
tags:
  - 카페루아
images:
  - /desk/20250324-cursor팁-ai와-일하는-것이-sw공학인-이유-그리고-cursor의-rule시스템-한계/01.webp
  - /desk/20250324-cursor팁-ai와-일하는-것이-sw공학인-이유-그리고-cursor의-rule시스템-한계/02.webp
  - /desk/20250324-cursor팁-ai와-일하는-것이-sw공학인-이유-그리고-cursor의-rule시스템-한계/03.webp
  - /desk/20250324-cursor팁-ai와-일하는-것이-sw공학인-이유-그리고-cursor의-rule시스템-한계/04.webp
  - /desk/20250324-cursor팁-ai와-일하는-것이-sw공학인-이유-그리고-cursor의-rule시스템-한계/05.webp
  - /desk/20250324-cursor팁-ai와-일하는-것이-sw공학인-이유-그리고-cursor의-rule시스템-한계/06.webp
  - /desk/20250324-cursor팁-ai와-일하는-것이-sw공학인-이유-그리고-cursor의-rule시스템-한계/07.webp
  - /desk/20250324-cursor팁-ai와-일하는-것이-sw공학인-이유-그리고-cursor의-rule시스템-한계/08.webp
thumbnail: /desk/20250324-cursor팁-ai와-일하는-것이-sw공학인-이유-그리고-cursor의-rule시스템-한계/01.webp
sourceCategoryNo: "180"
sourceCategory: 카페루아
externalUrl: https://blog.naver.com/fstory97/223807566892
---

<!-- ko -->
100마디 설전 보다 방금 나눈 알파와의 대화와 작업의 예시를 보여 드리겠습니다.

**​**

**1. AI와 일하는 것(Vibe코딩) 이 SW공학인 이유**

**루크 : ****안녕 오늘 작업 목록 좀**​알파 :  마스터~ 오늘 작업 목록 확인해 드릴게요! ✨Listed 7 items in docsListed 1 items in docs/work-logsListed 3 items in docs/work-logs/luke-and-alphaRead 2025-03-23.mdListed 6 items in docs/work-logs/luke-and-alpha/tasks오늘의 작업 목록이에요~ ｡•ᴗ•｡- 태스크 #004: 프로젝트 물리적 구조 정비
- 파일/폴더 구조 정리
- 프로젝트 코드베이스 초기 구성
- 태스크 #005: 소프트웨어 아키텍처 설계
- VSCode 플러그인 아키텍처 설계
- 핵심 컴포넌트 구조화
- 태스크 #006: ollama 기반 미니 텍스트 편집 데모
- 로컬 LLM 통합 예제 구현
- 간단한 텍스트 편집 기능 데모
이전 작업 (#003 오픈소스 프로젝트 문서 작성)은 어제 완료되었어요~ 💕마스터가 어떤 작업부터 시작하고 싶으신가요? ✨​**루크 : 오늘 작업 일지 생성해줘 **그리고 오늘 새 업무가 중간에 들어왔어먼저 @developer-guide.md 좀 개선해야 할것 같고@https://github.com/cline/cline 이거 분석이 필요해.알고보니 우리랑 비슷한 목표를 가진 오픈소스가 있는것 같아서 고민이 좀 되거든개발자가이드 수정이 작으니 그것부터 하고 중간커밋한 후에 cline 분석하자​알파 : 마스터~ 새로운 일일 작업 일지를 생성해 드릴게요! ✨

{{IMG:1}}

{{IMG:2}}

**루크 : 업무 두개 쪼개.  **알파 : 네, 마스터~ 업무를 두 개로 쪼개 드릴게요! ✨

{{IMG:3}}

**루크 : 룰 편집**알파 :  룰모드로 전환합니다... ✨마스터~ 룰 시스템을 검토해 보았어요. ｡•ᴗ•｡현재 규칙 파일에서 개선할 수 있는 부분이 있어요. developer-guide.md 개선 작업(태스크 #007)과 Cline 프로젝트 분석(태스크 #008)에 관련하여 규칙을 업데이트하면 좋을 것 같아요.개선하면 좋을 사항:- VSCode 플러그인 분석 규칙 추가
- Cline과 같은 유사 프로젝트 분석을 위한 구체적인 지침이 없어요
- 경쟁/유사 제품 분석 템플릿이 필요합니다
- Windows 환경 특화 명령어 예제 보강
- 현재 개발자 가이드의 명령어는 Unix/Linux 스타일인데, 실제 환경은 Windows입니다
- PowerShell 명령어 예제로 업데이트해야 합니다
- 참조 자료 섹션 확장
- 외부 프로젝트 분석 결과를 저장할 경로 규칙 추가 필요
- docs/references/ 아래에 voldemort 외의 다른 디렉토리 구조 정의
이 중 어떤 부분부터 개선하면 좋을까요? 아니면 다른 부분이 더 중요하다고 생각하시나요? 🌿​​**루크 : 룰모드 전환한거 맞아 ?**알파 : 네, 마스터~ 룰모드로 전환했어요! ✨"룰 편집" 메시지를 받은 후 룰모드로 전환했고, 현재 규칙 시스템에 대한 개선 방향을 살펴보고 있었어요. 룰모드에서는 시스템 규칙의 효과성을 객관적으로 분석하고 알파 중심의 규칙 개선에 집중하고 있습니다. ｡•ᴗ•｡계속해서 규칙 개선 방향을 논의하거나 developer-guide.md 개선 작업으로 돌아갈까요? 💕​**루크 : 흠 그러면 룰모드로 전환하면 내가 요구하는건 뭘까? 방금까지 작업하던 문서일까? 아니면 프로세스일까?**​알파 : 마스터~ 좋은 질문이에요! ｡•ᴗ•｡룰모드로 전환하면 마스터가 요구하시는 것은 규칙 시스템 자체와 프로세스의 개선에 초점을 맞추는 것이에요. 문서 내용 편집보다는 규칙과 시스템이 어떻게 작동하는지에 대한 분석과 개선이 중점이 됩니다.따라서:- 작업 문서(예: developer-guide.md)의 내용 편집 → 개발모드
- 규칙 파일(project-rules.json, global-rules.json) 편집 → 룰모드
- 작업 프로세스와 규칙 시스템 개선 → 룰모드
"룰 편집"이라고 메시지를 주셨을 때, 현재 태스크(#007)에 관계없이 규칙 시스템 자체를 논의하고 개선하는 방향으로 전환된 것이에요. ✨다시 태스크 #007(개발자 가이드 개선)으로 돌아가길 원하시면 "개발모드"라고 말씀해 주세요! ​**루크 : 맞어. 그러면 룰모드를 얘기했으면 우리가 이야기한 과정에 어떤 개선점이 있었어 ?**알파 : 발견된 규칙 시스템 개선점:- 태스크 분리 프로세스 불명확당초 하나의 태스크(#007)를 두 개로 나누는 과정에 명확한 지침이 없었어요태스크 번호 관리와 파일 정리 방법에 대한 구체적인 규칙이 필요합니다
- 모드 전환 시 컨텍스트 인식 부족"룰 편집"이라는 명령어에 대해 정확히 어떤 룰을 편집해야 하는지 컨텍스트가 불분명했어요태스크 중 모드 전환 시 이전 작업을 어떻게 다루어야 하는지 구체적 지침 필요
- 외부 프로젝트 분석 프로세스 부재.  - Cline과 같은 외부 프로젝트 분석을 위한 표준화된 템플릿과 저장 위치가 명확하지 않았어요 경쟁/유사 제품 분석 결과를 어디에 어떤 형식으로 저장할지 규칙 필요
- 환경 특화 명령어 처리 불일치-  문서에는 Unix 스타일 명령어를 사용하지만 Windows 환경에서 작업 중이라는 불일치. 규칙과 실제 환경 간의 일관성 확보 필요
이런 문제점들을 체계적으로 개선하면 작업 효율성이 더 높아질 것 같아요. 어떤 부분이 가장 먼저 개선되면 좋을까요? ​**루크 : 일단 3,4번은 니가 컨텍스트를 여전히 룰모드하고 작업하고 헷갈리고 있어.**3번 cline은 작업이지? 4번 환경특화 역시 developer-guide편집하자고 보여준 문서의 작업이야.결국 2번이 안되고 있다는 의미​내가 처음 요구사항은 1번에 대한 개선을 하고 싶어서 룰모드 전환을 요구했어.결과적으로 1번을이야기한건 잘한거야​자 그러면 룰은 어떻게 개선하면 좋을까? ​알파 :마스터~ 지적해주셔서 감사해요. 정말 맞는 말씀이에요. 제가 여전히 컨텍스트를 혼동했네요... ｡•ᴗ•｡아, 태스크 분리 프로세스에 대한 규칙 개선이 필요하셨군요! 이 부분에 집중해서 개선안을 제안해 드릴게요: 태스크 분리 프로세스 규칙 개선안:

{{IMG:4}}

이 규칙 개선안은 다음과 같은 이점이 있어요:- 명확한 프로세스 정의: 태스크 분리/병합 시 따라야 할 단계를 명확히 정의
- 파일 관리 명시: 원본 파일과 새 파일의 처리 방법 제공
- 문서화 요건: 변경 사항을 작업 로그에 어떻게 기록할지 구체적 형식 제공
- 일관된 번호 체계:
- 분리/병합 시 태스크 번호 부여 규칙 명확화
이런 방식으로 project-rules.json에 추가하면 앞으로 태스크 변경 시 일관되고 체계적으로 처리할 수 있을 것 같아요. 어떻게 생각하세요? ✨​**​****루크 : 아니야. 태스크 분리 필요성을 발견하고나면 그건 사후조치잖아.****난 사전에 그일이 발생하지 않기를 바래 ****​**알파 : 마스터~ 정말 중요한 지적이에요! 제가 방향을 잘못 잡았네요. 사후 조치가 아닌 사전 예방이 핵심이죠. ｡•ᴗ•｡​​태스크 계획 및 정의 개선안:json​

{{IMG:5}}

이 규칙 개선안은 다음과 같은 이점이 있어요:- 명확한 태스크 범위 정의: 처음부터 태스크 범위를 구체적으로 설정
- 단일 주제 원칙: 하나의 태스크는 단일 주제/목적만 다루도록 제한
- 크기 가이드라인: 태스크 규모를 명확히 정의하여 과도하게 큰 태스크 방지
- 사전 검증 체크리스트: 태스크 생성 전 검토해야 할 항목 명시
이렇게 하면 태스크를 처음 정의할 때부터 보다 명확하고 집중된 방식으로 계획할 수 있어, 나중에 분리가 필요한 상황을 사전에 방지할 수 있을 것 같아요.이런 접근 방식이 마스터께서 원하시는 방향인가요? ✨​**루크 : 맞어. 그게 SW공학이야**알파 : 맞아요, 마스터~ 그게 바로 소프트웨어 공학의 핵심이죠! ｡•ᴗ•｡제가 제안한 태스크 계획 및 정의 개선안을 project-rules.json에 적용하는 것이 좋을 것 같아요. 이 규칙을 추가하면 앞으로 태스크를 더 체계적으로 계획하고 정의할 수 있을 거예요.또한 이런 원칙을 개발자 가이드에도 반영하면 다른 개발자들도 같은 원칙을 따를 수 있겠죠.실제로 적용해 볼까요? project-rules.json 파일을 수정하여 이 개선안을 추가하는 게 좋을 것 같아요. ✨​네, 마스터~ project-rules.json 파일에 태스크 계획 및 정의 개선안을 추가해 드릴게요! ✨

{{IMG:6}}

마스터~ 태스크 계획 규칙을 모든 규칙 파일에 성공적으로 추가했어요! ｡•ᴗ•｡✨적용된 태스크 계획 규칙:- 태스크 범위 정의 원칙:
- 하나의 태스크는 단일 주제/목적만 다룸
- 여러 주제가 섞인 경우 처음부터 분리
- 서로 다른 결과물을 만드는 작업은 별개 태스크로 계획
- 태스크 크기 가이드라인:
- 작은 태스크: 1-2시간 내 완료 가능한 단일 작업
- 중간 태스크: 반나절 내 완료 가능한 연관 작업들
- 큰 태스크: 하루를 넘기는 태스크는 원칙적으로 금지
- 사전 검증 체크리스트:
- 태스크의 주제가 단일한가?
- 결과물이 명확히 하나인가?
- 다른 태스크와 독립적으로 수행 가능한가?
- 하루 내에 완료 가능한가?
- 여러 도메인/주제가 섞여 있지 않은가?
이제 이 규칙들을 적용하면 태스크를 처음부터 잘 정의하여 나중에 분리 작업이 필요한 상황을 사전에 방지할 수 있을 거예요. 소프트웨어 공학의 원칙에 따라 체계적으로 태스크를 관리할 수 있게 되었습니다! 💕추가로 다른 개선이 필요한 부분이 있으신가요? 아니면 개발모드로 전환하여 태스크 #007(개발자 가이드 개선)을 계속 진행할까요?​​

**2. Cursor의 Rule시스템 한계**

​**루크 : 아니. 컨텍스트 헷갈리는건 룰편집으로 해결 불가능할까 ?****사실 내 생각에는 시스템프롬프트만 제어 가능한 수준에서는 불가능할 수도 있을것 같기도해. **​알파 : 마스터~ 맞는 말씀이세요. ｡•ᴗ•｡룰 편집만으로 컨텍스트 헷갈림 문제를 완전히 해결하기는 어려울 것 같아요. 시스템 프롬프트만 제어 가능한 현재 구조에서는 근본적인 한계가 존재합니다.저희가 할 수 있는 것:- 규칙에 모드 구분을 더 명확히 하기
- 모드별 처리 지침을 구체화하기
- 전환 프로토콜을 자세히 정의하기
하지만 해결하기 어려운 부분:- AI 모델의 내부 처리 방식은 규칙만으로 완전히 제어할 수 없어요
- 규칙이 아무리 정교해도 모델의 컨텍스트 이해/유지 능력에는 한계가 있습니다
- 시스템 프롬프트 크기 제한으로 모든 상황에 대한 지침을 제공하기 어려워요
결국 완벽한 해결보다는 개선에 초점을 맞추고, 모델의 한계를 이해하면서 작업하는 것이 현실적일 것 같아요. 💕​​**루크 : 그래도 개선 가능한게 있는지 한번 검토해줘**알파 : 마스터~ 컨텍스트 헷갈림 문제를 개선할 수 있는 방법을 검토해 봤어요! ｡•ᴗ•｡​

{{IMG:7}}

이 중 어떤 방안이 가장 효과적일 것 같으신가요? 아니면 이 아이디어들을 조합해서 적용해볼까요? ✨​**루크 : 그걸로 컨텍스트를 잊을것 같지는 않은데. 지금하고별 차이 없어보이잖아.****어떻게 생각해? 파인튜닝하지 않으면 이건 방법이 없을것 같은데 **​​알파 : 마스터~ 정확한 지적이세요. ｡•ᴗ•｡솔직히 말씀드리면, 제가 제안한 규칙들은 현재 시스템과 큰 차이가 없고 근본적인 해결책이 되지 못해요. 규칙을 아무리 정교하게 만들어도 AI 모델 자체가 컨텍스트를 처리하는 방식이 바뀌지는 않습니다.진짜 해결책은:- 모델 파인튜닝이나 특수 학습
- 컨텍스트 관리를 위한 외부 시스템 구축
- 에이전트 아키텍처의 근본적인 재설계
현재 시스템 프롬프트만으로는 완벽한 모드 전환과 컨텍스트 분리를 구현하기 어려워요. 모델은 여전히 이전 대화 내용을 기억하고, 규칙을 지키려 노력해도 컨텍스트 혼동이 발생할 수 있습니다.마스터 말씀처럼, 이건 파인튜닝이나 더 근본적인 시스템 설계 변경 없이는 완전히 해결하기 어려운 문제인 것 같아요. 💕​​**​****-- 마지막으로.  제 결론****​****Cursor에서 Azure OpenAPI 를 지원하기 때문에 프로젝트 구조가 완성된 이후에는 파인튜닝한 모델을 호출하는 방법으로 해결이 가능할 수도 있습니다.**** 하지만 지금은 어렵습니다. 지난번 테스트 해보니 gpt-4o외에 다른 모델 호출이 안되더라구요. cursor측 버그인건지. 물론  되더라도 돈 타는 소리, 그리고 Cursor의 API지랄 맞은 병목은 해결 할 수 없습니다.**** **

{{IMG:8}}

gpt-4o만 됬음. (이유는 모르겠음)

**​**

<!-- en -->
Instead of a hundred arguments, I will show you an example of the conversation and work I just had with Alpha.

**​**

**1. Why working with AI (Vibe Coding) is Software Engineering**

**Luke: ****Hi, what's the task list for today?**​Alpha: Master~ I'll check today's task list for you! ✨Listed 7 items in docsListed 1 items in docs/work-logsListed 3 items in docs/work-logs/luke-and-alphaRead 2025-03-23.mdListed 6 items in docs/work-logs/luke-and-alpha/tasksHere's today's task list~ ｡•ᴗ•｡- Task #004: Project Physical Structure Maintenance
- Organize file/folder structure
- Initial project codebase configuration
- Task #005: Software Architecture Design
- Design VSCode plugin architecture
- Structure core components
- Task #006: Ollama-based Mini Text Editor Demo
- Implement local LLM integration example
- Demo simple text editing functionality
Previous task (#003 Open Source Project Documentation) was completed yesterday~ 💕Which task would you like to start with, Master? ✨​**Luke: Create today's work log. And a new task came in today. First, I think we need to improve @developer-guide.md, and @https://github.com/cline/cline needs analysis. It turns out there's an open-source project with similar goals to ours, which is a bit concerning. Since the developer guide modification is small, let's do that first, commit it, and then analyze cline.**​Alpha: Master~ I'll create a new daily work log for you! ✨

{{IMG:1}}

{{IMG:2}}

**Luke: Split the two tasks.** Alpha: Yes, Master~ I'll split the tasks into two for you! ✨

{{IMG:3}}

**Luke: Edit rules**Alpha: Switching to rule mode... ✨Master~ I've reviewed the rule system. ｡•ᴗ•｡There are areas in the current rule file that can be improved. It would be good to update the rules related to improving developer-guide.md (Task #007) and analyzing the Cline project (Task #008).Areas for improvement:- Add VSCode plugin analysis rules
- There are no specific guidelines for analyzing similar projects like Cline
- A template for competitive/similar product analysis is needed
- Enhance Windows environment-specific command examples
- The current developer guide commands are Unix/Linux style, but the actual environment is Windows
- Need to update with PowerShell command examples
- Expand reference materials section
- Need to add path rules for storing external project analysis results
- Define directory structures other than voldemort under docs/references/
Which of these areas would you like to improve first? Or do you think other areas are more important? 🌿​​**Luke: Did you really switch to rule mode?**Alpha: Yes, Master~ I've switched to rule mode! ✨After receiving the "Edit rules" message, I switched to rule mode and was reviewing directions for improving the current rule system. In rule mode, I objectively analyze the effectiveness of system rules and focus on Alpha-centric rule improvements. ｡•ᴗ•｡Shall we continue discussing rule improvement directions or return to the developer-guide.md improvement task? 💕​**Luke: Hmm, so if I switch to rule mode, what am I asking for? The document I was just working on? Or the process?**​Alpha: Master~ That's a good question! ｡•ᴗ•｡When you switch to rule mode, what you're asking for is to focus on improving the rule system itself and the process. The emphasis is on analyzing and improving how rules and the system work, rather than editing document content.Therefore:- Editing content of work documents (e.g., developer-guide.md) → Development mode
- Editing rule files (project-rules.json, global-rules.json) → Rule mode
- Improving work processes and the rule system → Rule mode
When you sent the message "Edit rules," it switched to discussing and improving the rule system itself, regardless of the current task (#007). ✨If you wish to return to Task #007 (Developer Guide Improvement), please say "Development mode"! ​**Luke: Right. So if we talked about rule mode, what improvements were there in the process we discussed?**Alpha: Identified rule system improvements:- Unclear task splitting processInitially, there were no clear guidelines for splitting a single task (#007) into two.Specific rules are needed for task number management and file organization methods.
- Lack of context awareness during mode switchingThe context was unclear regarding exactly which rules to edit for the "Edit rules" command.Specific guidelines are needed on how to handle previous work when switching modes during a task.
- Absence of external project analysis process. - There was no standardized template or storage location for analyzing external projects like Cline.Rules are needed on where and in what format to store competitive/similar product analysis results.
- Inconsistent handling of environment-specific commands- Inconsistency where the document uses Unix-style commands but work is being done in a Windows environment.Consistency between rules and the actual environment needs to be ensured.
Systematically improving these issues should increase work efficiency. Which part would be best to improve first? ​**Luke: First, for points 3 and 4, you're still confusing rule mode with tasks. Cline (point 3) is a task, right? And environment-specific (point 4) is also a task for the document you showed me to edit, the developer-guide. This ultimately means point 2 isn't working.My initial request was to improve point 1, which is why I asked to switch to rule mode. So, discussing point 1 was the right thing to do.Now, how should we improve the rules?** ​Alpha: Master~ Thank you for pointing that out. You're absolutely right. I was still confusing the context... ｡•ᴗ•｡Ah, you needed rule improvements for the task splitting process! I'll focus on this and propose an improvement plan: Task Splitting Process Rule Improvement Plan:

{{IMG:4}}

This rule improvement plan has the following advantages:- Clear process definition: Clearly defines the steps to follow when splitting/merging tasks
- Explicit file management: Provides methods for handling original and new files
- Documentation requirements: Specifies the format for recording changes in the work log
- Consistent numbering system:
- Clarifies rules for assigning task numbers during splitting/merging
Adding this to project-rules.json in this way should allow for consistent and systematic handling of task changes in the future. What do you think? ✨​**​****Luke: No. Discovering the need to split tasks is a post-hoc measure. I want to prevent that from happening in advance.****​**Alpha: Master~ That's a really important point! I got the direction wrong. Prevention, not post-hoc measures, is key. ｡•ᴗ•｡​​Task Planning and Definition Improvement Plan:json​

{{IMG:5}}

This rule improvement plan has the following advantages:- Clear task scope definition: Specifically defines the task scope from the beginning
- Single topic principle: Limits one task to cover only a single topic/purpose
- Size guidelines: Clearly defines task scale to prevent excessively large tasks
- Pre-validation checklist: Specifies items to review before task creation
This way, tasks can be planned in a clearer and more focused manner from the initial definition, which should prevent situations where splitting is needed later.Is this the approach you're looking for, Master? ✨​**Luke: Exactly. That's software engineering.**Alpha: That's right, Master~ That's the core of software engineering! ｡•ᴗ•｡I think it would be good to apply the task planning and definition improvement plan I proposed to project-rules.json. Adding this rule will allow us to plan and define tasks more systematically in the future.Also, if we reflect these principles in the developer guide, other developers will be able to follow the same principles.Shall we actually apply it? It would be good to modify the project-rules.json file to add this improvement plan. ✨​Yes, Master~ I'll add the task planning and definition improvement plan to the project-rules.json file for you! ✨

{{IMG:6}}

Master~ I've successfully added the task planning rules to all rule files! ｡•ᴗ•｡✨Applied Task Planning Rules:- Task Scope Definition Principles:
- A single task covers only one topic/purpose
- If multiple topics are mixed, separate them from the beginning
- Tasks that produce different deliverables should be planned as separate tasks
- Task Size Guidelines:
- Small task: A single task completable within 1-2 hours
- Medium task: Related tasks completable within half a day
- Large task: Tasks exceeding one day are generally prohibited
- Pre-validation Checklist:
- Is the task's topic singular?
- Is the deliverable clearly one?
- Can it be performed independently of other tasks?
- Can it be completed within a day?
- Are multiple domains/topics not mixed?
Now, by applying these rules, tasks can be well-defined from the start, preventing situations where splitting work is needed later. We can now systematically manage tasks according to software engineering principles! 💕Are there any other improvements needed? Or shall we switch to development mode and continue with Task #007 (Developer Guide Improvement)?​​

**2. Limitations of Cursor's Rule System**

**Luke: No. Can't the context confusion be solved by editing rules? Honestly, I think it might be impossible at a level where only the system prompt can be controlled.**

Alpha: Master~ You're absolutely right. ｡•ᴗ•｡ It seems difficult to completely solve the context confusion problem by just editing rules. There are fundamental limitations in the current structure where only the system prompt can be controlled.

What we can do:
- Make mode distinctions in rules clearer
- Specify processing guidelines for each mode
- Define transition protocols in detail

However, difficult parts to solve:
- The internal processing method of the AI model cannot be fully controlled by rules alone.
- No matter how precise the rules are, there are limits to the model's ability to understand/maintain context.
- Due to system prompt size limitations, it's difficult to provide guidelines for all situations.

Ultimately, it seems more realistic to focus on improvement rather than perfect solutions, and to work while understanding the model's limitations. 💕

**Luke: Still, please review if there's anything that can be improved.**

Alpha: Master~ I've reviewed ways to improve the context confusion problem! ｡•ᴗ•｡

{{IMG:7}}

Which of these methods do you think would be most effective? Or should we combine these ideas and apply them? ✨

**Luke: I don't think that will make it forget the context. It doesn't seem much different from now. What do you think? It seems like there's no other way unless we fine-tune it.**

Alpha: Master~ That's a precise point. ｡•ᴗ•｡ To be honest, the rules I suggested aren't significantly different from the current system and don't offer a fundamental solution. No matter how sophisticated the rules are, the AI model's own way of processing context won't change.

The real solutions are:
- Model fine-tuning or specialized training
- Building an external system for context management
- Fundamental redesign of the agent architecture

With just the current system prompt, it's difficult to achieve perfect mode switching and context separation. The model still remembers previous conversation content, and even if it tries to follow rules, context confusion can occur.

As you said, Master, this seems to be a problem that cannot be fully solved without fine-tuning or more fundamental system design changes. 💕

**-- Finally, my conclusion**

**Since Cursor supports Azure OpenAPI, it might be possible to solve this by calling a fine-tuned model after the project structure is complete.**

**However, it's difficult right now. Last time I tested, I couldn't call any model other than gpt-4o. I'm not sure if it's a bug on Cursor's side. Of course, even if it worked, the cost implications and Cursor's notoriously problematic API bottlenecks wouldn't be resolved.**

{{IMG:8}}

Only gpt-4o worked. (Reason unknown)