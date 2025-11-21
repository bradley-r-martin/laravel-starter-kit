<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Session;

final class Snackware extends Model
{
    use HasUlids;

    protected $table = 'snackware';

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeOwned(Builder $query): Builder
    {
        return $query->where('territory_id', Session::get('selected_territory'));
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeFilterSortBy(Builder $query, string $sort): Builder
    {
        return match ($sort) {
            'type' => $query->orderBy('type', 'asc'),
            'price' => $query->orderBy('price', 'desc'),
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
            default => $query->whereNull('closed_at'),
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
     * Get the territory that owns this snackware.
     *
     * @return BelongsTo<Territory, $this>
     */
    public function territory(): BelongsTo
    {
        return $this->belongsTo(Territory::class);
    }

    /**
     * Get the operator that owns this snackware.
     *
     * @return BelongsTo<Operator, $this>
     */
    public function operator(): BelongsTo
    {
        return $this->belongsTo(Operator::class);
    }

    /**
     * Get the products for this snackware.
     *
     * @return BelongsToMany<Product, $this>
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_snackware', 'snackware_id', 'product_id');
    }

    /**
     * Get the placements for this snackware.
     *
     * @return HasMany<Placement, $this>
     */
    public function placements(): HasMany
    {
        return $this->hasMany(Placement::class);
    }

    /**
     * Get the resupplies for this snackware.
     *
     * @return HasMany<Resupply, $this>
     */
    public function resupplies(): HasMany
    {
        return $this->hasMany(Resupply::class);
    }

    /**
     * Get the transactions for this snackware.
     *
     * @return HasMany<Transaction, $this>
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
