<?php

declare(strict_types=1);

namespace App\Models;

use App\Casts\AddressCast;
use App\Casts\FileCast;
use App\Casts\PhoneCast;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use NotificationChannels\WebPush\HasPushSubscriptions;

/**
 * @property string $id
 */
final class User extends Authenticatable implements MustVerifyEmail
{
    use HasPushSubscriptions;
    use HasUlids;
    use Notifiable;

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeFilterSortBy(Builder $query, string $sort): Builder
    {
        return match ($sort) {
            'email' => $query->orderBy('email', 'asc'),
            'role' => $query->orderBy('role_id', 'asc'),
            'operator' => $query->orderBy('operator_id', 'asc'),
            'last_login_at' => $query->orderBy('__last_login_at', 'desc'),
            'created_at' => $query->orderBy('created_at', 'asc'),
            default => $query->orderBy('first_name', 'asc'),
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
            default => $query->whereNull('closed_at')
        };
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeFilterBySearch(Builder $query, ?string $search): Builder
    {
        return $query->when($search, fn (Builder $q) => $q->where(fn (Builder $q) => $q
            ->where('first_name', 'like', "%{$search}%")
            ->orWhere('last_name', 'like', "%{$search}%")
            ->orWhere('email', 'like', "%{$search}%")
        ));
    }

    /**
     * Get the operator that owns this user.
     *
     * @return BelongsTo<Operator, $this>
     */
    public function operator(): BelongsTo
    {
        return $this->belongsTo(Operator::class);
    }

    /**
     * Get the role for this user.
     *
     * @return BelongsTo<Role, $this>
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get the contacts for this user.
     *
     * @return HasMany<Contact, $this>
     */
    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class);
    }

    /**
     * Get the transactions for this user.
     *
     * @return HasMany<Transaction, $this>
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Get the policies for this user through their role.
     *
     * @return HasMany<Policy, $this>
     */
    public function policies(): HasMany
    {
        return $this->hasMany(Policy::class, 'role_id', 'role_id');
    }

    /**
     * Check if the user is allowed to perform an action.
     */
    public function allowed(string $ability): bool
    {
        $policies = $this->policies()->get();
        $namespaces = [];

        /** @var Policy $policy */
        foreach ($policies as $policy) {
            $namespaces[] = $policy->policy.'@'.$policy->ability;
        }

        return in_array($ability, $namespaces, true);
    }

    protected function casts(): array
    {
        return [
            'avatar' => FileCast::class,
            'phone' => PhoneCast::class,
            'address' => AddressCast::class,
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'closed_at' => 'datetime',
            'suspended_at' => 'datetime',
        ];
    }
}
