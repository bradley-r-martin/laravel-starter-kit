<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Operator;
use App\Models\Snackware;
use App\Models\Territory;

final class SnackwareActions
{
    public Snackware $snackware;

    public function __construct(
        Snackware|string $snackware,
    ) {
        if (is_string($snackware)) {
            /** @var Snackware $snackware */
            $snackware = Snackware::findOrFail($snackware);
        }
        $this->snackware = $snackware;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public static function create(array $data): Snackware
    {
        // Add denormalized fields
        if (isset($data['territory_id'])) {
            /** @var Territory $territory */
            $territory = Territory::findOrFail($data['territory_id']);
            $data['__territory_name'] = $territory->name;
        }

        if (isset($data['operator_id'])) {
            /** @var Operator $operator */
            $operator = Operator::findOrFail($data['operator_id']);
            $data['__operator_name'] = $operator->name;
        }

        return Snackware::create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(array $data): Snackware
    {
        $this->snackware->update($data);

        return $this->snackware;
    }

    public function close(): Snackware
    {
        $this->snackware->update([
            'closed_at' => now(),
        ]);

        return $this->snackware;
    }

    public function reopen(): Snackware
    {
        $this->snackware->update([
            'closed_at' => null,
        ]);

        return $this->snackware;
    }

    public function destroy(): void
    {
        $this->snackware->delete();
    }
}
