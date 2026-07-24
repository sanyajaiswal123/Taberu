<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use App\Models\RecipeNote;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RecipeNoteController extends Controller
{
    public function show(Request $request, Recipe $recipe): JsonResponse
    {
        $note = RecipeNote::where('user_id', $request->user()->id)
            ->where('recipe_id', $recipe->id)
            ->first();

        return response()->json($note);
    }

    public function upsert(Request $request, Recipe $recipe): JsonResponse
    {
        $data = $request->validate(['note_text' => 'required|string|max:5000']);

        $note = RecipeNote::updateOrCreate(
            ['user_id' => $request->user()->id, 'recipe_id' => $recipe->id],
            ['note_text' => $data['note_text']]
        );

        $created = $note->wasRecentlyCreated;

        return response()->json($note, $created ? 201 : 200);
    }

    public function destroy(Request $request, Recipe $recipe): JsonResponse
    {
        RecipeNote::where('user_id', $request->user()->id)
            ->where('recipe_id', $recipe->id)
            ->delete();

        return response()->json(null, 204);
    }
}
