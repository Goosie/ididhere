import type { Location } from '../types/location';

export const MOCK_LOCATIONS: Location[] = [
  {
    id: 'u173z-begijnhof',
    name: 'Begijnhof',
    description: 'Stille middeleeuwse binnenhof verscholen achter een onopvallende deur aan het Spui. Oudste houten huis van Amsterdam staat hier.',
    lat: 52.3697, lon: 4.8898, geohash: 'u173z',
    category: 'hidden', checkinCount: 9, maxVerificationLevel: 3,
    isAiGenerated: false, tags: ['hidden', 'history', 'amsterdam'],
  },
  {
    id: 'u173y-albert-cuypmarkt',
    name: 'Albert Cuypmarkt',
    description: 'Grootste daagse markt van Nederland. Stroopwafels vers van de plaat, verse vis, en tweedehands vinyl voor een euro.',
    lat: 52.3556, lon: 4.8951, geohash: 'u173y',
    category: 'market', checkinCount: 14, maxVerificationLevel: 2,
    isAiGenerated: false, tags: ['market', 'food', 'local'],
  },
  {
    id: 'u17pw-ndsm-werf',
    name: 'NDSM-werf',
    description: 'Voormalige scheepswerf in Noord, nu vrijplaats voor kunstenaars. Neem de gratis pont achter Centraal — vijf minuten varen.',
    lat: 52.4014, lon: 4.8952, geohash: 'u17pw',
    category: 'culture', checkinCount: 5, maxVerificationLevel: 4,
    isAiGenerated: false, tags: ['art', 'industrial', 'noord'],
  },
  {
    id: 'u173m-vondelpark',
    name: 'Vondelpark — openluchttheater',
    description: 'Gratis concerten en voorstellingen van juni t/m augustus. Locals pikken een plekje op het gras met een fles wijn.',
    lat: 52.3582, lon: 4.8674, geohash: 'u173m',
    category: 'nature', checkinCount: 11, maxVerificationLevel: 2,
    isAiGenerated: true, tags: ['park', 'culture', 'free'],
  },
  {
    id: 'u173z-cafe-t-smalle',
    name: "Café 't Smalle",
    description: 'Proefhuisje uit 1786 aan de Egelantiersgracht. Terras hangt over het water. Geen muziek, geen wifi — gewoon het langzaamste terras van Amsterdam.',
    lat: 52.3748, lon: 4.8842, geohash: 'u173z',
    category: 'nightlife', checkinCount: 7, maxVerificationLevel: 3,
    isAiGenerated: false, tags: ['brown cafe', 'canal', 'historic'],
  },
];
