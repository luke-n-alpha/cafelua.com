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
    // Not the homepage, so it is not offered as one. Published as evidence.
    offeredAs: null,
  },
  {
    id: 'L1',
    label: '클래식 (1998 ~ 2001-07)',
    period: '1998 ~ 2001-07-23',
    representative: '20010723051951',
    summary:
      '프레임 없이 title1~4.gif 메뉴 그림을 세로로 늘어놓은 초기 계보. Wayback에 남은 마지막 상태가 2001-07-23이다.',
    // Luke kept this era himself, and his copy is fuller than the capture. The
    // capture is still published so the merge has a source and the archive keeps
    // its own record, but the Atelier offers the curated 1998 edition instead of
    // listing a second, thinner copy of the same site.
    offeredAs: 'C1998',
  },
  {
    id: 'L2.0',
    label: 'ver 2.0 최초판',
    period: '2001-09 ~ 2002-03',
    representative: '20011202212712',
    summary:
      'index.html 안의 800x600 iframe이 main.html(42/560 2분할 프레임)을 부른다. 메뉴에 ai·study 항목이 있다.',
    offeredAs: 'M2',
  },
  {
    id: 'L2.1',
    label: 'ver 2.0 메뉴 개편판',
    period: '2002-03 ~ 2002-11-20',
    representative: '20021120053627',
    summary:
      '프레임 구조는 그대로이고 메뉴가 teatime·tech·zboard 중심으로 바뀐다. 본문 첫 화면이 diary/diary.html이다.',
    offeredAs: 'M2',
  },
  {
    id: 'L2.2',
    label: 'ver 2.0 5분할 재설계판',
    period: '2002-11-28 ~ 2003-07',
    representative: '20021128181318',
    summary:
      'main.html이 topmenu·left·content·right·bottom 5분할 프레임으로 바뀌고 bgm 프레임이 붙는다. album·cartoon·media·insidece 메뉴가 새로 생기고 싸이월드 링크가 처음 등장한다.',
    offeredAs: 'M2',
  },
  {
    id: 'L3',
    label: 'ver 3.0 싸이월드 연동판',
    period: '2003-07-26',
    representative: '20030726202839',
    summary:
      '프레임을 모두 걷어내고 단일 index.html로 돌아간 마지막 판. 본문 대부분을 싸이월드 미니홈피에 넘겼다.',
    // Not a redesign but a backup and a bridge: by 2003 Cyworld was the home and
    // this page pointed at it. It carries no corner of its own — three files the
    // earlier captures lack, and a menu aimed back at them — so its files go into
    // the merged edition and the page itself is not offered separately.
    offeredAs: 'M2',
  },
];

// The two editions Luke kept himself, restored from his own files rather than
// from the archive. They open the same timeline, so the Atelier offers them in
// the same list. The 1998 edition is where the classic era is served from: the
// 2001-07 capture is merged into it at publish time rather than being offered
// as a separate, thinner copy of the same site.
export const CURATED_EDITIONS = [
  {
    id: 'C1997',
    label: '1997년 판',
    period: '1997',
    base: '/1997-homepage',
    entry: 'index.html',
    summary: '가장 이른 판. 루크가 직접 보관해 온 파일이고, 목록에만 남아 본문을 잃었던 시 27편을 뒷날 판에서 되찾아 채웠다.',
  },
  {
    id: 'C1998',
    label: '클래식 (1998 ~ 2001.07)',
    period: '1998 ~ 2001-07',
    base: '/1998-homepage',
    entry: 'index.html',
    summary: 'title1~4.gif 메뉴 그림을 세로로 늘어놓은 초기 계보. 루크의 보관본을 바탕으로, 2001년 7월 캡처에만 남아 있던 자료를 더해 완성했다.',
  },
];

// The ver 2.0 era ran from 2001-09 to 2003-07 and the archive caught it three
// times, each catching a different amount. Rather than offer three partial
// copies of one site, they are published once as a merged edition: every file
// any of them holds, wearing the chrome of the one that still renders.
//
// This is an edited edition, not a moment in time. It never existed exactly
// like this, and the three captures it is built from stay published beside it.
export const MERGED_EDITION = {
  id: 'M2',
  label: 'ver 2.0 통합본',
  period: '2001-09 ~ 2003-07',
  directory: 'ver2-merged',
  // The 2002-11-20 capture is the one whose chrome survives intact: its side
  // menu, its background and its character art all render. The 5-pane redesign
  // carries more menu entries but lost its backdrop, so it reads as a black page.
  chrome: '20021120053627',
  // Oldest first; later captures win a collision because the site only grew.
  // The 2003 edition is in here for its files, not its design: it was a backup
  // and a bridge to Cyworld rather than a redesign, and it carries no corner of
  // its own — three files and a menu that points back at what came before.
  contributors: ['20011202212712', '20021120053627', '20021128181318', '20030726202839'],
  summary:
    'ver 2.0 시대의 세 캡처를 하나로 합친 편집본. 화면은 2002년 11월 20일 판을 쓰고, 내용은 세 캡처가 가진 것을 모두 담았다. 어느 시점에도 이대로 존재한 적은 없다.',
};

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
// The BGM player is restored in full — Shinobu's BGM Player 1.5, its script and
// its buttons — but the music it streamed was never archived, and the addresses
// it read from (Chollian, Netian) have been gone for twenty years. Luke says it
// mostly carried anime themes and named the ones he kept putting on, so the
// player keeps its face and its controls and plays these instead.
export const BGM_TRACKS = [
  { id: 'ThBGx26Mjog', title: '보노보노 - 지름길로 가고파' },
  { id: 'xWWUNYqQ2XA', title: '아즈망가 대왕 - 소녀의 로망' },
  { id: '5JnFzJNCT28', title: '그남자 그여자 - 야야야' },
];

// The 최신 애니 감상록 corner listed what Luke had just watched, each with a
// thumbnail and a page that played the opening through Windows Media Player.
// Every thumbnail is gone and the video it streamed with it, but the corner
// names its eight titles outright and they are all 2002. Openings come from
// YouTube now, and each thumbnail is a still from that same opening, so the
// picture and the video agree.
export const RECENT_ANIME = [
  { thumb: 'degi.jpg', page: 'recentani/degi/degiop.html', title: '파뇨파뇨 디지캐럿', video: 'DL70IyKEWdc' },
  { thumb: 'abeno.jpg', page: 'recentani/abe/abenoop.html', title: '아베노교 마법상점', video: 'pLsE-QCw7tk' },
  { thumb: 'chobit.jpg', page: 'recentani/cho/choop.html', title: '쵸비츠', video: 'O97zLf3OjUk' },
  { thumb: 'azmanga.jpg', page: 'recentani/azmanga/azop.html', title: '아즈망가대왕', video: 'xFL9mn2zX_U' },
  { thumb: 'she.jpg', page: 'recentani/she/sheop.html', title: '최종병기 그녀', video: 'WOZTvLBG-S0' },
  { thumb: 'hare.jpg', page: 'recentani/hare/hareop.html', title: '정글은 언제나 OVA', video: 'h-iTW2vJ_F4' },
  { thumb: 'mahoro.jpg', page: 'recentani/mahoro/mahoroop.html', title: '마호로매틱2기', video: 'bw00bY0VlFs' },
  { thumb: 'yusi.jpg', page: 'recentani/yusi/yusiop.html', title: '쁘티프리 유시', video: '13V8C6yL2i8' },
];

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
