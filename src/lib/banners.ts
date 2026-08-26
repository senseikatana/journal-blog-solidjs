export const patterns = ['dots', 'lines', 'grid', 'circles', 'waves', 'triangles'] as const;
export type Pattern = (typeof patterns)[number];

function dots(color: string, uid: string): string {
	return `<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
      <defs><pattern id="p-${uid}" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="10" cy="10" r="1.6" fill="${color}" opacity="0.5"/>
      </pattern></defs>
      <rect width="320" height="180" fill="url(#p-${uid})"/>
      <circle cx="220" cy="90" r="60" fill="${color}" opacity="0.15"/>
      <circle cx="220" cy="90" r="30" fill="${color}" opacity="0.3"/>
    </svg>`;
}

function lines(color: string): string {
	const paths = Array.from(
		{ length: 12 },
		(_, i) =>
			`<line x1="0" y1="${i * 16}" x2="320" y2="${i * 16 + 30}" stroke="${color}" stroke-width="0.8" opacity="${0.15 + (i % 3) * 0.1}"/>`,
	).join('');
	return `<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">${paths}</svg>`;
}

function grid(color: string, uid: string): string {
	return `<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
      <defs><pattern id="g-${uid}" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
        <path d="M0 0H16M0 0V16" stroke="${color}" stroke-width="0.6" opacity="0.4"/>
      </pattern></defs>
      <rect width="320" height="180" fill="url(#g-${uid})"/>
      <rect x="120" y="40" width="80" height="100" fill="${color}" opacity="0.18"/>
      <rect x="140" y="60" width="80" height="100" fill="${color}" opacity="0.12"/>
    </svg>`;
}

function circles(color: string): string {
	const shapes = Array.from(
		{ length: 14 },
		(_, i) =>
			`<circle cx="${30 + i * 22}" cy="${90 + Math.sin(i) * 40}" r="${8 + Math.cos(i) * 4}" fill="none" stroke="${color}" stroke-width="1" opacity="${0.2 + Math.sin(i) * 0.15}"/>`,
	).join('');
	return `<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">${shapes}</svg>`;
}

function waves(color: string): string {
	const paths = Array.from(
		{ length: 6 },
		(_, i) =>
			`<path d="M0 ${30 + i * 24} Q 80 ${10 + i * 24} 160 ${30 + i * 24} T 320 ${30 + i * 24}" fill="none" stroke="${color}" stroke-width="1.2" opacity="${0.25 + i * 0.08}"/>`,
	).join('');
	return `<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">${paths}</svg>`;
}

function triangles(color: string): string {
	const shapes = Array.from(
		{ length: 10 },
		(_, i) =>
			`<polygon points="${20 + i * 30},${90 + Math.sin(i) * 20} ${40 + i * 30},90 ${20 + i * 30},${90 - Math.sin(i) * 20}" fill="${color}" opacity="${0.2 + (i % 3) * 0.1}"/>`,
	).join('');
	return `<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">${shapes}</svg>`;
}

const patternFns: Record<Pattern, (color: string, uid: string) => string> = {
	dots,
	lines,
	grid,
	circles,
	waves,
	triangles,
};

export function makeBanner(pattern: Pattern, color: string, uid: string): string {
	return (patternFns[pattern] ?? patternFns.dots)(color, uid);
}
