<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Product;
use App\Models\Snackware;

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

    /**
     * @param  array<string, mixed>  $data
     */
    public function changeProducts(array $data): Snackware
    {
        $products = $data['products'] ?? [];

        $this->snackware->products()->sync($products);

        // Derived data column updates
        $this->snackware->update([
            '__product_count' => count($products),
            '__wholesale_from' => Product::whereIn('id', $products)->min('__cost_per_unit'),
            '__wholesale_to' => Product::whereIn('id', $products)->max('__cost_per_unit'),
        ]);

        return $this->snackware;
    }

    public function destroy(): void
    {
        $this->snackware->delete();
    }
}
