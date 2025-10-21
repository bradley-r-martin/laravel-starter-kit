<?php

declare(strict_types=1);

namespace App\Models;

use App\Casts\AddressCast;
use App\Casts\EntityCast;
use App\Casts\PhoneCast;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Operator extends Model
{
    use HasUlids;

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
     * Get the merchant accounts for this operator.
     *
     * @return HasMany<MerchantAccount, $this>
     */
    public function merchantAccounts(): HasMany
    {
        return $this->hasMany(MerchantAccount::class);
    }

    /**
     * Get the territories for this operator.
     *
     * @return HasMany<Territory, $this>
     */
    public function territories(): HasMany
    {
        return $this->hasMany(Territory::class);
    }

    /**
     * Get the users for this operator.
     *
     * @return HasMany<User, $this>
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get the routes for this operator.
     *
     * @return HasMany<Route, $this>
     */
    public function routes(): HasMany
    {
        return $this->hasMany(Route::class);
    }

    /**
     * Get the sites for this operator.
     *
     * @return HasMany<Site, $this>
     */
    public function sites(): HasMany
    {
        return $this->hasMany(Site::class);
    }

    /**
     * Get the contacts for this operator.
     *
     * @return HasMany<Contact, $this>
     */
    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class);
    }

    /**
     * Get the snackware for this operator.
     *
     * @return HasMany<Snackware, $this>
     */
    public function snackware(): HasMany
    {
        return $this->hasMany(Snackware::class);
    }

    /**
     * Get the QR codes for this operator.
     *
     * @return HasMany<QrCode, $this>
     */
    public function qrCodes(): HasMany
    {
        return $this->hasMany(QrCode::class);
    }

    /**
     * Get the placements for this operator.
     *
     * @return HasMany<Placement, $this>
     */
    public function placements(): HasMany
    {
        return $this->hasMany(Placement::class);
    }

    /**
     * Get the runs for this operator.
     *
     * @return HasMany<Run, $this>
     */
    public function runs(): HasMany
    {
        return $this->hasMany(Run::class);
    }

    /**
     * Get the resupplies for this operator.
     *
     * @return HasMany<Resupply, $this>
     */
    public function resupplies(): HasMany
    {
        return $this->hasMany(Resupply::class);
    }

    /**
     * Get the transactions for this operator.
     *
     * @return HasMany<Transaction, $this>
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Get the expenses for this operator.
     *
     * @return HasMany<Expense, $this>
     */
    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    protected function casts(): array
    {
        return [
            'address' => AddressCast::class,
            'phone' => PhoneCast::class,
            'entity' => EntityCast::class,
            'closed_at' => 'datetime',
            'suspended_at' => 'datetime',
        ];
    }
}
