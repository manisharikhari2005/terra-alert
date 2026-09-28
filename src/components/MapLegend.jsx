export default function MapLegend() {
  return (
    <div className="absolute right-2 top-2 z-[1000] rounded-xl border border-(--border) bg-(--surface)/95 p-3 shadow-lg backdrop-blur sm:right-4 sm:top-4 sm:p-4">
      <p className="text-xs font-semibold text-(--foreground)">Event Types</p>

      <div className="mt-2 space-y-1.5 sm:mt-3 sm:space-y-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-(--alert-red)" />
          <span className="text-[10px] text-(--muted-foreground) sm:text-xs">
            Earthquake
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-(--alert-orange)" />
          <span className="text-[10px] text-(--muted-foreground) sm:text-xs">
            Flood
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-(--success)" />
          <span className="text-[10px] text-(--muted-foreground) sm:text-xs">
            Wildfire
          </span>
        </div>
      </div>
    </div>
  );
}
