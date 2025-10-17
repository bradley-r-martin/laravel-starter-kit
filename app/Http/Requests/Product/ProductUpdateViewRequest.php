<?php

declare(strict_types=1);

namespace App\Http\Requests\Product;

use App\Models\Manufacturer;
use App\Models\Product;
use App\Models\ProductType;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ProductUpdateViewRequest extends FormRequest
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
        $product = Product::query()
            ->with(['productType:id,name', 'manufacturer:id,name'])
            ->findOrFail($productId);

        $productTypes = ProductType::query()
            ->whereNull('closed_at')
            ->orderBy('name')
            ->get()
            ->map(fn (ProductType $productType): array => [
                'id' => $productType->id,
                'name' => $productType->name,
            ]);

        $manufacturers = Manufacturer::query()
            ->whereNull('closed_at')
            ->orderBy('name')
            ->get()
            ->map(fn (Manufacturer $manufacturer): array => [
                'id' => $manufacturer->id,
                'name' => $manufacturer->name,
            ]);

        return inertia()
            ->modal('Product/Update', [
                'product' => [
                    'id' => $product->id,
                    'product_type_id' => $product->product_type_id,
                    'manufacturer_id' => $product->manufacturer_id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'units' => $product->units,
                    'cost' => $product->cost,
                    'price' => $product->price,
                    'rebate' => $product->rebate,
                    'royalty' => $product->royalty,
                    'avatar' => $product->avatar,
                ],
                'product_types' => $productTypes,
                'manufacturers' => $manufacturers,
            ])
            ->baseRoute('products.index')
            ->toResponse($this);
    }
}
