/**
 * 격자 <-> 위경도 변환 (Lambert Conformal Conic)
 * 기상청 공식문서 속 원본 C 예제를 변환
 *
 * 사용:
 *  - gridToLatLon(x, y)
 *  - latLonToGrid(lon, lat)
 *
 * 참고:
 *  - mode=1: 격자(X,Y) -> 위경도
 *  - mode=0: 위경도 -> 격자(X,Y)
 */

export const NX = 149; // X축 격자점 수
export const NY = 253; // Y축 격자점 수

export type LamcParameter = {
  Re: number; // 사용할 지구반경 [km]
  grid: number; // 격자간격 [km]
  slat1: number; // 표준위도1 [degree]
  slat2: number; // 표준위도2 [degree]
  olon: number; // 기준점 경도 [degree]
  olat: number; // 기준점 위도 [degree]
  xo: number; // 기준점 X좌표 [grid]
  yo: number; // 기준점 Y좌표 [grid]
};

export type GridXY = { x: number; y: number };
export type LonLat = { lon: number; lat: number };

export type GridToLonLatResult = { x: number; y: number; lon: number; lat: number };
export type LonLatToGridResult = { lon: number; lat: number; x: number; y: number };

// 기본값
export const DEFAULT_MAP: LamcParameter = {
  Re: 6371.00877,
  grid: 5.0,
  slat1: 30.0,
  slat2: 60.0,
  olon: 126.0,
  olat: 38.0,
  xo: 210 / 5.0,
  yo: 675 / 5.0,
};

/**
 * 내부 계산 캐시(원본 C의 static 변수 역할)
 */
type LamcCache = {
  PI: number;
  DEGRAD: number;
  RADDEG: number;
  re: number;
  olon: number; // rad
  olat: number; // rad
  sn: number;
  sf: number;
  ro: number;
};

function buildCache(map: LamcParameter): LamcCache {
  const PI = Math.asin(1.0) * 2.0;
  const DEGRAD = PI / 180.0;
  const RADDEG = 180.0 / PI;

  const re = map.Re / map.grid;
  const slat1 = map.slat1 * DEGRAD;
  const slat2 = map.slat2 * DEGRAD;
  const olon = map.olon * DEGRAD;
  const olat = map.olat * DEGRAD;

  let sn = Math.tan(PI * 0.25 + slat2 * 0.5) / Math.tan(PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);

  let sf = Math.tan(PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;

  let ro = Math.tan(PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);

  return { PI, DEGRAD, RADDEG, re, olon, olat, sn, sf, ro };
}

/**
 * Lambert Conformal Conic Projection
 *
 * code = 0 : (lon,lat) -> (x,y)
 * code = 1 : (x,y) -> (lon,lat)
 *
 * 반환:
 *  - code=0이면 {x,y}가 유효
 *  - code=1이면 {lon,lat}가 유효
 */
function lamcproj(
  input: { lon: number; lat: number; x: number; y: number },
  code: 0 | 1,
  map: LamcParameter,
  cache: LamcCache,
): { lon: number; lat: number; x: number; y: number } {
  const { PI, DEGRAD, RADDEG, re, olon, sn, sf, ro } = cache;

  if (code === 0) {
    // forward: lon/lat -> x/y
    let ra = Math.tan(PI * 0.25 + input.lat * DEGRAD * 0.5);
    ra = (re * sf) / Math.pow(ra, sn);

    let theta = input.lon * DEGRAD - olon;
    if (theta > PI) theta -= 2.0 * PI;
    if (theta < -PI) theta += 2.0 * PI;
    theta *= sn;

    const x = ra * Math.sin(theta) + map.xo;
    const y = ro - ra * Math.cos(theta) + map.yo;

    return { lon: input.lon, lat: input.lat, x, y };
  }

  // inverse: x/y -> lon/lat
  const xn = input.x - map.xo;
  const yn = ro - input.y + map.yo;

  let ra = Math.sqrt(xn * xn + yn * yn);
  if (sn < 0.0) ra = -ra;

  let alat = Math.pow((re * sf) / ra, 1.0 / sn);
  alat = 2.0 * Math.atan(alat) - PI * 0.5;

  let theta: number;
  if (Math.abs(xn) <= 0.0) {
    theta = 0.0;
  } else if (Math.abs(yn) <= 0.0) {
    theta = PI * 0.5;
    if (xn < 0.0) theta = -theta;
  } else {
    theta = Math.atan2(xn, yn);
  }

  const alon = theta / sn + olon;

  return {
    lon: alon * RADDEG,
    lat: alat * RADDEG,
    x: input.x,
    y: input.y,
  };
}

/**
 * 원본 C 예제의 map_conv()에 해당
 *
 * mode=0: 위경도 -> 격자
 * mode=1: 격자 -> 위경도
 */
export function mapConv(
  mode: 0 | 1,
  params: (LonLat & Partial<GridXY>) | (GridXY & Partial<LonLat>),
  map: LamcParameter = DEFAULT_MAP,
): GridToLonLatResult | LonLatToGridResult {
  const cache = buildCache(map);

  if (mode === 0) {
    const lon = (params as LonLat).lon;
    const lat = (params as LonLat).lat;

    const r = lamcproj({ lon, lat, x: 0, y: 0 }, 0, map, cache);
    // 원본 C: *x = (int)(x1 + 1.5), *y = (int)(y1 + 1.5)
    const x = Math.trunc(r.x + 1.5);
    const y = Math.trunc(r.y + 1.5);
    return { lon, lat, x, y };
  }

  const x = (params as GridXY).x;
  const y = (params as GridXY).y;

  // 원본 C: x1 = *x - 1; y1 = *y - 1;
  const x1 = x - 1;
  const y1 = y - 1;

  const r = lamcproj({ lon: 0, lat: 0, x: x1, y: y1 }, 1, map, cache);
  return { x, y, lon: r.lon, lat: r.lat };
}

/**
 * 편의 함수: 위경도 -> 격자
 */
export function latLonToGrid(lon: number, lat: number, map: LamcParameter = DEFAULT_MAP): LonLatToGridResult {
  return mapConv(0, { lon, lat }, map) as LonLatToGridResult;
}
