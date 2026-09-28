"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { mapEvents } from "@/data/mapEvents";

function getMarkerIcon(type) {
  let background = "#e86a33";

  if (type === "Earthquake") {
    background = "#f05252";
  }

  if (type === "Flood") {
    background = "#f59e0b";
  }

  if (type === "Wildfire") {
    background = "#39b878";
  }

  return L.divIcon({
    className: "",
    html: `
      <div
        style="
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: ${background};
          border: 2px solid #f4f1ea;
          box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.15);
          cursor: pointer;
        "
      ></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  });
}

export default function DisasterMap({ filter }) {
  const filteredEvents = mapEvents.filter((event) => {
    if (filter === "All Events") {
      return true;
    }

    return `${event.type}s` === filter;
  });

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      scrollWheelZoom={true}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {filteredEvents.map((event) => (
        <Marker
          key={event.id}
          position={[event.latitude, event.longitude]}
          icon={getMarkerIcon(event.type)}
          zIndexOffset={event.type === "Wildfire" ? 1000 : 0}
          eventHandlers={{
            click: (e) => {
              const map = e.target._map;

              if (map) {
                map.closePopup();
                e.target.openPopup();
              }
            },
          }}
        >
          <Popup>
            <div className="min-w-[190px] p-1">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-semibold">{event.type}</h3>

                <span className="text-xs font-medium">{event.severity}</span>
              </div>

              <p className="mt-1 text-xs text-gray-600">{event.location}</p>

              <div className="mt-3 border-t border-gray-200 pt-3">
                <p className="text-xs leading-5 text-gray-700">
                  {event.details}
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
      ))}
    </MapContainer>
  );
}
