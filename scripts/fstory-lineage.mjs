// Machine-derived design lineage for the restored fstory.net captures.
// Evidence: scripts/analyze-fstory-lineage.py compares each capture's composed
// frame chrome (index.html plus every frame/iframe document it loads), its menu
// link set and its DOM skeleton hash. Captures that share all three belong to
// the same design generation.
export const LINEAGES = [
  {
    id: 'L0',
    label: '도메인 호스팅 안내',
    period: '2001-07-15',
    representative: '20010715123146',
    summary: '도메인 등록 대행사의 기본 안내 화면. 홈페이지 본체가 아니다.',
  },
  {
    id: 'L1',
    label: '클래식 (1998 ~ 2001-07)',
    period: '1998 ~ 2001-07-23',
    representative: '20010723051951',
    summary:
      '프레임 없이 title1~4.gif 메뉴 그림을 세로로 늘어놓은 초기 계보. Wayback에 남은 마지막 상태가 2001-07-23이다.',
  },
  {
    id: 'L2.0',
    label: 'ver 2.0 최초판',
    period: '2001-09 ~ 2002-03',
    representative: '20011202212712',
    summary:
      'index.html 안의 800x600 iframe이 main.html(42/560 2분할 프레임)을 부른다. 메뉴에 ai·study 항목이 있다.',
  },
  {
    id: 'L2.1',
    label: 'ver 2.0 메뉴 개편판',
    period: '2002-03 ~ 2002-11-20',
    representative: '20021120053627',
    summary:
      '프레임 구조는 그대로이고 메뉴가 teatime·tech·zboard 중심으로 바뀐다. 본문 첫 화면이 diary/diary.html이다.',
  },
  {
    id: 'L2.2',
    label: 'ver 2.0 5분할 재설계판',
    period: '2002-11-28 ~ 2003-07',
    representative: '20021128181318',
    summary:
      'main.html이 topmenu·left·content·right·bottom 5분할 프레임으로 바뀌고 bgm 프레임이 붙는다. album·cartoon·media·insidece 메뉴가 새로 생기고 싸이월드 링크가 처음 등장한다.',
  },
  {
    id: 'L3',
    label: 'ver 3.0 싸이월드 연동판',
    period: '2003-07-26',
    representative: '20030726202839',
    summary:
      '프레임을 모두 걷어내고 단일 index.html로 돌아간 마지막 판. 본문 대부분을 싸이월드 미니홈피에 넘겼다.',
  },
];

export const SNAPSHOTS = [
  ['20010715123146', '2001-07-15', 'L0', '도메인 호스팅 초기 화면'],
  ['20010723051951', '2001-07-23', 'L1', '클래식 계보의 마지막 확인 상태'],
  ['20010925220320', '2001-09-25', 'L2.0', 'ver 2.0 최초 확인'],
  ['20011202212712', '2001-12-02', 'L2.0', 'ver 2.0 · 본문 프레임까지 확보'],
  ['20020325014505', '2002-03-25', 'L2.1', '메뉴 개편 직후'],
  ['20020924164928', '2002-09-24', 'L2.1', '메뉴 개편 · 배경 back.gif'],
  ['20021120053627', '2002-11-20', 'L2.1', '메뉴 개편 · 배경 back.jpg'],
  ['20021128181318', '2002-11-28', 'L2.2', '5분할 프레임 재설계'],
  ['20030726202839', '2003-07-26', 'L3', '싸이월드 연동형 마지막 판'],
];

// Directory rename learned from the archive itself: every `mydoc/novel/**`
// reference resolves to the same file under `myletter/**` (32 corroborating
// path pairs, spanning the windy/ and short/ subtrees). Colour-variant
// Zeroboard skin folders also "match" by filename but are different artwork,
// so they are deliberately not listed here.
export const PATH_ALIASES = [
  { from: 'mydoc/novel/', to: 'myletter/', corroborations: 32 },
];

// Hosts that carried a menu entry of this site and whose service has since
// closed. Only these get an outbound link rewritten to the notice page; every
// other external link is left exactly as the page wrote it, because a live site
// must not be labelled dead. Evidence for each entry is a menu link inside this
// archive's own frame chrome. Luke's own Cyworld mini-hompy is converted before
// this list is consulted, so it keeps its dedicated notice page; every other
// Cyworld address falls through to the generic "service closed" notice.
export const RETIRED_HOSTS = [
  { host: 'chollian.net', note: '천리안 개인 홈페이지·CGI 서비스. 게시판(purybbs.cgi)과 카운터(ics.cgi) 메뉴가 여기를 가리켰다.' },
  { host: 'netian.com', note: '네띠앙. 2003년 서비스 종료. 방문자 카운터 이미지가 여기에 있었다.' },
  { host: 'com.ne.kr', note: '네띠앙 무료 도메인. christian 메뉴가 fstory.com.ne.kr 를 가리켰다.' },
  { host: 'nahome.cc', note: '나홈. 배경 그림 호스팅. 서비스 종료.' },
  { host: 'cyworld.com', note: '싸이월드. 서비스 종료. 링크 페이지의 지인 미니홈피도 모두 열리지 않는다.' },
];

// Earlier addresses whose pages the later editions never link back to. They are
// recovered and published inside each capture, but nothing on fstory.net points
// at them, so the Atelier offers them as their own restore points rather than
// leaving the content unreachable. The entry paths are verified at publish time.
//
// The Netian welcome page uses the same title1~4.gif image-map menu as the L1
// classic lineage, which is where that design came from.
export const ANNEXES = [
  {
    id: 'netian',
    label: '네티앙 시절',
    period: '1999-03 ~ 2001',
    snapshot: '20011202212712',
    entry: 'netian/index__e97a8fd3.html',
    summary:
      'fstory.net 도메인을 쓰기 전, my.netian.com/~fstory 에 있던 홈페이지. 첫 화면에 "1999.3.17부터 방문자"와 "100% 메모장 노가다" 라고 적혀 있다. L1 클래식 계보와 같은 title1~4.gif 이미지맵 메뉴를 쓴다.',
  },
  {
    id: 'chollian-guestbook',
    label: '천리안 방명록',
    period: '2001 ~ 2002',
    snapshot: '20021128181318',
    entry: 'chollian/cgi/pury/purybbs.html',
    summary:
      'cgi.chollian.net/~foreststory 에 있던 PURY BBS 방명록. 목록 화면에 글 본문이 그대로 실리는 형식이라 오간 글과 답글이 남아 있다. 캡처마다 다른 쪽이 잡혀서 한 캡처만으로는 일부만 보이므로, 모든 캡처의 글을 번호로 합쳐 한 페이지로 다시 세웠다.',
  },
];
