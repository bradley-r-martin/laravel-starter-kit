<?php

declare(strict_types=1);

namespace App\Http\Requests\Route;

use App\Aggregates\RouteAggregate;
use App\Domain\Schedule;
use App\Models\Route;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class RouteUpdateProcessRequest extends FormRequest
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
            'name' => 'sometimes|required|string|max:255',
            'schedule' => 'nullable|string',
        ];
    }

    public function respond(): Response
    {
        $routeId = (string) $this->route('route');

        /** @var Route $route */
        $route = Route::query()
            ->select(['id', 'closed_at'])
            ->findOrFail($routeId);

        // Only non-closed routes can be updated
        if ($route->closed_at !== null) {
            abort(403, 'Closed routes cannot be updated.');
        }

        /** @var array{name?: string, schedule?: string|null} $data */
        $data = $this->validated();

        $schedule = null;
        if (isset($data['schedule']) && $data['schedule'] !== '') {
            $schedule = Schedule::fromString($data['schedule']);
        }

        RouteAggregate::retrieve($routeId)
            ->update(
                name: $data['name'] ?? null,
                schedule: $schedule,
            )
            ->persist();

        return redirect()
            ->route('routes.index')
            ->with('toast', [
                'message' => 'Route updated successfully',
                'type' => 'success',
            ]);
    }
}
