export interface VerificationInput {
  userLat: number;
  userLon: number;
  targetLat: number;
  targetLon: number;
  isDevMode: boolean;
  wifiNetworks?: string[];
  previousCheckin?: {
    lat: number;
    lon: number;
    timestamp: number;
  };
}

export interface VerificationResult {
  score: number;
  level: 1 | 2 | 3 | 4;
  action: 'PROCEED' | 'STEP_UP' | 'DENY';
  reasons: string[];
}

// Haversine formule — afstand in meters tussen twee GPS coördinaten
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6_371_000; // aardstraal in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function scoreToLevel(score: number): 1 | 2 | 3 | 4 {
  if (score >= 0.9) return 4;
  if (score >= 0.7) return 3;
  if (score >= 0.5) return 2;
  return 1;
}

function scoreToAction(score: number): 'PROCEED' | 'STEP_UP' | 'DENY' {
  if (score >= 0.7) return 'PROCEED';
  if (score >= 0.4) return 'STEP_UP';
  return 'DENY';
}

export function calculateTrustScore(input: VerificationInput): VerificationResult {
  if (input.isDevMode) {
    return { score: 0, level: 1, action: 'DENY', reasons: ['Developer mode detected'] };
  }

  let score = 0;
  const reasons: string[] = [];

  // GPS afstandscheck
  const distance = haversineDistance(
    input.userLat, input.userLon,
    input.targetLat, input.targetLon,
  );

  if (distance <= 50) {
    score += 0.5;
  } else if (distance <= 100) {
    score += 0.2;
    reasons.push('Aan de rand van de locatie');
  } else {
    return { score: 0, level: 1, action: 'DENY', reasons: ['Te ver van de locatie'] };
  }

  // Teleportatie check
  if (input.previousCheckin) {
    const minutesElapsed = (Date.now() - input.previousCheckin.timestamp) / 1000 / 60;
    const distanceFromPrev = haversineDistance(
      input.previousCheckin.lat, input.previousCheckin.lon,
      input.userLat, input.userLon,
    );
    const maxRealisticDistanceMeters = (200 / 60) * minutesElapsed * 1000; // 200 km/h max

    if (distanceFromPrev > maxRealisticDistanceMeters) {
      return { score: 0, level: 1, action: 'DENY', reasons: ['Onmogelijke reissnelheid gedetecteerd'] };
    }
    score += 0.3;
  }

  // WiFi aanwezigheidsbonus
  if (input.wifiNetworks && input.wifiNetworks.length > 0) {
    score += 0.2;
  }

  return {
    score: Math.min(score, 1),
    level: scoreToLevel(score),
    action: scoreToAction(score),
    reasons,
  };
}
