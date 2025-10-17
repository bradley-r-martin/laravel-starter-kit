<?php

declare(strict_types=1);

namespace App\Http\Requests\Manufacturer;

use App\Aggregates\ManufacturerAggregate;
use App\Models\Manufacturer;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ManufacturerCloseProcessRequest extends FormRequest
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
            'reason' => 'required|string|max:500',
        ];
    }

    public function respond(): Response
    {
        $manufacturerId = (string) $this->route('manufacturer');
        $manufacturer = Manufacturer::query()->select(['id'])->findOrFail($manufacturerId);

        /** @var array{reason: string} $data */
        $data = $this->validated();

        ManufacturerAggregate::retrieve($manufacturer->id)
            ->close(
                reason: $data['reason'],
            )
            ->persist();

        return redirect()
            ->route('manufacturers.index')
            ->with('toast', [
                'message' => 'Manufacturer closed successfully',
                'type' => 'success',
            ]);
    }
}
