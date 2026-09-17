<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Programme extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'level', 'institution', 'entry_requirement'];

    public function rules()
    {
        return $this->hasMany(RecommendationRule::class);
    }
}