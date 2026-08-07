<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CookLog extends Model
{
    public $timestamps = false;

    protected $table = 'cook_log';

    protected $fillable = ['user_id', 'recipe_id', 'cooked_at', 'rating'];

    protected $casts = [
        'cooked_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function recipe(): BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }
}
