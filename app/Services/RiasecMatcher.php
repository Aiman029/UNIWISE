<?php

namespace App\Services;

use App\Models\Programme;
use Illuminate\Support\Collection;

class RiasecMatcher
{
    public const ORDERED_TRAITS = [
        'Realistic',
        'Investigative',
        'Artistic',
        'Social',
        'Enterprising',
        'Conventional',
    ];

    public const TRAIT_CODES = [
        'Realistic' => 'R',
        'Investigative' => 'I',
        'Artistic' => 'A',
        'Social' => 'S',
        'Enterprising' => 'E',
        'Conventional' => 'C',
    ];

    /**
     * Rank all 6 Holland traits from highest score to lowest score (R-I-A-S-E-C tie-breaker).
     *
     * @param  array<string, int|float>  $scores
     * @return array<int, string>
     */
    public static function rankTraits(array $scores): array
    {
        $ranked = self::ORDERED_TRAITS;

        usort($ranked, function (string $a, string $b) use ($scores) {
            $scoreA = (float) ($scores[$a] ?? 0);
            $scoreB = (float) ($scores[$b] ?? 0);

            if (abs($scoreA - $scoreB) > 1e-6) {
                return $scoreB <=> $scoreA;
            }

            return array_search($a, self::ORDERED_TRAITS, true) <=> array_search($b, self::ORDERED_TRAITS, true);
        });

        return $ranked;
    }

    /**
     * Get student's Top N active RIASEC traits (score > 0), guaranteed at least the dominant trait.
     *
     * @param  array<string, int|float>  $scores
     * @return array<int, string>
     */
    public static function getTopTraits(array $scores, int $limit = 3): array
    {
        $ranked = self::rankTraits($scores);
        $dominant = $ranked[0];

        $topActive = array_values(array_filter(
            array_slice($ranked, 0, $limit),
            fn (string $trait) => (float) ($scores[$trait] ?? 0) > 0
        ));

        return !empty($topActive) ? $topActive : [$dominant];
    }

    /**
     * Build structured Top N trait summaries (trait, code, score, rank) for UI display.
     *
     * @param  array<string, int|float>  $scores
     * @param  array<string, int|float>|null  $displayScores
     * @return array<int, array<string, mixed>>
     */
    public static function getTopTraitSummaries(array $scores, int $limit = 3, ?array $displayScores = null): array
    {
        $topTraits = self::getTopTraits($scores, $limit);
        $summaries = [];

        foreach ($topTraits as $index => $trait) {
            $shownScore = $displayScores !== null ? ($displayScores[$trait] ?? 0) : ($scores[$trait] ?? 0);

            $summaries[] = [
                'rank' => $index + 1,
                'trait' => $trait,
                'code' => self::TRAIT_CODES[$trait] ?? strtoupper(substr($trait, 0, 1)),
                'score' => (int) round((float) $shownScore, 0, PHP_ROUND_HALF_UP),
            ];
        }

        return $summaries;
    }

    /**
     * Compute weighted compatibility score (0-100) between a programme's 2-3 RIASEC types and student's Top 2/3 traits.
     *
     * @param  array<int, string>  $progTraits
     * @param  array<int, string>  $topTraits
     */
    public static function scoreMatch(array $progTraits, array $topTraits): int
    {
        if (empty($progTraits) || empty($topTraits)) {
            return 0;
        }

        $matched = array_values(array_intersect($progTraits, $topTraits));
        $overlapCount = count($matched);

        if ($overlapCount === 0) {
            return 0;
        }

        $progCount = count($progTraits);
        $coverageScore = ($overlapCount / $progCount) * 75.0;

        $weights = [3, 2, 1];
        $dot = 0;
        $maxDot = 0;

        foreach ($progTraits as $pIdx => $pTrait) {
            $pWeight = $weights[$pIdx] ?? 1;
            $sMaxWeight = $weights[$pIdx] ?? 1;
            $maxDot += $pWeight * $sMaxWeight;

            $sIdx = array_search($pTrait, $topTraits, true);
            if ($sIdx !== false) {
                $sWeight = $weights[$sIdx] ?? 1;
                $dot += $pWeight * $sWeight;
            }
        }

        $orderScore = $maxDot > 0 ? ($dot / $maxDot) * 25.0 : 0.0;

        return (int) min(100, round($coverageScore + $orderScore));
    }

    /**
     * Check whether the student's SPM grades satisfy the minimum grade of at least one programme rule.
     *
     * @param  array<int, array<string, mixed>>  $spmSnapshot
     */
    public static function meetsProgrammeMinGrade(Programme $programme, array $spmSnapshot): bool
    {
        $rules = $programme->relationLoaded('rules') ? $programme->rules : $programme->rules()->get();

        foreach ($rules as $rule) {
            foreach ($spmSnapshot as $spmItem) {
                if (MeritCalculator::meetsMinGrade($spmItem['grade'] ?? 'G', $rule->min_grade ?? 'C')) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Match and rank programmes against student's Top 2 / Top 3 RIASEC traits and SPM minimum grades.
     *
     * @param  Collection<int, Programme>  $programmes
     * @param  array<string, int|float>  $scores
     * @param  array<int, array<string, mixed>>  $spmSnapshot
     * @return Collection<int, Programme>
     */
    public static function matchProgrammes(Collection $programmes, array $scores, array $spmSnapshot): Collection
    {
        $topTraits = self::getTopTraits($scores, 3);
        $dominantTrait = $topTraits[0];
        $minOverlap = count($topTraits) >= 2 ? 2 : 1;

        $candidates = $programmes->map(function (Programme $prog) use ($topTraits, $dominantTrait, $spmSnapshot) {
            $progTraits = $prog->getOrderedRiasecTypes();
            if (empty($progTraits)) {
                return null;
            }

            $overlap = array_values(array_intersect($progTraits, $topTraits));
            $overlapCount = count($overlap);
            $primaryInTop = in_array($progTraits[0], $topTraits, true);
            $hasDominant = in_array($dominantTrait, $progTraits, true);
            $meetsGrade = self::meetsProgrammeMinGrade($prog, $spmSnapshot);

            return [
                'programme' => $prog,
                'prog_traits' => $progTraits,
                'overlap_count' => $overlapCount,
                'primary_in_top' => $primaryInTop,
                'has_dominant' => $hasDominant,
                'meets_grade' => $meetsGrade,
                'match_score' => self::scoreMatch($progTraits, $topTraits),
            ];
        })->filter();

        // Tier 1: Primary RIASEC is in student's Top 3 AND >= 2 traits overlap (when student has >= 2 traits) + grade met
        $matched = $candidates->filter(fn (array $c) =>
            $c['meets_grade']
            && $c['primary_in_top']
            && $c['overlap_count'] >= $minOverlap
        );

        // Tier 2 Fallback: >= 2 overlapping traits regardless of which is primary + grade met
        if ($matched->isEmpty() && $minOverlap > 1) {
            $matched = $candidates->filter(fn (array $c) =>
                $c['meets_grade'] && $c['overlap_count'] >= $minOverlap
            );
        }

        // Tier 3 Fallback: Contains dominant trait + grade met (handles legacy 1-rule-per-programme datasets)
        if ($matched->isEmpty()) {
            $matched = $candidates->filter(fn (array $c) =>
                $c['meets_grade'] && $c['has_dominant']
            );
        }

        // Tier 4 Fallback: Grade requirement could not be satisfied -> return top 5 by Holland match score
        if ($matched->isEmpty()) {
            $matched = $candidates
                ->filter(fn (array $c) => $c['overlap_count'] >= 1)
                ->sortByDesc('match_score')
                ->take(5);
        }

        return $matched
            ->sortByDesc(function (array $c) use ($dominantTrait) {
                $isExactPrimary = $c['prog_traits'][0] === $dominantTrait ? 1 : 0;

                return ($c['match_score'] * 1000) + ($c['overlap_count'] * 10) + $isExactPrimary;
            })
            ->map(fn (array $c) => $c['programme'])
            ->unique('id')
            ->values();
    }

    /**
     * Attach ordered riasec_types and optional riasec_match metadata onto a Programme model for JSON serialization.
     *
     * @param  array<int, string>  $topTraits
     */
    public static function enrichProgramme(Programme $prog, array $topTraits = []): Programme
    {
        $progTraits = $prog->getOrderedRiasecTypes();
        $prog->setAttribute('riasec_types', $progTraits);
        $prog->setAttribute('riasec_type', $progTraits[0] ?? null);
        $prog->setAttribute('sub_riasec_type', array_slice($progTraits, 1));

        if (!empty($topTraits) && !empty($progTraits)) {
            $matchedTraits = array_values(array_intersect($progTraits, $topTraits));

            $prog->setAttribute('riasec_match', [
                'matched_traits' => $matchedTraits,
                'matched_count' => count($matchedTraits),
                'total_traits' => count($progTraits),
                'score' => self::scoreMatch($progTraits, $topTraits),
                'is_full_match' => count($matchedTraits) === count($progTraits),
                'primary_matched' => in_array($progTraits[0], $topTraits, true),
            ]);
        }

        return $prog;
    }
}

