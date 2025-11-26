<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Policy;
use App\Models\Role;
use App\Models\User;

final class RoleActions
{
    public Role $role;

    public function __construct(
        Role|string $role,
    ) {
        if (is_string($role)) {
            /** @var Role $role */
            $role = Role::findOrFail($role);
        }
        $this->role = $role;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public static function create(array $data): Role
    {
        return Role::create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(array $data): Role
    {
        $this->role->update($data);

        // Derived data column updates
        if (array_key_exists('name', $data)) {
            User::where('role_id', $this->role->id)->update([
                '__role_name' => $this->role->name,
            ]);
        }

        return $this->role;
    }

    public function close(): Role
    {
        $this->role->update([
            'closed_at' => now(),
        ]);

        return $this->role;
    }

    public function reopen(): Role
    {
        $this->role->update([
            'closed_at' => null,
        ]);

        return $this->role;
    }

    public function destroy(): void
    {
        $this->role->delete();
    }

    public function attachPolicy(
        string $policy,
        string $ability,
        string $description = '',
        bool $hidden = false
    ): self {
        // Check if policy is already attached
        $existingPolicy = Policy::query()
            ->where('role_id', $this->role->id)
            ->where('policy', $policy)
            ->where('ability', $ability)
            ->first();

        if ($existingPolicy === null) {
            Policy::create([
                'role_id' => $this->role->id,
                'policy' => $policy,
                'ability' => $ability,
                'description' => $description,
                'hidden' => $hidden,
            ]);
        }

        return $this;
    }

    public function detachPolicy(string $policy, string $ability): self
    {
        Policy::query()
            ->where('role_id', $this->role->id)
            ->where('policy', $policy)
            ->where('ability', $ability)
            ->delete();

        return $this;
    }

    public function deprecatePolicy(string $policy, string $ability): self
    {
        Policy::query()
            ->where('role_id', $this->role->id)
            ->where('policy', $policy)
            ->where('ability', $ability)
            ->delete();

        return $this;
    }
}
