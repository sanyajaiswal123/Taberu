<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Recipe extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'description',
        'category',
        'cuisine',
        'cook_time',
        'servings',
        'difficulty',
        'emoji',
        'image',
        'gradient',
        'rating',
        'review_count',
        'view_count',
        'instructions',
    ];

    protected $casts = [
        'instructions' => 'array',
        'rating' => 'float',
    ];

    public function ingredients(): BelongsToMany
    {
        return $this->belongsToMany(Ingredient::class, 'recipe_ingredient')
            ->withPivot('quantity', 'unit');
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function cookLogs(): HasMany
    {
        return $this->hasMany(CookLog::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(RecipeNote::class);
    }
}
