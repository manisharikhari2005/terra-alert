"use client";

import { useEffect, useState } from "react";
import {
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  LoaderCircle,
  MapPin,
  RefreshCw,
  Sun,
  Wind,
} from "lucide-react";

function getWeatherDescription(code) {
  if (code === 0) return "Clear sky";
  if ([1, 2].includes(code)) return "Mainly clear / partly cloudy";
  if (code === 3) return "Overcast";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Rain showers";
  if ([85, 86].includes(code)) return "Snow showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Weather information available";
}

function getWeatherIcon(code) {
  if (code === 0) return Sun;
  if ([1, 2, 3].includes(code)) return CloudSun;
  if (
    [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(
      code,
    )
  ) {
    return CloudRain;
  }
  return Cloud;
}

export default function NearbyWeather({ userPosition }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!userPosition) return;

    const controller = new AbortController();

    async function fetchWeather() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          latitude: String(userPosition.latitude),
          longitude: String(userPosition.longitude),
          current: [
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "precipitation",
            "wind_speed_10m",
            "weather_code",
          ].join(","),
          timezone: "auto",
        });

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
          { signal: controller.signal, cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error("Weather service is temporarily unavailable.");
        }

        const result = await response.json();

        if (!result.current) {
          throw new Error("Weather data is currently unavailable.");
        }

        setWeather(result);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load weather information.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchWeather();

    return () => controller.abort();
  }, [userPosition, refreshKey]);

  if (!userPosition) return null;

  const current = weather?.current;
  const WeatherIcon = current ? getWeatherIcon(current.weather_code) : Cloud;

  return (
    <section className="mt-5 overflow-hidden rounded-2xl border border-(--border) bg-(--surface)">
      {" "}
      <div className="flex items-center justify-between gap-3 border-b border-(--border) px-4 py-4 sm:px-5">
        {" "}
        <div className="flex items-center gap-3">
          {" "}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--surface-elevated) text-(--accent)">
            {" "}
            <WeatherIcon size={22} />{" "}
          </div>
          <div>
            <h2 className="font-semibold text-(--foreground)">Local Weather</h2>
            <p className="mt-1 flex items-center gap-1 text-xs text-(--muted-foreground)">
              <MapPin size={12} />
              Based on your current location
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setRefreshKey((value) => value + 1)}
          disabled={loading}
          aria-label="Refresh weather"
          className="rounded-lg border border-(--border) p-2 text-(--muted-foreground) transition hover:bg-(--surface-elevated) disabled:opacity-50"
        >
          {loading ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : (
            <RefreshCw size={17} />
          )}
        </button>
      </div>
      <div className="p-4 sm:p-5">
        {loading && !current ? (
          <div className="flex min-h-24 items-center justify-center gap-2 text-sm text-(--muted-foreground)">
            <LoaderCircle size={18} className="animate-spin" />
            Loading local weather...
          </div>
        ) : error && !current ? (
          <div className="rounded-xl border border-(--border) p-4">
            <p className="text-sm text-(--foreground)">{error}</p>
            <button
              type="button"
              onClick={() => setRefreshKey((value) => value + 1)}
              className="mt-3 text-sm font-medium text-(--accent)"
            >
              Try again
            </button>
          </div>
        ) : current ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-4xl font-semibold tracking-tight text-(--foreground)">
                  {Math.round(current.temperature_2m)}°C
                </p>
                <p className="mt-2 text-sm text-(--muted-foreground)">
                  {getWeatherDescription(current.weather_code)}
                </p>
              </div>

              <WeatherIcon size={44} className="text-(--accent)" />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-(--border) p-3">
                <div className="flex items-center gap-2 text-xs text-(--muted-foreground)">
                  <CloudSun size={15} />
                  Feels like
                </div>
                <p className="mt-2 font-semibold text-(--foreground)">
                  {current.apparent_temperature}°C
                </p>
              </div>

              <div className="rounded-xl border border-(--border) p-3">
                <div className="flex items-center gap-2 text-xs text-(--muted-foreground)">
                  <Droplets size={15} />
                  Humidity
                </div>
                <p className="mt-2 font-semibold text-(--foreground)">
                  {current.relative_humidity_2m}%
                </p>
              </div>

              <div className="rounded-xl border border-(--border) p-3">
                <div className="flex items-center gap-2 text-xs text-(--muted-foreground)">
                  <Wind size={15} />
                  Wind speed
                </div>
                <p className="mt-2 font-semibold text-(--foreground)">
                  {current.wind_speed_10m} km/h
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-(--muted-foreground)">
              Weather conditions are informational and are not official disaster
              warnings. Precipitation: {current.precipitation} mm.
            </p>
          </>
        ) : null}

        <p className="mt-4 border-t border-(--border) pt-3 text-xs text-(--muted-foreground)">
          Weather data by{" "}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-(--foreground)"
          >
            Open-Meteo
          </a>
        </p>
      </div>
    </section>
  );
}
