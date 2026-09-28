"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function LocationsPage() {
  const [locations, setLocations] = useState([
    {
      id: 1,
      city: "Delhi",
      country: "India",
      alerts: 2,
    },
    {
      id: 2,
      city: "Tokyo",
      country: "Japan",
      alerts: 1,
    },
  ]);

  const removeLocation = (id) => {
    setLocations((currentLocations) =>
      currentLocations.filter((location) => location.id !== id),
    );
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-(--foreground)">
            Saved Locations
          </h1>

          <p className="mt-2 text-sm text-(--muted-foreground)">
            Track disaster activity in locations you care about.
          </p>
        </div>

        {/* Add Location */}
        <div className="mt-6">
          <button className="rounded-lg bg-(--accent) px-4 py-2 text-sm font-medium text-white transition hover:bg-(--accent-hover)">
            + Add Location
          </button>
        </div>

        {/* Locations */}
        <div className="mt-8">
          {locations.length === 0 ? (
            <div className="rounded-2xl border border-(--border) bg-(--surface) p-10 text-center">
              <h2 className="text-base font-medium text-(--foreground)">
                No saved locations
              </h2>

              <p className="mt-2 text-sm text-(--muted-foreground)">
                Add a location to start monitoring it.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {locations.map((location) => (
                <div
                  key={location.id}
                  className="rounded-2xl border border-(--border) bg-(--surface) p-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-(--foreground)">
                        {location.city}
                      </h2>

                      <p className="mt-1 text-sm text-(--muted-foreground)">
                        {location.country}
                      </p>
                    </div>

                    <span className="h-2.5 w-2.5 rounded-full bg-(--success)" />
                  </div>

                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-wide text-(--muted-foreground)">
                      Active Alerts
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-(--foreground)">
                      {location.alerts}
                    </p>
                  </div>

                  <button
                    onClick={() => removeLocation(location.id)}
                    className="mt-6 text-sm text-(--muted-foreground) transition hover:text-(--alert-red)"
                  >
                    Remove location
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
