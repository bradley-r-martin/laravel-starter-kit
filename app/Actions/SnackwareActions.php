<?php

declare(strict_types=1);

namespace App\Actions;

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

    public function destroy(): void
    {
        $this->snackware->delete();
    }

    public function attachProduct(string $productId): self
    {
        if (! $this->snackware->products()->where('product_id', $productId)->exists()) {
            $this->snackware->products()->attach($productId);
        }

        return $this;
    }

    public function detachProduct(string $productId): self
    {
        $this->snackware->products()->detach($productId);

        return $this;
    }
}
