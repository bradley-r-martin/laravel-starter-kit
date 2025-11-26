<?php

declare(strict_types=1);

namespace App\Http\Requests\User;

use App\Actions\UserActions;
use App\Models\User;
use App\Rules\FileRule;
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
            'first_name' => ['sometimes', 'required', 'string', 'max:255'],
            'last_name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'avatar' => ['sometimes', 'nullable', new FileRule()],
        ];
    }

    public function respond(): Response
    {

        $data = $this->validated();
        new UserActions((string) $this->route('user'))->update($data);

        return redirect()
            ->route('users.index')
            ->with('toast', [
                'message' => 'User updated successfully',
                'type' => 'success',
            ]);
    }
}
