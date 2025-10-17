<?php

declare(strict_types=1);

namespace App\Http\Requests\Manufacturer;

use App\Models\Manufacturer;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ManufacturerCloseViewRequest extends FormRequest
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
        return [];
    }

    public function respond(): Response
    {
        $manufacturerId = (string) $this->route('manufacturer');
        $manufacturer = Manufacturer::query()->select(['id', 'name'])->findOrFail($manufacturerId);

        return inertia()
            ->modal('Manufacturer/Close', [
                'manufacturer' => [
                    'id' => $manufacturer->id,
                    'name' => $manufacturer->name,
                ],
            ])
            ->baseRoute('manufacturers.index')
            ->toResponse($this);
    }
}
