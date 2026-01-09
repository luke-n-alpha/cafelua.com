# 드라고니아 지도 생성 명세서 (Dragonia Map Generation Specification)

이미지 생성을 위한 **최종 확정 정보**입니다. 이 명세서는 `map_locations.md`(설정), `map_geography_model.md`(지리), `map_coordinates.md`(좌표)를 모두 통합하여 작성되었습니다.

## 1. 전체 스타일 (Global Style)
*   **레퍼런스:** 반지의 제왕 지도 + **북미 대륙 위성 지도(기후 분포)**.
*   **규모감 (Scale):** **거대한 대륙 (Massive Continent)**. 남북 길이 5,000km급.
    *   *주의: 마을이나 도시 아이콘을 너무 크게 그리지 말 것. 대륙의 거대함이 느껴져야 함.*
*   **분위기:** 고풍스러운 양피지 질감, 펜 잉크 드로잉.

## 2. 지리적 특징 (Geographical Features)

### 🌍 기후대 (Climate Zones) - 북미 대륙 참조
*   **극북 (Far North, 70°N+):** **빙하와 설원 (Glaciers & Snow)**. (용의 신전, 칼레도니아)
*   **북부: 칼레도니아 (Caledonia, 55°N~70°N):** **침엽수림과 험준한 산맥 (Taiga & Rugged Mountains)**. (아골, 브루기아)
    *   *특징:* 서리 산맥(Frost Range) 이북의 혹독한 환경.
*   **중부: 로라시아 (Laurasia, 38°N~55°N):** **온대 숲과 초원 (Temperate Forest & Plains)**. (서머나, 이므라, 나할리엘)
    *   *특징:* 서리 산맥이 한기를 막아주어 온화함.
*   **남부: 라라미드 (Laramid, 25°N~38°N):** **아열대 평야 (Subtropical Plains)**. (라오디게아, 니고볼리)
    *   *특징:* 안개 강(Mist River) 이남의 비옥한 곡창지대.
*   **극남 (Far South, ~25°N):** **사막 (Desert)**. (도벨)
    *   *특징:* 남부 산맥의 비그늘 효과로 형성된 건조 지대.



### 🏔️ 지형 (Terrain)
*   **북동부 (North-East):** **아골 산맥 (Achor Mountains)**. 험준하고 눈 덮인 산맥.
*   **북중부 경계 (55°N):** **서리 산맥 (The Frost Range)**. 동서로 뻗은 거대한 기후 장벽.
*   **중부 (Central):** **로라시아 숲 (Laurasia Forest)**.
*   **남부 (South):** **라오디게아 평원 (Laodicea Plains)**.
*   **남부 경계 (30°N):** **남부 산맥 (Southern Range)**. 비그늘 효과를 만드는 산맥.
*   **남동부 (South-East):** **도벨 사막 (Tophel Desert)**. 산맥 아래 건조 지대.


### 🌊 물 (Water)
*   **디본강 (Dibon River):**
    *   **발원:** 북동쪽 아골/나할리엘 산맥.
    *   **흐름:** 대륙 중앙을 가로질러 남서쪽으로 흐름. **라오디게아**를 지나 **니고볼리**에서 바다로 나감.
    *   **크기:** 지도에서 가장 굵고 긴 강.
*   **안개 강 (Mist River):**
    *   **위치:** 중부와 남부 사이(38°N). 서머나 남쪽으로 흐르는 강.
*   **인어의 바다 (Mermaid's Sea):** 대륙 서쪽의 거대한 바다.


## 3. 지명 및 시각적 프롬프트 (Locations & Visual Prompts)

각 위치에 대한 구체적인 시각적 묘사 지침입니다.

### 🔴 대도시 (Major Cities)
| 지명 (Name) | 위치 (Position) | 시각적 묘사 (Visual Description) |
| :--- | :--- | :--- |
| **Laodicea** | 중앙 (Central) | **거대한 성벽 도시 (Huge Walled City)**. 강 옆에 위치. 왕궁과 요새가 뚜렷함. |
| **Smyrna** | 서쪽 해안 (West Coast) | **산업 항구 (Industrial Port)**. 굴뚝 연기(Smoke stacks), 많은 배, 부두. |
| **Phrygia** | 동쪽 내륙 (East Inland) | **화려한 왕도 (Opulent Capital)**. 동쪽 끝, 산맥 너머. 둥근 돔 지붕 건물들. |
| **Rasea** | 남서쪽 해안 (SW Coast) | **상업 항구 (Trade Port)**. 시장 천막들이 많음. 서머나보다 남쪽. |
| **Nicopolis** | 강 하구 (River Mouth) | **강변 항구 (River Port)**. 디본강이 바다와 만나는 곳. |
| **Antipatris** | 남동쪽 내륙 (SE Inland) | **군사 요새 (Military Fortress)**. 목책과 망루. |
| **Imra** | 북서쪽 해안 (NW Coast) | **작은 교역항 (Small Trade Port)**. |

### 🟡 마을 (Villages)
| 지명 (Name) | 위치 (Position) | 시각적 묘사 (Visual Description) |
| :--- | :--- | :--- |
| **Slomit** | 북서쪽 숲 (NW Forest) | **숲 속 마을 (Forest Village)**. 나무에 둘러싸인 작은 집들. |
| **Nahaliel** | 북쪽 강가 (North River) | **정령의 숲 (Spirit Forest)**. 강 상류, 신비로운 숲. |
| **Tophel** | 남동쪽 끝 (SE End) | **폐허 마을 (Ruined Village)**. 무너진 집, 황량함. |
| **Lis** | 나할리엘 근처 | **온천 마을 (Hot Spring Village)**. 김이 모락모락 나는 작은 연못들. |
| **Pergamon** | 북동쪽 (NE) | **언덕 마을 (Hill Village)**. 유적지 근처. |
| **Taberah** | 동쪽 숲 (East Forest) | **여관 마을 (Inn Village)**. 숲길 중간. |
| **En-Rogel** | 북동쪽 고원 (NE Plateau) | **고원 마을 (Highland Village)**. 브루기아 북쪽. |
| **Urfa** | 동쪽 산 아래 (East Mountain) | **산악 마을 (Mountain Village)**. 아골 산맥 남쪽 자락. |

### ⚪ 유적 및 특수 지역 (Ruins & Special)
| 지명 (Name) | 위치 (Position) | 시각적 묘사 (Visual Description) |
| :--- | :--- | :--- |
| **Dragon Temple** | 북쪽 끝 (North Tip) | **고대 신전 (Ancient Temple)**. 눈 덮인 땅, 거대한 탑. |
| **Achor** | 북동쪽 산맥 (NE Mountains) | **화산/골짜기 (Volcanic Valley)**. 험준한 산, 연기, 얼음 동굴. |
| **Ruins of Light** | 아골 근처 | **빛나는 유적 (Glowing Ruins)**. 산 속에 숨겨진 신비로운 구조물. |
| **Ruins of Darkness** | 이므라/다베라 사이 | **어두운 숲 유적 (Dark Forest Ruins)**. 음산한 분위기. |
| **Ruins of Spirits** | 버가모 근처 | **오래된 돌 유적 (Ancient Stone Ruins)**. |

### 🏝️ 섬 (Islands)
*   **West Island:** 서쪽 바다 먼 곳. 마법진 문양.
*   **East Island:** 동쪽 바다 먼 곳. 마법진 문양.
*   **South Island:** 남쪽 바다 먼 곳. 마법진 문양.
