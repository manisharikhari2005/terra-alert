"use client";

import { useState } from "react";

import AlertList from "@/components/AlertList";
import FilterBar from "@/components/FilterBar";
import AppShell from "@/components/AppShell";

export default function AlertsPage() {
  const [type, setType] = useState("All Types");
  const [severity, setSeverity] = useState("All Severities");
  const [search, setSearch] = useState("");

  const clearFilters = () => {
    setSearch("");
    setType("All Types");
    setSeverity("All Severities");
  };

  return (
    <AppShell>
      <main className="min-h-screen p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-semibold text-(--foreground)">Alerts</h1>

        <p className="mt-2 text-sm text-(--muted-foreground)">
          Monitor and review active disaster alerts.
        </p>

        <div className="mt-6 rounded-2xl border border-(--border) bg-(--surface) p-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-(--foreground)">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search alerts..."
              className="w-full max-w-md rounded-lg border border-(--border) bg-(--surface) px-4 py-2 text-sm text-(--foreground) placeholder:text-(--muted-foreground) outline-none transition focus:border-(--accent)"
            />
          </div>

          <div className="mt-6">
            <FilterBar
              type={type}
              setType={setType}
              severity={severity}
              setSeverity={setSeverity}
              clearFilters={clearFilters}
            />
          </div>
        </div>

        <div className="mt-8 border-t border-(--border) pt-6">
          <AlertList
            type={type}
            severity={severity}
            search={search}
            clearFilters={clearFilters}
          />
        </div>
      </main>
    </AppShell>
  );
}
