import type { PTY_CODES, SKY_CODES } from "./constants";

export interface WeatherSummary {
  currentTemp: number | null;
  todayMinTemp: number | null;
  todayMaxTemp: number | null;
  isLoading: boolean;
  isError: boolean;
}

export type SkyCode = (typeof SKY_CODES)[keyof typeof SKY_CODES];
export type PTYCode = (typeof PTY_CODES)[keyof typeof PTY_CODES];

export type WeatherCondition = "SUNNY" | "PARTLY_CLOUDY" | "CLOUDY" | "RAIN" | "RAIN_SNOW" | "SNOW" | "SHOWER";

export interface WeatherRequestParams {
  // ServiceKey: string;
  // pageNo: number;
  // numOfRows: number;
  // dataType: "XML" | "JSON";
  base_date: string;
  base_time: string;
  nx: number;
  ny: number;
}

export interface WeatherResponseHeader {
  resultCode: string;
  resultMsg: string;
}

export interface WeatherResponseBody<T> {
  dataType: string;
  items: {
    item: T[];
  };
  pageNo: number;
  numOfRows: number;
  totalCount: number;
}

// T1H: 기온 (Temperature) - ℃
// RN1: 1시간 강수량 (1-hour precipitation) - mm
// UUU: 동서바람성분 (East-west wind component) - m/s
// VVV: 남북바람성분 (North-south wind component) - m/s
// REH: 습도 (Humidity) - %
// PTY: 강수형태 (Precipitation type) - 코드값
// VEC: 풍향 (Wind direction) - deg
// WSD: 풍속 (Wind speed) - m/s

/** 초단기실황 카테고리 */
export type WeatherNcstCategory =
  | "T1H" // 기온
  | "RN1" // 1시간 강수량
  | "UUU" // 동서바람성분
  | "VVV" // 남북바람성분
  | "REH" // 습도
  | "PTY" // 강수형태
  | "VEC" // 풍향
  | "WSD"; // 풍속

/** 초단기예보 카테고리 */
export type WeatherFcstCategory =
  | WeatherNcstCategory
  | "SKY" // 하늘상태
  | "LGT"; // 낙뢰;

/** 단기예보(동네예보) API 카테고리 */
export type WeatherVillageFcstCategory =
  | "POP" // 강수확률 (%)
  | "PTY" // 강수형태 (코드값)
  | "PCP" // 1시간 강수량 (범주, 1mm)
  | "REH" // 습도 (%)
  | "SNO" // 1시간 신적설 (범주, 1cm)
  | "SKY" // 하늘상태 (코드값)
  | "TMP" // 1시간 기온 (℃)
  | "TMN" // 일 최저기온 (℃)
  | "TMX" // 일 최고기온 (℃)
  | "UUU" // 풍속(동서성분) (m/s)
  | "VVV" // 풍속(남북성분) (m/s)
  | "WAV" // 파고 (M)
  | "VEC" // 풍향 (deg)
  | "WSD"; // 풍속 (m/s)

export interface WeatherDateTimeParams {
  base_date: string;
  base_time: string;
}

export interface WeatherItemBase<C> extends WeatherDateTimeParams {
  category: C;
  nx: number;
  ny: number;
}

export interface WeatherNcstItem extends WeatherItemBase<WeatherNcstCategory> {
  obsrValue: string;
}

export interface WeatherFcstItem extends WeatherItemBase<WeatherFcstCategory> {
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
}

export interface WeatherVillageFcstItem extends WeatherItemBase<WeatherVillageFcstCategory> {
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
}

export interface WeatherNcstResponse {
  response: {
    header: WeatherResponseHeader;
    body: WeatherResponseBody<WeatherNcstItem>;
  };
}

export interface WeatherFcstResponse {
  response: {
    header: WeatherResponseHeader;
    body: WeatherResponseBody<WeatherFcstItem>;
  };
}

export interface WeatherVillageFcstResponse {
  response: {
    header: WeatherResponseHeader;
    body: WeatherResponseBody<WeatherVillageFcstItem>;
  };
}

export interface CurrentWeather {
  temperature: number; // T1H
  precipitationType: PTYCode; // PTY
  baseDate: string;
  baseTime: string;
}

export interface ForecastWeather {
  temperature: number; // TMP
  skyState: SkyCode; // SKY
  precipitationType: PTYCode; // PTY
  fcstDate: string;
  fcstTime: string;
}

export interface DailyWeather {
  baseDate: string;
  minTemp?: number; // TMN
  maxTemp?: number; // TMX
}

export interface HourlyForecast {
  fcstDate: string;
  fcstTime: string;
  temperature: number;
  skyState: SkyCode;
  precipitationType: PTYCode;
}

export interface WeatherData {
  current: CurrentWeather | null;
  hourly: HourlyForecast[];
  daily: DailyWeather[];
  location: {
    name: string;
    nx: number;
    ny: number;
  };
}

/**
 * 시간대별 기온 데이터
 * - temp: 기온(℃), undefined면 데이터 없음
 * - source: 데이터 출처 (디버그/표시용)
 */
export type HourWeather = {
  fcstDate: string;
  fcstTime: string;
  temperature?: number;
  condition: WeatherCondition;
  source: "VILAGE_TMP" | "FCST_T1H" | "NCST_T1H" | "MISSING";
};

/**
 * 24시간 기온 맵 (key: "00"~"23")
 */
export type HourlyWeather = Map<string, HourWeather>;

export type Location = {
  nx: number;
  ny: number;
  name: string;
  path: string;
};
