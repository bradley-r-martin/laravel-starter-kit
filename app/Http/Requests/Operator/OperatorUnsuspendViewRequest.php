<?php

declare(strict_types=1);

namespace App\Http\Requests\Operator;

use App\Models\Operator;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class OperatorUnsuspendViewRequest extends FormRequest
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
        $operatorId = (string) $this->route('operator');

        $operator = Operator::query()
            ->select(['id', 'name'])
            ->findOrFail($operatorId);

        return inertia()
            ->modal('Operator/Unsuspend', [
                'operator' => [
                    'id' => $operator->id,
                    'name' => $operator->name,
                ],
            ])
            ->baseRoute('operators.index')
            ->toResponse($this);
    }
}
