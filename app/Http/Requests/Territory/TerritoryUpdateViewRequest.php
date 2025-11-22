<?php

declare(strict_types=1);

namespace App\Http\Requests\Territory;

use App\Models\MerchantAccount;
use App\Models\Operator;
use App\Models\Territory;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class TerritoryUpdateViewRequest extends FormRequest
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
        $territory = Territory::query()
            ->with(['operator:id,name', 'merchantAccount:id,provider,operator_id'])
            ->select(['id', 'operator_id', 'merchant_account_id', 'name'])
            ->findOrFail($territoryId);

        $operators = Operator::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Operator $operator): array => [
                'id' => $operator->id,
                'name' => $operator->name,
            ]);

        $merchantAccounts = MerchantAccount::query()
            ->orderBy('provider')
            ->get(['id', 'provider', 'operator_id'])
            ->map(fn (MerchantAccount $merchantAccount): array => [
                'id' => $merchantAccount->id,
                'provider' => $merchantAccount->provider,
                'operator_id' => $merchantAccount->operator_id,
            ]);

        return inertia()
            ->modal('Territory/Update', [
                'territory' => [
                    'id' => $territory->id,
                    'name' => $territory->name,
                    'operator_id' => $territory->operator_id,
                    'merchant_account_id' => $territory->merchant_account_id,
                    'operator' => [
                        'id' => $territory->operator?->id,
                        'name' => $territory->operator?->name,
                    ],
                    'merchant_account' => $territory->merchantAccount?->id ? [
                        'id' => $territory->merchantAccount->id,
                        'provider' => $territory->merchantAccount->provider,
                    ] : null,
                ],
                'operators' => $operators,
                'merchant_accounts' => $merchantAccounts,
            ])
            ->baseRoute('territories.index')
            ->toResponse($this);
    }
}
