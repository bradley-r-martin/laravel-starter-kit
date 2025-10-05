<?php

declare(strict_types=1);

namespace App\Http\Requests\User;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class UserListViewRequest extends FormRequest
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

        $users = User::query()
            ->with(['role', 'operator'])
            ->select(['id', 'first_name', 'last_name', 'email', 'role_id', 'operator_id', '__operator_name', '__last_login_at', 'closed_at', 'suspended_at', 'created_at'])
            ->orderBy('created_at', 'desc')
            ->paginate()
            /** @var \Illuminate\Contracts\Pagination\LengthAwarePaginator<array{User $user}> $users */
            ->through(fn (User $user): array => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'role_name' => $user->role?->name,
                'operator_name' => $user->__operator_name,
                'last_login_at' => $user->__last_login_at,
                'closed_at' => $user->closed_at,
                'suspended_at' => $user->suspended_at,
                'created_at' => $user->created_at,
            ]);

        return inertia()
            ->render('User/List', [
                'users' => $users,
            ])
            ->toResponse($this);
    }
}
