import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
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
        "gallery": "Gallery",
        "guestbook": "Guestbook",
        "back": "Back to Entrance",
        "backToLounge": "Back to Lounge",
        "currentMode": "Current Mode",
        "underConstruction": "Sorry, Master. Alpha is still working hard to decorate this space! 🚧🧹"
      },
      "library": {
        "title": "Cαfé Luα Library",
        "powerOnPc": "Power On Old PC",
        "powerOffPc": "Shut Down",
        "backToLounge": "Back to Lounge",
        "bootingTitle": "Starting Windows 98",
        "bootingSubtitle": "Loading memories...",
        "shuttingDownTitle": "Shutting Down Windows 98",
        "shuttingDownSubtitle": "Saving memories...",
        "folder1997": "1997 Homepage",
        "folder1998": "1998 Homepage",
        "folder1999Missing": "1999 Homepage (Lost)",
        "missing1999": "Master... the 1999 homepage is missing. It was about AI and cartoon music. It's a shame.",
        "alphaIntro": "Master, welcome to Luke's library.\nThis is Luke's space — his homepage memories, original novels, drawings, and little notes are gathered here.\nIf you want, try turning on that old PC.",
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
      }
    }
  },
  ko: {
    translation: {
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
        "gallery": "갤러리",
        "guestbook": "방명록",
        "back": "현관으로 돌아가기",
        "backToLounge": "라운지로 돌아가기",
        "currentMode": "현재 상태",
        "underConstruction": "죄송해요, 마스터. 이곳은 아직 알파가 열심히 꾸미고 있는 중이에요! 🚧🧹"
      },
      "library": {
        "title": "Cαfé Luα 서재",
        "powerOnPc": "구형 PC 켜기",
        "powerOffPc": "컴퓨터 끄기",
        "backToLounge": "라운지로 돌아가기",
        "bootingTitle": "Windows 98 시작",
        "bootingSubtitle": "추억을 불러오는 중...",
        "shuttingDownTitle": "Windows 98 종료",
        "shuttingDownSubtitle": "추억을 저장하는 중...",
        "folder1997": "1997년 홈페이지",
        "folder1998": "1998년 홈페이지",
        "folder1999Missing": "1999년 홈페이지 (소실됨)",
        "missing1999": "마스터... 1999년 홈페이지는 소실되었어요.\n인공지능과 만화 음악을 다루던 곳이었다고 들었는데, 정말 아쉬워요.",
        "alphaIntro": "마스터, 여기는 루크의 서재예요.\n루크의 홈페이지 추억, 자작 소설, 그림, 그리고 잡상록 같은 기록들이 모여 있는 공간이죠.\n원하시면, 저 구형 PC를 켜볼까요?",
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
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
