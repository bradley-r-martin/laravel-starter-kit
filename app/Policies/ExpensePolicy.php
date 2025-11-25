<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Expense;
use App\Models\User;
use App\Traits\AuthorizesPolicy;

final class ExpensePolicy
{
    use AuthorizesPolicy;

    /**
     * Determine whether the user can view any expenses.
     */
    public function viewAny(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    /**
     * Determine whether the user can view the expense.
     */
    public function view(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    /**
     * Determine whether the user can create expenses.
     */
    public function create(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    /**
     * Determine whether the user can update the expense.
     */
    public function update(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    /**
     * Determine whether the user can delete the expense.
     */
    public function delete(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    /**
     * Determine whether the user can restore the expense.
     */
    public function restore(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    /**
     * Determine whether the user can permanently delete the expense.
     */
    public function forceDelete(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    /**
     * Determine whether the user can complete the expense.
     */
    public function complete(User $user): bool
    {
        return $this->isAuthorized($user);
    }

    /**
     * Determine whether the user can reopen the expense.
     */
    public function reopen(User $user): bool
    {
        return $this->isAuthorized($user);
    }
}
