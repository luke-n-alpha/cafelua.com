---
date: "2008-11-20"
titleKo: crontab을 이용해 데드락 상태를 체크하고 복원해보자. 주인장 작업물 / IT이야기
titleEn: Let's Check and Recover Deadlocks Using Crontab
category: it
tags:
  - 주인장 작업물
images: []
sourceCategoryNo: "16"
sourceCategory: 주인장 작업물
externalUrl: https://blog.naver.com/fstory97/70037640184
---

<!-- ko -->
**1. 미션 : crontab을 이용해 데드락 상태를 체크하고 복원해보자.**

**2. 내용 :** 우리 프로젝트를 하다보니, 분산을 이용해 여러개의 프로세스가 동작한다. 한데, 프로그램이 잘못 짜여 deadlock상태에 빠져버리면,
순식간에 리소스 하나가 먹통이 되어 버린다. 나머지 리소스가 있으니 일단 돌아가겠지만, 이를 놓아두면 점점 늘어날테니 곤란하다.
프로그램 자신이 자기가 Deadlock 상태인지 알기는 사실상 어렵다. 때문에 외부의 프로그램을 crontab에 정기적으로 실행해
해당 리소스를 죽이고 다시 리소스를 복원하는 방법을 구현해 보았다.

****
**3. 참조 URL**

**4. 조건 :** Deadlock 이 걸리는 위치를 대강 예측 가능 해야 하며, Limit 시간을 넘으면 Deadlock으로 간주한다.

위와 같은 코드가 수십개가 돌아가고 있고, 해당 리소스가 데드락 상태에 빠지면, 그 것을 디텍트 해내고, 해당 코드를 다시 실행 하고 싶다.
MyWork()가 Limit 시간을 넘기도록 수행하고 있으면, 해당 work프로세스를 죽이고, 새로운 work를 띄워 리소스 개수를 일정하게 맞춘다.

**5. 솔루션
** **1) 일의 시작 시간과 끝시간을 기록하자.**

*  EndJob() : 본인의 경우 간단히, ./process/pid.proc 파일을 삭제하는 기능만 구현했다.
*  StartJob() : 본인의 경우 간단히 ./process/pid.proc 파일을 만들고, 그 안에 time(NULL)을 기록해 시간을 기록해 두었다.
**
2) Limit 시간을 넘긴 Work가 있는지 체크하는 프로그램**

** 3) Crontab을 이용해 해당 프로세스 체커를 3분마다 하도록 스케쥴에 등록**

**6. 단점**
1) result=take_myWork();  안에서 Deadlock 상태에 빠지면 방법이 없다.
2) pid 만 가지고 kill 을 하기 때문에 프로세스가 데드락 상태에서 시간을 기록해두고 process_cheker가 아닌 다른 사용자나 다른 이유로 해당 Process가 죽는 경우, 해당 pid의 시간 기록 파일이 남아있게 된다.
이 후, 다른 제3의 프로그램이 해당 pid로 활성화 되고, 그 이후에 crontab에 의헤 process_checker가 돌면
process_checker는 데드락 상태의 pid 기록만 보고 그 pid를 획득한 제3의 프로그램을 kill 시키게 된다.
=> 때문에, pid뿐만 아니라 process_name을 검사하는 기능을 추가로 구현할 필요가 존재한다.
(귀찮아서 skip)

* 파일로 체크했는데.. fopen에서 예외가 발생하는 바람에 이방법을 쓰지는 못했다.
결국은 사용한게 Database였다. OTL. 구현방법은 똑같다.

<!-- en -->
**1. Mission: Let's check for and recover from a deadlock state using crontab.**

**2. Content:** As we were working on our project, multiple processes were running using distribution. However, if a program is poorly written and falls into a deadlock state, one resource quickly becomes unresponsive. While the remaining resources will continue to operate for now, it will become problematic if left unchecked, as the number of deadlocked resources will increase. It is virtually impossible for a program to know if it is in a deadlock state. Therefore, I implemented a method to regularly run an external program via crontab to kill the affected resource and then restore it.

****
**3. Reference URL**

**4. Conditions:** The approximate location where a deadlock occurs must be predictable, and if the limit time is exceeded, it is considered a deadlock.

If dozens of codes like the above are running, and a resource falls into a deadlock state, I want to detect it and restart the corresponding code. If MyWork() is running beyond the limit time, the work process should be killed, and a new work process launched to maintain a consistent number of resources.

**5. Solution**
**1) Let's record the start and end times of the work.**

* EndJob() : In my case, I simply implemented the function to delete the ./process/pid.proc file.
* StartJob() : In my case, I simply created the ./process/pid.proc file and recorded time(NULL) inside it to log the time.

**2) Program to check if there is any Work that has exceeded the Limit time**

**3) Register the process checker to run every 3 minutes in the schedule using Crontab**

**6. Drawbacks**
1) If a deadlock occurs within result=take_myWork();, there is no solution.
2) Because killing is done only with the PID, if a process records its time in a deadlock state and then dies due to another user or reason (not process_checker), the time record file for that PID remains. Subsequently, if another third-party program activates with that PID, and then process_checker runs via crontab, process_checker will only see the deadlock PID record and kill the third-party program that acquired that PID.
=> Therefore, there is a need to implement an additional function to check not only the PID but also the process_name.
(Skipped due to laziness)

* I tried checking with files... but an exception occurred in fopen, so I couldn't use this method.
Ultimately, I used a Database. OTL. The implementation method is the same.