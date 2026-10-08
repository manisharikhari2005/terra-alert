"use client";

import { Activity, Waves, Flame } from "lucide-react";
import { useRouter } from "next/navigation";
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

export default function AlertCard({
  id,
  type,
  location,
  details,
  severity,
  time,
}) {
  const router = useRouter();

  let severityColor = "text-(--alert-red)";
  let severityDot = "bg-(--alert-red)";

  if (severity === "Medium") {
    severityColor = "text-(--alert-orange)";
    severityDot = "bg-(--alert-orange)";
  }

  if (severity === "Low") {
    severityColor = "text-(--success)";
    severityDot = "bg-(--success)";
  }

  let DisasterIcon = Activity;

  if (type === "Flood") {
    DisasterIcon = Waves;
  }

  if (type === "Wildfire") {
    DisasterIcon = Flame;
  }

  return (
    <div
      className="group cursor-pointer rounded-2xl border border-(--border) bg-(--surface) p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-(--accent)/50 hover:shadow-lg hover:shadow-black/5"
      onClick={() => router.push(`/alerts/${id}`)}
    >
      <div className="flex items-center gap-2">
        <DisasterIcon className="h-4 w-4 text-(--accent)" />

        <h3 className="text-base font-semibold text-(--foreground) transition-transform group-hover:scale-110">
          {type}
        </h3>
      </div>

      <p className="mt-1 text-sm text-(--muted-foreground)">{location}</p>

      <p className="mt-3 text-sm text-(--muted-foreground)">{details}</p>

      <div className="mt-4 flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${severityDot}`}></span>

          <span className={`text-sm ${severityColor}`}>{severity}</span>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-xs text-(--muted-foreground)">
            {formatRelativeTime(time)}
          </p>

          <span className="text-xs text-(--accent) transition-transform group-hover:translate-x-0.5">
            View details →
          </span>
        </div>
      </div>
    </div>
  );
}
