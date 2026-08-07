<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminUserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $q = User::query();

        if ($search = $request->input('search')) {
            $q->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $q->orderByDesc('created_at')->paginate(20);
        
        $userIds = collect($users->items())->pluck('id')->toArray();
        $searchLogs = \App\Models\SearchLog::whereIn('user_id', $userIds)
            ->orderByDesc('searched_at')
            ->get()
            ->unique('user_id')
            ->keyBy('user_id');

        $favorites = \App\Models\Favorite::whereIn('user_id', $userIds)->get()->groupBy('user_id');
        $cookLogs = \App\Models\CookLog::whereIn('user_id', $userIds)->get()->groupBy('user_id');

        $users->getCollection()->transform(function ($user) use ($searchLogs, $favorites, $cookLogs) {
            $user->favorites_count = $favorites->has($user->id) ? $favorites->get($user->id)->count() : 0;
            $user->cook_logs_count = $cookLogs->has($user->id) ? $cookLogs->get($user->id)->count() : 0;
            $user->last_active = $searchLogs->has($user->id) ? $searchLogs->get($user->id)->searched_at : null;
            return $user;
        });

        return response()->json($users);
    }

    public function updateRole(Request $request, User $user): JsonResponse
    {
        $data = $request->validate(['role' => 'required|in:user,admin']);
        $user->update(['role' => $data['role']]);

        return response()->json(['id' => $user->id, 'role' => $user->role]);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        abort_if($user->id === $request->user()->id, 403, 'Cannot delete your own account');
        $user->delete();

        return response()->json(null, 204);
    }
}
