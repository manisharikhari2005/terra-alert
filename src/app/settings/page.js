"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Check,
  Globe2,
  MapPin,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import AppShell from "@/components/AppShell";

const DEFAULT_SETTINGS = {
  showLowSeverity: true,
  mapView: "Global",
};

const STORAGE_KEY = "disaster-watch-settings";

const MAP_OPTIONS = ["Global", "India", "Asia", "North America", "Europe"];

export default function SettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        setSettings({
          showLowSeverity:
            typeof parsed.showLowSeverity === "boolean"
              ? parsed.showLowSeverity
              : DEFAULT_SETTINGS.showLowSeverity,
          mapView: MAP_OPTIONS.includes(parsed.mapView)
            ? parsed.mapView
            : DEFAULT_SETTINGS.mapView,
        });
      }
    } catch (error) {
      console.error("Could not load settings:", error);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setSaved(true);
    } catch (error) {
      console.error("Could not save settings:", error);
      setSaved(false);
    }
  }, [settings, ready]);

  function updateSetting(key, value) {
    setSettings((current) => {
      const updated = {
        ...current,
        [key]: value,
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        window.dispatchEvent(new Event("disaster-watch-settings-changed"));
      } catch (error) {
        console.error("Could not save settings:", error);
      }

      return updated;
    });
  }

  function resetSettings() {
    setSettings({ ...DEFAULT_SETTINGS });
  }

  return (
    <AppShell>
      <main className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <header className="flex flex-col gap-4 border-b border-(--border) pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-(--border) bg-(--surface-elevated) text-(--accent)">
                  <Activity size={20} />
                </div>

                <h1 className="text-2xl font-semibold tracking-tight text-(--foreground)">
                  Settings
                </h1>
              </div>

              <p className="mt-2 text-sm text-(--muted-foreground)">
                Customize your alert display and map preferences.
              </p>
            </div>

            <button
              type="button"
              onClick={resetSettings}
              disabled={!ready}
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-(--border) px-4 py-2.5 text-sm text-(--foreground) transition hover:border-(--accent) disabled:opacity-50"
            >
              <RotateCcw size={15} />
              Reset defaults
            </button>
          </header>

          <div className="mt-5 flex items-center gap-3 rounded-xl border border-(--border) bg-(--surface) p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-(--success)/10 text-(--success)">
              <Check size={19} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-(--foreground)">
                Preferences
              </p>
              <p className="mt-1 text-xs text-(--muted-foreground)">
                {!ready
                  ? "Loading saved preferences..."
                  : saved
                    ? "Your settings are saved on this device."
                    : "Could not save settings. Check browser storage."}
              </p>
            </div>

            <span className="rounded-full border border-(--border) px-2.5 py-1 text-[10px] text-(--muted-foreground)">
              LOCAL
            </span>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-5">
              <section className="overflow-hidden rounded-xl border border-(--border) bg-(--surface)">
                <div className="flex items-start gap-3 border-b border-(--border) p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-(--surface-elevated) text-(--accent)">
                    <ShieldCheck size={19} />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-(--foreground)">
                      Alert preferences
                    </h2>
                    <p className="mt-1 text-xs leading-relaxed text-(--muted-foreground)">
                      Choose whether low-severity events should be included in
                      your alert results.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-(--foreground)">
                      Show low-severity events
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-(--muted-foreground)">
                      Keep minor events visible or hide them from supported
                      alert lists.
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.showLowSeverity}
                    aria-label="Show low-severity events"
                    disabled={!ready}
                    onClick={() =>
                      updateSetting(
                        "showLowSeverity",
                        !settings.showLowSeverity,
                      )
                    }
                    className={`relative h-6 w-11 shrink-0 rounded-full border transition ${
                      settings.showLowSeverity
                        ? "border-(--accent) bg-(--accent)"
                        : "border-(--border) bg-(--surface-elevated)"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        settings.showLowSeverity
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </section>

              <section className="overflow-hidden rounded-xl border border-(--border) bg-(--surface)">
                <div className="flex items-start gap-3 border-b border-(--border) p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-(--surface-elevated) text-(--accent)">
                    <Globe2 size={19} />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-(--foreground)">
                      Map preferences
                    </h2>
                    <p className="mt-1 text-xs leading-relaxed text-(--muted-foreground)">
                      Save your preferred geographic region.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-(--foreground)">
                      Default map region
                    </p>
                    <p className="mt-1 text-xs text-(--muted-foreground)">
                      Choose your preferred region.
                    </p>
                  </div>

                  <div className="relative w-full sm:w-52">
                    <MapPin
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--muted-foreground)"
                    />

                    <select
                      value={settings.mapView}
                      disabled={!ready}
                      onChange={(event) =>
                        updateSetting("mapView", event.target.value)
                      }
                      aria-label="Default map region"
                      className="w-full rounded-lg border border-(--border) bg-(--surface-elevated) py-2.5 pl-9 pr-3 text-sm text-(--foreground) outline-none focus:border-(--accent) disabled:opacity-50"
                    >
                      {MAP_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>
            </div>

            <aside className="space-y-5">
              <section className="rounded-xl border border-(--border) bg-(--surface) p-5">
                <div className="flex items-center gap-2">
                  <Activity size={17} className="text-(--accent)" />
                  <h2 className="text-sm font-semibold text-(--foreground)">
                    Configuration overview
                  </h2>
                </div>

                <div className="mt-4 divide-y divide-(--border)">
                  <SummaryRow
                    label="Low-severity events"
                    value={settings.showLowSeverity ? "Included" : "Hidden"}
                  />
                  <SummaryRow label="Default region" value={settings.mapView} />
                  <SummaryRow
                    label="Storage"
                    value={saved ? "Saved locally" : "Pending"}
                  />
                </div>
              </section>

              <section className="rounded-xl border border-(--border) bg-(--surface) p-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={17} className="text-(--success)" />
                  <h2 className="text-sm font-semibold text-(--foreground)">
                    Data & privacy
                  </h2>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-(--muted-foreground)">
                  These preferences are stored in your browser on this device.
                  They do not configure emergency notifications or change the
                  backend earthquake monitoring service.
                </p>
              </section>
            </aside>
          </div>

          <p className="mt-6 text-center text-xs text-(--muted-foreground)">
            Terra Alert · Monitoring preferences
          </p>
        </div>
      </main>
    </AppShell>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <span className="text-xs text-(--muted-foreground)">{label}</span>
      <span className="max-w-[58%] text-right text-xs font-medium text-(--foreground)">
        {value}
      </span>
    </div>
  );
}
