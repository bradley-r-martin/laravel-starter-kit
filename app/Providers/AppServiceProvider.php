<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

final class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Configure OpenSSL to use our custom config file
        $opensslConf = env('OPENSSL_CONF');
        if ($opensslConf && file_exists($opensslConf)) {
            putenv("OPENSSL_CONF={$opensslConf}");
        }

        // if ($this->app->environment('local') && class_exists(\Laravel\Telescope\TelescopeServiceProvider::class)) {
        //     $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
        //     $this->app->register(TelescopeServiceProvider::class);
        // }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('login', fn (Request $request): array => [
            Limit::perMinute(10)->by('login:'.$request->string('email')->toString().$request->ip()),
        ]);

        RateLimiter::for('recovery', fn (Request $request): array => [
            Limit::perMinute(10)->by('recovery:'.$request->string('email')->toString().$request->ip()),
        ]);

    }
}
