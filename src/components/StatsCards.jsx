export default function StatsCards() {
    return (
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-(--border) bg-(--surface) p-5">
          <p className="text-sm text-(--muted-foreground)">Active Events</p>
          <h2 className="mt-4 text-2xl font-semibold text-(--foreground)">
            24
          </h2>
          <p className="mt-2 text-xs text-(--muted-foreground)">
            Currently being monitored
          </p>
        </div>
        <div className="rounded-2xl border border-(--border) bg-(--surface) p-5">
          <p className="text-sm text-(--muted-foreground)">Alerts Today</p>
          <h2 className="mt-4 text-2xl font-semibold text-(--foreground)">8</h2>
          <p className="mt-2 text-xs text-(--muted-foreground)">
            Reported in the last 24 hours 
          </p> 
        </div>
        <div className="rounded-2xl border border-(--border) bg-(--surface) p-5">
          <p className="text-sm text-(--muted-foreground)">
            Countries Affected
          </p>
          <h2 className="mt-4 text-2xl font-semibold text-(--foreground)">
            12
          </h2>
          <p className="mt-2 text-xs text-(--muted-foreground)">
            Countries with active events
          </p>
        </div>
      </div>
    );
}