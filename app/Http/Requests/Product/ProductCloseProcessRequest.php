<?php

declare(strict_types=1);

namespace App\Http\Requests\Product;

use App\Aggregates\ProductAggregate;
use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ProductCloseProcessRequest extends FormRequest
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
            'reason' => ['required', 'string', 'max:255'],
        ];
    }

    public function respond(): Response
    {
        /** @var Product $product */
        $product = Product::findOrFail($this->route('product'));

        /** @var array{reason: string} $data */
        $data = $this->validated();

        ProductAggregate::retrieve($product->id)
            ->close(
                reason: $data['reason'],
            )
            ->persist();

        return redirect()
            ->route('products.index')
            ->with('toast', [
                'message' => 'Product closed successfully',
                'type' => 'success',
            ]);
    }
}
