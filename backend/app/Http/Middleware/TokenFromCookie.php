<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class TokenFromCookie
{
    /**
     * Reads the httpOnly `taberu_token` cookie and injects it as a Bearer
     * Authorization header so Sanctum's token guard can validate it normally.
     * Only runs when no Authorization header is already present.
     */
    public function handle(Request $request, Closure $next): mixed
    {
        if (! $request->bearerToken() && $token = $request->cookie('taberu_token')) {
            $request->headers->set('Authorization', 'Bearer ' . $token);
        }

        return $next($request);
    }
}
