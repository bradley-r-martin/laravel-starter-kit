<?php

declare(strict_types=1);

namespace App\Http\Requests\User;

use App\Actions\UserActions;
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
            'first_name' => ['sometimes', 'required', 'string', 'max:255'],
            'last_name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'avatar' => ['sometimes', 'nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ];
    }

    public function respond(): Response
    {
        /** @var User $user */
        $user = User::findOrFail($this->route('user'));

        /** @var array{first_name?: string|null, last_name?: string|null, email?: string|null, avatar?: File|null} $data */
        $data = $this->validated();

        // Handle avatar file upload
        $updateData = [];
        if (isset($data['first_name'])) {
            $updateData['first_name'] = $data['first_name'];
        }
        if (isset($data['last_name'])) {
            $updateData['last_name'] = $data['last_name'];
        }
        if (isset($data['email'])) {
            $updateData['email'] = $data['email'];
        }
        if ($this->hasFile('avatar')) {
            $file = File::fromUploadedFile($this->file('avatar'), 'public');
            $updateData['avatar'] = json_encode($file->toArray());
        }

        new UserActions($user)->update($updateData);

        return redirect()
            ->route('users.index')
            ->with('toast', [
                'message' => 'User updated successfully',
                'type' => 'success',
            ]);
    }
}
