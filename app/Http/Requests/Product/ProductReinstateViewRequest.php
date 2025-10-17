<?php

declare(strict_types=1);

namespace App\Http\Requests\Product;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ProductReinstateViewRequest extends FormRequest
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
        $productId = (string) $this->route('product');
        $product = Product::query()->select(['id', 'name'])->findOrFail($productId);

        return inertia()
            ->modal('Product/Reinstate', [
                'product' => [
                    'id' => $product->id,
                    'name' => $product->name,
                ],
            ])
            ->baseRoute('products.index')
            ->toResponse($this);
    }
}
