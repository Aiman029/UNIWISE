<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recommendation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'programme_id',
        'session_id',
        'merit_score',
        'dominant_trait',
        'riasec_scores',
        'spm_snapshot',
        'date_generated',
    ];

    protected function casts(): array
    {
        return [
            'riasec_scores' => 'array',
            'spm_snapshot' => 'array',
            'merit_score' => 'float',
            'date_generated' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function programme()
    {
        return $this->belongsTo(Programme::class);
    }
}