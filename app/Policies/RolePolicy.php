<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Role;
use App\Models\User;

final class RolePolicy
{
    /**
     * Determine whether the user can view any roles.
     */
    public function viewAny(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    /**
     * Determine whether the user can view the role.
     */
    public function view(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    /**
     * Determine whether the user can create roles.
     */
    public function create(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    /**
     * Determine whether the user can update the role.
     */
    public function update(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    /**
     * Determine whether the user can delete the role.
     */
    public function delete(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    /**
     * Determine whether the user can restore the role.
     */
    public function restore(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    /**
     * Determine whether the user can permanently delete the role.
     */
    public function forceDelete(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    /**
     * Determine whether the user can attach policies to the role.
     */
    public function attachPolicy(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    /**
     * Determine whether the user can detach policies from the role.
     */
    public function detachPolicy(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    /**
     * Determine whether the user can close the role.
     */
    public function close(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    /**
     * Determine whether the user can reopen the role.
     */
    public function reopen(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    /**
     * Check if user is authorized.
     */
    private function isAuthorized(User $user): bool
    {
        if ($user->allowed(self::class.'@'.__FUNCTION__)) {
            return true;
        }
        if ($user->allowed(self::class)) {
            return true;
        }

        return $this->isDeveloper($user);
    }

    /**
     * Check if user has developer role.
     */
    private function isDeveloper(User $user): bool
    {
        return $user->email === config('app.developer_email');
    }
}
