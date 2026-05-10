import type { Location } from '../types/location';

export const MOCK_LOCATIONS: Location[] = [
  {
    id: 'u172s-dorpstraat-35',
    name: 'Dorpstraat 35',
    description: 'Het startpunt van IDidHere in Nieuw-Vennep. Klik IDidHere om je eerste gans te verdienen.',
    lat: 52.2678, lon: 4.6358, geohash: 'u172s',
    category: 'hidden', checkinCount: 1, maxVerificationLevel: 4,
    isAiGenerated: false, tags: ['start', 'ididhere', 'nieuw-vennep'],
  },
  {
    id: 'u172s-de-dorpskerk',
    name: 'De Dorpskerk',
    description: 'Kleine karakteristieke kerk aan de Dorpstraat. Rustpunt midden in het dorp.',
    lat: 52.2681, lon: 4.6354, geohash: 'u172s',
    category: 'culture', checkinCount: 3, maxVerificationLevel: 2,
    isAiGenerated: false, tags: ['kerk', 'cultuur', 'nieuw-vennep'],
  },
  {
    id: 'u172s-buurtcafe-de-molen',
    name: 'Buurtcafé De Molen',
    description: 'Gezellig buurtcafé op loopafstand van de Dorpstraat. Locals komen hier na het werk.',
    lat: 52.2675, lon: 4.6362, geohash: 'u172s',
    category: 'nightlife', checkinCount: 5, maxVerificationLevel: 2,
    isAiGenerated: false, tags: ['cafe', 'lokaal', 'bier'],
  },
  {
    id: 'u172s-groenteboer-vennep',
    name: 'Groenteboer Vennep',
    description: 'Lokale groenteboer met seizoensproducten uit de Haarlemmermeer polder. Verse aardappels, geen supermarkt.',
    lat: 52.2676, lon: 4.6352, geohash: 'u172s',
    category: 'market', checkinCount: 8, maxVerificationLevel: 3,
    isAiGenerated: false, tags: ['markt', 'groente', 'lokaal'],
  },
  {
    id: 'u172s-polderpark',
    name: 'Polderpark Nieuw-Vennep',
    description: 'Groen park aan de rand van het dorp. Fietspad langs de sloot, reigers en eenden garantie.',
    lat: 52.2682, lon: 4.6360, geohash: 'u172s',
    category: 'nature', checkinCount: 6, maxVerificationLevel: 2,
    isAiGenerated: true, tags: ['park', 'polder', 'natuur'],
  },
];
