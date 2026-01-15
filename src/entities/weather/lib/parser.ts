import type {
  CurrentWeather,
  DailyWeather,
  HourlyForecast,
  PTYCode,
  SkyCode,
  WeatherFcstItem,
  WeatherNcstItem,
  WeatherVillageFcstItem,
} from "../model/types";

// 초단기실황 파싱
export function parseCurrentWeather(
  items: WeatherNcstItem[],
  base_date: string,
  base_time: string,
): CurrentWeather | undefined {
  if (!items || items.length === 0) return undefined;

  const data: Partial<CurrentWeather> = {
    baseDate: base_date,
    baseTime: base_time,
  };

  items.forEach((item) => {
    const value = parseFloat(item.obsrValue || "0");
    switch (item.category) {
      case "T1H": // 기온
        data.temperature = value;
        break;
      case "PTY": // 강수형태
        data.precipitationType = value as PTYCode;
        break;
    }
  });

  return data as CurrentWeather;
}

// 초단기예보 파싱
export function parseHourlyForecast(
  items: WeatherFcstItem[] | WeatherVillageFcstItem[],
  target_date: string,
): HourlyForecast[] {
  if (!items || items.length === 0) return [];

  const timeMap = new Map<string, Partial<HourlyForecast>>();

  items.forEach((item) => {
    if (!item.fcstDate || !item.fcstTime) return;
    if (item.fcstDate !== target_date) return;

    const timeKey = `${item.fcstDate}-${item.fcstTime}`;

    if (!timeMap.has(timeKey)) {
      timeMap.set(timeKey, {
        fcstDate: item.fcstDate,
        fcstTime: item.fcstTime,
      });
    }

    const forecast = timeMap.get(timeKey)!;
    const value = parseFloat(item.fcstValue || "0");

    switch (item.category) {
      case "TMP": // 단기예보 기온
      case "T1H": // 초단기예보 기온
        forecast.temperature = value;
        break;
      case "SKY": // 하늘상태
        forecast.skyState = value as SkyCode;
        break;
      case "PTY": // 강수형태
        forecast.precipitationType = value as PTYCode;
        break;
    }
  });

  console.log("timeMap", timeMap.values());

  return Array.from(timeMap.values()).sort((a, b) =>
    (a.fcstTime || "").localeCompare(b.fcstTime || ""),
  ) as HourlyForecast[];
}

// 단기예보 파싱
// 단기예보에 당일 최저기온이 포함 안되는 경우가 있어서 target_date를 사용하여 전날 데이터에서 추출
export function parseDailyWeather(items: WeatherVillageFcstItem[], target_date: string): DailyWeather {
  if (!items || items.length === 0) {
    return {
      baseDate: target_date,
      minTemp: undefined,
      maxTemp: undefined,
    };
  }

  const tmn = items.filter((it) => it.category === "TMN" && it.fcstDate === target_date)[0];
  const tmx = items.filter((it) => it.category === "TMX" && it.fcstDate === target_date)[0];

  return {
    baseDate: target_date,
    minTemp: tmn ? parseFloat(tmn.fcstValue || "0") : undefined,
    maxTemp: tmx ? parseFloat(tmx.fcstValue || "0") : undefined,
  };
}
