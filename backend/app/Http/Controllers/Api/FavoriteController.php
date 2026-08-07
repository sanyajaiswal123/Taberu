<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RecipeResource;
use App\Models\Favorite;
use App\Models\Recipe;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FavoriteController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $favoriteRecipeIds = Favorite::where('user_id', auth()->id())->pluck('recipe_id');
        $recipes = Recipe::whereIn('_id', $favoriteRecipeIds)->get();

        return RecipeResource::collection($recipes);
    }

    public function store(Recipe $recipe): JsonResponse
    {
        Favorite::firstOrCreate([
            'user_id'   => auth()->id(),
            'recipe_id' => $recipe->id,
        ]);

        return response()->json(['favorited' => true], 201);
    }

    public function destroy(Recipe $recipe): JsonResponse
    {
        Favorite::where('user_id', auth()->id())
            ->where('recipe_id', $recipe->id)
            ->delete();

        return response()->json(['favorited' => false]);
    }
}
