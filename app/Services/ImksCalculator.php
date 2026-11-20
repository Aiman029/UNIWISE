<?php

namespace App\Services;

use Illuminate\Support\Collection;
use InvalidArgumentException;

class ImksCalculator
{
    public const CLUSTERS = [
        1 => ['code' => 'PPR-R', 'name' => 'Pertanian dan Perhutanan', 'holland' => 'R', 'category' => 'Realistic'],
        2 => ['code' => 'PLD-R', 'name' => 'Perkhidmatan Perlindungan', 'holland' => 'R', 'category' => 'Realistic'],
        3 => ['code' => 'MHR-R', 'name' => 'Pekerjaan Berkemahiran', 'holland' => 'R', 'category' => 'Realistic'],
        4 => ['code' => 'KEJ-R', 'name' => 'Kejuruteraan', 'holland' => 'R', 'category' => 'Realistic'],
        5 => ['code' => 'SMT-I', 'name' => 'Sains dan Matematik', 'holland' => 'I', 'category' => 'Investigative'],
        6 => ['code' => 'KDP-I', 'name' => 'Kaitan dengan Perubatan', 'holland' => 'I', 'category' => 'Investigative'],
        7 => ['code' => 'UBT-I', 'name' => 'Perubatan', 'holland' => 'I', 'category' => 'Investigative'],
        8 => ['code' => 'SHI-A', 'name' => 'Seni dan Hiburan', 'holland' => 'A', 'category' => 'Artistic'],
        9 => ['code' => 'UND-A', 'name' => 'Persuratan dan Perundangan', 'holland' => 'A', 'category' => 'Artistic'],
        10 => ['code' => 'SUK-S', 'name' => 'Sukan', 'holland' => 'S', 'category' => 'Social'],
        11 => ['code' => 'SDN-S', 'name' => 'Perkhidmatan Persendirian', 'holland' => 'S', 'category' => 'Social'],
        12 => ['code' => 'SOS-S', 'name' => 'Perkhidmatan Sosial', 'holland' => 'S', 'category' => 'Social'],
        13 => ['code' => 'TBR-E', 'name' => 'Pentadbiran Perniagaan', 'holland' => 'E', 'category' => 'Enterprising'],
        14 => ['code' => 'ANP-E', 'name' => 'Analisis Perniagaan', 'holland' => 'E', 'category' => 'Enterprising'],
        15 => ['code' => 'NGA-E', 'name' => 'Urusniaga', 'holland' => 'E', 'category' => 'Enterprising'],
        16 => ['code' => 'KER-C', 'name' => 'Pekerjaan Perkeranian', 'holland' => 'C', 'category' => 'Conventional'],
        17 => ['code' => 'KON-C', 'name' => 'Pekerjaan Konvensional', 'holland' => 'C', 'category' => 'Conventional'],
    ];

    public const DIMENSIONS = [
        'R' => [
            'category' => 'Realistic',
            'name_ms' => 'Realistik',
            'divisor' => 4,
            'clusters' => ['PPR-R', 'PLD-R', 'MHR-R', 'KEJ-R'],
        ],
        'I' => [
            'category' => 'Investigative',
            'name_ms' => 'Investigatif',
            'divisor' => 3,
            'clusters' => ['SMT-I', 'KDP-I', 'UBT-I'],
        ],
        'A' => [
            'category' => 'Artistic',
            'name_ms' => 'Artistik',
            'divisor' => 2,
            'clusters' => ['SHI-A', 'UND-A'],
        ],
        'S' => [
            'category' => 'Social',
            'name_ms' => 'Sosial',
            'divisor' => 3,
            'clusters' => ['SUK-S', 'SDN-S', 'SOS-S'],
        ],
        'E' => [
            'category' => 'Enterprising',
            'name_ms' => 'Enterprising',
            'divisor' => 3,
            'clusters' => ['TBR-E', 'ANP-E', 'NGA-E'],
        ],
        'C' => [
            'category' => 'Conventional',
            'name_ms' => 'Conventional',
            'divisor' => 2,
            'clusters' => ['KER-C', 'KON-C'],
        ],
    ];

    /**
     * Normalize user answer ('Y'/1/true -> 1, 'T'/'N'/0/false -> 0).
     */
    public static function normalizeAnswerValue(mixed $value): int
    {
        if (is_bool($value)) {
            return $value ? 1 : 0;
        }

        if (is_int($value) || is_float($value)) {
            return ((int) $value) === 1 ? 1 : 0;
        }

        $str = strtoupper(trim((string) $value));
        if (in_array($str, ['Y', 'YA', '1', 'TRUE'], true)) {
            return 1;
        }
        if (in_array($str, ['T', 'TIDAK', 'N', 'NO', '0', 'FALSE'], true)) {
            return 0;
        }

        throw new InvalidArgumentException("Invalid IMKS answer value: {$value}");
    }

    /**
     * Resolve cluster code from IMKS question number (1..170) using the official formula:
     * Section A (1..85): floor((q-1)/5) + 1; Section B (86..170): floor((q-86)/5) + 1.
     */
    public static function resolveClusterCodeByQuestionNumber(int $questionNumber): ?string
    {
        if ($questionNumber >= 1 && $questionNumber <= 85) {
            $col = intdiv($questionNumber - 1, 5) + 1;

            return self::CLUSTERS[$col]['code'] ?? null;
        }

        if ($questionNumber >= 86 && $questionNumber <= 170) {
            $col = intdiv($questionNumber - 86, 5) + 1;

            return self::CLUSTERS[$col]['code'] ?? null;
        }

        return null;
    }

    /**
     * Calculate full IMKS 2013 scores (17 clusters, RIASEC exact & rounded averages, Top-3 Holland codes with ties).
     *
     * Supported $answers formats:
     * 1. Associative array keyed by question number (1..170): [1 => 'Y', 2 => 'T', ...]
     * 2. Array of items: [['question_id' => 1, 'value' => 1], ...] (requires $questions collection keyed by id)
     *    or [['question_number' => 1, 'value' => 'Y'], ...]
     *
     * @param  array<int|string, mixed>  $answers
     * @param  Collection<int, mixed>|null  $questionsById
     * @return array<string, mixed>
     */
    public static function calculateIMKSScore(array $answers, ?Collection $questionsById = null): array
    {
        $clusterScores = [];
        foreach (self::CLUSTERS as $cluster) {
            $clusterScores[$cluster['code']] = 0;
        }

        $seenQuestions = [];

        foreach ($answers as $key => $item) {
            $clusterCode = null;
            $val = null;
            $uniqueKey = null;

            if (is_array($item)) {
                $rawVal = $item['value'] ?? $item['answer'] ?? $item['answer_value'] ?? null;
                if ($rawVal === null) {
                    continue;
                }
                $val = self::normalizeAnswerValue($rawVal);

                if (!empty($item['cluster_code']) && isset($clusterScores[$item['cluster_code']])) {
                    $clusterCode = $item['cluster_code'];
                    $uniqueKey = $item['question_number'] ?? $item['question_id'] ?? $key;
                } elseif (!empty($item['question_id']) && $questionsById && $questionsById->has($item['question_id'])) {
                    $q = $questionsById->get($item['question_id']);
                    $clusterCode = $q->cluster_code ?: self::resolveClusterCodeByQuestionNumber((int) ($q->question_number ?? $q->id));
                    $uniqueKey = 'id_' . $item['question_id'];
                } elseif (!empty($item['question_number'])) {
                    $qNum = (int) $item['question_number'];
                    $clusterCode = self::resolveClusterCodeByQuestionNumber($qNum);
                    $uniqueKey = 'num_' . $qNum;
                }
            } else {
                $qNum = (int) $key;
                $val = self::normalizeAnswerValue($item);
                $clusterCode = self::resolveClusterCodeByQuestionNumber($qNum);
                $uniqueKey = 'num_' . $qNum;
            }

            if ($clusterCode !== null && isset($clusterScores[$clusterCode])) {
                if ($uniqueKey !== null && isset($seenQuestions[$uniqueKey])) {
                    continue;
                }
                if ($uniqueKey !== null) {
                    $seenQuestions[$uniqueKey] = true;
                }
                $clusterScores[$clusterCode] += $val;
            }
        }

        // Compute exact and rounded averages per RIASEC dimension
        $riasecTotals = [];
        $exactScores = [];
        $roundedScores = [];
        $categoryScores = [];
        $exactCategoryScores = [];

        foreach (self::DIMENSIONS as $code => $meta) {
            $sum = 0;
            foreach ($meta['clusters'] as $cCode) {
                $sum += $clusterScores[$cCode];
            }

            $avg = $sum / $meta['divisor'];
            $rounded = (int) round($avg, 0, PHP_ROUND_HALF_UP);

            $riasecTotals[$code] = $sum;
            $exactScores[$code] = round($avg, 2);
            $roundedScores[$code] = $rounded;
            $categoryScores[$meta['category']] = $rounded;
            $exactCategoryScores[$meta['category']] = round($avg, 4);
        }

        $hollandResult = self::determineThreeLetterHollandCodes($roundedScores, $exactScores);

        return [
            'instrument' => 'IMKS 2013',
            'answered_count' => count($seenQuestions),
            'cluster_scores' => $clusterScores,
            'riasec_totals' => $riasecTotals,
            'riasec_exact' => $exactScores,
            'riasec_rounded' => $roundedScores,
            'category_scores' => $categoryScores,
            'exact_category_scores' => $exactCategoryScores,
            'holland_codes' => $hollandResult['codes'],
            'holland_code_display' => $hollandResult['display'],
            'primary_holland_code' => $hollandResult['primary_code'],
            'dominant_category' => $hollandResult['primary_code']
                ? self::DIMENSIONS[$hollandResult['primary_code'][0]]['category']
                : 'Realistic',
            'has_tie' => $hollandResult['has_tie'],
            'undetermined' => $hollandResult['undetermined'],
            'note' => $hollandResult['note'],
        ];
    }

    /**
     * Determine Top-3 Three-Letter Holland Codes from rounded RIASEC scores following official IMKS tie rules.
     *
     * @param  array<string, int>  $roundedScores  Keys: R, I, A, S, E, C
     * @param  array<string, float>  $exactScores  Optional tie ordering hint for primary display order
     * @return array<string, mixed>
     */
    public static function determineThreeLetterHollandCodes(array $roundedScores, array $exactScores = []): array
    {
        $codes = array_keys(self::DIMENSIONS);

        // Sort codes descending by rounded score, then exact score descending, then canonical R-I-A-S-E-C
        usort($codes, function (string $a, string $b) use ($roundedScores, $exactScores) {
            $diffRounded = ($roundedScores[$b] ?? 0) <=> ($roundedScores[$a] ?? 0);
            if ($diffRounded !== 0) {
                return $diffRounded;
            }

            $diffExact = ($exactScores[$b] ?? 0.0) <=> ($exactScores[$a] ?? 0.0);
            if ($diffExact !== 0) {
                return $diffExact;
            }

            return array_search($a, array_keys(self::DIMENSIONS), true)
                <=> array_search($b, array_keys(self::DIMENSIONS), true);
        });

        // Group into descending rounded-score buckets
        $buckets = [];
        foreach ($codes as $code) {
            $score = $roundedScores[$code] ?? 0;
            $buckets[$score][] = $code;
        }
        krsort($buckets, SORT_NUMERIC);
        $bucketList = array_values($buckets);

        // Edge case: All 6 categories have the exact same rounded score
        if (count($bucketList) === 1 && count($bucketList[0]) === 6) {
            return [
                'codes' => [],
                'primary_code' => null,
                'display' => 'Tidak Dapat Ditentukan',
                'has_tie' => true,
                'undetermined' => true,
                'note' => 'Kesemua 6 dimensi RIASEC memperoleh skor yang sama. Sila jawab semula ujian dengan lebih teliti.',
            ];
        }

        $combinations = self::generateTopThreePermutations($bucketList);
        $hasTie = count($combinations) > 1;

        return [
            'codes' => $combinations,
            'primary_code' => $combinations[0] ?? null,
            'display' => implode(', ', $combinations),
            'has_tie' => $hasTie,
            'undetermined' => false,
            'note' => $hasTie
                ? 'Terdapat skor seri pada kedudukan 3 teratas. Semua kombinasi Kod Tiga-Mata Holland yang sah dipaparkan.'
                : 'Kod Tiga-Mata Holland berjaya ditentukan tanpa skor seri di kedudukan 3 teratas.',
        ];
    }

    /**
     * Recursively generate all valid 3-letter combinations from descending score buckets.
     *
     * @param  array<int, array<int, string>>  $buckets
     * @param  array<int, string>  $chosen
     * @return array<int, string>
     */
    private static function generateTopThreePermutations(array $buckets, array $chosen = []): array
    {
        if (count($chosen) === 3) {
            return [implode('', $chosen)];
        }

        // Find the highest non-empty bucket after removing already chosen codes
        foreach ($buckets as $bucket) {
            $available = array_values(array_diff($bucket, $chosen));
            if (empty($available)) {
                continue;
            }

            $results = [];
            foreach ($available as $pick) {
                $nextChosen = array_merge($chosen, [$pick]);
                $results = array_merge($results, self::generateTopThreePermutations($buckets, $nextChosen));
            }

            return $results;
        }

        return [];
    }
}
