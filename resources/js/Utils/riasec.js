export const RIASEC_ORDER = [
    'Realistic',
    'Investigative',
    'Artistic',
    'Social',
    'Enterprising',
    'Conventional',
];

export const RIASEC_META = {
    Realistic: {
        code: 'R',
        label: 'Realistik',
        labelMs: 'Realistik',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        primaryBadgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
        dotClass: 'bg-amber-500',
    },
    Investigative: {
        code: 'I',
        label: 'Investigatif',
        labelMs: 'Investigatif',
        badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
        primaryBadgeClass: 'bg-sky-100 text-sky-900 border-sky-300',
        dotClass: 'bg-sky-500',
    },
    Artistic: {
        code: 'A',
        label: 'Artistik',
        labelMs: 'Artistik',
        badgeClass: 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200',
        primaryBadgeClass: 'bg-fuchsia-100 text-fuchsia-900 border-fuchsia-300',
        dotClass: 'bg-fuchsia-500',
    },
    Social: {
        code: 'S',
        label: 'Sosial',
        labelMs: 'Sosial',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        primaryBadgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        dotClass: 'bg-emerald-500',
    },
    Enterprising: {
        code: 'E',
        label: 'Enterprising',
        labelMs: 'Enterprising',
        badgeClass: 'bg-orange-50 text-orange-800 border-orange-200',
        primaryBadgeClass: 'bg-orange-100 text-orange-900 border-orange-300',
        dotClass: 'bg-orange-500',
    },
    Conventional: {
        code: 'C',
        label: 'Konvensional',
        labelMs: 'Konvensional',
        badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        primaryBadgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300',
        dotClass: 'bg-indigo-500',
    },
};

/**
 * Extract ordered unique RIASEC types for a programme (Primary first, then Sub 1 & Sub 2).
 */
export function getProgrammeRiasecTypes(prog) {
    if (!prog) return [];

    if (Array.isArray(prog.riasec_types) && prog.riasec_types.length > 0) {
        return Array.from(new Set(prog.riasec_types.filter(Boolean)));
    }

    if (Array.isArray(prog.rules) && prog.rules.length > 0) {
        return Array.from(new Set(prog.rules.map((r) => r.riasec_type).filter(Boolean)));
    }

    const fallback = [
        prog.riasec_type,
        ...(Array.isArray(prog.sub_riasec_type) ? prog.sub_riasec_type : []),
    ].filter(Boolean);

    return Array.from(new Set(fallback));
}

/**
 * Compute Top N Holland traits from a scores object as fallback when topTraits prop isn't provided.
 */
export function computeTopTraitsFromScores(scores = {}, limit = 3) {
    if (!scores || typeof scores !== 'object') return [];

    const ranked = [...RIASEC_ORDER].sort((a, b) => {
        const diff = (Number(scores[b]) || 0) - (Number(scores[a]) || 0);
        if (diff !== 0) return diff;
        return RIASEC_ORDER.indexOf(a) - RIASEC_ORDER.indexOf(b);
    });

    const active = ranked
        .slice(0, limit)
        .filter((trait) => (Number(scores[trait]) || 0) > 0);

    const picked = active.length > 0 ? active : [ranked[0]];

    return picked.map((trait, index) => ({
        rank: index + 1,
        trait,
        code: RIASEC_META[trait]?.code || trait.slice(0, 1).toUpperCase(),
        score: Number(scores[trait]) || 0,
    }));
}

/**
 * Return human-readable Holland Code e.g. "A-S-E" from an array of trait names.
 */
export function formatHollandCode(traits = []) {
    return traits
        .map((t) => RIASEC_META[t]?.code || t?.slice(0, 1).toUpperCase())
        .filter(Boolean)
        .join('-');
}

