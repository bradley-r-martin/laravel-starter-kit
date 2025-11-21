<?php

declare(strict_types=1);

namespace App\Http\Requests\Territory;

use App\Models\Territory;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class TerritoryReopenViewRequest extends FormRequest
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
        $territoryId = (string) $this->route('territory');
        $territory = Territory::query()->select(['id', 'name'])->findOrFail($territoryId);

        return inertia()
            ->modal('Territory/Reopen', [
                'territory' => [
                    'id' => $territory->id,
                    'name' => $territory->name,
                ],
            ])
            ->baseRoute('territories.index')
            ->toResponse($this);
    }
}

