<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ingredient;
use App\Models\SearchLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IngredientController extends Controller
{
    public function suggestions(Request $request): JsonResponse
    {
        $q = $request->input('q', '');

        if (strlen($q) < 2) {
            return response()->json([]);
        }

        $names = Ingredient::where('name', 'like', '%' . $q . '%')
            ->orderBy('name')
            ->limit(6)
            ->pluck('name');

        SearchLog::create([
            'query_type'    => 'ingredient',
            'query_value'   => $q,
            'results_count' => $names->count(),
            'user_id'       => $request->user()?->id,
        ]);

        return response()->json($names);
    }
}
