<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

// Guest routes
Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

// Authenticated user routes
Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // User Profile
    Route::get('profile', [\App\Http\Controllers\ProfileController::class, 'show'])->name('profile.show');
    Route::get('profile/edit', [\App\Http\Controllers\ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('profile', [\App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');

    // SPM Academic Results
    Route::get('spm-results', [\App\Http\Controllers\AcademicResultController::class, 'index'])->name('spm-results.index');
    Route::post('spm-results', [\App\Http\Controllers\AcademicResultController::class, 'store'])->name('spm-results.store');

    // RIASEC Assessment & Recommendations
    Route::get('riasec', [\App\Http\Controllers\RiasecController::class, 'index'])->name('riasec.index');
    Route::get('riasec/quiz', [\App\Http\Controllers\RiasecController::class, 'quiz'])->name('riasec.quiz');
    Route::post('riasec/submit', [\App\Http\Controllers\RiasecController::class, 'submit'])->name('riasec.submit');
    Route::get('riasec/result/{sessionId}', [\App\Http\Controllers\RiasecController::class, 'result'])->name('riasec.result');
    Route::get('programmes/{id}', [\App\Http\Controllers\RiasecController::class, 'programmeDetails'])->name('programmes.show');

    // Recommendation History
    Route::get('history', [\App\Http\Controllers\HistoryController::class, 'index'])->name('history.index');
    Route::get('history/{sessionId}', [\App\Http\Controllers\HistoryController::class, 'show'])->name('history.show');
});

// Admin-only routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
});