<?php

declare(strict_types=1);

namespace App\Http\Requests\Site;

use App\Aggregates\SiteAggregate;
use App\Domain\Address;
use App\Rules\AddressRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

final class SiteCreateProcessRequest extends FormRequest
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
            'order' => 'sometimes|integer|min:0',
            'name' => 'required|string|max:255',
            'address' => ['nullable', new AddressRule()],
            'opening_hours' => 'nullable|array',
            'manager_code' => 'nullable|string|max:255',
        ];
    }

    public function respond(): Response
    {
        /** @var array{route_id?: string|null, order?: int, name: string, address?: array<string, mixed>|null, opening_hours?: array<int|string, mixed>|null, manager_code?: string|null} $data */
        $data = $this->validated();

        /** @var \App\Models\User $user */
        $user = $this->user();

        $operator = $user->operator;
        $territory = $user->territory();

        if (! $operator) {
            abort(403, 'User must be associated with an operator');
        }

        $siteId = (string) Str::ulid();

        $address = null;
        if (isset($data['address'])) {
            /** @var array<string, string|float|null> $addressData */
            $addressData = $data['address'];
            $address = Address::fromArray($addressData);
        }

        /** @var array<int|string, mixed>|null $openingHours */
        $openingHours = $data['opening_hours'] ?? null;

        SiteAggregate::retrieve($siteId)
            ->create(
                territoryId: $territory->id,
                operatorId: $operator->id,
                routeId: $data['route_id'] ?? null,
                order: $data['order'] ?? 0,
                name: $data['name'],
                address: $address,
                openingHours: $openingHours,
                managerCode: $data['manager_code'] ?? null,
            )
            ->persist();

        return redirect()
            ->route('sites.index')
            ->with('toast', [
                'message' => 'Site created successfully',
                'type' => 'success',
            ]);
    }
}
