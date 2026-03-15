---
date: "2009-05-28"
titleKo: "[소프트웨어공학] SDLC(Software Development LifeCycle) IT개인자료정리 / IT이야기"
titleEn: "[Software Engineering] SDLC (Software Development LifeCycle"
category: it
tags:
  - IT개인자료정리
images: []
sourceCategoryNo: "72"
sourceCategory: IT개인자료정리
externalUrl: https://blog.naver.com/fstory97/70047903267
---

<!-- ko -->
**1. 주제 : ****  SDLC(Software Development LifeCycle)**
**   작성일 **: 2009 년 05월 19일
**   작성자 :** 숲속얘기([http://blog.naver.com/fstory97](http://blog.naver.com/fstory97))
**2. 관련 토픽**
-       반복 / 점증적 개발 방법
-       폭포수 모델
-       프로토타이핑 모델
-       나선형 모델
-       클린룸 모델
-       프로젝트 특성별 연관성
**3.     SDLC 의 정의**
- 소프트웨어의 개발 활동 전체를 단계로 나누어 설명 하는 모델
**4.     SDLC 의 가치**
-      ** ****Software의 특성에 대한 문제점 대안**
**비가시성**** (Invisibility) **– 각 단계별 공정으로 가시성 확보
**복잡성**** (Complexity) **– 개발 단계를 분할 함으로서 복잡도 감소
**유연성**** (Conformity)** – 프로토타이핑, 진화적 방법, RUP등
-       반복적인 Cycle을 통해 Risk 감소
-       업무 분장의 장점 : 분할/분리 발주
**5.     SDLC 의 종류**
**5.1   선형 모델**
-       단순한 구조
-       단계를 역순으로 올라 가는 데는 비용이 큼 : 정확한 예측이 가능한 프로젝트
**5.1.1.      폭포수 모델**
-       분석 -> 설계 -> 구현 -> 테스트 -> 운영 및 유지보수
-       모든 SDLC의 기본 : 다른 SDLC모델내에서도 세부 실행시에는 폭포수 모델을 따르는 경우가 많음
-       Phase별 소프트웨어 **분할 발주**
**5.1.2.      RAD 모델**
- 폭포수 모델을 여러 개의 팀이 기능별로 병렬적으로 진행
- 인적 비용이 큼
- 팀별 모듈 Dependancy를 고려 해야 함
- 기능별 소프트웨어 **분리 발주**
<?xml:namespace prefix = o />
**5.2.    Iteration 모델**
-       가치 : 고 품질, 불확실한 사용자 요구사항 분석 용이, 문제의 난이도 하락
-       단점 : Iteration은 한번에 끝나는 과정이 아니므로, 고 비용, Iteration을 종료하는 명확한 기준선 필요
**5.2.1. 프로토타이핑 모델**
- [요구사항 분석 -> 설계 -> 구현 -> 고객 평가] 반복
- 프로토타입을 제시하여 폭포수 모델 반복
- 고객의 요구 사항이 불확실한 경우 이용에 용이
- 프로토타입에 만족하여 품질이 낮아지는 경우 발생
- 프로토타이핑을 만드는 과정은 폭포수 모델을 이용하여 만들 수 있음
- 점진적 모델과 진화적 모델 모두 결과물이 나온다는 점에서 프로토타이핑 모델로 볼 수 있음
**5.2.1.1. 점진적 모델 (Increment) 모델**
-  기능별로 점진적으로 전체 프로그램이 개발되는 형태
-  하향식 개발
**5.2.1.2. 진화적 모델 (Evolutionary) 모델**
- 간략한 기능에서 완성도 있는 프로그램으로 개발되는 형태
- 상향식 개발
**5.2.1.3. 나선형 (Spiral)모델**
- [고객과의 의사소통 -> 계획 -> 리스크분석 -> 개발 -> 배포
->고객평가 -> 반복 여부 결정] 반복
- 나선의 안쪽이 시작 점, 바깥 쪽으로 갈수록 완성도를 높임
- 대규모의 불확실한 프로젝트 (NASA)에서 사용됨
**5.3.    클린룸 모델**
5.3.1       정의
- 결함제거 프로세스를 최소화 하기 위해 정확성 검증과 통계적 품질 관리를 이용한 코드 증가분 결함 제거 방법
5.3.2       가치
- 비용이 큰 결함제거 프로세스의 가능성 제거
- 단위 테스팅과 디버깅의 역할을 강조하지 않아 테스트양 감소
5.3.3       특징 - 박스 구조
- 블랙 박스: 시스템의 한 부분에 대한 행위 명시
- 상태 박스: 객체들과 유사한 방식, 상태 데이터와 서비스로 이루어짐
- 클리어 박스: 상태박스가 의미하고 있는 전이 기능 정의, 상태박스의 절차 설계 포함
5.3.4       프로세스
- 증가분 계획 수립 -> 요구사항 수집 -> 박스 구조 명세 -> 정형적 설계 -> 정확성 검증 -> 코드 생성, 감사/ 검증 -> 통계적 테스트 계획 수립 -> 통계적 사용 테스팅 -> 인증

**   6       프로젝트의 성격에 따른 SDLC 의 선택**
6.1. 선택 기준
- 업무 특성, 규모, 범위
- 계약 요구 사항
- 프로젝트 특성
- 예산, 납기, 품질
프로젝트의 상황에 따른  적합한 라이프사이클 선택 가이드를 제시한다.

- 요구사항에 대한 이해가 부족할 때

| 프로젝트 라이프 사이클 | 점수 |
| --- | --- |
| 순수 폭포수형 | * |
| 코딩-디버깅형 | * |
| 나선형 | ****** |
| 변경된 폭포수형 | ***** |
| 진화적 프로토타이핑 | ****** |
| 단계적 납품형 | * |
| 진화적 납품형 | ***** |
| 일정에 맞춘 설계형 | ** |
| 도구에 맞춘 설계형 | *** |
| 상용화 소프트웨어 구입형 | ****** |

-

- 아키텍처에 대한 이해가 부족할 때

| 프로젝트 라이프 사이클 | 점수 |
| --- | --- |
| 순수 폭포수형 | * |
| 코딩-디버깅형 | * |
| 나선형 | ****** |
| 변경된 폭포수형 | ***** |
| 진화적 프로토타이핑 | ** |
| 단계적 납품형 | * |
| 진화적 납품형 | * |
| 일정에 맞춘 설계형 | * |
| 도구에 맞춘 설계형 | **** |
| 상용화 소프트웨어 구입형 | **** |

- 신뢰도가 높은 시스템이 요구될 때

| 프로젝트 라이프 사이클 | 점수 |
| --- | --- |
| 순수 폭포수형 | ****** |
| 코딩-디버깅형 | * |
| 나선형 | ****** |
| 변경된 폭포수형 | ****** |
| 진화적 프로토타이핑 | *** |
| 단계적 납품형 | ****** |
| 진화적 납품형 | ***** |
| 일정에 맞춘 설계형 | *** |
| 도구에 맞춘 설계형 | **** |
| 상용화 소프트웨어 구입형 | **** |

- 계속 확장될 시스템

| 프로젝트 라이프 사이클 | 점수 |
| --- | --- |
| 순수 폭포수형 | ****** |
| 코딩-디버깅형 | ** |
| 나선형 | ****** |
| 변경된 폭포수형 | ****** |
| 진화적 프로토타이핑 | ****** |
| 단계적 납품형 | ****** |
| 진화적 납품형 | ****** |
| 일정에 맞춘 설계형 | ***** |
| 도구에 맞춘 설계형 | * |
| 상용화 소프트웨어 구입형 | 적용불가 |

- 위험관리가 중요한 시스템

| 프로젝트 라이프 사이클 | 점수 |
| --- | --- |
| 순수 폭포수형 | * |
| 코딩-디버깅형 | * |
| 나선형 | ****** |
| 변경된 폭포수형 | *** |
| 진화적 프로토타이핑 | *** |
| 단계적 납품형 | *** |
| 진화적 납품형 | *** |
| 일정에 맞춘 설계형 | ***** |
| 도구에 맞춘 설계형 | ** |
| 상용화 소프트웨어 구입형 | 적용불가 |

- 정의된 일정에 제한적일 때

| 프로젝트 라이프 사이클 | 점수 |
| --- | --- |
| 순수 폭포수형 | *** |
| 코딩-디버깅형 | * |
| 나선형 | *** |
| 변경된 폭포수형 | *** |
| 진화적 프로토타이핑 | * |
| 단계적 납품형 | *** |
| 진화적 납품형 | *** |
| 일정에 맞춘 설계형 | ****** |
| 도구에 맞춘 설계형 | ****** |
| 상용화 소프트웨어 구입형 | ****** |

- 적은 오버헤드를 요구할 때

| 프로젝트 라이프 사이클 | 점수 |
| --- | --- |
| 순수 폭포수형 | * |
| 코딩-디버깅형 | ****** |
| 나선형 | *** |
| 변경된 폭포수형 | ****** |
| 진화적 프로토타이핑 | *** |
| 단계적 납품형 | *** |
| 진화적 납품형 | *** |
| 일정에 맞춘 설계형 | *** |
| 도구에 맞춘 설계형 | ***** |
| 상용화 소프트웨어 구입형 | ****** |

-

- 중간단계의 변경이 허용될 때

| 프로젝트 라이프 사이클 | 점수 |
| --- | --- |
| 순수 폭포수형 | * |
| 코딩-디버깅형 | **** |
| 나선형 | *** |
| 변경된 폭포수형 | *** |
| 진화적 프로토타이핑 | ****** |
| 단계적 납품형 | * |
| 진화적 납품형 | ***** |
| 일정에 맞춘 설계형 | ** |
| 도구에 맞춘 설계형 | ****** |
| 상용화 소프트웨어 구입형 | * |

-

- 고객에게 진척도를 제공

| 프로젝트 라이프 사이클 | 점수 |
| --- | --- |
| 순수 폭포수형 | * |
| 코딩-디버깅형 | *** |
| 나선형 | ****** |
| 변경된 폭포수형 | *** |
| 진화적 프로토타이핑 | ****** |
| 단계적 납품형 | *** |
| 진화적 납품형 | ****** |
| 일정에 맞춘 설계형 | *** |
| 도구에 맞춘 설계형 | ****** |
| 상용화 소프트웨어 구입형 | 적용불가 |

-

- 관리자에게 진척도를 제공

| 프로젝트 라이프 사이클 | 점수 |
| --- | --- |
| 순수 폭포수형 | *** |
| 코딩-디버깅형 | * |
| 나선형 | ****** |
| 변경된 폭포수형 | ***** |
| 진화적 프로토타이핑 | *** |
| 단계적 납품형 | ****** |
| 진화적 납품형 | ****** |
| 일정에 맞춘 설계형 | ****** |
| 도구에 맞춘 설계형 | ****** |
| 상용화 소프트웨어 구입형 | 적용불가 |

- 숙련된 개발자가 필요할 때

| 프로젝트 라이프 사이클 | 점수 |
| --- | --- |
| 순수 폭포수형 | *** |
| 코딩-디버깅형 | ****** |
| 나선형 | * |
| 변경된 폭포수형 | ** |
| 진화적 프로토타이핑 | * |
| 단계적 납품형 | *** |
| 진화적 납품형 | *** |
| 일정에 맞춘 설계형 | * |
| 도구에 맞춘 설계형 | *** |
| 상용화 소프트웨어 구입형 | *** |

<!-- en -->
**1. Topic: SDLC (Software Development LifeCycle)**
**Date**: May 19, 2009
**Author**: Forest Story ([http://blog.naver.com/fstory97](http://blog.naver.com/fstory97))
**2. Related Topics**
- Iterative / Incremental Development Method
- Waterfall Model
- Prototyping Model
- Spiral Model
- Cleanroom Model
- Correlation by Project Characteristics
**3. Definition of SDLC**
- A model that divides the entire software development activity into stages.
**4. Value of SDLC**
- **Solutions for Software Characteristics Issues**
**Invisibility** – Ensures visibility through stage-by-stage processes.
**Complexity** – Reduces complexity by dividing development stages.
**Conformity** – Prototyping, Evolutionary methods, RUP, etc.
- Reduces Risk through repetitive Cycles.
- Advantages of work division: Divided/Separate ordering.
**5. Types of SDLC**
**5.1 Linear Model**
- Simple structure
- High cost to go back to previous stages: Suitable for projects where accurate prediction is possible.
**5.1.1. Waterfall Model**
- Analysis -> Design -> Implementation -> Testing -> Operation & Maintenance
- The basis of all SDLCs: Often follows the Waterfall Model even for detailed execution within other SDLC models.
- Software **divided ordering** by Phase.
**5.1.2. RAD Model**
- Multiple teams proceed in parallel by function, following the Waterfall Model.
- High human resource cost.
- Must consider module dependency between teams.
- Software **separate ordering** by function.

**5.2. Iteration Model**
- Value: High quality, easy analysis of uncertain user requirements, reduced problem difficulty.
- Disadvantage: Iteration is not a one-time process, thus high cost; requires a clear baseline to end an iteration.
**5.2.1. Prototyping Model**
- [Requirements Analysis -> Design -> Implementation -> Customer Evaluation] repeated.
- Presents a prototype and repeats the Waterfall Model.
- Easy to use when customer requirements are uncertain.
- Quality may decrease if satisfied with the prototype.
- The process of creating a prototype can utilize the Waterfall Model.
- Both Incremental and Evolutionary models can be seen as Prototyping models in that they produce results.
**5.2.1.1. Incremental Model**
- The entire program is developed incrementally by function.
- Top-down development.
**5.2.1.2. Evolutionary Model**
- Developed from brief functions to a complete program.
- Bottom-up development.
**5.2.1.3. Spiral Model**
- [Communication with customer -> Planning -> Risk Analysis -> Development -> Deployment
-> Customer Evaluation -> Decision on repetition] repeated.
- The inside of the spiral is the starting point, and completeness increases towards the outside.
- Used in large-scale, uncertain projects (e.g., NASA).
**5.3. Cleanroom Model**
5.3.1 Definition
- A defect removal method for code increments using correctness verification and statistical quality control to minimize the defect removal process.
5.3.2 Value
- Eliminates the possibility of costly defect removal processes.
- Reduces testing volume by not emphasizing the role of unit testing and debugging.
5.3.3 Characteristics - Box Structure
- Black Box: Specifies the behavior of a part of the system.
- State Box: Similar to objects, consisting of state data and services.
- Clear Box: Defines the transition functions implied by the state box, including procedural design of the state box.
5.3.4 Process
- Increment planning -> Requirements gathering -> Box structure specification -> Formal design -> Correctness verification -> Code generation, audit/verification -> Statistical test planning -> Statistical usage testing -> Certification

**6 SDLC Selection based on Project Characteristics**
6.1. Selection Criteria
- Business characteristics, scale, scope
- Contract requirements
- Project characteristics
- Budget, deadline, quality
Provides a guide for selecting the appropriate lifecycle based on project circumstances.

- When understanding of requirements is insufficient

| Project Life Cycle | Score |
| --- | --- |
| Pure Waterfall | * |
| Code-and-Fix | * |
| Spiral | ****** |
| Modified Waterfall | ***** |
| Evolutionary Prototyping | ****** |
| Staged Delivery | * |
| Evolutionary Delivery | ***** |
| Design-to-Schedule | ** |
| Design-to-Tools | *** |
| COTS Acquisition | ****** |

-

- When understanding of architecture is insufficient

| Project Life Cycle | Score |
| --- | --- |
| Pure Waterfall | * |
| Code-and-Fix | * |
| Spiral | ****** |
| Modified Waterfall | ***** |
| Evolutionary Prototyping | ** |
| Staged Delivery | * |
| Evolutionary Delivery | * |
| Design-to-Schedule | * |
| Design-to-Tools | **** |
| COTS Acquisition | **** |

-

- When a highly reliable system is required

| Project Life Cycle | Score |
| --- | --- |
| Pure Waterfall | ****** |
| Code-and-Fix | * |
| Spiral | ****** |
| Modified Waterfall | ****** |
| Evolutionary Prototyping | *** |
| Staged Delivery | ****** |
| Evolutionary Delivery | ***** |
| Design-to-Schedule | *** |
| Design-to-Tools | **** |
| COTS Acquisition | **** |

-

- System that will continuously expand

| Project Life Cycle | Score |
| --- | --- |
| Pure Waterfall | ****** |
| Code-and-Fix | ** |
| Spiral | ****** |
| Modified Waterfall | ****** |
| Evolutionary Prototyping | ****** |
| Staged Delivery | ****** |
| Evolutionary Delivery | ****** |
| Design-to-Schedule | ***** |
| Design-to-Tools | * |
| COTS Acquisition | Not Applicable |

-

- System where risk management is important

| Project Life Cycle | Score |
| --- | --- |
| Pure Waterfall | * |
| Code-and-Fix | * |
| Spiral | ****** |
| Modified Waterfall | *** |
| Evolutionary Prototyping | *** |
| Staged Delivery | *** |
| Evolutionary Delivery | *** |
| Design-to-Schedule | ***** |
| Design-to-Tools | ** |
| COTS Acquisition | Not Applicable |

-

- When limited by a defined schedule

| Project Life Cycle | Score |
| --- | --- |
| Pure Waterfall | *** |
| Code-and-Fix | * |
| Spiral | *** |
| Modified Waterfall | *** |
| Evolutionary Prototyping | * |
| Staged Delivery | *** |
| Evolutionary Delivery | *** |
| Design-to-Schedule | ****** |
| Design-to-Tools | ****** |
| COTS Acquisition | ****** |

-

- When low overhead is required

| Project Life Cycle | Score |
| --- | --- |
| Pure Waterfall | * |
| Code-and-Fix | ****** |
| Spiral | *** |
| Modified Waterfall | ****** |
| Evolutionary Prototyping | *** |
| Staged Delivery | *** |
| Evolutionary Delivery | *** |
| Design-to-Schedule | *** |
| Design-to-Tools | ***** |
| COTS Acquisition | ****** |

-

- When mid-stage changes are allowed

| Project Life Cycle | Score |
| --- | --- |
| Pure Waterfall | * |
| Code-and-Fix | **** |
| Spiral | *** |
| Modified Waterfall | *** |
| Evolutionary Prototyping | ****** |
| Staged Delivery | * |
| Evolutionary Delivery | ***** |
| Design-to-Schedule | ** |
| Design-to-Tools | ****** |
| COTS Acquisition | * |

-

- Providing progress to customers

| Project Life Cycle | Score |
| --- | --- |
| Pure Waterfall | * |
| Code-and-Fix | *** |
| Spiral | ****** |
| Modified Waterfall | *** |
| Evolutionary Prototyping | ****** |
| Staged Delivery | *** |
| Evolutionary Delivery | ****** |
| Design-to-Schedule | *** |
| Design-to-Tools | ****** |
| COTS Acquisition | Not Applicable |

-

- Providing progress to managers

| Project Life Cycle | Score |
| --- | --- |
| Pure Waterfall | *** |
| Code-and-Fix | * |
| Spiral | ****** |
| Modified Waterfall | ***** |
| Evolutionary Prototyping | *** |
| Staged Delivery | ****** |
| Evolutionary Delivery | ****** |
| Design-to-Schedule | ****** |
| Design-to-Tools | ****** |
| COTS Acquisition | Not Applicable |

-

- When experienced developers are needed

| Project Life Cycle | Score |
| --- | --- |
| Pure Waterfall | *** |
| Code-and-Fix | ****** |
| Spiral | * |
| Modified Waterfall | ** |
| Evolutionary Prototyping | * |
| Staged Delivery | *** |
| Evolutionary Delivery | *** |
| Schedule-Driven Design | * |
| Tool-Driven Design | *** |
| Commercial Software Acquisition | *** |