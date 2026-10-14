"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";

const STORAGE_KEY = "disaster-watch-settings";

const REGION_VIEWS = {
  Global: { center: [20, 0], zoom: 2 },
  India: { center: [22.5, 79], zoom: 4 },
  Asia: { center: [34, 100], zoom: 3 },
  "North America": { center: [40, -100], zoom: 3 },
  Europe: { center: [54, 15], zoom: 4 },
};

function getSavedMapView() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const settings = JSON.parse(saved);

      if (REGION_VIEWS[settings.mapView]) {
        return settings.mapView;
      }
    }
  } catch (error) {
    console.error("Could not read map settings:", error);
  }

  return "Global";
}

function getMarkerIcon() {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #f05252;
        border: 2px solid #f4f1ea;
        box-shadow: 0 0 0 4px rgba(240, 82, 82, 0.2);
        cursor: pointer;
      "></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  });
}

const earthquakeIcon = getMarkerIcon();

function MapRegionController({ region }) {
  const map = useMap();

  useEffect(() => {
    const view = REGION_VIEWS[region] || REGION_VIEWS.Global;

    map.setView(view.center, view.zoom, {
      animate: true,
    });
  }, [map, region]);

  return null;
}

export default function DisasterMap() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [region, setRegion] = useState("Global");

  useEffect(() => {
    const syncMapRegion = () => {
      setRegion(getSavedMapView());
    };

    syncMapRegion();

    window.addEventListener("disaster-watch-settings-changed", syncMapRegion);

    window.addEventListener("storage", syncMapRegion);

    return () => {
      window.removeEventListener(
        "disaster-watch-settings-changed",
        syncMapRegion,
      );

      window.removeEventListener("storage", syncMapRegion);
    };
  }, []);

  useEffect(() => {
    let active = true;

    const fetchEarthquakes = async () => {
      try {
        const response = await fetch(apiUrl("alerts"), {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch alerts");
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Invalid alerts response");
        }

        const validEvents = result.data.filter((event) => {
          const latitude = Number(event.latitude);
          const longitude = Number(event.longitude);

          return (
            event.type === "Earthquake" &&
            event.latitude !== null &&
            event.latitude !== undefined &&
            event.longitude !== null &&
            event.longitude !== undefined &&
            Number.isFinite(latitude) &&
            Number.isFinite(longitude) &&
            latitude >= -90 &&
            latitude <= 90 &&
            longitude >= -180 &&
            longitude <= 180
          );
        });

        if (active) {
          setEvents(validEvents);
          setError(false);
        }
      } catch (err) {
        console.error("Map alerts fetch failed:", err);

        if (active) {
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchEarthquakes();

    const intervalId = setInterval(fetchEarthquakes, 5 * 60 * 1000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, []);

  const initialView = REGION_VIEWS[region] || REGION_VIEWS.Global;

  return (
    <>
      {loading && events.length === 0 && (
        <div className="absolute left-3 top-3 z-[1000] rounded-lg border border-(--border) bg-(--surface) px-3 py-2 text-xs text-(--foreground)">
          Loading earthquake locations...
        </div>
      )}

      {error && (
        <div className="absolute left-3 top-3 z-[1000] rounded-lg border border-red-300 bg-(--surface) px-3 py-2 text-xs text-(--foreground)">
          Unable to refresh map data. Check backend connection.
        </div>
      )}

      <MapContainer
        center={initialView.center}
        zoom={initialView.zoom}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <MapRegionController region={region} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {events.map((event) => {
          const latitude = Number(event.latitude);
          const longitude = Number(event.longitude);
          const magnitude = Number(event.magnitude);

          return (
            <Marker
              key={event.id}
              position={[latitude, longitude]}
              icon={earthquakeIcon}
            >
              <Popup>
                <div className="min-w-[190px] p-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold">Earthquake</h3>

                    <span className="text-xs font-semibold">
                      {Number.isFinite(magnitude)
                        ? `M ${magnitude.toFixed(1)}`
                        : event.severity}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-gray-600">
                    {event.location || "Location unavailable"}
                  </p>

                  <p className="mt-2 text-xs text-gray-600">
                    Severity: {event.severity}
                  </p>

                  <p className="mt-2 text-xs text-gray-600">
                    Reported:{" "}
                    {event.occurred_at
                      ? new Date(event.occurred_at).toLocaleString()
                      : "Unavailable"}
                  </p>

                  <div className="mt-3 border-t border-gray-200 pt-3">
                    <p className="text-xs leading-5 text-gray-700">
                      {event.details || "No additional details"}
                    </p>
                  </div>

                  <Link
                    href={`/alerts/${event.id}`}
                    className="mt-3 inline-block text-xs font-medium"
                  >
                    View alert details →
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {!loading && !error && events.length === 0 && (
        <div className="absolute bottom-3 left-3 z-[1000] rounded-lg border border-(--border) bg-(--surface) px-3 py-2 text-xs text-(--foreground)">
          No earthquake locations available.
        </div>
      )}
    </>
  );
}
