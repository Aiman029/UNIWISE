import React from 'react';

const CATEGORIES = [
    { key: 'Realistic', label: 'Realistic (R)' },
    { key: 'Investigative', label: 'Investigative (I)' },
    { key: 'Artistic', label: 'Artistic (A)' },
    { key: 'Social', label: 'Social (S)' },
    { key: 'Enterprising', label: 'Enterprising (E)' },
    { key: 'Conventional', label: 'Conventional (C)' },
];

export default function RiasecRadarChart({ scores = {}, size = 320 }) {
    const center = size / 2;
    const radius = (size / 2) - 45;
    const maxVal = 5; // Standard 5 questions per category in seeder

    const angleStep = (Math.PI * 2) / 6;

    // Helper to get point on radar
    const getPoint = (index, value) => {
        const angle = index * angleStep - Math.PI / 2;
        const r = (Math.max(0, Math.min(value, maxVal)) / maxVal) * radius;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return { x, y };
    };

    // Calculate data points
    const dataPoints = CATEGORIES.map((cat, i) => {
        const val = scores ? (scores[cat.key] ?? 0) : 0;
        return getPoint(i, val);
    });

    const polygonPoints = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

    // Concentric level circles/polygons (20%, 40%, 60%, 80%, 100%)
    const levels = [1, 2, 3, 4, 5];

    return (
        <div className="flex flex-col items-center justify-center">
            <svg width={size} height={size} className="overflow-visible select-none">
                {/* Background Concentric Webs */}
                {levels.map(level => {
                    const levelPoints = CATEGORIES.map((_, i) => {
                        const pt = getPoint(i, level);
                        return `${pt.x},${pt.y}`;
                    }).join(' ');

                    return (
                        <polygon
                            key={`level-${level}`}
                            points={levelPoints}
                            fill={level === 5 ? '#f8fafc' : 'none'}
                            stroke="#e2e8f0"
                            strokeWidth="1.2"
                            strokeDasharray={level < 5 ? '3 3' : 'none'}
                        />
                    );
                })}

                {/* Axis Spokes from center to vertex */}
                {CATEGORIES.map((_, i) => {
                    const pt = getPoint(i, maxVal);
                    return (
                        <line
                            key={`spoke-${i}`}
                            x1={center}
                            y1={center}
                            x2={pt.x}
                            y2={pt.y}
                            stroke="#cbd5e1"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Filled Radar Data Polygon */}
                {polygonPoints && (
                    <polygon
                        points={polygonPoints}
                        fill="rgba(79, 70, 229, 0.35)"
                        stroke="#4f46e5"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                    />
                )}

                {/* Vertex Dots */}
                {dataPoints.map((pt, i) => (
                    <circle
                        key={`dot-${i}`}
                        cx={pt.x}
                        cy={pt.y}
                        r="4.5"
                        fill="#4338ca"
                        stroke="#ffffff"
                        strokeWidth="2"
                    />
                ))}

                {/* Category Labels */}
                {CATEGORIES.map((cat, i) => {
                    const angle = i * angleStep - Math.PI / 2;
                    const labelR = radius + 24;
                    const lx = center + labelR * Math.cos(angle);
                    const ly = center + labelR * Math.sin(angle);
                    const score = scores ? (scores[cat.key] ?? 0) : 0;

                    return (
                        <text
                            key={`label-${cat.key}`}
                            x={lx}
                            y={ly + 4}
                            textAnchor="middle"
                            className="text-xs font-semibold fill-slate-700"
                            fontSize="11"
                        >
                            {cat.key.slice(0, 4)}: {score}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
}
