export default function AlertDetails({
  type,
  location,
  details,
  severity, 
  time,
}) {
  let severityColor = "text-(--alert-red)";

  if (severity === "Medium") {
    severityColor = "text-(--alert-orange)";
  }

  if (severity === "Low") {   

    severityColor = "text-(--success)";
  }

  return (
    <div className="rounded-2xl border border-(--border) bg-(--surface) p-4 transition-all duration-300 hover:border-(--accent)/40 sm:p-6">
      {/* Status */}
      <div className="flex flex-col gap-3 border-b border-(--border) pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-(--muted-foreground)">
            Alert Status
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-(--alert-red) animate-pulse" />

            <span className="text-sm font-medium text-(--alert-red)">
              ACTIVE ALERT
            </span>
          </div>
        </div>

        <span className={`text-sm font-medium ${severityColor}`}>
          {severity} Severity
        </span>
      </div>

      {/* Main Information */}
      <div className="mt-5 grid grid-cols-1 gap-5 sm:mt-6 sm:grid-cols-2 sm:gap-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-(--muted-foreground)">
            Disaster Type
          </p>

          <h2 className="mt-2 text-xl font-semibold text-(--foreground) sm:text-2xl">
            {type}
          </h2>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-(--muted-foreground)">
            Location
          </p>

          <p className="mt-2 text-base text-(--foreground) sm:text-lg">
            {location}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="mt-5 rounded-xl border border-(--border) bg-(--surface-elevated) p-4 sm:mt-6">
        <p className="text-xs uppercase tracking-wide text-(--muted-foreground)">
          Event Details
        </p>

        <p className="mt-2 text-sm leading-6 text-(--foreground)">{details}</p>
      </div>

      {/* Reported Time */}
      <div className="mt-5 border-t border-(--border) pt-4 sm:mt-6 sm:pt-5">
        <p className="text-xs uppercase tracking-wide text-(--muted-foreground)">
          Reported
        </p>

        <p className="mt-2 text-sm text-(--foreground)">{time}</p>
      </div>
    </div>
  );
}
