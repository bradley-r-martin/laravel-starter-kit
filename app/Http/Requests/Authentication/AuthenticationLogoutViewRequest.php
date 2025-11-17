<?php

declare(strict_types=1);

namespace App\Http\Requests\Authentication;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

final class AuthenticationLogoutViewRequest extends FormRequest
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
        // Log the user out
        Auth::logout();

        // Invalidate the session
        Session::invalidate();
        Session::regenerateToken();

        // Clear the territory cookie
        Cookie::queue(Cookie::forget('selected_territory'));

        return inertia()
            ->render('Authentication/Logout', [])
            ->toResponse($this);
    }
}
