<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Role extends Model
{
    use HasUlids;

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeFilterSortBy(Builder $query, string $sort): Builder
    {

        return match ($sort) {
            'status' => $query->orderBy('closed_at', 'asc'),
            'users_count' => $query->orderBy('__users_count', 'desc'),
            'created_at' => $query->orderBy('created_at', 'asc'),
            default => $query->orderBy('name', 'asc'),
        };
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeFilterByStatus(Builder $query, string $status): Builder
    {
        return match ($status) {
            'closed' => $query->whereNotNull('closed_at'),
            'hidden' => $query->where('hidden', true),
            default => $query->whereNull('closed_at')->where('hidden', false)
        };
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeFilterBySearch(Builder $query, ?string $search): Builder
    {
        return $query->when($search, fn (Builder $q) => $q->where(fn (Builder $q) => $q
            ->where('name', 'like', "%{$search}%")
        ));
    }

    /**
     * Get the policies that belong to this role.
     *
     * @return HasMany<Policy, $this>
     */
    public function policies(): HasMany
    {
        return $this->hasMany(Policy::class);
    }

    /**
     * Get the users that belong to this role.
     *
     * @return BelongsToMany<User, $this>
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
