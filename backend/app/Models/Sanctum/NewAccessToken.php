<?php

namespace App\Models\Sanctum;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Jsonable;
use App\Models\PersonalAccessToken;

class NewAccessToken implements Arrayable, Jsonable
{
    public $accessToken;
    public $plainTextToken;

    public function __construct(PersonalAccessToken $accessToken, string $plainTextToken)
    {
        $this->accessToken = $accessToken;
        $this->plainTextToken = $plainTextToken;
    }

    public function toArray()
    {
        return [
            'accessToken' => $this->accessToken,
            'plainTextToken' => $this->plainTextToken,
        ];
    }

    public function toJson($options = 0)
    {
        return json_encode($this->toArray(), $options);
    }
}
