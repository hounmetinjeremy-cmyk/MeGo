// Delivery-zone geometry helpers. Zones are stored as [lat, lng] polygons
// (see schema.sql). Point-in-polygon uses the standard ray-casting algorithm.

export function pointInPolygon(point: [number, number], polygon: [number, number][]): boolean {
  const [pLat, pLng] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [latI, lngI] = polygon[i];
    const [latJ, lngJ] = polygon[j];
    const intersects =
      latI > pLat !== latJ > pLat && pLng < ((lngJ - lngI) * (pLat - latI)) / (latJ - latI) + lngI;
    if (intersects) inside = !inside;
  }
  return inside;
}

/** The first zone (of `zones`) whose polygon contains `point`, if any. */
export function findZoneForPoint<T extends { coordinates: [number, number][] }>(
  point: [number, number],
  zones: T[],
): T | null {
  return zones.find((zone) => pointInPolygon(point, zone.coordinates)) ?? null;
}
