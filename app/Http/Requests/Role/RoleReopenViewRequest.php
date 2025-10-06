<?php

declare(strict_types=1);

namespace App\Http\Requests\Role;

use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class RoleReopenViewRequest extends FormRequest
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
        $roleId = $this->route('role');

        /** @var Role $role */
        $role = Role::query()
            ->select(['id', 'name', 'description', 'closed_at'])
            ->findOrFail($roleId);

        return inertia()
            ->modal('Role/Reopen', [
                'role' => [
                    'id' => $role->id,
                    'name' => $role->name,
                    'description' => $role->description,
                    'closed_at' => $role->closed_at,
                ],
            ])
            ->baseRoute('roles.index')
            ->toResponse($this);
    }
}
