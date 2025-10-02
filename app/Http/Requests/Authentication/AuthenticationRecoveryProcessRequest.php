<?php

declare(strict_types=1);

namespace App\Http\Requests\Authentication;

use App\Aggregates\UserAggregate;
use App\Models\User;
use DateTimeImmutable;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class AuthenticationRecoveryProcessRequest extends FormRequest
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
            'email' => 'required|email',
        ];
    }

    public function respond(): Response
    {
        $email = request()->string('email')->toString();

        // Find user by email
        $user = User::query()->where('email', $email)->first();

        // Only record the event if the user exists
        if ($user) {
            UserAggregate::retrieve($user->id)
                ->requestRecovery(
                    email: $email,
                    ipAddress: request()->ip() ?? '',
                    userAgent: request()->userAgent() ?? '',
                    timestamp: new DateTimeImmutable,
                )
                ->persist();
        }

        // Always return the same response to prevent email enumeration
        return back();
    }
}
