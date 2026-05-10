export type LocationCategory = 'food' | 'nature' | 'culture' | 'nightlife' | 'market' | 'viewpoint' | 'hidden';

export interface Location {
  id: string;           // geohash + name slug
  name: string;
  description: string;
  lat: number;
  lon: number;
  geohash: string;
  category: LocationCategory;
  checkinCount: number;
  maxVerificationLevel: 1 | 2 | 3 | 4;
  authorPubkey?: string;
  isAiGenerated: boolean;
  tags: string[];
}

export type MapTab = 'nearby' | 'trending' | 'tippy';
