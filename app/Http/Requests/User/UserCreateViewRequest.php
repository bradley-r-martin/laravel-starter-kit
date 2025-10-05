<?php

declare(strict_types=1);

namespace App\Http\Requests\User;

use App\Models\Operator;
use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class UserCreateViewRequest extends FormRequest
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
        $roles = Role::query()
            ->whereNull('closed_at')
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Role $role): array => [
                'value' => $role->id,
                'label' => $role->name,
            ]);

        $operators = Operator::query()
            ->whereNull('closed_at')
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Operator $operator): array => [
                'value' => $operator->id,
                'label' => $operator->name,
            ]);

        return inertia()
            ->modal('User/Create', [
                'roles' => $roles,
                'operators' => $operators,
            ])
            ->baseRoute('users.index')
            ->toResponse($this);
    }
}
