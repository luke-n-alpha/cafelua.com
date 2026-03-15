---
date: "2009-07-07"
titleKo: No SQL movement 는 반 RDB? 분산서비스? IT에 대한 잡설 / IT이야기
titleEn: "NoSQL Movement: Anti-RDB? Or Distributed"
category: it
tags:
  - IT에 대한 잡설
images: []
sourceCategoryNo: "41"
sourceCategory: IT에 대한 잡설
externalUrl: https://blog.naver.com/fstory97/70052185941
---

<!-- ko -->
[http://www.idg.co.kr/newscenter/common/newCommonView.do?newsId=57298](http://www.idg.co.kr/newscenter/common/newCommonView.do?newsId=57298)
오픈캐스트를 통해 흥미로운 기사를 접했지만, 당췌 나로서는 기사 내용을 읽어도 잘 이해가 가지 않는다.
하둡등의 분산 스토리지 서비스가 No SQL커뮤니티가 반대하는 것이 정말 RDB를 대상으로 한것인가 ?

분산 솔루션이었던 Coord와 하둡을 써봤던 나로서는 이게 이해가 가지 않는 부분이다. 내용을 읽어본 즉슨 RDB의 맵핑에 대한 어려움에 대한 이야기가 RDB의 문제로 지적되고 SQL언어로 인한 인덱스를 타는 과정이라던가 그러한 속도의 문제를 지적 받고 있는 듯 하다.

일단 내 수준에서 이 기사를 이해해보려고 하면, RDB와 분산 스토리지 서비스의 차이를 이야기해보자고 하면, 분산 스토리지는 메모리를 가상화 하여 Pool방식으로 운영한다. 따라서 근본적으로 메모리나 대용량 스토리지를 운영하는 방식과 같기 때문에 Random Seek가 가능하다는 장점이 있을것이다.
하지만 데이터베이스는 데이터 모델링 과정을 통해 데이터를 SQL언어를 통해 결과는 2차원 Table형태로 가져오게 되어있다.

따라서 RDB의 단점은 Random Seek에 성능이 약하며, 다차원 정보를 조회하기에는 용이하지 않다. 그러면 하둡이 과연 그 대안이 될 수 있을까? 조금은 고개가 갸우뚱거려지는 부분이다. 사실 DB에서 이러한 문제를 해결하기 위한 노력은 존재했다. OODB와 ORDB가 그 대안이다. 하지만, 기존 SQL과 달리 해당 DB에 특화된 쿼리가 필요하다는 것과 성능적인 문제가 존재했다.

그러나 과연 하둡이 그러한 문제를 일시에 해결해서 대용량 객체가 떡하고 올라간다고 해서 모든 문제가 해결될 것인가?

솔직히 ... 난 아닌것 같다. 분산솔루션에 대한 맹신도 현재로서는 기술적으로 난제가 있는것도 사실이지만, 근본적으로 객체 맹신론자들은 분명 완벽한 객체는 그것만으로 큰 재사용성과 멋진 확장성을 제공한다고 주장한다. 객체는 애석하게도 생각만큼 멋지지 못하다. 왜냐하면 그 원인중 대부분은 객체를 설계하는 사람들이 완벽하지 않기 때문이고, 인간의 뇌란것이 추상화수준은 각기 다르며, 실제로 실세계에 돌아다니는 데이터들을 처리하는 개발자들과 설계자들의 뇌는 기껏해봐야 3차원만되도 혼란해한다는것이다. 때문에 필드에 돌아다니는 수많은 데이터들이 2차원에 머물고 있는 상황에서 이를 객체에 맵핑 시키면, 차후에 객체 설계가 잘못되었을때 그 곤란함은 역시 존재할 것이다.

하둡역시 2차원 데이터를 처리할 수 있다. 하지만, 그러한 기능이 단순히 목적이라면 분산데이터베이스를 사용하는것만으로 하둡과 동일한 목적에 도달할 수 있지 않을까 ?

SQL은 분명 많은 한계에 부딪치게 만들지만, 데이터를 이해하는데는 단순한 내머리와 프린팅해서 자료보기에는 테이블의 자료는 상당히 편리하다.

근본적으로 Database는 소프트웨어를 개발하기 위한 것이 아니라 데이터 처리를 위한 것이라는점에서 굳이 하둡과 싸워야 할 필요가 있을까 하는 생각이 든다. No SQL 운동은 근본적으로 DB를 쓰지 않아야 할 곳에 괜히 DB를 사용해서 발생할 문제가 아닐까 싶다는 생각도 든다. 아니면 OR Mapping의 새로운 대안일까?

내가 이해력이 부족한 것인지.. 아니면 번역이 잘못된건지 아직은 잘 모르겠다. 하지만 내가 언뜻 이해하기에는 기사의 내용처럼 반 RDB운동과는 좀 다른 이야기가 아닐까 싶다. 물론, RDB가 가진 한계는 오라클도 잘 알고 있다. 그러기에 8i인가 부터는 ORDB라고 하는것 같긴 한데... nhn의 큐브리드도 그렇고, 대부분의 개발자가 RDB를 이해하기는 아직 너무 어렵고, 성능도 기대 이하란것이 문제다.

그렇다면 결국 ORDB와 분산솔루션과 Hybrid서비스도 출현할까? 그게 그냥 분산 DB일라나..
아마도.. 문제는 내가 DB전문가도 분산 전문가도 아니기 때문에.. 내 이해력은 여기까지가 한계인갑다.

<!-- en -->
[http://www.idg.co.kr/newscenter/common/newCommonView.do?newsId=57298](http://www.idg.co.kr/newscenter/common/newCommonView.do?newsId=57298)
I came across an interesting article via Opencast, but I simply can't understand the content of the article, even after reading it. Is it true that distributed storage services like Hadoop are being opposed by the NoSQL community, specifically targeting RDBs?

As someone who has used distributed solutions like Coord and Hadoop, this part is hard for me to grasp. From what I've read, the difficulty in mapping RDBs is being pointed out as an RDB problem, and issues like the process of indexing due to SQL language or speed problems seem to be criticized.

If I try to understand this article at my level, and discuss the difference between RDB and distributed storage services, distributed storage virtualizes memory and operates in a pool-based manner. Therefore, it fundamentally operates like memory or large-capacity storage, which would have the advantage of enabling random seeks.
However, databases retrieve data through SQL language via a data modeling process, resulting in a 2D table format.

Thus, RDBs have weak performance in random seeks and are not suitable for querying multi-dimensional information. So, can Hadoop really be an alternative? This part makes me a bit skeptical. In fact, efforts to solve these problems in databases have existed. OODB and ORDB were the alternatives. However, unlike traditional SQL, they required queries specific to their respective databases and had performance issues.

But will Hadoop truly solve all these problems at once, just by allowing large objects to be easily uploaded?

Honestly... I don't think so. While blind faith in distributed solutions also presents technical challenges at present, fundamentally, object fundamentalists claim that a perfect object alone provides great reusability and excellent scalability. Unfortunately, objects are not as great as they are thought to be. This is mostly because the people designing objects are not perfect, and the human brain has varying levels of abstraction; developers and designers processing real-world data often get confused even with just three dimensions. Therefore, when numerous real-world data, which largely remain in 2D, are mapped to objects, the difficulties will still arise if the object design is flawed later on.

Hadoop can also process 2D data. However, if that functionality is merely the goal, couldn't one achieve the same objective as Hadoop simply by using a distributed database?

SQL certainly presents many limitations, but for understanding data with my simple mind and viewing information by printing it, table data is quite convenient.

Fundamentally, databases are for data processing, not for software development, so I wonder if there's really a need to 'fight' with Hadoop. I also wonder if the NoSQL movement is fundamentally about problems arising from using a DB unnecessarily where it shouldn't be used. Or is it a new alternative to OR Mapping?

I'm not sure if my understanding is lacking... or if the translation is wrong. But from what I vaguely understand, it seems to be a different story than an anti-RDB movement, as the article suggests. Of course, Oracle is also well aware of the limitations of RDBs. That's why, starting from 8i, it seems to be called ORDB... And with NHN's Cubrid, for example, the problem is that most developers still find RDBs too difficult to understand, and their performance is below expectations.

So, will ORDBs, distributed solutions, and hybrid services eventually emerge? Or will that just be a distributed DB?
Perhaps... the problem is that I'm neither a DB expert nor a distributed systems expert... so my understanding reaches its limit here.