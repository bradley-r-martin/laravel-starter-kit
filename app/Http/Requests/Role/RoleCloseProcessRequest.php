<?php

declare(strict_types=1);

namespace App\Http\Requests\Role;

use App\Aggregates\RoleAggregate;
use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class RoleCloseProcessRequest extends FormRequest
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
        $roleId = (string) $this->route('role');
        $role = Role::query()->select(['id', '__users_count'])->findOrFail($roleId);

        if ($role->__users_count > 0) {
            abort(403, 'Cannot close a role that has users assigned. Please reassign users before closing.');
        }

        /** @var array{reason: string} $data */
        $data = $this->validated();

        RoleAggregate::retrieve($roleId)
            ->close(
                reason: $data['reason'],
            )
            ->persist();

        return redirect()
            ->route('roles.index')
            ->with('toast', [
                'message' => 'Role closed successfully',
                'type' => 'success',
            ]);
    }
}
