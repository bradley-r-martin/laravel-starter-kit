<?php

declare(strict_types=1);

namespace App\Http\Requests\Snackware;

use App\Models\Product;
use App\Models\Snackware;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class SnackwareUpdateViewRequest extends FormRequest
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
        $snackwareId = $this->route('snackware');

        /** @var Snackware $snackware */
        $snackware = Snackware::query()
            ->select(['id', 'name', 'type', 'icon', 'price', 'closed_at'])
            ->with('products:id')
            ->findOrFail($snackwareId);

        $availableProducts = Product::query()
            ->whereNull('closed_at')
            ->orderBy('__product_type_name')
            ->orderBy('name')
            ->get()
            ->map(fn (Product $product): array => [
                'value' => $product->id,
                'label' => $product->name,
                ...$product->toArray(),
            ])
            ->values();

        // Get current products attached to this snackware
        $currentProducts = $snackware->products->map(fn (Product $product): string => $product->id)->toArray();

        return inertia()
            ->modal('Snackware/Update', [
                'snackware' => [
                    'id' => $snackware->id,
                    'name' => $snackware->name,
                    'type' => $snackware->type,
                    'icon' => $snackware->icon,
                    'price' => $snackware->price,
                    'closed_at' => $snackware->closed_at,
                    'products' => $currentProducts,
                ],
                'availableProducts' => $availableProducts,
            ])
            ->baseRoute('snackwares.index')
            ->toResponse($this);
    }
}
