import {
  Activity,
  ArrowLeft,
  CalendarClock,
  Clock3,
  Database,
  ExternalLink,
  FileText,
  Layers3,
  MapPin,
  Radio,
  ShieldAlert,
} from "lucide-react";

export default function AlertDetails({
  id,
  type,
  location,
  details,
  severity,
  time,
  latitude,
  longitude,
  magnitude,
  depth,
  source,
  eventData,
  occurredAt,
  createdAt,
}) {
  const severityStyles = {
    Critical: "border-red-500/30 bg-red-500/10 text-red-500",
    High: "border-(--alert-red)/30 bg-(--alert-red)/10 text-(--alert-red)",
    Medium:
      "border-(--alert-orange)/30 bg-(--alert-orange)/10 text-(--alert-orange)",
    Low: "border-(--success)/30 bg-(--success)/10 text-(--success)",
  };

  const severityStyle =
    severityStyles[severity] ||
    "border-(--border) bg-(--surface-elevated) text-(--foreground)";

  const hasCoordinates =
    latitude != null &&
    longitude != null &&
    latitude !== "" &&
    longitude !== "" &&
    Number.isFinite(Number(latitude)) &&
    Number.isFinite(Number(longitude));

  const formatDate = (value) => {
    if (!value) return "Unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Unavailable";
    }

    return date.toLocaleString();
  };

  const mapUrl = hasCoordinates
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${
        Number(longitude) - 0.04
      }%2C${Number(latitude) - 0.025}%2C${
        Number(longitude) + 0.04
      }%2C${Number(latitude) + 0.025}&layer=mapnik&marker=${latitude}%2C${longitude}`
    : null;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5">
      {/* Alert Header */}
      <section className="rounded-2xl border border-(--border) bg-(--surface) p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <a
              href="/alerts"
              className="mb-4 inline-flex items-center gap-2 text-sm text-(--muted-foreground) transition-colors hover:text-(--accent)"
            >
              <ArrowLeft size={16} />
              Back to Alerts
            </a>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-(--success)/25 bg-(--success)/10 px-2.5 py-1 text-xs font-medium text-(--success)">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-(--success)" />
                ACTIVE EVENT
              </span>

              <span className="text-xs text-(--muted-foreground)">
                Alert ID: #{id ?? "N/A"}
              </span>
            </div>

            <h1 className="mt-3 text-xl font-semibold tracking-tight text-(--foreground) sm:text-2xl">
              {type || "Disaster Alert"}
            </h1>

            <p className="mt-1.5 flex items-start gap-2 text-sm text-(--muted-foreground)">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <span>{location || "Location unavailable"}</span>
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
            <span
              className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-sm font-medium ${
                severityStyle
              }`}
            >
              <ShieldAlert size={15} className="mr-2" />
              {severity || "Unknown"} Severity
            </span>

            <span className="flex items-center gap-1.5 text-xs text-(--muted-foreground)">
              <Clock3 size={13} />
              {time || "Time unavailable"}
            </span>
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="group rounded-xl border border-(--border) bg-(--surface) p-4 transition-colors hover:border-(--accent)/40">
          <div className="flex items-center justify-between">
            <p className="text-sm text-(--muted-foreground)">Magnitude</p>
            <Activity
              size={17}
              className="text-(--muted-foreground) transition-colors group-hover:text-(--accent)"
            />
          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-(--foreground)">
            {magnitude != null && magnitude !== ""
              ? Number(magnitude).toFixed(2)
              : "N/A"}
          </p>

          <p className="mt-1 text-xs text-(--muted-foreground)">
            Earthquake magnitude
          </p>
        </div>

        <div className="group rounded-xl border border-(--border) bg-(--surface) p-4 transition-colors hover:border-(--accent)/40">
          <div className="flex items-center justify-between">
            <p className="text-sm text-(--muted-foreground)">Depth</p>
            <Layers3
              size={17}
              className="text-(--muted-foreground) transition-colors group-hover:text-(--accent)"
            />
          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-(--foreground)">
            {depth != null && depth !== "" && Number.isFinite(Number(depth))
              ? `${Number(depth).toFixed(2)}`
              : "N/A"}
            {depth != null && depth !== "" && Number.isFinite(Number(depth))
              ? " km"
              : ""}
          </p>

          <p className="mt-1 text-xs text-(--muted-foreground)">
            Reported event depth
          </p>
        </div>

        <div className="group rounded-xl border border-(--border) bg-(--surface) p-4 transition-colors hover:border-(--accent)/40">
          <div className="flex items-center justify-between">
            <p className="text-sm text-(--muted-foreground)">Data Source</p>
            <Database
              size={17}
              className="text-(--muted-foreground) transition-colors group-hover:text-(--accent)"
            />
          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-(--foreground)">
            {source || "Unknown"}
          </p>

          <p className="mt-1 text-xs text-(--muted-foreground)">
            Event data provider
          </p>
        </div>
      </section>

      {/* Main Two-Column Layout */}
      <section className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.9fr)]">
        {/* Left Column */}
        <div className="min-w-0 space-y-5">
          {/* Event Information */}
          <div className="rounded-2xl border border-(--border) bg-(--surface) p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--surface-elevated) text-(--accent)">
                <FileText size={18} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-(--foreground)">
                  Event Information
                </h2>
                <p className="text-xs text-(--muted-foreground)">
                  Overview of the reported event
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-medium text-(--muted-foreground)">
                  Disaster Type
                </p>
                <p className="mt-1 text-sm font-medium text-(--foreground)">
                  {type || "Unknown"}
                </p>
              </div>

              <div className="border-t border-(--border)" />

              <div>
                <p className="text-xs font-medium text-(--muted-foreground)">
                  Reported Location
                </p>
                <p className="mt-1 text-sm leading-6 text-(--foreground)">
                  {location || "Location unavailable"}
                </p>
              </div>

              <div className="border-t border-(--border)" />

              <div>
                <p className="text-xs font-medium text-(--muted-foreground)">
                  Event Description
                </p>
                <p className="mt-1 text-sm leading-6 text-(--foreground)">
                  {details || "No additional details available."}
                </p>
              </div>
            </div>
          </div>

          {/* Event Timeline */}
          <div className="rounded-2xl border border-(--border) bg-(--surface) p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-(--surface-elevated) text-(--accent)">
                <CalendarClock size={18} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-(--foreground)">
                  Event Timeline
                </h2>
                <p className="text-xs text-(--muted-foreground)">
                  Event and record timestamps
                </p>
              </div>
            </div>

            <div className="relative mt-5 space-y-5 pl-1">
              <div className="absolute bottom-3 left-[7px] top-2 w-px bg-(--border)" />

              <div className="relative flex gap-3">
                <span className="z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-[3px] border-(--accent) bg-(--surface)" />

                <div className="min-w-0">
                  <p className="text-sm font-medium text-(--foreground)">
                    Event Occurred
                  </p>
                  <p className="mt-1 text-sm text-(--muted-foreground)">
                    {formatDate(occurredAt)}
                  </p>
                </div>
              </div>

              <div className="relative flex gap-3">
                <span className="z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-[3px] border-(--success) bg-(--surface)" />

                <div className="min-w-0">
                  <p className="text-sm font-medium text-(--foreground)">
                    Record Created
                  </p>
                  <p className="mt-1 text-sm text-(--muted-foreground)">
                    {formatDate(createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Event Metadata */}
          <div className="rounded-2xl border border-(--border) bg-(--surface) p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <Radio size={17} className="text-(--accent)" />
              <h2 className="text-sm font-semibold text-(--foreground)">
                Technical Metadata
              </h2>
            </div>

            <div className="mt-4 divide-y divide-(--border)">
              <div className="flex items-start justify-between gap-4 py-3">
                <span className="text-xs text-(--muted-foreground)">
                  Internal Alert ID
                </span>
                <span className="text-right text-sm font-medium text-(--foreground)">
                  {id ?? "N/A"}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 py-3">
                <span className="text-xs text-(--muted-foreground)">
                  External Event ID
                </span>
                <span className="max-w-[60%] break-all text-right font-mono text-xs text-(--foreground)">
                  {eventData?.id ?? "N/A"}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 py-3">
                <span className="text-xs text-(--muted-foreground)">
                  Magnitude Type
                </span>
                <span className="text-right text-sm font-medium text-(--foreground)">
                  {eventData?.properties?.magType?.toUpperCase() || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="min-w-0 space-y-5">
          {/* Location Map */}
          <div className="overflow-hidden rounded-2xl border border-(--border) bg-(--surface)">
            <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
              <div>
                <h2 className="text-sm font-semibold text-(--foreground)">
                  Event Location
                </h2>
                <p className="mt-1 text-xs text-(--muted-foreground)">
                  Geographic position of the event
                </p>
              </div>

              <MapPin size={18} className="shrink-0 text-(--accent)" />
            </div>

            {hasCoordinates ? (
              <>
                <iframe
                  title="Disaster event location map"
                  src={mapUrl}
                  className="h-64 w-full border-0 sm:h-72"
                  loading="lazy"
                />

                <div className="border-t border-(--border) p-4">
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=12/${latitude}/${longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-(--accent) transition-opacity hover:opacity-75"
                  >
                    Open interactive map
                    <ExternalLink size={14} />
                  </a>
                </div>
              </>
            ) : (
              <div className="flex h-52 flex-col items-center justify-center gap-2 border-t border-(--border) px-4 text-center">
                <MapPin size={24} className="text-(--muted-foreground)" />
                <p className="text-sm font-medium text-(--foreground)">
                  Coordinates unavailable
                </p>
                <p className="text-xs text-(--muted-foreground)">
                  A map cannot be displayed for this event.
                </p>
              </div>
            )}
          </div>

          {/* Coordinates */}
          <div className="rounded-2xl border border-(--border) bg-(--surface) p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <MapPin size={17} className="text-(--accent)" />
              <h2 className="text-sm font-semibold text-(--foreground)">
                Geographic Coordinates
              </h2>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-(--surface-elevated) p-3">
                <p className="text-xs text-(--muted-foreground)">Latitude</p>
                <p className="mt-2 break-all font-mono text-sm text-(--foreground)">
                  {hasCoordinates ? Number(latitude).toFixed(5) : "N/A"}
                </p>
              </div>

              <div className="rounded-xl bg-(--surface-elevated) p-3">
                <p className="text-xs text-(--muted-foreground)">Longitude</p>
                <p className="mt-2 break-all font-mono text-sm text-(--foreground)">
                  {hasCoordinates ? Number(longitude).toFixed(5) : "N/A"}
                </p>
              </div>
            </div>

            {hasCoordinates && (
              <a
                href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-(--accent) transition-opacity hover:opacity-75"
              >
                View on Google Maps
                <ExternalLink size={14} />
              </a>
            )}
          </div>

          {/* Official Source */}
          <div className="rounded-2xl border border-(--border) bg-(--surface) p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--surface-elevated) text-(--accent)">
                <Database size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-(--foreground)">
                  Official Event Report
                </h2>
                <p className="mt-1 text-xs leading-5 text-(--muted-foreground)">
                  Original event information provided by{" "}
                  {source || "the data provider"}.
                </p>
              </div>
            </div>

            {eventData?.properties?.url ? (
              <a
                href={eventData.properties.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-(--border) px-3 py-2.5 text-sm font-medium text-(--foreground) transition-colors hover:border-(--accent)/50 hover:text-(--accent)"
              >
                View Official Report
                <ExternalLink size={14} />
              </a>
            ) : (
              <p className="mt-4 text-xs text-(--muted-foreground)">
                Official report link unavailable.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
