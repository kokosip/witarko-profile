<?php

namespace Database\Seeders;

use App\Models\Profile;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $adminEmail = config('app.admin_email') ?: env('ADMIN_EMAIL') ?: 'admin@witarko.local';
        $adminPassword = config('app.admin_password') ?: env('ADMIN_PASSWORD') ?: 'password';

        User::query()->updateOrCreate(
            ['email' => $adminEmail],
            [
                'name' => 'Witarko',
                'password' => Hash::make($adminPassword),
            ]
        );
        Profile::query()->firstOrCreate(
            ['id' => 1],
            [
                'full_name' => 'Witarko',
                'nickname' => 'Koko',
                'headline' => 'Software Engineer [REAL DATA - lengkapi peran utama di /admin]',
                'location' => 'Yogyakarta, Indonesia',
                'email' => null,
                'phone' => null,
                'summary' => 'Profil awal diambil dari akun GitHub @kokosip. Silakan buka halaman Admin (/admin) untuk melengkapi ringkasan profesional, riwayat pengalaman kerja, dan pendidikan sesuai data LinkedIn.',
                'quote' => 'It’s not that I’m so smart, it’s just that I stay with problems longer. - Albert Einstein',
                'github_url' => 'https://github.com/kokosip',
                'linkedin_url' => 'https://www.linkedin.com/in/kokosip/',
                'website_url' => null,
                'avatar_url' => 'https://avatars.githubusercontent.com/u/7519185?v=4',
                'skills' => [
                    'Laravel',
                    'PHP',
                    'JavaScript',
                    'Flutter / Dart',
                    'Kotlin',
                    'Python',
                    'PostgreSQL',
                ],
                'experiences' => [
                    [
                        'id' => 'exp-1',
                        'role' => '[REAL DATA] Posisi / Jabatan',
                        'company' => 'Nama Perusahaan (edit di /admin)',
                        'period' => 'Tahun Mulai - Sekarang',
                        'location' => 'Yogyakarta, Indonesia',
                        'description' => 'Tambahkan deskripsi tanggung jawab dan pencapaian kerja dari LinkedIn melalui halaman /admin.',
                    ],
                ],
                'educations' => [
                    [
                        'id' => 'edu-1',
                        'institution' => '[REAL DATA] Universitas / Institusi',
                        'degree' => 'Gelar / Jurusan (edit di /admin)',
                        'period' => 'Tahun Masuk - Tahun Lulus',
                        'description' => '',
                    ],
                ],
            ]
        );

        $projects = [
            [
                'title' => 'Stream TV',
                'slug' => 'stream-tv',
                'description' => 'Aplikasi Flutter yang dioptimalkan untuk Android dan Android TV untuk streaming film dan serial TV.',
                'subdomain_url' => null,
                'github_url' => 'https://github.com/kokosip/stream-tv',
                'tech_stack' => ['Flutter', 'Dart', 'Android TV'],
                'status' => 'published',
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'Idlix Web',
                'slug' => 'idlix-web',
                'description' => 'Antarmuka web berbasis JavaScript untuk eksplorasi dan pemutaran katalog media.',
                'subdomain_url' => null,
                'github_url' => 'https://github.com/kokosip/idlix-web',
                'tech_stack' => ['JavaScript', 'Web'],
                'status' => 'published',
                'is_featured' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'Idlix Android',
                'slug' => 'idlix-android',
                'description' => 'Aplikasi native Android yang dibangun menggunakan Kotlin.',
                'subdomain_url' => null,
                'github_url' => 'https://github.com/kokosip/idlix-android',
                'tech_stack' => ['Kotlin', 'Android'],
                'status' => 'published',
                'is_featured' => false,
                'sort_order' => 3,
            ],
            [
                'title' => 'Crawling BMKG',
                'slug' => 'crawling-bmkg',
                'description' => 'Skrip Python untuk pengambilan dan pengolahan data dari BMKG.',
                'subdomain_url' => null,
                'github_url' => 'https://github.com/kokosip/crawling-bmkg',
                'tech_stack' => ['Python', 'Data Crawling'],
                'status' => 'published',
                'is_featured' => false,
                'sort_order' => 4,
            ],
            [
                'title' => 'BE Bigview',
                'slug' => 'be-bigview',
                'description' => 'Layanan backend berbasis PHP.',
                'subdomain_url' => null,
                'github_url' => 'https://github.com/kokosip/be-bigview',
                'tech_stack' => ['PHP', 'Backend'],
                'status' => 'published',
                'is_featured' => false,
                'sort_order' => 5,
            ],
            [
                'title' => 'Laravel Simple Blog',
                'slug' => 'laravel-simple-blog',
                'description' => 'Base code untuk sistem blog sederhana menggunakan framework Laravel.',
                'subdomain_url' => null,
                'github_url' => 'https://github.com/kokosip/laravel-simple-blog',
                'tech_stack' => ['Laravel', 'PHP'],
                'status' => 'published',
                'is_featured' => false,
                'sort_order' => 6,
            ],
        ];

        foreach ($projects as $project) {
            Project::query()->firstOrCreate(
                ['slug' => $project['slug']],
                $project
            );
        }
    }
}
