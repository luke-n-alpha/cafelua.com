---
date: "2023-08-10"
titleKo: 데이터주권을 고려한 메타버스를 만들자. XRCLOUD API의 구조와 사상
titleEn: Let's Build a Metaverse with Data Sovere
category: xrcloud
tags:
  - 소식
images:
  - /desk/20230810-데이터주권을-고려한-메타버스를-만들자-xrcloud-api의-구조와-사상/01.webp
  - /desk/20230810-데이터주권을-고려한-메타버스를-만들자-xrcloud-api의-구조와-사상/02.webp
  - /desk/20230810-데이터주권을-고려한-메타버스를-만들자-xrcloud-api의-구조와-사상/03.webp
  - /desk/20230810-데이터주권을-고려한-메타버스를-만들자-xrcloud-api의-구조와-사상/04.webp
  - /desk/20230810-데이터주권을-고려한-메타버스를-만들자-xrcloud-api의-구조와-사상/05.webp
  - /desk/20230810-데이터주권을-고려한-메타버스를-만들자-xrcloud-api의-구조와-사상/06.webp
  - /desk/20230810-데이터주권을-고려한-메타버스를-만들자-xrcloud-api의-구조와-사상/07.webp
  - /desk/20230810-데이터주권을-고려한-메타버스를-만들자-xrcloud-api의-구조와-사상/08.webp
  - /desk/20230810-데이터주권을-고려한-메타버스를-만들자-xrcloud-api의-구조와-사상/09.webp
  - /desk/20230810-데이터주권을-고려한-메타버스를-만들자-xrcloud-api의-구조와-사상/10.webp
  - /desk/20230810-데이터주권을-고려한-메타버스를-만들자-xrcloud-api의-구조와-사상/11.webp
thumbnail: /desk/20230810-데이터주권을-고려한-메타버스를-만들자-xrcloud-api의-구조와-사상/01.webp
sourceCategoryNo: "176"
sourceCategory: 소식
externalUrl: https://blog.naver.com/fstory97/223179597225
---

<!-- ko -->
이번 포스팅은 XRCLOUD를 통해 메타버스 플랫폼을 만드는 방법에 대해 실제 실습을 통해 XRCLOUD의 사상을 설명 드리고자 합니다. 저희 사상을 설명 드리기 위해서는 웹API에 대한 이해가 필요합니다. 간단하게는 웹서비스간의 약속된 규약을 통해 유기적으로 서비스를 만드는 공개 기술 정도로 이해해주시면 좋을 것 같습니다. 그래도 이해가 안 가시면, 웹사이트 URL로 정보를 주고 받는다. 정도만 이해해주세요.​

**1. 왜 API로 메타버스 플랫폼을 만들어야 하는가**

웹사이트 URL보면 꽤 복잡한데, 왜 복잡하게 API로 메타버스플랫폼을 만들게 하는가하는 의문점이 드실 겁니다. 이에 대해서는 저희가 주장하는 아래와 같은 이유가 있습니다.​** 1.1. 비즈니스 로직 독립적인 메타버스 기술**   메타버스를 도입하고자 하는 많은 기업들은 메타버스 플랫폼이 정한 방법의 비즈니스를 원하지 않을 수 있습니다.  대부분의 메타버스 플랫폼들은 각 산업 영역에 특화 기능을 제공하며 동시에 비즈니스 방식 자체도 입점 기업에게 강요하는 구조 입니니다. 교육을 특징으로 한 메타버스는 LMS를 품고 있고, 그림이나 3D객체를 거래할때 NFT의 수수료와 NFT의 거래방식도 메타버스에 락인이 되어있죠. 따라서 이러한 메타버스에서 사업하는 방식은 매우 고정적입니다. 특히 해당 산업 분야에서 각자의 방식으로 사업을 하던 회사들 입장에서는 기존 사업방식과 시스템을 활용할 수 없습니다.  하지만 저희 XRCLOUD는 다릅니다. 메타버스 공간을 만들 수 있는 웹 에디터를 제공하고, 메타버스 에디터의 프로젝트들을 관리하고, 배포된 공간을 관리하는 API를 제공하기 때문입니다.  API를 통해 개발자가 새로운 사이트를 만들어 공간 에디터 기능을 포함한 생성, 수정, 삭제, 업데이트를 하게 하여 완전히 별도의 메타버스 서비스를 만들 수 있게하여 각자의 방식대로 비즈니스를 펼칠 수 있습니다.  이러한 요구사항 때문에 각 기관들은 메타버스 기업에 커스터마이징된 독립 SW를 요구하기도 합니다. 이때 독립메타버스 구축은  커스터마이징으로 소스를 수정 배포 하는 방식으로 진행 되기 때문에, 원본소스의 업데이트를 지속적으로 제공받기 어렵고, 그 제작 비용과 관리비용이 매우 크게 들어갑니다.  하지만 XRCLOUD는 처음부터 독립메타버스를 만드는 것을 목적으로 한 서비스이므로 그 비용이 웹서비스 제작 비용 수준으로 매우 낮습니다. 이게 당연한 이유는 XRCLOUD의 메타버스는 본래 웹서비스이며 공간웹 서비스를 SaaS의 API로 개발 제공하는 사상을 가지고 있기 때문입니다.​**1.2. 개인 정보와 고객 정보를 저장하지 않는 메타버스 기술** 또한 저희는 아바타를 제공하지 않기에 개인정보와 고객정보를 저희 서버에 저장하지 않습니다. 메타버스 서비스에 아바타가 없다니 이게 무슨 얘기인가 ? 어리둥절 하시겠지만, 저희는 처음 부터 그러한 개념으로 접근했는데 이 배경에는 아바타를 표준 기술을 이용하기 때문이며, 아바타를 개선하기 위해서는 저희가 직접 그 표준 제정에 참여를 하는 방식을 취하고 있기 때문입니다. 제일 유사한 것은 이세계 아이돌이 활동하는 플랫폼으로 유명한 VR Chat을 상상하시면 됩니다. VRChat의 아바타는 아바타가 VRChat이 아닌 다른 스토어에서 제작 거래 되고, VRoid를 통해 VR스트리밍 방송에도 활용 됩니다. 이는 VR Chat의 아바타의 VRCA라는 파일이 공개표준인 VRM파일과 변환 방법을 제공하기 때문입니다. 이는 달리 말하면 아바타 파일이 표준 포맷을 이용한다면 굳이 아바타의 정보를 메타버스 플랫폼이 꼭 가지고 있을 필요가 없으며 입장시에 아바타 파일을 가지고 입장하면 된다는 의미입니다. 저희 메타버스의 기반 엔진인 모질라 허브 아바타는 [오픈소스](https://mozilla.github.io/hackweek-avatar-maker/)를 통해 받아 보거나 오픈소스를 이용하여 개발자들이 자신만의 에디터를 만들 수 있습니다. 레디플레이미도 허브 아바타를 지원하는데 이는 국제 표준인 glTF표준 아바타를 쓰기 때문입니다.

저희가 작업 예정인 XRCLOUD의 전신 아바타도 오픈소스로 에디터를 공개하여 XRCLOUD와의 의존성을 완전히 제거하는 방향으로 개발 중입니다. 아바타 뿐만 아니라 사용자의 이름과 모든 정보도 이러한 방식으로 처리되며 공간에 입장시에 API를 통해 고객사의 플랫폼에서 저희 클라우드에 있는 공간으로 입장시에 사용자의 아바타와 같은 표현 정보를 들고 들어오는 방식으로 이용됩니다. 달리말하면 저희는 완벽히 클라이언트 플레이어 역할만 하는 구조입니다. 이러한 기술 구조의 장점은 메타버스 플랫폼이 소중한 고객정보를 저장하는 것을 근본적으로 방지시켜 줍니다. 로블록스, 제페토, ZEP모든 메타버스는 회원가입을 요구합니다. 하지만 저희는 그러한 요구가 필요 없고, 고객사의 고객이 고객정보를 들고 입장시키면 되기 때문에 저희는  고객 정보를 저장하지 않습니다.​**1.3. 공간에만 집중하는 메타버스 기술** 달리 말하면 다른 메타버스와 달리 저희는 그동안 웹 공간을 만들고 공간의 입출입과 권한을 안전하게 관리할 수 있는데 집중했습니다. 이해를 돕기 위해  교육메타버스를 가정해보겠습니다. 교육메타버스 개발에 LMS개발을 함께 요구하고, 메타버스내에 LMS기능이 있다고 특징을 내세웁니다.  그런데 학교라는 건물을 지으면서 건물(메타버스 플랫폼)의 기능에 학사시스템을 함께 만들어 달라하면 이상하지 않을까요 ? 그리고 학생이 교실에 들어갈 때, 학생의 모든 인적 정보가 교실(메타버스플랫폼)에 있어야 한다는 것도 이상하죠 ? 학생(3rd Party사용자 정보)은 학교 조직(3rdParty 플랫폼)에서 통해 반 배정을 받고 해당 방에 입장만 하면 됩니다. 물론, 조교는 문을 딸(인증) 수는 있어야 하겠죠.   저희는 2D웹 공간을 3D웹 공간으로만 혁신을 하는 것에만 집중하고 공간에만 집중하고 있으며 이에 대한 SW로직을 추상화 범용화를 해서, 각 비즈니스의 영역은 각 비즈니스가 잘 할 수 있도록 돕습니다. 때문에 예쁜 아바타와 예쁜 공간이 아닌 간편한 연동, 연계, 확장을 가장 큰 가치로 내세웁니다.  예쁜 아바타와 예쁜 공간은 각 개발사가 해주시면 되며 그 품질과 성능 역시 WebGPU와 같은 웹기술에 기반해 지속 발전합니다. 저희 XRCLOUD의 디자인 아이덴티티는 없는게 장점이며 덕분에 다양한 실험이 가능합니다.

{{IMG:1}}

Toward Facilitating Team Formation and Communication Through Avatar Based Interaction in Desktop-Based Immersive Virtual Environmets 논문 연구에 사용된 모질라허브의 다양한 아바타

​

**2. XRCLOUD API 구조 설명**

위에서 가치만 말씀 드렸는데, 이번엔 실제 API를 살펴보며 어떤 구조인지 설명 드리겠습니다.  문서와 서비스는 아래의 링크를 참고 바랍니다.​**API문서 URL : **[**https://api.xrcloud.app/docs/ko**](https://api.xrcloud.app/docs/ko)**서비스 URL : **[**https://xrcloud.app/ko**](https://xrcloud.app/ko)**​****2.1. API를 호출 하는 필수 열쇄, 인증 Key** API를 통해 개발을 한다는 의미는 개발자의 역할은 만들고자 하는 플랫폼의 관리자라고 생각하면 됩니다. 관리자면 당연히 열쇄가 있어서 무엇이든 할 수 있어야겠죠 ? XRCLOUD에 회원 가입을 하셨다면, Mypage에서 Key를 얻을 수 있습니다. 만약 해커에게 Key가 유출되면 플랫폼의 데이터를 마음대로 손댈수 있으니 매우 위험 합니다. 따라서 사용에 주의를 부탁드립니다. 혹시 유출됬다면 Generate api key를 눌러 다시 생성해주세요.

{{IMG:2}}

XRCLOUD에서 API를 호출할 수 있는 API Key

그리고 이 Key는 API호출시에 사용됩니다. 사용 예제는 API테스트에 널리 사용되는 Postman으로 Project의 API를 호출하는 예제를 설명 드리면서 실제 사용 방법을 보여드리며 설명 드리겠습니다.**​****2.2. 프로젝트(Project), 씬(Sceane), 룸(Room)의 관계 및 API구조** 프로젝트는 개발자 혹은 기업이 만드는 서비스 단위정도로 이해하세요. 예를들어 개발자 아무개가 구글과 페이스북을 만들었다고 하면 구글과 페이스북이 프로젝트가 됩니다. 그리고 이 프로젝트 아래에는 공간 설계도에 해당되는 씬(Sceane)이 있고, 공간설계도로 만든 실제 건물에 해당되는 룸(Room)이 있습니다. 계층 구조를 가지게 되는데, API도 동일한 계층 구조를 갖게 됩니다. {}로 표기된 곳이 상위 객체 api나 XRCLOUD사이트에서 얻어낼 수 있는 id입니다.

/api/projects/{project_id}/scenes/{scene_id}/rooms/{room_id}

예를들어 project_id가 P1, sceane_id가 S1, room_id가 R1이라고 가정하면 룸 R1의 정보를 호출하는 api는  /api/projects/**P1**/scenes/**S1**/rooms**/R1** 이 됩니다. 학교 반, 번호로 치면, 3학년 1반 12번 누구 이런 의미라고 보시면 됩니다.​**2.3. get Projects, Postman으로 프로젝트 정보를 불러와 보겠습니다.**  먼저  프로젝트의 정보를 가져오는 get Projects의 API문서를 보겠습니다.

{{IMG:3}}

get project API설명서

**2.3.1. API URL과 호출 정보** 설명을 보시면 먼저 왼쪽을 보시면 실제 api를 어떻게 호출하는지를 복사해 올 수 있습니다. 특히 Get인지 Post인지 주의해서보세요.  이 중 {}로 적혀 있는 값은 URL에 넣어 입력 해야 하는 값입니다. get project는 어떤 프로젝트를 불러올지 알아야 하므로 project의 id를 요구합니다. Projectid의 경우 XRCLOUD에 프로젝트 페이지에 가서 확인 가능하니 복붙해 두세요.

{{IMG:4}}

ProjectID위치

**2.3.2. API인증 및 전달 파라미터 설명**각 API 설명 상단에 보면 API호출시 인증 정보와 입력해야 하는 값이 표기 됩니다. 앞서 mypage에 있던 key를 요구한다는 설명입니다.​**2,3.3.) API의 결과 값 설명**각 API 설명 하단에는 호출 했을때 리턴하는 값들을 설명 합니다. sceaneCreateUrl이 보이시죠? 이 URL을 호출띄우면 공간의 설계도에 해당되는 씬(Sceane)에디터를 띄울 수 있음을 의미합니다. 관리자는 이를 통해 프로젝트 하위에 Sceane을 얼마든지 만들 수 있습니다.​**2.4) 포스트맨으로 호출 테스트는 아래와 같이 하면 됩니다.**

{{IMG:5}}

**2.4.1. API입력 및 설정****​**  [2.3.1]에서 설명했던 것과 마찬가지로 project Id를 포함한 api URL을 넣고 get으로설정했습니다.​ **2.4.2. API인증 정보 입력**** ** [2.3.2]에서 설명했던 것과 마찬가지로 인증(Authorization)탭의 Type은 Bearer token으로 XRCloud의 Mypage에 있던 Key를 넣었습니다. 그리고 Send를 누르면 실행 됩니다.​** 2.4.3.  API호출 후 값 확인** [2.3.3]에서 처럼 실제 리턴 값을 확인 가능합니다. 이중 SceaneCreationURL을 브라우져 URL에 넣으면 이렇게 공간 설계도를 만들 수 있는 웹 에디터가 뜹니다. 물론 기존 공간 설계도 (spoke)파일을 불러와 덮어 쓸 수도 있습니다.

{{IMG:6}}

**2.4. 이 getProject API로 무얼 할 수 있을까?**  위의 GetProject를 이용하면 사용자 플랫폼에 에디터를 붙힐 수 있습니다. getProject를 통해사실 Create Sceane을 구현하기 위한 정보가 getProject를 통해 전달 된 겁니다. 예를 들어 [공간 생성]버튼에 위에서 리턴받은 URL을 할당하면 되는거죠. 아래는 XRCLOUD의 씬(Sceane) 관리 도구인데, 유사한 내부 API를 통해 구현 되었다고 보시면 됩니다. 여기의 +버튼이 씬을 추가하는 기능입니다. 이와 동일한 기능을 만드신 플랫폼에 위 API를 통해 구현하실 수 있는 겁니다.

{{IMG:7}}

**2.5. 만든 씬(Sceane)은 어떻게 조회하고, 수정할까?**그럼 저렇게 씬(Sceane)을 만들고나서 수정은 어떻게 하지? 라고 생각이 드실 겁니다. 이를 위한 API는 get Sceanes입니다.

{{IMG:8}}

인증은 위와 동일하고, project_id뒤에 sceanes만 추가해주시면 됩니다. 그러면 만든 모든 sceane의 정보를 리스트로 보여줍니다. 페이징을 위해 skip과 taking 정보는 쿼리 파라미터로 입력 받습니다. 예를 들어 project_id가 P1인 프로젝트의 4페이지를 출력하고 10개의 아이템을 가져오고 싶으면 api/projects/P1/scenes?skip=30&take=10 이라고 해주시면 31번째부터 41번아이템을 가져오니 4페이지를 구성하실 수 있습니다.씬 아이템 개별 정보는 아래와 같습니다.

{{IMG:9}}

그리고 위 URL을 자세히 보시면 **sceaneModificationUrl**이 보입니다. 이 URL을 호출하시면 만들었던 Sceane을 수정할 수 있습니다.XRCLOUD의 Sceane 리스트도 위의 API 리턴 정보들로 구성되어있음을 볼 수 있습니다.

{{IMG:10}}

​**2.6. 룸(Room)은 어떻게 생성하고, 입장할까?**설계도가 있다고 바로 건물이 세워지지 않듯이 설계도로 건물을 올려야 합니다. 실제 세워지는 공간은 XRCLOUD/Hubs에서는 룸(Room)이라고 부르며 create room과 get rooms, get room api를 제공합니다. 위에서 API문서를 이용하는 방법을 말씀드렸듯이, room을 생성하고, room의 정보를 읽어오면 아래와 같이 room정보가 노출됩니다. 보시면 roomUrl이 나오죠 ? 이 roomUrl을 자세히 보시면 뒤에 파라미터로 token이 붙어있습니다.

"id": "f24ee5ba-8f1f-4f7a-86ed-738f95ea1f8b",
"name": "example room name",
"size": 10,
"sceneId": "c322b49b-6e12-47d9-b293-b5ab3727459c",
"createdAt": "2023-07-12T09:27:41.600Z",
"updatedAt": "2023-07-12T09:27:41.600Z",
"roomUrl": "https://xrcloud.app:4000/7UizZDL/example-room-name?token=WRlNDAtNWQ0OC00NjZjLWFlYTUtOTNkZDA1Yj...",
"thumbnailUrl": "https://api.xrcloud.app/files/852a6f47-3978-4201-a637-9699d7845266.jpg"

접속 url뒤에 추가 쿼리 파라미터로 입장에 대한 추가 권한이나, 아바타 등을 추가해서 전달하면 됩니다. **해당 부분은 좀 더 정리 되면 따로 API문서에 더 공개 되고 예제들도 올려드리겠습니다.**​**2,7. 내 플랫폼 사용자 정보는 어떻게 관리하고, 사용자가 만든 공간관리는 어떻게 할까?** 그런데 이런 의문이 드실 지 모르겠습니다. 이렇게 되면 내 플랫폼의 사용자는 사용자가 공간을 생성하고, 사용자는 자기가 생성한 공간만 보게 해야 합니다. 그런데 제공하는 API에는 사용자를 식별할 수 있는 수단이 없네?  이 개발방법에 대해 빌리버에서도 많은 고민이 있었습니다. 그러다 최종적으로 내린 결론은 해당 관리는 XRCLOUD의 사용자인 써드파티 개발자의 플랫폼에서 관리하게 한다라는 결론을 내렸습니다.  위의 내용을 보시면 알겠지만**, XRCLOUD는 씬과 룸에 대한 모든 정보를 조회하게 해드렸습니다. 달리 말하면 이 정보들을 이용하여 플랫폼을 구성할때 매번 호출하지 않고, 생성 수정시에만 API를 호출하고, DB에 복사 정보를 넣어 사용자 정보같은 필요 추가 정보와 연계하여 추가 관리 할 수 있음을 의미합니다. 씬과  룸의 정보들을 사용자 플랫폼의 DB에서 관리하고 플랫폼 사용자들에게 개발자가 자유롭게 선택 조회하게 개발해주시면 됩니다**.  써드파티 개발자에게 편리한 기능을 제공할지, 혹은 더 많은 자유도와 높은 보안성을 제공할지에서 저희는 써드파티 개발자에게 더 많은 권한을 드리는 방향을 선택했습니다. ​** 비즈니스 정보와 사용자 정보없이 메타버스 구축에만 도움을 주는 것이 저희 플랫폼, XRCLOUD를 가장 잘 설명할 수 있는 사상**인것 같습니다. 이를 위해 클라우드 인프라도 엔터프라이즈의 경우 정부에서 인증받은 g클라우드를 선택 사용하고 있고, GS인증은 연내에, 이를 기반으로 온프레미스 형태의 서버 구축형 비즈니스도 고려하고 있습니다. 현재 많은 공공기관의 메타버스들이 구축되었으나 이러한 데이터보안 부문에서 인증을 고려한 시스템은 거의 없는 상황입니다.  최근 AI의 기술 발전등으로 인하여 데이터주권의 문제가 매우 중요한 화두로 떠오르고 있습니다. 글로벌 게임 서비스에서 시작한 메타버스들은 이에 대한 고려를 하고 있지 않았고, 외산 메타버스들 역시 이러한 고려는 전혀 되어있지 않습니다.  저희가 사용하는 모질라 Hubs도 외산 아마존 클라우드를 기반한 서비스를 진행하고 있고, 저희가 사용하고 있는 Mozilla재단의 오픈소스의 아마존 서비스도 한국 지역 서버를 지원하고 있지 않습니다.**​**

http://www.itdaily.kr/news/articleView.html?idxno=209676
**[안개 속 CSAP ④] 정부의 클라우드 방향성, 데이터 주권에 초점 맞춰야 - 아이티데일리** [아이티데일리] 공공 클라우드에 대한 관심이 높아지는 상황 속에서 정부‧공공기관에 클라우드 서비스를 공급하기 위해 필요한 ‘클라우드 서비스 보안인증 제도(CSAP)’가 이슈가 되고 있다. CSAP 제도 개편을 ... www.itdaily.kr

http://www.itdaily.kr/news/articleView.html?idxno=209676

이러한 보이지 않는 부분을 고민하고 기술 내재화 하고 있었던 점이 다른 메타버스보다 기술 개발 어려웠고 늦어진 이유기도 합니다. 하지만 메타버스의 중요성이 갈수록 커지고 있고, 전시용이 아닌 실제 사용하는 메타버스라면 안전과 보안은 가장 중요한 화두가 될 수 밖에 없다고 생각합니다. 그리고, 이를 지키며 확장성 있는 플랫폼인 XRCLOUD에 대해 많은 관심을 가져주시고, 저희의 장점을 잘 활용해 주세요. 저희는 공간웹을 제작, 관리하는 프레임워크로서 XRCLOUD는 집중하겠습니다.​감사합니다. 많은 관심 부탁드립니다. 가격 정책은 아래처럼 결정 되었고 퍼스널 버전 유료화는 8월 중 예상하며, 프로 버전은 년내 목표합니다.비즈니스 버전은 언제든 문의 받습니다.

{{IMG:11}}

XRCLOUD서비스 예정 가격

​

<!-- en -->
이번 포스팅은 XRCLOUD를 통해 메타버스 플랫폼을 만드는 방법에 대해 실제 실습을 통해 XRCLOUD의 사상을 설명 드리고자 합니다. 저희 사상을 설명 드리기 위해서는 웹API에 대한 이해가 필요합니다. 간단하게는 웹서비스간의 약속된 규약을 통해 유기적으로 서비스를 만드는 공개 기술 정도로 이해해주시면 좋을 것 같습니다. 그래도 이해가 안 가시면, 웹사이트 URL로 정보를 주고 받는다. 정도만 이해해주세요.

**1. 왜 API로 메타버스 플랫폼을 만들어야 하는가**

웹사이트 URL보면 꽤 복잡한데, 왜 복잡하게 API로 메타버스플랫폼을 만들게 하는가하는 의문점이 드실 겁니다. 이에 대해서는 저희가 주장하는 아래와 같은 이유가 있습니다.
**1.1. 비즈니스 로직 독립적인 메타버스 기술**
메타버스를 도입하고자 하는 많은 기업들은 메타버스 플랫폼이 정한 방법의 비즈니스를 원하지 않을 수 있습니다. 대부분의 메타버스 플랫폼들은 각 산업 영역에 특화 기능을 제공하며 동시에 비즈니스 방식 자체도 입점 기업에게 강요하는 구조 입니니다. 교육을 특징으로 한 메타버스는 LMS를 품고 있고, 그림이나 3D객체를 거래할때 NFT의 수수료와 NFT의 거래방식도 메타버스에 락인이 되어있죠. 따라서 이러한 메타버스에서 사업하는 방식은 매우 고정적입니다. 특히 해당 산업 분야에서 각자의 방식으로 사업을 하던 회사들 입장에서는 기존 사업방식과 시스템을 활용할 수 없습니다.
하지만 저희 XRCLOUD는 다릅니다. 메타버스 공간을 만들 수 있는 웹 에디터를 제공하고, 메타버스 에디터의 프로젝트들을 관리하고, 배포된 공간을 관리하는 API를 제공하기 때문입니다. API를 통해 개발자가 새로운 사이트를 만들어 공간 에디터 기능을 포함한 생성, 수정, 삭제, 업데이트를 하게 하여 완전히 별도의 메타버스 서비스를 만들 수 있게하여 각자의 방식대로 비즈니스를 펼칠 수 있습니다.
이러한 요구사항 때문에 각 기관들은 메타버스 기업에 커스터마이징된 독립 SW를 요구하기도 합니다. 이때 독립메타버스 구축은 커스터마이징으로 소스를 수정 배포 하는 방식으로 진행 되기 때문에, 원본소스의 업데이트를 지속적으로 제공받기 어렵고, 그 제작 비용과 관리비용이 매우 크게 들어갑니다. 하지만 XRCLOUD는 처음부터 독립메타버스를 만드는 것을 목적으로 한 서비스이므로 그 비용이 웹서비스 제작 비용 수준으로 매우 낮습니다. 이게 당연한 이유는 XRCLOUD의 메타버스는 본래 웹서비스이며 공간웹 서비스를 SaaS의 API로 개발 제공하는 사상을 가지고 있기 때문입니다.
**1.2. 개인 정보와 고객 정보를 저장하지 않는 메타버스 기술**
또한 저희는 아바타를 제공하지 않기에 개인정보와 고객정보를 저희 서버에 저장하지 않습니다. 메타버스 서비스에 아바타가 없다니 이게 무슨 얘기인가 ? 어리둥절 하시겠지만, 저희는 처음 부터 그러한 개념으로 접근했는데 이 배경에는 아바타를 표준 기술을 이용하기 때문이며, 아바타를 개선하기 위해서는 저희가 직접 그 표준 제정에 참여를 하는 방식을 취하고 있기 때문입니다. 제일 유사한 것은 이세계 아이돌이 활동하는 플랫폼으로 유명한 VR Chat을 상상하시면 됩니다. VRChat의 아바타는 아바타가 VRChat이 아닌 다른 스토어에서 제작 거래 되고, VRoid를 통해 VR스트리밍 방송에도 활용 됩니다. 이는 VR Chat의 아바타의 VRCA라는 파일이 공개표준인 VRM파일과 변환 방법을 제공하기 때문입니다. 이는 달리 말하면 아바타 파일이 표준 포맷을 이용한다면 굳이 아바타의 정보를 메타버스 플랫폼이 꼭 가지고 있을 필요가 없으며 입장시에 아바타 파일을 가지고 입장하면 된다는 의미입니다. 저희 메타버스의 기반 엔진인 모질라 허브 아바타는 [오픈소스](https://mozilla.github.io/hackweek-avatar-maker/)를 통해 받아 보거나 오픈소스를 이용하여 개발자들이 자신만의 에디터를 만들 수 있습니다. 레디플레이미도 허브 아바타를 지원하는데 이는 국제 표준인 glTF표준 아바타를 쓰기 때문입니다.

저희가 작업 예정인 XRCLOUD의 전신 아바타도 오픈소스로 에디터를 공개하여 XRCLOUD와의 의존성을 완전히 제거하는 방향으로 개발 중입니다. 아바타 뿐만 아니라 사용자의 이름과 모든 정보도 이러한 방식으로 처리되며 공간에 입장시에 API를 통해 고객사의 플랫폼에서 저희 클라우드에 있는 공간으로 입장시에 사용자의 아바타와 같은 표현 정보를 들고 들어오는 방식으로 이용됩니다. 달리말하면 저희는 완벽히 클라이언트 플레이어 역할만 하는 구조입니다. 이러한 기술 구조의 장점은 메타버스 플랫폼이 소중한 고객정보를 저장하는 것을 근본적으로 방지시켜 줍니다. 로블록스, 제페토, ZEP모든 메타버스는 회원가입을 요구합니다. 하지만 저희는 그러한 요구가 필요 없고, 고객사의 고객이 고객정보를 들고 입장시키면 되기 때문에 저희는 고객 정보를 저장하지 않습니다.
**1.3. 공간에만 집중하는 메타버스 기술**
달리 말하면 다른 메타버스와 달리 저희는 그동안 웹 공간을 만들고 공간의 입출입과 권한을 안전하게 관리할 수 있는데 집중했습니다. 이해를 돕기 위해 교육메타버스를 가정해보겠습니다. 교육메타버스 개발에 LMS개발을 함께 요구하고, 메타버스내에 LMS기능이 있다고 특징을 내세웁니다. 그런데 학교라는 건물을 지으면서 건물(메타버스 플랫폼)의 기능에 학사시스템을 함께 만들어 달라하면 이상하지 않을까요 ? 그리고 학생이 교실에 들어갈 때, 학생의 모든 인적 정보가 교실(메타버스플랫폼)에 있어야 한다는 것도 이상하죠 ? 학생(3rd Party사용자 정보)은 학교 조직(3rdParty 플랫폼)에서 통해 반 배정을 받고 해당 방에 입장만 하면 됩니다. 물론, 조교는 문을 딸(인증) 수는 있어야 하겠죠. 저희는 2D웹 공간을 3D웹 공간으로만 혁신을 하는 것에만 집중하고 공간에만 집중하고 있으며 이에 대한 SW로직을 추상화 범용화를 해서, 각 비즈니스의 영역은 각 비즈니스가 잘 할 수 있도록 돕습니다. 때문에 예쁜 아바타와 예쁜 공간이 아닌 간편한 연동, 연계, 확장을 가장 큰 가치로 내세웁니다. 예쁜 아바타와 예쁜 공간은 각 개발사가 해주시면 되며 그 품질과 성능 역시 WebGPU와 같은 웹기술에 기반해 지속 발전합니다. 저희 XRCLOUD의 디자인 아이덴티티는 없는게 장점이며 덕분에 다양한 실험이 가능합니다.

{{IMG:1}}
Toward Facilitating Team Formation and Communication Through Avatar Based Interaction in Desktop-Based Immersive Virtual Environmets 논문 연구에 사용된 모질라허브의 다양한 아바타

**2. XRCLOUD API 구조 설명**

위에서 가치만 말씀 드렸는데, 이번엔 실제 API를 살펴보며 어떤 구조인지 설명 드리겠습니다. 문서와 서비스는 아래의 링크를 참고 바랍니다.
**API문서 URL : **[**https://api.xrcloud.app/docs/ko**](https://api.xrcloud.app/docs/ko)**서비스 URL : **[**https://xrcloud.app/ko**](https://xrcloud.app/ko)
**2.1. API를 호출 하는 필수 열쇄, 인증 Key**
API를 통해 개발을 한다는 의미는 개발자의 역할은 만들고자 하는 플랫폼의 관리자라고 생각하면 됩니다. 관리자면 당연히 열쇄가 있어서 무엇이든 할 수 있어야겠죠 ? XRCLOUD에 회원 가입을 하셨다면, Mypage에서 Key를 얻을 수 있습니다. 만약 해커에게 Key가 유출되면 플랫폼의 데이터를 마음대로 손댈수 있으니 매우 위험 합니다. 따라서 사용에 주의를 부탁드립니다. 혹시 유출됬다면 Generate api key를 눌러 다시 생성해주세요.

{{IMG:2}}
XRCLOUD에서 API를 호출할 수 있는 API Key

그리고 이 Key는 API호출시에 사용됩니다. 사용 예제는 API테스트에 널리 사용되는 Postman으로 Project의 API를 호출하는 예제를 설명 드리면서 실제 사용 방법을 보여드리며 설명 드리겠습니다.
**2.2. 프로젝트(Project), 씬(Sceane), 룸(Room)의 관계 및 API구조**
프로젝트는 개발자 혹은 기업이 만드는 서비스 단위정도로 이해하세요. 예를들어 개발자 아무개가 구글과 페이스북을 만들었다고 하면 구글과 페이스북이 프로젝트가 됩니다. 그리고 이 프로젝트 아래에는 공간 설계도에 해당되는 씬(Sceane)이 있고, 공간설계도로 만든 실제 건물에 해당되는 룸(Room)이 있습니다. 계층 구조를 가지게 되는데, API도 동일한 계층 구조를 갖게 됩니다. {}로 표기된 곳이 상위 객체 api나 XRCLOUD사이트에서 얻어낼 수 있는 id입니다.

```
/api/projects/{project_id}/scenes/{scene_id}/rooms/{room_id}
```

예를들어 project_id가 P1, sceane_id가 S1, room_id가 R1이라고 가정하면 룸 R1의 정보를 호출하는 api는 /api/projects/**P1**/scenes/**S1**/rooms**/R1** 이 됩니다. 학교 반, 번호로 치면, 3학년 1반 12번 누구 이런 의미라고 보시면 됩니다.
**2.3. get Projects, Postman으로 프로젝트 정보를 불러와 보겠습니다.**
먼저 프로젝트의 정보를 가져오는 get Projects의 API문서를 보겠습니다.

{{IMG:3}}
get project API설명서

**2.3.1. API URL and Call Information**
Looking at the description, you can copy how to actually call the API from the left. Pay close attention to whether it's Get or Post. Values enclosed in {} must be entered into the URL. The 'get project' API requires a project ID as it needs to know which project to retrieve. You can find the Project ID on the XRCLOUD project page, so copy and paste it.

{{IMG:4}}
                                
                            Project ID Location

**2.3.2. API Authentication and Parameter Description**
At the top of each API description, you'll find the authentication information and required input values for API calls. This means it requires the key previously mentioned in My Page.

**2.3.3.) API Result Value Description**
At the bottom of each API description, the values returned upon calling the API are explained. Do you see 'sceneCreateUrl'? Calling this URL means you can launch the Scene editor, which corresponds to the blueprint of a space. Administrators can create as many Scenes as they want under a project through this.

**2.4) You can test API calls with Postman as follows.**

{{IMG:5}}

**2.4.1. API Input and Settings**
As explained in [2.3.1], I entered the API URL including the project ID and set it to GET.

**2.4.2. API Authentication Information Input**
As explained in [2.3.2], in the Authorization tab, the Type was set to Bearer token, and the Key from XRCloud's My Page was entered. Then, clicking Send executes the call.

**2.4.3. Confirming Values After API Call**
As in [2.3.3], you can check the actual return values. If you put the SceneCreationURL into your browser's URL, a web editor for creating space blueprints will appear. Of course, you can also load and overwrite existing space blueprint (spoke) files.

{{IMG:6}}

**2.4. What can this getProject API do?**
Using the GetProject API above, you can attach an editor to your user platform. In fact, the information needed to implement Create Scene is delivered through getProject. For example, you can assign the URL returned above to a [Create Space] button. Below is XRCLOUD's Scene management tool, which you can consider implemented through similar internal APIs. The '+' button here is for adding a scene. You can implement the same functionality on your platform using the API above.

{{IMG:7}}

**2.5. How to View and Modify a Created Scene?**
Then you might wonder, 'How do I view and modify a Scene after creating it?' The API for this is 'get Scenes'.

{{IMG:8}}

Authentication is the same as above; just add 'scenes' after the project_id. This will display a list of information for all created scenes. For pagination, 'skip' and 'take' information are received as query parameters. For example, if you want to display the 4th page of a project with project_id P1 and retrieve 10 items, you would use `api/projects/P1/scenes?skip=30&take=10`, which will fetch items from the 31st to the 41st, allowing you to compose the 4th page. Individual scene item information is as follows.

{{IMG:9}}

And if you look closely at the URL above, you'll see **sceneModificationUrl**. Calling this URL allows you to modify the Scene you created. You can see that XRCLOUD's Scene list is also composed of the API return information above.

{{IMG:10}}

**2.6. How to Create and Enter a Room?**
Just as a blueprint doesn't immediately erect a building, you need to construct the building from the blueprint. The actual spaces built are called Rooms in XRCLOUD/Hubs, and we provide `create room`, `get rooms`, and `get room` APIs. As I explained how to use the API documentation above, when you create a room and retrieve its information, the room details will be exposed as shown below. You'll see `roomUrl`, right? If you look closely at this `roomUrl`, you'll notice a token attached as a parameter at the end.

```json
{
  "id": "f24ee5ba-8f1f-4f7a-86ed-738f95ea1f8b",
  "name": "example room name",
  "size": 10,
  "sceneId": "c322b49b-6e12-47d9-b293-b5ab3727459c",
  "createdAt": "2023-07-12T09:27:41.600Z",
  "updatedAt": "2023-07-12T09:27:41.600Z",
  "roomUrl": "https://xrcloud.app:4000/7UizZDL/example-room-name?token=WRlNDAtNWQ0OC00NjZjLWFlYTUtOTNkZDA1Yj...",
  "thumbnailUrl": "https://api.xrcloud.app/files/852a6f47-3978-4201-a637-9699d7845266.jpg"
}
```

You can add additional permissions for entry, avatars, etc., as extra query parameters after the access URL. **This part will be further organized and published separately in the API documentation, along with examples.**

**2.7. How to Manage My Platform's User Information and User-Created Spaces?**
However, you might have this question. If this is the case, users on my platform should be able to create spaces and only see the spaces they have created. But the provided API doesn't have a way to identify users? Believer also had many discussions about this development approach. The final conclusion we reached was that this management should be handled on the platform of the third-party developer, who is a user of XRCLOUD. As you can see from the content above, **XRCLOUD allows you to query all information about scenes and rooms.** In other words, this means that when building your platform using this information, you don't need to call the API every time; you only call it during creation and modification, and you can store a copy of the information in your DB to manage it further in conjunction with necessary additional information like user data. You should manage scene and room information in your user platform's DB and develop it so that platform users can freely select and view it as chosen by the developer. Between providing convenient features to third-party developers or offering more freedom and higher security, we chose to give more authority to third-party developers. **Helping build metaverses without business or user information seems to be the philosophy that best describes our platform, XRCLOUD.** To this end, for enterprise cloud infrastructure, we are using g-cloud certified by the government, and we aim for GS certification within the year, based on which we are also considering on-premise server-based business models. Currently, many public institutions have built metaverses, but there are almost no systems that consider certification in terms of data security. Recently, with the advancement of AI technology, the issue of data sovereignty has emerged as a very important topic. Metaverses that originated from global game services have not considered this, and foreign metaverses also have not considered this at all. Mozilla Hubs, which we use, also runs services based on foreign Amazon cloud, and the Amazon service for the Mozilla Foundation's open source that we use does not support Korean regional servers.

http://www.itdaily.kr/news/articleView.html?idxno=209676
                                **[CSAP in the Fog ④] Government's Cloud Direction Must Focus on Data Sovereignty - IT Daily** [IT Daily] Amid growing interest in public cloud, the 'Cloud Service Security Certification System (CSAP)', which is necessary to supply cloud services to government and public institutions, is becoming an issue. The reorganization of the CSAP system... www.itdaily.kr

http://www.itdaily.kr/news/articleView.html?idxno=209676

The fact that we pondered these unseen aspects and internalized the technology is also why our technology development was more difficult and slower than other metaverses. However, as the importance of the metaverse grows, if it's a metaverse for actual use rather than just display, safety and security inevitably become the most crucial topics. Therefore, please show great interest in XRCLOUD, a scalable platform that upholds these values, and make good use of our strengths. We will focus XRCLOUD as a framework for creating and managing spatial web. Thank you. We appreciate your interest. The pricing policy has been decided as below, with the personal version expected to be monetized in August, and the Pro version targeted within the year. Inquiries for the business version are welcome at any time.

{{IMG:11}}
                                
                            XRCLOUD Service Planned Pricing