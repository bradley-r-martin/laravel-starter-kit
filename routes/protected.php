<?php

declare(strict_types=1);

use App\Http\Controllers\Authentication\AuthenticationTerritoryController;
use App\Http\Controllers\Role\RoleCloseController;
use App\Http\Controllers\Role\RoleCreateController;
use App\Http\Controllers\Role\RoleDestroyController;
use App\Http\Controllers\Role\RoleListController;
use App\Http\Controllers\Role\RoleUpdateController;
use App\Http\Controllers\User\UserCreateController;
use App\Http\Controllers\User\UserListController;
use Illuminate\Support\Facades\Route;

Route::get('/territory', [AuthenticationTerritoryController::class, 'view'])->name('territory');
Route::post('/territory', [AuthenticationTerritoryController::class, 'process'])->name('territory.process');

Route::middleware('territory')->group(function () {
    Route::prefix('roles')->name('roles.')->group(function () {
        Route::get('/', [RoleListController::class, 'view'])->name('index');
        Route::get('/create', [RoleCreateController::class, 'view'])->name('create');
        Route::post('/create', [RoleCreateController::class, 'process'])->name('store');
        Route::get('/{role}/update', [RoleUpdateController::class, 'view'])->name('update');
        Route::put('/{role}/update', [RoleUpdateController::class, 'process'])->name('update');
        Route::get('/{role}/close', [RoleCloseController::class, 'view'])->name('close');
        Route::post('/{role}/close', [RoleCloseController::class, 'process'])->name('close');
        Route::get('/{role}/destroy', [RoleDestroyController::class, 'view'])->name('destroy');
        Route::delete('/{role}/destroy', [RoleDestroyController::class, 'process'])->name('destroy');
    });

    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [UserListController::class, 'view'])->name('index');
        Route::get('/create', [UserCreateController::class, 'view'])->name('create');
        Route::post('/create', [UserCreateController::class, 'process'])->name('store');
    });

    Route::get('/dashboard', function () {
        return inertia('Dashboard');
    })->name('dashboard');
});
