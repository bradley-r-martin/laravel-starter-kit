<?php

declare(strict_types=1);

namespace App\Http\Requests\Site;

use App\Aggregates\SiteAggregate;
use App\Models\Route;
use App\Models\Site;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class SiteChangeRouteProcessRequest extends FormRequest
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
        return [
            'route_id' => 'nullable|string|exists:routes,id',
        ];
    }

    public function respond(): Response
    {
        $siteId = (string) $this->route('site');

        Site::query()
            ->select(['id'])
            ->findOrFail($siteId);

        /** @var array{route_id?: string|null} $data */
        $data = $this->validated();

        $routeId = $data['route_id'] ?? null;

        // Validate route exists if provided
        if ($routeId !== null) {
            Route::query()->findOrFail($routeId);
        }

        SiteAggregate::retrieve($siteId)
            ->changeRoute(routeId: $routeId)
            ->persist();

        return redirect()
            ->route('sites.show', $siteId)
            ->with('toast', [
                'message' => 'Route changed successfully',
                'type' => 'success',
            ]);
    }
}

