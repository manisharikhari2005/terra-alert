export default function MapLegend() {
  return (
    <div className="absolute right-2 top-2 z-[1000] w-36 rounded-xl border border-(--border) bg-(--surface)/95 p-3 shadow-lg backdrop-blur sm:right-4 sm:top-4 sm:w-40 sm:p-4">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-(--alert-red)" />

        <p className="text-xs font-semibold text-(--foreground)">
          Earthquake Map
        </p>
      </div>

      <div className="mt-3 space-y-3">
        <div>
          <p className="text-[10px] font-medium text-(--muted-foreground) sm:text-xs">
            Event marker
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-(--alert-red)/40 bg-(--alert-red)/15">
              <span className="h-2 w-2 rounded-full bg-(--alert-red)" />
            </span>

            <span className="text-[10px] text-(--foreground) sm:text-xs">
              Earthquake
            </span>
          </div>
        </div>

        <div className="border-t border-(--border) pt-3">
          <p className="text-[10px] font-medium text-(--muted-foreground) sm:text-xs">
            Map controls
          </p>

          <p className="mt-1.5 text-[10px] leading-relaxed text-(--muted-foreground) sm:text-xs">
            Zoom in to explore earthquake locations.
          </p>
        </div>
      </div>
    </div>
  );
}
