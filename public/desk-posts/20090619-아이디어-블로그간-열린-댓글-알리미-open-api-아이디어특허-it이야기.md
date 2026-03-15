---
date: "2009-06-19"
titleKo: "[아이디어] 블로그간 열린 댓글 알리미 Open API 아이디어/특허 / IT이야기"
titleEn: "[Idea] Open Comment Notifier Open API Between"
category: it
tags: []
images: []
sourceCategoryNo: "15"
sourceCategory: 아이디어/특허
externalUrl: https://blog.naver.com/fstory97/70050844970
---

<!-- ko -->
레인레테님의 [블로그의 사회화를 적극지지합니다.([http://www.rainlethe.com/149](http://www.rainlethe.com/149))] 포스팅을 보고
일년전 즈음에 구상했던 아이디어와 같아 관련 파일을 찾아보려 했으나, 자료를 어디다 날려먹은듯하군요. 그래서 다시 정리해봤습니다. 그때와 크게 달라진건 없는듯..

****
**1. ****제목 : 블로그간 열린 댓글 Open API**
**2. ****배경 : 이 기종의 블로그간의 댓글 알리미의 표준과 방법을 고민해본다.**
**3. ****작성일 : 2009년 06월 19일**
**4. ****시나리오**
** 1) ****블로그에 로그인한 후 댓글 비밀번호와 OpenAPI 암호를 설정**
: 해당 비밀번호는 로그인 비밀번호는 다르게 해야 한다. 이 비밀번호는 다른 블로그에 댓글을 달 때 사용된다.
: OpenAPI암호는 다른 블로그에 Notify를 보낼 때 사용한다. (자신이 보낸 것이 맞는지 확인하는 용도)

** 2) ****블로그 유저는 외부 블로그에 댓글을 단다.**
: 이때 해당 블로그는 블로그주소와 패스워드를 입력 필드를 가진다.
** 3) ****외부 블로그가 댓글 Open API 를 지원하는 것을 가정한다.**
* 댓글은 Notify될 블로그 주소(Url), 댓글 패스워드(Pwd), 제목(Title), 내용(Content)로 이루어진다.

**3.1) abc.tistory.com ****에서 댓글을 입력 받으면 수행 작업**
** 3.1.1) **[**http://abc.tistory.com/1234**](http://abc.tistory.com/1234)** ****에 댓글이 달리면, 댓글 알리미 페이지를 생성한다.**

[http://abc.tistory.com/1234/1](http://abc.tistory.com/1234/1)
해당 페이지에는 댓글의 정보들이 기록되어지고,
Notify가 된 외부 블로그는 해당 페이지를 접근하여 정보를 확인 할 수 있다.

[http://abc.tistory.com/1234/1](http://abc.tistory.com/1234/1) 의 내용

<XML>
<header>
<sender>
<name>야미</name>
<url>[http://abc.tistory.com/1234/](http://abc.tistory.com/1234/) </url>
</sender>
<receiver>
<name>숲속얘기</name>
<url>http://blog.naver.com/fstory97 </url>
</receiver>
<ReplyNum> 0 </ReplyNum>
</header>
<body>
<Title> 안녕하세요. </Title>
<content> 오래간만에 들렀다 갑니다. 요즘 잘 지내시는지요? </content>
</body>
</XML>

- sender와 receiver의 정보로 이루어져 있다. body에는 댓글의 내용이 포함되어있다.

**      3.1.2) http://blog.naver.com/fstory97 ****에 Notify를 수행한다.**
[http://blog.naver.com/fstory97/openAPI?reply=ASDWEXDSDEDEDE](http://blog.naver.com/fstory97/openAPI?reply=ASDWEXDSDEDEDE)
/openAPI/reply는 미리 정의된 규약이고, reply의 내용은 댓글을 입력받을 때 암호를 Key로 만들어 암호화한 내용이다.
Reply의 내용은 암호화 이전의 모습
http://blog.naver.com/fstory97/openAPI?reply=blog.naver.com/fstory97|[http://abc.tistory.com/1234/](http://abc.tistory.com/1234/)1|43213
- 암호키 값을 확인할 수 있도록, 자신의 주소를 포함한다.
- Notify를 통해 확인할 URL을 알려준다. [http://abc.tistory.com/1234/1](http://abc.tistory.com/1234/1)
**- ****마지막필드는 **[**http://abc.tistory.com/**](http://abc.tistory.com/)** ****의 암호변경을 위한 OpenAPI 접근 암호 [3.4]에 이용**

**    3.2) Notify****를 받은 **[**http://blog.naver.com/fstory97**](http://blog.naver.com/fstory97)**의 수행작업**
**      3.2.1) ****암호를 디코딩하여 앞자리가 자신의 주소와 일치하는 지 확인**
- 틀린 경우, 버리거나, 공격으로 판단한다.
**      3.2.2) WhiteList****에 **[**http://abc.tistory.com/**](http://abc.tistory.com/)** ****와 전달받은 OpenAPI 패스워드 추가**
**  3.2.2) ****확인할 URL을 호출한다. **[**http://abc.tistory.com/1234/1**](http://abc.tistory.com/1234/1)** ****해당 XML을 수집하여 사용자에게 Notify**
Ex)
[야미] 블로그에 단 댓글
제목 : 안녕하세요
내용 : 오래간만에 들렀다 갑니다. 요즘 잘 지내시는지요?
*** ****클릭시 **[**http://abc.tistory.com/1234**](http://abc.tistory.com/1234)**로 이동**

**      3.2.3) ****자신이 달지 않은 댓글인 경우, 해당 사이트 차단 가능, BlackList**
**에 **[**http://abc.tistory.com/**](http://abc.tistory.com/)**를 추가 할 수 있음 (이후 abc.tistory로 오는 OpenAPI는 거부)**

**     3.3) **[**http://abc.tistory.com/1234**](http://abc.tistory.com/1234)**에 댓글에 댓글이 달리는 경우,**
**       3.3.1) **[**http://abc.tistory.com/1234/1**](http://abc.tistory.com/1234/1)** XML ****페이지를 수정**
<XML>
<header>
<sender>
<name>야미</name>
<url>[http://abc.tistory.com/1234/](http://abc.tistory.com/1234/) </url>
</sender>
<receiver>
<name>숲속얘기</name>
<url>http://blog.naver.com/fstory97 </url>
</receiver>
**<ReplyNum> 1 </ReplyNum>**
</header>
<body>
<Title> 안녕하세요. </Title>
<content> 오래간만에 들렀다 갑니다. 요즘 잘 지내시는지요? </content>
** <Reply>**
**     <Title> ****방가방가 </Title>**
**     <Author> ****야미 </Author>**
**     <Content> ****진짜 오래간만 </Content>**
** </Reply>**
</body>
</XML>
**3.3.2) ****다시 **[**http://blog.naver.com/fstory97**](http://blog.naver.com/fstory97)**에 Notify (3.1.2)와 동일**

**3.4) **[**http://blog.naver.com/fstory97**](http://blog.naver.com/fstory97)**의 댓글 암호 변경**
**- WhiteList****에 있는 사이트들의 키와 주소를 이용하여 댓글 암호 전체 전달**
**- ****해당 사이트들은 해당 블로그의 댓글 암호를 갱신**
** **
**3.5) OpenAPI ****암호 변경**
**- WhiteList****에 있는 사이트들의 키와 주소를 이용하여 댓글 암호 전체 전달**
**- ****해당 사이트들은 해당 블로그의 댓글 암호를 갱신**
** **
****
**5. 장점과 특징**
l   기본적으로 댓글Key와 OpenAPI Key를 운영하여 어뷰징을 최소화하고, Key유출시 블랙리스트와 화이트리스트로 사용자의 암호 변경이 가능하게 함.
l  댓글의 컨탠츠를 담고 있는 XML 페이지를  생성하고 해당 XML 페이지 조회를 요청하는 Notify로만 이루어져 비교적 가볍고 확장성이 있음
l  댓글 알리미의 View단 구현은 XML 정보를 조회하여 각 블로그에 자유도가 높음
l  댓글의 전체를 특정 사이트에 집중 시키지 않아 부하가 낮으며, 빅브라더 문제가 없음

<!-- en -->
After seeing Rainlethe's post [I strongly support the socialization of blogs.([http://www.rainlethe.com/149](http://www.rainlethe.com/149))], I tried to find related files because it was similar to an idea I conceived about a year ago, but it seems I've lost the data somewhere. So I've reorganized it. It doesn't seem much different from back then.

****
**1. Title: Open Comment API between Blogs**
**2. Background: Considering standards and methods for comment notifications between different types of blogs.**
**3. Date: June 19, 2009**
**4. Scenario**
** 1) After logging into the blog, set a comment password and an OpenAPI password.**
   : This password must be different from the login password. This password is used when commenting on other blogs.
   : The OpenAPI password is used when sending a Notify to another blog. (For verifying that you sent it)

** 2) The blog user comments on an external blog.**
   : At this time, the blog has input fields for the blog address and password.
** 3) Assume the external blog supports the Comment Open API.**
   * Comments consist of the blog address (Url) to be notified, comment password (Pwd), title (Title), and content (Content).

**3.1) Actions performed when abc.tistory.com receives a comment**
** 3.1.1) When a comment is posted on [http://abc.tistory.com/1234](http://abc.tistory.com/1234), a comment notification page is created.**

[http://abc.tistory.com/1234/1](http://abc.tistory.com/1234/1)
Comment information is recorded on this page, and external blogs that have been notified can access this page to check the information.

Content of [http://abc.tistory.com/1234/1](http://abc.tistory.com/1234/1)

<XML>
  <header>
   <sender>
<name>Yami</name>
<url>[http://abc.tistory.com/1234/](http://abc.tistory.com/1234/) </url>
</sender>
   <receiver>
<name>Forest Story</name>
<url>http://blog.naver.com/fstory97 </url>
 </receiver>
<ReplyNum> 0 </ReplyNum>
 </header>
   <body>
<Title> Hello. </Title>
 <content> It's been a while since I visited. How have you been lately? </content>
 </body>
      </XML>

        - It consists of sender and receiver information. The body contains the comment content.

**      3.1.2) Perform Notify to http://blog.naver.com/fstory97.**
          [http://blog.naver.com/fstory97/openAPI?reply=ASDWEXDSDEDEDE](http://blog.naver.com/fstory97/openAPI?reply=ASDWEXDSDEDEDE)
         /openAPI/reply is a predefined protocol, and the content of 'reply' is encrypted using the password as a key when receiving a comment.
      The content of Reply before encryption:
http://blog.naver.com/fstory97/openAPI?reply=blog.naver.com/fstory97|[http://abc.tistory.com/1234/](http://abc.tistory.com/1234/)1|43213
- Includes its own address to verify the encryption key value.
- Informs the URL to be checked via Notify. [http://abc.tistory.com/1234/1](http://abc.tistory.com/1234/1)
**- The last field is used for the OpenAPI access password for changing the password of [http://abc.tistory.com/](http://abc.tistory.com/) [3.4]**

**    3.2) Actions performed by [http://blog.naver.com/fstory97](http://blog.naver.com/fstory97) after receiving Notify**
**      3.2.1) Decode the password and check if the prefix matches its own address.**
       - If incorrect, discard or consider it an attack.
**      3.2.2) Add [http://abc.tistory.com/](http://abc.tistory.com/) and the received OpenAPI password to the WhiteList.**
**  3.2.2) Call the URL to be checked. [http://abc.tistory.com/1234/1](http://abc.tistory.com/1234/1) Collect the XML and Notify the user.**
   Ex)
[Yami] Comment posted on blog
Title: Hello
Content: It's been a while since I visited. How have you been lately?
*** ****Click to go to **[**http://abc.tistory.com/1234**](http://abc.tistory.com/1234)**

**      3.2.3) If it's a comment you didn't post, you can block the site and add [http://abc.tistory.com/](http://abc.tistory.com/) to the BlackList (subsequent OpenAPI requests from abc.tistory will be rejected).**

**     3.3) If a reply is posted to a comment on [http://abc.tistory.com/1234](http://abc.tistory.com/1234),**
**       3.3.1) Modify the [http://abc.tistory.com/1234/1](http://abc.tistory.com/1234/1) XML page.**
<XML>
  <header>
   <sender>
<name>Yami</name>
<url>[http://abc.tistory.com/1234/](http://abc.tistory.com/1234/) </url>
</sender>
   <receiver>
<name>Forest Story</name>
<url>http://blog.naver.com/fstory97 </url>
 </receiver>
**<ReplyNum> 1 </ReplyNum>**
 </header>
   <body>
<Title> Hello. </Title>
 <content> It's been a while since I visited. How have you been lately? </content>
** <Reply>**
**     <Title> Hi there </Title>**
**     <Author> Yami </Author>**
**     <Content> Really long time no see </Content>**
** </Reply>**
 </body>
      </XML>
**3.3.2) Notify [http://blog.naver.com/fstory97](http://blog.naver.com/fstory97) again (same as 3.1.2)**

**3.4) Change comment password for [http://blog.naver.com/fstory97](http://blog.naver.com/fstory97)**
**- Transmit all comment passwords using the keys and addresses of sites in the WhiteList.**
**- These sites update the comment password for that blog.**

**3.5) Change OpenAPI password**
**- Transmit all comment passwords using the keys and addresses of sites in the WhiteList.**
**- These sites update the comment password for that blog.**

****
**5. Advantages and Features**
l   Minimizes abuse by operating with a Comment Key and OpenAPI Key, and allows users to change passwords using blacklists and whitelists in case of key leakage.
l   It is relatively lightweight and scalable, consisting only of creating an XML page containing comment content and a Notify request to query that XML page.
l   The implementation of the comment notification's View layer has high flexibility for each blog by querying XML information.
l   The entire comment system is not concentrated on a specific site, resulting in low load and no Big Brother issues.