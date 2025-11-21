<?php

declare(strict_types=1);

namespace App\Http\Requests\Territory;

use App\Models\MerchantAccount;
use App\Models\Operator;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class TerritoryCreateViewRequest extends FormRequest
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
            ->modal('Territory/Create', [
                'operators' => $operators,
                'merchant_accounts' => $merchantAccounts,
            ])
            ->baseRoute('territories.index')
            ->toResponse($this);
    }
}

