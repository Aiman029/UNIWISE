<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display list of users with search and filters (SRS Figure 3.2.1.6.2).
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $role = $request->input('role');
        $status = $request->input('status');

        $query = User::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($role && $role !== 'all') {
            $query->where('role', $role);
        }

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        $users = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $search ?? '',
                'role' => $role ?? 'all',
                'status' => $status ?? 'all',
            ],
        ]);
    }

    /**
     * Update user details (SRS Figure 3.2.1.6.4).
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'role' => ['required', 'in:user,admin'],
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', 'USER INFO UPDATE SUCCESSFULLY');
    }

    /**
     * Toggle user account status between active and deactivated (SRS Figure 3.2.1.6.6).
     */
    public function toggleStatus(Request $request, User $user)
    {
        // Prevent admin from deactivating their own active account
        if ($user->id === auth()->id()) {
            return redirect()->back()->withErrors([
                'error' => 'You cannot deactivate your own administrative account.',
            ]);
        }

        $newStatus = $user->status === 'active' ? 'deactivated' : 'active';
        $user->update(['status' => $newStatus]);

        $msg = $newStatus === 'deactivated' 
            ? 'ACCOUNT DEACTIVATE SUCCESSFULLY' 
            : 'ACCOUNT ACTIVATED SUCCESSFULLY';

        return redirect()->back()->with('success', $msg);
    }
}
