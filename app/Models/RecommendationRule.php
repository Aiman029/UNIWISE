<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecommendationRule extends Model
{
    use HasFactory;

    protected $fillable = ['riasec_type', 'programme_id', 'min_grade'];

    public function programme()
    {
        return $this->belongsTo(Programme::class);
    }
}