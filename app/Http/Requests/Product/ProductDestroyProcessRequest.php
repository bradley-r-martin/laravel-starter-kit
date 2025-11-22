<?php

declare(strict_types=1);

namespace App\Http\Requests\Product;

use App\Actions\ProductActions;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ProductDestroyProcessRequest extends FormRequest
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
            'reason' => ['required', 'string', 'max:255'],
        ];
    }

    public function respond(): Response
    {

        $this->validated();

        new ProductActions((string) $this->route('product'))->destroy();

        return redirect()
            ->route('products.index')
            ->with('toast', [
                'message' => 'Product destroyed successfully',
                'type' => 'success',
            ]);
    }
}
