<?php

declare(strict_types=1);

namespace App\Models;

use App\Casts\AddressCast;
use App\Casts\PhoneCast;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 */
final class Wholesaler extends Model
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
     * Get the expense items for this wholesaler.
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
            'phone' => PhoneCast::class,
            'address' => AddressCast::class,
        ];
    }
}
