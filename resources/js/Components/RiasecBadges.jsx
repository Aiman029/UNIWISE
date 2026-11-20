import React from 'react';
import { Check, Compass } from 'lucide-react';
import { RIASEC_META, getProgrammeRiasecTypes } from '@/Utils/riasec';

/**
 * Displays all 2-3 Holland RIASEC badges for a programme (Primary + Sub-traits),
 * highlighting matched traits when student top traits or riasec_match data are present.
 */
export default function RiasecBadges({
    programme,
    matchedTraits = null,
    showPrimaryTag = true,
    showMatchScore = false,
    dark = false,
    compact = false,
}) {
    const types = getProgrammeRiasecTypes(programme);

    if (types.length === 0) {
        return null;
    }

    const activeMatched = Array.isArray(matchedTraits)
        ? matchedTraits
        : programme?.riasec_match?.matched_traits || [];

    const matchInfo = programme?.riasec_match;

    return (
        <div className="flex flex-wrap items-center gap-1.5">
            {types.map((type, idx) => {
                const meta = RIASEC_META[type] || {
                    code: type.slice(0, 1).toUpperCase(),
                    label: type,
                    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
                    primaryBadgeClass: 'bg-slate-200 text-slate-900 border-slate-300',
                    dotClass: 'bg-slate-500',
                };

                const isPrimary = idx === 0;
                const isMatched = activeMatched.includes(type);

                const badgeColors = dark
                    ? isPrimary
                        ? 'bg-white/25 text-white border-white/40'
                        : 'bg-white/10 text-sky-100 border-white/25'
                    : isPrimary
                    ? meta.primaryBadgeClass
                    : meta.badgeClass;

                return (
                    <React.Fragment key={type}>
                        {idx > 0 && (
                            <span
                                className={`text-[10px] font-black select-none ${
                                    dark ? 'text-sky-200/80' : 'text-slate-300'
                                }`}
                                aria-hidden="true"
                            >
                                +
                            </span>
                        )}
                        <span
                            title={
                                isPrimary
                                    ? `RIASEC Utama: ${meta.label} (${meta.labelMs})`
                                    : `Sub-RIASEC ${idx}: ${meta.label} (${meta.labelMs})`
                            }
                            className={`inline-flex items-center gap-1 rounded-md border font-bold transition ${
                                compact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-[11px]'
                            } ${badgeColors} ${
                                isMatched && !dark ? 'ring-1 ring-emerald-400/70' : ''
                            }`}
                        >
                            <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                    dark ? 'bg-amber-300' : meta.dotClass
                                }`}
                            />
                            <span>{meta.label}</span>
                            {isPrimary && showPrimaryTag && (
                                <span
                                    className={`text-[9px] uppercase tracking-wide px-1 rounded ${
                                        dark
                                            ? 'bg-amber-400/30 text-amber-200'
                                            : 'bg-white/70 text-slate-700'
                                    }`}
                                >
                                    Utama
                                </span>
                            )}
                            {isMatched && (
                                <Check
                                    className={`w-3 h-3 shrink-0 ${
                                        dark ? 'text-emerald-300' : 'text-emerald-600'
                                    }`}
                                />
                            )}
                        </span>
                    </React.Fragment>
                );
            })}

            {showMatchScore && matchInfo && (
                <span
                    className={`ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${
                        dark
                            ? 'bg-emerald-500/25 text-emerald-200 border-emerald-300/40'
                            : matchInfo.is_full_match
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-sky-50 text-sky-800 border-sky-200'
                    }`}
                >
                    <Compass className="w-3 h-3 shrink-0" />
                    <span>
                        {matchInfo.matched_count}/{matchInfo.total_traits} Sepadan ({matchInfo.score}%)
                    </span>
                </span>
            )}
        </div>
    );
}

