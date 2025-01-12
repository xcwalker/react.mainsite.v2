import { CSSProperties, useEffect, useState } from "react";
import GFIcon from "../../components/GFIcon";
import css from "../../styles/pages/dashboard/weather.module.css";

export default function DashboardWeather() {
  const [weather, setWeather] = useState<weatherType | undefined>();
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_direction_10m&wind_speed_unit=mph&forecast_days=1"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setWeather(data);
      });
  }, []);

  return (
    <section
      className={css.weather + " " + (showDetails ? css.showDetails : "")}
    >
      <div className={css.container}>
        {weather && (
          <>
            <header className={css.header}>
              <h2>Today's Weather</h2>
              <button onClick={() => setShowDetails((prev) => !prev)}>
                {showDetails && (
                  <>
                    Hide Details <GFIcon>arrow_drop_up</GFIcon>
                  </>
                )}
                {!showDetails && (
                  <>
                    Show Details <GFIcon>arrow_drop_down</GFIcon>
                  </>
                )}
              </button>
            </header>
            <main className={css.main}>
              <WeatherCard
                units={weather.current_units}
                weather={weather.current}
                timeOverride="Now"
              />
              <div className={css.forecast}>
                <div className={css.scroller}>
                  {weather.hourly.time.map((time, index) => (
                    <WeatherCard
                      units={weather.hourly_units}
                      weather={{
                        time: time,
                        interval: index,
                        temperature_2m: weather.hourly.temperature_2m[index],
                        precipitation: weather.hourly.precipitation[index],
                        precipitation_probability:
                          weather.hourly.precipitation_probability[index],
                        weather_code: weather.hourly.weather_code[index],
                        wind_speed_10m: weather.hourly.wind_speed_10m[index],
                        wind_direction_10m:
                          weather.hourly.wind_direction_10m[index],
                        relative_humidity_2m:
                          weather.hourly.relative_humidity_2m[index],
                      }}
                    />
                  ))}
                </div>
              </div>
            </main>
          </>
        )}
        {!weather && <span>Loading</span>}
      </div>
    </section>
  );
}

function WeatherCard(props: {
  weather: weatherInfoType;
  units: unitsType;
  timeOverride?: string;
}) {
  const date = new Date(props.weather.time);
  const currentDate = new Date();

  return (
    <>
      {(date > currentDate || props.timeOverride) && (
        <div className={css.card}>
          <span className={css.time}>
            {props.timeOverride
              ? props.timeOverride
              : date.toLocaleTimeString("locale", {
                  hour: "numeric",
                  minute: "numeric",
                })}
          </span>
          <div className={css.iconContainer}>
            <GFIcon className={css.icon}>
              {weatherIcon(props.weather.weather_code)}
            </GFIcon>
            <div
              className={css.compass}
              style={
                {
                  "--_direction": props.weather.wind_direction_10m + "deg",
                } as CSSProperties
              }
            />
            <div className={css.temperature}>
              {Math.round(props.weather.temperature_2m)}
              {props.units.temperature_2m}
            </div>
          </div>
          <div className={css.detailed}>
            <div className={css.temperature}>
              <span className={css.value}>{props.weather.temperature_2m}</span>
              <span className={css.unit}>{props.units.temperature_2m}</span>
            </div>
            <div className={css.precipitation}>
              <span className={css.value}>{props.weather.precipitation}</span>
              <span className={css.unit}>{props.units.precipitation}</span>
            </div>
            <div className={css.humidity}>
              <span className={css.value}>
                {props.weather.relative_humidity_2m}
              </span>
              <span className={css.unit}>
                {props.units.relative_humidity_2m}
              </span>
            </div>
            <div className={css.wind}>
              <span className={css.value}>{props.weather.wind_speed_10m}</span>
              <span className={css.unit}>
                {props.units.wind_speed_10m}
              </span>{" "}
              <span className={css.value}>
                {getDirection(props.weather.wind_direction_10m)}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

type weatherType = {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: unitsType;
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    relative_humidity_2m: number;
  };
  hourly_units: unitsType;
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation: number[];
    precipitation_probability: number[];
    weather_code: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
  };
};

type unitsType = {
  time: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  precipitation: string;
  precipitation_probability?: string;
  weather_code: string;
  wind_speed_10m: string;
  wind_direction_10m: string;
};

type weatherInfoType = {
  time: string;
  interval: number;
  temperature_2m: number;
  precipitation: number;
  precipitation_probability?: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  relative_humidity_2m: number;
};

function weatherIcon(code: number) {
  if (code === 0) return "clear_day";
  else if (code === 1 || code === 2 || code === 3) return "cloud";
  else if (code === 45 || code === 48) return "foggy";
  else if (code === 51 || code === 53 || code === 55) return "rainy_light";
  else if (code === 56 || code === 57) return "weather_mix";
  else if (code === 61 || code === 63 || code === 65) return "rainy_heavy";
  else if (code === 66 || code === 67) return "weather_hail";
  else if (code === 71 || code === 73 || code === 75 || code === 77)
    return "snowing";
  else if (code === 80 || code === 81 || code === 82) return "rainy";
  else if (code === 85 || code === 86) return "weather_snowy";
  else if (code === 95 || code === 96 || code === 99) return "thunderstorm";
  else return "error";
}

function getDirection(angle: number) {
  // SRC: https://gist.github.com/theKAKAN/b40bf54144a6eb90313ad00681e3fbcc

  // We divide it into 16 sections
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  // This means, every 360 / 16 degree, there's a section change
  // So, in our case, every 22.5 degree, there's a section change
  // In order to get the correct section, we just need to divide
  let section = parseInt((angle / 22.5 + 0.5).toString());
  // If our result comes to be x.6, which should normally be rounded off to
  // int(x) + 1, but parseInt doesn't care about it
  // Hence, we are adding 0.5 to it

  // Now we know the section, just need to make sure it's under 16
  section = section % 16;

  // Now we can return it
  return directions[section];
}
