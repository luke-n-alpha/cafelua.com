---
date: "2006-06-24"
titleKo: About JNI 주인장 작업물 / IT이야기
titleEn: "About JNI: My Work / IT Story"
category: it
tags:
  - 주인장 작업물
images:
  - http://tfile.nate.com/download.asp?FileID=10805097
  - http://tfile.nate.com/download.asp?FileID=10805098
  - http://tfile.nate.com/download.asp?FileID=10805099
  - http://tfile.nate.com/download.asp?FileID=10805100
  - http://tfile.nate.com/download.asp?FileID=10805101
thumbnail: http://tfile.nate.com/download.asp?FileID=10805097
sourceCategoryNo: "16"
sourceCategory: 주인장 작업물
externalUrl: https://blog.naver.com/fstory97/70005442930
---

<!-- ko -->
본 자료는 KNI를 이용한 프로젝트를 한다고 해서 뭔가 알아보았다.
하지만, 정작 프로젝트를 할때는 거의 KNI를 쓰지 않았다 OTL

**1. JNI (Java Native Interface) 란 ?**
- 자바가 다른 언어로 만들어진 어플리케이션과 상호 작용할 수 있는 인터페이스를 제공한다.
- 자바가상머신(JVM)이 원시 메소드(native method)를 적재(locate)하고 수행(invoke)할 수 있도록 한다
- JNI가 자바가상머신내에 포함됨으로써, 자바가상머신이 호스트 운영체제상의 입출력, 그래픽스, 네트워킹, 그리고 스레드와 같은 기능들을 작동하기 위한 로컬시스템호출(local system calls)을 수행할 수 있도록 한다.

*** 쉽게 말해 Java와 다른 언어를 연동하는 솔루션입니다. **

{{IMG:1}}
[그림1] C로 만들어진 Library와 JAVA를 연결해주는 JNI

****
****
**2. Why do you need JNI ?**

자바 네이티브 메쏘드(Java Native method, 이하 JNI)는 다른 언어로 작성된 코드를 자바에서 호출하도록 만들어진 규약이다. 현재는 C/C++에 대한 호출만을 정확하게 지원한다. 어떻게 보면 JNI는 자바가 만들어진 철학과 정반대되는 것이다.

그러나. **Java에도 한계**가 있다.

**1. 속도 문제가 있는 계산 루틴**
> 자바가 Native Code(플랫폼에 종속적인 기계어 코드)에 비해 느리다.

**2. 자바에서 하드웨어 제어**

**3. 자바에서 지원되지 않은 특정 운영체제 서비스**
> 자바의 클래스 라이브러리는 방대하고 다양한 서비스를 제공하지만, 특정 플랫폼에서 제공하는 고유의 서비스의 기능을 모두 포함할 수는 없다. 특히, 특수한 목적으로 제작된 하드웨어를 자바에서 제어해야 할 필요가 있다고 한다면, 자바만으로 해결하기는 힘들다.

**4. 기존의 프로그램에서 자바가 제공하는 서비스를 이용**
> 기존에 작성된 프로그램이나 기존의 시스템(legacy)과의 연계 문제

∴ JNI를 써서 해결해보자.

****
**3. C를 이용한 JNI 예제**
VC++을 이용해 C문법으로 작성되어 만들어진 DLL을 로딩하여 Java에서 사용해보겠습니다.

**1단계 : Native Method를 선언하는 자바 클래스 작성
2단계 : 1단계에서 작성한 클래스 컴파일
3단계 : javah를 사용해서 Native Method가 사용할 헤더 파일 생성
4단계 : C언어로 Native Method 실제 구현
5단계 : C 코드와 헤더 파일을 컴파일
6단계 : 자바 프로그램 실행**

****
**1단계 : Native Method를 선언하는 자바 클래스 작성**
Java 소스 파일 : **HelloJni_Jsource.java**

import java.util.*;
class HelloJniClass {
native void Hello();
static {  System.loadLibrary("Hello_DLL");   }
public static void main(String args[]) {
HelloJniClass myJNI=new HelloJniClass();
myJNI.Hello();

// 아래는 좀 위의 내용 보충 그림
{{IMG:2}}

**2단계 : 1단계에서 작성한 클래스 컴파일**
{{IMG:3}}

* 컴파일시에는 일반 java 컴파일때와 마찬가지로 환경변수 셋팅이 되어 있어야 합니다.
-> Path가 JDK의 Javac.exe가 있는 폴더에 설정되어 있어야 합니다.

**3단계 : javah를 사용해서 Native Method가 사용할 헤더 파일 생성**
****
**{{IMG:4}}**
HelloJniClass.h을 열어보면
JNIEXPORT void JNICALL Java_HelloJniClass_Hello  (JNIEnv *, jobject);
위의 함수를 Implement만 해서 DLL을 만들면 됩니다. (4단계)

**4단계 : C언어로 Native Method 실제 구현(1)**
1) VC++ 프로젝트 만들기 : Win32용 DLL 프로젝트로 만듭니다.
New - Projects : Win32 Dynamic-Link Library

2) Add Files Projects : HelloJniClass.h 파일 추가

3) Projects Setings(Alt+F7)
- Link탭에 Output file Name : 1단계의 2. 라이브러리 적재시 작성한 DLL파일명(Hello_DLL.dll)
- C/C++탭 Preprocessor 카테고리의 Additional Include directories
JDK의 Include폴더와 Include폴더 밑의 win32폴더
예) C:\Program Files\Java\jdk1.5.0_03\include\,
C:\Program Files\Java\jdk1.5.0_03\include\win32

{{IMG:5}}

4. 값의 전달과 리턴
****
**1단계 : Java 소스 파일 StringPass_Jsource.java**
* 일반 자바 메쏘드 선언과 동일합니다.

class JNI_Message {
native byte[] Message(String input);
// 라이브러리 적재(Load the library)

static {
System.loadLibrary("Msg_DLL");

public static void main(String args[]) {
byte buf[];
// 클래스 인스턴스 생성(Create class instance)
JNI_Message myJNI=new JNI_Message();
// 원시 메소드에 값을 주고 받음
buf = myJNI.Message("Apple");

System.out.print(buf); // 받은값 출력

**2단계 : 컴파일**
javac StringPass_Jsource.java
****
**3단계 : header파일 생성
** javah JNI_Message

**4단계 : method구현 : StringJNIDLLSource.c
**
#include <stdio.h>
#include <jni.h>
#include <string.h>
#include "JNI_Message.h"
JNIEXPORT jbyteArray JNICALL Java_JNI_1Message_Message (JNIEnv * env, jobject jobj, jstring input)
jbyteArray jb;
jboolean iscopy;
char* buf;
static char outputbuf[20];

buf=(*env)->GetStringUTFChars(env, input, &iscopy);  // 입력 String 읽어오는 함수
printf ("\nDLL receive Data from JAVA : %s\n",buf);   // 입력받은 내용을 출력
strcpy(outputbuf,"Delicious !!\n");
jb=(*env)->NewStringUTF(env, outputbuf);  // 출력할 내용의 java버퍼에 output버퍼값을 셋팅

return(jb); // java버퍼 리턴

(*env)->함수명 형태로, JAVA의 메쏘드를 C에서 이용할수 있습니다.
* JAVA는 C로 문자열을 넘겨줄때 UTF-8형태를 사용합니다.

**5단계 : 실행 **
C:\test\C_JNI\Paramerter Pass>java JNI_Message
DLL receive Data from JAVA : Apple
Delicious !!

5. KVM ? KNI ?
KVM은 J2ME의 일부로서 작고 자원이 한정된 기계장치를 위해 설계된 소형 JVM.
JVM에서는 JNI가 KVM의 KNI가 있다.

**6. 기타프로그래밍 이슈들**
참고 URL :http://www.javastudy.co.kr/docs/jhan/javaadvance/jni.html
언어적 이슈(Language Issues)
메소드 호출(Calling Methods)
필드의 참조(Accessing Fields)
스레드와 동기화(Threads and Synchronization)
메모리 이슈(Memory Issues)
수행(Invocation)
스레드 연결(Attaching Threads)

<!-- en -->
This material was created because I was told to do a project using KNI, so I looked into it.
However, when I actually did the project, I hardly used KNI OTL

**1. What is JNI (Java Native Interface)?**
- It provides an interface that allows Java to interact with applications written in other languages.
- It enables the Java Virtual Machine (JVM) to locate and invoke native methods.
- By including JNI within the JVM, it allows the JVM to perform local system calls to operate functions such as I/O, graphics, networking, and threads on the host operating system.

*** Simply put, it's a solution for linking Java with other languages. **

{{IMG:1}}
[Figure 1] JNI connecting a C-made Library with JAVA

****
****
**2. Why do you need JNI?**

Java Native Method (hereinafter JNI) is a convention created to allow Java to call code written in other languages. Currently, it accurately supports calls only to C/C++. In some ways, JNI is the opposite of the philosophy behind Java.

However, **Java also has limitations**.

**1. Computation routines with speed issues**
> Java is slower than Native Code (platform-dependent machine code).

**2. Hardware control in Java**

**3. Specific operating system services not supported by Java**
> While Java's class libraries are extensive and provide a wide range of services, they cannot include all the unique service functionalities provided by specific platforms. In particular, if there is a need to control hardware designed for special purposes from Java, it is difficult to solve it with Java alone.

**4. Using services provided by Java in existing programs**
> Issues with linking to existing programs or legacy systems.

∴ Let's try to solve this using JNI.

****
**3. JNI Example using C**
We will load a DLL created with C syntax using VC++ and use it in Java.

**Step 1: Write a Java class that declares Native Methods**
**Step 2: Compile the class written in Step 1**
**Step 3: Use javah to generate a header file for Native Methods**
**Step 4: Implement Native Methods in C language**
**Step 5: Compile C code and header files**
**Step 6: Run the Java program**

****
**Step 1: Write a Java class that declares Native Methods**
Java Source File: **HelloJni_Jsource.java**

```java
import java.util.*;
class HelloJniClass {
  native void Hello();
  static {  System.loadLibrary("Hello_DLL");   }
  public static void main(String args[]) {     
      HelloJniClass myJNI=new HelloJniClass();
      myJNI.Hello();
   }
}
```

// The image below supplements the content above
{{IMG:2}}

**Step 2: Compile the class written in Step 1**
{{IMG:3}}

* When compiling, environment variables must be set, just like with regular Java compilation.
 -> The Path must be set to the folder where JDK's Javac.exe is located.

**Step 3: Use javah to generate a header file for Native Methods**
****
**{{IMG:4}}**
If you open HelloJniClass.h, you will see:
`JNIEXPORT void JNICALL Java_HelloJniClass_Hello (JNIEnv *, jobject);`
You just need to implement the above function to create a DLL. (Step 4)

**Step 4: Actual Implementation of Native Method in C language (1)**
1) Create a VC++ project: Create a Win32 DLL project.
New - Projects: Win32 Dynamic-Link Library

2) Add Files to Project: Add HelloJniClass.h file.

3) Project Settings (Alt+F7)
  - Link tab, Output file Name: The DLL file name written during library loading in Step 1 (Hello_DLL.dll)
  - C/C++ tab, Preprocessor category, Additional Include directories
     JDK's Include folder and the win32 folder under the Include folder
     Example) C:\Program Files\Java\jdk1.5.0_03\include\,
              C:\Program Files\Java\jdk1.5.0_03\include\win32

{{IMG:5}}

**4. Passing and Returning Values**
****
**Step 1: Java Source File StringPass_Jsource.java**
* Declared the same as a general Java method.

```java
class JNI_Message {
  native byte[] Message(String input);
  // Load the library 

  static {
    System.loadLibrary("Msg_DLL");
  }
  
  public static void main(String args[]) {     
  byte buf[];
    // Create class instance
    JNI_Message myJNI=new JNI_Message();
    // Pass and receive values to/from native method
    buf = myJNI.Message("Apple");
   
  System.out.print(buf); // Print received value
  }
}
```

**Step 2: Compile**
`javac StringPass_Jsource.java`
****
**Step 3: Generate header file**
`javah JNI_Message`

**Step 4: Implement method: StringJNIDLLSource.c**

```c
#include <stdio.h>
#include <jni.h>
#include <string.h>
#include "JNI_Message.h"
JNIEXPORT jbyteArray JNICALL Java_JNI_1Message_Message (JNIEnv * env, jobject jobj, jstring input) 
{
    jbyteArray jb;
    jboolean iscopy;
    char* buf;  
    static char outputbuf[20];
  
    buf=(*env)->GetStringUTFChars(env, input, &iscopy);  // Function to read input String
    printf ("\nDLL receive Data from JAVA : %s\n",buf);   // Print received content
    strcpy(outputbuf,"Delicious !!\n"); 
    jb=(*env)->NewStringUTF(env, outputbuf);  // Set output buffer value to Java buffer for output
  
   return(jb); // Return Java buffer
}
```

You can use Java methods in C in the form `(*env)->functionName`.
* JAVA uses UTF-8 format when passing strings to C.

**Step 5: Execute**
```
C:\test\C_JNI\Paramerter Pass>java JNI_Message
DLL receive Data from JAVA : Apple
Delicious !!
```

**5. KVM? KNI?**
KVM is part of J2ME, a small JVM designed for small, resource-constrained devices.
JVM has JNI, and KVM has KNI.

**6. Other Programming Issues**
Reference URL: http://www.javastudy.co.kr/docs/jhan/javaadvance/jni.html
Language Issues
Calling Methods
Accessing Fields
Threads and Synchronization
Memory Issues
Invocation
Attaching Threads