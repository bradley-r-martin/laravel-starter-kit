<?php

declare(strict_types=1);

namespace App\Http\Requests\Authentication;

use App\Models\User;
use App\Notifications\PasswordRecoveryNotification;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Password;
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

        // Only send notification if the user exists
        if ($user) {
            // Generate recovery token and send notification
            $token = Password::createToken($user);
            $user->notify(new PasswordRecoveryNotification($token));
        }

        // Always return the same response to prevent email enumeration
        return redirect()->route('login')->with('toast', [
            'message' => 'Recovery email sent successfully',
            'type' => 'success',
        ]);
    }
}
