<?php

declare(strict_types=1);

namespace App\Http\Requests\Operator;

use App\Aggregates\OperatorAggregate;
use App\Models\Operator;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class OperatorCloseProcessRequest extends FormRequest
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
            'reason' => ['required', 'string', 'max:500'],
        ];
    }

    public function respond(): Response
    {
        $operatorId = (string) $this->route('operator');
        $operator = Operator::query()->select(['id'])->findOrFail($operatorId);

        /** @var array{reason: string} $data */
        $data = $this->validated();

        OperatorAggregate::retrieve($operator->id)
            ->close(
                reason: $data['reason'],
            )
            ->persist();

        return redirect()
            ->route('operators.index')
            ->with('toast', [
                'message' => 'Operator closed successfully',
                'type' => 'success',
            ]);
    }
}
