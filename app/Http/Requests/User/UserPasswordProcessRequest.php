<?php

declare(strict_types=1);

namespace App\Http\Requests\User;

use App\Actions\UserActions;
use App\Models\User;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

final class UserPasswordProcessRequest extends FormRequest
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
        $userId = (string) $this->route('user');
        $currentUser = $this->user();
        $isCurrentUser = $currentUser && $currentUser->id === $userId;

        $rules = [
            'password' => 'required|string|min:8|confirmed',
        ];

        // If changing own password, require current password
        if ($isCurrentUser) {
            $rules['current_password'] = 'required|string';
        }

        return $rules;
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $userId = (string) $this->route('user');
        /** @var User $currentUser */
        $currentUser = $this->user();
        $isCurrentUser = $currentUser->id === $userId;

        // Add custom validation for current password
        if ($isCurrentUser) {
            $validator->after(function (Validator $validator): void {
                $currentPassword = $this->string('current_password')->toString();
                /** @var User $user */
                $user = $this->user();

                if (! Hash::check($currentPassword, $user->password)) {
                    $validator->errors()->add('current_password', 'The current password is incorrect.');
                }
            });
        }
    }

    public function respond(): Response
    {
        $userId = (string) $this->route('user');
        $user = User::query()->select(['id'])->findOrFail($userId);

        /** @var array{password: string, password_confirmation: string} $data */
        $data = $this->validated();

        new UserActions($user)->changePassword(Hash::make($data['password']));

        return redirect()
            ->route('users.index')
            ->with('toast', [
                'message' => 'Password changed successfully',
                'type' => 'success',
            ]);
    }
}
