<?php

declare(strict_types=1);

use App\Http\Controllers\Role\RoleCreateController;
use App\Http\Controllers\Role\RoleListController;
use Illuminate\Support\Facades\Route;

Route::prefix('roles')->name('roles.')->group(function () {
    Route::get('/', [RoleListController::class, 'view'])->name('index');
    Route::get('/create', [RoleCreateController::class, 'view'])->name('create');
    Route::post('/create', [RoleCreateController::class, 'process'])->name('store');
});

Route::get('/dashboard', function () {
    return inertia('Dashboard');
})->middleware('auth')->name('dashboard');
