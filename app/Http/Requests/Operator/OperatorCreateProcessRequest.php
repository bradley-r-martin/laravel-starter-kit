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
            'phone' => ['nullable', 'array'],
            'entity' => ['nullable', 'array'],
            'image' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function respond(): Response
    {
        /** @var array{name: string, email?: string|null, address?: array<string, mixed>|null, phone?: array<string, mixed>|null, entity?: array<string, mixed>|null, image?: string|null} $data */
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
