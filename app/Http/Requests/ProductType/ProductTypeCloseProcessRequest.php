<?php

declare(strict_types=1);

namespace App\Http\Requests\ProductType;

use App\Aggregates\ProductTypeAggregate;
use App\Models\ProductType;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ProductTypeCloseProcessRequest extends FormRequest
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
        $productTypeId = (string) $this->route('product_type');
        $productType = ProductType::query()->select(['id'])->findOrFail($productTypeId);

        /** @var array{reason: string} $data */
        $data = $this->validated();

        ProductTypeAggregate::retrieve($productType->id)
            ->close(
                reason: $data['reason'],
            )
            ->persist();

        return redirect()
            ->route('product-types.index')
            ->with('toast', [
                'message' => 'Product type closed successfully',
                'type' => 'success',
            ]);
    }
}
