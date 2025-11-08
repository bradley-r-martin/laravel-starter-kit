<?php

declare(strict_types=1);

namespace App\Http\Requests\Operator;

use App\Aggregates\OperatorAggregate;
use App\Domain\Address;
use App\Domain\Entity;
use App\Domain\Phone;
use App\Models\Operator;
use App\Rules\AddressRule;
use App\Rules\PhoneRule;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class OperatorUpdateProcessRequest extends FormRequest
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
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'nullable', 'email', 'max:255'],
            'address' => ['sometimes', 'nullable', new AddressRule()],
            'phone' => ['sometimes', 'nullable', new PhoneRule()],
            'entity' => ['sometimes', 'nullable', 'array'],
            'entity.id' => ['sometimes', 'nullable', 'string', 'max:255'],
            'entity.type' => ['sometimes', 'nullable', 'string', 'max:255'],
            'image' => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }

    public function respond(): Response
    {
        $operatorId = (string) $this->route('operator');
        $operator = Operator::query()->select(['id'])->findOrFail($operatorId);

        /** @var array{name?: string, email?: string|null, address?: array{place_id?: string|null, building_name?: string|null, lot_no?: string|null, country?: string|null, level?: string|null, postcode?: string|null, state?: string|null, street_name?: string|null, street_number?: string|null, street_type?: string|null, street_suffix?: string|null, suburb?: string|null, unit?: string|null, latitude?: int|float|string|null, longitude?: int|float|string|null}|null, phone?: array{country_code?: string|null, area_code?: string|null, number?: string|null, extension?: string|null, type?: string|null}|null, entity?: array{id?: string|null, type?: string|null}|null, image?: string|null} $data */
        $data = $this->validated();

        $address = null;
        if (array_key_exists('address', $data) && $data['address'] !== null) {
            /** @var array{place_id?: string|null, building_name?: string|null, lot_no?: string|null, country?: string|null, level?: string|null, postcode?: string|null, state?: string|null, street_name?: string|null, street_number?: string|null, street_type?: string|null, street_suffix?: string|null, suburb?: string|null, unit?: string|null, latitude?: int|float|string|null, longitude?: int|float|string|null} $addressData */
            $addressData = $data['address'];
            $address = Address::fromArray($addressData);
        }

        $phone = null;
        if (array_key_exists('phone', $data) && $data['phone'] !== null) {
            /** @var array{country_code?: string|null, area_code?: string|null, number?: string|null, extension?: string|null, type?: string|null} $phoneData */
            $phoneData = $data['phone'];
            $phone = Phone::fromArray($phoneData);
        }

        $entity = null;
        if (array_key_exists('entity', $data) && $data['entity'] !== null) {
            /** @var array{id?: string|null, type?: string|null} $entityData */
            $entityData = $data['entity'];
            $entity = Entity::fromArray($entityData);
        }

        OperatorAggregate::retrieve($operator->id)
            ->update(
                name: $data['name'] ?? null,
                email: $data['email'] ?? null,
                address: $address,
                phone: $phone,
                entity: $entity,
                image: $data['image'] ?? null,
            )
            ->persist();

        return redirect()
            ->route('operators.index')
            ->with('toast', [
                'message' => 'Operator updated successfully',
                'type' => 'success',
            ]);
    }
}
