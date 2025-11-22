<?php

declare(strict_types=1);

namespace App\Http\Requests\Territory;

use App\Actions\TerritoryActions;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

final class TerritoryUpdateProcessRequest extends FormRequest
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
            'operator_id' => ['sometimes', 'required', 'string', 'exists:operators,id'],
            'merchant_account_id' => ['sometimes', 'nullable', 'string', Rule::exists('merchant_accounts', 'id')],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
        ];
    }

    public function respond(): Response
    {

        /** @var array{operator_id?: string, merchant_account_id?: string|null, name?: string} $data */
        $data = $this->validated();

        new TerritoryActions((string) $this->route('territory'))->update($data);

        return redirect()
            ->route('territories.index')
            ->with('toast', [
                'message' => 'Territory updated successfully',
                'type' => 'success',
            ]);
    }
}
