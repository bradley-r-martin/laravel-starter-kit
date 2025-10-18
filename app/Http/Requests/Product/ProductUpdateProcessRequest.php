<?php

declare(strict_types=1);

namespace App\Http\Requests\Product;

use App\Aggregates\ProductAggregate;
use App\Domain\File;
use App\Models\Product;
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
            'product_type_id' => ['sometimes', 'required', 'string', 'exists:product_types,id'],
            'manufacturer_id' => ['sometimes', 'required', 'string', 'exists:manufacturers,id'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'sku' => ['sometimes', 'required', 'string', 'max:255'],
            'units' => ['sometimes', 'required', 'integer', 'min:1'],
            'cost' => ['sometimes', 'required', 'integer', 'min:0'],
            'price' => ['sometimes', 'required', 'integer', 'min:0'],
            'rebate' => ['sometimes', 'required', 'numeric', 'min:0'],
            'royalty' => ['sometimes', 'required', 'numeric', 'min:0'],
            'avatar' => ['sometimes', 'nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ];
    }

    public function respond(): Response
    {
        /** @var Product $product */
        $product = Product::findOrFail($this->route('product'));

        /** @var array{product_type_id?: string|null, manufacturer_id?: string|null, name?: string|null, sku?: string|null, units?: int|null, cost?: int|null, price?: int|null, rebate?: string|null, royalty?: string|null, avatar?: File|null} $data */
        $data = $this->validated();

        if ($this->hasFile('avatar')) {
            $file = File::fromUploadedFile($this->file('avatar'), 'public');
            $data['avatar'] = $file;
        }

        ProductAggregate::retrieve($product->id)
            ->update(
                productTypeId: $this->string('product_type_id')->toString(),
                manufacturerId: $this->string('manufacturer_id')->toString(),
                name: $this->string('name')->toString(),
                sku: $this->string('sku')->toString(),
                units: $this->integer('units'),
                cost: $this->integer('cost'),
                price: $this->integer('price'),
                rebate: $this->float('rebate'),
                royalty: $this->float('royalty'),
                avatar: $this->file('avatar') ? File::fromUploadedFile($this->file('avatar'), 'public') : null,
            )
            ->persist();

        return redirect()
            ->route('products.index')
            ->with('toast', [
                'message' => 'Product updated successfully',
                'type' => 'success',
            ]);
    }
}
