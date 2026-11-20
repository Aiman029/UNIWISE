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
        return $this->hasMany(RecommendationRule::class)->orderBy('id');
    }

    /**
     * Return ordered unique RIASEC types for this programme (primary first, then sub-traits).
     *
     * @return array<int, string>
     */
    public function getOrderedRiasecTypes(): array
    {
        $rules = $this->relationLoaded('rules') ? $this->rules : $this->rules()->get();

        return $rules->pluck('riasec_type')
            ->filter()
            ->unique()
            ->values()
            ->all();
    }
}