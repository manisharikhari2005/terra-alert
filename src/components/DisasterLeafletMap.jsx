"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";

function MapView({ alerts }) {
  const map = useMap();

  useEffect(() => {
    if (!alerts.length) return;

    const bounds = alerts.map((alert) => [
      Number(alert.latitude),
      Number(alert.longitude),
    ]);

    map.fitBounds(bounds, {
      padding: [30, 30],
      maxZoom: 5,
    });
  }, [alerts, map]);

  return null;
}

export default function DisasterLeafletMap({ alerts }) {
  const validAlerts = alerts.filter(
    (alert) =>
      Number.isFinite(Number(alert.latitude)) &&
      Number.isFinite(Number(alert.longitude)) &&
      alert.latitude != null &&
      alert.longitude != null,
  );

  const center = validAlerts.length
    ? [Number(validAlerts[0].latitude), Number(validAlerts[0].longitude)]
    : [20, 0];

  return (
    <MapContainer
      center={center}
      zoom={2}
      scrollWheelZoom={false}
      className="h-56 w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapView alerts={validAlerts} />

      {validAlerts.map((alert) => (
        <CircleMarker
          key={alert.id}
          center={[Number(alert.latitude), Number(alert.longitude)]}
          radius={6}
          pathOptions={{
            color:
              alert.severity === "High"
                ? "#ef4444"
                : alert.severity === "Medium"
                  ? "#f59e0b"
                  : "#22c55e",
            fillColor:
              alert.severity === "High"
                ? "#ef4444"
                : alert.severity === "Medium"
                  ? "#f59e0b"
                  : "#22c55e",
            fillOpacity: 0.9,
            weight: 2,
          }}
        >
          <Popup>
            <strong>{alert.type || "Disaster Event"}</strong>
            <br />
            {alert.location || "Location unavailable"}
            <br />
            Severity: {alert.severity || "Unknown"}
            {alert.magnitude != null && (
              <>
                <br />
                Magnitude: {alert.magnitude}
              </>
            )}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
