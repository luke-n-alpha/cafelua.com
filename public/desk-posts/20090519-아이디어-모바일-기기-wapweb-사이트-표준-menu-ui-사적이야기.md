---
date: "2009-05-19"
titleKo: "[아이디어] 모바일 기기 WAP/WEB 사이트 표준 MENU UI 사적이야기"
titleEn: "[Idea] Standard MENU UI for Mobile"
category: private
tags:
  - 사적이야기
images: []
sourceCategoryNo: "65"
sourceCategory: 사적이야기
externalUrl: https://blog.naver.com/fstory97/70047372756
---

<!-- ko -->
**요약 : 모바일 기기 WAP/WEB 사이트 표준 MENU UI**
**발명의 목적 : **WAP/WEB사이트에서 Script를 이용해 MENU UI를 구성하는 방법을 구현한다.
**발명의 범위 : **인터넷 브라우징중에 사용하는 메뉴

**발명이 속하는 기술분야 및 그 분야의 종래 기술 :**
**1) 웹 **
- 마우스를 오버하거나 클릭시 풀다운 메뉴가 활성화되고 있다.
- 일반 웹페이지를 핸드폰으로 브라우징 할경우, 제한된 공간만 보이게 되고, 메뉴의 버튼으로 포커스를 옮겨 버튼을 눌러 활성화 하고 선택을 해야 한다.

**2) 모바일 기기의 왑 환경**
- 일반 핸드폰의 왑페이지의 메뉴는 페이지 내에 하단이나 상단에 리스트 형태로 고정 위치를 차지하고 있다.
- 왑 페이지의 메뉴도 마찬가지로 리스트를 위치해서 클릭해야 한다.

**개선 사항**
1.     **메뉴 키 누름 :** 특정 키(Ancor)를 누르면 메뉴를 활성화시킨다.
Ex) 0을 누른다.

**2.  메뉴 영역 활성화** : 숨겨진 메뉴의 영역(DIV)이 활성화되며, 새로 활성화된 DIV영역으로 포커스가 이동한다.
Ex) 메뉴 영역이 화면의 일부분을 차지하며 나타나게 되며, 포커스는 메뉴영역으로 이동한다.
-      이는 Ancor를 누르면 과거에는 페이지 이동을 했지만, Script를 동작 시켜야 한다.
이때 해당되는 동작은
1)    메뉴 Div 영역의 활성화
- (이때 메뉴 Div영역내에 있는 Ancor는 누르더라도 동작하지 않아야 한다)
2)    메뉴 Div 영역에 포커스 이동
** **
3.     **메뉴 영역의 단축 번호 입력 :** 메뉴 영역의 DIV에서만 Ancor가 동작하며 그곳에 메뉴 아이템을 배열한다.
하부 ANCOR를 클릭했을경우 정해진 Location 이동혹은 또 Sub 메뉴(Div)가 활성화
될 수 있다.

EX) 메뉴영역의 Ancor를 실행할수 있다.
1) 메뉴 Div영역내의 Ancor들만 동작한다.
- 서브 Div영역내의 Ancor나, 부모 페이지의 Ancor는 동작하지 않는다.

* 네이버 포탈 WAP 페이지에서 0번을 누르면 좌측 하단에 메뉴가 뜨고, 1번은 Naver홈, 2번은 네이버 붐, 3번은 네이버 메일.. 식으로 확인해볼수 있다.

**구현 방법**
1.     DIV 영역으로 미리 메뉴를 그려두고, 비활성화 해둔다.
(비활성화된 DIV영역의 Ancor는 동작하지 않게 한다)
2.     특정 ANCOR이벤트가 발생시 DIV 영역을 활성화시키고, DIV영역에만 포커스를 제한한다.

**보장 항목**
-      Ancor를 이용해 스크립트를 동작시켜 숨겨진 메뉴DIV 영역 활성화하거나 현재의 메뉴 DIV영역을 닫는다.
-      비활성화 된 DIV영역의 Ancor 동작 제한, 활성화된 DIV 영역에서의 Ancor및 포커스 제한 (현재는 DIV영역 바깥까지 포커스가 이동된다. 폐쇄된 DIV를 구현해야함)
-      위와 같은 방식을 이용한 WAP에서 포탈의 표준 메뉴 이용

<!-- en -->
**Summary: Standard Menu UI for Mobile Device WAP/WEB Sites**
 **Purpose of the Invention:** To implement a method for configuring MENU UI on WAP/WEB sites using scripts.
 **Scope of the Invention:** Menus used during internet browsing
 
**Technical Field of the Invention and Prior Art in that Field:**
**1) Web**
- Pull-down menus are activated when hovering over or clicking with the mouse.
- When browsing a regular webpage on a mobile phone, only a limited space is visible, and the focus must be moved to the menu button to press it, activate it, and make a selection.
 
**2) WAP Environment of Mobile Devices**
- Menus on WAP pages of regular mobile phones occupy a fixed position in list form at the bottom or top of the page.
- Similarly, for WAP page menus, the list must be located and clicked.
 
 
**Proposed Improvements**
1.     **Menu Key Press:** When a specific key (Anchor) is pressed, the menu is activated.
Ex) Press 0.
 
**2.  Menu Area Activation:** The hidden menu area (DIV) is activated, and the focus moves to the newly activated DIV area.
Ex) The menu area appears, occupying a portion of the screen, and the focus moves to the menu area.
-      Previously, pressing an Anchor would navigate to another page, but now a script must be executed.
The corresponding actions at this time are:
1)    Activation of the Menu Div area
- (At this time, Anchors within the Menu Div area should not function even if pressed)
2)    Focus movement to the Menu Div area
** **
3.     **Shortcut Number Input for Menu Area:** Anchors only function within the DIV of the menu area, and menu items are arranged there.
When a sub-ANCHOR is clicked, it can lead to a predefined Location move or activate another Sub menu (Div).
 
EX) Anchors within the menu area can be executed.
   1) Only Anchors within the Menu Div area function.
     - Anchors within a sub-Div area or Anchors on the parent page do not function.
 
* On Naver Portal's WAP page, if you press 0, a menu appears in the bottom left, and you can see that 1 is Naver Home, 2 is Naver Boom, 3 is Naver Mail, and so on.
 
**Implementation Method**
1.     Pre-draw the menu within a DIV area and keep it deactivated.
  (Anchors within the deactivated DIV area should not function)
2.     When a specific ANCHOR event occurs, activate the DIV area and restrict focus only to the DIV area.
 
**Guaranteed Features**
-      Use an Anchor to run a script to activate a hidden menu DIV area or to close the current menu DIV area.
-      Restriction of Anchor functionality in deactivated DIV areas, and restriction of Anchor and focus in activated DIV areas (Currently, focus moves outside the DIV area. A closed DIV must be implemented.)
-      Use of a portal's standard menu in WAP using the method described above.