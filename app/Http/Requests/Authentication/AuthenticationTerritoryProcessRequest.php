<?php

declare(strict_types=1);

namespace App\Http\Requests\Authentication;

use App\Models\Territory;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

final class AuthenticationTerritoryProcessRequest extends FormRequest
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
            'territory_id' => ['required', 'string', 'ulid'],
        ];
    }

    public function respond(): Response
    {
        $territoryId = $this->string('territory_id')->toString();

        /** @var User $user */
        $user = $this->user();

        // Verify the territory belongs to the user's operator
        $territory = Territory::query()
            ->where('id', $territoryId)
            ->where('operator_id', $user->operator_id)
            ->whereNull('closed_at')
            ->first();

        if (! $territory) {
            throw ValidationException::withMessages([
                'territory_id' => 'The selected territory is invalid.',
            ]);
        }

        // Store the territory ID in a cookie (30 days)
        Cookie::queue('selected_territory', $territoryId, 60 * 24 * 30);

        return redirect()->intended('/dashboard');
    }
}
