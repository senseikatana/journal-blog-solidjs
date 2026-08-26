export const patterns = ["dots", "lines", "grid", "circles", "waves", "triangles"] as const;
export type Pattern = (typeof patterns)[number];

/**
 * Genera un hash determinista a partir del uid del post.
 * Cada post produce una semilla distinta para variar la geometría del
 * banner, de modo que ninguna card repite el mismo dibujo.
 */
function hashId(uid: string): number {
  let hash = 0;
  for (let i = 0; i < uid.length; i += 1) {
    hash = (hash * 31 + uid.charCodeAt(i)) % 1_000_000;
  }
  return Math.abs(hash);
}

function dots(color: string, uid: string, seed: number): string {
  const spacing = 14 + (seed % 9);
  const r = 1.4 + (seed % 4) * 0.3;
  const ox = seed % 10;
  const oy = Math.floor(seed / 8) % 10;
  return `<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
      <defs><pattern id="p-${uid}" x="${ox}" y="${oy}" width="${spacing}" height="${spacing}" patternUnits="userSpaceOnUse">
        <circle cx="10" cy="10" r="${r}" fill="${color}" opacity="0.5"/>
      </pattern></defs>
      <rect width="320" height="180" fill="url(#p-${uid})"/>
      <circle cx="${180 + (seed % 100)}" cy="${60 + (seed % 70)}" r="${40 + (seed % 30)}" fill="${color}" opacity="0.15"/>
      <circle cx="${180 + (seed % 100)}" cy="${60 + (seed % 70)}" r="${18 + (seed % 16)}" fill="${color}" opacity="0.3"/>
    </svg>`;
}

function lines(color: string, _uid: string, seed: number): string {
  const count = 9 + (seed % 7);
  const tilt = (seed % 5) * 3;
  const paths = Array.from(
    { length: count },
    (_, i) =>
      `<line x1="0" y1="${i * 16}" x2="320" y2="${i * 16 + 30 + tilt}" stroke="${color}" stroke-width="0.8" opacity="${0.15 + (i % 3) * 0.1}"/>`,
  ).join("");
  return `<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">${paths}</svg>`;
}

function grid(color: string, uid: string, seed: number): string {
  const cell = 12 + (seed % 7);
  const x1 = 60 + (seed % 120);
  const y1 = 20 + (seed % 60);
  return `<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
      <defs><pattern id="g-${uid}" x="0" y="0" width="${cell}" height="${cell}" patternUnits="userSpaceOnUse">
        <path d="M0 0H${cell}M0 0V${cell}" stroke="${color}" stroke-width="0.6" opacity="0.4"/>
      </pattern></defs>
      <rect width="320" height="180" fill="url(#g-${uid})"/>
      <rect x="${x1}" y="${y1}" width="${60 + (seed % 30)}" height="${80 + (seed % 30)}" fill="${color}" opacity="0.18"/>
      <rect x="${x1 + 14}" y="${y1 + 14}" width="${60 + (seed % 30)}" height="${80 + (seed % 30)}" fill="${color}" opacity="0.12"/>
    </svg>`;
}

function circles(color: string, _uid: string, seed: number): string {
  const count = 10 + (seed % 8);
  const base = 20 + (seed % 20);
  const shapes = Array.from(
    { length: count },
    (_, i) =>
      `<circle cx="${base + i * ((300 - base) / count)}" cy="${90 + Math.sin(i + seed) * 40}" r="${8 + Math.cos(i + seed) * 4}" fill="none" stroke="${color}" stroke-width="1" opacity="${0.2 + Math.sin(i + seed) * 0.15}"/>`,
  ).join("");
  return `<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">${shapes}</svg>`;
}

function waves(color: string, _uid: string, seed: number): string {
  const count = 5 + (seed % 4);
  const amp = 8 + (seed % 14);
  const paths = Array.from(
    { length: count },
    (_, i) =>
      `<path d="M0 ${30 + i * 24} Q 80 ${10 + i * 24 + amp} 160 ${30 + i * 24} T 320 ${30 + i * 24}" fill="none" stroke="${color}" stroke-width="1.2" opacity="${0.25 + i * 0.08}"/>`,
  ).join("");
  return `<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">${paths}</svg>`;
}

function triangles(color: string, _uid: string, seed: number): string {
  const count = 8 + (seed % 6);
  const height = 14 + (seed % 12);
  const shapes = Array.from(
    { length: count },
    (_, i) =>
      `<polygon points="${20 + i * 30},${90 + Math.sin(i + seed) * 20} ${40 + i * 30},90 ${20 + i * 30},${90 - Math.sin(i + seed) * 20 - height / 2}" fill="${color}" opacity="${0.2 + (i % 3) * 0.1}"/>`,
  ).join("");
  return `<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">${shapes}</svg>`;
}

const patternFns: Record<Pattern, (color: string, uid: string, seed: number) => string> = {
  dots,
  lines,
  grid,
  circles,
  waves,
  triangles,
};

export function makeBanner(pattern: Pattern, color: string, uid: string): string {
  const seed = hashId(uid);
  return (patternFns[pattern] ?? patternFns.dots)(color, uid, seed);
}
