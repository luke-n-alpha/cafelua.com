---
date: "2009-07-17"
titleKo: 분산 서비스 거부 공격 (Distributed Denial of Service attack DDOS) IT개인자료정리 / IT이야기
titleEn: Distributed Denial of Service Attack (DDoS)
category: it
tags:
  - IT개인자료정리
images:
  - /desk/20090717-분산-서비스-거부-공격-distributed-denial-of-service-attack/01.webp
thumbnail: /desk/20090717-분산-서비스-거부-공격-distributed-denial-of-service-attack/01.webp
sourceCategoryNo: "72"
sourceCategory: IT개인자료정리
externalUrl: https://blog.naver.com/fstory97/70054469782
---

<!-- ko -->
주제 : 분산 서비스 공격 (DDOS)
작성자: 숲속얘기 ([http://blog.naver.com/fstory97](http://blog.naver.com/fstory97))
작성일: 2009년 07월 17일
관련 Topic : 보안, PDOS, 해킹

참고 URL: http://ko.wikipedia.org/wiki/%EC%84%9C%EB%B9%84%EC%8A%A4_%EA%B1%B0%EB%B6%80_%EA%B3%B5%EA%B2%A9
http://www.storysearch.co.kr/story?at=view&azi=124108
http://www.wssplex.net/TipnTech.aspx?Seq=302

1. DDOS의 개념
- 공격자가 다수의 PC를 좀비(봇)으로 만들어 악의적으로 특정 시스템을 공격해 해당 시스템의 리소스를 부족하게 하여 정상적인 서비스를 수행하지 못하게 하는 공격 방법
가. DDOS 대처의 어려움
- 일반적인 사용자 PC의 정상적인 접속과 유사하여 판단이 어려움
- 가용량을 뛰어넘는 트래픽을 통하여 시스템이 뚫리지 않더라도 서비스 불가로 금전적 피해 발생
- 분산된 시스템에서 ip spooping을 통해 위장을 수행하여, 공격으로 공격자 추적이 어려움
- 제로 데이 어택의 경우, PC들이 대응을 하지 못하여 피해 범위가 광범위 함
나. 정보보안 침해 요소
- 가용성 : 정상적인 사용자들의 서비스를 수행하지 못하게 함
- 위조 : 정상적인 사용자의 이용으로 위장

2.   DDOS 공격 프로세스
- 좀비 PC의 확보 :
취약점을 가진 PC를 악성코드를 심어 다른 취약 PC를 찾아내 전파 시키는 방법
사용자에게 필요한 어플리케이션으로 가장하여 자료실등을 통해 전파 시키는 방법
- 공격 수행
원격지의 컨트롤 PC에 의한 공격 명령을 수행
미리 프로그램된 시간에 동시에 공격하는 방법
- 공격 대상에 침투
공격 대상 시스템이 buffer overflow 등의 상황이 되었을 때, 해당 대상에 침투
- 정보 취득, 변조
**
{{IMG:1}}

**
3. DDOS의 대처방안
가. 역할자 별 예방 및 대처

| 역할 | 대처 방안 |
| --- | --- |
| 사용자 | 보안 의식 강화, 백신 설치, 온라인 패치 켜두기 |
| ISP | 망의 이상 트래픽 감시, 망을 운영하는 기간 시스템에 대한 보안 장비 |
| 정부 | 보안 등급에 따른 홍보, 대규모 공격의 경우 언론과 공조, 국민 보안의식 캠패인 |
| 기업 | 온라인 업데이트 어플리케이션 개발 배포, 보안장비 구매, 시스템의 취약점 즉각 대비, 피해 발생시 프로세스 구축, Apache 서버의 환경설정, 이상 패턴 감지 모니터링 |

나. 특징에 의한 대처

| 특징 | 대처방안 |
| --- | --- |
| 특정 port 공격 | 해당 port 차단 |
| 짧은 request | 지속적인 짧은 접속을 시도하는 PC의 ip 차단 해당 패킷을 판별하여 드롭 |
| 302 redirect까지 따라오지 못함 | 302 request로 redirect |
| 공격도메인이나 ip가 사전에 정의 되어 있음 | ip 혹은 Domain 변경 |

4. DDOS의 공격과 방어의 흐름
- 금전적 이익을 노린 협박성 DDOS 공격 증가
- 패턴이나 인공지능을 이용한 탐지및 방어 방법 개발
- 서버가 타겟이 아니라 네트워크 자체가 타겟 : 모든 네트워크 장비를 무력화 시킴
- DOS 공격은 펌웨어를 변경공격하는 PDOS 으로 발전

<!-- en -->
Topic: Distributed Denial of Service (DDoS) Attack
Author: Forest Story ([http://blog.naver.com/fstory97](http://blog.naver.com/fstory97))
Date: July 17, 2009
Related Topics: Security, PDOS, Hacking

Reference URL: http://ko.wikipedia.org/wiki/%EC%84%9C%EB%B9%84%EC%8A%A4_%EA%B1%B0%EB%B6%80_%EA%B3%B5%EA%B2%A9
http://www.storysearch.co.kr/story?at=view&azi=124108
http://www.wssplex.net/TipnTech.aspx?Seq=302

1. Concept of DDoS
 - An attack method where an attacker turns multiple PCs into zombies (bots) to maliciously attack a specific system, causing a shortage of resources on that system and preventing it from performing normal services.
 a. Difficulties in Responding to DDoS
  - Difficult to judge as it resembles normal connections from typical user PCs.
  - Even if the system is not breached, financial damage occurs due to service unavailability caused by traffic exceeding capacity.
  - Attackers are difficult to trace because they perform masquerading through IP spoofing in distributed systems.
  - In the case of zero-day attacks, PCs cannot respond, leading to a wide range of damage.
 b. Information Security Breach Elements
    - Availability: Prevents normal users from accessing services.
    - Forgery: Masquerading as legitimate user activity.

2. DDoS Attack Process
 - Securing Zombie PCs:
      A method of implanting malicious code into vulnerable PCs to find and spread to other vulnerable PCs.
      A method of masquerading as a necessary application for users and spreading through data archives, etc.
 - Executing the Attack
      Performing attack commands by a remote control PC.
      A method of attacking simultaneously at a pre-programmed time.
 - Infiltrating the Target
      Infiltrating the target system when it reaches a state like buffer overflow.
 - Information Acquisition, Tampering
**
   {{IMG:1}}

**
3. DDoS Countermeasures
 a. Prevention and Response by Role

| Role | Countermeasure |
| --- | --- |
| User | Strengthen security awareness, install antivirus, keep online patches enabled |
| ISP | Monitor abnormal network traffic, security equipment for core systems operating the network |
| Government | Promote according to security levels, cooperate with media in case of large-scale attacks, national security awareness campaigns |
| Enterprise | Develop and distribute online update applications, purchase security equipment, promptly prepare for system vulnerabilities, establish processes in case of damage, configure Apache server settings, monitor for abnormal patterns |

 b. Response by Characteristic      

| Characteristic | Countermeasure |
| --- | --- |
| Attack on specific port | Block that port |
| Short requests | Block IP of PCs attempting continuous short connections, identify and drop corresponding packets |
| Cannot follow 302 redirect | Redirect with 302 request |
| Attack domain or IP is predefined | Change IP or Domain |

4. Trends in DDoS Attacks and Defenses
 - Increase in extortionate DDoS attacks targeting financial gain.
 - Development of detection and defense methods using patterns or artificial intelligence.
 - The network itself is the target, not the server: incapacitating all network devices.
 - DoS attacks evolve into PDOS, which attacks by modifying firmware.