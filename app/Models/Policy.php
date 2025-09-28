<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

final class Policy extends Model
{
    public $incrementing = false;

    protected $primaryKey = 'namespace';

    protected $keyType = 'string';

    /**
     * Get the roles that have this policy.
     *
     * @return BelongsToMany<Role, $this>
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'policy_role', 'policy_namespace', 'role_id');
    }

    protected function casts(): array
    {
        return [
            'hidden' => 'boolean',
        ];
    }
}
