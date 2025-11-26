<?php

declare(strict_types=1);

namespace App\Http\Requests\Product;

use App\Actions\ProductActions;
use App\Domain\File;
use App\Rules\FileRule;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ProductUpdateProcessRequest extends FormRequest
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
            'product_type_id' => ['sometimes', 'string', 'exists:product_types,id'],
            'manufacturer_id' => ['sometimes', 'string', 'exists:manufacturers,id'],
            'name' => ['sometimes', 'string', 'max:255'],
            'sku' => ['sometimes', 'string', 'max:255'],
            'units' => ['sometimes', 'integer', 'min:1'],
            'cost' => ['sometimes', 'integer', 'min:0'],
            'price' => ['sometimes', 'integer', 'min:0'],
            'rebate' => ['sometimes', 'numeric', 'min:0'],
            'royalty' => ['sometimes', 'numeric', 'min:0'],
            'avatar' => ['sometimes', 'nullable', new FileRule()],
        ];
    }

    public function respond(): Response
    {
        $data = $this->validated();

        /** @var array{product_type_id?: string|null, manufacturer_id?: string|null, name?: string|null, sku?: string|null, units?: int|null, cost?: int|null, price?: int|null, rebate?: float|null, royalty?: float|null, avatar?: File|null} $data */
        new ProductActions((string) $this->route('product'))->update($data);

        return redirect()
            ->route('products.index')
            ->with('toast', [
                'message' => 'Product updated successfully',
                'type' => 'success',
            ]);
    }
}
