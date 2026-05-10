import { encode } from '../geohash';
import { IDIDHERE_KINDS } from './kinds';

export type Privacy = 'public' | 'friends' | 'private';

export interface CheckinEventParams {
  locationId: string;
  lat: number;
  lon: number;
  verificationLevel: 1 | 2 | 3 | 4;
  gooseId: string;
  privacy: Privacy;
  note?: string;
}

// Bouwt een unsigned kind-37516 check-in event (signing gebeurt vlak voor publish)
export function buildCheckinEvent(params: CheckinEventParams) {
  const geohash = encode(params.lat, params.lon, 7);

  return {
    kind: IDIDHERE_KINDS.CHECKIN,
    created_at: Math.floor(Date.now() / 1000),
    content: params.note ?? '',
    tags: [
      ['d', params.locationId],
      ['g', geohash],
      ['lat', params.lat.toFixed(6)],
      ['lon', params.lon.toFixed(6)],
      ['verification', String(params.verificationLevel) as '1' | '2' | '3' | '4'],
      ['goose', params.gooseId],
      ['privacy', params.privacy],
    ],
  };
}
