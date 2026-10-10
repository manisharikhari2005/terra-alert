
"use client";

import { useEffect, useState } from "react";

import AlertList from "@/components/AlertList";
import FilterBar from "@/components/FilterBar";
import AppShell from "@/components/AppShell";

export default function AlertsPage() {
  const [type, setType] = useState("All Types");
  const [severity, setSeverity] = useState("All Severities");
  const [search, setSearch] = useState("");

  const [severityCounts, setSeverityCounts] = useState({
    High: 0,
    Medium: 0,
    Low: 0,
  });

  useEffect(() => {
    const fetchSeverityCounts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/alerts");

        if (!response.ok) {
          throw new Error("Failed to fetch alerts");
        }

        const result = await response.json();

        const alerts = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.alerts)
              ? result.alerts
              : [];

        const counts = {
          High: 0,
          Medium: 0,
          Low: 0,
        };

        alerts.forEach((alert) => {
          const level = alert.severity?.trim();

          if (level && Object.hasOwn(counts, level)) {
            counts[level]++;
          }
        });

        setSeverityCounts(counts);
      } catch (error) {
        console.error("Failed to fetch severity counts:", error);
      }
    };

    fetchSeverityCounts();
  }, []);

  const clearFilters = () => {
    setSearch("");
    setType("All Types");
    setSeverity("All Severities");
  };

  return (
    <AppShell>
      <main className="mx-auto min-h-screen w-full max-w-[1600px] p-3 sm:p-5 lg:p-7">
        {/* Page Header */}
        <div className="mb-4 sm:mb-5">
          <h1 className="text-xl font-semibold tracking-tight text-(--foreground) sm:text-2xl">
            Alerts
          </h1>

          <p className="mt-1 text-xs text-(--muted-foreground) sm:text-sm">
            Monitor and review active disaster alerts.
          </p>
        </div>

        {/* Compact Search, Filters and Severity Summary */}
        <section className="rounded-xl border border-(--border) bg-(--surface) p-3 transition-colors duration-200 hover:border-(--accent)/40 sm:p-3.5">
          <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-[minmax(0,1fr)_170px] lg:gap-3">
            {/* Search and Filters */}
            <div className="min-w-0">
              <label
                htmlFor="alert-search"
                className="mb-1 block text-xs font-medium text-(--foreground)"
              >
                Search alerts
              </label>

              <input
                id="alert-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by location..."
                className="w-full rounded-lg border border-(--border) bg-(--surface) px-3 py-1.5 text-xs text-(--foreground) placeholder:text-(--muted-foreground) outline-none transition focus:border-(--accent) sm:max-w-sm"
              /> 

              <div className="mt-3 border-t border-(--border) pt-3">
                <FilterBar
                  type={type}
                  setType={setType}
                  severity={severity}
                  setSeverity={setSeverity}
                  clearFilters={clearFilters}
                />
              </div>
            </div>

            {/* Severity Summary */}
            <aside className="border-t border-(--border) pt-2 lg:border-l lg:border-t-0 lg:pl-3 lg:pt-0">
              <h2 className="mb-2 text-xs font-semibold text-(--foreground)">
                Severity Summary
              </h2>

              <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
                {/* High */}
                <div className="rounded-lg border border-(--alert-red)/20 bg-(--alert-red)/5 px-2 py-1.5 ">
                  <p className="text-[10px] font-medium text-(--alert-red)">
                    High
                  </p>

                  <p className="mt-0.5 text-lg font-semibold leading-tight text-(--foreground)">
                    {severityCounts.High}
                  </p>
                </div>

                {/* Medium */}
                <div className="rounded-lg border border-(--alert-orange)/30 bg-(--alert-orange)/5 px-2 py-1.5">
                  <p className="text-[10px] font-medium text-(--alert-orange)">
                    Medium
                  </p>

                  <p className="mt-0.5 text-lg font-semibold leading-tight text-(--foreground)">
                    {severityCounts.Medium}
                  </p>
                </div>

                {/* Low */}
                <div className="rounded-lg border border-(--success)/30 bg-(--success)/5 px-2 py-1.5">
                  <p className="text-[10px] font-medium text-(--success)">
                    Low
                  </p>

                  <p className="mt-0.5 text-lg font-semibold leading-tight text-(--foreground)">
                    {severityCounts.Low}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* Alert Results */}
        <section className="mt-5 border-t border-(--border) pt-4 sm:mt-6 sm:pt-5">
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
