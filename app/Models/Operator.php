<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Operator extends Model
{
    use HasUlids;

    /**
     * Get the merchant accounts for this operator.
     */
    public function merchantAccounts(): HasMany
    {
        return $this->hasMany(MerchantAccount::class);
    }

    /**
     * Get the territories for this operator.
     */
    public function territories(): HasMany
    {
        return $this->hasMany(Territory::class);
    }

    /**
     * Get the users for this operator.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get the routes for this operator.
     */
    public function routes(): HasMany
    {
        return $this->hasMany(Route::class);
    }

    /**
     * Get the sites for this operator.
     */
    public function sites(): HasMany
    {
        return $this->hasMany(Site::class);
    }

    /**
     * Get the contacts for this operator.
     */
    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class);
    }

    /**
     * Get the snackware for this operator.
     */
    public function snackware(): HasMany
    {
        return $this->hasMany(Snackware::class);
    }

    /**
     * Get the QR codes for this operator.
     */
    public function qrCodes(): HasMany
    {
        return $this->hasMany(QrCode::class);
    }

    /**
     * Get the placements for this operator.
     */
    public function placements(): HasMany
    {
        return $this->hasMany(Placement::class);
    }

    /**
     * Get the runs for this operator.
     */
    public function runs(): HasMany
    {
        return $this->hasMany(Run::class);
    }

    /**
     * Get the resupplies for this operator.
     */
    public function resupplies(): HasMany
    {
        return $this->hasMany(Resupply::class);
    }

    /**
     * Get the transactions for this operator.
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Get the expenses for this operator.
     */
    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    protected function casts(): array
    {
        return [
            'address' => 'array',
            'phone' => 'array',
            'entity' => 'array',
            'closed_at' => 'datetime',
            'suspended_at' => 'datetime',
        ];
    }
}
