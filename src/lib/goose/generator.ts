// Deterministisch: zelfde geohash + level geeft altijd dezelfde gans
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(31, hash) + str.charCodeAt(i);
    hash |= 0; // 32-bit integer
  }
  return Math.abs(hash);
}

// Seeded pseudo-random reeks uit één integer
function seededSequence(seed: number) {
  let s = seed;
  return () => {
    s = Math.imul(1664525, s) + 1013904223;
    s |= 0;
    return Math.abs(s) / 0x80000000;
  };
}

const BODY_COLORS = ['#f5a623', '#7b61ff', '#00d4aa', '#ff6b6b', '#4ecdc4', '#a8dadc', '#e63946'];
const BACKGROUNDS = ['#0a0a0f', '#1a1a2e', '#16213e', '#0f3460', '#0d1b2a', '#1b2838'];
const BEAK_COLORS = ['#ff9500', '#ffb347', '#ffa07a'];

export interface GooseProps {
  bodyColor: string;
  bgColor: string;
  beakColor: string;
  eyeColor: string;
  accessory: 'none' | 'hat' | 'scarf' | 'crown' | 'halo';
  verificationLevel: 1 | 2 | 3 | 4;
  geohash: string;
}

export function getGooseProps(geohash: string, verificationLevel: 1 | 2 | 3 | 4): GooseProps {
  const seed = hashCode(geohash);
  const rng = seededSequence(seed);

  const bodyColor = BODY_COLORS[Math.floor(rng() * BODY_COLORS.length)];
  const bgColor = BACKGROUNDS[Math.floor(rng() * BACKGROUNDS.length)];
  const beakColor = BEAK_COLORS[Math.floor(rng() * BEAK_COLORS.length)];
  const eyeColor = verificationLevel >= 4 ? '#ffd700' : '#ffffff';

  // Accessoire schaalt mee met verificatieniveau — hogere levels zijn zeldzamer
  const accessories: GooseProps['accessory'][] = ['none', 'hat', 'scarf', 'crown', 'halo'];
  const accessory = accessories[verificationLevel - 1];

  return { bodyColor, bgColor, beakColor, eyeColor, accessory, verificationLevel, geohash };
}

function renderAccessory(type: GooseProps['accessory']): string {
  switch (type) {
    case 'hat':
      return `
        <rect x="56" y="18" width="18" height="3" rx="1" fill="#2c2c2c"/>
        <rect x="59" y="8" width="12" height="11" rx="2" fill="#1a1a1a"/>
      `;
    case 'scarf':
      return `
        <path d="M52 52 Q62 56 70 50 Q72 53 68 56 Q60 60 50 56 Z" fill="#e63946" opacity="0.9"/>
        <rect x="68" y="50" width="5" height="12" rx="2" fill="#e63946" opacity="0.85"/>
      `;
    case 'crown':
      return `
        <polygon points="57,22 60,12 63,19 67,10 71,19 74,12 77,22" fill="#ffd700" stroke="#e5a800" stroke-width="0.5"/>
        <rect x="57" y="21" width="20" height="4" rx="1" fill="#ffd700"/>
      `;
    case 'halo':
      return `
        <ellipse cx="67" cy="8" rx="12" ry="4" fill="none" stroke="#ffd700" stroke-width="2.5" opacity="0.9"/>
        <ellipse cx="67" cy="8" rx="12" ry="4" fill="none" stroke="#fff8dc" stroke-width="1" opacity="0.5"/>
      `;
    default:
      return '';
  }
}

function renderStars(level: 1 | 2 | 3 | 4): string {
  const filled = '#ffd700';
  const empty = '#444466';
  return Array.from({ length: 4 }, (_, i) => {
    const x = 26 + i * 13;
    return `<text x="${x}" y="95" font-size="11" text-anchor="middle" fill="${i < level ? filled : empty}">★</text>`;
  }).join('');
}

export function generateGoose(geohash: string, verificationLevel: 1 | 2 | 3 | 4): string {
  const props = getGooseProps(geohash, verificationLevel);
  return renderGooseSVG(props);
}

export function renderGooseSVG(props: GooseProps): string {
  const { bodyColor, bgColor, beakColor, eyeColor, accessory, verificationLevel } = props;

  // Lichte glinstering op het lichaam voor hogere levels
  const shimmer = verificationLevel >= 3
    ? `<ellipse cx="42" cy="58" rx="8" ry="5" fill="white" opacity="0.12"/>`
    : '';

  // Achtergrondgloed voor legendary (level 4)
  const glow = verificationLevel === 4
    ? `<circle cx="50" cy="50" r="48" fill="${bodyColor}" opacity="0.08"/>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Achtergrond -->
  <circle cx="50" cy="50" r="50" fill="${bgColor}"/>
  ${glow}

  <!-- Lichaam -->
  <ellipse cx="48" cy="66" rx="26" ry="20" fill="${bodyColor}"/>
  ${shimmer}

  <!-- Nek -->
  <path d="M58 55 Q68 50 68 40" stroke="${bodyColor}" stroke-width="10" fill="none" stroke-linecap="round"/>

  <!-- Hoofd -->
  <circle cx="67" cy="35" r="14" fill="${bodyColor}"/>

  <!-- Accessoire (onder hoofd, zodat crown/halo bovenop staat) -->
  ${renderAccessory(accessory)}

  <!-- Snavel -->
  <ellipse cx="81" cy="35" rx="8" ry="4" fill="${beakColor}"/>
  <line x1="73" y1="37" x2="89" y2="37" stroke="${bgColor}" stroke-width="1" opacity="0.4"/>

  <!-- Oog -->
  <circle cx="72" cy="31" r="4" fill="#111"/>
  <circle cx="72" cy="31" r="2.5" fill="${eyeColor}"/>
  <circle cx="73" cy="30" r="0.8" fill="white" opacity="0.9"/>

  <!-- Vleugeltip -->
  <path d="M30 68 Q22 75 28 80" stroke="${bodyColor}" stroke-width="5" fill="none" stroke-linecap="round"/>

  <!-- Staart -->
  <path d="M22 62 Q14 55 18 48" stroke="${bodyColor}" stroke-width="7" fill="none" stroke-linecap="round"/>

  <!-- Verificatiesterren -->
  ${renderStars(verificationLevel)}
</svg>`;
}
