---
date: "2023-08-03"
titleKo: XRCLOUD로 360전시관 만들기 - 모질라허브로 KRPano, 메타포트 대체하기
titleEn: Building a 360 Exhibition Hall with XR
category: xrcloud
tags:
  - 사용팁
images:
  - /desk/20230803-xrcloud로-360전시관-만들기---모질라허브로-krpano-메타포트-대체하기/01.webp
  - /desk/20230803-xrcloud로-360전시관-만들기---모질라허브로-krpano-메타포트-대체하기/02.webp
  - /desk/20230803-xrcloud로-360전시관-만들기---모질라허브로-krpano-메타포트-대체하기/03.webp
  - /desk/20230803-xrcloud로-360전시관-만들기---모질라허브로-krpano-메타포트-대체하기/04.webp
  - /desk/20230803-xrcloud로-360전시관-만들기---모질라허브로-krpano-메타포트-대체하기/05.webp
  - /desk/20230803-xrcloud로-360전시관-만들기---모질라허브로-krpano-메타포트-대체하기/06.webp
  - /desk/20230803-xrcloud로-360전시관-만들기---모질라허브로-krpano-메타포트-대체하기/07.webp
  - /desk/20230803-xrcloud로-360전시관-만들기---모질라허브로-krpano-메타포트-대체하기/08.webp
  - /desk/20230803-xrcloud로-360전시관-만들기---모질라허브로-krpano-메타포트-대체하기/09.webp
  - /desk/20230803-xrcloud로-360전시관-만들기---모질라허브로-krpano-메타포트-대체하기/10.webp
  - /desk/20230803-xrcloud로-360전시관-만들기---모질라허브로-krpano-메타포트-대체하기/11.webp
  - /desk/20230803-xrcloud로-360전시관-만들기---모질라허브로-krpano-메타포트-대체하기/12.webp
  - /desk/20230803-xrcloud로-360전시관-만들기---모질라허브로-krpano-메타포트-대체하기/13.webp
thumbnail: /desk/20230803-xrcloud로-360전시관-만들기---모질라허브로-krpano-메타포트-대체하기/01.webp
sourceCategoryNo: "188"
sourceCategory: 사용팁
externalUrl: https://blog.naver.com/fstory97/223174026927
---

<!-- ko -->
안녕하세요. 빌리버 루크 입니다. 메타버스 하면  아이들이 하는 로블록스와 포트나이트 같은 3D기반의 게임을 떠올리실 겁니다. 하지만, 빌리버가 집중하고 있는 기업대상의 메타버스에서 가장 많은 요구사항이 있었던 영역은 전시 공간 구축 사업이었습니다. 특히 2020년 펜데믹 기간동안 전시와 행사 산업 부문에서는 오프라인 공간을 온라인으로  옮기는 작업들이 많이 이루어졌습니다.  빌리버도 한국만화박물관의 온라인 사업을 진행했습니다. 360도 사진을 찍고 웹에 360도 박물관을 만드는 사업 이었는데 그런 사업 경력이 도움이 되어 빌리버란 이름으로 회사명도 변경되고 메타버스 기업이 되었습니다. ​

**온라인 전시관에 가장 많이 사용되던 기술들, 메타포트, KRpano**

그리고 이때 가장 많이 사용되었던 기술은 메타포트(Metaport)와 KRPano 입니다. 해당 기술은 WebXR의 선조격이라 할 수 있는 WebVR기술로 360도 이미지를 배치하여 사용자가 현장에 간 것 같은 몰입감을 느끼게  했습니다. 한국의 대표 박물관인 국립 중앙박물관도 메타포트를 사용하고 있습니다.

{{IMG:1}}

https://blog.naver.com/PostView.naver?blogId=fstory97&logNo=223174026927&redirect=Dlog&widgetTypeCall=true&noTrackingCode=true&directAccess=false#

국립 중앙 박물관 온라인 박물관 ([https://www.museum.go.kr/site/main/exhiOnline/list](https://www.museum.go.kr/site/main/exhiOnline/list))

메타포트는 로우폴리곤의 3D지도와 함께 360도 이미지들을 연결하여 쉽게 이동하는 형식으로 구현되 있습니다. 구성이 매우 쉽다는 장점이 있지만, 코드단위의 수정이 불가하여 커스터마이징이 어렵다는 문제가 있었습니다. 당시 저희도 커스터마이징을 위해 메타포트에 SDK를 요청했으나 가격이나 기능면에서 어렵다고 판단했습니다. 그 다음으로 가장 많이 사용되는 엔진은 KRPano입니다. KRPano는 한번 SW를 구매하면 서버기반으로 그대로 사용할 수 있으며 뷰어의 코드 수정이 가능하다는 장점이 있습니다. 빌리버의 경우 예전 코믹스브이의 VR웹툰 업로더와 뷰어가 KRPano를 이용하여 개발되었습니다. 한국만화박물관의 VR박물관도 KRPano의 템플릿 코드를 수정하여 360도 이미지 위에 게시판까지 구현이 가능했습니다. 자체적으로 개발자를 보유하고 있고, 솔루션을 개발한다면 자유도와 가격면에서 가장 좋은 해답이었습니다.

{{IMG:2}}

https://blog.naver.com/PostView.naver?blogId=fstory97&logNo=223174026927&redirect=Dlog&widgetTypeCall=true&noTrackingCode=true&directAccess=false#

빌리버에서 진행했던 한국만화박물관 2020청년장애인 웹툰아카데미 온라인 전시회

**VR을 지원하는 WebXR**

하지만 메타포트와 KRPano는 메타퀘스트나 애플비전프로와 같은 XR을 지원하지 않는 옛 기술입니다. 카드보드는 구글에서 더 이상 개선하지 않는 기술로 사실상 2020년 정도경에 종료된 기술이라고 보시면 됩니다. 이에 저희는 2021년에는 WebVR의 차세대 글로벌 표준인 WebXR기술을 이용한 VR웹툰의 NFT박물관을 만들어봤습니다. 이 기술의 장점은 메타퀘스트와 같은 VR HMD를 지원합니다.

{{IMG:3}}

https://blog.naver.com/PostView.naver?blogId=fstory97&logNo=223174026927&redirect=Dlog&widgetTypeCall=true&noTrackingCode=true&directAccess=false#

빌리버의 VR웹툰 NFT박물관 V.Space[https://museum.comixv.com/site/vspace/index.html](https://museum.comixv.com/site/vspace/index.html)

하지만, 저희는 6DOF기반의 자유도를 가진 XR메타버스 환경으로 발전하고 있는 기술환경을 무시할 수 없었습니다. 따라서 저희는 6DOF 자유도와 PC,모바일,XR기기를 웹으로 지원하는 모질라재단의 허브 프로젝트를 이용한 클라우드 사업 XRCLOUD의 기술개발에 집중하고 있고, 얼마전에 무료버전의 서비스를 오픈 했습니다.   그래서 이번에는 XRCLOUD(모질라허브)를 이용한 360 전시관 제작 방법을 소개드리겠습니다. 아래의 예제를 직접해 보시는데는 완벽히 무료이고, 긴 시간이 들지 않습니다.​

**XRCLOUD(모질라 허브)로 360 박물관을 만들어 봅시다.**

먼저 간략하게 방법을 설명 드리면, XRCLOUD(모질라허브)의 웹 에디터인 Spoke만 이용을 할 겁니다. 필요한 건 360도 이미지와 웨이포인트를 지정할 화살표 이미지 인데, 아래에서 제공드리는 spoke파일에는 제가 미리 올려놓은 이미지들의 URL이 삽입 되어 있습니다. 만약 해당 이미지를 교체하시고 싶으시면 XRCLOUD의 씬(Spoke에디터)에 이미지를 드래그앤 드롭해주시면 쉽게 이미지를 추가 하실 수 있습니다.  컨셉은 아주 단순합니다. 모질라 허브는 360이미지를 올릴 수 있으며, 웨이포인트를 지정할 수 있고, 링크를 통해 웨이포인트를 이동할 수 있습니다. 공간에 360도 이미지를 구 형태로 배치하고, 그 360 이미지 중심점에 웨이포인트를 지정한 후에, 다음 이동할 웨이포인트에 링크만 걸어 주면 동일한 구현이 가능하다는 의미죠. 그렇게 만든게 아래의 링크로 직접 체험해보세요. [https://room.xrcloud.app:4000/LzhKGDX/vspace](https://room.xrcloud.app:4000/LzhKGDX/vspace)

https://room.xrcloud.app:4000/LzhKGDX/vspace
[**vspace |** Join others in VR at vspace, right in your browser. room.xrcloud.app](https://room.xrcloud.app:4000/LzhKGDX/vspace)

모질라허브 버전 VSpace영상

자세한 설명은 모질라 허브가 아닌 XRCLOUD를 기준으로 설명 드리겠습니다. 모질라허브에 Free-tier를 새로 만드시면 AWS에 서버가 셋팅되는 시간을 기다리셔야 하나, XRCloud는 클라우드 인스턴스를 나누어서 쓰는 구조기 때문에 즉시 사용 가능한 장점이 있습니다.  프로젝트 만드는 건 아래의 링크 참고하세요. [https://blog.naver.com/fstory97/223165965616](https://blog.naver.com/fstory97/223165965616)

[**XRCLOUD로 5분만에 나만의 웹3D 메타버스 공간 만들기,모질라 허브** XRCLOUD 는 (주) 빌리버에서 제공하고 있는 공간 컴퓨팅 시대의 3D 웹(메타버스)을 위한 클라우드 ... blog.naver.com](https://blog.naver.com/fstory97/223165965616)

허브에서 공간 에디팅 되는 프로젝트는 Scean이라고 불립니다. XRCLOUD의 Sceans메뉴에서 Scean을 만들 수 있습니다. 제일 간단한 방법은 제가 만든걸 그냥 불러오시면 위에서 보여드린 공간을 수정해보실 수 있습니다.  아래의 파일을 File>Import legacy.spoke project로 불러와보세요.[https://drive.google.com/file/d/1BL0t7c1NE1D5oC2Kvqh3MNQYMqh7AZAz/view](https://drive.google.com/file/d/1BL0t7c1NE1D5oC2Kvqh3MNQYMqh7AZAz/view)

[**vspace.spoke** vspace.spoke Sign In drive.google.com](https://drive.google.com/file/d/1BL0t7c1NE1D5oC2Kvqh3MNQYMqh7AZAz/view)

{{IMG:4}}

https://blog.naver.com/PostView.naver?blogId=fstory97&logNo=223174026927&redirect=Dlog&widgetTypeCall=true&noTrackingCode=true&directAccess=false#

spoke파일 불러오는 법

일. 보시면 알겠지만, 이렇게 3개의 공간이 보입니다.

{{IMG:5}}

https://blog.naver.com/PostView.naver?blogId=fstory97&logNo=223174026927&redirect=Dlog&widgetTypeCall=true&noTrackingCode=true&directAccess=false#

3개의 공간 (360이미지)

에디터 조작법은 유투브에 모질라 허브 조작법 치시면 초등학생들을 위한 강의들이 있습니다.  이번 포스팅에서는 아셔야 되는 에셋종류와  배포 방법입니다.​**1. 360 이미지 올리기** 먼저 360이미지 올리는 방법입니다. 360이미지라는 에셋은 없고, Image에셋을 선택해주세요.  최대 업로드 이미지는 2048을 넘기지 않는것을 추천합니다만 그냥 잘 올라갑니다. 저는 4096x2048이미지를 올렸습니다. Projection 속성값을 360-equirectangular 를 선택하시면 구로 바뀝니다. 에셋은 위치 값, 각도, 크기를 조정하여 공간에 배치할 수 있습니다. 주의할 점은 360이미지는 웨이포인트보다 Y값을 1 높게 설정합니다. 아바타의 눈이 되는 카메라 위치는 키 때문에 1이 더 높기 때문입니다.

{{IMG:6}}

https://blog.naver.com/PostView.naver?blogId=fstory97&logNo=223174026927&redirect=Dlog&widgetTypeCall=true&noTrackingCode=true&directAccess=false#

{{IMG:7}}

https://blog.naver.com/PostView.naver?blogId=fstory97&logNo=223174026927&redirect=Dlog&widgetTypeCall=true&noTrackingCode=true&directAccess=false#

**2. 웨이포인트 설정** 360이미지 중심점에 웨이포인트를 설정해주세요. 정확한 위치를 맞추기위해서는 마우스로 끌어서 위치를 맞추시기보다는 위치를 숫자로 직접 입력 해주시길 바랍니다. 그리고 웨이포인트의 각 이름을 설정하고 기억해주세요. 뒤에 링크에 사용됩니다.

{{IMG:8}}

https://blog.naver.com/PostView.naver?blogId=fstory97&logNo=223174026927&redirect=Dlog&widgetTypeCall=true&noTrackingCode=true&directAccess=false#

스포크의 웨이포인트 에셋

바닥을 깔아 줍니다. XRCLOUD(허브)는 3D공간을 돌아다니므로 가능한 돌아다니지 못하게 하기 위해 바닥 크기는 0.5이상으로 설정합니다. 3DOF처럼 보이게 하기 위해 작을 수록 좋지만, 0.5 이하면 아바타가 바닥에 올라가지 않고 하늘을 날게 되는 버그가 있습니다. 향후 저희가 관련한 개선이 가능할지는 좀 살펴보겠습니다.

{{IMG:9}}

https://blog.naver.com/PostView.naver?blogId=fstory97&logNo=223174026927&redirect=Dlog&widgetTypeCall=true&noTrackingCode=true&directAccess=false#

**3. 이동 화살표 설정** 다음 공간으로 넘어가기 위해 클릭하여 이동할 화살표 이미지 에셋을 공간에 배치하고 해당 이미지에 링크를 설정합니다.  360이미지내에 작은 다른 이미지를 넣는다고 생각하시면 됩니다. 웨이포인트의 카메라 위치로부터 적절한 각도에 넣어줘야 실제처럼 보입니다. 너무 멀면 클릭할 포인트가 작아지는 문제도 있으니 적절히 알아서 해보시고, 조금 더 고민해보면 다양한 트릭을 쓸 수 있을듯 합니다

{{IMG:10}}

https://blog.naver.com/PostView.naver?blogId=fstory97&logNo=223174026927&redirect=Dlog&widgetTypeCall=true&noTrackingCode=true&directAccess=false#

참고로 허브의 웨이포인트 이름은 허브의 URL 에 #{웨이포인트 이름}을 써주면 바로 이동 합니다. 주소창에 쳐 넣으셔도 됩니다. 이 기능을 이용했다고 보시면 됩니다. 하지만, 처음 부터 XRCLOUD에 생성하셨다면, 아직은 룸이 생성되기 이전일 겁니다.  따라서 어떤 URL을 넣을지 모르시겠죠? 그래서 먼저 XRCLOUD의 Scean프로젝트를 배포해주세요.​**4. 이제 XRCLOUD의 Room을 만드시고 생긴 URL을 확인 합니다.**

{{IMG:11}}

https://blog.naver.com/PostView.naver?blogId=fstory97&logNo=223174026927&redirect=Dlog&widgetTypeCall=true&noTrackingCode=true&directAccess=false#

XRCLOUD에서 생성된 Room

해당 Room주소는 고유합니다. 하지만 위에서 설명드린 웨이포인트는 SceanURL이 아닌 Room이름까지 포함된 경우에만 동작합니다. 따라서 웨이포인트에 입력해야 할 값은 아래와 같은 형식이 됩니다.[https://xrcloud.app:4000/LzhKGDX/vsapce#position2](https://xrcloud.app:4000/LzhKGDX/vsapce#position2)XRCLOUD의 Room URL + "/" + Room 이름 + "#웨이포인트명" 이 이동화살표에 걸 링크입니다.

{{IMG:12}}

https://blog.naver.com/PostView.naver?blogId=fstory97&logNo=223174026927&redirect=Dlog&widgetTypeCall=true&noTrackingCode=true&directAccess=false#

**4. 웹메타버스의 접근성을 극대화 시키는 웨이포인트의 다양한 활용**눈치 빠르신분은 이제 웨이포인트의 역할을 눈치채셨을 겁니다. XRCLOUD(모질라허브)에서 특정 공간으로 바로 사용자가 들어오게 하고 싶은 경우가 있을겁니다. 하나의 이벤트 공간내에 특정 부스앞으로 이동하는 것 같이 가능합니다. 이는 웹 페이지내에 있는 문서내의 하이퍼링크 스펙과 같습니다.  왜 웹 메타버스가 게임엔진 대비 메타버스 대비 강력해질 수 있는지에 대한 대표적 사례이며,  웹 메타버스가 웹의 자손임을 나타내는 것 아닐까 싶습니다.

{{IMG:13}}

https://blog.naver.com/PostView.naver?blogId=fstory97&logNo=223174026927&redirect=Dlog&widgetTypeCall=true&noTrackingCode=true&directAccess=false#

문서내의 하이퍼링크를 표현하는 웹표준, #태그

​스포크 웹에디터와 허브는 KRpano나 Metaport보다 높은 자유도와 다양한 에셋(기능)을 지원합니다. 무엇보다도 Krpano로 만들어진 메타버스는 혼자 보는 공간이 었다면 모질라허브는 여러사람이 인터렉션이 가능하고 음성으로 대화 가능한 메타버스라는 점이 중요합니다.  그 외에도 강력한 많은 기능들을 제공하고 있습니다. 만약 360도 사진과 영상기반의 메타버스 구축을 고민한다면 XRCLOUD(모질라허브)의 도입을 고민해보시길 바랍니다.  KRPano나 메타포드 대비 단점이 있다면 XR을 고려하다보니 공간 네비게이션에 최적의 UX를 제공하고 있지는 않는 점이 좀 문제가 있습니다. 특히 메타포트에서 지원하는 3D맵을 지원 여부가 좀 아쉬운데 해당 부분은 빌리버가 향후 개선하고자 하는 계획도 있습니다. ​ 그리고 이 360 전시관 케이스 스터디를 해보면서 발견한 버그인데, 360도 이미지 에셋안에서 셀피를 찍으니 360이미지가 안 찍힙니다 ㅜㅜ 예전 전신아바타때 카메라 찍는 부분에서 머리가 사라지는 버그때문에 저희 개발자가 고생했던 기억이 떠오르는데, 360전시관안에서 내 아바타와 사진은 꼭 찍어야지 않을까요 ?​ 모질라 허브 프로젝트에 이슈제기 해보겠습니다.​아. XRCLOUD는 아래의 링크에서 사용 가능합니다. 한번 써보시고 본격 도입을 원하시면 빌리버에 문의주세요.[https://xrcloud.app](https://xrcloud.app/)

https://xrcloud.app/
[**XRCLOUD - BELIVVR** Homepage Development Costs 3D Spatial Web, Metaverse Services xrcloud.app](https://xrcloud.app/)

​

<!-- en -->
Hello. This is Luke from Believer. When you think of the metaverse, you probably imagine 3D-based games like Roblox and Fortnite that children play. However, for the enterprise-focused metaverse that Believer concentrates on, the area with the most demand has been exhibition space construction. Especially during the 2020 pandemic, the exhibition and event industry saw a lot of work done to move offline spaces online. Believer also carried out an online project for the Korea Manhwa Museum. This project involved taking 360-degree photos and creating a 360-degree museum on the web. This experience helped us change our company name to Believer and become a metaverse company.

**The most commonly used technologies for online exhibition halls: Metaport, KRpano**

At that time, the most widely used technologies were Metaport and KRPano. These technologies, which can be considered ancestors of WebXR, used WebVR technology to arrange 360-degree images, giving users an immersive feeling as if they were on-site. The National Museum of Korea, a representative museum in Korea, also uses Metaport.

{{IMG:1}}
                                    

https://blog.naver.com/PostView.naver?blogId=fstory97&logNo=223174026927&redirect=Dlog&widgetTypeCall=true&noTrackingCode=true&directAccess=false#

                                
                            National Museum of Korea Online Museum ([https://www.museum.go.kr/site/main/exhiOnline/list](https://www.museum.go.kr/site/main/exhiOnline/list))

Metaport is implemented in a way that connects 360-degree images with a low-polygon 3D map, allowing for easy navigation. While it has the advantage of being very easy to configure, it had the problem of difficult customization due to the inability to modify code. At the time, we also requested an SDK from Metaport for customization, but we determined it was difficult in terms of price and functionality. The next most commonly used engine is KRPano. KRPano has the advantage that once the software is purchased, it can be used as is on a server basis, and the viewer's code can be modified. In Believer's case, the old ComixV VR webtoon uploader and viewer were developed using KRPano. The VR museum of the Korea Manhwa Museum was also able to implement even bulletin boards on 360-degree images by modifying KRPano's template code. If you have your own developers and are developing a solution, it was the best answer in terms of freedom and price.

{{IMG:2}}
                                    

https://blog.naver.com/PostView.naver?blogId=fstory97&logNo=223174026927&redirect=Dlog&widgetTypeCall=true&noTrackingCode=true&directAccess=false#

                                
                            Korea Manhwa Museum 2020 Youth with Disabilities Webtoon Academy Online Exhibition, conducted by Believer

**WebXR supporting VR**

However, Metaport and KRPano are old technologies that do not support XR like Meta Quest or Apple Vision Pro. Cardboard is a technology that Google no longer improves, and it was effectively discontinued around 2020. Therefore, in 2021, we created an NFT museum for VR webtoons using WebXR technology, the next-generation global standard for WebVR. The advantage of this technology is that it supports VR HMDs like Meta Quest.

{{IMG:3}}
                                    

https://blog.naver.com/PostView.naver?blogId=fstory97&logNo=223174026927&redirect=Dlog&widgetTypeCall=true&noTrackingCode=true&directAccess=false#

                                
                            Believer's VR Webtoon NFT Museum V.Space [https://museum.comixv.com/site/vspace/index.html](https://museum.comixv.com/site/vspace/index.html)

However, we could not ignore the evolving technological environment, which is progressing towards a 6DOF-based XR metaverse environment with greater freedom. Therefore, we are focusing on the technological development of XRCLOUD, a cloud business that uses the Mozilla Foundation's Hubs project to support 6DOF freedom and PC, mobile, and XR devices via the web. We recently launched a free version of the service. So, this time, I will introduce how to create a 360-degree exhibition hall using XRCLOUD (Mozilla Hubs). Trying out the example below is completely free and won't take long.

**Let's create a 360-degree museum with XRCLOUD (Mozilla Hubs).**

First, to briefly explain the method, we will only use Spoke, the web editor for XRCLOUD (Mozilla Hubs). What you need are 360-degree images and an arrow image to designate waypoints. The spoke file provided below already contains URLs for images I've uploaded. If you want to replace these images, you can easily add them by dragging and dropping images into the XRCLOUD scene (Spoke editor). The concept is very simple. Mozilla Hubs allows you to upload 360-degree images, designate waypoints, and move between waypoints via links. This means that by placing 360-degree images in a spherical shape within the space, designating waypoints at the center of those 360-degree images, and then linking them to the next waypoint, you can achieve the same implementation. Experience what we created directly via the link below. [https://room.xrcloud.app:4000/LzhKGDX/vspace](https://room.xrcloud.app:4000/LzhKGDX/vspace)

https://room.xrcloud.app:4000/LzhKGDX/vspace
                                [**vspace |** Join others in VR at vspace, right in your browser. room.xrcloud.app](https://room.xrcloud.app:4000/LzhKGDX/vspace)

Mozilla Hubs version VSpace video

I will explain in detail based on XRCLOUD, not Mozilla Hubs. If you create a new Free-tier in Mozilla Hubs, you have to wait for the AWS server to be set up, but XRCloud has the advantage of being immediately usable because it uses a shared cloud instance structure. Refer to the link below for creating a project. [https://blog.naver.com/fstory97/223165965616](https://blog.naver.com/fstory97/223165965616)

[**Create your own Web3D Metaverse space in 5 minutes with XRCLOUD, Mozilla Hubs** XRCLOUD is a cloud for 3D web (metaverse) in the era of spatial computing, provided by Believer Co., Ltd. blog.naver.com](https://blog.naver.com/fstory97/223165965616)

Projects that are edited in Hubs are called Scenes. You can create a Scene in XRCLOUD's Scenes menu. The simplest way is to just load what I've created, and you can then modify the space shown above. Try loading the file below via File > Import legacy.spoke project. [https://drive.google.com/file/d/1BL0t7c1NE1D5oC2Kvqh3MNQYMqh7AZAz/view](https://drive.google.com/file/d/1BL0t7c1NE1D5oC2Kvqh3MNQYMqh7AZAz/view)

[**vspace.spoke** vspace.spoke Sign In drive.google.com](https://drive.google.com/file/d/1BL0t7c1NE1D5oC2Kvqh3MNQYMqh7AZAz/view)

{{IMG:4}}
                                    

https://blog.naver.com/PostView.naver?blogId=fstory97&logNo=223174026927&redirect=Dlog&widgetTypeCall=true&noTrackingCode=true&directAccess=false#

                                
                            How to load a spoke file

1. As you can see, there are three spaces.

{{IMG:5}}
                                    

https://blog.naver.com/PostView.naver?blogId=fstory97&logNo=223174026927&redirect=Dlog&widgetTypeCall=true&noTrackingCode=true&directAccess=false#

                                
                            3 spaces (360 images)

For editor operation methods, if you search for 'Mozilla Hubs operation methods' on YouTube, you'll find tutorials for elementary school students. In this post, we'll cover the types of assets you need to know and how to deploy them.

**1. Uploading 360 Images**
First, here's how to upload a 360 image. There isn't a specific '360 image' asset; please select the 'Image' asset. It's recommended not to exceed 2048 for the maximum upload image size, but it generally uploads fine anyway. I uploaded a 4096x2048 image. If you select '360-equirectangular' for the Projection property, it will transform into a sphere. Assets can be placed in the space by adjusting their position, rotation, and scale. A point to note is that the 360 image's Y-value should be set 1 unit higher than the waypoint. This is because the camera position, which acts as the avatar's eyes, is 1 unit higher due to height.

{{IMG:6}}
                                    

https://blog.naver.com/PostView.naver?blogId=fstory97&logNo=223174026927&redirect=Dlog&widgetTypeCall=true&noTrackingCode=true&directAccess=false#

{{IMG:7}}
                                    

https://blog.naver.com/PostView.naver?blogId=fstory97&logNo=223174026927&redirect=Dlog&widgetTypeCall=true&noTrackingCode=true&directAccess=false#

**2. Setting Waypoints**
Set a waypoint at the center of the 360 image. To set the exact position, it's better to manually input the numerical coordinates rather than dragging with the mouse. Then, set and remember the name of each waypoint. It will be used in links later.

{{IMG:8}}
                                    

https://blog.naver.com/PostView.naver?blogId=fstory97&logNo=223174026927&redirect=Dlog&widgetTypeCall=true&noTrackingCode=true&directAccess=false#

                                
                            Spoke's Waypoint Asset

Lay down a floor. Since XRCLOUD (Hubs) allows movement in 3D space, set the floor size to 0.5 or more to prevent excessive wandering. Smaller is better to make it look like 3DOF, but if it's less than 0.5, there's a bug where the avatar flies in the sky instead of standing on the floor. We will look into whether we can make related improvements in the future.

{{IMG:9}}
                                    

https://blog.naver.com/PostView.naver?blogId=fstory97&logNo=223174026927&redirect=Dlog&widgetTypeCall=true&noTrackingCode=true&directAccess=false#

**3. Setting Navigation Arrows**
To move to the next space, place an arrow image asset in the space that users can click to navigate, and set a link for that image. Think of it as embedding a small image within the 360 image. It needs to be placed at an appropriate angle from the waypoint's camera position to look realistic. If it's too far, the clickable area becomes small, so try to adjust it appropriately. With a bit more thought, various tricks could be employed.

{{IMG:10}}
                                    

https://blog.naver.com/PostView.naver?blogId=fstory97&logNo=223174026927&redirect=Dlog&widgetTypeCall=true&noTrackingCode=true&directAccess=false#

For reference, if you add `#{waypoint name}` to the Hubs URL, you can move directly to that waypoint. You can also type it into the address bar. You can consider this feature to be utilized. However, if you created it in XRCLOUD from the beginning, the room might not have been created yet. So, you might not know which URL to use, right? Therefore, first deploy your XRCLOUD Scene project.

**4. Now, create an XRCLOUD Room and check the generated URL.**

{{IMG:11}}
                                    

https://blog.naver.com/PostView.naver?blogId=fstory97&logNo=223174026927&redirect=Dlog&widgetTypeCall=true&noTrackingCode=true&directAccess=false#

                                
                            Room created in XRCLOUD

This Room address is unique. However, the waypoint described above only works when the Room name is included, not just the Scene URL. Therefore, the value to be entered for the waypoint will be in the following format:
[https://xrcloud.app:4000/LzhKGDX/vsapce#position2](https://xrcloud.app:4000/LzhKGDX/vsapce#position2)
XRCLOUD's Room URL + "/" + Room Name + "#waypointname" is the link to be attached to the navigation arrow.

{{IMG:12}}
                                    

https://blog.naver.com/PostView.naver?blogId=fstory97&logNo=223174026927&redirect=Dlog&widgetTypeCall=true&noTrackingCode=true&directAccess=false#

**4. Diverse Uses of Waypoints to Maximize Web Metaverse Accessibility**
Those who are quick-witted will have now realized the role of waypoints. There will be cases where you want users to enter a specific space directly in XRCLOUD (Mozilla Hubs). This is possible, for example, moving directly in front of a specific booth within an event space. This is similar to the hyperlink specification within a document on a web page. This is a prime example of why web metaverses can be more powerful than game engine-based metaverses, and perhaps indicates that the web metaverse is a descendant of the web.

{{IMG:13}}
                                    

https://blog.naver.com/PostView.naver?blogId=fstory97&logNo=223174026927&redirect=Dlog&widgetTypeCall=true&noTrackingCode=true&directAccess=false#

                                
                            Web standard for expressing hyperlinks within a document, #tag

Spoke web editor and Hubs support higher freedom and a wider variety of assets (features) than KRpano or Metaport. Most importantly, while metaverses created with Krpano were spaces for individual viewing, Mozilla Hubs is a metaverse where multiple people can interact and converse via voice, which is a significant point. It also offers many other powerful features. If you are considering building a 360-degree photo and video-based metaverse, we recommend considering XRCLOUD (Mozilla Hubs). A drawback compared to KRPano or Metaport is that, due to considering XR, it doesn't provide the optimal UX for spatial navigation, which is a bit of an issue. In particular, the lack of support for 3D maps, which Metaport supports, is a bit disappointing, but Belivvr has plans to improve this in the future.

Also, a bug I discovered while doing this 360 exhibition case study is that when I take a selfie within a 360-degree image asset, the 360 image doesn't get captured ㅜㅜ It reminds me of the time our developers struggled with a bug where the head disappeared when taking a picture with a full-body avatar. Shouldn't I be able to take a picture with my avatar in a 360 exhibition hall? I will raise this issue with the Mozilla Hubs project.

Oh. XRCLOUD is available at the link below. Try it out, and if you wish to implement it fully, please contact Belivvr.
[https://xrcloud.app](https://xrcloud.app/)

https://xrcloud.app/
                                [**XRCLOUD - BELIVVR** Homepage Development Costs 3D Spatial Web, Metaverse Services xrcloud.app](https://xrcloud.app/)