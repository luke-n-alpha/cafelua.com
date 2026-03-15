---
date: "2014-02-21"
titleKo: "[제안] 정부표준 한국형 안드로이드 OS(AOSP) 개발 IT에 대한 잡설 / IT이야기"
titleEn: "Proposal: Developing a Government-Standard Korean Android OS ("
category: it
tags:
  - IT에 대한 잡설
images:
  - /desk/20140221-제안-정부표준-한국형-안드로이드-osaosp-개발-it에-대한-잡설-it이야기/01.webp
thumbnail: /desk/20140221-제안-정부표준-한국형-안드로이드-osaosp-개발-it에-대한-잡설-it이야기/01.webp
sourceCategoryNo: "41"
sourceCategory: IT에 대한 잡설
externalUrl: https://blog.naver.com/fstory97/70185371280
---

<!-- ko -->
**1. 대한민국 최대 소프트웨어 수요처(정부)의 불법 소프트웨어** 대한민국에서 가장 큰 소프트웨어 납품처는 어디일까요? 삼성전자가 대표 기업이라고는 하지만, 대한민국 정부에 비할바는 아닐 겁니다. 최근 들은 모 라디오 방송에서 한글과 컴퓨터의 역사 이야기를 하면서 정부에 납품된 컴퓨터 댓수와 정품 아래한글의 카피본 수의 이야기를 들었는데, 깜짝 놀랄만한 수치로 정품 사용율이 극히 낮았습니다. 소프트웨어 제값 주기 운동을 한다면, 가장 기본은 아마도 정부의 기기들의 불법소프트웨어 문제 부터 시작해야 할 것입니다. 아직까지도 그런 상황인지는 모르겠지만, 제가 군생활 하던 시절에도 중대에 있는 컴퓨터는 외부에서 들여온 중고 컴퓨터에 불법 윈도우즈와 스타크래프트가 깔려 있었습니다. 해당 컴퓨터는 업무용이 아니었기 때문에, 문제 없다고 여길지도 모르겠으나, USB를 통한 파일 이동과 인터넷을 누가 연결하지 말라는 법은 없었습니다. 불법 소프트웨어는 보안과도 직결되는 문제인데 위험한 운영은 여전히 상당수 이어지리라고 생각됩니다.**
**** 2. 결국은 정품 써야하는 것은 당연, 그런데 앞으로의 OS전략은 검토 필요** 그렇다면, 이를 전부 정품 소프트웨어로 변경한다고 했을 때 가장 큰 이익을 보는 회사는 어디일까요? 정부의 표준 워드프로세서인 한컴오피스도 있겠지만, 뭐니뭐니해도 윈도우즈 OS를 판매하고 있는 마이크로 소프트일것으로 예상됩니다.  분명 정품 소프트웨어를 정부가 이용해야 하는것은 해외기업의 제품이라고 차별하자는 것은 아니지만, 요즘 시점에서 윈도우즈 플랫폼의 확대 구매가 얼마나 실효성이 있고, 미래성이 있는지 하는 부분에 대해서는 의문이 듭니다. 왜냐하면 현재 OS시장은 큰 변화를 앞두고 있고, 이미 상당수가 지각변동이 일어났기 때문입니다. **3. 한국형 안드로이드 OS(AOSP forked android)개발을 제안합니다.** 그 선두에 있는 것은 바로 구글의 안드로이드와 크롬OS입니다. 안드로이드의 경우 오픈소스기반의 소스라는 것이 특징이고, 크롬OS는 웹OS라는 것이 특징입니다. 그리고 중요한 것은 두 OS 모두 무료라는 점이죠. 어쩌면 지금 이 시점이 아주 낮은 비용으로 한국형 데스크탑 OS를 만들 수 있는 절호의 기회가 아닐까 하는 생각이 듭니다.
구글이 없는 한국형 안드로이드 OS를 정부가 직접 만들어보면 어떨까? 하는 생각이 들었는데 그 이유는 아래와 같습니다.
- 안드로이드는 무료입니다- 안드로이드용 소프트웨어는 글로벌 경쟁력이 있습니다.- 안드로이드 기반의 데스크탑은 하드웨어의 비용이 저렴합니다. - 안드로이드는 웹앱을 만들기에도 적당하며 웹표준을 지원합니다.- 한국형 안드로이드로 인한 글로벌 OS기업으로 부터 기술 독립이 가능합니다.- 지금 당장, OTG에 키보드, 마우스 꽃고 간단한 워드프로세서를 포함한 오피스환경은 다 사용가능합니다.  안드로이드는 앞서 말씀드렸듯이 오픈 소스입니다. 때문에 이를 활용하여 구글 서비스가 없는 안드로이드를 만들어도 무방합니다. 실제로 이러한 전략이 아마존의 전략인데, 자체적으로 볼륨만 충분하다면 그것 자체로 훌륭한 에코가 됩니다. 한국 정부 정도의 볼륨이라면 어떨까요? 윈도우즈 의존적인 한국 정부의 플랫폼을 무료로 전환할 수 있습니다. 거기다가 소스까지 가지고 있으므로 더 하단까지 손댈 수 있으며, 심지어는 각 부처에 특화된 기기를 만드는 것도 가능합니다. 또한 정부 부처에 소프트웨어를 납품함과 동시에 그 기술은 전세계의 안드로이드 기기들을 동시에 노릴 수 있습니다.**
****4. 개발과 동시에 하드웨어 납품과 사용처도 확보하십쇼.** 당연한 얘기지만 안드로이드가 확산되었던건 삼성 스마트폰이 있었기 때문입니다. 한국형 안드로이드OS가 개발된다면, 이를 정부 표준OS로 규정하고, 오피스 환경과 각종 정보화기기, 그리고 정부에 납품하는 특화된 기기의 임베디드 OS까지 일정 부분 소비처를 확보해야 합니다. 소비되야 OS는 발전하고, 앱도 늘어나기 때문이며, 정부 정도의 사업 규모면 그 규모는 사실 충분하기도 합니다.**
****5. 하지만 외주는 주지 마세요. **** 정부가 직접! 사명감을 가지고 자체적으로 기술 내제화를 해서 플랫폼 거버넌스를 해야 합니다.** 대신 외주를 주거나 제안서를 던지는 방식으로 진행해서는 안된다고 봅니다. 전문가를 확보하고, 제대로된 인력과 조직을 꾸려 한국정부의 정보화플랫폼을 주도할 수 있도록 해야 합니다. 이 조직은 꾸준히 OS는 최신 기술을 받아들여 업그레이드해야 하며, 해당 OS는 소비자와 사업자들의 의견을 들어야 하고, 해당 기술은 외부에 공개하여 안정화되고 구글이나 MS같은 글로벌 기업의 독주를 걱정 안해도 되는 OS를 보급해야 합니다. 외주를 주게되면 결국 유지보수를 하는 기업이 바뀔때마다 OS는 망가지기 시작할것이고, 이에 대한 사명감이나 전문성 또한 확보하기 어려울겁니다.**
****6. 혹, 애국심 때문에 타이젠은 고려하지 마십쇼.** 여기에 혹시 타이젠을 고려한다면 그것은 말리고 싶습니다. 타이젠은 현재 글로벌 경쟁력을 확보하지 못했습니다. 삼성전자의 모험적인 프로젝트와 대한민국 정부가 같이 운명을 걸어가며 리스크를 질 필요는 없습니다. 구글 서비스가 없는 안드로이드는 이미 충분히 독립적이기 때문이고, 그 규모와 호환성면에서 충분한 경쟁력이 있기 때문입니다. 타이젠은 아직 태블릿도 없으므로 데스크탑용으로는 부적합합니다. **
****7. 물론, 한번에 윈도우즈를 버리자라는 얘기도, ****xp와 IE6를 두라는 얘기는 아닙니다.** 윈도우즈는 어떻게? 윈도우즈를 한번에 갈아엎어버리자고 주장하는 것은 아닙니다. 추가 보급을 고려할 필요가 없다는 것 뿐입니다. 물론 한국형 안드로이드가 만들어지기 전까지는 윈도우의 최신 업데이트는 당연히 고려되어야 한다고 봅니다. 지금처럼 xp의존적이고 IE6의존적인 환경은 사실 매우 위험합니다.  최근 혁신의 승부사의 한글과 컴퓨터의 역사를 들으면서 느낀 가장 큰 기술종속의 이유는 바로 OS 종속이었습니다. 그리고, 현재 그 대안이 오히려 MS의 경쟁상대이자 글로벌 대기업인 구글에서 나왔으며, 이는 오히려 구글을 위협하고, 구글의 독주를 막는 수단이 되어가고 있습니다. 최근 모토로라를 두고 삼성전자와 구글이 싸우려는것 아니냐라는 글도 보이는데, 전 그렇게 생각하지 않습니다. 구글입장에서는 삼성전자의 사업 영역은 관심이 없는 영역입니다. 겨우 스마트폰 하나만 1등하고 있는 삼성은 스마트폰이 기울면 끝입니다.  그리고 기기 독립적인 인터넷 서비스나, 안드로이드와 같은 OS, 클라우드 서비스들은 각종 IT산업군의 판도가 이리저리 흔들려도 그 영역은 모습만 바꾼채로 꾸준히 성장 할 것입니다. 그리고, 대한민국정부도 이에 대비하여 맞는 IT전략을 필요로 한다고 봅니다. 그저 소프트웨어나 정보화기기를 조달청에서 조달받아 소모하는 기기가 아닌, 정부자체에 있는 지식과 정보를 유통하고 발전시키는 전략을 구상할 때라고 봅니다. **참고 하면 좋을 포스팅 :**[구글 서비스 없는 안드로이드 연합을 만들자](http://platformadvisory.kr/archives/1074). (플랫폼전문가그룹, 황병선 대표)[http://platformadvisory.kr/archives/1074](http://platformadvisory.kr/archives/1074)
안드로이드의 보이지 않는 적, AOSP (다음 커뮤니케이션즈, 모비즌)[http://www.mobizen.pe.kr/1403](http://www.mobizen.pe.kr/1403)  {{IMG:1}}

http://section.blog.naver.com/connect/PopConnectBuddyAddForm.nhn?blogId=fstory97

**[숲속얘기의 조용한 카페 Email로 받아보기](http://feedburner.google.com/fb/a/mailverify?uri=blog/eEMp&loc=en_US)** **http://feeds.feedburner.com/blog/eEMp**

<!-- en -->
**1. Illegal Software of Korea's Largest Software Consumer (Government)**
Where is the biggest software client in South Korea? While Samsung Electronics is a representative company, it cannot compare to the South Korean government. I recently heard a radio broadcast discussing the history of Hancom (Hangul and Computer), and they talked about the number of computers supplied to the government versus the number of legitimate copies of Hangul Word Processor. The figures were astonishingly low for legitimate usage. If we are to promote "paying the right price for software," the most fundamental step should probably start with the issue of illegal software on government devices. I don't know if the situation is still the same, but even when I was in the military, the computers in my company were used computers brought in from outside, installed with illegal Windows and StarCraft. One might think it's not a problem because these computers weren't for official work, but there was no law preventing file transfers via USB or connecting to the internet. Illegal software is directly linked to security issues, and I believe such risky operations continue to be widespread.

**2. Naturally, Using Genuine Software is a Must, But Future OS Strategy Needs Review**
If all this were to be changed to genuine software, which company would benefit the most? While there's Hancom Office, the government's standard word processor, it's likely Microsoft, which sells Windows OS, that would benefit the most. Clearly, the government should use genuine software, and this isn't about discriminating against foreign products. However, at this point, I question the effectiveness and future prospects of expanding Windows platform purchases. This is because the current OS market is on the verge of significant change, and many tectonic shifts have already occurred.

**3. I Propose the Development of a Korean Android OS (AOSP forked Android).**
At the forefront of this change are Google's Android and Chrome OS. Android is characterized by its open-source foundation, and Chrome OS by being a web OS. And importantly, both OSes are free. Perhaps this is the perfect time to create a Korean desktop OS at a very low cost.
I thought, what if the government directly developed a Korean Android OS without Google services? The reasons are as follows:
- Android is free.
- Software for Android has global competitiveness.
- Android-based desktops have low hardware costs.
- Android is suitable for creating web apps and supports web standards.
- A Korean Android OS would enable technological independence from global OS companies.
- Right now, with a keyboard and mouse connected via OTG, a basic office environment including a word processor is fully usable.
As I mentioned, Android is open source. Therefore, it's perfectly fine to use it to create an Android without Google services. This is actually Amazon's strategy; if there's enough volume, it becomes an excellent ecosystem in itself. What if the Korean government had that kind of volume? It could transition the Windows-dependent platform of the Korean government to a free one. Furthermore, since it would possess the source code, it could delve deeper, even creating devices specialized for each ministry. Also, by supplying software to government ministries, that technology could simultaneously target Android devices worldwide.

**4. Secure Hardware Supply and Usage Simultaneously with Development.**
It's obvious that Android spread because of Samsung smartphones. If a Korean Android OS is developed, it should be designated as the government's standard OS, and a certain portion of its consumption should be secured for office environments, various IT devices, and even embedded OS for specialized devices supplied to the government. An OS evolves and apps grow only when it's consumed, and the scale of a government project is certainly sufficient.

**5. But Don't Outsource It.**
The government must directly! Internalize the technology with a sense of mission and lead platform governance. I believe this should not be done by outsourcing or by simply issuing proposals. Experts must be secured, and a proper workforce and organization must be established to lead the Korean government's IT platform. This organization must continuously upgrade the OS by adopting the latest technologies, listen to the opinions of consumers and businesses, and release the technology publicly to stabilize it and disseminate an OS that doesn't require worrying about the dominance of global companies like Google or MS. If outsourced, the OS will eventually start to break down every time the maintenance company changes, and it will be difficult to secure a sense of mission or expertise for it.

**6. Please Do Not Consider Tizen Out of Patriotism.**
If Tizen is considered here, I would advise against it. Tizen has not secured global competitiveness. The Korean government does not need to take risks by tying its fate to Samsung Electronics' adventurous project. An Android without Google services is already sufficiently independent, and it has enough competitiveness in terms of scale and compatibility. Tizen doesn't even have tablets yet, making it unsuitable for desktop use.

**7. Of Course, This Is Not a Call to Abandon Windows All at Once, Nor to Keep XP and IE6.**
What about Windows? I am not advocating for a complete overhaul of Windows all at once. It's simply that there's no need to consider additional deployment. Of course, until a Korean Android is created, the latest Windows updates should definitely be considered. The current XP-dependent and IE6-dependent environment is actually very dangerous. Listening to the history of Hancom, a "game-changer of innovation," recently, I realized that the biggest reason for technological dependence was OS dependence. And currently, the alternative has emerged from Google, a competitor and global giant to MS, which is ironically threatening Google and becoming a means to prevent Google's monopoly. Recently, I've seen articles suggesting that Samsung Electronics and Google might be fighting over Motorola, but I don't think so. From Google's perspective, Samsung Electronics' business area is not of interest. Samsung, which is only number one in smartphones, will be finished if smartphones decline. And device-independent internet services, OSes like Android, and cloud services will continue to grow, merely changing their form, even if the landscape of various IT industries fluctuates. I believe the South Korean government also needs an appropriate IT strategy to prepare for this. It's time to devise a strategy to distribute and develop the knowledge and information within the government itself, rather than just procuring and consuming software or IT devices through the Public Procurement Service.

**Recommended Posts:**
[Let's create an Android alliance without Google services](http://platformadvisory.kr/archives/1074). (Platform Expert Group, CEO Hwang Byung-sun)
[http://platformadvisory.kr/archives/1074](http://platformadvisory.kr/archives/1074)
Android's Invisible Enemy, AOSP (Daum Communications, Mobizen)
[http://www.mobizen.pe.kr/1403](http://www.mobizen.pe.kr/1403)

{{IMG:1}}

http://section.blog.naver.com/connect/PopConnectBuddyAddForm.nhn?blogId=fstory97

**[Receive "Forest Story's Quiet Cafe" by Email](http://feedburner.google.com/fb/a/mailverify?uri=blog/eEMp&loc=en_US)**
**http://feeds.feedburner.com/blog/eEMp**