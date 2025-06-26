<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Enums\UserRole;

class Authenticate
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        // Provera uloge ako su specificirane
        if (!empty($roles)) {
            $userRole = auth()->user()->role;
            
            if (!in_array($userRole, $roles)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized for this action'
                ], 403);
            }
        }

        return $next($request);
    }
}