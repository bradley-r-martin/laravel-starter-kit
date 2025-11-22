<?php

declare(strict_types=1);

namespace App\Http\Requests\Manufacturer;

use App\Actions\ManufacturerActions;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ManufacturerUpdateProcessRequest extends FormRequest
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
        ];
    }

    public function respond(): Response
    {
        /** @var array{name?: string|null} $data */
        $data = $this->validated();

        new ManufacturerActions((string) $this->route('manufacturer'))->update($data);

        return redirect()
            ->route('manufacturers.index')
            ->with('toast', [
                'message' => 'Manufacturer updated successfully',
                'type' => 'success',
            ]);
    }
}
