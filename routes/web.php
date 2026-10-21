<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

// Public Course & University Explorer Directory (SRS Enhancement)
Route::get('directory', [\App\Http\Controllers\DirectoryController::class, 'index'])->name('directory.index');

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

    // User Accounts Management (SRS 3.2.1.6)
    Route::get('users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
    Route::put('users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'update'])->name('users.update');
    Route::patch('users/{user}/toggle-status', [\App\Http\Controllers\Admin\UserController::class, 'toggleStatus'])->name('users.toggle-status');

    // Programme Info Management (SRS 3.2.1.7)
    Route::get('programmes', [\App\Http\Controllers\Admin\ProgrammeController::class, 'index'])->name('programmes.index');
    Route::post('programmes', [\App\Http\Controllers\Admin\ProgrammeController::class, 'store'])->name('programmes.store');
    Route::put('programmes/{programme}', [\App\Http\Controllers\Admin\ProgrammeController::class, 'update'])->name('programmes.update');
    Route::delete('programmes/{programme}', [\App\Http\Controllers\Admin\ProgrammeController::class, 'destroy'])->name('programmes.destroy');

    // RIASEC Question Management (SRS 3.2.1.8)
    Route::get('riasec-questions', [\App\Http\Controllers\Admin\RiasecQuestionController::class, 'index'])->name('riasec-questions.index');
    Route::post('riasec-questions', [\App\Http\Controllers\Admin\RiasecQuestionController::class, 'store'])->name('riasec-questions.store');
    Route::put('riasec-questions/{question}', [\App\Http\Controllers\Admin\RiasecQuestionController::class, 'update'])->name('riasec-questions.update');
    Route::delete('riasec-questions/{question}', [\App\Http\Controllers\Admin\RiasecQuestionController::class, 'destroy'])->name('riasec-questions.destroy');

    // Recommendation Rules Management (SRS 3.2.1.9)
    Route::get('recommendation-rules', [\App\Http\Controllers\Admin\RecommendationRuleController::class, 'index'])->name('recommendation-rules.index');
    Route::post('recommendation-rules', [\App\Http\Controllers\Admin\RecommendationRuleController::class, 'store'])->name('recommendation-rules.store');
    Route::put('recommendation-rules/{rule}', [\App\Http\Controllers\Admin\RecommendationRuleController::class, 'update'])->name('recommendation-rules.update');
    Route::delete('recommendation-rules/{rule}', [\App\Http\Controllers\Admin\RecommendationRuleController::class, 'destroy'])->name('recommendation-rules.destroy');
});