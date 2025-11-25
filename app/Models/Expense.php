<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 */
final class Expense extends Model
{
    use HasUlids;

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeFilterSortBy(Builder $query, string $sort): Builder
    {
        return match ($sort) {
            'invoice_no' => $query->orderBy('invoice_no', 'asc'),
            'invoice_date' => $query->orderBy('invoice_date', 'asc'),
            'wholesaler' => $query->orderBy('__wholesaler_name', 'asc'),
            'cost' => $query->orderBy('__cost', 'asc'),
            'rebate' => $query->orderBy('__rebate', 'asc'),
            'royalty' => $query->orderBy('__royalty', 'asc'),
            'completed_at' => $query->orderBy('completed_at', 'asc'),
            'created_at' => $query->orderBy('created_at', 'asc'),
            default => $query->orderBy('invoice_no', 'asc'),
        };
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeFilterByStatus(Builder $query, string $status): Builder
    {
        return match ($status) {
            'pending' => $query->whereNull('completed_at'),
            'completed' => $query->whereNotNull('completed_at'),
            default => $query->whereNull('completed_at')
        };
    }

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeFilterBySearch(Builder $query, ?string $search): Builder
    {
        return $query->when($search, fn (Builder $q) => $q->where(fn (Builder $q) => $q
            ->where('invoice_no', 'like', "%{$search}%")
            ->orWhere('__wholesaler_name', 'like', "%{$search}%")
        ));
    }

    /**
     * Get the operator for this expense.
     *
     * @return BelongsTo<Operator, $this>
     */
    public function operator(): BelongsTo
    {
        return $this->belongsTo(Operator::class);
    }

    /**
     * Get the wholesaler for this expense.
     *
     * @return BelongsTo<Wholesaler, $this>
     */
    public function wholesaler(): BelongsTo
    {
        return $this->belongsTo(Wholesaler::class);
    }

    /**
     * Get the expense items for this expense.
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
            'invoice_date' => 'datetime',
            'completed_at' => 'datetime',
            'pages' => 'array',
        ];
    }
}
