<?php

declare(strict_types=1);

namespace App\Http\Requests\Authentication;

use App\Aggregates\UserAggregate;
use App\Models\User;
use DateTimeImmutable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

final class AuthenticationLoginProcessRequest extends FormRequest
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
            'password' => 'required|string',
        ];
    }

    public function respond(): Response
    {
        $email = request()->string('email')->toString();
        $password = request()->string('password')->toString();
        $remember = true;

        if (! Auth::validate(['email' => $email, 'password' => $password])) {

            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        // Get the authenticated user
        /** @var User $user */
        $user = Auth::getProvider()->retrieveByCredentials(['email' => $email]);

        // Use UserAggregate to handle login
        UserAggregate::retrieve($user->id)
            ->login(
                ipAddress: request()->ip() ?? '',
                userAgent: request()->userAgent() ?? '',
                timestamp: new DateTimeImmutable,
                remember: $remember,
            )
            ->persist();

        // Actually log the user in
        Auth::login($user, $remember);

        return redirect()->intended('/dashboard');
    }
}
