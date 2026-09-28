"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";

export default function SettingsPage() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showLowSeverity, setShowLowSeverity] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [dailySummary, setDailySummary] = useState(false);
  const [mapView, setMapView] = useState("Global");
  const [showMapOptions, setShowMapOptions] = useState(false);

  return (
    <AppShell>
      <main className="min-h-screen p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-(--foreground)">
            Settings
          </h1>

          <p className="mt-2 text-sm text-(--muted-foreground)">
            Configure monitoring and alert preferences.
          </p>
        </div>

        {/* Monitoring */}
        <section className="mt-8 rounded-2xl border border-(--border) bg-(--surface)">
          <div className="border-b border-(--border) p-4 sm:p-5">
            <h2 className="text-base font-semibold text-(--foreground)">
              Monitoring
            </h2>

            <p className="mt-1 text-xs text-(--muted-foreground)">
              Control how disaster information is monitored.
            </p>
          </div>

          <div className="divide-y divide-(--border)">
            <SettingToggle
              title="Auto refresh"
              description="Automatically refresh monitoring data."
              enabled={autoRefresh}
              onChange={setAutoRefresh}
            />

            <SettingToggle
              title="Show low severity"
              description="Include low severity events in monitoring results."
              enabled={showLowSeverity}
              onChange={setShowLowSeverity}
            />
          </div>
        </section>

        {/* Notifications */}
        <section className="mt-6 rounded-2xl border border-(--border) bg-(--surface)">
          <div className="border-b border-(--border) p-4 sm:p-5">
            <h2 className="text-base font-semibold text-(--foreground)">
              Notifications
            </h2>

            <p className="mt-1 text-xs text-(--muted-foreground)">
              Choose which alerts you want to receive.
            </p>
          </div>

          <div className="divide-y divide-(--border)">
            <SettingToggle
              title="Emergency alerts"
              description="Receive notifications for high severity events."
              enabled={emergencyAlerts}
              onChange={setEmergencyAlerts}
            />

            <SettingToggle
              title="Daily summary"
              description="Receive a daily overview of disaster activity."
              enabled={dailySummary}
              onChange={setDailySummary}
            />
          </div>
        </section>

        {/* Map */}
        <section className="mt-6 rounded-2xl border border-(--border) bg-(--surface)">
          <div className="border-b border-(--border) p-4 sm:p-5">
            <h2 className="text-base font-semibold text-(--foreground)">Map</h2>

            <p className="mt-1 text-xs text-(--muted-foreground)">
              Configure your default map view.
            </p>
          </div>

          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <p className="text-sm font-medium text-(--foreground)">
                Default view
              </p>

              <p className="mt-1 text-xs text-(--muted-foreground)">
                Choose the area shown when the map opens.
              </p>
            </div>

            {/* Custom Dropdown */}
            <div className="relative w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setShowMapOptions((current) => !current)}
                className="flex w-full items-center justify-between gap-4 rounded-lg border border-(--border) bg-(--surface-elevated) px-3 py-2 text-sm text-(--foreground) transition hover:border-(--accent) sm:w-48"
              >
                <span>{mapView}</span>

                <span
                  className={`text-(--muted-foreground) transition-transform ${
                    showMapOptions ? "rotate-180" : ""
                  }`}
                >
                  ⌄
                </span>
              </button>

              {showMapOptions && (
                <div className="absolute bottom-full left-0 z-50 mb-2 w-full overflow-hidden rounded-lg border border-(--border) bg-(--surface-elevated) shadow-lg sm:w-48">
                  {["Global", "India", "Asia", "North America", "Europe"].map(
                    (option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setMapView(option);
                          setShowMapOptions(false);
                        }}
                        className={`block w-full px-3 py-2 text-left text-sm transition hover:bg-(--surface) ${
                          mapView === option
                            ? "text-(--accent)"
                            : "text-(--foreground)"
                        }`}
                      >
                        {option}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}

function SettingToggle({ title, description, enabled, onChange }) {
  return (
    <div className="flex items-start justify-between gap-3 p-4 sm:items-center sm:gap-4 sm:p-5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-(--foreground)">{title}</p>

        <p className="mt-1 text-xs text-(--muted-foreground)">{description}</p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full border transition ${
          enabled
            ? "border-(--accent) bg-(--accent)"
            : "border-(--border) bg-(--surface-elevated)"
        }`}
        aria-label={`Toggle ${title}`}
      >
        <span
          className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
