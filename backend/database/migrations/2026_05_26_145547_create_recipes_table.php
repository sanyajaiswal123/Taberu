<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('category', 50);
            $table->string('cuisine', 50);
            $table->string('cook_time', 50)->nullable();
            $table->tinyInteger('servings')->unsigned()->nullable();
            $table->string('difficulty', 20)->nullable();
            $table->string('emoji', 10)->nullable();
            $table->string('image', 500)->nullable();
            $table->string('gradient', 100)->nullable();
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('review_count')->default(0);
            $table->integer('view_count')->default(0);
            $table->json('instructions')->nullable();
            $table->timestamps();

            $table->index('category');
            $table->index('cuisine');
            $table->index('view_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recipes');
    }
};
