<?php

declare(strict_types=1);

namespace App\Http\Requests\Operator;

use App\Aggregates\OperatorAggregate;
use App\Domain\Address;
use App\Domain\Entity;
use App\Domain\Phone;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

final class OperatorCreateProcessRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'array'],
            'address.place_id' => ['nullable', 'string', 'max:255'],
            'address.building_name' => ['nullable', 'string', 'max:255'],
            'address.lot_no' => ['nullable', 'string', 'max:255'],
            'address.country' => ['nullable', 'string', 'max:255'],
            'address.level' => ['nullable', 'string', 'max:255'],
            'address.postcode' => ['nullable', 'string', 'max:255'],
            'address.state' => ['nullable', 'string', 'max:255'],
            'address.street_name' => ['nullable', 'string', 'max:255'],
            'address.street_number' => ['nullable', 'string', 'max:255'],
            'address.street_type' => ['nullable', 'string', 'max:255'],
            'address.street_suffix' => ['nullable', 'string', 'max:255'],
            'address.suburb' => ['nullable', 'string', 'max:255'],
            'address.unit' => ['nullable', 'string', 'max:255'],
            'address.latitude' => ['nullable', 'numeric'],
            'address.longitude' => ['nullable', 'numeric'],
            'phone' => ['nullable', 'array'],
            'phone.country_code' => ['nullable', 'string', 'max:10'],
            'phone.area_code' => ['nullable', 'string', 'max:10'],
            'phone.number' => ['nullable', 'string', 'max:50'],
            'phone.extension' => ['nullable', 'string', 'max:10'],
            'phone.type' => ['nullable', 'string', 'max:50'],
            'entity' => ['nullable', 'array'],
            'entity.id' => ['nullable', 'string', 'max:255'],
            'entity.type' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function respond(): Response
    {
        /** @var array{name: string, email?: string|null, address?: array{place_id?: string|null, building_name?: string|null, lot_no?: string|null, country?: string|null, level?: string|null, postcode?: string|null, state?: string|null, street_name?: string|null, street_number?: string|null, street_type?: string|null, street_suffix?: string|null, suburb?: string|null, unit?: string|null, latitude?: string|float|null, longitude?: string|float|null}|null, phone?: array{country_code?: string|null, area_code?: string|null, number?: string|null, extension?: string|null, type?: string|null}|null, entity?: array{id?: string|null, type?: string|null}|null, image?: string|null} $data */
        $data = $this->validated();

        $operatorId = (string) Str::ulid();

        OperatorAggregate::retrieve($operatorId)
            ->create(
                name: $data['name'],
                email: $data['email'] ?? null,
                address: isset($data['address']) ? Address::fromArray($data['address']) : null,
                phone: isset($data['phone']) ? Phone::fromArray($data['phone']) : null,
                entity: isset($data['entity']) ? Entity::fromArray($data['entity']) : null,
                image: $data['image'] ?? null,
            )
            ->persist();

        return redirect()
            ->route('operators.index')
            ->with('toast', [
                'message' => 'Operator created successfully',
                'type' => 'success',
            ]);
    }
}
