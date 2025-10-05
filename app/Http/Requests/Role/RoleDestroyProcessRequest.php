<?php

declare(strict_types=1);

namespace App\Http\Requests\Role;

use App\Aggregates\RoleAggregate;
use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class RoleDestroyProcessRequest extends FormRequest
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
        $roleId = (string) $this->route('role');
        $role = Role::query()->select(['id', 'closed_at'])->findOrFail($roleId);

        // Only closed roles can be destroyed
        if ($role->closed_at === null) {
            abort(403, 'Only closed roles can be destroyed. Please close the role first.');
        }

        // Destroy the role via event sourcing
        RoleAggregate::retrieve($roleId)
            ->destroy()
            ->persist();

        return redirect()
            ->route('roles.index')
            ->with('toast', [
                'message' => 'Role destroyed successfully',
                'type' => 'success',
            ]);
    }
}
