<?php

declare(strict_types=1);

namespace App\Http\Requests\Operator;

use App\Models\Operator;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class OperatorUpdateViewRequest extends FormRequest
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
        $operator = Operator::query()->findOrFail($operatorId);

        return inertia()
            ->modal('Operator/Update', [
                'operator' => [
                    'id' => $operator->id,
                    'name' => $operator->name,
                    'email' => $operator->email,
                    'phone' => $operator->phone,
                    'address' => $operator->address,
                ],
            ])
            ->baseRoute('operators.index')
            ->toResponse($this);
    }
}
