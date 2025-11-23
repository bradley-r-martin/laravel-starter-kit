<?php

declare(strict_types=1);

namespace App\Http\Requests\User;

use App\Actions\UserActions;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class UserSuspendProcessRequest extends FormRequest
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
            'reason' => 'required|string|max:500',
            'notify' => 'boolean',
        ];
    }

    public function respond(): Response
    {
        /** @var array{reason: string, notify?: bool} $data */
        $data = $this->validated();

        new UserActions((string) $this->route('user'))
            ->suspend($data['notify'] ?? false, $data['reason']);

        return redirect()
            ->route('users.index')
            ->with('toast', [
                'message' => 'User suspended successfully',
                'type' => 'success',
            ]);
    }
}
