<?php

declare(strict_types=1);

namespace App\Http\Requests\Product;

use App\Models\Manufacturer;
use App\Models\ProductType;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ProductCreateViewRequest extends FormRequest
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
            ->modal('Product/Create', [
                'product_types' => $productTypes,
                'manufacturers' => $manufacturers,
            ])
            ->baseRoute('products.index')
            ->toResponse($this);
    }
}
