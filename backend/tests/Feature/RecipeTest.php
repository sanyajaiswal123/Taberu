<?php

namespace Tests\Feature;

use App\Models\Ingredient;
use App\Models\Recipe;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RecipeTest extends TestCase
{
    use RefreshDatabase;

    // --- index ---

    public function test_index_returns_all_recipes(): void
    {
        Recipe::factory()->count(5)->create();

        $this->getJson('/api/recipes')
             ->assertOk()
             ->assertJsonCount(5, 'data');
    }

    public function test_index_filters_by_category(): void
    {
        Recipe::factory()->create(['category' => 'breakfast']);
        Recipe::factory()->create(['category' => 'dinner']);

        $this->getJson('/api/recipes?category=breakfast')
             ->assertOk()
             ->assertJsonCount(1, 'data');
    }

    public function test_index_filters_by_cuisine(): void
    {
        Recipe::factory()->create(['cuisine' => 'japanese']);
        Recipe::factory()->create(['cuisine' => 'indian']);

        $this->getJson('/api/recipes?cuisine=japanese')
             ->assertOk()
             ->assertJsonCount(1, 'data');
    }

    public function test_index_filters_by_name_query(): void
    {
        Recipe::factory()->create(['title' => 'Ramen Bowl']);
        Recipe::factory()->create(['title' => 'Pasta Carbonara']);

        $this->getJson('/api/recipes?q=ramen')
             ->assertOk()
             ->assertJsonCount(1, 'data');
    }

    public function test_index_filters_by_ingredients(): void
    {
        $tofu    = Ingredient::create(['name' => 'tofu']);
        $chicken = Ingredient::create(['name' => 'chicken']);

        $tofuRecipe    = Recipe::factory()->create(['title' => 'Tofu Soup']);
        $chickenRecipe = Recipe::factory()->create(['title' => 'Chicken Curry']);

        $tofuRecipe->ingredients()->attach($tofu->id);
        $chickenRecipe->ingredients()->attach($chicken->id);

        $response = $this->getJson('/api/recipes?ingredients=tofu')
                         ->assertOk();

        $titles = collect($response->json('data'))->pluck('title');
        $this->assertTrue($titles->contains('Tofu Soup'));
        $this->assertFalse($titles->contains('Chicken Curry'));
    }

    // --- popular ---

    public function test_popular_returns_recipes_ordered_by_view_count(): void
    {
        Recipe::factory()->create(['view_count' => 10]);
        Recipe::factory()->create(['view_count' => 100]);
        Recipe::factory()->create(['view_count' => 50]);

        $response = $this->getJson('/api/recipes/popular')->assertOk();
        $counts   = collect($response->json('data'))->pluck('viewCount')->values();

        $this->assertEquals([100, 50, 10], $counts->all());
    }

    public function test_popular_respects_limit_param(): void
    {
        Recipe::factory()->count(10)->create();

        $this->getJson('/api/recipes/popular?limit=3')
             ->assertOk()
             ->assertJsonCount(3, 'data');
    }

    // --- show ---

    public function test_show_returns_recipe_with_ingredients(): void
    {
        $recipe     = Recipe::factory()->create();
        $ingredient = Ingredient::create(['name' => 'miso']);
        $recipe->ingredients()->attach($ingredient->id, ['quantity' => '2 tbsp', 'unit' => null]);

        $response = $this->getJson("/api/recipes/{$recipe->id}")->assertOk();

        $this->assertEquals($recipe->title, $response->json('data.title'));
        $this->assertCount(1, $response->json('data.ingredients'));
        $this->assertEquals('miso', $response->json('data.ingredients.0.name'));
    }

    public function test_show_returns_404_for_missing_recipe(): void
    {
        $this->getJson('/api/recipes/9999')->assertStatus(404);
    }

    // --- view ---

    public function test_view_increments_view_count(): void
    {
        $recipe = Recipe::factory()->create(['view_count' => 5]);

        $this->postJson("/api/recipes/{$recipe->id}/view")->assertOk();

        $this->assertDatabaseHas('recipes', [
            'id'         => $recipe->id,
            'view_count' => 6,
        ]);
    }

    // --- ping ---

    public function test_ping_returns_ok(): void
    {
        $this->getJson('/api/ping')->assertOk()->assertJson(['status' => 'ok']);
    }
}
