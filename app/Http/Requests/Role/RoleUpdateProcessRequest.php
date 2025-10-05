<?php

declare(strict_types=1);

namespace App\Http\Requests\Role;

use App\Aggregates\RoleAggregate;
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
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'hidden' => 'boolean',
            'policies' => 'array',
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

        /** @var array{name: string, description: string, hidden: bool, policies?: array<int, string>} $data */
        $data = $this->validated();

        $aggregate = RoleAggregate::retrieve($roleId)
            ->update(
                name: $data['name'],
                description: $data['description'],
                hidden: $data['hidden']
            );

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
            $aggregate->detachPolicy(
                policy: $policy,
                ability: $ability
            );
        }

        // Attach new policies
        foreach ($policiesToAttach as $policyString) {
            [$policy, $ability] = explode('@', $policyString, 2);
            $aggregate->attachPolicy(
                policy: $policy,
                ability: $ability,
                description: '',
                hidden: false
            );
        }

        $aggregate->persist();

        return redirect()
            ->route('roles.index')
            ->with('toast', [
                'message' => 'Role updated successfully',
                'type' => 'success',
            ]);
    }
}
