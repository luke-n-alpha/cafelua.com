<!--

ZeroBoard에 대한 라이센스 명시입니다.

아래 라이센스에 동의하시는 분만 제로보드를 사용할수 있습니다.
    
프로그램명 : Zeroboard
배포버젼 : 4.0.0 pl5 (2001. 12. 15)
개발자 : zero 
Homepage : http://zeroboard.com

1. 제로보드의 배포권은 ZEROBOARD.COM에서 허용한 곳에만 있습니다.
   (허락 맡지 않은 재배포는 허용하지 않습니다.)

2. 제로보드는 저작권을 아래 3번항목에 의해 표기하는 한도내에서
   개인홈페이지 및 학교나 교회등의 비영리단체, 기업이나 기타 영리단체에서 사용할수 있습니다.
   (반국가 단체나 불법 싸이트에서의 사용은 금지합니다)

3. 제로보드 사용시 저작권 명시부분을 훼손하면 안됩니다.
   프로그램 소스, html소스상의 라이센스 및 웹상 출력물 하단에 있는 카피라이트와 링크를 수정하지 마십시요.
   (저작권 표시는 게시판 배포시 작성된 형식만을 허용합니다. 임의 수정은 금지합니다)

4. 단, 정식 등록버젼은 저작권 표시를 삭제할수 있습니다.
   정식 등록버젼에 대한 문의는 register@nzeo.com 으로 문의하여 주십시요.

5. 링크서비스등의 기본 용도에 맞지 않는 사용은 금지합니다.

6. 제로보드의 사용으로 인한 데이타 손실 및 기타 손해등 어떠한 사고나 문제에 대해서 ZEROBOARD.COM은 절대 책임을 지지 않습니다.

7. 제로보드에 대해 ZEROBOARD.COM은 유지/ 보수의 의무가 없습니다.

8. 제로보드 소스는 개인적으로 사용시 수정하여 사용할수 있지만 수정된 프로그램의 재배포는 금지합니다.
   (저작권 관련 부분은 수정금지입니다)

9. 제로보드에 쓰인 스킨의 저작권은 스킨 제작자에게 있으며 제작자의 동의하에 수정배포가 가능합니다.

10. 기타 의문사항은 http://nzeo.com 에서 제로보드 채널을 이용해주십시요.
    (질문등에 대한 내용은 메일로 받지 않습니다)
-->



<html> 
<head>
  <title></title>
  <meta http-equiv=Content-Type content=text/html; charset=utf-8>
  <link rel=StyleSheet HREF=skin/kissofgod_gray/style.css type=text/css title=style>
<script language="javascript">
browserName = navigator.appName;
browserVer = parseInt(navigator.appVersion);
if(browserName == "Netscape" && browserVer >= 3){ init = "net"; }
else { init = "ie"; }


if(((init == "net")&&(browserVer >=3))||((init == "ie")&&(browserVer >= 4))){

 sn_on=new Image;
 sn_off=new Image;
 sn_on.src= "skin/kissofgod_gray/name_on.gif";
 sn_off.src= "skin/kissofgod_gray/name_off.gif";

 ss_on=new Image;
 ss_off=new Image;
 ss_on.src= "skin/kissofgod_gray/subject_on.gif";
 ss_off.src= "skin/kissofgod_gray/subject_off.gif";

 sc_on=new Image;
 sc_off=new Image;
 sc_on.src= "skin/kissofgod_gray/content_on.gif";
 sc_off.src= "skin/kissofgod_gray/content_off.gif";

}

function OnOff(name) {
if(((init == "net")&&(browserVer >=3))||((init == "ie")&&(browserVer >= 4))) {
  if(document.search[name].value=='on')
  {
   document.search[name].value='off';
   ImgSrc=eval(name+"_off.src");
   document[name].src=ImgSrc;
  }
  else
  {
   document.search[name].value='on';
   ImgSrc=eval(name+"_on.src");
   document[name].src=ImgSrc;
  }
 }
}
</script>

<script language="javascript">
  function reverse() {
   var i, chked=0;
   if(confirm('목록을 반전하시겠습니까?\n\n반전을 원하지 않는다면 취소를 누르시면 다음으로 넘어갑니다'))
   {
    for(i=0;i<document.list.length;i++)
    {
     if(document.list[i].type=='checkbox')
     {
      if(document.list[i].checked) { document.list[i].checked=false; }
      else { document.list[i].checked=true; }
     }
    }
   }
   for(i=0;i<document.list.length;i++)
   {
    if(document.list[i].type=='checkbox')
    {
     if(document.list[i].checked) chked=1;
    }
   }
   if(chked) {
    if(confirm('선택된 항목을 보시겠습니까?'))
     {
      document.list.selected.value='';
      document.list.exec.value='view_all';
      for(i=0;i<document.list.length;i++)
      {
       if(document.list[i].type=='checkbox')
       {
        if(document.list[i].checked)
        {
         document.list.selected.value=document.list[i].value+';'+document.list.selected.value;
        }
       }
      }
      document.list.submit();
      return true;
     }
    }
   }

 function delete_all() {
  var i, chked=0;
  for(i=0;i<document.list.length;i++)
  {
   if(document.list[i].type=='checkbox')
   {
    if(document.list[i].checked) chked=1;
    }
   }
  if(chked)
  {
    document.list.selected.value='';
    document.list.exec.value='delete_all';
    for(i=0;i<document.list.length;i++)
    {
     if(document.list[i].type=='checkbox')
     {
      if(document.list[i].checked)
      {
       document.list.selected.value=document.list[i].value+';'+document.list.selected.value;
      }
     }
    }
    window.open("select_list_all.php?id=uploadbullet&selected="+document.list.selected.value,"uploadbullet_select_list","width=150,height=110,toolbars=no,resize=no,scrollbars=no");
  }
  else {alert('정리할 게시물을 선택하여 주십시요');}
 }

 function category_change() {
  var myindex=list.category.selectedIndex;
  document.search.category.value=list.category.options[myindex].value;
  document.search.submit();
  return true;
 }
</script>

</head>
<body topmargin='0'  leftmargin='0' marginwidth='0' marginheight='0' bgcolor=white ><div align=center>
<font size=2><b>Fstory의 Free 업로드 게시판 </b></font><table border=0 cellspacing=0 cellpadding=0 width=95%>
<tr>
  <td align=right style='font-family:Tahoma; font-size:8pt'>
    <a onfocus=blur() href='login.php?id=uploadbullet&page=1&category=&sn=off&ss=on&sc=on&keyword=&select_arrange=headnum&desc=asc&s_url=%2Fzero%2Fzboard.php%3Fid%3Duploadbullet%26page%3D1%26page_num%3D20%26no%3D1%26category%3D%26sn%3D%26ss%3Don%26sc%3Don%26keyword%3D%26prev_no%3D1'>&nbsp;Login&nbsp;</a>
    <Zeroboard &nbsp;Join&nbsp;</a>
    <Zeroboard &nbsp;modifyINFO&nbsp;</a>
    	<Zeroboard &nbsp;memobox&nbsp;</a>
    <Zeroboard &nbsp;logout&nbsp;</a>
    <Zeroboard &nbsp;setup&nbsp;</a>
    &nbsp;
  </td>
</tr>
</table>
  


<table border=0 cellspacing=0 cellpadding=0 width=95%>

<col width=1></col><!--<col width=20></col>--><col width=50></col>
<col width=></col><col width=90></col><col width=70></col><col width=40></col>
<col width=1></col>

<tr align=center>
   <td width=1 class=kissofgod-list-head-td></td>
   <!--   <td width=20 class=kissofgod-list-head-td><span class=kissofgod-list-head-title>v</span></a></td>
   -->   <td width=50 class=kissofgod-list-head-td><a onfocus=blur() href='/zero/zboard.php?id=uploadbullet&page=1&category=&sn=off&ss=on&sc=on&keyword=&select_arrange=headnum&desc=desc'><span class=kissofgod-list-head-title>no</span></a></td>
   <td class=kissofgod-list-head-td><a onfocus=blur() href='/zero/zboard.php?id=uploadbullet&page=1&category=&sn=off&ss=on&sc=on&keyword=&select_arrange=subject&desc=desc'><span class=kissofgod-list-head-title>subject</span></a></td>
   <td width=90 class=kissofgod-list-head-td><a onfocus=blur() href='/zero/zboard.php?id=uploadbullet&page=1&category=&sn=off&ss=on&sc=on&keyword=&select_arrange=name&desc=desc'><span class=kissofgod-list-head-title>name</span></a></td>
   <td width=70 class=kissofgod-list-head-td><a onfocus=blur() href='/zero/zboard.php?id=uploadbullet&page=1&category=&sn=off&ss=on&sc=on&keyword=&select_arrange=reg_date&desc=desc'><span class=kissofgod-list-head-title>date</span></a></td>
   <td width=40 class=kissofgod-list-head-td><a onfocus=blur() href='/zero/zboard.php?id=uploadbullet&page=1&category=&sn=off&ss=on&sc=on&keyword=&select_arrange=hit&desc=desc'><span class=kissofgod-list-head-title>read</span></a></td>
   <td width=1 class=kissofgod-list-head-td></td>
</tr>

<tr><td colspan=10 class=kissofgod-base-listline></td></tr>

<form method=post name=list action=list_all.php><input type=hidden name=page value=1><input type=hidden name=id value=uploadbullet><input type=hidden name=select_arrange value=headnum><input type=hidden name=desc value=asc><input type=hidden name=page_num value=13><input type=hidden name=selected><input type=hidden name=exec><input type=hidden name=keyword value=""><input type=hidden name=sn value="off"><input type=hidden name=ss value="on"><input type=hidden name=sc value="on">
<tr align=center height=20 onMouseOver=this.style.backgroundColor='#F5F5F5' onMouseOut=this.style.backgroundColor='' class=kissofgod-list-notice-tr>
  <td><img src=skin/kissofgod_gray/t.gif border=0 width=1></td>
  <!--<td><input type=checkbox name=cart value="3"></td>-->  <td nowrap><font style=font-size:8pt;font-family:tahoma>3</font></td>
  <td align=left style='word-break:break-all;'><img src=skin/kissofgod_gray/notice_head.gif border=0 align=absmiddle>&nbsp;<a href='view.php?id=uploadbullet&page=1&category=&sn=off&ss=on&sc=on&keyword=&select_arrange=headnum&desc=asc&no=3'>이곳에 대한 용도 설명 입니다.</a> <font style=font-family:tahoma;font-size:7pt></font></td> 
  <td nowrap><b>&nbsp;<font style='font-weight:normal'><a href="javascript:void(window.open('view_info.php?to=&id=uploadbullet&member_no=1','mailform','width=400,height=510,statusbar=no,scrollbars=yes,toolbar=no'))">숲속얘기</a></font>&nbsp;</div></td>
  <td nowrap><font style=font-family:tahoma;font-size:8pt>&nbsp;<span title='2002년 02월 01일 09시 23분 56초'>2002/02/01</span>&nbsp;</td>
  <td nowrap><font style=font-family:tahoma;font-size:8pt>31</td>
  <td><img src=skin/kissofgod_gray/t.gif border=0 width=1></td>
</tr>

<tr>
  <td width=1 class=kissofgod-line><img src=skin/kissofgod_gray/t.gif border=0 width=1 height=1></td>
  <td height=1 colspan=5 class=kissofgod-line><img src=skin/kissofgod_gray/t.gif border=0 width=1 height=1></td>
  <td width=1 class=kissofgod-line><img src=skin/kissofgod_gray/t.gif border=0 width=1 height=1></td>
</tr>
<tr align=center height=20 onMouseOver=this.style.backgroundColor='#F5F5F5' onMouseOut=this.style.backgroundColor=''>
  <td><img src=skin/kissofgod_gray/t.gif border=0 width=1></td>
  <!--<td><input type=checkbox name=cart value="6"></td>-->  <td nowrap><font style=font-size:8pt;font-family:tahoma>2</font></td>
  <td align=left style='word-break:break-all;'><img src=skin/kissofgod_gray/old_head.gif border=0 align=absmiddle>&nbsp;<a href='view.php?id=uploadbullet&page=1&category=&sn=off&ss=on&sc=on&keyword=&select_arrange=headnum&desc=asc&no=6'>[작업용] 컴퓨터 부품 모음</a> <font style=font-family:tahoma;font-size:7pt></font></td> 
  <td nowrap><b>&nbsp;<font style='font-weight:normal'><a href="javascript:void(window.open('view_info.php?to=&id=uploadbullet&member_no=1','mailform','width=400,height=510,statusbar=no,scrollbars=yes,toolbar=no'))">숲속얘기</a></font>&nbsp;</div></td>
  <td nowrap><font style=font-family:tahoma;font-size:8pt>&nbsp;<span title='2002년 02월 13일 20시 58분 44초'>2002/02/13</span>&nbsp;</td>
  <td nowrap><font style=font-family:tahoma;font-size:8pt>65</td>
  <td><img src=skin/kissofgod_gray/t.gif border=0 width=1></td>
</tr>

<tr>
  <td width=1 class=kissofgod-line><img src=skin/kissofgod_gray/t.gif border=0 width=1 height=1></td>
  <td height=1 colspan=5 class=kissofgod-line><img src=skin/kissofgod_gray/t.gif border=0 width=1 height=1></td>
  <td width=1 class=kissofgod-line><img src=skin/kissofgod_gray/t.gif border=0 width=1 height=1></td>
</tr>
<tr align=center height=20 onMouseOver=this.style.backgroundColor='#F5F5F5' onMouseOut=this.style.backgroundColor=''>
  <td><img src=skin/kissofgod_gray/t.gif border=0 width=1></td>
  <!--<td><input type=checkbox name=cart value="4"></td>-->  <td nowrap><font style=font-size:8pt;font-family:tahoma>1</font></td>
  <td align=left style='word-break:break-all;'><img src=skin/kissofgod_gray/old_head.gif border=0 align=absmiddle>&nbsp;<a href='view.php?id=uploadbullet&page=1&category=&sn=off&ss=on&sc=on&keyword=&select_arrange=headnum&desc=asc&no=4'>베리타스 2월 3일자 작업 파일</a> <font style=font-family:tahoma;font-size:7pt></font></td> 
  <td nowrap>&nbsp;<font style='font-weight:normal'>숲속얘기</font>&nbsp;</div></td>
  <td nowrap><font style=font-family:tahoma;font-size:8pt>&nbsp;<span title='2002년 02월 02일 18시 36분 45초'>2002/02/02</span>&nbsp;</td>
  <td nowrap><font style=font-family:tahoma;font-size:8pt>27</td>
  <td><img src=skin/kissofgod_gray/t.gif border=0 width=1></td>
</tr>

<tr>
  <td width=1 class=kissofgod-line><img src=skin/kissofgod_gray/t.gif border=0 width=1 height=1></td>
  <td height=1 colspan=5 class=kissofgod-line><img src=skin/kissofgod_gray/t.gif border=0 width=1 height=1></td>
  <td width=1 class=kissofgod-line><img src=skin/kissofgod_gray/t.gif border=0 width=1 height=1></td>
</tr>
</table>

<table border=0 width=95% cellspacing=0 cellpadding=0>
<tr><td colspan=10 class=kissofgod-base-listline></td></tr>
</table>


<table border=0 cellpadding=0 cellspacing=0 width=95%>
<tr>
  <td width=1><img src=skin/kissofgod_gray/t.gif border=0 width=1 height=1></td>
  <td class=kissofgod-button-font>
    <a onfocus=blur() href='/zero/zboard.php?id=uploadbullet&page=1&category=&sn=off&ss=on&sc=on&keyword=&prev_no=1'>&nbsp;List&nbsp;</a>
    <Zeroboard &nbsp;Order&nbsp;</a>
    <img src=skin/kissofgod_gray/t.gif border=0 width=1 height=1>
  </td>
  <td align=right class=kissofgod-button-font>
    <a onfocus=blur() href='write.php?id=uploadbullet&page=1&category=&sn=off&ss=on&sc=on&keyword=&select_arrange=headnum&desc=asc&no=1&mode=write'>&nbsp;Write&nbsp;</a>
    <img src=skin/kissofgod_gray/t.gif border=0 width=1 height=1>
  </td>
  <td width=1><img src=skin/kissofgod_gray/t.gif border=0 width=1 height=1></td>
</tr>
<tr>
  <td width=1><img src=skin/kissofgod_gray/t.gif border=0 width=1 height=1></td>
  <td align=center colspan=2>
    <Zeroboard [PREV]</a>  <font style=font-size:8pt><b>1</b>  <Zeroboard [NEXT]</a>  
  </td>
  <td width=1><img src=skin/kissofgod_gray/t.gif border=0 width=1 height=1></td>
</tr>
</form>
</table>

<img src=skin/kissofgod_gray/t.gif border=0 height=10><br>

<table border=0 cellpadding=0 cellspacing=0 width=95%>

<form method=post name=search action=/zero/zboard.php><input type=hidden name=page value=1><input type=hidden name=id value=uploadbullet><input type=hidden name=select_arrange value=headnum><input type=hidden name=desc value=asc><input type=hidden name=page_num value=13><input type=hidden name=selected><input type=hidden name=exec><input type=hidden name=sn value="off"><input type=hidden name=ss value="on"><input type=hidden name=sc value="on"><input type=hidden name=category value="">

<tr>
  <td align=center>
  <table border=0 cellspacing=0 cellpadding=0>
  <tr>
     <td valign=bottom>
       <a href="javascript:OnOff('sn')" onfocus=blur()><img src=skin/kissofgod_gray/name_off.gif border=0 name=sn></a><a href="javascript:OnOff('ss')" onfocus=blur()><img src=skin/kissofgod_gray/subject_on.gif border=0 name=ss></a><a href="javascript:OnOff('sc')" onfocus=blur()><img src=skin/kissofgod_gray/content_on.gif border=0 name=sc></a></td>
     <td><input type=text name=keyword value="" class=input-search size=15></td>
     <td valign=bottom><input type=image src=skin/kissofgod_gray/search.gif border=0 width=56 height=11 onfocus=blur()></td>
  </tr>
  </table>

  </td>
</tr>
<tr>
  <td height=15><img src=skin/kissofgod_gray/t.gif border=0 width=1 height=1></td>
</tr>
</form>
</table>

<table border=0 cellpadding=0 cellspacing=0 height=20 width=95%>
        <tr>
           <td align=right style=font-family:tahoma,굴림;font-size:8pt;line-height:150%;letter-spacing:0px>
           <font style=font-size:7pt>Copyright 1999-2001</font> <a href=http://www.zeroboard.com target=_blank onfocus=blur()><font tyle=font-family:tahoma,굴림;font-size:5pt;>Zeroboard</a> 
           / skin by <font style="font-family:돋움; font-size:8pt; color:navy"><a href=http://kissofgod.net target=_blank>신의키스</a></font>
           </td>   
        </tr>
        </table></div><center>
(c) 2001, Fstory's Upload Bullet <br>
저에게 보내실 자료나 할말이 있을실때 쓰세요. 첨부파일의 최대크기는 10메가이며, Tag도 허용합니다.<br>
용량이 큰 파일을 첨부하실1때는 서버까지 올라가는 시간이 걸립니다. <br>
브라우져가 다운된것이 아니니 잠시만 참고 기다리세요.<br></body>
</html>
      <!--
      -------------------------------------------------------------------
      Zero Board Executed Time
      -------------------------------------------------------------------
      All StartTime : 1014056544.2304
      End DB Excute Time : 1014056544.3155
      EndTime : 1014056544.3921
      -------------------------------------------------------------------
      DB Excute Time : 0.085
      PHP Excute Time : 0.077 
      Total Excuted Time : 0.162
      -------------------------------------------------------------------
      -->