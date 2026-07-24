<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('meal_plan_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meal_plan_id')->constrained()->cascadeOnDelete();
            $table->foreignId('recipe_id')->constrained()->cascadeOnDelete();
            $table->tinyInteger('day_of_week')->unsigned(); // 0=Mon … 6=Sun
            $table->enum('meal_slot', ['breakfast', 'lunch', 'dinner', 'snack']);
            $table->timestamp('created_at')->useCurrent();
            $table->unique(['meal_plan_id', 'day_of_week', 'meal_slot']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meal_plan_items');
    }
};
