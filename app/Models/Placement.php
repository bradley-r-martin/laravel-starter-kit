<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Placement extends Model
{
    use HasUlids;

    /**
     * Get the site that owns this placement.
     */
    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    /**
     * Get the operator that owns this placement.
     */
    public function operator(): BelongsTo
    {
        return $this->belongsTo(Operator::class);
    }

    /**
     * Get the territory that owns this placement.
     */
    public function territory(): BelongsTo
    {
        return $this->belongsTo(Territory::class);
    }

    /**
     * Get the snackware for this placement.
     */
    public function snackware(): BelongsTo
    {
        return $this->belongsTo(Snackware::class);
    }

    /**
     * Get the QR code for this placement.
     */
    public function qrCode(): BelongsTo
    {
        return $this->belongsTo(QrCode::class);
    }

    /**
     * Get the product types for this placement.
     */
    public function productTypes(): BelongsToMany
    {
        return $this->belongsToMany(ProductType::class, 'placement_proportions', 'placement_id', 'product_type_id')
            ->withPivot('proportion');
    }

    /**
     * Get the resupplies for this placement.
     */
    public function resupplies(): HasMany
    {
        return $this->hasMany(Resupply::class);
    }

    /**
     * Get the transactions for this placement.
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    protected function casts(): array
    {
        return [
            'closed_at' => 'datetime',
        ];
    }
}
