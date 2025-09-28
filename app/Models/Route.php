<?php

declare(strict_types=1);

namespace App\Models;

use App\Casts\ScheduleCast;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Route extends Model
{
    use HasUlids;

    /**
     * Get the territory that owns this route.
     *
     * @return BelongsTo<Territory, $this>
     */
    public function territory(): BelongsTo
    {
        return $this->belongsTo(Territory::class);
    }

    /**
     * Get the operator that owns this route.
     *
     * @return BelongsTo<Operator, $this>
     */
    public function operator(): BelongsTo
    {
        return $this->belongsTo(Operator::class);
    }

    /**
     * Get the sites for this route.
     *
     * @return HasMany<Site, $this>
     */
    public function sites(): HasMany
    {
        return $this->hasMany(Site::class);
    }

    /**
     * Get the runs for this route.
     *
     * @return HasMany<Run, $this>
     */
    public function runs(): HasMany
    {
        return $this->hasMany(Run::class);
    }

    protected function casts(): array
    {
        return [
            'schedule' => ScheduleCast::class,
            'closed_at' => 'datetime',
            'skipped_until' => 'datetime',
        ];
    }
}
