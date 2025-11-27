<?php

declare(strict_types=1);

namespace App\Http\Requests\Snackware;

use App\Actions\SnackwareActions;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class SnackwareChangeProductsProcessRequest extends FormRequest
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
            'products' => 'required|array',
            'products.*' => 'string',
        ];
    }

    public function respond(): Response
    {
        /** @var array{products: array<int, string>} $data */
        $data = $this->validated();

        new SnackwareActions((string) $this->route('snackware'))->changeProducts($data);

        return redirect()
            ->route('snackwares.index')
            ->with('toast', [
                'message' => 'Products changed successfully',
                'type' => 'success',
            ]);
    }
}
