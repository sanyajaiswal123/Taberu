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
        $q = User::withCount(['favorites', 'cookLogs'])
            ->selectRaw('users.*, (SELECT MAX(searched_at) FROM search_logs WHERE search_logs.user_id = users.id) as last_active');

        if ($search = $request->input('search')) {
            $q->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $q->orderByDesc('created_at')->paginate(20);

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
