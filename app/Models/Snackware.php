<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Snackware extends Model
{
    use HasUlids;

    /**
     * Get the territory that owns this snackware.
     */
    public function territory(): BelongsTo
    {
        return $this->belongsTo(Territory::class);
    }

    /**
     * Get the operator that owns this snackware.
     */
    public function operator(): BelongsTo
    {
        return $this->belongsTo(Operator::class);
    }

    /**
     * Get the products for this snackware.
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_snackware', 'snackware_id', 'product_id');
    }

    /**
     * Get the placements for this snackware.
     */
    public function placements(): HasMany
    {
        return $this->hasMany(Placement::class);
    }

    /**
     * Get the resupplies for this snackware.
     */
    public function resupplies(): HasMany
    {
        return $this->hasMany(Resupply::class);
    }

    /**
     * Get the transactions for this snackware.
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'closed_at' => 'datetime',
        ];
    }
}
