---
date: "2009-12-15"
titleKo: VoIP (Voice over Internet protocol) IT개인자료정리 / IT이야기
titleEn: VoIP (Voice over Internet Protocol) IT Personal Data Organization / IT Story
category: it
tags:
  - IT개인자료정리
images: []
sourceCategoryNo: "72"
sourceCategory: IT개인자료정리
externalUrl: https://blog.naver.com/fstory97/70075835314
---

<!-- ko -->
**주제 : VoIP (Voice over Internet protocol)
작성자 :** 숲속얘기 ([http://blog.naver.com/fstory97](http://blog.naver.com/fstory97))
**작성일 : **2009년 12월 15일
**관련주제 :** FTTH, IPTV, TPS, 4g, SIP, MGCP, H.323, RCP, 보안, UC, BcN
**참고 URL : **[http://jncis.egloos.com/2465359](http://jncis.egloos.com/2465359)
[http://blog.naver.com/cyberibh/100016273399](http://blog.naver.com/cyberibh/100016273399)
[http://blog.naver.com/arg_news/20088603660](http://blog.naver.com/arg_news/20088603660)[http://cafe.naver.com/ArticleRead.nhn?clubid=10341372&page=5&menuid=110&boardtype=L&articleid=2044](http://cafe.naver.com/ArticleRead.nhn?clubid=10341372&page=5&menuid=110&boardtype=L&articleid=2044)

**1. 비용 절감에 효과적인 VoIP
가. VoIP의 개념
** - 기존의 전화의 PSTN망대신, 데이터 통신이 가능한 인터넷 망을 이용하여 전화에서 제공하던 서비스를 이용하는 방식으로 망사용료가 거의 무료에 가깝다는 장점이 있으며 음성 통화를 뛰어넘는 다양한 부가서비스가 가능한 기술

** 나. VoIP의 등장 배경**

| 구분 | 내용 | 기술 |
| --- | --- | --- |
| 네트워크 | 고품질의 음성 전송의 충분히 빠른 속도 | FTTH, DOCSIS 3.0, VDSL |
| 서비스 커버리지 | 도서 산간지역까지 일반화된 인터넷 보급 | PSTN, 농어촌 BcN 사업 |
| 서비스 품질 | 타 서비스에 영향을 받지 않는 차등 품질 확보 | QoS, SLA |
| VoIP 프로토콜 | 음성 처리가 가능한 인터넷 프로토콜 | H.323 |
| 시장 | 새로운 시장 확보를 위한 니즈 | TPS, SIP |

**2. VoIP의 구성도**
** 가. 기본 구성도**

** 나. VoIP Protocol Stack**
**
**

| 계층 | 기술 | 설명 |
| --- | --- | --- |
| 어플리케이션 | TAPI, SIP | 화상회의, 메시징, 통화 |
| 프리젠테이션 | G.723, G.711, G.729 압축 | 음성및 멀티미디어 압축 기술 |
| 세션 계층 | H.323, SGCP, MGCP, Station Protocol 시그널링 | 멀티미디어 통신과 화상회의 구현을 운용및 세션관리 |
| 전송 계층 | RTP/UDP, RTCP 운송쳬계 | 재전송없이 UTP와 동일하게 스트리밍 형식의 데이터 전송하며 복수의 유저에게 적용 |
| 네트워크 계층 | IP QoS | 일정 수준이상의 통화 품질유지를 위한 ip기반 QoS 기술 |
| 데이터 링크 계층 | Ethernet, Mac Address | 범용적인 Ethernet 기술 |
| 물리계층 | Coaxial, Optical | 값싸고 안정된 대역폭 확보 필요 |

**3. VoIP의 보안**

| 종류 | 공격 유형 | 대응 |
| --- | --- | --- |
| 보이스 피싱 | SIP의 메시지 중에서 유저네임헤더를 광고메시지로 바꾸고 불특정 다수에게 콜 | 알려진 변조툴 차단, 자동화된 프로그램 차단(특정 시간내에 콜링후 끊어지는 패턴등 검색), 단어 필터링 |
| DoS | - SIP bombing(SIP 메시지를 보내서 내부 사용자의 전화기에 일괄적으로 전화가 울리는 공격) - SIP-Cancel/Bye DoS(전화를 끊는 메소드를 지속적으로 보냄), - RTP 플러딩(RTP 패킷을 과다로 보내어 음성통화 방해) | Honeypot을 이용하여 공격 유형 확인 조기탐지나 대응을 위한 장비와 인프라,프로세스 도입 |
| 도청 감청 | - 패킷 스니핑 | RTP 트래픽 암호화, 물리적 접점 차단 |
| 위조, 변조 | - 인증세션 가로채기, ARP Spoofing | 벤더사별 취약점 시그니처로 인한 차단 , 기존 알려진 공격 차단, 인증검사(MAC또는 인증키 검사, 계정도용 방지) |

**4. VoIP의 발전 방향**

| 구분 | 기술및 사례 | 설명 |
| --- | --- | --- |
| 비즈니스 | QPS, TPS | 컨버전스 서비스 |
| 네트워크 | 4g, FMC | all IP기반의 무선 인터넷 기반의 킬러 어플리케이션 |
| Eco | VoIP 2.0, Open API | 참여, 공유, 협업 개념의 환경 |
| 사용자 니즈 | UC | 통합 커뮤니케이션 니즈 증가 |
| 시장 | 사업주체의 수익 문제 | 이동통신사의 수익 보존문제와 값싸고 좋은 품질에 의한 기술 니즈 충돌 |
| 제도및 국가 비젼 | BcN, 유비쿼터스, Google Voice App분쟁 | 국가의 전략적 로드맵 사업 애플과 구글간의 구글Voice 분쟁에서 FCC의 결정 |

<!-- en -->
**Topic: VoIP (Voice over Internet protocol)
Author:** Forest Story ([http://blog.naver.com/fstory97](http://blog.naver.com/fstory97))
**Date:** December 15, 2009
**Related Topics:** FTTH, IPTV, TPS, 4g, SIP, MGCP, H.323, RCP, Security, UC, BcN
**Reference URLs:** [http://jncis.egloos.com/2465359](http://jncis.egloos.com/2465359)
[http://blog.naver.com/cyberibh/100016273399](http://blog.naver.com/cyberibh/100016273399)
[http://blog.naver.com/arg_news/20088603660](http://blog.naver.com/arg_news/20088603660)[http://cafe.naver.com/ArticleRead.nhn?clubid=10341372&page=5&menuid=110&boardtype=L&articleid=2044](http://cafe.naver.com/ArticleRead.nhn?clubid=10341372&page=5&menuid=110&boardtype=L&articleid=2044)
 
 
**1. VoIP: Effective for Cost Reduction
a. Concept of VoIP
**- A technology that utilizes the internet network, which allows data communication, instead of the traditional PSTN network for phone services. It has the advantage of network usage fees being almost free and enables various value-added services beyond voice calls.
 
**b. Background of VoIP's Emergence** 

| Category | Content | Technology |
| --- | --- | --- |
| Network | Sufficiently fast speed for high-quality voice transmission | FTTH, DOCSIS 3.0, VDSL |
| Service Coverage | Widespread internet penetration even in remote and mountainous areas | PSTN, Rural BcN Project |
| Service Quality | Securing differentiated quality unaffected by other services | QoS, SLA |
| VoIP Protocol | Internet protocol capable of voice processing | H.323 |
| Market | Need to secure new markets | TPS, SIP |

 
**2. VoIP Architecture**
**a. Basic Architecture**
 
 
**b. VoIP Protocol Stack**
**
**

| Layer | Technology | Description |
| --- | --- | --- |
| Application | TAPI, SIP | Video conferencing, messaging, calls |
| Presentation | G.723, G.711, G.729 Compression | Voice and multimedia compression technology |
| Session Layer | H.323, SGCP, MGCP, Station Protocol Signaling | Operation and session management for multimedia communication and video conferencing implementation |
| Transport Layer | RTP/UDP, RTCP Transport System | Streaming data transmission similar to UDP without retransmission, applicable to multiple users |
| Network Layer | IP QoS | IP-based QoS technology for maintaining a certain level of call quality |
| Data Link Layer | Ethernet, Mac Address | General Ethernet technology |
| Physical Layer | Coaxial, Optical | Need to secure cheap and stable bandwidth |

 
**3. VoIP Security**

| Type | Attack Type | Countermeasure |
| --- | --- | --- |
| Voice Phishing | Changing the username header in SIP messages to an advertisement message and calling an unspecified number of people | Blocking known tampering tools, blocking automated programs (e.g., detecting patterns of calling and hanging up within a specific time), keyword filtering |
| DoS | - SIP bombing (an attack where SIP messages are sent to make all internal users' phones ring simultaneously) - SIP-Cancel/Bye DoS (continuously sending methods to hang up calls), - RTP flooding (sending excessive RTP packets to disrupt voice calls) | Using honeypots to identify attack types, introducing equipment, infrastructure, and processes for early detection and response |
| Eavesdropping | - Packet sniffing | RTP traffic encryption, blocking physical access points |
| Forgery, Tampering | - Authentication session hijacking, ARP Spoofing | Blocking based on vendor-specific vulnerability signatures, blocking known attacks, authentication checks (MAC or authentication key verification, preventing account impersonation) |

 

**4. Future Directions of VoIP**

| Category | Technology & Examples | Description |
| --- | --- | --- |
| Business | QPS, TPS | Convergence service |
| Network | 4g, FMC | Killer application based on all-IP wireless internet |
| Eco | VoIP 2.0, Open API | Environment based on concepts of participation, sharing, and collaboration |
| User Needs | UC | Increased need for unified communication |
| Market | Profitability issues for business entities | Conflict between mobile carriers' need to preserve profits and the demand for cheap, high-quality technology |
| Regulations & National Vision | BcN, Ubiquitous, Google Voice App Dispute | National strategic roadmap projects, FCC's decision in the Google Voice dispute between Apple and Google |