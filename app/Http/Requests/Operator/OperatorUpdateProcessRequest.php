<?php

declare(strict_types=1);

namespace App\Http\Requests\Operator;

use App\Aggregates\OperatorAggregate;
use App\Domain\Address;
use App\Domain\Entity;
use App\Domain\Phone;
use App\Models\Operator;
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
            'address' => ['sometimes', 'nullable', 'array'],
            'phone' => ['sometimes', 'nullable', 'array'],
            'entity' => ['sometimes', 'nullable', 'array'],
            'image' => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }

    public function respond(): Response
    {
        $operatorId = (string) $this->route('operator');
        $operator = Operator::query()->select(['id'])->findOrFail($operatorId);

        /** @var array{name?: string, email?: string|null, address?: array<string, mixed>|null, phone?: array<string, mixed>|null, entity?: array<string, mixed>|null, image?: string|null} $data */
        $data = $this->validated();

        OperatorAggregate::retrieve($operator->id)
            ->update(
                name: $data['name'] ?? null,
                emailTouched: array_key_exists('email', $data),
                email: $data['email'] ?? null,
                addressTouched: array_key_exists('address', $data),
                address: array_key_exists('address', $data) ? Address::fromArray($data['address']) : null,
                phoneTouched: array_key_exists('phone', $data),
                phone: array_key_exists('phone', $data) ? Phone::fromArray($data['phone']) : null,
                entityTouched: array_key_exists('entity', $data),
                entity: array_key_exists('entity', $data) ? Entity::fromArray($data['entity']) : null,
                imageTouched: array_key_exists('image', $data),
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
