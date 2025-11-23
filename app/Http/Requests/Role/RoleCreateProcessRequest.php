<?php

declare(strict_types=1);

namespace App\Http\Requests\Role;

use App\Actions\RoleActions;
use Illuminate\Foundation\Http\FormRequest;
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
            'policies' => 'array',
            'policies.*' => 'string',
        ];
    }

    public function respond(): Response
    {
        /** @var array{name: string, description?: string, hidden?: bool, policies?: array<int, string>} $data */
        $data = $this->validated();

        $role = RoleActions::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'hidden' => $data['hidden'] ?? false,
        ]);

        // Attach selected policies
        if (isset($data['policies'])) {
            $roleActions = new RoleActions($role);
            foreach ($data['policies'] as $policyString) {
                [$policy, $ability] = explode('@', $policyString, 2);
                $roleActions->attachPolicy(
                    policy: $policy,
                    ability: $ability,
                    description: '',
                    hidden: false
                );
            }
        }

        return redirect()
            ->route('roles.index')
            ->with('toast', [
                'message' => 'Role created successfully',
                'type' => 'success',
            ]);
    }
}
