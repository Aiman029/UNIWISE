<?php

namespace Tests\Unit;

use App\Services\ImksCalculator;
use PHPUnit\Framework\TestCase;

class ImksCalculatorTest extends TestCase
{
    private function buildAnswersFromClusterCounts(array $clusterYesCounts): array
    {
        $answers = [];

        for ($col = 1; $col <= 17; $col++) {
            $code = ImksCalculator::CLUSTERS[$col]['code'];
            $yesNeeded = (int) ($clusterYesCounts[$code] ?? 0);

            $qNums = [];
            for ($i = 1; $i <= 5; $i++) {
                $qNums[] = 5 * ($col - 1) + $i;
                $qNums[] = 85 + 5 * ($col - 1) + $i;
            }

            foreach ($qNums as $idx => $qNum) {
                $answers[$qNum] = $idx < $yesNeeded ? 'Y' : 'T';
            }
        }

        return $answers;
    }

    public function test_imks_questions_json_contains_all_170_mapped_items(): void
    {
        $path = dirname(__DIR__, 2) . '/database/data/imks_questions.json';
        $this->assertFileExists($path);

        $items = json_decode(file_get_contents($path), true);
        $this->assertIsArray($items);
        $this->assertCount(170, $items);

        $sectionACount = 0;
        $sectionBCount = 0;
        $clusterCounts = [];

        foreach ($items as $item) {
            if ($item['section'] === 'A') {
                $sectionACount++;
                $this->assertLessThanOrEqual(85, $item['question_number']);
            } else {
                $sectionBCount++;
                $this->assertGreaterThanOrEqual(86, $item['question_number']);
            }

            $expectedCluster = ImksCalculator::resolveClusterCodeByQuestionNumber($item['question_number']);
            $this->assertSame($expectedCluster, $item['cluster_code']);

            $clusterCounts[$item['cluster_code']] = ($clusterCounts[$item['cluster_code']] ?? 0) + 1;
        }

        $this->assertSame(85, $sectionACount);
        $this->assertSame(85, $sectionBCount);
        $this->assertCount(17, $clusterCounts);

        foreach ($clusterCounts as $code => $count) {
            $this->assertSame(10, $count, "Cluster {$code} must have exactly 10 items (5 A + 5 B)");
        }
    }

    public function test_readme_simulation_produces_expected_clusters_averages_and_asi_code(): void
    {
        $answers = $this->buildAnswersFromClusterCounts([
            'PPR-R' => 6, 'PLD-R' => 4, 'MHR-R' => 5, 'KEJ-R' => 5, // avg = 20/4 = 5.0 -> 5
            'SMT-I' => 8, 'KDP-I' => 7, 'UBT-I' => 6,               // avg = 21/3 = 7.0 -> 7
            'SHI-A' => 9, 'UND-A' => 8,                             // avg = 17/2 = 8.5 -> 9
            'SUK-S' => 7, 'SDN-S' => 8, 'SOS-S' => 9,               // avg = 24/3 = 8.0 -> 8
            'TBR-E' => 5, 'ANP-E' => 4, 'NGA-E' => 3,               // avg = 12/3 = 4.0 -> 4
            'KER-C' => 6, 'KON-C' => 6,                             // avg = 12/2 = 6.0 -> 6
        ]);

        $result = ImksCalculator::calculateIMKSScore($answers);

        $this->assertSame(170, $result['answered_count']);
        $this->assertSame(8.5, $result['riasec_exact']['A']);
        $this->assertSame(9, $result['riasec_rounded']['A']);
        $this->assertSame([
            'R' => 5,
            'I' => 7,
            'A' => 9,
            'S' => 8,
            'E' => 4,
            'C' => 6,
        ], $result['riasec_rounded']);

        $this->assertSame(['ASI'], $result['holland_codes']);
        $this->assertSame('ASI', $result['holland_code_display']);
        $this->assertFalse($result['has_tie']);
        $this->assertFalse($result['undetermined']);
    }

    public function test_all_official_imks_tie_breaker_scenarios(): void
    {
        // 1. Tiada seri: S(9), E(8), A(7)
        $noTie = ImksCalculator::determineThreeLetterHollandCodes(['R' => 3, 'I' => 4, 'A' => 7, 'S' => 9, 'E' => 8, 'C' => 2]);
        $this->assertSame(['SEA'], $noTie['codes']);
        $this->assertFalse($noTie['has_tie']);

        // 2. Seri tempat 1 & 2: S(9), E(9), A(7)
        $tie12 = ImksCalculator::determineThreeLetterHollandCodes(['R' => 3, 'I' => 4, 'A' => 7, 'S' => 9, 'E' => 9, 'C' => 2]);
        $this->assertEqualsCanonicalizing(['SEA', 'ESA'], $tie12['codes']);
        $this->assertTrue($tie12['has_tie']);

        // 3. Seri tempat 2 & 3: S(9), E(8), A(8)
        $tie23 = ImksCalculator::determineThreeLetterHollandCodes(['R' => 3, 'I' => 4, 'A' => 8, 'S' => 9, 'E' => 8, 'C' => 2]);
        $this->assertEqualsCanonicalizing(['SEA', 'SAE'], $tie23['codes']);

        // 4. Seri tempat ke-3: S(9), E(8), A(7), I(7)
        $tie3 = ImksCalculator::determineThreeLetterHollandCodes(['R' => 3, 'I' => 7, 'A' => 7, 'S' => 9, 'E' => 8, 'C' => 2]);
        $this->assertEqualsCanonicalizing(['SEA', 'SEI'], $tie3['codes']);

        // 5. Seri ke-3 tempat teratas: S(9), E(9), A(9)
        $tieAllTop3 = ImksCalculator::determineThreeLetterHollandCodes(['R' => 3, 'I' => 4, 'A' => 9, 'S' => 9, 'E' => 9, 'C' => 2]);
        $this->assertEqualsCanonicalizing(['SEA', 'SAE', 'ESA', 'EAS', 'ASE', 'AES'], $tieAllTop3['codes']);

        // 6. Semua 6 kategori seri -> Tidak Dapat Ditentukan
        $allTie = ImksCalculator::determineThreeLetterHollandCodes(['R' => 5, 'I' => 5, 'A' => 5, 'S' => 5, 'E' => 5, 'C' => 5]);
        $this->assertTrue($allTie['undetermined']);
        $this->assertSame([], $allTie['codes']);
        $this->assertSame('Tidak Dapat Ditentukan', $allTie['display']);
    }
}
