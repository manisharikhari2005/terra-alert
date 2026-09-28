"use client";

import AppShell from "@/components/AppShell";
import { useState } from "react";

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

  const [showForm, setShowForm] = useState(false);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const addLocation = (event) => {
    event.preventDefault();

    if (!city.trim() || !country.trim()) {
      return;
    }

    const newLocation = {
      id: Date.now(),
      city: city.trim(),
      country: country.trim(),
      alerts: 0,
    };

    setLocations((currentLocations) => [...currentLocations, newLocation]);

    setCity("");
    setCountry("");
    setShowForm(false);
  };

  const removeLocation = (id) => {
    setLocations((currentLocations) =>
      currentLocations.filter((location) => location.id !== id),
    );
  };

  return (
    <AppShell>
      <main className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div>
          <h1 className="text-2xl font-semibold text-(--foreground)">
            Saved Locations
          </h1>

          <p className="mt-2 text-sm text-(--muted-foreground)">
            Track disaster activity in locations you care about.
          </p>
        </div>

        {/* Add Location Button */}
        <div className="mt-6">
          <button
            onClick={() => setShowForm((current) => !current)}
            className="rounded-lg bg-(--accent) px-4 py-2 text-sm font-medium text-white transition hover:bg-(--accent-hover)"
          >
            {showForm ? "Cancel" : "+ Add Location"}
          </button>
        </div>

        {/* Add Location Form */}
        {showForm && (
          <form
            onSubmit={addLocation}
            className="mt-5 rounded-2xl border border-(--border) bg-(--surface) p-5"
          >
            <h2 className="text-base font-medium text-(--foreground)">
              Add a location
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm text-(--muted-foreground)">
                  City
                </label>

                <input
                  type="text"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder="e.g. Mumbai"
                  className="mt-2 w-full rounded-lg border border-(--border) bg-(--surface-elevated) px-3 py-2 text-sm text-(--foreground) outline-none focus:border-(--accent)"
                />
              </div>

              <div>
                <label className="text-sm text-(--muted-foreground)">
                  Country
                </label>

                <input
                  type="text"
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  placeholder="e.g. India"
                  className="mt-2 w-full rounded-lg border border-(--border) bg-(--surface-elevated) px-3 py-2 text-sm text-(--foreground) outline-none focus:border-(--accent)"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-5 rounded-lg bg-(--accent) px-4 py-2 text-sm font-medium text-white transition hover:bg-(--accent-hover)"
            >
              Save Location
            </button>
          </form>
        )}

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
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {locations.map((location) => (
                <div
                  key={location.id}
                  className="rounded-2xl border border-(--border) bg-(--surface) p-4 sm:p-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-base font-semibold text-(--foreground) sm:text-lg">
                        {location.city}
                      </h2>

                      <p className="mt-1 text-sm text-(--muted-foreground)">
                        {location.country}
                      </p>
                    </div>

                    <span className="h-2.5 w-2.5 rounded-full bg-(--success)" />
                  </div>

                  <div className="mt-4 sm:mt-6">
                    <p className="text-xs uppercase tracking-wide text-(--muted-foreground)">
                      Active Alerts
                    </p>

                    <p className="mt-2 text-xl font-semibold text-(--foreground) sm:text-2xl">
                      {location.alerts}
                    </p>
                  </div>

                  <button
                    onClick={() => removeLocation(location.id)}
                    className="mt-3 sm:mt-4 text-sm text-(--muted-foreground) transition hover:text-(--alert-red)"
                  >
                    Remove location
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </AppShell>
  );
}
