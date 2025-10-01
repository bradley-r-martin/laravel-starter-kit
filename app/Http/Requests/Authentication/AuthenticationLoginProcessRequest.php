<?php

declare(strict_types=1);

namespace App\Http\Requests\Authentication;

use App\Aggregates\UserAggregate;
use App\Models\User;
use DateTimeImmutable;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
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

    public function rate_limit_key(): string
    {

        $email = request()->string('email')->lower()->toString();

        return $email.'|'.request()->ip();
    }

    public function respond(): Response
    {
        $email = request()->string('email')->toString();
        $password = request()->string('password')->toString();
        $remember = true;

        if (RateLimiter::tooManyAttempts($this->rate_limit_key(), 5)) {
            event(new Lockout(request()));
            $seconds = RateLimiter::availableIn($this->rate_limit_key());
            throw ValidationException::withMessages([
                'email' => trans('auth.throttle', [
                    'seconds' => $seconds,
                    'minutes' => ceil($seconds / 60),
                ]),
            ]);
        }

        if (! Auth::validate(['email' => $email, 'password' => $password])) {
            RateLimiter::hit($this->rate_limit_key());
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }
        RateLimiter::clear(Str::lower($email).'|'.request()->ip());

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
