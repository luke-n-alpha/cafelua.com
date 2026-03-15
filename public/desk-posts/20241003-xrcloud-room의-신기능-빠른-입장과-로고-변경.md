---
date: "2024-10-03"
titleKo: XRCLOUD ROOM의 신기능, 빠른 입장과 로고 변경
titleEn: "XRCLOUD ROOM New Features: Fast Entry and Logo Change"
category: xrcloud
tags:
  - 사용팁
images:
  - /desk/20241003-xrcloud-room의-신기능-빠른-입장과-로고-변경/01.webp
  - /desk/20241003-xrcloud-room의-신기능-빠른-입장과-로고-변경/02.webp
  - /desk/20241003-xrcloud-room의-신기능-빠른-입장과-로고-변경/03.webp
  - /desk/20241003-xrcloud-room의-신기능-빠른-입장과-로고-변경/04.webp
  - /desk/20241003-xrcloud-room의-신기능-빠른-입장과-로고-변경/05.webp
  - /desk/20241003-xrcloud-room의-신기능-빠른-입장과-로고-변경/06.webp
  - /desk/20241003-xrcloud-room의-신기능-빠른-입장과-로고-변경/07.webp
  - /desk/20241003-xrcloud-room의-신기능-빠른-입장과-로고-변경/08.webp
  - /desk/20241003-xrcloud-room의-신기능-빠른-입장과-로고-변경/09.webp
thumbnail: /desk/20241003-xrcloud-room의-신기능-빠른-입장과-로고-변경/01.webp
sourceCategoryNo: "188"
sourceCategory: 사용팁
externalUrl: https://blog.naver.com/fstory97/223604958943
---

<!-- ko -->
안녕하세요. XRCLOUD를 만드는 BELIVVR의 luke입니다.  오래간만에 XRCLOUD에 추가 된 새로운 기능을 소개합니다. 빠른입장과 명시적인 ROOM의 입장 로고 변경 기능입니다.

​

1. Room URL은 어디서 받아 올 수 있나요?

두 기능 모두 Room URL의 뒤에 쿼리파라미터를 추가함으로서 손쉽게 이용 가능합니다. ROOM의 입장 URL은 ROOM API나 혹은 XRCLOUD의 대시보드에서 Rooms메뉴를 통해 확인하실 수 있습니다. API의 경우, 10분후에 만료되는 Private Room URL을 이용하여 좀 더 보안에 신경 쓴 개발을 하실 수 있습니다.

{{IMG:1}}

XRCLOUD의 대시보드의 Rooms 메뉴의 Room URL

{{IMG:2}}

XRCLOUD get Room API의 응답 값안 Room url

이번 변경은 입장 과정에 대한 기능으로 XRCLOUD를 이용하는 고객 분들이 주로 ROOM을 각자의 서비스에 연결해서 쓰다보니 다양한 요구사항을 반영하여 이번 추가 기능이 개발되었습니다. 기존 ROOM은 PC의 경우 아래와 같이 총 5단계에 걸쳐서 입장하게 됩니다. 먼저 해당 입장 프로세스를 설명드리고, 변경된 점을 알려드리겠습니다.​

2. XRCLOUD(Hubs)의 ROOM입장 프로세스에 대한 이해

{{IMG:3}}

기존 ROOM 입장 프로세스

- Loading page - Room에 배치된 각종 리소스들을 불러오고, Room에 접속하는 단계 입니다.
- Lobby- 입장하기, 다른 장치를 이용하기, 관전하기를 선택할 수 있습니다.
- 현재 XRCLOUD의 파트너들은 대부분 입장하기만 이용했기 때문에 다른 기능들에 대해서는 신경을 쓰지는 못했습니다. 다른 장치를 이용하기는 VR HMD로 입장할 수 있는 단축URL을 제공하는 기능이며, 관전하기는 Room에 직접 참여하지 않고 방의 상황을 둘러보는 기능으로  Room의 접속 인원에 해당되지 않아 Room의 최대 인원 수의 제한을 받지 않습니다. 현재 XRCLOUD는 무료버전으로 10명을 지원하지만, 현재(2024-10-02) 직접 개발을 지원해드리고 있고, 제한을 풀어드린 파트너들에게는 100명을 지원해드리고 있습니다. 내부 테스트 결과 최대 140명까지 접속이 가능합니다.
- Avatar Viewer- Room에 접속한 아바타를 보는 창입니다. XRCLOUD에서는 아바타 선택기능은 제공하지 않으며 다른 포스팅이나 가이드에서 안내드렸듯이 avatarUrl이라는 쿼리 파라미터를 통해 아바타를 변경할 수 있습니다. 빌리버에서 개발한 [전신 아바타 오픈소스](https://github.com/belivvr/xrcloud-avatar-editor)나 [Hackweek avatar Maker 오픈소스](https://mozilla.github.io/hackweek-avatar-maker/)를 활용하거나 아바타를 다운로드 받아서 URL로 넘기시면 이용이 가능합니다- 유사한 방식으로 사용가능한 표시 이름을 변경하는 쿼리파라미터는 displayName입니다.

# avataURL use example
https://room.xrcloud.app:4000/qkoCp3x/test2?public=04f740f3-b96f-43da-90da-5c99d64e2364
&avatarUrl=https://belivvr.github.io/files/Avatars/cnu_woman.glb
&displayName=GUEST

4.  I/O(Input/output) Device Setting - - 마이크, 스피커등의 장치 설정 메뉴 입니다. 마이크나 스피커가 여러개가 장치에 있는 경우, 잘 작동하는지 확인 후에 입장 가능합니다.
5.  Room- - 축하합니다. 드디어 Room에 입장하셨습니다.
​

3. FastEntry(빠른입장)

- 생각보다 너무 많은 단계를 요구하죠 ?  게임 중요 스토리도 생략하는 유저들도 많은데 요즘 이렇게 많은 단계를 두면 유저 다 도망갑니다. 그래서 만들었습니다. fastEntry  옵션

{{IMG:4}}

요즘 게이머들

- 사용방법은 매우 간단합니다. avatarUrl처럼 funcs에 쿼리파라미터를 추가하면, 모든 과정이 생략됩니다. 위 예제 URL과 아래예제 URL을 브라우져 주소창에 복사해서 들어가보시면 그 차이를 확인해 보실 수 있습니다.- funcs옵션에는 fastEntry외에도 아바타의 뒷모습을 볼 수 있는 3rd-view 가 있으며 그외에 메뉴의 컴포넌트들의 노출을 컨트롤할 수 있는 추가 파라미터가 있으나 아직 권한 정리가 제대로 끝나면 다시 한번 funcs에 관해 정리를 해서 공개하겠습니다.

# fastEntry use example
https://room.xrcloud.app:4000/qkoCp3x/test2?public=04f740f3-b96f-43da-90da-5c99d64e2364
&avatarUrl=https://belivvr.github.io/files/Avatars/cnu_woman.glb
&displayName=GUEST
&funcs=fastEntry

{{IMG:5}}

fastEntry 옵션

4. logoImg(로고 이미지)

- XRCLOUD는 프로젝트별로 파비콘과 로고 이미지를 변경하는 기능을 무료로 제공하고 있었습니다.

{{IMG:6}}

XRCLOUD의 프로젝트 대시보드

- 그런데 이번에 파트너의 새로운 요구사항은 파트너 서비스의 유저별로 생성되는 룸의 로고를 변경하고 싶다는 요구사항이 나왔습니다. XRCLOUD는 Spoke 에디터를 포함한 기능을 제공하다보니 당연히 Rooms이나 Scene의 Group 관리 기능이나 이에 따른 리소스 관리 기능이 나올거라는것을 미처 예상하지 못했습니다.
- 그래서 Room에 직접적으로 로딩 이미지의 로고를 교체할 수 있는 쿼리파라미터를 추가했습니다. 사용법은 역시 쿼리파라미터로 logoImg로 img의 URL을 넘겨주시면 ROOM접속시 로딩 이미지와 타이틀 이미지가 변경됩니다.
- 아래의 이미지의 URL은[https://belivvr.github.io/files/images/posting-241003.jpg](https://belivvr.github.io/files/images/posting-241003.jpg)  입니다.

{{IMG:7}}

[https://belivvr.github.io/files/images/posting-241003.jpg](https://belivvr.github.io/files/images/posting-241003.jpg)

- 위의 예제 URL에 추가로 logoImg 쿼리 파라미터를 추가해보겠습니다.

# fastEntry use example
https://room.xrcloud.app:4000/qkoCp3x/test2?public=04f740f3-b96f-43da-90da-5c99d64e2364
&avatarUrl=https://belivvr.github.io/files/Avatars/cnu_woman.glb
&displayName=GUEST
&funcs=fastEntry
&logoImg=https://belivvr.github.io/files/images/posting-241003.jpg

- 그러면 아래처럼 나옵니다. 참 쉽죠?

{{IMG:8}}

변경된 logoImg

5. XRCLOUD를 위해 BELIVVR가 현재 하고 있는 것

*  [https://api.xrcloud.app/docs](https://api.xrcloud.app/docs)  문서의 업데이트도 진행 예정입니다. * 가장 현재 급하게 진행하고 있는 업무는 두가지로, Spoke에디터의 MyAsset에 업로드된 미디어의 CDN적용과 1000명이 접속 가능한 Room의 기능 제공입니다. * 본래 hubs는 소규모 인원들이 활동하는 커뮤니티 도구로 개발되었으나 XRCLOUD의 파트너들은 주로 대단위의 대중을 위한 서비스를 하다보니 이러한 요구사항이 큽니다. * 특히 최근 중점적으로 보고 있는것은 spoke를 통해 업로드된 myAsset의 경우 reticulum을 통해 암호화되어 모두 XRCLOUD의 hubs서버를 통해 다운로드 하는 구조다보니 대단위의 접속 서비스를 처리함에 있어서 비용증가와 성능의 병목현상이 확인되었습니다. 이러한 서비스를 보다 스케일 있게 제공함에 있어서 안정된 서비스를 만드는게 지금 제 가장 큰 숙제 이며 어떻게 하면 적은 리소스로 더 많은 서비스를 제공할 수 있을지를 고민하고 있습니다.​ 물론 혼자 개발 및 기술 대응까지 하면서, 펀딩 문제가 가장 제게는 가장 큰 어려움입니다. 많은 응원 바랍니다. 아. 10월 중순에 간만에 한국에서 작은 전시회를 나갈 예정으로 그동안 파트너들의 서비스를 해당 전시회에서 보여드리기 위해 XRCLOUD 서비스 페이지의 프론트 페이지도 조금 손을 볼 예정입니다.그리고 xrcloud의 news페이지의 피드가 깨졌던 문제를 해결했고, 비용 문제로 인해 MS의 foundershub 를 통해 클라우드를 지원받아 서버 이전을 하여 성능을 향상시켰습니다. 자주 소식을 전하지는 못하지만 열심히 하고 있으니 많은 응원 부탁드립니다.​감사합니다. ​

{{IMG:9}}

웹메타버스는 XRCLOUD.app를 찾아주세요.

​

XRCLOUD 개발자 센터 저렴한 비용, 빠른 접근, 강력한 기능 3D공간 웹, 메타버스를 이용해보세요. 별도의 설치 프로그램없이 나만의 메타버스를 15분만에 제작해보세요. 홈페이지를 만드는 것 처럼 쉽고 빠르게 적은 비용으로도 웹 메타버스를 만들 수 있습니다. 글로벌 메타버스 오픈소스 모질라허브에 개발,운영에 필요한 추가 기능을 더하고 공공기관을 위해 안전한 G클라우드 까지 제공합니다. XRCLOUD로 XR공간 컴퓨팅 시대의 웹 서비스를 준비하세요. 메타버스 공간을 제작하려니 어디서부터 어떻게 해야할지 막막하셨죠? 그동안 복잡한 ... xrcloud.app

https://xrcloud.app/

<!-- en -->
Hello. This is Luke from BELIVVR, the creators of XRCLOUD. It's been a while, but I'm here to introduce new features added to XRCLOUD: Fast Entry and the ability to explicitly change the ROOM entry logo.

​

1. Where can I get the Room URL?

Both features can be easily used by adding query parameters to the end of the Room URL. You can find the ROOM entry URL through the ROOM API or the Rooms menu in the XRCLOUD dashboard. For the API, you can develop with more security by using a Private Room URL that expires after 10 minutes.

{{IMG:1}}
                                
                            Room URL in the Rooms menu of the XRCLOUD dashboard

{{IMG:2}}
                                
                            Room URL in the response value of the XRCLOUD get Room API

These changes are related to the entry process. Since XRCLOUD customers primarily connect ROOMs to their own services, these new features were developed to reflect various requirements. The existing ROOM entry process for PC users involves a total of 5 steps, as shown below. First, I will explain this entry process, and then I will tell you about the changes.

2. Understanding the XRCLOUD (Hubs) ROOM Entry Process

{{IMG:3}}
                                
                            Existing ROOM Entry Process

- Loading page - This step involves loading various resources placed in the Room and connecting to the Room.
- Lobby - You can choose to enter, use another device, or spectate.
- Most of XRCLOUD's partners currently only use the "Enter" option, so we haven't focused on other features. "Use another device" provides a shortcut URL to enter with a VR HMD, and "Spectate" allows you to look around the room without directly participating. Spectators are not counted towards the room's connection limit, so they are not subject to the maximum room capacity. XRCLOUD currently supports 10 people for the free version, but we are currently (2024-10-02) providing direct development support, and for partners whose limits have been lifted, we support 100 people. Internal tests have shown that up to 140 people can connect.
- Avatar Viewer - This window shows the avatar connected to the Room. XRCLOUD does not provide an avatar selection feature; as guided in other posts or guides, you can change your avatar via the `avatarUrl` query parameter. You can use the [full-body avatar open source](https://github.com/belivvr/xrcloud-avatar-editor) developed by BELIVVR or the [Hackweek avatar Maker open source](https://mozilla.github.io/hackweek-avatar-maker/), or download an avatar and pass its URL. Similarly, the query parameter for changing the display name is `displayName`.

# avataURL use example 
https://room.xrcloud.app:4000/qkoCp3x/test2?public=04f740f3-b96f-43da-90da-5c99d64e2364
&avatarUrl=https://belivvr.github.io/files/Avatars/cnu_woman.glb
&displayName=GUEST

4. I/O (Input/output) Device Setting - This is the menu for setting up devices like microphones and speakers. If there are multiple microphones or speakers on the device, you can enter after confirming they are working correctly.
5. Room - Congratulations! You have finally entered the Room.
​

3. FastEntry

- That's quite a lot of steps, isn't it? Many users even skip important story parts in games these days, so having so many steps would make users leave. That's why we created the `fastEntry` option.

{{IMG:4}}
                                
                            Gamers these days

- Usage is very simple. Just like `avatarUrl`, if you add a query parameter to `funcs`, all steps are skipped. You can see the difference by copying the example URL above and the example URL below into your browser's address bar. Besides `fastEntry`, the `funcs` option also includes `3rd-view` to see the back of the avatar, and other parameters to control the exposure of menu components. However, I will organize and release information about `funcs` again once the permissions are properly sorted out.

# fastEntry use example
https://room.xrcloud.app:4000/qkoCp3x/test2?public=04f740f3-b96f-43da-90da-5c99d64e2364
&avatarUrl=https://belivvr.github.io/files/Avatars/cnu_woman.glb
&displayName=GUEST
&funcs=fastEntry

{{IMG:5}}
                                
                            fastEntry option

4. logoImg (Logo Image)

- XRCLOUD has been providing the ability to change favicons and logo images per project for free.

{{IMG:6}}
                                
                            XRCLOUD Project Dashboard

- However, a new requirement from a partner recently emerged: they wanted to change the logo for rooms generated for each user of their service. Since XRCLOUD provides features including the Spoke editor, we hadn't anticipated the need for Room or Scene Group management features or associated resource management features.
- So, we added a query parameter, `logoImg`, to directly replace the loading image's logo in the Room. To use it, simply pass the URL of the image as the `logoImg` query parameter, and the loading image and title image will change when connecting to the ROOM.
- The URL for the image below is [https://belivvr.github.io/files/images/posting-241003.jpg](https://belivvr.github.io/files/images/posting-241003.jpg).

{{IMG:7}}
                                
                            [https://belivvr.github.io/files/images/posting-241003.jpg](https://belivvr.github.io/files/images/posting-241003.jpg)

- Let's add the `logoImg` query parameter to the example URL above.

# fastEntry use example
https://room.xrcloud.app:4000/qkoCp3x/test2?public=04f740f3-b96f-43da-90da-5c99d64e2364
&avatarUrl=https://belivvr.github.io/files/Avatars/cnu_woman.glb
&displayName=GUEST
&funcs=fastEntry
&logoImg=https://belivvr.github.io/files/images/posting-241003.jpg

- Then it will appear as below. Easy, right?

{{IMG:8}}
                                
                            Changed logoImg

5. What BELIVVR is currently doing for XRCLOUD

* Updates to the [https://api.xrcloud.app/docs](https://api.xrcloud.app/docs) documentation are also planned.
* The two most urgent tasks currently underway are applying CDN to media uploaded to MyAsset in the Spoke editor and providing Room functionality that can accommodate 1000 users.
* Hubs was originally developed as a community tool for small groups, but XRCLOUD's partners primarily provide services for large audiences, so these requirements are significant.
* In particular, we have recently focused on the fact that `myAsset` uploaded via Spoke is encrypted through Reticulum and downloaded via XRCLOUD's Hubs server. This structure has led to increased costs and performance bottlenecks when handling large-scale connection services. Making the service stable to provide it more scalably is my biggest challenge right now, and I am contemplating how to provide more services with fewer resources. Of course, developing and handling technical support alone, funding issues are my biggest difficulty. Please give us a lot of support. Oh, I'm planning to attend a small exhibition in Korea in mid-October for the first time in a while. To showcase our partners' services at that exhibition, I'll also be doing some work on the front page of the XRCLOUD service page. Also, we fixed the broken feed on the xrcloud news page and improved performance by migrating servers with cloud support from MS FoundersHub due to cost issues. I may not be able to share updates frequently, but I'm working hard, so please give us a lot of support. Thank you.

{{IMG:9}}
For web metaverse, please visit XRCLOUD.app.

XRCLOUD Developer Center: Experience 3D spatial web and metaverse with low cost, fast access, and powerful features. Create your own metaverse in just 15 minutes without any separate installation program. You can build a web metaverse easily, quickly, and at a low cost, just like creating a website. We add necessary additional features for development and operation to the global metaverse open-source Mozilla Hubs, and even provide secure G-Cloud for public institutions. Prepare your web services for the era of XR spatial computing with XRCLOUD. Were you at a loss as to where and how to start when trying to create a metaverse space? All that complicated... xrcloud.app

https://xrcloud.app/

#WebMetaverse #XRCLOUD