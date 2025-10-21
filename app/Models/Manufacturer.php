<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 */
final class Manufacturer extends Model
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
     * Get the products for this manufacturer.
     *
     * @return HasMany<Product, $this>
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    protected function casts(): array
    {
        return [
            'closed_at' => 'datetime',
        ];
    }
}
