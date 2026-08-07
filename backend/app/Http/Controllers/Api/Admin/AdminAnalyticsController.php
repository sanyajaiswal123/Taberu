<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\CookLog;
use App\Models\Favorite;
use App\Models\Recipe;
use App\Models\SearchLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AdminAnalyticsController extends Controller
{
    public function overview(): JsonResponse
    {
        $activeUserIds = collect()
            ->merge(CookLog::where('cooked_at', '>=', now()->startOfWeek())->pluck('user_id'))
            ->merge(Favorite::where('created_at', '>=', now()->startOfWeek())->pluck('user_id'))
            ->unique();

        return response()->json([
            'total_users'    => User::count(),
            'total_recipes'  => Recipe::count(),
            'total_favorites'=> Favorite::count(),
            'total_cooks_today' => CookLog::where('cooked_at', '>=', today())->count(),
            'active_this_week'  => $activeUserIds->count(),
        ]);
    }

    public function searchGaps(): JsonResponse
    {
        $gaps = SearchLog::where('results_count', 0)
            ->get()
            ->countBy('query_value')
            ->sortDesc()
            ->take(20)
            ->map(fn($count, $query) => ['query_value' => $query, 'search_count' => $count])
            ->values();

        return response()->json($gaps);
    }

    public function popularRecipes(Request $request): JsonResponse
    {
        $sort = $request->input('sort', 'views');

        $query = Recipe::withCount(['favorites', 'cookLogs']);

        if ($sort === 'views') {
            $recipes = $query->orderByDesc('view_count')->limit(20)->get();
        } else {
            $recipes = $query->get();
            $recipes = $recipes->sortByDesc(match ($sort) {
                'favorites' => 'favorites_count',
                'cooks'     => 'cook_logs_count',
            })->take(20)->values();
        }

        return response()->json($recipes);
    }

    public function trendingSearches(Request $request): JsonResponse
    {
        $days = $request->integer('days', 7);

        $results = SearchLog::where('searched_at', '>=', now()->subDays($days))
            ->get()
            ->countBy('query_value')
            ->sortDesc()
            ->take(30)
            ->map(fn($count, $query) => ['query_value' => $query, 'count' => $count])
            ->values();

        return response()->json($results);
    }

    public function engagement(): JsonResponse
    {
        $users = User::all();
        $favorites = Favorite::all()->groupBy('user_id');
        
        $favsPerUser = $users->groupBy(fn ($u) => match (true) {
            ($favorites->has($u->id) ? $favorites->get($u->id)->count() : 0) === 0 => '0',
            ($favorites->has($u->id) ? $favorites->get($u->id)->count() : 0) <= 5  => '1-5',
            ($favorites->has($u->id) ? $favorites->get($u->id)->count() : 0) <= 20 => '6-20',
            default                   => '20+',
        })->map->count();

        // MongoDB doesn't support grouping in eloquent easily, so fetch all CookLogs, or use aggregate
        $cookLogs = CookLog::all()->groupBy('user_id');
        $avgCooksPerUser = $cookLogs->count() > 0 ? $cookLogs->map->count()->avg() : 0;

        return response()->json([
            'favorites_distribution' => $favsPerUser,
            'avg_cooks_per_user'     => round($avgCooksPerUser ?? 0, 2),
        ]);
    }
}
