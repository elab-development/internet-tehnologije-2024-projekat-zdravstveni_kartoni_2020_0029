<?php

namespace App\Http\Controllers;

use App\Models\Nurse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NurseController extends Controller
{
    public function index(Request $request)
    {
        $admin = Auth::user();

        if (!$admin || !$admin->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Samo administrator može pristupiti listi medicinskih sestara'
            ], 403);
        }

        $query = Nurse::with(['user:id,name,email']);

        // Pretraga po odeljenju
        if ($request->filled('department')) {
            $query->where('department', 'like', '%' . $request->get('department') . '%');
        }

        // Pretraga po imenu
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', $search . '%');
            });
        }

        $sort = $request->get('sort', 'user.name');
        $direction = $request->get('direction', 'asc');

        if ($sort === 'department') {
            $query->orderBy('department', $direction);
        } else {
            $query->join('users', 'users.id', '=', 'nurses.user_id')
                ->orderBy('users.name', $direction)
                ->select('nurses.*');
        }

        $nurses = $query->paginate($request->get('per_page', 8));

        return response()->json([
            'success' => true,
            'data' => $nurses,
            'message' => 'Lista medicinskih sestara'
        ]);
    }

    public function show($id)
    {
        $admin = Auth::user();

        if (!$admin || !$admin->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Samo administrator može videti detalje o medicinskoj sestri'
            ], 403);
        }

        $nurse = Nurse::with('user:id,name,email,phone,address')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $nurse->id,
                'name' => $nurse->user->name,
                'email' => $nurse->user->email,
                'phone' => $nurse->user->phone,
                'address' => $nurse->user->address,
                'department' => $nurse->department,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $admin = Auth::user();

        if (!$admin || !$admin->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Samo administrator može kreirati medicinsku sestru'
            ], 403);
        }

        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|email|max:255|unique:users,email',
            'password'   => 'required|string|min:6',
            'department' => 'required|string|max:255',
        ]);

        // 1. User
        $newUser = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role'     => 'nurse',
        ]);

        // 2. Nurse
        $nurse = Nurse::create([
            'user_id'    => $newUser->id,
            'department' => $validated['department'],
        ]);

        return response()->json([
            'success' => true,
            'data' => $nurse->load('user:id,name,email,role'),
            'message' => 'Medicinska sestra i korisnik uspešno kreirani'
        ], 201);
    }

    public function updateNurse(Request $request, $id)
    {
        $admin = Auth::user();

        if (!$admin || !$admin->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Samo administrator može izmeniti medicinsku sestru'
            ], 403);
        }

        $nurse = Nurse::find($id);
        if (!$nurse) {
            return response()->json([
                'success' => false,
                'message' => 'Medicinska sestra nije pronađena'
            ], 404);
        }

        $nurseData = $request->only(['department']);
        $validatedNurseData = validator($nurseData, [
            'department' => 'sometimes|string|max:255',
        ])->validate();

        $nurse->update($validatedNurseData);

        $userData = $request->only(['name', 'email']);
        if (!empty($userData)) {
            $validatedUserData = validator($userData, [
                'name'  => 'sometimes|string|max:255',
                'email' => 'sometimes|email|max:255',
            ])->validate();

            $nurse->user()->update($validatedUserData);
        }

        return response()->json([
            'success' => true,
            'data' => $nurse->load('user')
        ]);
    }

    public function deleteNurse(Request $request, $id)
    {
        $admin = Auth::user();

        if (!$admin || !$admin->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Samo administrator može obrisati medicinsku sestru'
            ], 403);
        }

        $nurse = Nurse::find($id);
        if (!$nurse) {
            return response()->json([
                'success' => false,
                'message' => 'Medicinska sestra nije pronađena'
            ], 404);
        }

        $userId = $nurse->user_id;
        $nurse->delete();
        User::destroy($userId);

        return response()->json([
            'success' => true,
            'message' => 'Medicinska sestra uspešno obrisana'
        ]);
    }

    public function updateNursePassword(Request $request, $id)
    {
        $admin = Auth::user();

        if (!$admin || !$admin->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Samo administrator može menjati šifru medicinskoj sestri'
            ], 403);
        }

        $nurse = Nurse::find($id);
        if (!$nurse) {
            return response()->json([
                'success' => false,
                'message' => 'Medicinska sestra nije pronađena'
            ], 404);
        }

        $validated = $request->validate([
            'password' => 'required|string|min:8|confirmed'
        ]);

        $nurse->user->update([
            'password' => bcrypt($validated['password'])
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Šifra medicinske sestre uspešno promenjena'
        ]);
    }
}
