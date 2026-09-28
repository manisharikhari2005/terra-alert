import AppShell from "@/components/AppShell";
import DashboardHeader from "@/components/DashboardHeader";
import StatsCards from "@/components/StatsCards";
import AlertList from "@/components/AlertList";

export default function Home() {
  return (
    <AppShell>
      <main className="min-h-screen p-4 sm:p-6 lg:p-8">
        <DashboardHeader />

        <div className="rounded-2xl border border-(--border) bg-(--surface) p-5">
          <p className="text-sm text-(--muted-foreground)">
            Global Monitoring Status
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-(--success)" />

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

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-(--foreground)">
            Recent Disasters
          </h2>

          <div className="mt-4">
            <AlertList />
          </div>
        </div>
      </main>
    </AppShell>
  );
}
