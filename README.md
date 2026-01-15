## 📌 개요

- **`프로젝트 명`:** Weather Today
- **`한 줄 소개`:** React + Vite 기반 날씨 정보 조회 웹 애플리케이션
- **`배포 주소`:** https://weather-app-ten-pink-59.vercel.app/


<br/>

## 🛠️ 기술 스택

<p>
<img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=React&logoColor=black"> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=TypeScript&logoColor=white"> <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=Vite&logoColor=white"> <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=TailwindCSS&logoColor=white"> <img src="https://img.shields.io/badge/React Query-FF4154?style=flat&logo=ReactQuery&logoColor=white"> <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=Axios&logoColor=white"> <img src="https://img.shields.io/badge/React Router-CA4245?style=flat&logo=ReactRouter&logoColor=white">
</p>

<br/>

## ✨ 주요 기능

### 1️⃣ 위치 기반 날씨 정보

- 앱 첫 진입 시 사용자의 현재 위치 Geolocation API으로 위경도 획득
- 위경도를 기상청 격자(nx, ny) 로 변환하여 날씨 정보 API들을 호출해 화면에 렌더링

### 2️⃣ 지역 검색 기능

- 시/군/구/동 모든 행정 단위 검색 지원
  - 예: "서울특별시", "광진구", "구의동" 등
- 검색어 입력 시 매칭되는 장소 리스트 자동 표시
- 리스트에서 원하는 장소 선택 가능
- 장소 선택 시 API 호출 날씨 카드에 렌더링
- 날씨 정보가 없는 경우 "해당 장소의 정보가 제공되지 않습니다" 안내 메시지 표시
- 대한민국 주소 한정 검색

### 3️⃣ 실시간 날씨 정보 조회

- 기상청 Open API를 활용한 실시간 날씨 데이터 제공
- 현재 기온, 당일 최저/최고 기온, 시간대별 기온 표시
- 1) 현재 기온(실측값)

### 4️⃣ 즐겨찾기 관리

- 검색한 장소를 즐겨찾기에 추가/삭제 가능
- 최대 6개 장소까지 즐겨찾기 등록 지원
- 카드 UI 형태로 즐겨찾기 장소 표시
- 즐겨찾기 장소의 이름(별칭) 수정 기능
- 각 카드에 현재 날씨 정보 및 당일 최저/최고 기온 표시
- 카드 클릭 시 상세 페이지로 이동
- 상세 페이지에서 모든 날씨 정보 확인 가능

<br/>

## 📂 폴더 구조

```
📂 src
├── 📂 app ──────────────────────── 🔌 앱 설정 및 프로바이더
├── 📂 entities ─────────────────── 📊 도메인 엔티티 및 비즈니스 로직
├── 📂 features ─────────────────── 🎯 기능별 모듈
├── 📂 pages ────────────────────── 📄 페이지 컴포넌트
├── 📂 shared ───────────────────── 🎨 공통 컴포넌트 및 유틸리티
│   ├── 📂 assets ───────────────── 🖼️ 이미지 및 정적 자산
│   └── 📂 ui ───────────────────── 🧩 공통 UI 컴포넌트
├── 📂 widgets ──────────────────── 🧩 재사용 가능한 위젯
└── 📂 lib ──────────────────────── 🛠️ 유틸리티 함수
```

<br/>

## 🚀 시작하기

### 1️⃣ 의존성 설치

```bash
pnpm install
```

### 2️⃣ 환경변수 설정

루트에 .env.local을 만들고 아래 값을 채웁니다.

**필요한 환경변수:**

| 변수명                        | 설명                      |
| ----------------------------- | ------------------------- |
| `VITE_KMA_SERVICE_KEY` | 공공데이터포털 API 인증키 |
| `VITE_API_BASE_URL` | https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0 |

> API 인증키는 [공공데이터 포탈](https://www.data.go.kr/data/15084084/openapi.do)에서 발급받을 수 있습니다.

### 3️⃣ 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 `http://localhost:5173`으로 접속합니다.

<br/>



## 📝 참고사항

#### 1.1 날씨 데이터 조회 로직
#### ① 현재 기온 - getUltraSrtNcst (초단기실황)
```typescript
// 초단기실황 조회 (매시 40분 이후 최신 데이터 제공)
const ncst = await getNcst({ 
  nx, ny, 
  base_date: "20250115", 
  base_time: "1400" 
});

// T1H 카테고리 추출
const currentTemp = ncst.find(item => item.category === 'T1H').obsrValue;
```

#### ② 당일 최저/최고 기온 - getVilageFcst (단기예보) - 현재일, getVilageFcst (단기예보) - 전날 23시 발표본
```typescript
// 단기예보에만 TMN(최저), TMX(최고) 카테고리 존재
// 오늘 02:10 이후 조회 시 당일 최저기온이 전날 23시 발표본에만 있음
const villageCurrent = await getVillageFcst({
  nx, ny,
  base_date: "20250115",
  base_time: "1100"
});

// 전날 23시 단기예보 (보완용)
const villagePrev = await getVillageFcst({
  nx, ny,
  base_date: "20250114",
  base_time: "2300"
});

// TMN, TMX 추출 (target_date = 오늘)
const todayMin = villageCurrent.find(item => 
  item.category === 'TMN' && item.fcstDate === '20250115'
)?.fcstValue;

const todayMax = villageCurrent.find(item => 
  item.category === 'TMX' && item.fcstDate === '20250115'
)?.fcstValue;
```

#### ③ 시간대별 기온 (00~23시)
| API | 제공 시간대 | 용도 |
|-----|-----------|------|
| `getVilageFcst` (단기예보) | 발표 시각 ~ +72시간 | 기본 뼈대 |
| `getUltraSrtFcst` (초단기예보) | 현재 ~ +6시간 | 가까운 미래 덮어쓰기 |
| `getUltraSrtNcst` (초단기실황) | 각 시각 | 현재 실측값 |
| `getUltraSrtNcst` (초단기실황) | 각 시각 | 빈 시간대 보완 |

**우선순위:** 실측값 > 초단기예보 > 단기예보 > 과거 실측값


#### 2. 성능 최적화

#### 2.1 검색 디바운싱
```typescript
// widgets/DistrictSearchBar.tsx
const DEBOUNCE_MS = 150;
```
**→** 입력 중 불필요한 API 호출 최소화



#### 2.2 메모이제이션
```typescript
// entities/weather/hooks/useWeatherViewModel.ts
const viewModel = useMemo(
  () => buildWeatherViewModel(...), 
  [dependencies]
);
```
**→** 복잡한 데이터 변환 로직의 불필요한 재계산 방지


#### 2.3 검색 결과 제한
```typescript
const MAX_RESULTS = 100;
```
**→** 대량 데이터 렌더링으로 인한 성능 저하 방지


#### 2.4 병렬 API 호출
```typescript
// entities/weather/model/useWeatherDetail.ts
const queries = useQueries({
  queries: [
    weatherQueryOptions.ncst({ nx, ny }),
    weatherQueryOptions.fcst({ nx, ny, ...fcstParams }),
    weatherQueryOptions.villageFcst({ nx, ny, ...villageFcstParams }),
    weatherQueryOptions.villageFcst({ nx, ny, ...prevDayParams }),
  ],
});
```

<br/>

#### 3. 사용자 경험 개선

#### 3.1 Skeleton UI
```typescript
isLoading ? (
  <Skeleton className="h-[273px] w-full" />
) : (
  <WeatherDisplay data={data} />
)
```
