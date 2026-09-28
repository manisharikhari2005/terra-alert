export default function DashboardHeader() {
    return (
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-(--foreground)">Overview</h1>
        <p className="mt-2 text-sm text-(--muted-foreground)">
          {" "}
          Monitor global disaster activity and emergency alerts.
        </p>
      </div>
    );
}