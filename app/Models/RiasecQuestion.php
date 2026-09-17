<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiasecQuestion extends Model
{
    use HasFactory;

    protected $fillable = ['question_text', 'category'];

    public function responses()
    {
        return $this->hasMany(RiasecResponse::class, 'question_id');
    }
}