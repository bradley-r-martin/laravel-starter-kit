<?php

declare(strict_types=1);

namespace App\Http\Requests\Role;

use App\Aggregates\RoleAggregate;
use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class RoleUpdateProcessRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'hidden' => 'boolean',
        ];
    }

    public function respond(): Response
    {
        $roleId = (string) $this->route('role');
        $role = Role::query()->select(['id', 'closed_at'])->findOrFail($roleId);

        // Only non-closed roles can be updated
        if ($role->closed_at !== null) {
            abort(403, 'Closed roles cannot be updated.');
        }

        /** @var array{name: string, description: string, hidden: bool} $data */
        $data = $this->validated();

        // Update the role via event sourcing
        RoleAggregate::retrieve($roleId)
            ->update(
                name: $data['name'],
                description: $data['description'],
                hidden: $data['hidden']
            )
            ->persist();

        return redirect()
            ->route('roles.index')
            ->with('toast', [
                'message' => 'Role updated successfully',
                'type' => 'success',
            ]);
    }
}
