"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  LocateFixed,
  MapPin,
  Navigation,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { apiUrl } from "@/lib/api";
import AppShell from "@/components/AppShell";
import NearbyEventsMap from "@/components/NearbyEventsMap";
import NearbyWeather from "@/components/NearbyWeather";



const RADII = [25, 50, 100, 250, 500];

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(Math.min(1, a)));
}

function hasValidCoordinates(alert) {
  const lat = Number(alert.latitude);
  const lon = Number(alert.longitude);

  return (
    alert.latitude !== null &&
    alert.latitude !== undefined &&
    alert.latitude !== "" &&
    alert.longitude !== null &&
    alert.longitude !== undefined &&
    alert.longitude !== "" &&
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
}

function formatDistance(distance) {
  if (distance < 1) return `${Math.round(distance * 1000)} m away`;
  return `${distance.toFixed(distance < 10 ? 1 : 0)} km away`;
}

function getSeverityClass(severity) {
  const value = String(severity || "").toLowerCase();

  if (value === "high") {
    return "border-(--alert-red)/30 bg-(--alert-red)/10 text-(--alert-red)";
  }

  if (value === "medium") {
    return "border-(--alert-orange)/30 bg-(--alert-orange)/10 text-(--alert-orange)";
  }

  return "border-(--success)/30 bg-(--success)/10 text-(--success)";
}

export default function NearMePage() {
  const [userPosition, setUserPosition] = useState(null);
  const [radius, setRadius] = useState(100);
  const [alerts, setAlerts] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationError, setLocationError] = useState("");

  const fetchAlerts = useCallback(async () => {
    try {
      setLoadingAlerts(true);
      setError("");

    const response = await fetch(apiUrl("alerts"), {
      cache: "no-store",
    });

      if (!response.ok) {
        throw new Error("Unable to fetch disaster alerts.");
      }

      const result = await response.json();

      if (!result.success || !Array.isArray(result.data)) {
        throw new Error("The alerts API returned an invalid response.");
      }

      setAlerts(result.data.filter(hasValidCoordinates));
    } catch (err) {
      console.error("Near Me alerts error:", err);
      setError(
        "Unable to load nearby events. Check that the backend is running and try again.",
      );
    } finally {
      setLoadingAlerts(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  function requestLocation() {
    if (!navigator.geolocation) {
      setLocationError("Your browser does not support location access.");
      return;
    }

    setLocationLoading(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationLoading(false);
      },
      (err) => {
        const messages = {
          1: "Location permission was denied. Allow location access in your browser settings and try again.",
          2: "Your location is currently unavailable. Check your device location settings and retry.",
          3: "Location request timed out. Please try again.",
        };

        setLocationError(
          messages[err.code] || "Could not retrieve your location.",
        );
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      },
    );
  }

  const nearbyEvents = useMemo(() => {
    if (!userPosition) return [];

    return alerts
      .map((alert) => ({
        ...alert,
        distance: calculateDistance(
          userPosition.latitude,
          userPosition.longitude,
          Number(alert.latitude),
          Number(alert.longitude),
        ),
      }))
      .filter((alert) => alert.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
  }, [alerts, userPosition, radius]);

  return (
    <AppShell>
      <main className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <header className="flex flex-col gap-4 border-b border-(--border) pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-(--border) bg-(--surface-elevated) text-(--accent)">
                  <LocateFixed size={20} />
                </div>

                <h1 className="text-2xl font-semibold tracking-tight text-(--foreground) sm:text-3xl">
                  Events Near Me
                </h1>
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-(--muted-foreground)">
                Find earthquake events near your current location and see how
                far away each epicentre is.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchAlerts}
              disabled={loadingAlerts}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-(--border) bg-(--surface) px-4 py-2 text-sm font-medium text-(--foreground) transition hover:border-(--accent)/60 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={loadingAlerts ? "animate-spin" : ""}
              />
              Refresh events
            </button>
          </header>

          <section className="mt-6 rounded-2xl border border-(--border) bg-(--surface) p-4 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--accent)/10 text-(--accent)">
                  <Navigation size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-(--foreground)">
                    Your location
                  </h2>

                  <p className="mt-1 text-sm text-(--muted-foreground)">
                    {userPosition
                      ? "Location detected. Nearby events are calculated from your coordinates."
                      : "Share your location to calculate distances to earthquake epicentres."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={requestLocation}
                disabled={locationLoading}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-(--accent) px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-(--accent-hover) disabled:cursor-wait disabled:opacity-70"
              >
                <LocateFixed
                  size={17}
                  className={locationLoading ? "animate-pulse" : ""}
                />
                {locationLoading
                  ? "Detecting location..."
                  : userPosition
                    ? "Update my location"
                    : "Use my location"}
              </button>
            </div>

            {locationError && (
              <div
                role="alert"
                className="mt-4 flex items-start gap-2 rounded-xl border border-(--alert-orange)/30 bg-(--alert-orange)/10 p-3 text-sm text-(--foreground)"
              >
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-(--alert-orange)"
                />
                <p>{locationError}</p>
              </div>
            )}

            {userPosition && (
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-(--border) pt-4 text-xs text-(--muted-foreground)">
                <span>Latitude: {userPosition.latitude.toFixed(5)}</span>
                <span>Longitude: {userPosition.longitude.toFixed(5)}</span>
                <span className="text-(--success)">
                  Location available for this page session
                </span>
              </div>
            )}
          </section>
          {userPosition && <NearbyWeather userPosition={userPosition} />}
          <section className="mt-5 rounded-2xl border border-(--border) bg-(--surface) p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-(--foreground)">
                  Search radius
                </h2>
                <p className="mt-1 text-sm text-(--muted-foreground)">
                  Show earthquakes within this distance of your location.
                </p>
              </div>

              <p className="text-2xl font-semibold text-(--accent)">
                {radius} <span className="text-sm font-medium">km</span>
              </p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
              {RADII.map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={radius === value}
                  onClick={() => setRadius(value)}
                  className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                    radius === value
                      ? "border-(--accent) bg-(--accent)/10 text-(--accent)"
                      : "border-(--border) bg-(--surface-elevated) text-(--muted-foreground) hover:border-(--accent)/50 hover:text-(--foreground)"
                  }`}
                >
                  {value} km
                </button>
              ))}
            </div>
          </section>

          {error && (
            <div
              role="alert"
              className="mt-5 flex flex-col gap-3 rounded-xl border border-(--alert-red)/30 bg-(--alert-red)/10 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-sm text-(--foreground)">{error}</p>
              <button
                type="button"
                onClick={fetchAlerts}
                className="inline-flex items-center gap-2 self-start text-sm font-medium text-(--accent)"
              >
                <RefreshCw size={15} />
                Try again
              </button>
            </div>
          )}

          {!error && (
            <>
              <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-(--foreground)">
                    Nearby earthquake events
                  </h2>
                  <p className="mt-1 text-sm text-(--muted-foreground)">
                    {userPosition
                      ? `${nearbyEvents.length} event${nearbyEvents.length === 1 ? "" : "s"} within ${radius} km`
                      : "Set your location to view nearby events."}
                  </p>
                </div>

                {userPosition && !loadingAlerts && (
                  <span className="rounded-full border border-(--border) bg-(--surface) px-3 py-1.5 text-xs text-(--muted-foreground)">
                    Nearest first
                  </span>
                )}
              </div>

              {userPosition && !loadingAlerts && (
                <div className="mt-5">
                  <NearbyEventsMap
                    userPosition={userPosition}
                    events={nearbyEvents}
                    radius={radius}
                  />
                </div>
              )}

              {loadingAlerts ? (
                <div className="mt-5 rounded-2xl border border-(--border) bg-(--surface) p-8 text-center">
                  <RefreshCw
                    size={22}
                    className="mx-auto animate-spin text-(--accent)"
                  />
                  <p className="mt-3 text-sm text-(--muted-foreground)">
                    Loading earthquake events...
                  </p>
                </div>
              ) : !userPosition ? (
                <div className="mt-5 rounded-2xl border border-dashed border-(--border) bg-(--surface) p-8 text-center sm:p-12">
                  <MapPin
                    size={30}
                    className="mx-auto text-(--muted-foreground)"
                  />
                  <h3 className="mt-3 font-semibold text-(--foreground)">
                    Location needed
                  </h3>
                  <p className="mx-auto mt-1 max-w-md text-sm text-(--muted-foreground)">
                    Allow location access to calculate distances and find
                    earthquake events near you.
                  </p>
                </div>
              ) : nearbyEvents.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-(--border) bg-(--surface) p-8 text-center sm:p-12">
                  <ShieldAlert
                    size={30}
                    className="mx-auto text-(--muted-foreground)"
                  />

                  <h3 className="mt-3 font-semibold text-(--foreground)">
                    No nearby events found
                  </h3>
                  <p className="mx-auto mt-1 max-w-md text-sm text-(--muted-foreground)">
                    No earthquake events with valid coordinates were found
                    within {radius} km in the available alert feed. Try
                    refreshing the events later. Weather information remains
                    available for your location.
                  </p>
                </div>
              ) : (
                <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
                  {nearbyEvents.map((event) => (
                    <article
                      key={event.id}
                      className="rounded-2xl border border-(--border) bg-(--surface) p-4 transition hover:border-(--accent)/40 sm:p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-(--foreground)">
                            {event.type || "Earthquake"}
                          </h3>
                          <p className="mt-1 break-words text-sm text-(--muted-foreground)">
                            {event.location || "Location unavailable"}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${getSeverityClass(event.severity)}`}
                        >
                          {event.severity || "Unknown"}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-(--border) pt-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-(--accent)">
                          <MapPin size={16} />
                          {formatDistance(event.distance)}
                        </div>

                        {event.magnitude !== null &&
                          event.magnitude !== undefined &&
                          event.magnitude !== "" && (
                            <span className="text-sm text-(--muted-foreground)">
                              Magnitude: {event.magnitude}
                            </span>
                          )}
                      </div>

                      <Link
                        href={`/alerts/${event.id}`}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-(--accent) transition hover:text-(--accent-hover)"
                      >
                        View event details
                        <ArrowUpRight size={15} />
                      </Link>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}

          <p className="mt-6 text-xs leading-relaxed text-(--muted-foreground)">
            Distances are straight-line estimates to reported earthquake
            coordinates, not travel distances or a prediction of damage. Only
            events available in the current alerts feed are considered.
          </p>
        </div>
      </main>
    </AppShell>
  );
}
