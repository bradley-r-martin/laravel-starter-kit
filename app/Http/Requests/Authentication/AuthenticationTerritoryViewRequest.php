<?php

declare(strict_types=1);

namespace App\Http\Requests\Authentication;

use App\Models\Territory;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class AuthenticationTerritoryViewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
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
        /** @var User|null $user */
        $user = $this->user();

        if (! $user) {
            abort(403, 'User not authenticated.');
        }

        // Get territories for the authenticated user's operator
        $territories = Territory::query()
            ->where('operator_id', $user->operator_id)
            ->whereNull('closed_at')
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(static fn (Territory $territory): array => [
                'id' => $territory->id,
                'name' => $territory->name,
            ]);

        return inertia()
            ->render('Authentication/Territory', [
                'territories' => $territories,
            ])
            ->toResponse($this);
    }
}
