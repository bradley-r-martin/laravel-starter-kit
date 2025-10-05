<?php

declare(strict_types=1);

use App\Http\Controllers\Authentication\AuthenticationTerritoryController;
use App\Http\Controllers\Role\RoleCloseController;
use App\Http\Controllers\Role\RoleCreateController;
use App\Http\Controllers\Role\RoleListController;
use Illuminate\Support\Facades\Route;

Route::get('/territory', [AuthenticationTerritoryController::class, 'view'])->name('territory');
Route::post('/territory', [AuthenticationTerritoryController::class, 'process'])->name('territory.process');

Route::middleware('territory')->group(function () {
    Route::prefix('roles')->name('roles.')->group(function () {
        Route::get('/', [RoleListController::class, 'view'])->name('index');
        Route::get('/create', [RoleCreateController::class, 'view'])->name('create');
        Route::post('/create', [RoleCreateController::class, 'process'])->name('store');
        Route::get('/{role}/close', [RoleCloseController::class, 'view'])->name('close');
        Route::post('/{role}/close', [RoleCloseController::class, 'process'])->name('close');
    });

    Route::get('/dashboard', function () {
        return inertia('Dashboard');
    })->name('dashboard');
});
