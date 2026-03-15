---
date: "2024-06-09"
titleKo: "[XRCLOUD] XRCLOUD개발 가이드 & 단기이슈 리스트 공개"
titleEn: "[XRCLOUD] XRCLOUD Development Guide & Short-Term Issue List Revealed"
category: xrcloud
tags:
  - XRCLOUD
images:
  - /desk/20240609-xrcloud-xrcloud개발-가이드-단기이슈-리스트-공개/01.webp
thumbnail: /desk/20240609-xrcloud-xrcloud개발-가이드-단기이슈-리스트-공개/01.webp
sourceCategoryNo: "183"
sourceCategory: XRCLOUD
externalUrl: https://blog.naver.com/fstory97/223473568144
---

<!-- ko -->
안녕하세요. 빌리버 루크입니다. 웹기반의 메타버스를 개발할 수 있는 SaaS플랫폼인 XRCLOUD의 개발 가이드를 공개합니다. 현대백화점그룹의 메타버스 이벤트 페이지였던 CommingM, 전남대학교의 CNU메타버시티, 순천시의 환경메타버스인 순천에코넷, 최근에는 메디오피아테크와 함께 교육메타버스 플랫폼인 메타트랙을 개발 중에 있습니다. 주로 전시, 교육 쪽에서 많이 활용되고 있는데 쉬운 접근성과 확장성 때문입니다. 모질라허브의 서비스 종료와 함께 빌리버의 펀딩 상황이 썩 좋지 않아 1인기업으로 전환 한 이후에도 업무는 계속되고 있습니다. 또한 모질라허브가 모질라에서 빠진거지 허브파운데이션이라는 새로운 재단에서 진행을 하신다고 제 글에 서운함을 표현해줌과 동시에 함께 도움이 되자고 하셨습니다. 제가 영어 실력이 미진하고, 업무에 바빠서 잘 참고하고 있지 못했던 것 같습니다. 허브파운데이션에 대해서는 제가 좀 더 잘 알아보고 추가 적으로 포스팅 하겠습니다.​ 어쨌든 아직도 내실을 다지고 있지만, 전세계적으로 널리 사용되고 있는 허브는 해외에서 협업 문의가 종종 오고 있고 추가 협업 요청이 있습니다.   이에 전체적으로 현재 프로젝트의 정리가 먼저 필요해서 개발 가이드 제작과 함께 전체적인 상황 점검을 진행했습니다. 서비스의 진행 단계부터 시작했어야 했던 일을 이제서야 했습니다. 서비스가 SaaS라고 해서 좀 막연하게 느껴지시는 분들에게 도움이 될 문서이며 개발,운영 중 모든 노하우들을 해당 문서를 통해 업데이트 예정입니다.

{{IMG:1}}

XRCLOUD를 이용한 표준 개발 구조

[**XRCLOUD 개발 가이드 (한글) | Notion** I. 문서의 목적 belivvr.notion.site](https://belivvr.notion.site/43e1d9afad5e484db3c1a82b359a0dff?v=59c08d598ee7486697443ad2496d325b&pvs=74)

이 와중에 산적한 이슈들 또한 발견되기도 했고, 순차적으로 개선 예정입니다.[https://belivvr.notion.site/XRCLOUD-5db051900acf4beaa8d6a66356b538b0](https://belivvr.notion.site/XRCLOUD-5db051900acf4beaa8d6a66356b538b0)제가 조직을 잘 정비하지 못한 탓에 시간과 비용 손실이 컸고 인수인계가 제대로 되지 못한 기술 부채도 많이 쌓여 있는 것 같아 자책도 좀 많이 들었습니다.

https://belivvr.notion.site/XRCLOUD-5db051900acf4beaa8d6a66356b538b0
[**단기적으로 개선 필요한 XRCLOUD의 이슈 목록 | Notion** [우선순위:상] [버그] [Spoke] 바위키트, 건축키트, 사운드팩 모델 누락 복구 → 원본 파일 구해서 서버 업로드 belivvr.notion.site](https://belivvr.notion.site/XRCLOUD-5db051900acf4beaa8d6a66356b538b0)

혹시 사용중에 제가 발견하지 못한 추가적인 급한 이슈가 있으시면 언제든 연락 부탁드립니다.​​​

<!-- en -->
Hello. This is Belivvr Luke. We are releasing the development guide for XRCLOUD, a SaaS platform that enables the development of web-based metaverses. We have developed CommingM, a metaverse event page for Hyundai Department Store Group; CNU Metaversity for Chonnam National University; Suncheon Eco-Net, an environmental metaverse for Suncheon City; and most recently, we are developing MetaTrack, an educational metaverse platform, with Mediopia Tech. It is primarily used in exhibitions and education due to its easy accessibility and scalability. With the termination of Mozilla Hubs' service and Belivvr's less-than-ideal funding situation, work has continued even after transitioning to a one-person company. Furthermore, someone expressed disappointment in my previous post, stating that Mozilla Hubs merely left Mozilla and is now being run by a new foundation called Hubs Foundation, and suggested we help each other. It seems I haven't been able to follow up well due to my limited English skills and busy work schedule. I will look into Hubs Foundation more thoroughly and post an update later. In any case, while we are still strengthening our internal capabilities, Hubs, which is widely used worldwide, frequently receives collaboration inquiries and additional collaboration requests from overseas.

Therefore, a comprehensive organization of the current project was first needed, so we proceeded with creating a development guide and conducting an overall situation review. We have finally done what should have been started from the service's initial development phase. This document will be helpful for those who find the term 'SaaS' somewhat vague, and all development and operational know-how will be updated through this document.

{{IMG:1}}

Standard Development Structure using XRCLOUD

[**XRCLOUD Development Guide (Korean) | Notion** I. Purpose of the Document belivvr.notion.site](https://belivvr.notion.site/43e1d9afad5e484db3c1a82b359a0dff?v=59c08d598ee7486697443ad2496d325b&pvs=74)

Amidst this, numerous accumulated issues were also discovered and are scheduled for sequential improvement.
[https://belivvr.notion.site/XRCLOUD-5db051900acf4beaa8d6a66356b538b0](https://belivvr.notion.site/XRCLOUD-5db051900acf4beaa8d6a66356b538b0)
I felt a lot of self-reproach because my failure to properly organize the team led to significant time and cost losses, and it seems a lot of technical debt accumulated due to improper handovers.

https://belivvr.notion.site/XRCLOUD-5db051900acf4beaa8d6a66356b538b0
[**Short-term Improvement Needed: XRCLOUD Issue List | Notion** [Priority: High] [Bug] [Spoke] Rock Kit, Architecture Kit, Sound Pack Model Missing Recovery → Obtain original files and upload to server belivvr.notion.site](https://belivvr.notion.site/XRCLOUD-5db051900acf4beaa8d6a66356b538b0)

If you encounter any additional urgent issues during use that I haven't discovered, please feel free to contact me at any time.