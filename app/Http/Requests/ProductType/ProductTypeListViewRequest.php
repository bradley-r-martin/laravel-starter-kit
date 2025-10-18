<?php

declare(strict_types=1);

namespace App\Http\Requests\ProductType;

use App\Models\ProductType;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ProductTypeListViewRequest extends FormRequest
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
            ->select(['id', 'name', 'closed_at', 'created_at', '__products_count'])
            ->orderBy('created_at', 'desc')
            ->paginate()
            /** @var \Illuminate\Contracts\Pagination\LengthAwarePaginator<array{ProductType $productType}> $productTypes */
            ->through(fn (ProductType $productType): array => [
                'id' => $productType->id,
                'name' => $productType->name,
                'closed_at' => $productType->closed_at,
                'created_at' => $productType->created_at,
                'products_count' => $productType->__products_count,
            ]);

        return inertia()
            ->render('ProductType/List', [
                'product_types' => $productTypes,
            ])
            ->toResponse($this);
    }
}
