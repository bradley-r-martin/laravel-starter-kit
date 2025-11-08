<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 */
final class ProductType extends Model
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
            'products_count' => $query->orderBy('__products_count', 'desc'),
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
            ->where('name', 'like', "%{$search}%")
        ));
    }

    /**
     * Get the products for this product type.
     *
     * @return HasMany<Product, $this>
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Get the placements for this product type.
     *
     * @return BelongsToMany<Placement, $this>
     */
    public function placements(): BelongsToMany
    {
        return $this->belongsToMany(Placement::class, 'placement_proportions', 'product_type_id', 'placement_id')
            ->withPivot('proportion');
    }

    protected function casts(): array
    {
        return [
            'closed_at' => 'datetime',
        ];
    }
}
