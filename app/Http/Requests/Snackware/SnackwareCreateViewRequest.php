<?php

declare(strict_types=1);

namespace App\Http\Requests\Snackware;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class SnackwareCreateViewRequest extends FormRequest
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
        $availableProducts = Product::query()
            ->whereNull('closed_at')
            ->orderBy('__product_type_name')
            ->orderBy('name')
            ->get()
            ->map(fn (Product $product): array => [
                'value' => $product->id,
                'label' => $product->name,
                'group' => $product->__product_type_name ?? 'Unknown',
            ])
            ->values();

        return inertia()
            ->modal('Snackware/Create', [
                'availableProducts' => $availableProducts,
            ])
            ->baseRoute('snackwares.index')
            ->toResponse($this);
    }
}
