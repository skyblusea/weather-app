/**
 * "HH" 문자열이 00~23 범위인지 검증
 */
export const isValidHour = (hh: string) => {
  const n = Number(hh);
  return Number.isFinite(n) && n >= 0 && n <= 23;
};
