"use client";

// Import CSS inside client component; guard for SSR by relying on dynamic import in parent
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Polyline, CircleMarker, useMap } from "react-leaflet";

type LatLng = { lat: number; lng: number };

function computeCenter(points: LatLng[]): LatLng {
  if (points.length === 0) return { lat: 0, lng: 0 };
  const avgLat = points.reduce((s, p) => s + p.lat, 0) / points.length;
  const avgLng = points.reduce((s, p) => s + p.lng, 0) / points.length;
  return { lat: avgLat, lng: avgLng };
}

function FitBounds({ points }: { points: LatLng[] }) {
  const map = useMap();
  if (points.length >= 2) {
    const latLngs = points.map((p) => [p.lat, p.lng]) as [number, number][];
    // @ts-expect-error leaflet type inference
    map.fitBounds(latLngs, { padding: [12, 12] });
  } else if (points.length === 1) {
    map.setView([points[0].lat, points[0].lng], 11);
  }
  return null;
}

export default function MapSnippet({ points }: { points: LatLng[] }) {
  const center = computeCenter(points);
  return (
    <div className="h-40 overflow-hidden rounded-md border border-neutral-800">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={11}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        attributionControl={false}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {points.length >= 2 && (
          <Polyline positions={points.map((p) => [p.lat, p.lng])} pathOptions={{ color: "#60a5fa", weight: 3 }} />
        )}
        {points.map((p, idx) => (
          <CircleMarker key={`${p.lat}-${p.lng}-${idx}`} center={[p.lat, p.lng]} radius={5} pathOptions={{ color: "#93c5fd", fillColor: "#93c5fd" }} />
        ))}
        <FitBounds points={points} />
      </MapContainer>
    </div>
  );
}


