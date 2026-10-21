<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Programme extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'level',
        'institution',
        'merit',
        'entry_requirement',
        'notes',
    ];

    public function rules()
    {
        return $this->hasMany(RecommendationRule::class);
    }
}