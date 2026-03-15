---
date: "2009-10-28"
titleKo: Public Wifi를 위한 Wifi인증제 IT에 대한 잡설 / IT이야기
titleEn: Wifi Authentication System for Public Wifi
category: it
tags:
  - IT에 대한 잡설
images: []
sourceCategoryNo: "41"
sourceCategory: IT에 대한 잡설
externalUrl: https://blog.naver.com/fstory97/70072490938
---

<!-- ko -->
얼만전 무선랜 가용성을 위해 isp업체의 인증제([http://blog.naver.com/fstory97/70070221931](http://blog.naver.com/fstory97/70070221931))에 관한 포스팅을 한적이있었는데 정말 wifi 인증제
([http://economy.hankooki.com/lpage/industry/200910/e2009102618420270260.htm](http://economy.hankooki.com/lpage/industry/200910/e2009102618420270260.htm))
란 이야기가 떠도는 모양이다.
****
**1. 현재의 보안 설정이 안된 Wifi의 한계**
공용 wifi의 가용성을 떨어뜨린다고들 반대하는 것 같은데, 난 오히려 묻고 싶다. 지금 일반 wifi의 가용성이 그리 좋은가? 스마트폰을 꽤 오래도록 써왔지만 예전에 비해 길을 돌아다니다보면 확실히 수많은 ap가 잡힌다. 하지만 보안 설정 때문에 쓸 수있는 ap는 거의 없다. 가끔 열려있는 ap를 감사하게 쓰지만 그 경우에는 ap어드민 주소를 치면 접근이 되는 모습을 쉽게 볼 수 있었다. 감사하기는 한데 ap주인이 좀 걱정됬던것은 내가 오지랍이 넓어서 일까?

**2. 이를 위해 Wifi 단말의 식별은 필요하다.
** 초창기에 자동차가 나왔을 때는 자동차는 등록되지 않았을 것이다. 총기 역시 마찬가지였다. 그러나 그 역기능이 알려지면서 해당 기기들을 통제 해야 할 필요가 생겼다. ip는 기본적으로 라우팅을 위한 주소지 실제 식별 id는 아니란 점에서 현재 단말의 식별은 없다고 봐도 무방하다. 그때문에 인터넷 뱅킹에는 본인 확인을 위할 복잡한 기술이 들어간다. 잠재적 범죄자로 분류하기 위해 본인인증을 거친다면 선박이나 비행기를 탈때도 마찬가지의 이슈가 될 수 있다. 범죄자를 식별 할 수 있는 수단은 현재는 그다지 많지 않다. 또한 이 소수의 범죄자가 무서워 공공의 도로가 될 수도 있는 ap들은 철저히 걸어잠그고 있는 꼴이기도 하다. 공공의 도로를 이용하기 위해서는 번호판을 단 자동차를 타야하는 이유를 조금만 생각해보면 어렵지 않게 생각 할 수 있을 것이다. wifi인증은 근본적으로 범죄자를 식별가능한 수단을 갖자는 것이다.

**3. Wifi인증제는 정부에서 하는 만큼 사업성이 아니라 ****공공성이 앞서야 한다.**
물론 그 수행방법은 잘 살펴봐야 할 것이다. public wifi를 위한 wifi인증은, 어디까지나 public이어야 한다. 따라서 개인의 운영비용은 현재의 은행 공인인증서처럼 부담이 없어야하며 일반 가정용 ap까지 활용가능하도록 범용적이여야 한다. 일부 통신사의 수익을 보존하기 위해 법까지 제정하는 일은 절대로 없어야 하며, 해외의 Public Wifi를 벤치마킹 해야 한다.

**4. 막혀있는 AP를 뚫는 방향의 Wifi 인증제의 발전이 필요하다.**
요즘 돌아다니면서 막혀있는 수많은 ap들을 보며 공공제인 ISM밴드의  낭비다란 생각이 들었는데 이를 충분히 활용할 수 있는 방안으로 가야한다. 무선기기 확산의 요즘 추세라면 WIFI 대역폭은 금새 차고 넘칠 것이다. 그때는 쿡앤쇼로 나온 FMC는 도시전지역을 커버하게 될것이고 seamless한 환경이 구축된다. 그러기 위해서는 보다 안전한 네트워크 환경은 매우 중요한 이슈이고, wifi인증제는 그 중 하나가 될것이다.
물론 실력있는 해커라면 지금도 MAC도 위조한다지만 자동차 번호판 위조가 가능한 현실에도 자동차의 인증제는 그 효용성은 입증된 것 처럼 그 효용성은 유효할것으로 생각된다. 해커가 아닌 일반인을 때려잡고 식별하는 것은 지금 기술로도 이미 충분한 상황이니 일반인들이 잠재적 범죄자 운운하는 건 좀 너무 앞서나가는 것 같다.

<!-- en -->
A while ago, I posted about an ISP's authentication system ([http://blog.naver.com/fstory97/70070221931](http://blog.naver.com/fstory97/70070221931)) for wireless LAN availability, and it seems that there's really talk of a Wi-Fi authentication system ([http://economy.hankooki.com/lpage/industry/200910/e2009102618420270260.htm](http://economy.hankooki.com/lpage/industry/200910/e2009102618420270260.htm)) circulating.
****
**1. Limitations of current unsecured Wi-Fi**
It seems people oppose it, saying it lowers the availability of public Wi-Fi, but I'd rather ask: Is the availability of general Wi-Fi really that good right now? I've used smartphones for quite a long time, and compared to before, when walking around, countless APs are definitely detected. However, there are almost no APs that can be used due to security settings. Occasionally, I gratefully use an open AP, but in those cases, I could easily see that access was granted by typing the AP admin address. While I was grateful, I wondered if I was being too nosy for worrying about the AP owner.

**2. For this, identification of Wi-Fi devices is necessary.**
When cars first appeared, they probably weren't registered. The same was true for firearms. However, as their negative aspects became known, the need arose to control these devices. Since an IP address is fundamentally for routing and not an actual identification ID, it's fair to say that current devices lack identification. That's why complex technologies are used in internet banking for identity verification. If identity verification is required to classify someone as a potential criminal, it could become a similar issue when boarding ships or planes. Currently, there aren't many means to identify criminals. Furthermore, out of fear of these few criminals, APs that could serve as public roads are being thoroughly locked down. If you think a little about why you need to drive a car with a license plate to use public roads, you can easily understand. Wi-Fi authentication is fundamentally about having a means to identify criminals.

**3. As Wi-Fi authentication is implemented by the government, public interest, not profitability, must take precedence.**
Of course, its implementation method must be carefully considered. Wi-Fi authentication for public Wi-Fi must, by all means, be public. Therefore, individual operating costs should be free, like current bank public certificates, and it should be universal enough to be usable with general home APs. Legislation to preserve the profits of certain telecommunication companies must absolutely not happen, and public Wi-Fi abroad should be benchmarked.

**4. The Wi-Fi authentication system needs to evolve in a way that opens up blocked APs.**
Lately, seeing countless blocked APs while walking around, I've felt it's a waste of the public ISM band, and we should move towards a way to fully utilize it. Given the current trend of wireless device proliferation, Wi-Fi bandwidth will soon be overflowing. At that time, FMC (Fixed Mobile Convergence) from Cook&Show will cover entire urban areas, and a seamless environment will be established. For that to happen, a safer network environment is a very important issue, and the Wi-Fi authentication system will be one part of it. Of course, skilled hackers can still spoof MAC addresses, but just as car registration has proven its effectiveness even with the reality of license plate forgery, its effectiveness is expected to remain valid. Identifying and catching ordinary people, not hackers, is already sufficiently possible with current technology, so talking about ordinary people as potential criminals seems a bit too premature.