<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiResponseMiddleware
{
   public function handle(Request $request, Closure $next): Response
{
    $request->headers->set('Accept', 'application/json');
    
    try {
        $response = $next($request);
        
        // Preskoči za greške
        if (!$response->isSuccessful()) {
            return $response;
        }

        return response()->json([
            'success' => true,
            'data' => 
            $response->original,
        ], $response->getStatusCode());
        
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
}
}