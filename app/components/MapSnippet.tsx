"use client";

// Lightweight Leaflet map snippet, loaded dynamically on the client to avoid SSR issues.
// Shows markers and an optional line between points (for road trips).

import { useEffect, useMemo, useState } from "react";

type LatLng = { lat: number; lng: number };

function computeCenter(points: LatLng[]): LatLng {
  // Average latitude/longitude for a simple initial center
  if (points.length === 0) return { lat: 0, lng: 0 };
  const avgLat = points.reduce((s, p) => s + p.lat, 0) / points.length;
  const avgLng = points.reduce((s, p) => s + p.lng, 0) / points.length;
  return { lat: avgLat, lng: avgLng };
}

export default function MapSnippet({ points }: { points: LatLng[] }) {
  const [leaflet, setLeaflet] = useState<any>(null);
  const center = useMemo(() => computeCenter(points), [points]);

  useEffect(() => {
    // Load leaflet resources only in the browser
    let active = true;
    (async () => {
      if (typeof window === "undefined") return;
      // Load CSS and react-leaflet on client only
      await import("leaflet/dist/leaflet.css");
      const mod = await import("react-leaflet");
      if (!active) return;
      setLeaflet(mod);
    })();
    return () => {
      active = false;
    };
  }, []);

  if (!leaflet) {
    return <div className="overflow-hidden rounded-md border border-neutral-800" style={{ height: 160 }} />;
  }

  const { MapContainer, TileLayer, Polyline, CircleMarker, useMap } = leaflet;

  const FitBounds = ({ points: pts }: { points: LatLng[] }) => {
    const map = useMap();
    if (pts.length >= 2) {
      const latLngs = pts.map((p) => [p.lat, p.lng]) as [number, number][];
      // @ts-expect-error leaflet type inference
      map.fitBounds(latLngs, { padding: [12, 12] });
    } else if (pts.length === 1) {
      map.setView([pts[0].lat, pts[0].lng], 11);
    }
    return null;
  };

  return (
    <div className="overflow-hidden rounded-md border border-neutral-800" style={{ height: 160 }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={11}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        attributionControl={false}
        className="h-full w-full"
        key={JSON.stringify(points)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
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


