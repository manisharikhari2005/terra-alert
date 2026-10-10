"use client";

import { useEffect, useState } from "react";
import { Activity, BellRing, Globe2, TrendingUp } from "lucide-react";

const API_URL = "http://localhost:5000/api/alerts";
const COUNTRIES_API_URL = "http://localhost:5000/api/alerts/countries/count";

export default function StatsCards() {
  const [alerts, setAlerts] = useState([]);
  const [countryCount, setCountryCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countriesLoading, setCountriesLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error("Failed to fetch alerts");
        }

        setAlerts(result.data);
      } catch (error) {
        console.error("Stats fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCountryCount = async () => {
      try {
        const response = await fetch(COUNTRIES_API_URL);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error("Failed to fetch country count");
        }

        setCountryCount(result.data.count);
      } catch (error) {
        console.error("Country count fetch error:", error);
      } finally {
        setCountriesLoading(false);
      }
    };

    fetchAlerts();
    fetchCountryCount();
  }, []);

  const now = Date.now();
  const last24Hours = now - 24 * 60 * 60 * 1000;
  const lastHour = now - 60 * 60 * 1000;

  const activeEvents = alerts.filter((alert) => {
    const occurredAt = new Date(alert.occurred_at).getTime();

    return occurredAt >= lastHour && occurredAt <= now;
  }).length;

  const alertsToday = alerts.filter((alert) => {
    const occurredAt = new Date(alert.occurred_at).getTime();

    return occurredAt >= last24Hours && occurredAt <= now;
  }).length;

  const stats = [
    {
      label: "Recent Events",
      value: loading ? "..." : activeEvents,
      description: "Events in the last hour",
      icon: Activity,
    },
    {
      label: "Alerts Today",
      value: loading ? "..." : alertsToday,
      description: "Reported in the last 24 hours",
      icon: BellRing,
    },
    {
      label: "Countries Affected",
      value: countriesLoading ? "..." : (countryCount ?? "—"),
      description: "Countries with recorded alerts",
      icon: Globe2,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-3 sm:gap-3 xl:gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="group flex min-w-0 flex-col rounded-xl border border-(--border) bg-(--surface) p-3 transition-all duration-200 hover:border-(--accent)/40 hover:shadow-md hover:shadow-black/5 sm:p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-(--muted-foreground) sm:text-sm">
                {stat.label}
              </p>

              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-(--surface-elevated) text-(--muted-foreground) transition-colors group-hover:text-(--accent) sm:h-8 sm:w-8">
                <Icon size={15} strokeWidth={1.8} />
              </div>
            </div>

            <div className="mt-2 sm:mt-4">
              <h2 className="text-xl font-semibold tracking-tight text-(--foreground) sm:text-2xl">
                {stat.value}
              </h2>

              <div className="mt-2 flex items-start gap-1.5">
                <TrendingUp
                  size={13}
                  className="mt-0.5 shrink-0 text-(--success)"
                />

                <p className="text-xs leading-5 text-(--muted-foreground)">
                  {stat.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
