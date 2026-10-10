"use client";

import { useEffect, useState } from "react";
import AlertCard from "./AlertCard";

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

  useEffect(() => {
    const controller = new AbortController();

    const fetchAlerts = async () => {
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
          `http://localhost:5000/api/alerts${query ? `?${query}` : ""}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch alerts.");
        }

        const result = await response.json();

        const alertData = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.alerts)
              ? result.alerts
              : [];

        setAlerts(alertData);
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
    };

    fetchAlerts();

    return () => controller.abort();
  }, [type, severity, search]);

  const filteredAlerts = limit ? alerts.slice(0, limit) : alerts;

  if (loading) {
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
          No alerts match your search or selected filters.
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
      {/* Results Count */}
      <p className="mb-3 text-xs text-(--muted-foreground) sm:text-sm">
        Showing {filteredAlerts.length}
        {limit && alerts.length > limit ? ` of ${alerts.length}` : ""}{" "}
        {filteredAlerts.length === 1 ? "alert" : "alerts"}
      </p>

      {/* Alert Cards */}
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
