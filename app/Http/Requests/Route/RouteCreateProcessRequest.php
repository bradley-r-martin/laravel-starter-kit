<?php

declare(strict_types=1);

namespace App\Http\Requests\Route;

use App\Actions\RouteActions;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class RouteCreateProcessRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'schedule' => 'nullable|string',
        ];
    }

    public function respond(): Response
    {
        $data = $this->validated();

        /** @var \App\Models\User $user */
        $user = $this->user();

        $data['operator_id'] = $user->operator_id;
        $data['territory_id'] = $user->territory()->id;

        RouteActions::create($data);

        return redirect()
            ->route('routes.index')
            ->with('toast', [
                'message' => 'Route created successfully',
                'type' => 'success',
            ]);
    }
}
