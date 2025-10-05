<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class EnsureTerritorySelected
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $cookie = $request->cookie('selected_territory');
        $sessionValue = $request->session()->get('selected_territory');

        if (! $cookie && ! $sessionValue) {
            return redirect()->route('territory');
        }

        $request->session()->put(
            'selected_territory',
            $cookie ?? $sessionValue
        );

        return $next($request);
    }
}
