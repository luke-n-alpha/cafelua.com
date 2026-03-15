---
date: "2011-12-09"
titleKo: "[WebView] 사파리 보다 많이 쓰이는 모바일 브라우져 IT에 대한 잡설 / IT이야기"
titleEn: "[WebView] The Mobile Browser Used More Than"
category: it
tags:
  - IT에 대한 잡설
images:
  - /desk/20111209-webview-사파리-보다-많이-쓰이는-모바일-브라우져-it에-대한-잡설-it이야기/01.webp
  - /desk/20111209-webview-사파리-보다-많이-쓰이는-모바일-브라우져-it에-대한-잡설-it이야기/02.webp
  - /desk/20111209-webview-사파리-보다-많이-쓰이는-모바일-브라우져-it에-대한-잡설-it이야기/03.webp
  - /desk/20111209-webview-사파리-보다-많이-쓰이는-모바일-브라우져-it에-대한-잡설-it이야기/04.webp
thumbnail: /desk/20111209-webview-사파리-보다-많이-쓰이는-모바일-브라우져-it에-대한-잡설-it이야기/01.webp
sourceCategoryNo: "41"
sourceCategory: IT에 대한 잡설
externalUrl: https://blog.naver.com/fstory97/70126091732
---

<!-- ko -->
현재 한국 스마트폰은 안드로이드와 아이폰의 양대 산맥으로 자리를 잡고 있습니다. 이 두개의 플랫폼에 모두 서비스하기 위해 많은 서비스들이 HTML5기반의 모바일 웹 서비스가 만들어지고 있습니다. 이러한 서비스들은 대게 아이폰의 기본 브라우져인 Safari와 안드로이드의 기본 브라우져인 크롬에 맞추어 개발됩니다. 그러나 국내 서비스 이용자들이 Safari만큼 많이 쓰고 있는 또하나의 모바일 브라우져가 있는 것을 아십니까 ? 바로 WebView 브라우져입니다. 개발자가 아니신 분들은 처음 듣는 브라우져인데 ? 하실테고, 개발자인 분들은 그게 무슨 별도의 브라우져냐! 라고 하실지 모르겠습니다. 먼저 WebView에 관해 말씀드리겠습니다.

** 1. 모바일 OS에서 제공하는 웹브라우져 컴포넌트, WebView
** 사실 이건 개발 얘기입니다. WebView는 앱개발시에 사용할 수 있는 브라우져 컴포넌트 이름입니다. 이미 이러한 개념은 윈도우즈에서도 쉽게 찾아볼수 있습니다. 어플리케이션인데 어플리케이션의 일정영역을 구멍을 뚫어 웹서비스를 뿌려주고 있는 형식이죠. 국내에서는 게임 런처에서 많이 볼 수 있는 모습이었습니다. 게임을 실행하면 게임이 바로 실행되지 않고, 가운데 일정영역에 공지사항같은 페이지가 표시되고, 우측 옆에는 Play버튼이 박혀있는 형태죠. 가운데 이 일정영역은 사실 특정 url을 브라우징하고 있는 브라우져입니다. 그러나 IE와 달리 마우스 오른쪽키나 copy&paste 도 되지 않죠. 주로 이러한 웹 컨트롤러의 장점은 웹페이지를 어플리케이션내에 일부를 뿌려줌으로서 어플리케이션을 새로 배포하지 않아도 컨텐츠를 쉽게 업데이트하고, 이미 운용하고 있는 웹페이지의 일정부분을 어플리케이션에서 보여줌으로서 유저들과의 웹서비스의 접점을 늘려줍니다. 때문에 이러한 특수목적으로 만들어진 브라우져 컨트롤러는 브라우져가 제공하는 모든 기능을 제공하지 않는 것이 일반적입니다.
그리고, 이러한 컴포넌트를 iOS와 Android모두 제공하는데 해당 컴포넌트명은 WebView입니다.

** 2. 모바일웹보다 접근성이 좋은 모바일앱에서 널리 쓰이는 WebView
** 개발자들이 아닌 분들을 위해서 위의 내용을 설명했습니다. 이쯤되면 개발자 분들은 어느정도 눈치 챘겠죠. 하지만, 아직도 일반 유저 분들은 그게 그렇게 많이 쓰여? 라고 물으실지 모르겠습니다. 모바일에서는 유저분들이 사실 알게 모르게 많이 쓰고 있는것이 바로 이 WebView입니다. 이 WebView를 사용하고 있는 앱들 중 가장 대표적인 앱은 바로 네이버앱과 다음앱의 포탈앱입니다.

{{IMG:1}}
**﻿ [네이버앱에서 사용하고 있는 웹뷰 ] **

이 외에도 g마켓, 11번가, yes24같이 웹서비스를 메인으로하고 있는 서비스들의 앱이 이러한 WebView를 사용합니다. 그리고, PC에 비해 압도적으로  WebView의 사용율이 모바일에서는 높습니다. 이렇게 된 가장 큰 이유는 모바일웹보다는 모바일앱의 접근성이 좋은 이유도 있습니다. 크롬이나 Safari에서 주소창을 열어 m.naver.com을 치고 브라우져의 첫화면에 등록하는 일은 유저에게 매우 큰 부담입니다. 그리고, 포탈 검색창에서 yes24를 치고, yes24로 접근하는 것은 더 큰 부담인거죠.  결국은 그냥 앱을 하나 설치하게 하는 편이 유저들에게는 더 익숙하고, 편한 길입니다. (앱 설치하게 하는 것도 물론 쉬운건 아닙니다.) 이러한 점이 모바일웹 환경이 PC웹환경과 가장 큰 차이를 보이고 있습니다. write보다는 reading에 더 많은 시간을 할애하고, write는 SNS나 댓글처럼 꼭 필요한 짤막한 글 외에는 액션을 안 하려고 합니다. 특히 영문으로 바꿔서 주소창에 주소 입력은 이게 업인 저도 하기 싫더군요. 그래서 QR코드같은 보조적인 수단들이 많이 사용되고 있는 것 입니다. 안드로이드 단말의 경우 라이트 유저가 더 많아 이러한 현상이 더 심할 수 밖에 없습니다. 그러나 단말 수는 아이폰에 훨씬 많으므로, 아이폰의 Safari이용율보다 아이폰, 안드로이드의 WebView 이용자 수가 더 많다고 까지 할 수 있습니다.

** 3. WebView는 다른 브라우져다.  모바일웹서비스 개발시 꼭 체크하고 가자.**
그러나 문제는 그냥 많이 쓰인다는것에 있지 않습니다. WebView는 OS에서 제공하는 브라우져가 아니라는 점입니다. OS에서 제공하는 브라우져 컴포넌트는 네이버앱이나 다음브라우져처럼 브라우져를 거의 완벽히 흉내낼수 있도록 많은 메소드(인터페이스)를 제공하기는 하지만, OS에서 제공하는 브라우져와 동일하게 동작한다는 보장은 없습니다. 실제로 제가 아는 경우만 해도 WebView의 한계가 있는 점이 존재합니다. 자바스크립트가 동일하게 동작하지 않는다던가, SSL 시스템 Alert창이 문제가가 있다던가. 이러한 소소한 차이는 유저들로 하여금 서비스 장애로 인지하게 되는 원인 중에 하나입니다. 모바일 웹 서비스 개발, 운영자, QA라면, 이 점을 분명히 알아야 하고, 꼭 테스트가 필요합니다.

http://opencast.naver.com/FS565
[재생하기 바로보기가 지원되지 않는 파일입니다. 클릭하여 팝업창으로 플레이 해보세요.](http://blog.naver.com/EmbedHttpView.naver?blogId=fstory97&logNo=70126091732&hashKey=fda9e9fa1e11c9a8e8ffef4d0974120f)

******************************http://www.hanrss.com/add_sub.qst?url=http%3A%2F%2Fblog.rss.naver.com%2Ffstory97.xml**** {{IMG:2}}

http://search.allblog.net/?keyword=%EC%88%B2%EC%86%8D%EC%96%98%EA%B8%B0&view=issue&type=100

{{IMG:3}}

http://www.blogkorea.net/bnmsvc/user_bloglist.do?userNum=548520&amp;rssSeq=575708&amp;gubun=A&amp;pages=1

{{IMG:4}}

http://mixsh.com/media/53844

**********

<!-- en -->
Currently, Korean smartphones are dominated by the two major platforms: Android and iPhone. To provide services on both of these platforms, many HTML5-based mobile web services are being developed. These services are typically developed to be compatible with Safari, the default browser on iPhones, and Chrome, the default browser on Android. However, are you aware that there's another mobile browser widely used by domestic service users, almost as much as Safari? It's the WebView browser. Non-developers might be thinking, "A browser I've never heard of?", while developers might say, "What do you mean, a separate browser!" First, let me explain WebView.
 
** 1. WebView: A Web Browser Component Provided by Mobile OS
** This is actually a development topic. WebView is the name of a browser component that can be used during app development. This concept can already be easily found in Windows as well. It's a format where an application 'punches a hole' in a certain area to display web services. In Korea, this was often seen in game launchers. When you launched a game, the game wouldn't start immediately; instead, a page like an announcement would appear in a central area, with a 'Play' button on the right. This central area is actually a browser displaying a specific URL. However, unlike IE, right-click or copy & paste functions are not available. The main advantage of such web controllers is that by displaying a part of a webpage within an application, content can be easily updated without redeploying the application, and by showing a portion of an already operating webpage within the application, it increases user engagement with web services. Therefore, it is common for browser controllers created for such special purposes not to provide all the functions offered by a full browser.
 And both iOS and Android provide this component, and its name is WebView.
 
** 2. WebView: Widely Used in Mobile Apps for Better Accessibility than Mobile Web
** I explained the above for non-developers. By now, developers have probably caught on. However, general users might still ask, "Is it really used that much?" On mobile, users are actually using WebView a lot, whether they realize it or not. The most representative apps using WebView are the portal apps like Naver App and Daum App.
 
{{IMG:1}}  
** [WebView used in Naver App] **

In addition, apps for services that primarily offer web services, such as Gmarket, 11st, and Yes24, also use WebView. Furthermore, WebView usage is overwhelmingly higher on mobile compared to PC. A major reason for this is the better accessibility of mobile apps compared to mobile web. Opening the address bar in Chrome or Safari, typing m.naver.com, and then adding it to the browser's home screen is a significant burden for users. And typing 'yes24' in a portal search bar and then accessing Yes24 is an even greater burden. Ultimately, simply installing an app is a more familiar and convenient path for users. (Of course, getting users to install an app isn't easy either.) This is the biggest difference between the mobile web environment and the PC web environment. Users spend more time reading than writing, and they tend to avoid writing actions except for essential short posts like SNS updates or comments. Especially, typing an address in the address bar by switching to English is something even I, whose job it is, dislike doing. That's why auxiliary tools like QR codes are widely used. In the case of Android devices, there are more light users, so this phenomenon is even more pronounced. However, since the number of Android devices is much higher than iPhones, it can even be said that the number of WebView users on both iPhone and Android combined is greater than Safari usage on iPhone alone.
 
** 3. WebView is a different browser. Be sure to check it when developing mobile web services.
** However, the problem isn't just that it's widely used. The point is that WebView is not a browser provided by the OS. While the browser components provided by the OS offer many methods (interfaces) to almost perfectly emulate a browser, like the Naver App or Daum Browser, there's no guarantee that they will function identically to the browser provided by the OS. In fact, even in cases I know, there are limitations with WebView. For example, JavaScript might not function identically, or there might be issues with SSL system alert windows. These minor differences are one of the reasons users perceive service failures. If you are a mobile web service developer, operator, or QA, you must clearly understand this point and ensure thorough testing.
 
http://opencast.naver.com/FS565
[This file does not support direct playback. Click to play in a pop-up window.](http://blog.naver.com/EmbedHttpView.naver?blogId=fstory97&logNo=70126091732&hashKey=fda9e9fa1e11c9a8e8ffef4d0974120f) 

******************************http://www.hanrss.com/add_sub.qst?url=http%3A%2F%2Fblog.rss.naver.com%2Ffstory97.xml**** {{IMG:2}}

http://search.allblog.net/?keyword=%EC%88%B2%EC%86%8D%EC%96%98%EA%B8%B0&view=issue&type=100

 {{IMG:3}}

http://www.blogkorea.net/bnmsvc/user_bloglist.do?userNum=548520&amp;rssSeq=575708&amp;gubun=A&amp;pages=1

 {{IMG:4}}

**********