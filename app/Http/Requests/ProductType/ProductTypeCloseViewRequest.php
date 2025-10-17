<?php

declare(strict_types=1);

namespace App\Http\Requests\ProductType;

use App\Models\ProductType;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ProductTypeCloseViewRequest extends FormRequest
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
        $productTypeId = (string) $this->route('product_type');
        $productType = ProductType::query()->select(['id', 'name'])->findOrFail($productTypeId);

        return inertia()
            ->modal('ProductType/Close', [
                'product_type' => [
                    'id' => $productType->id,
                    'name' => $productType->name,
                ],
            ])
            ->baseRoute('product-types.index')
            ->toResponse($this);
    }
}
