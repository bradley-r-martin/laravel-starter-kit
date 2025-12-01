<?php

declare(strict_types=1);

namespace App\Http\Requests\Role;

use App\Models\Policy;
use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class RoleUpdateViewRequest extends FormRequest
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
            ->with('policies')
            ->findOrFail($roleId);

        return inertia()
            ->modal('Role/Update', [
                'role' => [
                    'id' => $role->id,
                    'name' => $role->name,
                    'description' => $role->description,
                    'hidden' => $role->hidden,
                    'closed_at' => $role->closed_at,
                    'policies' => $role->policies->pluck('namespace')->toArray(),
                ],
                'policies' => Policy::available(),
            ])
            ->baseRoute('roles.index')
            ->toResponse($this);
    }
}
