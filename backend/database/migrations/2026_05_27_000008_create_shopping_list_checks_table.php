<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('shopping_list_checks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meal_plan_id')->constrained()->cascadeOnDelete();
            $table->string('ingredient_name');
            $table->boolean('is_checked')->default(false);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shopping_list_checks');
    }
};
