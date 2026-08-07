<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecipeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'title'        => $this->title,
            'description'  => $this->description,
            'category'     => $this->category,
            'cuisine'      => $this->cuisine,
            'cookTime'     => $this->cook_time,
            'servings'     => $this->servings,
            'difficulty'   => $this->difficulty,
            'emoji'        => $this->emoji,
            'image'        => $this->image,
            'gradient'     => $this->gradient,
            'rating'       => $this->rating,
            'reviewCount'  => $this->review_count,
            'viewCount'    => $this->view_count,
            'instructions' => $this->instructions,
            'ingredients'  => IngredientResource::collection($this->ingredients ?? []),
        ];
    }
}
