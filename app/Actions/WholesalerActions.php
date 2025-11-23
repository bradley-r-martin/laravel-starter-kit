<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Wholesaler;

final class WholesalerActions
{
    public Wholesaler $wholesaler;

    public function __construct(
        Wholesaler|string $wholesaler,
    ) {
        if (is_string($wholesaler)) {
            /** @var Wholesaler $wholesaler */
            $wholesaler = Wholesaler::findOrFail($wholesaler);
        }
        $this->wholesaler = $wholesaler;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public static function create(array $data): Wholesaler
    {
        return Wholesaler::create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(array $data): Wholesaler
    {
        $this->wholesaler->update($data);

        return $this->wholesaler;
    }

    public function close(): Wholesaler
    {
        $this->wholesaler->update([
            'closed_at' => now(),
        ]);

        return $this->wholesaler;
    }

    public function reopen(): Wholesaler
    {
        $this->wholesaler->update([
            'closed_at' => null,
        ]);

        return $this->wholesaler;
    }

    public function destroy(): void
    {
        $this->wholesaler->delete();
    }
}
