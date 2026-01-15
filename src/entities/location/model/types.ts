/**
 * korea_districts에 기상청 데이터를 매핑한 데이터 타입
 */
export interface KmaLocation extends Location {
  code: string;
  level1: string;
  level2?: string;
  level3?: string;
  gridX: number;
  gridY: number;
  lat: number;
  lon: number;
  path: string;
  key: string;
}

export interface Location {
  name: string;
  nx: number;
  ny: number;
}

export interface GeolocationPosition {
  nx: number;
  ny: number;
}
