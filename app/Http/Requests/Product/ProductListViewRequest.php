<?php

declare(strict_types=1);

namespace App\Http\Requests\Product;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ProductListViewRequest extends FormRequest
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
        $products = Product::query()
            ->orderBy('name')
            ->get()
            ->map(fn (Product $product): array => [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'units' => $product->units,
                'cost' => $product->cost,
                'price' => $product->price,
                'rebate' => $product->rebate,
                'royalty' => $product->royalty,
                'avatar' => $product->avatar,
                'closed_at' => $product->closed_at,
                '__product_type_name' => $product->__product_type_name,
                '__manufacturer_name' => $product->__manufacturer_name,
            ]);

        return inertia()
            ->render('Product/List', [
                'products' => $products,
            ])
            ->toResponse($this);
    }
}
