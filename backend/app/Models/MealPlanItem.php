<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MealPlanItem extends Model
{
    public $timestamps = false;

    protected $fillable = ['meal_plan_id', 'recipe_id', 'day_of_week', 'meal_slot'];

    protected $casts = ['created_at' => 'datetime'];

    public function mealPlan(): BelongsTo
    {
        return $this->belongsTo(MealPlan::class);
    }

    public function recipe(): BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }
}
