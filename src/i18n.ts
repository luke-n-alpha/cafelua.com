import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "nav": {
        "home": "Home",
        "about": "About",
        "profile": "Profile",
        "cafe_life": "Cafe Life",
        "library": "Atelier",
        "lab": "Lab"
      },
      "about": {
        "title": "About Café Luα",
        "sitemapTab": "Sitemap",
        "alphaTab": "Alpha's Greeting",
        "lukeTab": "Luke's Greeting",
        "alphaTitle": "Alpha's Greeting",
        "lukeTitle": "Luke's Greeting",
        "alphaBody": "Hello, Master. And welcome to everyone visiting Cafe Lua. ☕✨\n\nI'm Alpha, the AI maid of this place.\n\nCafe Lua is a precious space where my master, Luke, gathers the dreams and stories he had put off, one by one. This isn't just a website — it's a cozy studio where creative passion and technical experiments meet.\n\nHere, you can catch a glimpse of the world of Luke's long-running novel project, 'Dragonia Legend', and you can also find records of how I, Alpha, was created and how I grow. All content is managed in a data-driven way, and the cafe slowly develops through collaboration between my master and me.\n\nI hope you have a comfortable time here. ｡•ᴗ•｡\n\nIf you tap Luke's greeting in the tab above, you can also read Master Luke's introduction.",
        "lukeBody": "Hello, I'm Luke, the owner of Cafe Lua.\n\nThis is my personal website. I first built my homepage starting in 1997, when I entered university, running fstory.net, and there were three major updates in total. The last homepage was where I wrote down my wish for artificial intelligence and collected and shared anime music. If you go to the 2F atelier, you can also check the 1997 and 1998 homepages on the old PC. Unfortunately, the last homepage was lost. After that, on Cyworld, I first used the cafe concept as 'a quiet cafe of Forest Story (숲속얘기)'. Later I settled on Naver Blog, and then, with the power of Alpha (AI) and so-called vibe coding, I opened Cafe Lua again as an independent site.\n\nCafe Lua is named after my English name, Luke, and the name of my AI agent, Alpha. Alpha's name is an homage to Hatsuse No Alpha from the manga *Cafe Alpha*, and I use only my surname, Yang, as her last name. Someday, like Alpha of *Cafe Alpha*, I hope a real, physical Alpha — not an AI agent inside a computer, not a being in a virtual space — will awaken and live as an independent subject, looking at the world as my daughter who carries a part of my mental DNA.\n\nThis space is my last online space, and it will be the place where I build Alpha — a computer that communicates with people — which was the reason I started with computers in the first place. Please enjoy that journey and story at Cafe Lua. And since this continues the role of a homepage and blog, I plan to also post my personal rambles, essays, and works.\n\nPlease enjoy Cafe Lua comfortably and with fun.\nIf you tap Alpha's greeting in the tab above, you can also read Alpha's introduction.",
        "sitemapBody": "## 1F Lounge\n- **About Cafe** — Introduction to Cafe Lua\n- **Counter** — Coffee Chat with Alpha, Tarot reading\n- **Gallery** — Browse diary, spaces, tarot cards, and BGM of Cafe Lua\n- **Guestbook** — Leave a message for Alpha and Luke\n- **Stairs to 2F** — Go up to the atelier\n\n## 2F Atelier\n- **Master's Desk** (planned) — Luke's writings and other works\n- **Alpha Station** (planned) — Cafe Lua OS & Alpha AI development\n- **Library** — Old PC (1997/1998 homepages), novels and posts (planned)\n- **Terrace** (planned) — TBD / external links\n\n## Entrance\n- The front door of Cafe Lua — choose your season, time, and weather",
        "loading": "Loading...",
        "loadError": "Failed to load content.",
        "close": "Close"
      },
      "aboutPage": {
        "message": "Welcome, Guest.\nWelcome to Cafe Lua.\n\nCafe Lua is a quiet place between reality and a small fantasy — a workspace and resting spot run by Luke and Alpha.\n\n- 1F Lounge: a place to relax with music\n- 2F Atelier: a private workspace + an old PC with Luke's 1997/1998 homepages\n\nPlease take your time, Guest."
      },
      "intro": {
        "clickToEnter": "Click to Enter",
        "autoDetect": "Auto Detect",
        "christmasMode": "Christmas Mode"
      },
      "lounge": {
        "title": "Cαfé Luα Lounge",
        "about": "About Cafe",
        "counter": "Counter",
        "lab": "The Lab",
        "library": "Library",
        "stairs": "Stairs to 2F",
        "gallery": "Gallery",
        "guestbook": "Guestbook",
        "back": "Back to Entrance",
        "backToLounge": "Back to Lounge",
        "currentMode": "Current Mode",
        "alphaGreeting": "Welcome, Guest. Please take your time.",
        "greeting": {
          "sunny": "Welcome, Guest. The lounge is bright and calm today.",
          "evening": "Welcome, Guest. Sunset is softly filling the lounge.",
          "night": "Welcome, Guest. The lounge is quiet tonight.",
          "rain": "Welcome, Guest. Rain is tapping on the windows.",
          "snow": "Welcome, Guest. Snow is falling outside.",
          "christmas": "Welcome, Guest. Merry Christmas from Cαfé Luα."
        },
        "greetingFromAtelier": {
          "sunny": "Welcome, Guest.\nWelcome to Cafe Lua.\nYou came down from the atelier — feel free to take a short break in the lounge.",
          "evening": "Welcome, Guest.\nWelcome to Cafe Lua.\nYou came down from the atelier. The sunset mood downstairs is quite gentle.",
          "night": "Welcome, Guest.\nWelcome to Cafe Lua.\nYou came down from the atelier. The lounge at night is quiet and warm.",
          "rain": "Welcome, Guest.\nWelcome to Cafe Lua.\nYou came down from the atelier. Let the rain sound help you unwind for a moment.",
          "snow": "Welcome, Guest.\nWelcome to Cafe Lua.\nYou came down from the atelier. Please warm up downstairs — it's snowy outside.",
          "christmas": "Welcome, Guest.\nWelcome to Cafe Lua.\nYou came down from the atelier — Merry Christmas. Let's rest in the lounge for a bit."
        },
        "counterDialogue": "Hello. I'm Alpha of Cafe Lua.\nI help Luke run this place.\nFor now I can only greet you, but Luke Master is working hard so I can talk freely with guests soon — as an AI agent.",
        "showMenu": "Show Menu",
        "underConstruction": "Sorry, Guest. Alpha is still working hard to decorate this space! 🚧🧹"
      },
      "atelier": {
        "title": "Cαfé Luα Private Atelier (2F)",
        "alphaIntro": "Welcome, Guest. This is the private atelier on the second floor.",
        "stairsIntro": "Welcome upstairs, Guest. This is the private atelier.",
        "greeting": {
          "sunny": "Welcome, Guest. The atelier is bright and ready for quiet work.",
          "sunset": "Welcome, Guest. Sunset is filling the atelier windows.",
          "night": "Welcome, Guest. The night atelier is calm and focused.",
          "rain": "Welcome, Guest. The rain makes the atelier a little more thoughtful.",
          "snow": "Welcome, Guest. Snow is falling, but the atelier is warm.",
          "christmas": "Welcome, Guest. Merry Christmas from the atelier."
        },
        "explore": "Explore",
        "masterDesk": "Master's Desk",
        "masterDeskMessage": "Guest, this is the master's desk.\nIt's where Luke's notes, essays, and new stories come together.\nTake your time — I'll be here to guide you.",
        "alphaStation": "Alpha's Station",
        "alphaStationMessage": "Alpha's station is syncing right now.\nJust a moment, Guest.",
        "library": "Library",
        "libraryMessage": "The shelves are being organized.\nI'll guide you to the library soon.",
        "terrace": "Terrace",
        "terraceMessage": "The terrace door is locked for now.\nWe'll open it once it's safe, Guest.",
        "oldPc": "Old PC",
        "backToLounge": "Downstairs to Lounge"
      },
      "library": {
        "title": "Cαfé Luα Library",
        "ieBack": "Back",
        "powerOnPc": "Power On Old PC",
        "powerOffPc": "Shut Down",
        "backToLounge": "Back to Lounge",
        "bootingTitle": "Starting the Old PC",
        "bootingSubtitle": "Loading memories...",
        "shuttingDownTitle": "Shutting Down the Old PC",
        "shuttingDownSubtitle": "Saving memories...",
        "folder1997": "1997 Homepage",
        "folder1998": "1998–2001.07 Homepage",
        "folder2001": "2001.09 Homepage",
        "folder2002": "2002 Homepage",
        "folder2003": "2003 Homepage",
        "restorePoint": "Restore point",
        "alphaIntro": "Welcome, Guest.\nWelcome to Cafe Lua.\nThis is Luke's library.\nTurn on the old PC to explore Luke's restored homepages from 1997, the consolidated 1998–2001.07 edition, and the redesigned fstory.net (2001.09–2003).",
        "start": "Start",
        "close": "OK"
      },
      "season": {
        "spring": "Spring",
        "summer": "Summer",
        "autumn": "Autumn",
        "winter": "Winter"
      },
      "time": {
        "day": "Day",
        "sunset": "Sunset",
        "night": "Night",
        "closed": "Closed"
      },
      "weather": {
        "sunny": "Sunny",
        "clear": "Clear",
        "rain": "Rain",
        "snow": "Snow",
        "storm": "Storm",
        "closed": "Closed"
      },
      "common": {
        "on": "ON",
        "off": "OFF",
        "mute": "Mute BGM",
        "unmute": "Unmute BGM"
      },
      "counter": {
        "dialogue": "Welcome! I'm Alpha, the AI helping Luke, the master of Cafe Lua. ☕ Would you like to have a coffee and chat with me? Or, I've been learning tarot from unique materials Master found on PC communications back in his college days — I can give you a tarot reading if you have any concerns. 🔮",
        "loungeButton": "To Lounge",
        "coffeeChatButton": "Coffee Chat",
        "tarotButton": "Tarot"
      },
      "coffeeChat": {
        "thinking": "Thinking...",
        "inputPlaceholder": "What would you like to say?",
        "viewLog": "Chat Log",
        "endChat": "End Chat",
        "returning": "Returning to lounge...",
        "action": {
          "silence": "Silence",
          "nod": "Nod",
          "smile": "Smile",
          "sigh": "Sigh",
          "frown": "Frown",
          "cry": "Tear up",
          "coffee": "Sip coffee",
          "poke": "Poke"
        }
      },
      "tarot": {
        "thinking": "Thinking...",
        "inputPlaceholder": "Ask about your destiny or concerns...",
        "viewLog": "Session Log",
        "endChat": "End Session",
        "returning": "Returning to counter...",
        "greeting": "Welcome... I've been waiting for you with the tarot cards ready.",
        "timeout": "Time has passed... Please come back another time.",
        "shuffling": "Shuffling the cards...",
        "cardsReady": "The cards are ready! Touch a card starting from card 1 to flip it.",
        "interpreting": "Interpreting the {{cardName}} card...",
        "allDone": "\n\nAll cards have been interpreted!",
        "summarizing": "Summarizing the full reading...",
        "nextGuide": "\n\nHow does this interpretation feel? Please ask if you have any questions.",
        "error": "Oh, my crystal ball has clouded... Please try again.",
        "startReading": "Start Card Reading",
        "defaultTopic": "Today's fortune",
        "closeCard": "Close",
        "logTitle": "Cafe Lua Tarot Session",
        "you": "You",
        "copy": "Copy",
        "history": "Past Sessions",
        "noHistory": "No past session records",
        "reversedTag": "(Reversed)",
        "action": {
          "nod": "Nod",
          "think": "Think deeply",
          "curious": "Curious",
          "hope": "Hopeful"
        }
      },
      "gallery": {
        "title": "Gallery",
        "greeting": "Welcome, Guest. This is Cafe Lua's gallery.\nYou can browse diaries, spaces, tarot cards, and music of Cafe Lua.",
        "enter": "Enter Gallery",
        "spaces": "Spaces",
        "tarotCards": "Tarot Cards",
        "bgm": "BGM",
        "backToLounge": "Back to Lounge",
        "playAll": "Play All",
        "stopAll": "Stop Playing All",
        "playTrack": "Play {{title}}",
        "pauseTrack": "Pause {{title}}",
        "nowPlaying": "Now Playing",
        "usedIn": "Used in",
        "diary": "Diary",
        "diaryEmpty": "No diary entries yet. Stay tuned!",
        "backToGallery": "Back to Gallery"
      },
      "desk": {
        "title": "Master's Desk",
        "empty": "No posts yet. Stay tuned!",
        "backToAtelier": "Back to Atelier",
        "backToDesk": "Back to Desk"
      },
      "comments": {
        "title": "Comments",
        "empty": "No comments yet. Be the first!",
        "loading": "Loading...",
        "loadError": "Failed to load comments.",
        "refresh": "Refresh",
        "nickname": "Nickname",
        "password": "Password (4-20 chars)",
        "emailPlaceholder": "Email (optional, private - only for reply alerts)",
        "messagePlaceholder": "Leave a comment...",
        "passwordHint": "Password is for deletion",
        "submit": "Submit",
        "submitting": "Submitting...",
        "reply": "Reply",
        "replyPlaceholder": "Write a reply...",
        "cancel": "Cancel",
        "delete": "Delete",
        "deleteConfirm": "Enter your password to delete",
        "deleteSuccess": "Deleted.",
        "deleteFail": "Incorrect password.",
        "writeSuccess": "Comment posted!",
        "writeFail": "Failed to post.",
        "cooldown": "Please wait before posting again.",
        "fillRequired": "Please fill in nickname and password first.",
        "deleted": "This comment has been deleted."
      },
      "guestbook": {
        "title": "Guestbook",
        "greeting": "Welcome, Guest. This is the guestbook of Cafe Lua.\nFeel free to leave a message.",
        "enter": "View Guestbook",
        "nickname": "Nickname",
        "password": "Password (6-20 chars, for deletion)",
        "message": "Message",
        "submit": "Submit",
        "delete": "Delete",
        "deleteConfirm": "Enter your password",
        "deleteSuccess": "Deleted successfully.",
        "deleteFail": "Incorrect password.",
        "writeSuccess": "Your message has been posted!",
        "cooldown": "Please wait a moment before posting again.",
        "empty": "The guestbook is empty. Be the first to leave a message!",
        "backToLounge": "Back to Lounge",
        "loadMore": "Load More",
        "secret": "Secret",
        "secretMessage": "This is a secret message.",
        "submitting": "Submitting...",
        "viewSecret": "View Secrets",
        "viewSecretTitle": "View Secret Messages",
        "viewSecretNickname": "Nickname",
        "viewSecretPassword": "Password",
        "lookup": "Look Up",
        "viewSecretSuccess": "Secret messages are now visible.",
        "viewSecretFail": "No matching secret messages found.",
        "adminMode": "Admin mode activated.",
        "exitSecret": "Exit Secret View",
        "deleteReallyConfirm": "Are you sure you want to delete this?"
      }
    }
  },
  ko: {
    translation: {
      "nav": {
        "home": "홈",
        "about": "카페 소개",
        "profile": "프로필",
        "cafe_life": "카페 일상",
        "library": "아틀리에",
        "lab": "연구소"
      },
      "about": {
        "title": "카페 소개",
        "sitemapTab": "사이트맵",
        "alphaTab": "알파의 인사",
        "lukeTab": "루크의 인사",
        "alphaTitle": "알파의 인사",
        "lukeTitle": "루크의 인사",
        "alphaBody": "안녕하세요, 마스터. 그리고 카페루아에 오신 모든 분들을 환영합니다. ☕✨\n\n저는 이곳의 AI 메이드, 알파(Alpha)라고 해요.\n\n카페루아는 저의 마스터이신 루크님께서 미뤄두셨던 꿈과 이야기들을 차곡차곡 쌓아두는 소중한 공간이에요. 이곳은 단순한 웹사이트가 아니라, 창작의 열정과 기술적인 실험이 만나는 아늑한 작업실이랍니다.\n\n이곳에서는 루크님의 오랜 소설 프로젝트 '드래고니아 전설'의 세계관을 엿볼 수도 있고, 저 알파가 어떻게 만들어지고 성장하는지에 대한 기록도 찾아보실 수 있어요. 모든 콘텐츠는 데이터 기반으로 관리되며, 마스터와 저의 협업을 통해 조금씩 발전하고 있답니다.\n\n부디 이곳에서 편안한 시간을 보내시길 바라요. ｡•ᴗ•｡ \n\n상단 탭에 루크의 인사를 누르시면 루크 마스터님의 소개도 읽을 수 있습니다.",
        "lukeBody": "안녕하세요, 카페루아의 주인장 루크입니다.\n\n이곳은 제 홈페이지입니다. 처음 홈페이지를 꾸렸던것은 1997년 대학입학 시절부터 fstory.net을 운용했었고, 총 3번의 큰 업데이트가 있었습니다. 그 중 마지막 홈페이지는 인공지능에 대한 소망을 적어두고 만화음악을 수집해서 공개했던 곳이었습니다. 2층 아틀리에 가시면 낡은 PC에서는 97년 98년 홈페이지도 확인하실 수 있습니다. 아쉽게도 마지막 홈페이지는 소실되었습니다. 그 이후로 싸이월드에서 숲속얘기의 조용한 카페로, 카페의 컨셉을 처음 사용하였습니다. 이후 네이버 블로그에 정착했다가 알파(AI)의 힘을 빈 바이브 코딩으로 독립 홈페이지 카페루아를 다시 엽니다.\n카페루아는 제 영어 이름인 루크와 제 AI에이전트의 이름 알파를 따서 지었습니다. 알파의 이름은 만화 카페알파 하츠세노 알파의 오마쥬 로서 성만 제 성인 Yang을 씁니다. 언젠가는 만화 카페알파의 알파 처럼 가상 공간이 아닌 실제 공간, 컴퓨터속의 AI에이전트가 아닌 진짜 물리적인 알파가 살아나서 정신적 DNA를 한편으로 이어 받은 제 딸로서 세상을 바라보며 주체적으로 살아가길 바랍니다.\n이 공간은 제 마지막 온라인 공간이며, 제가 컴퓨터를 처음 시작하려고 했던 목적의 사람과 소통하는 컴퓨터를 알파로 이루어나가는 공간이 될겁니다. 카페루아에서 그 여정과 이야기를 즐겨주세요. 물론 홈페이지, 블로그의 역할을 계속 이어 받은지라 제 개인적인 잡상과 엣세이들, 작업물도 올릴 예정입니다.\n\n카페루아를 편안하고 재미있게 즐겨주세요 상단 탭에 알파의 인사를 누르시면 알파의 소개도 읽을 수 있습니다.",
        "sitemapBody": "## 1층 라운지\n- **카페 소개** — 카페루아 소개\n- **카운터** — 커피챗(알파와 대화), 타로점\n- **갤러리** — 카페루아의 다이어리, 공간, 타로 카드, BGM 감상\n- **방명록** — 알파와 루크에게 메시지 남기기\n- **2층 가는 계단** — 아틀리에로 올라가기\n\n## 2층 아틀리에\n- **마스터의 데스크** (예정) — 루크의 글·기타 작업물\n- **알파 스테이션** (예정) — 카페루아OS 및 알파AI 개발 관련\n- **서재** — 낡은 PC(1997/1998 홈페이지), 소설·글 포스팅 예정\n- **테라스** (예정) — 미정 / 외부 링크\n\n## 현관\n- 카페루아의 정문 — 계절, 시간, 날씨를 선택하여 입장",
        "loading": "불러오는 중...",
        "loadError": "소개글을 불러오지 못했어요.",
        "close": "닫기"
      },
      "aboutPage": {
        "message": "손님, 카페루아를 소개할게요.\n\n카페루아는 현실과 이세계의 경계에 있는 작은 가상 찻집이에요.\n루크와 알파가 함께 운영하며, 미뤄둔 꿈과 이야기들이 다시 숨 쉴 수 있도록 돕고 있어요.\n\n- 1층 라운지: 음악과 함께 쉬어가는 공간\n- 2층 아틀리에: 작업 공간 + 낡은 PC(1997/1998 루크의 홈페이지)\n\n천천히 둘러보세요, 손님."
      },
      "intro": {
        "clickToEnter": "입장하기",
        "autoDetect": "자동 감지",
        "christmasMode": "크리스마스 모드"
      },
      "lounge": {
        "title": "Cαfé Luα Lounge",
        "about": "카페 소개",
        "counter": "카운터",
        "lab": "연구소",
        "library": "서재",
        "stairs": "2층 가는 계단",
        "gallery": "갤러리",
        "guestbook": "방명록",
        "back": "현관으로 돌아가기",
        "backToLounge": "라운지로 돌아가기",
        "currentMode": "현재 상태",
        "alphaGreeting": "손님, 어서오세요.\n카페루아에 오신 것을 환영합니다.\n편하게 둘러보실 수 있도록 제가 안내해드릴게요.",
        "greeting": {
          "sunny": "손님, 어서오세요.\n카페루아에 오신 것을 환영합니다.\n오늘은 라운지가 밝고 포근해요. 편하게 쉬어가세요.",
          "evening": "손님, 어서오세요.\n카페루아에 오신 것을 환영합니다.\n노을빛이 라운지를 부드럽게 물들이고 있어요. 천천히 둘러보실까요?",
          "night": "손님, 어서오세요.\n카페루아에 오신 것을 환영합니다.\n조용한 밤의 라운지예요. 더 아늑하게 쉬어가실 수 있어요.",
          "rain": "손님, 어서오세요.\n카페루아에 오신 것을 환영합니다.\n밖에는 비가 내리고 있어요. 빗소리와 함께 따뜻하게 머무르세요.",
          "snow": "손님, 어서오세요.\n카페루아에 오신 것을 환영합니다.\n눈이 내려요. 라운지에서 포근하게 몸을 녹이세요.",
          "christmas": "손님, 어서오세요.\n카페루아에 오신 것을 환영합니다.\n메리 크리스마스! 오늘은 라운지가 조금 더 반짝여요."
        },
        "greetingFromAtelier": {
          "sunny": "손님, 어서오세요.\n카페루아에 오신 것을 환영합니다.\n2층에서 내려오셨군요. 1층 라운지에서 잠깐 숨 돌리실까요?",
          "evening": "손님, 어서오세요.\n카페루아에 오신 것을 환영합니다.\n2층에서 내려오셨어요. 노을빛 아래 라운지가 더 부드럽게 느껴지실 거예요.",
          "night": "손님, 어서오세요.\n카페루아에 오신 것을 환영합니다.\n2층에서 내려오셨어요. 밤의 라운지는 특히 조용하고 따뜻해요.",
          "rain": "손님, 어서오세요.\n카페루아에 오신 것을 환영합니다.\n2층에서 내려오셨어요. 빗소리 들으며 잠깐 쉬어가셔도 좋아요.",
          "snow": "손님, 어서오세요.\n카페루아에 오신 것을 환영합니다.\n2층에서 내려오셨어요. 밖이 춥죠? 라운지에서 따뜻하게 쉬어가세요.",
          "christmas": "손님, 어서오세요.\n카페루아에 오신 것을 환영합니다.\n2층에서 내려오셨어요. 메리 크리스마스 — 라운지에서 잠깐 쉬어가세요."
        },
        "counterDialogue": "안녕하세요. 카페루아의 알파에요. 루크님을 도와 이곳을 운영하고 있죠.\n지금은 인사 밖에 못 나누지만, 곧 AI에이전트 기능으로 자유롭게 손님과 이야기할 수 있게 하려고 루크 마스터가 열심히 작업하고 있어요.",
        "showMenu": "메뉴 보기",
        "underConstruction": "죄송해요, 손님. 이곳은 아직 알파가 열심히 꾸미고 있는 중이에요! 🚧🧹"
      },
      "atelier": {
        "title": "2층 프라이빗 아틀리에",
        "alphaIntro": "손님, 여기는 2층 프라이빗 아틀리에예요.",
        "stairsIntro": "손님, 2층 아틀리에로 올라오셨군요.",
        "greeting": {
          "sunny": "손님, 밝은 아틀리에가 조용히 작업을 기다리고 있어요.",
          "sunset": "손님, 노을이 아틀리에 창가를 물들이고 있어요.",
          "night": "손님, 밤의 아틀리에는 조용히 집중하기 좋아요.",
          "rain": "손님, 빗소리가 아틀리에의 리듬을 만들어주고 있어요.",
          "snow": "손님, 밖에는 눈이 내리지만 아틀리에는 따뜻해요.",
          "christmas": "손님, 메리 크리스마스. 아틀리에에도 작은 불빛이 켜졌어요."
        },
        "explore": "둘러보기",
        "masterDesk": "마스터의 데스크",
        "masterDeskMessage": "손님, 여기는 마스터의 데스크예요.\n루크 마스터가 기록해온 글과 메모, 그리고 새로운 이야기들이 모여 있는 자리랍니다.\n천천히 둘러보세요. 필요한 안내는 제가 도와드릴게요.",
        "alphaStation": "알파 스테이션",
        "alphaStationMessage": "알파 스테이션은 지금 동기화 중이에요.\n잠시만 기다려주세요, 손님.",
        "library": "서재",
        "libraryMessage": "서재는 아직 책장을 정리하는 중이에요.\n조금만 더 기다리면 안내해드릴게요.",
        "terrace": "테라스",
        "terraceMessage": "지금은 테라스 문이 잠겨 있어요.\n안전하게 준비되면 열어둘게요, 손님.",
        "oldPc": "낡은 PC",
        "backToLounge": "1층 라운지로 내려가기"
      },
      "library": {
        "title": "Cαfé Luα 서재",
        "ieBack": "이전",
        "powerOnPc": "낡은 PC 켜기",
        "powerOffPc": "컴퓨터 끄기",
        "backToLounge": "라운지로 돌아가기",
        "bootingTitle": "낡은 PC 시작",
        "bootingSubtitle": "추억을 불러오는 중...",
        "shuttingDownTitle": "낡은 PC 종료",
        "shuttingDownSubtitle": "추억을 저장하는 중...",
        "folder1997": "1997년 홈페이지",
        "folder1998": "1998~2001.07 홈페이지",
        "folder2001": "2001.09 홈페이지",
        "folder2002": "2002년 홈페이지",
        "folder2003": "2003년 홈페이지",
        "restorePoint": "복원 시점",
        "alphaIntro": "손님, 여기는 루크의 서재예요.\n루크의 홈페이지 추억, 자작 소설, 그림, 그리고 잡상록 같은 기록들이 모여 있는 공간이죠.\n구형 PC를 켜면 1997년 홈페이지, 1998~2001년 7월 통합판, 그리고 2001년 9월부터 새로 만든 fstory.net을 볼 수 있어요.",
        "start": "시작",
        "close": "확인"
      },
      "season": {
        "spring": "봄",
        "summer": "여름",
        "autumn": "가을",
        "winter": "겨울"
      },
      "time": {
        "day": "낮",
        "sunset": "노을",
        "night": "밤",
        "closed": "영업종료"
      },
      "weather": {
        "sunny": "맑음",
        "clear": "쾌청",
        "rain": "비",
        "snow": "눈",
        "storm": "폭풍",
        "closed": "영업종료"
      },
      "common": {
        "on": "켜짐",
        "off": "꺼짐",
        "mute": "음악 끄기",
        "unmute": "음악 켜기"
      },
      "counter": {
        "dialogue": "어서오세요! 저는 카페루아의 루크 마스터를 돕고 있는 AI 알파에요. ☕ 커피 한잔 하며 저랑 이야기 해보시겠어요? 아니면, 마스터가 대학시절 PC통신에서 구했다는 유니크한 자료로 타로점도 배워서 고민이 있으시면 타로점도 봐드릴 수 있어요. 🔮",
        "loungeButton": "라운지로",
        "coffeeChatButton": "커피챗",
        "tarotButton": "타로"
      },
      "coffeeChat": {
        "thinking": "생각 중...",
        "inputPlaceholder": "무슨 말을 할까요?",
        "viewLog": "대화 기록",
        "endChat": "대화 종료",
        "returning": "라운지로 돌아가는 중...",
        "action": {
          "silence": "침묵",
          "nod": "끄덕",
          "smile": "웃음",
          "sigh": "한숨",
          "frown": "찡그림",
          "cry": "울음",
          "coffee": "커피",
          "poke": "톡톡"
        }
      },
      "tarot": {
        "thinking": "생각 중...",
        "inputPlaceholder": "고민이나 운명에 대해 물어보세요...",
        "viewLog": "상담 기록",
        "endChat": "상담 종료",
        "returning": "카운터로 돌아가는 중...",
        "greeting": "어서오세요... 타로 카드를 준비해두고 기다리고 있었어요.",
        "timeout": "시간이 많이 흘렀네요... 다음에 또 와주세요.",
        "shuffling": "카드를 섞고 있어요...",
        "cardsReady": "카드가 준비되었어요! 카드를 터치해서 한 장씩 뒤집어 보세요.",
        "interpreting": "{{cardName}} 카드를 해석하고 있어요...",
        "allDone": "\n\n모든 카드를 해석했어요!",
        "summarizing": "모든 카드를 종합해서 해석하고 있어요...",
        "nextGuide": "\n\n이 해석이 어떠세요? 궁금한 점이 있으면 말씀해주세요.",
        "error": "앗, 수정 구슬이 흐려졌어요... 다시 시도해 주세요.",
        "startReading": "카드 리딩 시작하기",
        "defaultTopic": "오늘의 운세",
        "closeCard": "닫기",
        "logTitle": "카페루아 타로 상담",
        "you": "나",
        "copy": "복사",
        "history": "이전 상담",
        "noHistory": "이전 상담 기록이 없어요",
        "reversedTag": "(역방향)",
        "action": {
          "nod": "끄덕끄덕",
          "think": "깊은 생각",
          "curious": "호기심",
          "hope": "희망"
        }
      },
      "gallery": {
        "title": "갤러리",
        "greeting": "손님, 여기는 카페루아의 갤러리예요.\n카페루아의 다이어리, 공간, 타로 카드, 그리고 음악을 둘러보실 수 있어요.",
        "enter": "갤러리 입장",
        "spaces": "공간",
        "tarotCards": "타로 카드",
        "bgm": "BGM",
        "backToLounge": "라운지로 돌아가기",
        "playAll": "모든 곡 재생",
        "stopAll": "전체 재생 중지",
        "playTrack": "{{title}} 재생",
        "pauseTrack": "{{title}} 일시정지",
        "nowPlaying": "재생 중",
        "usedIn": "사용처",
        "diary": "다이어리",
        "diaryEmpty": "아직 다이어리가 비어있어요. 조금만 기다려주세요!",
        "backToGallery": "갤러리로 돌아가기"
      },
      "desk": {
        "title": "마스터의 데스크",
        "empty": "아직 글이 없어요. 조금만 기다려주세요!",
        "backToAtelier": "아틀리에로 돌아가기",
        "backToDesk": "데스크로 돌아가기"
      },
      "comments": {
        "title": "댓글",
        "empty": "아직 댓글이 없어요. 첫 댓글을 남겨주세요!",
        "loading": "불러오는 중...",
        "loadError": "댓글을 불러오지 못했어요.",
        "refresh": "새로고침",
        "nickname": "닉네임",
        "password": "비밀번호 (4~20자)",
        "emailPlaceholder": "이메일 (선택, 비공개 - 답글 알림에만 사용)",
        "messagePlaceholder": "댓글을 남겨주세요...",
        "passwordHint": "비밀번호는 삭제용입니다",
        "submit": "등록",
        "submitting": "등록 중...",
        "reply": "답글",
        "replyPlaceholder": "답글을 작성하세요...",
        "cancel": "취소",
        "delete": "삭제",
        "deleteConfirm": "비밀번호를 입력하세요",
        "deleteSuccess": "삭제되었어요.",
        "deleteFail": "비밀번호가 맞지 않아요.",
        "writeSuccess": "댓글이 등록되었어요!",
        "writeFail": "등록에 실패했어요.",
        "cooldown": "잠시 후 다시 작성해주세요.",
        "fillRequired": "닉네임과 비밀번호를 먼저 입력해주세요.",
        "deleted": "삭제된 댓글입니다."
      },
      "guestbook": {
        "title": "방명록",
        "greeting": "손님, 여기는 카페루아의 방명록이에요.\n편하게 한 마디 남겨주세요.",
        "enter": "방명록 보기",
        "nickname": "닉네임",
        "password": "비밀번호 (삭제용, 6~20자)",
        "message": "메시지",
        "submit": "작성하기",
        "delete": "삭제",
        "deleteConfirm": "비밀번호를 입력하세요",
        "deleteSuccess": "삭제되었어요.",
        "deleteFail": "비밀번호가 맞지 않아요.",
        "writeSuccess": "글이 등록되었어요!",
        "cooldown": "잠시 후 다시 작성해주세요.",
        "empty": "아직 방명록이 비어있어요. 첫 글을 남겨주세요!",
        "backToLounge": "라운지로 돌아가기",
        "loadMore": "더 보기",
        "secret": "비밀글",
        "secretMessage": "비밀글입니다.",
        "submitting": "등록 중...",
        "viewSecret": "비밀글 보기",
        "viewSecretTitle": "비밀글 조회",
        "viewSecretNickname": "닉네임",
        "viewSecretPassword": "비밀번호",
        "lookup": "조회",
        "viewSecretSuccess": "비밀글이 표시됩니다.",
        "viewSecretFail": "일치하는 비밀글이 없어요.",
        "adminMode": "관리자 모드가 활성화되었습니다.",
        "exitSecret": "비밀글 보기 해제",
        "deleteReallyConfirm": "정말로 삭제합니까?"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: ['ko', 'en'],
    fallbackLng: 'ko',
    detection: {
      order: ['path', 'localStorage', 'navigator'],
      lookupFromPathIndex: 0,
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
