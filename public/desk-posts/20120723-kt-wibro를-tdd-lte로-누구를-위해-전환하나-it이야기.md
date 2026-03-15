---
date: "2012-07-23"
titleKo: KT, Wibro를 TDD-LTE로 누구를 위해 전환하나? IT이야기
titleEn: "KT: Switching Wibro to T"
category: it
tags:
  - IT이야기
images:
  - /desk/20120723-kt-wibro를-tdd-lte로-누구를-위해-전환하나-it이야기/01.webp
  - /desk/20120723-kt-wibro를-tdd-lte로-누구를-위해-전환하나-it이야기/02.webp
  - /desk/20120723-kt-wibro를-tdd-lte로-누구를-위해-전환하나-it이야기/03.webp
  - /desk/20120723-kt-wibro를-tdd-lte로-누구를-위해-전환하나-it이야기/04.webp
thumbnail: /desk/20120723-kt-wibro를-tdd-lte로-누구를-위해-전환하나-it이야기/01.webp
sourceCategoryNo: "142"
sourceCategory: IT이야기
externalUrl: https://blog.naver.com/fstory97/70142921921
---

<!-- ko -->
이동통신사에게 와이브로라는 아이템은 LTE대비 불편한 아이템입니다. LTE대비 속도가 떨어지는것도 아니고, 유지비용이나 보급비용이 크게 드는 것은 아니지만, 음성중심의 과금에는 그다지 도움이 되지 않고, 현재 제공하고 있는 용량만 해도 LTE대비 더 많은 용량을 제공하고 있으니 그다지 이익이 되지 않습니다. 때문에 이동통신사에게는 소극적인 아이템이 될 수 밖에 없습니다. 그런 와중에 그나마 정부의 입김이 가장 세게 작용하고 있었던 KT에서 와이브로대신 TDD LTE를 하게해달라고 했습니다. 이게 어떻게 된일이고 앞으로 와이브로는 어떻게 해야할지에 관해 이야기해보겠습니다.
** 1. 이동통신사의 입장 돈안되는 와이브로 하기 싫어. Kt가 하는것도 불편해**** - 그동안 KT가 와이브로를 밀었던 이유는 lte 못했기 때문. 그런데 상황이변했다.**  Lte가 와이브로 대비 비싼건 조금만 살펴보시면 압니다. 커버리지는 lte를 못하던 kt가 급하게 전국망을 깔았습니다. 그러나 저역시 와이브로를 쓰고 있지만, 짧은시간에 읍면동 까지 커버한다고 광고하는 u+대비 음영구간이 많은것 같습니다. 거기다 항상 연결되도 인터넷이 안되는 구간도 있는것 같은데 고쳐질 생각을 안하더군요. 주요고속도로 구간이라 과연 KT가 이 사실을 모를까 싶습니다. 예전에 모 간담회에서 lte를 못하는 kt가 와이브로 에그를 프로모션하고 있는데 타 통신사의 압력으로 급히 한시적으로 기간을 바꿨다는 이야기를 들었습니다. 모바일와이맥스의 보급에 가장 큰 문제는 이동통신사의 해게모니라는 리포트는 쉽게 찾아볼수 있습니다.
** 2. lte가 와이브로 대비 나은게 뭐야?** **없습니다. **속도가 더 빠른건 주파수를 많이 할당해서이고, 커버리지는 급하게 큰 돈을 들어부어 확산했기 때문입니다.
**1) 단말기 확보가 어렵다고요? 그럼 DMB는 ?** 이제는 수요가 줄어 탑제가 줄었지만, dmb는 국내표준이라 호환성이 없음에도 불구하고 꾸준히 나왔습니다. 저도 과거 휴대폰 회사에서 일해봤지만, 국내 단말은 따로 개발합니다. 때문에 해외휴대폰과 가격을 객관적으로 동일 선상에 놓고 비교하기는 어렵습니다만, 역으로 말하면 국제 호환성 때문에 와이브로 단말개발에 소극적일 이유는 없다는 겁니다.
**2) 기존 3g와의 호환성이 좋나 ? 진짜 ?** Lte의 원칩 개발도 얼마전에나 끝났습니다. 와이브로의 3w폰은 아이폰보다 먼저 나왔습니다. Lte에는 와이브로와 동일하게 음성통화 스펙은 없어 voip를 써야 합니다. 물론, 기지국 호환성에 약간의 도움이 된다는군요. 문제가 있다면 기지국이 와이브로대비 비싸다는거...
**3) 속도 정말 빨라 ? 차세대 스펙 준비는 ?** 오히려 속도면에서는 와이브로 에볼루션의 상용화는 목전에 와있기 때문에 이제 개발중인 lte 어드벤스보다 더 빨리 사용자들에게 lte대비 수배의 속도를 제공할 수 있습니다. 어디선가 또 존재하지 않는 ltehd 같은 용어를 이야기하던데 이게 lte어드벤스 규격같습니다. (마켓팅을 위해 기술규격을 마음대로 바꿔버리는 이통사.. -- 지금 말하는 lte와 와이브로는 3g규격입니다. 산업계(이통사)의 요구로 4g로 격상됬지만, 아이폰보다 더 빨리 나온 와이브로와 같은 속도의 lte가 4g라뇨?)
**4) 단 하나, 해외 단말 수급에는 용이하다. 근데 정말 호환될까 ?** 유일한 장점은 전세계 이통사들이 적극적이기 때문에 해외단말 수급에 용이한점입니다. 재밌는것은 블랙리스트 제도를 방해하는 이통사들이 해외단말수급에 용이한 기술인 lte를 고수하는 이유는 블랙리스트제도에 lte가 제외됬기 때문입니다. 따라서 사실 국제호환성에도 사실 의문이 듭니다.
**3. 와이브로가 정말로 안될까?** 와이브로가 정말로 안될까요? Kt에서는 아무도 쓰지 않는양 이야기했지만, 별 프로모션 없이도 와이브로 사용자는 거의 [KT 87만(2012/05, 월 3.6%증가) 이용자,(SKT는 6만)](http://me2.do/GbUtnai)입니다. 해외의 경우에도 꾸준히 크게 성장 중입니다.

#

와이브로가 어렵다 말하는 점 중 유일한 점은 국내 규격의 와이브로가 모바일 와이맥스와 호환이 안되기 때문입니다. 이 점만 의지를 가지고 개선한다면 와이브로가 안될 이유는 없습니다. 물론 이동통신사에게 이를 기대하기는 무리가 아닐까 합니다. **4.KT의 입맛에 맞는 TDD-lte는 뭐지?** - 사실은 중국의 와이브로.. Tdd lte를 kt가 내놓은 이유는 뭘까요? Lte의 후발인 kt로서는 타 이통사대비 강점을 가져야 했습니다. 그런 와중에 중국이 wimax대신 tdd lte라는 독자 스펙을 쓰기로 했는데 기존 lte대비 다운링크 트래픽 비율을 변용할 수 있는 유연성 때문에, 차별성을 가지고 있으면서, LTE장비로 일원화, 같은 unparied방식의 주파수의 와이브로를 대치하면 돈될것 같기 때문입니다. 중국이라는 거대 시장이 tdd lte를 한다는 점은 해외 호환성에도 앞선다는 이미지를 가져갈 수 있습니다. 분명 KT로 보아서는 매력적인 조건이며 틀린 말은 없습니다.
{{IMG:1}}
**[출처 :**[*중국 TD*-*LTE 추진현황*과 전망](https://www.kca.kr/dboard/bbs/bbs_config/file_down.jsp?file_name=%C1%DF%B1%B9%20TD-LTE%20%C3%DF%C1%F8%C7%F6%C8%B2%B0%FA%20%C0%FC%B8%C1.pdf&board_id=bonwonA09&f_idx=5044) ** ****[http://me2.do/xA30BQt](http://me2.do/xA30BQt)]****
**** * TDD-LTE의 국내 도입을 주장하는 리포트에 포함된 위의 표에는 와이맥스가 2배 느린것으로 표기되었으나 같은 조건이 아닌듯합니다. 거기다 Wimax가 60km이동시 통신이라니.. 대체 언제적 기술을 비교한건지. 불공정한 비교표 같네요. 주파수대비 속도는 아래와 같다고 합니다. 참고바랍니다.**

| 주파수폭 / 기술 상용화 일정 | LTE(8) 상용화중 | WiBro(w2) 상용화중 | LTE(10) 상용화 2014년 | WiMAX2 상용화 2012년 |
| --- | --- | --- | --- | --- |
| (5:5) 10Mhz | 37 | 37 | 75 | 75 |
| (10:10) 20Mhz | 75 | - | 150 | 160 |
| (20:20) 40Mhz | 150 | - | 300 | 320 |
| (40:40) 80Mhz | - | - | 600 | - |

** [출처 : [http://blog.daum.net/l--js/15](http://blog.daum.net/l--js/15) ]**
그러나 분명한 점은 td lte는 lte가 아니라 중국 독자 규격(곧 인도 포함), 곧 국내 wimax와 호환성이 없는 와이브로 같은 놈이라는 점입니다. 다른점은 중국이라는 거대시장의 표준이라는 점입니다. 결국 중요한 점은 통신기술이라는 것이 이용자에게 주는 가치보다는 이동통신사의 시장의 가치에 의해 결정된다는 것을 보여주는 또하나의 시나리오입니다.  와이브로가 부족했던 점은 바로 이 점입니다. 참여정부 이후 로드맵을 잃고 내수시장망 바라보고 이동통신사의 시장 논리에만 표류하던 기술은 결국 중국 독자 표준에도 밀릴정도로 시장을 확보하지 못했다는 이야기입니다.
**5. 와이브로를 tdd lte로 대신해도 되나?**** 1) 그래. KT는 TDD-LTE를 시켜야 한다. **솔직히 인정하겠습니다. Kt에 와이브로를 맞겨서는 안됩니다. 시장상황상 kt는 할 의지가 없습니다. 따라서 kt에게는 하고 싶은 td lte를 하게 하는게 맞습니다.
** 2) 와이브로 사업권과 주파수는 반납해서 4이통사로** 그러나 와이브로를 폐기하고 주파수를 td lte를 하게 해야할까요? 그건 아닙니다. 와이브로를 하고 싶어서 안달이난 기업이 있습니다. 바로 제 4이동통신사에게 넘기는 겁니다. Kt가 가지고 있는 모든 와이브로 인프라를 아예 제4이통사에 넘긴다면 시작이 80만 이용자에서 시작합니다. 아주 좋은 출발입니다. 원래 와이브로를 하라고 국가에서 할당해준 주파수에 다른걸 팔겠다는건 말이안됩니다. 물론, 여태껏 한거는 제 4이통사에서 값을 쳐줘야 할겁니다. 한동안 수익을 셰어한다던지, 아니면, 한번에 얼마를 내야 한다든지.. KT는 TDD-lte를 정 하고 싶다면 기존의 ltehd 주파수를 쪼개서 td lte를 하던지 dmb주파수를 사라고 하는건 어떨까요?
** 3) 기존 와이브로 사용자들에게는 동일 수준의 요금을 제시할것** 그리고, 분명 기존 와이브로 사용자들에게는 계약 위반입니다. 이들에 대한 대안도 충분해야 합니다. 2g처럼 퍽 끊어버리는 짓을 하지 않기를 바랍니다.
**6. 와이브로가 기야할길** 와이브로는 사실 이동통신사에는 그리 도움이 되는 아이템이 아닙니다. 제 4이동통신사라고 할지라도 기존의 이동통신사가 거둬왔던 큰 수익을 기대하기는 어려울겁니다. 다만 중요한것은 통신시장 전체의 그림과 인프라를 바탕으로 한 한국의 SW 기술 경쟁력으로 인한 더 큰 이익을 기대하는 것입니다. Wibro를 접고 TDD-LTE를 한다고 해서 KT가 타사대비 경쟁력을 가질뿐, 한국이 가져갈수 있는 경쟁력 따위는 없습니다. 삼성전자 같은 글로벌 기업들은 어차피 한국이 Wibro를 접더라도, Wimax, TDD-LTE 다 할 수 밖에 없습니다. 여전히 Wimax는 100개국 이상에서 쓰고 있으니까요.
** 1) 이통사의 대안 세력으로 발전시키기** 와이브로가 확대되지 못한 이유 중 하나는 3개의 이동통신사가 그동안 담합이 가능했기 때문입니다. 모두 통신사다보니 모두 같은 상황에 같은 것을 바라봅니다. 똑같은 곳에서 똑같이 이익이 나는 구조인데, 가격경쟁대신 담합을 택했습니다.  그러니 이번에 제 4이동통신사는 제조사, 포탈사, 국가등의 이동통신사와 니즈가 다른 연합체의 입김이 강한 곳이 주체가 되야합니다. 그래서 기존 이동통신사의 대안 통신사로 이들의 담합을 막아내고 경쟁을 가속화 해야합니다. 망중립성 이슈로 위협을 받는 산업군들의 중심으로 편성하여 이동통신자체가 가지고 있는 독점력을 약화시켜 타 산업의 시너지로 이어갈 수 있는 중립군이 필요합니다.
** 2) 국제 경쟁력 갖추기** 와이브로가 국내 표준인 점은 KT의 지적이 옳습니다.** 무조건 wimax와 호환성을 갖춰야 하며, 차세대 wimax2를 가장 먼저 상용화 시켜야 합니다.  와이브로라는 이름을 버리고 와이맥스로 아예 개명이라도 해야합니다. **또한 국내에서는 구 이동통신사의 알력으로 기를 피기 어려울것이 분명하므로 국내에 머무르기보다는 이제 막 인프라를 갖추고 wimax를 선호할만한 국가나 혹은 이동통신사의 폭리가 강한 국가의 시장 혁신자나 대안 세력으로 진입하는 방법입니다. 이러한 대안세력으로 몇개 국가에서의 3위의 이동통신사로만 유지된다고 하더라도 국내의 1위만 하는 SKT도 보다도 훨씬 가치가 높은 기업이 될 수 있으며, 국가적 위상도 높일 수 있습니다.
**7. 정부의 의지와 리더쉽이 절대적으로 필요한 기술로드맵** 이러한 큰 그림은 사실 정부가 그릴 수 밖에 없습니다. 누가 나서서 망할지도 모르는 3위, 4위 사업자가 될 생각을 할까요 ? 그러면서 서비스사업자들의 니즈까지 맞추는 신속성 까지 갖추기 또한 쉽지 않을겁니다. 결국은 리더쉽이 가장 중요하지 않을까 싶네요. 아이폰이 나오고 와이브로는 LTE의 대안으로 잠시 KT가 들고 나왔던 점을 빼고는 아무 진전이 없었던 것을 보면, 중요한것은 시장의 조율이고 이를 할 수 있는것은 1위사업자나, 정부밖에 없습니다. 1위사업자에게 이걸 기대하는것은 사자가 풀뜯어먹기를 바라는것과 마찬가지니.. 남은것은 정부밖에 없습니다.
[재생하기 바로보기가 지원되지 않는 파일입니다. 클릭하여 팝업창으로 플레이 해보세요.](http://blog.naver.com/EmbedHttpView.naver?blogId=fstory97&logNo=70142921921&hashKey=6676372a72a9c9f6f76e6df7a9ac2ad5)**********http://www.hanrss.com/add_sub.qst?url=http%3A%2F%2Fblog.rss.naver.com%2Ffstory97.xml**** {{IMG:2}}

http://search.allblog.net/?keyword=%EC%88%B2%EC%86%8D%EC%96%98%EA%B8%B0&view=issue&type=100

{{IMG:3}}

http://www.blogkorea.net/bnmsvc/user_bloglist.do?userNum=548520&amp;rssSeq=575708&amp;gubun=A&amp;pages=1

{{IMG:4}}

http://mixsh.com/media/53844

**********

<!-- en -->
For mobile carriers, WiBro is an inconvenient item compared to LTE. It's not that its speed is lower than LTE, nor does it incur significant maintenance or deployment costs. However, it doesn't contribute much to voice-centric billing, and the current capacity it offers is already more than LTE, so it's not very profitable. Therefore, it inevitably becomes a passive item for mobile carriers. Amidst this, KT, where the government's influence was strongest, requested to implement TDD LTE instead of WiBro. Let's discuss what happened and what should be done with WiBro in the future.
** 1. Mobile Carriers' Stance: Don't want unprofitable WiBro. KT doing it is also inconvenient.**** - The reason KT pushed WiBro was because it couldn't do LTE. But the situation has changed.**  You'll know that LTE is more expensive than WiBro if you look closely. KT, which couldn't do LTE, hastily laid out a nationwide network for coverage. However, even though I use WiBro, it seems to have more dead zones compared to U+ which advertises coverage down to small towns and villages in a short time. Moreover, there seem to be areas where it's always connected but the internet doesn't work, and they don't seem to be fixing it. Given that these are major highway sections, I wonder if KT is truly unaware of this. I once heard at a certain conference that KT, unable to implement LTE, was promoting WiBro Eggs, but due to pressure from other carriers, it hastily changed the promotional period temporarily. Reports stating that the biggest problem in the spread of Mobile WiMAX is the hegemony of mobile carriers are easy to find. 
** 2. What's better about LTE compared to WiBro?** **Nothing. **The faster speed is due to allocating more spectrum, and the coverage was rapidly expanded by pouring in a lot of money. 
 **1) Is it difficult to secure devices? Then what about DMB?** Although demand has decreased and its inclusion has lessened, DMB, despite being a domestic standard with no compatibility, was consistently released. I've also worked at a mobile phone company in the past, and domestic devices are developed separately. Therefore, it's difficult to objectively compare their prices with overseas phones on the same level, but conversely, there's no reason to be passive about WiBro device development due to international compatibility.
 **2) Is its compatibility with existing 3G good? Really?** The development of LTE's single chip only recently concluded. WiBro's 3W phone came out before the iPhone. Like WiBro, LTE has no voice call specifications, so VoIP must be used. Of course, it reportedly offers some help with base station compatibility. The problem is that base stations are more expensive than WiBro...
 **3) Is it really fast? What about next-generation spec preparation?** In terms of speed, the commercialization of WiBro Evolution is imminent, meaning it can provide users with speeds several times faster than LTE, even sooner than the currently developing LTE Advanced. Somewhere, they're talking about non-existent terms like LTE HD, which seems to be the LTE Advanced standard. (Mobile carriers arbitrarily changing technical specifications for marketing... -- The LTE and WiBro being discussed now are 3G standards. They were upgraded to 4G at the industry's (mobile carriers') request, but how can LTE, which came out at the same speed as WiBro and even earlier than the iPhone, be 4G?)
 **4) Only one thing: it's easy to procure overseas devices. But will it really be compatible?** The only advantage is that it's easy to procure overseas devices because mobile carriers worldwide are actively adopting it. What's interesting is that mobile carriers, who obstruct the blacklist system, insist on LTE, a technology that facilitates overseas device procurement, because LTE was excluded from the blacklist system. Therefore, I actually have doubts about its international compatibility. 
**3. Will WiBro really fail?** Will WiBro really fail? KT talked as if no one uses it, but even without special promotions, WiBro users are almost [870,000 for KT (May 2012, 3.6% monthly increase), (60,000 for SKT)](http://me2.do/GbUtnai). It is also consistently growing significantly overseas. 

# 

The only reason cited for WiBro's difficulty is that the domestic WiBro standard is not compatible with Mobile WiMAX. If this point alone is improved with determination, there is no reason for WiBro to fail. Of course, it might be unreasonable to expect this from mobile carriers. **4. What is TDD-LTE, which suits KT's taste?** - Actually, it's China's WiBro.. Why did KT introduce TDD LTE? As a latecomer to LTE, KT needed to have an advantage over other carriers. Amidst this, China decided to use its own unique specification, TDD LTE, instead of WiMAX. This is because it offers flexibility to vary the downlink traffic ratio compared to existing LTE, providing differentiation, unifying with LTE equipment, and replacing WiBro's unpaired spectrum with the same method seems profitable. The fact that China, a huge market, is adopting TDD LTE can also project an image of superior international compatibility. From KT's perspective, these are clearly attractive conditions and not incorrect.
{{IMG:1}}
**[Source :**[*China's TD*-*LTE Promotion Status* and Outlook](https://www.kca.kr/dboard/bbs/bbs_config/file_down.jsp?file_name=%C1%DF%B1%B9%20TD-LTE%20%C3%DF%C1%F8%C7%F6%C8%B2%B0FA%20%C0%FC%B8%C1.pdf&board_id=bonwonA09&f_idx=5044) ** ****[http://me2.do/xA30BQt](http://me2.do/xA30BQt)]****
**** * The table above, included in a report advocating for the domestic introduction of TDD-LTE, indicates WiMAX is twice as slow, but it doesn't seem to be under the same conditions. Moreover, WiMAX communicating at 60km/h... What era's technology are they comparing? It seems like an unfair comparison table. The speed relative to frequency is as follows. Please refer to it.**

| Frequency Bandwidth / Technology Commercialization Schedule | LTE(8) Commercialized | WiBro(w2) Commercialized | LTE(10) Commercialization 2014 | WiMAX2 Commercialization 2012 |
| --- | --- | --- | --- | --- |
| (5:5) 10Mhz | 37 | 37 | 75 | 75 |
| (10:10) 20Mhz | 75 | - | 150 | 160 |
| (20:20) 40Mhz | 150 | - | 300 | 320 |
| (40:40) 80Mhz | - | - | 600 | - |

** [Source: [http://blog.daum.net/l--js/15](http://blog.daum.net/l--js/15) ]**
 However, what is clear is that TD-LTE is not LTE but a Chinese proprietary standard (soon to include India), meaning it's like WiBro, which is incompatible with domestic WiMAX. The difference is that it's a standard for the massive Chinese market. Ultimately, the important point is that this is another scenario demonstrating that telecommunication technology is determined more by the market value of mobile carriers than by the value it provides to users. This is precisely where WiBro fell short. The technology, which lost its roadmap after the Participatory Government era, focused only on the domestic market, and drifted solely on the market logic of mobile carriers, ultimately failed to secure enough market share, even being pushed aside by China's proprietary standard.
**5. Can WiBro be replaced with TDD-LTE?**** 1) Yes. KT should be made to adopt TDD-LTE. **I'll be honest. WiBro should not be entrusted to KT. Given the market situation, KT has no will to do it. Therefore, it's right to let KT pursue the TD-LTE it wants. 
** 2) Return WiBro business rights and frequencies to the 4th mobile carrier** But should WiBro be abolished and its frequencies be used for TD-LTE? No, that's not right. There are companies eager to do WiBro. It should be handed over to the 4th mobile carrier. If KT hands over all its WiBro infrastructure to the 4th mobile carrier, it would start with 800,000 users. That's a very good start. It makes no sense to sell something else on frequencies originally allocated by the state for WiBro. Of course, the 4th mobile carrier would have to pay for what has been done so far. Whether by sharing profits for a period, or paying a lump sum... If KT truly wants to do TDD-LTE, how about splitting its existing LTE-HD frequencies for TD-LTE, or buying DMB frequencies?
** 3) Offer existing WiBro users the same level of rates** And clearly, this would be a breach of contract for existing WiBro users. Sufficient alternatives must also be provided for them. I hope they don't just cut it off abruptly like with 2G.
**6. The Path WiBro Must Take** WiBro is not actually a very helpful item for mobile carriers. Even for a 4th mobile carrier, it would be difficult to expect the large profits that existing mobile carriers have reaped. What's important, however, is to expect greater profits through Korea's software technology competitiveness, based on the overall picture of the telecommunications market and infrastructure. Even if WiBro is abandoned and TDD-LTE is adopted, only KT would gain competitiveness compared to other companies; there would be no competitiveness for Korea to gain. Global companies like Samsung Electronics will inevitably have to handle WiMAX and TDD-LTE anyway, even if Korea abandons WiBro. Because WiMAX is still used in over 100 countries.
** 1) Develop it as an alternative force to mobile carriers** One reason WiBro failed to expand is that the three mobile carriers were able to collude during that time. Since they are all telecom companies, they all face the same situation and look at the same things. It's a structure where profits are generated in the same way from the same place, but instead of price competition, they chose collusion. Therefore, this time, the 4th mobile carrier must be led by a consortium with strong influence from manufacturers, portal companies, and the state, whose needs differ from existing mobile carriers. Thus, as an alternative carrier to existing mobile carriers, it must prevent their collusion and accelerate competition. A neutral force is needed, formed around industries threatened by net neutrality issues, to weaken the monopolistic power of mobile communications itself and lead to synergy with other industries.
** 2) Secure international competitiveness** KT's point that WiBro is a domestic standard is correct.** It must unconditionally ensure compatibility with WiMAX, and commercialize next-generation WiMAX2 first. It should even abandon the name WiBro and rename itself WiMAX. **Furthermore, since it will clearly be difficult to thrive domestically due to the power struggles of existing mobile carriers, rather than staying in Korea, it should enter as a market innovator or alternative force in countries that are just building infrastructure and would prefer WiMAX, or in countries where mobile carriers' profiteering is strong. Even if it only remains the 3rd largest mobile carrier in a few countries as such an alternative force, it could become a much more valuable company than SKT, which only holds the #1 spot domestically, and could also elevate national prestige.
**7. A Technology Roadmap Absolutely Requiring Government Will and Leadership** In fact, only the government can draw such a big picture. Who would step forward to become a 3rd or 4th place carrier, potentially facing failure? And it would also not be easy to have the agility to meet the needs of service providers. Ultimately, I think leadership is the most important thing. Considering that after the iPhone's release, WiBro made no progress except for KT briefly proposing it as an LTE alternative, what's important is market coordination, and only the #1 carrier or the government can do this. Expecting this from the #1 carrier is like expecting a lion to eat grass... so only the government remains.
 [This file does not support direct playback. Click to play in a pop-up window.](http://blog.naver.com/EmbedHttpView.naver?blogId=fstory97&logNo=70142921921&hashKey=6676372a72a9c9f6f76e6df7a9ac2ad5)**********http://www.hanrss.com/add_sub.qst?url=http%3A%2F%2Fblog.rss.naver.com%2Ffstory97.xml**** {{IMG:2}}

http://search.allblog.net/?keyword=%EC%88%B2%EC%86%8D%EC%96%98%EA%B8%B0&view=issue&type=100

 {{IMG:3}}

http://www.blogkorea.net/bnmsvc/user_bloglist.do?userNum=548520&amp;rssSeq=575708&amp;gubun=A&amp;pages=1

 {{IMG:4}}

http://mixsh.com/media/53844

﻿**********