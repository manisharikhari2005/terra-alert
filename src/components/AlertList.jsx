"use client";

import { useEffect, useState } from "react";
import AlertCard from "./AlertCard";

export default function AlertList({ type, severity, search, clearFilters }) {
  const [alerts, setAlerts] = useState([]);

 useEffect(() => {
   const fetchAlerts = async () => {
     try {
       const params = new URLSearchParams();

       if (type && type !== "All Types") {
         params.set("type", type);
       }

       if (severity && severity !== "All Severities") {
         params.set("severity", severity);
       }
       if (search) {
         params.set("location", search);
       }

       const query = params.toString();

       const response = await fetch(
         `http://localhost:5000/api/alerts${query ? `?${query}` : ""}`,
       );

       if (!response.ok) {
         throw new Error("Failed to fetch alerts");
       }

       const result = await response.json();

       setAlerts(result.data);
     } catch (error) {
       console.error("Failed to fetch alerts:", error);
     }
   };

   fetchAlerts();
 }, [type, severity, search]);

const filteredAlerts = alerts;

  if (filteredAlerts.length === 0) {
    return (
      <div className="rounded-2xl border border-(--border) bg-(--surface) p-8 text-center">
        <h3 className="text-base font-medium text-(--foreground)">
          No alerts found
        </h3>

        <p className="mt-2 text-sm text-(--muted-foreground)">
          Try changing the filters to see more alerts.
        </p>

        <button
          onClick={clearFilters}
          className="mt-4 rounded-lg bg-(--accent) px-4 py-2 text-sm font-medium text-white transition hover:bg-(--accent-hover)"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm text-(--muted-foreground)">
        {filteredAlerts.length}{" "}
        {filteredAlerts.length === 1 ? "alert" : "alerts"} found
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filteredAlerts.map((alert) => (
          <AlertCard
            id={alert.id}
            key={alert.id}
            type={alert.type}
            location={alert.location}
            details={alert.details}
            severity={alert.severity}
            time={alert.occurred_at}
          />
        ))}
      </div>
    </div>
  );
}
