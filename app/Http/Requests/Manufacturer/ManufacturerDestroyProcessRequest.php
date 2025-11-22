<?php

declare(strict_types=1);

namespace App\Http\Requests\Manufacturer;

use App\Actions\ManufacturerActions;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ManufacturerDestroyProcessRequest extends FormRequest
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

        $this->validated();

        new ManufacturerActions((string) $this->route('manufacturer'))->destroy();

        return redirect()
            ->route('manufacturers.index')
            ->with('toast', [
                'message' => 'Manufacturer destroyed successfully',
                'type' => 'success',
            ]);
    }
}
