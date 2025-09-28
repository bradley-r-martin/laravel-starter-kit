<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Product extends Model
{
    use HasUlids;

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
        ];
    }
}
