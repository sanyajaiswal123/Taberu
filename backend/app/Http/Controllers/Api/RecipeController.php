<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RecipeResource;
use App\Models\Recipe;
use App\Models\SearchLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Cache;

class RecipeController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Recipe::query();

        if ($request->filled('category')) {
            $query->where('category', $request->input('category'));
        }

        if ($request->filled('cuisine')) {
            $query->where('cuisine', $request->input('cuisine'));
        }

        if ($request->filled('q')) {
            $query->where('title', 'like', '%' . $request->input('q') . '%');
        }

        if ($request->filled('ingredients')) {
            $names = array_map('trim', explode(',', $request->input('ingredients')));
            $query->whereIn('ingredients.name', $names);
        }

        $results = $query->get();

        if ($request->filled('ingredients')) {
            $names = array_map('trim', explode(',', $request->input('ingredients')));
            $results = $results->map(function ($recipe) use ($names) {
                $recipe->match_count = collect($recipe->ingredients)->whereIn('name', $names)->count();
                return $recipe;
            })->sortByDesc('match_count')->values();
        }

        // Log text searches
        if ($request->filled('q')) {
            SearchLog::create([
                'query_type'    => 'text',
                'query_value'   => $request->input('q'),
                'results_count' => $results->count(),
                'user_id'       => $request->user()?->id,
            ]);
        }

        return RecipeResource::collection($results);
    }

    public function popular(Request $request): AnonymousResourceCollection
    {
        $limit = min((int) $request->input('limit', 6), 50);

        $recipes = Cache::remember("recipes.popular.{$limit}", 300, fn () =>
            Recipe::orderByDesc('view_count')->limit($limit)->get()
        );

        return RecipeResource::collection($recipes);
    }

    public function show(Recipe $recipe): RecipeResource
    {
        return new RecipeResource($recipe);
    }

    public function view(Recipe $recipe): JsonResponse
    {
        $recipe->increment('view_count');

        return response()->json(['view_count' => $recipe->view_count]);
    }
}
