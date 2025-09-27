<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Route extends Model
{
    use HasUlids;

    /**
     * Get the territory that owns this route.
     */
    public function territory(): BelongsTo
    {
        return $this->belongsTo(Territory::class);
    }

    /**
     * Get the operator that owns this route.
     */
    public function operator(): BelongsTo
    {
        return $this->belongsTo(Operator::class);
    }

    /**
     * Get the sites for this route.
     */
    public function sites(): HasMany
    {
        return $this->hasMany(Site::class);
    }

    /**
     * Get the runs for this route.
     */
    public function runs(): HasMany
    {
        return $this->hasMany(Run::class);
    }

    protected function casts(): array
    {
        return [
            'closed_at' => 'datetime',
            'skipped_until' => 'datetime',
        ];
    }
}
