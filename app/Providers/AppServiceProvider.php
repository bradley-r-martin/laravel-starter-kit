<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

final class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {

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

        Inertia::macro('redirect', function (
            ?string $to = null,
            int $status = 278, // custom status (Inertia ignores non-302/303)
            array $headers = [],
            ?bool $secure = null
        ) {
            /** @var Redirector $redirector */
            $redirector = app('redirect');

            $makeResponse = function (RedirectResponse $response) use ($status, $headers): \Illuminate\Http\RedirectResponse {
                // Override status
                $response->setStatusCode($status);

                // remove the standard redirect header
                $response->headers->remove('Location');
                $response->headers->remove('X-Inertia-Redirect');
                $response->headers->set('X-Inertia', 'true');

                // Merge custom headers
                foreach ($headers as $key => $value) {
                    $response->headers->set($key, $value);
                }

                // Optional: mark as a “manual redirect”
                $response->headers->set('X-Inertia-Redirection', 'true');

                return $response;
            };

            if ($to !== null) {
                return $makeResponse($redirector->to($to, 302, $headers, $secure));
            }

            // Return a wrapped Redirector that ensures our custom status/headers
            return new class($redirector, $makeResponse)
            {
                public function __construct(
                    protected Redirector $redirector,
                    protected $makeResponse
                ) {}

                public function __call($method, $args)
                {
                    $response = $this->redirector->{$method}(...$args);

                    return ($this->makeResponse)($response);
                }
            };
        });

    }
}
