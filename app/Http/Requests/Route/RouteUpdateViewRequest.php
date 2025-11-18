<?php

declare(strict_types=1);

namespace App\Http\Requests\Route;

use App\Domain\Schedule;
use App\Models\Route;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class RouteUpdateViewRequest extends FormRequest
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
        $routeId = $this->route('route');

        /** @var Route $route */
        $route = Route::query()
            ->select(['id', 'name', 'schedule', 'closed_at'])
            ->findOrFail($routeId);

        /** @var Schedule|null $schedule */
        $schedule = $route->schedule;

        return inertia()
            ->modal('Route/Update', [
                'route' => [
                    'id' => $route->id,
                    'name' => $route->name,
                    'schedule' => $schedule?->__toString() ?? null,
                    'closed_at' => $route->closed_at,
                ],
            ])
            ->baseRoute('routes.index')
            ->toResponse($this);
    }
}
