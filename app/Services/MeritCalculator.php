<?php

namespace App\Services;

class MeritCalculator
{
    public const GRADE_POINTS = [
        'A+' => 18,
        'A'  => 16,
        'A-' => 14,
        'B+' => 12,
        'B'  => 10,
        'C+' => 8,
        'C'  => 6,
        'D'  => 4,
        'E'  => 2,
        'G'  => 0,
    ];

    /**
     * Calculate merit percentage based on submitted subjects.
     * Takes top 5 to 8 subjects (or all entered subjects up to 8).
     * Max score per subject is 18 points.
     */
    public static function calculate(array $results): float
    {
        if (empty($results)) {
            return 0.0;
        }

        $points = [];
        foreach ($results as $item) {
            $grade = strtoupper(trim($item['grade'] ?? 'G'));
            $pts = self::GRADE_POINTS[$grade] ?? 0;
            $points[] = $pts;
        }

        // Sort descending to take the best subjects
        rsort($points);

        // Take top 8 subjects (or fewer if fewer were submitted, minimum 5)
        $count = min(count($points), 8);
        $topPoints = array_slice($points, 0, $count);

        if ($count === 0) {
            return 0.0;
        }

        $totalPoints = array_sum($topPoints);
        $maxPossible = $count * 18;

        return round(($totalPoints / $maxPossible) * 100, 1);
    }

    /**
     * Compare a user's grade with minimum required grade.
     * Returns true if user's grade is >= required minimum grade.
     */
    public static function meetsMinGrade(string $userGrade, string $minGrade): bool
    {
        $userPts = self::GRADE_POINTS[strtoupper($userGrade)] ?? 0;
        $minPts = self::GRADE_POINTS[strtoupper($minGrade)] ?? 0;

        return $userPts >= $minPts;
    }
}
