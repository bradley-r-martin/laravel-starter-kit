<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class ProductType extends Model
{
    use HasUlids;

    /**
     * Get the products for this product type.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Get the placements for this product type.
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
