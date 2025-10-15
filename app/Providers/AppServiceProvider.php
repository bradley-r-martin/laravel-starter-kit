<?php

declare(strict_types=1);

namespace App\Providers;

use Closure;
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

            /**
             * @param  RedirectResponse  $response
             * @return RedirectResponse
             */
            $makeResponse = function (RedirectResponse $response) use ($status, $headers): RedirectResponse {
                // Override status
                $response->setStatusCode($status);

                // remove the standard redirect header
                //  $response->headers->remove('Location');
                //  $response->headers->remove('X-Inertia-Redirect');
                //  $response->headers->set('X-Inertia', 'true');

                /** @var array<string, string|array<string>|null> $headers */
                foreach ($headers as $key => $value) {
                    $response->headers->set($key, $value);
                }

                // $response->setStatusCode(303);
                // $response->headers->set('X-Inertia-Redirection', 'true');

                // set response json
                // $response->headers->set('X-Inertia-Partial-Component', 'test');
                // $response->headers->set('X-Inertia-Partial-Data', 'test');

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
                    protected Closure $makeResponse
                ) {}

                /**
                 * @param  array<int, mixed>  $args
                 */
                public function __call(string $method, array $args): RedirectResponse
                {
                    /** @var RedirectResponse $response */
                    $response = $this->redirector->{$method}(...$args);

                    /** @var RedirectResponse */
                    return ($this->makeResponse)($response);
                }
            };
        });
    }
}
