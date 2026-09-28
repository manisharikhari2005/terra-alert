"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import MapLegend from "@/components/MapLegend";
import { mapEvents } from "@/data/mapEvents";
import AppShell from "@/components/AppShell";

const DisasterMap = dynamic(() => import("@/components/DisasterMap"), {
  ssr: false,
});

export default function MapPage() {
  const [filter, setFilter] = useState("All Events");

  const filteredEvents = mapEvents.filter((event) => {
    if (filter === "All Events") {
      return true;
    }

    return `${event.type}s` === filter;
  });

  const visibleEvents = filteredEvents.length;

  return (
    <AppShell>
      <main className="min-h-screen p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-semibold text-(--foreground)">Live Map</h1>

        <p className="mt-2 text-sm text-(--muted-foreground)">
          Monitor disaster activity and affected locations around the world.
        </p>

        <div className="mt-8 rounded-2xl border border-(--border) bg-(--surface) p-5">
          {/* Map Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-(--foreground)">
                Global Disaster Map
              </p>

              <p className="mt-1 text-xs text-(--muted-foreground)">
                Monitor active disaster events across the world.
              </p>

              <div className="mt-4 flex items-center gap-2">
                <span className="text-lg font-semibold text-(--foreground)">
                  {visibleEvents}
                </span>

                <span className="text-xs text-(--muted-foreground)">
                  {visibleEvents === 1 ? "visible event" : "visible events"}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-lg border border-(--border) bg-(--surface-elevated) px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-(--success)" />

              <span className="text-xs font-medium text-(--success)">
                Monitoring
              </span>
            </div>
          </div>

          {/* Map Filters */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilter("All Events")}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                filter === "All Events"
                  ? "bg-(--surface-elevated) text-(--foreground)"
                  : "text-(--muted-foreground) hover:bg-(--surface-elevated) hover:text-(--foreground)"
              }`}
            >
              All Events
            </button>

            <button
              onClick={() => setFilter("Earthquakes")}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                filter === "Earthquakes"
                  ? "bg-(--surface-elevated) text-(--foreground)"
                  : "text-(--muted-foreground) hover:bg-(--surface-elevated) hover:text-(--foreground)"
              }`}
            >
              Earthquakes
            </button>

            <button
              onClick={() => setFilter("Floods")}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                filter === "Floods"
                  ? "bg-(--surface-elevated) text-(--foreground)"
                  : "text-(--muted-foreground) hover:bg-(--surface-elevated) hover:text-(--foreground)"
              }`}
            >
              Floods
            </button>

            <button
              onClick={() => setFilter("Wildfires")}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                filter === "Wildfires"
                  ? "bg-(--surface-elevated) text-(--foreground)"
                  : "text-(--muted-foreground) hover:bg-(--surface-elevated) hover:text-(--foreground)"
              }`}
            >
              Wildfires
            </button>
          </div>

          {/* Map */}
          <div className="relative mt-5 h-[400px] overflow-hidden rounded-xl border border-(--border) sm:h-[500px]">
            <DisasterMap filter={filter} />
            <MapLegend /> 
          </div>
        </div>
      </main>
    </AppShell>
  );
}
