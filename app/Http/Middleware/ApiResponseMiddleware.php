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

            if (!$response->isSuccessful()) {
                return $response;
            }

            $original = $response->original ?? null;
            if (
                is_array($original) &&
                array_key_exists('success', $original) &&
                array_key_exists('data', $original)
            ) {
                return response()->json($original, $response->getStatusCode());
            }
            return response()->json([
                'success' => true,
                'data'    => $original,
            ], $response->getStatusCode());

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
