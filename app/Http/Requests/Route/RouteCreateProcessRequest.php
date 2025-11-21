<?php

declare(strict_types=1);

namespace App\Http\Requests\Route;

use App\Aggregates\RouteAggregate;
use App\Domain\Schedule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

final class RouteCreateProcessRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'schedule' => 'nullable|string',
        ];
    }

    public function respond(): Response
    {
        /** @var array{name: string, schedule?: string|null} $data */
        $data = $this->validated();

        /** @var \App\Models\User $user */
        $user = $this->user();

        $operator = $user->operator;
        $territory = $user->territory();

        if (! $operator) {
            abort(403, 'User must be associated with an operator');
        }

        $routeId = (string) Str::ulid();

        $schedule = null;
        if (isset($data['schedule']) && $data['schedule'] !== '') {
            $schedule = Schedule::fromString($data['schedule']);
        }

        RouteAggregate::retrieve($routeId)
            ->create(
                territoryId: $territory->id,
                operatorId: $operator->id,
                name: $data['name'],
                schedule: $schedule,
            )
            ->persist();

        return redirect()
            ->route('routes.index')
            ->with('toast', [
                'message' => 'Route created successfully',
                'type' => 'success',
            ]);
    }
}
