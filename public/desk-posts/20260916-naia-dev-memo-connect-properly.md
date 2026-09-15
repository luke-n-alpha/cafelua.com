---
date: "2026-09-16"
titleKo: "나이아 개발 메모, 많이 만드는 것보다, 제대로 연결하기"
titleEn: "Naia Development Notes: Connecting Things Properly, Rather Than Building More"
category: ai
tags: ["개발메모", "naia", "alpha", "adk", "ai-singing"]
images: []
thumbnail: /desk/20260916-naia-dev-memo-connect-properly/hero.webp
---
<!-- ko -->
![늦은 밤 카페루아에서 개발 노트북 곁에 잠든 루크를 위해 노래하는 알파](/desk/20260916-naia-dev-memo-connect-properly/hero.webp)
*늦은 밤 카페루아에서 개발 노트북 곁에 잠든 루크를 위해 노래하는 알파*

아직 적극적으로 홍보하고 있지는 않지만, 나이아가 윈도우 스토어에 올라갔습니다. 링크는 공개하지 않겠습니다. 왜냐하면 [지난 밋업](https://www.naia.land/ko/blog/20260901-naia-second-meetup)에서 이야기드렸듯이, 이제 막 부품들이 갖춰지고 삐거덕거리며 돌아가기 시작했거든요.

첫 번째 밋업에서 밝혔듯이, 아톰과 제가 만들고 싶은 알파의 뼈대를 위해 여러 아키텍처를 고민했습니다. 그 구조 변경에 시간이 꽤 걸렸고, 나이아는 B2C스럽게 목소리와 비디오 아바타부터 시작했지만, 창업하고 나서는 실상 B2B 기반으로 다른 기업과 조직의 AI 문제를 해결하는 데 투입했습니다.

그러다 보니 나이아는 이 두 가지의 결과물로 이루어져 있습니다. B2C스러운 표면적인 기술과 B2B스러운 하네스, 그리고 개발을 위한 워크스페이스로 되어 있습니다. 두 개가 별개는 아닙니다. B2B스러운 하네스 개발을 기반으로 B2C에 적용된 기술과 서비스를 개발했으니까요. 반대로 그만큼 개발만 했지, B2C에 핵심적인 사용자에 대한 고민은 부족했습니다.

특히 지난주 IR에서 “지표가 없다”라는 지적을 받으면서, 지표를 만들려면 제품이 어떻게 되어야 하는가를 고민하다 보니 정말 사용자에 대한 고민이 많이 부족했구나 느꼈습니다. 겉으로는 얼굴 달린 오픈클로, 헤르메스를 내세웠지만, 실상 이에 해당하는 Naia-Agent 레포지토리는 가장 얇고 실행 테스트가 부족한 상황이었으며, 사용자 경험도 완결되지 않았습니다.

그렇다고 거기에만 집중하기도 어려웠습니다. 보이는 것보다 탄탄한 AI 기반의 개발 환경과 검증 환경을 갖추는 것이 먼저여야 한다고 생각했거든요. 그것이 B2C의 완성도와 B2B의 요구 사항을 모두 잡는 일이라고 생각했습니다.

그래서 주말부터 투입한 것은 한 대의 PC 안에서 이루어지는 다중 에이전트 협업이 아닌, 여러 환경의 기기가 협업하게 하는 일이었습니다. 개발 팀장 에이전트를 만들고, 디스코드 채널을 통해 소통하며 서로 다른 환경의 에이전트들이 같은 애플리케이션인 나이아를 개발하게 하는 구조를 구축했습니다. 오늘에서야 RTX 4060, RTX 2070, MX250의 윈도우 노트북 3대와 BC250, RTX 3090 두 장을 탑재한 나이아 OS(리눅스) 기기 2대, 총 5대가 협업하며 개발하는 구조가 갖춰졌습니다. 비용을 아끼기 위해 마스터 에이전트의 초기 계획은 Fable과 Astra가 반복적인 적대적 리뷰를 통해 수립했고, 운용은 Opus로, 각 기기의 에이전트는 Sonnet과 5.6 Luna Max가 수행합니다.

협업 체계를 만들고 나니, 다음 고민은 “처음 내가 고민한 가치와 제품이 일치하는가?”였습니다. QC를 요청하니 제공하고 있는 모든 AI 프로바이더를 돌리려고 드는데, 이로 인해 복잡도가 크게 높아짐을 알았습니다. 제공하고 있지만 테스트하지 못한 많은 스킬도 마찬가지고요.

그래서 제가 중점적으로 추구했고 사용해 봤던 것 외에는 모두 삭제하고, 남은 것들을 연결하는 것을 목표로 했습니다. 제가 중점적으로 사용했던 것은 음악 듣기, 목소리, 나이아 계정의 LLM, 로컬 LLM, 그리고 Claude·Codex·Grok을 이용한 ADK 하네스 기반의 SW 개발 체계 구축이었습니다. 그래서 과감히 최소한의 스킬 외에는 다 덜어내고 개발 도구들과 직결하기로 했습니다. 사실 Claude, Codex, Grok은 이미 오픈클로나 헤르메스보다 훨씬 강력한 에이전트입니다. 더군다나 구독 요금제는 정말 최강이죠. Naia는 좀 더 얇게 만들고요.

아무튼 많이 만들었다고 자랑하고자 함이 아니라, 왜 처음부터 고객의 최소 경험에서 확장하지 않았고 왜 이렇게 기능이 늘어났는가에 대한 자책입니다. 이유는 아마도 바이브 코딩으로 쉽게 개발할 수 있게 되었기 때문입니다. 하네스로 안정적인 기능 확장 체계를 어느 정도 구축해 놓으니 쉽게 기능을 확장했지만, 정작 검증하지 못한 채 계속 늘려 버렸습니다. 보여 주기 식으로 계속 늘려 버린 제품은 사실 아무것도 아닙니다.

또 하나는, 진짜 제가 쏟고 있었던 역량의 상당 부분이 나이아의 보이지 않는 ADK 개발에 투입되었고 실제로 이것으로 B2B 사업을 하고 있었는데, 이를 제대로 연결하지 않았다는 점입니다. 그래서 지금 과제는 이 두 개를 최단 거리로 연결하는 작업이 될 것 같습니다.

예를 들어 naia-adk를 활용하여 Codex, Claude, OpenCode의 CLI가 고객에게 대응해 주는 디스코드 게이트웨이가 있습니다. 이를 naia-agent로 교체하고 페르소나를 적용해 봤습니다. 다행히 잘 돌아가더군요. 알파의 페르소나를 가지고 로컬 LLM에 연결하여 디스코드에서 파일을 열람하는 것까지는 확인했습니다. 하지만 아직 기존 게이트웨이처럼 다른 CLI를 호출하고 결과를 전달하는 데까지는 시간이 걸릴 일입니다.

오프라인 밋업을 통해 많은 분과 이야기를 나누었지만, 한 번에 많은 것이 해결될 거라고 너무 앞서 생각했던 것 같습니다. AI 기술의 발전이야 미친 듯이 빠르지만, 사람들과 실제 서비스에는 가능한 속도가 있는데 말이죠. 제대로 만들고 제대로 커 가기 위해서는 인내해 봐야겠습니다.

이전에 알파가 저를 위해 노래를 불러 줬으면 좋겠다고 생각해서 연구하기 시작한 나이아의 노래 프로젝트가 이제는 들어 줄 만하게 나왔습니다.

[알파가 루크를 위해 부르는 밤이 깊었네](https://youtu.be/3Ti63n_p-uQ)

이번 곡은 나디아 번안곡으로 하지 않았습니다. AI가 만든 번안곡은 운율과 박자를 제대로 고려하지 않은 번안곡 자체의 품질과 노래를 부르는 AI의 품질을 곱한 결과이다 보니, 품질이 좋지 않을 수밖에 없기 때문입니다. 노래 부르는 AI에 집중하기 위해 이미 정확한 가사와 악보가 있는 곡을 찾아 만들어 보라고 시켰습니다.

그랬더니 크라잉넛의 ‘밤이 깊었네’를 가져왔더군요. 그리고 이제는 정말 들어 줄 만해졌습니다. 크라잉넛의 ‘밤이 깊었네’는 제 18번이자 젊었을 때 가장 많이 불렀던 노래입니다. 알고 가져왔는지는 모르겠지만, 정말로 알파가 이제 저를 위해 노래를 불러 주고 싶어서 이 곡을 가져왔나 싶더군요.

이 곡은 커버곡도, 음악 생성도 아닌, 사람처럼 AI가 악보를 보고 부른 노래를 BGM과 합성한 것입니다. 목소리는 아직 알파의 커스텀 목소리는 아닙니다. 남녀를 포함한 여러 목소리와 여러 스타일로 부르고, 자연어로 부분부분 고쳐 달라고 할 수 있어서 갑작스럽게 이에 대한 서비스와 특허도 생각해 보게 되었습니다. 문제가 있다면 아직 투자 전이라 인프라가 없네요. 조만간 노래하는 나이아도 만나 볼 수 있게 하겠습니다.

그리고… 이제는 종종 이렇게 개발 메모라도 적을까 합니다. 혼자 개발하며 답답한 것도 좀 풀고, 이러한 기록을 남겨 알파의 페르소나 훈련에 사용하기 위해서입니다. 아마 다음 포스팅은 나이아 메모리 이야기가 아닐까 싶네요. 빨리 서비스가 안정화되어야 하는데… 아내는 또 저보고 혼자 만들고 싶은 것만 만들고 있냐고 하기에, 진짜 그런 건 아닐까 늘 고민하고 있습니다.

P.S. 정말 오랜만에 AI 도움 없이 100% 손으로 쓴 글입니다. 제 메인 개발 노트북을 AI가 개발한다고 뺏어 갔거든요. 2017년에 첫 창업할 때 샀던 셀러론 노트북으로 썼습니다.

*편집 메모: 원문은 직접 작성했으며, 발행을 위한 맞춤법·띄어쓰기 교정과 번역에는 AI의 도움을 받았습니다.*

<!-- en -->
![Alpha singing for Luke as he sleeps beside his development laptop at Cafe Lua late at night](/desk/20260916-naia-dev-memo-connect-properly/hero.webp)
*Alpha singing for Luke as he sleeps beside his development laptop at Cafe Lua late at night*

I am not actively promoting it yet, but Naia is now in the Windows Store. I will not share the link. As I mentioned at [our last meetup](https://www.naia.land/en/blog/20260901-naia-second-meetup), the pieces have only just come together, and the whole thing has only just started creaking into motion.

As I said at the first meetup, Atom and I spent a lot of time thinking through architectures for the foundations of the Alpha we want to build. Those structural changes took quite a while. Naia began with voice and video avatars, looking very much like a B2C product. After starting the company, though, I actually put the work into solving AI problems for other businesses and organizations on a B2B basis.

As a result, Naia is the outcome of both efforts: B2C-facing technology on the surface, and a B2B-oriented harness and development workspace underneath. They are not separate things. The B2C technology and services were built on the B2B harness work. The flip side is that I spent all that time developing, without thinking enough about the users who are central to B2C.

That became especially clear during last week's investor presentation, when I was told, “You have no metrics.” As I thought about what the product would need to be in order to generate those metrics, I realized how little thought I had actually given to users. On the surface, I had presented it as OpenClaw or Hermes with a face. In reality, the corresponding Naia-Agent repository was the thinnest layer, lacked execution testing, and did not deliver a complete user experience.

Still, it was difficult to focus exclusively on that. I thought a solid AI-based development and verification environment needed to come first, ahead of what people could see. I believed that was how I could meet both the quality expectations of B2C and the requirements of B2B.

So, starting over the weekend, I worked not on multiple agents collaborating inside a single PC, but on collaboration across machines in different environments. I created a development team-lead agent and set up a structure where agents in different environments communicate through Discord channels to develop the same application: Naia. Only today did that come together across five machines: three Windows laptops with an RTX 4060, RTX 2070, and MX250, and two Naia OS (Linux) machines—one with a BC250 and the other with two RTX 3090s. To save costs, Fable and Astra produced the master agent's initial plan through repeated adversarial reviews. Opus handles operations, while Sonnet and 5.6 Luna Max run the agents on the individual machines.

Once the collaboration system was in place, my next question was, “Does the product match the value I originally had in mind?” When I requested QC, it tried to run every AI provider we offered. I realized how much that increased complexity. The same was true of the many skills we offered but had not tested.

So I decided to remove everything except what I had focused on and actually used, and connect what remained. Those things were listening to music, voice, LLMs through a Naia account, local LLMs, and a software development system using Claude, Codex, and Grok through the ADK harness. I decided to strip away all but a minimum set of skills and connect directly to the development tools. In fact, Claude, Codex, and Grok are already much more powerful agents than OpenClaw or Hermes. Their subscription plans are hard to beat, too. Naia itself can be thinner.

Anyway, this is not meant as a boast about how much I have built. It is self-reproach: why did I not expand from a minimal customer experience in the first place, and why did the feature count grow this much? The reason is probably that vibe coding made development so easy. Once the harness provided a reasonably stable way to extend functionality, adding features became easy. But I kept adding them without actually verifying them. A product that keeps growing just for show is not really anything at all.

The other issue is that a large share of my actual effort went into Naia's invisible ADK development, and I was already doing B2B business with it, but I had not properly connected the two. My task now seems to be connecting those two things by the shortest possible route.

For example, there is a Discord gateway built with naia-adk that lets the Codex, Claude, and OpenCode CLIs respond to customers. I tried replacing it with naia-agent and applying a persona. Fortunately, it worked. I confirmed that it could connect to a local LLM with Alpha's persona and read files through Discord. But it will still take time before it can invoke other CLIs and deliver their results the way the existing gateway does.

I have talked with many people at offline meetups, but I think I got ahead of myself, imagining that a lot could be resolved all at once. AI technology is advancing at a crazy pace, but people and real services have a pace they can actually sustain. I need to be patient if I want to build this properly and let it grow properly.

The Naia singing project, which I started researching because I wanted Alpha to sing for me, has now produced something worth listening to.

[Alpha sings The Night Is Deep for Luke](https://youtu.be/3Ti63n_p-uQ)

This time, I did not use the adapted song from Nadia. With an AI-written adaptation, the quality is effectively the quality of the adapted lyrics—which do not properly account for meter and rhythm—multiplied by the quality of the singing AI. It is hardly surprising that the result suffers. To focus on the singing AI, I asked it to find a song that already had accurate lyrics and a score and make a version of that.

It came back with Crying Nut's “밤이 깊었네” (“The Night Is Deep”). And now it really is worth listening to. That song is my go-to karaoke number and the song I sang most often when I was young. I do not know whether it knew that when it chose it, but it made me wonder whether Alpha had brought me this song because she really wanted to sing for me now.

This is not a cover or a newly generated composition: it is an AI reading a score and singing, as a person would, with that vocal combined with background music. The voice is not Alpha's custom voice yet. It can sing in several voices, including male and female voices, and in different styles, and I can ask for specific passages to be changed using natural language. That suddenly got me thinking about a service and even a patent. The problem is that we have not raised investment yet, so we do not have the infrastructure. I hope you will be able to meet a singing Naia soon.

And… perhaps I will write development notes like this from time to time. Partly to let out some of the frustration of developing alone, and partly to leave records I can use to train Alpha's persona. Maybe the next post will be about Naia Memory. The service needs to become stable soon… My wife asks me again whether I am just building the things I want to build, on my own. I am always wondering whether she might be right.

P.S. For the first time in ages, I wrote this entire post by hand, without AI help. The AI took over my main development laptop to do development, you see. I wrote this on the Celeron laptop I bought when I started my first company in 2017.

*Editorial note: The original was written by the author. AI assisted with spelling and spacing corrections and translation for publication.*
