<?php

declare(strict_types=1);

namespace App\Http\Requests\Role;

use App\Actions\RoleActions;
use App\Models\Policy;
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
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string|max:255',
            'hidden' => 'sometimes|boolean',
            'policies' => 'sometimes|array',
            'policies.*' => 'string',
        ];
    }

    public function respond(): Response
    {
        $roleId = (string) $this->route('role');

        /** @var Role $role */
        $role = Role::query()
            ->select(['id', 'closed_at'])
            ->with('policies:id,role_id,policy,ability')
            ->findOrFail($roleId);

        // Only non-closed roles can be updated
        if ($role->closed_at !== null) {
            abort(403, 'Closed roles cannot be updated.');
        }

        /** @var array{name?: string, description?: string, hidden?: bool, policies?: array<int, string>} $data */
        $data = $this->validated();

        $roleActions = new RoleActions($role);

        // Update basic role attributes
        $updateData = [];
        if (array_key_exists('name', $data)) {
            $updateData['name'] = $data['name'];
        }
        if (array_key_exists('description', $data)) {
            $updateData['description'] = $data['description'];
        }
        if (array_key_exists('hidden', $data)) {
            $updateData['hidden'] = $data['hidden'];
        }

        if ($updateData !== []) {
            $roleActions->update($updateData);
        }

        // Handle policy changes
        $newPolicies = $data['policies'] ?? [];
        $currentPolicies = $role->policies->map(fn (Policy $policy): string => $policy->policy.'@'.$policy->ability)->toArray();

        // Determine which policies to attach and detach
        /** @var array<int, string> $policiesToAttach */
        $policiesToAttach = array_diff($newPolicies, $currentPolicies);
        /** @var array<int, string> $policiesToDetach */
        $policiesToDetach = array_diff($currentPolicies, $newPolicies);

        // Detach removed policies
        foreach ($policiesToDetach as $policyString) {
            [$policy, $ability] = explode('@', (string) $policyString, 2);
            $roleActions->detachPolicy(
                policy: $policy,
                ability: $ability
            );
        }

        // Attach new policies
        foreach ($policiesToAttach as $policyString) {
            [$policy, $ability] = explode('@', $policyString, 2);
            $roleActions->attachPolicy(
                policy: $policy,
                ability: $ability,
                description: '',
                hidden: false
            );
        }

        return redirect()
            ->route('roles.index')
            ->with('toast', [
                'message' => 'Role updated successfully',
                'type' => 'success',
            ]);
    }
}
