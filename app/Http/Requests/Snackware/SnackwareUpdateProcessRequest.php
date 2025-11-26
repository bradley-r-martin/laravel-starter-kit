<?php

declare(strict_types=1);

namespace App\Http\Requests\Snackware;

use App\Actions\SnackwareActions;
use App\Models\Product;
use App\Models\Snackware;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class SnackwareUpdateProcessRequest extends FormRequest
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
            'name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|string|max:255',
            'icon' => 'nullable|string|max:255',
            'price' => 'sometimes|integer|min:0',
            'products' => 'sometimes|array',
            'products.*' => 'string',
        ];
    }

    public function respond(): Response
    {
        $snackwareId = (string) $this->route('snackware');

        /** @var Snackware $snackware */
        $snackware = Snackware::query()
            ->select(['id', 'closed_at'])
            ->with('products:id')
            ->findOrFail($snackwareId);

        // Only non-closed snackwares can be updated
        if ($snackware->closed_at !== null) {
            abort(403, 'Closed snackwares cannot be updated.');
        }

        /** @var array{name?: string, type?: string, icon?: string|null, price?: int, products?: array<int, string>} $data */
        $data = $this->validated();

        $snackwareActions = new SnackwareActions($snackware);

        // Update basic snackware attributes
        $updateData = [];
        if (isset($data['name'])) {
            $updateData['name'] = $data['name'];
        }
        if (isset($data['type'])) {
            $updateData['type'] = $data['type'];
        }
        if (array_key_exists('icon', $data)) {
            $updateData['icon'] = $data['icon'];
        }
        if (isset($data['price'])) {
            $updateData['price'] = $data['price'];
        }

        if ($updateData !== []) {
            $snackwareActions->update($updateData);
        }

        // Handle product changes
        $newProducts = $data['products'] ?? [];
        $currentProducts = $snackware->products->map(fn (Product $product): string => $product->id)->toArray();

        // Determine which products to attach and detach
        /** @var array<int, string> $productsToAttach */
        $productsToAttach = array_diff($newProducts, $currentProducts);
        /** @var array<int, string> $productsToDetach */
        $productsToDetach = array_diff($currentProducts, $newProducts);

        // Detach removed products
        foreach ($productsToDetach as $productId) {
            $snackwareActions->detachProduct($productId);
        }

        // Attach new products
        foreach ($productsToAttach as $productId) {
            $snackwareActions->attachProduct($productId);
        }

        return redirect()
            ->route('snackwares.index')
            ->with('toast', [
                'message' => 'Snackware updated successfully',
                'type' => 'success',
            ]);
    }
}
