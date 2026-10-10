"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  Globe2,
  MapPin,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import AppShell from "@/components/AppShell";

const DEFAULT_SETTINGS = {
  autoRefresh: true,
  showLowSeverity: true,
  emergencyAlerts: true,
  dailySummary: false,
  mapView: "Global",
};

const STORAGE_KEY = "disaster-watch-settings";
const MAP_OPTIONS = ["Global", "India", "Asia", "North America", "Europe"];

export default function SettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [showMapOptions, setShowMapOptions] = useState(false);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load saved preferences once the page mounts.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        setSettings({
          ...DEFAULT_SETTINGS,
          ...parsed,
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

  // Save changes locally after initial loading.
  useEffect(() => {
    if (!ready) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setSaved(true);
    } catch (error) {
      setSaved(false);
      console.error("Could not save settings:", error);
    }
  }, [settings, ready]);

  function updateSetting(key, value) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetSettings() {
    setSettings({ ...DEFAULT_SETTINGS });
    setShowMapOptions(false);
  }

  return (
    <AppShell>
      <main className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          {/* Page header */}
          <div className="flex flex-col gap-4 border-b border-(--border) pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-(--border) bg-(--surface-elevated) text-(--accent)">
                  <Activity size={19} />
                </div>

                <h1 className="text-2xl font-semibold tracking-tight text-(--foreground)">
                  Settings
                </h1>
              </div>

              <p className="mt-2 text-sm text-(--muted-foreground)">
                Manage monitoring preferences and alert configurations.
              </p>
            </div>

            <button
              type="button"
              onClick={resetSettings}
              className="inline-flex w-fit items-center justify-center gap-2 rounded-lg border border-(--border) px-3 py-2 text-xs font-medium text-(--muted-foreground) transition hover:border-(--accent)/50 hover:text-(--foreground) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
            >
              <RotateCcw size={14} />
              Reset defaults
            </button>
          </div>

          {/* Settings status */}
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-(--border) bg-(--surface) p-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--success)/10 text-(--success)">
              <Check size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-(--foreground)">
                Your preferences
              </p>
              <p className="mt-0.5 text-xs text-(--muted-foreground)">
                {ready
                  ? saved
                    ? "Settings are saved on this device."
                    : "Settings could not be saved. Check your browser storage."
                  : "Loading your saved preferences..."}
              </p>
            </div>

            <span className="hidden rounded-full border border-(--border) px-2.5 py-1 text-[10px] font-medium text-(--muted-foreground) sm:inline-flex">
              LOCAL
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
            {/* Main settings */}
            <div className="space-y-5">
              <SettingsSection
                icon={RefreshCw}
                title="Monitoring"
                description="Control how frequently disaster information is monitored."
              >
                <SettingToggle
                  icon={RefreshCw}
                  title="Auto refresh"
                  description="Keep monitoring data refreshed automatically."
                  enabled={settings.autoRefresh}
                  onChange={(value) => updateSetting("autoRefresh", value)}
                />

                <SettingToggle
                  icon={ShieldAlert}
                  title="Low severity events"
                  description="Include low severity events in alert results."
                  enabled={settings.showLowSeverity}
                  onChange={(value) => updateSetting("showLowSeverity", value)}
                />
              </SettingsSection>

              <SettingsSection
                icon={Bell}
                title="Notifications"
                description="Manage your preferred alert notification settings."
              >
                <SettingToggle
                  icon={ShieldAlert}
                  title="Emergency alerts"
                  description="Enable notification preference for high severity events."
                  enabled={settings.emergencyAlerts}
                  onChange={(value) => updateSetting("emergencyAlerts", value)}
                />

                <SettingToggle
                  icon={CalendarDays}
                  title="Daily summary"
                  description="Enable the preference for a daily disaster overview."
                  enabled={settings.dailySummary}
                  onChange={(value) => updateSetting("dailySummary", value)}
                />

                <p className="border-t border-(--border) px-4 py-3 text-[11px] leading-relaxed text-(--muted-foreground) sm:px-5">
                  These notification options save your preferences only. Actual
                  email, push, or browser notifications are not configured by
                  this page.
                </p>
              </SettingsSection>

              <SettingsSection
                icon={Globe2}
                title="Map preferences"
                description="Choose the default region for your map experience."
              >
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--surface-elevated) text-(--muted-foreground)">
                      <MapPin size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-(--foreground)">
                        Default map region
                      </p>
                      <p className="mt-1 text-xs text-(--muted-foreground)">
                        Current selection: {settings.mapView}
                      </p>
                    </div>
                  </div>

                  <div className="relative w-full sm:w-48">
                    <button
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded={showMapOptions}
                      onClick={() => setShowMapOptions((current) => !current)}
                      className="flex w-full items-center justify-between gap-3 rounded-lg border border-(--border) bg-(--surface-elevated) px-3 py-2.5 text-sm text-(--foreground) outline-none transition hover:border-(--accent)/60 focus-visible:ring-2 focus-visible:ring-(--accent)"
                    >
                      <span>{settings.mapView}</span>
                      <ChevronDown
                        size={16}
                        className={`text-(--muted-foreground) transition-transform ${
                          showMapOptions ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {showMapOptions && (
                      <>
                        <button
                          type="button"
                          aria-label="Close map region menu"
                          className="fixed inset-0 z-10 cursor-default"
                          onClick={() => setShowMapOptions(false)}
                        />

                        <div
                          role="listbox"
                          aria-label="Default map region"
                          className="absolute right-0 bottom-full z-20 mb-2 w-full overflow-hidden rounded-xl border border-(--border) bg-(--surface-elevated) p-1 shadow-xl"
                        >
                          {MAP_OPTIONS.map((option) => (
                            <button
                              key={option}
                              type="button"
                              role="option"
                              aria-selected={settings.mapView === option}
                              onClick={() => {
                                updateSetting("mapView", option);
                                setShowMapOptions(false);
                              }}
                              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-(--surface) ${
                                settings.mapView === option
                                  ? "font-medium text-(--accent)"
                                  : "text-(--foreground)"
                              }`}
                            >
                              {option}
                              {settings.mapView === option && (
                                <Check size={15} />
                              )}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </SettingsSection>
            </div>

            {/* Summary panel */}
            <aside className="space-y-4">
              <div className="rounded-xl border border-(--border) bg-(--surface) p-4 sm:p-5">
                <div className="flex items-center gap-2">
                  <Activity size={17} className="text-(--accent)" />
                  <h2 className="text-sm font-semibold text-(--foreground)">
                    Configuration overview
                  </h2>
                </div>

                <p className="mt-1 text-xs text-(--muted-foreground)">
                  Your current preferences at a glance.
                </p>

                <div className="mt-4 space-y-0">
                  <SummaryRow
                    label="Auto refresh"
                    value={settings.autoRefresh ? "Enabled" : "Disabled"}
                    enabled={settings.autoRefresh}
                  />
                  <SummaryRow
                    label="Low severity"
                    value={settings.showLowSeverity ? "Included" : "Hidden"}
                    enabled={settings.showLowSeverity}
                  />
                  <SummaryRow
                    label="Emergency alerts"
                    value={settings.emergencyAlerts ? "Enabled" : "Disabled"}
                    enabled={settings.emergencyAlerts}
                  />
                  <SummaryRow
                    label="Daily summary"
                    value={settings.dailySummary ? "Enabled" : "Disabled"}
                    enabled={settings.dailySummary}
                  />
                  <SummaryRow
                    label="Map region"
                    value={settings.mapView}
                    enabled={true}
                    last
                  />
                </div>
              </div>

              <div className="rounded-xl border border-(--border) bg-(--surface) p-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={17} className="text-(--success)" />
                  <h2 className="text-sm font-semibold text-(--foreground)">
                    System status
                  </h2>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-(--success)" />
                  <span className="text-sm text-(--foreground)">
                    Monitoring dashboard
                  </span>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-(--muted-foreground)">
                  Changing these preferences does not change backend ingestion,
                  alert delivery, or the map until those features are connected
                  to these settings.
                </p>
              </div>
            </aside>
          </div>

          <p className="mt-6 text-center text-[11px] text-(--muted-foreground)">
            Disaster Watch · Monitoring preferences
          </p>
        </div>
      </main>
    </AppShell>
  );
}

function SettingsSection({ icon: Icon, title, description, children }) {
  return (
    <section className="relative rounded-xl border border-(--border) bg-(--surface) transition-colors duration-200 hover:border-(--accent)/30">
      <div className="flex items-start gap-3 border-b border-(--border) p-4 sm:p-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--surface-elevated) text-(--accent)">
          <Icon size={18} />
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-(--foreground)">{title}</h2>
          <p className="mt-1 text-xs leading-relaxed text-(--muted-foreground)">
            {description}
          </p>
        </div>
      </div>

      <div className="divide-y divide-(--border)">{children}</div>
    </section>
  );
}

function SettingToggle({ icon: Icon, title, description, enabled, onChange }) {
  return (
    <div className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
      <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--surface-elevated) text-(--muted-foreground) sm:flex">
        <Icon size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-(--foreground)">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-(--muted-foreground)">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={title}
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--surface) ${
          enabled
            ? "border-(--accent) bg-(--accent)"
            : "border-(--border) bg-(--surface-elevated)"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function SummaryRow({ label, value, enabled, last = false }) {
  return (
    <div
      className={`flex items-center justify-between gap-3 py-3 ${
        last ? "" : "border-b border-(--border)"
      }`}
    >
      <span className="text-xs text-(--muted-foreground)">{label}</span>

      <span
        className={`max-w-[58%] text-right text-xs font-medium ${
          enabled ? "text-(--foreground)" : "text-(--muted-foreground)"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
