<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Laravel\Sanctum\Contracts\HasAbilities;

class PersonalAccessToken extends Model implements HasAbilities
{
    protected $collection = "personal_access_tokens";

    protected $guarded = [];

    protected $casts = [
        "abilities" => "json",
        "last_used_at" => "datetime",
        "expires_at" => "datetime",
    ];

    public function tokenable()
    {
        return $this->morphTo("tokenable");
    }

    public static function findToken($token)
    {
        if (strpos($token, "|") === false) {
            return static::where("token", hash("sha256", $token))->first();
        }

        [$id, $token] = explode("|", $token, 2);

        if ($instance = static::find($id)) {
            return hash_equals($instance->token, hash("sha256", $token)) ? $instance : null;
        }
    }

    public function can($ability)
    {
        return in_array("*", $this->abilities) ||
               in_array($ability, $this->abilities);
    }

    public function cant($ability)
    {
        return ! $this->can($ability);
    }
}
