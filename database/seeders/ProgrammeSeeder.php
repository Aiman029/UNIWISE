<?php

namespace Database\Seeders;

use App\Models\Programme;
use Illuminate\Database\Seeder;

class ProgrammeSeeder extends Seeder
{
    public function run(): void
    {
        $programmes = [
            ['name' => 'Diploma Kejuruteraan Mekanikal', 'level' => 'Diploma', 'institution' => 'Politeknik Ungku Omar', 'entry_requirement' => 'Lulus SPM dengan kepujian Matematik dan Sains'],
            ['name' => 'Diploma Teknologi Elektrik', 'level' => 'Diploma', 'institution' => 'Politeknik Sultan Salahuddin Abdul Aziz Shah', 'entry_requirement' => 'Lulus SPM dengan kepujian Matematik dan Fizik'],
            ['name' => 'Sijil Automotif', 'level' => 'Certificate', 'institution' => 'Kolej Komuniti Selayang', 'entry_requirement' => 'Lulus SPM (minimum 3 kepujian)'],
            ['name' => 'Diploma Sains Komputer', 'level' => 'Diploma', 'institution' => 'UiTM Shah Alam', 'entry_requirement' => 'Lulus SPM dengan kepujian Matematik'],
            ['name' => 'Asasi Sains', 'level' => 'Foundation', 'institution' => 'UPSI', 'entry_requirement' => 'Lulus SPM dengan kepujian Matematik, Sains, dan Bahasa Inggeris'],
            ['name' => 'Diploma Kejururawatan', 'level' => 'Diploma', 'institution' => 'UiTM Puncak Alam', 'entry_requirement' => 'Lulus SPM dengan kepujian Biologi/Sains'],
            ['name' => 'Diploma Seni Reka Grafik', 'level' => 'Diploma', 'institution' => 'UiTM Melaka', 'entry_requirement' => 'Lulus SPM (minimum 3 kepujian)'],
            ['name' => 'Diploma Senibina', 'level' => 'Diploma', 'institution' => 'UiTM Perak', 'entry_requirement' => 'Lulus SPM dengan kepujian Matematik dan Lukisan Kejuruteraan'],
            ['name' => 'Asasi Pendidikan', 'level' => 'Foundation', 'institution' => 'UPSI', 'entry_requirement' => 'Lulus SPM dengan kepujian Bahasa Melayu dan Bahasa Inggeris'],
            ['name' => 'Diploma Kaunseling', 'level' => 'Diploma', 'institution' => 'UPSI', 'entry_requirement' => 'Lulus SPM (minimum 5 kepujian)'],
            ['name' => 'Diploma Pengurusan Perniagaan', 'level' => 'Diploma', 'institution' => 'UiTM Kedah', 'entry_requirement' => 'Lulus SPM dengan kepujian Matematik'],
            ['name' => 'Diploma Pemasaran', 'level' => 'Diploma', 'institution' => 'Politeknik Ibrahim Sultan', 'entry_requirement' => 'Lulus SPM (minimum 3 kepujian)'],
            ['name' => 'Sijil Keusahawanan', 'level' => 'Certificate', 'institution' => 'Kolej Komuniti Rembau', 'entry_requirement' => 'Lulus SPM (minimum 3 kepujian)'],
            ['name' => 'Diploma Undang-Undang', 'level' => 'Diploma', 'institution' => 'UiTM Shah Alam', 'entry_requirement' => 'Lulus SPM dengan kepujian Bahasa Inggeris dan Sejarah'],
            ['name' => 'Diploma Perakaunan', 'level' => 'Diploma', 'institution' => 'UiTM Segamat', 'entry_requirement' => 'Lulus SPM dengan kepujian Matematik'],
            ['name' => 'Diploma Pentadbiran Awam', 'level' => 'Diploma', 'institution' => 'UiTM Perlis', 'entry_requirement' => 'Lulus SPM (minimum 4 kepujian)'],
            ['name' => 'Diploma Sains Penyiasatan Forensik', 'level' => 'Diploma', 'institution' => 'UiTM Puncak Alam', 'entry_requirement' => 'Lulus SPM dengan kepujian Biologi dan Kimia'],
            ['name' => 'Asasi Undang-Undang', 'level' => 'Foundation', 'institution' => 'UiTM Dengkil', 'entry_requirement' => 'Lulus SPM dengan kepujian Bahasa Inggeris'],
            ['name' => 'Diploma Teknologi Maklumat', 'level' => 'Diploma', 'institution' => 'Politeknik Kota Bharu', 'entry_requirement' => 'Lulus SPM dengan kepujian Matematik'],
            ['name' => 'Sijil Multimedia Kreatif', 'level' => 'Certificate', 'institution' => 'Kolej Komuniti Bandar Penawar', 'entry_requirement' => 'Lulus SPM (minimum 3 kepujian)'],
        ];

        foreach ($programmes as $p) {
            Programme::create($p);
        }
    }
}