import { Activity, BellRing, Globe2, TrendingUp } from "lucide-react";

const stats = [
  {
    label: "Active Events",
    value: "24",
    description: "Currently being monitored",
    icon: Activity,
  },
  {
    label: "Alerts Today",
    value: "8",
    description: "Reported in the last 24 hours",
    icon: BellRing,
  },
  {
    label: "Countries Affected",
    value: "12",
    description: "Countries with active events",
    icon: Globe2,
  },
];

export default function StatsCards() {
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
              <h2 className="text-xl font-semibold tracking-tight text-(--foreground) sm:text-2xl ">
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
