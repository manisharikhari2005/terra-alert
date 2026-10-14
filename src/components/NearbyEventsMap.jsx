
"use client";

import dynamic from "next/dynamic";

const NearbyLeafletMap = dynamic(
  () => import("@/components/NearbyLeafletMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[320px] items-center justify-center rounded-2xl border border-(--border) bg-(--surface) text-sm text-(--muted-foreground)">
        Loading nearby map...
      </div>
    ),
  }
);

export default function NearbyEventsMap({
  userPosition,
  events = [],
  radius = 100,
}) {
  if (!userPosition) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-(--border) bg-(--surface)">
      <div className="border-b border-(--border) px-4 py-3">
        <h3 className="text-sm font-semibold text-(--foreground)">
          Nearby Events Map
        </h3>

        <p className="mt-1 text-xs text-(--muted-foreground)">
          Showing events within {radius} km
        </p>
      </div>

      <NearbyLeafletMap
        userPosition={userPosition}
        events={events}
        radius={radius}
      />

      <div className="flex flex-wrap gap-4 border-t border-(--border) px-4 py-3 text-xs text-(--muted-foreground)">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          Your Location
        </span>

        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-(--alert-red)" />
          High
        </span>

        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-(--alert-orange)" />
          Medium
        </span>

        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-(--success)" />
          Low
        </span>
      </div>
    </section>
  );
}

