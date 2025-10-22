<?php

declare(strict_types=1);

namespace App\Models;

use App\Casts\FileCast;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 */
final class Product extends Model
{
    use HasUlids;

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeFilterSortBy(Builder $query, string $sort): Builder
    {

        return match ($sort) {
            'sku' => $query->orderBy('sku', 'asc'),
            'type' => $query->orderBy('product_type_id', 'asc'),
            'manufacturer' => $query->orderBy('__manufacturer_name', 'asc'),
            'price' => $query->orderBy('price', 'asc'),
            'rebate' => $query->orderBy('rebate', 'asc'),
            'royalty' => $query->orderBy('royalty', 'asc'),
            'units' => $query->orderBy('units', 'asc'),
            'cost' => $query->orderBy('cost', 'asc'),
            'created_at' => $query->orderBy('created_at', 'asc'),
            default => $query->orderBy('name', 'asc'),
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
     * Get the product type for this product.
     *
     * @return BelongsTo<ProductType, $this>
     */
    public function productType(): BelongsTo
    {
        return $this->belongsTo(ProductType::class);
    }

    /**
     * Get the manufacturer for this product.
     *
     * @return BelongsTo<Manufacturer, $this>
     */
    public function manufacturer(): BelongsTo
    {
        return $this->belongsTo(Manufacturer::class);
    }

    /**
     * Get the snackware for this product.
     *
     * @return BelongsToMany<Snackware, $this>
     */
    public function snackware(): BelongsToMany
    {
        return $this->belongsToMany(Snackware::class, 'product_snackware', 'product_id', 'snackware_id');
    }

    /**
     * Get the expense items for this product.
     *
     * @return HasMany<ExpenseItem, $this>
     */
    public function expenseItems(): HasMany
    {
        return $this->hasMany(ExpenseItem::class);
    }

    protected function casts(): array
    {
        return [
            'units' => 'integer',
            'cost' => 'integer',
            'price' => 'integer',
            'rebate' => 'decimal:2',
            'royalty' => 'decimal:2',
            'closed_at' => 'datetime',
            'avatar' => FileCast::class,
        ];
    }
}
