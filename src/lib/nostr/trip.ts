function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export interface TripEventParams {
  destination: string;
  startDate?: string;  // YYYY-MM-DD
  endDate?: string;    // YYYY-MM-DD
}

// Bouwt een unsigned NIP-52 kind-31922 (date-based calendar event) voor een reis
export function buildTripEvent(params: TripEventParams): {
  event: {
    kind: 31922;
    created_at: number;
    content: string;
    tags: string[][];
  };
  tripId: string;
} {
  const tripId = `${slugify(params.destination)}-${Date.now()}`;

  const tags: string[][] = [
    ['d', tripId],
    ['name', `Reis naar ${params.destination}`],
    ['location', params.destination],
    ['t', 'ididhere-trip'],
  ];

  if (params.startDate) tags.push(['start', params.startDate]);
  if (params.endDate) tags.push(['end', params.endDate]);

  return {
    event: {
      kind: 31922,
      created_at: Math.floor(Date.now() / 1000),
      content: `Reis naar ${params.destination}`,
      tags,
    },
    tripId,
  };
}

// Bouwt een unsigned kind-37517 bucketlist item gekoppeld aan een trip
export function buildBucketlistItemEvent(params: {
  locationId: string;
  tripId?: string;
  privacy?: 'public' | 'friends' | 'private';
}) {
  const tags: string[][] = [
    ['d', `bucket-${params.locationId}-${Date.now()}`],
    ['e', params.locationId],
    ['privacy', params.privacy ?? 'public'],
    ['status', 'todo'],
  ];

  if (params.tripId) tags.push(['trip', params.tripId]);

  return {
    kind: 37517 as const,
    created_at: Math.floor(Date.now() / 1000),
    content: '',
    tags,
  };
}
