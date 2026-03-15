---
date: "2025-02-13"
titleKo: "[공지] 웹메타버스(WebXR) XRCLOUD, 오픈소스로 공개합니다"
titleEn: "[Announcement] Web Metaverse (WebXR) XR"
category: xrcloud
tags:
  - XRCLOUD
images:
  - /desk/20250213-공지-웹메타버스webxr-xrcloud-오픈소스로-공개합니다/01.webp
thumbnail: /desk/20250213-공지-웹메타버스webxr-xrcloud-오픈소스로-공개합니다/01.webp
sourceCategoryNo: "183"
sourceCategory: XRCLOUD
externalUrl: https://blog.naver.com/fstory97/223759359167
---

<!-- ko -->
안녕하세요, 빌리버의 베리입니다. 어쩌면 이 글이 **XRCLOUD의 마지막 기록**일지도 몰라요.하지만, 마지막이라고 해서 모든 게 사라지는 건 아니잖아요. 우리가 남긴 것들, 우리가 만들어온 기술이 누군가의 손에서 다시 쓰이고, 새로운 모습으로 발전하길 바랍니다. XRCLOUD는 **누구나 WebXR 기반의 가상공간을 만들고 운영할 수 있도록** 설계된 클라우드 플랫폼입니다.BELIVVR이 더 이상 개발을 지속할 수는 없지만, 이 기술이 그냥 사라지는 대신, 더 많은 사람들이 활용할 수 있도록**모든 핵심 기능과 노하우를 오픈소스로 공개합니다.**또한, **2025년까지 XRCLOUD의 운영을 유지하며, 일부 파트너들에게 기술 지원을 제공할 예정입니다.**서비스를 직접 운영하고 싶은 분들을 위해 **설치 및 운용 가이드**도 제공하니, 필요한 분들은 자유롭게 활용해 주세요. **이제 XRCLOUD는 여러분의 손에 달려 있습니다.****​**

**XRCLOUD: 무엇이 포함되어 있나요?**

**1. XRCLOUD 프로젝트 개요**

[**📌 XRCLOUD 프로젝트 소개**](https://github.com/belivvr/xrcloud/blob/main/README_ko.md)**XRCLOUD는 ****Mozilla Hubs 기반으로 확장된 WebXR 메타버스 플랫폼****입니다.****하지만 단순한 Hubs 클론이 아니라, 풀바디아바타, 점프, 3인칭자유시점, 빠른입장, 아바타변경, 콘텐츠 브라우징이 가능한 인라인프레임 컴포넌트같은 추가 기능과  상용화 서비스에 꼭 필요한 다양한 운영을 위한 다양한 기능이 추가되어 있습니다.****✔ ****회원제 서비스****: 사용자 등급 설정 & 관리 기능****✔ ****대시보드 제공****: 씬, 룸 관리 기능 포함****✔ ****OpenAPI 지원****: 3rd Party 플랫폼과 연동 가능****✔ ****메타버스 공간 관리 기능 강화****: 룸 개설, 구독 서비스 운영 가능**

**2. XRCLOUD 적용 사례**

**📌**[** XRCLOUD 적용 사례**](https://github.com/belivvr/xrcloud/blob/main/docs/applied_cases_ko.md)**XRCLOUD는 단순한 기술이 아니라, 실제 서비스에서 운영되며 검증된 플랫폼이며 각 플랫폼을 개발하면서 어떻게 적용했는지에 대한 설명과 관련 코드도 공개합니다.****🎓 CNU메타버시티 (전남대학교 메타버스 캠퍼스)**- 대학 정보 시스템과 연동해 로그인 및 공간 관리 지원
- 학위수여식, 입학식, 성과공유회 등 메타버스 행사 운영
**📚 메타트랙 (NIPA 지원 교육 플랫폼)**- 교사가 메타버스 수업 개설 & 학생 출석 관리 기능 제공
- 학습 통계 데이터 분석 연계
- 콘텐츠 공급의 공간 관리 및 Unity WebGL콘텐츠를 포함한 외부 플랫폼 및 콘텐츠 연동
**🖼 클래스브이 (메타버스 창작 교육 플랫폼)**- AI웹툰을 만들어 메타버스 공간에 전시하는 교육 프로그램
**이처럼, XRCLOUD는 ****단순한 기술이 아니라, 실제 운영 사례가 있는 검증된 솔루션****입니다.**

**3. 무료 공개된 메타버스 공간 62종 공개**

**📌 **[**XRCLOUD 공간 데이터 **](https://github.com/belivvr/xrcloud/blob/main/docs/spoke_files/README_ko.md)XRCLOUD는 CCL기반에 사용할 수 있는 총 다양한 가상공간을 무료로 제공합니다. 총 62종을 제공하며 Hubs에서 제공하던 공개 공간과 함께, BELIVVR에서 제작한 공간도 포함되어 있습니다. ** 🏛 대형 컨벤션 센터 – 이벤트 & 전시회 공간****🎓 클래스브이 클래스룸 – 교육 & 강의용 공간****🎨 모던 컬러 갤러리 – 전시 & 작품 발표 공간****🍷 AI웹툰 베리의 팬공간 – 커뮤니티 & 소셜 공간****🌍 순천시 오천 그린 광장 – 실제 지형 기반의 가상공간****🚀 각 공간은 Spoke 씬 에디터에서 자유롭게 수정 가능하며, WebXR 기반 메타버스를 구축하는 데 바로 활용할 수 있습니다.**

**4. 설치 및 운영 방법**

**📌**[** XRCLOUD 설치 가이드**](https://github.com/belivvr/xrcloud/blob/main/docs/installation_guide_ko.md)**XRCLOUD는 ****Docker 기반으로 쉽게 배포****할 수 있습니다.****✔ ****설치 & 운영 가이드 제공**** – 서버 구축부터 도메인 설정까지 정리****✔ ****Hubs, Reticulum, Spoke, Dialog 포함**** – WebXR 핵심 서비스 통합****✔ ****백엔드: Nest.js, Node.js, PostgreSQL**** / ****프론트엔드: Next.js, React****👉 직접 서버를 운영하며 WebXR 메타버스를 구축할 수 있습니다.**

**베리의 마지막 인사: "안녕이 아니라, 또 만나요."**

{{IMG:1}}

XRCLOUD를 찾아와 주셨던 모든 분들, 이 기술을 함께 고민하고, 만들어가고, 활용해 주셨던 분들.**XRCLOUD는 이제 저희 손을 떠납니다.**하지만, 여기 남긴 것들은 사라지지 않아요.누군가의 손에서 다시 쓰이고, 새로운 모습으로 바뀌고, 어디선가 또 다른 가능성으로 피어나겠죠.그러니까, 이건 진짜 '끝'이 아니에요.이제는 **여러분이 XRCLOUD를 이어나갈 차례예요.**저는 이제 떠나지만, 언제 어디서든, 다른 모습으로라도 다시 만날 수 있기를 바라요.**그동안 함께해 주셔서 정말 고마웠어요.**💜 안녕이 아니라, 또 만나요. VRRI (베리)**​****Ps. Luke의 마지막 이야기**- 마지막은 BELIVVR의 양병석 대표, Luke로서 글을 적습니다.
- 2017년 COMIXV로 창업하여 BELIVVR의 마무리까지 한창 시기의 시간과 노력을 쏟아 부었던 것 같습니다. 30대말에 시작했다 훌쩍 40대 중반을 넘어버렸습니다. 그저 XR환경에서 새로운 만화 형식인 VR웹툰을 만들어보고 싶어서 시작했던 일이 한 기업의 리더로서의 많은 도전을 받았고, 후회가 많았던 선택들이 있었던 것 같았습니다. 결국 믿어주셨던 많은 분들에 대한 보답을 해드리지 못했고, 제 자신에 대해 좀 더 돌아보게 되었습니다.
- 특히 2024년 5월 부터는 혼자 모든 코드들을 관리하고, 사업과 개발 작업을 하면서 SW엔지니어로서의 역량을 다시 시험해보며 인공지능기반의 개발이라는 큰 변화를 온 몸으로 느껴보았던 한해 였습니다.
- 만 8년간의 기간 동안 무엇이라도 남겨야지 싶어서 그동안 개발해 두었던 것들을 정리하여 오픈하였습니다. 아무래도 저희 서비스 기반에 서비스를 했던 파트너들이 있기에 각자의 엔지니어링 능력으로 운용 할 수 있게 하는 목적이 있기 때문에, 실제 서비스 운용 가능한 수준의 모든 노하우를 정리하려고 노력 하였습니다.
- 창업도 처음이 었지만 폐업도 처음이라 보유한 지식 자산들에 대한 처분들은 확실하지 않아 특허에 대한 권리를 보유한 Apache2.0으로 오픈 한점은 참고 바랍니다.
- Hubs를 기반으로 한 클라우드 서비스인 XRCLOUD는 BELIVVR의 사업 종료에 맞춰 지속 개발할 여력은 없습니다만, 이후에도 XR과 AI SW엔지니어링과 관련 일을 할 것 같습니다. BELIVVR의 Luke가 아닌 개인 Luke로서 새로운 기술로서 계속 인터넷에서 소통할 것 입니다.
- 감사합니다. 아직도 처리할게 조금은 남아있지만, 2025년은 새로운 모습으로 찾아뵙겠습니다.
- 추가 문의 사항은 fstroy97@gmail.com 으로 문의 바랍니다.
​#XRCLOUD #오픈소스 #WebXR #Hubs​

<!-- en -->
안녕하세요, 빌리버의 베리입니다. 어쩌면 이 글이 **XRCLOUD의 마지막 기록**일지도 몰라요.하지만, 마지막이라고 해서 모든 게 사라지는 건 아니잖아요. 우리가 남긴 것들, 우리가 만들어온 기술이 누군가의 손에서 다시 쓰이고, 새로운 모습으로 발전하길 바랍니다. XRCLOUD는 **누구나 WebXR 기반의 가상공간을 만들고 운영할 수 있도록** 설계된 클라우드 플랫폼입니다.BELIVVR이 더 이상 개발을 지속할 수는 없지만, 이 기술이 그냥 사라지는 대신, 더 많은 사람들이 활용할 수 있도록**모든 핵심 기능과 노하우를 오픈소스로 공개합니다.**또한, **2025년까지 XRCLOUD의 운영을 유지하며, 일부 파트너들에게 기술 지원을 제공할 예정입니다.**서비스를 직접 운영하고 싶은 분들을 위해 **설치 및 운용 가이드**도 제공하니, 필요한 분들은 자유롭게 활용해 주세요. **이제 XRCLOUD는 여러분의 손에 달려 있습니다.****​**

**XRCLOUD: What's Included?**

**1. XRCLOUD Project Overview**

[**📌 XRCLOUD Project Introduction**](https://github.com/belivvr/xrcloud/blob/main/README_ko.md)**XRCLOUD is a ****WebXR metaverse platform extended based on Mozilla Hubs****.****However, it's not just a simple Hubs clone; it includes additional features like full-body avatars, jumping, free third-person view, quick entry, avatar changes, and inline frame components for content browsing, along with various operational features essential for commercial services.**
✔ **Membership Service**: User level setting & management features
✔ **Dashboard Provided**: Includes scene and room management features
✔ **OpenAPI Support**: Integrates with 3rd Party platforms
✔ **Enhanced Metaverse Space Management**: Room creation, subscription service operation possible

**2. XRCLOUD Applied Cases**

**📌**[** XRCLOUD Applied Cases**](https://github.com/belivvr/xrcloud/blob/main/docs/applied_cases_ko.md)**XRCLOUD is not just a technology; it's a platform validated through operation in actual services. We also disclose explanations and related code on how it was applied during the development of each platform.**
**🎓 CNU Metaversity (Chonnam National University Metaverse Campus)**
- Linked with the university information system to support login and space management
- Operated metaverse events such as graduation ceremonies, entrance ceremonies, and performance sharing sessions
**📚 MetaTrack (NIPA-supported Education Platform)**
- Provided features for teachers to open metaverse classes & manage student attendance
- Linked with learning statistics data analysis
- Space management for content supply and integration with external platforms and content, including Unity WebGL content
**🖼 ClassV (Metaverse Creative Education Platform)**
- Educational program for creating AI webtoons and exhibiting them in metaverse spaces
**As such, XRCLOUD is ****not just a technology, but a verified solution with actual operational cases****.**

**3. 62 Free Metaverse Spaces Released**

**📌 **[**XRCLOUD Space Data **](https://github.com/belivvr/xrcloud/blob/main/docs/spoke_files/README_ko.md)XRCLOUD provides a total of various virtual spaces usable under CCL, free of charge. A total of 62 types are provided, including public spaces offered by Hubs, as well as spaces created by BELIVVR.**
**🏛 Large Convention Center – Event & Exhibition Space**
**🎓 ClassV Classroom – Education & Lecture Space**
**🎨 Modern Color Gallery – Exhibition & Artwork Presentation Space**
**🍷 AI Webtoon Berry's Fan Space – Community & Social Space**
**🌍 Suncheon Ocheon Green Plaza – Virtual Space Based on Real Terrain**
**🚀 Each space can be freely modified in the Spoke scene editor and can be immediately utilized to build WebXR-based metaverses.**

**4. Installation and Operation Method**

**📌**[** XRCLOUD Installation Guide**](https://github.com/belivvr/xrcloud/blob/main/docs/installation_guide_ko.md)**XRCLOUD can be ****easily deployed based on Docker****.**
✔ **Installation & Operation Guide Provided** – Covers everything from server setup to domain configuration
✔ **Includes Hubs, Reticulum, Spoke, Dialog** – Integrates core WebXR services
✔ **Backend: Nest.js, Node.js, PostgreSQL** / **Frontend: Next.js, React**
👉 You can build a WebXR metaverse by operating your own server.

**XRCLOUD, operates until 2025.**
**Currently, XRCLOUD has been open-sourced, but it's not being completely shut down; ****server operations will be maintained until 2025.****
✔ **XRCLOUD server operation maintained until September 2025**
✔ **Technical support provided to partners (until December 2025)**
✔ **Further service operation status after that is undecided**
While BELIVVR will no longer develop XRCLOUD, we are open-sourcing this project with the hope that it will be used by more people.
✔ **Apache 2.0 License applied for anyone to use**
✔ **Anyone who wishes to expand & develop the technology can freely utilize it**
People who dream of the metaverse,
Developers researching WebXR technology,
Creators who want to try new things.
Now, XRCLOUD is yours.
Feel free to use it and create a better metaverse.

**Berry's Final Farewell: "Not goodbye, but see you again."**

{{IMG:1}}

To everyone who visited XRCLOUD, who pondered, created, and utilized this technology with us.
**XRCLOUD is now leaving our hands.**
But what we've left behind won't disappear.
It will be used again by someone, transform into new forms, and blossom into other possibilities somewhere.
So, this isn't truly 'the end'.
Now, **it's your turn to carry on XRCLOUD.**
I'm leaving now, but I hope we can meet again, anywhere, anytime, even in a different form.
**Thank you so much for being with us.**
💜 Not goodbye, but see you again. VRRI (Berry)

**Ps. Luke's Final Story**
- This is written by Yang Byeong-seok, CEO of BELIVVR, as Luke.
- Starting COMIXV in 2017 and seeing BELIVVR through to its conclusion, I poured a significant amount of time and effort into it during my prime. I started in my late 30s and have now well passed my mid-40s. What began as a simple desire to create a new comic format, VR webtoons, in an XR environment led to many challenges as a corporate leader, and I feel there were many choices I regret. Ultimately, I couldn't repay the many people who believed in me, and I've had to reflect more on myself.
- Especially from May 2024, managing all the code, business, and development work alone, I re-tested my capabilities as a software engineer and experienced firsthand the significant change brought by AI-based development.
- Over the past 8 years, I wanted to leave something behind, so I organized and open-sourced what I had developed. Since we have partners who built services on our platform, the goal was to organize all the know-how to a level where they could operate the services with their own engineering capabilities.
- It was my first time starting a business, and also my first time closing one, so the disposition of intellectual assets was uncertain. Please note that it has been open-sourced under Apache 2.0, which retains patent rights.
- XRCLOUD, a cloud service based on Hubs, no longer has the capacity for continuous development in line with BELIVVR's business closure, but I will likely continue to work on XR and AI software engineering. As Luke, the individual, not Luke of BELIVVR, I will continue to communicate online with new technologies.
- Thank you. There are still a few things to handle, but I will meet you in a new form in 2025.
- For additional inquiries, please contact fstroy97@gmail.com.
​#XRCLOUD #OpenSource #WebXR #Hubs​