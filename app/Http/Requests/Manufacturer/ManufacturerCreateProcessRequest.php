<?php

declare(strict_types=1);

namespace App\Http\Requests\Manufacturer;

use App\Aggregates\ManufacturerAggregate;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

final class ManufacturerCreateProcessRequest extends FormRequest
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
        ];
    }

    public function respond(): Response
    {
        /** @var array{name: string} $data */
        $data = $this->validated();

        $manufacturerId = (string) Str::ulid();

        ManufacturerAggregate::retrieve($manufacturerId)
            ->create(
                name: $data['name'],
            )
            ->persist();

        return redirect()
            ->route('manufacturers.index')
            ->with('toast', [
                'message' => 'Manufacturer created successfully',
                'type' => 'success',
            ]);
    }
}
