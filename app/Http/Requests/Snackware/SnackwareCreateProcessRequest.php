<?php

declare(strict_types=1);

namespace App\Http\Requests\Snackware;

use App\Actions\SnackwareActions;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class SnackwareCreateProcessRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'type' => 'sometimes|string|max:255',
            'icon' => 'nullable|string|max:255',
            'price' => 'sometimes|integer|min:0',
            'products' => 'sometimes|array',
            'products.*' => 'string',
        ];
    }

    public function respond(): Response
    {
        /** @var array{name: string, type?: string, icon?: string|null, price?: int, products?: array<int, string>} $data */
        $data = $this->validated();

        /** @var \App\Models\User $user */
        $user = $this->user();

        $operator = $user->operator;
        $territory = $user->territory();

        if (! $operator) {
            abort(403, 'User must be associated with an operator');
        }

        $snackware = SnackwareActions::create([
            'territory_id' => $territory->id,
            'operator_id' => $operator->id,
            'name' => $data['name'],
            'type' => $data['type'] ?? 'box',
            'icon' => $data['icon'] ?? null,
            'price' => $data['price'] ?? 0,
        ]);

        // Attach selected products
        if (isset($data['products'])) {
            $snackwareActions = new SnackwareActions($snackware);
            foreach ($data['products'] as $productId) {
                $snackwareActions->attachProduct($productId);
            }
        }

        return redirect()
            ->route('snackwares.index')
            ->with('toast', [
                'message' => 'Snackware created successfully',
                'type' => 'success',
            ]);
    }
}
