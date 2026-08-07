<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShoppingListCheck extends Model
{
    public $timestamps = false;

    protected $fillable = ['meal_plan_id', 'ingredient_name', 'is_checked'];

    protected $casts = ['is_checked' => 'boolean'];

    public function mealPlan(): BelongsTo
    {
        return $this->belongsTo(MealPlan::class);
    }
}
