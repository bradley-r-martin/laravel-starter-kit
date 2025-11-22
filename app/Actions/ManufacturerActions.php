<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Manufacturer;

final class ManufacturerActions
{
    public Manufacturer $manufacturer;

    public function __construct(
        Manufacturer|string $manufacturer,
    ) {
        if (is_string($manufacturer)) {
            /** @var Manufacturer $manufacturer */
            $manufacturer = Manufacturer::findOrFail($manufacturer);
        }
        $this->manufacturer = $manufacturer;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public static function create(array $data): Manufacturer
    {
        return Manufacturer::create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(array $data): Manufacturer
    {
        $this->manufacturer->update($data);

        return $this->manufacturer;
    }

    public function close(): Manufacturer
    {
        $this->manufacturer->update([
            'closed_at' => now(),
        ]);

        return $this->manufacturer;
    }

    public function reopen(): Manufacturer
    {
        $this->manufacturer->update([
            'closed_at' => null,
        ]);

        return $this->manufacturer;
    }

    public function destroy(): void
    {
        $this->manufacturer->delete();
    }
}
