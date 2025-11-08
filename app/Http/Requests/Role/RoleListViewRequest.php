<?php

declare(strict_types=1);

namespace App\Http\Requests\Role;

use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class RoleListViewRequest extends FormRequest
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
            ->filterSortBy($this->string('roles_sort')->toString())
            ->filterBySearch($this->string('roles_search')->toString())
            ->filterByStatus($this->string('roles_status')->toString())
            ->paginate(10, ['*'], 'roles_page')
            /** @var \Illuminate\Contracts\Pagination\LengthAwarePaginator<array{Role $role}> $roles */
            ->through(fn (Role $role): array => [
                'id' => $role->id,
                'name' => $role->name,
                'description' => $role->description,
                'hidden' => $role->hidden,
                'users_count' => $role->__users_count,
                'closed_at' => $role->closed_at,
                'created_at' => $role->created_at,
            ]);

        return inertia()
            ->render('Role/List', [
                'roles' => $roles,
            ])
            ->toResponse($this);
    }
}
