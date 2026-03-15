---
date: "2009-11-18"
titleKo: ActiveX를 대체할 Html5의 운명을 쥔 구글 IT에 대한 잡설 / IT이야기
titleEn: Google Holds the Fate of HTML5,
category: it
tags:
  - IT에 대한 잡설
images:
  - /desk/20091118-activex를-대체할-html5의-운명을-쥔-구글-it에-대한-잡설-it이야기/01.webp
  - /desk/20091118-activex를-대체할-html5의-운명을-쥔-구글-it에-대한-잡설-it이야기/02.webp
  - /desk/20091118-activex를-대체할-html5의-운명을-쥔-구글-it에-대한-잡설-it이야기/03.webp
  - /desk/20091118-activex를-대체할-html5의-운명을-쥔-구글-it에-대한-잡설-it이야기/04.webp
  - /desk/20091118-activex를-대체할-html5의-운명을-쥔-구글-it에-대한-잡설-it이야기/05.webp
thumbnail: /desk/20091118-activex를-대체할-html5의-운명을-쥔-구글-it에-대한-잡설-it이야기/01.webp
sourceCategoryNo: "41"
sourceCategory: IT에 대한 잡설
externalUrl: https://blog.naver.com/fstory97/70074526497
---

<!-- ko -->
**1. 무엇이 Active X를 대체할까 ?**
**{{IMG:1}}**
[Active X를 대채할 기술로 Html5의 언급이 있는 기사](http://www.zdnet.co.kr/ArticleView.asp?artice_id=20091116182745) 를 보았습니다. 많이들 Active X가 국내 인터넷 환경의 원죄인 양 이야기하지만, 은행에서 액티브 엑스를 써야하는 이유는 뭘까요 ? 그리고 정말 Html5가 Flash, JavaFx, 실버라이트를 제치고 당당히 웹의 메인스트림으로 자리잡을 수 있을까요 ? 제 본직이 웹개발자다보니 흥미로운 주제가 아닐 수 없습니다.
그래서 그 기사를 맨 처음 본 순간, 현재 결제나 은행에서 정말로 Active X를 써야 하는 이유는 뭘까 ? 혹은 Html5가 어떤면에서 Active X를 대체할 수 있는가를 찾아보았습니다. 보니 DBGuide에 좋은 자료가 있더군요. (가입만 하시면 무료로 볼 수 있습니다.)

| [1부 | 백조에서 미운오리로 전락한 액티브X 문제와 해결방안 | 정희용](http://www.dbguide.net/know/know102001.jsp?mode=view&pg=1&idx=3187) |
| --- |
| [**2부 | 발등의 불끄기 공인인증서 대체기술 | 최상훈**](http://www.dbguide.net/know/know102001.jsp?mode=view&pg=1&idx=3188) |
| [3부 | UI 대체는 내게 맡겨라 Ajax를 이용한 UI 개발 | 박영록](http://www.dbguide.net/comb/common/edit/1%BA%CE%20%7C%20%B9%E9%C1%B6%BF%A1%BC%AD%20%B9%CC%BF%EE%BF%C0%B8%AE%B7%CE%20%C0%FC%B6%F4%C7%D1%20%BE%D7%C6%BC%BA%EAX%20%B9%AE%C1%A6%BF%CD%20%C7%D8%B0%E1%B9%E6%BE%C8%20%7C%20%C1%A4%C8%F1%BF%EB) |
| [4부 | 액티브X 뛰어넘는 기능과 호환성 XPCOM 개발전략 | 김민수](http://www.dbguide.net/know/know102001.jsp?mode=view&pg=1&idx=3190) |
| [5부 | MS가 내놓은 액티브X의 대안 실버라이트 활용법 | 한용희](http://www.dbguide.net/know/know102001.jsp?mode=view&pg=1&idx=3191) |

그러나 이는 좀 더 하단에서 원론적으로 생각해보면, HTML5를 제외하고 모든 플러그인들은 결국 브라우져가 fork한 쓰레드 개념입니다. 따라서 해당 플러그인이나 html5의 스펙을 지원하느냐의 문제일 수 있겠습니다. 플러그인의 개념이 결국 브라우져의 기능 확장이란 이야기죠.
반대로 ActiveX는 기본적으로 브라우져의 확장 기능이라기보다는 Window Application이고, Internet Explore에서 Call하는 형태일뿐입니다. 윈도우즈 어플리케이션을 Linux에서 구동할 수 없듯이, ActiveX를 윈도우즈외의 OS에 옮겨놓지를 못하는것입니다. 굳이 하겠다면 브라우져보다도 더큰 OS VM Ware를 브라우져에 깔겁니다. 파이어폭스에 플러그인으로 윈도우즈를 끼워 넣야 하는겁니다. 그게 가능했다면 애시당초 Active X가 실버라이트처럼 플러그인할 수 있었다면, ActiveX의 논의는 있지도 않았을것입니다.

**3. 바톤은 브라우져에게로... 그리고 종착지는 구글**
결국은 향후 표준을 누가 가져갈지는** 브라우져가 해당 플러그인들을 얼마나 잘 지원해주느냐**와 **실제로 그 기술을 사용한 사이트가 얼마나 많은가? **로 결정될 것입니다. 그렇게 생각하면 이 두가지를 모두 확보하고 있는 업체가 구글입니다.
**1) 크롬브라우져 + 구글웹서비스**
**{{IMG:2}}**
국내에서 네이버의 점유율과 마찬가지로 구글의 세계점유율은 매우 높습니다. 또한 구글이 사용하는 기술은 곧 표준이 되는 경향이 강합니다. 지도서비스의 ajax와 유투브의 플래시 동영상 플러그인은 국내의 포탈의 지도서비스의 표준이 되었고, UCC사이트의 표준이 되었습니다.  따라서 구글이 결국 이 게임이 누가 이길지를 결정하는 가장 큰 결정권자라고 생각할 수 있습니다.

** 2) 하나 받고  하나 더 ! 크롬 브라우져 + 구글웹서비스 + 모바일플랫폼 안드로이드**
**{{IMG:3}}**
특히 이러한 웹표준 이슈의 중심에는 맥(MAC)이 아니라 모바일 플랫폼이 존재합니다. 무선 인터넷을 궤도에 올린 아이폰 역시 애플이 만든 모바일 플랫폼 인데, 여기에 또 발을 걸칠 것이고, 거의 승리가 확실시 되어가는 분위기가 바로 구글의 안드로이드입니다.
모바일이 차기 웹에서 이슈가 되고 있으며, 전혀 새로운 시장으로 확장됩니다. 이는 결국 모바일 플랫폼의 점유율이 높을 수록 손쉬운 브라우져 점유율을 높일 수 있다는 이야기입니다.
윈도우즈의 ie점유율과 마찬가지로 안드로이드의 크롬 점유율은 자연스러운 현상이 될것입니다. 향후 안드로이드의 스마트폰 점유율은 매우 긍정적이며 현재로서는 적수가 없다고 할 수 있습니다.

** 3) 구글의 경쟁자들**
삼성의 바다의 경우 웹서비스 모델이 없고 브라우져도 없습니다. 애플은 단일모델이기 때문에 거의 매달 신 모델이 나올 안드로이드와 달리 시장의 20%를 넘기기 힘들 것입니다.
전통적인 모바일 플랫폼의 터줏대감이었던 마이크로소프트는 윈도우모바일의 신뢰성회복이 가장 중요 해보입니다. 기존의 6.5까지 신뢰성이 여전히 없으며 윈도우7과 같은 대중에게 신뢰성있고 효율적인 모바일 os필요, pc용 ie를 이용할수 있다는 점은 강점입니다. 무리한다면 Active-X와도 얼마정도의 호환을 할 가능성이 존재합니다. 만약 그렇다면 국내에서는 매우 좋은 솔루션일 수 있으나 완벽한 호환성을 기대하기는 어려울것으로 그리 기대하기는 어려울것 같습니다.  무엇보다도 웹의 영향도는 구글에 비해 매우 낮은 상황으로 불리합니다.
플래시는 현재까지는 가장 성공적이나 구글,MS,SUN등 무시못할 규모와 강점을 가진 회사들이 경쟁사로 등장했기 때문에 그들이 얼마나 잘 해나가면서 시장을 확보할지 모르겠습니다. 그러나 그들의 강점은 가장 많은 컨탠츠(게임)을 확보하고 있다는것이 장점입니다. 애플이 아이폰에 플래시를 안올리려고 하는 이유도 결국은 App이 플래시로 입을 타격을 방지하고자 함이 아닌가 싶습니다. (잡스가 아이폰에서 플래시를 돌리기에는 너무 무겁다는건 뻥입니다. 스펙이 더 나쁜 핸드폰에서도 플래시는 돌아갑니다.)

**[큰 인기를 끈 한게임 플래시 게임 고군분투]**

**4. 국내의 포탈들은 어떻게 할까 ? 역시 기술 표준은 구글**
결론은 거두 절미하고 구글은 현재 웹기술의 표준이라고 여겨지고 있는 상황입니다. 국내에서도 구글이 하면 네이버가 하고 네이버가 하면 다른 포털들이 따라하는 형국이었기 때문에 이는 여전히 유효하리라고 예상됩니다.
** 1) 구글의 Html5 지원 ([http://ddobagi.textcube.com/57](http://ddobagi.textcube.com/57))**
현재 [구글은 html5에 관심](http://ddobagi.textcube.com/57)을 가지고 있다고 하니, 정말로 Html5가 메인에 서게 될지 모르죠. 만약 안드로이드와 크롬으로 점유율을 가진 구글이 html5를 이용한 화려한 RIA를 내놓는다면, 너도나도 그 기술을 따라하고, 단시간에 상당한 점유율을 높일것입니다. 플래시나 실버라이트, 자바fx는 아직 뭔가를 깐다는 느낌이 있으므로 궁극적으로는 표준이아니라는 출생성분 자체의 불리함이 존재합니다.

{{IMG:4}}
**[ 플래시는 성골이 아니야! ]**
사실 표준이 아니고 그저 널리 포팅해둔 이 기술들이 Active-x를 욕할 입장은 아닙니다. 구글이 html5를 이용한 충분히 쉬운 라이브러리와 화려한 기술 시연만 보여준다면 단숨에 html5의 인식이 달라질것이고 Html5에 대한 책들이 쏟아질겁니다.
****
**2) 현재는 다른 솔루션에 비해 지지부진한 Html5**
현재는 다른 솔루션에 비해 html5를 선뜻 체택하는 회사가 없는데 이는 지원하는 브라우져가 부재하고, 개발에 필요한 기술래퍼런스도 적고, 실제로 와닿는 서비스가 없기 때문입니다. 향후도 이렇게 계속진행된다면 html5는 이미 자리잡은 다른 기술들을 비집고 들어갈 틈이 없을 것입니다. 따라서 구글이 모바일 시장에서 점유율을 확보하는 기간, 곧 향후 3년이내에 구글의 html5지원 서비스 유무에 따라 해당 기술의 운명이 결정지어질것 같습니다.

** 결론은 구글이 인터넷 업계의 골목 대장이군요. OTL.**
**{{IMG:5}}**
**[웹의 통일은 구글에게 식은죽 먹기]**

<!-- en -->
**1. What will replace Active X?**
**{{IMG:1}}**
I read an [article mentioning HTML5 as a technology to replace Active X](http://www.zdnet.co.kr/ArticleView.asp?artice_id=20091116182745). Many talk about Active X as if it's the original sin of the domestic internet environment, but why do banks need to use Active X? And can HTML5 truly surpass Flash, JavaFX, and Silverlight to proudly establish itself as the web's mainstream? As a web developer by profession, this is a fascinating topic.
So, the moment I first saw that article, I started looking into why Active X is truly necessary for payments and banking, and in what ways HTML5 could replace Active X. I found some good resources on DBGuide. (You can view them for free if you just sign up.)

| [Part 1 | Active X: From Swan to Ugly Duckling – Problems and Solutions | Jung Hee-yong](http://www.dbguide.net/know/know102001.jsp?mode=view&pg=1&idx=3187) |
| --- |
| [**Part 2 | Urgent Fix: Alternative Technologies for Public Certificates | Choi Sang-hoon**](http://www.dbguide.net/know/know102001.jsp?mode=view&pg=1&idx=3188) |
| [Part 3 | UI Replacement is My Job: UI Development Using Ajax | Park Young-rok](http://www.dbguide.net/comb/common/edit/1%BA%CE%20%7C%20%B9%E9%C1%B6%BF%A1%BC%AD%20%B9%CC%BF%EE%BF%C0%B8%AE%B7%CE%20%C0%FC%B6%F4%C7%D1%20%BE%D7%C6%BC%BA%EAX%20%B9%AE%C1%A6%BF%CD%20%C7%D8%B0%E1%B9%E6%BE%C8%20%7C%20%C1%A4%C8%F1%BF%EB) |
| [Part 4 | Beyond Active X: Functionality and Compatibility – XPCOM Development Strategy | Kim Min-soo](http://www.dbguide.net/know/know102001.jsp?mode=view&pg=1&idx=3190) |
| [Part 5 | MS's Alternative to Active X: How to Utilize Silverlight | Han Yong-hee](http://www.dbguide.net/know/know102001.jsp?mode=view&pg=1&idx=3191) |

However, if we think about this more fundamentally, all plugins except HTML5 are essentially threads forked by the browser. Therefore, it might be a matter of whether the browser supports the specific plugin or HTML5's specifications. The concept of a plugin is, after all, an extension of the browser's functionality.
Conversely, ActiveX is fundamentally a Windows Application rather than a browser extension, merely called by Internet Explorer. Just as you cannot run a Windows application on Linux, you cannot port ActiveX to OSes other than Windows. If you really wanted to, you'd install an OS VM Ware, larger than the browser itself, within the browser. You'd have to embed Windows as a plugin in Firefox. If that were possible, if ActiveX could have been a plugin like Silverlight from the start, there would have been no discussion about ActiveX.

**3. The Baton Passes to the Browser... And the Destination is Google**
Ultimately, who will take the future standard will be determined by **how well browsers support those plugins** and **how many sites actually use that technology?** Thinking this way, Google is the company that has secured both of these.
**1) Chrome Browser + Google Web Services**
**{{IMG:2}}**
Similar to Naver's market share in Korea, Google's global market share is very high. Also, technologies used by Google tend to quickly become standards. Ajax for map services and Flash video plugins for YouTube became the standard for map services of domestic portals and for UCC sites. Therefore, Google can be considered the biggest decision-maker in determining who wins this game.

**2) One more for good measure! Chrome Browser + Google Web Services + Mobile Platform Android**
**{{IMG:3}}**
At the heart of this web standard issue is not Mac, but mobile platforms. The iPhone, which put wireless internet on track, is also a mobile platform created by Apple, and Google's Android is poised to step into this arena, with victory almost certain.
Mobile is becoming an issue in the next generation of web, expanding into an entirely new market. This ultimately means that the higher the mobile platform's market share, the easier it is to increase browser market share.
Similar to IE's market share on Windows, Chrome's market share on Android will be a natural phenomenon. Android's smartphone market share in the future is very positive, and currently, it can be said to have no rivals.

**3) Google's Competitors**
Samsung's Bada has no web service model and no browser. Apple, being a single model, will find it difficult to exceed 20% of the market, unlike Android which releases new models almost every month.
For Microsoft, the traditional powerhouse of mobile platforms, recovering the reliability of Windows Mobile seems most important. Up to the existing 6.5, reliability is still lacking, and there's a need for a reliable and efficient mobile OS like Windows 7 for the public; the ability to use PC-based IE is a strength. If pushed, there's a possibility of some compatibility with Active-X. If so, it could be a very good solution in Korea, but perfect compatibility is unlikely, so it's hard to expect much. Above all, its web influence is very low compared to Google, putting it at a disadvantage.
Flash has been the most successful so far, but with companies like Google, MS, and SUN, which have undeniable scale and strengths, emerging as competitors, it's uncertain how well they will manage to secure the market. However, their strength is having the most content (games). The reason Apple doesn't want to put Flash on the iPhone, I suspect, is ultimately to prevent the App Store from being hit by Flash. (Jobs saying Flash is too heavy to run on the iPhone is a lie. Flash runs on phones with worse specs.)

**[Hangame Flash game 'Gogunbuntu' gained huge popularity]**

**4. What will domestic portals do? The technical standard is still Google.**
To cut a long story short, Google is currently considered the standard for web technology. In Korea, too, it has been a situation where if Google does something, Naver follows, and if Naver does something, other portals follow, so this is expected to remain valid.
**1) Google's HTML5 Support ([http://ddobagi.textcube.com/57])**
Since [Google is interested in HTML5](http://ddobagi.textcube.com/57), it's uncertain if HTML5 will truly become mainstream. If Google, with its market share in Android and Chrome, releases a brilliant RIA using HTML5, everyone will follow that technology, and its market share will increase significantly in a short time. Flash, Silverlight, and JavaFX still give the impression of needing to install something, so they ultimately have the inherent disadvantage of not being a standard.

{{IMG:4}}
**[Flash is not a true standard!]**
In fact, these technologies, which are not standards but merely widely ported, are not in a position to criticize ActiveX. If Google can just demonstrate sufficiently easy libraries and brilliant technical demonstrations using HTML5, the perception of HTML5 will change instantly, and books about HTML5 will flood the market.

**2) HTML5 is currently sluggish compared to other solutions**
Currently, no company is readily adopting HTML5 compared to other solutions, because there's a lack of supporting browsers, few technical references for development, and no tangible services that resonate. If this continues, HTML5 will have no room to squeeze in among other already established technologies. Therefore, the fate of this technology seems to be determined by Google's HTML5 support services within the period Google secures its mobile market share, i.e., within the next 3 years.

**In conclusion, Google is the neighborhood boss of the internet industry. OTL.**
**{{IMG:5}}**
**[Unifying the web is a piece of cake for Google]**