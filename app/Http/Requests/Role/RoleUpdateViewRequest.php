<?php

declare(strict_types=1);

namespace App\Http\Requests\Role;

use App\Models\Policy;
use App\Models\Role;
use App\Services\PolicyDiscoveryService;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\Response;

final class RoleUpdateViewRequest extends FormRequest
{
    public function __construct(
        private readonly PolicyDiscoveryService $policyDiscoveryService
    ) {
        parent::__construct();
    }

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
            ->select(['id', 'name', 'description', 'hidden', 'closed_at'])
            ->with('policies:id,role_id,policy,ability')
            ->findOrFail($roleId);

        $availablePolicies = $this->policyDiscoveryService->discoverAvailablePolicies();

        // Get current policies attached to this role
        $currentPolicies = $role->policies->map(fn (Policy $policy): string => $policy->policy.'@'.$policy->ability)->toArray();

        return inertia()
            ->modal('Role/Update', [
                'role' => [
                    'id' => $role->id,
                    'name' => $role->name,
                    'description' => $role->description,
                    'hidden' => $role->hidden,
                    'closed_at' => $role->closed_at,
                    'policies' => $currentPolicies,
                ],
                'availablePolicies' => $availablePolicies,
            ])
            ->baseRoute('roles.index')
            ->toResponse($this);
    }
}
