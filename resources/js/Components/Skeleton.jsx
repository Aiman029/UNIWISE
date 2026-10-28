import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

/**
 * Base Shimmer Skeleton Element
 */
export function Skeleton({ className = '', variant = 'rect' }) {
    const variantClasses = {
        circle: 'rounded-full',
        rounded: 'rounded-xl',
        pill: 'rounded-full',
        rect: 'rounded-lg',
    };

    return (
        <div
            className={`animate-shimmer ${variantClasses[variant] || 'rounded-lg'} ${className}`}
            aria-hidden="true"
        />
    );
}

/**
 * Generic Card Skeleton
 */
export function CardSkeleton({ className = '' }) {
    return (
        <div className={`bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 ${className}`}>
            <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10" variant="circle" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                </div>
            </div>
            <Skeleton className="h-20 w-full rounded-2xl" />
            <div className="space-y-2 pt-2">
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-2/3" />
            </div>
        </div>
    );
}

/**
 * Dashboard Page Skeleton
 */
export function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Hero Banner Skeleton */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 w-full md:w-2/3">
                    <Skeleton className="h-4 w-36 rounded-full" />
                    <Skeleton className="h-8 w-3/4 rounded-xl" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="flex gap-2 pt-2">
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-32 rounded-full" />
                    </div>
                </div>
                <div className="w-full md:w-1/3 flex justify-center">
                    <Skeleton className="w-32 h-32" variant="circle" />
                </div>
            </div>

            {/* 3 Steps Journey Stepper Skeleton */}
            <div className="space-y-3">
                <Skeleton className="h-4 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3">
                            <div className="flex items-center justify-between">
                                <Skeleton className="w-9 h-9 rounded-2xl" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-3 w-5/6" />
                            <Skeleton className="h-9 w-full rounded-xl mt-2" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Overview Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-xl" />
                            <div className="space-y-1.5 flex-1">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-6 w-16" />
                            </div>
                        </div>
                        <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * Academic Result Page Skeleton
 */
export function AcademicSkeleton() {
    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto py-2">
            {/* Header Card Skeleton */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-3 text-center">
                <Skeleton className="w-14 h-14 mx-auto" variant="circle" />
                <Skeleton className="h-7 w-64 mx-auto" />
                <Skeleton className="h-4 w-96 max-w-full mx-auto" />
                <div className="flex justify-center gap-3 pt-2">
                    <Skeleton className="h-10 w-44 rounded-2xl" />
                    <Skeleton className="h-10 w-44 rounded-2xl" />
                </div>
            </div>

            {/* Live Merit Widget Skeleton */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-16 h-16" variant="circle" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-36" />
                        <Skeleton className="h-3 w-48" />
                    </div>
                </div>
                <Skeleton className="h-10 w-40 rounded-xl" />
            </div>

            {/* Universal Subjects Card Skeleton */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
                <Skeleton className="h-6 w-56" />
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200/60">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-6 h-6 rounded-full" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                            <Skeleton className="h-9 w-24 rounded-xl" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Elective Subjects Card Skeleton */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
                <Skeleton className="h-6 w-48" />
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200/60">
                            <Skeleton className="h-9 flex-1 rounded-xl" />
                            <Skeleton className="h-9 w-24 rounded-xl" />
                            <Skeleton className="w-9 h-9 rounded-xl" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * RIASEC Quiz Page Skeleton
 */
export function RiasecQuizSkeleton() {
    return (
        <div className="max-w-2xl mx-auto py-6 space-y-6 animate-fade-in">
            {/* Top Question Tracker Skeleton */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between shadow-xs">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* Main Question Card Skeleton */}
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center space-y-6">
                <Skeleton className="w-16 h-16 mx-auto rounded-2xl" />
                <Skeleton className="h-5 w-40 mx-auto rounded-full" />
                <div className="space-y-2 py-4">
                    <Skeleton className="h-7 w-5/6 mx-auto" />
                    <Skeleton className="h-7 w-2/3 mx-auto" />
                </div>

                {/* YES / NO Button Skeletons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto pt-2">
                    <Skeleton className="h-14 rounded-2xl" />
                    <Skeleton className="h-14 rounded-2xl" />
                </div>

                {/* Progress bar skeleton */}
                <div className="pt-6 border-t border-slate-100 space-y-4">
                    <Skeleton className="h-3 w-full max-w-md mx-auto rounded-full" />
                    <div className="flex justify-between max-w-md mx-auto">
                        <Skeleton className="h-10 w-28 rounded-xl" />
                        <Skeleton className="h-10 w-28 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * RIASEC Result Page Skeleton
 */
export function RiasecResultSkeleton() {
    return (
        <div className="max-w-5xl mx-auto py-6 space-y-8 animate-fade-in">
            {/* Header Banner Skeleton */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4">
                <Skeleton className="w-20 h-20 mx-auto" variant="circle" />
                <Skeleton className="h-8 w-72 mx-auto" />
                <Skeleton className="h-4 w-96 max-w-full mx-auto" />
                <div className="flex justify-center gap-2 pt-2">
                    <Skeleton className="h-10 w-28 rounded-2xl" />
                    <Skeleton className="h-10 w-28 rounded-2xl" />
                    <Skeleton className="h-10 w-28 rounded-2xl" />
                </div>
            </div>

            {/* Radar Chart & Trait Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 flex flex-col items-center justify-center min-h-[320px]">
                    <Skeleton className="w-64 h-64" variant="circle" />
                </div>
                <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3">
                    <Skeleton className="h-6 w-48 mb-4" />
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="space-y-1.5">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-4 w-12" />
                            </div>
                            <Skeleton className="h-2.5 w-full rounded-full" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Recommendations Skeleton */}
            <div className="space-y-4">
                <Skeleton className="h-7 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3">
                            <div className="flex justify-between">
                                <Skeleton className="h-5 w-2/3" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-3 w-5/6" />
                            <div className="pt-2 flex justify-between items-center">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-9 w-28 rounded-xl" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Directory IPTA Skeleton
 */
export function DirectorySkeleton() {
    return (
        <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
            {/* Search and Filters Header Skeleton */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <Skeleton className="h-11 flex-1 rounded-2xl" />
                    <Skeleton className="h-11 w-48 rounded-2xl" />
                    <Skeleton className="h-11 w-40 rounded-2xl" />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-8 w-24 shrink-0 rounded-full" />
                    ))}
                </div>
            </div>

            {/* Cards Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                            <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-4/5" />
                            <Skeleton className="h-3.5 w-1/2" />
                        </div>
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-8 w-24 rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * Smart Adaptive Page Skeleton Dispatcher
 */
export function PageSkeleton({ page = 'default' }) {
    switch (page) {
        case 'dashboard':
            return <DashboardSkeleton />;
        case 'academic':
            return <AcademicSkeleton />;
        case 'riasec':
        case 'riasec_quiz':
            return <RiasecQuizSkeleton />;
        case 'riasec_result':
        case 'history':
            return <RiasecResultSkeleton />;
        case 'directory':
            return <DirectorySkeleton />;
        default:
            return <DashboardSkeleton />;
    }
}

/**
 * Floating / Modal Loading State with Animated Shimmer
 */
export function DataUploadOverlay({
    title = 'Sedang Memuat Naik Data...',
    subtitle = 'Sila tunggu sebentar sementara sistem memproses maklumat anda.',
    badge = 'UniWise Cloud Sync',
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-sm w-full p-6 sm:p-8 text-center space-y-5 animate-scale-up">
                {/* Icon Badge with Pulse Glow */}
                <div className="relative inline-flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg animate-pulse">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-indigo-950 flex items-center justify-center text-xs shadow-md">
                        <Sparkles className="w-3.5 h-3.5" />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
                        {badge}
                    </div>
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                        {title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                        {subtitle}
                    </p>
                </div>

                {/* Shimmering Skeleton Progress Bar */}
                <div className="space-y-2 pt-2">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden relative">
                        <div className="h-full bg-gradient-to-r from-sky-500 via-indigo-600 to-amber-500 rounded-full animate-indeterminate" />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 px-1">
                        <span>Memproses data</span>
                        <span className="text-sky-600 animate-pulse">Menghubung...</span>
                    </div>
                </div>

                {/* Mini Shimmer Card Placeholder */}
                <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center gap-3 text-left">
                    <Skeleton className="w-8 h-8 shrink-0" variant="circle" />
                    <div className="space-y-1 flex-1">
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-2 w-1/2" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Skeleton;
