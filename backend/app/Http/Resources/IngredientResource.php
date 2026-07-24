<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IngredientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'       => $this->id,
            'name'     => $this->name,
            'quantity' => $this->whenPivotLoaded('recipe_ingredient', fn () => $this->pivot->quantity),
            'unit'     => $this->whenPivotLoaded('recipe_ingredient', fn () => $this->pivot->unit),
        ];
    }
}
