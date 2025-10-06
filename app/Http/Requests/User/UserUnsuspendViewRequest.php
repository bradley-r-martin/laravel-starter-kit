<?php

declare(strict_types=1);

namespace App\Http\Requests\User;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class UserUnsuspendViewRequest extends FormRequest
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
        $userId = $this->route('user');

        /** @var User $user */
        $user = User::query()
            ->select(['id', 'first_name', 'last_name', 'email', 'suspended_at'])
            ->findOrFail($userId);

        return inertia()
            ->modal('User/Unsuspend', [
                'user' => [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'suspended_at' => $user->suspended_at,
                ],
            ])
            ->baseRoute('users.index')
            ->toResponse($this);
    }
}
