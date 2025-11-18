<?php

declare(strict_types=1);

namespace App\Http\Requests\Site;

use App\Models\Route;
use App\Models\Site;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class SiteChangeRouteViewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [];
    }

    public function respond(): Response
    {
        $siteId = $this->route('site');

        /** @var Site $site */
        $site = Site::query()
            ->select(['id', 'name', 'route_id'])
            ->with('route:id,name')
            ->findOrFail($siteId);

        $routes = Route::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Route $route): array => [
                'id' => $route->id,
                'name' => $route->name,
            ]);

        return inertia()
            ->modal('Site/ChangeRoute', [
                'site' => [
                    'id' => $site->id,
                    'name' => $site->name,
                    'route_id' => $site->route_id,
                    '__route_name' => $site->route->name ?? null,
                ],
                'routes' => $routes,
            ])
            ->baseRoute('sites.show', $site->id)
            ->toResponse($this);
    }
}
