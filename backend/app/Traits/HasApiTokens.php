<?php

namespace App\Traits;

use App\Models\Sanctum\NewAccessToken;
use Illuminate\Support\Str;

trait HasApiTokens
{
    public function tokens()
    {
        return $this->morphMany(\App\Models\PersonalAccessToken::class, 'tokenable');
    }

    public function tokenCan(string $ability)
    {
        return $this->accessToken ? $this->accessToken->can($ability) : false;
    }

    public function createToken(string $name, array $abilities = ['*'], \DateTimeInterface $expiresAt = null)
    {
        $plainTextToken = Str::random(40);

        $token = $this->tokens()->create([
            'name' => $name,
            'token' => hash('sha256', $plainTextToken),
            'abilities' => $abilities,
            'expires_at' => $expiresAt,
        ]);

        return new NewAccessToken($token, $token->getKey().'|'.$plainTextToken);
    }

    public function currentAccessToken()
    {
        return $this->accessToken;
    }

    public function withAccessToken($accessToken)
    {
        $this->accessToken = $accessToken;
        return $this;
    }
}
