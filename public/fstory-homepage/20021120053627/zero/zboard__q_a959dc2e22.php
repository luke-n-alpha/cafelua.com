<!--
ZeroBoard에 대한 라이센스 명시입니다.

아래 라이센스에 동의하시는 분만 제로보드를 사용할수 있습니다.
    
프로그램명 : Zeroboard
배포버젼 : 4.1 pl 1 (2002. 02. 25)
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
   정식 등록버젼에 대한 문의는 http://zeroboard.com 에서 문의 방법을 찾아주시기 바랍니다.

5. 링크서비스등의 기본 용도에 맞지 않는 사용은 금지합니다.

6. 제로보드의 사용으로 인한 데이타 손실 및 기타 손해등 어떠한 사고나 문제에 대해서 ZEROBOARD.COM은 절대 책임을 지지 않습니다.

7. 제로보드에 대해 ZEROBOARD.COM은 유지/ 보수의 의무가 없습니다.

8. 제로보드 소스는 개인적으로 사용시 수정하여 사용할수 있지만 수정된 프로그램의 재배포는 금지합니다.
   (저작권 관련 부분은 수정금지입니다)

9. 제로보드에 쓰인 스킨의 저작권은 스킨 제작자에게 있으며 제작자의 동의하에 수정배포가 가능합니다.

10. 기타 의문사항은 http://zeroboard.com 에서 제로보드 채널을 이용해주십시요.
    (질문등에 대한 내용은 메일로 받지 않습니다)

-->
<html> 
<head>
	<title></title>
	<meta http-equiv=Content-Type content=text/html; charset=utf-8>
	<link rel=StyleSheet HREF=skin/zipulragi_dairy2/style.css type=text/css title=style>
	<script language='JavaScript'>
	var select_obj;
	function ZB_layerAction(name,status) { 
		var obj=document.all[name];
		var _tmpx,_tmpy, marginx, marginy;
		_tmpx = event.clientX + parseInt(obj.offsetWidth);
		_tmpy = event.clientY + parseInt(obj.offsetHeight);
		_marginx = document.body.clientWidth - _tmpx;
		_marginy = document.body.clientHeight - _tmpy ;
		if(_marginx < 0)
			_tmpx = event.clientX + document.body.scrollLeft + _marginx ;
		else
			_tmpx = event.clientX + document.body.scrollLeft ;
		if(_marginy < 0)
			_tmpy = event.clientY + document.body.scrollTop + _marginy +20;
		else
			_tmpy = event.clientY + document.body.scrollTop ;
		obj.style.posLeft=_tmpx-13;
		obj.style.posTop=_tmpy-12;
		if(status=='visible') {
			if(select_obj) {
				select_obj.style.visibility='hidden';
				select_obj=null;
			}
			select_obj=obj;
		}else{
			select_obj=null;
		}
		obj.style.visibility=status; 
	}


	function print_ZBlayer(name, homepage, mail, member_no, boardID, writer, traceID, traceType, isAdmin, isMember) {
		var printHeight = 0;
		var printMain="";
	
		if(homepage) {
			printMain = "<tr onMouseOver=this.style.backgroundColor='#bbbbbb' onMouseOut=this.style.backgroundColor='' onMousedown=window.open('"+homepage+"');><td style=font-family:굴림;font-size:9pt height=18 nowrap>&nbsp;<img src=images/n_homepage.gif border=0 align=absmiddle>&nbsp;&nbsp;홈페이지&nbsp;&nbsp;</td></tr>";
			printHeight = printHeight + 16;
		}
		if(mail) {
			printMain = printMain +	"<tr onMouseOver=this.style.backgroundColor='#bbbbbb' onMouseOut=this.style.backgroundColor='' onMousedown=window.open('open_window.php?mode=m&str="+mail+"','ZBremote','width=1,height=1,left=1,top=1');><td style=font-family:굴림;font-size:9pt height=18 nowrap>&nbsp;<img src=images/n_mail.gif border=0 align=absmiddle>&nbsp;&nbsp;메일 보내기&nbsp;&nbsp;</td></tr>";
			printHeight = printHeight + 16;
		}
		if(member_no) {
			if(isMember) {
				printMain = printMain +	"<tr onMouseOver=this.style.backgroundColor='#bbbbbb' onMouseOut=this.style.backgroundColor='' onMousedown=window.open('view_info.php?member_no="+member_no+"','view_info','width=400,height=510,toolbar=no,scrollbars=yes');><td style=font-family:굴림;font-size:9pt height=18 nowrap>&nbsp;<img src=images/n_memo.gif border=0 align=absmiddle>&nbsp;&nbsp;쪽지 보내기&nbsp;&nbsp;</td></tr>";
				printHeight = printHeight + 16;
			}
			printMain = printMain +	"<tr onMouseOver=this.style.backgroundColor='#bbbbbb' onMouseOut=this.style.backgroundColor='' onMousedown=window.open('view_info2.php?member_no="+member_no+"','view_info','width=400,height=510,toolbar=no,scrollbars=yes');><td style=font-family:굴림;font-size:9pt height=18 nowrap>&nbsp;<img src=images/n_information.gif border=0 align=absmiddle>&nbsp;&nbsp;회원정보 보기&nbsp;&nbsp;</td></tr>";
			printHeight = printHeight + 16;
		}
		if(writer) {
			printMain = printMain +	"<tr onMouseOver=this.style.backgroundColor='#bbbbbb' onMouseOut=this.style.backgroundColor='' onMousedown=location.href='zboard.php?id="+boardID+"&sn1=on&sn=on&ss=off&sc=off&keyword="+writer+"';><td style=font-family:굴림;font-size:9pt height=18 nowrap>&nbsp;<img src=images/n_search.gif border=0 align=absmiddle>&nbsp;&nbsp;이름으로 검색&nbsp;&nbsp;</td></tr>";
			printHeight = printHeight + 16;
		}
		if(isAdmin) {
			if(member_no) {
				printMain = printMain +	"<tr onMouseOver=this.style.backgroundColor='#bbbbbb' onMouseOut=this.style.backgroundColor='' onMousedown=window.open('open_window.php?mode=i&str="+member_no+"','ZBremote','width=1,height=1,left=1,top=1');><td style=font-family:굴림;font-size:9pt height=18 nowrap>&nbsp;<img src=images/n_modify.gif border=0 align=absmiddle>&nbsp;&nbsp;<font color=darkred>회원정보 변경&nbsp;&nbsp;</td></tr>";
				printHeight = printHeight + 16;
			}
			printMain = printMain +	"<tr onMouseOver=this.style.backgroundColor='#bbbbbb' onMouseOut=this.style.backgroundColor='' onMousedown=window.open('open_window.php?mode="+traceType+"&str="+traceID+"','ZBremote','width=1,height=1,left=1,top=1');><td style=font-family:굴림;font-size:9pt height=18 nowrap>&nbsp;<img src=images/n_relationlist.gif border=0 align=absmiddle>&nbsp;&nbsp;<font color=darkred>관련글 추적</font>&nbsp;&nbsp;</td></tr>";
			printHeight = printHeight + 16;
		
		}
		var printHeader = "<div id='"+name+"' style='position:absolute; left:10px; top:25px; width:127; height: "+printHeight+"; z-index:1; visibility: hidden' onMousedown=ZB_layerAction('"+name+"','hidden')><table border=0><tr><td colspan=3 onMouseover=ZB_layerAction('"+name+"','hidden') height=3></td></tr><tr><td width=5 onMouseover=ZB_layerAction('"+name+"','hidden') rowspan=2>&nbsp;</td><td height=5></td></tr><tr><td><table style=cursor:hand border='0' cellspacing='1' cellpadding='0' bgcolor='black' width=100% height=100%><tr><td valign=top bgcolor=white><table border=0 cellspacing=0 cellpadding=3 width=100% height=100%>";
		var printFooter = "</table></td></tr></table></td><td width=5 rowspan=2 onMouseover=ZB_layerAction('"+name+"','hidden')>&nbsp;</td></tr><tr><td colspan=3 height=10 onMouseover=ZB_layerAction('"+name+"','hidden')></td></tr></table></div>";
	
		document.writeln(printHeader+printMain+printFooter);
	}
</script>
	
<script language="javascript">
browserName = navigator.appName;
browserVer = parseInt(navigator.appVersion);
if(browserName == "Netscape" && browserVer >= 3){ init = "net"; }
else { init = "ie"; }


if(((init == "net")&&(browserVer >=3))||((init == "ie")&&(browserVer >= 4))){

 sn_on=new Image;
 sn_off=new Image;
 sn_on.src= "skin/zipulragi_dairy2/name_on.gif";
 sn_off.src= "skin/zipulragi_dairy2/name_off.gif";

 ss_on=new Image;
 ss_off=new Image;
 ss_on.src= "skin/zipulragi_dairy2/subject_on.gif";
 ss_off.src= "skin/zipulragi_dairy2/subject_off.gif";

 sc_on=new Image;
 sc_off=new Image;
 sc_on.src= "skin/zipulragi_dairy2/content_on.gif";
 sc_off.src= "skin/zipulragi_dairy2/content_off.gif";

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
    window.open("select_list_all.php?id=diary&selected="+document.list.selected.value,"게시물정리","width=260,height=180,toolbars=no,resize=no,scrollbars=no");
  }
  else {alert('정리할 게시물을 선택하여 주십시요');}
 }

 function category_change() {
  var myindex=list.category.selectedIndex;
  document.search.category.value=list.category.options[myindex].value;
  document.search.submit();
  return true;
 }

//-->
</script>
</head>
<body topmargin='0'  leftmargin='0' marginwidth='0' marginheight='0'  bgcolor=white ><div align=center>
<script language=JavaScript>
function findObj(n, d) { //v4.0
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=findObj(n,d.layers[i].document);
  if(!x && document.getElementById) x=document.getElementById(n); return x;
}
function swapImage() {
  var i,j=0,x,a=swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}
</script>

<!-- HTML 시작 -->
<table border=0 cellspacing=0 cellpadding=0 width=95%>
<tr>
  <td valign=bottom class=kissofgod-tahoma7 nowrap><a href="javascript:void(window.open("'member_memo3.php','member_memo','width=450,height=500,status=no,toolbar=no,resizable=yes,scrollbars=yes')) onfocus='this.blur()'><img src=skin/zipulragi_dairy2/member_logged.gif border=0 align=absmiddle alt='접속된 회원 및 총회원 목록보기&#10;&#13;현재 1분께서 회원으로 접속해 있습니다.'><span onfocus='this.blur()'> 1</span></td>
  <td valign=bottom rowspan=2 align=right width=100%>
    <Zeroboard <img src=skin/zipulragi_dairy2/member_join.gif border=0 alt='회원가입'></a>
    <Zeroboard <img src=skin/zipulragi_dairy2/member_modify.gif border=0 alt='회원정보 수정'></a>
    <Zeroboard <span onClick="swapImage('memozzz','','skin/zipulragi_dairy2/member_memo_off.gif',0)" title='쪽지관리'></span></a>
    <a onfocus="blur()" href='login.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&s_url=%2Fzero%2Fzboard.php%3Fid%3Ddiary%26page%3D1%26page_num%3D20%26select_arrange%3Dheadnum%26desc%3D%26sn%3Doff%26ss%3Don%26sc%3Don%26keyword%3D%26no%3D9%26category%3D1&PHPSESSID=e588fff745805489eddf27dcd26b4cbc'><img src=skin/zipulragi_dairy2/member_login.gif border=0 alt='회원로그인'></a>
    <Zeroboard <img src=skin/zipulragi_dairy2/member_logout.gif border=0 alt='로그아웃'></a>
    <Zeroboard <img src=skin/zipulragi_dairy2/member_setup.gif border=0 alt='게시판환경바꾸기'></a></td>
</tr>
<tr>
  <td valign=bottom class=kissofgod-tahoma7 nowrap>
    <img src=skin/zipulragi_dairy2/setup_total.gif> 8 <img src=skin/zipulragi_dairy2/setup_articles.gif >　1/1 <img src=skin/zipulragi_dairy2/setup_pages_nowpage.gif></td>
</tr>
</table>


<table border=0 cellspacing=0 cellpadding=0 width=95%>
<col width=15></col><!--<col width=20></col>--><!--<col width=20></col>--><col width=120></col><col width=43></col><col width=></col><col width=70></col><col width=15></col>
<tr align=center>

  <td align=center valign=bottom class=kissofgod-head-td><form method="post" name="list" action="list_all.php"><input type="hidden" name="PHPSESSID" value="e588fff745805489eddf27dcd26b4cbc" /><input type="hidden" name="page" value="1"><input type="hidden" name="id" value="diary"><input type="hidden" name="select_arrange" value="headnum"><input type="hidden" name="desc" value="asc"><input type="hidden" name="page_num" value="8"><input type="hidden" name="selected"><input type="hidden" name="exec"><input type="hidden" name="keyword" value=""><input type="hidden" name="sn" value="off"><input type="hidden" name="ss" value="on"><input type="hidden" name="sc" value="on"><a onfocus="blur()" href='/zero/zboard.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=desc&PHPSESSID=e588fff745805489eddf27dcd26b4cbc'><img src=skin/zipulragi_dairy2/head_no.gif border=0 alt='번호별로 보기'></a></td>

  <!--  <td align=center valign=bottom class=kissofgod-head-td><img src=skin/zipulragi_dairy2/head_c.gif border=0 alt='여러개의 게시물 다루기'></a></td>-->
  <!--  <td align=left valign=bottom class=kissofgod-head-td style='padding-bottom:1'>Category</td>-->
  <td align=center valign=bottom class=kissofgod-head-td><a onfocus="blur()" href='/zero/zboard.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=reg_date&desc=desc&PHPSESSID=e588fff745805489eddf27dcd26b4cbc'><img src=skin/zipulragi_dairy2/head_date.gif border=0 alt='날짜별로 보기'></a></td>

  <td align=center valign=bottom class=kissofgod-head-td><img src=skin/zipulragi_dairy2/head_weather.gif border=0 alt='날씨'></td>

  <td align=center valign=bottom class=kissofgod-head-td width=90%><a onfocus="blur()" href='/zero/zboard.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=subject&desc=desc&PHPSESSID=e588fff745805489eddf27dcd26b4cbc'><img src=skin/zipulragi_dairy2/head_subject.gif border=0 alt='제목별로 보기'></a></td>

  <td align=left valign=bottom class=kissofgod-head-td><a onfocus="blur()" href='/zero/zboard.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=name&desc=desc&PHPSESSID=e588fff745805489eddf27dcd26b4cbc'><img src=skin/zipulragi_dairy2/head_name.gif border=0 alt='이름별로 보기'></a></td>

  <td align=center valign=bottom class=kissofgod-head-td><a onfocus="blur()" href='/zero/zboard.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=hit&desc=desc&PHPSESSID=e588fff745805489eddf27dcd26b4cbc'><img src=skin/zipulragi_dairy2/head_hit.gif border=0 alt='조회별로 보기'></a></td>
</tr>
<!-- 목록 부분 시작 -->
 
<tr align=center onMouseOver=this.style.backgroundColor='#F1F1F1' onMouseOut=this.style.backgroundColor=''>
  <td height=22 style='font-family:Tahoma;font-size:8pt; padding:0 7'>8</td>
  <!--  <td><input type="checkbox" name="cart" value="19"></td>-->  <!--  <td align=left style='padding-left:10'>&nbsp;</td>-->  <td align=center style='word-break:break-all;cursor:hand;' onclick=location.href="view.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=19"><img src=images/t.gif border=0 width=1 height=3><br>[<B>2002년 06월06일</b>]</td>
  <td align=center style='word-break:break-all;'><img src=skin/zipulragi_dairy2/weather1.gif></td>
  <td align=left style='word-break:break-all;cursor:hand;' onclick=location.href="view.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=19"><img src=images/t.gif border=0 width=1 height=3><br><img src=skin/zipulragi_dairy2/old_head.gif border=0 align=absmiddle>&nbsp;<a href="view.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=19&PHPSESSID=e588fff745805489eddf27dcd26b4cbc"  >가만에 늘어지게 자면서 꾼 꿈들</a> <font style='font-family:Tahoma;font-size:6pt'></font></td> 
  <td align=left style='word-break:break-all;'><img src=images/t.gif border=0 width=1 height=3><br><b> <span onMousedown="ZB_layerAction('zbLayer1','visible')" style=cursor:hand>숲속얘기</span></div></td>
  <td style='font-family:Tahoma;font-size:8pt; padding:0 7'>64</td>
</tr>
<tr><td height=1 colspan=10 class=kissofgod-line1><img src=images/t.gif width=1 height=1></td></tr><!-- 목록 부분 시작 -->
 
<tr align=center onMouseOver=this.style.backgroundColor='#F1F1F1' onMouseOut=this.style.backgroundColor=''>
  <td height=22 style='font-family:Tahoma;font-size:8pt; padding:0 7'>7</td>
  <!--  <td><input type="checkbox" name="cart" value="18"></td>-->  <!--  <td align=left style='padding-left:10'>&nbsp;</td>-->  <td align=center style='word-break:break-all;cursor:hand;' onclick=location.href="view.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=18"><img src=images/t.gif border=0 width=1 height=3><br>[<B>2002년 05월30일</b>]</td>
  <td align=center style='word-break:break-all;'><img src=skin/zipulragi_dairy2/weather3.gif></td>
  <td align=left style='word-break:break-all;cursor:hand;' onclick=location.href="view.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=18"><img src=images/t.gif border=0 width=1 height=3><br><img src=skin/zipulragi_dairy2/old_head.gif border=0 align=absmiddle>&nbsp;<a href="view.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=18&PHPSESSID=e588fff745805489eddf27dcd26b4cbc"  >내 가면은..</a> <font style='font-family:Tahoma;font-size:6pt'></font></td> 
  <td align=left style='word-break:break-all;'><img src=images/t.gif border=0 width=1 height=3><br><b> <span onMousedown="ZB_layerAction('zbLayer2','visible')" style=cursor:hand>숲속얘기</span></div></td>
  <td style='font-family:Tahoma;font-size:8pt; padding:0 7'>23</td>
</tr>
<tr><td height=1 colspan=10 class=kissofgod-line1><img src=images/t.gif width=1 height=1></td></tr><!-- 목록 부분 시작 -->
 
<tr align=center onMouseOver=this.style.backgroundColor='#F1F1F1' onMouseOut=this.style.backgroundColor=''>
  <td height=22 style='font-family:Tahoma;font-size:8pt; padding:0 7'>6</td>
  <!--  <td><input type="checkbox" name="cart" value="17"></td>-->  <!--  <td align=left style='padding-left:10'>&nbsp;</td>-->  <td align=center style='word-break:break-all;cursor:hand;' onclick=location.href="view.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=17"><img src=images/t.gif border=0 width=1 height=3><br>[<B>2002년 05월25일</b>]</td>
  <td align=center style='word-break:break-all;'><img src=skin/zipulragi_dairy2/weather0.gif></td>
  <td align=left style='word-break:break-all;cursor:hand;' onclick=location.href="view.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=17"><img src=images/t.gif border=0 width=1 height=3><br><img src=skin/zipulragi_dairy2/old_head.gif border=0 align=absmiddle>&nbsp;<a href="view.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=17&PHPSESSID=e588fff745805489eddf27dcd26b4cbc"  >요즘은 Study mode입니다.</a> <font style='font-family:Tahoma;font-size:6pt'></font></td> 
  <td align=left style='word-break:break-all;'><img src=images/t.gif border=0 width=1 height=3><br><b> <span onMousedown="ZB_layerAction('zbLayer3','visible')" style=cursor:hand>숲속얘기</span></div></td>
  <td style='font-family:Tahoma;font-size:8pt; padding:0 7'>23</td>
</tr>
<tr><td height=1 colspan=10 class=kissofgod-line1><img src=images/t.gif width=1 height=1></td></tr><!-- 목록 부분 시작 -->
 
<tr align=center onMouseOver=this.style.backgroundColor='#F1F1F1' onMouseOut=this.style.backgroundColor=''>
  <td height=22 style='font-family:Tahoma;font-size:8pt; padding:0 7'>5</td>
  <!--  <td><input type="checkbox" name="cart" value="16"></td>-->  <!--  <td align=left style='padding-left:10'>&nbsp;</td>-->  <td align=center style='word-break:break-all;cursor:hand;' onclick=location.href="view.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=16"><img src=images/t.gif border=0 width=1 height=3><br>[<B>2002년 05월20일</b>]</td>
  <td align=center style='word-break:break-all;'><img src=skin/zipulragi_dairy2/weather0.gif></td>
  <td align=left style='word-break:break-all;cursor:hand;' onclick=location.href="view.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=16"><img src=images/t.gif border=0 width=1 height=3><br><img src=skin/zipulragi_dairy2/old_head.gif border=0 align=absmiddle>&nbsp;<a href="view.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=16&PHPSESSID=e588fff745805489eddf27dcd26b4cbc"  >어느새.. 벌써 5월도 중반을 넘어 훌쩍..</a> <font style='font-family:Tahoma;font-size:6pt'></font></td> 
  <td align=left style='word-break:break-all;'><img src=images/t.gif border=0 width=1 height=3><br><b> <span onMousedown="ZB_layerAction('zbLayer4','visible')" style=cursor:hand>숲속얘기</span></div></td>
  <td style='font-family:Tahoma;font-size:8pt; padding:0 7'>15</td>
</tr>
<tr><td height=1 colspan=10 class=kissofgod-line1><img src=images/t.gif width=1 height=1></td></tr><!-- 목록 부분 시작 -->
 
<tr align=center onMouseOver=this.style.backgroundColor='#F1F1F1' onMouseOut=this.style.backgroundColor=''>
  <td height=22 style='font-family:Tahoma;font-size:8pt; padding:0 7'>4</td>
  <!--  <td><input type="checkbox" name="cart" value="15"></td>-->  <!--  <td align=left style='padding-left:10'>&nbsp;</td>-->  <td align=center style='word-break:break-all;cursor:hand;' onclick=location.href="view.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=15"><img src=images/t.gif border=0 width=1 height=3><br>[<B>2002년 05월12일</b>]</td>
  <td align=center style='word-break:break-all;'><img src=skin/zipulragi_dairy2/weather0.gif></td>
  <td align=left style='word-break:break-all;cursor:hand;' onclick=location.href="view.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=15"><img src=images/t.gif border=0 width=1 height=3><br><img src=skin/zipulragi_dairy2/old_head.gif border=0 align=absmiddle>&nbsp;<a href="view.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=15&PHPSESSID=e588fff745805489eddf27dcd26b4cbc"  >요즘은..</a> <font style='font-family:Tahoma;font-size:6pt'></font></td> 
  <td align=left style='word-break:break-all;'><img src=images/t.gif border=0 width=1 height=3><br><b> <span onMousedown="ZB_layerAction('zbLayer5','visible')" style=cursor:hand>숲속얘기</span></div></td>
  <td style='font-family:Tahoma;font-size:8pt; padding:0 7'>17</td>
</tr>
<tr><td height=1 colspan=10 class=kissofgod-line1><img src=images/t.gif width=1 height=1></td></tr><!-- 목록 부분 시작 -->
 
<tr align=center onMouseOver=this.style.backgroundColor='#F1F1F1' onMouseOut=this.style.backgroundColor=''>
  <td height=22 style='font-family:Tahoma;font-size:8pt; padding:0 7'>3</td>
  <!--  <td><input type="checkbox" name="cart" value="14"></td>-->  <!--  <td align=left style='padding-left:10'>&nbsp;</td>-->  <td align=center style='word-break:break-all;cursor:hand;' onclick=location.href="view.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=14"><img src=images/t.gif border=0 width=1 height=3><br>[<B>2002년 05월06일</b>]</td>
  <td align=center style='word-break:break-all;'><img src=skin/zipulragi_dairy2/weather0.gif></td>
  <td align=left style='word-break:break-all;cursor:hand;' onclick=location.href="view.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=14"><img src=images/t.gif border=0 width=1 height=3><br><img src=skin/zipulragi_dairy2/old_head.gif border=0 align=absmiddle>&nbsp;<a href="view.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=14&PHPSESSID=e588fff745805489eddf27dcd26b4cbc"  >쵸비츠 주인공 히데키와 나의 공부법</a> <font style='font-family:Tahoma;font-size:6pt'></font></td> 
  <td align=left style='word-break:break-all;'><img src=images/t.gif border=0 width=1 height=3><br><b> <span onMousedown="ZB_layerAction('zbLayer6','visible')" style=cursor:hand>숲속얘기</span></div></td>
  <td style='font-family:Tahoma;font-size:8pt; padding:0 7'>76</td>
</tr>
<tr><td height=1 colspan=10 class=kissofgod-line1><img src=images/t.gif width=1 height=1></td></tr><!-- 목록 부분 시작 -->
 
<tr align=center onMouseOver=this.style.backgroundColor='#F1F1F1' onMouseOut=this.style.backgroundColor=''>
  <td height=22 style='font-family:Tahoma;font-size:8pt; padding:0 7'>2</td>
  <!--  <td><input type="checkbox" name="cart" value="13"></td>-->  <!--  <td align=left style='padding-left:10'>&nbsp;</td>-->  <td align=center style='word-break:break-all;cursor:hand;' onclick=location.href="view.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=13"><img src=images/t.gif border=0 width=1 height=3><br>[<B>2002년 05월05일</b>]</td>
  <td align=center style='word-break:break-all;'><img src=skin/zipulragi_dairy2/weather0.gif></td>
  <td align=left style='word-break:break-all;cursor:hand;' onclick=location.href="view.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=13"><img src=images/t.gif border=0 width=1 height=3><br><img src=skin/zipulragi_dairy2/old_head.gif border=0 align=absmiddle>&nbsp;<a href="view.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=13&PHPSESSID=e588fff745805489eddf27dcd26b4cbc"  >아.. 요즘 시작한것이.. ^^;</a> <font style='font-family:Tahoma;font-size:6pt'></font></td> 
  <td align=left style='word-break:break-all;'><img src=images/t.gif border=0 width=1 height=3><br><b> <span onMousedown="ZB_layerAction('zbLayer7','visible')" style=cursor:hand>숲속얘기</span></div></td>
  <td style='font-family:Tahoma;font-size:8pt; padding:0 7'>18</td>
</tr>
<tr><td height=1 colspan=10 class=kissofgod-line1><img src=images/t.gif width=1 height=1></td></tr><!-- 목록 부분 시작 -->
 
<tr align=center onMouseOver=this.style.backgroundColor='#F1F1F1' onMouseOut=this.style.backgroundColor=''>
  <td height=22 style='font-family:Tahoma;font-size:8pt; padding:0 7'>1</td>
  <!--  <td><input type="checkbox" name="cart" value="11"></td>-->  <!--  <td align=left style='padding-left:10'>&nbsp;</td>-->  <td align=center style='word-break:break-all;cursor:hand;' onclick=location.href="view.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=11"><img src=images/t.gif border=0 width=1 height=3><br>[<B>2002년 04월27일</b>]</td>
  <td align=center style='word-break:break-all;'><img src=skin/zipulragi_dairy2/weather0.gif></td>
  <td align=left style='word-break:break-all;cursor:hand;' onclick=location.href="view.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=11"><img src=images/t.gif border=0 width=1 height=3><br><img src=skin/zipulragi_dairy2/old_head.gif border=0 align=absmiddle>&nbsp;<a href="view.php?id=diary&page=1&sn1=&divpage=1&sn=off&ss=on&sc=on&select_arrange=headnum&desc=asc&no=11&PHPSESSID=e588fff745805489eddf27dcd26b4cbc"  >드디어 중간고사가 끝났습니다.</a> <font style='font-family:Tahoma;font-size:6pt'></font></td> 
  <td align=left style='word-break:break-all;'><img src=images/t.gif border=0 width=1 height=3><br><b> <span onMousedown="ZB_layerAction('zbLayer8','visible')" style=cursor:hand>숲속얘기</span></div></td>
  <td style='font-family:Tahoma;font-size:8pt; padding:0 7'>26</td>
</tr>
<tr><td height=1 colspan=10 class=kissofgod-line1><img src=images/t.gif width=1 height=1></td></tr>
<!-- 마무리 부분입니다 -->
<tr><td colspan=10 height=1 class='kissofgod-line2'><img src=images/t.gif border=0 width=1 height=1></td></tr>
</table>

<!-- 버튼 부분 -->
<table border=0 cellspacing=1 cellpadding=1 width=95%>
<tr>
 <td width=40% nowrap style='padding-top:10'> 
  <a onfocus="blur()" href='/zero/zboard.php?id=diary&page=1&category=&sn=off&ss=on&sc=on&keyword=&prev_no=9&sn1=&divpage=1&PHPSESSID=e588fff745805489eddf27dcd26b4cbc'><img src=skin/zipulragi_dairy2/i_list.gif border=0 align=absmiddle></a><img src=images/t.gif border=0 width=5 height=1>
  <Zeroboard <img src=skin/zipulragi_dairy2/i_admin.gif border=0 align=absmiddle></a></td>
 <td align=center nowrap style='padding-top:10' class=kissofgod-tahoma8>
<!-- 페이지 출력 ---------------------->
   <Zeroboard [prev]</a>
    <font style=font-size:8pt><b>1</b>    <Zeroboard [next]</a></td>
 <td align=right width=40% style='padding-top:10'>
  <Zeroboard <img src=skin/zipulragi_dairy2/i_write.gif border=0 align=absmiddle></a></td>
</tr>
</table>
</form>

<table border=0 cellpadding=0 cellspacing=0 width=95%>

<form method="post" name="search" action="/zero/zboard.php"><input type="hidden" name="PHPSESSID" value="e588fff745805489eddf27dcd26b4cbc" /><input type="hidden" name="page" value="1"><input type="hidden" name="id" value="diary"><input type="hidden" name="select_arrange" value="headnum"><input type="hidden" name="desc" value="asc"><input type="hidden" name="page_num" value="8"><input type="hidden" name="selected"><input type="hidden" name="exec"><input type="hidden" name="sn" value="off"><input type="hidden" name="ss" value="on"><input type="hidden" name="sc" value="on"><input type="hidden" name="category" value="">

<tr>
  <td align=center>
  <table border=0 cellspacing=0 cellpadding=0>
  <tr>
     <td valign=bottom>
       <a href="javascript:OnOff('sn')" onfocus="blur()"><img src=skin/zipulragi_dairy2/name_off.gif border=0 width=31 height=11 name=sn></a><a href="javascript:OnOff('ss')" onfocus="blur()"><img src=skin/zipulragi_dairy2/subject_on.gif border=0 width=55 height=11 name=ss></a><a href="javascript:OnOff('sc')" onfocus="blur()"><img src=skin/zipulragi_dairy2/content_on.gif border=0 width=61 height=11 name=sc></a></td>
     <td style='padding:0 0 0 3'><input type="text" name="keyword" value="" class="kissofgod-input-search" size="15"></td>
     <td valign=bottom><input type="image" src="skin/zipulragi_dairy2/search.gif?PHPSESSID=e588fff745805489eddf27dcd26b4cbc" border="0" width="53" height="11" onfocus="blur()" title='검색어를 입력하셨으면 누르세요.'></td>
     <td valign=bottom><a onfocus="blur()" href='/zero/zboard.php?id=diary&PHPSESSID=e588fff745805489eddf27dcd26b4cbc'><img src=skin/zipulragi_dairy2/search2.gif border=0 width=15 height=11 title='게시판 목록으로 되돌아갑니다.'></a></td>
  </tr>
  </table>

  </td>
</tr>
<tr>
  <td height=10><img src=images/t.gif border=0 width=1 height=1></td>
</tr>
</form>
</table>

<script>
print_ZBlayer('zbLayer1', 'http://www.fstory.net', 'ZnN0b3J5QG1haWwuY28ua3I=', '1', 'diary', '숲속얘기', '', '', '', '');
print_ZBlayer('zbLayer2', 'http://www.fstory.net', 'ZnN0b3J5QG1haWwuY28ua3I=', '1', 'diary', '숲속얘기', '', '', '', '');
print_ZBlayer('zbLayer3', 'http://www.fstory.net', 'ZnN0b3J5QG1haWwuY28ua3I=', '1', 'diary', '숲속얘기', '', '', '', '');
print_ZBlayer('zbLayer4', 'http://www.fstory.net', 'ZnN0b3J5QG1haWwuY28ua3I=', '1', 'diary', '숲속얘기', '', '', '', '');
print_ZBlayer('zbLayer5', 'http://www.fstory.net', 'ZnN0b3J5QG1haWwuY28ua3I=', '1', 'diary', '숲속얘기', '', '', '', '');
print_ZBlayer('zbLayer6', 'http://www.fstory.net', 'ZnN0b3J5QG1haWwuY28ua3I=', '1', 'diary', '숲속얘기', '', '', '', '');
print_ZBlayer('zbLayer7', 'http://www.fstory.net', 'ZnN0b3J5QG1haWwuY28ua3I=', '1', 'diary', '숲속얘기', '', '', '', '');
print_ZBlayer('zbLayer8', 'http://www.fstory.net', 'ZnN0b3J5QG1haWwuY28ua3I=', '1', 'diary', '숲속얘기', '', '', '', '');
</script>			<table border=0 cellpadding=0 cellspacing=0 height=20 width=95%>
			<tr>
				<td align=right style=font-family:tahoma,굴림;font-size:8pt;line-height:150%;letter-spacing:0px>
					<font style=font-size:7pt>Copyright 1999-2002</font> <a href="http://www.zeroboard.com" target="_blank" onfocus="blur()"><font tyle=font-family:tahoma,굴림;font-size:5pt;>Zeroboard</a> / skin by <font style="font-family:돋움; font-size:8pt; color:navy"><a href="http://kissofgod.net" target="_blank">신의키스</a></font> / edit by <A href="http://yukihome.com" target="_blank">YuKi</a>				</td>   
			</tr>
			</table>
			</div>			</body>
			</html>
			

<!--
 Session Excuted  : 0.0004
 Connect Checked  : 0.0009
 Query Excuted  : 0.008
 PHP Excuted  : 0.038
 Check Lists : 0.020
 Skins Excuted  : 2.908
 Total Excuted Time : 2.955
-->
