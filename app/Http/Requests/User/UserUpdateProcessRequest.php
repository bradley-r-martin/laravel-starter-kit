<?php

declare(strict_types=1);

namespace App\Http\Requests\User;

use App\Aggregates\UserAggregate;
use App\Domain\File;
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
            'first_name' => ['sometimes', 'string', 'max:255'],
            'last_name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'avatar' => ['sometimes', 'nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ];
    }

    public function respond(): Response
    {
        /** @var User $user */
        $user = User::findOrFail($this->route('user'));

        /** @var array{first_name?: string|null, last_name?: string|null, email?: string|null, avatar?: string|null} $data */
        $data = $this->validated();

        // Handle avatar file upload
        if ($this->hasFile('avatar')) {
            $file = File::fromUploadedFile($this->file('avatar'), 'public');
            $data['avatar'] = $file;
        }

        UserAggregate::retrieve($user->id)
            ->update(
                firstName: $data['first_name'] ?? null,
                lastName: $data['last_name'] ?? null,
                email: $data['email'] ?? null,
                avatar: $data['avatar'] ?? ($this->has('avatar') ? new File() : null),
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
