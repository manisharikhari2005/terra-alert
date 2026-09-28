import { alerts } from "@/data/alerts";
import { notFound } from "next/navigation";
import AlertDetails from "@/components/AlertDetails";
import AppShell from "@/components/AppShell";
import Link from "next/link";

export default async function AlertPage({ params }) {
  const { id } = await params;

  const alert = alerts.find((item) => item.id === Number(id));

  if (!alert) {
    notFound();
  }

  return (
    <AppShell>
      <main className="min-h-screen p-4 sm:p-6 lg:p-8">
        {/* Back */}
        <Link
          href="/"
          className="mb-4 inline-flex items-center text-sm text-(--muted-foreground) transition hover:text-(--foreground)"
        >
          ← Back to Overview
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold text-(--foreground) sm:text-2xl">
            Disaster Alert
          </h1>

          <p className="mt-2 text-sm text-(--muted-foreground)">
            Detailed information about this disaster event.
          </p>
        </div>

        {/* Alert Details */}
        <div className="mt-6">
          <AlertDetails
            type={alert.type}
            location={alert.location}
            details={alert.details}
            severity={alert.severity}
            time={alert.time}
          />
        </div>
      </main>
    </AppShell>
  );
}
  