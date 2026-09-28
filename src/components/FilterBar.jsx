"use client";

export default function FilterBar({
  type,
  setType,
  severity,
  setSeverity,
  clearFilters,
}) {
  return (
    <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-end sm:gap-6">
      <div>
        <h2 className="pb-2 text-sm font-medium text-(--foreground)">
          Filters
        </h2>
      </div>

      <div>
        <label className="text-sm text-(--muted-foreground)">
          Disaster Type
        </label>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-2 w-full rounded-lg border border-(--border) bg-(--surface-elevated) px-3 py-2 text-sm text-(--foreground) outline-none focus:border-(--accent) sm:min-w-40"
        >
          <option>All Types</option>
          <option>Earthquake</option>
          <option>Flood</option>
          <option>Wildfire</option>
        </select>
      </div>

      <div>
        <label className="text-sm text-(--muted-foreground)">Severity</label>

        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          className="mt-2 w-full rounded-lg border border-(--border) bg-(--surface-elevated) px-3 py-2 text-sm text-(--foreground) outline-none focus:border-(--accent) sm:min-w-40"
        >
          <option>All Severities</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      <button
        onClick={clearFilters}
        className="rounded-lg border border-(--border) px-4 py-2 text-sm text-(--muted-foreground) transition hover:border-(--accent) hover:text-(--foreground)"
      >
        Clear Filters
      </button>
    </div>
  );
}
