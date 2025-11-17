<?php

declare(strict_types=1);

namespace App\Http\Requests\Snackware;

use App\Aggregates\SnackwareAggregate;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

final class SnackwareCreateProcessRequest extends FormRequest
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
            'type' => 'sometimes|string|max:255',
            'icon' => 'nullable|string|max:255',
            'price' => 'sometimes|integer|min:0',
        ];
    }

    public function respond(): Response
    {
        /** @var array{territory_id: string, operator_id: string, name: string, type?: string, icon?: string|null, price?: int} $data */
        $data = $this->validated();

        $snackwareId = (string) Str::ulid();

        SnackwareAggregate::retrieve($snackwareId)
            ->create(
                territoryId: $data['territory_id'],
                operatorId: $data['operator_id'],
                name: $data['name'],
                type: $data['type'] ?? 'box',
                icon: $data['icon'] ?? null,
                price: $data['price'] ?? 0,
            )
            ->persist();

        return redirect()
            ->route('snackwares.index')
            ->with('toast', [
                'message' => 'Snackware created successfully',
                'type' => 'success',
            ]);
    }
}
