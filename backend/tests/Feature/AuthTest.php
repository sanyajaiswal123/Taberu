<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    // --- register ---

    public function test_register_creates_user_and_returns_cookie(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name'                  => 'Taro',
            'email'                 => 'taro@example.com',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['user' => ['id', 'name', 'email']])
                 ->assertJsonMissing(['token'])
                 ->assertCookie('taberu_token');

        $this->assertDatabaseHas('users', ['email' => 'taro@example.com']);
    }

    public function test_register_rejects_duplicate_email(): void
    {
        User::factory()->create(['email' => 'taro@example.com']);

        $this->postJson('/api/auth/register', [
            'name'                  => 'Taro',
            'email'                 => 'taro@example.com',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
        ])->assertStatus(422);
    }

    public function test_register_rejects_short_password(): void
    {
        $this->postJson('/api/auth/register', [
            'name'                  => 'Taro',
            'email'                 => 'taro@example.com',
            'password'              => 'short',
            'password_confirmation' => 'short',
        ])->assertStatus(422)->assertJsonValidationErrors(['password']);
    }

    // --- login ---

    public function test_login_returns_cookie_for_valid_credentials(): void
    {
        User::factory()->create([
            'email'    => 'taro@example.com',
            'password' => bcrypt('password123'),
        ]);

        $this->postJson('/api/auth/login', [
            'email'    => 'taro@example.com',
            'password' => 'password123',
        ])->assertOk()
          ->assertJsonStructure(['user'])
          ->assertJsonMissing(['token'])
          ->assertCookie('taberu_token');
    }

    public function test_login_rejects_wrong_password(): void
    {
        User::factory()->create(['email' => 'taro@example.com']);

        $this->postJson('/api/auth/login', [
            'email'    => 'taro@example.com',
            'password' => 'wrongpassword',
        ])->assertStatus(401);
    }

    // --- me ---

    public function test_me_returns_current_user(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->getJson('/api/auth/me')
             ->assertOk()
             ->assertJson(['email' => $user->email]);
    }

    public function test_me_requires_auth(): void
    {
        $this->getJson('/api/auth/me')->assertStatus(401);
    }

    // --- logout ---

    public function test_logout_revokes_token_and_clears_cookie(): void
    {
        $user      = User::factory()->create();
        $newToken  = $user->createToken('test');
        $tokenId   = $newToken->accessToken->id;
        $plainText = $newToken->plainTextToken;

        $this->withToken($plainText)->postJson('/api/auth/logout')
             ->assertOk()
             ->assertCookieExpired('taberu_token');

        $this->assertDatabaseMissing('personal_access_tokens', ['id' => $tokenId]);
    }
}
