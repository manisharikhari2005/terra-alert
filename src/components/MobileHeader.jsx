"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function MobileHeader({ isOpen, onToggle }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-(--border) bg-(--surface) px-4 lg:hidden">
      <Link href="/" className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-(--accent)" />

        <div>
          <p className="text-sm font-semibold text-(--foreground)">
            Disaster Watch
          </p>

          <p className="text-[8px] font-medium uppercase tracking-[0.18em] text-(--accent)">
            Global Monitoring
          </p>
        </div>
      </Link>

      <button
        type="button"
        onClick={onToggle}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        className="rounded-lg p-2 text-(--muted) transition hover:bg-(--surface-elevated) hover:text-(--foreground)"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
    </header>
  );
}
