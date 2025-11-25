<?php

declare(strict_types=1);

namespace App\Traits;

use App\Models\User;

trait AuthorizesPolicy
{
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
