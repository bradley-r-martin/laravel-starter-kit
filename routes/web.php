<?php

declare(strict_types=1);

use App\Http\Controllers\Authentication\AuthenticationLoginController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('Welcome');
});

Route::get('/login', [AuthenticationLoginController::class, 'view'])->name('login');
Route::post('/login', [AuthenticationLoginController::class, 'process'])->name('login.process');
