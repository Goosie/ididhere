const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

export function encode(lat: number, lon: number, precision = 7): string {
  let minLat = -90, maxLat = 90;
  let minLon = -180, maxLon = 180;
  let hash = '';
  let bits = 0;
  let bitsTotal = 0;
  let hashValue = 0;
  let isEven = true;

  while (hash.length < precision) {
    if (isEven) {
      const mid = (minLon + maxLon) / 2;
      if (lon > mid) { hashValue = (hashValue << 1) | 1; minLon = mid; }
      else { hashValue = hashValue << 1; maxLon = mid; }
    } else {
      const mid = (minLat + maxLat) / 2;
      if (lat > mid) { hashValue = (hashValue << 1) | 1; minLat = mid; }
      else { hashValue = hashValue << 1; maxLat = mid; }
    }
    isEven = !isEven;
    if (++bits === 5) {
      hash += BASE32[hashValue];
      bits = 0;
      hashValue = 0;
    }
    bitsTotal++;
  }
  // suppress unused warning
  void bitsTotal;
  return hash;
}

export function decode(geohash: string): { lat: number; lon: number } {
  let minLat = -90, maxLat = 90;
  let minLon = -180, maxLon = 180;
  let isEven = true;

  for (const char of geohash) {
    const idx = BASE32.indexOf(char);
    for (let bits = 4; bits >= 0; bits--) {
      const bit = (idx >> bits) & 1;
      if (isEven) {
        const mid = (minLon + maxLon) / 2;
        if (bit) minLon = mid; else maxLon = mid;
      } else {
        const mid = (minLat + maxLat) / 2;
        if (bit) minLat = mid; else maxLat = mid;
      }
      isEven = !isEven;
    }
  }
  return {
    lat: (minLat + maxLat) / 2,
    lon: (minLon + maxLon) / 2,
  };
}

export function distanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}
