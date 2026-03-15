---
date: "2009-02-06"
titleKo: CronTab을 이용해 좀비 프로세스 죽이기 주인장 작업물 / IT이야기
titleEn: Killing Zombie Processes with CronTab
category: it
tags:
  - 주인장 작업물
images: []
sourceCategoryNo: "16"
sourceCategory: 주인장 작업물
externalUrl: https://blog.naver.com/fstory97/70041737592
---

<!-- ko -->
**1. 제목 : CronTab을 이용해 좀비 프로세스 죽이기**

**2. 조건**
1) 프로세스의 소유자와 이름을 알고 있다.
2) 일정 시간 이상 초과한 프로세스를 좀비 프로세스로 취급한다.

**3. 방법**
1) ps -ef | grep ProcessName을 이용하여 해당 프로세스의 수행시간을 확인한다.
2) 수행시간이 예정된 시간 보다 초과한 경우 kill 시킨다.
3) 1,2번의 작업을 crontab에 등록하여 자동으로 일정 시간 초과된 프로세스를 죽인다.

**4. 예제 상황**
1) 프로세스의 이름 : myprocess
2) 유저 이름 : fstory
3) 프로세스의 limit 시간 : 5분
4) crontab 수행 시간 : 3분
- 프로세스는 5분이 넘으면 좀비로 본다. 배치셸은 3분마다 동작하므로, 좀비 프로세스는 최악의 경우에는 8분까지 살아 있을 수 있다.
5) 배치셸의 이름 : process_check.sh

**5. 배치 셸 작성**
process_checker.sh

**6  crontab 에 등록 (실행 주기는 3분으로 설정)**
crontab -e

**7. 해당 shell의 문제점**
1) user명을 기준으로 개행을 확인하므로, user명과 같은 process명이 오면 곤란하다.
2) 하루 이상 지난 프로세스가 있는 경우, 시간출력 포맷이 달라지므로 분의 추출 파싱이 달라지므로 정상 동작하지 않는다.

**8. Thank you**
1) 관련 url : crontab을 이용해 데드락 상태를 체크하고 복원해보자.

[http://blog.naver.com/fstory97/70037640184](http://blog.naver.com/fstory97/70037640184)
2) 셸작성및 도움 준 이 : [http://blog.naver.com/mrchangsuck](http://blog.naver.com/mrchangsuck)

<!-- en -->
**1. Title: Killing Zombie Processes using CronTab**
 
**2. Conditions**
   1) The process owner and name are known.
   2) Processes exceeding a certain time limit are treated as zombie processes.
 
**3. Method**
   1) Check the execution time of the process using `ps -ef | grep ProcessName`.
   2) If the execution time exceeds the scheduled time, kill it.
   3) Register tasks 1 and 2 in crontab to automatically kill processes that have exceeded a certain time.
 
**4. Example Scenario**
   1) Process name: myprocess
   2) User name: fstory
   3) Process limit time: 5 minutes
   4) Crontab execution interval: 3 minutes
   - A process is considered a zombie if it runs for more than 5 minutes. Since the batch shell operates every 3 minutes, a zombie process could survive for up to 8 minutes in the worst-case scenario.
   5) Batch shell name: process_check.sh
 
**5. Batch Shell Script**
 process_checker.sh

 
**6. Registering in crontab (Execution interval set to 3 minutes)**
crontab -e

 
**7. Problems with this shell script**
1) It checks for newlines based on the username, which can be problematic if a process name is the same as a username.
2) If there are processes older than one day, the time output format changes, which affects the parsing for minute extraction, causing it to not function correctly.
 
**8. Thank you**
1) Related URL: Let's check and restore deadlock status using crontab.

               [http://blog.naver.com/fstory97/70037640184](http://blog.naver.com/fstory97/70037640184)
2) Shell script author and helper: [http://blog.naver.com/mrchangsuck](http://blog.naver.com/mrchangsuck)