"use client";

import { useEffect, useState } from "react";
import { ExternalLink, MapPin } from "lucide-react";
import dynamic from "next/dynamic";

const DisasterLeafletMap = dynamic(() => import("./DisasterLeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex md:h-56 sm:h-30 items-center justify-center text-sm text-(--muted-foreground)">
      Loading map...
    </div>
  ),
});

export default function GlobalEventMap() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const response = await fetch("http://localhost:5000/api/alerts", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch alerts");
        }

        const result = await response.json();

        const validAlerts = (
          Array.isArray(result.data) ? result.data : []
        ).filter(
          (item) =>
            item.latitude != null &&
            item.longitude != null &&
            Number.isFinite(Number(item.latitude)) &&
            Number.isFinite(Number(item.longitude)),
        );

        setAlerts(validAlerts);
      } catch (error) {
        console.error("Failed to load map alerts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAlerts();
  }, []);

  const mapAlerts = alerts.slice(0, 50);
  const hasAlerts = mapAlerts.length > 0;

  return (
    <section className="overflow-hidden rounded-xl border border-(--border) bg-(--surface)">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-(--border) p-4">
        <div>
          <h2 className="text-base font-semibold text-(--foreground)">
            Global Event Map
          </h2>

          <p className="mt-1 text-xs text-(--muted-foreground)">
            {loading
              ? "Loading disaster events..."
              : `${mapAlerts.length} events with coordinates`}
          </p>
        </div>

        <MapPin size={18} className="shrink-0 text-(--accent)" />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-(--muted-foreground)">Loading map...</p>
        </div>
      ) : hasAlerts ? (
        <>
          {/* Map */}
          <div className="relative">
            <DisasterLeafletMap alerts={mapAlerts} />

            <div className="absolute left-38 md:left-70 top-3 z-[1000] rounded-lg border border-(--border) bg-(--surface)/95 px-3 py-2 text-xs text-(--foreground) shadow-sm">
              <span className="font-semibold">{mapAlerts.length}</span> mapped
              events
            </div>
          </div>

          {/* Severity Legend - below map */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-(--border) bg-(--surface) px-4 py-3 text-xs text-(--foreground)">
            <span className="font-medium text-(--muted-foreground)">
              Severity:
            </span>

            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              High
            </span>

            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              Medium
            </span>

            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              Low
            </span>
          </div>

          {/* Recent mapped events */}
          <div className="border-t border-(--border) p-4">
            <p className="mb-3 text-sm font-medium text-(--foreground)">
              Recent mapped events
            </p>

            <div className="space-y-3">
              {mapAlerts.slice(0, 2).map((item, index) => (
                <div
                  key={item.id}
                  className={`${
                    index >= 1 ? "hidden sm:flex" : "flex"
                  } min-w-0 items-start gap-3`}
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      item.severity === "High"
                        ? "bg-(--alert-red)"
                        : item.severity === "Medium"
                          ? "bg-(--alert-orange)"
                          : "bg-(--success)"
                    }`}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-(--foreground)">
                      {item.type || "Disaster Event"}
                    </p>

                    <p className="mt-1 truncate text-xs text-(--muted-foreground)">
                      {item.location || "Location unavailable"}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs text-(--muted-foreground)">
                    {item.severity || "Unknown"}
                  </span>
                </div>
              ))}
            </div>
 
            <a
              href="/alerts"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-(--accent) hover:opacity-75"
            >
              View all alerts
              <ExternalLink size={14} />
            </a>
          </div>
        </>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center gap-2 p-5 text-center">
          <MapPin size={24} className="text-(--muted-foreground)" />

          <p className="text-sm text-(--muted-foreground)">
            No event coordinates available.
          </p>
        </div>
      )}
    </section>
  );
}
