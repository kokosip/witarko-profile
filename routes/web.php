<?php

use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ProfileController::class, 'show'])->name('home');

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
        Route::post('/login', [AdminAuthController::class, 'login'])->name('login.submit');
    });

    Route::middleware('auth')->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');
        Route::get('/', [AdminController::class, 'index'])->name('index');
        Route::put('/profile', [AdminController::class, 'updateProfile'])->name('profile.update');
        Route::post('/projects', [AdminController::class, 'storeProject'])->name('projects.store');
        Route::put('/projects/{project}', [AdminController::class, 'updateProject'])->name('projects.update');
        Route::delete('/projects/{project}', [AdminController::class, 'destroyProject'])->name('projects.destroy');
    });
});
