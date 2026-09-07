"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

/**
 * Free OpenStreetMap + Leaflet.draw equivalent of Enatega's
 * CustomGoogleMapsLocationZoneBounds (Google Maps polygon editor) — same
 * job (draw/edit one polygon for a delivery zone), no paid API key needed.
 * Coordinates are stored as [lat, lng] pairs, matching what MeGo's
 * worker/index.ts zones API expects.
 */
export default function ZoneMapEditor({
  coordinates,
  onChange,
}: {
  coordinates: [number, number][];
  onChange: (coordinates: [number, number][]) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    void (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet-draw");
      if (cancelled || !containerRef.current) return;

      // Default marker icons reference URLs that don't resolve under Next's
      // static export; point them at the CDN instead.
      delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const center: [number, number] = coordinates[0] ?? [6.3703, 2.3912]; // Cotonou
      map = L.map(containerRef.current).setView(center, coordinates.length ? 13 : 6);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);

      if (coordinates.length >= 3) {
        const polygon = L.polygon(coordinates);
        drawnItems.addLayer(polygon);
      }

      const drawControl = new L.Control.Draw({
        draw: {
          polygon: {},
          marker: false,
          circle: false,
          circlemarker: false,
          rectangle: false,
          polyline: false,
        },
        edit: { featureGroup: drawnItems },
      });
      map.addControl(drawControl);

      const emitChange = () => {
        const layers = drawnItems.getLayers() as import("leaflet").Polygon[];
        const polygon = layers[0];
        if (!polygon) {
          onChangeRef.current([]);
          return;
        }
        const latLngs = (polygon.getLatLngs()[0] as import("leaflet").LatLng[]).map(
          (p): [number, number] => [p.lat, p.lng],
        );
        onChangeRef.current(latLngs);
      };

      map.on(L.Draw.Event.CREATED, (e: import("leaflet").LeafletEvent) => {
        drawnItems.clearLayers(); // only one zone polygon at a time
        const layer = (e as unknown as { layer: import("leaflet").Layer }).layer;
        drawnItems.addLayer(layer);
        emitChange();
      });
      map.on(L.Draw.Event.EDITED, emitChange);
      map.on(L.Draw.Event.DELETED, emitChange);
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} style={{ height: 400, width: "100%", borderRadius: 8 }} />;
}
