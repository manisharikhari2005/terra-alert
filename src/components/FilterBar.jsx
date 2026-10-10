"use client";

export default function FilterBar({
  type,
  setType,
  severity,
  setSeverity,
  clearFilters,
}) {
  return (
    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:gap-6">
      {/* Filter Heading */}
      <div className="shrink-0">
        <h2 className="text-sm font-medium text-(--foreground)">Filters</h2>
        <p className="mt-1 text-xs text-(--muted-foreground)">
          Refine earthquake alerts
        </p>
      </div>

      {/* Filter Dropdowns */}
      <div className="grid w-full min-w-0 grid-cols-2 gap-3 sm:w-auto sm:gap-4">
        {/* Disaster Type */}
        <div className="min-w-0">
          <label
            htmlFor="disaster-type"
            className="text-xs text-(--muted-foreground) sm:text-sm"
          >
            Disaster Type
          </label>

          <select
            id="disaster-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 block w-full min-w-0 rounded-lg border border-(--border) bg-(--surface-elevated) px-2 py-2 text-xs text-(--foreground) outline-none transition-colors hover:border-(--accent) focus:border-(--accent) sm:mt-2 sm:min-w-40 sm:px-3 sm:text-sm"
          >
            <option>All Types</option>
            <option>Earthquake</option>
          </select>
        </div>

        {/* Severity */}
        <div className="min-w-0">
          <label
            htmlFor="alert-severity"
            className="text-xs text-(--muted-foreground) sm:text-sm"
          >
            Severity
          </label>

          <select
            id="alert-severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="mt-1 block w-full min-w-0 rounded-lg border border-(--border) bg-(--surface-elevated) px-2 py-2 text-xs text-(--foreground) outline-none transition-colors hover:border-(--accent) focus:border-(--accent) sm:mt-2 sm:min-w-40 sm:px-3 sm:text-sm"
          >
            <option>All Severities</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      <button
        type="button"
        onClick={clearFilters}
        className="self-start rounded-lg border border-(--border) px-3 py-2 text-xs text-(--muted-foreground) transition-colors duration-200 hover:border-(--accent) hover:bg-(--accent) hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) sm:ml-auto sm:self-end sm:px-4 sm:text-sm"
      >
        Clear Filters
      </button>
    </div>
  );
}
