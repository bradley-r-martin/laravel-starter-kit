<?php

declare(strict_types=1);

namespace App\Http\Requests\User;

use App\Actions\UserActions;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class UserDestroyProcessRequest extends FormRequest
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
        ];
    }

    public function respond(): Response
    {
        $userId = (string) $this->route('user');
        $user = User::query()->select(['id', 'closed_at'])->findOrFail($userId);

        // Ensure user is closed before allowing destruction
        if (! $user->closed_at) {
            abort(403, 'User must be closed before destruction');
        }

        $this->validated();

        new UserActions($user)->destroy();

        return redirect()
            ->route('users.index')
            ->with('toast', [
                'message' => 'User account destroyed successfully',
                'type' => 'success',
            ]);
    }
}
