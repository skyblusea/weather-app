import { kst } from "@/shared/lib/dayjs";
import type { WeatherDateTimeParams } from "../model/types";

/**
 * 현재 기온(실측)용: getUltraSrtNcst
 * 문서: 매시 40분 이후 최신 조회 가능 → now-40분 기준 HH00
 */
export function getNcsBaseTime(now: Date = new Date()): WeatherDateTimeParams {
  const t = kst(now).subtract(40, "minute");
  return { base_date: t.format("YYYYMMDD"), base_time: t.format("HH00") };
}

/**
 * 시간대별(1시간) 기온용: getUltraSrtFcst
 * 문서: 매시 45분 이후 최신 조회 가능 → now-45분 기준 HH30
 */
export function getFcsBaseTime(now: Date = new Date()): WeatherDateTimeParams {
  const t = kst(now).subtract(45, "minute");
  return { base_date: t.format("YYYYMMDD"), base_time: t.format("HH30") };
}

/**
 * 단기예보(getVillageFcst) 호출 시각 계산 (base_time + 10분 규칙)
 * - base_time: 0200,0500,0800,1100,1400,1700,2000,2300
 * - API 제공: 각 base_time + 10분 이후
 *
 * 예시:
 * - 14:05 -> 1100 사용 (1400은 아직 API 제공 전)
 * - 14:10 -> 1400 사용 (1400 + 10분 도달)
 * - 01:00 -> 전날 2300 사용
 */
export function getVillageFcstBaseTime(now: Date = new Date()): WeatherDateTimeParams {
  const kstNow = kst(now);
  const baseTimes = [
    { time: "0200", hour: 2, minute: 0 },
    { time: "0500", hour: 5, minute: 0 },
    { time: "0800", hour: 8, minute: 0 },
    { time: "1100", hour: 11, minute: 0 },
    { time: "1400", hour: 14, minute: 0 },
    { time: "1700", hour: 17, minute: 0 },
    { time: "2000", hour: 20, minute: 0 },
    { time: "2300", hour: 23, minute: 0 },
  ] as const;

  // 각 base_time의 API 제공 시작 시각(+10분)과 비교
  let chosenTime = "2300";
  let chosenDate = kstNow.format("YYYYMMDD");

  for (let i = baseTimes.length - 1; i >= 0; i--) {
    const bt = baseTimes[i];
    // API 제공 시작 시각 = base_time + 10분
    const availableAt = kstNow.startOf("day").hour(bt.hour).minute(bt.minute).add(10, "minute");

    if (kstNow.isAfter(availableAt) || kstNow.isSame(availableAt)) {
      chosenTime = bt.time;
      chosenDate = kstNow.format("YYYYMMDD");
      break;
    }
  }

  // 오늘 02:10 이전이면 전날 2300 사용
  const firstAvailable = kstNow.startOf("day").hour(2).minute(10);
  if (kstNow.isBefore(firstAvailable)) {
    chosenTime = "2300";
    chosenDate = kstNow.subtract(1, "day").format("YYYYMMDD");
  }

  return { base_date: chosenDate, base_time: chosenTime };
}
