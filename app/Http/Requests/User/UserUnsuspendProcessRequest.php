<?php

declare(strict_types=1);

namespace App\Http\Requests\User;

use App\Aggregates\UserAggregate;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class UserUnsuspendProcessRequest extends FormRequest
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
        $userId = (string) $this->route('user');
        $user = User::query()->select(['id'])->findOrFail($userId);

        /** @var array{reason: string, notify?: bool} $data */
        $data = $this->validated();

        UserAggregate::retrieve($user->id)
            ->unsuspend(
                reason: $data['reason'],
                notify: $data['notify'] ?? false,
            )
            ->persist();

        return redirect()
            ->route('users.index')
            ->with('toast', [
                'message' => 'User unsuspended successfully',
                'type' => 'success',
            ]);
    }
}
