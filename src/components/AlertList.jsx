import AlertCard from "./AlertCard";
import { alerts } from "@/data/alerts";

export default function AlertList({ type, severity, search, clearFilters }) {
  const filteredAlerts = alerts.filter((alert) => {
    const typeMatch = !type || type === "All Types" || alert.type === type;

    const severityMatch =
      !severity || severity === "All Severities" || alert.severity === severity;

    const searchMatch =
      !search ||
      alert.type.toLowerCase().includes(search.toLowerCase()) ||
      alert.location.toLowerCase().includes(search.toLowerCase()) ||
      alert.details.toLowerCase().includes(search.toLowerCase());

    return typeMatch && severityMatch && searchMatch;
  });

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
            time={alert.time}
          />
        ))}
      </div>
    </div>
  );
}
