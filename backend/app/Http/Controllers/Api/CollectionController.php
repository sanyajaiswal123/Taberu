<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use App\Http\Resources\RecipeResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CollectionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $collections = $request->user()
            ->collections()
            ->withCount('recipes')
            ->orderBy('sort_order')
            ->orderBy('created_at')
            ->get();

        return response()->json($collections);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'  => 'required|string|max:100',
            'emoji' => 'nullable|string|max:10',
        ]);

        $collection = $request->user()->collections()->create([
            'name'       => $data['name'],
            'emoji'      => $data['emoji'] ?? null,
            'sort_order' => $request->user()->collections()->max('sort_order') + 1,
        ]);

        return response()->json($collection->loadCount('recipes'), 201);
    }

    public function update(Request $request, Collection $collection): JsonResponse
    {
        $this->authorizeCollection($request, $collection);

        $data = $request->validate([
            'name'       => 'sometimes|string|max:100',
            'emoji'      => 'nullable|string|max:10',
            'sort_order' => 'sometimes|integer',
        ]);

        $collection->update($data);

        return response()->json($collection->loadCount('recipes'));
    }

    public function destroy(Request $request, Collection $collection): JsonResponse
    {
        $this->authorizeCollection($request, $collection);
        $collection->delete();

        return response()->json(null, 204);
    }

    public function addRecipe(Request $request, Collection $collection): JsonResponse
    {
        $this->authorizeCollection($request, $collection);

        $data = $request->validate(['recipe_id' => 'required|integer|exists:recipes,id']);

        $collection->recipes()->syncWithoutDetaching([$data['recipe_id'] => ['added_at' => now()]]);

        return response()->json(['message' => 'Recipe added to collection'], 201);
    }

    public function removeRecipe(Request $request, Collection $collection, int $recipeId): JsonResponse
    {
        $this->authorizeCollection($request, $collection);
        $collection->recipes()->detach($recipeId);

        return response()->json(null, 204);
    }

    public function recipes(Request $request, Collection $collection): JsonResponse
    {
        $this->authorizeCollection($request, $collection);

        $recipes = $collection->recipes()->with('ingredients')->paginate(20);

        return RecipeResource::collection($recipes)->response();
    }

    private function authorizeCollection(Request $request, Collection $collection): void
    {
        abort_unless($collection->user_id === $request->user()->id, 403);
    }
}
