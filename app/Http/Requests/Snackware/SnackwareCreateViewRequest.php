<?php

declare(strict_types=1);

namespace App\Http\Requests\Snackware;

use App\Models\Operator;
use App\Models\Territory;
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
        $territories = Territory::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Territory $territory): array => [
                'id' => $territory->id,
                'name' => $territory->name,
            ]);

        $operators = Operator::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Operator $operator): array => [
                'id' => $operator->id,
                'name' => $operator->name,
            ]);

        return inertia()
            ->modal('Snackware/Create', [
                'territories' => $territories,
                'operators' => $operators,
            ])
            ->baseRoute('snackwares.index')
            ->toResponse($this);
    }
}
