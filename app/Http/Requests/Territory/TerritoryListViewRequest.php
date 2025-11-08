<?php

declare(strict_types=1);

namespace App\Http\Requests\Territory;

use App\Models\Territory;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class TerritoryListViewRequest extends FormRequest
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
            ->filterSortBy($this->string('territories_sort')->toString())
            ->filterBySearch($this->string('territories_search')->toString())
            ->filterByStatus($this->string('territories_status')->toString())
            ->paginate(10, ['*'], 'territories_page')
            /** @var \Illuminate\Contracts\Pagination\LengthAwarePaginator<array{Territory $territory}> $territories */
            ->through(fn (Territory $territory): array => [
                'id' => $territory->id,
                'name' => $territory->name,
                'closed_at' => $territory->closed_at,
                'created_at' => $territory->created_at,
                '__operator_name' => $territory->__operator_name,
                '__last_transaction_at' => $territory->__last_transaction_at,
            ]);

        return inertia()
            ->render('Territory/List', [
                'territories' => $territories,
            ])
            ->toResponse($this);
    }
}
