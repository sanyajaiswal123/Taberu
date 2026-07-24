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
        return response()->json([
            'total_users'    => User::count(),
            'total_recipes'  => Recipe::count(),
            'total_favorites'=> Favorite::count(),
            'total_cooks_today' => CookLog::whereDate('cooked_at', today())->count(),
            'active_this_week'  => User::whereHas('cookLogs', function ($q) {
                $q->where('cooked_at', '>=', now()->startOfWeek());
            })->orWhereHas('favorites', function ($q) {
                $q->where('created_at', '>=', now()->startOfWeek());
            })->count(),
        ]);
    }

    public function searchGaps(): JsonResponse
    {
        $gaps = SearchLog::where('results_count', 0)
            ->select('query_value', DB::raw('count(*) as search_count'))
            ->groupBy('query_value')
            ->orderByDesc('search_count')
            ->limit(20)
            ->get();

        return response()->json($gaps);
    }

    public function popularRecipes(Request $request): JsonResponse
    {
        $sort = $request->input('sort', 'views');

        $q = Recipe::withCount(['favorites', 'cookLogs']);

        $q->orderByDesc(match ($sort) {
            'favorites' => 'favorites_count',
            'cooks'     => 'cook_logs_count',
            default     => 'view_count',
        });

        return response()->json($q->limit(20)->get());
    }

    public function trendingSearches(Request $request): JsonResponse
    {
        $days = $request->integer('days', 7);

        $results = SearchLog::where('searched_at', '>=', now()->subDays($days))
            ->select('query_value', DB::raw('count(*) as count'))
            ->groupBy('query_value')
            ->orderByDesc('count')
            ->limit(30)
            ->get();

        return response()->json($results);
    }

    public function engagement(): JsonResponse
    {
        $favsPerUser = User::withCount('favorites')
            ->get()
            ->groupBy(fn ($u) => match (true) {
                $u->favorites_count === 0 => '0',
                $u->favorites_count <= 5  => '1-5',
                $u->favorites_count <= 20 => '6-20',
                default                   => '20+',
            })
            ->map->count();

        $avgCooksPerUser = User::has('cookLogs')->withCount('cookLogs')->get()->avg('cook_logs_count');

        return response()->json([
            'favorites_distribution' => $favsPerUser,
            'avg_cooks_per_user'     => round($avgCooksPerUser ?? 0, 2),
        ]);
    }
}
