/** Route types + clustering shared by the React wrapper and the three.js scene (no three.js import). */

export type RouteStop = {
  /** Short label, e.g. "BOM" or "THANE". */
  code: string;
  city: string;
  lat: number;
  lon: number;
  /** Organisations at this stop, oldest first. */
  companies: string[];
  /** Positions held at each company (parallel to `companies`), oldest first. */
  roles: string[][];
  /** e.g. "'19–'21" */
  years: string;
};

export type Cluster = {
  /** Indexes into the stops array. */
  stops: number[];
  lat: number;
  lon: number;
  /** Max distance from the centre to any stop (km). */
  extentKm: number;
  /** Display name for the region when zoomed out. */
  name: string;
};

const EARTH_KM = 6371;
const rad = (d: number) => (d * Math.PI) / 180;

export function distanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Consecutive stops closer than `radiusKm` form one region. A region with several stops gets a
 * zoomed-in "local" view in the scene; on the global view it shows as a single label.
 */
export function clusterStops(stops: RouteStop[], regionNames: Record<string, string> = {}, radiusKm = 300): Cluster[] {
  const clusters: Cluster[] = [];
  stops.forEach((s, i) => {
    const last = clusters[clusters.length - 1];
    if (last && distanceKm(stops[last.stops[0]], s) < radiusKm) last.stops.push(i);
    else clusters.push({ stops: [i], lat: 0, lon: 0, extentKm: 0, name: "" });
  });
  for (const c of clusters) {
    c.lat = c.stops.reduce((a, i) => a + stops[i].lat, 0) / c.stops.length;
    c.lon = c.stops.reduce((a, i) => a + stops[i].lon, 0) / c.stops.length;
    c.extentKm = Math.max(...c.stops.map((i) => distanceKm(c, stops[i])));
    const first = stops[c.stops[0]];
    c.name = c.stops.length > 1 ? (regionNames[first.code] ?? first.city) : first.city;
  }
  return clusters;
}
