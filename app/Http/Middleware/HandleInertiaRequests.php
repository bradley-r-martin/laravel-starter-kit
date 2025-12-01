<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\Policy;
use Illuminate\Http\Request;
use Inertia\Middleware;

final class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return null;
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Get service worker version if it exists
        $swVersion = null;
        $swVersionPath = public_path('sw-version.txt');
        if (file_exists($swVersionPath)) {
            $swVersion = mb_trim(file_get_contents($swVersionPath));
        }

        return [
            ...parent::share($request),
            'version' => parent::version($request),
            'swVersion' => $swVersion,
            'user' => $request->user(),
            'toast' => $request->session()->get('toast'),
            'policies' => $request->user()?->policies()
                ->get()
                ->map(fn (Policy $policy): string => $policy->policy.'@'.$policy->ability)
                ->values()
                ->toArray() ?? [],
        ];
    }
}
