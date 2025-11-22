<?php

declare(strict_types=1);

namespace App\Http\Requests\Product;

use App\Actions\ProductActions;
use App\Domain\File;
use App\Rules\FileRule;
use Illuminate\Foundation\Http\FormRequest;
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
            'avatar' => ['sometimes', 'nullable', new FileRule()],
        ];
    }

    public function respond(): Response
    {
        $this->validated();

        $avatar = null;
        if ($this->filled('avatar')) {
            /** @var array<string, int|string|null>|null $avatarInput */
            $avatarInput = $this->input('avatar');
            $avatar = File::fromArray($avatarInput)->persist();
        }

        ProductActions::create([
            'product_type_id' => $this->string('product_type_id')->toString(),
            'manufacturer_id' => $this->string('manufacturer_id')->toString(),
            'name' => $this->string('name')->toString(),
            'sku' => $this->string('sku')->toString(),
            'units' => $this->integer('units'),
            'cost' => $this->integer('cost'),
            'price' => $this->integer('price'),
            'rebate' => $this->float('rebate'),
            'royalty' => $this->float('royalty'),
            'avatar' => $avatar,
        ]);

        return redirect()
            ->route('products.index')
            ->with('toast', [
                'message' => 'Product created successfully',
                'type' => 'success',
            ]);
    }
}
