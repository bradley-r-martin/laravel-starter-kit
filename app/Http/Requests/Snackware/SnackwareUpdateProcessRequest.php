<?php

declare(strict_types=1);

namespace App\Http\Requests\Snackware;

use App\Actions\SnackwareActions;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class SnackwareUpdateProcessRequest extends FormRequest
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
            'name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|string|max:255',
            'icon' => 'nullable|string|max:255',
            'price' => 'sometimes|integer|min:0',
            'products' => 'sometimes|array',
            'products.*' => 'string',
        ];
    }

    public function respond(): Response
    {

        /** @var array{name?: string, type?: string, icon?: string|null, price?: int, products?: array<int, string>} $data */
        $data = $this->validated();

        new SnackwareActions((string) $this->route('snackware'))->update($data);

        return redirect()
            ->route('snackwares.index')
            ->with('toast', [
                'message' => 'Snackware updated successfully',
                'type' => 'success',
            ]);
    }
}
