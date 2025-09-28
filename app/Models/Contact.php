<?php

declare(strict_types=1);

namespace App\Models;

use App\Casts\PhoneCast;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class Contact extends Model
{
    use HasUlids;

    /**
     * Get the operator that owns this contact.
     *
     * @return BelongsTo<Operator, $this>
     */
    public function operator(): BelongsTo
    {
        return $this->belongsTo(Operator::class);
    }

    /**
     * Get the territory that owns this contact.
     *
     * @return BelongsTo<Territory, $this>
     */
    public function territory(): BelongsTo
    {
        return $this->belongsTo(Territory::class);
    }

    /**
     * Get the site that owns this contact.
     *
     * @return BelongsTo<Site, $this>
     */
    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    protected function casts(): array
    {
        return [
            'phone' => PhoneCast::class,
            'closed_at' => 'datetime',
        ];
    }
}
