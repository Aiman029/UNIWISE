<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function show(Request $request): Response
    {
        return Inertia::render('Profile/Show', [
            'user' => [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                'role' => $request->user()->role,
                'status' => $request->user()->status,
                'avatar' => $request->user()->avatar ? asset('storage/' . $request->user()->avatar) : null,
            ],
        ]);
    }

    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'user' => [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                'avatar' => $request->user()->avatar ? asset('storage/' . $request->user()->avatar) : null,
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'current_password' => 'nullable|string',
            'new_password' => ['nullable', 'string', Password::min(6), 'confirmed'],
        ]);

        // If trying to change password
        if ($request->filled('new_password')) {
            if (! $request->filled('current_password') || ! Hash::check($request->current_password, $user->password)) {
                return back()->withErrors([
                    'current_password' => 'Kata laluan semasa atau pengesahan kata laluan baharu tidak sepadan.',
                ])->with('error', 'Kata laluan semasa atau pengesahan kata laluan baharu tidak sepadan.');
            }

            $user->password = Hash::make($request->new_password);
        }

        // If uploading avatar
        if ($request->hasFile('avatar')) {
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $path;
        }

        $user->name = $request->name;
        $user->save();

        return redirect()->route('profile.show')->with('success', 'PROFIL BERJAYA DIKEMASKINI');
    }
}
