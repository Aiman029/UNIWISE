<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SpmResult extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'stream', 'subject', 'grade'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}