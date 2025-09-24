<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;

class CoronaController extends Controller
{
    // Lista država
    public function regions()
    {
        $resp = Http::get('https://covid-api.com/api/regions?per_page=200');
        $regions = $resp->json()['data'] ?? [];

        return response()->json([
            'success' => true,
            'data' => $regions
        ]); 
    }



    // Live podaci za konkretnu državu i datum
    public function report(Request $request, $iso)
    {
        $date = $request->query('date'); // format YYYY-MM-DD

        if (!$date) {
            return response()->json([
                'success' => false,
                'message' => 'Date param is required (YYYY-MM-DD)'
            ], 400);
        }

        $resp = Http::get('https://covid-api.com/api/reports', [
            'iso' => $iso,
            'date' => $date
        ]);

        $row = $resp->json()['data'][0] ?? null;

        if (!$row) {
            return response()->json([
                'success' => false,
                'message' => 'No data for given date'
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'date' => $row['date'],
                'novi_slucajevi' => $row['confirmed_diff'],
                'nove_smrti' => $row['deaths_diff'],
                'ukupno_slucajevi' => $row['confirmed'],
                'ukupno_smrti' => $row['deaths'],
            ]
        ]);
    }
}
