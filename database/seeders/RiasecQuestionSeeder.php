<?php

namespace Database\Seeders;

use App\Models\RiasecQuestion;
use Illuminate\Database\Seeder;

class RiasecQuestionSeeder extends Seeder
{
    public function run(): void
    {
        $questions = [
            // Realistic (5)
            ['text' => 'Saya suka membaiki peralatan atau mesin rosak.', 'category' => 'Realistic'],
            ['text' => 'Saya lebih suka kerja luar berbanding di pejabat.', 'category' => 'Realistic'],
            ['text' => 'Saya gemar bekerja dengan tangan (pertukangan, mekanikal).', 'category' => 'Realistic'],
            ['text' => 'Saya suka membina atau membaiki sesuatu dari awal.', 'category' => 'Realistic'],
            ['text' => 'Saya selesa menggunakan perkakas dan jentera.', 'category' => 'Realistic'],

            // Investigative (5)
            ['text' => 'Saya suka menyelesaikan masalah yang kompleks.', 'category' => 'Investigative'],
            ['text' => 'Saya gemar menjalankan penyelidikan atau kajian.', 'category' => 'Investigative'],
            ['text' => 'Saya suka menganalisis data dan mencari corak.', 'category' => 'Investigative'],
            ['text' => 'Saya tertarik dengan sains dan teori baharu.', 'category' => 'Investigative'],
            ['text' => 'Saya suka bertanya "kenapa" dan mencari jawapan mendalam.', 'category' => 'Investigative'],

            // Artistic (5)
            ['text' => 'Saya suka mengekspresikan diri melalui seni atau muzik.', 'category' => 'Artistic'],
            ['text' => 'Saya gemar aktiviti kreatif seperti melukis atau menulis.', 'category' => 'Artistic'],
            ['text' => 'Saya suka mencipta idea atau reka bentuk yang unik.', 'category' => 'Artistic'],
            ['text' => 'Saya selesa dengan persekitaran kerja yang fleksibel dan tidak berstruktur.', 'category' => 'Artistic'],
            ['text' => 'Saya suka mempersembahkan karya asli saya kepada orang lain.', 'category' => 'Artistic'],

            // Social (5)
            ['text' => 'Saya suka membantu dan mengajar orang lain.', 'category' => 'Social'],
            ['text' => 'Saya gemar bekerja dalam kumpulan dan berbincang.', 'category' => 'Social'],
            ['text' => 'Saya prihatin terhadap kebajikan dan masalah orang lain.', 'category' => 'Social'],
            ['text' => 'Saya suka menjadi mentor atau memberi nasihat.', 'category' => 'Social'],
            ['text' => 'Saya selesa bercakap dan berinteraksi dengan ramai orang.', 'category' => 'Social'],

            // Enterprising (5)
            ['text' => 'Saya suka memimpin dan mengarah orang lain.', 'category' => 'Enterprising'],
            ['text' => 'Saya gemar meyakinkan orang lain terhadap idea saya.', 'category' => 'Enterprising'],
            ['text' => 'Saya suka mengambil risiko untuk peluang perniagaan.', 'category' => 'Enterprising'],
            ['text' => 'Saya tertarik dengan jawatan kepimpinan dan pengurusan.', 'category' => 'Enterprising'],
            ['text' => 'Saya suka bersaing untuk mencapai matlamat.', 'category' => 'Enterprising'],

            // Conventional (5)
            ['text' => 'Saya suka menyusun data dan rekod dengan kemas.', 'category' => 'Conventional'],
            ['text' => 'Saya gemar mengikut prosedur dan peraturan yang jelas.', 'category' => 'Conventional'],
            ['text' => 'Saya teliti dalam kerja yang melibatkan angka dan butiran.', 'category' => 'Conventional'],
            ['text' => 'Saya selesa bekerja dengan jadual dan struktur yang tetap.', 'category' => 'Conventional'],
            ['text' => 'Saya suka menguruskan fail dan sistem pentadbiran.', 'category' => 'Conventional'],
        ];

        foreach ($questions as $q) {
            RiasecQuestion::create([
                'question_text' => $q['text'],
                'category' => $q['category'],
            ]);
        }
    }
}