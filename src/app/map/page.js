    "use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Activity,
  Globe2,
  Radio,
  TrendingUp,
  MapPin,
  Waves,
  Clock3,
} from "lucide-react";

import MapLegend from "@/components/MapLegend";
import AppShell from "@/components/AppShell";

const DisasterMap = dynamic(() => import("@/components/DisasterMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[400px] items-center justify-center bg-(--surface-elevated)">
      <p className="text-sm text-(--muted-foreground)">
        Loading earthquake map...
      </p>
    </div>
  ),
});

function getMagnitude(event) {
  if (
    event.magnitude === null ||
    event.magnitude === undefined ||
    event.magnitude === ""
  ) {
    return null;
  }

  const magnitude = Number(event.magnitude);
  return Number.isFinite(magnitude) ? magnitude : null;
}

function getEventTime(event) {
  if (!event.occurred_at) return null;

  const date = new Date(event.occurred_at);
  return Number.isNaN(date.getTime()) ? null : date;
}

function hasValidCoordinates(event) {
  if (
    event.latitude === null ||
    event.latitude === undefined ||
    event.longitude === null ||
    event.longitude === undefined
  ) {
    return false;
  }

  const latitude = Number(event.latitude);
  const longitude = Number(event.longitude);

  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

function formatTime(date) {
  if (!date) return "Time unavailable";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const magnitudeRanges = [
  { label: "Below 2.0", min: -Infinity, max: 2 },
  { label: "2.0 – 2.9", min: 2, max: 3 },
  { label: "3.0 – 3.9", min: 3, max: 4 },
  { label: "4.0 – 4.9", min: 4, max: 5 },
  { label: "5.0+", min: 5, max: Infinity },
];

export default function MapPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchEarthquakes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/alerts");

        if (!response.ok) {
          throw new Error("Failed to fetch earthquake alerts");
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Invalid alerts response");
        }

        const earthquakes = result.data
          .filter((event) => event.type === "Earthquake")
          .sort((a, b) => {
            const timeA = getEventTime(a)?.getTime() ?? 0;
            const timeB = getEventTime(b)?.getTime() ?? 0;
            return timeB - timeA;
          });

        if (active) {
          setEvents(earthquakes);
          setError(false);
        }
      } catch (err) {
        console.error("Failed to fetch map analytics:", err);

        if (active) {
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchEarthquakes();

    const intervalId = setInterval(fetchEarthquakes, 5 * 60 * 1000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, []);

  const mappedEvents = events.filter(hasValidCoordinates);

  const magnitudes = events.map(getMagnitude).filter((value) => value !== null);

  const magnitudeData = magnitudeRanges.map((range) => ({
    ...range,
    count: magnitudes.filter((value) => value >= range.min && value < range.max)
      .length,
  }));

  const maxMagnitudeCount = Math.max(
    1,
    ...magnitudeData.map((item) => item.count),
  );

  const strongestMagnitude =
    magnitudes.length > 0 ? Math.max(...magnitudes) : null;

  const eventsWithTime = events.filter((event) => getEventTime(event) !== null);

  const recentEvents = events.slice(0, 5);

  return (
    <AppShell>
      <main className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-(--border) bg-(--surface)">
              <Globe2 size={21} className="text-(--accent)" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-(--foreground)">
                Live Earthquake Map
              </h1>
              <p className="mt-1 text-sm text-(--muted-foreground)">
                Explore earthquake locations and seismic activity.
              </p>
            </div>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-(--border) bg-(--surface) px-3 py-2">
            <span
              className={`h-2 w-2 rounded-full ${
                error ? "bg-red-500" : "bg-(--success)"
              }`}
            />
            <span className="text-xs font-medium text-(--foreground)">
              {loading
                ? "Loading data"
                : error
                  ? "Connection issue"
                  : "Backend connected"}
            </span>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-300 p-3 text-sm text-(--foreground)">
            Unable to refresh earthquake data. Check that the backend is
            running.
            {events.length > 0 && " Previously loaded data is still displayed."}
          </p>
        )}

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-(--border) bg-(--surface) p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-(--muted-foreground)">Mapped Events</p>
              <Activity size={18} className="text-(--accent)" />
            </div>
            <p className="mt-3 text-2xl font-semibold text-(--foreground)">
              {mappedEvents.length}
            </p>
            <p className="mt-1 text-xs text-(--muted-foreground)">
              Earthquakes with valid coordinates
            </p>
          </div>

          <div className="rounded-xl border border-(--border) bg-(--surface) p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-(--muted-foreground)">
                Strongest Magnitude
              </p>
              <Waves size={18} className="text-(--accent)" />
            </div>
            <p className="mt-3 text-2xl font-semibold text-(--foreground)">
              {strongestMagnitude !== null
                ? strongestMagnitude.toFixed(1)
                : "—"}
            </p>
            <p className="mt-1 text-xs text-(--muted-foreground)">
              Highest magnitude in loaded data
            </p>
          </div>

          <div className="rounded-xl border border-(--border) bg-(--surface) p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-(--muted-foreground)">
                Located Events
              </p>
              <MapPin size={18} className="text-(--accent)" />
            </div>
            <p className="mt-3 text-2xl font-semibold text-(--foreground)">
              {mappedEvents.length}
            </p>
            <p className="mt-1 text-xs text-(--muted-foreground)">
              Events with valid latitude and longitude
            </p>
          </div>

          <div className="rounded-xl border border-(--border) bg-(--surface) p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-(--muted-foreground)">
                Timestamp Coverage
              </p>
              <Clock3 size={18} className="text-(--accent)" />
            </div>
            <p className="mt-3 text-2xl font-semibold text-(--foreground)">
              {eventsWithTime.length}
            </p>
            <p className="mt-1 text-xs text-(--muted-foreground)">
              Events with valid timestamps
            </p>
          </div>
        </div>

        <section className="mt-6 overflow-hidden rounded-2xl border border-(--border) bg-(--surface)">
          <div className="flex flex-col gap-2 border-b border-(--border) p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h2 className="text-base font-semibold text-(--foreground)">
                Geographic Activity
              </h2>
              <p className="mt-1 text-xs text-(--muted-foreground)">
                Explore actual earthquake markers from the backend.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-lg border border-(--border) bg-(--surface-elevated) px-3 py-2">
              <Radio size={15} className="text-(--accent)" />
              <span className="text-xs text-(--foreground)">Earthquakes</span>
            </div>
          </div>

          <div className="relative h-[400px] overflow-hidden sm:h-[500px] lg:h-[560px]">
            <DisasterMap />
            <MapLegend />
          </div>

          <div className="border-t border-(--border) px-4 py-3">
            <p className="text-xs text-(--muted-foreground)">
              Displaying {mappedEvents.length} mappable earthquakes from the
              backend.
            </p>
          </div>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
          <section className="rounded-2xl border border-(--border) bg-(--surface) p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-(--foreground)">
                  Magnitude Distribution
                </h2>
                <p className="mt-1 text-xs text-(--muted-foreground)">
                  Number of earthquakes in each magnitude range
                </p>
              </div>
              <TrendingUp size={19} className="text-(--accent)" />
            </div>

            {loading && events.length === 0 ? (
              <p className="mt-6 text-sm text-(--muted-foreground)">
                Loading magnitude data...
              </p>
            ) : magnitudes.length === 0 ? (
              <p className="mt-6 rounded-xl border border-dashed border-(--border) px-4 py-8 text-center text-sm text-(--muted-foreground)">
                Magnitude data unavailable.
              </p>
            ) : (
              <div className="mt-6 space-y-4">
                {magnitudeData.map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-xs text-(--muted-foreground)">
                        {item.label}
                      </span>
                      <span className="text-xs font-semibold tabular-nums text-(--foreground)">
                        {item.count}
                      </span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-(--surface-elevated)">
                      <div
                        className="h-full rounded-full bg-(--accent) transition-all duration-500"
                        style={{
                          width: `${(item.count / maxMagnitudeCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 border-t border-(--border) pt-3">
              <p className="text-xs text-(--muted-foreground)">
                Based on available earthquake magnitude values.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-(--border) bg-(--surface) p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-(--foreground)">
                  Recent Earthquakes
                </h2>
                <p className="mt-1 text-xs text-(--muted-foreground)">
                  Latest events by reported time
                </p>
              </div>
              <Clock3 size={19} className="text-(--accent)" />
            </div>

            {loading && events.length === 0 ? (
              <p className="mt-6 text-sm text-(--muted-foreground)">
                Loading recent earthquakes...
              </p>
            ) : recentEvents.length === 0 ? (
              <p className="mt-6 rounded-xl border border-dashed border-(--border) p-6 text-center text-sm text-(--muted-foreground)">
                No earthquake events available.
              </p>
            ) : (
              <div className="mt-4 divide-y divide-(--border)">
                {recentEvents.map((event) => {
                  const magnitude = getMagnitude(event);
                  const time = getEventTime(event);

                  return (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--surface-elevated)">
                        <MapPin size={16} className="text-(--accent)" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-medium text-(--foreground)">
                          {event.location || "Location unavailable"}
                        </p>
                        <p className="mt-1 text-xs text-(--muted-foreground)">
                          {formatTime(time)}
                        </p>
                      </div>

                      <div className="shrink-0 rounded-lg border border-(--border) px-2 py-1 text-xs font-semibold text-(--foreground)">
                        {magnitude !== null
                          ? `M ${magnitude.toFixed(1)}`
                          : "M —"}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-5 border-t border-(--border) pt-3">
              <p className="text-xs text-(--muted-foreground)">
                Times and magnitudes are shown when available.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-5 flex items-start gap-2 rounded-xl border border-(--border) bg-(--surface) p-4">
          <Globe2
            size={17}
            className="mt-0.5 shrink-0 text-(--muted-foreground)"
          />
          <p className="text-xs leading-relaxed text-(--muted-foreground)">
            Data comes from the backend&apos;s USGS earthquake ingestion. The
            source feed covers recent earthquakes, not every historical
            earthquake worldwide. Updates depend on source availability and the
            backend ingestion schedule.
          </p>
        </div>
      </main>
    </AppShell>
  );
}
