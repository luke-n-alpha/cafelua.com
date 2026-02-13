export interface GalleryImage {
  src: string;
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
}

export interface GalleryMusic {
  src: string;
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
  usedIn: string;
}

export const SPACE_IMAGES: Record<string, GalleryImage[]> = {
  intro: [
    { src: '/intro-background-img/intro_bg_spring_day_sunny.webp', titleKo: '봄날 맑은 오후', titleEn: 'Sunny Spring Day', descKo: '봄날 맑은 오후의 카페루아 현관', descEn: 'Cafe Lua entrance on a sunny spring day' },
    { src: '/intro-background-img/intro_bg_spring_day_rain.webp', titleKo: '봄날 비 오는 오후', titleEn: 'Rainy Spring Day', descKo: '봄비가 내리는 카페루아 현관', descEn: 'Cafe Lua entrance on a rainy spring day' },
    { src: '/intro-background-img/intro_bg_spring_sunset_clear.webp', titleKo: '봄 노을', titleEn: 'Spring Sunset', descKo: '봄날 석양이 물드는 현관', descEn: 'Cafe Lua entrance at spring sunset' },
    { src: '/intro-background-img/intro_bg_spring_night_clear.webp', titleKo: '봄 밤', titleEn: 'Spring Night', descKo: '봄밤 조용한 현관', descEn: 'Quiet spring night at the entrance' },
    { src: '/intro-background-img/intro_bg_spring_night_closed.webp', titleKo: '봄 밤 (영업종료)', titleEn: 'Spring Night (Closed)', descKo: '봄밤 영업종료 후 현관', descEn: 'Entrance after closing on a spring night' },
    { src: '/intro-background-img/intro_bg_summer_day_sunny.webp', titleKo: '여름날 맑은 오후', titleEn: 'Sunny Summer Day', descKo: '여름날 햇살 가득한 현관', descEn: 'Bright summer day at the entrance' },
    { src: '/intro-background-img/intro_bg_summer_day_rain.webp', titleKo: '여름 비 오는 오후', titleEn: 'Rainy Summer Day', descKo: '여름 소나기가 내리는 현관', descEn: 'Summer rain at the entrance' },
    { src: '/intro-background-img/intro_bg_summer_sunset_clear.webp', titleKo: '여름 노을', titleEn: 'Summer Sunset', descKo: '여름 저녁노을이 물드는 현관', descEn: 'Summer sunset at the entrance' },
    { src: '/intro-background-img/intro_bg_summer_night_clear.webp', titleKo: '여름 밤', titleEn: 'Summer Night', descKo: '여름밤 현관의 풍경', descEn: 'Summer night at the entrance' },
    { src: '/intro-background-img/intro_bg_summer_night_closed.webp', titleKo: '여름 밤 (영업종료)', titleEn: 'Summer Night (Closed)', descKo: '여름밤 영업종료 후 현관', descEn: 'Entrance after closing on a summer night' },
    { src: '/intro-background-img/intro_bg_autumn_day_sunny.webp', titleKo: '가을날 맑은 오후', titleEn: 'Sunny Autumn Day', descKo: '가을 낙엽 사이로 빛이 드는 현관', descEn: 'Autumn leaves and light at the entrance' },
    { src: '/intro-background-img/intro_bg_autumn_day_rain.webp', titleKo: '가을 비 오는 오후', titleEn: 'Rainy Autumn Day', descKo: '가을비 내리는 현관', descEn: 'Autumn rain at the entrance' },
    { src: '/intro-background-img/intro_bg_autumn_day_storm.webp', titleKo: '가을 폭풍', titleEn: 'Autumn Storm', descKo: '가을 폭풍이 지나가는 현관', descEn: 'Stormy autumn day at the entrance' },
    { src: '/intro-background-img/intro_bg_autumn_sunset_clear.webp', titleKo: '가을 노을', titleEn: 'Autumn Sunset', descKo: '가을 석양에 물드는 현관', descEn: 'Autumn sunset glow at the entrance' },
    { src: '/intro-background-img/intro_bg_autumn_night_clear.webp', titleKo: '가을 밤', titleEn: 'Autumn Night', descKo: '가을밤의 고즈넉한 현관', descEn: 'Tranquil autumn night at the entrance' },
    { src: '/intro-background-img/intro_bg_autumn_night_closed.webp', titleKo: '가을 밤 (영업종료)', titleEn: 'Autumn Night (Closed)', descKo: '가을밤 영업종료 후 현관', descEn: 'Entrance after closing on an autumn night' },
    { src: '/intro-background-img/intro_bg_winter_day_sunny.webp', titleKo: '겨울날 맑은 오후', titleEn: 'Sunny Winter Day', descKo: '겨울 맑은 날의 현관', descEn: 'Clear winter day at the entrance' },
    { src: '/intro-background-img/intro_bg_winter_day_snow.webp', titleKo: '겨울 눈 오는 날', titleEn: 'Snowy Winter Day', descKo: '눈 내리는 겨울 현관', descEn: 'Snowy winter day at the entrance' },
    { src: '/intro-background-img/intro_bg_winter_sunset_clear.webp', titleKo: '겨울 노을', titleEn: 'Winter Sunset', descKo: '겨울 석양의 현관', descEn: 'Winter sunset at the entrance' },
    { src: '/intro-background-img/intro_bg_winter_night_clear.webp', titleKo: '겨울 밤', titleEn: 'Winter Night', descKo: '겨울밤 조용한 현관', descEn: 'Quiet winter night at the entrance' },
    { src: '/intro-background-img/intro_bg_winter_night_snow.webp', titleKo: '겨울밤 눈', titleEn: 'Snowy Winter Night', descKo: '눈 내리는 겨울밤 현관', descEn: 'Snowy winter night at the entrance' },
    { src: '/intro-background-img/intro_bg_winter_night_closed.webp', titleKo: '겨울 밤 (영업종료)', titleEn: 'Winter Night (Closed)', descKo: '겨울밤 영업종료 후 현관', descEn: 'Entrance after closing on a winter night' },
    { src: '/intro-background-img/intro_bg_winter_day_sunny_xmas.webp', titleKo: '크리스마스 낮', titleEn: 'Christmas Day', descKo: '크리스마스 장식이 빛나는 낮의 현관', descEn: 'Christmas-decorated entrance in daylight' },
    { src: '/intro-background-img/intro_bg_winter_day_snow_xmas.webp', titleKo: '크리스마스 눈', titleEn: 'Snowy Christmas', descKo: '눈 내리는 크리스마스 현관', descEn: 'Snowy Christmas at the entrance' },
    { src: '/intro-background-img/intro_bg_winter_sunset_clear_xmas.webp', titleKo: '크리스마스 노을', titleEn: 'Christmas Sunset', descKo: '크리스마스 석양의 현관', descEn: 'Christmas sunset at the entrance' },
    { src: '/intro-background-img/intro_bg_winter_sunset_xmas.webp', titleKo: '크리스마스 저녁', titleEn: 'Christmas Evening', descKo: '크리스마스 저녁 무렵의 현관', descEn: 'Christmas evening at the entrance' },
    { src: '/intro-background-img/intro_bg_winter_night_clear_xmas.webp', titleKo: '크리스마스 밤', titleEn: 'Christmas Night', descKo: '크리스마스 밤의 현관', descEn: 'Christmas night at the entrance' },
    { src: '/intro-background-img/intro_bg_winter_night_snow_xmas.webp', titleKo: '크리스마스 눈 밤', titleEn: 'Snowy Christmas Night', descKo: '눈 내리는 크리스마스 밤 현관', descEn: 'Snowy Christmas night at the entrance' },
    { src: '/intro-background-img/intro_bg_winter_night_closed_xmas.webp', titleKo: '크리스마스 (영업종료)', titleEn: 'Christmas (Closed)', descKo: '크리스마스 밤 영업종료 후 현관', descEn: 'Entrance after closing on Christmas night' },
    { src: '/intro-background-img/intro_bg_winter_night_closed_snow_xmas.webp', titleKo: '크리스마스 눈 (영업종료)', titleEn: 'Snowy Christmas (Closed)', descKo: '눈 오는 크리스마스 밤 영업종료 후', descEn: 'Snowy Christmas night after closing' },
  ],
  lounge: [
    { src: '/lounge-background-img/lounge-sunny.webp', titleKo: '라운지 — 맑은 낮', titleEn: 'Lounge — Sunny Day', descKo: '따스한 햇살이 드는 라운지', descEn: 'The lounge bathed in warm sunlight' },
    { src: '/lounge-background-img/lounge-evening.webp', titleKo: '라운지 — 노을', titleEn: 'Lounge — Evening', descKo: '노을빛이 물드는 라운지', descEn: 'The lounge glowing in sunset light' },
    { src: '/lounge-background-img/lounge-night.webp', titleKo: '라운지 — 밤', titleEn: 'Lounge — Night', descKo: '밤의 라운지, 은은한 조명', descEn: 'The lounge at night, softly lit' },
    { src: '/lounge-background-img/lounge-rain.webp', titleKo: '라운지 — 비', titleEn: 'Lounge — Rain', descKo: '빗소리가 들리는 라운지', descEn: 'The lounge with the sound of rain' },
    { src: '/lounge-background-img/lounge-snow.webp', titleKo: '라운지 — 눈', titleEn: 'Lounge — Snow', descKo: '눈 내리는 날의 아늑한 라운지', descEn: 'The cozy lounge on a snowy day' },
    { src: '/lounge-background-img/lounge-christmas.webp', titleKo: '라운지 — 크리스마스', titleEn: 'Lounge — Christmas', descKo: '크리스마스 장식이 빛나는 라운지', descEn: 'The lounge decorated for Christmas' },
  ],
  atelier: [
    { src: '/atelier-background-img/2f-sunny.webp', titleKo: '아틀리에 — 맑은 낮', titleEn: 'Atelier — Sunny Day', descKo: '햇살이 창을 통해 들어오는 아틀리에', descEn: 'Sunlight streaming through the atelier windows' },
    { src: '/atelier-background-img/2f-sunset.webp', titleKo: '아틀리에 — 노을', titleEn: 'Atelier — Sunset', descKo: '노을빛에 물든 아틀리에', descEn: 'The atelier bathed in sunset glow' },
    { src: '/atelier-background-img/2f-night.webp', titleKo: '아틀리에 — 밤', titleEn: 'Atelier — Night', descKo: '밤의 아틀리에, 램프 아래 조용한 시간', descEn: 'The atelier at night, quiet time under lamplight' },
    { src: '/atelier-background-img/2f-rain.webp', titleKo: '아틀리에 — 비', titleEn: 'Atelier — Rain', descKo: '빗소리와 함께하는 아틀리에', descEn: 'The atelier accompanied by rain' },
    { src: '/atelier-background-img/2f-snow.webp', titleKo: '아틀리에 — 눈', titleEn: 'Atelier — Snow', descKo: '눈 내리는 날의 아틀리에', descEn: 'The atelier on a snowy day' },
    { src: '/atelier-background-img/2f-christmas.webp', titleKo: '아틀리에 — 크리스마스', titleEn: 'Atelier — Christmas', descKo: '크리스마스 장식의 아틀리에', descEn: 'The atelier decorated for Christmas' },
  ],
  character: [
    { src: '/characters/alpha/alpha-coffee-chat.webp', titleKo: '알파 — 커피챗', titleEn: 'Alpha — Coffee Chat', descKo: '커피를 앞에 두고 대화하는 알파', descEn: 'Alpha chatting over coffee' },
    { src: '/characters/alpha/alpha-tarot-ready.webp', titleKo: '알파 — 타로 준비', titleEn: 'Alpha — Tarot Ready', descKo: '타로 카드를 준비하는 알파', descEn: 'Alpha preparing tarot cards' },
    { src: '/characters/alpha/alpha-serving.webp', titleKo: '알파 — 서빙', titleEn: 'Alpha — Serving', descKo: '음료를 서빙하는 알파', descEn: 'Alpha serving drinks' },
    { src: '/characters/alpha/alpha-nice-talk.webp', titleKo: '알파 — 다정한 대화', titleEn: 'Alpha — Friendly Talk', descKo: '다정하게 이야기하는 알파', descEn: 'Alpha talking warmly' },
    { src: '/characters/alpha/alpha-trouble.webp', titleKo: '알파 — 곤란', titleEn: 'Alpha — Troubled', descKo: '곤란한 표정의 알파', descEn: 'Alpha with a troubled expression' },
  ],
  expression: [
    { src: '/characters/alpha/face-variation/alpha-face.webp', titleKo: '기본 표정', titleEn: 'Default', descKo: '알파의 기본 표정', descEn: 'Alpha\'s default expression' },
    { src: '/characters/alpha/face-variation/alpha-nice-talk.webp', titleKo: '다정함', titleEn: 'Friendly', descKo: '다정하게 이야기하는 표정', descEn: 'Friendly talking expression' },
    { src: '/characters/alpha/face-variation/alpha-wink-smile.webp', titleKo: '윙크', titleEn: 'Wink', descKo: '윙크하며 웃는 표정', descEn: 'Winking smile' },
    { src: '/characters/alpha/face-variation/alpha-embarrassment.webp', titleKo: '당황', titleEn: 'Embarrassed', descKo: '당황한 표정', descEn: 'Embarrassed expression' },
    { src: '/characters/alpha/face-variation/alpha-trouble.webp', titleKo: '곤란', titleEn: 'Troubled', descKo: '곤란한 표정', descEn: 'Troubled expression' },
    { src: '/characters/alpha/face-variation/alpha-pouty-cheeks.webp', titleKo: '볼 부풀리기', titleEn: 'Pouty', descKo: '볼을 부풀린 표정', descEn: 'Pouty cheeks expression' },
    { src: '/characters/alpha/face-variation/alpha-disappointed.webp', titleKo: '실망', titleEn: 'Disappointed', descKo: '실망한 표정', descEn: 'Disappointed expression' },
    { src: '/characters/alpha/face-variation/alpha-dissatisfaction.webp', titleKo: '불만', titleEn: 'Dissatisfied', descKo: '불만스러운 표정', descEn: 'Dissatisfied expression' },
  ],
  etc: [
    { src: '/gallery-background-img/gallery-cozy-corner.webp', titleKo: '갤러리 — 아늑한 코너', titleEn: 'Gallery — Cozy Corner', descKo: '갤러리의 아늑한 코너', descEn: 'The cozy corner of the gallery' },
    { src: '/undestruct.webp', titleKo: '청소 중!', titleEn: 'Cleaning in Progress!', descKo: '알파가 열심히 공간을 꾸미는 중이에요', descEn: 'Alpha is busy decorating the space' },
    { src: '/ui/about-modal-bg.webp', titleKo: '웰컴 간판', titleEn: 'Welcome Sign', descKo: '카페루아 소개 배경', descEn: 'Cafe Lua about background' },
    { src: '/guestbook-background-img/guestbook-scene.webp', titleKo: '방명록', titleEn: 'Guestbook', descKo: '카페루아 방명록 공간', descEn: 'Cafe Lua guestbook space' },
  ],
};

export const TAROT_CARDS: GalleryImage[] = [
  { src: '/tarot/major/00-the-fool.webp', titleKo: '0. 광대', titleEn: '0. The Fool', descKo: '새로운 시작, 모험, 순수', descEn: 'New beginnings, adventure, innocence' },
  { src: '/tarot/major/01-the-magician.webp', titleKo: '1. 마법사', titleEn: '1. The Magician', descKo: '의지, 창조, 기술', descEn: 'Willpower, creation, skill' },
  { src: '/tarot/major/02-the-high-priestess.webp', titleKo: '2. 여사제', titleEn: '2. The High Priestess', descKo: '직관, 무의식, 신비', descEn: 'Intuition, the unconscious, mystery' },
  { src: '/tarot/major/03-the-empress.webp', titleKo: '3. 여황제', titleEn: '3. The Empress', descKo: '풍요, 모성, 자연', descEn: 'Abundance, motherhood, nature' },
  { src: '/tarot/major/04-the-emperor.webp', titleKo: '4. 황제', titleEn: '4. The Emperor', descKo: '권위, 구조, 안정', descEn: 'Authority, structure, stability' },
  { src: '/tarot/major/05-the-hierophant.webp', titleKo: '5. 교황', titleEn: '5. The Hierophant', descKo: '전통, 가르침, 신앙', descEn: 'Tradition, teaching, faith' },
  { src: '/tarot/major/06-the-lovers.webp', titleKo: '6. 연인', titleEn: '6. The Lovers', descKo: '사랑, 조화, 선택', descEn: 'Love, harmony, choices' },
  { src: '/tarot/major/07-the-chariot.webp', titleKo: '7. 전차', titleEn: '7. The Chariot', descKo: '의지, 승리, 결단', descEn: 'Willpower, victory, determination' },
  { src: '/tarot/major/08-strength.webp', titleKo: '8. 힘', titleEn: '8. Strength', descKo: '용기, 인내, 내면의 힘', descEn: 'Courage, patience, inner strength' },
  { src: '/tarot/major/09-the-hermit.webp', titleKo: '9. 은둔자', titleEn: '9. The Hermit', descKo: '성찰, 고독, 내면의 빛', descEn: 'Reflection, solitude, inner light' },
  { src: '/tarot/major/10-wheel-of-fortune.webp', titleKo: '10. 운명의 수레바퀴', titleEn: '10. Wheel of Fortune', descKo: '변화, 운명, 전환', descEn: 'Change, fate, turning point' },
  { src: '/tarot/major/11-justice.webp', titleKo: '11. 정의', titleEn: '11. Justice', descKo: '공정, 진실, 균형', descEn: 'Fairness, truth, balance' },
  { src: '/tarot/major/12-the-hanged-man.webp', titleKo: '12. 매달린 사람', titleEn: '12. The Hanged Man', descKo: '희생, 새로운 관점, 기다림', descEn: 'Sacrifice, new perspective, waiting' },
  { src: '/tarot/major/13-death.webp', titleKo: '13. 죽음', titleEn: '13. Death', descKo: '끝과 시작, 변환, 해방', descEn: 'Endings and beginnings, transformation, release' },
  { src: '/tarot/major/14-temperance.webp', titleKo: '14. 절제', titleEn: '14. Temperance', descKo: '균형, 조화, 인내', descEn: 'Balance, harmony, patience' },
  { src: '/tarot/major/15-the-devil.webp', titleKo: '15. 악마', titleEn: '15. The Devil', descKo: '유혹, 속박, 그림자', descEn: 'Temptation, bondage, shadow' },
  { src: '/tarot/major/16-the-tower.webp', titleKo: '16. 탑', titleEn: '16. The Tower', descKo: '격변, 해방, 깨달음', descEn: 'Upheaval, liberation, revelation' },
  { src: '/tarot/major/17-the-star.webp', titleKo: '17. 별', titleEn: '17. The Star', descKo: '희망, 영감, 치유', descEn: 'Hope, inspiration, healing' },
  { src: '/tarot/major/18-the-moon.webp', titleKo: '18. 달', titleEn: '18. The Moon', descKo: '환상, 불안, 무의식', descEn: 'Illusion, anxiety, the subconscious' },
  { src: '/tarot/major/19-the-sun.webp', titleKo: '19. 태양', titleEn: '19. The Sun', descKo: '기쁨, 성공, 활력', descEn: 'Joy, success, vitality' },
  { src: '/tarot/major/20-judgement.webp', titleKo: '20. 심판', titleEn: '20. Judgement', descKo: '부활, 판단, 각성', descEn: 'Rebirth, judgment, awakening' },
  { src: '/tarot/major/21-the-world.webp', titleKo: '21. 세계', titleEn: '21. The World', descKo: '완성, 통합, 여행', descEn: 'Completion, integration, travel' },
];

export const BGM_LIST: GalleryMusic[] = [
  { src: '/sounds/intro.mp3', titleKo: '숲 끝자락의 문', titleEn: 'The Door at Forest\'s Edge', descKo: '카페루아의 입구에서 흐르는 음악', descEn: 'Music playing at the entrance of Cafe Lua', usedIn: 'intro' },
  { src: '/sounds/lounge.mp3', titleKo: '라운지의 오후', titleEn: 'Afternoon in the Lounge', descKo: '라운지에서 흐르는 따뜻한 선율', descEn: 'A warm melody flowing through the lounge', usedIn: 'lounge' },
  { src: '/sounds/atelier.mp3', titleKo: '아틀리에의 고요', titleEn: 'Stillness of the Atelier', descKo: '2층 작업 공간의 잔잔한 배경음악', descEn: 'Calm background music of the 2F workspace', usedIn: 'atelier' },
  { src: '/sounds/coffee-chat.mp3', titleKo: '커피 한 잔의 대화', titleEn: 'A Chat Over Coffee', descKo: '알파와 커피챗을 할 때 흐르는 음악', descEn: 'Music playing during a coffee chat with Alpha', usedIn: 'coffeeChat' },
  { src: '/sounds/taro-bgm.mp3', titleKo: '별빛 아래 카드', titleEn: 'Cards Under Starlight', descKo: '타로 상담 시 흐르는 신비로운 음악', descEn: 'Mystical music during tarot readings', usedIn: 'tarot' },
  { src: '/sounds/gallery.mp3', titleKo: '갤러리의 여운', titleEn: 'Gallery Reverie', descKo: '갤러리에서 흐르는 잔잔한 음악', descEn: 'Gentle music flowing through the gallery', usedIn: 'gallery' },
];

export const SPACE_SUBCATEGORIES = [
  { key: 'intro', labelKo: '인트로(현관)', labelEn: 'Intro (Entrance)' },
  { key: 'lounge', labelKo: '라운지(1F)', labelEn: 'Lounge (1F)' },
  { key: 'atelier', labelKo: '아틀리에(2F)', labelEn: 'Atelier (2F)' },
  { key: 'etc', labelKo: '기타', labelEn: 'Others' },
  { key: 'character', labelKo: '캐릭터', labelEn: 'Characters' },
  { key: 'expression', labelKo: '표정', labelEn: 'Expressions' },
];
