<?php

declare(strict_types=1);

namespace App\Http\Requests\User;

use App\Aggregates\UserAggregate;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

final class UserUpdateProcessRequest extends FormRequest
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
        /** @var User $user */
        $user = User::findOrFail($this->route('user'));

        return [
            'operator_id' => ['required', 'string', 'exists:operators,id'],
            'role_id' => ['required', 'string', 'exists:roles,id'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
        ];
    }

    public function respond(): Response
    {
        /** @var User $user */
        $user = User::findOrFail($this->route('user'));

        /** @var array{operator_id: string, role_id: string, first_name: string, last_name: string, email: string} $data */
        $data = $this->validated();

        UserAggregate::retrieve($user->id)
            ->update(
                operatorId: $data['operator_id'],
                roleId: $data['role_id'],
                firstName: $data['first_name'],
                lastName: $data['last_name'],
                email: $data['email'],
            )
            ->persist();

        return redirect()
            ->route('users.index')
            ->with('toast', [
                'message' => 'User updated successfully',
                'type' => 'success',
            ]);
    }
}
