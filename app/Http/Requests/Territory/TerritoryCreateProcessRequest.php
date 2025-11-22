<?php

declare(strict_types=1);

namespace App\Http\Requests\Territory;

use App\Actions\TerritoryActions;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

final class TerritoryCreateProcessRequest extends FormRequest
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
            'operator_id' => ['required', 'string', 'exists:operators,id'],
            'merchant_account_id' => [
                'nullable',
                'string',
                Rule::exists('merchant_accounts', 'id')->where(fn (Builder $query) => $query->where('operator_id', $this->string('operator_id')->toString())),
            ],
            'name' => ['required', 'string', 'max:255'],
        ];
    }

    public function respond(): Response
    {
        /** @var array{operator_id: string, merchant_account_id?: string|null, name: string} $data */
        $data = $this->validated();

        TerritoryActions::create([
            'operator_id' => $data['operator_id'],
            'merchant_account_id' => $data['merchant_account_id'] ?? null,
            'name' => $data['name'],
        ]);

        return redirect()
            ->route('territories.index')
            ->with('toast', [
                'message' => 'Territory created successfully',
                'type' => 'success',
            ]);
    }
}
