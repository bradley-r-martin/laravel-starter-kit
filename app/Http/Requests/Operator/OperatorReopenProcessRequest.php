<?php

declare(strict_types=1);

namespace App\Http\Requests\Operator;

use App\Actions\OperatorActions;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class OperatorReopenProcessRequest extends FormRequest
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

        $this->validated();

        new OperatorActions((string) $this->route('operator'))->reopen();

        return redirect()
            ->route('operators.index')
            ->with('toast', [
                'message' => 'Operator reopened successfully',
                'type' => 'success',
            ]);
    }
}
