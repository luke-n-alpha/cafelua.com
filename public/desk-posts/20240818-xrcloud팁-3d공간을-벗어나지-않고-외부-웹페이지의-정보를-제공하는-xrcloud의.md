---
date: "2024-08-18"
titleKo: "[XRCLOUD팁] 3D공간을 벗어나지 않고 외부 웹페이지의 정보를 제공하는 XRCLOUD의 인라인뷰 컴포넌트"
titleEn: "[XRCLOUD Tip] XRCLOUD's Inline View Component: Providing External Webpage Information Without Leaving 3D Space"
category: xrcloud
tags:
  - 사용팁
images: []
sourceCategoryNo: "188"
sourceCategory: 사용팁
externalUrl: https://blog.naver.com/fstory97/223551390484
---

<!-- ko -->
* 본 문서는 업데이트된 XRCLOUD가이드 문서 중 하나 입니다.

https://belivvr.notion.site/Room-XRCLOUD-4b861e5ca4394c499b43e7b75645c7ce
**Room을 벗어나지 않고 외부 웹페이지의 정보를 제공하는 XRCLOUD의 인라인 프레임 컴포넌트 | Notion** Hubs는 링크, 이미지 컴포넌트에 링크를 걸어 외부 웹페이지로 보낼 수 있는데 플랫폼 서비스의 사용자 경험을 해칠 수 있습니다. belivvr.notion.site

https://belivvr.notion.site/Room-XRCLOUD-4b861e5ca4394c499b43e7b75645c7ce

- Hubs는 링크, 이미지 컴포넌트에 링크를 걸어 외부 웹페이지로 보낼 수 있는데 플랫폼 서비스의 사용자 경험을 해칠 수 있습니다.
- XRCLOUD의 Spoke는 Room을 벗어나지 않고 웹페이지를 볼 수 있는 추가 기능을 제공하는 인라인뷰 컴포넌트를 제공합니다.

존재하지 않는 이미지입니다.

XRCLOUD에서 제공하는 InlineView 컴포넌트

- 페이지를 보여주는 방식은 총 4가지를 지원합니다.

존재하지 않는 이미지입니다.

인라인뷰의 4가지 옵션

- Main : 3D공간의 위치에 iframe으로 페이지를 로딩합니다.

존재하지 않는 이미지입니다.

Unity WebGL 콘텐츠를 Room에서 보여주는 사례

- 외부 웹페이지에서는 iframe을 허용하기 위해 XRCLOUD의 Room URL인 room.xrcloud.app을 CORS허용 해주어야 정상적으로 로딩 됩니다.

존재하지 않는 이미지입니다.

CORS오류 페이지

- Side View : 채팅 영역에 iframe으로 페이지를 로딩합니다.
- **세로로 긴 윈도우로 주로 모바일 페이지 형식에 유용합니다. 3D공간이 그대로 유지되는 장점이 있습니다.**

존재하지 않는 이미지입니다.

SIdeView에 표시된 시간표 페이지

- Self Window : 페이지 전체가 리다이렉트 됩니다. Room을 벗어나게 됩니다.
- New Window : Room은 유지한채로 새 탭에 열립니다. 브라우져의 팝업이 허용되어있어야 합니다.

<!-- en -->
* This document is one of the updated XRCLOUD guide documents.

https://belivvr.notion.site/Room-XRCLOUD-4b861e5ca4394c499b43e7b75645c7ce
                                **XRCLOUD's Inline Frame Component that Provides External Webpage Information Without Leaving the Room | Notion** Hubs can link to external webpages via link and image components, which can harm the user experience of platform services. belivvr.notion.site

https://belivvr.notion.site/Room-XRCLOUD-4b861e5ca4394c499b43e7b75645c7ce

- Hubs can link to external webpages via link and image components, which can harm the user experience of platform services.
- XRCLOUD's Spoke provides an InlineView component that offers an additional feature to view webpages without leaving the Room.

Image not found.
                
            
                                                XRCLOUD's InlineView Component

- A total of 4 methods are supported for displaying pages.

Image not found.
                
            
                                                4 Options for InlineView

- Main: Loads the page as an iframe at a specific position in the 3D space.

Image not found.
                
            
                                                Example of displaying Unity WebGL content in a Room

- For external webpages, room.xrcloud.app, which is XRCLOUD's Room URL, must be CORS-allowed for iframes to load correctly.

Image not found.
                
            
                                                CORS Error Page

- Side View: Loads the page as an iframe in the chat area.
- **This is a vertically long window, mainly useful for mobile page formats. The advantage is that the 3D space remains intact.**

Image not found.
                
            
                                                Timetable page displayed in SideView

- Self Window: The entire page is redirected. You will leave the Room.
- New Window: The Room is maintained, and the page opens in a new tab. Browser pop-ups must be allowed.