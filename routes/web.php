<?php

declare(strict_types=1);

use App\Http\Controllers\Authentication\AuthenticationLoginController;
use App\Http\Controllers\Authentication\AuthenticationLogoutController;
use App\Http\Controllers\Authentication\AuthenticationRecoveryController;
use App\Http\Controllers\Authentication\AuthenticationResetController;
use App\Http\Controllers\Nearby\NearbyPlacementController;
use App\Http\Controllers\Nearby\NearbyPlacementsController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/nearby', [NearbyPlacementsController::class, 'view'])->name('nearby.index');

Route::get('/nearby/placement', [NearbyPlacementController::class, 'view'])->name('nearby.placement');

Route::get('/login', [AuthenticationLoginController::class, 'view'])->middleware('guest')->name('login');
Route::post('/login', [AuthenticationLoginController::class, 'process'])->middleware('throttle:login')->name('login.process');

Route::get('/recovery', [AuthenticationRecoveryController::class, 'view'])->middleware('guest')->name('recovery');
Route::post('/recovery', [AuthenticationRecoveryController::class, 'process'])->middleware('throttle:recovery')->name('recovery.process');

Route::get('/reset-password', [AuthenticationResetController::class, 'view'])->middleware('guest')->name('reset');
Route::post('/reset-password', [AuthenticationResetController::class, 'process'])->name('reset.process');

Route::get('/logout', [AuthenticationLogoutController::class, 'view'])->name('logout');
