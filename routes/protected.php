<?php

declare(strict_types=1);

use App\Http\Controllers\Authentication\AuthenticationTerritoryController;
use App\Http\Controllers\Role\RoleCloseController;
use App\Http\Controllers\Role\RoleCreateController;
use App\Http\Controllers\Role\RoleDestroyController;
use App\Http\Controllers\Role\RoleListController;
use App\Http\Controllers\Role\RoleReopenController;
use App\Http\Controllers\Role\RoleUpdateController;
use App\Http\Controllers\User\UserCloseController;
use App\Http\Controllers\User\UserCreateController;
use App\Http\Controllers\User\UserDestroyController;
use App\Http\Controllers\User\UserListController;
use App\Http\Controllers\User\UserPasswordController;
use App\Http\Controllers\User\UserReopenController;
use App\Http\Controllers\User\UserSuspendController;
use App\Http\Controllers\User\UserUnsuspendController;
use App\Http\Controllers\User\UserUpdateController;
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
        Route::get('/{role}/reopen', [RoleReopenController::class, 'view'])->name('reopen');
        Route::post('/{role}/reopen', [RoleReopenController::class, 'process'])->name('reopen');
        Route::get('/{role}/destroy', [RoleDestroyController::class, 'view'])->name('destroy');
        Route::delete('/{role}/destroy', [RoleDestroyController::class, 'process'])->name('destroy');
    });

    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [UserListController::class, 'view'])->name('index');
        Route::get('/create', [UserCreateController::class, 'view'])->name('create');
        Route::post('/create', [UserCreateController::class, 'process'])->name('store');
        Route::get('/{user}/update', [UserUpdateController::class, 'view'])->name('update');
        Route::put('/{user}/update', [UserUpdateController::class, 'process'])->name('update');
        Route::get('/{user}/password', [UserPasswordController::class, 'view'])->name('password');
        Route::put('/{user}/password', [UserPasswordController::class, 'process'])->name('password');
        Route::get('/{user}/suspend', [UserSuspendController::class, 'view'])->name('suspend');
        Route::post('/{user}/suspend', [UserSuspendController::class, 'process'])->name('suspend');
        Route::get('/{user}/unsuspend', [UserUnsuspendController::class, 'view'])->name('unsuspend');
        Route::post('/{user}/unsuspend', [UserUnsuspendController::class, 'process'])->name('unsuspend');
        Route::get('/{user}/close', [UserCloseController::class, 'view'])->name('close');
        Route::post('/{user}/close', [UserCloseController::class, 'process'])->name('close');
        Route::get('/{user}/reopen', [UserReopenController::class, 'view'])->name('reopen');
        Route::post('/{user}/reopen', [UserReopenController::class, 'process'])->name('reopen');
        Route::get('/{user}/destroy', [UserDestroyController::class, 'view'])->name('destroy');
        Route::delete('/{user}/destroy', [UserDestroyController::class, 'process'])->name('destroy');
    });

    Route::get('/dashboard', function () {
        return inertia('Dashboard');
    })->name('dashboard');
});
