---
date: "2006-07-19"
titleKo: About AJAX (ajax 소개와 예제) 주인장 작업물 / IT이야기
titleEn: "AJAX: Introduction and Examples"
category: it
tags:
  - 주인장 작업물
images:
  - http://tfile.nate.com/download.asp?FileID=10802294
  - http://tfile.nate.com/download.asp?FileID=10802295
  - http://tfile.nate.com/download.asp?FileID=10802296
  - http://tfile.nate.com/download.asp?FileID=10802297
thumbnail: http://tfile.nate.com/download.asp?FileID=10802294
sourceCategoryNo: "16"
sourceCategory: 주인장 작업물
externalUrl: https://blog.naver.com/fstory97/70006341722
---

<!-- ko -->
예전 회사에서 원래 세미나 자료로 만든건데,
세미나가 패스된 이상 정리 차원을 위해 통에 공개합니다.
본 자료는 김형준님의 블로그에서 발췌한 예제를 설명했습니다.
[http://jaso.co.kr/tatter/index.php?pl=10](http://jaso.co.kr/tatter/index.php?pl=10)
*** 퍼가실때는 꼭 출처를 밝혀주세요.****
****
****Ajax(Asynchronous JavaScript and XML) 란 ?**

- Ajax(Asynchronous JavaScript and XML) 혹은 AJAX는 대화식 웹 어플리케이션의 제작을 위해 아래와 같은 조합을 이용하는 웹 개발 기법이다 .

1) 표현 정보를 위한 HTML (또는 XHTML) 과 CSS
2) 동적인 화면 출력 및 표시 정보와의 상호작용을 위한 DOM, 자바스크립트
3) 웹 서버와 비동기적으로 데이터를 교환하고 조작하기 위한 XML, XSLT, XMLHttpRequest

(Ajax 어플리케이션은 XML/XSLT 대신 미리 정의된 HTML 이나 일반 텍스트, JSON, JSON-RPC를 이용할 수 있다).

**특정한 기술을 말하는 것이 아니며, 함께 사용하는 기술의 묶음을 지칭하는 용어**
** '브라우저와 서버 사이의 통신에는 XML를 사용하고, 사용자가 보는 브라우저 화면의 인터페이스로는 자바스크립트를 이용하는 기술' **

Ajax 어플리케이션은 실행을 위한 플랫폼으로 위에서 열거한 기술들을 지원하는 웹 브라우저를 이용한다. 이것을 지원하는 브라우저로는 모질라 파이어폭스, 인터넷 익스플로러, 오페라, 사파리 등이 있다. 단, 오페라는 현재 XSL 포맷팅 객체와 XSLT 변환을 지원하지 않는다

**AJAX는 무엇이 다른가 ?**

**장점 :**

- 페이지이동없이 고속으로 화면전환
- 서버를 기다리지 않고 비동기 요청가능
- PHP및 Perl등의 서버측 처리를 각 PC에 분산 가능
- 수신하는 데이터의 양을 줄일수 있음
- 브라우져의 표준인터페이스안에서 동작
- 유료 소프트웨어 없이 개발가능
- 플러그인의 기동시간없이 MAC에서도 잘 동작

**단점 :**

- 크로스 브라우져화의 노하우 필요
- AJAX를 쓸수 없는 브라우져에 대한 대책필요(JavaScript와 XMLHttpRequest사용불가한)
- 오픈소스인JavaScript때문에 차별화의 어려움
- HTTP클라이언트의기능이한정
- 보안에 주의가 불가피
- 현재의 처리상황에 대한 정보 필요
- 요청을 남발시 역으로 서버부하의 증가

'웹서버-브라우저'의 구조 사이에 Ajax가 중간에 위치한 '웹서버-Ajax엔진-브라우저'의 구조로 변경

{{IMG:1}}
[그림] 제시 제임스 가렛이 비교한 이전의 웹응용 모델과 Ajax 웹응용 모델의 차이

**3. ActiveX와 Flash의 대안 AJAX**

**RIA(Rich Internet Application) :**
(HTML만으로 구현하기 어려운 복잡하고 정교한 작업을 구현해줌으로써 좀더 윤택한 사이트를 꾸며주는 인터넷 기술) ActiveX나 Flash 자바애플릿을 의미함

- ActiveX : 설치해야하는 번거로움, IE만 지원
- Flash : 덩치가 큼 느린 속도
- 자바애플릿 : 자바가상머신 설치

**AJAX :
**  XML을 이용하므로 기기나 브라우저에 구애받지 않으며 웹표준을 준수하기 쉽다.
호환성, 확장성도 좋다

**[예제]**
구글 맵  : [http://maps.google.com/](http://maps.google.com/)
아약스로 만든 보드 : [http://hooriza.com/sample/ajaxboard/](http://hooriza.com/sample/ajaxboard/)
이미지 리사이즈 자바 스크립트 :
[http://www.agilepartners.com/blog/2005/12/07/iphoto-image-resizing-using-javascript/](http://www.agilepartners.com/blog/2005/12/07/iphoto-image-resizing-using-javascript/)
이미지검색 사이트 : [http://www.flickr.com](http://www.flickr.com/)
쇼핑몰 : [http://panic.com/goods/](http://panic.com/goods/)
아마존 검색 엔진 [http://a9.com/](http://a9.com/)

**4. AJAX의 보급** ******
**
- 2005년 초 구글이 구글 그룹스를 포함한  대화형 어플리케이션의 기반을 위해 비동기식 통신을 이용
- Ajax라는 용어가 AJAX: A new approach for a new application 기사에서 등장
- 대화형 웹 페이지를 위한 도구로서 Ajax를 이용하는 어플리케이션들이 급격히 증가
-  이는 부분적으로 이용할 수 있는 어플리케이션 툴킷(예: Ruby on Rails, DWR)이 늘어나 프로그래머들이 구현하기가 쉬어진 때문
- 네이버를 비롯한 포털 업체에서 도입
- IBM-구글-야후 Ajax확산을 위해 오픈 Ajax 프로젝트 출범  : 이클립스 개발툴 제작

**5.네이버의 키워드 검색효과 구현
**
**- xmlhttp.js : XMLHttpRequest** 를 이용하여 사용자의 행동을 서버로 전달하고, 서버로부터의 결과를 받아오는 스크립트 파일
**- ajax_search.html  :** 실제 사용자에게 보여지는 HTML,
클라이언트의 행동에 관한 정보를 수집해 xmlhttp.js파일내에 있는 함수로 전달하며, 서버로부터 받아온 결과를 사용자에게 알맞게 가공하여 보내주는 파일
**- searchKeyword.jsp :** 서버에 올라가 xmlhttp.js파일의 함수에 반응하는 파일

{{IMG:2}}

**5.1 네이버의 키워드 검색효과 : xmlhttp.js**

function paramEscape(paramValue) {
return encodeURIComponent(paramValue); // URI_String으로 변환함수
function formData2QueryString(docForm) {   // 쿼리를 생성해주는 스크립트
var submitString = '';
var formElement = '';
var lastElementName = '';

for(i = 0 ; i < docForm.elements.length ; i++)
formElement = docForm.elements[i];
switch(formElement.type)
case 'text' : // 텍스트일때.. submitString += formElement.name + '=' + paramEscape(formElement.value) + '&';
submitString += formElement.name + '=' + paramEscape(formElement.value) + '&';
break;
submitString = submitString.substring(0, submitString.length -1 ); // 맨뒤에 &가 있으므로 하나를 빼고 저장
return submitString;

// 쿼리를 만들어주기 위한 함수들로 XMLHTTP.JS의 앞부분은 기존의 자바스크립트와 똑같다.
// 대강 봐두 될듯, 아래부터 중요

function xmlHttpPost(actionUrl, submitParameter, resultFunction)
var xmlHttpRequest = false;
if(window.ActiveXObject)   xmlHttpRequest = new ActiveXObject('Microsoft.XMLHTTP');
else  {
xmlHttpReq = new XMLHttpRequest();
xmlHttpReq.overrideMimeType('text/xml');    }
xmlHttpRequest.open('POST', actionUrl, true);
xmlHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

xmlHttpRequest.onreadystatechange = function() {  // xmlHttpRequest의 상태에 따른 함수
if(xmlHttpRequest.readyState == 4)
switch (xmlHttpRequest.status)
{//서버로부터 받은 상태코드 및 데이터를 이용한 처리로직 구현부
case 404 :  alert('오류: ' + actionUrl + '이 존재하지 않음');   break;
case 500 :  alert('오류: ' + xmlHttpRequest.responseText);   break;
default:
eval(resultFunction + '(xmlHttpRequest.responseText);');
//resultFunction에 xmlHttpRequest.responseText값을 넘기는 함수
break;
xmlHttpRequest.send(submitParameter); // xmlHttpRequest.readyState가 1번일때 쿼리 전송

// 중요부분은 아래 그림에서 다시 보충설명 (클릭해서 보세요)

***{{IMG:3}}***

**5.2 네이버의 키워드 검색효과 : ajax_search.html **

<HTML><HEAD><META http-equiv="Content-Type" content="text/html;" charset="euc-kr">
<SCRIPT type="text/javascript" src="xmlhttp.js"></SCRIPT>
<SCRIPT Language="javascript">
<!--
function keywordKeyDown(){
var keyCode = window.event.keyCode;
//Keydown 이벤트 발생 시점에는 아직 TextField에 사용자가 입력한 키 값이 설정되지 않았기 때문에
//브라우저가 이벤트에 반응하여 값을 설정할때 까지 잠시 기다린다.
setTimeout('submitSearchKeyword()', 250);     // 250ms이후에 submitSearchKeyword실행
function submitSearchKeyword(){
// [http://jaso.co.kr/searchKeyword.jsp](http://jaso.co.kr/searchKeyword.jsp)로 form의 입력값을 보내서 받은 결과를 viewSearchKeywordResult()함수에 넘겨줌
var url = 'http://jaso.co.kr/searchKeyword.jsp';  // 서버 URL
var queryString = formData2QueryString(document.MAIN_FORM);  // 쿼리생성
var resultProcessMethod = 'viewSearchKeywordResult';    // 결과를 받아서 실행할 함수 ,
xmlHttpPost(url, queryString, resultProcessMethod);  // 쿼리를 xmlHttpRequest에 post로 보내는함수 호출

function viewSearchKeywordResult(result) {  // resultFunction으로 보내질 함수
// 여기서 result는 [http://jaso.co.kr/searchKeyword.jsp](http://jaso.co.kr/searchKeyword.jsp)로부터 받아온 결과

if(result == "")  {  // result가 없다면 hidden으로 보여줌
var searchKeywordDiv = document.all("searchKeyword");
searchKeywordDiv.innerHTML = "";
searchKeywordDiv.style.visibility = "hidden";
else  {   // 받아온 결과가 있다면 result 리스트에 '|'으로 나누어 저장
var resultList = result.split('|');
var viewResult = '';
for(i = 0 ; i < resultList.length; i++) { // 길이만큼 나누어줌
// 첫번째 줄은 키워드명과 키워드 목록이라는 문자열 그리고 닫기 기능이 있는 줄로 이루어져 있음
if(i == 0)  viewResult += '<B>' + resultList[i] + '</B> <A href="javascript:hiddenSearchKeywordResult();">[닫기]</A><BR>'
else    // 실제로 찾은 키워드리스트
viewResult += '<A href="javascript:setKeyword(\'' + resultList[i] + '\');">' + resultList[i] + '</A><BR>'

var searchKeywordDiv = document.all("searchKeyword");
// searchKeyword의 id를 가진 div(아래에 있음)
searchKeywordDiv.innerHTML = viewResult;
// DIV영역에 viewResult값을 innerHTML형태로 삽입함
searchKeywordDiv.style.visibility = "visible"; // DIV영역에 View속성

function hiddenSearchKeywordResult() { // 닫기 눌렀을때, 영역을 hidden시키는 스크립트
var searchKeywordDiv = document.all("searchKeyword");
searchKeywordDiv.innerHTML = "";
searchKeywordDiv.style.visibility = "hidden";

function setKeyword(selectedKeyword) { // 키워드 목록 클릭시 키워드를 인풋텍스트 안에 넣어주는 스크립트
document.MAIN_FORM.keyword.value = selectedKeyword;
//-->
</SCRIPT>

<STYLE type="text/css">
<!--
.scroll_div { scrollbar-face-color:#FFFFFF; scrollbar-highlight-color: #aaaaaa; scrollbar-3dlight-color: #FFFFFF;
scrollbar-shadow-color: #aaaaaa; scrollbar-darkshadow-color: #FFFFFF; scrollbar-track-color: #FFFFFF;
scrollbar-arrow-color: #aaaaaa;}                      -->
</STYLE> </HEAD>
<BODY onLoad="MAIN_FORM.keyword.focus()">
<FORM name="MAIN_FORM">
"가", "강"을 입력 해보세요.</BR>
<INPUT type="text" name="keyword" onkeydown="keywordKeyDown()" style:width=150px" autocomplete="off"><A href="javascript:alert('검색처리');">검색</A>
<DIV id="searchKeyword" style="width:250px;height:100px;visibility:hidden;background-color:#D1EED2;overflow=auto;font-size:12px" class="scroll_div">
</DIV>
</FORM>
</BODY>
</HTML>

** 5.3 네이버의 키워드 검색효과 : searchKeyword.jsp**
: 서버에서 텍스트값을 받아 결과값을 보내주는 소스

- ‘가’or ‘강’을 받으면 단순히 text로 결과를 내려주는 소스.
- UTF-8을 이용해 전송해야 한다.

<%@ page contentType="text/html; charset=euc-kr" %>
<%@ page import="java.util.*" %>
<%

HashMap keywordData = new HashMap();
keywordData.put("가","강타|강일|가을소나타|강주희|강은비|강력3반|강동원|가격비교|가방|강수지");
keywordData.put("강", "강타|강일|강주희|강은비|강력3반|강동원|가방|강수지");

request.setCharacterEncoding("UTF-8");
String keyword = request.getParameter("keyword");
//여기에서 데이터베이스로부터 해당 keyword로 시작하는 단어 검색
//예제에서는 간단하게 하기 위해 Hash에서 가져오는 것으로 처리
String result = (String)keywordData.get(keyword);
if(result == null)      result = "키워드 없음";

out.print(keyword + " 키워드 목록|" + result);
%>

{{IMG:4}}

[그림] Keyword에 1을 넣어 결과 확인

*** 퍼가실때는 꼭 출처를 밝혀주세요.**

<!-- en -->
This was originally created as seminar material at my previous company, but since the seminar was canceled, I'm making it public for organizational purposes.
This material explains examples excerpted from Kim Hyung-jun's blog.
[http://jaso.co.kr/tatter/index.php?pl=10](http://jaso.co.kr/tatter/index.php?pl=10)
*** Please be sure to cite the source when reposting.****

**What is Ajax (Asynchronous JavaScript and XML)?**
 

- Ajax (Asynchronous JavaScript and XML) or AJAX is a web development technique that uses the following combination to create interactive web applications:
 
 1) HTML (or XHTML) and CSS for presentation information
 2) DOM and JavaScript for dynamic screen output and interaction with display information
 3) XML, XSLT, and XMLHttpRequest for asynchronously exchanging and manipulating data with a web server
 
(Ajax applications can use predefined HTML, plain text, JSON, or JSON-RPC instead of XML/XSLT).
 
**It does not refer to a specific technology, but rather a term that refers to a bundle of technologies used together.**
**'A technology that uses XML for communication between the browser and the server, and JavaScript for the interface of the browser screen seen by the user.'**
 
Ajax applications use web browsers that support the technologies listed above as their execution platform. Browsers that support this include Mozilla Firefox, Internet Explorer, Opera, and Safari. However, Opera currently does not support XSL formatting objects and XSLT transformations.

 **How is AJAX different?**
 
**Advantages:**

- Fast screen transitions without page reloads
- Asynchronous requests possible without waiting for the server
- Server-side processing like PHP and Perl can be distributed to individual PCs
- Can reduce the amount of data received
- Performance improvement through real-time interactivity
- Operates within the browser's standard interface
- Development possible without paid software
- Works well on MACs without plugin startup time

 
**Disadvantages:**

- Requires know-how for cross-browser compatibility
- Requires countermeasures for browsers that cannot use AJAX (those that cannot use JavaScript and XMLHttpRequest)
- Difficulty in differentiation due to open-source JavaScript
- Limited functionality of HTTP client
- Security precautions are unavoidable
- Requires information about the current processing status
- Excessive requests can conversely increase server load
 
Changes from a 'web server-browser' structure to a 'web server-Ajax engine-browser' structure with Ajax positioned in between.

{{IMG:1}}
[Figure] Comparison of the traditional web application model and the Ajax web application model by Jesse James Garrett

 

**3. AJAX as an Alternative to ActiveX and Flash**
 
**RIA (Rich Internet Application):**
 (Internet technology that implements complex and sophisticated tasks difficult to achieve with HTML alone, thereby enriching websites) Refers to ActiveX, Flash, and Java applets.
 
 - ActiveX: Hassle of installation, only supports IE
 - Flash: Large size, slow speed
 - Java Applet: Requires Java Virtual Machine installation
 
**AJAX:**
 Since it uses XML, it is not restricted by device or browser and easily adheres to web standards. It also offers good compatibility and scalability.
 

**[Examples]**
Google Maps: [http://maps.google.com/](http://maps.google.com/)
Ajax-made board: [http://hooriza.com/sample/ajaxboard/](http://hooriza.com/sample/ajaxboard/)
Image resize JavaScript:
[http://www.agilepartners.com/blog/2005/12/07/iphoto-image-resizing-using-javascript/](http://www.agilepartners.com/blog/2005/12/07/iphoto-image-resizing-using-javascript/)
Image search site: [http://www.flickr.com](http://www.flickr.com/)
Shopping mall: [http://panic.com/goods/](http://panic.com/goods/)
Amazon search engine [http://a9.com/](http://a9.com/)
 
 
 
**4. Spread of AJAX**
** 
- In early 2005, Google used asynchronous communication as the basis for interactive applications, including Google Groups.
- The term Ajax appeared in the article AJAX: A new approach for a new application.
- Applications using Ajax as a tool for interactive web pages rapidly increased.
- This is partly because the availability of application toolkits (e.g., Ruby on Rails, DWR) has made it easier for programmers to implement.
- Adopted by portal companies, including Naver.
- IBM-Google-Yahoo launched the Open Ajax Project to promote Ajax: created Eclipse development tools.
 
 
**5. Implementation of Naver's Keyword Search Effect**
 
**- xmlhttp.js:** A script file that uses **XMLHttpRequest** to transmit user actions to the server and receive results from the server.
**- ajax_search.html:** The HTML displayed to the actual user, which collects information about client actions, passes it to functions within the xmlhttp.js file, and processes the results received from the server to send them appropriately to the user.
**- searchKeyword.jsp:** A file uploaded to the server that responds to functions in the xmlhttp.js file.
 
 {{IMG:2}}

**5.1 Naver's Keyword Search Effect : xmlhttp.js**
 
function paramEscape(paramValue) {
   return encodeURIComponent(paramValue); // Function to convert to URI_String
}
function formData2QueryString(docForm) {   // Script to generate a query
   var submitString = '';
   var formElement = '';
   var lastElementName = '';
  
   for(i = 0 ; i < docForm.elements.length ; i++)
   {
     formElement = docForm.elements[i];
     switch(formElement.type)
     {
        case 'text' : // When it's text... submitString += formElement.name + '=' + paramEscape(formElement.value) + '&';
           submitString += formElement.name + '=' + paramEscape(formElement.value) + '&';
           break;
     }
   }
   submitString = submitString.substring(0, submitString.length -1 ); // Remove one character from the end as there's an '&'
   return submitString;                              
}
 
 // The functions to create queries, the beginning of XMLHTTP.JS is identical to existing JavaScript.
 // You can skim this part, the important section starts below.
 
function xmlHttpPost(actionUrl, submitParameter, resultFunction)
{
   var xmlHttpRequest = false;     
   if(window.ActiveXObject)   xmlHttpRequest = new ActiveXObject('Microsoft.XMLHTTP');
   else  {
    xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.overrideMimeType('text/xml');    }  
   xmlHttpRequest.open('POST', actionUrl, true);
   xmlHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');  
 
   xmlHttpRequest.onreadystatechange = function() {  // Function based on xmlHttpRequest's state
     if(xmlHttpRequest.readyState == 4)
     {
        switch (xmlHttpRequest.status) 
        {// Implementation of processing logic using status code and data received from the server
           case 404 :  alert('Error: ' + actionUrl + ' does not exist');   break;
           case 500 :  alert('Error: ' + xmlHttpRequest.responseText);   break;
          default:
             eval(resultFunction + '(xmlHttpRequest.responseText);');
                // Function that passes xmlHttpRequest.responseText value to resultFunction
              break;    
        }       
     }
   }
   xmlHttpRequest.send(submitParameter); // Query transmission when xmlHttpRequest.readyState is 1
}
 
 
// Important parts are further explained in the image below (click to view)
 
***{{IMG:3}}***

**5.2 Naver's Keyword Search Effect: ajax_search.html**

<HTML><HEAD><META http-equiv="Content-Type" content="text/html;" charset="euc-kr">
<SCRIPT type="text/javascript" src="xmlhttp.js"></SCRIPT>
<SCRIPT Language="javascript">
<!--
function keywordKeyDown(){
    var keyCode = window.event.keyCode;
    // At the time of the Keydown event, the key value entered by the user has not yet been set in the TextField, so
    // wait a moment until the browser reacts to the event and sets the value.
    setTimeout('submitSearchKeyword()', 250);    // submitSearchKeyword executed after 250ms
}
function submitSearchKeyword(){
    // Sends the input value of the form to [http://jaso.co.kr/searchKeyword.jsp](http://jaso.co.kr/searchKeyword.jsp) and passes the received result to the viewSearchKeywordResult() function
    var url = 'http://jaso.co.kr/searchKeyword.jsp';  // Server URL
    var queryString = formData2QueryString(document.MAIN_FORM);  // Query generation
    var resultProcessMethod = 'viewSearchKeywordResult';    // Function to receive and execute results,
    xmlHttpPost(url, queryString, resultProcessMethod);  // Call function to send query to xmlHttpRequest via POST
}

function viewSearchKeywordResult(result) {  // Function to be sent as resultFunction
    // Here, result is the result received from [http://jaso.co.kr/searchKeyword.jsp](http://jaso.co.kr/searchKeyword.jsp)

  if(result == "")  {  // If there is no result, show as hidden
        var searchKeywordDiv = document.all("searchKeyword");
        searchKeywordDiv.innerHTML = "";
        searchKeywordDiv.style.visibility = "hidden";
    }
    else  {  // If there is a received result, store it in the result list, separated by '|'
        var resultList = result.split('|');
        var viewResult = '';
        for(i = 0 ; i < resultList.length; i++) { // Divide by length
          // The first line consists of the keyword name, the string "keyword list", and a line with a close function.
            if(i == 0)  viewResult += '<B>' + resultList[i] + '</B> <A href="javascript:hiddenSearchKeywordResult();">[닫기]</A><BR>'
            else    // Actually found keyword list
              viewResult += '<A href="javascript:setKeyword(\'' + resultList[i] + '\');">' + resultList[i] + '</A><BR>'
        }

        var searchKeywordDiv = document.all("searchKeyword");
            // div with id searchKeyword (located below)
        searchKeywordDiv.innerHTML = viewResult;
              // Insert viewResult value into DIV area as innerHTML
        searchKeywordDiv.style.visibility = "visible"; // View property for DIV area
    }
}


function hiddenSearchKeywordResult() { // Script to hide the area when "Close" is clicked
    var searchKeywordDiv = document.all("searchKeyword");
    searchKeywordDiv.innerHTML = "";
    searchKeywordDiv.style.visibility = "hidden";
}

function setKeyword(selectedKeyword) { // Script to insert the keyword into the input text when a keyword from the list is clicked
    document.MAIN_FORM.keyword.value = selectedKeyword;
}
//-->
</SCRIPT>

<STYLE type="text/css">
<!--
  .scroll_div { scrollbar-face-color:#FFFFFF; scrollbar-highlight-color: #aaaaaa; scrollbar-3dlight-color: #FFFFFF;
              scrollbar-shadow-color: #aaaaaa; scrollbar-darkshadow-color: #FFFFFF; scrollbar-track-color: #FFFFFF;
              scrollbar-arrow-color: #aaaaaa;}      -->
</STYLE> </HEAD>
<BODY onLoad="MAIN_FORM.keyword.focus()">
<FORM name="MAIN_FORM">
Try entering "가" or "강".</BR>
<INPUT type="text" name="keyword" onkeydown="keywordKeyDown()" style:width=150px" autocomplete="off"><A href="javascript:alert('검색처리');">Search</A>
<DIV id="searchKeyword" style="width:250px;height:100px;visibility:hidden;background-color:#D1EED2;overflow=auto;font-size:12px" class="scroll_div">
</DIV>
</FORM>
</BODY>
</HTML>

**5.3 Naver's Keyword Search Effect: searchKeyword.jsp**
: Source that receives text values from the server and sends back results

- Source that simply returns text results when '가' or '강' is received.
- Must be transmitted using UTF-8.

<%@ page contentType="text/html; charset=euc-kr" %>
<%@ page import="java.util.*" %>
<%

  HashMap keywordData = new HashMap();
  keywordData.put("가","강타|강일|가을소나타|강주희|강은비|강력3반|강동원|가격비교|가방|강수지");
  keywordData.put("강", "강타|강일|강주희|강은비|강력3반|강동원|가방|강수지");

    request.setCharacterEncoding("UTF-8");
    String keyword = request.getParameter("keyword");
    // Search for words starting with the corresponding keyword from the database here
    // In this example, for simplicity, it's handled by getting from a Hash
    String result = (String)keywordData.get(keyword);
    if(result == null)      result = "No keyword";

    out.print(keyword + " Keyword List|" + result);
%>

{{IMG:4}}

[Figure] Check results by entering 1 in Keyword

*** Please be sure to cite the source when reposting.**