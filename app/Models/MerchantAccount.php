<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class MerchantAccount extends Model
{
    use HasUlids;

    /**
     * Get the operator that owns this merchant account.
     */
    public function operator(): BelongsTo
    {
        return $this->belongsTo(Operator::class);
    }

    /**
     * Get the territories for this merchant account.
     */
    public function territories(): HasMany
    {
        return $this->hasMany(Territory::class);
    }

    /**
     * Get the transactions for this merchant account.
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    protected function casts(): array
    {
        return [
            'credentials' => 'encrypted:array',
        ];
    }
}
