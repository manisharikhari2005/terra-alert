"use client";

import {
  MapContainer,
  TileLayer,
  Circle,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";

import { useEffect } from "react";

function MapController({ userPosition, events }) {
  const map = useMap();

  useEffect(() => {
    if (!userPosition) return;

    const points = [
      [userPosition.latitude, userPosition.longitude],
      ...events
        .filter(
          (event) =>
            Number.isFinite(Number(event.latitude)) &&
            Number.isFinite(Number(event.longitude)),
        )
        .map((event) => [Number(event.latitude), Number(event.longitude)]),
    ];

    if (points.length === 1) {
      map.setView(points[0], 9);
      return;
    }

    map.fitBounds(points, {
      padding: [35, 35],
      maxZoom: 10,
    });
  }, [map, userPosition, events]);

  return null;
}

function getMarkerColor(severity) {
  switch (String(severity || "").toLowerCase()) {
    case "high":
      return "#f05252";
    case "medium":
      return "#f59e0b";
    case "low":
      return "#39b878";
    default:
      return "#a7adb5";
  }
}

export default function NearbyLeafletMap({
  userPosition,
  events = [],
  radius = 100,
}) {
  if (!userPosition) return null;

  const center = [userPosition.latitude, userPosition.longitude];

  return (
    <MapContainer
      key={`${userPosition.latitude}-${userPosition.longitude}`}
      center={center}
      zoom={9}
      scrollWheelZoom
      style={{
        height: "380px",
        width: "100%",
        background: "#202328",
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController userPosition={userPosition} events={events} />

      <Circle
        center={center}
        radius={radius * 1000}
        pathOptions={{
          color: "#e86a33",
          weight: 1.5,
          fillColor: "#e86a33",
          fillOpacity: 0.06,
        }}
      />

      <CircleMarker
        center={center}
        radius={9}
        pathOptions={{
          color: "#ffffff",
          weight: 3,
          fillColor: "#3b82f6",
          fillOpacity: 1,
        }}
      >
        <Popup>
          <strong>Your location</strong>
          <br />
          Current browser coordinates
        </Popup>
      </CircleMarker>

      {events.map((event) => {
        const latitude = Number(event.latitude);
        const longitude = Number(event.longitude);

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          return null;
        }

        return (
          <CircleMarker
            key={event.id}
            center={[latitude, longitude]}
            radius={7}
            pathOptions={{
              color: "#ffffff",
              weight: 1.5,
              fillColor: getMarkerColor(event.severity),
              fillOpacity: 0.9,
            }}
          >
            <Popup>
              <strong>{event.type || "Earthquake"}</strong>
              <br />
              {event.location || "Location unavailable"}
              <br />
              Severity: {event.severity || "Unknown"}
              <br />
              Distance:{" "}
              {Number.isFinite(Number(event.distance))
                ? `${Number(event.distance).toFixed(1)} km`
                : "Unavailable"}
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
