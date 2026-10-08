import { notFound } from "next/navigation";
import AlertDetails from "@/components/AlertDetails";
import AppShell from "@/components/AppShell";
import Link from "next/link";

const formatRelativeTime = (date) => {
  const diff = Date.now() - new Date(date).getTime();

  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days} ${days === 1 ? "day" : "days"} ago`;
};
export default async function AlertPage({ params }) {
  const { id } = await params;

  const response = await fetch(`http://localhost:5000/api/alerts/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    notFound();
  }

  const result = await response.json();
  const alert = result.data;

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
            time={formatRelativeTime(alert.occurred_at)}
          />
        </div>
      </main>
    </AppShell>
  );
}
