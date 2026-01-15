import dayjs, { type Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const KST = "Asia/Seoul";

export function kst(now: Date = new Date()): Dayjs {
  return dayjs(now).tz(KST);
}
