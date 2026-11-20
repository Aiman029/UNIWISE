import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Compass,
    GraduationCap,
    CheckCircle,
    ArrowRight,
    BookOpen,
    Sparkles,
    School,
    Award,
    TrendingUp,
    Target,
    Layers,
    ChevronRight,
    Wrench,
    Microscope,
    Palette,
    Users,
    Briefcase,
    Calculator,
    Zap,
    RotateCw,
} from 'lucide-react';

function describeArc(cx, cy, rInner, rOuter, startAngle, endAngle) {
    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
        const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
        return {
            x: Number((centerX + radius * Math.cos(angleInRadians)).toFixed(2)),
            y: Number((centerY + radius * Math.sin(angleInRadians)).toFixed(2)),
        };
    };

    const startOuter = polarToCartesian(cx, cy, rOuter, startAngle);
    const endOuter = polarToCartesian(cx, cy, rOuter, endAngle);
    const startInner = polarToCartesian(cx, cy, rInner, endAngle);
    const endInner = polarToCartesian(cx, cy, rInner, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
        'M', startOuter.x, startOuter.y,
        'A', rOuter, rOuter, 0, largeArcFlag, 1, endOuter.x, endOuter.y,
        'L', startInner.x, startInner.y,
        'A', rInner, rInner, 0, largeArcFlag, 0, endInner.x, endInner.y,
        'Z',
    ].join(' ');
}

export default function Welcome() {
    const [selectedTraitIndex, setSelectedTraitIndex] = useState(2); // Mula pada 'A' (Artistik)
    const [wheelRotation, setWheelRotation] = useState(-150); // Setel 'A' (index 2) di posisi atas 12 o'clock

    const riasecTraits = [
        {
            code: 'R',
            name: 'Realistic',
            label: 'Realistik',
            desc: 'Praktikal, fizikal, meminati mesin, alatan mekanikal & teknologi.',
            career: 'Kejuruteraan, Teknologi Maklumat, Senibina',
            careers: ['Kejuruteraan Mekanikal', 'Sains Komputer & Rangkaian', 'Senibina & Rekabentuk'],
            icon: Wrench,
            color: 'from-orange-500 via-amber-500 to-red-500',
            bg: 'bg-orange-50/80',
            sliceColorStart: '#f97316',
            sliceColorEnd: '#ea580c',
            activeGradient: 'bg-gradient-to-r from-orange-500 via-amber-500 to-red-500',
            border: 'border-orange-200',
            badge: 'bg-orange-600 text-white',
            accentText: 'text-orange-400',
            glowRing: 'ring-orange-400 border-orange-400 shadow-orange-500/30',
            tagClass: 'bg-orange-500/15 border-orange-400/30 text-orange-200 hover:bg-orange-500/25',
            glowBlob: 'bg-orange-500/25',
            meterGradient: 'from-orange-500 via-amber-400 to-yellow-400',
            compatibility: '94% Kesepaduan Teknikal',
        },
        {
            code: 'I',
            name: 'Investigative',
            label: 'Investigatif',
            desc: 'Analitikal, saintifik, penyelidikan & penyelesaian masalah logik.',
            career: 'Sains Komputer, Perubatan, Bioteknologi',
            careers: ['Sains Komputer & AI', 'Perubatan & Kesihatan', 'Bioteknologi Penyelidikan'],
            icon: Microscope,
            color: 'from-sky-500 via-blue-600 to-indigo-600',
            bg: 'bg-sky-50/80',
            sliceColorStart: '#38bdf8',
            sliceColorEnd: '#0284c7',
            activeGradient: 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600',
            border: 'border-sky-200',
            badge: 'bg-sky-600 text-white',
            accentText: 'text-sky-300',
            glowRing: 'ring-sky-400 border-sky-400 shadow-sky-500/30',
            tagClass: 'bg-sky-500/15 border-sky-400/30 text-sky-200 hover:bg-sky-500/25',
            glowBlob: 'bg-sky-500/25',
            meterGradient: 'from-sky-400 via-blue-500 to-indigo-400',
            compatibility: '96% Analitikal & Saintifik',
        },
        {
            code: 'A',
            name: 'Artistic',
            label: 'Artistik',
            desc: 'Kreatif, imaginatif, bebas berekspresi, reka bentuk & media seni.',
            career: 'Reka Bentuk Grafik, Seni Kreatif, Multimedia',
            careers: ['Reka Bentuk Grafik & UI', 'Animasi & Industri Kreatif', 'Seni Bina & Seni Halus'],
            icon: Palette,
            color: 'from-purple-500 via-fuchsia-500 to-pink-500',
            bg: 'bg-purple-50/80',
            sliceColorStart: '#c084fc',
            sliceColorEnd: '#9333ea',
            activeGradient: 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500',
            border: 'border-purple-200',
            badge: 'bg-purple-600 text-white',
            accentText: 'text-fuchsia-300',
            glowRing: 'ring-purple-400 border-purple-400 shadow-purple-500/30',
            tagClass: 'bg-purple-500/15 border-purple-400/30 text-purple-200 hover:bg-purple-500/25',
            glowBlob: 'bg-purple-500/25',
            meterGradient: 'from-purple-400 via-fuchsia-400 to-pink-400',
            compatibility: '92% Kreativiti & Rekaan',
        },
        {
            code: 'S',
            name: 'Social',
            label: 'Sosial',
            desc: 'Prihatin, suka membantu, mendidik, bekerjasama & khidmat komuniti.',
            career: 'Pendidikan, Kaunseling, Kerja Sosial, Kejururawatan',
            careers: ['Pendidikan & Perguruan', 'Kaunseling Psikologi', 'Sains Kejururawatan'],
            icon: Users,
            color: 'from-emerald-500 via-teal-500 to-green-600',
            bg: 'bg-emerald-50/80',
            sliceColorStart: '#34d399',
            sliceColorEnd: '#059669',
            activeGradient: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600',
            border: 'border-emerald-200',
            badge: 'bg-emerald-600 text-white',
            accentText: 'text-emerald-300',
            glowRing: 'ring-emerald-400 border-emerald-400 shadow-emerald-500/30',
            tagClass: 'bg-emerald-500/15 border-emerald-400/30 text-emerald-200 hover:bg-emerald-500/25',
            glowBlob: 'bg-emerald-500/25',
            meterGradient: 'from-emerald-400 via-teal-400 to-green-400',
            compatibility: '95% Khidmat & Komunikasi',
        },
        {
            code: 'E',
            name: 'Enterprising',
            label: 'Perniagaan',
            desc: 'Kepimpinan, berdaya saing, berkarisma, keusahawanan & rundingan.',
            career: 'Pengurusan Perniagaan, Pemasaran, Perundangan',
            careers: ['Pengurusan Perniagaan', 'Pemasaran Digital & Jualan', 'Perundangan & Korporat'],
            icon: Briefcase,
            color: 'from-amber-500 via-orange-500 to-yellow-500',
            bg: 'bg-amber-50/80',
            sliceColorStart: '#fbbf24',
            sliceColorEnd: '#d97706',
            activeGradient: 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500',
            border: 'border-amber-200',
            badge: 'bg-amber-600 text-white',
            accentText: 'text-amber-300',
            glowRing: 'ring-amber-400 border-amber-400 shadow-amber-500/30',
            tagClass: 'bg-amber-500/15 border-amber-400/30 text-amber-200 hover:bg-amber-500/25',
            glowBlob: 'bg-amber-500/25',
            meterGradient: 'from-amber-400 via-orange-400 to-yellow-300',
            compatibility: '91% Kepimpinan & Visi',
        },
        {
            code: 'C',
            name: 'Conventional',
            label: 'Konvensional',
            desc: 'Teratur, sistematik, terperinci, pengurusan data & perakaunan.',
            career: 'Perakaunan, Kewangan, Pentadbiran Sistem',
            careers: ['Perakaunan Bertauliah', 'Kewangan & Pelaburan', 'Pentadbiran & Analisis Data'],
            icon: Calculator,
            color: 'from-blue-600 via-slate-600 to-indigo-700',
            bg: 'bg-slate-100/80',
            sliceColorStart: '#60a5fa',
            sliceColorEnd: '#2563eb',
            activeGradient: 'bg-gradient-to-r from-blue-600 via-slate-700 to-indigo-700',
            border: 'border-slate-300',
            badge: 'bg-slate-700 text-white',
            accentText: 'text-sky-300',
            glowRing: 'ring-slate-400 border-slate-400 shadow-slate-500/30',
            tagClass: 'bg-blue-500/15 border-blue-400/30 text-sky-200 hover:bg-blue-500/25',
            glowBlob: 'bg-blue-500/25',
            meterGradient: 'from-sky-400 via-blue-500 to-slate-400',
            compatibility: '97% Ketepatan & Sistem',
        },
    ];

    // Selection of trait via buttons [R][I][A][S][E][C] or wheel clicks
    const selectTrait = (targetIndex) => {
        setSelectedTraitIndex(targetIndex);

        const targetBase = -(targetIndex * 60 + 30);
        let diff = (targetBase - (wheelRotation % 360)) % 360;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        setWheelRotation((prev) => prev + diff);
    };

    const activeTrait = riasecTraits[selectedTraitIndex];
    const ActiveIcon = activeTrait.icon;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-sky-500 selection:text-white">
            <Head title="UniWise - Sistem Bimbingan Halatuju Pendidikan SPM" />

            {/* Top Header Navbar */}
            <header className="bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 px-6 sm:px-10 py-3.5 flex justify-between items-center shadow-md sticky top-0 z-40 border-b border-amber-600/30">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="bg-white/95 rounded-2xl px-3 py-1.5 shadow-sm flex items-center group-hover:scale-105 transition-transform">
                        <img
                            src="/images/uniwise-logo.png"
                            alt="UniWise Logo"
                            className="h-9 sm:h-10 w-auto object-contain"
                        />
                    </div>
                </Link>

                <div className="flex items-center gap-2 sm:gap-3">
                    <Link
                        href="/directory"
                        className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-indigo-950 hover:bg-amber-400/40 transition"
                    >
                        <School className="w-4 h-4" />
                        <span>Direktori IPTA</span>
                    </Link>
                    <Link
                        href="/login"
                        className="px-4 sm:px-5 py-2 rounded-xl text-xs font-black tracking-wide uppercase bg-sky-600 hover:bg-sky-700 text-white shadow transition hover:shadow-md active:scale-95"
                    >
                        Log Masuk
                    </Link>
                    <Link
                        href="/register"
                        className="px-4 sm:px-5 py-2 rounded-xl text-xs font-black tracking-wide uppercase bg-indigo-950 hover:bg-indigo-900 text-white shadow-sm transition hover:shadow-md active:scale-95"
                    >
                        Daftar
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 max-w-7xl mx-auto px-6 py-12 md:py-16 w-full space-y-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left Column: Headline & Value Proposition */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-sky-800 bg-sky-100/90 border border-sky-200 shadow-xs">
                            <Sparkles className="w-4 h-4 text-sky-600 animate-spin-slow" />
                            <span>Sistem Bimbingan Halatuju Lepasan SPM</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-indigo-950 tracking-tight leading-[1.15]">
                            Ketahui Kursus IPTA yang <span className="text-sky-600 underline decoration-amber-400 decoration-wavy decoration-4">Paling Sesuai</span> Untuk Anda
                        </h1>

                        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                            UniWise memadankan <strong>gred SPM sebenar anda</strong> dengan <strong>profil minat kerjaya Holland RIASEC</strong> untuk menghasilkan cadangan program Asasi, Diploma, dan Sijil di 21 universiti awam berserta penunjuk peluang kemasukan merit UPU.
                        </p>

                        <div className="flex flex-wrap items-center gap-3.5 pt-2">
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
                            >
                                <span>Mula Ujian Percuma</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            <Link
                                href="/directory"
                                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-extrabold text-sm rounded-2xl shadow-sm transition"
                            >
                                <BookOpen className="w-4 h-4 text-sky-600" />
                                <span>Terokai 256 Program IPTA</span>
                            </Link>
                        </div>

                        {/* Social proof badges */}
                        <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
                            <span className="flex items-center gap-1.5 text-slate-700">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                Formula Rasmi UPU (90% + 10%)
                            </span>
                            <span className="flex items-center gap-1.5 text-slate-700">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                Teori Holland RIASEC
                            </span>
                            <span className="flex items-center gap-1.5 text-slate-700">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                21 Universiti Awam & Politeknik
                            </span>
                        </div>
                    </div>

                    {/* Right Column: Interactive RIASEC Framework RODA (Wheel) */}
                    <div className="lg:col-span-5">
                        <div className="bg-white/95 backdrop-blur-xl rounded-[32px] p-5 sm:p-7 shadow-2xl border border-slate-200/90 relative overflow-hidden group transition-all duration-300">
                            {/* Card Header */}
                            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin-slow" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 block">
                                            Rangka Kerja Psikometrik
                                        </span>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-black text-slate-800">
                                        6 Dimensi Personaliti RIASEC
                                    </h3>
                                </div>
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                                    Teori Holland
                                </span>
                            </div>

                            <p className="text-xs text-slate-500 mb-2 flex items-center justify-between">
                                <span>Pilih butang <strong>[R] [I] [A] [S] [E] [C]</strong> atau klik roda:</span>
                                <span className="text-[11px] font-bold text-indigo-600 hidden sm:inline">
                                    {selectedTraitIndex + 1} / 6 Dimensi
                                </span>
                            </p>

                            {/* The SVG Wheel Display Container */}
                            <div className="relative py-2 flex justify-center items-center">
                                {/* Ambient Background Glow behind the wheel */}
                                <div
                                    className={`absolute w-44 h-44 rounded-full blur-3xl ${activeTrait.glowBlob} pointer-events-none transition-all duration-700`}
                                />

                                <svg
                                    viewBox="0 0 280 280"
                                    className="w-full max-w-[250px] sm:max-w-[275px] h-auto drop-shadow-2xl select-none relative z-10"
                                    style={{ overflow: 'visible' }}
                                >
                                    <defs>
                                        {riasecTraits.map((t) => (
                                            <linearGradient
                                                key={`grad-${t.code}`}
                                                id={`grad-${t.code}`}
                                                x1="0%"
                                                y1="0%"
                                                x2="100%"
                                                y2="100%"
                                            >
                                                <stop offset="0%" stopColor={t.sliceColorStart} />
                                                <stop offset="100%" stopColor={t.sliceColorEnd} />
                                            </linearGradient>
                                        ))}
                                        <filter id="active-slice-glow" x="-20%" y="-20%" width="140%" height="140%">
                                            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#ffffff" floodOpacity="0.8" />
                                            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.3" />
                                        </filter>
                                        <filter id="hub-shadow" x="-30%" y="-30%" width="160%" height="160%">
                                            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0f172a" floodOpacity="0.45" />
                                        </filter>
                                        <filter id="pointer-shadow" x="-50%" y="-50%" width="200%" height="200%">
                                            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
                                        </filter>
                                    </defs>

                                    {/* Outer decorative bezel ring with ticks */}
                                    <circle
                                        cx="140"
                                        cy="140"
                                        r="134"
                                        fill="#0f172a"
                                        stroke="#e2e8f0"
                                        strokeWidth="3"
                                    />
                                    <circle
                                        cx="140"
                                        cy="140"
                                        r="131"
                                        fill="#1e293b"
                                        stroke="#475569"
                                        strokeWidth="1"
                                    />

                                    {/* Instrument dial ticks around rim */}
                                    {Array.from({ length: 24 }).map((_, i) => {
                                        const tickAngle = i * 15;
                                        const isMajor = i % 4 === 0;
                                        return (
                                            <line
                                                key={i}
                                                x1="140"
                                                y1={isMajor ? 7 : 9}
                                                x2="140"
                                                y2="12"
                                                stroke={isMajor ? '#f8fafc' : '#94a3b8'}
                                                strokeWidth={isMajor ? 2 : 1}
                                                transform={`rotate(${tickAngle} 140 140)`}
                                                opacity={0.8}
                                            />
                                        );
                                    })}

                                    {/* Rotating Wheel Group */}
                                    <g
                                        style={{
                                            transformOrigin: '140px 140px',
                                            transform: `rotate(${wheelRotation}deg)`,
                                            transition: 'transform 0.55s cubic-bezier(0.34, 1.25, 0.64, 1)',
                                        }}
                                    >
                                        {riasecTraits.map((t, idx) => {
                                            const startAngle = idx * 60 + 2;
                                            const endAngle = (idx + 1) * 60 - 2;
                                            const midAngle = idx * 60 + 30;
                                            const isActive = selectedTraitIndex === idx;
                                            const pathData = describeArc(140, 140, 58, 126, startAngle, endAngle);

                                            return (
                                                <g key={t.code}>
                                                    <path
                                                        d={pathData}
                                                        fill={`url(#grad-${t.code})`}
                                                        stroke={isActive ? '#ffffff' : 'rgba(255,255,255,0.45)'}
                                                        strokeWidth={isActive ? 3 : 1.5}
                                                        filter={isActive ? 'url(#active-slice-glow)' : undefined}
                                                        onClick={() => selectTrait(idx)}
                                                        className="cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-[0.99]"
                                                    >
                                                        <title>{`${t.code} - ${t.label}`}</title>
                                                    </path>

                                                    <g
                                                        transform={`rotate(${midAngle} 140 140)`}
                                                        onClick={() => selectTrait(idx)}
                                                        className="cursor-pointer select-none"
                                                    >
                                                        <text
                                                            x="140"
                                                            y="44"
                                                            textAnchor="middle"
                                                            dominantBaseline="central"
                                                            fill="#ffffff"
                                                            style={{
                                                                fontSize: '18px',
                                                                fontWeight: 900,
                                                                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))',
                                                            }}
                                                        >
                                                            {t.code}
                                                        </text>
                                                        <text
                                                            x="140"
                                                            y="60"
                                                            textAnchor="middle"
                                                            dominantBaseline="central"
                                                            fill="rgba(255,255,255,0.95)"
                                                            style={{
                                                                fontSize: '8.5px',
                                                                fontWeight: 800,
                                                                letterSpacing: '0.02em',
                                                                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
                                                            }}
                                                        >
                                                            {t.label}
                                                        </text>
                                                    </g>
                                                </g>
                                            );
                                        })}
                                    </g>

                                    {/* Center Hub (Stationary, upright, informative dial) */}
                                    <g style={{ transformOrigin: '140px 140px' }}>
                                        <circle
                                            cx="140"
                                            cy="140"
                                            r="54"
                                            fill="#090d16"
                                            stroke="#ffffff"
                                            strokeWidth="3"
                                            filter="url(#hub-shadow)"
                                        />
                                        <circle
                                            cx="140"
                                            cy="140"
                                            r="47"
                                            fill="#111827"
                                            stroke="rgba(255,255,255,0.15)"
                                            strokeWidth="1.5"
                                        />

                                        {/* Dynamic neon ring inside hub */}
                                        <circle
                                            cx="140"
                                            cy="140"
                                            r="43"
                                            fill="none"
                                            stroke={activeTrait.sliceColorStart}
                                            strokeWidth="2"
                                            strokeDasharray="4 3"
                                            className="animate-spin-slow opacity-85"
                                        />

                                        {/* Active trait code in center */}
                                        <text
                                            x="140"
                                            y="125"
                                            textAnchor="middle"
                                            dominantBaseline="central"
                                            fill="#ffffff"
                                            style={{
                                                fontSize: '24px',
                                                fontWeight: 900,
                                            }}
                                        >
                                            {activeTrait.code}
                                        </text>

                                        {/* Active trait Malay label */}
                                        <text
                                            x="140"
                                            y="147"
                                            textAnchor="middle"
                                            dominantBaseline="central"
                                            fill={activeTrait.sliceColorStart}
                                            style={{
                                                fontSize: '10.5px',
                                                fontWeight: 800,
                                                letterSpacing: '0.04em',
                                            }}
                                        >
                                            {activeTrait.label}
                                        </text>
                                    </g>

                                    {/* Top Pointer Needle (Fixed at 12 o'clock pointing down at top slice) */}
                                    <g filter="url(#pointer-shadow)">
                                        <polygon
                                            points="140,24 150,5 140,9 130,5"
                                            fill="#fbbf24"
                                            stroke="#ffffff"
                                            strokeWidth="2"
                                        />
                                        <circle cx="140" cy="7" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                                        <circle cx="140" cy="7" r="2" fill="#ffffff" />
                                    </g>
                                </svg>
                            </div>

                            {/* 6 Dimension Selector Buttons [R] [I] [A] [S] [E] [C] */}
                            <div className="mt-3 grid grid-cols-6 gap-1.5 sm:gap-2">
                                {riasecTraits.map((t, idx) => {
                                    const isActive = selectedTraitIndex === idx;
                                    return (
                                        <button
                                            key={t.code}
                                            type="button"
                                            onClick={() => selectTrait(idx)}
                                            title={`${t.code} - ${t.label}`}
                                            className={`py-2 px-1 rounded-xl text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                                                isActive
                                                    ? `bg-gradient-to-r ${t.color} text-white shadow-md scale-105 ring-2 ring-offset-2 ring-indigo-500 font-black`
                                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            <span className="text-sm sm:text-base font-black leading-none">{t.code}</span>
                                            <span className="text-[9px] sm:text-[10px] font-bold tracking-tight opacity-90 truncate max-w-full mt-0.5">
                                                {t.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Active Trait Motion Stage Theater */}
                            <div
                                key={activeTrait.code}
                                className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-2xl relative overflow-hidden border border-white/10 animate-scale-up"
                            >
                                {/* Dynamic Ambient Radial Glow */}
                                <div
                                    className={`absolute -right-8 -bottom-8 w-44 h-44 rounded-full blur-3xl ${activeTrait.glowBlob} pointer-events-none transition-all duration-500`}
                                />

                                {/* Stage Header */}
                                <div className="flex items-center justify-between gap-3 mb-2.5 relative z-10">
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className={`w-9 h-9 rounded-xl ${activeTrait.activeGradient} text-white flex items-center justify-center shadow-md shadow-black/20 shrink-0`}
                                        >
                                            <ActiveIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-black text-white">
                                                    {activeTrait.code} &bull; {activeTrait.label}
                                                </h4>
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-medium">
                                                {activeTrait.compatibility}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Active Badge Pulse */}
                                    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-300 shrink-0">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        <span>Aktif</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-xs text-slate-300 leading-relaxed mb-3.5 relative z-10 font-normal">
                                    {activeTrait.desc}
                                </p>

                                {/* Career Pathways Chips */}
                                <div className="relative z-10 pt-2.5 border-t border-white/10">
                                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-2">
                                        Contoh Bidang Kerjaya Sesuai:
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {activeTrait.careers.map((c, i) => (
                                            <span
                                                key={i}
                                                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-transform hover:scale-105 duration-150 flex items-center gap-1 shadow-2xs ${activeTrait.tagClass}`}
                                            >
                                                <Sparkles className="w-2.5 h-2.5 opacity-80" />
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Call to action inside stage */}
                                <div className="relative z-10 mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                                    <span className="text-[11px] text-slate-400 font-medium">
                                        Ketahui sejauh mana minat anda sepadan:
                                    </span>
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center gap-1 text-xs font-black text-amber-400 hover:text-amber-300 transition-colors"
                                    >
                                        <span>Uji Sekarang</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>

                            {/* Trait Stepper Navigation */}
                            <div className="mt-3 pt-1 flex items-center justify-between gap-3 text-[11px]">
                                <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
                                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                                    <span>Pilih [R] [I] [A] [S] [E] [C] untuk teroka profil</span>
                                </div>

                                {/* Interactive Dot Stepper */}
                                <div className="flex items-center gap-1.5">
                                    {riasecTraits.map((_, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => selectTrait(i)}
                                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                                selectedTraitIndex === i
                                                    ? 'w-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-xs'
                                                    : 'w-2 bg-slate-200 hover:bg-slate-300'
                                            }`}
                                            aria-label={`Pilih dimensi ${i + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3 Step Guidance Journey */}
                <div className="space-y-6">
                    <div className="text-center max-w-xl mx-auto space-y-2">
                        <span className="text-xs font-black uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                            Langkah Mudah
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-indigo-950 tracking-tight">
                            3 Langkah Bimbingan Menara Gading
                        </h2>
                        <p className="text-sm text-slate-500">
                            Proses saintifik dan tersusun untuk memandu pilihan kursus UPUOnline anda.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Step 1 */}
                        <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200 hover:shadow-lg transition space-y-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-black text-lg group-hover:scale-110 transition shadow-xs">
                                1
                            </div>
                            <h3 className="text-lg font-black text-slate-900">
                                Masukkan Gred SPM
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                Masukkan gred bagi 4 subjek teras dan subjek elektif. Sistem mengira secara automatik <strong>skor merit rasmi 90% akademik + 10% kokurikulum</strong>.
                            </p>
                            <div className="pt-2 text-xs font-bold text-sky-600 flex items-center gap-1">
                                <span>Formula UPU Rasmi</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200 hover:shadow-lg transition space-y-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-lg group-hover:scale-110 transition shadow-xs">
                                2
                            </div>
                            <h3 className="text-lg font-black text-slate-900">
                                Jawab Ujian IMKS (RIASEC)
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                Kuiz pantas YA/TIDAK (170 item IMKS) untuk mengukur kecenderungan personaliti anda merentasi 6 domain kerjaya Holland berserta carta radar visual.
                            </p>
                            <div className="pt-2 text-xs font-bold text-indigo-600 flex items-center gap-1">
                                <span>Psikometrik Holland</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200 hover:shadow-lg transition space-y-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-lg group-hover:scale-110 transition shadow-xs">
                                3
                            </div>
                            <h3 className="text-lg font-black text-slate-900">
                                Terima Padanan & Peluang
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                Enjin pemadanan menyenaraikan kursus IPTA berserta <strong>Penunjuk Peluang Kemasukan</strong> (Peluang Tinggi, Berdaya Saing, Sasaran).
                            </p>
                            <div className="pt-2 text-xs font-bold text-amber-700 flex items-center gap-1">
                                <span>Strategi Permohonan UPU</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* About Us & IPTA Statistics Banner */}
                <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-indigo-900 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                                Mengenai UniWise
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                                Dibangunkan Khas Untuk Membantu Calon SPM Malaysia
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                Diilhamkan daripada cabaran sebenar lepasan SPM yang keliru dalam memilih antara ratusan program di portal UPUOnline. UniWise menggabungkan data merit lepas dan profil minat kerjaya bagi memastikan setiap calon membuat pilihan tepat berasaskan data.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <span className="text-3xl sm:text-4xl font-black text-amber-300 block">
                                    256
                                </span>
                                <span className="text-xs font-semibold text-slate-300">
                                    Program Pengajian
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <span className="text-3xl sm:text-4xl font-black text-sky-400 block">
                                    21
                                </span>
                                <span className="text-xs font-semibold text-slate-300">
                                    Institusi Awam (IPTA)
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <span className="text-3xl sm:text-4xl font-black text-emerald-400 block">
                                    6
                                </span>
                                <span className="text-xs font-semibold text-slate-300">
                                    Domain Personaliti RIASEC
                                </span>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <span className="text-3xl sm:text-4xl font-black text-purple-400 block">
                                    100%
                                </span>
                                <span className="text-xs font-semibold text-slate-300">
                                    Percuma untuk Calon SPM
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-8 px-6 text-xs border-t border-slate-800">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <img
                            src="/images/uniwise-icon.png"
                            alt="UniWise Logo"
                            className="w-6 h-6 object-contain opacity-90 brightness-110"
                        />
                        <span className="font-extrabold text-white text-sm">UniWise</span>
                        <span className="text-slate-500">| Final Year Project (FYP) UPSI</span>
                    </div>

                    <p className="text-slate-500 text-center sm:text-right">
                        &copy; 2026 UniWise System. Hak Cipta Terpelihara.
                    </p>
                </div>
            </footer>
        </div>
    );
}