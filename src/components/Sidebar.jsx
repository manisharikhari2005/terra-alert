"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  const workspaceLinks = [
    { name: "Overview", href: "/" },
    { name: "Live Map", href: "/map" },
    { name: "Alerts", href: "/alerts" },
    { name: "Saved Locations", href: "/locations" },
  ];

  const systemLinks = [{ name: "Settings", href: "/settings" }];

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50
        w-[80%] max-w-72
        border-r border-(--border)
        bg-(--surface)
        transition-transform duration-300 ease-in-out
        lg:static lg:min-h-screen lg:w-72 lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="p-5">
        {/* Brand */}
        <div className="flex items-start justify-between">
          <Link href="/" className="block">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-(--accent)" />

              <span className="text-sm font-semibold text-(--foreground)">
                Disaster Watch
              </span>
            </div>

            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-(--accent)">
              Global Monitoring
            </p>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-lg p-2 text-(--muted) transition hover:bg-(--surface-elevated) hover:text-(--foreground) lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Workspace */}
        <p className="mt-7 text-[10px] font-medium uppercase tracking-[0.15em] text-(--muted-foreground)">
          Workspace
        </p>

        <nav className="mt-3 flex flex-col gap-2">
          {workspaceLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-(--surface-elevated) text-(--foreground)"
                    : "text-(--muted) hover:bg-(--surface-elevated) hover:text-(--foreground)"
                }`}
              >
                <span>{link.name}</span>

                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-(--accent)" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* System */}
        <p className="mt-10 text-[10px] font-medium uppercase tracking-[0.15em] text-(--muted-foreground)">
          System
        </p>

        <nav className="mt-3 flex flex-col gap-2">
          {systemLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-(--surface-elevated) text-(--foreground)"
                    : "text-(--muted) hover:bg-(--surface-elevated) hover:text-(--foreground)"
                }`}
              >
                <span>{link.name}</span>

                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-(--accent)" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
