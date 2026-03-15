---
date: "2011-03-14"
titleKo: DDos의 최선은 정말 좀비PC법입니까? IT에 대한 잡설 / IT이야기
titleEn: Is the Zombie PC Law Really the Best Solution
category: it
tags:
  - IT에 대한 잡설
images:
  - /desk/20110314-ddos의-최선은-정말-좀비pc법입니까-it에-대한-잡설-it이야기/01.webp
  - /desk/20110314-ddos의-최선은-정말-좀비pc법입니까-it에-대한-잡설-it이야기/02.webp
  - /desk/20110314-ddos의-최선은-정말-좀비pc법입니까-it에-대한-잡설-it이야기/03.webp
thumbnail: /desk/20110314-ddos의-최선은-정말-좀비pc법입니까-it에-대한-잡설-it이야기/01.webp
sourceCategoryNo: "41"
sourceCategory: IT에 대한 잡설
externalUrl: https://blog.naver.com/fstory97/70104865677
---

<!-- ko -->
**1. 좀비 PC법 ?**
DDOS공격 이후 일명 좀비pc법이 논의 된다는 이야기를 들려 오더군요. 일정수준의 클라이언트 보안은 어느정도 보장되야하는 것은 분명히 이해가 갑니다만 이를 강제하는 법은 썩 기분 좋지 않습니다.  그렇게 기민하신 정부에서는 어째서 ie6를 국가기관에서 쓰면서 서비스사업자들을 괴롭히고 있는지요.
보안사고가 터지면 공격의 flow에 따라 여러가지로 대책을 세울수 있습니다. 공격을 당하는 피해자측에서 혹은 네트워크차원에서 ddos의 경우 좀비pc가 그 대안이 될 수 있겠죠. 그리고 좀비pc를 만드는 과정도 그렇구요.

그런데 정부가 내세운 방법은 가장 비용이 많이들고 비효율적인 방법중에 하나입니다. 물론 정부기관입장에서야 특별히 장비도 안사고 공격확률도 떨어진다고 생각할지도 모르겠지만 2중 3중의 보안장치를 클라이언트에 자꾸 설치하면 그만큼 그 많은 클라이언트에서 사용하는 프로세싱 비용은 계산이 가능한 수준일까요?  차라리 사용자단의 게이트웨이나 공유기 수준이었다면 모르겠습니다만, 안그래도 뭔가 많이 올라가있는 사용자 pc에수준에서는 지나치게 부담되는 일입니다.

**2. 백신이 보안의 만능 도깨비 방망이 ?**
더군다나 백신조차 안깐 이들의 보안수준이 얼마나 낮은수준인데 그들에게 백신만 깔면 된다는 식의 법이 얼마나 그들의 보안의식을 안일하게 할까요?  백신만깔면 안전하지 않은 사이트를 방문해도 되고 확인되지 않은 프로그램을 설치해도 되고, 업데이트도 안해도 된다. 라는걸까요?
보안은 유저의 백신이 만능도깨비가 아닙니다. 물론 백신을 파는 업체들이라면 도깨비 방망이 처럼 이야기하겠지만, 그건 사실 파는 사람도 사는 사람도 믿지 않는 구호일 뿐입니다.
백신이란게 또한 DDOS에 얼마나 허술한건지 아는지 모르겠습니다. 백신이란 바이러스라고 인지된 이후에나 해당 파일패턴을 추가합니다. 잠복하고 있다가 동시에 공격하는 ddos의 봇을 잡아낼 확률은 그다지 높지 않습니다. 물론 순전히 패턴으로 잡아내기도 하지만 이때는 백신의 신뢰성문제가 늘 대두되고 성능도 그만큼 더 나쁩니다. 그래서 성능과 보안사이의 Trade off는 늘 발생합니다. 그러나 그 Trade off는 유저가 결정하는겁니다. 가장 안전한 보안이란 PC전원을 꺼버리는겁니다. 그걸 납득하시겠습니까 ?

**3. 존재자체가 불법인 P2P는 왜 외면하는가 ?**
사실 ddos의 근본적인 문제를 따지자면 백신을 설치하지 않은 유저이상으로 문제는 바로 근원지인 p2p사이트 입니다.
이 p2p 사이트에 유저는 왜 접근했을까요? 보통은 두가지죠. 동영상을 다운로드 하거나 불법 sw를 설치하기를 원했거나. 물론 합법적으로 다운로드 했을수도 있습니다. 그러나 그 가능성은 지극히 낮습니다. 네이버와 다음도 동영상 다운로드 서비스를 하고 있는데 왜 그 구석사이트를 찾아 다운로드 했을까요? 무료다운로드 쿠폰때문에? 그럼 그업체들은 무료로 다운로드를 시키면서 비즈니스모델이 뭘까요?

**4. 핵심 문제는 ActiveX를 포함한 인증되지 않은 S/W유통경로**
애플과 구글을 비교할때 애플의 앱은 비교적 안전하다고 이야기합니다. 그 이유는 앱의 다운로드 채널이 하나여서 그 채널만 감시하면 되기 때문이죠. 근본적으로 sandbox때문에 안전하다고 하는건 기술적인 부차적인 문제고 취약점은 애플이라고 해도 얼마든지 존재할수 있습니다. 그보다 더 이러한 취약점을 하나로 관리할수 있는 시스템이란게 중요합니다.
구글 역시 공인된 마켓정도에만 억세스하는 정도라면 크게 문제가 안돼죠.
다만 늘문제 되는건 탈옥한 아이폰과 카페등을 통해 얻은 인증되지 않은 앱을 안드로이드에서 실행시키는 겁니다. 그리고 바로 그 행위가 pc에서는 p2p에서는 그대로 일어나고 있는것이죠.
그리고 무엇보다도 이 행위는 불법입니다. 악의적인 sw를 만들고 p2p에 올리고 제목만 야시꾸리하게 달면 순식간에 수십다운로드를 기록합니다. 물론 이후에 삭제될수 있겠지만 p2p사이트는 거의 의도적으로 사후검수를 합니다. 이게 사실은 감시를 시늉만하고 있다는것이죠.
이번 ddos의 핵심은 기형적인 sw유통경로에 있습니다. 애시당초 포탈등의 인증된 대형 컨텐츠 회사의 컨텐츠나 정품sw이용자들이었다면 생기지 않았을 문제라는 겁니다.

도대체 핵심만 살짝 비켜가는 정부는 일부러 그러는지 궁금하기만 합니다. Active x란 기술은 유저에게 어플리케이션을 의심없이 실행하게 만드는 기술중에 하나입니다. Ax설치가 사실 어플리케이션 설치인줄 모르는 사람들이 대다수입니다. Ax를 싫어하는 이들도 Flash등의 플러그인기술과 동일라인으로 생각할 정도니까요.

**5. 중요한것은 공인된 SW설치와 정상적인 컨텐츠 유통경로**
공인된 sw설치, 이것 하나만 지켜져도 많은 보안 문제는 최소화됩니다. 또한 영화나 음악을 때려잡으면서 수많은 sw들은 그 대상이 되지 않은것도 의아합니다. 그렇기 때문에 유저들은 p2p에서 음악 영화는 못구해도 더 위험한 sw는 맘대로 내려받고 있는거죠. 국내의 Free ware에 대한 낮은 인식, 그러면서도 유료sw도 재미도 못보고 중국과 비교될정도의 나쁜 sw시장이 바로 한국입니다.
이번 ddos공격으로 인해 한국 sw산업의 현실을 좀 직시했으면 하고 바랍니다. DDos의 최선은 정말 좀비PC법입니까?  그게 정말 최선인가요 ?

http://opencast.naver.com/FS565

[재생하기 바로보기가 지원되지 않는 파일입니다. 클릭하여 팝업창으로 플레이 해보세요.](http://blog.naver.com/EmbedHttpView.naver?blogId=fstory97&logNo=70104865677&hashKey=08985865dc8aa4f26d48369c234f2e8b)****http://mixsh.com/media/53844
http://mixsh.com/media/53844**

[****](http://www.hanrss.com/add_sub.qst?url=http%3A%2F%2Fblog.rss.naver.com%2Ffstory97.xml)**  {{IMG:1}}

http://search.allblog.net/?keyword=%EC%88%B2%EC%86%8D%EC%96%98%EA%B8%B0&view=issue&type=100

{{IMG:2}}

http://www.blogkorea.net/bnmsvc/user_bloglist.do?userNum=548520&amp;rssSeq=575708&amp;gubun=A&amp;pages=1

{{IMG:3}}

http://mixsh.com/media/53844

**
http://mixsh.com/media/53844**

<!-- en -->
**1. Zombie PC Law?**
After the DDOS attack, I heard talk of a so-called "Zombie PC Law" being discussed. While I certainly understand that a certain level of client security must be guaranteed, a law that enforces this doesn't sit well with me. Why is such an agile government tormenting service providers by using IE6 in national institutions?
When a security incident occurs, various countermeasures can be taken depending on the flow of the attack. For DDOS, from the perspective of the victim or at the network level, zombie PCs could be an alternative. And the process of creating zombie PCs as well.

However, the method proposed by the government is one of the most costly and inefficient. Of course, from the perspective of government agencies, they might think they don't need to buy special equipment and the probability of attack decreases, but if multiple layers of security devices are constantly installed on clients, can the processing cost used by so many clients be calculated? I might understand if it were at the user-side gateway or router level, but it's an excessive burden on user PCs that already have a lot running.

**2. Is Antivirus a Magic Wand for Security?**
Furthermore, how much more complacent will a law that simply says "just install antivirus" make those whose security level is already low because they haven't even installed antivirus? Does it mean that if you just install antivirus, you can visit unsafe sites, install unverified programs, and not bother with updates?
Security is not a magic wand for users' antivirus. Of course, companies selling antivirus might talk about it like a magic wand, but that's just a slogan that neither the seller nor the buyer truly believes.
I wonder if they even know how vulnerable antivirus is to DDOS. Antivirus only adds a file pattern after a virus is recognized. The probability of catching DDOS bots that lie dormant and attack simultaneously is not very high. Of course, they sometimes catch them purely by pattern, but at this point, the reliability of the antivirus is always questioned, and performance is also worse. So, a trade-off between performance and security always occurs. However, that trade-off is decided by the user. The safest security is to turn off your PC. Would you accept that?

**3. Why Ignore P2P, Which Is Illegal by Its Very Nature?**
In fact, if we delve into the fundamental problem of DDOS, the issue goes beyond users who haven't installed antivirus; it's the P2P sites, which are the root cause.
Why do users access these P2P sites? Usually, for two reasons: to download videos or to install illegal software. Of course, they might have downloaded legally. But that possibility is extremely low. Naver and Daum also offer video download services, so why would they seek out those obscure sites to download? Because of free download coupons? Then what is the business model for those companies if they allow free downloads?

**4. The Core Problem: Unverified S/W Distribution Channels, Including ActiveX**
When comparing Apple and Google, Apple's apps are considered relatively safe. The reason is that there's only one app download channel, so only that channel needs to be monitored. Fundamentally, saying it's safe because of the sandbox is a secondary technical issue, and vulnerabilities can exist in Apple just as much. More importantly, a system that can manage these vulnerabilities through a single point is crucial.
Google also doesn't have major problems if users only access certified markets.
However, the constant problem is jailbroken iPhones and running unverified apps obtained through cafes, etc., on Android. And that very act is happening on PCs through P2P.
And above all, this act is illegal. Malicious software is created, uploaded to P2P, and if given a suggestive title, it quickly racks up dozens of downloads. Of course, it might be deleted later, but P2P sites almost intentionally perform post-verification. This actually means they are only pretending to monitor.
The core of this DDOS lies in the abnormal software distribution channels. This problem would not have occurred in the first place if users had been using content from certified major content companies like portals or legitimate software.

I'm just curious if the government is intentionally avoiding the core issue. ActiveX is one of the technologies that makes users run applications without suspicion. Most people don't realize that installing ActiveX is actually installing an application. Even those who dislike ActiveX tend to think of it in the same vein as plugin technologies like Flash.

**5. What's Important Is Certified S/W Installation and Legitimate Content Distribution Channels**
Certified software installation – if only this one thing is adhered to, many security problems would be minimized. It's also puzzling that while movies and music are cracked down upon, numerous software programs are not targeted. That's why users can't get music and movies from P2P, but they can freely download more dangerous software. Low awareness of freeware in Korea, coupled with a poor software market where even paid software doesn't see much success, comparable to China – that's Korea.
I hope this DDOS attack makes us confront the reality of the Korean software industry. Is the Zombie PC Law truly the best solution for DDOS? Is that really the best?

http://opencast.naver.com/FS565

[재생하기 바로보기가 지원되지 않는 파일입니다. 클릭하여 팝업창으로 플레이 해보세요.](http://blog.naver.com/EmbedHttpView.naver?blogId=fstory97&logNo=70104865677&hashKey=08985865dc8aa4f26d48369c234f2e8b)****http://mixsh.com/media/53844
http://mixsh.com/media/53844**

[****](http://www.hanrss.com/add_sub.qst?url=http%3A%2F%2Fblog.rss.naver.com%2Ffstory97.xml)** {{IMG:1}}

http://search.allblog.net/?keyword=%EC%88%B2%EC%86%8D%EC%96%98%EA%B8%B0&view=issue&type=100

 {{IMG:2}}

http://www.blogkorea.net/bnmsvc/user_bloglist.do?userNum=548520&amp;rssSeq=575708&amp;gubun=A&amp;pages=1

 {{IMG:3}}

http://mixsh.com/media/53844

**
http://mixsh.com/media/53844**