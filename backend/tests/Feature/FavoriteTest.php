<?php

namespace Tests\Feature;

use App\Models\Favorite;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FavoriteTest extends TestCase
{
    use RefreshDatabase;

    // --- index ---

    public function test_favorites_index_requires_auth(): void
    {
        $this->getJson('/api/favorites')->assertStatus(401);
    }

    public function test_favorites_index_returns_users_favorited_recipes(): void
    {
        $user  = User::factory()->create();
        $r1    = Recipe::factory()->create();
        $r2    = Recipe::factory()->create();
        Recipe::factory()->create(); // not favorited

        Favorite::create(['user_id' => $user->id, 'recipe_id' => $r1->id]);
        Favorite::create(['user_id' => $user->id, 'recipe_id' => $r2->id]);

        $this->actingAs($user)->getJson('/api/favorites')
             ->assertOk()
             ->assertJsonCount(2, 'data');
    }

    public function test_favorites_index_is_scoped_to_current_user(): void
    {
        $user1  = User::factory()->create();
        $user2  = User::factory()->create();
        $recipe = Recipe::factory()->create();

        Favorite::create(['user_id' => $user2->id, 'recipe_id' => $recipe->id]);

        $this->actingAs($user1)->getJson('/api/favorites')
             ->assertOk()
             ->assertJsonCount(0, 'data');
    }

    // --- store ---

    public function test_store_requires_auth(): void
    {
        $recipe = Recipe::factory()->create();

        $this->postJson("/api/favorites/{$recipe->id}")->assertStatus(401);
    }

    public function test_store_adds_favorite(): void
    {
        $user   = User::factory()->create();
        $recipe = Recipe::factory()->create();

        $this->actingAs($user)->postJson("/api/favorites/{$recipe->id}")
             ->assertStatus(201)
             ->assertJson(['favorited' => true]);

        $this->assertDatabaseHas('favorites', [
            'user_id'   => $user->id,
            'recipe_id' => $recipe->id,
        ]);
    }

    public function test_store_is_idempotent(): void
    {
        $user   = User::factory()->create();
        $recipe = Recipe::factory()->create();

        $this->actingAs($user)->postJson("/api/favorites/{$recipe->id}");
        $this->actingAs($user)->postJson("/api/favorites/{$recipe->id}")->assertStatus(201);

        $this->assertDatabaseCount('favorites', 1);
    }

    // --- destroy ---

    public function test_destroy_requires_auth(): void
    {
        $recipe = Recipe::factory()->create();

        $this->deleteJson("/api/favorites/{$recipe->id}")->assertStatus(401);
    }

    public function test_destroy_removes_favorite(): void
    {
        $user   = User::factory()->create();
        $recipe = Recipe::factory()->create();

        Favorite::create(['user_id' => $user->id, 'recipe_id' => $recipe->id]);

        $this->actingAs($user)->deleteJson("/api/favorites/{$recipe->id}")
             ->assertOk()
             ->assertJson(['favorited' => false]);

        $this->assertDatabaseMissing('favorites', [
            'user_id'   => $user->id,
            'recipe_id' => $recipe->id,
        ]);
    }

    public function test_destroy_on_non_existent_favorite_is_safe(): void
    {
        $user   = User::factory()->create();
        $recipe = Recipe::factory()->create();

        $this->actingAs($user)->deleteJson("/api/favorites/{$recipe->id}")->assertOk();
    }
}
