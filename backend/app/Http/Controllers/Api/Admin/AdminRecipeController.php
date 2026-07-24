<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use App\Http\Resources\RecipeResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AdminRecipeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $q = Recipe::withCount(['favorites', 'cookLogs'])
            ->with('ingredients');

        if ($search = $request->input('search')) {
            $q->where('title', 'like', "%{$search}%");
        }

        $recipes = $q->orderByDesc('created_at')->paginate(20);

        return RecipeResource::collection($recipes)->response();
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title'        => 'required|string|max:255',
            'category'     => 'required|string|max:100',
            'cuisine'      => 'required|string|max:100',
            'difficulty'   => 'required|in:Easy,Medium,Hard',
            'cook_time'    => 'required|string|max:50',
            'servings'     => 'required|integer|min:1',
            'emoji'        => 'nullable|string|max:10',
            'image'        => 'nullable|url',
            'gradient'     => 'nullable|string|max:255',
            'instructions' => 'required|array|min:1',
            'ingredients'  => 'nullable|array',
        ]);

        $recipe = Recipe::create($data);

        if (!empty($data['ingredients'])) {
            foreach ($data['ingredients'] as $ing) {
                $recipe->ingredients()->attach($ing['id'], [
                    'quantity' => $ing['quantity'] ?? null,
                    'unit'     => $ing['unit'] ?? null,
                ]);
            }
        }

        return response()->json(new RecipeResource($recipe->load('ingredients')), 201);
    }

    public function update(Request $request, Recipe $recipe): JsonResponse
    {
        $data = $request->validate([
            'title'        => 'sometimes|string|max:255',
            'category'     => 'sometimes|string|max:100',
            'cuisine'      => 'sometimes|string|max:100',
            'difficulty'   => 'sometimes|in:Easy,Medium,Hard',
            'cook_time'    => 'sometimes|string|max:50',
            'servings'     => 'sometimes|integer|min:1',
            'emoji'        => 'nullable|string|max:10',
            'image'        => 'nullable|url',
            'gradient'     => 'nullable|string|max:255',
            'instructions' => 'sometimes|array|min:1',
        ]);

        $recipe->update($data);

        return response()->json(new RecipeResource($recipe->load('ingredients')));
    }

    public function destroy(Recipe $recipe): JsonResponse
    {
        $recipe->delete();
        return response()->json(null, 204);
    }

    public function bulkImport(Request $request): JsonResponse
    {
        $request->validate(['file' => 'required|file|mimes:csv,txt']);

        $path   = $request->file('file')->getRealPath();
        $handle = fopen($path, 'r');
        $header = fgetcsv($handle);
        $header = array_map('trim', $header);

        $imported = 0;
        $errors   = [];

        while (($row = fgetcsv($handle)) !== false) {
            $data = array_combine($header, $row);
            try {
                Recipe::create([
                    'title'        => $data['title'],
                    'category'     => $data['category'] ?? 'Dinner',
                    'cuisine'      => $data['cuisine'] ?? 'Other',
                    'difficulty'   => $data['difficulty'] ?? 'Medium',
                    'cook_time'    => $data['cook_time'] ?? '30 mins',
                    'servings'     => (int) ($data['servings'] ?? 2),
                    'emoji'        => $data['emoji'] ?? '🍽️',
                    'gradient'     => $data['gradient'] ?? 'from-amber-400 to-orange-500',
                    'instructions' => json_decode($data['instructions'] ?? '[]', true) ?? [],
                ]);
                $imported++;
            } catch (\Throwable $e) {
                $errors[] = $e->getMessage();
            }
        }

        fclose($handle);

        return response()->json(['imported' => $imported, 'errors' => $errors]);
    }
}
