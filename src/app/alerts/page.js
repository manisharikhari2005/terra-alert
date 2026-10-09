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
      <main className="mx-auto min-h-screen w-full max-w-[1600px] p-3 sm:p-5 lg:p-7">
        {/* Page Header */}
        <div className="mb-5 sm:mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-(--foreground) sm:text-2xl">
            Alerts
          </h1>

          <p className="mt-1 text-xs text-(--muted-foreground) sm:mt-2 sm:text-sm">
            Monitor and review active disaster alerts.
          </p>
        </div>

        {/* Search and Filters */}
        <section className="rounded-xl border border-(--border) bg-(--surface) p-3 transition-colors duration-200 hover:border-(--accent)/40 sm:rounded-2xl sm:p-5">
          <div>
            <label
              htmlFor="alert-search"
              className="mb-1.5 block text-xs font-medium text-(--foreground) sm:mb-2 sm:text-sm"
            >
              Search alerts
            </label>

            <input
              id="alert-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by location..."
              className="w-full rounded-lg border border-(--border) bg-(--surface) px-3 py-2 text-sm text-(--foreground) placeholder:text-(--muted-foreground) outline-none transition focus:border-(--accent) sm:max-w-md sm:px-4"
            />
          </div>

          <div className="mt-4 border-t border-(--border) pt-3 sm:mt-5 sm:pt-4">
            <FilterBar
              type={type}
              setType={setType}
              severity={severity}
              setSeverity={setSeverity}
              clearFilters={clearFilters}
            />
          </div>
        </section>

        {/* Alert Results */}
        <section className="mt-5 border-t border-(--border) pt-4 sm:mt-7 sm:pt-5">
          <div className="mb-3">
            <h2 className="text-base font-semibold text-(--foreground)">
              All Alerts
            </h2>

            <p className="mt-1 text-xs text-(--muted-foreground) sm:text-sm">
              Browse reported disaster events and filter by severity or type.
            </p>
          </div>

          <AlertList
            type={type}
            severity={severity}
            search={search}
            clearFilters={clearFilters}
          />
        </section>
      </main>
    </AppShell>
  );
}
