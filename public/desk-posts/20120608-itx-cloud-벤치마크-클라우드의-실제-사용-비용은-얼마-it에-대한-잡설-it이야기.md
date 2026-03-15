---
date: "2012-06-08"
titleKo: "[ITX Cloud 벤치마크] 클라우드의 실제 사용 비용은 얼마 ? IT에 대한 잡설 / IT이야기"
titleEn: "[ITX Cloud Benchmark] What is the"
category: it
tags:
  - IT에 대한 잡설
images:
  - /desk/20120608-itx-cloud-벤치마크-클라우드의-실제-사용-비용은-얼마-it에-대한-잡설-it이야기/01.webp
  - /desk/20120608-itx-cloud-벤치마크-클라우드의-실제-사용-비용은-얼마-it에-대한-잡설-it이야기/02.webp
  - /desk/20120608-itx-cloud-벤치마크-클라우드의-실제-사용-비용은-얼마-it에-대한-잡설-it이야기/03.webp
  - /desk/20120608-itx-cloud-벤치마크-클라우드의-실제-사용-비용은-얼마-it에-대한-잡설-it이야기/04.webp
  - /desk/20120608-itx-cloud-벤치마크-클라우드의-실제-사용-비용은-얼마-it에-대한-잡설-it이야기/05.webp
  - /desk/20120608-itx-cloud-벤치마크-클라우드의-실제-사용-비용은-얼마-it에-대한-잡설-it이야기/06.webp
  - /desk/20120608-itx-cloud-벤치마크-클라우드의-실제-사용-비용은-얼마-it에-대한-잡설-it이야기/07.webp
  - /desk/20120608-itx-cloud-벤치마크-클라우드의-실제-사용-비용은-얼마-it에-대한-잡설-it이야기/08.webp
thumbnail: /desk/20120608-itx-cloud-벤치마크-클라우드의-실제-사용-비용은-얼마-it에-대한-잡설-it이야기/01.webp
sourceCategoryNo: "41"
sourceCategory: IT에 대한 잡설
externalUrl: https://blog.naver.com/fstory97/70139836612
---

<!-- ko -->
어제에 이어 본격적으로 ITX Cloud에 관한 분석을 하겠습니다.

클라우드를 쓰는 이유는 뭐니뭐니해도 비용이니, 그 비용에 대해 말씀드릴까 합니다. 비교 대상은 KT Cloud biz입니다.
**1. 최저 사양 서버** 최저로 시작할 수 있는 비용이 얼마인지 부터 말씀드리겠습니다.

| 분류 | ITX | KT |
| --- | --- | --- |
| CPU | 1core | 1core |
| Memory | 0.5gb | 1gb |
| Hdd | 60gb | 100gb |
| Network | 600gb/월 (free) | 100gb/월 (free) |
| 비용 | 35,640원 | 33,000원 |

일단 최저 사양을 기준으로 하면 2,640원 정도 ITX의 비용이 더 많이 나갑니다. 더군다나 server사양도 KT가 앞서는 것으로 나옵니다. 그러나, 중요한것은 네트워크 비용입니다. 월에 100gb를 초과시 1gb당 99원씩 KT는 초과요금을 내야 합니다. 월 100gb정도는 일 3.3gb네요. 1페이지가 256kb, 1명의 방문자가 4 페이지를 본고, 약 1mb를 소비한다고 가정하면 일 3,400명 정도의 방문자를 소화할 수 있을 수준입니다. 1명당 1mb를 사용한다고 가정했을때 이므로, 이미지를 많이 사용하는 쇼핑몰인 경우, 훨씬 더 적은 수의 방문자를 처리 가능하며 나머지는 초과비용을 물어야 됩니다. 일 방문자 1000명 이하의 개인 블로그 정도라면 KT가 적당하지만, 그 이상을 노린다면, ITX쪽이 좋은 선택이라는 생각이 드는 부분입니다.
**2. 인기사양 기준** ITX에서 권장하는 인기사양을 기준으로 동일 가격을 KT로 환산해보겠습니다.

| 분류 | ITX | KT |
| --- | --- | --- |
| CPU | 2core | 2core |
| Memory | 2gb | 2gb |
| Hdd | 60gb + (40gb : 6,600원) | 100gb |
| Network | 600gb | 100gb + (500gb: 49,500원) |
| 비용 | 84,480원 | 115,500원 |

ITX를 KT와 동일한 HW로 업그레이드하고, KT는 ITX에서 제공하는 무료 데이터 용량까지 사용한다고 가정했습니다. ITX가 월 31,020원이 이득이네요. 저는 네이버 블로거이다 보니 트래픽 걱정을 안하고 있습니다. 하지만, 텍스트위주의 블로그를 운영하는, 모 유명 블로거님이 언급해주신 내용은 일 3만명 방문에 하루 20gb를 사용한다고 합니다. 따라서 해당 블로그를 기준으로 ITX에서 제공하는 무료 트래픽의 600gb는 추가 요금을 물지 않을 수준이라고 할 수 있습니다.
**3. KT의 강점은 싼 네트워크 비용, 그러나 13.34 tb까지는 ITX가 유리**
KT의 요금은 10TB까지는 99원 20TB까지 구간은 88원을 부가합니다. 따라서 일률적인 ITX보다는 대용량 트래픽에서는 유리하다고 할 수 있습니다.  600gb의 무료 요금을 상쇄할 수 있는 구간은 10~20tb사이의 구간인데요. 정확히 계산해보니, 13.34 tb로 네트워크 비용을 127만 4천원을 물면, 이 이상부터는 KT가 싸다고 할 수 있습니다. 특히 30tb부터는 정액제를 마련하고 있는 KT가 훨씬 유리하다고 할 수 있습니다.  그러나, 위에서 제시한 최초의 계산식대로 13tb를 넘길려면 일 방문자 44만명입니다. 주부파워 블로거 였던 문성실님이 일 5만이었죠. 역시 와이프로거와 IT블로거는 비할바가 아닌 수치..  월 13tb를 넘길 자신이 없는 서비스라면, ITX가 유리하다는 결론이 나겠네요.
**4. 그외에 무료 제공하는 부가 서비스** KT대비 경쟁력 있는것은 스냅샷은 3개까지 무료, KT는 gb당 120원, 로드 밸런스는 22,000원(정액?)이라고 밝히고 있는데 반해, KT는 240,000원으로 단위가 하나 다릅니다. 아무래도 성능이나 파워면에서는 KT가 앞서겠지만, 네이버 정도의 성공을 염두해 두지 않는 이상, ITX가 비용면에서는 훨씬 괜찮다고 할 수 있겠습니다.
**5. 요금계산기**ITX는 로그인을 하지않고도 요금을 계산해볼 수 있습니다.[http://cloud.hyosungitx.com/itxcloud/calculate/calculate.itxcloud](http://cloud.hyosungitx.com/itxcloud/calculate/calculate.itxcloud)
제 설명보다는 한 번 해보는것도 괜찮겠네요.
**6. 사용 스냅샷** 사용 후기를 굳이 올려야 될 필요가 있겠냐 싶겠지만, 꼭 올려달라는 부탁에 몇개의 스크린샷을 올립니다.
{{IMG:1}} 자세한 설명은 생략하겠습니다. 클라우드가 아무리 쉽다지만, 기본적인것은 공부하는게 웹서버 관리자로서의 기본 소양입니다. {{IMG:2}}
[ 콘솔 메인 화면입니다. 1주일 무료 사용 가능하다는 메시지가 보이네요. 서버 추가 버튼 누르면 추가가 가능합니다. ]

{{IMG:3}}
[ 제가 테스트로 셋팅해본 서버, 윈도우와 Linux모두 셋팅 가능합니다.  ]

{{IMG:4}}
[ 셋팅 가능한 기본 서버, Linux의 CentOS가 생소해보이는 분도 계실지 모르겠습니다. 국내 유명 포탈도 이거 씁니다. 믿고 쓰시길, 공짜입니다. ]

{{IMG:5}}
[ 공개 서버 이미지는 아직 하나 밖에 없군요. 자신이 만든 서버를 올릴수 있습니다. XAMPP는 아파치, My SQL, Php, 펄을 미리 깔아 둔 서버입니다. 귀찮으신 분들은 이걸 깔아도.. ]
[재생하기 바로보기가 지원되지 않는 파일입니다. 클릭하여 팝업창으로 플레이 해보세요.](http://blog.naver.com/EmbedHttpView.naver?blogId=fstory97&logNo=70139836612&hashKey=6b8f14eccb2e1ea522ddf9d5021a9ac9)
**********http://www.hanrss.com/add_sub.qst?url=http%3A%2F%2Fblog.rss.naver.com%2Ffstory97.xml**** {{IMG:6}}

http://search.allblog.net/?keyword=%EC%88%B2%EC%86%8D%EC%96%98%EA%B8%B0&view=issue&type=100

{{IMG:7}}

http://www.blogkorea.net/bnmsvc/user_bloglist.do?userNum=548520&amp;rssSeq=575708&amp;gubun=A&amp;pages=1

{{IMG:8}}

http://mixsh.com/media/53844

**********

<!-- en -->
Following up on yesterday, I will now delve into an in-depth analysis of ITX Cloud. The primary reason for using cloud services is, without a doubt, cost, so I'd like to discuss that. The comparison will be with KT Cloud biz.
**1. Minimum Specification Server**
Let's start by discussing the minimum cost to get started.

| Category | ITX | KT |
| --- | --- | --- |
| CPU | 1core | 1core |
| Memory | 0.5gb | 1gb |
| Hdd | 60gb | 100gb |
| Network | 600gb/month (free) | 100gb/month (free) |
| Cost | 35,640 KRW | 33,000 KRW |

Based on the minimum specifications, ITX costs about 2,640 KRW more. Furthermore, KT's server specifications appear to be superior. However, the crucial factor is network cost. If you exceed 100GB per month, KT charges an additional 99 KRW per GB. 100GB per month is roughly 3.3GB per day. Assuming one page is 256KB, and one visitor views 4 pages, consuming about 1MB, this level can handle approximately 3,400 visitors per day. Since this is based on 1MB per visitor, for image-heavy shopping malls, it would handle far fewer visitors, and the rest would incur excess charges. If you run a personal blog with fewer than 1,000 daily visitors, KT might be suitable, but if you aim for more, ITX seems like a better choice.
**2. Based on Popular Specifications**
Based on the popular specifications recommended by ITX, let's convert the equivalent price for KT.

| Category | ITX | KT |
| --- | --- | --- |
| CPU | 2core | 2core |
| Memory | 2gb | 2gb |
| Hdd | 60gb + (40gb : 6,600 KRW) | 100gb |
| Network | 600gb | 100gb + (500gb: 49,500 KRW) |
| Cost | 84,480 KRW | 115,500 KRW |

We assumed ITX is upgraded to the same hardware as KT, and KT uses up to the free data allowance provided by ITX. ITX saves 31,020 KRW per month. As a Naver blogger, I don't worry about traffic. However, a famous blogger who runs a text-heavy blog mentioned using 20GB per day with 30,000 daily visitors. Therefore, based on that blog, ITX's 600GB of free traffic would be sufficient to avoid additional charges.
**3. KT's Strength: Low Network Cost, but ITX is advantageous up to 13.34 TB**
KT's rates are 99 KRW per GB up to 10TB, and 88 KRW per GB for the 10-20TB range. Therefore, it can be said that KT is advantageous for large-volume traffic compared to the flat-rate ITX. The point at which KT's free 600GB is offset is in the 10-20TB range. After precise calculation, if you pay 1,274,000 KRW for network costs at 13.34 TB, KT becomes cheaper beyond that point. Especially from 30TB onwards, KT, which offers a fixed-rate plan, is much more advantageous. However, to exceed 13TB as per the initial calculation above, you would need 440,000 daily visitors. Moon Sung-sil, a popular housewife blogger, had 50,000 daily visitors. The numbers for a 'wifelogger' and an IT blogger are incomparable... If your service isn't confident in exceeding 13TB per month, then ITX would be the more favorable choice.
**4. Other Free Additional Services**
Other competitive advantages compared to KT include: snapshots are free up to 3 (KT charges 120 KRW per GB), and load balancer is stated as 22,000 KRW (flat rate?). In contrast, KT's load balancer is 240,000 KRW, a whole order of magnitude different. While KT might be superior in terms of performance and power, unless you're aiming for success on the scale of Naver, ITX can be said to be much better in terms of cost.
**5. Fee Calculator**
ITX allows you to calculate fees without logging in.
[http://cloud.hyosungitx.com/itxcloud/calculate/calculate.itxcloud](http://cloud.hyosungitx.com/itxcloud/calculate/calculate.itxcloud)
It might be better to try it yourself than to rely on my explanation.
**6. Usage Snapshots**
You might wonder if there's a need to post a usage review, but at the request to do so, I'm uploading a few screenshots.
{{IMG:1}}
I will omit detailed explanations. While the cloud may seem easy, studying the basics is fundamental for any web server administrator.
{{IMG:2}}
[ This is the main console screen. You can see a message indicating 1 week of free usage. You can add a server by clicking the 'Add Server' button. ]

{{IMG:3}}
[ The server I set up for testing; both Windows and Linux can be configured. ]

{{IMG:4}}
[ Basic servers available for setup. Some of you might find CentOS for Linux unfamiliar. Major Korean portals use it too. Trust it and use it, it's free. ]

{{IMG:5}}
[ There's only one public server image available so far. You can upload your own created server. XAMPP is a server with Apache, MySQL, PHP, and Perl pre-installed. For those who find it troublesome, you can install this... ]
[This file does not support direct playback. Click to play in a pop-up window.](http://blog.naver.com/EmbedHttpView.naver?blogId=fstory97&logNo=70139836612&hashKey=6b8f14eccb2e1ea522ddf9d5021a9ac9)
**********http://www.hanrss.com/add_sub.qst?url=http%3A%2F%2Fblog.rss.naver.com%2Ffstory97.xml**** {{IMG:6}}

http://search.allblog.net/?keyword=%EC%88%B2%EC%86%8D%EC%96%98%EA%B8%B0&view=issue&type=100

{{IMG:7}}

http://www.blogkorea.net/bnmsvc/user_bloglist.do?userNum=548520&amp;rssSeq=575708&amp;gubun=A&amp;pages=1

{{IMG:8}}

http://mixsh.com/media/53844

**********