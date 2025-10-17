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
            'policies' => 'array',
            'policies.*' => 'string',
        ];
    }

    public function respond(): Response
    {
        /** @var array{name: string, description: string, hidden?: bool, policies?: array<int, string>} $data */
        $data = $this->validated();

        $roleId = (string) Str::ulid();

        $aggregate = RoleAggregate::retrieve($roleId)
            ->create(
                (string) $data['name'],
                (string) $data['description'],
                (bool) ($data['hidden'] ?? false)
            );

        // Attach selected policies
        if (isset($data['policies'])) {
            foreach ($data['policies'] as $policyString) {
                [$policy, $ability] = explode('@', $policyString, 2);
                $aggregate->attachPolicy(
                    policy: $policy,
                    ability: $ability,
                    description: '',
                    hidden: false
                );
            }
        }

        $aggregate->persist();

        return redirect()
            ->route('roles.index')
            ->with('toast', [
                'message' => 'Role created successfully',
                'type' => 'success',
            ]);
    }
}
