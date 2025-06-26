<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiResponseMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Postavi default JSON response
        $request->headers->set('Accept', 'application/json');
        
        $response = $next($request);
        
        // Standardizuj odgovore za API
        if ($request->is('api/*')) {
            $original = $response->original;
            
            return response()->json([
                'success' => $response->isSuccessful(),
                'data' => $original['data'] ?? $original,
                'message' => $original['message'] ?? ($response->isSuccessful() ? 'Success' : 'Error'),
            ], $response->getStatusCode());
        }

        return $response;
    }
}