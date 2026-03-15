---
date: "2008-08-19"
titleKo: Centos에 SVN을 사용한 Eclipse CDT 설치가이드 주인장 작업물 / IT이야기
titleEn: Eclipse CDT Installation Guide with SVN on Centos
category: it
tags:
  - 주인장 작업물
images: []
sourceCategoryNo: "16"
sourceCategory: 주인장 작업물
externalUrl: https://blog.naver.com/fstory97/70034172413
---

<!-- ko -->
**리눅스 (CentOS)에서 IDE환경을 꾸며 보자!**
**Centos에 SVN을 사용한 Eclipse CDT 설치가이드**
****
:  본 자료는 windows로 수행한 c++ 프로젝트를 linux로 수행하기 위해 본인이 삽질을 한 결과이다.
VC++ 의 셋팅 방법은 여기저기서 찾아볼 수 있었는데, 한글로 된 linux IDE툴에 대한 셋팅 방법은 찾기 쉽지 않았다. 이런 불친절한 리눅스 유저들 같으니라구....

작성자: 숲속얘기 [fstory97@naver.com](mailto:fstory97@naver.com)
원작자 블로그 : [http://blog.naver.com/fstory97](http://blog.naver.com/fstory97)

**1. 이클립스 설치**
1) **Centos는 전체 설치** 되어 있을것 : Java와 각종 library 설치의 수고를 덜 수 있다.
: 테스트 환경 (CentOS 4.6 64bit)

2) **EasyEclipse** : 압축만 풀면 된다. (다른 프로그램은 설치가 쉽지 않았다.)
참고 : [http://www.easyeclipse.org/site/home/](http://www.easyeclipse.org/site/home/)
다운로드 url :
[http://sourceforge.net/project/downloading.php?group_id=131065&filename=easyeclipse-cplusplus-1.3.1.1.tar.gz](http://sourceforge.net/project/downloading.php?group_id=131065&filename=easyeclipse-cplusplus-1.3.1.1.tar.gz)

3) **SubClipse** 플러그인 복사 : subversion 을 사용하기 위한 플러그인
다운로드 : [http://www.easyeclipse.org/site/plugins/subclipse.html](http://www.easyeclipse.org/site/plugins/subclipse.html)
압축을 풀어 EasyEclipse와 동일한 폴더에 복사해 넣으면 된다.

**2. 프로젝트 생성
** : 프로젝트에 대한 정보는 해당 폴더에 .metaDaata 란 폴더가 생성되어 들어가게 된다.
(해당 폴더는 hidden이므로 모두보기를 해야만 보인다.)
**  메뉴 클릭 : File - New - Project - SVN
**  (우리는 SVN 으로 작업할거기 때문에)

**3. SVN 설정** (SVN 을 쓰지 않는 경우 3번,5번은 skip 하면 된다.)
1) Checkout Projects from SVN - Create a new repository location
2) URL입력 : SVN repository의 URL 입력
3) 해당 URL 선택 - Finish

**4. 프로젝트 선택**
- SVN 설정 완료 후, 자동으로 소스 프로젝트 선택이 뜸
1) C++ - C++ Project
2) Executeable - LinuxGCC 선택 (Linux GCC 선택해야 해당 컴파일러로 컴파일함, 컴파일러 설정 옵션임)
3) Project name : nhnOCR 입력 (워크스페이스 밑에 nhnOCR 폴더가 생기며 프로젝트가 생김)
4) Finish

**5. 자동으로 Checkout 되면서 SVN repository로 부터 파일들이 다운로드 된다.**

**6. 프로젝트 이름 설정 **
Use default location 끄고, 원하는 프로젝트의 정보가 위치할 폴더를 설정한다.
Next
Finish
** * 새로운 프로젝트를 추가시, File-New-Project를 선택하여 4번, 6번과 동일하게 수행**

**7. 프로젝트 설정
** : 프로젝트 익스플로러에서 마우스 오른쪽키를 누르고, Properties를 클릭
** 1) Source,include,Library 위치 설정 **
**    **: VC++에서 Path 정하는것과 같은 개념이다.
C/C++ General - Path and Symbols
- Includes : include 폴더
- Library paths : library 폴더
- Source Location : 소스 위치 설정, 설정 하지 않을시, 프로젝트 폴더가 기본 소스폴더가 된다.
(빌드 폴더와 소스 위치가 다를 경우 사용하면 된다.)

** 2) Define 설정및 추가 경로 설정
**  GCC C++ Build - Settings
- GCC Preprocessor : Define 추가
_LINUX_ 등의 컴파일 옵션 추가 하면 됨
- GCC C++ Compiler - Directories : Inlude 가 필요한 해당 Path 추가
OcrModule/Src 추가 (상대경로는 아직 잘 모르겠음: 기준은 프로젝트의 경로일거라고 예상됨)
FileBrowsing을 사용시 절대 경로가 입력됨
- GCC C++ Linker : Libraries  필요한 library 를 추가함
library 파일명이 LibModule.a 라고 할때, Libarary 파일명은 앞의 Lib와 확장자를 제외한 Module 이어야 함

**8. 빌드
** Ctrl + B 를 누르면 빌드가 되고 에러가 Console창에 뜸
* Project - Build Automatically 를 꺼두면 자동 빌드는 Disabled된다.

**9. 디버그
** F11 을 누르면 디버그가 가능
VC++ 과 비슷하여 어렵지 않으며, Break 는 마우스나 단축키 이용가능

**10. Subversion에 만든 프로젝트와 새 소스 추가
** Project Explorer 창에 만들어놓은 패스로 가면, 변경 폴더/파일이 표시 되어 있음
마우스 오른쪽 키를 누르고 Team - commit 하면 해당 내용이 반영됨

**ps.. 여기까지 했으면 VC++ 유저라도 일단 작업할 환경은 갖추어줬다.**
**설치 과정 중에 빼먹은게 혹시 있으면 연락 부탁드립니다. 질문은 아는게 없어서 사절합니다.**

<!-- en -->
**Let's set up an IDE environment in Linux (CentOS)!**
**Eclipse CDT Installation Guide using SVN on CentOS**
**** 
 : This document is the result of my own struggles to run a C++ project, originally developed on Windows, on Linux.
While VC++ setup methods were easy to find everywhere, setting up a Linux IDE tool in Korean was hard to find. Oh, these unfriendly Linux users...
 
Author: 숲속얘기 [fstory97@naver.com](mailto:fstory97@naver.com)
Original Author's Blog: [http://blog.naver.com/fstory97](http://blog.naver.com/fstory97)
 
**1. Eclipse Installation**
 1) **CentOS should be fully installed**: This saves the effort of installing Java and various libraries.
  : Test Environment (CentOS 4.6 64bit)

 2) **EasyEclipse**: Just extract the archive. (Other programs were not easy to install.)
   Reference: [http://www.easyeclipse.org/site/home/](http://www.easyeclipse.org/site/home/)
   Download URL: 
[http://sourceforge.net/project/downloading.php?group_id=131065&filename=easyeclipse-cplusplus-1.3.1.1.tar.gz](http://sourceforge.net/project/downloading.php?group_id=131065&filename=easyeclipse-cplusplus-1.3.1.1.tar.gz)
 
 3) Copy **SubClipse** plugin: A plugin for using Subversion
  Download: [http://www.easyeclipse.org/site/plugins/subclipse.html](http://www.easyeclipse.org/site/plugins/subclipse.html)
    Extract the archive and copy it into the same folder as EasyEclipse.
 
**2. Project Creation**
 : Project information will be stored in a folder named .metadata within the project directory.
(This folder is hidden, so you need to enable 'show hidden files' to see it.)
** Menu Click: File - New - Project - SVN**
  (Because we will be working with SVN)
 
**3. SVN Configuration** (If you are not using SVN, you can skip steps 3 and 5.)
 1) Checkout Projects from SVN - Create a new repository location
 2) Enter URL: Enter the URL of the SVN repository
 3) Select the URL - Finish
 
**4. Project Selection**
 - After SVN configuration is complete, the source project selection will automatically appear.
 1) C++ - C++ Project
 2) Executable - Select LinuxGCC (You must select Linux GCC for it to compile with that compiler; this is a compiler setting option.)
 3) Project name: Enter nhnOCR (An nhnOCR folder will be created under the workspace, and the project will be created.)
 4) Finish
 
**5. Files will be automatically checked out and downloaded from the SVN repository.**
 
**6. Project Name Setting**
  Uncheck 'Use default location' and set the folder where you want the project information to be located.
  Next
  Finish
** * When adding a new project, select File-New-Project and follow steps 4 and 6.**
 
**7. Project Settings**
 : Right-click on the project in the Project Explorer and click Properties.
** 1) Source, Include, Library Location Settings**
**    **: This is the same concept as setting paths in VC++.
  C/C++ General - Path and Symbols 
   - Includes: include folder
   - Library paths: library folder
   - Source Location: Set source location. If not set, the project folder becomes the default source folder.
                                           (Use this if the build folder and source location are different.)

** 2) Define Settings and Additional Path Settings**
  GCC C++ Build - Settings
 - GCC Preprocessor: Add Define 
                      Add compile options like _LINUX_.
 - GCC C++ Compiler - Directories: Add the required Include Path.
  OcrModule/Src Add (Relative paths are still unclear: I assume the base is the project path)
  When using FileBrowsing, absolute paths are entered.
 - GCC C++ Linker: Libraries - Add required libraries.
   If the library filename is LibModule.a, the library name should be 'Module', excluding 'Lib' and the extension.
 
**8. Build**
 Press Ctrl + B to build, and errors will appear in the Console window.
 * If 'Project - Build Automatically' is unchecked, automatic builds are disabled.
 
**9. Debug**
 Press F11 to debug.
 It's similar to VC++, so it's not difficult, and breakpoints can be set using the mouse or hotkeys.
 
**10. Add Created Project and New Source to Subversion**
 In the Project Explorer window, navigate to the path you created, and changed folders/files will be displayed.
 Right-click and select Team - Commit to reflect the changes.

 
**P.S. If you've followed these steps, even a VC++ user will have a working environment.**
**If anything was missed during the installation process, please contact me. I decline questions as I don't know much.**