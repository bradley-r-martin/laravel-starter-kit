<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

final class Role extends Model
{
    use HasUlids;

    /**
     * Get the policies that belong to this role.
     */
    public function policies(): BelongsToMany
    {
        return $this->belongsToMany(Policy::class, 'policy_role', 'role_id', 'policy_namespace');
    }

    /**
     * Get the users that belong to this role.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'users', 'role_id', 'id');
    }

    protected function casts(): array
    {
        return [
            'hidden' => 'boolean',
            'closed_at' => 'datetime',
        ];
    }
}
