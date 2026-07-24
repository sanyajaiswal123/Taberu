<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Run order matters:
     *  1. RecipeSeeder — creates all recipes + ingredients (needed for FK refs below)
     *  2. IngredientSuggestionSeeder — populates autocomplete table
     *  3. UserSeeder — creates demo accounts with favorites, collections, cook logs, etc.
     */
    public function run(): void
    {
        $this->call([
            RecipeSeeder::class,
            IngredientSuggestionSeeder::class,
            UserSeeder::class,
        ]);
    }
}
