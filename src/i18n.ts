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
