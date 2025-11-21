<?php

declare(strict_types=1);

namespace App\Models;

use App\Casts\ScheduleCast;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Session;

final class Route extends Model
{
    use HasUlids;

    /**
     * @param  Builder<self>  $query
     * @return Builder<self>
     */
    public function scopeOwned(Builder $query): Builder
    {
        return $query->where('territory_id', Session::get('selected_territory'));
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
