/**
 * Utility to compute the admission feasibility chance based on
 * student's merit score compared to UPU historical cutoff merit.
 */
export function calculateAdmissionChance(studentMerit, progMerit, notes = '') {
    const isInterview = notes && notes.toLowerCase().includes('temuduga');

    if (progMerit === null || progMerit === undefined || progMerit === '' || Number(progMerit) === 0) {
        if (isInterview) {
            return {
                status: 'temuduga',
                scoreDiff: null,
                diffFormatted: 'Temu duga',
                label: 'Kemasukan Temuduga / Ujian Bakat',
                shortLabel: 'Temuduga',
                badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
                indicatorClass: 'bg-purple-500',
                cardBorder: 'border-purple-200/80',
                description: 'Kemasukan memerlukan ujian bakat atau temu duga khas IPTA.',
                priority: 3,
            };
        }
        return {
            status: 'terbuka',
            scoreDiff: null,
            diffFormatted: 'Syarat Asas',
            label: 'Kelayakan Terbuka (Syarat SPM)',
            shortLabel: 'Syarat Asas',
            badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
            indicatorClass: 'bg-slate-400',
            cardBorder: 'border-slate-200',
            description: 'Program ini memenuhi kelayakan akademik minimum SPM.',
            priority: 4,
        };
    }

    const sMerit = Number(studentMerit) || 0;
    const pMerit = Number(progMerit);
    const diff = sMerit - pMerit;

    if (diff >= 0) {
        return {
            status: 'tinggi',
            scoreDiff: diff,
            diffFormatted: `+${diff.toFixed(2)}%`,
            label: 'Peluang Tinggi (Melepasi Merit UPU)',
            shortLabel: 'Peluang Tinggi',
            badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
            indicatorClass: 'bg-emerald-500',
            cardBorder: 'border-emerald-200',
            description: `Merit anda (${sMerit.toFixed(1)}%) melepasi purata kemasukan UPU (${pMerit.toFixed(1)}%). Peluang tawaran adalah sangat cerah!`,
            priority: 1,
        };
    } else if (diff >= -3.5) {
        return {
            status: 'sederhana',
            scoreDiff: diff,
            diffFormatted: `${diff.toFixed(2)}%`,
            label: 'Berdaya Saing (Dalam Julat Sasaran)',
            shortLabel: 'Berdaya Saing',
            badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
            indicatorClass: 'bg-amber-500',
            cardBorder: 'border-amber-200',
            description: `Merit anda (${sMerit.toFixed(1)}%) hampir menyamai purata kemasukan (${pMerit.toFixed(1)}%). Anda berada dalam kedudukan kompetitif.`,
            priority: 2,
        };
    } else {
        return {
            status: 'sasaran',
            scoreDiff: diff,
            diffFormatted: `${diff.toFixed(2)}%`,
            label: 'Pilihan Sasaran / Berisiko',
            shortLabel: 'Sasaran Tinggi',
            badgeClass: 'bg-sky-50 text-sky-800 border-sky-300',
            indicatorClass: 'bg-sky-500',
            cardBorder: 'border-sky-200',
            description: `Merit anda (${sMerit.toFixed(1)}%) berada di bawah purata kemasukan lepas (${pMerit.toFixed(1)}%). Sesuai dijadikan pilihan sasaran awal.`,
            priority: 5,
        };
    }
}
