<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class Transaction extends Model
{
    use HasUlids;

    /**
     * Get the customer for this transaction.
     *
     * @return BelongsTo<Customer, $this>
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the operator for this transaction.
     *
     * @return BelongsTo<Operator, $this>
     */
    public function operator(): BelongsTo
    {
        return $this->belongsTo(Operator::class);
    }

    /**
     * Get the territory for this transaction.
     *
     * @return BelongsTo<Territory, $this>
     */
    public function territory(): BelongsTo
    {
        return $this->belongsTo(Territory::class);
    }

    /**
     * Get the site for this transaction.
     *
     * @return BelongsTo<Site, $this>
     */
    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    /**
     * Get the placement for this transaction.
     *
     * @return BelongsTo<Placement, $this>
     */
    public function placement(): BelongsTo
    {
        return $this->belongsTo(Placement::class);
    }

    /**
     * Get the snackware for this transaction.
     *
     * @return BelongsTo<Snackware, $this>
     */
    public function snackware(): BelongsTo
    {
        return $this->belongsTo(Snackware::class);
    }

    /**
     * Get the QR code for this transaction.
     *
     * @return BelongsTo<QrCode, $this>
     */
    public function qrCode(): BelongsTo
    {
        return $this->belongsTo(QrCode::class);
    }

    /**
     * Get the run for this transaction.
     *
     * @return BelongsTo<Run, $this>
     */
    public function run(): BelongsTo
    {
        return $this->belongsTo(Run::class);
    }

    /**
     * Get the resupply for this transaction.
     *
     * @return BelongsTo<Resupply, $this>
     */
    public function resupply(): BelongsTo
    {
        return $this->belongsTo(Resupply::class);
    }

    /**
     * Get the user for this transaction.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the merchant account for this transaction.
     *
     * @return BelongsTo<MerchantAccount, $this>
     */
    public function merchantAccount(): BelongsTo
    {
        return $this->belongsTo(MerchantAccount::class);
    }

    protected function casts(): array
    {
        return [
            'amount' => 'integer',
            'metadata' => 'array',
            'created_at' => 'datetime',
        ];
    }
}
