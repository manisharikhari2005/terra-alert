"use client";

import { useEffect, useState } from "react";
import AlertCard from "./AlertCard";
import { apiUrl } from "@/lib/api";

const SETTINGS_KEY = "disaster-watch-settings";

export default function AlertList({
  type,
  severity,
  search,
  clearFilters,
  limit,
}) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLowSeverity, setShowLowSeverity] = useState(true);
  const [settingsReady, setSettingsReady] = useState(false);

  // Read saved preference and keep it synced across same-tab updates.
  useEffect(() => {
    function readSettings() {
      try {
        const stored = localStorage.getItem(SETTINGS_KEY);
        const parsed = stored ? JSON.parse(stored) : {};

        setShowLowSeverity(
          typeof parsed.showLowSeverity === "boolean"
            ? parsed.showLowSeverity
            : true,
        );
      } catch (err) {
        console.error("Could not read alert preferences:", err);
        setShowLowSeverity(true);
      } finally {
        setSettingsReady(true);
      }
    }

    readSettings();

    // The storage event handles updates from other tabs.
    window.addEventListener("storage", readSettings);

    // Custom event handles updates made in the current tab.
    window.addEventListener("disaster-watch-settings-changed", readSettings);

    return () => {
      window.removeEventListener("storage", readSettings);
      window.removeEventListener(
        "disaster-watch-settings-changed",
        readSettings,
      );
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAlerts() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (type && type !== "All Types") {
          params.set("type", type);
        }

        if (severity && severity !== "All Severities") {
          params.set("severity", severity);
        }

        if (search?.trim()) {
          params.set("location", search.trim());
        }

        const query = params.toString();

        const response = await fetch(
          apiUrl(`alerts${query ? `?${query}` : ""}`),
          {
            signal: controller.signal,
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch alerts.");
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Invalid alerts response.");
        }

        setAlerts(result.data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch alerts:", err);
          setError("Unable to load alerts. Please try again.");
          setAlerts([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchAlerts();

    return () => controller.abort();
  }, [type, severity, search]);

  // Apply the saved preference without changing the backend data or counts.
  const preferenceFilteredAlerts = showLowSeverity
    ? alerts
    : alerts.filter((alert) => String(alert.severity).toLowerCase() !== "low");

  const filteredAlerts = limit
    ? preferenceFilteredAlerts.slice(0, limit)
    : preferenceFilteredAlerts;

  if (!settingsReady || loading) {
    return (
      <div className="rounded-xl border border-(--border) bg-(--surface) p-6 text-center">
        <p className="text-sm text-(--muted-foreground)">Loading alerts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-(--border) bg-(--surface) p-6 text-center">
        <p className="text-sm text-(--alert-red)">{error}</p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-3 rounded-lg bg-(--accent) px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (filteredAlerts.length === 0) {
    return (
      <div className="rounded-xl border border-(--border) bg-(--surface) px-4 py-8 text-center sm:py-10">
        <h3 className="text-sm font-semibold text-(--foreground)">
          No alerts found
        </h3>

        <p className="mt-1.5 text-xs text-(--muted-foreground) sm:text-sm">
          {!showLowSeverity && (severity === "All Severities" || !severity)
            ? "No alerts match your filters, or only low-severity events are available and currently hidden."
            : "No alerts match your search or selected filters."}
        </p>

        {clearFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="mt-3 rounded-lg bg-(--accent) px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-xs text-(--muted-foreground) sm:text-sm">
        Showing {filteredAlerts.length}
        {limit && preferenceFilteredAlerts.length > limit
          ? ` of ${preferenceFilteredAlerts.length}`
          : ""}{" "}
        {filteredAlerts.length === 1 ? "alert" : "alerts"}
      </p>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4">
        {filteredAlerts.map((alert, index) => (
          <div
            key={alert.id}
            className={limit && index >= 2 ? "hidden sm:block" : ""}
          >
            <AlertCard
              id={alert.id}
              type={alert.type}
              location={alert.location}
              details={alert.details}
              severity={alert.severity}
              time={alert.occurred_at}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
