"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  MapPinned,
  Plus,
  Trash2,
  X,
  Search,
  CheckCircle2,
  Globe2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import AppShell from "@/components/AppShell";

const STORAGE_KEY = "disaster-watch-saved-locations";
const API_URL = "http://localhost:5000/api/alerts";

function formatDate(value) {
  if (!value) return "Time unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Time unavailable";

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function severityClass(severity) {
  switch (severity?.toLowerCase()) {
    case "critical":
    case "high":
      return "border-red-500/30 bg-red-500/10 text-red-500";
    case "medium":
      return "border-orange-500/30 bg-orange-500/10 text-orange-500";
    default:
      return "border-(--border) bg-(--surface-elevated) text-(--muted-foreground)";
  }
}

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [alertsByLocation, setAlertsByLocation] = useState({});
  const [loadingAlerts, setLoadingAlerts] = useState({});
  const [alertErrors, setAlertErrors] = useState({});
  const [expandedLocation, setExpandedLocation] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  // Load saved locations.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored !== null) {
        const parsed = JSON.parse(stored);

        if (
          Array.isArray(parsed) &&
          parsed.every(
            (item) =>
              item &&
              (typeof item.id === "string" || typeof item.id === "number") &&
              typeof item.city === "string" &&
              typeof item.country === "string",
          )
        ) {
          setLocations(parsed);
        }
      }
    } catch (error) {
      console.error("Could not load saved locations:", error);
    } finally {
      setReady(true);
    }
  }, []);

  // Save locations after the initial load.
  useEffect(() => {
    if (!ready) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
    } catch (error) {
      console.error("Could not save locations:", error);
    }
  }, [locations, ready]);

  // Fetch real alerts for every saved city.
  useEffect(() => {
    if (!ready) return;

    const controller = new AbortController();

    async function fetchLocationAlerts() {
      const loadingState = {};
      const errorState = {};

      locations.forEach((location) => {
        loadingState[location.id] = true;
      });

      setLoadingAlerts(loadingState);
      setAlertErrors({});

      await Promise.all(
        locations.map(async (location) => {
          try {
            const params = new URLSearchParams({
              location: location.city,
            });

            const response = await fetch(`${API_URL}?${params}`, {
              signal: controller.signal,
              cache: "no-store",
            });

            if (!response.ok) {
              throw new Error(`API request failed (${response.status})`);
            }

            const result = await response.json();

            if (result.success === false) {
              throw new Error(result.message || "Could not load alerts.");
            }

            const alerts = Array.isArray(result)
              ? result
              : result.data || result.alerts || [];

            if (!Array.isArray(alerts)) {
              throw new Error("Unexpected alerts response.");
            }

            setAlertsByLocation((current) => ({
              ...current,
              [location.id]: alerts,
            }));
          } catch (error) {
            if (error.name === "AbortError") return;

            console.error(
              `Could not fetch alerts for ${location.city}:`,
              error,
            );

            errorState[location.id] =
              "Could not load alerts. Check that the backend is running.";

            setAlertErrors((current) => ({
              ...current,
              [location.id]: errorState[location.id],
            }));
          } finally {
            if (!controller.signal.aborted) {
              setLoadingAlerts((current) => ({
                ...current,
                [location.id]: false,
              }));
            }
          }
        }),
      );
    }

    fetchLocationAlerts();

    return () => controller.abort();
  }, [locations, ready]);

  function addLocation(event) {
    event.preventDefault();

    const trimmedCity = city.trim();
    const trimmedCountry = country.trim();

    if (!trimmedCity || !trimmedCountry) {
      setError("Please enter both city and country.");
      return;
    }

    const alreadyExists = locations.some(
      (location) =>
        location.city.toLowerCase() === trimmedCity.toLowerCase() &&
        location.country.toLowerCase() === trimmedCountry.toLowerCase(),
    );

    if (alreadyExists) {
      setError("This location has already been saved.");
      return;
    }

    setLocations((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        city: trimmedCity,
        country: trimmedCountry,
      },
    ]);

    setCity("");
    setCountry("");
    setError("");
    setShowForm(false);
  }

  function removeLocation(id) {
    setLocations((current) => current.filter((location) => location.id !== id));

    setAlertsByLocation((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });

    setLoadingAlerts((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });

    setAlertErrors((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });

    if (expandedLocation === id) setExpandedLocation(null);
  }

  function retryAlerts(location) {
    setLoadingAlerts((current) => ({
      ...current,
      [location.id]: true,
    }));

    setAlertErrors((current) => {
      const next = { ...current };
      delete next[location.id];
      return next;
    });

    const params = new URLSearchParams({ location: location.city });

    fetch(`${API_URL}?${params}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Request failed");

        const result = await response.json();
        const alerts = Array.isArray(result)
          ? result
          : result.data || result.alerts || [];

        if (result.success === false || !Array.isArray(alerts)) {
          throw new Error("Invalid alerts response");
        }

        setAlertsByLocation((current) => ({
          ...current,
          [location.id]: alerts,
        }));
      })
      .catch(() => {
        setAlertErrors((current) => ({
          ...current,
          [location.id]: "Could not load alerts. Please try again.",
        }));
      })
      .finally(() => {
        setLoadingAlerts((current) => ({
          ...current,
          [location.id]: false,
        }));
      });
  }

  const filteredLocations = locations.filter((location) => {
    const query = search.trim().toLowerCase();

    return (
      location.city.toLowerCase().includes(query) ||
      location.country.toLowerCase().includes(query)
    );
  });

  const totalMatchingAlerts = locations.reduce((total, location) => {
    return total + (alertsByLocation[location.id]?.length || 0);
  }, 0);

  const countriesCovered = new Set(
    locations.map((location) => location.country.toLowerCase()),
  ).size;

  return (
    <AppShell>
      <main className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-(--border) pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-(--border) bg-(--surface-elevated) text-(--accent)">
                  <MapPinned size={19} />
                </div>

                <h1 className="text-2xl font-semibold tracking-tight text-(--foreground)">
                  Saved Locations
                </h1>
              </div>

              <p className="mt-2 text-sm text-(--muted-foreground)">
                Monitor real disaster alerts for your saved cities.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowForm((current) => !current);
                setError("");
              }}
              className="inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-(--accent) px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              {showForm ? <X size={16} /> : <Plus size={17} />}
              {showForm ? "Cancel" : "Add Location"}
            </button>
          </div>

          {/* Summary */}
          <div className="mt-5 grid grid-cols-1 gap-3 min-[400px]:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-(--border) bg-(--surface) p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-(--surface-elevated) text-(--accent)">
                <MapPin size={19} />
              </div>
              <div>
                <p className="text-xs text-(--muted-foreground)">
                  Saved locations
                </p>
                <p className="mt-1 text-xl font-semibold text-(--foreground)">
                  {locations.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-(--border) bg-(--surface) p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-(--surface-elevated) text-(--accent)">
                <Globe2 size={19} />
              </div>
              <div>
                <p className="text-xs text-(--muted-foreground)">
                  Countries covered
                </p>
                <p className="mt-1 text-xl font-semibold text-(--foreground)">
                  {countriesCovered}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-(--border) bg-(--surface) p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-(--surface-elevated) text-(--accent)">
                <AlertTriangle size={19} />
              </div>
              <div>
                <p className="text-xs text-(--muted-foreground)">
                  Matching alerts
                </p>
                <p className="mt-1 text-xl font-semibold text-(--foreground)">
                  {totalMatchingAlerts}
                </p>
              </div>
            </div>
          </div>

          {/* Add location form */}
          {showForm && (
            <form
              onSubmit={addLocation}
              className="mt-5 rounded-xl border border-(--border) bg-(--surface) p-4 sm:p-5"
            >
              <h2 className="text-sm font-semibold text-(--foreground)">
                Add a location
              </h2>
              <p className="mt-1 text-xs text-(--muted-foreground)">
                Save a city to check matching disaster alerts from the backend.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="location-city"
                    className="text-xs font-medium text-(--foreground)"
                  >
                    City
                  </label>
                  <input
                    id="location-city"
                    type="text"
                    value={city}
                    onChange={(event) => {
                      setCity(event.target.value);
                      setError("");
                    }}
                    placeholder="e.g. Mumbai"
                    maxLength={80}
                    required
                    className="mt-2 w-full rounded-lg border border-(--border) bg-(--surface-elevated) px-3 py-2.5 text-sm text-(--foreground) outline-none placeholder:text-(--muted-foreground) focus:border-(--accent)"
                  />
                </div>

                <div>
                  <label
                    htmlFor="location-country"
                    className="text-xs font-medium text-(--foreground)"
                  >
                    Country
                  </label>
                  <input
                    id="location-country"
                    type="text"
                    value={country}
                    onChange={(event) => {
                      setCountry(event.target.value);
                      setError("");
                    }}
                    placeholder="e.g. India"
                    maxLength={80}
                    required
                    className="mt-2 w-full rounded-lg border border-(--border) bg-(--surface-elevated) px-3 py-2.5 text-sm text-(--foreground) outline-none placeholder:text-(--muted-foreground) focus:border-(--accent)"
                  />
                </div>
              </div>

              {error && (
                <p role="alert" className="mt-3 text-xs text-(--alert-red)">
                  {error}
                </p>
              )}

              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setCity("");
                    setCountry("");
                    setError("");
                  }}
                  className="rounded-lg border border-(--border) px-4 py-2 text-xs font-medium text-(--muted-foreground) hover:bg-(--surface-elevated)"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-(--accent) px-4 py-2 text-xs font-medium text-white hover:opacity-90"
                >
                  <CheckCircle2 size={15} />
                  Save Location
                </button>
              </div>
            </form>
          )}

          {/* Search */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-(--foreground)">
                Your locations
              </h2>
              <p className="mt-1 text-xs text-(--muted-foreground)">
                {filteredLocations.length}{" "}
                {filteredLocations.length === 1 ? "location" : "locations"}{" "}
                displayed
              </p>
            </div>

            {locations.length > 0 && (
              <div className="relative w-full sm:max-w-xs">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--muted-foreground)"
                />
                <input
                  type="search"
                  aria-label="Search saved locations"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search city or country..."
                  className="w-full rounded-lg border border-(--border) bg-(--surface) py-2.5 pl-9 pr-3 text-xs text-(--foreground) outline-none placeholder:text-(--muted-foreground) focus:border-(--accent)"
                />
              </div>
            )}
          </div>

          {/* Location cards */}
          <div className="mt-4">
            {!ready ? (
              <div className="rounded-xl border border-(--border) bg-(--surface) p-8 text-center text-sm text-(--muted-foreground)">
                Loading saved locations...
              </div>
            ) : locations.length === 0 ? (
              <div className="rounded-xl border border-(--border) bg-(--surface) px-5 py-12 text-center">
                <MapPin
                  size={24}
                  className="mx-auto text-(--muted-foreground)"
                />
                <h3 className="mt-4 text-sm font-semibold text-(--foreground)">
                  No saved locations yet
                </h3>
                <p className="mt-2 text-xs text-(--muted-foreground)">
                  Add a city to start monitoring matching alerts.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-(--accent) px-4 py-2 text-xs font-medium text-white"
                >
                  <Plus size={15} />
                  Add your first location
                </button>
              </div>
            ) : filteredLocations.length === 0 ? (
              <div className="rounded-xl border border-(--border) bg-(--surface) p-8 text-center">
                <p className="text-sm font-medium text-(--foreground)">
                  No matching locations
                </p>
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-3 text-xs font-medium text-(--accent) hover:underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2">
                {filteredLocations.map((location) => {
                  const alerts = alertsByLocation[location.id] || [];
                  const isLoading = loadingAlerts[location.id];
                  const locationError = alertErrors[location.id];
                  const isExpanded = expandedLocation === location.id;

                  return (
                    <article
                      key={location.id}
                      className="min-w-0 rounded-xl border border-(--border) bg-(--surface) p-4 transition-colors hover:border-(--accent)/40 sm:p-5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-(--border) bg-(--surface-elevated) text-(--accent)">
                          <MapPin size={19} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-semibold text-(--foreground)">
                            {location.city}
                          </h3>
                          <p className="mt-1 text-xs text-(--muted-foreground)">
                            {location.country}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeLocation(location.id)}
                          aria-label={`Remove ${location.city}, ${location.country}`}
                          title="Remove location"
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-(--muted-foreground) transition hover:bg-(--alert-red)/10 hover:text-(--alert-red)"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3 border-t border-(--border) pt-3">
                        <div className="flex min-w-0 items-center gap-2">
                          {isLoading ? (
                            <RefreshCw
                              size={13}
                              className="shrink-0 animate-spin text-(--muted-foreground)"
                            />
                          ) : locationError ? (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-(--alert-red)" />
                          ) : (
                            <span
                              className={`h-2 w-2 shrink-0 rounded-full ${
                                alerts.length > 0
                                  ? "bg-(--alert-orange)"
                                  : "bg-(--success)"
                              }`}
                            />
                          )}

                          <span className="text-xs text-(--muted-foreground)">
                            {isLoading
                              ? "Checking alerts..."
                              : locationError
                                ? "Alerts unavailable"
                                : `${alerts.length} matching ${
                                    alerts.length === 1 ? "alert" : "alerts"
                                  }`}
                          </span>
                        </div>

                        {locationError ? (
                          <button
                            type="button"
                            onClick={() => retryAlerts(location)}
                            className="shrink-0 text-xs font-medium text-(--accent) hover:underline"
                          >
                            Retry
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() =>
                              setExpandedLocation(
                                isExpanded ? null : location.id,
                              )
                            }
                            className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-(--accent) disabled:opacity-50"
                          >
                            {isExpanded ? "Hide" : "View"}
                            {isExpanded ? (
                              <ChevronUp size={14} />
                            ) : (
                              <ChevronDown size={14} />
                            )}
                          </button>
                        )}
                      </div>

                      {isExpanded && !isLoading && !locationError && (
                        <div className="mt-3 border-t border-(--border) pt-3">
                          {alerts.length === 0 ? (
                            <p className="py-2 text-xs leading-relaxed text-(--muted-foreground)">
                              No matching alerts found for {location.city} in
                              the currently collected data.
                            </p>
                          ) : (
                            <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                              {alerts.map((alert) => (
                                <div
                                  key={alert.id}
                                  className="rounded-lg border border-(--border) bg-(--surface-elevated) p-3"
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="text-sm font-medium text-(--foreground)">
                                      {alert.type || "Disaster alert"}
                                    </p>

                                    <span
                                      className={`rounded-md border px-2 py-1 text-[10px] font-medium ${severityClass(alert.severity)}`}
                                    >
                                      {alert.severity || "Unknown"}
                                    </span>
                                  </div>

                                  <p className="mt-2 text-xs text-(--muted-foreground)">
                                    {alert.location || location.city}
                                  </p>

                                  <p className="mt-1 text-[11px] text-(--muted-foreground)">
                                    {formatDate(alert.occurred_at)}
                                  </p>

                                  {alert.details && (
                                    <p className="mt-2 break-words text-xs leading-relaxed text-(--foreground)">
                                      {alert.details}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-[11px] text-(--muted-foreground)">
            Disaster Watch · Live alerts from your backend data
          </p>
        </div>
      </main>
    </AppShell>
  );
}
