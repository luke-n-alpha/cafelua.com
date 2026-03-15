---
date: "2009-10-09"
titleKo: RTSP(Real Time streming protocol) IT개인자료정리 / IT이야기
titleEn: RTSP (Real-Time Streaming Protocol) / IT Personal Data Organization / IT Story
category: it
tags:
  - IT개인자료정리
images: []
sourceCategoryNo: "72"
sourceCategory: IT개인자료정리
externalUrl: https://blog.naver.com/fstory97/70071245288
---

<!-- ko -->
**I. RTSP**
- RTSP(Real Time Streaming Protocol)은 IETF가 스트리밍 시스템 개발을 위해 제정한 통신 규약으로서 미디어 서버를 원격 제어하는 명령어 Set으로 구성되어있다. 실제 데이터를 전송하는 것이 아니라 RTP규약을 사용하여 전송계층으로 실제 멀티미디어 데이터를 전송하며, IPTV등에서 이용하고 있다.
**II. RTSP의 특징**
- 상태형(Stateful) 규약
- 임의의 세션 ID는 세션 추적때마다 사용
- 영구 TCP 연결 필요
- 554번 기본 포트 이용
**III. RTSP 명령어**

| 명령어 | 목적 | 특징 |
| --- | --- | --- |
| DESCRIBE | 미디어의 설명 요구 | - URL(rtsp://..) 포함 - 554번 포트 TCP,UDP 둘다 사용 - 응답메시지에는 요청한것에 관한 설명이 포함되며, SDP 형태 |
| SETUP | 단일 미디어 스트림이 전송되어야 하는지 규정 | - PLAY 요청 전에 끝나아함 - 미디어스트림 URL과 전송점 포함 - 전송점에는 RTP(미디어)데이터, RTCP데이터(메타정보) 전송을 위한 포트번호 포함 |
| PLAY | 재생 | - 다중 요청 가능 - URL집합체가 요청에 포함되어야 함 - 재생범위 지정 가능 |
| PAUSE | 스트림에 대해 일시 중지 | 미디어 스트림 URL이 포함, 일시정지 범위 구체적 지정 가능 |
| RECORD | 녹화 | 녹화 |
| TEARDOWN | 세션 종료 목적 | 스트림 재생 중단, 데이터에 걸린 모든 세션 해제 |

<!-- en -->
**I. RTSP**
- RTSP (Real Time Streaming Protocol) is a communication protocol established by the IETF for the development of streaming systems, consisting of a command set for remotely controlling media servers. It does not transmit actual data itself, but rather uses the RTP protocol to transmit actual multimedia data to the transport layer, and is used in services like IPTV.
**II. Features of RTSP**
- Stateful protocol
- Arbitrary session IDs are used for session tracking
- Requires a persistent TCP connection
- Uses default port 554
**III. RTSP Commands**

| Command | Purpose | Features |
| --- | --- | --- |
| DESCRIBE | Requests media description | - Includes URL (rtsp://..) - Uses port 554 for both TCP and UDP - Response message includes a description of the request, in SDP format |
| SETUP | Specifies whether a single media stream should be transmitted | - Must complete before a PLAY request - Includes media stream URL and transport point - Transport point includes port numbers for transmitting RTP (media) data and RTCP (meta-information) data |
| PLAY | Playback | - Multiple requests possible - A collection of URLs must be included in the request - Playback range can be specified |
| PAUSE | Pauses the stream | Includes media stream URL, specific pause range can be specified |
| RECORD | Record | Records |
| TEARDOWN | Purpose of session termination | Stops stream playback, releases all sessions associated with the data |