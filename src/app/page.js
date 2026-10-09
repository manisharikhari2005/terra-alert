import AppShell from "@/components/AppShell";
import DashboardHeader from "@/components/DashboardHeader";
import StatsCards from "@/components/StatsCards";
import AlertList from "@/components/AlertList";
import GlobalEventMap from "@/components/GlobalEventMap";

export default function Home() {
  return (
    <AppShell>
      <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-5 lg:p-7">
        <DashboardHeader />

        <div className="mt-5 grid items-stretch gap-4 2xl:grid-cols-[0.9fr_2.1fr]">
          <div className="rounded-xl border border-(--border) bg-(--surface) p-4 transition-colors duration-200 hover:border-(--success)/40 sm:p-5">
            <p className="text-sm text-(--muted-foreground)">
              Global Monitoring Status
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-(--success) animate-pulse" />

              <span className="text-sm text-(--success)">Operational</span>
            </div>

            <h2 className="mt-2 text-xl font-semibold text-(--foreground)">
              Systems Operational
            </h2>

            <p className="mt-2 text-sm text-(--muted-foreground)">
              All monitoring services are running normally.
            </p>
          </div>

          <StatsCards />
        </div>

        <div className="mt-7 grid grid-cols-1 items-start gap-5 xl:grid-cols-[1.35fr_0.9fr]">
          <section className="min-w-0">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-(--foreground)">
                  Recent Disasters
                </h2>
                <p className="mt-1 text-sm text-(--muted-foreground)">
                  Latest reported events
                </p>
              </div>

              <a
                href="/alerts"
                className="shrink-0 pt-0.5 text-sm font-medium text-(--accent) hover:opacity-75"
              >
                View all →
              </a>
            </div>

            <AlertList limit={6} />
          </section>

          <div className="min-w-0">
            <GlobalEventMap />
          </div>
        </div>
      </main>
    </AppShell>
  );
}
