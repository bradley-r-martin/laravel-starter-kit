<?php

declare(strict_types=1);

namespace App\Http\Requests\Role;

use App\Aggregates\RoleAggregate;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

final class RoleCreateProcessRequest extends FormRequest
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
            'description' => 'string|max:255',
            'hidden' => 'boolean',
        ];
    }

    public function respond(): Response
    {
        /** @var array{name: string, description: string, hidden: bool} $data */
        $data = $this->validated();

        $roleId = (string) Str::ulid();

        RoleAggregate::retrieve($roleId)
            ->create(
                (string) $data['name'],
                (string) $data['description'],
                (bool) $data['hidden']
            )
            ->persist();

        return redirect()
            ->route('roles.index')
            ->with('toast', [
                'message' => 'Role created successfully',
                'type' => 'success',
            ]);
    }
}
