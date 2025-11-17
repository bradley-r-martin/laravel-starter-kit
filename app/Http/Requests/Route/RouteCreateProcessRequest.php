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
            'territory_id' => 'required|string|exists:territories,id',
            'operator_id' => 'required|string|exists:operators,id',
            'name' => 'required|string|max:255',
            'schedule' => 'nullable|string',
        ];
    }

    public function respond(): Response
    {
        /** @var array{territory_id: string, operator_id: string, name: string, schedule?: string|null} $data */
        $data = $this->validated();

        $routeId = (string) Str::ulid();

        $schedule = null;
        if (isset($data['schedule']) && $data['schedule'] !== null && $data['schedule'] !== '') {
            $schedule = Schedule::fromString($data['schedule']);
        }

        RouteAggregate::retrieve($routeId)
            ->create(
                territoryId: $data['territory_id'],
                operatorId: $data['operator_id'],
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
