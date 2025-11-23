<?php

declare(strict_types=1);

namespace App\Http\Requests\Site;

use App\Actions\SiteActions;
use App\Rules\AddressRule;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class SiteCreateProcessRequest extends FormRequest
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
            'route_id' => 'nullable|string|exists:routes,id',
            'order' => 'sometimes|integer|min:0',
            'name' => 'required|string|max:255',
            'address' => ['nullable', new AddressRule()],
            'opening_hours' => 'nullable|array',
            'manager_code' => 'nullable|string|max:255',
        ];
    }

    public function respond(): Response
    {
        $data = $this->validated();

        /** @var \App\Models\User $user */
        $user = $this->user();

        $data['operator_id'] = $user->operator_id;
        $data['territory_id'] = $user->territory()->id;

        SiteActions::create($data);

        return redirect()
            ->route('sites.index')
            ->with('toast', [
                'message' => 'Site created successfully',
                'type' => 'success',
            ]);
    }
}
