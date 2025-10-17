<?php

declare(strict_types=1);

namespace App\Http\Requests\Wholesaler;

use App\Models\Wholesaler;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class WholesalerDestroyViewRequest extends FormRequest
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
        $wholesalerId = (string) $this->route('wholesaler');
        $wholesaler = Wholesaler::query()->select(['id', 'name'])->findOrFail($wholesalerId);

        return inertia()
            ->modal('Wholesaler/Destroy', [
                'wholesaler' => [
                    'id' => $wholesaler->id,
                    'name' => $wholesaler->name,
                ],
            ])
            ->baseRoute('wholesalers.index')
            ->toResponse($this);
    }
}
