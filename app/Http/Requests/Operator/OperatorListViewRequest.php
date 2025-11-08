<?php

declare(strict_types=1);

namespace App\Http\Requests\Operator;

use App\Models\Operator;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class OperatorListViewRequest extends FormRequest
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

        $operators = Operator::query()

            ->filterSortBy($this->string('operators_sort')->toString())
            ->filterByStatus($this->string('operators_status')->toString())
            ->filterBySearch($this->string('operators_search')->toString())
            ->paginate(10, ['*'], 'operators_page')
            /** @var \Illuminate\Contracts\Pagination\LengthAwarePaginator<array{Operator $operator}> $operators */
            ->through(fn (Operator $operator): array => [
                'id' => $operator->id,
                'name' => $operator->name,
                'email' => $operator->email,
                'territories_count' => $operator->__territories_count,
                'last_transaction_at' => $operator->__last_transaction_at,
                'closed_at' => $operator->closed_at,
                'suspended_at' => $operator->suspended_at,
                'created_at' => $operator->created_at,
            ]);

        return inertia()
            ->render('Operator/List', [
                'operators' => $operators,
            ])
            ->toResponse($this);
    }
}
