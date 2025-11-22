<?php

declare(strict_types=1);

namespace App\Http\Requests\ProductType;

use App\Actions\ProductTypeActions;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class ProductTypeUpdateProcessRequest extends FormRequest
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
            'name' => ['sometimes', 'required', 'string', 'max:255'],
        ];
    }

    public function respond(): Response
    {
        /** @var array{name?: string|null} $data */
        $data = $this->validated();

        new ProductTypeActions((string) $this->route('product_type'))->update($data);

        return redirect()
            ->route('product-types.index')
            ->with('toast', [
                'message' => 'Product type updated successfully',
                'type' => 'success',
            ]);
    }
}
