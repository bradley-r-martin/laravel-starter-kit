<?php

declare(strict_types=1);

namespace App\Http\Requests\Product;

use App\Aggregates\ProductAggregate;
use App\Domain\File;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

final class ProductCreateProcessRequest extends FormRequest
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
            'product_type_id' => ['required', 'string', 'exists:product_types,id'],
            'manufacturer_id' => ['required', 'string', 'exists:manufacturers,id'],
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['required', 'string', 'max:255'],
            'units' => ['nullable', 'integer', 'min:1'],
            'cost' => ['required', 'integer', 'min:0'],
            'price' => ['required', 'integer', 'min:0'],
            'rebate' => ['nullable', 'numeric', 'min:0'],
            'royalty' => ['nullable', 'numeric', 'min:0'],
            'avatar' => ['nullable', 'string'],
        ];
    }

    public function respond(): Response
    {
        /** @var array{product_type_id: string, manufacturer_id: string, name: string, sku: string, units?: int|null, cost: int, price: int, rebate?: string|null, royalty?: string|null, avatar?: File|null} $data */
        $data = $this->validated();

        $productId = (string) Str::ulid();

        if ($this->hasFile('avatar')) {
            $file = File::fromUploadedFile($this->file('avatar'), 'public');
            $data['avatar'] = $file;
        }

        ProductAggregate::retrieve($productId)
            ->create(
                productTypeId: $data['product_type_id'],
                manufacturerId: $data['manufacturer_id'],
                name: $data['name'],
                sku: $data['sku'],
                units: $data['units'] ?? 1,
                cost: $data['cost'],
                price: $data['price'],
                rebate: $data['rebate'] ?? '0.00',
                royalty: $data['royalty'] ?? '0.00',
                avatar: $data['avatar'] ?? ($this->has('avatar') ? new File() : null),
            )
            ->persist();

        return redirect()
            ->route('products.index')
            ->with('toast', [
                'message' => 'Product created successfully',
                'type' => 'success',
            ]);
    }
}
