---
date: "2011-04-07"
titleKo: "[특허] 웹 이미지 및 페이지 OCR및 OpenAPI (웹 페이지에 포함되는 이미지 상의 텍스트를 판독하고 이에 대한 번역 서비스를 제공하기 위한 방법, 장치 및 컴퓨터 판독 가능한 기록 매체) 아이디어/특허 / IT이야기"
titleEn: "[Patent] Web Image and Page OCR"
category: it
tags: []
images:
  - /desk/20110407-특허-웹-이미지-및-페이지-ocr및-openapi-웹-페이지에-포함되는-이미지-상의-텍스트/01.webp
  - /desk/20110407-특허-웹-이미지-및-페이지-ocr및-openapi-웹-페이지에-포함되는-이미지-상의-텍스트/02.webp
  - /desk/20110407-특허-웹-이미지-및-페이지-ocr및-openapi-웹-페이지에-포함되는-이미지-상의-텍스트/03.webp
thumbnail: /desk/20110407-특허-웹-이미지-및-페이지-ocr및-openapi-웹-페이지에-포함되는-이미지-상의-텍스트/01.webp
sourceCategoryNo: "15"
sourceCategory: 아이디어/특허
externalUrl: https://blog.naver.com/fstory97/70106437847
---

<!-- ko -->
**     웹 페이지에 포함되는 이미지 상의 텍스트를 판독하고 이에 대한 번역 서비스를 제공하기 위한 방법, 장치 및 컴퓨터 판독 가능한 기록 매체  (METHOD, APPARATUS AND COMPUTER-READABLE RECORDING MEDIUM FOR READING TEXT ON IMAGE CONTAINED IN WEB PAGE AND PROVIDING TRANSLATION SERVICE ON SAME TEXT)****
출원번호(출원일) 10-2008-0033923  (2008.04.11)
등록번호(등록일) 10-0953627  ****** **** **1.
****제목 : 웹 이미지 및 페이지 OCR및
OpenAPI**

2.     **기존 :  **현 상용 OCR은 독립
어플리케이션으로 되어 있고, 이미지를 파일로 로딩하여 OCR 작업을
수행 후, 정해진 파일 포맷을 로컬 하드디스크에 저장하게 되거나, 선행
특허의 경우, 파일을 업로드 하여 OCR의 결과를 받아보는
시스템으로 되어있다.

**3.
****차이점 **

1)     파일을
업로드 하지 않는다.

-       네이버
일본어 번역 처럼, 페이지의 URL을 입력 받는다.

: 해당 웹페이지내에서
이미지 파일들만 OCR로 처리하여 페이지를 재구성하여 리턴한다.

-       이미지
파일 URL을 입력 받아서 해당 이미지 파일만 OCR한 결과를
리턴 할 수도 있다.

2)     OpenAPI의 활용

-       [http://openocr.naver.com/ocr.nhn?url=http://myhomepage.net/](http://openocr.naver.com/ocr.nhn?url=http://myhomepage.net/)논문.img?language=kor,eng&font=myongjo,arail?outputtype=xml

위와
같이 입력시 리턴 값은 해당 이미지를 XML이나 HTML파일로
리턴 하는 서비스를 말한다.

l  기존 OpenAPI를 이용한 단순한 OCR 활용이라고 할 수도 있겠다.

-       입력값은
이미지 소스를 다운로드 받을수 있는 URL

-       언어나, 폰트, 혹은 텍스트 영역정보 같은
OCR엔진에 의존적인 정보들을 포함 할 수 있다.

이때, 이러한 정보들은 OCR엔진에 따라
OpenAPI규칙을 만들도록 한다.

**http://opencast.naver.com/FS565****[****](http://www.hanrss.com/add_sub.qst?url=http%3A%2F%2Fblog.rss.naver.com%2Ffstory97.xml)** {{IMG:1}}

http://search.allblog.net/?keyword=%EC%88%B2%EC%86%8D%EC%96%98%EA%B8%B0&view=issue&type=100

{{IMG:2}}

http://www.blogkorea.net/bnmsvc/user_bloglist.do?userNum=548520&amp;rssSeq=575708&amp;gubun=A&amp;pages=1

{{IMG:3}}

http://mixsh.com/media/53844

****

<!-- en -->
**     Method, Apparatus, and Computer-Readable Recording Medium for Reading Text on Images Contained in Web Pages and Providing Translation Services for the Same Text  (METHOD, APPARATUS AND COMPUTER-READABLE RECORDING MEDIUM FOR READING TEXT ON IMAGE CONTAINED IN WEB PAGE AND PROVIDING TRANSLATION SERVICE ON SAME TEXT)**
Application Number (Application Date) 10-2008-0033923 (2008.04.11)
Registration Number (Registration Date) 10-0953627 ****** **** **1.    
****Title: Web Image and Page OCR and OpenAPI**

 

2.     **Existing:  **Current commercial OCRs are standalone applications, and after loading an image as a file to perform OCR, they either save the results in a specified file format to a local hard disk, or, in the case of prior patents, they are systems where files are uploaded to receive OCR results.

 

**3.    
****Differences**

1)     No file upload.

-       Like Naver Japanese Translation, it receives the URL of a page as input.

: It processes only image files within that webpage using OCR, reconstructs the page, and returns it.

-       It can also receive an image file URL as input and return only the OCR result for that specific image file.

 

2)     Utilization of OpenAPI

-       [http://openocr.naver.com/ocr.nhn?url=http://myhomepage.net/](http://openocr.naver.com/ocr.nhn?url=http://myhomepage.net/)thesis.img?language=kor,eng&font=myongjo,arail?outputtype=xml

When inputting as above, the return value refers to a service that returns the corresponding image as an XML or HTML file.

l It could also be described as a simple utilization of OCR using existing OpenAPI.

-       The input value is a URL from which the image source can be downloaded.

-       It can include OCR engine-dependent information such as language, font, or text region information.

In this case, these pieces of information are used to create OpenAPI rules according to the OCR engine. 

**http://opencast.naver.com/FS565****[****](http://www.hanrss.com/add_sub.qst?url=http%3A%2F%2Fblog.rss.naver.com%2Ffstory97.xml)** {{IMG:1}}

http://search.allblog.net/?keyword=%EC%88%B2%EC%86%8D%EC%96%98%EA%B8%B0&view=issue&type=100

 {{IMG:2}}

http://www.blogkorea.net/bnmsvc/user_bloglist.do?userNum=548520&amp;rssSeq=575708&amp;gubun=A&amp;pages=1

 {{IMG:3}}

http://mixsh.com/media/53844