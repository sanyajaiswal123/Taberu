<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CookLog;
use App\Http\Resources\RecipeResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class CookLogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $logs = $request->user()
            ->cookLogs()
            ->with('recipe.ingredients')
            ->orderByDesc('cooked_at')
            ->paginate($request->integer('per_page', 20));

        return response()->json($logs);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'recipe_id' => 'required|integer|exists:recipes,id',
            'cooked_at' => 'nullable|date',
            'rating'    => 'nullable|integer|min:1|max:5',
        ]);

        $log = $request->user()->cookLogs()->create([
            'recipe_id' => $data['recipe_id'],
            'cooked_at' => $data['cooked_at'] ?? now(),
            'rating'    => $data['rating'] ?? null,
        ]);

        return response()->json($log, 201);
    }

    public function destroy(Request $request, CookLog $cookLog): JsonResponse
    {
        abort_unless($cookLog->user_id === $request->user()->id, 403);
        $cookLog->delete();

        return response()->json(null, 204);
    }

    public function stats(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $logs = CookLog::where('user_id', $userId)->with('recipe')->get();

        $totalCooked   = $logs->count();
        $uniqueRecipes = $logs->unique('recipe_id')->count();

        $recipeCounts = $logs->countBy('recipe_id');
        
        $mostCookedId = $recipeCounts->sortDesc()->keys()->first();
        $mostCookedRecipe = $mostCookedId ? $logs->firstWhere('recipe_id', $mostCookedId)->recipe : null;
        $mostCooked = $mostCookedRecipe ? (object)[
            'recipe' => $mostCookedRecipe,
            'count' => $recipeCounts[$mostCookedId]
        ] : null;

        $cuisineBreakdown = $logs->map->recipe->filter()->countBy('cuisine')->sortDesc();
        $categoryBreakdown = $logs->map->recipe->filter()->countBy('category')->sortDesc();

        $thisMonth = CookLog::where('user_id', $userId)
            ->where('cooked_at', '>=', now()->startOfMonth())
            ->where('cooked_at', '<=', now()->endOfMonth())
            ->count();

        $top5 = $recipeCounts->sortDesc()->take(5)->map(function ($count, $recipeId) use ($logs) {
            $recipe = $logs->firstWhere('recipe_id', $recipeId)->recipe;
            return $recipe ? array_merge($recipe->toArray(), ['cook_count' => $count]) : null;
        })->filter()->values();

        $streak = $this->computeStreak($userId);

        return response()->json([
            'total_cooked'       => $totalCooked,
            'unique_recipes'     => $uniqueRecipes,
            'most_cooked_recipe' => $mostCooked ? array_merge(
                $mostCooked->recipe->toArray(),
                ['count' => $mostCooked->count]
            ) : null,
            'cuisine_breakdown'  => $cuisineBreakdown,
            'category_breakdown' => $categoryBreakdown,
            'this_month'         => $thisMonth,
            'streak'             => $streak,
            'top_5_recipes'      => $top5,
        ]);
    }

    private function computeStreak(int $userId): array
    {
        $dates = CookLog::where('user_id', $userId)
            ->selectRaw('DATE(cooked_at) as d')
            ->distinct()
            ->orderByDesc('d')
            ->pluck('d')
            ->map(fn ($d) => \Carbon\Carbon::parse($d));

        if ($dates->isEmpty()) return ['current' => 0, 'longest' => 0];

        $current = 0;
        $longest = 0;
        $run     = 0;
        $prev    = null;

        foreach ($dates as $i => $date) {
            if ($prev === null) {
                $run  = 1;
                $prev = $date;
                continue;
            }
            if ($prev->diffInDays($date) === 1) {
                $run++;
            } else {
                if ($i === 1) $current = $run; // first gap ends current streak
                $run = 1;
            }
            $longest = max($longest, $run);
            $prev    = $date;
        }

        $longest = max($longest, $run);

        // Current streak: days from today backwards without gap
        $today    = \Carbon\Carbon::today();
        $current  = 0;
        $expected = $today;
        foreach ($dates as $date) {
            if ($date->equalTo($expected) || $date->equalTo($expected->copy()->subDay())) {
                $current++;
                $expected = $date->copy()->subDay();
            } else {
                break;
            }
        }

        return ['current' => $current, 'longest' => $longest];
    }

    public function countForRecipe(Request $request, int $recipeId): JsonResponse
    {
        $count = CookLog::where('user_id', $request->user()->id)
            ->where('recipe_id', $recipeId)
            ->count();

        $last = CookLog::where('user_id', $request->user()->id)
            ->where('recipe_id', $recipeId)
            ->orderByDesc('cooked_at')
            ->value('cooked_at');

        return response()->json(['count' => $count, 'last_cooked_at' => $last]);
    }
}
