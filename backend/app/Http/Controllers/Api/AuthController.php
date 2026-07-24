<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    private const COOKIE = 'taberu_token';
    private const TTL    = 60 * 24 * 7; // 7 days in minutes

    public function register(RegisterRequest $request): JsonResponse
    {
        $user  = User::create($request->validated());
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['user' => new UserResource($user)], 201)
            ->cookie(self::COOKIE, $token, self::TTL);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        if (! Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        $user  = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['user' => new UserResource($user)])
            ->cookie(self::COOKIE, $token, self::TTL);
    }

    public function logout(): JsonResponse
    {
        auth()->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out.'])
            ->withoutCookie(self::COOKIE);
    }

    public function me(): JsonResponse
    {
        return response()->json(new UserResource(auth()->user()));
    }
}
