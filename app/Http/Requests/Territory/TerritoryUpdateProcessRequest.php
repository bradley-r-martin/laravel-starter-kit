<?php

declare(strict_types=1);

namespace App\Http\Requests\Territory;

use App\Aggregates\TerritoryAggregate;
use App\Models\MerchantAccount;
use App\Models\Territory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
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
        $territoryId = (string) $this->route('territory');
        /** @var Territory $territory */
        $territory = Territory::query()->select(['id', 'operator_id'])->findOrFail($territoryId);

        /** @var array{operator_id?: string, merchant_account_id?: string|null, name?: string} $data */
        $data = $this->validated();

        $operatorId = $data['operator_id'] ?? $territory->operator_id;

        if (array_key_exists('merchant_account_id', $data) && $data['merchant_account_id'] !== null) {
            $merchantAccountOperatorId = MerchantAccount::query()
                ->whereKey($data['merchant_account_id'])
                ->value('operator_id');

            if ($merchantAccountOperatorId === null || $merchantAccountOperatorId !== $operatorId) {
                throw ValidationException::withMessages([
                    'merchant_account_id' => 'The selected merchant account does not belong to the selected operator.',
                ]);
            }
        }

        TerritoryAggregate::retrieve($territory->id)
            ->update(
                operatorId: $data['operator_id'] ?? null,
                merchantAccountIdTouched: array_key_exists('merchant_account_id', $data),
                merchantAccountId: $data['merchant_account_id'] ?? null,
                name: $data['name'] ?? null,
            )
            ->persist();

        return redirect()
            ->route('territories.index')
            ->with('toast', [
                'message' => 'Territory updated successfully',
                'type' => 'success',
            ]);
    }
}
