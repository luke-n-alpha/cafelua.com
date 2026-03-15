---
date: "2009-06-02"
titleKo: "[소프트웨어공학] 일정관리 (PERT,CPM,PERT/CPM) IT개인자료정리 / IT이야기"
titleEn: "[Software Engineering] Schedule Management (PERT, CPM, PERT/CPM)"
category: it
tags:
  - IT개인자료정리
images:
  - /desk/20090602-소프트웨어공학-일정관리-pertcpmpertcpm-it개인자료정리-it이야기/01.webp
  - /desk/20090602-소프트웨어공학-일정관리-pertcpmpertcpm-it개인자료정리-it이야기/02.webp
  - /desk/20090602-소프트웨어공학-일정관리-pertcpmpertcpm-it개인자료정리-it이야기/03.webp
  - /desk/20090602-소프트웨어공학-일정관리-pertcpmpertcpm-it개인자료정리-it이야기/04.webp
  - /desk/20090602-소프트웨어공학-일정관리-pertcpmpertcpm-it개인자료정리-it이야기/05.webp
  - /desk/20090602-소프트웨어공학-일정관리-pertcpmpertcpm-it개인자료정리-it이야기/06.webp
  - /desk/20090602-소프트웨어공학-일정관리-pertcpmpertcpm-it개인자료정리-it이야기/07.webp
  - /desk/20090602-소프트웨어공학-일정관리-pertcpmpertcpm-it개인자료정리-it이야기/08.webp
  - /desk/20090602-소프트웨어공학-일정관리-pertcpmpertcpm-it개인자료정리-it이야기/09.webp
  - /desk/20090602-소프트웨어공학-일정관리-pertcpmpertcpm-it개인자료정리-it이야기/10.webp
thumbnail: /desk/20090602-소프트웨어공학-일정관리-pertcpmpertcpm-it개인자료정리-it이야기/01.webp
sourceCategoryNo: "72"
sourceCategory: IT개인자료정리
externalUrl: https://blog.naver.com/fstory97/70048148274
---

<!-- ko -->
주제 : 프로젝트 일정 관리 기법
작성자 : 숲속얘기([http://blog.naver.com/fstory97](http://blog.naver.com/fstory97))
작성일 : 2009년 06월 02일
관련 TOPIC : Gant Chart, Mile Stone Chart, WBS, PERT, CPM, PERT/CPM

**1. 프로젝트 일정 관리 기법**
가. 목적 : 프로젝트의 진행사항을 가시화하며, 의사결정의 도구로 사용 되는 기법
**2. PERT**
** 가. 역사** : 1958년 미해군 군수국, 폴라리스 함대 탄도 미사일 개발 과정에 처음 사용
** 나. 특징**

| Event 중심 | 각 Event 중심의 일정 계산 |
| --- | --- |
| 삼점 추정 | 최단시간(낙관치), 평균시간(최빈치), 최장시간(비관치) 적용 |
| 가중 평균값 | - 액티비티 수행 기간은 가중 편중값 사용 - 액티비티 수행 기간이 이루는 분포의 평균, 기대값 |
| 표현 방식 | Critical Path / Network 표현 (AOA) |

** 다. PERT 표현 방식의 AOA**

| 구성 요소 | 설 명 |
| --- | --- |
| 이벤트 | 각 작업의 개시와 종료 원으로 표시, 기호안에 숫자 기입 |
| 액티비티 | 프로젝트 구성의 단위 작업 활동 시간과 자원이 필요한 실제 활동 |
| 더미 | 일정간의 제약 조건 실제 작업의 Path는 아님 |

{{IMG:1}}
**라. PERT의 평균과 분산**

| Activity | T0(낙관) | Tm(최빈) | Tp(비관) | Te(기대) | ∂^2 |
| --- | --- | --- | --- | --- | --- |
| A | 4 | 6 | 14 | 7 | 2.78 |
| B | 3 | 4 | 11 | 5 | 1.78 |
| C | 2 | 4 | 6 | 4 | 0.44 |

{{IMG:2}}
{{IMG:3}}

**3. CPM(Critical Path Method)**
**가. 역사 **
- 1957년 (미)래밍톤 : 랜드사의 캘리와 듀퐁사의 워커
**나. 특징**
- 각 활동시간의 확정적 추정 (과거의 경험 기반)
**다. CPM의 표현 방법**
{{IMG:4}}{{IMG:5}}

| 기호 | 의미 |
| --- | --- |
| ES | 최조 개시 시각, 작업 시작 가능한 가장 빠른 시각 |
| EF | 최조 완료 시각, 작업 완료 가능한 가장 빠른 시각 |
| LS | 최지 개시 시각, 최대 지연 가능한 지연 시작 시각 |
| LF | 최지 완료 시각, 최대 지연 가능한 지연 완료 시각 |
| S | 각 단계의 여유 시간 |

****
**라. 계산 방법**
{{IMG:6}}

**- 전진 계산 **: 최조 개시 시각, 최조 종료 시각
{{IMG:7}}
- 수행 기간 합산 : A-C=11, B-D=7
A-C가 제일 크므로, **A-C는 Critical Path, 수행 기간은 11**
****
** - 후진 계산 **: 최지 개시 시각, 최지 완료 시각 역순 계산

- 일정 시뮬레이션 : PERT/CPM에서 시간-비용 관계를 따져 일정 조정

**4. PERT/CPM**
** 가. 역사**
- 1962년 DOD, NASA Guide, PERT Cost System Design 출간, PERT에 비용 개념 추가
- CPM의 Critical Path를 이용하여 계산
- PERT, CPM은 독립 개발되었으나 현재에는 혼용 사용
** 나. 시간 - 비용에 의한 최적 일정 구하기**
** - 총 비용이 최소화되는 시점을 구함**
- 총비용 = 직접 비용(AOA로 구한 활동 비용) + 간접 비용(일 간접비용 * 시간)
** - 문제: 가정(프로젝트 간접비용은 5000원/일)**

| 활동 | 직전 활동 | 정상 시간 | 속성 시간 | 정상 비용 | 속성 비용 |
| --- | --- | --- | --- | --- | --- |
| A | - | 3 | 1 | 4 | 8 |
| B | - | 2 | 1 | 5 | 9 |
| C | - | 5 | 4 | 10 | 15 |
| D | A | 4 | 2 | 8 | 14 |
| E | B | 2 | 1 | 6 | 10 |

** - 풀이**
**  1) 활동별 단축 가능 일수 계산**
정상 활동 시간 - 속성 활동 시간 = 단축 가능 일수
A의 단축가능 일수 :  3 - 1 = 2
B의 단축가능 일수 :  2 - 1 = 1
C의 단축가능 일수 :  5 - 4 = 1
D의 단축가능 일수 :  4 - 1 = 2
E의 단축가능 일수 :  2 - 1 = 1
**  2) 일당 단축 비용 계산**
(속성활동시간 - 정상활동시간) / 단축 가능 일수 = 일당 단축 비용
A의 일당 단축 비용 : (8-4)/2 = 2
B의 일당 단축 비용 : (9-5)/1 = 1
C의 일당 단축 비용 : (15-10)/1 = 5
D의 일당 단축 비용 : (14-8)/2 = 3
E의 일당 단축 비용 : (10-6)/1 = 4
**  3) 정상 총 활동 비용 : 정상 활동 비용의 합**
4+5+10+8+6=33
**  4) 속성 총 활동 비용 : 속성 활동 비용의 합**
8+9+15+14+10=59
**  5) 프로젝트 AOA 네트워크 그리기**

{{IMG:8}}
**   6) Critical Path 찾기 : A-D = 7(3)**
**   7) Critical Path중 가장 싼 A 구간 2일 단축, 단축 시 총 활동 비용 계산**
{{IMG:9}}
A-D = 5(3)
총 활동 비용 = 정상 활동 비용 + 단축 비용
∵ A 의 1일 단축 비용은 2*2일
총활동비용(33) + 단축 비용 (2*2) = A를 2일 단축한 총 활동 비용(37)
**  8) 1일을 추가로 단축하기 위해서는 A-D 5(3)와 C 5(4)를 모두 단축 해야 한다.**
{{IMG:10}}

* 이 때, 주 공정(Critical path)는 A-D, C, B-E 완료 시간은 모두 4일
37(A를 2일 단축한 총 활동 비용) + 5(C의 1일 단축 비용) + 3(D의 1일 단축비용) = 45 (4일로 단축한 총 활동 비용)
** 9) 각 일정 별 비용 비교**

| 일정 | 직접 비용 | 간접 비용 | 총 비용 | col5 |
| --- | --- | --- | --- | --- |
| 4 | 45 | 20 | 65 |  |
| 5 | 37 | 25 | 62 | 최적 일정 |
| 6 | 35 | 30 | 65 |  |
| 7 | 33 | 35 | 68 |  |

** * 최적 일정은 5 Day, 총 비용은 62천원**

<!-- en -->
Topic: Project Schedule Management Techniques
Author: Forest Story ([http://blog.naver.com/fstory97](http://blog.naver.com/fstory97))
Date: June 2, 2009
Related TOPIC: Gantt Chart, Mile Stone Chart, WBS, PERT, CPM, PERT/CPM
 
**1. Project Schedule Management Techniques**
 a. Purpose: A technique used to visualize project progress and as a decision-making tool.
**2. PERT**
** a. History**: First used in 1958 by the US Navy Bureau of Ordnance during the development of the Polaris fleet ballistic missile.
** b. Characteristics**

| Event-centric | Schedule calculation centered on each Event |
| --- | --- |
| Three-point estimation | Applies shortest time (optimistic), average time (most likely), longest time (pessimistic) |
| Weighted average | - Uses weighted average for activity duration - Average and expected value of the distribution formed by activity duration |
| Representation method | Critical Path / Network Representation (AOA) |

** c. AOA in PERT Representation**

| Component | Description |
| --- | --- |
| Event | Start and end of each task indicated by a circle, with a number inside the symbol |
| Activity | Unit task of project composition, actual activity requiring time and resources |
| Dummy | Constraint between schedules, not an actual work path |

 
 {{IMG:1}}
**d. PERT Mean and Variance**

| Activity | T0(Optimistic) | Tm(Most Likely) | Tp(Pessimistic) | Te(Expected) | ∂^2 |
| --- | --- | --- | --- | --- | --- |
| A | 4 | 6 | 14 | 7 | 2.78 |
| B | 3 | 4 | 11 | 5 | 1.78 |
| C | 2 | 4 | 6 | 4 | 0.44 |

{{IMG:2}}
{{IMG:3}}
 
**3. CPM (Critical Path Method)**
**a. History**
 - 1957 (US) Remington: Kelly of Rand Corp. and Walker of DuPont
**b. Characteristics**
 - Deterministic estimation of each activity time (based on past experience)
**c. CPM Representation Method**
{{IMG:4}}{{IMG:5}}

| Symbol | Meaning |
| --- | --- |
| ES | Earliest Start Time, the earliest time an activity can start |
| EF | Earliest Finish Time, the earliest time an activity can finish |
| LS | Latest Start Time, the latest possible start time for a delay |
| LF | Latest Finish Time, the latest possible finish time for a delay |
| S | Slack time for each stage |

**** 
**d. Calculation Method**
{{IMG:6}}
 
 **- Forward Pass**: Earliest Start Time, Earliest Finish Time
{{IMG:7}}
 - Sum of durations: A-C=11, B-D=7
   Since A-C is the largest, **A-C is the Critical Path, and the duration is 11.**
**** 
** - Backward Pass**: Latest Start Time, Latest Finish Time calculated in reverse order

 - Schedule Simulation: Adjusting the schedule by considering time-cost relationships in PERT/CPM
 
**4. PERT/CPM**
** a. History**
  - 1962 DOD, NASA Guide, PERT Cost System Design published, adding cost concept to PERT
  - Calculated using CPM's Critical Path
  - PERT and CPM were developed independently but are now used interchangeably.
** b. Finding the Optimal Schedule based on Time - Cost**
** - Find the point where total cost is minimized.**
 - Total Cost = Direct Cost (activity cost obtained from AOA) + Indirect Cost (daily indirect cost * time)
** - Problem: Assumption (Project indirect cost is 5000 won/day)**

| Activity | Predecessor | Normal Time | Crash Time | Normal Cost | Crash Cost |
| --- | --- | --- | --- | --- | --- |
| A | - | 3 | 1 | 4 | 8 |
| B | - | 2 | 1 | 5 | 9 |
| C | - | 5 | 4 | 10 | 15 |
| D | A | 4 | 2 | 8 | 14 |
| E | B | 2 | 1 | 6 | 10 |

** - Solution**
**  1) Calculate possible days to shorten per activity**
   Normal Activity Time - Crash Activity Time = Possible days to shorten
    Possible days to shorten for A: 3 - 1 = 2
    Possible days to shorten for B: 2 - 1 = 1
    Possible days to shorten for C: 5 - 4 = 1
    Possible days to shorten for D: 4 - 2 = 2
    Possible days to shorten for E: 2 - 1 = 1
**  2) Calculate daily crash cost**
   (Crash Activity Cost - Normal Activity Cost) / Possible days to shorten = Daily Crash Cost
    Daily crash cost for A: (8-4)/2 = 2
    Daily crash cost for B: (9-5)/1 = 4
    Daily crash cost for C: (15-10)/1 = 5
    Daily crash cost for D: (14-8)/2 = 3
    Daily crash cost for E: (10-6)/1 = 4
**  3) Normal Total Activity Cost: Sum of normal activity costs**
    4+5+10+8+6=33
**  4) Crash Total Activity Cost: Sum of crash activity costs**
    8+9+15+14+10=59
**  5) Draw Project AOA Network**
 
{{IMG:8}}
**   6) Find Critical Path: A-D = 7(3)**
**   7) Shorten the cheapest section of the Critical Path, A, by 2 days; calculate total activity cost after shortening.**
    {{IMG:9}}
   A-D = 5(3)
   Total Activity Cost = Normal Activity Cost + Crash Cost
  ∵ 1-day crash cost for A is 2 * 2 days
   Total Activity Cost (33) + Crash Cost (2*2) = Total Activity Cost after crashing A by 2 days (37)
**  8) To shorten by an additional 1 day, both A-D 5(3) and C 5(4) must be crashed.**
   {{IMG:10}}
 
  * At this point, the Critical Paths (A-D, C, B-E) all have a completion time of 4 days.
     37 (Total activity cost after crashing A by 2 days) + 5 (1-day crash cost for C) + 3 (1-day crash cost for D) = 45 (Total activity cost after crashing to 4 days)
** 9) Compare costs for each schedule**

| Schedule | Direct Cost | Indirect Cost | Total Cost | col5 |
| --- | --- | --- | --- | --- |
| 4 | 45 | 20 | 65 | |
| 5 | 37 | 25 | 62 | Optimal Schedule |
| 6 | 35 | 30 | 65 | |
| 7 | 33 | 35 | 68 | |

** * The optimal schedule is 5 Days, with a total cost of 62,000 won.**